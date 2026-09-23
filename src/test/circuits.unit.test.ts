// vitest globals enabled
import { WebSocket } from 'ws';
import crypto from 'crypto';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

// @ts-expect-error WebSocket global
globalThis.WebSocket = WebSocket;
setNetworkId('undeployed' as any);

import { pureCircuits, Contract } from '../../contracts/managed/blindhire/contract/index.js';

describe('BlindHire Zero-Knowledge Circuit Logic & Protocol Verification', () => {
  // Test 1: Deterministic recruiter public key derivation
  it('1. derives deterministic recruiter public key from secret key using persistentHash', () => {
    const sk = new Uint8Array(crypto.randomBytes(32));
    const pk1 = pureCircuits.recruiterPublicKey(sk);
    const pk2 = pureCircuits.recruiterPublicKey(sk);

    expect(pk1).toBeDefined();
    expect(pk1.length).toBe(32);
    expect(Buffer.from(pk1).toString('hex')).toEqual(Buffer.from(pk2).toString('hex'));
  });

  // Test 2: Unique anonymous nullifier generation
  it('2. generates distinct anonymous nullifiers for distinct candidate secrets (identity protection)', () => {
    const candidateId1 = new Uint8Array(crypto.randomBytes(32));
    const candidateId2 = new Uint8Array(crypto.randomBytes(32));

    const nullifier1 = pureCircuits.makeNullifier(candidateId1);
    const nullifier2 = pureCircuits.makeNullifier(candidateId2);

    expect(nullifier1.length).toBe(32);
    expect(nullifier2.length).toBe(32);
    expect(Buffer.from(nullifier1).toString('hex')).not.toEqual(
      Buffer.from(nullifier2).toString('hex'),
    );
  });

  // Test 3: Nullifier collision prevention for duplicate submission
  it('3. generates identical nullifiers for identical candidate secrets (double-qualification prevention)', () => {
    const candidateSecret = new Uint8Array(32).fill(42);

    const nullifierA = pureCircuits.makeNullifier(candidateSecret);
    const nullifierB = pureCircuits.makeNullifier(candidateSecret);

    expect(Buffer.from(nullifierA).toString('hex')).toEqual(
      Buffer.from(nullifierB).toString('hex'),
    );
  });

  // Test 4: Verifiable qualification receipt commitment
  it('4. derives verifiable qualification receipt commitments from nullifiers', () => {
    const candidateSecret = new Uint8Array(crypto.randomBytes(32));
    const nullifier = pureCircuits.makeNullifier(candidateSecret);
    const receipt = pureCircuits.makeQualificationReceipt(nullifier);

    expect(receipt).toBeDefined();
    expect(receipt.length).toBe(32);
    expect(Buffer.from(receipt).toString('hex')).not.toEqual(
      Buffer.from(nullifier).toString('hex'),
    );
  });

  // Benchmark constraints matching blindhire.compact circuit
  const minGpaScaled = 750n; // GPA >= 7.50
  const minExpMonths = 12n; // Exp >= 12 months
  const reqDegreeCode = 1n; // Computer Science / IT
  const reqCertCode = 101n; // Node.js Certified Developer

  const evaluateQualification = (creds: {
    gpa_scaled: bigint;
    experience_months: bigint;
    degree_code: bigint;
    certification_code: bigint;
  }) => {
    const gpaPassed = creds.gpa_scaled >= minGpaScaled;
    const expPassed = creds.experience_months >= minExpMonths;
    const degreePassed = creds.degree_code === reqDegreeCode;
    const certPassed = creds.certification_code === reqCertCode;
    return {
      gpaPassed,
      expPassed,
      degreePassed,
      certPassed,
      isQualified: gpaPassed && expPassed && degreePassed && certPassed,
});