// [Style] Responsive mobile cards
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { JobListing, DEGREE_CODES, CERTIFICATION_CODES } from '../lib/types';
import { ProofGeneratorModal } from '../components/candidate/ProofGeneratorModal';

interface JobsPageProps {
  isDemoMode: boolean;
}

export const JobsPage: React.FC<JobsPageProps> = ({ isDemoMode }) => {
  const [jobs, setJobs] = useState<JobListing[]>(storage.getJobs());
  const [candidate] = useState(storage.getCandidateProfile());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegreeFilter, setSelectedDegreeFilter] = useState<number | 'all'>('all');
  const [activeJobForProof, setActiveJobForProof] = useState<JobListing | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDegree =
      selectedDegreeFilter === 'all' || Number(job.requiredDegreeCode) === selectedDegreeFilter;

    return matchesSearch && matchesDegree;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2128] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
              Zero-Knowledge Screening Marketplace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f4f6] mt-1">
            Open Privacy-Screened Roles
          </h1>
          <p className="text-xs text-[#92939e] mt-1">
            Prove qualification directly against on-chain smart contract criteria without submitting resumes.
          </p>
        </div>

        <Link
          to="/candidate/credentials"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#14151a] hover:bg-[#1b1d24] text-[#f4f4f6] border border-[#22252b] transition-all self-start sm:self-center"
        >
          <Lock className="w-3.5 h-3.5 text-[#00D284]" />
          <span>My Credential Vault</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e606e]" />
          <input
            type="text"
            placeholder="Search by role title, company, or requirement keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1f2128] bg-[#111215] text-xs text-[#f4f4f6] placeholder-[#5e606e] focus:border-[#00D284] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5e606e] hidden sm:block" />
          <select
            value={selectedDegreeFilter}
            onChange={(e) =>
              setSelectedDegreeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#111215] text-xs text-[#f4f4f6] focus:border-[#00D284] transition-all"
          >
            <option value="all">All Fields of Study</option>
            {Object.entries(DEGREE_CODES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          // Compare with local candidate credentials in real-time
          const meetsGpa = candidate.gpa >= job.minGpa;
          const meetsExp = candidate.experienceMonths >= Number(job.minExperienceMonths);
          const meetsDegree = candidate.degreeCode === Number(job.requiredDegreeCode);
          const meetsCert =
            job.requiredCertificationCode === 0n ||
            candidate.certificationCode === Number(job.requiredCertificationCode);
          const isEligible = meetsGpa && meetsExp && meetsDegree && meetsCert;

          return (
            <div
              key={job.id}
              className="flex flex-col justify-between p-6 rounded-2xl border border-[#1f2128] bg-[#111215] hover:border-[#2e323d] transition-all group space-y-5"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-tech text-[#5e606e] uppercase">{job.company}</span>
                    <h3 className="text-base font-bold text-[#f4f4f6] group-hover:text-[#00D284] transition-colors">
                      {job.title}
                    </h3>
                  </div>
                  {job.isContractBacked && (
                    <span className="shrink-0 p-1.5 rounded-lg bg-[#00D284]/10 border border-[#00D284]/20 text-[#00D284]" title="On-Chain Compact Smart Contract">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] text-[#92939e]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#14151a] border border-[#1f2128]">
                    <MapPin className="w-3 h-3 text-[#5e606e]" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#14151a] border border-[#1f2128]">
                    <Clock className="w-3 h-3 text-[#5e606e]" />
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-[#92939e] line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Screening Thresholds */}
                <div className="p-3.5 rounded-xl border border-[#1a1b22] bg-[#0c0d10] space-y-2">
                  <span className="text-[10px] font-mono-tech uppercase text-[#5e606e] tracking-wider block">
                    Screening Criteria
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                    <div className="flex items-center justify-between text-[#92939e]">
                      <span>GPA:</span>
                      <span className="text-[#f4f4f6]">&ge; {job.minGpa.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#92939e]">
                      <span>Exp:</span>
                      <span className="text-[#f4f4f6]">&ge; {Number(job.minExperienceMonths)}mo</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between text-[#92939e]">
                      <span>Cert:</span>
                      <span className="text-[#f4f4f6] truncate max-w-[150px]">
                        {CERTIFICATION_CODES[Number(job.requiredCertificationCode)] || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#1f2128] flex items-center gap-2">
                <button
                  onClick={() => setActiveJobForProof(job)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all shadow-[0_0_15px_rgba(0,210,132,0.15)]"
                >
                  <span>Prove Qualification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <Link
                  to={`/jobs/${job.id}`}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium text-[#92939e] hover:text-[#f4f4f6] bg-[#14151a] hover:bg-[#1a1b22] border border-[#1f2128] transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Proving */}
      {activeJobForProof && (
        <ProofGeneratorModal
          job={activeJobForProof}
          candidate={candidate}
          isOpen={!!activeJobForProof}
          onClose={() => setActiveJobForProof(null)}
          isDemoMode={isDemoMode}
        />
      )}
    </div>
  );
};
