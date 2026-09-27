import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Clock, Filter, Lock, MapPin, Search, ShieldCheck } from 'lucide-react';
import { ProofGeneratorModal } from '../components/candidate/ProofGeneratorModal';
import { storage } from '../lib/storage';
import { CERTIFICATION_CODES, DEGREE_CODES, JobListing } from '../lib/types';

interface JobsPageProps {
  isDemoMode: boolean;
}

export const JobsPage: React.FC<JobsPageProps> = ({ isDemoMode }) => {
  const [jobs] = useState<JobListing[]>(storage.getJobs());
  const [candidate] = useState(storage.getCandidateProfile());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegreeFilter, setSelectedDegreeFilter] = useState<number | 'all'>('all');
  const [activeJobForProof, setActiveJobForProof] = useState<JobListing | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query) || job.description.toLowerCase().includes(query);
    const matchesDegree = selectedDegreeFilter === 'all' || Number(job.requiredDegreeCode) === selectedDegreeFilter;
    return matchesSearch && matchesDegree;
  });

  return (
    <div className="world-page">
      <div className="world-container">
        <header className="world-page-header">
          <div>
            <p className="world-section-kicker">Role map / proof-first hiring</p>
            <h1 className="world-page-title">Open roles.<br />Private signals.</h1>
            <p className="world-page-description">Explore roles whose requirements can be checked against your local vault. No resume uploads. No identity tax before the first yes.</p>
          </div>
          <Link to="/candidate/credentials" className="world-button-ghost"><Lock size={14} aria-hidden="true" /> Open my vault</Link>
        </header>

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search roles</span>
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7488]" aria-hidden="true" />
            <input className="world-input pl-11" type="search" placeholder="Search role, company, or signal" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
          </label>
          <label className="relative block min-w-52">
            <span className="sr-only">Filter by field</span>
            <Filter size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7488]" aria-hidden="true" />
            <select className="world-input appearance-none pl-10" value={selectedDegreeFilter} onChange={(event) => setSelectedDegreeFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))}>
              <option value="all">All fields of study</option>
              {Object.entries(DEGREE_CODES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="font-mono-tech text-xs uppercase tracking-[0.1em] text-[#6e7488]">{filteredJobs.length} roles on the map</p>
          <p className="hidden text-xs text-[#6e7488] sm:block">A proof is generated locally in your browser.</p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="world-card world-empty mt-4">No roles match that signal yet. Try a different orbit.</div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {filteredJobs.map((job) => {
              const meetsGpa = candidate.gpa >= job.minGpa;
              const meetsExp = candidate.experienceMonths >= Number(job.minExperienceMonths);
              const meetsDegree = candidate.degreeCode === Number(job.requiredDegreeCode);
              const meetsCert = job.requiredCertificationCode === 0n || candidate.certificationCode === Number(job.requiredCertificationCode);
              const isEligible = meetsGpa && meetsExp && meetsDegree && meetsCert;

              return (
                <article key={job.id} className="role-card">
                  <div className="role-card-top">
                    <div>
                      <span className="role-company">{job.company}</span>
                      <h2 className="role-title">{job.title}</h2>
                    </div>
                    <span className="role-orb" aria-hidden="true" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#6e7488]">
                    <span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden="true" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={13} aria-hidden="true" /> {job.type}</span>
                  </div>
                  <p className="role-description mt-4">{job.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2 border-y border-[#e8e2d6] py-4 font-mono-tech text-[0.61rem] text-[#6e7488]">
                    <span>GPA <b className="text-[#11162b]">≥ {job.minGpa.toFixed(1)}</b></span>
                    <span>EXP <b className="text-[#11162b]">≥ {Number(job.minExperienceMonths)} mo</b></span>
                    <span className="col-span-2 truncate">CERT <b className="text-[#11162b]">{CERTIFICATION_CODES[Number(job.requiredCertificationCode)] || 'None'}</b></span>
                  </div>
                  <div className="role-tags">
                    <span className={`world-badge ${isEligible ? 'is-good' : 'is-muted'}`}>{isEligible ? 'Vault matches' : 'Review criteria'}</span>
                    {job.isContractBacked && <span className="world-badge is-muted"><ShieldCheck size={11} aria-hidden="true" /> on-chain</span>}
                  </div>
                  <div className="role-footer">
                    <span>{job.qualifiedCount} proofs verified</span>
                    <button type="button" className="role-prove" onClick={() => setActiveJobForProof(job)}>
                      Prove qualification <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {activeJobForProof && (
        <ProofGeneratorModal job={activeJobForProof} candidate={candidate} isOpen={Boolean(activeJobForProof)} onClose={() => setActiveJobForProof(null)} isDemoMode={isDemoMode} />
      )}
    </div>
  );
};
