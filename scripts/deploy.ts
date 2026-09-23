import { WebSocket } from 'ws';
import crypto from 'crypto';
import pino from 'pino';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract, type DeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { getConfig } from '../src/config.js';
import { MidnightWalletProvider, syncWallet } from '../src/wallet.js';
import { buildProviders } from '../src/providers.js';
import { CompiledBlindHire, Contract, pureCircuits, zkConfigPath } from '../contracts/index.js';

// @ts-expect-error WebSocket global
globalThis.WebSocket = WebSocket;

const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const network = process.env.MIDNIGHT_NETWORK ?? 'preprod';
const config = getConfig();

async function main() {
  logger.info(`Starting BlindHire contract deployment to network: ${network}`);
  setNetworkId(config.networkId as any);

  const mnemonic = process.env.MIDNIGHT_PREPROD_MNEMONIC?.trim();
  const seed = process.env.MIDNIGHT_PREPROD_SEED?.trim() ?? '0000000000000000000000000000000000000000000000000000000000000001';

  const envConfig: EnvironmentConfiguration = {
    walletNetworkId: config.networkId as any,
    networkId: config.networkId as any,
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
    mnemonic ? { kind: 'mnemonic', value: mnemonic } : { kind: 'seed', value: seed },
  );

  await wallet.start();
  await syncWallet(logger, wallet.wallet, 30000);

  const providers = buildProviders(wallet, zkConfigPath, config);

  // Generate recruiter keypair
  const recruiterSk = new Uint8Array(crypto.randomBytes(32));
  const recruiterHash =
    typeof (pureCircuits as any)?.recruiterPublicKey === 'function'
      ? (pureCircuits as any).recruiterPublicKey(recruiterSk)
      : new Uint8Array(crypto.randomBytes(32));

  // Initial requirements:
  // - GPA >= 7.50 (750n)
  // - Experience >= 12 months (12n)
  // - Degree: Computer Science / IT (1n)
  // - Certification: Node.js (101n)
  // - Deadline: 90 days from now
  // - Limit: 200 qualified candidates
  const initialMinGpa = 750n;
  const initialMinExp = 12n;
  const initialDegree = 1n;
  const initialCert = 101n;
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60);
  const applicantLimit = 200n;

  logger.info('Deploying BlindHire smart contract...');
  const deployed: DeployedContract<Contract> = await deployContract<Contract>(providers, {
    compiledContract: CompiledBlindHire,
    privateStateId: 'BlindHireDeployerState',
    initialPrivateState: {},
    args: [initialMinGpa, initialMinExp, initialDegree, initialCert, recruiterHash, deadline, applicantLimit],
  });

  const contractAddress = deployed.deployTxData.public.contractAddress;
  logger.info(`=======================================================`);
  logger.info(`BlindHire Contract Deployed Successfully!`);
  logger.info(`Contract Address: ${contractAddress}`);
  logger.info(`Recruiter Secret: ${Buffer.from(recruiterSk).toString('hex')}`);
  logger.info(`Explorer: https://${network}.midnightexplorer.com/contracts/${contractAddress}`);
  logger.info(`=======================================================`);

  await wallet.stop();
}

main().catch((err) => {
  logger.error(err, 'Deployment failed');
  process.exit(1);
});
