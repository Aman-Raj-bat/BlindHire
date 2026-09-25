// [Perf] Memoized candidate tabs
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Layers,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { DEGREE_CODES, CERTIFICATION_CODES } from '../lib/types';

export const CandidateDashboardPage: React.FC = () => {
  const [profile] = useState(storage.getCandidateProfile());
  const [applications] = useState(storage.getApplications());

  const qualifiedCount = applications.filter((a) => a.status === 'qualified').length;
  const disclosuresGranted = applications.filter((a) => a.disclosureStatus === 'granted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2128] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
              Candidate Screening Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f4f6] mt-1">
            Candidate Dashboard
          </h1>
          <p className="text-xs text-[#92939e] mt-1">
            Manage your shielded credentials, monitor zero-knowledge proofs, and control disclosure requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/candidate/credentials"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#14151a] hover:bg-[#1a1b22] text-[#f4f4f6] border border-[#22252b] transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-[#00D284]" />
            <span>Manage Credential Vault</span>
          </Link>
          <Link
            to="/jobs"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all"
          >
            <span>Browse Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#92939e]">Credential Vault</span>
            <Lock className="w-4 h-4 text-[#00D284]" />
          </div>
          <p className="text-2xl font-bold font-mono-tech text-[#f4f4f6]">4 Credentials</p>
          <p className="text-[11px] text-[#00D284]">100% Shielded Locally</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#92939e]">Active Proofs</span>
            <ShieldCheck className="w-4 h-4 text-[#00D284]" />
          </div>
          <p className="text-2xl font-bold font-mono-tech text-[#f4f4f6]">{applications.length}</p>
          <p className="text-[11px] text-[#92939e]">{qualifiedCount} roles qualified</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#92939e]">Public Disclosures</span>
            <UserCheck className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono-tech text-[#f4f4f6]">{disclosuresGranted}</p>
          <p className="text-[11px] text-[#92939e]">Candidate-consented</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#92939e]">Trust Level</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold font-mono-tech text-[#f4f4f6] mt-1">
            {profile.isDemoCredential ? 'DEMO CREDENTIAL' : 'VERIFIED ISSUER'}
          </p>
          <p className="text-[11px] text-[#5e606e] truncate">{profile.credentialIssuer}</p>
        </div>
      </div>

      {/* Your Qualification Profile Snapshot */}
      <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-5">
        <div className="flex items-center justify-between border-b border-[#1f2128] pb-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#00D284]" />
            <h2 className="text-sm font-bold text-[#f4f4f6]">Your Private Qualification Profile</h2>
          </div>
          <span className="text-xs font-mono-tech text-[#5e606e]">
            Evaluated in zero-knowledge • Never stored on public ledger
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-tech">
          <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#14151a]">
            <span className="text-[#5e606e] block text-[11px]">Degree / Major</span>
            <span className="text-[#f4f4f6] font-semibold mt-1 block truncate">
              {DEGREE_CODES[profile.degreeCode]}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#14151a]">
            <span className="text-[#5e606e] block text-[11px]">Grade Point Average (GPA)</span>
            <span className="text-[#f4f4f6] font-semibold mt-1 block">
              {profile.gpa.toFixed(2)} / 10.0
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#14151a]">
            <span className="text-[#5e606e] block text-[11px]">Professional Experience</span>
            <span className="text-[#f4f4f6] font-semibold mt-1 block">
              {profile.experienceMonths} months ({(profile.experienceMonths / 12).toFixed(1)} yrs)
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#14151a]">
            <span className="text-[#5e606e] block text-[11px]">Certified Credential</span>
            <span className="text-[#f4f4f6] font-semibold mt-1 block truncate">
              {CERTIFICATION_CODES[profile.certificationCode]}
            </span>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#f4f4f6]">Active Screening Applications</h2>
          <Link to="/candidate/applications" className="text-xs text-[#00D284] hover:underline font-mono-tech">
            View All Applications &rarr;
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#1f2128] bg-[#111215]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#1f2128] bg-[#14151a] font-mono-tech text-[#5e606e]">
              <tr>
                <th className="py-3.5 px-4 font-medium">Role Title</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium">Anonymous ID</th>
                <th className="py-3.5 px-4 font-medium">Disclosure Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2128]">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#14151a]/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#f4f4f6]">
                    {app.jobTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      QUALIFIED
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono-tech text-[#92939e]">
                    {app.candidateAnonymousId}
                  </td>
                  <td className="py-3.5 px-4">
                    {app.disclosureStatus === 'granted' && (
                      <span className="text-sky-400 font-mono-tech text-[11px]">Disclosed to Recruiter</span>
                    )}
                    {app.disclosureStatus === 'requested' && (
                      <span className="text-amber-400 font-mono-tech text-[11px] animate-pulse">
                        Disclosure Requested
                      </span>
                    )}
                    {app.disclosureStatus === 'none' && (
                      <span className="text-[#5e606e] font-mono-tech text-[11px]">100% Shielded</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-tech text-[#5e606e]">
                    {app.appliedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
