import { WebSocket } from 'ws';
import pino from 'pino';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { getConfig } from '../src/config.js';
import { MidnightWalletProvider } from '../src/wallet.js';

// @ts-expect-error WebSocket global
globalThis.WebSocket = WebSocket;

const logger = pino({ level: 'info' });
const config = getConfig();
setNetworkId(config.networkId as any);

const envConfig: any = {
  walletNetworkId: config.networkId,
  networkId: config.networkId,
  indexer: config.indexer,
  indexerWS: config.indexerWS,
  node: config.node,
  nodeWS: config.nodeWS,
  faucet: config.faucet,
  proofServer: config.proofServer,
};

const wallet = await MidnightWalletProvider.build(
  logger,
  envConfig,
  { kind: 'seed', value: '0000000000000000000000000000000000000000000000000000000000000001' },
);

await wallet.start();
console.log('[BlindHire] Dev wallet initialized.');
process.exit(0);
