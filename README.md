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