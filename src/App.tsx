import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { ConfigBuilder } from './components/ConfigBuilder';
import { ClientConfigExport } from './components/ClientConfigExport';
import { WorkerCodeViewer } from './components/WorkerCodeViewer';
import { DiagnosticConsole } from './components/DiagnosticConsole';
import { ProxyIpRegistry } from './components/ProxyIpRegistry';
import { QrCodeModal } from './components/QrCodeModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { ProxyNodeConfig, ProxyIpItem } from './types';
import { FEATURED_PROXY_IP } from './data/proxyIps';
import {
  ShieldCheck,
  Server,
  Zap,
  Globe2,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

const DEFAULT_CONFIG: ProxyNodeConfig = {
  id: 'node-sg-primary',
  name: 'CF-Pages-V2Ray-SG',
  protocol: 'vless',
  pagesDomain: 'my-v2ray-node.pages.dev',
  cleanIp: 'www.visa.com.sg',
  port: 443,
  uuid: 'd342d11e-d424-4583-b36e-524ab1f0afa4',
  path: '/?ed=2048',
  sni: 'my-v2ray-node.pages.dev',
  host: 'my-v2ray-node.pages.dev',
  proxyIp: FEATURED_PROXY_IP,
  proxyIpPort: 443,
  earlyData: true,
  earlyDataLength: 2048,
  tls: true,
  alpn: ['h2', 'http/1.1'],
  network: 'ws',
  remarks: 'Singapore Equinix Node via Cloudflare Pages',
};

export default function App() {
  const [config, setConfig] = useState<ProxyNodeConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<string>('builder');
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    content: string;
    title: string;
  }>({
    isOpen: false,
    content: '',
    title: '',
  });
  const [deployModalOpen, setDeployModalOpen] = useState(false);

  const handleOpenQr = (content: string, title: string) => {
    setQrModal({ isOpen: true, content, title });
  };

  const handleSelectProxyIp = (host: string) => {
    setConfig((prev) => ({
      ...prev,
      proxyIp: host,
      remarks: `Relayed via ${host}`,
    }));
  };

  const handleSelectCleanIp = (cleanIp: string) => {
    setConfig((prev) => ({
      ...prev,
      cleanIp,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDeployModal={() => setDeployModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero & Context Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>CLOUDFLARE PAGES · V2RAY/VLESS · PROXYIP RELAY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight text-balance">
              Cloudflare Pages V2Ray & ProxyIP Relay Architect
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Harness Cloudflare edge functions with VLESS over WebSocket, accelerated by{' '}
              <strong className="text-cyan-300 font-mono">{config.proxyIp}</strong> for
              uninhibited outbound TCP connectivity and zero Cloudflare Error 10001/10002 loops.
            </p>
          </div>

          {/* Quick Metrics Strip (Tabular discipline, anti-pill unboxed text) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Protocol</div>
              <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">VLESS over WSS</div>
              <div className="text-[11px] text-slate-500">TLS 1.3 · 0-RTT (?ed=2048)</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Outbound Relay</div>
              <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5 truncate">
                {config.proxyIp}
              </div>
              <div className="text-[11px] text-slate-500">Equinix SG Transit</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Clean Fronting IP</div>
              <div className="text-sm font-bold text-slate-200 font-mono mt-0.5 truncate">
                {config.cleanIp || 'Direct pages.dev'}
              </div>
              <div className="text-[11px] text-slate-500">Bypasses ISP DNS Blocks</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Egress Security</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">Anti-Looping 100%</div>
              <div className="text-[11px] text-slate-500">De-obfuscated raw sockets</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher for Mobile / Quick Navigation */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'builder', label: 'Builder' },
            { id: 'architecture', label: 'Relay Flow' },
            { id: 'worker', label: '_worker.js' },
            { id: 'diagnostics', label: 'Diagnostics' },
            { id: 'registry', label: 'ProxyIP Pool' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Views */}
        {activeTab === 'builder' && (
          <div className="space-y-8">
            <ConfigBuilder
              config={config}
              onChange={setConfig}
              onSelectProxyIp={(item) => handleSelectProxyIp(item.host)}
            />
            <ClientConfigExport config={config} onOpenQr={handleOpenQr} />
          </div>
        )}

        {activeTab === 'architecture' && (
          <ArchitectureDiagram
            pagesDomain={config.pagesDomain}
            proxyIp={config.proxyIp}
          />
        )}

        {activeTab === 'worker' && (
          <WorkerCodeViewer
            config={config}
            onOpenDeployModal={() => setDeployModalOpen(true)}
          />
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticConsole currentProxyIp={config.proxyIp} />
        )}

        {activeTab === 'registry' && (
          <ProxyIpRegistry
            currentProxyIp={config.proxyIp}
            currentCleanIp={config.cleanIp}
            onSelectProxyIp={handleSelectProxyIp}
            onSelectCleanIp={handleSelectCleanIp}
          />
        )}
      </main>

      {/* Modals */}
      <QrCodeModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal((prev) => ({ ...prev, isOpen: false }))}
        title={qrModal.title}
        qrContent={qrModal.content}
      />

      <DeployGuideModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        config={config}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Cloudflare Pages & V2Ray Architect</span>
            <span aria-hidden="true">·</span>
            <span>Optimized for <code className="text-cyan-400 font-mono">proxyip.sg.cmliussss.net</code></span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-200 transition-colors"
            >
              Architecture Specs
            </button>
            <button
              onClick={() => setActiveTab('worker')}
              className="hover:text-slate-200 transition-colors"
            >
              _worker.js
            </button>
            <button
              onClick={() => setDeployModalOpen(true)}
              className="hover:text-slate-200 transition-colors text-cyan-400"
            >
              Deployment Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
