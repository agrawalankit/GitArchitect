import React, { useState, useEffect } from 'react';
import { LandingHero } from './components/LandingHero';
import { SectionList } from './components/SectionList';
import { SectionEditors } from './components/SectionEditors';
import { GitHubPreview } from './components/GitHubPreview';
import { MarkdownEditor } from './components/MarkdownEditor';
import { ResumeUploader } from './components/ResumeUploader';
import { PublishGuideModal } from './components/PublishGuideModal';
import { ProfileData, SectionId } from './types/profile';
import { ankitAgrawalSample } from './utils/sampleProfiles';
import { generateMarkdown } from './utils/markdownGenerator';
import { Header } from './components/Header';
import {
  Download,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'gitarchitect_profile_data_v3';

export default function App() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== 'undefined' && saved.trim().startsWith('{')) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load profile from storage, resetting', e);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    return ankitAgrawalSample;
  });

  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [activeTab, setActiveTab] = useState<'architect' | 'preview' | 'markdown' | 'guide'>('architect');
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId>('header');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [manualMarkdown, setManualMarkdown] = useState<string | null>(null);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save to storage', e);
    }
  }, [profile]);

  // Current generated markdown
  const currentMarkdown = manualMarkdown !== null ? manualMarkdown : generateMarkdown(profile);

  const handleProfileLoaded = (newProfile: ProfileData) => {
    setProfile(newProfile);
    setManualMarkdown(null);
    setView('editor');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleUpdateProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    setManualMarkdown(null);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
    });
  };

  const handleToggleSection = (id: SectionId) => {
    const updated = profile.sections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
    );
    handleUpdateProfile({ ...profile, sections: updated });
  };

  const handleMoveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= profile.sections.length) return;
    const newSections = [...profile.sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    handleUpdateProfile({ ...profile, sections: newSections });
  };

  const handleResetLayout = () => {
    handleUpdateProfile(ankitAgrawalSample);
  };

  // 1. Initial Landing Page
  if (view === 'landing') {
    return (
      <>
        <LandingHero
          onProfileLoaded={handleProfileLoaded}
        />
        <PublishGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          githubUsername={profile.githubUsername}
        />
      </>
    );
  }

  // 2. Editor Page (active once user uploads resume)
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-[#63c6ae]/30">
      {/* Header is EXACT same as main page */}
      <Header onLogoClick={() => setView('landing')} />

      {/* Editor Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Editor Single Control Bar - No repeated options */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          {/* Left: Upload different resume & profile label */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              title="Upload another resume to re-architect"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Upload New Resume</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Profile:</span>
              <span
                className="text-sm px-3 py-1 rounded-full font-mono font-semibold"
                style={{
                  backgroundColor: 'rgba(99, 198, 174, 0.1)',
                  borderColor: 'rgba(99, 198, 174, 0.3)',
                  color: '#63c6ae',
                  borderWidth: '1px',
                }}
              >
                @{profile.githubUsername || 'username'}
              </span>
            </div>
          </div>

          {/* Center: View Switcher Tabs (Only here!) */}
          <nav aria-label="Editor View Tabs" className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('architect')}
              className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'architect'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
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
                  : 'text-slate-400 hover:text-slate-200'
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
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                color: activeTab === 'markdown' ? '#63c6ae' : undefined,
              }}
            >
              Markdown Code
            </button>
          </nav>

          {/* Right: Actions (GitHub Guide & Download README.md - Only here!) */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-800/60 rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>GitHub Guide</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-950 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
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

        {/* View Switcher Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'architect' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
              {/* Left Column: Drag & Drop Section List */}
              <div className="lg:col-span-4 xl:col-span-3">
                <SectionList
                  sections={profile.sections}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={setSelectedSectionId}
                  onToggleSection={handleToggleSection}
                  onMoveSection={handleMoveSection}
                  onResetLayout={handleResetLayout}
                />
              </div>

              {/* Right Column: Active Section Editor */}
              <div className="lg:col-span-8 xl:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white capitalize font-display">
                      Editing Section:{' '}
                      <span style={{ color: '#63c6ae' }}>
                        {profile.sections.find((s) => s.id === selectedSectionId)?.label ||
                          selectedSectionId}
                      </span>
                    </span>
                  </div>
                </div>

                <SectionEditors
                  sectionId={selectedSectionId}
                  profile={profile}
                  onChange={handleUpdateProfile}
                />
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex-1">
              <GitHubPreview profile={profile} />
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="flex-1 h-[650px]">
              <MarkdownEditor
                markdown={currentMarkdown}
                onChangeMarkdown={(newMd) => setManualMarkdown(newMd)}
                onDownloadMd={handleDownloadMarkdown}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-[#050811] text-sm text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-display">GitArchitect AI</span>
            <span className="text-slate-600">·</span>
            <span>A free developer tool by <a href="https://codeexecute.com/" className="hover:underline" style={{ color: '#63c6ae' }}>CodeExecute</a></span>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <a href="https://codeexecute.com/" className="hover:text-white transition-colors">
              CodeExecute Home
            </a>
            <a href="https://codeexecute.com/ai-tools" className="hover:text-white transition-colors">
              All AI Tools
            </a>
            <a href="https://codeexecute.com/blog/" className="hover:text-white transition-colors">
              Engineering Blog
            </a>
            <button
              onClick={() => setView('landing')}
              className="hover:underline transition-colors font-medium"
              style={{ color: '#63c6ae' }}
            >
              Overview &amp; FAQ
            </button>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <ResumeUploader
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProfileLoaded={handleProfileLoaded}
      />

      <PublishGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        githubUsername={profile.githubUsername}
      />
    </div>
  );
}
