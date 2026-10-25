import React, { useState } from 'react';
import { ProxyNodeConfig } from '../types';
import {
  generateVlessUri,
  generateClashMetaYaml,
  generateSingBoxJson,
  generateShadowrocketUri,
  generateQuantumultX,
  generateSurge,
  generateBase64Subscription,
} from '../utils/vless';
import { Copy, Check, Download, QrCode as QrIcon, FileCode2, ExternalLink } from 'lucide-react';

interface ClientConfigExportProps {
  config: ProxyNodeConfig;
  onOpenQr: (content: string, title: string) => void;
}

export const ClientConfigExport: React.FC<ClientConfigExportProps> = ({
  config,
  onOpenQr,
}) => {
  const [activeFormat, setActiveFormat] = useState<
    'vless' | 'clash' | 'singbox' | 'shadowrocket' | 'qx' | 'surge' | 'sub'
  >('vless');
  const [copied, setCopied] = useState(false);

  const vlessUri = generateVlessUri(config);
  const clashYaml = generateClashMetaYaml(config);
  const singboxJson = generateSingBoxJson(config);
  const shadowrocketUri = generateShadowrocketUri(config);
  const qxLine = generateQuantumultX(config);
  const surgeLine = generateSurge(config);
  const base64Sub = generateBase64Subscription([vlessUri]);
  const directSubUrl = `https://${config.pagesDomain.trim() || 'your-node.pages.dev'}/sub`;

  let displayContent = '';
  let filename = '';
  let fileType = 'text/plain';

  switch (activeFormat) {
    case 'vless':
      displayContent = vlessUri;
      filename = `${config.name || 'node'}.txt`;
      break;
    case 'clash':
      displayContent = clashYaml;
      filename = `${config.name || 'clash_proxy'}.yaml`;
      fileType = 'text/yaml';
      break;
    case 'singbox':
      displayContent = singboxJson;
      filename = `${config.name || 'singbox_outbound'}.json`;
      fileType = 'application/json';
      break;
    case 'shadowrocket':
      displayContent = shadowrocketUri;
      filename = `${config.name || 'shadowrocket'}.txt`;
      break;
    case 'qx':
      displayContent = qxLine;
      filename = `${config.name || 'quantumult_x'}.conf`;
      break;
    case 'surge':
      displayContent = surgeLine;
      filename = `${config.name || 'surge'}.conf`;
      break;
    case 'sub':
      displayContent = `# Cloudflare Pages Dynamic Subscription Endpoint:\n${directSubUrl}\n\n# Or Import via Base64 Payload:\n${base64Sub}`;
      filename = `${config.name || 'subscription'}.txt`;
      break;
  }

  const handleCopy = () => {
    const textToCopy =
      activeFormat === 'sub' ? directSubUrl : displayContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([displayContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Client Profile & Subscription Export
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Export directly to v2rayN, Clash Meta/Mihomo, Sing-box, Shadowrocket, or generate QR code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQr(vlessUri, `${config.name} (VLESS QR)`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
          >
            <QrIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Show QR Code</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Config'}</span>
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFormat('vless')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeFormat === 'vless'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          v2rayN / VLESS URI
        </button>
        <button
          onClick={() => setActiveFormat('clash')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeFormat === 'clash'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Clash Meta / Mihomo
        </button>
        <button
          onClick={() => setActiveFormat('singbox')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeFormat === 'singbox'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Sing-box JSON
        </button>
        <button
          onClick={() => setActiveFormat('shadowrocket')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeFormat === 'shadowrocket'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Shadowrocket
        </button>
        <button
          onClick={() => setActiveFormat('qx')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeFormat === 'qx'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Quantumult X
        </button>
        <button
          onClick={() => setActiveFormat('surge')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeFormat === 'surge'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Surge
        </button>
        <button
          onClick={() => setActiveFormat('sub')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeFormat === 'sub'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Subscription Link
        </button>
      </div>

      {/* Code Display Area */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{filename}</span>
          </div>
          <span className="text-slate-500">
            Outbound Relay: <span className="text-cyan-400">{config.proxyIp}</span>
          </span>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-72 leading-relaxed selection:bg-cyan-900">
          <code>{displayContent}</code>
        </pre>
      </div>

      {/* Connection Metadata Strip (Tabular discipline, anti-pill unboxed text) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 pt-1">
        <span>Protocol: <strong className="text-slate-200 font-mono">VLESS WebSocket</strong></span>
        <span aria-hidden="true">·</span>
        <span>Port: <strong className="text-slate-200 font-mono tabular-nums">{config.port}</strong></span>
        <span aria-hidden="true">·</span>
        <span>SNI: <strong className="text-slate-200 font-mono">{config.sni || config.pagesDomain}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Transit Relay: <strong className="text-cyan-400 font-mono">{config.proxyIp}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Early Data: <strong className="text-emerald-400 font-mono">2048 B (0-RTT)</strong></span>
      </div>
    </div>
  );
};
