import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createConnectedSession, type ConnectedSession } from '../lib/midnight';

export type WalletType = '1am' | 'lace' | 'nightly' | null;
export type WalletStatus = 'checking' | 'detected' | 'not-found';

export type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  walletType: WalletType;
  isConnecting: boolean;
  walletStatus: WalletStatus;
  session: ConnectedSession | null;
  connectionError: string | null;
  network: string;
  connect: (network?: string) => Promise<ConnectedSession | undefined>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('checking');
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>('preprod');
  const connectingRef = useRef(false);

  // Poll for injected Midnight wallets (1AM, Lace, Nightly)
  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      const w1am = (window as any).midnight?.['1am'];
      const wLace = (window as any).midnight?.mnLace;
      const wNightly = (window as any).midnight?.nightly;

      if (wLace) {
        setWalletType('lace');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (w1am) {
        setWalletType('1am');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (wNightly) {
        setWalletType('nightly');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }

      if (Date.now() - startedAt >= 5000) {
        setWalletStatus('not-found');
        clearInterval(id);
      }
    }, 300);

    return () => clearInterval(id);
  }, []);

  const connect = useCallback(async (targetNetwork = 'preprod') => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    setIsConnecting(true);
    setConnectionError(null);
    setNetwork(targetNetwork);

    try {
      const midnightObj = (window as any).midnight;
      const wallet =
        midnightObj?.mnLace ??
        midnightObj?.['1am'] ??
        midnightObj?.nightly;

      if (!wallet) {
        throw new Error(
          'No Midnight wallet detected. Please install the Lace or 1AM extension to connect to Midnight Preprod.',
        );
      }

      const api = await wallet.connect(targetNetwork);
      const sess = await createConnectedSession(api);
      setSession(sess);
      setAddress(sess.unshieldedAddress);
      setIsConnected(true);
      return sess;
    } catch (e: any) {
      console.error('Wallet connection failed:', e);
      let errorMsg = e?.message ?? String(e);
      if (errorMsg.includes('Wallet is syncing')) {
        errorMsg = 'Wallet is currently syncing — please wait for sync to complete in the extension.';
      } else if (errorMsg.includes('User rejected') || errorMsg.includes('declined')) {
        errorMsg = 'Wallet connection declined by user.';
      }
      setConnectionError(errorMsg);
      return undefined;
    } finally {
      connectingRef.current = false;
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setSession(null);
    setConnectionError(null);
    setWalletStatus('checking');
    setWalletType(null);

    // Re-check for wallet availability
    const startedAt = Date.now();
    const id = setInterval(() => {
      const wLace = (window as any).midnight?.mnLace;
      const w1am = (window as any).midnight?.['1am'];
      const wNightly = (window as any).midnight?.nightly;

      if (wLace) {
        setWalletType('lace');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (w1am) {
        setWalletType('1am');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (wNightly) {
        setWalletType('nightly');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }

      if (Date.now() - startedAt >= 3000) {
        setWalletStatus('not-found');
        clearInterval(id);
      }
    }, 200);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        walletType,
        isConnecting,
        walletStatus,
        session,
        connectionError,
        network,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
