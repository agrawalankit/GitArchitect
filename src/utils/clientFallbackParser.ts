/**
 * Resilient client-side resume parser and fallback extractor.
 * Ensures GitArchitect functions 100% even on static hosting (e.g. WordPress, Apache, GitHub Pages)
 * or when the backend /api/parse-resume endpoint is not reachable.
 */

import { ProfileData, SocialLink } from '../types/profile';

export function parseResumeClientSide(text: string, _fileName?: string): ProfileData {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Extract Name (first clean non-header line)
  let candidateName = 'Developer';
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
    if (clean.length >= 3 && clean.length <= 40 && !/resume|curriculum|vitae|page|contact|email/i.test(clean)) {
      candidateName = clean;
      break;
    }
  }

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract GitHub username or handle
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUsername = githubMatch ? githubMatch[1] : (candidateName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'developer');

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedinUrl = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

  // Extract tech stack keywords
  const techCatalog = [
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin',
    'React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Redux', 'Svelte', 'HTML5', 'CSS3',
    'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'GraphQL', 'REST APIs', 'Laravel', 'WordPress',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux',
    'PyTorch', 'TensorFlow', 'Gemini', 'OpenAI', 'LangChain', 'LLMs', 'Git', 'Vite', 'Figma'
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
  const tools = foundTech.filter((t) => ['Git', 'Vite', 'Figma'].includes(t));

  // Determine Title based on found tech
  let title = 'Senior Software Engineer & Architect';
  if (languages.includes('PHP') || backend.includes('Laravel') || backend.includes('WordPress')) {
    title = 'Full-Stack Software Engineer & Solutions Architect';
  } else if (ai_ml.length > 0) {
    title = 'AI Software Engineer & System Architect';
  } else if (frontend.length > backend.length) {
    title = 'Frontend Engineer & UI/UX Architect';
  }

  // Detect years of experience or numbers
  const expMatch = text.match(/(\d+)\+?\s*(?:years|yrs)\s+(?:of\s+)?experience/i);
  const yearsExp = expMatch ? `${expMatch[1]}+ years` : '8+ years';

  const socials: SocialLink[] = [
    ...(linkedinUrl ? [{ id: '1', platform: 'linkedin' as const, url: linkedinUrl, label: 'LinkedIn' }] : []),
    { id: '2', platform: 'github' as const, url: `https://github.com/${githubUsername}`, label: 'GitHub' },
    { id: '3', platform: 'website' as const, url: 'https://codeexecute.com', label: 'CodeExecute' },
  ];

  return {
    name: candidateName,
    githubUsername: githubUsername,
    pronouns: 'he/him',
    title: title,
    location: '',
    company: '',
    email: email,
    website: 'https://codeexecute.com',
    avatarUrl: './assets/aistudio/image_6c13ad45.png',
    socials: socials,
    quote: "Your product doesn't always need more code. Sometimes it needs the right engineering decision.",
    aboutMe: `I build resilient, high-performance software systems and scalable cloud architectures. Passionate about solving bottleneck constraints, modernizing legacy systems, and crafting developer tooling.`,
    whatIDo: [
      { id: '1', emoji: '⚡', text: 'High-throughput APIs, microservices and database bottleneck diagnosis' },
      { id: '2', emoji: '🗄️', text: 'Systems scaling to millions of transactions and distributed records' },
      { id: '3', emoji: '🧱', text: 'Technical debt modernization and scalable architectural roadmaps' },
      { id: '4', emoji: '🚀', text: 'End-to-end MVP architecture and technical delivery' },
      { id: '5', emoji: '👥', text: 'Engineering delivery, mentoring squads, and code quality standards' },
    ],
    byTheNumbers: [
      { id: '1', stat: yearsExp, label: 'building software products and solving engineering constraints' },
      { id: '2', stat: '100+', label: 'web and enterprise software architectures delivered' },
      { id: '3', stat: '15+', label: 'engineers mentored across cross-functional squads' },
      { id: '4', stat: '99.9%', label: 'system availability and operational uptime' },
    ],
    approach: [
      'Understand the business problem',
      'Diagnose the technical constraint',
      'Choose the right solution',
      'Execute cleanly with tests',
      'Optimize & observe in production'
    ],
    techStack: {
      languages: languages.length > 0 ? languages : ['TypeScript', 'JavaScript', 'PHP', 'Python'],
      frontend: frontend.length > 0 ? frontend : ['React', 'Next.js', 'Tailwind CSS', 'Vue.js'],
      backend: backend.length > 0 ? backend : ['Node.js', 'Express', 'Laravel', 'REST APIs'],
      database: database.length > 0 ? database : ['PostgreSQL', 'MySQL', 'Redis'],
      devops: devops.length > 0 ? devops : ['Docker', 'AWS', 'GitHub Actions', 'Linux'],
      ai_ml: ai_ml.length > 0 ? ai_ml : ['Gemini', 'OpenAI'],
      tools: tools.length > 0 ? tools : ['Git', 'Vite', 'Figma']
    },
    badgeStyle: 'for-the-badge',
    statsWidgets: {
      showStats: true,
      showLanguages: true,
      showStreak: true,
      showSnake: false,
      showTrophies: false,
      theme: 'tokyonight',
      hideBorder: true,
    },
    currentFocus: [
      'AI-powered developer productivity tools & SaaS architectures',
      'Distributed systems scalability and query optimization',
      'High-converting developer portfolios & open-source engineering'
    ],
    featuredProjects: [
      {
        id: '1',
        name: 'Enterprise Architecture Modernization',
        description: 'Engineered high-concurrency microservices reducing latency by 45% with automated CI/CD.',
        tech: ['TypeScript', 'React', 'Node.js', 'Docker'],
        link: `https://github.com/${githubUsername}`
      },
      {
        id: '2',
        name: 'Developer Tooling & Cloud Platforms',
        description: 'Built interactive tools and performance diagnosis systems serving thousands of engineers.',
        tech: ['React', 'Tailwind CSS', 'Vite', 'PostgreSQL'],
        link: `https://github.com/${githubUsername}`
      }
    ],
    contentOrArticles: [
      {
        id: '1',
        title: 'Building Resilient Web Architectures',
        description: 'Practical guides and engineering patterns for high-throughput applications.',
        link: 'https://codeexecute.com',
      }
    ],
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
}
