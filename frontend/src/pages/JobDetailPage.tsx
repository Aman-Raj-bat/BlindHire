import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { DEGREE_CODES, CERTIFICATION_CODES } from '../lib/types';
import { ProofGeneratorModal } from '../components/candidate/ProofGeneratorModal';

interface JobDetailPageProps {
  isDemoMode: boolean;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ isDemoMode }) => {
  const { id } = useParams<{ id: string }>();
  const jobs = storage.getJobs();
  const candidate = storage.getCandidateProfile();
  const job = jobs.find((j) => j.id === id) || jobs[0];

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compare criteria with candidate
  const meetsGpa = candidate.gpa >= job.minGpa;
  const meetsExp = candidate.experienceMonths >= Number(job.minExperienceMonths);
  const meetsDegree = candidate.degreeCode === Number(job.requiredDegreeCode);
  const meetsCert =
    job.requiredCertificationCode === 0n ||
    candidate.certificationCode === Number(job.requiredCertificationCode);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back to Jobs */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#92939e] hover:text-[#f4f4f6] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Screening Roles</span>
      </Link>

      {/* Main Header Card */}
      <div className="p-8 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2128] pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech uppercase text-[#00D284]">{job.company}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f4f6]">{job.title}</h1>
            <div className="flex flex-wrap gap-3 text-xs text-[#92939e] pt-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#5e606e]" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#5e606e]" />
                {job.type}
              </span>
              <span className="inline-flex items-center gap-1 font-mono-tech text-[#00D284]">
                {job.salaryRange}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all shadow-[0_0_20px_rgba(0,210,132,0.2)] self-start sm:self-center shrink-0"
          >
            <span>Prove Qualification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Screening Criteria Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#92939e]">
            On-Chain Zero-Knowledge Screening Thresholds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5e606e]">Minimum GPA</p>
                <p className="text-sm font-semibold text-[#f4f4f6] font-mono-tech mt-0.5">
                  &ge; {job.minGpa.toFixed(1)} / 10.0
                </p>
              </div>
              <span
                className={`text-[10px] font-mono-tech px-2 py-0.5 rounded ${
                  meetsGpa ? 'bg-[#00D284]/10 text-[#00D284]' : 'bg-red-500/10 text-red-400'
                }`}
              >
                {meetsGpa ? 'SATISFIED' : 'UNMET'}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5e606e]">Minimum Experience</p>
                <p className="text-sm font-semibold text-[#f4f4f6] font-mono-tech mt-0.5">
                  &ge; {Number(job.minExperienceMonths)} months
                </p>
              </div>
              <span
                className={`text-[10px] font-mono-tech px-2 py-0.5 rounded ${
                  meetsExp ? 'bg-[#00D284]/10 text-[#00D284]' : 'bg-red-500/10 text-red-400'
                }`}
              >
                {meetsExp ? 'SATISFIED' : 'UNMET'}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5e606e]">Required Degree Field</p>
                <p className="text-sm font-semibold text-[#f4f4f6] truncate max-w-[200px] mt-0.5">
                  {DEGREE_CODES[Number(job.requiredDegreeCode)]}
                </p>
              </div>
              <span
                className={`text-[10px] font-mono-tech px-2 py-0.5 rounded ${
                  meetsDegree ? 'bg-[#00D284]/10 text-[#00D284]' : 'bg-red-500/10 text-red-400'
                }`}
              >
                {meetsDegree ? 'SATISFIED' : 'UNMET'}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5e606e]">Certification</p>
                <p className="text-sm font-semibold text-[#f4f4f6] truncate max-w-[200px] mt-0.5">
                  {CERTIFICATION_CODES[Number(job.requiredCertificationCode)]}
                </p>
              </div>
              <span
                className={`text-[10px] font-mono-tech px-2 py-0.5 rounded ${
                  meetsCert ? 'bg-[#00D284]/10 text-[#00D284]' : 'bg-red-500/10 text-red-400'
                }`}
              >
                {meetsCert ? 'SATISFIED' : 'UNMET'}
              </span>
            </div>
          </div>
        </div>

        {/* Contract Address Reference */}
        <div className="p-4 rounded-xl border border-[#1f2128] bg-[#0c0d10] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] font-mono-tech text-[#5e606e] block">
              Midnight Compact Contract Address
            </span>
            <code className="text-xs font-mono-tech text-[#00D284] break-all">{job.contractAddress}</code>
          </div>
          <a
            href={`https://preprod.midnightexplorer.com/contracts/${job.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#92939e] hover:text-[#f4f4f6] shrink-0"
          >
            <span>View Contract on Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Description & Responsibilities */}
      <div className="p-8 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-6">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#f4f4f6]">Role Overview</h2>
          <p className="text-xs sm:text-sm text-[#92939e] leading-relaxed">{job.description}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#f4f4f6]">Core Responsibilities</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-[#92939e]">
            {job.responsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#00D284] font-bold mt-0.5">•</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ProofGeneratorModal
        job={job}
        candidate={candidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};
