import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export {
  Contract,
  ledger,
  pureCircuits,
  type Ledger,
  type ImpureCircuits,
  type PureCircuits,
  type Witnesses,
} from './managed/blindhire/contract/index.js';
import { Contract } from './managed/blindhire/contract/index.js';

const currentDir = path.resolve(fileURLToPath(import.meta.url), '..');
export const zkConfigPath = path.resolve(currentDir, 'managed', 'blindhire');

// Base contract for deployment & per-call witness injection
const _base = CompiledContract.make('BlindHire', Contract);
export const BaseCompiledBlindHire = (CompiledContract.withCompiledFileAssets as any)(_base, zkConfigPath);

export const CompiledBlindHire = (CompiledContract.withWitnesses as any)(BaseCompiledBlindHire, {
  candidate_credentials: (ctx: any) => [ctx.privateState, {
    degree_code: 0n,
    gpa_scaled: 0n,
    experience_months: 0n,
    certification_code: 0n,
    candidate_id: new Uint8Array(32),
  }],
  recruiter_secret_key: (ctx: any) => [ctx.privateState, new Uint8Array(32)],
});
