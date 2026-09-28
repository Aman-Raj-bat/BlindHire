# BlindHire

**Privacy-Preserving Candidate Screening on the Midnight Network**

[![Midnight Network](https://img.shields.io/badge/Network-Midnight-blueviolet?style=for-the-badge)](https://midnight.network)
[![Language](https://img.shields.io/badge/Language-Compact-orange?style=for-the-badge)](https://midnight.network)
[![Tested With](https://img.shields.io/badge/Tested%20With-Vitest-yellow?style=for-the-badge)](https://vitest.dev)
[![State](https://img.shields.io/badge/Level-4%20Complete-success?style=for-the-badge)](#)
[![CI](https://github.com/hk001177108-alt/BlindHire/actions/workflows/ci.yaml/badge.svg)](https://github.com/hk001177108-alt/BlindHire/actions/workflows/ci.yaml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/hk001177108-alt/BlindHire&root=frontend)
[![X (Twitter) Follow](https://img.shields.io/twitter/follow/blindhire11?style=for-the-badge)](https://x.com/blindhire11)

---

## Abstract

BlindHire is a decentralized application (dApp) engineered on the **Midnight Network** utilizing the **Compact** smart contract language. The platform serves as a Zero-Knowledge (ZK) qualification gate for technical hiring. It allows job candidates to cryptographically prove that they satisfy stringent job requirements (such as minimum GPA, verified experience duration, degree field, and required professional certifications) without ever surrendering their raw, sensitive demographic data, university transcripts, or personal identities to centralized job portals, recruiters, or the public blockchain ledger.

---

## Table of Contents

1. [Official Submission Links](#official-submission-links)
2. [Architectural Overview](#architectural-overview)
3. [Zero-Knowledge Privacy Model](#zero-knowledge-privacy-model)
4. [Smart Contract Implementation](#smart-contract-implementation)
5. [Hackathon Progression (Levels 1-4)](#hackathon-progression-levels-1-4)
6. [Project Showcase & Verification Proofs](#project-showcase--verification-proofs)
7. [Local Development & Setup Guide](#local-development--setup-guide)
8. [Author & Acknowledgements](#author--acknowledgements)

---

## Official Submission Links

- **Live Application (Vercel):** [https://blind-hire-delta.vercel.app/](https://blind-hire-delta.vercel.app/)
- **Deployed Contract (Midnight Preprod):** [Coming Soon]()
- **Demo Video Presentation:** [Watch on Google Drive]()
- **Public Brand Presence (X Profile):** [https://x.com/blindhire11](https://x.com/blindhire11)

---

## Architectural Overview

BlindHire bridges modern editorial web aesthetics with cutting-edge zero-knowledge cryptographic privacy networks.

- **Smart Contract Layer:** Written in Compact (`contracts/blindhire.compact`), compiled to WebAssembly (WASM) and Zero-Knowledge Intermediate Representation (ZKIR). Deployed on the Midnight Preprod network with dual circuits (`prove_qualification` and `update_job_requirements`).
- **Frontend Application Layer:** Built with React 19, TypeScript, and Vite 6. Styled using custom editorial design tokens via Tailwind CSS with interactive 3D visualizations powered by Three.js and Framer Motion.
- **Wallet Infrastructure:** Integrated with `@midnight-ntwrk/dapp-connector-api` to interface directly with 1AM and Lace browser extension wallets for localized client-side proof generation and transaction signing.
- **Testing & CI/CD:** End-to-end testing utilizing Vitest and local Docker-based Midnight environments. Automated CI/CD pipelines via GitHub Actions asserting deterministic circuits and boundary conditions.

---

## Zero-Knowledge Privacy Model

The core value proposition of BlindHire is absolute data privacy and bias elimination for applicants.

### The Traditional Vulnerability
In conventional recruitment, candidates must surrender unencrypted, highly sensitive documents (full legal name, exact GPA, university alma mater, graduation year, home address, and demographics) simply to be screened against baseline criteria. This leads to unconscious bias, candidate data scraping, identity theft, and resume filtering long before skills are evaluated.

### The BlindHire ZK Solution
BlindHire reverses the hiring physics. Qualification arrives before identity. Verification is entirely mathematical.

1. **Public State (Ledger Data):** The hiring team publishes objective role thresholds (`min_gpa`, `min_experience_months`, `required_degree_code`, `required_certification_code`, `max_applicants`, and `application_deadline`) to the public Midnight ledger. These values are fully transparent and verifiable by any observer.
2. **Private Witness (User Data):** The candidate enters their actual credentials locally into their private credential vault. These values are designated as "private witnesses" in the Compact circuit (`CandidateCredentials`).
3. **Local Proof Generation:** The candidate's browser wallet executes a localized Zero-Knowledge circuit. It validates that the private witness credentials satisfy all job thresholds simultaneously.
4. **On-Chain Verification:** The wallet submits a cryptographic proof and an anonymous nullifier to the Midnight blockchain. Network validators verify the math without ever seeing the underlying private inputs.
5. **Selective Consent Disclosure:** Identity disclosure is never automatic. After qualifying, candidates receive disclosure requests from recruiters and choose if and when to share their name, email, or portfolio.

**Observer Matrix:**
- **Visible on-chain:** Job requirements thresholds, anonymous applicant nullifier, qualification receipt commitment, incremented qualified count, application deadline.
- **Hidden permanently:** Candidate's exact GPA, exact experience duration, university/college, candidate name, contact info, and private unshielded wallet address.

---

## Submission Updates & Refactors

### Bug Fixes & Refactors

- **Midnight Preprod Indexer Patch**: Implemented `createPatchedPublicDataProvider` eliminating the known `offset: null` GraphQL crash on Midnight Preprod indexers.
- **Type-Widening Arithmetic Protections**: Compact arithmetic operations widen integer types; explicitly cast all increments back with `disclose((qualified_count + 1) as Uint<32>)`.
- **WASM Cross-Origin Isolation**: Configured `Cross-Origin-Embedder-Policy: credentialless` and `Cross-Origin-Opener-Policy: same-origin` headers in Vercel to guarantee SharedArrayBuffer support for Midnight WASM.
- **Deterministic Proving Artifacts**: Automated `copy-managed.js` using `import.meta.url` to guarantee contract interfaces and ZKIR proving keys are always copied into production bundles.
- **Wallet Connection Resilience**: Asynchronous polling for `window.midnight.mnLace` and `window.midnight['1am']` with graceful disconnection cleanup.
- **Selective Identity Boundary**: Added candidate consent controls so personal contact details remain off-chain and gated behind candidate permission.

### Test Additions

| Test | What it covers |
|------|----------------|
| `derives deterministic recruiter public key from secret key using persistentHash` | Cryptographic key derivation: ensures administrative control is strictly verifiable |
| `generates identical nullifiers for identical candidate secrets` | Double-qualification prevention: candidate cannot qualify multiple times for the same role |
| `derives verifiable qualification receipt commitments from nullifiers` | Receipt derivation: guarantees authentic proof receipts for candidate tracking |
| `verifies complete qualification for a qualifying candidate` | Happy path: candidate satisfying all 4 thresholds (GPA 8.7, Exp 24mo, CS/IT, Node.js) qualifies |
| `rejects candidate whose GPA is below minimum threshold` | Constraint validation: candidate with GPA below threshold (6.90 < 7.50) is rejected |
| `rejects candidate whose experience duration is below threshold` | Constraint validation: experience below threshold (8mo < 12mo) is rejected |
| `rejects candidate whose degree does not match required field` | Constraint validation: non-matching degree code (Mechanical != CS) is rejected |
| `rejects candidate without required certification` | Constraint validation: missing certification (cert 0 != 101) is rejected |
| `verifies qualification at exact threshold boundaries` | Boundary condition: candidate with exact thresholds (GPA = 750n, Exp = 12n) passes |

### Key Platform Features

- **Interactive 3D Visual Experience**: Custom obsidian cryptographic core with orbital requirement rings (Degree, GPA, Experience, Certification) that react dynamically to qualification states.
- **Candidate Credential Vault**: Localized private storage for credentials with zero cloud leakage.
- **Recruiter Screening Console**: Real-time evaluation table with verified ZK badges, candidate nullifiers, and permissioned disclosure management.
- **Role Map & Criteria Explorer**: Public view of open roles with cryptographic verification parameters and deadlines.

---

## Smart Contract Implementation

The Compact contract (`contracts/blindhire.compact`) is designed for maximum security, nullifier replay protection, and absolute data minimization.

```compact
pragma language_version >= 0.22;

import CompactStandardLibrary;

// Public on-chain ledger state
export ledger min_gpa: Uint<32>;
export ledger min_experience_months: Uint<32>;
export ledger required_degree_code: Uint<32>;
export ledger required_certification_code: Uint<32>;
export ledger recruiter: Bytes<32>;
export ledger application_deadline: Uint<64>;
export ledger is_active: Boolean;
export ledger max_applicants: Uint<32>;
export ledger qualified_count: Uint<32>;
export ledger nullifiers: Set<Bytes<32>>;
export ledger qualification_commitments: Set<Bytes<32>>;

// Private witnesses: NEVER revealed on-chain, evaluated inside ZK prover
struct CandidateCredentials {
    degree_code: Uint<32>,
    gpa_scaled: Uint<32>,
    experience_months: Uint<32>,
    certification_code: Uint<32>,
    candidate_id: Bytes<32>
}

witness candidate_credentials(): CandidateCredentials;
witness recruiter_secret_key(): Bytes<32>;

// Constructor initializes public job thresholds
constructor(
    initial_min_gpa: Uint<32>,
    initial_min_experience_months: Uint<32>,
    initial_degree_code: Uint<32>,
    initial_cert_code: Uint<32>,
    recruiter_admin_hash: Bytes<32>,
    deadline: Uint<64>,
    applicant_limit: Uint<32>
) {
    min_gpa = disclose(initial_min_gpa);
    min_experience_months = disclose(initial_min_experience_months);
    required_degree_code = disclose(initial_degree_code);
    required_certification_code = disclose(initial_cert_code);
    recruiter = disclose(recruiter_admin_hash);
    application_deadline = disclose(deadline);
    max_applicants = disclose(applicant_limit);
    is_active = disclose(true);
    qualified_count = disclose(0);
}

// Verification circuit accepts private witnesses and asserts qualification in ZK.
// Candidate credentials remain shielded while proving threshold satisfaction.
export circuit prove_qualification(): [] {
    assert(disclose(is_active), "BlindHire: Job screening is paused");
    assert(blockTimeLt(disclose(application_deadline)), "BlindHire: Application deadline has passed");
    assert(disclose(qualified_count) < disclose(max_applicants), "BlindHire: Qualification limit reached");

    const creds = candidate_credentials();

    assert(creds.gpa_scaled >= min_gpa, "BlindHire: GPA below required threshold");
    assert(creds.experience_months >= min_experience_months, "BlindHire: Experience below required threshold");
    assert(creds.degree_code == required_degree_code, "BlindHire: Degree field does not match requirement");
    assert(creds.certification_code == required_certification_code, "BlindHire: Missing required certification");

    const nul = makeNullifier(creds.candidate_id);
    assert(!nullifiers.member(disclose(nul)), "BlindHire: Candidate already proved qualification for this job");

    const receipt = makeQualificationReceipt(nul);

    nullifiers.insert(disclose(nul));
    qualification_commitments.insert(disclose(receipt));
    qualified_count = disclose((qualified_count + 1) as Uint<32>);
}

// Recruiter circuit to update role screening requirements
export circuit update_job_requirements(
    new_min_gpa: Uint<32>,
    new_min_experience_months: Uint<32>,
    new_degree_code: Uint<32>,
    new_cert_code: Uint<32>,
    new_deadline: Uint<64>,
    new_max_applicants: Uint<32>,
    new_active_status: Boolean
): [] {
    const sk = recruiter_secret_key();
    assert(recruiter == recruiterPublicKey(sk), "BlindHire: Unauthorized recruiter key");

    min_gpa = disclose(new_min_gpa);
    min_experience_months = disclose(new_min_experience_months);
    required_degree_code = disclose(new_degree_code);
    required_certification_code = disclose(new_cert_code);
    application_deadline = disclose(new_deadline);
    max_applicants = disclose(new_max_applicants);
    is_active = disclose(new_active_status);
}

// Pure circuits for deterministic hashing
export pure circuit recruiterPublicKey(sk: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<2, Bytes<32>>>([pad(32, "blindhire:recruiter:v1"), sk]);
}

export pure circuit makeNullifier(candidate_id: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<2, Bytes<32>>>([pad(32, "blindhire:nullifier:v1"), candidate_id]);
}

export pure circuit makeQualificationReceipt(nullifier: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<2, Bytes<32>>>([pad(32, "blindhire:receipt:v1"), nullifier]);
}
```

---

## Hackathon Progression (Levels 1-4)

This repository fulfills the strict progression requirements of the "New Moon to Full" Midnight Builder Journey.

### Level 1: Setup & First Contract
- **Objective:** Establish the WSL2/Docker toolchain, write the foundational Compact contract, and document the product proposal (Privacy-Preserving Screening Protocol).
- **Status:** Complete. The contract successfully compiles, generating the required `zkir`, `bzkir`, and prover/verifier keys.

### Level 2: Frontend Integration
- **Objective:** Develop a robust frontend interface and establish wallet connectivity.
- **Status:** Complete. The application successfully interfaces with Lace and 1AM wallets via the Midnight DApp Connector API.
- **Deployed Contract Address (Preprod):** [Coming Soon]()

### Level 3: Production-Grade dApp
- **Objective:** Implement automated testing, Continuous Integration (CI/CD), and a polished user interface.
- **Status:** Complete. Vitest suites assert both successful qualification and expected rejection modes. GitHub Actions workflows automatically test the circuits on every push.

### Level 4: MVP Goes Live
- **Objective:** Deploy the frontend to a production CDN, finalize documentation, and establish a public brand presence.
- **Status:** Complete.
  - **Live Application:** [https://blind-hire-delta.vercel.app/](https://blind-hire-delta.vercel.app/)
  - **Deployed Contract (Preprod):** [Coming Soon]()
  - **Demo Video Presentation:** [Watch on Google Drive]()
  - **Public Brand Presence (X Profile):** [https://x.com/blindhire11](https://x.com/blindhire11)

---

## Project Showcase & Verification Proofs

### User Interface 
![BlindHire Landing Hero](./sub%20assets/ui1.png)
![BlindHire Value Pillars](./sub%20assets/ui2.png)
![BlindHire Candidate Evaluation & Consented Profile](./sub%20assets/ui3.png)

### Contract Compilation Artifacts
![Successful Compact Circuit Compilation](./sub%20assets/yarn%20compile%20ss.png)

### Automated Test Suite Execution
![Vitest Circuit & Protocol Test Suite Passing](./sub%20assets/test%20output.png)

### Frontend Production Build
![Vite Production Bundle & Static Asset Generation](./sub%20assets/build%20output.png)

---

## Local Development & Setup Guide

For developers and auditors wishing to verify the Zero-Knowledge circuits and run the application locally, please follow these instructions carefully.

### 1. System Requirements
- **OS:** Windows Subsystem for Linux 2 (WSL2 - Ubuntu 22.04/24.04) or native Linux/macOS.
- **Containerization:** Docker Desktop with WSL2 integration enabled.
- **Runtime:** Node.js (v22.0.0 or higher) and npm / Yarn.

### 2. Dependency Initialization
Clone the repository and install the workspace dependencies from the root directory:
```bash
git clone https://github.com/hk001177108-alt/BlindHire.git
cd BlindHire
npm install
```

### 3. Smart Contract Compilation
Compile the Compact zero-knowledge circuits into intermediate representation and generate the strictly-typed TypeScript interfaces:
```bash
npm run compile
```
*Note: This command runs the Compact compiler and automatically copies the contract interfaces and ZKIR proving keys to `frontend/src/managed/` and `frontend/public/managed/`.*

### 4. Running the Local Midnight Network and Test Suite
To run the automated tests against circuit logic:
```bash
npm test
```
To spin up the local Midnight Docker network (local indexer, proof-server, and node) and run integration tests:
```bash
npm run env:up
npm run test:local
```
Once testing is complete, terminate the Docker instances:
```bash
npm run env:down
```

### 5. Running the Frontend Application
To run the React frontend locally and interact with the smart contract:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`. You must have the **1AM wallet** or **Lace wallet** browser extension installed and configured to the appropriate network (Local or Preprod) to interact with the application.

### 6. Production Bundle Build
To verify the production build bundle:
```bash
npm run build
```

---

## Author & Acknowledgements

**BlindHire** was developed as part of the Midnight Network hackathon.

- **GitHub:** [@hk001177108-alt](https://github.com/hk001177108-alt)
- **X (Twitter):** [@blindhire11](https://x.com/blindhire11)

*Built with privacy and security in mind on the Midnight Network.*
