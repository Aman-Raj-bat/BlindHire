# BlindHire

[![CI](https://github.com/Aman-Raj-bat/BlindHire/actions/workflows/ci.yaml/badge.svg)](https://github.com/Aman-Raj-bat/BlindHire/actions/workflows/ci.yaml)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod-00D284.svg)](https://preprod.midnightexplorer.com)
[![Compact Compiler](https://img.shields.io/badge/Compact-0.5.2-blue.svg)](https://github.com/midnightntwrk/compact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **"Qualified before identified."**
> A privacy-preserving candidate screening dApp built on the Midnight Network.

---

## 1. Executive Summary

BlindHire fundamentally rethinks technical screening by decoupling **qualification** from **identity**. 

In conventional recruitment, candidates must surrender their entire identity—full legal name, exact GPA, university alma mater, graduation year, home address, and demographics—simply to be screened against baseline thresholds. This leads to rampant unconscious bias, candidate data scraping, and resume fraud.

BlindHire leverages **Zero-Knowledge (ZK) proofs** on the **Midnight Network**. A candidate privately possesses credentials inside a local credential vault and mathematically proves they satisfy a job's criteria **WITHOUT** revealing the underlying credentials.

### What the Recruiter Learns:
- ✓ Degree field satisfied (e.g., Computer Science / IT)
- ✓ Academic threshold satisfied (e.g., GPA $\ge$ 7.50 / 10.0)
- ✓ Experience threshold satisfied (e.g., Experience $\ge$ 12 months)
- ✓ Certification requirement satisfied (e.g., Node.js Certified Developer)
- ✓ Overall Status: **QUALIFIED**

### What Remains Completely Hidden:
- Candidate's exact GPA (e.g., 8.72)
- Candidate's exact experience duration (e.g., 2.4 years)
- Candidate's university or college name
- Candidate's age, gender, race, location, or personal identity
- Candidate's unshielded wallet address

---

## 2. Core Product Principles

### 1. Qualification $\ne$ Identity
Competence is objective; identity is personal. Employers should first determine if a candidate can perform the work before receiving identifiable demographic data.

### 2. Zero-Leakage Proving
Private credentials never leave the candidate's browser. Constraint evaluations occur inside the client-side ZK prover using private witnesses.

### 3. User-Controlled Selective Disclosure
Identity disclosure is never automatic. After qualifying, candidates receive disclosure requests from recruiters and choose if and when to share their resume, email, or GitHub.

---

## 3. Architecture & Privacy Boundary

```
Candidate (Browser)                      Midnight Network (Preprod)                     Recruiter (Browser)
┌────────────────────────┐               ┌────────────────────────┐                    ┌────────────────────────┐
│ Private Credential     │               │ Public Ledger          │                    │ Screening Dashboard    │
│ Vault (Witnesses):     │               │ State:                 │                    │                        │
│ - GPA: 8.70            │               │ - min_gpa: 750n        │                    │ Candidate #A91F:       │
│ - Exp: 24 months       │               │ - min_exp: 12n         │                    │ - Degree:   VERIFIED   │
│ - Degree: CS / IT (1)  │               │ - req_degree: 1n       │                    │ - GPA:      VERIFIED   │
│ - Cert: Node.js (101)  │               │ - req_cert: 101n       │                    │ - Exp:      VERIFIED   │
│ - Candidate Secret Key │               │ - nullifiers Set       │                    │ - Cert:     VERIFIED   │
└───────────┬────────────┘               │ - qual_commitments Set │                    │                        │
            │                            │ - qualified_count: 1n  │                    │ Status: QUALIFIED      │
            ▼                            └───────────▲────────────┘                    └───────────▲────────────┘
┌────────────────────────┐                           │                                             │
│ Compact ZK Prover      │                           │                                             │
│ (Client WebAssembly):  │                           │                                             │
│ - Evaluates assertions │                           │                                             │
│ - Derives Nullifier    │───────────────────────────┘                                             │
│ - Generates ZK Proof   │   Tx: { proof, nullifier }                                              │
└────────────────────────┘                                                                         │
                                                                                                   │
┌──────────────────────────────────────────────────────────────────────────────────────────────────┴─────┐
│ OPTIONAL SELECTIVE DISCLOSURE (Upon explicit candidate approval after qualification verification)      │
│ Candidate Name: Aman Raj | Contact: aman.raj@example.com | GitHub: https://github.com/aman-dev          │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Privacy Model Specification

| Data Element | Visibility | Location | Cryptographic Handling |
|---|---|---|---|
| **Cumulative GPA** | **PRIVATE** | Local Witness only | Evaluated as `assert(creds.gpa_scaled >= min_gpa)` |
| **Experience Duration** | **PRIVATE** | Local Witness only | Evaluated as `assert(creds.experience_months >= min_exp)` |
| **University / College** | **PRIVATE** | Local Vault only | Never passed to circuit or ledger |
| **Candidate Identity / Secret**| **PRIVATE** | Local Witness only | Derived via `persistentHash` into anonymous nullifier |
| **Applicant Nullifier** | **PUBLIC** | On-Chain Ledger | Prevents double-qualification without unmasking candidate |
| **Job Screening Thresholds**| **PUBLIC** | On-Chain Ledger | Open criteria visible to all applicants |
| **Qualified Count** | **PUBLIC** | On-Chain Ledger | Public counter incremented upon valid ZK proof |
| **Name / Email / Portfolio** | **SELECTIVE** | Off-Chain Consent | Shared only after explicit candidate approval |

---

## 5. Credential Trust Model

BlindHire enforces honest cryptographic standards:

- **DEMO CREDENTIALS (Current Hackathon Scope):** Inputs entered into the Candidate Vault are clearly labeled as `[DEMO CREDENTIAL]` self-attestations. This allows reviewers to immediately test boundary conditions, qualifying profiles, and disqualifying profiles without third-party institutional dependencies.
- **ISSUED / VERIFIED CREDENTIALS (Production Protocol):** In production deployment, credential witnesses are signed by verifiable institutional registries (universities, certification authorities). The Compact circuit validates the issuer's signature alongside the threshold constraints.

---

## 6. Compact Smart Contract Architecture

The core contract is implemented in `contracts/blindhire.compact` using Compact language version $\ge 0.22$.

### Key Technical Patterns:
1. **Integer Type-Widening Protection:** Arithmetic operations in Compact widen `Uint<32>` types. All arithmetic casts back explicitly:
   ```compact
   qualified_count = disclose((qualified_count + 1) as Uint<32>);
   ```
2. **Exported Pure Circuits:** Deterministic cryptographic helpers are exported with the `export pure circuit` keyword so they are accessible from TypeScript:
   ```compact
   export pure circuit recruiterPublicKey(sk: Bytes<32>): Bytes<32> {
       return persistentHash<Vector<2, Bytes<32>>>([pad(32, "blindhire:recruiter:v1"), sk]);
   }

   export pure circuit makeNullifier(candidate_id: Bytes<32>): Bytes<32> {
       return persistentHash<Vector<2, Bytes<32>>>([pad(32, "blindhire:nullifier:v1"), candidate_id]);
   }
   ```
3. **Disclose Boundary:** Only contract-wide public states and the derived anonymous nullifier pass through `disclose()`. Sensitive candidate credential attributes remain completely shielded in the witness.

---

## 7. Frontend & Midnight SDK Integration

The frontend is built with **React 19**, **Vite 6**, **Three.js**, **Framer Motion**, and **TailwindCSS**.

### Key Integration Highlights:
- **Five Provider Pattern:** Full adherence to Midnight's 5-provider specification (`privateStateProvider`, `publicDataProvider`, `zkConfigProvider`, `proofProvider`, `walletProvider`, `midnightProvider`).
- **Patched Indexer Public Data Provider:** Implements `createPatchedPublicDataProvider` to eliminate the known `offset: null` GraphQL crash on Midnight Preprod indexers.
- **Browser Proving via WebAssembly:** `vite-plugin-wasm` and `vite-plugin-top-level-await` enable in-browser proof generation without backend bottlenecks.
- **Lace & 1AM Wallet Connectors:** Seamless asynchronous polling for `window.midnight.mnLace` and `window.midnight['1am']`.

---

## 8. Interactive 3D Visual Experience

BlindHire features interactive 3D components crafted with Three.js:

1. **`ZKCredentialVault3D` (Landing Hero):** An interactive obsidian cryptographic core surrounded by 4 orbital requirement rings (Degree, GPA, Experience, Certification) and a vertical ZK aperture ring that responds dynamically to mouse movement and verification state.
2. **`PrivacyFlow3D` (How It Works):** A 3D cryptographic pipeline illustrating private data packets flowing through a refractive ZK prism into verified on-chain claims.
3. **Graceful Degradation:** Automatic detection of `prefers-reduced-motion` and WebGL capabilities, providing high-fidelity fallback elements for low-power mobile devices.

---

## 9. Quick Start & Local Setup

### Prerequisites
- **Node.js:** $\ge 22.0.0$
- **Yarn:** $1.22.22$
- **Compact Compiler:** $0.5.2$ or $0.31.0$ (installed via Midnight installer)
- **Docker Desktop:** (for local Midnight network testing)

### Installation
```bash
# Clone the repository
git clone https://github.com/Aman-Raj-bat/BlindHire.git
cd BlindHire

# Install dependencies
yarn install
cd frontend && npm install && cd ..
```

### Compile Compact Smart Contract
```bash
yarn compile
```
*Compiles `contracts/blindhire.compact` and synchronizes TypeScript types and ZK proving keys to `frontend/src/managed/` and `frontend/public/managed/`.*

### Run Automated Tests
```bash
yarn test
```
*Runs the 10-test suite verifying pure circuits, deterministic nullifiers, threshold boundaries, and constraint rejections.*
