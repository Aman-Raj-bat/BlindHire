// [A11y] Dialog ARIA attributes
import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  X,
  FileCheck,
  Cpu,
  Send,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobListing, CandidateProfile } from '../../lib/types';
import { useBlindHireContract } from '../../hooks/useBlindHireContract';
import { storage } from '../../lib/storage';

interface ProofGeneratorModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isDemoMode?: boolean;
}

export const ProofGeneratorModal: React.FC<ProofGeneratorModalProps> = ({
  job,
  candidate,
  isOpen,
  onClose,
  onSuccess,
  isDemoMode = false,
}) => {
  const { status, activeStep, lastTxId, errorMsg, proveQualification, reset } = useBlindHireContract();
  const [hasStarted, setHasStarted] = useState(false);

  if (!isOpen) return null;

  const steps = [
    { title: 'Read Job Requirements', desc: 'Query on-chain screening thresholds from Midnight contract', icon: FileCheck },
    { title: 'Evaluate Private Credentials', desc: 'Check GPA, experience, degree, and certification inside local witness', icon: Lock },
    { title: 'Generate Zero-Knowledge Proof', desc: 'Compute ZK proof of satisfying criteria without revealing values', icon: Cpu },
    { title: 'Submit On-Chain Verification', desc: 'Broadcast proof and anonymous nullifier to Midnight network', icon: Send },
    { title: 'Qualification Verified', desc: 'Permanent verifiable receipt recorded on public ledger', icon: CheckCircle2 },
  ];

  const handleStartProof = async () => {
    setHasStarted(true);
    const result = await proveQualification(job, candidate, isDemoMode);
    if (result && result.status === 'qualified') {
      // Record application in storage
      storage.saveApplication({
        id: `app-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        candidateAnonymousId: `Candidate #${result.nullifierHex.slice(2, 6).toUpperCase()}`,
        candidateNullifier: result.nullifierHex,
        txHash: result.txHash,
        status: 'qualified',
        appliedDate: 'Just now',
        isDemoData: isDemoMode || candidate.isDemoCredential,
        disclosureStatus: 'none',
        verifiedChecks: result.requirementsMet,
      });
      onSuccess?.();
    }
  };

  const handleModalClose = () => {
    reset();
    setHasStarted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#22252B] bg-[#111215] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#1f2128] bg-[#14151a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D284]/10 border border-[#00D284]/30 flex items-center justify-center text-[#00D284]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#f4f4f6]">Generate Qualification Proof</h3>
                {isDemoMode && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    DEMO MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#92939e]">{job.title}</p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-[#5e606e] hover:text-[#f4f4f6] hover:bg-[#1f2128] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Privacy Guarantee Banner */}
          <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#0c0d10] flex items-start gap-3 text-xs">
            <Lock className="w-4 h-4 text-[#00D284] mt-0.5 shrink-0" />
            <div className="text-[#92939e]">
              <span className="font-semibold text-[#f4f4f6]">Zero-Knowledge Privacy Guarantee: </span>
              Your private credentials (exact GPA: {candidate.gpa}, experience: {candidate.experienceMonths}mo, university: {candidate.universityName}) remain inside your local witness. Only the mathematical truth that you satisfy the job threshold is verified on-chain.
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isCurrent = hasStarted && activeStep === idx && (status === 'evaluating' || status === 'proving' || status === 'submitting');
              const isCompleted = hasStarted && (activeStep > idx || status === 'qualified');
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-[#00D284]/40 bg-[#00D284]/5 shadow-[0_0_15px_rgba(0,210,132,0.06)]'
                      : isCompleted
                      ? 'border-[#1f2128] bg-[#14151a]'
                      : 'border-transparent bg-[#111215] opacity-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-[#00D284]/20 border border-[#00D284] flex items-center justify-center text-[#00D284]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-[#00D284]/20 border border-[#00D284] flex items-center justify-center text-[#00D284]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#1b1d24] border border-[#282b36] flex items-center justify-center text-[#5e606e] font-mono-tech text-[10px]">
                        0{idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${isCurrent ? 'text-[#00D284]' : isCompleted ? 'text-[#f4f4f6]' : 'text-[#92939e]'}`}>
                        {step.title}
                      </p>
                      {isCompleted && (
                        <span className="text-[10px] font-mono-tech text-[#00D284] uppercase">VERIFIED</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5e606e] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Outcome if Completed */}
          {status === 'qualified' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl border border-[#00D284]/30 bg-[#00D284]/10 text-center space-y-2"
            >
              <div className="inline-flex p-2 rounded-full bg-[#00D284]/20 text-[#00D284] mb-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#f4f4f6]">Qualified Before Identified!</h4>
              <p className="text-xs text-[#92939e] max-w-md mx-auto">
                Your zero-knowledge qualification receipt has been submitted to the screening contract. The recruiter sees that you meet all criteria while your private profile remains shielded.
              </p>
              {lastTxId && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono-tech text-[#5e606e] block">Transaction Reference</span>
                  <code className="text-[10px] font-mono-tech text-[#00D284] break-all">{lastTxId}</code>
                </div>
              )}
            </motion.div>
          )}

          {status === 'disqualified' && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-center space-y-2">
              <div className="inline-flex p-2 rounded-full bg-red-500/20 text-red-400 mb-1">
                <XCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-red-300">Criteria Not Satisfied</h4>
              <p className="text-xs text-[#92939e] max-w-md mx-auto">
                Your private credentials did not meet the job requirements (GPA threshold, experience duration, degree field, or required certification).
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-[#1f2128] bg-[#14151a] flex items-center justify-between">
          <button
            onClick={handleModalClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#92939e] hover:text-[#f4f4f6] transition-colors"
          >
            {status === 'qualified' || status === 'disqualified' ? 'Close' : 'Cancel'}
          </button>

          {!hasStarted && (
            <button
              onClick={handleStartProof}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all shadow-[0_0_20px_rgba(0,210,132,0.2)]"
            >
              <span>Execute Zero-Knowledge Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {status === 'qualified' && (
            <button
              onClick={handleModalClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#f4f4f6] text-[#09090b] hover:bg-[#e4e4e7] transition-all"
            >
              View In Applications
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
