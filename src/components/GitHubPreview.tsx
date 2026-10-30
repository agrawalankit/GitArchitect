import React, { useState } from 'react';
import {
  ProfileData,
} from '../types/profile';
import { getBadgeUrl } from '../utils/techCatalog';
import {
  MapPin,
  Building,
  Mail,
  Link as LinkIcon,
  Clock,
  Pencil,
  BookMarked,
  FolderGit2,
  Columns,
  Box,
  Star,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';

interface GitHubPreviewProps {
  profile: ProfileData;
}

export const GitHubPreview: React.FC<GitHubPreviewProps> = ({ profile }) => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const isDark = themeMode === 'dark';

  const username = profile.githubUsername || 'username';
  const badgeStyle = profile.badgeStyle || 'for-the-badge';

  // Fallback avatar or custom user photo
  const avatarSrc = profile.avatarUrl || './assets/aistudio/image_6c13ad45.png';

  // Background and border tokens based on GitHub dark / light mode
  const bgMain = isDark ? 'bg-[#0d1117]' : 'bg-[#ffffff]';
  const bgCard = isDark ? 'bg-[#0d1117]' : 'bg-[#ffffff]';
  const borderCol = isDark ? 'border-[#30363d]' : 'border-[#d0d7de]';
  const textPrimary = isDark ? 'text-[#c9d1d9]' : 'text-[#1f2328]';
  const textHeading = isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]';
  const textMuted = isDark ? 'text-[#8b949e]' : 'text-[#656d76]';
  const quoteBg = isDark ? 'border-[#30363d] text-[#8b949e]' : 'border-[#d0d7de] text-[#57606a]';
  const dividerCol = isDark ? 'border-[#21262d]' : 'border-[#d8dee4]';

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar inside preview */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Live GitHub Profile Simulation</span>
          <span
            className="text-xs px-2.5 py-0.5 rounded font-mono font-semibold"
            style={{
              backgroundColor: 'rgba(99, 198, 174, 0.12)',
              color: '#63c6ae',
              borderColor: 'rgba(99, 198, 174, 0.3)',
              borderWidth: '1px',
            }}
          >
            github.com/{username}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1.5 rounded transition-colors ${
                isDark ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="GitHub Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1.5 rounded transition-colors ${
                !isDark ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="GitHub Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Page Frame */}
      <div
        className={`rounded-xl border ${borderCol} ${bgMain} overflow-hidden shadow-2xl transition-colors duration-200`}
      >
        {/* GitHub Sub-navigation Tabs */}
        <div className={`border-b ${borderCol} px-4 md:px-8 pt-3 flex items-center gap-4 text-xs font-medium overflow-x-auto`}>
          <div className={`pb-2.5 flex items-center gap-1.5 font-semibold border-b-2 ${isDark ? 'border-[#f78166] text-[#f0f6fc]' : 'border-[#fd8c73] text-[#1f2328]'}`}>
            <BookMarked className="w-4 h-4" />
            <span>Overview</span>
          </div>
          <div className={`pb-2.5 flex items-center gap-1.5 text-slate-500 hover:${textHeading} transition-colors cursor-pointer`}>
            <FolderGit2 className="w-4 h-4" />
            <span>Repositories</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${isDark ? 'bg-[#21262d] text-[#8b949e]' : 'bg-[#afb8c1]/20 text-[#656d76]'}`}>
              {profile.featuredProjects.length + 18}
            </span>
          </div>
          <div className={`pb-2.5 flex items-center gap-1.5 text-slate-500 hover:${textHeading} transition-colors cursor-pointer`}>
            <Columns className="w-4 h-4" />
            <span>Projects</span>
          </div>
          <div className={`pb-2.5 flex items-center gap-1.5 text-slate-500 hover:${textHeading} transition-colors cursor-pointer`}>
            <Box className="w-4 h-4" />
            <span>Packages</span>
          </div>
          <div className={`pb-2.5 flex items-center gap-1.5 text-slate-500 hover:${textHeading} transition-colors cursor-pointer`}>
            <Star className="w-4 h-4" />
            <span>Stars</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${isDark ? 'bg-[#21262d] text-[#8b949e]' : 'bg-[#afb8c1]/20 text-[#656d76]'}`}>
              14
            </span>
          </div>
        </div>

        {/* 2-Column Body Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: User Profile Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative inline-block">
                <img
                  src={avatarSrc}
                  alt={profile.name}
                  className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border border-slate-700/50 shadow-md"
                  onError={(e) => {
                    // Fallback to initials avatar if image doesn't load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <h1 className={`text-2xl font-bold tracking-tight ${textHeading}`}>{profile.name}</h1>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className={textMuted}>{profile.githubUsername || 'username'}</span>
                  {profile.pronouns && (
                    <>
                      <span className={textMuted}>·</span>
                      <span className={textMuted}>{profile.pronouns}</span>
                    </>
                  )}
                </div>
              </div>

              {profile.tagline ? (
                <p className={`text-xs ${textPrimary} leading-relaxed`}>{profile.tagline}</p>
              ) : profile.title ? (
                <p className={`text-xs ${textPrimary} leading-relaxed`}>{profile.title}</p>
              ) : null}

              <button
                className={`w-full py-1.5 px-3 text-xs font-semibold rounded-md border ${
                  isDark
                    ? 'border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]'
                    : 'border-[#d0d7de] bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f]'
                } transition-colors`}
              >
                Edit profile
              </button>

              {/* Profile Details List */}
              <div className={`space-y-2 text-xs ${textPrimary} pt-2 border-t ${dividerCol}`}>
                {profile.company && (
                  <div className="flex items-center gap-2">
                    <Building className={`w-4 h-4 ${textMuted} shrink-0`} />
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${textMuted} shrink-0`} />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${textMuted} shrink-0`} />
                  <span>19:30 (UTC)</span>
                </div>
                {profile.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className={`w-4 h-4 ${textMuted} shrink-0`} />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2 truncate">
                    <LinkIcon className={`w-4 h-4 ${textMuted} shrink-0`} />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                      style={{ color: '#63c6ae' }}
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: README.md Container & Pinned Repos */}
            <div className="lg:col-span-8 space-y-6">
              {/* The Special README.md Card */}
              <div className={`rounded-md border ${borderCol} ${bgCard} overflow-hidden shadow-sm`}>
                {/* README Header Bar */}
                <div className={`px-4 py-2.5 border-b ${borderCol} flex items-center justify-between text-xs`}>
                  <div className="flex items-center gap-2">
                    <span className={textMuted}>{username}</span>
                    <span className={textMuted}>/</span>
                    <span className={`font-semibold ${textHeading}`}>README.md</span>
                  </div>
                  <button
                    className={`p-1 rounded text-slate-400 hover:${textHeading} transition-colors`}
                    title="Edit README"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Rendered README Content */}
                <div className={`p-6 sm:p-8 space-y-6 text-sm leading-relaxed ${textPrimary}`}>
                  {profile.sections.map((sec) => {
                    if (!sec.enabled) return null;

                    switch (sec.id) {
                      case 'header':
                        return (
                          <div key={sec.id} className="space-y-3">
                            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${textHeading}`}>
                              Hi, I'm {profile.name} 👋
                            </h2>
                            {profile.title && (
                              <p className={`text-xs sm:text-sm font-medium ${textPrimary}`}>
                                {profile.title}
                              </p>
                            )}
                            {profile.quote && (
                              <div className={`border-l-4 pl-3 py-1 text-xs italic ${quoteBg}`}>
                                "{profile.quote}"
                              </div>
                            )}
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );

                      case 'whatIDo':
                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>What I do</h3>
                            <p className={`text-xs ${textMuted}`}>
                              I help founders, CTOs and product teams solve the engineering problems that slow down product growth:
                            </p>
                            <ul className="space-y-2 text-xs">
                              {profile.whatIDo.map((item) => (
                                <li key={item.id} className="flex items-start gap-2">
                                  <span className="shrink-0">{item.emoji}</span>
                                  <span>{item.text}</span>
                                </li>
                              ))}
                            </ul>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );

                      case 'byTheNumbers':
                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>By the numbers</h3>
                            <ul className="space-y-2 text-xs">
                              {profile.byTheNumbers.map((item) => (
                                <li key={item.id} className="flex items-start gap-2">
                                  <span className="font-bold shrink-0" style={{ color: '#63c6ae' }}>•</span>
                                  <span>
                                    <strong className={`${textHeading} font-bold`}>{item.stat}</strong> {item.label}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );

                      case 'approach':
                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>My approach</h3>
                            <div className={`p-3 rounded-lg bg-slate-900/30 border ${borderCol} text-xs font-semibold ${textHeading}`}>
                              {profile.approach.join(' → ')}
                            </div>
                            <p className={`text-xs ${textMuted} leading-relaxed`}>
                              I don't believe every problem needs a rewrite, more infrastructure, or the newest framework. Sometimes the answer is better architecture. Sometimes it's a better query. And sometimes it's writing less code.
                            </p>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );

                      case 'techStack': {
                        const allTechs = Array.from(
                          new Set([
                            ...(profile.techStack.languages || []),
                            ...(profile.techStack.frontend || []),
                            ...(profile.techStack.backend || []),
                            ...(profile.techStack.database || []),
                            ...(profile.techStack.devops || []),
                            ...(profile.techStack.ai_ml || []),
                            ...(profile.techStack.tools || []),
                          ])
                        );

                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>Tech stack</h3>
                            <div className="flex flex-wrap gap-2">
                              {allTechs.map((tech) => {
                                const { url, tech: info } = getBadgeUrl(tech, badgeStyle);
                                return (
                                  <img
                                    key={tech}
                                    src={url}
                                    alt={info.name}
                                    className="h-6 hover:scale-105 transition-transform"
                                  />
                                );
                              })}
                            </div>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );
                      }

                      case 'stats': {
                        const stats = profile.statsWidgets;
                        const themeParam = `theme=${stats.theme || (isDark ? 'github_dark' : 'default')}`;
                        const borderParam = stats.hideBorder ? '&hide_border=true' : '';

                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>GitHub Activity & Analytics</h3>
                            <div className="space-y-3 flex flex-col items-center">
                              <div className="flex flex-wrap justify-center gap-3 w-full">
                                {stats.showStats && (
                                  <img
                                    src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&${themeParam}${borderParam}&rank_icon=github`}
                                    alt="GitHub stats"
                                    className="max-w-full rounded"
                                    loading="lazy"
                                  />
                                )}
                                {stats.showLanguages && (
                                  <img
                                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&${themeParam}${borderParam}`}
                                    alt="Top languages"
                                    className="max-w-full rounded"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                              {stats.showStreak && (
                                <img
                                  src={`https://streak-stats.demolab.com/?user=${username}&${themeParam}${borderParam}`}
                                  alt="Streak stats"
                                  className="max-w-full rounded"
                                  loading="lazy"
                                />
                              )}
                              {stats.showSnake && (
                                <div className="p-2 rounded bg-slate-900/50 border border-slate-800 text-center w-full">
                                  <span className="text-[11px] text-slate-500 font-mono block mb-1">
                                    [Snake Contribution Game Animation widget]
                                  </span>
                                  <img
                                    src={`https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg`}
                                    alt="Contribution Snake"
                                    className="mx-auto max-w-full"
                                    onError={(e) => {
                                      // Render nice preview mock if repo doesn't exist yet
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );
                      }

                      case 'projects':
                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>Featured Projects</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className={`border-b ${borderCol} text-slate-400`}>
                                    <th className="py-2 pr-4 font-semibold">Project</th>
                                    <th className="py-2 px-4 font-semibold">Description</th>
                                    <th className="py-2 px-4 font-semibold">Stack</th>
                                    <th className="py-2 pl-4 font-semibold">Link</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {profile.featuredProjects.map((p) => (
                                    <tr key={p.id} className={`border-b ${dividerCol}`}>
                                      <td className={`py-2.5 pr-4 font-bold ${textHeading}`}>
                                        {p.name}
                                      </td>
                                      <td className={`py-2.5 px-4 text-xs ${textMuted}`}>
                                        {p.description}
                                      </td>
                                      <td className="py-2.5 px-4">
                                        <div className="flex flex-wrap gap-1">
                                          {p.tech.map((t) => (
                                            <span
                                              key={t}
                                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                                              }`}
                                            >
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="py-2.5 pl-4">
                                        {p.link ? (
                                          <a
                                            href={p.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline flex items-center gap-1"
                                            style={{ color: '#63c6ae' }}
                                          >
                                            View
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        ) : (
                                          '—'
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );

                      case 'focus':
                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>Current focus</h3>
                            <ul className="space-y-1.5 text-xs">
                              {profile.currentFocus.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="font-bold" style={{ color: '#63c6ae' }}>•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );

                      case 'content':
                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>✍️ I write about tech</h3>
                            <ul className="space-y-2 text-xs">
                              {profile.contentOrArticles.map((article) => (
                                <li key={article.id}>
                                  {article.link ? (
                                    <a
                                      href={article.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-bold hover:underline"
                                      style={{ color: '#63c6ae' }}
                                    >
                                      {article.title}
                                    </a>
                                  ) : (
                                    <strong className={`${textHeading} font-bold`}>{article.title}</strong>
                                  )}
                                  <p className={`text-xs ${textMuted} mt-0.5`}>{article.description}</p>
                                </li>
                              ))}
                            </ul>
                            <div className={`border-b ${dividerCol} pt-2`} />
                          </div>
                        );

                      case 'contact': {
                        const socialBadges: Array<{ label: string; url: string; color: string; logo: string }> = [];
                        const confMap: Record<string, { color: string; logo: string }> = {
                          linkedin: { color: '0077B5', logo: 'linkedin' },
                          x: { color: '000000', logo: 'x' },
                          github: { color: '181717', logo: 'github' },
                          youtube: { color: 'FF0000', logo: 'youtube' },
                          medium: { color: '12100E', logo: 'medium' },
                          devto: { color: '0A0A0A', logo: 'devdotto' },
                          instagram: { color: 'E4405F', logo: 'instagram' },
                          website: { color: '20232A', logo: 'googlechrome' },
                          email: { color: 'D14836', logo: 'gmail' },
                        };

                        (profile.socials || []).forEach((s) => {
                          const conf = confMap[s.platform] || { color: '24292e', logo: 'github' };
                          socialBadges.push({
                            label: s.label.toUpperCase(),
                            url: s.url,
                            color: conf.color,
                            logo: conf.logo,
                          });
                        });

                        return (
                          <div key={sec.id} className="space-y-3">
                            <h3 className={`text-base font-bold ${textHeading}`}>Let's talk</h3>
                            <p className={`text-xs ${textMuted}`}>
                              If you're a founder, CTO or product leader dealing with engineering challenges, tell me what's not working and we can start with the problem:
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {socialBadges.map((badge) => (
                                <a
                                  key={badge.label}
                                  href={badge.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:opacity-90 transition-opacity"
                                >
                                  <img
                                    src={`https://img.shields.io/badge/${encodeURIComponent(badge.label)}-${badge.color}?style=${badgeStyle}&logo=${badge.logo}&logoColor=white`}
                                    alt={badge.label}
                                    className="h-6"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      case 'custom':
                        return (
                          <div key={sec.id} className={`p-4 rounded-lg bg-slate-900/40 border ${borderCol} text-xs font-mono whitespace-pre-wrap`}>
                            {profile.customMarkdown}
                          </div>
                        );

                      default:
                        return null;
                    }
                  })}
                </div>
              </div>

              {/* Popular Repositories Strip (as in reference pic) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-semibold ${textHeading}`}>Popular repositories</h3>
                  <span className="text-xs hover:underline cursor-pointer" style={{ color: '#63c6ae' }}>
                    Customize your pins
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.featuredProjects.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-md border ${borderCol} ${bgCard} flex flex-col justify-between hover:border-slate-500 transition-colors cursor-pointer`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold hover:underline" style={{ color: '#63c6ae' }}>
                            {p.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${borderCol} ${textMuted}`}>
                            Public
                          </span>
                        </div>
                        <p className={`text-[11px] ${textMuted} line-clamp-2`}>{p.description}</p>
                      </div>
                      <div className="flex items-center gap-3 pt-3 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                          <span>{p.tech[0] || 'Code'}</span>
                        </div>
                        {p.stars && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            <span>{p.stars}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contribution Activity Heatmap Simulation (matches reference pic) */}
              <div className={`p-4 rounded-md border ${borderCol} ${bgCard} space-y-3`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${textHeading}`}>
                    75 contributions in the last year
                  </span>
                  <span className="text-[11px] text-slate-400">Contribution settings ▾</span>
                </div>

                {/* Heatmap grid */}
                <div className="overflow-x-auto pb-1">
                  <div className="flex gap-1 min-w-[500px]">
                    {Array.from({ length: 40 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          const hasCommit = (colIdx * 7 + rowIdx) % 5 === 0;
                          const intensity = (colIdx + rowIdx) % 4;
                          return (
                            <div
                              key={rowIdx}
                              className={`w-2.5 h-2.5 rounded-xs transition-colors ${
                                hasCommit
                                  ? intensity === 0
                                    ? 'bg-emerald-800'
                                    : intensity === 1
                                    ? 'bg-emerald-600'
                                    : intensity === 2
                                    ? 'bg-emerald-500'
                                    : 'bg-emerald-400'
                                  : isDark
                                  ? 'bg-[#161b22]'
                                  : 'bg-[#ebedf0]'
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span className="hover:underline cursor-pointer">Learn how we count contributions</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <span className="w-2 h-2 rounded-xs bg-[#161b22]" />
                    <span className="w-2 h-2 rounded-xs bg-emerald-800" />
                    <span className="w-2 h-2 rounded-xs bg-emerald-600" />
                    <span className="w-2 h-2 rounded-xs bg-emerald-400" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
