import React, { useState } from 'react';
import { ProxyNodeConfig } from '../types';
import { generatePagesWorkerScript } from '../utils/workerGenerator';
import { Copy, Check, Download, FileCode, CheckCircle2, Shield, Sparkles } from 'lucide-react';

interface WorkerCodeViewerProps {
  config: ProxyNodeConfig;
  onOpenDeployModal: () => void;
}

export const WorkerCodeViewer: React.FC<WorkerCodeViewerProps> = ({
  config,
  onOpenDeployModal,
}) => {
  const [copied, setCopied] = useState(false);
  const workerScript = generatePagesWorkerScript(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(workerScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '_worker.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Cloudflare Pages _worker.js Runtime
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              cloudflare:sockets
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Production-grade edge function handling VLESS parsing, early data, and raw TCP relay to{' '}
            <span className="font-mono text-cyan-400 text-xs">{config.proxyIp}</span>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDeployModal}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
          >
            Deploy Guide
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download _worker.js</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy _worker.js'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>_worker.js</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Target Relay: {config.proxyIp}</span>
          </div>
          <span className="text-slate-500">ECMAScript Module (ESM)</span>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-96 leading-relaxed selection:bg-cyan-900">
          <code>{workerScript}</code>
        </pre>
      </div>

      {/* Technical Highlights / Mechanism Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Duplex TCP Socket Relay</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calls Cloudflare's <code className="text-cyan-300 font-mono">connect()</code> API to establish a raw TCP pipe directly to <code className="text-cyan-300 font-mono">{config.proxyIp}</code>, bypassing CF loop errors.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sec-WebSocket-Protocol 0-RTT</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts early data bytes encoded in base64url from the WebSocket handshake header, avoiding handshake delay for TLS inside TLS.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dynamic Subscription Endpoints</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built-in handlers for <code className="text-cyan-300 font-mono">/sub</code>, <code className="text-cyan-300 font-mono">/clash</code>, and <code className="text-cyan-300 font-mono">/singbox</code> returning base64 nodes with custom user info headers.
          </p>
        </div>
      </div>
    </div>
  );
};
