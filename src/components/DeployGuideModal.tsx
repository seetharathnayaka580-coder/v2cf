import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Terminal, CheckCircle2, ShieldAlert, Rocket } from 'lucide-react';
import { ProxyNodeConfig } from '../types';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProxyNodeConfig;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Cloudflare Pages Deployment Handbook
              </h3>
              <p className="text-xs text-slate-400">
                Deploying V2Ray & VLESS with <span className="font-mono text-cyan-400">{config.proxyIp}</span> in 3 minutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Step Workflow */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Step 1: Download _worker.js
              </span>
              <span className="text-xs font-mono text-slate-500">Local Prep</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download the generated <code className="text-cyan-300 font-mono">_worker.js</code> from the Pages Worker Script tab. Create a new folder on your computer and place <code className="text-cyan-300 font-mono">_worker.js</code> inside it.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Step 2: Create Cloudflare Pages Project
              </span>
              <a
                href="https://dash.cloudflare.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <span>Open Cloudflare Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In your Cloudflare dashboard, navigate to <strong>Workers & Pages</strong> → <strong>Create Application</strong> → select the <strong>Pages</strong> tab → choose <strong>Upload assets</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Name your project (e.g. <span className="font-mono text-slate-200">my-v2ray-node</span>) and drag & drop the folder containing your <code className="text-slate-300 font-mono">_worker.js</code>.
            </p>
          </div>

          {/* Step 3: Env Vars */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Step 3: Configure Environment Variables
              </span>
              <span className="text-xs font-mono text-emerald-400">Essential</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Go to your Pages project → <strong>Settings</strong> → <strong>Environment variables</strong> → <strong>Production</strong>, and add:
            </p>

            <div className="space-y-2">
              {/* UUID */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400">Variable: </span>
                  <strong className="text-slate-200">UUID</strong>
                  <span className="text-slate-500 mx-2">=</span>
                  <span className="text-cyan-400">{config.uuid}</span>
                </div>
                <button
                  onClick={() => handleCopy(config.uuid, 'uuid')}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'uuid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'uuid' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* PROXYIP */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400">Variable: </span>
                  <strong className="text-slate-200">PROXYIP</strong>
                  <span className="text-slate-500 mx-2">=</span>
                  <span className="text-cyan-400">{config.proxyIp}</span>
                </div>
                <button
                  onClick={() => handleCopy(config.proxyIp, 'proxyip')}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'proxyip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'proxyip' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 4: Verification */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Step 4: Verify Deployment & Import
              </span>
              <span className="text-xs font-mono text-slate-500">Ready</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visit <code className="text-slate-200 font-mono">https://&lt;your-project&gt;.pages.dev</code> — you will see the active disguise gateway.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visit <code className="text-slate-200 font-mono">https://&lt;your-project&gt;.pages.dev/sub</code> — returns your base64 subscription node.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copy the VLESS link or scan the QR Code into v2rayN, Clash Meta, or Sing-box.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            I Understand, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
