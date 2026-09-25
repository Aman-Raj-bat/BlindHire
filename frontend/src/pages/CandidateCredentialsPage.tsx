import React, { useState } from 'react';
import {
  Lock,
  Save,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { CandidateProfile, DEGREE_CODES, CERTIFICATION_CODES } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { DEFAULT_DEMO_CANDIDATE } from '../lib/mockData';

export const CandidateCredentialsPage: React.FC = () => {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<CandidateProfile>(storage.getCandidateProfile());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const scaled = Math.round(profile.gpa * 100);
    const updated = {
      ...profile,
      gpaScaled: scaled,
    };
    storage.saveCandidateProfile(updated);
    setProfile(updated);
    addToast('success', 'Credential Vault Updated', 'Credentials saved locally in witness state.');
  };

  const handleResetToDemo = () => {
    storage.saveCandidateProfile(DEFAULT_DEMO_CANDIDATE);
    setProfile(DEFAULT_DEMO_CANDIDATE);
    addToast('info', 'Reset to Demo Profile', 'Default demo credentials restored.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2128] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-[#00D284]/10 text-[#00D284] border border-[#00D284]/20">
              Private Witness Store
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f4f6] mt-1">
            Candidate Credential Vault
          </h1>
          <p className="text-xs text-[#92939e] mt-1">
            These values are held locally in your browser and injected as private witnesses during ZK proof generation.
          </p>
        </div>

        <button
          onClick={handleResetToDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-tech bg-[#14151a] hover:bg-[#1a1b22] text-[#92939e] hover:text-[#f4f4f6] border border-[#22252b] transition-all self-start sm:self-center"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Demo Profile</span>
        </button>
      </div>

      {/* Honest Security Trust Model Notice */}
      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-[#92939e] space-y-1">
          <p className="font-semibold text-amber-300">
            Trust Model: {profile.isDemoCredential ? 'DEMO CREDENTIALS' : 'ISSUED CREDENTIALS'}
          </p>
          <p className="leading-relaxed">
            BlindHire does not pretend that client-side inputs represent institutional verification.
            In production, credentials are cryptographically signed by universities or credential issuers.
            For development and demo review, credentials in this vault are labeled as self-attested demo data.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Verifiable Technical Qualifications (Evaluated in Circuit) */}
        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#1f2128] pb-3">
            <Lock className="w-4 h-4 text-[#00D284]" />
            <h2 className="text-sm font-bold text-[#f4f4f6]">
              Screening Qualifications (Used in ZK Proof)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Field of Study / Degree Code
              </label>
              <select
                value={profile.degreeCode}
                onChange={(e) => setProfile({ ...profile, degreeCode: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              >
                {Object.entries(DEGREE_CODES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Cumulative GPA (0.0 to 10.0 scale)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6] focus:border-[#00D284]"
              />
              <span className="text-[10px] text-[#5e606e] font-mono-tech mt-1 block">
                Scaled integer in circuit: {Math.round(profile.gpa * 100)}n
              </span>
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Professional Experience (Months)
              </label>
              <input
                type="number"
                min="0"
                max="600"
                value={profile.experienceMonths}
                onChange={(e) =>
                  setProfile({ ...profile, experienceMonths: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6] focus:border-[#00D284]"
              />
              <span className="text-[10px] text-[#5e606e] font-mono-tech mt-1 block">
                {(profile.experienceMonths / 12).toFixed(1)} years equivalent
              </span>
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">
                Technical Certification
              </label>
              <select
                value={profile.certificationCode}
                onChange={(e) => setProfile({ ...profile, certificationCode: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              >
                {Object.entries(CERTIFICATION_CODES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Identity (Shielded until Selective Disclosure) */}
        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-5">
          <div className="flex items-center justify-between border-b border-[#1f2128] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-[#f4f4f6]">
                Selective Disclosure Information (User-Controlled)
              </h2>
            </div>
            <span className="text-[10px] font-mono-tech text-[#5e606e]">
              Shielded by default
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">Full Legal Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">GitHub Profile URL</label>
              <input
                type="url"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>

            <div>
              <label className="text-xs text-[#92939e] block mb-1.5">University / College</label>
              <input
                type="text"
                value={profile.universityName}
                onChange={(e) => setProfile({ ...profile, universityName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs text-[#f4f4f6] focus:border-[#00D284]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Candidate Secret / Nullifier Key */}
        <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#0c0d10] space-y-3">
          <label className="text-xs text-[#5e606e] font-mono-tech block">
            Candidate Secret Identity Hash (Generates Anonymous Double-Claim Nullifier)
          </label>
          <div className="p-3 rounded-xl border border-[#1f2128] bg-[#111215]">
            <code className="text-[11px] font-mono-tech text-[#00D284] break-all select-all">
              {profile.candidateSecretHex}
            </code>
          </div>
          <p className="text-[10px] text-[#5e606e]">
            This 256-bit entropy key is used by the circuit to derive your anonymous nullifier without revealing your wallet or address.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all shadow-[0_0_20px_rgba(0,210,132,0.2)]"
        >
          <Save className="w-4 h-4" />
          <span>Save Credential Vault</span>
        </button>
      </form>
    </div>
  );
};
