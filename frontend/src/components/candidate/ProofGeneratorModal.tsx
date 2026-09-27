import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, Lock, ShieldCheck, X, XCircle } from 'lucide-react';
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

export const ProofGeneratorModal: React.FC<ProofGeneratorModalProps> = ({ job, candidate, isOpen, onClose, onSuccess, isDemoMode = false }) => {
  const { status, activeStep, lastTxId, errorMsg, proveQualification, reset } = useBlindHireContract();
  const [hasStarted, setHasStarted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const busy = ['evaluating', 'proving', 'submitting'].includes(status);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialogRef.current?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  const handleClose = () => {
    if (busy) return;
    reset();
    setHasStarted(false);
    dialogRef.current?.close();
    onClose();
  };

  const handleStart = async () => {
    setHasStarted(true);
    const result = await proveQualification(job, candidate, isDemoMode);
    if (result?.status === 'qualified') {
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

  if (!isOpen) return null;

  const steps = [
    ['Read the role', 'Load the public qualification thresholds.'],
    ['Check the witnesses', 'Compare degree, GPA, experience, and certification.'],
    [isDemoMode ? 'Simulate the proof' : 'Generate the proof', isDemoMode ? 'Preview the proving flow with self-attested demo data.' : 'Prepare the private circuit execution.'],
    [isDemoMode ? 'Create a local receipt' : 'Submit to Midnight', isDemoMode ? 'No transaction is sent to the network.' : 'Submit the proof for network verification.'],
    ['Qualification result', 'Keep your identity separate from the outcome.'],
  ];

  return (
    <dialog ref={dialogRef} className="proof-dialog" aria-labelledby="proof-title" aria-describedby="proof-description" onCancel={(event) => { event.preventDefault(); handleClose(); }}>
      <header className="proof-header">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 shrink-0 text-[#d94d35]" size={24} aria-hidden="true" />
          <div><p className="world-section-kicker !mb-2">{isDemoMode ? 'Demo flight / simulated' : 'Midnight / preprod'}</p><h2 id="proof-title" className="world-card-title">Let your qualification speak.</h2><p id="proof-description" className="mt-2 text-sm text-[#6e7488]">{job.title}</p></div>
        </div>
        <button type="button" className="cosmic-icon-button shrink-0" aria-label="Close proof dialog" disabled={busy} onClick={handleClose}><X size={18} aria-hidden="true" /></button>
      </header>
      <div className="proof-body">
        <p className="flex gap-3 rounded-lg border border-[#c8ef83] bg-[#c8ef83]/15 p-4 text-sm leading-6 text-[#3e5d15]"><Lock size={17} className="mt-1 shrink-0" aria-hidden="true" />{isDemoMode ? 'This is a local simulation, not an on-chain proof or issuer verification. Your demo profile is never sent to a recruiter.' : 'Only qualification claims belong on the ledger. Your name, university, and exact grades are not part of the public claim.'}</p>
        <ol className="proof-steps" aria-label="Qualification progress">
          {steps.map(([title, description], index) => {
            const completed = hasStarted && (activeStep > index || status === 'qualified');
            const current = hasStarted && activeStep === index && busy;
            return <li key={title} className={current ? 'is-current' : completed ? 'is-complete' : ''} aria-current={current ? 'step' : undefined}><span className="proof-step-number" aria-hidden="true">{current ? <Loader2 size={16} className="animate-spin" /> : completed ? <CheckCircle2 size={16} /> : `0${index + 1}`}</span><div><strong>{title}</strong><p>{description}</p></div></li>;
          })}
        </ol>
        <div aria-live="polite" aria-atomic="true">
          {busy && <p className="text-sm text-[#6e7488]">{steps[activeStep]?.[0]}… Keep this window open until the process finishes.</p>}
          {status === 'qualified' && <div className="proof-result is-success"><CheckCircle2 size={25} aria-hidden="true" /><h3>{isDemoMode ? 'Demo criteria satisfied.' : 'Qualification submitted.'}</h3><p>{isDemoMode ? 'A simulated receipt was saved to your local applications. No real transaction was submitted.' : 'Your qualification submission is recorded. Check the network explorer for final confirmation.'}</p>{lastTxId && <code>{lastTxId}</code>}</div>}
          {status === 'disqualified' && <div className="proof-result is-error"><XCircle size={25} aria-hidden="true" /><h3>Not a match, still private.</h3><p>One or more requirements were not satisfied. Review the role criteria or update your local credentials.</p></div>}
          {status === 'error' && <div className="proof-result is-error" role="alert"><XCircle size={25} aria-hidden="true" /><h3>The proof could not proceed.</h3><p>{errorMsg || 'Please check your wallet and try again.'}</p></div>}
        </div>
      </div>
      <footer className="proof-footer">
        <button type="button" className="world-button-ghost" disabled={busy} onClick={handleClose}>{hasStarted ? 'Close' : 'Cancel'}</button>
        {(!hasStarted || status === 'error') && <button type="button" className="world-button" onClick={handleStart}>{isDemoMode ? 'Run demo proof' : 'Generate proof'} <ArrowRight size={14} aria-hidden="true" /></button>}
        {status === 'qualified' && <button type="button" className="world-button" onClick={() => { handleClose(); navigate('/candidate/applications'); }}>View applications <ArrowRight size={14} aria-hidden="true" /></button>}
      </footer>
    </dialog>
  );
};
