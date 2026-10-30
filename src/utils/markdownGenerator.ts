import { ProfileData } from '../types/profile';
import { getBadgeUrl } from './techCatalog';

export function generateMarkdown(profile: ProfileData): string {
  const parts: string[] = [];
  const username = profile.githubUsername || 'username';
  const badgeStyle = profile.badgeStyle || 'for-the-badge';

  profile.sections.forEach((section) => {
    if (!section.enabled) return;

    switch (section.id) {
      case 'header': {
        const headerLines: string[] = [];
        headerLines.push(`# Hi, I'm ${profile.name} 👋\n`);

        if (profile.title) {
          headerLines.push(`**${profile.title}**\n`);
        }

        if (profile.quote) {
          headerLines.push(`> ${profile.quote}\n`);
        }

        parts.push(headerLines.join('\n'));
        break;
      }

      case 'whatIDo': {
        if (profile.whatIDo && profile.whatIDo.length > 0) {
          const lines: string[] = ['### What I do\n'];
          profile.whatIDo.forEach((item) => {
            lines.push(`- ${item.emoji} ${item.text}`);
          });
          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'byTheNumbers': {
        if (profile.byTheNumbers && profile.byTheNumbers.length > 0) {
          const lines: string[] = ['### By the numbers\n'];
          profile.byTheNumbers.forEach((item) => {
            lines.push(`- **${item.stat}** ${item.label}`);
          });
          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'approach': {
        if (profile.approach && profile.approach.length > 0) {
          const lines: string[] = ['### My approach\n'];
          lines.push(`**${profile.approach.join(' → ')}**`);
          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'techStack': {
        const categories = profile.techStack || {};
        const allTechs = [
          ...(categories.languages || []),
          ...(categories.frontend || []),
          ...(categories.backend || []),
          ...(categories.database || []),
          ...(categories.devops || []),
          ...(categories.ai_ml || []),
          ...(categories.tools || []),
        ];

        const uniqueTechs = Array.from(new Set(allTechs));
        const allBadges: string[] = [];

        uniqueTechs.forEach((tech) => {
          const { url, tech: info } = getBadgeUrl(tech, badgeStyle);
          allBadges.push(`![${info.name}](${url})`);
        });

        if (allBadges.length > 0) {
          const lines: string[] = ['### Tech stack\n'];
          lines.push(allBadges.join(' '));
          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'stats': {
        const stats = profile.statsWidgets;
        if (stats.showStats || stats.showLanguages || stats.showStreak || stats.showSnake) {
          const lines: string[] = ['### GitHub Activity & Analytics\n'];
          lines.push('<div align="center">\n');

          const themeParam = `theme=${stats.theme || 'github_dark'}`;
          const borderParam = stats.hideBorder ? '&hide_border=true' : '';

          if (stats.showStats && stats.showLanguages) {
            lines.push(
              `  <a href="https://github.com/${username}">\n` +
                `    <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&${themeParam}${borderParam}&rank_icon=github" alt="${profile.name}'s GitHub stats" height="165" />\n` +
                `  </a>\n` +
                `  <a href="https://github.com/${username}">\n` +
                `    <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&${themeParam}${borderParam}" alt="Top Langs" height="165" />\n` +
                `  </a>\n`
            );
          } else if (stats.showStats) {
            lines.push(
              `  <a href="https://github.com/${username}">\n` +
                `    <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&${themeParam}${borderParam}&rank_icon=github" alt="${profile.name}'s GitHub stats" />\n` +
                `  </a>\n`
            );
          }

          if (stats.showStreak) {
            lines.push(
              `  <br />\n` +
                `  <a href="https://github.com/${username}">\n` +
                `    <img src="https://streak-stats.demolab.com/?user=${username}&${themeParam}${borderParam}" alt="${profile.name}'s Streak" />\n` +
                `  </a>\n`
            );
          }

          if (stats.showSnake) {
            lines.push(
              `  <br />\n` +
                `  <img src="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg" alt="Snake animation" />\n`
            );
          }

          lines.push('</div>');
          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'projects': {
        if (profile.featuredProjects && profile.featuredProjects.length > 0) {
          const lines: string[] = ['### Featured Projects\n'];
          lines.push('| Project | Description | Stack | Link |');
          lines.push('| :--- | :--- | :--- | :--- |');

          profile.featuredProjects.forEach((proj) => {
            const techBadges = proj.tech
              .map((t) => `\`${t}\``)
              .join(' ');
            const linkMd = proj.link ? `[View Code](${proj.link})` : '—';
            lines.push(`| **${proj.name}** | ${proj.description} | ${techBadges} | ${linkMd} |`);
          });

          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'focus': {
        if (profile.currentFocus && profile.currentFocus.length > 0) {
          const lines: string[] = ['### Current focus\n'];
          profile.currentFocus.forEach((item) => {
            lines.push(`- ${item}`);
          });
          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'content': {
        if (profile.contentOrArticles && profile.contentOrArticles.length > 0) {
          const lines: string[] = ['### ✍️ I write about tech\n'];
          profile.contentOrArticles.forEach((article) => {
            if (article.link) {
              lines.push(`- **[${article.title}](${article.link})**: ${article.description}`);
            } else {
              lines.push(`- **${article.title}**: ${article.description}`);
            }
          });
          parts.push(lines.join('\n'));
        }
        break;
      }

      case 'contact': {
        if (!profile.socials || profile.socials.length === 0) break;
        const lines: string[] = ["### Let's connect\n"];

        const socialBadges: string[] = [];

        // Predefined social badge configs
        const socialMap: Record<string, { color: string; logo: string }> = {
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

        profile.socials.forEach((s) => {
          const conf = socialMap[s.platform] || { color: '24292e', logo: 'github' };
          const label = encodeURIComponent(s.label.toUpperCase());
          const badgeImg = `https://img.shields.io/badge/${label}-${conf.color}?style=${badgeStyle}&logo=${conf.logo}&logoColor=white`;
          socialBadges.push(`[![${s.label}](${badgeImg})](${s.url})`);
        });

        if (socialBadges.length > 0) {
          lines.push(socialBadges.join(' '));
        }

        parts.push(lines.join('\n'));
        break;
      }

      case 'custom': {
        if (profile.customMarkdown && profile.customMarkdown.trim()) {
          parts.push(profile.customMarkdown.trim());
        }
        break;
      }

      default:
        break;
    }
  });

  // Footer attribution
  parts.push(
    `\n---\n<p align="center">\n  <sub>Built with precision using <a href="https://codeexecute.com/ai-tools/gitarchitect">GitArchitect</a></sub>\n</p>`
  );

  return parts.join('\n\n');
}
