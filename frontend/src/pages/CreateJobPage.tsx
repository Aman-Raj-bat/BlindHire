import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Save,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { JobListing, DEGREE_CODES, CERTIFICATION_CODES } from '../lib/types';
import { useToast } from '../contexts/ToastContext';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Midnight Engineering');
  const [department, setDepartment] = useState('Protocol & Systems');
  const [location, setLocation] = useState('Remote (Global)');
  const [salaryRange, setSalaryRange] = useState('$140,000 - $180,000');
  const [description, setDescription] = useState(
    'Seeking a verified software engineer to develop high-throughput privacy-preserving applications.',
  );
  const [minGpa, setMinGpa] = useState<number>(7.5);
  const [minExpMonths, setMinExpMonths] = useState<number>(12);
  const [degreeCode, setDegreeCode] = useState<number>(1);
  const [certCode, setCertCode] = useState<number>(101);
  const [applicantLimit, setApplicantLimit] = useState<number>(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('error', 'Missing Information', 'Please enter a job title.');
      return;
    }

    const newJob: JobListing = {
      id: `job-${Date.now()}`,
      title,
      company,
      department,
      location,
      type: 'Full-time',
      salaryRange,
      description,
      responsibilities: [
        'Collaborate on zero-knowledge circuit integrations',
        'Maintain high testing coverage and formal verification standards',
        'Respect end-to-end privacy invariants across all services',
      ],
      minGpa,
      minGpaScaled: BigInt(Math.round(minGpa * 100)),
      minExperienceMonths: BigInt(minExpMonths),
      requiredDegreeCode: BigInt(degreeCode),
      requiredCertificationCode: BigInt(certCode),
      contractAddress:
        storage.getDeployedContractAddress() ||
        '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      deadlineUnix: BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60),
      isActive: true,
      qualifiedCount: 0,
      maxApplicants: applicantLimit,
      isContractBacked: true,
    };

    storage.saveJob(newJob);
    addToast('success', 'Screening Role Published!', 'Job requirements deployed to marketplace.');
    navigate('/recruiter');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        to="/recruiter"
        className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#92939e] hover:text-[#f4f4f6] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Recruiter Portal</span>
      </Link>

      {/* Header */}
      <div className="border-b border-[#1f2128] pb-6">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20">
            Smart Contract Screening Criteria
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f4f6] mt-1">
          Create Privacy-Screened Job
        </h1>
        <p className="text-xs text-[#92939e] mt-1">
          Define mathematical qualification criteria enforced by Midnight ZK circuits.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-4">
          <h2 className="text-sm font-bold text-[#f4f4f6]">Role Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-[#92939e] block mb-1.5">Role Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Systems Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">Company / Protocol</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">Compensation Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-[#92939e] block mb-1.5">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>
          </div>
        </div>

        {/* Screening Criteria */}
        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1f2128] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#00D284]" />
            <h2 className="text-sm font-bold text-[#f4f4f6]">
              Zero-Knowledge Verification Criteria
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Required Degree / Field
              </label>
              <select
                value={degreeCode}
                onChange={(e) => setDegreeCode(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              >
                {Object.entries(DEGREE_CODES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Minimum Cumulative GPA Threshold
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minGpa}
                onChange={(e) => setMinGpa(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Minimum Professional Experience (Months)
              </label>
              <input
                type="number"
                min="0"
                max="240"
                value={minExpMonths}
                onChange={(e) => setMinExpMonths(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Required Certification
              </label>
              <select
                value={certCode}
                onChange={(e) => setCertCode(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              >
                {Object.entries(CERTIFICATION_CODES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all shadow-[0_0_20px_rgba(0,210,132,0.2)]"
        >
          <Save className="w-4 h-4" />
          <span>Publish Role to Screening Contract</span>
        </button>
      </form>
    </div>
  );
};
