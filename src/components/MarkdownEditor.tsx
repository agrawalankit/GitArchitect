import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../utils/analytics';

interface MarkdownEditorProps {
  markdown: string;
  onChangeMarkdown: (newMd: string) => void;
  onDownloadMd: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onChangeMarkdown,
  onDownloadMd,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    trackEvent('copy_markdown_click', 'conversion');
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = markdown.split('\n').length;
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const charCount = markdown.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Top action bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4" style={{ color: '#63c6ae' }} />
          <span className="text-sm font-semibold text-white font-mono">README.md</span>
          <span className="text-xs text-slate-400">
            ({lineCount} lines · {wordCount} words · {charCount} chars)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" style={{ color: '#63c6ae' }} />
                <span className="font-semibold" style={{ color: '#63c6ae' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
          <button
            onClick={onDownloadMd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-950 rounded-lg shadow-sm transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: '#63c6ae',
            }}
          >
            <Download className="w-4 h-4" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      {/* Editor area with larger font */}
      <div className="flex-1 relative flex overflow-hidden bg-slate-950">
        <textarea
          value={markdown}
          onChange={(e) => onChangeMarkdown(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-slate-200 font-mono text-sm leading-relaxed focus:outline-none resize-none selection:bg-[#63c6ae]/30 overflow-y-auto"
        />
      </div>

      {/* Bottom status bar */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#63c6ae' }} />
          <span>GitHub Flavored Markdown (GFM) Compatible</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>UTF-8</span>
          <span>LF</span>
          <span>Markdown</span>
        </div>
      </div>
    </div>
  );
};
