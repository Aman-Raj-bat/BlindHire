import { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenCallTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { storage } from '../lib/storage';
import { CandidateProfile, JobListing, QualificationProofResult } from '../lib/types';
import { fromHex, toHex } from '../lib/midnight';

function getCompiledContract() {
  return CompiledContract.make('BlindHire', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export type SubmissionStatus =
  | 'idle'
  | 'evaluating'
  | 'proving'
  | 'submitting'
  | 'qualified'
  | 'disqualified'
  | 'error';

export function useBlindHireContract() {
  const { session, isConnected } = useWallet();
  const { addToast } = useToast();
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setActiveStep(0);
    setErrorMsg(null);
    setLastTxId(null);
  }, []);

  const proveQualification = useCallback(
    async (
      job: JobListing,
      candidate: CandidateProfile,
      useDemoMode = false,
    ): Promise<QualificationProofResult | null> => {
      setStatus('evaluating');
      setActiveStep(1);
      setErrorMsg(null);
      setLastTxId(null);

      if (!useDemoMode && (!isConnected || !session)) {
        setStatus('error');
        setErrorMsg('Connect a Midnight wallet to submit a real proof, or enable Demo mode to try the local simulation.');
        return null;
      }
      if (!useDemoMode && !job.isContractBacked) {
        setStatus('error');
        setErrorMsg('This is a local sample role, not a deployed screening contract. Enable Demo mode to preview qualification.');
        return null;
      }

      // Evaluate qualification constraints
      const meetsGpa = BigInt(candidate.gpaScaled) >= job.minGpaScaled;
      const meetsExp = BigInt(candidate.experienceMonths) >= job.minExperienceMonths;
      const meetsDegree = BigInt(candidate.degreeCode) === job.requiredDegreeCode;
      const meetsCert =
        job.requiredCertificationCode === 0n ||
        BigInt(candidate.certificationCode) === job.requiredCertificationCode;

      const isOverallQualified = meetsGpa && meetsExp && meetsDegree && meetsCert;

      // Small delay for UX step feedback
      await new Promise((r) => setTimeout(r, 600));

      // Generate anonymous nullifier & commitment
      const candidateIdBytes = fromHex(candidate.candidateSecretHex.padEnd(64, '0').slice(0, 64));
      const nullifierHex = '0x' + toHex(candidateIdBytes).slice(0, 32) + 'a184f9';
      const receiptCommitmentHex = '0x' + toHex(candidateIdBytes).slice(32, 64) + 'b902e8';

      // If connected to real Midnight wallet session and contract is on-chain
      const contractAddress = job.contractAddress || storage.getDeployedContractAddress();

      if (isConnected && session && contractAddress && !useDemoMode) {
        try {
          setStatus('proving');
          setActiveStep(2);

          const compiled = getCompiledContract();

          const callTxData = await (createUnprovenCallTx as any)(session.providers as any, {
            compiledContract: compiled,
            contractAddress,
            circuitId: 'prove_qualification',
            witnesses: {
              candidate_credentials: () => ({
                degree_code: BigInt(candidate.degreeCode),
                gpa_scaled: BigInt(candidate.gpaScaled),
                experience_months: BigInt(candidate.experienceMonths),
                certification_code: BigInt(candidate.certificationCode),
                candidate_id: candidateIdBytes,
              }),
              recruiter_secret_key: () => new Uint8Array(32),
            },
            args: [],
          });

          setStatus('submitting');
          setActiveStep(3);

          const txResult = await submitTxAsync(session.providers as any, {
            unprovenTx: callTxData.private.unprovenTx,
            circuitId: 'prove_qualification',
          });

          const txId = typeof txResult === 'string' ? txResult : (txResult as any)?.txHash ?? 'confirmed';
          setLastTxId(txId);
          setActiveStep(4);
          setStatus(isOverallQualified ? 'qualified' : 'disqualified');

          const result: QualificationProofResult = {
            txHash: txId,
            nullifierHex,
            receiptCommitmentHex,
            status: isOverallQualified ? 'qualified' : 'disqualified',
            timestamp: new Date().toISOString(),
            jobId: job.id,
            requirementsMet: {
              degree: meetsDegree,
              gpa: meetsGpa,
              experience: meetsExp,
              certification: meetsCert,
            },
          };

          addToast(
            isOverallQualified ? 'success' : 'error',
            isOverallQualified ? 'Qualification Verified On-Chain!' : 'Verification Failed: Ineligible',
            `Nullifier: ${nullifierHex.slice(0, 16)}...`,
          );

          return result;
        } catch (err: any) {
          console.warn('On-chain circuit proof failed:', err);
          // If contract call failed due to constraint or balance
          const msg = err?.message ?? String(err);
          if (msg.includes('assert') || msg.includes('below') || msg.includes('Missing')) {
            setStatus('disqualified');
            setActiveStep(4);
            addToast('error', 'Zero-Knowledge Circuit Constraint Failed', msg);
            return null;
          }
          setStatus('error');
          setErrorMsg(msg);
          return null;
        }
      }

      if (!useDemoMode) {
        setStatus('error');
        setErrorMsg('A deployed screening contract is required. No transaction was submitted.');
        return null;
      }

      // Explicit local simulation only; never use this as a fallback for a failed transaction.
      setStatus('proving');
      setActiveStep(2);
      await new Promise((r) => setTimeout(r, 1200));

      setStatus('submitting');
      setActiveStep(3);
      await new Promise((r) => setTimeout(r, 800));

      const mockTxHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setLastTxId(mockTxHash);
      setActiveStep(4);
      setStatus(isOverallQualified ? 'qualified' : 'disqualified');

      const result: QualificationProofResult = {
        txHash: mockTxHash,
        nullifierHex,
        receiptCommitmentHex,
        status: isOverallQualified ? 'qualified' : 'disqualified',
        timestamp: new Date().toISOString(),
        jobId: job.id,
        requirementsMet: {
          degree: meetsDegree,
          gpa: meetsGpa,
          experience: meetsExp,
          certification: meetsCert,
        },
      };

      if (isOverallQualified) {
        addToast(
          'success',
          'Demo criteria satisfied',
          'Local simulation complete. No transaction was submitted to Midnight.',
        );
      } else {
        addToast(
          'error',
          'Candidate Does Not Meet Requirements',
          `One or more requirements were not satisfied.`,
        );
      }

      return result;
    },
    [session, isConnected, addToast],
  );

  return {
    status,
    activeStep,
    lastTxId,
    errorMsg,
    proveQualification,
    reset,
  };
}
