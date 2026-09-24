import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { ToastProvider } from './contexts/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { CandidateCredentialsPage } from './pages/CandidateCredentialsPage';
import { CandidateApplicationsPage } from './pages/CandidateApplicationsPage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { CreateJobPage } from './pages/CreateJobPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DocsPage } from './pages/DocsPage';
import { AdminDeployPage } from './pages/AdminDeployPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  return (
    <WalletProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f6]">
            {/* Navigation */}
            <Navbar isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode} />

            {/* Main View Router */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage isDemoMode={isDemoMode} />} />
                <Route path="/jobs" element={<JobsPage isDemoMode={isDemoMode} />} />
                <Route path="/jobs/:id" element={<JobDetailPage isDemoMode={isDemoMode} />} />
                <Route path="/candidate" element={<CandidateDashboardPage />} />
                <Route path="/candidate/credentials" element={<CandidateCredentialsPage />} />
                <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
                <Route path="/recruiter" element={<RecruiterDashboardPage />} />
                <Route path="/recruiter/jobs/new" element={<CreateJobPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/admin" element={<AdminDeployPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </WalletProvider>
  );
}

export default App;
