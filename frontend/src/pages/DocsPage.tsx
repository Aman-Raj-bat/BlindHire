import React from 'react';
import { Code2, FileCode, Lock, ShieldAlert, Terminal } from 'lucide-react';

export const DocsPage: React.FC = () => {
  return (
    <div className="world-page"><div className="world-container max-w-5xl">
      <header className="world-page-header"><div><p className="world-section-kicker">Protocol reference / open by design</p><h1 className="world-page-title">Read the<br />boundary.</h1><p className="world-page-description">The technical map for BlindHire: where witnesses live, what Compact proves, and what Midnight is allowed to remember.</p></div><span className="world-badge is-good"><Lock size={11} aria-hidden="true" /> zero leakage model</span></header>
      <section className="mt-8 grid gap-4 md:grid-cols-3"><article className="world-card p-6"><ShieldAlert size={19} className="text-[#d94d35]" aria-hidden="true" /><h2 className="mt-8 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.05em]">Demo honestly</h2><p className="mt-3 text-sm leading-6 text-[#6e7488]">Browser-entered values are clearly labeled self-attested demo credentials. Production issuers can sign the same witness shape.</p></article><article className="world-card p-6"><FileCode size={19} className="text-[#d94d35]" aria-hidden="true" /><h2 className="mt-8 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.05em]">Prove locally</h2><p className="mt-3 text-sm leading-6 text-[#6e7488]">The `prove_qualification` circuit evaluates GPA, experience, degree, and certification without revealing their underlying values.</p></article><article className="world-card p-6"><Code2 size={19} className="text-[#d94d35]" aria-hidden="true" /><h2 className="mt-8 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.05em]">Publish minimally</h2><p className="mt-3 text-sm leading-6 text-[#6e7488]">The ledger stores thresholds, a nullifier, and an aggregate qualified count. It does not store the candidate profile.</p></article></section>
      <section className="world-card mt-8 overflow-hidden p-6 md:p-8"><div className="flex items-center gap-3"><Code2 size={18} className="text-[#d94d35]" aria-hidden="true" /><div><p className="world-section-kicker !mb-1">Compact contract surface</p><h2 className="world-card-title">The public/private split</h2></div></div><pre className="mt-6 overflow-x-auto border border-[#252d4b] bg-[#0d1125] p-5 font-mono-tech text-[0.67rem] leading-7 text-[#aab2ca]"><code>{`export circuit prove_qualification(): [] {
  const creds = candidate_credentials();

  assert(creds.gpa_scaled >= min_gpa);
  assert(creds.experience_months >= min_experience_months);
  assert(creds.degree_code == required_degree_code);
  assert(creds.certification_code == required_certification_code);

  // only the anonymous nullifier crosses the boundary
  nullifiers.insert(disclose(makeNullifier(creds.candidate_id)));
}`}</code></pre></section>
      <section className="world-card-dark mt-8 p-6 md:p-8"><div className="flex items-center gap-3"><Terminal size={18} className="text-[#c8ef83]" aria-hidden="true" /><h2 className="font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.05em] text-[#fffdf8]">Developer loop</h2></div><div className="mt-5 grid gap-3 font-mono-tech text-xs text-[#aab2ca] sm:grid-cols-3"><code className="border border-[#ffffff1f] bg-[#151b36] p-4 text-[#c8ef83]">yarn compile</code><code className="border border-[#ffffff1f] bg-[#151b36] p-4 text-[#c8ef83]">yarn test</code><code className="border border-[#ffffff1f] bg-[#151b36] p-4 text-[#c8ef83]">cd frontend && npm run dev</code></div></section>
    </div></div>
  );
};
