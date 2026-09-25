import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wallet, ChevronDown, Check, Menu, X, ExternalLink, Sparkles } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

interface NavbarProps {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDemoMode, setIsDemoMode }) => {
  const location = useLocation();
  const { isConnected, address, walletType, isConnecting, connect, disconnect, network } = useWallet();
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Jobs', path: '/jobs' },
    { label: 'Candidate Vault', path: '/candidate' },
    { label: 'Recruiter Portal', path: '/recruiter' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Docs', path: '/docs' },
  ];

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f2128] bg-[#09090b]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#14151a] border border-[#22252b] group-hover:border-[#00D284]/50 flex items-center justify-center transition-all shadow-sm">
              <Shield className="w-4 h-4 text-[#00D284]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[#f4f4f6]">BlindHire</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-tech uppercase bg-[#1b1d24] text-[#92939e] border border-[#22252b]">
                  Midnight
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#f4f4f6] bg-[#14151a] border border-[#22252b]'
                      : 'text-[#92939e] hover:text-[#f4f4f6] hover:bg-[#121316]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Demo Mode Switch + Wallet Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono-tech border transition-all ${
              isDemoMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-[#14151a] border-[#22252b] text-[#5e606e] hover:text-[#92939e]'
            }`}
            title="Toggle interactive demo mode with pre-populated credentials"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DEMO MODE</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-[#5e606e]'}`}
            />
          </button>

          {/* Wallet Connector Button */}
          {isConnected && address ? (
            <div className="relative">
              <button
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech bg-[#14151a] border border-[#22252b] hover:border-[#00D284]/40 text-[#f4f4f6] transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#00D284]" />
                <span>{formatAddress(address)}</span>
                <span className="text-[10px] text-[#5e606e] uppercase">({walletType ?? 'Lace'})</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5e606e]" />
              </button>

              {walletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 p-3 rounded-xl border border-[#22252b] bg-[#121316] shadow-2xl space-y-3 z-50">
                  <div className="border-b border-[#1f2128] pb-2">
                    <p className="text-[11px] text-[#5e606e] font-mono-tech">Connected Network</p>
                    <p className="text-xs font-semibold text-[#00D284] uppercase font-mono-tech mt-0.5">
                      Midnight {network}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#5e606e] font-mono-tech">Unshielded Address</p>
                    <p className="text-xs font-mono-tech text-[#92939e] break-all select-all mt-0.5">
                      {address}
                    </p>
                  </div>
                  <div className="border-t border-[#1f2128] pt-2 flex items-center justify-between">
                    <Link
                      to="/settings"
                      onClick={() => setWalletDropdownOpen(false)}
                      className="text-xs text-[#92939e] hover:text-[#f4f4f6]"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        disconnect();
                        setWalletDropdownOpen(false);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => connect('preprod')}
              disabled={isConnecting}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#f4f4f6] hover:bg-[#e4e4e7] text-[#09090b] transition-all disabled:opacity-50"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#92939e] hover:text-[#f4f4f6] bg-[#14151a] border border-[#22252b]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1f2128] bg-[#09090b] p-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-[#92939e] hover:text-[#f4f4f6] hover:bg-[#14151a]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1f2128] flex items-center justify-between">
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech border border-[#22252b] text-[#92939e]"
            >
              <span>Demo Mode: {isDemoMode ? 'ON' : 'OFF'}</span>
            </button>

            {!isConnected ? (
              <button
                onClick={() => {
                  connect('preprod');
                  setMobileMenuOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#f4f4f6] text-[#09090b]"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={() => {
                  disconnect();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-400 font-mono-tech"
              >
                Disconnect ({formatAddress(address!)})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
