import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2, Sparkles, ArrowRight, X } from 'lucide-react';
import { ProfileData } from '../types/profile';

interface ResumeUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileLoaded: (profile: ProfileData) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  isOpen,
  onClose,
  onProfileLoaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleParse = async () => {
    if (mode === 'upload' && !file) {
      setError('Please choose a resume file to upload.');
      return;
    }
    if (mode === 'paste' && !rawText.trim()) {
      setError('Please paste your resume content in the text box.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgressStep('Analyzing resume contents with Gemini AI...');

    try {
      let payload: any = {};

      if (mode === 'upload' && file) {
        setProgressStep(`Reading ${file.name}...`);
        const lowerName = file.name.toLowerCase();
        const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');
        const isText =
          file.type.includes('text') ||
          lowerName.endsWith('.txt') ||
          lowerName.endsWith('.md') ||
          lowerName.endsWith('.json') ||
          lowerName.endsWith('.csv') ||
          lowerName.endsWith('.rtf');

        if (isText) {
          const textContent = await file.text();
          payload = { resumeText: textContent };
        } else {
          const base64 = await fileToBase64(file);
          payload = {
            fileBase64: base64,
            mimeType: isPdf ? 'application/pdf' : 'application/octet-stream',
          };
        }
      } else {
        payload = { resumeText: rawText };
      }

      setProgressStep('Extracting tech stack, architecture experience & leadership...');

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result: any = null;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.warn('Server returned non-JSON body:', responseText.slice(0, 200));
        throw new Error('Server returned an unexpected format. Please try again or paste resume text.');
      }

      if (!response.ok || !result || result.success === false) {
        let msg = result?.error || 'Failed to process resume.';
        if (typeof msg === 'string' && msg.trim().startsWith('{')) {
          try {
            const inner = JSON.parse(msg);
            msg = inner?.error?.message || inner?.message || msg;
          } catch {}
        }
        throw new Error(msg);
      }

      setProgressStep('Structuring GitHub profile sections & badges...');
      const data = result.data || {};

      const newProfile: ProfileData = {
        name: data.name || 'Developer',
        githubUsername: data.githubUsername || 'username',
        pronouns: data.pronouns || 'they/them',
        title: data.title || 'Full-Stack Software Engineer',
        location: data.location || 'Remote',
        company: data.company || '',
        email: data.email || '',
        website: data.website || '',
        quote: data.quote || 'Simplicity is prerequisite for reliability.',
        aboutMe: data.aboutMe || '',
        whatIDo: (data.whatIDo || []).map((item: any, idx: number) => ({
          id: String(idx + 1),
          emoji: item.emoji || '⚡',
          text: item.text || String(item),
        })),
        byTheNumbers: (data.byTheNumbers || []).map((item: any, idx: number) => ({
          id: String(idx + 1),
          stat: item.stat || '10+',
          label: item.label || 'projects delivered',
        })),
        approach: data.approach || [
          'Understand user requirements',
          'Architect resilient system',
          'Ship clean code',
          'Measure & iterate',
        ],
        techStack: {
          languages: data.techStack?.languages || ['TypeScript', 'JavaScript', 'Python'],
          frontend: data.techStack?.frontend || ['React', 'Next.js', 'Tailwind CSS'],
          backend: data.techStack?.backend || ['Node.js', 'Express'],
          database: data.techStack?.database || ['PostgreSQL', 'Redis'],
          devops: data.techStack?.devops || ['AWS', 'Docker'],
          ai_ml: data.techStack?.ai_ml || ['Gemini'],
          tools: data.techStack?.tools || ['Git', 'VS Code'],
        },
        badgeStyle: 'for-the-badge',
        statsWidgets: {
          showStats: true,
          showLanguages: true,
          showStreak: true,
          showSnake: true,
          showTrophies: false,
          theme: 'github_dark',
          hideBorder: false,
        },
        currentFocus: data.currentFocus || [
          'Building high-performance web applications',
          'Contributing to open-source software',
        ],
        featuredProjects: (data.featuredProjects || []).map((proj: any, idx: number) => ({
          id: String(idx + 1),
          name: proj.name || `Project-${idx + 1}`,
          description: proj.description || '',
          tech: proj.tech || ['TypeScript', 'React'],
          link: proj.link || '',
        })),
        contentOrArticles: (data.contentOrArticles || []).map((c: any, idx: number) => ({
          id: String(idx + 1),
          title: c.title || 'Technical Article',
          description: c.description || '',
          link: c.link || '',
        })),
        socials: (data.socials || []).map((s: any, idx: number) => ({
          id: String(idx + 1),
          platform: s.platform || 'website',
          url: s.url || '',
          label: s.label || 'Link',
        })),
        customMarkdown: '',
        sections: [
          { id: 'header', label: 'Header & Bio', enabled: true, iconName: 'User' },
          { id: 'whatIDo', label: 'What I Do', enabled: true, iconName: 'Zap' },
          { id: 'byTheNumbers', label: 'By The Numbers', enabled: true, iconName: 'Hash' },
          { id: 'approach', label: 'My Approach', enabled: true, iconName: 'Compass' },
          { id: 'techStack', label: 'Tech Stack', enabled: true, iconName: 'Cpu' },
          { id: 'stats', label: 'GitHub Stats Cards', enabled: true, iconName: 'BarChart2' },
          { id: 'projects', label: 'Featured Projects', enabled: true, iconName: 'FolderGit2' },
          { id: 'focus', label: 'Current Focus', enabled: true, iconName: 'Target' },
          { id: 'content', label: 'Writing & Community', enabled: true, iconName: 'BookOpen' },
          { id: 'contact', label: "Let's Talk & Socials", enabled: true, iconName: 'MessageSquare' },
          { id: 'custom', label: 'Custom Callout', enabled: false, iconName: 'FileText' },
        ],
      };

      onProfileLoaded(newProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process resume. Please try pasting raw text instead.');
    } finally {
      setLoading(false);
      setProgressStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(99, 198, 174, 0.12)',
              borderColor: 'rgba(99, 198, 174, 0.3)',
              borderWidth: '1px',
              color: '#63c6ae',
            }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Generate Profile from Resume</h2>
            <p className="text-sm text-slate-400">
              Upload your resume (PDF, Word, TXT) to architect your GitArchitect README.
            </p>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-2 mb-4 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              mode === 'upload'
                ? 'text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: mode === 'upload' ? '#63c6ae' : 'transparent',
            }}
          >
            Upload File
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              mode === 'paste'
                ? 'text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: mode === 'paste' ? '#63c6ae' : 'transparent',
            }}
          >
            Paste Text
          </button>
        </div>

        {mode === 'upload' ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'bg-slate-900/90'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
            }`}
            style={{
              borderColor: dragActive ? '#63c6ae' : undefined,
              boxShadow: dragActive ? '0 0 25px rgba(99, 198, 174, 0.15)' : undefined,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{
                backgroundColor: 'rgba(99, 198, 174, 0.12)',
                color: '#63c6ae',
              }}
            >
              <UploadCloud className="w-6 h-6" />
            </div>
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: '#63c6ae' }}>
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
                <span className="text-xs text-slate-500">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-200">
                  Drag and drop your resume file here, or <span className="underline" style={{ color: '#63c6ae' }}>browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PDF, TXT, DOCX files</p>
              </>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your resume, LinkedIn summary, or biography here..."
              rows={6}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
              style={{
                borderColor: rawText ? '#63c6ae' : undefined,
              }}
            />
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div
            className="mt-4 p-3 rounded-xl border flex items-center gap-3"
            style={{
              backgroundColor: 'rgba(99, 198, 174, 0.08)',
              borderColor: 'rgba(99, 198, 174, 0.25)',
            }}
          >
            <Loader2 className="w-4 h-4 animate-spin shrink-0" style={{ color: '#63c6ae' }} />
            <span className="text-sm font-semibold" style={{ color: '#63c6ae' }}>{progressStep}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleParse}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-slate-950 rounded-xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.01]"
            style={{
              backgroundColor: '#63c6ae',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Generate Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
