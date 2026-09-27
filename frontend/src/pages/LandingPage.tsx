import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  EyeOff,
  Lock,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ZKCredentialVault3D } from '../components/3d/ZKCredentialVault3D';
import { ProofGeneratorModal } from '../components/candidate/ProofGeneratorModal';
import { DEFAULT_DEMO_CANDIDATE, INITIAL_JOBS } from '../lib/mockData';

interface LandingPageProps {
  isDemoMode: boolean;
}

const signalCards = [
  {
    index: '01 / THE OLD ORBIT',
    title: 'Resumes ask for your whole life.',
    description: 'Names, addresses, exact grades, and demographic signals arrive before anyone knows whether the work is a fit.',
    icon: EyeOff,
    tone: 'is-coral',
  },
  {
    index: '02 / THE BLINDHIRE ORBIT',
    title: 'Proof arrives before identity.',
    description: 'A browser-side Compact circuit checks the requirements without moving the credentials that satisfy them.',
    icon: ShieldCheck,
    tone: 'is-night',
  },
  {
    index: '03 / THE NEW CONSTELLATION',
    title: 'You choose when to be seen.',
    description: 'Recruiters get a verified qualification signal. Your name, inbox, and story stay behind a consent boundary.',
    icon: UserCheck,
    tone: 'is-lime',
  },
];

const privacyRows = [
  ['Degree requirement', 'VERIFIED'],
  ['GPA threshold', 'VERIFIED'],
  ['Experience threshold', 'VERIFIED'],
  ['Exact GPA', 'HIDDEN'],
  ['University + identity', 'HIDDEN'],
];

