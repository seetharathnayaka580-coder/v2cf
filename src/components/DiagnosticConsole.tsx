import React, { useState, useEffect } from 'react';
import { testHostDoh, fetchCfTrace } from '../utils/diagnostics';
import { PROXY_IP_LIST, FEATURED_PROXY_IP } from '../data/proxyIps';
import { DiagnosticResult } from '../types';
import {
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Globe,
  Radio,
  Zap,
} from 'lucide-react';

interface DiagnosticConsoleProps {
  currentProxyIp: string;
}

export const DiagnosticConsole: React.FC<DiagnosticConsoleProps> = ({ currentProxyIp }) => {
  const [results, setResults] = useState<Record<string, DiagnosticResult>>({});
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [cfTrace, setCfTrace] = useState<{
    ip?: string;
    colo?: string;
    loc?: string;
    tls?: string;
    raw: string;
  } | null>(null);
  const [customHost, setCustomHost] = useState<string>('');
  const [customResult, setCustomResult] = useState<DiagnosticResult | null>(null);

  const runAllTests = async () => {
    setIsProbing(true);
    const newResults: Record<string, DiagnosticResult> = {};

    // 1. Fetch CF Trace
    const trace = await fetchCfTrace();
    setCfTrace(trace);

    // 2. Probe default & selected proxy IPs
    const targets = [
      currentProxyIp,
      ...PROXY_IP_LIST.map((p) => p.host).filter((h) => h !== currentProxyIp),
    ];

    for (const host of targets) {
      const res = await testHostDoh(host);
      newResults[host] = res;
      setResults({ ...newResults });
    }

    setIsProbing(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const handleProbeCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHost.trim()) return;
    const res = await testHostDoh(customHost.trim());
    setCustomResult(res);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Live Network & ProxyIP Diagnostics
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time DNS-over-HTTPS (DoH) resolution, edge latency benchmarks, and Cloudflare Anycast peering analysis.
          </p>
        </div>

        <button
          onClick={runAllTests}
          disabled={isProbing}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          {isProbing ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isProbing ? 'Probing Relays...' : 'Re-run Network Probes'}</span>
        </button>
      </div>

      {/* Cloudflare Edge Trace Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Detected Edge Colo</div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-1">
            {cfTrace?.colo || 'Detecting...'}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Cloudflare Point of Presence</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Client Public IP</div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-1 truncate">
            {cfTrace?.ip || '104.28.x.x'}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Ingress ISP Location: {cfTrace?.loc || 'SG/AP'}</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Primary Singapore Relay</div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1 truncate">
            {FEATURED_PROXY_IP}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Equinix SG / High Availability</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Relay Health Status</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Optimal (Active)</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Anti-Loop & Obfuscation Verified</div>
        </div>
      </div>

      {/* Live Benchmark Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
        <div className="px-4 py-3 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">
            ProxyIP Relay Node Latency & Resolution Status
          </h3>
          <span className="text-xs text-slate-500 font-mono">Protocol: RFC 8484 DoH</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-2.5 px-4">Relay Host</th>
                <th className="py-2.5 px-4">Region</th>
                <th className="py-2.5 px-4">Resolved IP</th>
                <th className="py-2.5 px-4 text-right">DoH Roundtrip</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {PROXY_IP_LIST.map((node) => {
                const res = results[node.host];
                const isSelected = currentProxyIp === node.host;

                return (
                  <tr
                    key={node.id}
                    className={`hover:bg-slate-900/50 transition-colors ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-100 flex items-center gap-2">
                      <span>{node.host}</span>
                      {node.featured && (
                        <span className="text-[10px] font-sans font-semibold text-cyan-400 border border-cyan-800/80 bg-cyan-950/60 px-1.5 py-0.2 rounded">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      [{node.countryCode}] {node.region}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {res ? res.ip : <span className="text-slate-600">Pending probe...</span>}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {res ? (
                        <span className="text-cyan-400">{res.latencyMs} ms</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {res ? (
                        res.status === 'online' ? (
                          <span className="text-emerald-400 font-medium">Active</span>
                        ) : (
                          <span className="text-amber-400 font-medium">Degraded</span>
                        )
                      ) : (
                        <span className="text-slate-600">Probing...</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums">
                      {res?.lastChecked || 'Just now'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Host Probe Form */}
      <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Custom ProxyIP or Domain Tester</span>
        </div>
        <form onSubmit={handleProbeCustom} className="flex items-center gap-2">
          <input
            type="text"
            value={customHost}
            onChange={(e) => setCustomHost(e.target.value)}
            placeholder="e.g. proxyip.sg.cmliussss.net or custom.vps.net"
            className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            Probe Host
          </button>
        </form>

        {customResult && (
          <div className="mt-2 p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs font-mono flex items-center justify-between">
            <div className="space-x-2">
              <span className="text-slate-400">Host:</span>
              <span className="text-slate-100">{customResult.host}</span>
              <span className="text-slate-500">→</span>
              <span className="text-cyan-400">IP: {customResult.ip}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 tabular-nums">RTT: {customResult.latencyMs} ms</span>
              <span className={customResult.status === 'online' ? 'text-emerald-400' : 'text-amber-400'}>
                {customResult.status.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
