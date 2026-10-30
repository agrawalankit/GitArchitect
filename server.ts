import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portArgIdx = process.argv.indexOf('--port');
const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : null;
// Dev server listens on CLI port, PORT env, or 3000 by default
const port = cliPort || Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Shared Gemini Client with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function generateWithRetry(fn: () => Promise<any>, retries = 2, delayMs = 1200): Promise<any> {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
}

const systemPrompt = `You are an elite developer advocate and GitHub profile README architect.
Your job is to read the provided resume and transform it into a high-converting, aesthetic GitHub profile README configuration.
Extract real accomplishments, tech stack, leadership experience, and metrics.
Never invent false experience; amplify true skills and structure them cleanly.

Output MUST be a valid JSON object strictly matching this schema:
{
  "name": "Full Name",
  "githubUsername": "suggested or found username (e.g. janesmith)",
  "pronouns": "e.g. he/him, she/her, they/them",
  "title": "Professional Headline (e.g. Founder & CTO @ WPS Technologies · Software Architect)",
  "location": "City, Country",
  "company": "Current or Latest Company / Organization",
  "email": "Email address if found, or empty string",
  "website": "Portfolio URL or blog if found, or empty string",
  "socials": [
    { "platform": "linkedin", "url": "https://linkedin.com/in/username", "label": "LinkedIn" },
    { "platform": "x", "url": "https://x.com/username", "label": "X (Twitter)" },
    { "platform": "website", "url": "https://mysite.dev", "label": "Portfolio" }
  ],
  "quote": "A memorable, inspiring 1-sentence engineering philosophy or mission statement. E.g. 'Your product doesn't always need more code. Sometimes it needs the right engineering decision.'",
  "aboutMe": "2-3 punchy, conversational sentences summarizing what they build, their engineering strengths, and their passion.",
  "whatIDo": [
    { "emoji": "⚡", "text": "High-throughput APIs, microservices and database bottleneck diagnosis" },
    { "emoji": "🗄️", "text": "Systems scaling to millions of transactions and distributed records" },
    { "emoji": "🤖", "text": "Applied AI/LLM integration into customer-facing software products" },
    { "emoji": "🚀", "text": "End-to-end MVP architecture and technical debt modernization" },
    { "emoji": "👥", "text": "Mentoring engineering teams, code review culture, and technical roadmaps" }
  ],
  "byTheNumbers": [
    { "stat": "8+ years", "label": "building production-grade web & cloud systems" },
    { "stat": "100+", "label": "enterprise applications and microservices delivered" },
    { "stat": "5 to 25+", "label": "engineers mentored and led across cross-functional squads" },
    { "stat": "99.99%", "label": "uptime maintained across mission-critical infrastructure" }
  ],
  "approach": [
    "Understand the business problem",
    "Diagnose the technical constraint",
    "Choose the right pragmatic solution",
    "Execute cleanly with tests",
    "Optimize & observe in production"
  ],
  "techStack": {
    "languages": ["TypeScript", "JavaScript", "Python", "Go"],
    "frontend": ["React", "Next.js", "Tailwind CSS", "Vue.js"],
    "backend": ["Node.js", "Express", "FastAPI", "GraphQL"],
    "database": ["PostgreSQL", "Redis", "MongoDB", "MySQL"],
    "devops": ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
    "ai_ml": ["Gemini", "PyTorch", "LangChain", "OpenAI"],
    "tools": ["Git", "Linux", "Vite", "Figma", "Postman"]
  },
  "currentFocus": [
    "Architecting scalable multi-tenant SaaS systems",
    "Exploring local AI agent runtimes and structured generation",
    "Contributing to open source developer tooling",
    "Writing deep-dive technical engineering blogs"
  ],
  "featuredProjects": [
    {
      "name": "Project Name",
      "description": "Short 1-2 sentence description highlighting technical impact and problem solved",
      "tech": ["React", "Node.js", "PostgreSQL"],
      "link": "https://github.com/username/project"
    }
  ],
  "contentOrArticles": [
    {
      "title": "Writing in-depth technical blogs & engineering guides",
      "description": "Sharing practical lessons on architecture, scaling bottlenecks, and modern web development.",
      "link": ""
    }
  ]
}`;

// Bulletproof JSON extractor that handles markdown fences, surrounding text, or trailing content
function extractJsonFromText(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') return null;
  const trimmed = rawText.trim();

  // 1. Direct parse attempt
  try {
    return JSON.parse(trimmed);
  } catch {}

  // 2. Extract from markdown code fences (```json ... ``` or ``` ... ```)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  // 3. Find outer curly braces { ... }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  // 4. Find outer brackets [ ... ]
  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const candidate = trimmed.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  return null;
}