export const LandingPage: React.FC<LandingPageProps> = ({ isDemoMode }) => {
  const [selectedDemoJob, setSelectedDemoJob] = useState(INITIAL_JOBS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="cosmic-page">
      <div>
        <section className="hero-world world-grid">
          <div className="world-container">
            <div className="hero-topline">
              <span>Midnight constellation / preprod live</span>
              <span>Scroll to enter the private hiring world ↘</span>
            </div>

            <div className="hero-grid">
              <div className="hero-copy">
                <div className="eyebrow">A qualification protocol for humans</div>
                <h1 className="display-title">Let your <em>signal</em> arrive first.</h1>
                <p>
                  BlindHire is a privacy-preserving hiring world on Midnight. Prove you meet the role requirements without handing over the sensitive data that has nothing to do with your ability to do the work.
                </p>
                <div className="hero-actions">
                  <Link to="/jobs" className="world-button">
                    Enter the role map <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <Link to="/how-it-works" className="world-button-ghost">
                    Read the protocol <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </div>
                <div className="hero-footnote">
                  <span className="hero-footnote-icon"><Lock size={15} aria-hidden="true" /></span>
                  <span><strong>Private by default.</strong> Credentials stay in your local vault. Only the proof crosses the boundary.</span>
                </div>
              </div>

              <div className="constellation-wrap" aria-label="BlindHire private credential constellation">
                <div className="constellation-panel">
                  <div className="constellation-head">
                    <strong>Credential constellation</strong>
                    <span>NODE / 04</span>
                  </div>
                  <div className="constellation-stage">
                    <div className="stage-grid" aria-hidden="true" />
                    <div className="constellation-orbit orbit-one" aria-hidden="true" />
                    <div className="constellation-orbit orbit-two" aria-hidden="true" />
                    <div className="constellation-orbit orbit-three" aria-hidden="true" />
                    <div className="constellation-core">
                      <div>
                        <span>identity</span>
                        <strong>shielded</strong>
                      </div>
                    </div>
                    <div className="constellation-node node-degree">degree</div>
                    <div className="constellation-node node-gpa">gpa</div>
                    <div className="constellation-node node-experience">experience</div>
                    <div className="constellation-node node-cert">certification</div>
                    <div className="constellation-3d" aria-hidden="true">
                      <ZKCredentialVault3D />
                    </div>
                  </div>
                  <div className="constellation-foot">
                    <span>Private witness state</span>
                    <strong>ZERO LEAKAGE / READY</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-rail" aria-label="BlindHire protocol metrics">
              <div className="stat-cell"><span className="stat-mark" aria-hidden="true" /><div><b>04</b><span>private requirements<br />checked in-browser</span></div></div>
              <div className="stat-cell"><span className="stat-mark" aria-hidden="true" /><div><b>00</b><span>raw credentials<br />written to the ledger</span></div></div>
              <div className="stat-cell"><span className="stat-mark" aria-hidden="true" /><div><b>1:1</b><span>qualification to identity<br />consent boundary</span></div></div>
            </div>
          </div>
        </section>

        <section className="world-section">
          <div className="world-container">
            <div className="world-section-head">
              <div>
                <p className="world-section-kicker">A different hiring physics</p>
                <h2 className="world-section-title">The world changes when competence gets its own orbit.</h2>
              </div>
              <p className="world-section-lede">Traditional screening collects the person before it checks the proof. BlindHire reverses the order, so the first thing a team sees is what actually matters for the role.</p>
            </div>
            <div className="signal-grid">
              {signalCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.index} className={`signal-card ${card.tone}`}>
                    <div>
                      <span className="signal-index">{card.index}</span>
                      <div className="signal-icon" aria-hidden="true"><Icon size={19} /></div>
                    </div>
                    <div>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="world-section role-section">
          <div className="world-container">
            <div className="world-section-head">
              <div>
                <p className="world-section-kicker">Open roles / live signals</p>
                <h2 className="world-section-title">Find a role that can read your proof.</h2>
              </div>
              <Link to="/jobs" className="world-button-ghost">See all roles <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
            <div className="role-grid">
              {INITIAL_JOBS.map((job) => (
                <article key={job.id} className="role-card">
                  <div className="role-card-top">
                    <div>
                      <span className="role-company">{job.company}</span>
                      <h3 className="role-title">{job.title}</h3>
                    </div>
                    <span className="role-orb" aria-hidden="true" />
                  </div>
                  <p className="role-description">{job.description}</p>
                  <div className="role-tags">
                    <span className="role-tag">GPA ≥ {job.minGpa.toFixed(1)}</span>
                    <span className="role-tag">EXP ≥ {Number(job.minExperienceMonths)} MO</span>
                    <span className="role-tag">{job.location}</span>
                  </div>
                  <div className="role-footer">
                    <span>{job.qualifiedCount} proofs verified</span>
                    <button type="button" className="role-prove" onClick={() => { setSelectedDemoJob(job); setIsModalOpen(true); }}>
                      Prove fit <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="world-section is-dark">
          <div className="world-container privacy-layout">
            <div>
              <p className="world-section-kicker">The privacy lens</p>
              <h2 className="world-section-title">A recruiter sees the answer, not the autobiography.</h2>
              <p className="world-section-lede">Every public claim is intentionally small. It says only what the circuit proved against the open role requirements.</p>
              <div className="privacy-list">
                {privacyRows.map(([label, status]) => (
                  <div className={`privacy-row ${status === 'HIDDEN' ? 'is-hidden' : ''}`} key={label}>
                    <span>{label}</span>
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lens-card" aria-label="Illustration of a privacy shield">
              <div className="lens-label"><span>What lands on-chain</span><strong>PUBLIC / MINIMAL</strong></div>
              <div className="lens-center">
                <span className="lens-hidden-chip"><Lock size={11} aria-hidden="true" /> exact GPA</span>
                <span className="lens-hidden-chip"><Lock size={11} aria-hidden="true" /> university</span>
                <span className="lens-hidden-chip"><Lock size={11} aria-hidden="true" /> identity</span>
                <span className="lens-hidden-chip"><Lock size={11} aria-hidden="true" /> wallet</span>
                <div className="lens-center-ring"><div className="lens-center-core">qualified<br />proof</div></div>
              </div>
              <div className="lens-bottom"><span>Candidate #A91F</span><strong>4 / 4 VERIFIED</strong></div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="world-container">
            <div className="final-cta-box">
              <h2>Keep the proof. Keep the choice.</h2>
              <p>Build your private credential constellation once, then move through hiring without repeating your most sensitive details at every orbit.</p>
              <Link to="/candidate/credentials" className="world-button">
                Open your credential vault <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <ProofGeneratorModal
        job={selectedDemoJob}
        candidate={DEFAULT_DEMO_CANDIDATE}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};
