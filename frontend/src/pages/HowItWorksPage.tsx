import React from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  FileCode,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PrivacyFlow3D } from '../components/3d/PrivacyFlow3D';
import { WhatRecruiterSees } from '../components/privacy/WhatRecruiterSees';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
          Cryptographic Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f4f4f6]">
          How BlindHire Works
        </h1>
        <p className="text-sm text-[#92939e]">
          The zero-knowledge candidate screening architecture powered by Midnight Network and Compact smart contracts.
        </p>
      </div>

      {/* 3D Privacy Flow */}
      <div className="p-8 rounded-3xl border border-[#1f2128] bg-[#111215] space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f2128] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#f4f4f6]">Interactive Privacy Flow Pipeline</h2>
            <p className="text-xs text-[#92939e]">
              Visualizing the transition from private witness state to verified public claim.
            </p>
          </div>
          <span className="text-xs font-mono-tech text-[#00D284]">3D SIMULATION</span>
        </div>
        <PrivacyFlow3D />
      </div>

      {/* The 4 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D284]/10 border border-[#00D284]/20 flex items-center justify-center text-[#00D284]">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#f4f4f6]">1. Private Witnesses (Client-Side)</h3>
          <p className="text-xs text-[#92939e] leading-relaxed">
            The candidate&apos;s actual GPA, degree code, work experience duration, and personal identifier are provided as witnesses. Witnesses are evaluated exclusively inside the prover on the client machine and are <strong>never written to the blockchain</strong>.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D284]/10 border border-[#00D284]/20 flex items-center justify-center text-[#00D284]">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#f4f4f6]">2. Compact ZK Circuits</h3>
          <p className="text-xs text-[#92939e] leading-relaxed">
            The <code>prove_qualification</code> circuit executes constraints on witness values: <code>assert(creds.gpa_scaled &ge; min_gpa)</code> and <code>assert(creds.experience_months &ge; min_experience_months)</code>. If all assertions hold, a cryptographic proof is generated.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D284]/10 border border-[#00D284]/20 flex items-center justify-center text-[#00D284]">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#f4f4f6]">3. Public Ledger State</h3>
          <p className="text-xs text-[#92939e] leading-relaxed">
            The public ledger stores only non-sensitive contract data: screening thresholds, anonymous nullifier sets (to stop duplicate applications), and the aggregate qualified applicant counter.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D284]/10 border border-[#00D284]/20 flex items-center justify-center text-[#00D284]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#f4f4f6]">4. Selective Identity Disclosure</h3>
          <p className="text-xs text-[#92939e] leading-relaxed">
            Qualification &ne; Identity. Once a candidate proves they are qualified, the recruiter can request identity disclosure. The candidate retains total agency to approve or decline sharing their name, email, and resume.
          </p>
        </div>
      </div>

      {/* Signature Component */}
      <WhatRecruiterSees />

      {/* Compact Contract Code Breakdown */}
      <div className="p-8 rounded-3xl border border-[#1f2128] bg-[#0c0d10] space-y-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#00D284]" />
          <h3 className="text-sm font-bold text-[#f4f4f6]">Compact Smart Contract Circuit Logic</h3>
        </div>
        <p className="text-xs text-[#92939e]">
          Excerpt from <code>contracts/blindhire.compact</code> demonstrating the mathematical screening assertions:
        </p>

        <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215] overflow-x-auto">
          <pre className="text-[11px] font-mono-tech text-[#92939e] leading-relaxed">
{`export circuit prove_qualification(): [] {
    // 1. Check job is open and within deadline
    assert(disclose(is_active), "Job screening is paused");
    assert(blockTimeLt(disclose(application_deadline)), "Application deadline has passed");

    // 2. Fetch private candidate credentials into ZK circuit
    const creds = candidate_credentials();

    // 3. Verify qualification thresholds in zero-knowledge
    assert(creds.gpa_scaled >= min_gpa, "Candidate GPA is below minimum threshold");
    assert(creds.experience_months >= min_experience_months, "Candidate experience is below minimum threshold");
    assert(creds.degree_code == required_degree_code, "Candidate degree does not match required degree");
    assert(creds.certification_code == required_certification_code, "Missing required certification");

    // 4. Derive anonymous nullifier to prevent double-qualification
    const nul = makeNullifier(creds.candidate_id);
    assert(!nullifiers.member(disclose(nul)), "Candidate has already submitted qualification proof");

    // 5. Update public state
    nullifiers.insert(disclose(nul));
    qualified_count = disclose((qualified_count + 1) as Uint<32>);
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
