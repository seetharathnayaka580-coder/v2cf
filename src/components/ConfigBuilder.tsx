import React from 'react';
import { ProxyNodeConfig, ProxyIpItem } from '../types';
import { PROXY_IP_LIST, CLEAN_IP_LIST, FEATURED_PROXY_IP } from '../data/proxyIps';
import { RefreshCw, Copy, Check, Sparkles, Server, Network, Shield } from 'lucide-react';

interface ConfigBuilderProps {
  config: ProxyNodeConfig;
  onChange: (updated: ProxyNodeConfig) => void;
  onSelectProxyIp: (item: ProxyIpItem) => void;
}

export const ConfigBuilder: React.FC<ConfigBuilderProps> = ({
  config,
  onChange,
  onSelectProxyIp,
}) => {
  const [copiedUuid, setCopiedUuid] = React.useState(false);

  const generateUuid = () => {
    // RFC 4122 v4 UUID generator
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    onChange({ ...config, uuid });
  };

  const copyUuid = () => {
    navigator.clipboard.writeText(config.uuid);
    setCopiedUuid(true);
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'singapore-primary') {
      onChange({
        ...config,
        name: 'CF-Pages-V2Ray-SG',
        proxyIp: FEATURED_PROXY_IP,
        cleanIp: 'www.visa.com.sg',
        port: 443,
        path: '/?ed=2048',
        earlyData: true,
        earlyDataLength: 2048,
      });
    } else if (presetName === 'hongkong-fast') {
      onChange({
        ...config,
        name: 'CF-Pages-V2Ray-HK',
        proxyIp: 'proxyip.hk.cmliussss.net',
        cleanIp: 'ip.sb',
        port: 443,
        path: '/?ed=2048',
        earlyData: true,
        earlyDataLength: 2048,
      });
    } else if (presetName === 'japan-media') {
      onChange({
        ...config,
        name: 'CF-Pages-V2Ray-JP',
        proxyIp: 'proxyip.jp.cmliussss.net',
        cleanIp: '104.16.24.4',
        port: 443,
        path: '/?ed=2048',
        earlyData: true,
        earlyDataLength: 2048,
      });
    } else if (presetName === 'us-global') {
      onChange({
        ...config,
        name: 'CF-Pages-V2Ray-US',
        proxyIp: 'proxyip.us.cmliussss.net',
        cleanIp: '172.67.74.152',
        port: 443,
        path: '/?ed=2048',
        earlyData: true,
        earlyDataLength: 2048,
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header and Quick Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Node Configuration Workbench
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tune VLESS connection headers, select clean CDN fronting IPs, and bind the Singapore relay.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 mr-1">Presets:</span>
          <button
            onClick={() => handleApplyPreset('singapore-primary')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/60 transition-colors whitespace-nowrap shrink-0"
          >
            SG Equinix (Featured)
          </button>
          <button
            onClick={() => handleApplyPreset('hongkong-fast')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            HK Mega-i
          </button>
          <button
            onClick={() => handleApplyPreset('japan-media')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            JP Tokyo
          </button>
          <button
            onClick={() => handleApplyPreset('us-global')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            US Silicon Valley
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column Inputs & Right Column Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cloudflare Pages Domain */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Cloudflare Pages Domain / Host
          </label>
          <input
            type="text"
            value={config.pagesDomain}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...config,
                pagesDomain: val,
                sni: val,
                host: val,
              });
            }}
            placeholder="e.g. my-v2ray-node.pages.dev"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <p className="text-xs text-slate-500">
            The target Pages URL generated in your Cloudflare dashboard (or custom domain).
          </p>
        </div>

        {/* Node Name / Remarks */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Node Name / Remark Tag
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
            placeholder="e.g. CF-Pages-V2Ray-SG"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <p className="text-xs text-slate-500">
            Human-readable label that appears in your proxy client (Clash, v2rayN, etc.).
          </p>
        </div>

        {/* UUID Configuration */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Client Authentication UUID
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyUuid}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedUuid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUuid ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={generateUuid}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={config.uuid}
              onChange={(e) => onChange({ ...config, uuid: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <p className="text-xs text-slate-500">
            Standard RFC 4122 v4 UUID. Must match the <code className="text-cyan-400">UUID</code> environment variable configured in Cloudflare Pages.
          </p>
        </div>

        {/* ProxyIP Selector (Target Outbound Relay) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Outbound ProxyIP Relay
            </label>
            <span className="text-xs font-mono text-cyan-400">
              {config.proxyIp === FEATURED_PROXY_IP ? 'Singapore (Recommended)' : 'Custom Relay'}
            </span>
          </div>
          <select
            value={config.proxyIp}
            onChange={(e) => onChange({ ...config, proxyIp: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {PROXY_IP_LIST.map((item) => (
              <option key={item.id} value={item.host}>
                {item.host} — [{item.countryCode}] {item.region} ({item.provider})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">
            Handles de-obfuscation and raw TCP bridge. <code className="text-cyan-400">{FEATURED_PROXY_IP}</code> ensures lowest ping across Asia-Pacific.
          </p>
        </div>

        {/* Clean CDN Address (Fronting IP or Domain) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Clean CDN IP / Fronting Domain
            </label>
            <span className="text-xs text-slate-500">Bypasses ISP throttling</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={config.cleanIp}
              onChange={(e) => onChange({ ...config, cleanIp: e.target.value })}
              placeholder="e.g. www.visa.com.sg or 104.16.24.4"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onChange({ ...config, cleanIp: e.target.value });
                }
              }}
              className="px-2 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
              defaultValue=""
            >
              <option value="" disabled>Pick Clean IP</option>
              {CLEAN_IP_LIST.map((c) => (
                <option key={c.id} value={c.ipOrDomain}>
                  {c.ipOrDomain} ({c.location})
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500">
            If your local ISP blocks the direct <code className="text-slate-400">pages.dev</code> domain, specify an unblocked Cloudflare edge IP/domain.
          </p>
        </div>

        {/* Port and Protocol Path */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              HTTPS Port
            </label>
            <select
              value={config.port}
              onChange={(e) => onChange({ ...config, port: parseInt(e.target.value, 10) })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value={443}>443 (Standard HTTPS)</option>
              <option value={8443}>8443 (Cloudflare Alt)</option>
              <option value={2053}>2053 (CF TLS)</option>
              <option value={2083}>2083 (CF TLS)</option>
              <option value={2087}>2087 (CF TLS)</option>
              <option value={2096}>2096 (CF TLS)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              WebSocket Path
            </label>
            <input
              type="text"
              value={config.path}
              onChange={(e) => onChange({ ...config, path: e.target.value })}
              placeholder="/?ed=2048"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* TLS SNI and Early Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              TLS SNI (Server Name)
            </label>
            <input
              type="text"
              value={config.sni}
              onChange={(e) => onChange({ ...config, sni: e.target.value, host: e.target.value })}
              placeholder="matches pages.dev"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                0-RTT Early Data
              </label>
              <span className="text-xs font-mono text-emerald-400">2048 Bytes</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={config.earlyData}
                  onChange={(e) => onChange({ ...config, earlyData: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <span>Enable ?ed=2048 Fast Handshake</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
