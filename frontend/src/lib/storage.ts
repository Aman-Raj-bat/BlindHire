import { CandidateProfile, JobListing, ApplicationRecord } from './types';
import { DEFAULT_DEMO_CANDIDATE, INITIAL_JOBS, INITIAL_APPLICATIONS } from './mockData';

const KEYS = {
  CANDIDATE_PROFILE: 'blindhire_candidate_profile',
  JOBS_LIST: 'blindhire_jobs_list',
  APPLICATIONS: 'blindhire_applications',
  DEPLOYED_CONTRACT_ADDRESS: 'DEPLOYED_CONTRACT_ADDRESS',
};

export const storage = {
  getCandidateProfile(): CandidateProfile {
    try {
      const data = localStorage.getItem(KEYS.CANDIDATE_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_DEMO_CANDIDATE;
    } catch {
      return DEFAULT_DEMO_CANDIDATE;
    }
  },

  saveCandidateProfile(profile: CandidateProfile): void {
    try {
      localStorage.setItem(KEYS.CANDIDATE_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  },

  getJobs(): JobListing[] {
    try {
      const data = localStorage.getItem(KEYS.JOBS_LIST);
      return data ? JSON.parse(data) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  },

  saveJob(job: JobListing): void {
    try {
      const current = this.getJobs();
      const updated = [job, ...current.filter((j) => j.id !== job.id)];
      localStorage.setItem(KEYS.JOBS_LIST, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save job to localStorage', e);
    }
  },

  getApplications(): ApplicationRecord[] {
    try {
      const data = localStorage.getItem(KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  saveApplication(app: ApplicationRecord): void {
    try {
      const current = this.getApplications();
      const updated = [app, ...current.filter((a) => a.id !== app.id)];
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save application to localStorage', e);
    }
  },

  updateDisclosureStatus(
    appId: string,
    status: 'none' | 'requested' | 'granted' | 'declined',
    disclosedIdentity?: ApplicationRecord['disclosedIdentity'],
  ): void {
    try {
      const current = this.getApplications();
      const updated = current.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            disclosureStatus: status,
            disclosedIdentity: disclosedIdentity ?? app.disclosedIdentity,
          };
        }
        return app;
      });
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update disclosure status', e);
    }
  },

  getDeployedContractAddress(): string {
    return (
      localStorage.getItem(KEYS.DEPLOYED_CONTRACT_ADDRESS) ||
      import.meta.env.VITE_PREPROD_CONTRACT_ADDRESS ||
      ''
    );
  },

  setDeployedContractAddress(address: string): void {
    localStorage.setItem(KEYS.DEPLOYED_CONTRACT_ADDRESS, address);
  },
};
