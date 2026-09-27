import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, EyeOff, Lock, Plus, Send, ShieldCheck, UserCheck } from 'lucide-react';
import { storage } from '../lib/storage';
import { ApplicationRecord } from '../lib/types';
import { useToast } from '../contexts/ToastContext';

export const RecruiterDashboardPage: React.FC = () => {
  const { addToast } = useToast();
  const [jobs] = useState(storage.getJobs());
  const [applications, setApplications] = useState<ApplicationRecord[]>(storage.getApplications());
  const qualifiedCount = applications.filter((application) => application.status === 'qualified').length;
  const disclosedCount = applications.filter((application) => application.disclosureStatus === 'granted').length;

  const handleRequestDisclosure = (applicationId: string) => {
    storage.updateDisclosureStatus(applicationId, 'requested');
    setApplications(storage.getApplications());
    addToast('info', 'Disclosure request sent', 'The candidate decides whether their identity enters the next orbit.');
  };

  return (
    <div className="world-page">
      <div className="world-container">
        <header className="world-page-header">
          <div>
            <p className="world-section-kicker">Team orbit / proof-first hiring</p>
            <h1 className="world-page-title">Read the signal.<br />Skip the noise.</h1>
            <p className="world-page-description">A recruiter workspace built around verified requirements. Review candidates by what the circuit proved, then ask for context only when it is useful.</p>
          </div>
          <Link to="/recruiter/jobs/new" className="world-button"><Plus size={15} aria-hidden="true" /> Create a role</Link>
        </header>

        <section className="mt-8 grid gap-3 md:grid-cols-3" aria-label="Recruiter metrics">
          <article className="world-card world-kpi"><span className="world-section-kicker">Roles on orbit</span><strong>{jobs.length}</strong><span>screening surfaces published to Midnight</span></article>
          <article className="world-card world-kpi"><span className="world-section-kicker">Verified signals</span><strong>{qualifiedCount}</strong><span>requirements proved without resume data</span></article>
          <article className="world-card world-kpi"><span className="world-section-kicker">Consented context</span><strong>{disclosedCount}</strong><span>identities shared by candidate choice</span></article>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="world-section-kicker">Qualification stream</p><h2 className="world-card-title">Candidates, without the identity tax</h2></div><span className="world-badge is-good"><ShieldCheck size={11} aria-hidden="true" /> nullifier protected</span></div>
          <div className="grid gap-4">
            {applications.map((application) => (
              <article key={application.id} className="world-card p-6 md:p-7">
                <div className="flex flex-col justify-between gap-5 border-b border-[#e8e2d6] pb-5 md:flex-row md:items-start">
                  <div><div className="flex flex-wrap items-center gap-2"><span className="font-mono-tech text-sm font-bold text-[#d94d35]">{application.candidateAnonymousId}</span><span className="world-badge is-good"><CheckCircle2 size={11} aria-hidden="true" /> qualified</span></div><p className="mt-2 text-xs text-[#6e7488]">{application.jobTitle} · verified {application.appliedDate}</p></div>
                  {application.disclosureStatus === 'none' && <button type="button" className="world-button-ghost" onClick={() => handleRequestDisclosure(application.id)}><Send size={13} aria-hidden="true" /> Request context</button>}
                  {application.disclosureStatus === 'requested' && <span className="world-badge is-warn">Disclosure pending</span>}
                  {application.disclosureStatus === 'granted' && <span className="world-badge is-good"><UserCheck size={11} aria-hidden="true" /> Identity shared</span>}
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-4">
                  {['Degree', 'GPA threshold', 'Experience', 'Certification'].map((label) => <div key={label} className="rounded-lg border border-[#e8e2d6] bg-[#f6f2e9] p-3"><span className="block font-mono-tech text-[0.58rem] uppercase tracking-[0.06em] text-[#6e7488]">{label}</span><span className="mt-2 flex items-center gap-1 text-xs font-bold text-[#3e5d15]"><CheckCircle2 size={12} aria-hidden="true" /> verified</span></div>)}
                </div>

                {application.disclosureStatus === 'granted' && application.disclosedIdentity ? (
                  <div className="mt-5 rounded-lg border border-[#86d8ef]/50 bg-[#86d8ef]/10 p-4"><p className="font-mono-tech text-[0.6rem] uppercase tracking-[0.08em] text-[#276c84]">Candidate-consented profile</p><div className="mt-3 grid gap-3 text-sm sm:grid-cols-3"><span><b className="block text-xs text-[#6e7488]">Name</b>{application.disclosedIdentity.fullName}</span><span><b className="block text-xs text-[#6e7488]">Email</b>{application.disclosedIdentity.email}</span><span><b className="block text-xs text-[#6e7488]">Portfolio</b>{application.disclosedIdentity.portfolioUrl}</span></div></div>
                ) : (
                  <div className="mt-5 flex items-center gap-3 border-t border-dashed border-[#e8e2d6] pt-4 text-xs text-[#6e7488]"><EyeOff size={15} aria-hidden="true" /><span>Exact GPA, university, wallet, and personal identity remain hidden.</span><span className="ml-auto hidden font-mono-tech text-[0.58rem] uppercase text-[#3e5d15] sm:block">shielded</span></div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="world-card-dark mt-8 grid gap-4 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-7"><div className="grid h-11 w-11 place-items-center rounded-full border border-[#c8ef83]/40 bg-[#c8ef83]/10 text-[#c8ef83]"><Lock size={19} aria-hidden="true" /></div><p className="text-sm leading-6 text-[#aab2ca]">The most useful candidate data is the data you can verify. Keep your first pass intentionally small.</p><Link to="/recruiter/jobs/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#ffffff33] px-4 text-xs font-bold text-[#fffdf8] hover:border-[#c8ef83] hover:text-[#c8ef83]">Publish a role <ArrowRight size={14} aria-hidden="true" /></Link></section>
      </div>
    </div>
  );
};
