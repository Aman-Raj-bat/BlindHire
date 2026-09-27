import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { storage } from '../lib/storage';
import { CERTIFICATION_CODES, DEGREE_CODES } from '../lib/types';

export const CandidateDashboardPage: React.FC = () => {
  const [profile] = useState(storage.getCandidateProfile());
  const [applications] = useState(storage.getApplications());
  const qualifiedCount = applications.filter((application) => application.status === 'qualified').length;
  const disclosuresGranted = applications.filter((application) => application.disclosureStatus === 'granted').length;

  return (
    <div className="world-page">
      <div className="world-container">
        <header className="world-page-header">
          <div>
            <p className="world-section-kicker">Candidate orbit / private workspace</p>
            <h1 className="world-page-title">Your proof,<br />under your sky.</h1>
            <p className="world-page-description">Manage the credentials that power your proofs, watch applications move through the constellation, and decide who gets a name after a qualification signal lands.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/candidate/credentials" className="world-button-ghost"><Lock size={14} aria-hidden="true" /> Manage vault</Link>
            <Link to="/jobs" className="world-button">Find a role <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Candidate metrics">
          <article className="world-card world-kpi"><span className="world-section-kicker">Local vault</span><strong>04</strong><span>credentials held in browser-only witness state</span></article>
          <article className="world-card world-kpi"><span className="world-section-kicker">Proofs sent</span><strong>{applications.length}</strong><span>{qualifiedCount} role signals verified by the circuit</span></article>
          <article className="world-card world-kpi"><span className="world-section-kicker">Disclosures</span><strong>{disclosuresGranted}</strong><span>identities shared with explicit consent</span></article>
          <article className="world-card world-kpi"><span className="world-section-kicker">Trust model</span><strong className="!mt-5 !text-[1.1rem]">{profile.isDemoCredential ? 'DEMO' : 'ISSUED'}</strong><span>{profile.isDemoCredential ? 'self-attested review profile' : 'verified issuer profile'}</span></article>
        </section>

        <section className="world-card mt-8 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-3 border-b border-[#e8e2d6] pb-5 sm:flex-row sm:items-start">
            <div>
              <p className="world-section-kicker">Private qualification profile</p>
              <h2 className="world-card-title">The signal your vault can prove</h2>
            </div>
            <span className="world-badge is-good"><Lock size={11} aria-hidden="true" /> never public</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Degree / major', DEGREE_CODES[profile.degreeCode]],
              ['GPA', `${profile.gpa.toFixed(2)} / 10.0`],
              ['Experience', `${profile.experienceMonths} months`],
              ['Certification', CERTIFICATION_CODES[profile.certificationCode]],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[#e8e2d6] bg-[#f6f2e9] p-4">
                <span className="font-mono-tech text-[0.6rem] uppercase tracking-[0.08em] text-[#6e7488]">{label}</span>
                <strong className="mt-2 block truncate text-sm text-[#11162b]">{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div><p className="world-section-kicker">Proof history</p><h2 className="world-card-title">Applications moving through the orbit</h2></div>
            <Link to="/candidate/applications" className="font-mono-tech text-xs font-bold uppercase tracking-[0.08em] text-[#d94d35]">View all →</Link>
          </div>
          <div className="world-table-wrap">
            <table className="world-table">
              <thead><tr><th>Role</th><th>Signal</th><th>Anonymous ID</th><th>Disclosure</th><th>Applied</th></tr></thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td><strong className="text-[#11162b]">{application.jobTitle}</strong></td>
                    <td><span className="world-badge is-good"><CheckCircle2 size={11} aria-hidden="true" /> qualified</span></td>
                    <td className="font-mono-tech text-xs">{application.candidateAnonymousId}</td>
                    <td>
                      {application.disclosureStatus === 'granted' && <span className="world-badge is-good"><UserCheck size={11} aria-hidden="true" /> disclosed</span>}
                      {application.disclosureStatus === 'requested' && <span className="world-badge is-warn">request pending</span>}
                      {application.disclosureStatus === 'none' && <span className="world-badge is-muted"><Lock size={11} aria-hidden="true" /> shielded</span>}
                    </td>
                    <td className="font-mono-tech text-xs text-[#6e7488]">{application.appliedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="world-card-dark mt-8 grid gap-5 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-7">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-[#c8ef83]/40 bg-[#c8ef83]/10 text-[#c8ef83]"><ShieldCheck size={21} aria-hidden="true" /></div>
          <div><p className="font-mono-tech text-[0.62rem] uppercase tracking-[0.1em] text-[#c8ef83]">Candidate-controlled disclosure</p><p className="mt-2 max-w-2xl text-sm leading-6 text-[#aab2ca]">Qualification is not consent. A team can request your identity, but your vault never shares it automatically.</p></div>
          <Link to="/candidate/applications" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#ffffff33] px-4 text-xs font-bold text-[#fffdf8] hover:border-[#c8ef83] hover:text-[#c8ef83]">Review requests <ArrowRight size={14} aria-hidden="true" /></Link>
        </section>
      </div>
    </div>
  );
};
