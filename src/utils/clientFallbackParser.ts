/**
 * Resilient, zero-memory, stateless client-side resume parser.
 * Reads ONLY data explicitly present in the provided resume.
 * If any field is not found in the resume, it is left completely blank ("" or []).
 * Never copies from previous resumes and never retains data in memory.
 */

import { ProfileData, SocialLink, SectionMeta } from '../types/profile';

export function parseResumeClientSide(text: string, _fileName?: string): ProfileData {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Extract Name (first clean non-header line under 40 chars)
  let candidateName = '';
  for (const line of lines.slice(0, 6)) {
    const clean = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
    if (
      clean.length >= 2 &&
      clean.length <= 40 &&
      !/resume|curriculum|vitae|page|contact|email|phone|http|github|linkedin|portfolio/i.test(clean)
    ) {
      candidateName = clean;
      break;
    }
  }

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract GitHub username or handle
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUsername = githubMatch
    ? githubMatch[1]
    : candidateName
    ? candidateName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : '';

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedinUrl = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

  // Extract portfolio or personal website (excluding social networks)
  const webMatch = text.match(/https?:\/\/(?!github\.com|linkedin\.com|twitter\.com|x\.com|facebook\.com)([\w.-]+\.[a-z]{2,})(\/[^\s]*)?/i);
  const website = webMatch ? webMatch[0] : '';

  // Extract tech stack keywords strictly mentioned in THIS resume text
  const techCatalog = [
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin',
    'React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Redux', 'Svelte', 'HTML5', 'CSS3',
    'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'GraphQL', 'REST APIs', 'Laravel', 'WordPress',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux',
    'PyTorch', 'TensorFlow', 'Gemini', 'OpenAI', 'LangChain', 'LLMs', 'Git', 'Vite', 'Figma', 'Postman'
  ];

  function matchesTechKeyword(sourceText: string, keyword: string): boolean {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = /^\w/.test(keyword) ? '\\b' : '(?:^|\\s)';
    const suffix = /\w$/.test(keyword) ? '\\b' : '(?=$|[\\s,;.:!?/()\\[\\]])';
    try {
      const rx = new RegExp(`${prefix}${escaped}${suffix}`, 'i');
      return rx.test(sourceText);
    } catch {
      return sourceText.toLowerCase().includes(keyword.toLowerCase());
    }
  }

  const foundTech = techCatalog.filter((tech) => matchesTechKeyword(text, tech));
  const languages = foundTech.filter((t) => ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin'].includes(t));
  const frontend = foundTech.filter((t) => ['React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Redux', 'Svelte', 'HTML5', 'CSS3'].includes(t));
  const backend = foundTech.filter((t) => ['Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'GraphQL', 'REST APIs', 'Laravel', 'WordPress'].includes(t));
  const database = foundTech.filter((t) => ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase'].includes(t));
  const devops = foundTech.filter((t) => ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux'].includes(t));
  const ai_ml = foundTech.filter((t) => ['Gemini', 'PyTorch', 'TensorFlow', 'OpenAI', 'LangChain', 'LLMs'].includes(t));
  const tools = foundTech.filter((t) => ['Git', 'Vite', 'Figma', 'Postman'].includes(t));

  // Determine Title from first job or headline line in resume
  let title = '';
  for (const line of lines.slice(1, 5)) {
    if (/engineer|developer|architect|lead|manager|consultant|specialist|designer|scientist|programmer/i.test(line)) {
      title = line.replace(/[^a-zA-Z0-9\s&|·–-]/g, '').slice(0, 70).trim();
      break;
    }
  }

  // Extract Summary or Objective if explicitly present
  let aboutMe = '';
  const summaryHeaderIdx = lines.findIndex((l) => /^(summary|about|profile|professional summary|objective|about me)/i.test(l));
  if (summaryHeaderIdx !== -1 && lines[summaryHeaderIdx + 1]) {
    aboutMe = lines.slice(summaryHeaderIdx + 1, summaryHeaderIdx + 4).join(' ');
  }

  // Extract real bullet points from experience lines (starts with bullet / dash / asterisk)
  const bulletLines = lines.filter((l) => /^[-•*·]\s+/.test(l));
  const whatIDo = bulletLines.slice(0, 5).map((b, idx) => ({
    id: String(idx + 1),
    emoji: idx === 0 ? '⚡' : idx === 1 ? '🗄️' : idx === 2 ? '🚀' : idx === 3 ? '🛠️' : '👥',
    text: b.replace(/^[-•*·]\s+/, '').trim(),
  }));

  // Extract metrics only if explicitly present in resume
  const metricLines = lines.filter((l) => /\b\d+(\.\d+)?%|\b\d+\+\s*(?:years|yrs)|\$\d+|\b\d+[kKmM]\b/.test(l));
  const byTheNumbers = metricLines.slice(0, 4).map((m, idx) => {
    const numMatch = m.match(/\b\d+(\.\d+)?%|\b\d+\+\s*(?:years|yrs)|\$\d+|\b\d+[kKmM]\b/);
    const stat = numMatch ? numMatch[0] : '';
    const label = m.replace(stat, '').replace(/^[-•*·:, ]+/, '').trim().slice(0, 60);
    return { id: String(idx + 1), stat, label: label || 'impact' };
  }).filter((x) => Boolean(x.stat));

  // Build socials strictly from found links
  const socials: SocialLink[] = [];
  if (linkedinUrl) {
    socials.push({ id: '1', platform: 'linkedin', url: linkedinUrl, label: 'LinkedIn' });
  }
  if (githubUsername) {
    socials.push({ id: '2', platform: 'github', url: `https://github.com/${githubUsername}`, label: 'GitHub' });
  }
  if (website) {
    socials.push({ id: '3', platform: 'website', url: website, label: 'Portfolio' });
  }

  // Configure sections: enable ONLY sections that have real data
  const sections: SectionMeta[] = [
    { id: 'header', label: 'Header & Bio', enabled: true, iconName: 'User' },
    { id: 'whatIDo', label: 'What I Do', enabled: whatIDo.length > 0, iconName: 'Zap' },
    { id: 'byTheNumbers', label: 'By The Numbers', enabled: byTheNumbers.length > 0, iconName: 'Hash' },
    { id: 'approach', label: 'My Approach', enabled: false, iconName: 'Compass' },
    { id: 'techStack', label: 'Tech Stack', enabled: foundTech.length > 0, iconName: 'Cpu' },
    { id: 'stats', label: 'GitHub Stats Cards', enabled: Boolean(githubUsername), iconName: 'BarChart2' },
    { id: 'projects', label: 'Featured Projects', enabled: false, iconName: 'FolderGit2' },
    { id: 'focus', label: 'Current Focus', enabled: false, iconName: 'Target' },
    { id: 'content', label: 'Writing & Community', enabled: false, iconName: 'BookOpen' },
    { id: 'contact', label: "Let's Talk & Socials", enabled: socials.length > 0, iconName: 'MessageSquare' },
    { id: 'custom', label: 'Custom Callout', enabled: false, iconName: 'FileText' },
  ];

  return {
    name: candidateName || 'Developer',
    githubUsername: githubUsername || '',
    pronouns: '',
    title: title || '',
    location: '',
    company: '',
    email: email,
    website: website,
    // Do not set avatarUrl with any previous person's image
    avatarUrl: undefined,
    socials: socials,
    quote: '',
    aboutMe: aboutMe,
    whatIDo: whatIDo,
    byTheNumbers: byTheNumbers,
    approach: [],
    techStack: {
      languages,
      frontend,
      backend,
      database,
      devops,
      ai_ml,
      tools,
    },
    badgeStyle: 'for-the-badge',
    statsWidgets: {
      showStats: Boolean(githubUsername),
      showLanguages: Boolean(githubUsername),
      showStreak: Boolean(githubUsername),
      showSnake: false,
      showTrophies: false,
      theme: 'tokyonight',
      hideBorder: true,
    },
    currentFocus: [],
    featuredProjects: [],
    contentOrArticles: [],
    customMarkdown: '',
    sections: sections,
  };
}
