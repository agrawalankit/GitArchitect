import React, { useState } from 'react';
import {
  HelpCircle,
  Code2,
  GitBranch,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Sparkles,
  FileText,
  Star,
  Users,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What is a GitHub Profile README?',
    answer:
      'A GitHub Profile README is a special Markdown file rendered prominently at the top of your public GitHub profile page (github.com/your-username). It serves as your developer landing page and visual portfolio. You activate it by creating a public repository whose name matches your GitHub username exactly (e.g., username/username).',
  },
  {
    question: 'Why are public GitHub repositories and a profile README necessary for developers?',
    answer:
      "Modern technical hiring and open-source collaboration rely heavily on proof-of-work. A resume claims you know a technology; your GitHub profile proves it. Recruiters, engineering managers, and clients inspect your profile to evaluate code quality, system design principles, commit frequency, and communication skills before scheduling an interview.",
  },
  {
    question: 'How does GitArchitect convert my resume into a GitHub profile README?',
    answer:
      'GitArchitect uses Google Gemini AI on the server to analyze your resume text or document (PDF, TXT, DOCX). It extracts your core tech stack, quantifiable achievements, engineering pillars, and projects into structured, customizable Markdown sections with verified Shields.io badges and dynamic GitHub stats widgets.',
  },
  {
    question: 'How do I upload the generated README.md to my GitHub profile?',
    answer:
      'Step 1: Go to github.com/new and create a repository whose name is exactly identical to your GitHub username.\nStep 2: Make sure it is set to Public and check "Add a README file".\nStep 3: Click the pencil edit button or upload your downloaded README.md file from GitArchitect.\nStep 4: Commit your changes to the main branch.',
  },
  {
    question: 'Are the GitHub stats, languages, and streak widgets updated automatically?',
    answer:
      'Yes. The analytics widgets embedded in your README query GitHub public APIs dynamically in real time whenever someone visits your profile. They automatically reflect your ongoing commits, pull requests, stars, and language distributions.',
  },
  {
    question: 'Is GitArchitect free and is my resume data private?',
    answer:
      'GitArchitect is 100% free by CodeExecute. We do not require account registration or credit cards. Uploaded resumes are processed in memory solely to extract profile sections and are never stored, sold, or shared with third parties.',
  },
];

export const SeoContentSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <article aria-labelledby="about-gitarchitect-heading" className="mt-16 pt-12 border-t border-slate-800/80 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
        <a
          href="https://codeexecute.com/"
          className="hover:text-[#63c6ae] transition-colors"
        >
          CodeExecute
        </a>
        <span aria-hidden="true" className="text-slate-600">/</span>
        <a
          href="https://codeexecute.com/ai-tools"
          className="hover:text-[#63c6ae] transition-colors"
        >
          AI Tools
        </a>
        <span aria-hidden="true" className="text-slate-600">/</span>
        <span className="text-slate-200 font-medium" aria-current="page">
          GitArchitect
        </span>
      </nav>

      {/* Section 1: What is GitArchitect */}
      <section className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63c6ae]/10 border border-[#63c6ae]/20 text-[#63c6ae] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About This Tool</span>
        </div>
        <h2 id="about-gitarchitect-heading" className="text-2xl font-bold tracking-tight text-white">
          What is GitArchitect?
        </h2>
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            <strong>GitArchitect</strong> is a free, AI-powered GitHub Profile README generator and visual layout builder developed by <strong>CodeExecute</strong>. It bridges the gap between traditional resumes and modern developer portfolio pages by turning your raw CV, project history, and technical competencies into an elite, modular GitHub Flavored Markdown (GFM) document.
          </p>
          <p>
            Instead of manually hunting down badge URLs, configuring SVG stats widgets, or struggling with markdown formatting, GitArchitect lets you upload your resume (PDF, Word, TXT) and instantly outputs a customized profile complete with official Shields.io badges, dynamic GitHub stats cards, quantifiable impact metrics, and your engineering philosophy.
          </p>
        </div>
      </section>

      {/* Section 2: Why GitHub Repositories & Profiles are Crucial for Developers */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Career & Open Source Impact</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Why GitHub Repositories & Profile READMEs are Essential for Developers
        </h2>
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            In today&apos;s competitive software engineering market, traditional paper resumes are rarely enough to stand out. Technical recruiters, engineering managers, and open-source teams routinely check your GitHub profile before making an interview decision. Here is why an optimized GitHub presence is mandatory:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#63c6ae]/20 text-[#63c6ae] text-xs flex items-center justify-center font-mono">
                01
              </span>
              Proof of Work Over Buzzwords
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anyone can write &quot;experienced in microservices and distributed databases&quot; on a PDF resume. A public GitHub repository with clean commits, structured tests, and clear README documentation gives undeniable tangible proof of your technical rigor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">
                02
              </span>
              First 10-Second Impression
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your profile README is the hero section of your developer identity. When recruiters land on your GitHub page, they instantly see your core stack, architecture philosophy, and highest-impact metrics before scrolling down.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">
                03
              </span>
              Validating Engineering Consistency
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live GitHub stats and contribution heatmaps demonstrate continuous learning, active problem solving, and familiarity with Git collaboration workflows like pull requests, branching, and issue triage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">
                04
              </span>
              Inbound Opportunities & Social Connect
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clear social badges for LinkedIn, X, email, and personal blogs make it effortless for engineering leaders, clients, and collaborators to reach out for high-paying roles or contracting projects.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: How to Use This Tool */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Workflow Guide</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          How to Use GitArchitect in 4 Simple Steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#63c6ae]/10 text-[#63c6ae] font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="text-xs font-bold text-white">Upload Your Resume</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Drop your PDF, TXT, or DOCX resume, or paste raw text. Gemini AI extracts your technologies, metrics, and experience automatically.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="text-xs font-bold text-white">Customize Layout</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use our drag-and-drop layout architect to reorder blocks, toggle visibility, and adjust badge styling (e.g., bold for-the-badge vs flat).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="text-xs font-bold text-white">Preview & Download</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verify your profile in the live GitHub Dark and Light simulator, then click &quot;Download README.md&quot; or copy the markdown.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-sm flex items-center justify-center">
              4
            </div>
            <h3 className="text-xs font-bold text-white">Publish to GitHub</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Create a public repo named exactly like your username (username/username), commit the README.md, and see your live profile.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Frequently Asked Questions (FAQ) */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63c6ae]/10 border border-[#63c6ae]/20 text-[#63c6ae] text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Common Questions</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Frequently Asked Questions (FAQ)
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-white hover:text-[#63c6ae] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-[#63c6ae]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5: Internal Links & CodeExecute Resources */}
      <section className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 max-w-4xl">
        <h2 className="text-base font-bold text-white">
          Explore More Developer Tools & Tutorials by CodeExecute
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          CodeExecute provides practical engineering resources, real-world bug fixes, and free developer tools to help engineers write cleaner, more resilient software.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="https://codeexecute.com/ai-tools"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
          >
            <span>All CodeExecute AI Tools</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#63c6ae]" />
          </a>
          <a
            href="https://codeexecute.com/"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
          >
            <span>CodeExecute Home</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </a>
          <a
            href="https://codeexecute.com/blog/"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
          >
            <span>Engineering Tutorials & Guides</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>
      </section>
    </article>
  );
};
