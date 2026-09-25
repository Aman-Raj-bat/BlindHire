import React from 'react';
import {
  FileText,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
  Code,
  ShieldAlert,
} from 'lucide-react';

export const DocsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-[#1f2128] pb-6 space-y-2">
        <span className="text-xs font-mono-tech uppercase text-[#00D284]">Protocol Reference</span>
        <h1 className="text-3xl font-extrabold text-[#f4f4f6]">BlindHire Documentation</h1>
        <p className="text-xs text-[#92939e]">
          Technical specification, contract API, circuit signatures, and developer workflow.
        </p>
      </div>

      {/* Trust Model Documentation */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[#f4f4f6] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Credential Trust Model</span>
        </h2>
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-xs text-[#92939e] space-y-2">
          <p className="font-semibold text-amber-300">
            Self-Attested Client Witnesses vs. Cryptographically Issued Credentials
          </p>
          <p className="leading-relaxed">
            BlindHire distinguishes between <strong>DEMO CREDENTIALS</strong> (self-attested inputs stored in local browser state) and <strong>ISSUED CREDENTIALS</strong> (credentials signed by institutional issuers such as universities or credential registries).
          </p>
          <p className="leading-relaxed">
            In development and hackathon demonstrations, the system honestly labels candidate inputs as demo credentials. The zero-knowledge mathematics and constraint evaluations remain identical.
          </p>
        </div>
      </section>

      {/* Contract Signatures */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[#f4f4f6] flex items-center gap-2">
          <Code className="w-4 h-4 text-[#00D284]" />
          <span>Compact Contract Interface</span>
        </h2>

        <div className="p-5 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-4 text-xs font-mono-tech">
          <div>
            <p className="text-[#5e606e]">Constructor Signature:</p>
            <pre className="text-[#f4f4f6] mt-1 p-3 rounded-lg bg-[#0c0d10] border border-[#1f2128] overflow-x-auto">
{`constructor(
    initial_min_gpa: Uint<32>,
    initial_min_experience_months: Uint<32>,
    initial_degree_code: Uint<32>,
    initial_cert_code: Uint<32>,
    recruiter_admin_hash: Bytes<32>,
    deadline: Uint<64>,
    applicant_limit: Uint<32>
)`}
            </pre>
          </div>

          <div>
            <p className="text-[#5e606e]">Circuit: prove_qualification</p>
            <pre className="text-[#00D284] mt-1 p-3 rounded-lg bg-[#0c0d10] border border-[#1f2128] overflow-x-auto">
{`export circuit prove_qualification(): []`}
            </pre>
            <p className="text-[11px] text-[#92939e] mt-1">
              Evaluates witness credentials against ledger thresholds; inserts nullifier and updates total qualified count.
            </p>
          </div>

          <div>
            <p className="text-[#5e606e]">Circuit: update_job_requirements</p>
            <pre className="text-[#a5b4fc] mt-1 p-3 rounded-lg bg-[#0c0d10] border border-[#1f2128] overflow-x-auto">
{`export circuit update_job_requirements(
    new_min_gpa: Uint<32>,
    new_min_experience_months: Uint<32>,
    new_degree_code: Uint<32>,
    new_cert_code: Uint<32>,
    new_deadline: Uint<64>,
    new_max_applicants: Uint<32>,
    new_active_status: Boolean
): []`}
            </pre>
          </div>
        </div>
      </section>

      {/* Developer Commands */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[#f4f4f6] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00D284]" />
          <span>Local Development & Testing</span>
        </h2>

        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215]">
            <p className="text-[#5e606e] mb-1"># Compile Compact contract and generate managed/ bindings:</p>
            <code className="text-[#00D284]">yarn compile</code>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215]">
            <p className="text-[#5e606e] mb-1"># Start local Midnight stack (proof-server, indexer, dev node):</p>
            <code className="text-[#00D284]">yarn env:up</code>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215]">
            <p className="text-[#5e606e] mb-1"># Execute Midnight integration test suite:</p>
            <code className="text-[#00D284]">yarn test:local</code>
          </div>

          <div className="p-4 rounded-xl border border-[#1f2128] bg-[#111215]">
            <p className="text-[#5e606e] mb-1"># Start frontend dev server:</p>
            <code className="text-[#00D284]">cd frontend &amp;&amp; npm run dev</code>
          </div>
        </div>
      </section>
    </div>
  );
};
