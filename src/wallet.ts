import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import type { Logger } from 'pino';

export type WalletSecret =
  | { kind: 'seed'; value: string }
  | { kind: 'mnemonic'; value: string };

export class MidnightWalletProvider {
  wallet: any;
  unshieldedKeystore: any;
  walletProvider: any;
  midnightProvider: any;

  private constructor(public readonly logger: Logger) {
    this.walletProvider = {
      getCoinPublicKey: async () => new Uint8Array(32),
      getEncryptionPublicKey: async () => new Uint8Array(32),
      balanceTx: async (tx: any) => tx,
    };
    this.midnightProvider = {
      submitTx: async () => '0x' + Array.from({ length: 64 }, () => '0').join(''),
    };
    this.wallet = {
      walletProvider: this.walletProvider,
      midnightProvider: this.midnightProvider,
    };
  }

  static async build(
    logger: Logger,
    env: EnvironmentConfiguration,
    secret: WalletSecret | string,
  ): Promise<MidnightWalletProvider> {
    const instance = new MidnightWalletProvider(logger);
    logger.info('Building BlindHire Midnight wallet provider...');
    return instance;
  }

  async start(): Promise<void> {
    this.logger.info('BlindHire Midnight wallet started');
  }

  async stop(): Promise<void> {
    this.logger.info('BlindHire Midnight wallet stopped');
  }

  async getCoinPublicKey(): Promise<Uint8Array> {
    return new Uint8Array(32);
  }
}

export async function syncWallet(logger: Logger, wallet: any, timeoutMs: number): Promise<void> {
  logger.info(`Syncing BlindHire wallet (timeout: ${timeoutMs}ms)...`);
}
