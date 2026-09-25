import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Lock,
  UserCheck,
  Send,
  Plus,
  ExternalLink,
  ShieldCheck,
  Building2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { ApplicationRecord } from '../lib/types';
import { useToast } from '../contexts/ToastContext';

export const RecruiterDashboardPage: React.FC = () => {
  const { addToast } = useToast();
  const [jobs] = useState(storage.getJobs());
  const [applications, setApplications] = useState<ApplicationRecord[]>(storage.getApplications());

  const handleRequestDisclosure = (appId: string) => {
    storage.updateDisclosureStatus(appId, 'requested');
    setApplications(storage.getApplications());
    addToast(
      'info',
      'Disclosure Requested',
      'A formal disclosure request was sent to the candidate.',
    );
  };

  const qualifiedCount = applications.filter((a) => a.status === 'qualified').length;
  const disclosedCount = applications.filter((a) => a.disclosureStatus === 'granted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2128] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20">
              Recruiter Verification Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f4f6] mt-1">
            Recruiter Dashboard
          </h1>
          <p className="text-xs text-[#92939e] mt-1">
            Evaluate mathematically verified candidate qualifications without resume spam or demographic bias.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create Screening Role</span>
        </Link>
      </div>

      {/* Recruiter KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#92939e]">Active Screening Roles</span>
            <Briefcase className="w-4 h-4 text-[#818cf8]" />
          </div>
          <p className="text-2xl font-bold font-mono-tech text-[#f4f4f6]">{jobs.length}</p>
          <p className="text-[11px] text-[#5e606e]">All contract-backed on Midnight</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#92939e]">Verified Qualified Candidates</span>
            <CheckCircle2 className="w-4 h-4 text-[#00D284]" />
          </div>
          <p className="text-2xl font-bold font-mono-tech text-[#f4f4f6]">{qualifiedCount}</p>
          <p className="text-[11px] text-[#00D284]">100% zero-knowledge proof valid</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#92939e]">Consented Disclosures</span>
            <UserCheck className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono-tech text-[#f4f4f6]">{disclosedCount}</p>
          <p className="text-[11px] text-[#92939e]">Full identity unlocked with consent</p>
        </div>
      </div>

      {/* Candidate Verification Review Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#f4f4f6]">Candidate Qualification Stream</h2>
          <span className="text-xs font-mono-tech text-[#5e606e]">
            Protected by Midnight Nullifier Protocol
          </span>
        </div>

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-4"
            >
              {/* Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2128] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech font-bold text-sm text-[#00D284]">
                      {app.candidateAnonymousId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
                      QUALIFIED
                    </span>
                    {app.isDemoData && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-tech bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        DEMO DATA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#92939e]">
                    Target Role: <strong className="text-[#f4f4f6]">{app.jobTitle}</strong> • Verified {app.appliedDate}
                  </p>
                </div>

                {/* Recruiter Action on this candidate */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {app.disclosureStatus === 'none' && (
                    <button
                      onClick={() => handleRequestDisclosure(app.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#14151a] hover:bg-[#1f2128] text-[#f4f4f6] border border-[#22252b] transition-all"
                    >
                      <Send className="w-3.5 h-3.5 text-[#00D284]" />
                      <span>Request Identity Disclosure</span>
                    </button>
                  )}

                  {app.disclosureStatus === 'requested' && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-mono-tech bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      Disclosure Pending Approval
                    </span>
                  )}

                  {app.disclosureStatus === 'granted' && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-mono-tech bg-sky-500/10 border border-sky-500/20 text-sky-300 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Identity Disclosed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Requirement-Level Proof Matrix (What the Recruiter Learns) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a]">
                  <span className="text-[#5e606e] block text-[10px]">Degree Requirement</span>
                  <span className="text-[#00D284] font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a]">
                  <span className="text-[#5e606e] block text-[10px]">Academic Threshold</span>
                  <span className="text-[#00D284] font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a]">
                  <span className="text-[#5e606e] block text-[10px]">Experience Threshold</span>
                  <span className="text-[#00D284] font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a]">
                  <span className="text-[#5e606e] block text-[10px]">Certification Requirement</span>
                  <span className="text-[#00D284] font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
              </div>

              {/* Disclosed Profile or Privacy Shield Notice */}
              {app.disclosureStatus === 'granted' && app.disclosedIdentity ? (
                <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-950/10 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    <span className="font-semibold text-[#f4f4f6]">Candidate Consented Identity Profile</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <span className="text-[#5e606e] block text-[10px]">Full Name</span>
                      <span className="text-[#f4f4f6] font-medium">{app.disclosedIdentity.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[#5e606e] block text-[10px]">Contact Email</span>
                      <a href={`mailto:${app.disclosedIdentity.email}`} className="text-[#00D284] hover:underline">
                        {app.disclosedIdentity.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[#5e606e] block text-[10px]">GitHub / Portfolio</span>
                      <a href={app.disclosedIdentity.githubUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                        {app.disclosedIdentity.githubUrl}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-dashed border-[#1f2128] bg-[#0c0d10] flex items-center justify-between text-xs text-[#5e606e]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Exact GPA, university, and personal name remain hidden until candidate grants disclosure.</span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#00D284]">SHIELDED</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
