import React, { useCallback, useState } from 'react';
import { AlertCircle, Check, CheckCircle2, Copy, ExternalLink, Loader2, Rocket, ShieldCheck } from 'lucide-react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { storage } from '../lib/storage';

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
  const [deployedAddress, setDeployedAddress] = useState<string | null>(storage.getDeployedContractAddress() || null);
  const [copied, setCopied] = useState(false);
  const [initialMinGpa, setInitialMinGpa] = useState<number>(7.5);
  const [initialMinExp, setInitialMinExp] = useState<number>(12);
  const [applicantLimit, setApplicantLimit] = useState<number>(100);

  const handleDeploy = useCallback(async () => {
    if (!session || !isConnected) {
      addToast('error', 'Wallet required', 'Connect a Midnight wallet before deploying to Preprod.');
      return;
    }

    setStatus('deploying');
    setErrorMsg(null);

    try {
      const compiledContract = getCompiledContract();
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60);
      const recruiterAdminHash = new Uint8Array(32);
      const deployTxData = await (createUnprovenDeployTx as any)(session.providers as any, {
        compiledContract,
        args: [
          BigInt(Math.round(initialMinGpa * 100)),
          BigInt(initialMinExp),
          1n,
          101n,
          recruiterAdminHash,
          deadline,
          BigInt(applicantLimit),
        ],
        privateStateId: 'BlindHireDeployerState',
        initialPrivateState: {},
        signingKey: sampleSigningKey(),
      });

      const contractAddress = deployTxData.public.contractAddress;
      await submitTxAsync(session.providers as any, { unprovenTx: deployTxData.private.unprovenTx });

      setDeployedAddress(contractAddress);
      storage.setDeployedContractAddress(contractAddress);
      setStatus('deployed');
      addToast('success', 'Contract submitted', `Preprod address: ${contractAddress.slice(0, 16)}...`);
    } catch (error: any) {
      console.error('Deployment error:', error);
      const message = error?.message ?? String(error);
      setStatus('error');
      setErrorMsg(message);
      addToast('error', 'Deployment failed', message);
    }
  }, [session, isConnected, initialMinGpa, initialMinExp, applicantLimit, addToast]);

  const copyToClipboard = async () => {
    if (!deployedAddress) return;
    try {
      await navigator.clipboard.writeText(deployedAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      addToast('info', 'Address copied', 'The contract address is on your clipboard.');
    } catch {
      addToast('error', 'Copy failed', 'Copy the address manually from the field.');
    }
  };

  return (
    <div className="world-page">
      <div className="world-container max-w-5xl">
        <header className="world-page-header">
          <div>
            <p className="world-section-kicker">Admin tooling / wallet transaction</p>
            <h1 className="world-page-title">Put the screening<br />logic in orbit.</h1>
            <p className="world-page-description">
              Deploy the BlindHire contract to Midnight Preprod with a connected wallet. This is the on-chain path; creating a role elsewhere in the app only saves local demo data.
            </p>
          </div>
          <span className="world-badge is-warn">Preprod deployment</span>
        </header>

        <div className="mt-8 flex items-start gap-3 border border-[#d7a32466] bg-[#fff3cf] p-4 text-sm text-[#80530c]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <b className="block font-mono-tech text-xs uppercase tracking-[0.08em]">This action is on-chain</b>
            <p className="mt-1 leading-6">Deployment needs a {network || 'Preprod'} wallet with testnet DUST and wallet approval. It is separate from local role creation and cannot be undone by resetting browser state.</p>
          </div>
        </div>

        {!isConnected ? (
          <section className="world-card-dark mt-5 p-8 text-center md:p-12" aria-labelledby="connect-title">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#ff7352] text-[#11162b]"><Rocket size={23} aria-hidden="true" /></span>
            <p className="mt-6 font-mono-tech text-[0.65rem] uppercase tracking-[0.1em] text-[#c8ef83]">Wallet gate</p>
            <h2 id="connect-title" className="mt-2 font-[DM_Serif_Display] text-4xl font-normal tracking-[-0.06em] text-[#fffdf8]">Connect before you deploy.</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#aab2ca]">Use Lace, 1AM, or Nightly on Midnight Preprod. Your wallet signs the transaction; BlindHire never needs your identity to screen candidates.</p>
            <button type="button" onClick={() => void connect('preprod')} className="world-button mt-7 !bg-[#ff7352] !text-[#11162b] !shadow-[5px_5px_0_#c8ef83]"><Rocket size={15} aria-hidden="true" /> Connect wallet</button>
          </section>
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="world-card p-6 md:p-8" aria-labelledby="parameters-title">
              <div className="flex items-center gap-3 border-b border-[#e8e2d6] pb-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c8ef83] text-[#11162b]"><ShieldCheck size={17} aria-hidden="true" /></span>
                <div>
                  <p className="world-section-kicker !mb-1">01 / Constructor</p>
                  <h2 id="parameters-title" className="world-card-title">Choose initial thresholds</h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#6e7488]">These values are written into the deployed screening contract. A later local role save does not change them.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <label>
                  <span className="world-label">Initial minimum GPA</span>
                  <input type="number" inputMode="decimal" step="0.1" min="0" max="10" value={initialMinGpa} onChange={(event) => setInitialMinGpa(parseFloat(event.target.value) || 0)} className="world-input font-mono-tech" />
                </label>
                <label>
                  <span className="world-label">Experience / months</span>
                  <input type="number" inputMode="numeric" min="0" value={initialMinExp} onChange={(event) => setInitialMinExp(parseInt(event.target.value, 10) || 0)} className="world-input font-mono-tech" />
                </label>
                <label>
                  <span className="world-label">Applicant cap</span>
                  <input type="number" inputMode="numeric" min="1" value={applicantLimit} onChange={(event) => setApplicantLimit(parseInt(event.target.value, 10) || 0)} className="world-input font-mono-tech" />
                </label>
              </div>
              <button type="button" onClick={() => void handleDeploy()} disabled={status === 'deploying'} className="world-button mt-7 disabled:cursor-wait disabled:opacity-50">
                {status === 'deploying' ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Waiting for wallet approval</> : <><Rocket size={15} aria-hidden="true" /> Deploy to Midnight Preprod</>}
              </button>
              <p className="mt-4 font-mono-tech text-[0.62rem] uppercase tracking-[0.08em] text-[#6e7488]">{walletType ?? 'Midnight wallet'} connected · {network || 'preprod'}</p>
            </section>

            <aside className="world-card-dark p-6 md:p-8">
              <p className="font-mono-tech text-[0.65rem] uppercase tracking-[0.1em] text-[#c8ef83]">Before you sign</p>
              <ul className="mt-5 grid gap-4 text-sm leading-6 text-[#aab2ca]">
                <li className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#c8ef83]" aria-hidden="true" /> Wallet is connected to Midnight Preprod.</li>
                <li className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#c8ef83]" aria-hidden="true" /> Constructor thresholds become public contract configuration.</li>
                <li className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#c8ef83]" aria-hidden="true" /> Testnet DUST may be consumed by the transaction.</li>
              </ul>
            </aside>
          </div>
        )}

        {deployedAddress && (
          <section className="world-card mt-5 border-[#3e5d1550] p-6 md:p-8" aria-labelledby="address-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="world-section-kicker !text-[#3e5d15]">{status === 'deployed' ? '02 / Confirmed' : 'Saved reference'}</p>
                <h2 id="address-title" className="world-card-title flex items-center gap-2"><CheckCircle2 size={19} className="text-[#3e5d15]" aria-hidden="true" /> {status === 'deployed' ? 'Preprod contract submitted' : 'Contract address on file'}</h2>
              </div>
              <a href={`https://preprod.midnightexplorer.com/contracts/${deployedAddress}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#3e5d15] hover:underline">Open explorer <ExternalLink size={13} aria-hidden="true" /></a>
            </div>
            <div className="mt-6 flex items-center gap-3 border border-[#11162b24] bg-[#fffdf8b3] p-3">
              <code className="min-w-0 flex-1 break-all font-mono-tech text-xs leading-6 text-[#11162b]">{deployedAddress}</code>
              <button type="button" onClick={() => void copyToClipboard()} aria-label="Copy contract address" title="Copy contract address" className="grid h-11 w-11 shrink-0 place-items-center border border-[#11162b24] bg-[#f6f2e9] text-[#11162b] hover:bg-[#ff735214]">
                {copied ? <Check size={16} className="text-[#3e5d15]" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              </button>
            </div>
          </section>
        )}

        {errorMsg && <section className="mt-5 border border-[#d94d354d] bg-[#ff735214] p-5 text-sm text-[#9b3625]" role="alert"><p className="font-semibold">Deployment error</p><pre className="mt-2 whitespace-pre-wrap break-words font-mono-tech text-xs leading-6">{errorMsg}</pre></section>}
      </div>
    </div>
  );
};
