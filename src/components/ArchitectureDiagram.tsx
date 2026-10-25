import React, { useState } from 'react';
import {
  Laptop,
  Cloud,
  Server,
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  Cpu
} from 'lucide-react';

interface ArchitectureDiagramProps {
  pagesDomain: string;
  proxyIp: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  pagesDomain,
  proxyIp,
}) => {
  const [activeStep, setActiveStep] = useState<number>(3);
  const [simulationMode, setSimulationMode] = useState<'with-proxyip' | 'without-proxyip'>('with-proxyip');

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Cloudflare Pages & ProxyIP Relay Flow
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              How Cloudflare Pages edge functions harness <span className="font-mono text-cyan-400 text-xs">{proxyIp}</span> to
              de-obfuscate raw TCP sockets and bypass Cloudflare internal egress restrictions.
            </p>
          </div>

          {/* Interactive Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start lg:self-auto">
            <button
              onClick={() => setSimulationMode('with-proxyip')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                simulationMode === 'with-proxyip'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              With ProxyIP ({proxyIp.split('.')[0]}.sg)
            </button>
            <button
              onClick={() => setSimulationMode('without-proxyip')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                simulationMode === 'without-proxyip'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Direct Outbound (No Relay)
            </button>
          </div>
        </div>

        {/* Visual Interactive Pipeline */}
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1: Client */}
            <div
              onClick={() => setActiveStep(1)}
              className={`cursor-pointer p-4 rounded-lg border transition-all text-left ${
                activeStep === 1
                  ? 'border-cyan-500 bg-cyan-950/20'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-slate-500">Stage 01</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Client Node</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                v2rayN, Sing-box, or Clash initiates TLS WebSocket connection with early data (?ed=2048).
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs font-mono text-slate-500">
                Port 443 · WSS · TLS 1.3
              </div>
            </div>

            {/* Step 2: Cloudflare Pages Edge */}
            <div
              onClick={() => setActiveStep(2)}
              className={`cursor-pointer p-4 rounded-lg border transition-all text-left ${
                activeStep === 2
                  ? 'border-cyan-500 bg-cyan-950/20'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-slate-500">Stage 02</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Cloudflare Pages Edge</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Terminates TLS, validates UUID in _worker.js, and parses destination header address.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs font-mono text-slate-500 truncate">
                {pagesDomain}
              </div>
            </div>

            {/* Step 3: Outbound Relay / ProxyIP */}
            <div
              onClick={() => setActiveStep(3)}
              className={`cursor-pointer p-4 rounded-lg border transition-all text-left ${
                activeStep === 3
                  ? simulationMode === 'with-proxyip'
                    ? 'border-cyan-500 bg-cyan-950/20'
                    : 'border-amber-500 bg-amber-950/20'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    simulationMode === 'with-proxyip'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'bg-amber-900/30 text-amber-400'
                  }`}
                >
                  <Server className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-slate-500">Stage 03</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200">
                {simulationMode === 'with-proxyip' ? 'ProxyIP Relay (SG)' : 'Direct Egress (Risky)'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {simulationMode === 'with-proxyip'
                  ? 'Raw TCP socket routed to proxyip.sg.cmliussss.net, insulating destination from CF loops.'
                  : 'Direct connect() call triggers Cloudflare 10001/10002 errors or target ASN drops.'}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs font-mono text-slate-500 truncate">
                {simulationMode === 'with-proxyip' ? proxyIp : 'Direct IP (blocked by CF)'}
              </div>
            </div>

            {/* Step 4: Final Target Destination */}
            <div
              onClick={() => setActiveStep(4)}
              className={`cursor-pointer p-4 rounded-lg border transition-all text-left ${
                activeStep === 4
                  ? 'border-cyan-500 bg-cyan-950/20'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-slate-500">Stage 04</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Target Backend</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Remote server receives plain TCP stream with clean IP provenance and zero protocol leak.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs font-mono text-slate-500">
                Internet / Target APIs
              </div>
            </div>
          </div>
        </div>

        {/* Step Deep-Dive Explainer Box */}
        <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-slate-800">
          {activeStep === 1 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <Laptop className="w-4 h-4" />
                <span>Stage 1: Client Obfuscation & WebSocket Handshake</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you initiate browsing from clients like v2rayN, Sing-box, or Clash, your traffic is packed into standard HTTP/1.1 or HTTP/2 WebSocket frames wrapped in pure TLS 1.3 encryption. To regional firewalls and middleboxes, this request appears indistinguishable from regular web traffic accessing <span className="font-mono text-cyan-300">{pagesDomain}</span>.
              </p>
              <div className="text-xs text-slate-400 flex items-center gap-2 pt-2">
                <span className="text-slate-500">Early Data Acceleration:</span>
                <span>The <code className="text-cyan-400">?ed=2048</code> query parameter passes initial TCP SYN payload in the handshake, saving 1 full roundtrip (0-RTT).</span>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <Cloud className="w-4 h-4" />
                <span>Stage 2: Cloudflare Anycast Ingestion & Pages Worker Execution</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cloudflare's nearest edge data center terminates the TLS session. The <span className="font-mono text-slate-200">_worker.js</span> runtime script unpacks the first 24+ bytes of the VLESS payload to verify the secret UUID. If the UUID matches, the worker switches to duplex streaming mode.
              </p>
              <div className="text-xs text-slate-400 flex items-center gap-2 pt-2">
                <span className="text-slate-500">Disguise Layer:</span>
                <span>Unauthenticated browsers hitting this domain receive a clean HTTP 200 HTML status page instead of revealing the proxy service.</span>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <Server className="w-4 h-4" />
                <span>Stage 3: The Critical Role of {proxyIp}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Why can't Cloudflare Workers connect directly to destination servers? Cloudflare restricts edge workers from connecting directly to hosts on Cloudflare's own network (returning <strong className="text-red-400">Error 10001: DNS points to prohibited IP</strong> or <strong className="text-red-400">Error 10002</strong>). Furthermore, many CDNs outright ban Cloudflare's egress ASN (AS13335).
              </p>
              <div className="text-xs text-slate-400 pt-1 space-y-1">
                <div>• <span className="text-cyan-300">Transit Gateway:</span> By sending the raw socket to <code className="text-cyan-300">{proxyIp}</code>, the edge worker delegates outbound delivery to high-capacity transit servers located in Singapore.</div>
                <div>• <span className="text-cyan-300">Anti-SNI Blocking:</span> Obfuscated TLS payloads are bridged cleanly through independent Singapore ISP peering (Equinix / Singtel), preventing ISP drops.</div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                <Globe className="w-4 h-4" />
                <span>Stage 4: Target Backend Delivery & Unrestricted Data Return</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The destination website or API receives requests from the clean Singapore proxy relay rather than Cloudflare edge IP pools. Responses are piped back via the persistent duplex socket and converted back into WebSocket binary chunks to the client.
              </p>
              <div className="text-xs text-slate-400 pt-2 flex items-center gap-2">
                <span className="text-slate-500">Symmetric Bandwidth:</span>
                <span>Supports multi-gigabit streaming, low jitter video conferencing, and low-latency API proxying.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Matrix: With vs Without ProxyIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configured With proxyip.sg.cmliussss.net</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>No Cloudflare Loop Errors:</strong> Completely avoids Error 10001/10002 when visiting Cloudflare-protected sites.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Stable Obfuscation:</strong> Obfuscated payloads pass through Singapore high-speed fiber without being flagged by SNI inspection.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Singapore Regional Routing:</strong> Optimal latency for Southeast Asia and Asia-Pacific routing with low jitter.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Zero Extra Cost:</strong> Uses Cloudflare Pages free tier (100,000 function invocations/day with unlimited bandwidth).</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Without ProxyIP (Direct Cloudflare Egress)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>Error 10001 Failures:</strong> Up to 40% of internet sites protected by Cloudflare CDN drop connections instantly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>ASN Blacklisting:</strong> Websites and streaming providers aggressively block traffic originating from AS13335.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>Frequent WebSocket Resets:</strong> Cloudflare edge terminates un-relayed long-lived sockets during route re-balancing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>High Packet Loss:</strong> Higher packet drop rates during peak ISP international traffic congestion.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
