import React, { useState } from 'react';
import { ExternalLink, Link as LinkIcon, RefreshCw, Save, Settings, Shield, WalletCards } from 'lucide-react';
import { storage } from '../lib/storage';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { DEFAULT_DEMO_CANDIDATE } from '../lib/mockData';

export const SettingsPage: React.FC = () => {
  const { network, connect, disconnect, isConnected, address, walletType } = useWallet();
  const { addToast } = useToast();

  const [contractAddress, setContractAddress] = useState(storage.getDeployedContractAddress());
  const [isResetting, setIsResetting] = useState(false);

  const handleSaveContract = (event: React.FormEvent) => {
    event.preventDefault();
    storage.setDeployedContractAddress(contractAddress.trim());
    addToast('success', 'Contract address saved', 'The active screening contract override was updated locally.');
  };

  const handleResetData = () => {
    if (!window.confirm('Reset all BlindHire data stored in this browser? This removes local jobs, applications, credentials, and the saved contract override.')) return;
    setIsResetting(true);
    localStorage.clear();
    storage.saveCandidateProfile(DEFAULT_DEMO_CANDIDATE);
    window.location.reload();
  };

  return (
    <div className="world-page">
      <div className="world-container max-w-5xl">
        <header className="world-page-header">
          <div>
            <p className="world-section-kicker">Control room / local configuration</p>
            <h1 className="world-page-title">Keep your<br />orbit intentional.</h1>
            <p className="world-page-description">
              Review the network you are using, keep contract references explicit, and reset browser-only demo state when you need a clean start.
            </p>
          </div>
          <span className="world-badge is-muted">{network || 'preprod'} network</span>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="world-card p-6 md:p-8" aria-labelledby="network-title">
            <div className="flex items-center gap-3 border-b border-[#e8e2d6] pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#86d8ef] text-[#11162b]"><Settings size={17} aria-hidden="true" /></span>
              <div>
                <p className="world-section-kicker !mb-1">01 / Network</p>
                <h2 id="network-title" className="world-card-title">Midnight network selection</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="border border-[#ff735280] bg-[#ff735214] p-4">
                <span className="font-mono-tech text-xs font-bold uppercase text-[#d94d35]">Preprod</span>
                <span className="mt-2 block text-xs leading-5 text-[#6e7488]">Active testnet target for wallet and deployment flows.</span>
              </div>
              <div className="border border-[#11162b24] bg-[#fffdf8b3] p-4 opacity-70">
                <span className="font-mono-tech text-xs font-bold uppercase text-[#11162b]">Preview</span>
                <span className="mt-2 block text-xs leading-5 text-[#6e7488]">Available as a network concept, not selected here.</span>
              </div>
              <div className="border border-[#11162b24] bg-[#fffdf8b3] p-4 opacity-70">
                <span className="font-mono-tech text-xs font-bold uppercase text-[#11162b]">Local</span>
                <span className="mt-2 block text-xs leading-5 text-[#6e7488]">Browser storage is local; wallet network remains explicit.</span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs">
              <a href="https://faucet.preprod.midnight.network/api/drips" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[#d94d35] hover:underline">
                Get Preprod DUST <ExternalLink size={13} aria-hidden="true" />
              </a>
              <a href="https://preprod.midnightexplorer.com" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[#6e7488] hover:text-[#11162b]">
                Open explorer <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
          </section>

          <section className="world-card-dark p-6 md:p-8" aria-labelledby="wallet-title">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c8ef83] text-[#11162b]"><WalletCards size={17} aria-hidden="true" /></span>
              <div>
                <p className="font-mono-tech text-[0.65rem] uppercase tracking-[0.1em] text-[#c8ef83]">02 / Wallet</p>
                <h2 id="wallet-title" className="mt-1 font-[Space_Grotesk] text-xl font-semibold tracking-[-0.05em] text-[#fffdf8]">Connection status</h2>
              </div>
            </div>
            <div className="mt-7 border-t border-[#ffffff24] pt-5">
              <span className={`world-badge ${isConnected ? 'is-good' : 'is-muted'}`}>{isConnected ? 'Connected' : 'Not connected'}</span>
              <p className="mt-4 break-all font-mono-tech text-xs leading-6 text-[#aab2ca]">{isConnected ? `${walletType ?? 'Midnight wallet'} · ${address ?? 'address unavailable'}` : 'Connect when a transaction or deployment needs approval.'}</p>
              {isConnected ? (
                <button type="button" onClick={disconnect} className="world-button-ghost mt-5 !border-[#ffffff38] !bg-transparent !text-[#fffdf8]">Disconnect</button>
              ) : (
                <button type="button" onClick={() => void connect('preprod')} className="world-button mt-5 !bg-[#ff7352] !text-[#11162b] !shadow-[5px_5px_0_#c8ef83]">Connect wallet</button>
              )}
            </div>
          </section>
        </div>

        <form onSubmit={handleSaveContract} className="world-card mt-5 p-6 md:p-8" aria-labelledby="contract-title">
          <div className="flex items-center gap-3 border-b border-[#e8e2d6] pb-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ff7352] text-[#11162b]"><LinkIcon size={17} aria-hidden="true" /></span>
            <div>
              <p className="world-section-kicker !mb-1">03 / Reference</p>
              <h2 id="contract-title" className="world-card-title">Active contract address override</h2>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#6e7488]">Used by contract-backed screening calls and ledger reads. This value is saved in this browser; changing it does not deploy or modify a contract.</p>
          <label className="mt-5 block">
            <span className="world-label">Contract address / optional</span>
            <input type="text" inputMode="text" placeholder="64-character hex address (e.g. 0x...)" value={contractAddress} onChange={(event) => setContractAddress(event.target.value)} className="world-input font-mono-tech" />
          </label>
          <button type="submit" className="world-button-ghost mt-5"><Save size={14} aria-hidden="true" /> Save address locally</button>
        </form>

        <section className="mt-5 border border-[#d94d354d] bg-[#ff735214] p-6 md:p-8" aria-labelledby="reset-title">
          <div className="flex items-start gap-3">
            <Shield size={19} className="mt-0.5 shrink-0 text-[#d94d35]" aria-hidden="true" />
            <div>
              <p className="world-section-kicker !mb-1 !text-[#d94d35]">04 / Destructive action</p>
              <h2 id="reset-title" className="font-[Space_Grotesk] text-xl font-semibold tracking-[-0.05em] text-[#11162b]">Reset browser state</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e7488]">Removes locally stored jobs, applications, credentials, and the contract override, then restores the default demo candidate. It does not erase anything from Midnight.</p>
              <button type="button" disabled={isResetting} onClick={handleResetData} className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[#d94d354d] bg-[#fffdf8b3] px-4 text-xs font-bold text-[#9b3625] transition-colors hover:bg-[#ff735233] disabled:opacity-50"><RefreshCw size={14} aria-hidden="true" /> Reset all local state</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
