import React from 'react';
import { ExternalLink } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/60 max-w-7xl mx-auto w-full">
      {onLogoClick ? (
        <button
          type="button"
          onClick={onLogoClick}
          className="text-left group cursor-pointer"
          title="Return to Home"
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-white font-display">GitArchitect</span>
            <span className="text-2xl font-bold tracking-tight font-display" style={{ color: '#63c6ae' }}>AI</span>
          </div>
          <p className="text-[11px] tracking-widest text-slate-400 font-mono uppercase mt-0.5">
            INTELLIGENT GITHUB README &amp; PROFILE ARCHITECT
          </p>
        </button>
      ) : (
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-white font-display">GitArchitect</span>
            <span className="text-2xl font-bold tracking-tight font-display" style={{ color: '#63c6ae' }}>AI</span>
          </div>
          <p className="text-[11px] tracking-widest text-slate-400 font-mono uppercase mt-0.5">
            INTELLIGENT GITHUB README &amp; PROFILE ARCHITECT
          </p>
        </div>
      )}

      {/* Top Right: Only More Free Tools link */}
      <div className="flex items-center">
        <a
          href="https://codeexecute.com/ai-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60"
        >
          <span>More Free Tools</span>
          <ExternalLink className="w-3.5 h-3.5" style={{ color: '#63c6ae' }} />
        </a>
      </div>
    </header>
  );
};
