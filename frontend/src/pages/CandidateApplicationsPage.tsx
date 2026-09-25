import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { ApplicationRecord } from '../lib/types';
import { useToast } from '../contexts/ToastContext';

export const CandidateApplicationsPage: React.FC = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState<ApplicationRecord[]>(storage.getApplications());
  const profile = storage.getCandidateProfile();

  const handleApproveDisclosure = (appId: string) => {
    storage.updateDisclosureStatus(appId, 'granted', {
      fullName: profile.fullName,
      email: profile.email,
      githubUrl: profile.githubUrl,
      portfolioUrl: profile.portfolioUrl,
      universityName: profile.universityName,
    });
    setApplications(storage.getApplications());
    addToast('success', 'Disclosure Granted', 'Recruiter can now view your contact details.');
  };

  const handleDeclineDisclosure = (appId: string) => {
    storage.updateDisclosureStatus(appId, 'declined');
    setApplications(storage.getApplications());
    addToast('info', 'Disclosure Declined', 'Your identity remains 100% anonymous.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2128] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
              Zero-Knowledge Applications
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f4f6] mt-1">
            My Screening Applications
          </h1>
          <p className="text-xs text-[#92939e] mt-1">
            Review proof submissions, inspect on-chain nullifier commitments, and manage identity disclosure requests.
          </p>
        </div>

        <Link
          to="/jobs"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all self-start sm:self-center"
        >
          <span>Screen for Another Role</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-[#1f2128] bg-[#111215] text-center space-y-3">
            <Lock className="w-8 h-8 text-[#5e606e] mx-auto" />
            <h3 className="text-sm font-semibold text-[#f4f4f6]">No active applications yet</h3>
            <p className="text-xs text-[#92939e] max-w-sm mx-auto">
              Select any role on the marketplace to generate your first zero-knowledge qualification proof.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00D284] text-[#09090b] mt-2"
            >
              Browse Roles
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-5"
            >
              {/* Application Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2128] pb-4">
                <div>
                  <span className="text-[11px] font-mono-tech text-[#5e606e] uppercase">
                    Role Benchmark Proof
                  </span>
                  <h3 className="text-base font-bold text-[#f4f4f6] mt-0.5">{app.jobTitle}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#92939e] mt-1 font-mono-tech">
                    <span>{app.candidateAnonymousId}</span>
                    <span>•</span>
                    <span>Applied {app.appliedDate}</span>
                    {app.isDemoData && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        DEMO DATA
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tech font-semibold bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    QUALIFIED
                  </span>
                </div>
              </div>

              {/* Requirement-Level Verification Checkmark Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
                  <span className="text-[#92939e]">Degree Match</span>
                  <span className="text-[#00D284] font-semibold">✓ VERIFIED</span>
                </div>
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
                  <span className="text-[#92939e]">GPA Threshold</span>
                  <span className="text-[#00D284] font-semibold">✓ VERIFIED</span>
                </div>
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
                  <span className="text-[#92939e]">Experience</span>
                  <span className="text-[#00D284] font-semibold">✓ VERIFIED</span>
                </div>
                <div className="p-3 rounded-xl border border-[#1f2128] bg-[#14151a] flex items-center justify-between">
                  <span className="text-[#92939e]">Certification</span>
                  <span className="text-[#00D284] font-semibold">✓ VERIFIED</span>
                </div>
              </div>

              {/* Selective Disclosure Panel */}
              <div className="p-4 rounded-xl border border-[#1f2128] bg-[#0c0d10] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech uppercase text-[#5e606e]">
                    Identity Disclosure Status
                  </span>
                  {app.disclosureStatus === 'granted' && (
                    <span className="inline-flex items-center gap-1 text-xs text-sky-400 font-mono-tech">
                      <UserCheck className="w-3.5 h-3.5" />
                      Disclosed with Consent
                    </span>
                  )}
                  {app.disclosureStatus === 'declined' && (
                    <span className="text-xs text-[#5e606e] font-mono-tech">
                      Disclosure Declined (Anonymous)
                    </span>
                  )}
                  {app.disclosureStatus === 'none' && (
                    <span className="text-xs text-[#00D284] font-mono-tech">
                      100% Shielded (No Requests)
                    </span>
                  )}
                </div>

                {app.disclosureStatus === 'requested' && (
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-amber-300">
                        The recruiter has reviewed your qualification and requested your identity!
                      </p>
                      <p className="text-[#92939e] text-[11px] mt-0.5">
                        Would you like to disclose your name, email, and GitHub to proceed to direct interview?
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveDisclosure(app.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00D284] text-[#09090b] hover:bg-[#00b872]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleDeclineDisclosure(app.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#92939e] hover:text-red-400 bg-[#14151a] border border-[#22252b]"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Keep Anonymous</span>
                      </button>
                    </div>
                  </div>
                )}

                {app.disclosureStatus === 'granted' && app.disclosedIdentity && (
                  <div className="p-3 rounded-lg border border-[#1f2128] bg-[#14151a] text-xs text-[#92939e] grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[#5e606e] block text-[10px]">Candidate Name</span>
                      <span className="text-[#f4f4f6] font-medium">{app.disclosedIdentity.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[#5e606e] block text-[10px]">Contact</span>
                      <span className="text-[#f4f4f6] font-medium">{app.disclosedIdentity.email}</span>
                    </div>
                    <div>
                      <span className="text-[#5e606e] block text-[10px]">GitHub</span>
                      <a
                        href={app.disclosedIdentity.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00D284] hover:underline"
                      >
                        {app.disclosedIdentity.githubUrl}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[#1a1b22] flex items-center justify-between text-[11px] font-mono-tech text-[#5e606e]">
                  <span>Tx Hash: {app.txHash.slice(0, 18)}...</span>
                  <a
                    href={`https://preprod.midnightexplorer.com`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#f4f4f6]"
                  >
                    <span>Explorer Verification</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
