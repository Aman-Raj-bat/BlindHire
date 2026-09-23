import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import type { NetworkConfig } from './config.js';

export type BlindHireProviders = {
  privateStateProvider: any;
  publicDataProvider: any;
  zkConfigProvider: any;
  proofProvider: any;
  walletProvider: any;
  midnightProvider: any;
};

export function buildProviders(
  wallet: any,
  zkConfigPath: string,
  config: NetworkConfig,
  accountId = 'blindhire-default-account',
): BlindHireProviders {
  const walletProvider = wallet.walletProvider ?? wallet;
  const midnightProvider = wallet.midnightProvider ?? wallet;

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);

  return {
    privateStateProvider: levelPrivateStateProvider({
      midnightDbName: 'blindhire-level-db',
      privateStoragePasswordProvider: () => 'BlindHire!Super#Secret$Key99',
      accountId,
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider,
  };
}
