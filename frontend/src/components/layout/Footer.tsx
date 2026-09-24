import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Github, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1f2128] bg-[#0c0d10] text-[#92939e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Brand & Principle */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#14151a] border border-[#22252b] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-[#00D284]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#f4f4f6]">BlindHire</span>
            <span className="text-xs font-mono-tech text-[#5e606e]">v0.1.0-preprod</span>
          </div>
          <p className="text-xs text-[#92939e] max-w-sm leading-relaxed">
            Privacy-preserving candidate screening dApp built on Midnight Network.
            Proving qualification without revealing underlying private credentials.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00D284]">
            <span className="w-2 h-2 rounded-full bg-[#00D284] animate-pulse" />
            <span>&ldquo;Qualified before identified.&rdquo;</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-2 text-xs">
          <p className="font-semibold font-mono-tech uppercase text-[#f4f4f6] text-[11px] tracking-wider mb-2">
            Protocol
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/jobs" className="hover:text-[#f4f4f6] transition-colors">
                Screening Marketplace
              </Link>
            </li>
            <li>
              <Link to="/candidate" className="hover:text-[#f4f4f6] transition-colors">
                Candidate Vault
              </Link>
            </li>
            <li>
              <Link to="/recruiter" className="hover:text-[#f4f4f6] transition-colors">
                Recruiter Portal
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-[#f4f4f6] transition-colors">
                Zero-Knowledge Proof Model
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Network & Resources */}
        <div className="space-y-2 text-xs">
          <p className="font-semibold font-mono-tech uppercase text-[#f4f4f6] text-[11px] tracking-wider mb-2">
            Midnight Ecosystem
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://preprod.midnightexplorer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#f4f4f6] transition-colors"
              >
                <span>Midnight Preprod Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://faucet.preprod.midnight.network/api/drips"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#f4f4f6] transition-colors"
              >
                <span>Preprod Faucet (DUST)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <Link to="/admin" className="hover:text-[#f4f4f6] transition-colors">
                Admin Contract Deployer
              </Link>
            </li>
            <li>
              <Link to="/docs" className="hover:text-[#f4f4f6] transition-colors">
                Documentation & Specs
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#1f2128] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5e606e] gap-4">
        <p>© 2026 BlindHire. Open-source privacy infrastructure on Midnight Network.</p>
        <p className="font-mono-tech text-[11px]">Compact 0.5.2 • Midnight.js SDK 4.1.1</p>
      </div>
    </footer>
  );
};
