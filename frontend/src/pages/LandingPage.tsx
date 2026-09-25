import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  EyeOff,
  UserCheck,
  CheckCircle2,
  FileText,
  Terminal,
  Cpu,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ZKCredentialVault3D } from '../components/3d/ZKCredentialVault3D';
import { PrivacyFlow3D } from '../components/3d/PrivacyFlow3D';
import { WhatRecruiterSees } from '../components/privacy/WhatRecruiterSees';
import { ProofGeneratorModal } from '../components/candidate/ProofGeneratorModal';
import { INITIAL_JOBS, DEFAULT_DEMO_CANDIDATE } from '../lib/mockData';

interface LandingPageProps {
  isDemoMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isDemoMode }) => {
  const [selectedDemoJob, setSelectedDemoJob] = useState(INITIAL_JOBS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-24 pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#22252B] bg-[#121316] text-xs font-mono-tech text-[#92939e]">
                <span className="w-2 h-2 rounded-full bg-[#00D284] animate-pulse" />
                <span>Zero-Knowledge Candidate Screening on Midnight</span>
              </div>

              {/* Major Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f4f4f6] leading-[1.1]">
                Qualified before <br />
                <span className="text-[#00D284]">identified.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#92939e] max-w-xl leading-relaxed">
                Prove you satisfy degree, GPA, experience, and certification criteria
                without revealing your underlying private credentials, university, or identity.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/jobs"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all shadow-[0_0_25px_rgba(0,210,132,0.25)]"
                >
                  <span>Explore Open Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#14151a] hover:bg-[#1b1d24] text-[#f4f4f6] border border-[#22252b] transition-all"
                >
                  <span>How Privacy Works</span>
                </Link>
              </div>

              {/* Technical Trust Strip */}
              <div className="pt-6 border-t border-[#1f2128] flex flex-wrap items-center gap-6 text-xs font-mono-tech text-[#5e606e]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D284]" />
                  <span>Compact 0.5.2 Smart Contract</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D284]" />
                  <span>Client-Side Proving</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D284]" />
                  <span>Double-Claim Nullifier Shield</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Credential Vault Scene */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[440px] rounded-3xl border border-[#1f2128] bg-gradient-to-b from-[#111215] to-[#0c0d10] p-2 shadow-2xl flex flex-col items-center justify-center">
                {/* 3D Canvas */}
                <ZKCredentialVault3D />

                {/* Subtle Floating Node Description */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#09090b]/80 backdrop-blur-md border border-[#1f2128] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#00D284]" />
                    <span className="text-[#92939e]">Private Credential Vault</span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#00D284]">SHIELDED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE PROBLEM VS THE BLINDHIRE MODEL                                     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono-tech uppercase tracking-wider text-[#00D284]">
            Screening Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f4f4f6]">
            Traditional Hiring Demands Over-Disclosure
          </h2>
          <p className="text-sm text-[#92939e]">
            Recruiters only need to know if a candidate satisfies the threshold. But legacy pipelines force candidates to surrender their entire identity upfront.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Broken Model */}
          <div className="p-8 rounded-2xl border border-red-500/20 bg-[#120f12] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech uppercase text-red-400 font-semibold tracking-wider">
                The Broken Status Quo
              </span>
              <EyeOff className="w-5 h-5 text-red-400" />
            </div>

            <div className="space-y-4 text-xs font-mono-tech">
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-300">
                PRIVATE DATA (Full Name, GPA, University, Address, Age, Gender)
              </div>
              <div className="text-center text-red-500 font-bold">&darr;</div>
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-300">
                OVER-DISCLOSURE (Recruiter sees non-relevant personal details)
              </div>
              <div className="text-center text-red-500 font-bold">&darr;</div>
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-300">
                UNCONSCIOUS BIAS & DATA RESALE (Leaks, scraping, discrimination)
              </div>
            </div>

            <p className="text-xs text-[#92939e] leading-relaxed">
              Resumes leak demographic indicators and exact grades long before qualification is established. Recruiters reject qualified candidates based on peripheral data.
            </p>
          </div>

          {/* The BlindHire Model */}
          <div className="p-8 rounded-2xl border border-[#00D284]/30 bg-[#0f1713] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech uppercase text-[#00D284] font-semibold tracking-wider">
                The BlindHire Model
              </span>
              <ShieldCheck className="w-5 h-5 text-[#00D284]" />
            </div>

            <div className="space-y-4 text-xs font-mono-tech">
              <div className="p-3.5 rounded-xl border border-[#00D284]/20 bg-[#00D284]/5 text-[#f4f4f6]">
                PRIVATE CREDENTIAL (Shielded in local witness)
              </div>
              <div className="text-center text-[#00D284] font-bold">&darr;</div>
              <div className="p-3.5 rounded-xl border border-[#00D284]/20 bg-[#00D284]/5 text-[#00D284]">
                ZERO-KNOWLEDGE PROOF (Compact circuit proves GPA &ge; threshold)
              </div>
              <div className="text-center text-[#00D284] font-bold">&darr;</div>
              <div className="p-3.5 rounded-xl border border-[#00D284]/20 bg-[#00D284]/5 text-[#f4f4f6]">
                QUALIFICATION &ne; IDENTITY (Candidate controls selective disclosure)
              </div>
            </div>

            <p className="text-xs text-[#92939e] leading-relaxed">
              Candidates prove competence first. Recruiters evaluate pure technical qualification. Identity disclosure is an intentional, candidate-consented step.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE COMPONENT: WHAT THE RECRUITER SEES                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhatRecruiterSees />
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE INTERACTIVE DEMONSTRATION SECTION                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-[#1f2128] bg-[#111215] space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2128] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                <Sparkles className="w-3 h-3" />
                Live Zero-Knowledge Demonstration
              </div>
              <h3 className="text-xl font-bold text-[#f4f4f6]">Try Proving Qualification Right Now</h3>
              <p className="text-xs text-[#92939e] mt-1">
                Experience the 5-step Zero-Knowledge circuit execution with demo credentials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-tech text-[#5e606e]">Test Candidate:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#17181d] border border-[#22252b] text-xs font-mono-tech text-[#f4f4f6]">
                Aman Raj (GPA 8.7 • 24mo Exp)
              </span>
            </div>
          </div>

          {/* Job Demonstration Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl border border-[#22252b] bg-[#14151a]">
            <div className="md:col-span-8 space-y-3">
              <span className="text-[11px] font-mono-tech text-[#00D284] uppercase">Role Benchmark</span>
              <h4 className="text-lg font-bold text-[#f4f4f6]">{selectedDemoJob.title}</h4>
              <p className="text-xs text-[#92939e]">{selectedDemoJob.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-lg bg-[#0f1013] border border-[#1f2128]">
                  <span className="text-[10px] text-[#5e606e] block">Field</span>
                  <span className="text-xs font-mono-tech text-[#f4f4f6]">CS / IT</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0f1013] border border-[#1f2128]">
                  <span className="text-[10px] text-[#5e606e] block">Min GPA</span>
                  <span className="text-xs font-mono-tech text-[#f4f4f6]">&ge; 7.50</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0f1013] border border-[#1f2128]">
                  <span className="text-[10px] text-[#5e606e] block">Min Experience</span>
                  <span className="text-xs font-mono-tech text-[#f4f4f6]">&ge; 12 months</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0f1013] border border-[#1f2128]">
                  <span className="text-[10px] text-[#5e606e] block">Certification</span>
                  <span className="text-xs font-mono-tech text-[#f4f4f6]">Node.js</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-[#111215] border border-[#1f2128] text-center space-y-3">
              <span className="text-[11px] text-[#92939e]">Ready to generate ZK proof?</span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all shadow-[0_0_20px_rgba(0,210,132,0.2)]"
              >
                <span>Generate Qualification Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono-tech text-[#5e606e]">Witness will not expose 8.70 GPA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DUAL AUDIENCE VALUE: FOR CANDIDATES & FOR RECRUITERS                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Candidates */}
          <div className="p-8 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-6">
            <div className="w-10 h-10 rounded-xl bg-[#00D284]/10 border border-[#00D284]/30 flex items-center justify-center text-[#00D284]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f4f4f6]">For Candidates</h3>
              <p className="text-xs text-[#92939e] mt-1">Ownership of credentials and complete screening privacy.</p>
            </div>
            <ul className="space-y-3 text-xs text-[#92939e]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00D284] shrink-0 mt-0.5" />
                <span><strong className="text-[#f4f4f6]">Private Credential Vault:</strong> Store degrees, grades, and certificates locally in encrypted witness state.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00D284] shrink-0 mt-0.5" />
                <span><strong className="text-[#f4f4f6]">Zero Demographic Leakage:</strong> Prevent recruiter bias before your competence is proven.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00D284] shrink-0 mt-0.5" />
                <span><strong className="text-[#f4f4f6]">User-Consented Disclosure:</strong> You choose if and when to reveal your resume or GitHub after qualifying.</span>
              </li>
            </ul>
            <Link
              to="/candidate"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00D284] hover:underline"
            >
              <span>Open Candidate Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* For Recruiters */}
          <div className="p-8 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-6">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f4f4f6]">For Recruiters</h3>
              <p className="text-xs text-[#92939e] mt-1">Zero resume fraud, guaranteed mathematical qualification.</p>
            </div>
            <ul className="space-y-3 text-xs text-[#92939e]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#818cf8] shrink-0 mt-0.5" />
                <span><strong className="text-[#f4f4f6]">Cryptographically Verified Screening:</strong> Zero fake credentials or inflated resumes can satisfy the ZK circuit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#818cf8] shrink-0 mt-0.5" />
                <span><strong className="text-[#f4f4f6]">Bias-Free Pipeline:</strong> Focus exclusively on confirmed requirement satisfyability.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#818cf8] shrink-0 mt-0.5" />
                <span><strong className="text-[#f4f4f6]">Consent-Based Disclosure:</strong> Request full identities from only candidates who meet all criteria.</span>
              </li>
            </ul>
            <Link
              to="/recruiter"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#818cf8] hover:underline"
            >
              <span>Access Recruiter Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TECHNOLOGY STACK                                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-[#1f2128] bg-[#0c0d10] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono-tech uppercase text-[#00D284]">Under the Hood</span>
              <h3 className="text-xl font-bold text-[#f4f4f6] mt-1">Built on Midnight Network</h3>
            </div>
            <div className="text-xs font-mono-tech text-[#5e606e]">
              Preprod Network Verified
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215]">
              <Cpu className="w-5 h-5 text-[#00D284] mb-2" />
              <p className="text-xs font-semibold text-[#f4f4f6]">Compact Smart Contract</p>
              <p className="text-[11px] text-[#92939e] mt-1">Formal language version &ge; 0.22 with persistentHash nullifiers.</p>
            </div>
            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215]">
              <Lock className="w-5 h-5 text-[#00D284] mb-2" />
              <p className="text-xs font-semibold text-[#f4f4f6]">Private Witnesses</p>
              <p className="text-[11px] text-[#92939e] mt-1">Sensitive GPA & credentials never leave the browser.</p>
            </div>
            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#00D284]/10 border-[#00D284]/30">
              <Layers className="w-5 h-5 text-[#00D284] mb-2" />
              <p className="text-xs font-semibold text-[#f4f4f6]">Public Ledger</p>
              <p className="text-[11px] text-[#92939e] mt-1">Stores only anonymous nullifier sets & verification counters.</p>
            </div>
            <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215]">
              <Terminal className="w-5 h-5 text-[#00D284] mb-2" />
              <p className="text-xs font-semibold text-[#f4f4f6]">Lace & 1AM Wallet</p>
              <p className="text-[11px] text-[#92939e] mt-1">Standardized Midnight DApp connector integration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Modal */}
      <ProofGeneratorModal
        job={selectedDemoJob}
        candidate={DEFAULT_DEMO_CANDIDATE}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDemoMode={true}
      />
    </div>
  );
};
