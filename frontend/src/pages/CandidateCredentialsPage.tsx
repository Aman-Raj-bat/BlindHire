import React, { useState } from 'react';
import { AlertTriangle, Lock, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { storage } from '../lib/storage';
import { CandidateProfile, CERTIFICATION_CODES, DEGREE_CODES } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { DEFAULT_DEMO_CANDIDATE } from '../lib/mockData';

export const CandidateCredentialsPage: React.FC = () => {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<CandidateProfile>(storage.getCandidateProfile());

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const updated = { ...profile, gpaScaled: Math.round(profile.gpa * 100) };
    storage.saveCandidateProfile(updated);
    setProfile(updated);
    addToast('success', 'Vault updated', 'Credentials were saved locally in witness state.');
  };

  const handleResetToDemo = () => {
    storage.saveCandidateProfile(DEFAULT_DEMO_CANDIDATE);
    setProfile(DEFAULT_DEMO_CANDIDATE);
    addToast('info', 'Demo profile restored', 'Your local vault is ready for another proof.');
  };

  return (
    <div className="world-page">
      <div className="world-container max-w-5xl">
        <header className="world-page-header">
          <div><p className="world-section-kicker">Candidate vault / local only</p><h1 className="world-page-title">Your credentials<br />never leave orbit.</h1><p className="world-page-description">Edit the values used by the zero-knowledge prover. The browser stores these witnesses locally; the public ledger receives only the qualification result.</p></div>
          <button type="button" className="world-button-ghost" onClick={handleResetToDemo}><RotateCcw size={14} aria-hidden="true" /> Reset demo profile</button>
        </header>

        <div className="mt-8 flex items-start gap-3 border border-[#d7a32466] bg-[#fff3cf] p-4 text-sm text-[#80530c]"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><div><b className="block font-mono-tech text-xs uppercase tracking-[0.08em]">Trust model: {profile.isDemoCredential ? 'demo credential' : 'issued credential'}</b><span className="mt-1 block leading-6">This build labels browser-entered values as self-attested demo data. Production issuers can sign the witnesses before they enter the vault.</span></div></div>

        <form onSubmit={handleSave} className="mt-8 grid gap-4">
          <section className="world-card p-6 md:p-8">
            <div className="flex items-center gap-3 border-b border-[#e8e2d6] pb-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#c8ef83] text-[#11162b]"><Lock size={17} aria-hidden="true" /></span><div><p className="world-section-kicker !mb-1">Circuit inputs</p><h2 className="world-card-title">Qualification witnesses</h2></div></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label><span className="world-label">Field of study / degree</span><select className="world-input" value={profile.degreeCode} onChange={(event) => setProfile({ ...profile, degreeCode: Number(event.target.value) })}>{Object.entries(DEGREE_CODES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
              <label><span className="world-label">Cumulative GPA</span><input className="world-input font-mono-tech" type="number" inputMode="decimal" min="0" max="10" step="0.01" value={profile.gpa} onChange={(event) => setProfile({ ...profile, gpa: Number(event.target.value) || 0 })} /><span className="mt-2 block font-mono-tech text-[0.6rem] text-[#6e7488]">circuit integer: {Math.round(profile.gpa * 100)}n</span></label>
              <label><span className="world-label">Professional experience / months</span><input className="world-input font-mono-tech" type="number" inputMode="numeric" min="0" max="600" value={profile.experienceMonths} onChange={(event) => setProfile({ ...profile, experienceMonths: Number(event.target.value) || 0 })} /><span className="mt-2 block font-mono-tech text-[0.6rem] text-[#6e7488]">{(profile.experienceMonths / 12).toFixed(1)} years equivalent</span></label>
              <label><span className="world-label">Technical certification</span><select className="world-input" value={profile.certificationCode} onChange={(event) => setProfile({ ...profile, certificationCode: Number(event.target.value) })}>{Object.entries(CERTIFICATION_CODES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
            </div>
          </section>

          <section className="world-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-[#e8e2d6] pb-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#86d8ef] text-[#11162b]"><ShieldCheck size={17} aria-hidden="true" /></span><div><p className="world-section-kicker !mb-1">Selective disclosure</p><h2 className="world-card-title">Identity stays behind consent</h2></div></div><span className="world-badge is-muted">shielded by default</span></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label><span className="world-label">Full legal name</span><input className="world-input" value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} /></label>
              <label><span className="world-label">Email address</span><input className="world-input" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label>
              <label><span className="world-label">GitHub profile URL</span><input className="world-input" type="url" value={profile.githubUrl} onChange={(event) => setProfile({ ...profile, githubUrl: event.target.value })} /></label>
              <label><span className="world-label">University / college</span><input className="world-input" value={profile.universityName} onChange={(event) => setProfile({ ...profile, universityName: event.target.value })} /></label>
            </div>
          </section>

          <section className="world-card-dark p-6 md:p-8"><p className="font-mono-tech text-[0.6rem] uppercase tracking-[0.1em] text-[#aab2ca]">Anonymous nullifier seed</p><div className="mt-4 break-all border border-[#ffffff1f] bg-[#151b36] p-4 font-mono-tech text-xs leading-6 text-[#c8ef83]">{profile.candidateSecretHex}</div><p className="mt-3 text-xs leading-5 text-[#aab2ca]">This local 256-bit secret helps prevent a candidate from claiming the same role twice without exposing the wallet or identity.</p></section>

          <button type="submit" className="world-button justify-self-start"><Save size={15} aria-hidden="true" /> Save credential vault</button>
        </form>
      </div>
    </div>
  );
};
