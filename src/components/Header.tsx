import React from 'react';
import { ShieldCheck, Rocket } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenDeployModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenDeployModal,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (One single clean text element) */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-100">
            CF Pages V2Ray Architect
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onTabChange('builder')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 ${
              activeTab === 'builder' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Node Builder
          </button>
          <button
            onClick={() => onTabChange('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 ${
              activeTab === 'architecture' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Relay Architecture
          </button>
          <button
            onClick={() => onTabChange('worker')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 ${
              activeTab === 'worker' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Pages Worker Script
          </button>
          <button
            onClick={() => onTabChange('diagnostics')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 ${
              activeTab === 'diagnostics' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Live Diagnostics
          </button>
          <button
            onClick={() => onTabChange('registry')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 ${
              activeTab === 'registry' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            ProxyIP Pool
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-950"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Deploy to Pages</span>
          </button>
        </div>
      </div>
    </header>
  );
};
