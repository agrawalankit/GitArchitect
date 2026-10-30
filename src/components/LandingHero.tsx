import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Loader2,
  AlertCircle,
  HelpCircle,
  GitBranch,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import { ProfileData } from '../types/profile';
import { Header } from './Header';
import { AdSenseSlot } from './AdSenseSlot';
import { trackEvent } from '../utils/analytics';
import { parseResumeClientSide } from '../utils/clientFallbackParser';

interface LandingHeroProps {
  onProfileLoaded: (profile: ProfileData) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onProfileLoaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

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
    if (inputMode === 'upload' && !file) {
      setError('Please select or drag a resume file.');
      return;
    }
    if (inputMode === 'paste' && !rawText.trim()) {
      setError('Please paste your resume or LinkedIn bio.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgressStep('Reading resume contents...');
    trackEvent('parse_resume_start', 'conversion', inputMode);

    try {
      let payload: any = {};
      let textContent = rawText;
      if (inputMode === 'upload' && file) {
        const lowerName = file.name.toLowerCase();
        const isText =
          file.type.includes('text') ||
          lowerName.endsWith('.txt') ||
          lowerName.endsWith('.md') ||
          lowerName.endsWith('.json') ||
          lowerName.endsWith('.csv') ||
          lowerName.endsWith('.rtf');

        if (isText) {
          textContent = await file.text();
          payload = { resumeText: textContent };
        } else {
          const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');
          const base64 = await fileToBase64(file);
          payload = {
            fileBase64: base64,
            mimeType: isPdf ? 'application/pdf' : 'application/octet-stream',
          };
        }
      } else {
        payload = { resumeText: rawText };
      }

      setProgressStep('Analyzing skills, impact metrics & architecture pillars...');

      let result: any = null;
      try {
        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const responseText = await response.text();
          result = JSON.parse(responseText);
        }
      } catch (err) {
        console.warn('Backend API unavailable. Using resilient local client parser.', err);
      }

      if (result && result.success && result.data) {
        setProgressStep('Structuring Markdown layout & Shields.io badges...');
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

        trackEvent('parse_resume_success', 'conversion', newProfile.githubUsername || 'anonymous');
        onProfileLoaded(newProfile);
      } else {
        const fallback = parseResumeClientSide(textContent || file?.name || '', file?.name);
        trackEvent('parse_resume_success', 'conversion', (fallback.githubUsername || 'anonymous') + '_fallback');
        onProfileLoaded(fallback);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || 'Failed to process resume.';
      trackEvent('parse_resume_error', 'exception', errMsg);
      setError(errMsg + ' Try pasting text or check file format.');
    } finally {
      setLoading(false);
      setProgressStep('');
    }
  };

  const faqs = [
    {
      q: 'What is a GitHub Profile README?',
      a: 'A GitHub Profile README is a special Markdown file rendered prominently at the top of your public GitHub personal profile page (github.com/username). It serves as your developer landing page and visual portfolio. You activate it by creating a public repository whose name matches your GitHub username exactly (e.g., username/username).',
    },
    {
      q: 'Why are public GitHub repositories and a profile README necessary for developers?',
      a: 'A standard PDF resume lists skills, but your GitHub profile proves them in action. Technical recruiters, engineering leads, and CTOs review your profile to inspect real code quality, problem-solving pillars, consistency, and communication skills before scheduling an interview.',
    },
    {
      q: 'How does GitArchitect convert my resume into a Markdown profile?',
      a: 'GitArchitect uses Google Gemini AI to analyze your resume document (PDF, TXT, DOCX), extracting your core tech stack, quantifiable achievements, engineering pillars, and projects into structured, customizable Markdown sections with verified Shields.io badges and dynamic GitHub stats widgets.',
    },
    {
      q: 'How do I upload the generated README.md to my GitHub profile?',
      a: 'Step 1: Go to github.com/new and create a repository whose name is exactly identical to your GitHub username.\nStep 2: Make sure it is set to Public and check "Add a README file".\nStep 3: Click the pencil edit button or upload your downloaded README.md file from GitArchitect.\nStep 4: Commit your changes to the main branch.',
    },
    {
      q: 'Are the GitHub stats, languages, and streak widgets updated in real time?',
      a: 'Yes. The analytics widgets embedded in your README query GitHub public APIs dynamically in real time whenever someone visits your profile. They automatically reflect your ongoing commits, pull requests, stars, and language distributions.',
    },
    {
      q: 'Is GitArchitect free and is my resume data private?',
      a: 'GitArchitect is 100% free by CodeExecute. We do not require account registration or credit cards. Uploaded resumes are processed in memory solely to extract profile sections and are never stored, sold, or shared with third parties.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-[#63c6ae]/30">
      {/* Top Bar matching PostArchitect & LogExecute header */}
      <Header />

      {/* Hero Section: Compact, Centered, PostArchitect styling */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center text-center">
        {/* Category Pill */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-4"
          style={{
            backgroundColor: 'rgba(99, 198, 174, 0.1)',
            borderColor: 'rgba(99, 198, 174, 0.3)',
            color: '#63c6ae',
            borderWidth: '1px',
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>100% Private In-Memory AI Processing</span>
        </div>

        {/* Hero Title in PostArchitect Space Mono Font */}
        <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white font-display leading-tight max-w-3xl">
          GitHub Profile README &amp;{' '}
          <span className="block mt-1" style={{ color: '#63c6ae' }}>
            AI Profile Architect
          </span>
        </h1>

        {/* Subtitle with increased font size */}
        <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Transform your resume into a high-impact GitHub Profile README with custom tech stack badges, live contribution statistics, and modular layouts.
        </p>

        {/* Input Mode Selector */}
        <div className="mt-6 flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setInputMode('upload')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              inputMode === 'upload'
                ? 'text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: inputMode === 'upload' ? '#63c6ae' : 'transparent',
            }}
          >
            Upload Resume File
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              inputMode === 'paste'
                ? 'text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: inputMode === 'paste' ? '#63c6ae' : 'transparent',
            }}
          >
            Paste Text
          </button>
        </div>

        {/* Compact Upload Box with #63c6ae Glowing Aura */}
        <div className="mt-4 w-full max-w-lg">
          {inputMode === 'upload' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-7 cursor-pointer transition-all duration-200 bg-slate-900/50 ${
                dragActive
                  ? 'bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
              style={{
                borderColor: dragActive ? '#63c6ae' : undefined,
                boxShadow: dragActive
                  ? '0 0 30px rgba(99, 198, 174, 0.2)'
                  : '0 0 20px rgba(99, 198, 174, 0.06)',
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
                  borderColor: 'rgba(99, 198, 174, 0.3)',
                  borderWidth: '1px',
                  color: '#63c6ae',
                }}
              >
                <UploadCloud className="w-6 h-6" />
              </div>

              {file ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-base font-semibold" style={{ color: '#63c6ae' }}>
                    <FileText className="w-5 h-5" />
                    <span className="truncate max-w-xs">{file.name}</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {(file.size / 1024).toFixed(0)} KB · Ready to architect
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display">Upload Resume</h3>
                  <p className="text-sm text-slate-400">
                    Drop .pdf, .docx, .txt, or <span className="underline" style={{ color: '#63c6ae' }}>browse files</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your raw resume, LinkedIn summary, or biography here..."
                rows={5}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
                style={{
                  borderColor: rawText ? '#63c6ae' : undefined,
                }}
              />
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div
              className="mt-3 p-3.5 rounded-xl flex items-center justify-center gap-3 border"
              style={{
                backgroundColor: 'rgba(99, 198, 174, 0.08)',
                borderColor: 'rgba(99, 198, 174, 0.25)',
              }}
            >
              <Loader2 className="w-5 h-5 animate-spin shrink-0" style={{ color: '#63c6ae' }} />
              <span className="text-sm font-semibold" style={{ color: '#63c6ae' }}>{progressStep}</span>
            </div>
          )}

          {/* Generate Profile CTA */}
          <div className="mt-4">
            <button
              onClick={handleParse}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                backgroundColor: '#63c6ae',
                boxShadow: '0 4px 20px rgba(99, 198, 174, 0.25)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Architecting Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Profile README</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-slate-800/80 my-12 max-w-4xl" />

        {/* Section 1: How to Use This Tool */}
        <section className="w-full max-w-4xl text-left space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: '#63c6ae' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#63c6ae' }} />
            <span>Workflow Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            How to Use GitArchitect in 4 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From your current resume to a polished, recruiter-ready GitHub profile README in minutes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div
                className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center font-mono"
                style={{ backgroundColor: 'rgba(99, 198, 174, 0.15)', color: '#63c6ae' }}
              >
                01
              </div>
              <h3 className="text-base font-bold text-white font-display">Upload Resume</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drop your PDF, DOCX, or TXT file. Gemini AI reads your technical skills, leadership experience, and projects.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div
                className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center font-mono"
                style={{ backgroundColor: 'rgba(99, 198, 174, 0.15)', color: '#63c6ae' }}
              >
                02
              </div>
              <h3 className="text-base font-bold text-white font-display">Drag &amp; Drop Layout</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Customize section positions: Tech Stack, What I Do, By The Numbers, Approach, GitHub stats, and Featured Repos.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div
                className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center font-mono"
                style={{ backgroundColor: 'rgba(99, 198, 174, 0.15)', color: '#63c6ae' }}
              >
                03
              </div>
              <h3 className="text-base font-bold text-white font-display">Preview Live</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Test how your profile looks in both GitHub Dark and Light themes with authentic shields.io badges and stats cards.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div
                className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center font-mono"
                style={{ backgroundColor: 'rgba(99, 198, 174, 0.15)', color: '#63c6ae' }}
              >
                04
              </div>
              <h3 className="text-base font-bold text-white font-display">Publish to GitHub</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Download your README.md or copy markdown. Follow our 5-minute guide to push it to your special username repository.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full border-t border-slate-800/80 my-12 max-w-4xl" />

        {/* Section 2: Why GitHub Repositories & Profiles are Crucial for Developers */}
        <section className="w-full max-w-4xl text-left space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: '#63c6ae' }}>
            <GitBranch className="w-4 h-4" />
            <span>Developer Career Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Why GitHub Repositories &amp; Profile READMEs are Essential
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Your GitHub profile has become your primary engineering proof-of-work. Recruiters, CTOs, and founders inspect your profile before scheduling interviews:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white font-display">1. Tangible Proof of Work</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Paper resumes can claim familiarity with architectures, but public GitHub repositories demonstrate real code design, commit discipline, and automated test suites.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white font-display">2. First 10-Second Impression</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A custom Profile README greets visitors with your engineering philosophy, core competencies, and quantifiable scale metrics before they even click into repositories.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white font-display">3. Demonstrates Engineering Consistency</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Contribution graphs and streak widgets reflect persistent learning, active problem-solving, and day-to-day engagement with modern Git workflows.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white font-display">4. Direct Inbound Opportunities</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Integrated social connect badges for LinkedIn, X, email, and blog link founders and technical recruiters directly to your inbox for consulting and leadership roles.
              </p>
            </div>
          </div>
        </section>

        {/* AdSense Responsive Slot */}
        <AdSenseSlot className="max-w-4xl my-8" />

        {/* Section 3: Frequently Asked Questions (FAQ) */}
        <section className="w-full max-w-4xl text-left space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: '#63c6ae' }}>
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3 pt-1">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-white hover:text-[#63c6ae] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className="w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : undefined,
                        color: isOpen ? '#63c6ae' : undefined,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/60 whitespace-pre-line">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Internal Links & CodeExecute Resources */}
        <section className="w-full max-w-4xl text-left mt-12 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            Explore More Developer Tools &amp; Tutorials by CodeExecute
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            CodeExecute provides practical engineering resources, real-world bug fixes, and free developer tools to help engineers write cleaner, more resilient software.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://codeexecute.com/ai-tools"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white border border-slate-700 transition-colors"
            >
              <span>All CodeExecute AI Tools</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: '#63c6ae' }} />
            </a>
            <a
              href="https://codeexecute.com/"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white border border-slate-700 transition-colors"
            >
              <span>CodeExecute Home</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: '#63c6ae' }} />
            </a>
            <a
              href="https://codeexecute.com/blog/"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white border border-slate-700 transition-colors"
            >
              <span>Engineering Tutorials &amp; Guides</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: '#63c6ae' }} />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-[#050811] text-sm text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-display">GitArchitect AI</span>
            <span className="text-slate-600">·</span>
            <span>A free developer tool by <a href="https://codeexecute.com/" className="hover:underline" style={{ color: '#63c6ae' }}>CodeExecute</a></span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a href="https://codeexecute.com/" className="hover:text-white transition-colors">
              CodeExecute Home
            </a>
            <a href="https://codeexecute.com/ai-tools" className="hover:text-white transition-colors">
              All AI Tools
            </a>
            <a href="https://codeexecute.com/blog/" className="hover:text-white transition-colors">
              Engineering Blog
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
