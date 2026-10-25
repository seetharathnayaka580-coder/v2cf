import React, { useState } from 'react';
import { PROXY_IP_LIST, CLEAN_IP_LIST, FEATURED_PROXY_IP } from '../data/proxyIps';
import { ProxyIpItem, CleanIpItem } from '../types';
import { Search, Server, ShieldCheck, ArrowRight, Check, Zap, Globe2 } from 'lucide-react';

interface ProxyIpRegistryProps {
  currentProxyIp: string;
  currentCleanIp: string;
  onSelectProxyIp: (ip: string) => void;
  onSelectCleanIp: (ip: string) => void;
}

export const ProxyIpRegistry: React.FC<ProxyIpRegistryProps> = ({
  currentProxyIp,
  currentCleanIp,
  onSelectProxyIp,
  onSelectCleanIp,
}) => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  const filteredProxyIps = PROXY_IP_LIST.filter((item) => {
    const matchesSearch =
      item.host.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase()) ||
      item.provider.toLowerCase().includes(search.toLowerCase());
    const matchesRegion =
      regionFilter === 'all' || item.countryCode.toLowerCase() === regionFilter.toLowerCase();
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* ProxyIP Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                ProxyIP Relay Node Registry
              </h2>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                {PROXY_IP_LIST.length} Active Relays
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              High-bandwidth reverse proxy nodes for Cloudflare Pages outbound TCP socket stabilization.
            </p>
          </div>

          {/* Search & Region Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search host, region, ISP..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
              />
            </div>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
            >
              <option value="all">All Regions</option>
              <option value="sg">Singapore (SG)</option>
              <option value="hk">Hong Kong (HK)</option>
              <option value="jp">Japan (JP)</option>
              <option value="us">United States (US)</option>
              <option value="kr">South Korea (KR)</option>
            </select>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProxyIps.map((item) => {
            const isSelected = currentProxyIp === item.host;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-sm shadow-cyan-950'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-cyan-400" />
                      <span>[{item.countryCode}] {item.region}</span>
                    </span>
                    {item.featured && (
                      <span className="text-[10px] font-semibold text-cyan-400 border border-cyan-800/80 bg-cyan-950/80 px-1.5 py-0.2 rounded">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-xs font-bold text-slate-100 truncate mt-1">
                    {item.host}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.provider}
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-400">
                    Est. Ping: <span className="text-cyan-400 tabular-nums">~{item.latencyAvgMs} ms</span>
                  </div>

                  <button
                    onClick={() => onSelectProxyIp(item.host)}
                    disabled={isSelected}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cloudflare Clean IP Pool */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              Cloudflare Clean Edge IP & Fronting Domains
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimized Anycast addresses used in your proxy client (Clash/v2rayN) to connect without DNS or SNI contamination.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-2.5 px-4">Clean IP / Domain</th>
                <th className="py-2.5 px-4">Routing / ISP</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Performance Rating</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {CLEAN_IP_LIST.map((c) => {
                const isSelected = currentCleanIp === c.ipOrDomain;

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-950/60 transition-colors ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-100">
                      {c.ipOrDomain}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{c.isp}</td>
                    <td className="py-3 px-4 text-slate-400">{c.location}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">{c.speedRating}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectCleanIp(c.ipOrDomain)}
                        disabled={isSelected}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                          isSelected
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Applied' : 'Use Clean IP'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
