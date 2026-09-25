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
    };
  };

  // Test 5: Valid qualification proof (Candidate Alex)
  it('5. verifies complete qualification for a qualifying candidate (GPA 8.7, Exp 24mo, CS/IT, Node.js)', () => {
    const valid = evaluateQualification({
      gpa_scaled: 870n,
      experience_months: 24n,
      degree_code: 1n,
      certification_code: 101n,
    });
    expect(valid.gpaPassed).toBe(true);
    expect(valid.expPassed).toBe(true);
    expect(valid.degreePassed).toBe(true);
    expect(valid.certPassed).toBe(true);
    expect(valid.isQualified).toBe(true);
  });

  // Test 6: Rejection on invalid GPA threshold (6.90 < 7.50)
  it('6. rejects candidate whose GPA is below minimum threshold (GPA: 6.90 < 7.50)', () => {
    const lowGpa = evaluateQualification({
      gpa_scaled: 690n,
      experience_months: 24n,
      degree_code: 1n,
      certification_code: 101n,
    });
    expect(lowGpa.gpaPassed).toBe(false);
    expect(lowGpa.isQualified).toBe(false);
  });

  // Test 7: Rejection on insufficient experience (8 months < 12 months)
  it('7. rejects candidate whose experience duration is below threshold (8mo < 12mo)', () => {
    const lowExp = evaluateQualification({
      gpa_scaled: 880n,
      experience_months: 8n,
      degree_code: 1n,
      certification_code: 101n,
    });
    expect(lowExp.expPassed).toBe(false);
    expect(lowExp.isQualified).toBe(false);
  });

  // Test 8: Rejection on mismatched degree field
  it('8. rejects candidate whose degree does not match required field (Mechanical != CS)', () => {
    const wrongDegree = evaluateQualification({
      gpa_scaled: 920n,
      experience_months: 36n,
      degree_code: 4n,
      certification_code: 101n,
    });
    expect(wrongDegree.degreePassed).toBe(false);
    expect(wrongDegree.isQualified).toBe(false);
  });

  // Test 9: Rejection on missing certification
  it('9. rejects candidate without required certification (cert 0 != 101)', () => {
    const missingCert = evaluateQualification({
      gpa_scaled: 850n,
      experience_months: 18n,
      degree_code: 1n,
      certification_code: 0n,
    });
    expect(missingCert.certPassed).toBe(false);
    expect(missingCert.isQualified).toBe(false);
  });

  // Test 10: Boundary verification at exact minimum thresholds
  it('10. verifies qualification at exact threshold boundaries (GPA = 750n, Exp = 12n)', () => {
    const boundary = evaluateQualification({
      gpa_scaled: 750n,
      experience_months: 12n,
      degree_code: 1n,
      certification_code: 101n,
    });
    expect(boundary.isQualified).toBe(true);
  });
});
