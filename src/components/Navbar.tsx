import React from 'react';
import { Layers, Sparkles, BookOpen, Download, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'architect' | 'preview' | 'markdown' | 'guide';
  setActiveTab: (tab: 'architect' | 'preview' | 'markdown' | 'guide') => void;
  onOpenUpload: () => void;
  onOpenGuide: () => void;
  onDownloadMd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenGuide,
  onDownloadMd,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-bold"
            style={{
              backgroundColor: '#63c6ae',
              boxShadow: '0 0 15px rgba(99, 198, 174, 0.3)',
            }}
          >
            <Layers className="w-5 h-5 text-slate-950" />
          </div>
          <button
            onClick={() => setActiveTab('architect')}
            className="text-left group"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-white font-display">GitArchitect</span>
              <span className="text-xl font-bold tracking-tight font-display" style={{ color: '#63c6ae' }}>AI</span>
            </div>
            <span className="text-[11px] font-mono tracking-wider text-slate-400 block -mt-1 uppercase">
              by CodeExecute
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation tabs with increased font size */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('architect')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'architect'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            style={{
              color: activeTab === 'architect' ? '#63c6ae' : undefined,
            }}
          >
            Layout Architect
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            style={{
              color: activeTab === 'preview' ? '#63c6ae' : undefined,
            }}
          >
            GitHub Preview
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'markdown'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            style={{
              color: activeTab === 'markdown' ? '#63c6ae' : undefined,
            }}
          >
            Markdown Code
          </button>
          <button
            onClick={onOpenGuide}
            className="px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Upload Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary action buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenUpload}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Upload Resume</span>
          </button>
          <button
            onClick={onDownloadMd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-950 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            style={{
              backgroundColor: '#63c6ae',
              boxShadow: '0 4px 15px rgba(99, 198, 174, 0.25)',
            }}
          >
            <Download className="w-4 h-4" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>
    </header>
  );
};
