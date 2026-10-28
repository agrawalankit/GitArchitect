import React, { useState } from 'react';
import {
  ProfileData,
  SectionId,
  BulletItem,
  MetricItem,
  ProjectItem,
  ContentItem,
  BadgeStyle,
} from '../types/profile';
import { TECH_CATALOG, TechBadgeInfo } from '../utils/techCatalog';
import {
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  ExternalLink,
  Code2,
  Check,
} from 'lucide-react';

interface SectionEditorsProps {
  sectionId: SectionId;
  profile: ProfileData;
  onChange: (updated: ProfileData) => void;
}

export const SectionEditors: React.FC<SectionEditorsProps> = ({
  sectionId,
  profile,
  onChange,
}) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [techSearch, setTechSearch] = useState('');
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('all');

  const updateProfile = (patch: Partial<ProfileData>) => {
    onChange({ ...profile, ...patch });
  };

  // AI helper function
  const callAiEnhance = async (sectionType: string, currentContent: any) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType,
          context: {
            name: profile.name,
            title: profile.title,
            techStack: profile.techStack,
            location: profile.location,
          },
          currentText: currentContent,
        }),
      });
      if (!res.ok) throw new Error('AI enhancement error');
      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        console.warn('Non-JSON AI enhance response');
        return null;
      }
      return json?.data;
    } catch (e) {
      console.error('AI enhance failed:', e);
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  // 1. Header & Bio Editor
  if (sectionId === 'header') {
    const handleAiQuotes = async () => {
      const result = await callAiEnhance('quote', profile.quote);
      if (Array.isArray(result) && result.length > 0) {
        updateProfile({ quote: result[0] });
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              GitHub Username <span className="text-[#63c6ae] font-mono">(Used for stats & badges)</span>
            </label>
            <input
              type="text"
              value={profile.githubUsername}
              onChange={(e) => updateProfile({ githubUsername: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#63c6ae] font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Professional Title / Subtitle</label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) => updateProfile({ title: e.target.value })}
            placeholder="e.g. Founder & CTO @ WPS Technologies · Software Architect · AI · SaaS"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Pronouns</label>
            <input
              type="text"
              value={profile.pronouns}
              onChange={(e) => updateProfile({ pronouns: e.target.value })}
              placeholder="e.g. he/him"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Company / Organization</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => updateProfile({ company: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateProfile({ location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-400">
              Engineering Quote / Mission Statement
            </label>
            <button
              onClick={handleAiQuotes}
              disabled={aiLoading}
              className="text-[11px] text-[#63c6ae] hover:text-[#63c6ae] flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              AI Suggest Quotes
            </button>
          </div>
          <textarea
            value={profile.quote}
            onChange={(e) => updateProfile({ quote: e.target.value })}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">About Me (Short Bio)</label>
          <textarea
            value={profile.aboutMe}
            onChange={(e) => updateProfile({ aboutMe: e.target.value })}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
          />
        </div>
      </div>
    );
  }

  // 2. What I Do Editor
  if (sectionId === 'whatIDo') {
    const handleAdd = () => {
      const newItem: BulletItem = {
        id: String(Date.now()),
        emoji: '⚡',
        text: 'New engineering focus or deliverable',
      };
      updateProfile({ whatIDo: [...profile.whatIDo, newItem] });
    };

    const handleUpdate = (index: number, text: string, emoji: string) => {
      const updated = [...profile.whatIDo];
      updated[index] = { ...updated[index], text, emoji };
      updateProfile({ whatIDo: updated });
    };

    const handleRemove = (index: number) => {
      updateProfile({ whatIDo: profile.whatIDo.filter((_, i) => i !== index) });
    };

    const handleAiPolish = async () => {
      const result = await callAiEnhance('whatIDo', profile.whatIDo);
      if (Array.isArray(result) && result.length > 0) {
        updateProfile({
          whatIDo: result.map((r: any, idx: number) => ({
            id: String(idx + 1),
            emoji: r.emoji || '⚡',
            text: r.text || String(r),
          })),
        });
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showcase what you solve for founders, CTOs, and technical teams.
          </p>
          <button
            onClick={handleAiPolish}
            disabled={aiLoading}
            className="text-xs text-[#63c6ae] hover:text-[#63c6ae] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            AI Polish Bullets
          </button>
        </div>

        <div className="space-y-2.5">
          {profile.whatIDo.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <input
                type="text"
                value={item.emoji}
                onChange={(e) => handleUpdate(idx, item.text, e.target.value)}
                className="w-10 text-center bg-slate-900 border border-slate-800 rounded px-1 py-1.5 text-xs text-white"
                title="Emoji"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleUpdate(idx, e.target.value, item.emoji)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
              />
              <button
                onClick={() => handleRemove(idx)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Engineering Pillar
        </button>
      </div>
    );
  }

  // 3. By The Numbers Editor
  if (sectionId === 'byTheNumbers') {
    const handleAdd = () => {
      const newItem: MetricItem = {
        id: String(Date.now()),
        stat: '10+',
        label: 'years building high-throughput systems',
      };
      updateProfile({ byTheNumbers: [...profile.byTheNumbers, newItem] });
    };

    const handleUpdate = (index: number, stat: string, label: string) => {
      const updated = [...profile.byTheNumbers];
      updated[index] = { ...updated[index], stat, label };
      updateProfile({ byTheNumbers: updated });
    };

    const handleRemove = (index: number) => {
      updateProfile({ byTheNumbers: profile.byTheNumbers.filter((_, i) => i !== index) });
    };

    const handleAiSuggest = async () => {
      const result = await callAiEnhance('byTheNumbers', profile.byTheNumbers);
      if (Array.isArray(result) && result.length > 0) {
        updateProfile({
          byTheNumbers: result.map((r: any, idx: number) => ({
            id: String(idx + 1),
            stat: r.stat || '10+',
            label: r.label || String(r),
          })),
        });
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Quantifiable impact metrics (years of experience, team size, scale handled).
          </p>
          <button
            onClick={handleAiSuggest}
            disabled={aiLoading}
            className="text-xs text-[#63c6ae] hover:text-[#63c6ae] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            AI Suggest Metrics
          </button>
        </div>

        <div className="space-y-2.5">
          {profile.byTheNumbers.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <input
                type="text"
                value={item.stat}
                onChange={(e) => handleUpdate(idx, e.target.value, item.label)}
                placeholder="e.g. 15+ years"
                className="w-32 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-[#63c6ae] font-semibold focus:outline-none focus:border-[#63c6ae]"
              />
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdate(idx, item.stat, e.target.value)}
                placeholder="Description of achievement"
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
              />
              <button
                onClick={() => handleRemove(idx)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Metric
        </button>
      </div>
    );
  }

  // 4. My Approach Editor
  if (sectionId === 'approach') {
    const handleAdd = () => {
      updateProfile({ approach: [...profile.approach, 'Next step in architecture process'] });
    };

    const handleUpdate = (index: number, val: string) => {
      const updated = [...profile.approach];
      updated[index] = val;
      updateProfile({ approach: updated });
    };

    const handleRemove = (index: number) => {
      updateProfile({ approach: profile.approach.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Your engineering methodology pipeline. Shows how you analyze, design, and deliver solutions.
        </p>

        <div className="space-y-2">
          {profile.approach.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="w-6 h-6 rounded bg-slate-800 text-slate-400 text-xs flex items-center justify-center font-mono">
                {idx + 1}
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
              />
              <button
                onClick={() => handleRemove(idx)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Step to Pipeline
        </button>
      </div>
    );
  }

  // 5. Tech Stack Badges Editor
  if (sectionId === 'techStack') {
    const handleBadgeStyle = (style: BadgeStyle) => {
      updateProfile({ badgeStyle: style });
    };

    const toggleTech = (tech: TechBadgeInfo) => {
      const cat = tech.category;
      const currentList = profile.techStack[cat] || [];
      const exists = currentList.includes(tech.name);

      let newList: string[];
      if (exists) {
        newList = currentList.filter((t) => t !== tech.name);
      } else {
        newList = [...currentList, tech.name];
      }

      updateProfile({
        techStack: {
          ...profile.techStack,
          [cat]: newList,
        },
      });
    };

    const removeCustomTech = (category: keyof typeof profile.techStack, name: string) => {
      updateProfile({
        techStack: {
          ...profile.techStack,
          [category]: profile.techStack[category].filter((t) => t !== name),
        },
      });
    };

    const filteredTechs = TECH_CATALOG.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(techSearch.toLowerCase());
      const matchCat = selectedTechCategory === 'all' || t.category === selectedTechCategory;
      return matchSearch && matchCat;
    });

    const categories: Array<{ key: keyof typeof profile.techStack; label: string }> = [
      { key: 'languages', label: 'Languages' },
      { key: 'frontend', label: 'Frontend & UI' },
      { key: 'backend', label: 'Backend & APIs' },
      { key: 'database', label: 'Databases & Storage' },
      { key: 'devops', label: 'DevOps & Cloud' },
      { key: 'ai_ml', label: 'AI & Machine Learning' },
      { key: 'tools', label: 'Developer Tools' },
    ];

    return (
      <div className="space-y-5">
        {/* Badge Style Selector */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200">Shields.io Badge Style</span>
            <p className="text-[11px] text-slate-500">Pick the visual appearance of your badges</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-md border border-slate-800">
            {(['for-the-badge', 'flat', 'flat-square', 'plastic'] as BadgeStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => handleBadgeStyle(style)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  profile.badgeStyle === style
                    ? 'bg-[#63c6ae] text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Badges by Category */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300">Active Profile Badges</h4>
          <div className="space-y-2">
            {categories.map((cat) => {
              const list = profile.techStack[cat.key] || [];
              if (list.length === 0) return null;

              return (
                <div key={cat.key} className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                    {cat.label} ({list.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((techName) => (
                      <span
                        key={techName}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-xs text-slate-200 group"
                      >
                        <span>{techName}</span>
                        <button
                          onClick={() => removeCustomTech(cat.key, techName)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add more badges from catalog */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Add Technologies from Catalog</span>
            <span className="text-[11px] text-slate-500">Click to toggle badges on your profile</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
              placeholder="Search technologies (e.g. React, Docker, Python)..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
            />
            <select
              value={selectedTechCategory}
              onChange={(e) => setSelectedTechCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="languages">Languages</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps & Cloud</option>
              <option value="ai_ml">AI & ML</option>
              <option value="tools">Tools</option>
            </select>
          </div>

          <div className="max-h-48 overflow-y-auto pr-1 flex flex-wrap gap-1.5">
            {filteredTechs.map((tech) => {
              const isSelected = (profile.techStack[tech.category] || []).includes(tech.name);
              return (
                <button
                  key={tech.slug}
                  onClick={() => toggleTech(tech)}
                  className={`px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#63c6ae]/20 text-[#63c6ae] border-[#63c6ae]/40 font-medium'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#63c6ae]" />}
                  <span>{tech.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 6. GitHub Stats Cards Editor
  if (sectionId === 'stats') {
    const stats = profile.statsWidgets;

    const toggleStat = (key: keyof typeof stats) => {
      updateProfile({
        statsWidgets: {
          ...stats,
          [key]: !stats[key],
        },
      });
    };

    const setStatTheme = (theme: string) => {
      updateProfile({
        statsWidgets: {
          ...stats,
          theme,
        },
      });
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Render live dynamic cards connected to your GitHub username (
          <code className="text-[#63c6ae]">{profile.githubUsername || 'username'}</code>).
        </p>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">GitHub Summary Stats Card</span>
              <span className="text-[11px] text-slate-500">Stars earned, commits, pull requests & contributions</span>
            </div>
            <input
              type="checkbox"
              checked={stats.showStats}
              onChange={() => toggleStat('showStats')}
              className="accent-[#63c6ae] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Top Languages Breakdown</span>
              <span className="text-[11px] text-slate-500">Compact chart of most-used programming languages</span>
            </div>
            <input
              type="checkbox"
              checked={stats.showLanguages}
              onChange={() => toggleStat('showLanguages')}
              className="accent-[#63c6ae] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">GitHub Contribution Streak Stats</span>
              <span className="text-[11px] text-slate-500">Current streak, longest streak, and total contributions</span>
            </div>
            <input
              type="checkbox"
              checked={stats.showStreak}
              onChange={() => toggleStat('showStreak')}
              className="accent-[#63c6ae] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Contribution Eating Snake Animation</span>
              <span className="text-[11px] text-slate-500">Animated SVG game eating your commit contribution graph</span>
            </div>
            <input
              type="checkbox"
              checked={stats.showSnake}
              onChange={() => toggleStat('showSnake')}
              className="accent-[#63c6ae] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Stats Card Theme</label>
            <select
              value={stats.theme}
              onChange={(e) => setStatTheme(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
            >
              <option value="github_dark">GitHub Dark (Default)</option>
              <option value="tokyonight">Tokyo Night</option>
              <option value="radical">Radical</option>
              <option value="dracula">Dracula</option>
              <option value="gruvbox">Gruvbox</option>
              <option value="nord">Nord</option>
              <option value="catppuccin_mocha">Catppuccin Mocha</option>
              <option value="default">Light (GitHub Standard)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Border Styling</label>
            <label className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={stats.hideBorder}
                onChange={() => toggleStat('hideBorder')}
                className="accent-[#63c6ae] w-4 h-4"
              />
              <span>Hide border around cards</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // 7. Featured Projects Editor
  if (sectionId === 'projects') {
    const handleAdd = () => {
      const newItem: ProjectItem = {
        id: String(Date.now()),
        name: 'new-awesome-project',
        description: 'Clean description of what this project does and why it matters.',
        tech: ['TypeScript', 'React'],
        stars: '45',
        link: `https://github.com/${profile.githubUsername}/new-awesome-project`,
      };
      updateProfile({ featuredProjects: [...profile.featuredProjects, newItem] });
    };

    const handleUpdate = (index: number, patch: Partial<ProjectItem>) => {
      const updated = [...profile.featuredProjects];
      updated[index] = { ...updated[index], ...patch };
      updateProfile({ featuredProjects: updated });
    };

    const handleRemove = (index: number) => {
      updateProfile({ featuredProjects: profile.featuredProjects.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Highlight your top open-source repositories and notable projects.
        </p>

        <div className="space-y-3">
          {profile.featuredProjects.map((proj, idx) => (
            <div key={proj.id} className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                  placeholder="repository-name"
                  className="font-mono text-xs font-semibold text-[#63c6ae] bg-slate-900 border border-slate-800 rounded px-2.5 py-1 focus:outline-none focus:border-[#63c6ae]"
                />
                <button
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={proj.description}
                onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                placeholder="What problem does this project solve?"
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#63c6ae]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Tech stack (comma-separated)</label>
                  <input
                    type="text"
                    value={proj.tech.join(', ')}
                    onChange={(e) =>
                      handleUpdate(idx, {
                        tech: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#63c6ae]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Repository URL</label>
                  <input
                    type="text"
                    value={proj.link || ''}
                    onChange={(e) => handleUpdate(idx, { link: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#63c6ae] font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Featured Project
        </button>
      </div>
    );
  }

  // 8. Current Focus Editor
  if (sectionId === 'focus') {
    const handleAdd = () => {
      updateProfile({ currentFocus: [...profile.currentFocus, 'Exploring distributed agent systems'] });
    };

    const handleUpdate = (index: number, val: string) => {
      const updated = [...profile.currentFocus];
      updated[index] = val;
      updateProfile({ currentFocus: updated });
    };

    const handleRemove = (index: number) => {
      updateProfile({ currentFocus: profile.currentFocus.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          What are you actively building, researching, or learning right now?
        </p>

        <div className="space-y-2">
          {profile.currentFocus.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[#63c6ae] text-xs">▸</span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#63c6ae]"
              />
              <button
                onClick={() => handleRemove(idx)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Focus Item
        </button>
      </div>
    );
  }

  // 9. Articles & Content Editor
  if (sectionId === 'content') {
    const handleAdd = () => {
      const newItem: ContentItem = {
        id: String(Date.now()),
        title: 'New Technical Article or Talk',
        description: 'Key takeaways and architectural insights shared.',
        link: 'https://mysite.com/blog',
      };
      updateProfile({ contentOrArticles: [...profile.contentOrArticles, newItem] });
    };

    const handleUpdate = (index: number, patch: Partial<ContentItem>) => {
      const updated = [...profile.contentOrArticles];
      updated[index] = { ...updated[index], ...patch };
      updateProfile({ contentOrArticles: updated });
    };

    const handleRemove = (index: number) => {
      updateProfile({ contentOrArticles: profile.contentOrArticles.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Articles, tutorials, technical blogs, or conferences you've written or spoken at.
        </p>

        <div className="space-y-3">
          {profile.contentOrArticles.map((article, idx) => (
            <div key={article.id} className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => handleUpdate(idx, { title: e.target.value })}
                  placeholder="Article / Talk Title"
                  className="font-medium text-xs text-white bg-slate-900 border border-slate-800 rounded px-2.5 py-1 focus:outline-none focus:border-[#63c6ae] flex-1 mr-2"
                />
                <button
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={article.description}
                onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                placeholder="Short summary of what readers will learn..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#63c6ae]"
              />

              <input
                type="text"
                value={article.link || ''}
                onChange={(e) => handleUpdate(idx, { link: e.target.value })}
                placeholder="URL (optional)"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#63c6ae] font-mono"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Publication / Blog Link
        </button>
      </div>
    );
  }

  // 10. Let's Talk & Socials Editor
  if (sectionId === 'contact') {
    const platforms: Array<{ id: any; label: string; placeholder: string }> = [
      { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
      { id: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/username' },
      { id: 'website', label: 'Blog / Portfolio', placeholder: 'https://mywebsite.com' },
      { id: 'email', label: 'Email', placeholder: 'mailto:me@example.com' },
      { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
      { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
      { id: 'medium', label: 'Medium', placeholder: 'https://medium.com/@username' },
      { id: 'devto', label: 'Dev.to', placeholder: 'https://dev.to/username' },
    ];

    const handleSocialChange = (platform: any, url: string, label: string) => {
      const existing = profile.socials || [];
      const idx = existing.findIndex((s) => s.platform === platform);

      let updated;
      if (!url.trim()) {
        updated = existing.filter((s) => s.platform !== platform);
      } else if (idx >= 0) {
        updated = [...existing];
        updated[idx] = { ...updated[idx], url, label };
      } else {
        updated = [...existing, { id: platform, platform, url, label }];
      }

      updateProfile({ socials: updated });
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Render official Shields.io social badges with matching brand colors and logos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {platforms.map((p) => {
            const current = (profile.socials || []).find((s) => s.platform === p.id);
            return (
              <div key={p.id} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {p.label}
                </label>
                <input
                  type="text"
                  value={current?.url || ''}
                  onChange={(e) => handleSocialChange(p.id, e.target.value, p.label)}
                  placeholder={p.placeholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#63c6ae] font-mono"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 11. Custom Markdown Editor
  if (sectionId === 'custom') {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-400">
          Inject any custom GitHub Flavored Markdown block into your profile layout.
        </p>
        <textarea
          value={profile.customMarkdown}
          onChange={(e) => updateProfile({ customMarkdown: e.target.value })}
          rows={8}
          placeholder="> Add custom quotes, HTML tags, iframe widgets, or badges..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#63c6ae] font-mono"
        />
      </div>
    );
  }

  return null;
};
