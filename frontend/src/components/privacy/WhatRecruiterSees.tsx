// [UI] Refined hover state outlines
import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatRecruiterSees: React.FC = () => {
  const [viewMode, setViewMode] = useState<'public' | 'private'>('public');

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-[#1f2128] bg-[#111215] overflow-hidden shadow-2xl">
      {/* Header with Perspective Switcher */}
      <div className="p-6 border-b border-[#1f2128] bg-[#14151a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono-tech tracking-wider uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
              Interactive Privacy Model
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[#f4f4f6] mt-1">
            What the Recruiter Sees
          </h3>
          <p className="text-xs text-[#92939e]">
            Toggle between the candidate&apos;s private reality and what the recruiter actually learns on-chain.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center bg-[#09090b] p-1 rounded-xl border border-[#1f2128] self-start sm:self-center">
          <button
            onClick={() => setViewMode('public')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'public'
                ? 'bg-[#1b1d24] text-[#00D284] shadow-sm'
                : 'text-[#92939e] hover:text-[#f4f4f6]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Recruiter View (Public / ZK)
          </button>
          <button
            onClick={() => setViewMode('private')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'private'
                ? 'bg-[#1b1d24] text-[#f4f4f6] shadow-sm'
                : 'text-[#92939e] hover:text-[#f4f4f6]'
            }`}
          >
            {viewMode === 'private' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Candidate Reality (Private)
          </button>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {viewMode === 'public' ? (
            <motion.div
              key="public-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Recruiter Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#00D284]/5 border border-[#00D284]/20 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00D284]/10 border border-[#00D284]/30 flex items-center justify-center text-[#00D284]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-xs text-[#00D284] font-semibold">Candidate #A91F</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/20 text-[#00D284]">
                        QUALIFIED
                      </span>
                    </div>
                    <p className="text-xs text-[#92939e] mt-0.5">
                      Nullifier commitment verified on Midnight Preprod • Zero sensitive data leaked
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono-tech text-[11px] text-[#5e606e]">
                  zk-proof: 0x3f7a...b912
                </div>
              </div>

              {/* Requirement Checklist: Exactly what the recruiter learns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#1f2128] bg-[#16171d] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#92939e]">Degree Requirement</p>
                    <p className="text-sm font-semibold text-[#f4f4f6] mt-0.5">Computer Science / IT</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono-tech bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-[#1f2128] bg-[#16171d] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#92939e]">Academic Threshold</p>
                    <p className="text-sm font-semibold text-[#f4f4f6] mt-0.5">GPA &ge; 7.50</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono-tech bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-[#1f2128] bg-[#16171d] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#92939e]">Experience Threshold</p>
                    <p className="text-sm font-semibold text-[#f4f4f6] mt-0.5">Experience &ge; 1 Year</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono-tech bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-[#1f2128] bg-[#16171d] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#92939e]">Certification</p>
                    <p className="text-sm font-semibold text-[#f4f4f6] mt-0.5">Node.js Certified Developer</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono-tech bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* What is Hidden from Recruiter */}
              <div className="p-4 rounded-xl border border-dashed border-[#282b36] bg-[#0c0d10]">
                <p className="text-xs font-mono-tech uppercase tracking-wider text-[#5e606e] mb-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Obscured From Recruiter (Zero-Knowledge Guarantee)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#14151a] border border-[#1f2128] text-center">
                    <span className="text-[#5e606e] block text-[11px]">Exact GPA</span>
                    <span className="font-mono-tech text-[#92939e] filter blur-[3px] select-none">8.72 / 10</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14151a] border border-[#1f2128] text-center">
                    <span className="text-[#5e606e] block text-[11px]">Exact Experience</span>
                    <span className="font-mono-tech text-[#92939e] filter blur-[3px] select-none">2.4 Years</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14151a] border border-[#1f2128] text-center">
                    <span className="text-[#5e606e] block text-[11px]">University Name</span>
                    <span className="font-mono-tech text-[#92939e] filter blur-[3px] select-none">IIT Bombay</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14151a] border border-[#1f2128] text-center">
                    <span className="text-[#5e606e] block text-[11px]">Applicant Name</span>
                    <span className="font-mono-tech text-[#92939e] filter blur-[3px] select-none">Aman Raj</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="private-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Private Candidate Banner */}
              <div className="p-4 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/25 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f4f4f6] text-sm">Aman Raj</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#6366f1]/20 text-[#a5b4fc]">
                      PRIVATE CREDENTIAL VAULT
                    </span>
                  </div>
                  <p className="text-xs text-[#92939e] mt-0.5">
                    aman.raj@example.com • Indian Institute of Technology (IIT)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono-tech text-[#a5b4fc]">Stored locally in private witness</span>
                </div>
              </div>

              {/* Private Values Unmasked */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-[#282b36] bg-[#14151a]">
                  <p className="text-xs text-[#92939e]">Exact GPA</p>
                  <p className="text-xl font-bold font-mono-tech text-[#f4f4f6] mt-1">8.70 <span className="text-xs text-[#5e606e]">/ 10</span></p>
                  <p className="text-[11px] text-[#00D284] mt-1">Exceeds 7.50 cutoff</p>
                </div>
                <div className="p-4 rounded-xl border border-[#282b36] bg-[#14151a]">
                  <p className="text-xs text-[#92939e]">Exact Experience</p>
                  <p className="text-xl font-bold font-mono-tech text-[#f4f4f6] mt-1">24 <span className="text-xs text-[#5e606e]">months</span></p>
                  <p className="text-[11px] text-[#00D284] mt-1">Exceeds 12mo cutoff</p>
                </div>
                <div className="p-4 rounded-xl border border-[#282b36] bg-[#14151a]">
                  <p className="text-xs text-[#92939e]">Institution</p>
                  <p className="text-sm font-semibold text-[#f4f4f6] mt-1 truncate">IIT Bombay</p>
                  <p className="text-[11px] text-[#5e606e] mt-1">Never sent on-chain</p>
                </div>
                <div className="p-4 rounded-xl border border-[#282b36] bg-[#14151a]">
                  <p className="text-xs text-[#92939e]">Certification ID</p>
                  <p className="text-sm font-semibold text-[#f4f4f6] mt-1 truncate">Node.js Cert #101</p>
                  <p className="text-[11px] text-[#00D284] mt-1">Direct match</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#1f2128] bg-[#0c0d10] text-xs text-[#92939e] flex items-center justify-between">
                <span>
                  The candidate chooses when to disclose their resume, email, or GitHub — only after qualification is proven.
                </span>
                <span className="font-mono-tech text-[#00D284] text-[11px]">Qualification &ne; Identity</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ZK Transformation Pipeline Footer */}
        <div className="mt-8 pt-6 border-t border-[#1f2128] flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech text-[#92939e]">
          <div className="flex items-center gap-2">
            <span className="text-[#f4f4f6]">Private Credentials</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00D284]" />
            <span className="text-[#a5b4fc]">Compact ZK Circuit</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00D284]" />
            <span className="text-[#00D284]">Verified Qualification Claim</span>
          </div>
          <span className="text-[#5e606e]">Midnight Network Preprod</span>
        </div>
      </div>
    </div>
  );
};
