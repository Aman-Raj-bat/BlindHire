import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2, ExternalLink, Lock, ShieldCheck, UserCheck, X } from 'lucide-react';
import { storage } from '../lib/storage';
import { ApplicationRecord } from '../lib/types';
import { useToast } from '../contexts/ToastContext';

export const CandidateApplicationsPage: React.FC = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState<ApplicationRecord[]>(storage.getApplications());
  const profile = storage.getCandidateProfile();

  const handleApproveDisclosure = (applicationId: string) => {
    storage.updateDisclosureStatus(applicationId, 'granted', { fullName: profile.fullName, email: profile.email, githubUrl: profile.githubUrl, portfolioUrl: profile.portfolioUrl, universityName: profile.universityName });
    setApplications(storage.getApplications());
    addToast('success', 'Disclosure granted', 'The recruiter can now view the identity details you chose to share.');
  };

  const handleDeclineDisclosure = (applicationId: string) => {
    storage.updateDisclosureStatus(applicationId, 'declined');
    setApplications(storage.getApplications());
    addToast('info', 'Still anonymous', 'Your identity remains hidden from this recruiter.');
  };

  return (
    <div className="world-page">
      <div className="world-container max-w-5xl">
        <header className="world-page-header">
          <div><p className="world-section-kicker">Candidate orbit / consent queue</p><h1 className="world-page-title">Your proofs,<br />your decisions.</h1><p className="world-page-description">Watch qualification claims, inspect anonymous commitments, and decide when a recruiter earns the context behind your signal.</p></div>
          <Link to="/jobs" className="world-button">Find another role <ArrowRight size={14} aria-hidden="true" /></Link>
        </header>

        <div className="mt-8 grid gap-4">
          {applications.length === 0 ? (
            <div className="world-card world-empty"><Lock size={25} className="mx-auto mb-3 text-[#d94d35]" aria-hidden="true" /><h2 className="world-card-title">No applications yet</h2><p className="mx-auto mt-2 max-w-sm text-sm">Explore a role to generate your first private qualification proof.</p><Link to="/jobs" className="world-button mt-6">Browse roles</Link></div>
          ) : applications.map((application) => (
            <article key={application.id} className="world-card p-6 md:p-7">
              <div className="flex flex-col justify-between gap-4 border-b border-[#e8e2d6] pb-5 sm:flex-row sm:items-start"><div><p className="world-section-kicker !mb-2">Role benchmark proof</p><h2 className="world-card-title">{application.jobTitle}</h2><p className="mt-2 font-mono-tech text-xs text-[#6e7488]">{application.candidateAnonymousId} · applied {application.appliedDate}</p></div><span className="world-badge is-good"><CheckCircle2 size={11} aria-hidden="true" /> qualified</span></div>
              <div className="mt-5 grid gap-2 sm:grid-cols-4">{['Degree match', 'GPA threshold', 'Experience', 'Certification'].map((label) => <div key={label} className="rounded-lg border border-[#e8e2d6] bg-[#f6f2e9] p-3"><span className="block font-mono-tech text-[0.59rem] uppercase text-[#6e7488]">{label}</span><span className="mt-2 flex items-center gap-1 text-xs font-bold text-[#3e5d15]"><CheckCircle2 size={12} aria-hidden="true" /> verified</span></div>)}</div>
              <div className="mt-5 border-t border-dashed border-[#e8e2d6] pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-mono-tech text-[0.62rem] uppercase tracking-[0.08em] text-[#6e7488]">Identity disclosure</span>{application.disclosureStatus === 'granted' && <span className="world-badge is-good"><UserCheck size={11} aria-hidden="true" /> shared with consent</span>}{application.disclosureStatus === 'declined' && <span className="world-badge is-muted">declined / anonymous</span>}{application.disclosureStatus === 'none' && <span className="world-badge is-muted"><Lock size={11} aria-hidden="true" /> no request</span>}</div>
                {application.disclosureStatus === 'requested' && <div className="mt-4 flex flex-col justify-between gap-4 border border-[#d7a32466] bg-[#fff3cf] p-4 sm:flex-row sm:items-center"><div><b className="block text-sm text-[#80530c]">A recruiter requested your identity.</b><p className="mt-1 text-xs leading-5 text-[#80530c]">Approve to share your name, email, and GitHub, or stay anonymous.</p></div><div className="flex shrink-0 gap-2"><button type="button" className="world-button" onClick={() => handleApproveDisclosure(application.id)}><Check size={14} aria-hidden="true" /> Approve</button><button type="button" className="world-button-ghost" onClick={() => handleDeclineDisclosure(application.id)}><X size={14} aria-hidden="true" /> Keep hidden</button></div></div>}
                {application.disclosureStatus === 'granted' && application.disclosedIdentity && <div className="mt-4 grid gap-3 rounded-lg border border-[#86d8ef]/50 bg-[#86d8ef]/10 p-4 text-sm sm:grid-cols-3"><span><b className="block text-xs text-[#6e7488]">Name</b>{application.disclosedIdentity.fullName}</span><span><b className="block text-xs text-[#6e7488]">Email</b>{application.disclosedIdentity.email}</span><span><b className="block text-xs text-[#6e7488]">GitHub</b><a className="text-[#276c84] underline" href={application.disclosedIdentity.githubUrl} target="_blank" rel="noreferrer">Open profile</a></span></div>}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e2d6] pt-3 font-mono-tech text-[0.6rem] text-[#6e7488]"><span>Tx {application.txHash.slice(0, 18)}…</span><a href="https://preprod.midnightexplorer.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[#d94d35]">Explorer <ExternalLink size={11} aria-hidden="true" /></a></div>
              </div>
            </article>
          ))}
        </div>

        <div className="world-card-dark mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center"><ShieldCheck size={21} className="text-[#c8ef83]" aria-hidden="true" /><p className="flex-1 text-sm leading-6 text-[#aab2ca]">Qualification is public. Identity is a separate, candidate-controlled decision.</p><Link to="/candidate/credentials" className="text-xs font-bold text-[#c8ef83]">Manage vault →</Link></div>
      </div>
    </div>
  );
};
