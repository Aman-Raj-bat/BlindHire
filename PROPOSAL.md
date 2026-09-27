# BlindHire — Product Idea Proposal

## The Problem
Today, technical recruitment processes require applicants to submit extensive personal resumes and sensitive identity documents (full legal name, university pedigree, graduation year, exact GPA, residential address, and demographic details) before initial qualification screening even begins.

Centralized job boards and recruitment applicant tracking systems (ATS) store millions of unencrypted resumes, exposing applicants to:
1. **Unconscious and Systemic Hiring Bias:** Evaluation influenced by university brand names, candidate names, age, gender, ethnicity, or location rather than demonstrated competence.
2. **Data Scraping and Identity Breaches:** Centralized resume repositories are prime targets for credential harvesting, spam, and identity compromise.
3. **Resume Fraud and Misrepresentation:** Self-reported claims lack cryptographic verifiability without slow, manual background screening checks.

## The Solution
BlindHire fundamentally decouples **qualification** from **identity** using Zero-Knowledge Proofs on the **Midnight Network**.

Candidates securely store credentials (academic GPA, engineering experience, degree type, certified competencies) inside a private, local in-browser vault. Using Midnight's Compact smart contract framework, candidates mathematically prove that they satisfy a job's criteria (e.g., GPA $\ge$ 7.50, Experience $\ge$ 12 months, Degree = CS/IT) **without revealing their actual scores, university, or personal identity**.

Only a zero-knowledge proof and an anonymous nullifier are published to the Midnight ledger. Once verified as qualified on-chain, candidates retain full agency through user-controlled selective disclosure—choosing if and when to share their real contact details with prospective employers.

## How It Works
1. **Recruiter Sets Screening Criteria On-Chain:** Job requirements (minimum GPA threshold, minimum experience in months, required degree discipline, required skill certificate) are committed to a Midnight Compact smart contract on Preprod.
2. **Candidate Holds Credentials Privately:** The candidate inputs or imports credentials into their local in-browser credential vault; raw data never leaves the client device.
3. **Zero-Knowledge Proof Generated Locally:** Midnight's Compact client-side prover evaluates the constraint assertions against private witnesses and derives a unique, anonymous applicant nullifier via cryptographically secure hashing.
4. **On-Chain Verification:** Only the succinct ZK proof and nullifier are submitted to Midnight Network via the Lace DApp connector. The contract verifies the proof without learning private inputs and increments the verified candidate count.
5. **Sybil Resistance via Nullifier:** The on-chain nullifier set prevents duplicate qualification claims by the same applicant while preserving absolute anonymity.
6. **User-Controlled Selective Disclosure:** Recruiters see an objective, mathematically verified candidate signal and can submit an interview request. The candidate explicitly chooses when to disclose their name, portfolio, or contact details.

## Target Users
- **Software Engineers & Technical Applicants:** Privacy-conscious professionals seeking meritocratic evaluation free from pedigree bias.
- **Progressive Tech Companies & Web3 Protocols:** Engineering teams and decentralized organizations seeking top-tier talent assessed strictly on competence.
- **Hiring Platforms & Recruitment Agencies:** Screening agencies looking to reduce bias and comply with emerging global employment privacy regulations (GDPR, California CCPA, EU AI Act).
- **Academic Institutions & Bootcamp Providers:** Educational organizations issuing zero-knowledge verifiable credentials to alumni.

## Business Model
- **Enterprise B2B SaaS:** Hiring organizations subscribe for automated on-chain screening verification tiers, candidate pool analytics, and recruitment pipeline integrations.
- **Pay-Per-Verification API:** Flexible pay-as-you-go microtransactions for high-volume recruitment screening platforms and applicant tracking systems (ATS).
- **Decentralized Verification Protocol:** Open-source core privacy protocol on Midnight with enterprise tooling, automated verification oracles, and premium ATS integrations.

## Midnight Network Implementation
- **Smart Contract Language:** Compact (Midnight Network domain-specific ZK language).
- **Proving Layer:** Client-side ZK-SNARK proving using Midnight ledger WebAssembly runtime.
- **Network Environment:** Deployed on Midnight Preprod and verified end-to-end with the Midnight Lace wallet.
- **Selective Disclosure:** Cryptographic commitments and consent-based off-chain candidate channel.
