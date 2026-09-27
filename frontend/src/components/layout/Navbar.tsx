import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Beaker, ChevronDown, ExternalLink, Menu, Wallet, X } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

interface NavbarProps {
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDemoMode, setIsDemoMode }) => {
  const location = useLocation();
  const { isConnected, address, walletType, isConnecting, connect, disconnect, network } = useWallet();
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore roles', path: '/jobs' },
    { label: 'Candidate vault', path: '/candidate' },
    { label: 'For teams', path: '/recruiter' },
    { label: 'The protocol', path: '/how-it-works' },
  ];

  const formatAddress = (value: string) => (value ? `${value.slice(0, 6)}...${value.slice(-4)}` : '');
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleConnect = () => {
    connect('preprod');
    setMobileMenuOpen(false);
  };

  return (
    <header className="cosmic-nav">
      <div className="cosmic-nav-inner">
        <Link to="/" className="cosmic-brand" aria-label="BlindHire home">
          <span className="cosmic-brand-mark" aria-hidden="true">
            <img src="/logo.svg" alt="" />
          </span>
          <span className="cosmic-brand-name">BlindHire</span>
          <span className="cosmic-brand-meta">Midnight / 01</span>
        </Link>

        <nav className="cosmic-nav-links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="cosmic-nav-link"
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="cosmic-nav-actions">
          <button
            type="button"
            className={`cosmic-demo-toggle ${isDemoMode ? 'is-on' : ''}`}
            onClick={() => setIsDemoMode(!isDemoMode)}
            aria-pressed={isDemoMode}
            title="Toggle demo credentials"
          >
            <Beaker size={12} aria-hidden="true" />
            <span>{isDemoMode ? 'Demo on' : 'Demo off'}</span>
          </button>

          {isConnected && address ? (
            <div className="relative">
              <button
                type="button"
                className="cosmic-wallet-button"
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                aria-expanded={walletDropdownOpen}
                aria-haspopup="menu"
              >
                <span className="cosmic-status-dot" aria-hidden="true" />
                <span>{formatAddress(address)}</span>
                <span>{walletType ?? 'Lace'}</span>
                <ChevronDown size={13} aria-hidden="true" />
              </button>

              {walletDropdownOpen && (
                <div
                  className="absolute right-0 z-50 mt-3 w-72 rounded-xl border border-[#d9d2c5] bg-[#fffdf8] p-4 shadow-[0_20px_50px_rgba(17,22,43,0.16)]"
                  role="menu"
                >
                  <div className="border-b border-[#e8e2d6] pb-3">
                    <p className="font-mono-tech text-[10px] uppercase tracking-[0.1em] text-[#6e7488]">Connected network</p>
                    <p className="mt-1 text-xs font-bold uppercase text-[#d94d35]">Midnight {network}</p>
                  </div>
                  <div className="py-3">
                    <p className="font-mono-tech text-[10px] uppercase tracking-[0.1em] text-[#6e7488]">Wallet address</p>
                    <p className="mt-1 break-all font-mono-tech text-xs text-[#27304a]">{address}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#e8e2d6] pt-3">
                    <Link
                      to="/settings"
                      className="text-xs font-bold text-[#27304a] hover:text-[#d94d35]"
                      onClick={() => setWalletDropdownOpen(false)}
                      role="menuitem"
                    >
                      Wallet settings
                    </Link>
                    <button
                      type="button"
                      className="text-xs font-bold text-[#d94d35] hover:text-[#11162b]"
                      onClick={() => {
                        disconnect();
                        setWalletDropdownOpen(false);
                      }}
                      role="menuitem"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="cosmic-wallet-button" onClick={() => connect('preprod')} disabled={isConnecting}>
              <Wallet size={14} aria-hidden="true" />
              <span>{isConnecting ? 'Connecting...' : 'Connect wallet'}</span>
            </button>
          )}

          <button
            type="button"
            className="cosmic-icon-button md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={`cosmic-mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="cosmic-nav-link"
              aria-current={isActive(link.path) ? 'page' : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/docs" className="cosmic-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Documentation <ExternalLink size={12} className="ml-1 inline" aria-hidden="true" />
          </Link>
        </nav>
        <div className="cosmic-mobile-controls">
          <button type="button" className="cosmic-demo-toggle is-on" onClick={() => setIsDemoMode(!isDemoMode)} aria-pressed={isDemoMode}>
            <Beaker size={12} className="mr-1 inline" aria-hidden="true" />
            Demo {isDemoMode ? 'on' : 'off'}
          </button>
          {!isConnected ? (
            <button type="button" className="cosmic-wallet-button" onClick={handleConnect} disabled={isConnecting}>
              <Wallet size={13} aria-hidden="true" />
              {isConnecting ? 'Connecting...' : 'Connect wallet'}
            </button>
          ) : (
            <button type="button" className="cosmic-wallet-button" onClick={() => { disconnect(); setMobileMenuOpen(false); }}>
              <span className="cosmic-status-dot" aria-hidden="true" />
              Disconnect
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
