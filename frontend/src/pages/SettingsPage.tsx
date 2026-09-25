import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, ExternalLink, Save, Check } from 'lucide-react';
import { storage } from '../lib/storage';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { DEFAULT_DEMO_CANDIDATE, INITIAL_JOBS, INITIAL_APPLICATIONS } from '../lib/mockData';

export const SettingsPage: React.FC = () => {
  const { network, connect, disconnect, isConnected } = useWallet();
  const { addToast } = useToast();

  const [contractAddress, setContractAddress] = useState(
    storage.getDeployedContractAddress(),
  );

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setDeployedContractAddress(contractAddress.trim());
    addToast('success', 'Contract Address Saved', 'Active screening contract updated.');
  };

  const handleResetData = () => {
    localStorage.clear();
    storage.saveCandidateProfile(DEFAULT_DEMO_CANDIDATE);
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#1f2128] pb-6 space-y-2">
        <span className="text-xs font-mono-tech uppercase text-[#00D284]">System Configuration</span>
        <h1 className="text-3xl font-extrabold text-[#f4f4f6]">Settings &amp; Diagnostics</h1>
        <p className="text-xs text-[#92939e]">
          Manage network endpoints, contract addresses, and privacy diagnostic state.
        </p>
      </div>

      {/* Network Configuration */}
      <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-4">
        <h2 className="text-sm font-bold text-[#f4f4f6]">Midnight Network Selection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-[#00D284]/30 bg-[#00D284]/5 space-y-1">
            <span className="text-xs font-bold text-[#00D284] block font-mono-tech">PREPROD (Active)</span>
            <span className="text-[11px] text-[#92939e] block">Official Midnight Preprod testnet</span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#14151a] space-y-1 opacity-70">
            <span className="text-xs font-bold text-[#f4f4f6] block font-mono-tech">PREVIEW</span>
            <span className="text-[11px] text-[#92939e] block">Preview network testbed</span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#14151a] space-y-1 opacity-70">
            <span className="text-xs font-bold text-[#f4f4f6] block font-mono-tech">LOCAL (Docker)</span>
            <span className="text-[11px] text-[#92939e] block">Local standalone dev stack</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs">
          <a
            href="https://faucet.preprod.midnight.network/api/drips"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#00D284] hover:underline"
          >
            <span>Get Preprod DUST (Faucet)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://preprod.midnightexplorer.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#92939e] hover:text-[#f4f4f6]"
          >
            <span>Preprod Blockchain Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Contract Address Override */}
      <form onSubmit={handleSaveContract} className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-4">
        <h2 className="text-sm font-bold text-[#f4f4f6]">Active Contract Address Override</h2>
        <p className="text-xs text-[#92939e]">
          Override the default smart contract address used for circuit calls and ledger reading.
        </p>

        <div>
          <input
            type="text"
            placeholder="64-character hex address (e.g. 0x...)"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6] focus:border-[#00D284]"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#14151a] hover:bg-[#1a1b22] text-[#f4f4f6] border border-[#22252b]"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Address</span>
        </button>
      </form>

      {/* Reset State */}
      <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-3">
        <h2 className="text-sm font-bold text-red-400">Reset Local Storage &amp; Demo State</h2>
        <p className="text-xs text-[#92939e]">
          Clears locally stored applications, jobs, and restores default demo profile.
        </p>
        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Local State</span>
        </button>
      </div>
    </div>
  );
};
