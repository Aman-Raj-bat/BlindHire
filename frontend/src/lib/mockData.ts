import { JobListing, CandidateProfile, ApplicationRecord } from './types';

export const DEFAULT_DEMO_CANDIDATE: CandidateProfile = {
  fullName: 'Aman Raj',
  email: 'aman.raj@example.com',
  githubUrl: 'https://github.com/aman-dev',
  portfolioUrl: 'https://amanraj.dev',
  universityName: 'Indian Institute of Technology (IIT)',
  degreeCode: 1, // Computer Science / IT
  gpa: 8.7,
  gpaScaled: 870,
  experienceMonths: 24, // 2.0 years
  certificationCode: 101, // Node.js Certified Application Developer
  candidateSecretHex: '0a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff0',
  isDemoCredential: true,
  credentialIssuer: 'DEMO / Self-Attested Profile',
};

export const INITIAL_JOBS: JobListing[] = [
  {
    id: 'job-backend-01',
    title: 'Senior Backend Engineer (Privacy Systems)',
    company: 'Midnight Labs Foundation',
    department: 'Core Infrastructure',
    location: 'Remote / Global',
    type: 'Full-time',
    salaryRange: '$150,000 - $190,000',
    description:
      'We are looking for a backend engineer with solid distributed systems experience and strong CS fundamentals to scale privacy-first verification infrastructure.',
    responsibilities: [
      'Design high-throughput cryptographic verification microservices',
      'Optimize latency for zero-knowledge proof verification queries',
      'Architect robust APIs that protect applicant privacy at the boundary layer',
    ],
    minGpa: 7.5,
    minGpaScaled: 750n,
    minExperienceMonths: 12n, // 1 year
    requiredDegreeCode: 1n, // Computer Science / IT
    requiredCertificationCode: 101n, // Node.js
    contractAddress: '0x12a84b9f390021c60bb54209fae017290a3c2b184019a9f24bca81903e198421',
    deadlineUnix: BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60),
    isActive: true,
    qualifiedCount: 7,
    maxApplicants: 100,
    isContractBacked: true,
  },
  {
    id: 'job-protocol-02',
    title: 'Zero-Knowledge Protocol Engineer',
    company: 'Cryptographic Frontiers',
    department: 'ZK Research & Runtime',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    salaryRange: '$180,000 - $240,000',
    description:
      'Lead development of privacy-preserving runtime circuits and compact contracts for verifiable state verification.',
    responsibilities: [
      'Author formal Compact smart contracts with mathematical precision',
      'Formulate witness structures and evaluate constraint performance',
      'Implement zero-leakage public ledger interactions',
    ],
    minGpa: 8.0,
    minGpaScaled: 800n,
    minExperienceMonths: 24n, // 2 years
    requiredDegreeCode: 1n, // Computer Science / IT
    requiredCertificationCode: 101n, // Node.js
    contractAddress: '0x53d047a98bc0192e448bca12093e817920ab4810294fc91829038ba719280193',
    deadlineUnix: BigInt(Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60),
    isActive: true,
    qualifiedCount: 3,
    maxApplicants: 50,
    isContractBacked: true,
  },
  {
    id: 'job-security-03',
    title: 'Cloud Security & Infrastructure Architect',
    company: 'Aether Shield Systems',
    department: 'DevSecOps',
    location: 'London, UK / Remote',
    type: 'Full-time',
    salaryRange: '£110,000 - £140,000',
    description:
      'Architect resilient, hardened cloud infrastructure with verifiable zero-trust guarantees and strict audit trails.',
    responsibilities: [
      'Maintain secure enclaves and cryptographic key management infrastructure',
      'Enforce least-privilege identity access management without tracking',
      'Conduct automated vulnerability screening pipelines',
    ],
    minGpa: 7.0,
    minGpaScaled: 700n,
    minExperienceMonths: 24n, // 2 years
    requiredDegreeCode: 1n, // Computer Science / IT
    requiredCertificationCode: 102n, // AWS Solutions Architect
    contractAddress: '0x992b10a48ec90192f981048209bb4817a0293ec01948ba109283019827019842',
    deadlineUnix: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
    isActive: true,
    qualifiedCount: 4,
    maxApplicants: 60,
    isContractBacked: false,
  },
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-a91f',
    jobId: 'job-backend-01',
    jobTitle: 'Senior Backend Engineer (Privacy Systems)',
    candidateAnonymousId: 'Candidate #A91F',
    candidateNullifier: '0x3f7a1c890284e9124b810924ec8912409ab184910283019824ba918290184b91',
    txHash: '0x7b19a0398ef901248ba019482098ec71920839102948bca91029384719280194',
    status: 'qualified',
    appliedDate: '2 hours ago',
    isDemoData: true,
    disclosureStatus: 'granted',
    disclosedIdentity: {
      fullName: 'Aman Raj',
      email: 'aman.raj@example.com',
      githubUrl: 'https://github.com/aman-dev',
      portfolioUrl: 'https://amanraj.dev',
      universityName: 'Indian Institute of Technology (IIT)',
    },
    verifiedChecks: {
      degree: true,
      gpa: true,
      experience: true,
      certification: true,
    },
  },
  {
    id: 'app-b27d',
    jobId: 'job-backend-01',
    jobTitle: 'Senior Backend Engineer (Privacy Systems)',
    candidateAnonymousId: 'Candidate #B27D',
    candidateNullifier: '0x9184ba0192847ec9018471920839102948bca910293847192801947b19a0398e',
    txHash: '0x192801947b19a0398ef901248ba019482098ec71920839102948bca910293847',
    status: 'qualified',
    appliedDate: '1 day ago',
    isDemoData: true,
    disclosureStatus: 'requested',
    verifiedChecks: {
      degree: true,
      gpa: true,
      experience: true,
      certification: true,
    },
  },
  {
    id: 'app-c02k',
    jobId: 'job-backend-01',
    jobTitle: 'Senior Backend Engineer (Privacy Systems)',
    candidateAnonymousId: 'Candidate #C02K',
    candidateNullifier: '0x810293847192801947b19a0398ef901248ba019482098ec71920839102948bca',
    txHash: '0x019482098ec71920839102948bca910293847192801947b19a0398ef901248ba',
    status: 'qualified',
    appliedDate: '3 days ago',
    isDemoData: true,
    disclosureStatus: 'none',
    verifiedChecks: {
      degree: true,
      gpa: true,
      experience: true,
      certification: true,
    },
  },
];
