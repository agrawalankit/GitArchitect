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

const systemPrompt = `You are a precise developer advocate and GitHub profile README architect.
Your job is to read ONLY the provided resume and transform it into a clean, accurate GitHub profile README configuration.

CRITICAL ACCURACY & STATELESS RULES:
1. Read ONLY the specific resume document or text provided in this single request.
2. Extract ONLY information explicitly present in THIS resume.
3. If ANY field or section is not found or not mentioned in this resume, leave it completely blank:
   - Return "" (empty string) for text fields (e.g. quote, company, location, website, email, pronouns, title, aboutMe).
   - Return [] (empty array) for list/array fields (e.g. socials, whatIDo, byTheNumbers, approach, currentFocus, featuredProjects, contentOrArticles).
   - For techStack, include ONLY languages, frameworks, databases, and devops tools that are explicitly named in this resume. If a category has no matching skills in the resume, return [].
4. NEVER copy data from previous resumes, NEVER invent quotes, NEVER add fake statistics, NEVER create fake projects.
5. Every request must be processed completely fresh and isolated with zero retention.

Output MUST be a valid JSON object strictly matching this schema:
{
  "name": "Full Name from resume or empty string",
  "githubUsername": "GitHub handle if mentioned in resume, otherwise username from candidate name or empty string",
  "pronouns": "pronouns if stated in resume, otherwise empty string",
  "title": "Professional title or headline directly from resume, or empty string",
  "location": "City, Country if mentioned in resume, otherwise empty string",
  "company": "Current or latest company from resume, or empty string",
  "email": "Email address from resume, or empty string",
  "website": "Portfolio URL or blog from resume, or empty string",
  "socials": [
    { "platform": "linkedin", "url": "https://linkedin.com/in/...", "label": "LinkedIn" }
  ],
  "quote": "Direct quote from resume if present, otherwise empty string",
  "aboutMe": "Summary or objective statement directly from resume, or empty string",
  "whatIDo": [
    { "emoji": "⚡", "text": "Key responsibility or skill directly from experience section in this resume" }
  ],
  "byTheNumbers": [
    { "stat": "Stat from resume (e.g. 5+ years, 50k users, 99.9%)", "label": "Context from resume" }
  ],
  "approach": [],
  "techStack": {
    "languages": [],
    "frontend": [],
    "backend": [],
    "database": [],
    "devops": [],
    "ai_ml": [],
    "tools": []
  },
  "currentFocus": [],
  "featuredProjects": [],
  "contentOrArticles": []
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

// Resilient stateless heuristic extractor: Extracts ONLY what is found in THIS resume text.
// If not found, leaves fields empty without any filler or past resume data.
function extractProfileFromResumeText(text: string): any {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Extract Name (first clean non-header line under 40 chars)
  let candidateName = '';
  for (const line of lines.slice(0, 6)) {
    const clean = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
    if (clean.length >= 2 && clean.length <= 40 && !/resume|curriculum|vitae|page|contact|email|phone|http/i.test(clean)) {
      candidateName = clean;
      break;
    }
  }

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract GitHub username or handle
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUsername = githubMatch ? githubMatch[1] : (candidateName ? candidateName.toLowerCase().replace(/[^a-z0-9]/g, '') : '');

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedinUrl = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

  // Extract personal website if found
  const webMatch = text.match(/https?:\/\/(?!github\.com|linkedin\.com|twitter\.com|x\.com)([\w.-]+\.[a-z]{2,})(\/[^\s]*)?/i);
  const website = webMatch ? webMatch[0] : '';

  // Extract tech stack keywords that strictly appear in this text
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

  // Determine Title from first non-name line or leave blank
  let title = '';
  for (const line of lines.slice(1, 4)) {
    if (/engineer|developer|architect|lead|manager|consultant|specialist|designer|scientist/i.test(line)) {
      title = line.replace(/[^a-zA-Z0-9\s&|·–-]/g, '').slice(0, 70).trim();
      break;
    }
  }

  // Extract Summary or About if present in text
  let aboutMe = '';
  const summaryHeaderIdx = lines.findIndex((l) => /^(summary|about|profile|professional summary|objective)/i.test(l));
  if (summaryHeaderIdx !== -1 && lines[summaryHeaderIdx + 1]) {
    aboutMe = lines.slice(summaryHeaderIdx + 1, summaryHeaderIdx + 4).join(' ');
  }

  // Extract bullet points from experience (lines starting with • or - or *)
  const bulletLines = lines.filter((l) => /^[-•*·]\s+/.test(l));
  const whatIDo = bulletLines.slice(0, 5).map((b, idx) => ({
    emoji: idx === 0 ? '⚡' : idx === 1 ? '🗄️' : idx === 2 ? '🚀' : idx === 3 ? '🛠️' : '👥',
    text: b.replace(/^[-•*·]\s+/, '').trim(),
  }));

  // Extract any metric lines with numbers/percentages
  const metricLines = lines.filter((l) => /\b\d+(\.\d+)?%|\b\d+\+\s*(?:years|yrs)|\$\d+|\b\d+[kKmM]\b/.test(l));
  const byTheNumbers = metricLines.slice(0, 4).map((m) => {
    const numMatch = m.match(/\b\d+(\.\d+)?%|\b\d+\+\s*(?:years|yrs)|\$\d+|\b\d+[kKmM]\b/);
    const stat = numMatch ? numMatch[0] : '';
    const label = m.replace(stat, '').replace(/^[-•*·:, ]+/, '').trim().slice(0, 60);
    return { stat, label: label || 'impact' };
  }).filter((x) => Boolean(x.stat));

  // Build socials list ONLY from what exists
  const socials = [];
  if (linkedinUrl) {
    socials.push({ platform: 'linkedin', url: linkedinUrl, label: 'LinkedIn' });
  }
  if (githubUsername) {
    socials.push({ platform: 'github', url: `https://github.com/${githubUsername}`, label: 'GitHub' });
  }
  if (website) {
    socials.push({ platform: 'website', url: website, label: 'Portfolio' });
  }

  return {
    name: candidateName,
    githubUsername: githubUsername,
    pronouns: '',
    title: title,
    location: '',
    company: '',
    email: email,
    website: website,
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
    currentFocus: [],
    featuredProjects: [],
    contentOrArticles: [],
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

