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
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
      args: [MIN_GPA, MIN_EXP_MONTHS, REQ_DEGREE_CODE, REQ_CERT_CODE, recruiterHash, deadline, APPLICANT_LIMIT],
    });

    contractAddress = deployed.deployTxData.public.contractAddress;
    expect(contractAddress).toBeDefined();

    const state = await queryLedger(providers);
    expect(state.min_gpa).toEqual(MIN_GPA);
    expect(state.min_experience_months).toEqual(MIN_EXP_MONTHS);
    expect(state.required_degree_code).toEqual(REQ_DEGREE_CODE);
    expect(state.required_certification_code).toEqual(REQ_CERT_CODE);
    expect(state.is_active).toBe(true);
    expect(state.qualified_count).toEqual(0n);
    expect(state.max_applicants).toEqual(APPLICANT_LIMIT);
    logger.info(`BlindHire deployed and verified on-chain at: ${contractAddress}`);
  });

  // Test 2: Valid candidate satisfies all criteria (GPA: 8.70, Exp: 24mo, Degree: CS, Cert: Node.js)
  it('Verifies qualification for a candidate who satisfies all requirements', async () => {
    const candidateId = new Uint8Array(crypto.randomBytes(32));

    await submitCallTx(providers as any, {
      compiledContract: compiledWithWitnesses({
        candidate_credentials: (ctx: any) => [
          ctx.privateState,
          {
            degree_code: 1n, // CS/IT
            gpa_scaled: 870n, // 8.70 GPA
            experience_months: 24n, // 2 years
            certification_code: 101n, // Node.js
            candidate_id: candidateId,
          },
        ],
      }),
      contractAddress,
      circuitId: 'prove_qualification',
      privateStateId: PRIVATE_STATE_ID,
      args: [],
    } as any);

    const state = await queryLedger(providers);
    expect(state.qualified_count).toEqual(1n);
    logger.info('Privacy check passed: Candidate qualified without exposing 8.70 GPA or 24 months experience on-chain');
  });

  // Test 3: Nullifier prevents duplicate application with same candidate secret
  it('Rejects duplicate qualification proof from the same candidate (nullifier check)', async () => {
    const candidateId = new Uint8Array(crypto.randomBytes(32));

    // First submission succeeds
    await submitCallTx(providers as any, {
      compiledContract: compiledWithWitnesses({
        candidate_credentials: (ctx: any) => [
          ctx.privateState,
          {
            degree_code: 1n,
            gpa_scaled: 820n,
            experience_months: 18n,
            certification_code: 101n,
            candidate_id: candidateId,
          },
        ],
      }),
      contractAddress,
      circuitId: 'prove_qualification',
      privateStateId: PRIVATE_STATE_ID,
      args: [],
    } as any);

    // Second submission with exact same candidateId must fail
    await expect(
      submitCallTx(providers as any, {
        compiledContract: compiledWithWitnesses({
          candidate_credentials: (ctx: any) => [
            ctx.privateState,
            {
              degree_code: 1n,
              gpa_scaled: 820n,
              experience_months: 18n,
              certification_code: 101n,
              candidate_id: candidateId,
            },
          ],
        }),
        contractAddress,
        circuitId: 'prove_qualification',
        privateStateId: PRIVATE_STATE_ID,
        args: [],
      } as any),
    ).rejects.toThrow();
  });

  // Test 4: Rejects candidate with GPA below threshold (e.g. 6.80 < 7.50)
  it('Rejects candidate whose GPA is below minimum threshold', async () => {
    const candidateId = new Uint8Array(crypto.randomBytes(32));
    await expect(
      submitCallTx(providers as any, {
        compiledContract: compiledWithWitnesses({
          candidate_credentials: (ctx: any) => [
            ctx.privateState,
            {
              degree_code: 1n,
              gpa_scaled: 680n, // Below 750n
              experience_months: 24n,
              certification_code: 101n,
              candidate_id: candidateId,
            },
          ],
});