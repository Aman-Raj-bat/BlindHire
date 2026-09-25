import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import { Contract, pureCircuits } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { storage } from '../lib/storage';
import { Rocket, CheckCircle2, ExternalLink, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

function getCompiledContract() {
  return CompiledContract.make('BlindHire', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export const AdminDeployPage: React.FC = () => {
  const { session, isConnected, walletType, network, connect } = useWallet();
  const { addToast } = useToast();

  const [status, setStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(
    storage.getDeployedContractAddress() || null,
  );
  const [copied, setCopied] = useState(false);

  // Initial parameters for deployment
  const [initialMinGpa, setInitialMinGpa] = useState<number>(7.5);
  const [initialMinExp, setInitialMinExp] = useState<number>(12);
  const [applicantLimit, setApplicantLimit] = useState<number>(100);

  const handleDeploy = useCallback(async () => {
    if (!session || !isConnected) {
      addToast('error', 'Wallet Required', 'Connect 1AM or Lace wallet before deploying.');
      return;
    }

    setStatus('deploying');
    setErrorMsg(null);

    try {
      const compiledContract = getCompiledContract();

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60);
      const recruiterAdminHash = new Uint8Array(32); // Fallback / default recruiter pubkey hash

      const deployTxData = await createUnprovenDeployTx(session.providers as any, {
        compiledContract,
        args: [
          BigInt(Math.round(initialMinGpa * 100)),
          BigInt(initialMinExp),
          1n, // CS/IT degree
          101n, // Node.js cert
          recruiterAdminHash,
          deadline,
          BigInt(applicantLimit),
        ],
        privateStateId: 'BlindHireDeployerState',
        initialPrivateState: {},
        signingKey: sampleSigningKey(),
      });

      const contractAddress = deployTxData.public.contractAddress;

      await submitTxAsync(session.providers as any, {
        unprovenTx: deployTxData.private.unprovenTx,
      });

      setDeployedAddress(contractAddress);
      storage.setDeployedContractAddress(contractAddress);
      setStatus('deployed');
      addToast('success', 'Contract Deployed Successfully!', `Address: ${contractAddress.slice(0, 16)}...`);
    } catch (e: any) {
      console.error('Deployment error:', e);
      const msg = e?.message ?? String(e);
      setStatus('error');
      setErrorMsg(msg);
      addToast('error', 'Deployment Failed', msg);
    }
  }, [session, isConnected, initialMinGpa, initialMinExp, applicantLimit, addToast]);

  const copyToClipboard = () => {
    if (!deployedAddress) return;
    navigator.clipboard.writeText(deployedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('info', 'Address Copied', 'Contract address copied to clipboard.');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#1f2128] pb-6 space-y-2">
        <span className="text-xs font-mono-tech uppercase text-[#00D284]">Admin Tooling</span>
        <h1 className="text-3xl font-extrabold text-[#f4f4f6]">Deploy BlindHire to Midnight Preprod</h1>
        <p className="text-xs text-[#92939e]">
          Browser-based deployment using the 1AM or Lace wallet extension (Section 11 of Midnight Master Guide).
        </p>
      </div>

      {!isConnected ? (
        <div className="p-8 rounded-2xl border border-[#1f2128] bg-[#111215] text-center space-y-4">
          <Rocket className="w-8 h-8 text-[#00D284] mx-auto" />
          <h2 className="text-base font-bold text-[#f4f4f6]">Connect Wallet to Deploy</h2>
          <p className="text-xs text-[#92939e] max-w-md mx-auto">
            Deploying the contract requires an active connection to a Midnight Preprod wallet with testnet DUST.
          </p>
          <button
            onClick={() => connect('preprod')}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#00D284] text-[#09090b] hover:bg-[#00b872]"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Config Parameters */}
          <div className="p-6 rounded-2xl border border-[#1f2128] bg-[#111215] space-y-4">
            <h2 className="text-sm font-bold text-[#f4f4f6]">Initial Screening Constructor Parameters</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#92939e] block mb-1">Initial Min GPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={initialMinGpa}
                  onChange={(e) => setInitialMinGpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6]"
                />
              </div>

              <div>
                <label className="text-xs text-[#92939e] block mb-1">Min Experience (Months)</label>
                <input
                  type="number"
                  value={initialMinExp}
                  onChange={(e) => setInitialMinExp(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6]"
                />
              </div>

              <div>
                <label className="text-xs text-[#92939e] block mb-1">Applicant Cap</label>
                <input
                  type="number"
                  value={applicantLimit}
                  onChange={(e) => setApplicantLimit(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-[#1f2128] bg-[#14151a] text-xs font-mono-tech text-[#f4f4f6]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDeploy}
                disabled={status === 'deploying'}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#00D284] hover:bg-[#00b872] text-[#09090b] transition-all disabled:opacity-50"
              >
                {status === 'deploying' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deploying to Midnight... Approve in Wallet Popup</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Deploy BlindHire to Preprod</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Deployed Address Display */}
          {deployedAddress && (
            <div className="p-6 rounded-2xl border border-[#00D284]/30 bg-[#00D284]/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech text-[#00D284] uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Active Preprod Contract
                </span>
                <a
                  href={`https://preprod.midnightexplorer.com/contracts/${deployedAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#00D284] hover:underline"
                >
                  <span>Open on Midnight Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl border border-[#1f2128] bg-[#0c0d10] flex items-center justify-between gap-3">
                <code className="text-xs font-mono-tech text-[#f4f4f6] break-all">{deployedAddress}</code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg text-[#92939e] hover:text-[#f4f4f6] bg-[#14151a] border border-[#22252b] shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-[#00D284]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/20 text-xs text-red-300">
              <p className="font-semibold mb-1">Deployment Error:</p>
              <pre className="font-mono-tech break-words text-[11px]">{errorMsg}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