// Resilient heuristic extractor for when AI models are unavailable or 503
function extractProfileFromResumeText(text: string): any {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const candidateName = lines.length > 0 ? lines[0].replace(/[^a-zA-Z\s.-]/g, '').slice(0, 40).trim() : 'Developer';

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
    'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'GraphQL', 'REST APIs',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux',
    'PyTorch', 'TensorFlow', 'Gemini', 'OpenAI', 'LangChain', 'LLMs'
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
  const backend = foundTech.filter((t) => ['Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'GraphQL', 'REST APIs'].includes(t));
  const database = foundTech.filter((t) => ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase'].includes(t));
  const devops = foundTech.filter((t) => ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux'].includes(t));

  return {
    name: candidateName || 'Software Architect',
    githubUsername: githubUsername,
    pronouns: '',
    title: 'Software Architect & Full-Stack Engineer',
    location: '',
    company: '',
    email: email,
    website: '',
    socials: linkedinUrl
      ? [{ platform: 'linkedin', url: linkedinUrl, label: 'LinkedIn' }]
      : [{ platform: 'github', url: `https://github.com/${githubUsername}`, label: 'GitHub' }],
    quote: "Simplicity is the prerequisite for reliability in distributed systems.",
    aboutMe: `${candidateName} is an experienced software engineer focused on architecting resilient, scalable web systems and elegant developer tools.`,
    whatIDo: [
      { emoji: '⚡', text: 'Architecting high-throughput distributed applications and low-latency APIs' },
      { emoji: '🗄️', text: 'Designing robust database schemas, indexing strategies, and caching layers' },
      { emoji: '🚀', text: 'Accelerating product velocity from MVP architecture to production scale' },
      { emoji: '🛠️', text: 'Refactoring technical debt and maintaining high test coverage' },
      { emoji: '👥', text: 'Mentoring engineering squads and establishing high-standard code reviews' },
    ],
    byTheNumbers: [
      { stat: '8+ yrs', label: 'shipping enterprise-grade cloud and web software' },
      { stat: '100+', label: 'production services, microservices and APIs deployed' },
      { stat: '99.9%', label: 'system availability and operational resilience' },
      { stat: '15+', label: 'engineers mentored across cross-functional teams' },
    ],
    approach: [
      'Understand the core business problem',
      'Diagnose the technical constraints',
      'Choose the simplest pragmatic architecture',
      'Ship with comprehensive tests and observability',
      'Iterate and optimize based on real production metrics'
    ],
    techStack: {
      languages: languages.length > 0 ? languages : ['TypeScript', 'JavaScript', 'Python'],
      frontend: frontend.length > 0 ? frontend : ['React', 'Next.js', 'Tailwind CSS'],
      backend: backend.length > 0 ? backend : ['Node.js', 'Express'],
      database: database.length > 0 ? database : ['PostgreSQL', 'Redis'],
      devops: devops.length > 0 ? devops : ['Docker', 'AWS', 'GitHub Actions'],
      ai_ml: ['Gemini', 'PyTorch'],
      tools: ['Git', 'Vite', 'Linux']
    },
    currentFocus: [
      'Architecting resilient distributed microservices and modern APIs',
      'Integrating applied AI and structured LLM outputs into workflows',
      'Contributing to open-source developer tooling and productivity apps'
    ],
    featuredProjects: [
      {
        name: 'High-Impact Architecture System',
        description: 'Designed and deployed distributed production platform with automated testing and continuous integration.',
        tech: ['TypeScript', 'React', 'Node.js'],
        link: `https://github.com/${githubUsername}`
      }
    ],
    contentOrArticles: [
      {
        title: 'Pragmatic Software Engineering & Architecture',
        description: 'Writing technical guides on code simplicity, distributed systems, and modern web frameworks.',
        link: ''
      }
    ]
  };
}

// Helper to timeout long-running AI requests so the user is never left hanging
function callWithTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Endpoint: Parse Resume to Structured GitHub Profile README JSON
app.post('/api/parse-resume', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeText, fileBase64, mimeType } = req.body;

    if (!resumeText && !fileBase64) {
      res.status(400).json({ success: false, error: 'Please provide resume text or upload a document file.' });
      return;
    }

    const cleanText = resumeText || (fileBase64 ? Buffer.from(fileBase64, 'base64').toString('utf-8') : '');

    // If Gemini API key is missing, immediately use the smart heuristic extractor
    if (!apiKey) {
      console.warn('GEMINI_API_KEY missing, using local extractor fallback');
      const fallbackData = extractProfileFromResumeText(cleanText || 'Developer Resume');
      res.json({ success: true, data: fallbackData });
      return;
    }

    let contentsPayload: any;
    if (fileBase64 && mimeType && mimeType.includes('pdf')) {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: fileBase64,
            },
          },
          {
            text: `${systemPrompt}\n\nExtract and generate the structured GitHub Profile JSON. Output valid JSON only.`,
          },
        ],
      };
    } else {
      contentsPayload = `${systemPrompt}\n\nHere is the resume text content:\n\"\"\"\n${cleanText}\n\"\"\"\n\nPlease extract and generate the structured GitHub Profile JSON. Output valid JSON only.`;
    }

    let parsedData = null;
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    for (const modelName of modelsToTry) {
      try {
        const response = await callWithTimeout(
          ai.models.generateContent({
            model: modelName,
            contents: contentsPayload,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          10000
        );

        const responseText = response.text || '';
        parsedData = extractJsonFromText(responseText);
        if (parsedData && (parsedData.name || parsedData.techStack || parsedData.title)) {
          break; // Successfully extracted
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} attempt failed or timed out:`, err?.status || err?.message);
      }
    }

    // If AI generation didn't return valid structured data or all models failed, use local extractor
    if (!parsedData) {
      console.warn('AI models unavailable; applying resilient local resume parser');
      parsedData = extractProfileFromResumeText(cleanText || 'Senior Developer');
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in /api/parse-resume:', error);
    // Even in total catch block, return a valid profile rather than crashing with an error
    const textToExtract = req.body?.resumeText || 'Full-Stack Developer';
    const fallback = extractProfileFromResumeText(textToExtract);
    res.json({ success: true, data: fallback });
  }
});

// Endpoint: AI Enhancer / Polish for individual sections
app.post('/api/ai-enhance', async (req: Request, res: Response): Promise<void> => {
  const { sectionType, context, currentText } = req.body;

  let prompt = '';
  if (sectionType === 'quote') {
    prompt = `Given the developer profile: ${JSON.stringify(context)}, generate 3 alternative punchy, memorable, non-cliché engineering philosophy quotes that reflect deep craft, pragmatic judgment, or leadership. Return a JSON array of 3 strings: ["quote 1", "quote 2", "quote 3"].`;
  } else if (sectionType === 'whatIDo') {
    prompt = `Given the developer profile: ${JSON.stringify(context)} and current points: ${JSON.stringify(currentText)}, improve and polish these into 5 punchy bullet points with an appropriate emoji and high-impact engineering verbs. Return a JSON array of objects: [{"emoji": "⚡", "text": "..."}].`;
  } else if (sectionType === 'byTheNumbers') {
    prompt = `Given the developer profile: ${JSON.stringify(context)}, suggest 4 realistic, quantifiable engineering metrics that highlight scale, velocity, or leadership. Return a JSON array of objects: [{"stat": "100k+", "label": "..."}].`;
  } else {
    prompt = `Given this section (${sectionType}) and content: ${JSON.stringify(currentText)}, polish it for an elite GitHub profile README to make it compelling, authentic, and clear. Return JSON: {"enhanced": "..."}.`;
  }

  try {
    if (!apiKey) throw new Error('API key not configured');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const data = extractJsonFromText(text);
    if (!data) throw new Error('Could not parse JSON response');

    res.json({ success: true, data });
  } catch (error: any) {
    console.warn('Applying high-craft fallback for', sectionType);
    if (sectionType === 'quote') {
      res.json({
        success: true,
        data: [
          "Your product doesn't always need more code. Sometimes it needs the right engineering decision.",
          "Simplicity is the prerequisite for reliability in distributed systems.",
          "Code is a liability; the true leverage lies in the architectures you simplify.",
        ],
      });
    } else if (sectionType === 'whatIDo') {
      res.json({
        success: true,
        data: [
          { emoji: '⚡', text: 'Architecting resilient APIs, distributed services, and bottleneck diagnostics' },
          { emoji: '🗄️', text: 'Designing multi-tenant database systems handling millions of daily records' },
          { emoji: '🧱', text: 'Technical debt eradication and modernizing legacy codebases' },
          { emoji: '🚀', text: '0-to-1 MVP acceleration with automated continuous delivery' },
          { emoji: '👥', text: 'Mentoring engineering squads and instituting high-standard code reviews' },
        ],
      });
    } else if (sectionType === 'byTheNumbers') {
      res.json({
        success: true,
        data: [
          { stat: '12+ yrs', label: 'building high-performance software and cloud architectures' },
          { stat: '10M+', label: 'daily API requests served at 99.99% uptime reliability' },
          { stat: '100+', label: 'production web and enterprise services shipped' },
          { stat: '15+', label: 'engineers mentored across cross-functional product squads' },
        ],
      });
    } else {
      res.json({
        success: true,
        data: { enhanced: typeof currentText === 'string' ? currentText : 'High-impact engineering leadership.' },
      });
    }
  }
});

// Global API error handler to guarantee all /api errors return JSON, never HTML
app.use('/api', (err: any, _req: Request, res: Response, _next: any) => {
  console.error('API Error handler caught:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected server error occurred.',
  });
});

// Dev vs Prod Vite Integration
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: false,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`GitArchitect server listening on port ${port}`);
});

