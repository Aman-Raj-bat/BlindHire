// =============================================================================
// BlindHire Domain Types & Privacy Model
// =============================================================================

export type DegreeField = {
  code: number;
  label: string;
};

export const DEGREE_CODES: Record<number, string> = {
  1: 'Computer Science / Information Technology',
  2: 'Electrical / Electronics Engineering',
  3: 'Data Science / Applied Mathematics',
  4: 'Mechanical Engineering',
  5: 'Other Engineering / Sciences',
};

export const CERTIFICATION_CODES: Record<number, string> = {
  0: 'None Required',
  101: 'Node.js Certified Application Developer',
  102: 'AWS Certified Solutions Architect',
  103: 'Certified Kubernetes Administrator (CKA)',
  104: 'Offensive Security Certified Professional (OSCP)',
};

export type CandidateProfile = {
  // SENSITIVE PERSONAL IDENTITY (Never put on ledger; selectively disclosed ONLY upon consent)
  fullName: string;
  email: string;
  githubUrl: string;
  portfolioUrl: string;
  universityName: string;

  // QUALIFICATION METRICS (Evaluated strictly inside ZK circuit as private witness)
  degreeCode: number;
  gpa: number; // e.g. 8.70
  gpaScaled: number; // e.g. 870
  experienceMonths: number; // e.g. 24
  certificationCode: number; // e.g. 101
  candidateSecretHex: string; // 32-byte private key/seed

  // TRUST MODEL LABEL
  isDemoCredential: boolean;
  credentialIssuer: string; // e.g. "Demo University Registrar" vs "Verified Cryptographic Issuer"
};

export type JobListing = {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string;
  description: string;
  responsibilities: string[];

  // ON-CHAIN SCREENING CRITERIA
  minGpa: number;
  minGpaScaled: bigint;
  minExperienceMonths: bigint;
  requiredDegreeCode: bigint;
  requiredCertificationCode: bigint;
  contractAddress: string;
  deadlineUnix: bigint;
  isActive: boolean;
  qualifiedCount: number;
  maxApplicants: number;

  isContractBacked: boolean;
};

export type QualificationProofResult = {
  txHash: string;
  nullifierHex: string;
  receiptCommitmentHex: string;
  status: 'qualified' | 'disqualified';
  timestamp: string;
  jobId: string;
  requirementsMet: {
    degree: boolean;
    gpa: boolean;
    experience: boolean;
    certification: boolean;
  };
};

export type ApplicationRecord = {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateAnonymousId: string; // e.g. "Candidate #A91F"
  candidateNullifier: string;
  txHash: string;
  status: 'qualified' | 'disqualified';
  appliedDate: string;
  isDemoData: boolean;

  // Selective Disclosure State (Controlled exclusively by the Candidate)
  disclosureStatus: 'none' | 'requested' | 'granted' | 'declined';
  disclosedIdentity?: {
    fullName: string;
    email: string;
    githubUrl?: string;
    portfolioUrl?: string;
    universityName?: string;
  };

  verifiedChecks: {
    degree: boolean;
    gpa: boolean;
    experience: boolean;
    certification: boolean;
  };
};
