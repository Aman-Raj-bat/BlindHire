import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowUpRight, Briefcase, Save, ShieldCheck } from 'lucide-react';
import { storage } from '../lib/storage';
import { JobListing, DEGREE_CODES, CERTIFICATION_CODES } from '../lib/types';
import { useToast } from '../contexts/ToastContext';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Midnight Engineering');
  const [department, setDepartment] = useState('Protocol & Systems');
  const [location, setLocation] = useState('Remote (Global)');
  const [salaryRange, setSalaryRange] = useState('$140,000 - $180,000');
  const [description, setDescription] = useState(
    'Seeking a verified software engineer to develop high-throughput privacy-preserving applications.',
  );
  const [minGpa, setMinGpa] = useState<number>(7.5);
  const [minExpMonths, setMinExpMonths] = useState<number>(12);
  const [degreeCode, setDegreeCode] = useState<number>(1);
  const [certCode, setCertCode] = useState<number>(101);
  const [applicantLimit, setApplicantLimit] = useState<number>(100);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSaveError(null);
    if (!title.trim()) {
      addToast('error', 'Missing information', 'Please enter a job title.');
      return;
    }

    const newJob: JobListing = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company,
      department,
      location,
      type: 'Full-time',
      salaryRange,
      description,
      responsibilities: [
        'Collaborate on zero-knowledge circuit integrations',
        'Maintain high testing coverage and formal verification standards',
        'Respect end-to-end privacy invariants across all services',
      ],
      minGpa,
      minGpaScaled: BigInt(Math.round(minGpa * 100)),
      minExperienceMonths: BigInt(minExpMonths),
      requiredDegreeCode: BigInt(degreeCode),
      requiredCertificationCode: BigInt(certCode),
      contractAddress: '',
      deadlineUnix: BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60),
      isActive: true,
      qualifiedCount: 0,
      maxApplicants: applicantLimit,
      isContractBacked: false,
    };

    storage.saveJob(newJob);
    // The storage API swallows write errors, so verify persistence before reporting success.
    if (!storage.getJobs().some((job) => job.id === newJob.id)) {
      const message = 'The role could not be saved in this browser. Your form is still here; no contract was deployed.';
      setSaveError(message);
      addToast('error', 'Local save failed', message);
      return;
    }

    addToast('success', 'Local role saved', 'Saved in this browser only. No screening contract was deployed.');
    navigate('/recruiter');
  };

  return (
    <div className="world-page">
      <div className="world-container max-w-5xl">
        <Link
          to="/recruiter"
          className="mb-7 inline-flex min-h-11 items-center gap-2 font-mono-tech text-xs text-[#6e7488] transition-colors hover:text-[#11162b]"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to recruiter workspace
        </Link>

        <header className="world-page-header">
          <div>
            <p className="world-section-kicker">Recruiter studio / new role</p>
            <h1 className="world-page-title">Create a role.<br />Lead with ability.</h1>
            <p className="world-page-description">
              Start with the work, then define the qualifications. Build a local role listing without collecting candidate identities.
            </p>
          </div>
          <span className="world-badge is-warn shrink-0">Local demo listing</span>
        </header>

        <div className="mt-8 flex items-start gap-3 border border-[#d7a32466] bg-[#fff3cf] p-4 text-sm text-[#80530c]">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <b className="block font-mono-tech text-xs uppercase tracking-[0.08em]">A local listing, not a deployment</b>
            <p className="mt-1 leading-6">
              This form saves to this browser only. It does not publish to a shared marketplace, deploy a contract, or update any on-chain screening criteria.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <section className="world-card p-6 md:p-8" aria-labelledby="role-details-title">
            <div className="flex items-center gap-3 border-b border-[#e8e2d6] pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ff7352] text-[#11162b]">
                <Briefcase size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="world-section-kicker !mb-1">01 / The opportunity</p>
                <h2 id="role-details-title" className="world-card-title">Tell candidates about the work</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="world-label">Role title / required</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Systems Engineer"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="world-input"
                />
              </label>
              <label>
                <span className="world-label">Company / protocol</span>
                <input type="text" value={company} onChange={(event) => setCompany(event.target.value)} className="world-input" />
              </label>
              <label>
                <span className="world-label">Department</span>
                <input type="text" value={department} onChange={(event) => setDepartment(event.target.value)} className="world-input" />
              </label>
              <label>
                <span className="world-label">Location</span>
                <input type="text" value={location} onChange={(event) => setLocation(event.target.value)} className="world-input" />
              </label>
              <label>
                <span className="world-label">Compensation range</span>
                <input type="text" value={salaryRange} onChange={(event) => setSalaryRange(event.target.value)} className="world-input" />
              </label>
              <label className="sm:col-span-2">
                <span className="world-label">Role description</span>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="world-input !py-3 leading-6"
                />
              </label>
            </div>
          </section>

          <section className="world-card p-6 md:p-8" aria-labelledby="screening-criteria-title">
            <div className="flex items-center gap-3 border-b border-[#e8e2d6] pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c8ef83] text-[#11162b]">
                <ShieldCheck size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="world-section-kicker !mb-1">02 / Qualification criteria</p>
                <h2 id="screening-criteria-title" className="world-card-title">Set the bar, not the bias</h2>
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-[#6e7488]">These thresholds describe this local role. Saving them does not change a deployed circuit.</p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="world-label">Required degree / field</span>
                <select value={degreeCode} onChange={(event) => setDegreeCode(Number(event.target.value))} className="world-input">
                  {Object.entries(DEGREE_CODES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
              </label>
              <label>
                <span className="world-label">Minimum GPA / out of 10</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minGpa}
                  onChange={(event) => setMinGpa(parseFloat(event.target.value) || 0)}
                  className="world-input font-mono-tech"
                />
              </label>
              <label>
                <span className="world-label">Minimum experience / months</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="240"
                  value={minExpMonths}
                  onChange={(event) => setMinExpMonths(parseInt(event.target.value, 10) || 0)}
                  className="world-input font-mono-tech"
                />
              </label>
              <label>
                <span className="world-label">Required certification</span>
                <select value={certCode} onChange={(event) => setCertCode(Number(event.target.value))} className="world-input">
                  {Object.entries(CERTIFICATION_CODES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
              </label>
              <label>
                <span className="world-label">Applicant limit</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={applicantLimit}
                  onChange={(event) => setApplicantLimit(parseInt(event.target.value, 10) || 0)}
                  className="world-input font-mono-tech"
                />
              </label>
              <div className="flex items-center text-xs leading-6 text-[#6e7488]">
                Full-time role · 60-day application window. The applicant limit is local metadata, not an on-chain cap.
              </div>
            </div>
          </section>

          <aside className="world-card-dark p-6 md:p-8">
            <p className="font-mono-tech text-[0.65rem] uppercase tracking-[0.1em] text-[#ff7352]">Local today. On-chain separately.</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#aab2ca]">
              A saved role has no screening contract attached. Testnet deployment is a separate admin action with its own parameters and wallet approval.
            </p>
            <Link to="/admin" className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#f6f2e9] hover:text-[#ff7352]">
              Open deployment tools <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </aside>

          {saveError && <p role="alert" className="border border-[#d94d354d] bg-[#ff735214] p-4 text-sm leading-6 text-[#9b3625]">{saveError}</p>}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" className="world-button"><Save size={15} aria-hidden="true" /> Save local role</button>
            <Link to="/recruiter" className="world-button-ghost">Cancel</Link>
            <span className="text-xs text-[#6e7488]">No wallet signature. No on-chain transaction.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
