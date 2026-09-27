import React from 'react';
import { CheckCircle2, Cpu, FileCode, Layers, Lock, ShieldCheck } from 'lucide-react';
import { PrivacyFlow3D } from '../components/3d/PrivacyFlow3D';

const steps = [
  { number: '01', title: 'Keep the witness local', icon: Lock, text: 'Your GPA, degree, experience, and certifications stay in the browser vault. They are inputs to a proof, not uploads to a database.' },
  { number: '02', title: 'Run the Compact circuit', icon: Cpu, text: 'A client-side zero-knowledge circuit tests the private values against the role thresholds. The circuit learns the values; the recruiter does not.' },
  { number: '03', title: 'Publish a small signal', icon: Layers, text: 'Midnight receives the anonymous nullifier and the verified outcome. Public state contains the minimum needed to trust the result.' },
  { number: '04', title: 'Choose the next orbit', icon: CheckCircle2, text: 'After qualification, a team may request an identity disclosure. You decide if the request is accepted, declined, or simply left shielded.' },
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="world-page">
      <div className="world-container">
        <header className="world-page-header">
          <div>
            <p className="world-section-kicker">The protocol / four movements</p>
            <h1 className="world-page-title">A proof is<br />not a profile.</h1>
            <p className="world-page-description">BlindHire separates the question “can this candidate do the work?” from the question “who is this person?”. Midnight makes that separation verifiable.</p>
          </div>
          <div className="world-badge is-good"><ShieldCheck size={12} aria-hidden="true" /> client-side proving</div>
        </header>

        <section className="world-card-dark mt-8 overflow-hidden p-4 md:p-7">
          <div className="flex flex-col gap-2 border-b border-[#ffffff1f] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-mono-tech text-[0.62rem] uppercase tracking-[0.1em] text-[#c8ef83]">Live architecture map</p><h2 className="mt-2 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.04em] text-[#fffdf8]">Private witness → verified claim</h2></div>
            <span className="font-mono-tech text-[0.6rem] uppercase tracking-[0.1em] text-[#aab2ca]">3D simulation / no data leaves</span>
          </div>
          <div className="mt-4 min-h-[260px]"><PrivacyFlow3D /></div>
        </section>

        <section className="mt-12 grid gap-3 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="world-card p-6 md:p-7">
                <div className="flex items-start justify-between gap-4"><span className="font-mono-tech text-[0.65rem] font-bold tracking-[0.12em] text-[#d94d35]">{step.number}</span><Icon size={22} className="text-[#d94d35]" aria-hidden="true" /></div>
                <h2 className="mt-12 font-['Space_Grotesk'] text-2xl font-semibold tracking-[-0.06em] text-[#11162b]">{step.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#6e7488]">{step.text}</p>
              </article>
            );
          })}
        </section>

        <section className="world-card mt-12 overflow-hidden p-6 md:p-8">
          <div className="flex items-center gap-3"><FileCode size={18} className="text-[#d94d35]" aria-hidden="true" /><div><p className="world-section-kicker !mb-1">Compact logic</p><h2 className="world-card-title">The exact boundary</h2></div></div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6e7488]">The contract asserts the qualification thresholds using private witnesses, then exposes only the anonymous result and a count. The candidate’s underlying values never cross the prover boundary.</p>
          <pre className="mt-6 overflow-x-auto border border-[#252d4b] bg-[#0d1125] p-5 font-mono-tech text-[0.67rem] leading-7 text-[#aab2ca]"><code>{`const proof = prove_qualification({
  witness: localCredentialVault,
  public: roleThresholds,
});

// public result: qualified + anonymous nullifier
// private values: never disclosed`}</code></pre>
        </section>
      </div>
    </div>
  );
};
