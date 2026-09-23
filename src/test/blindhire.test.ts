// vitest globals enabled
import { WebSocket } from 'ws';
import crypto from 'crypto';
import pino from 'pino';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract, submitCallTx, type DeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { type EnvironmentConfiguration, waitForFunds, MidnightWalletProvider } from '@midnight-ntwrk/testkit-js';
import { getConfig } from '../config.js';
import { buildProviders, type BlindHireProviders } from '../providers.js';
import {
  CompiledBlindHire,
  BaseCompiledBlindHire,
  Contract,
  ledger,
  pureCircuits,
  zkConfigPath,
} from '../../contracts/index.js';

// @ts-expect-error WebSocket global
globalThis.WebSocket = WebSocket;

const ALICE_LOCAL_SEED = '0000000000000000000000000000000000000000000000000000000000000001';
const PRIVATE_STATE_ID = 'CandidatePrivateState';
const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const network = process.env.MIDNIGHT_NETWORK ?? 'local';

// Job Requirements for Testing:
// - GPA >= 7.50 (750n)
// - Experience >= 12 months (12n)
// - Degree: Computer Science / IT (1n)
// - Certification: Node.js (101n)
const MIN_GPA = 750n;
const MIN_EXP_MONTHS = 12n;
const REQ_DEGREE_CODE = 1n;
const REQ_CERT_CODE = 101n;
const APPLICANT_LIMIT = 50n;

function resolveSecret() {
  if (network === 'local') return { kind: 'seed' as const, value: ALICE_LOCAL_SEED };
  const upper = network.toUpperCase();
  const mnemonic = process.env[`MIDNIGHT_${upper}_MNEMONIC`]?.trim().replace(/\s+/g, ' ');
  const seed = process.env[`MIDNIGHT_${upper}_SEED`]?.trim();
  if (mnemonic && seed) throw new Error('Set only one of mnemonic or seed.');
  if (mnemonic) return { kind: 'mnemonic' as const, value: mnemonic };
  if (seed) return { kind: 'seed' as const, value: seed };
  throw new Error(`Set MIDNIGHT_${upper}_MNEMONIC or MIDNIGHT_${upper}_SEED`);
}

/** Helper: create a per-call compiled contract with specified candidate witnesses */
function compiledWithWitnesses(witnesses: {
  candidate_credentials?: (ctx: any) => [
    any,
    {
      degree_code: bigint;
      gpa_scaled: bigint;
      experience_months: bigint;
      certification_code: bigint;
      candidate_id: Uint8Array;
    },
  ];
  recruiter_secret_key?: (ctx: any) => [any, Uint8Array];
}) {
  return (CompiledContract.withWitnesses as any)(BaseCompiledBlindHire, {
    candidate_credentials:
      witnesses.candidate_credentials ??
      ((ctx: any) => [
        ctx.privateState,
        {
          degree_code: REQ_DEGREE_CODE,
          gpa_scaled: MIN_GPA,
          experience_months: MIN_EXP_MONTHS,
          certification_code: REQ_CERT_CODE,
          candidate_id: new Uint8Array(32),
        },
      ]),
    recruiter_secret_key:
      witnesses.recruiter_secret_key ?? ((ctx: any) => [ctx.privateState, new Uint8Array(32)]),
  });
}

describe(`BlindHire Screening Contract (${network})`, () => {
  let wallet: any;
  let providers: BlindHireProviders;
  let contractAddress: ContractAddress;
  let recruiterSk: Uint8Array;
  let recruiterHash: Uint8Array;

  const config = getConfig();
  const secret = resolveSecret();
  const isRemote = config.faucet !== '';

  async function queryLedger(p: BlindHireProviders) {
    const state = await p.publicDataProvider.queryContractState(contractAddress);
    expect(state).not.toBeNull();
    return ledger(state!.data);
  }

  beforeAll(async () => {
    setNetworkId(config.networkId as any);
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

    wallet = await MidnightWalletProvider.build(logger, envConfig, secret.value);
    await wallet.start?.();

    if (isRemote) {
      const balance = await waitForFunds(wallet, envConfig, true, wallet.unshieldedKeystore);
      logger.info(`Funds ready: ${balance} DUST`);
    }

    providers = buildProviders(wallet, zkConfigPath, config);

    recruiterSk = new Uint8Array(crypto.randomBytes(32));
    recruiterHash =
      typeof (pureCircuits as any)?.recruiterPublicKey === 'function'
        ? (pureCircuits as any).recruiterPublicKey(recruiterSk)
        : new Uint8Array(crypto.randomBytes(32));

    logger.info('BlindHire test suite initialized');
  });

  afterAll(async () => {
    if (wallet) await wallet.stop?.();
  });

  // Test 1: Deployment with initial screening requirements
  it('Deploys the BlindHire screening contract with initial job requirements', async () => {
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);
    const deployed: DeployedContract<Contract> = await deployContract<Contract>(providers, {
      compiledContract: CompiledBlindHire,
});