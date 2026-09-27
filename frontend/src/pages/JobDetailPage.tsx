import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import { ProofGeneratorModal } from '../components/candidate/ProofGeneratorModal';
import { storage } from '../lib/storage';
import { CERTIFICATION_CODES, DEGREE_CODES } from '../lib/types';

interface JobDetailPageProps { isDemoMode: boolean; }

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ isDemoMode }) => {
  const { id } = useParams<{ id: string }>();
  const job = storage.getJobs().find((item) => item.id === id) || storage.getJobs()[0];
  const candidate = storage.getCandidateProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const checks = [
    ['Minimum GPA', `≥ ${job.minGpa.toFixed(1)} / 10.0`, candidate.gpa >= job.minGpa],
    ['Minimum experience', `≥ ${Number(job.minExperienceMonths)} months`, candidate.experienceMonths >= Number(job.minExperienceMonths)],
    ['Degree field', DEGREE_CODES[Number(job.requiredDegreeCode)], candidate.degreeCode === Number(job.requiredDegreeCode)],
    ['Certification', CERTIFICATION_CODES[Number(job.requiredCertificationCode)], job.requiredCertificationCode === 0n || candidate.certificationCode === Number(job.requiredCertificationCode)],
  ] as const;

  return (
    <div className="world-page"><div className="world-container max-w-5xl">
      <Link to="/jobs" className="mb-7 inline-flex items-center gap-2 font-mono-tech text-xs font-bold uppercase tracking-[0.08em] text-[#6e7488] hover:text-[#d94d35]"><ArrowLeft size={14} aria-hidden="true" /> Back to role map</Link>
      <section className="world-card p-6 md:p-9">
        <div className="flex flex-col justify-between gap-6 border-b border-[#e8e2d6] pb-7 md:flex-row md:items-start"><div><p className="world-section-kicker">{job.company}</p><h1 className="world-page-title !text-5xl md:!text-7xl">{job.title}</h1><div className="mt-5 flex flex-wrap gap-4 text-xs text-[#6e7488]"><span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden="true" /> {job.location}</span><span className="inline-flex items-center gap-1"><Clock size={13} aria-hidden="true" /> {job.type}</span><span className="font-mono-tech text-[#3e5d15]">{job.salaryRange}</span></div></div><button type="button" className="world-button shrink-0" onClick={() => setIsModalOpen(true)}>Prove qualification <ArrowRight size={14} aria-hidden="true" /></button></div>
        <div className="mt-8"><div className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#d94d35]" aria-hidden="true" /><h2 className="world-card-title">On-chain screening thresholds</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{checks.map(([label, value, satisfied]) => <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-[#e8e2d6] bg-[#f6f2e9] p-4"><div><span className="block text-xs text-[#6e7488]">{label}</span><b className="mt-1 block text-sm text-[#11162b]">{value}</b></div><span className={`world-badge ${satisfied ? 'is-good' : 'is-warn'}`}>{satisfied && <CheckCircle2 size={11} aria-hidden="true" />}{satisfied ? 'satisfied' : 'unmet'}</span></div>)}</div></div>
        <div className="mt-7 flex flex-col justify-between gap-3 border-t border-[#e8e2d6] pt-5 text-xs sm:flex-row sm:items-center"><code className="break-all font-mono-tech text-[#3e5d15]">{job.contractAddress}</code><a className="inline-flex shrink-0 items-center gap-1 text-[#6e7488] hover:text-[#d94d35]" href={`https://preprod.midnightexplorer.com/contracts/${job.contractAddress}`} target="_blank" rel="noreferrer">Explorer <ExternalLink size={12} aria-hidden="true" /></a></div>
      </section>
      <section className="mt-4 grid gap-4 md:grid-cols-2"><div className="world-card p-6"><p className="world-section-kicker">Role overview</p><p className="mt-3 text-sm leading-7 text-[#6e7488]">{job.description}</p></div><div className="world-card p-6"><p className="world-section-kicker">Core responsibilities</p><ul className="mt-3 grid gap-3 text-sm leading-6 text-[#6e7488]">{job.responsibilities.map((responsibility) => <li key={responsibility} className="flex gap-2"><span className="text-[#d94d35]">•</span>{responsibility}</li>)}</ul></div></section>
      <ProofGeneratorModal job={job} candidate={candidate} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDemoMode={isDemoMode} />
    </div></div>
  );
};
