import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Github,
  BookOpen,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubUsername: string;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({
  isOpen,
  onClose,
  githubUsername,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'snakeAction'>('walkthrough');

  if (!isOpen) return null;

  const validUsername = githubUsername.trim() || 'your-username';
  const newRepoUrl = `https://github.com/new?name=${encodeURIComponent(
    validUsername
  )}&description=My+GitHub+Profile+README&public=true`;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const triggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const snakeWorkflowYaml = `name: Generate Snake Animation

on:
  schedule: # Run automatically every 24 hours
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: Platane/snk@v3
        with:
          github_user_name: ${validUsername}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark
      - uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'rgba(99, 198, 174, 0.12)',
              borderColor: 'rgba(99, 198, 174, 0.3)',
              borderWidth: '1px',
              color: '#63c6ae',
            }}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">How to Publish to Your GitHub Profile</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              5-minute step-by-step guide to activate your special profile README on GitHub.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('walkthrough')}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={{
              backgroundColor: activeTab === 'walkthrough' ? 'rgba(99, 198, 174, 0.15)' : 'transparent',
              borderColor: activeTab === 'walkthrough' ? 'rgba(99, 198, 174, 0.4)' : 'transparent',
              color: activeTab === 'walkthrough' ? '#63c6ae' : '#94a3b8',
              borderWidth: '1px',
            }}
          >
            Step-by-Step Walkthrough
          </button>
          <button
            onClick={() => setActiveTab('snakeAction')}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={{
              backgroundColor: activeTab === 'snakeAction' ? 'rgba(99, 198, 174, 0.15)' : 'transparent',
              borderColor: activeTab === 'snakeAction' ? 'rgba(99, 198, 174, 0.4)' : 'transparent',
              color: activeTab === 'snakeAction' ? '#63c6ae' : '#94a3b8',
              borderWidth: '1px',
            }}
          >
            Contribution Snake Automation (Optional)
          </button>
        </div>

        {activeTab === 'walkthrough' ? (
          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span
                className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 font-mono"
                style={{
                  backgroundColor: 'rgba(99, 198, 174, 0.15)',
                  color: '#63c6ae',
                  borderColor: 'rgba(99, 198, 174, 0.3)',
                  borderWidth: '1px',
                }}
              >
                1
              </span>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-white font-display">
                  Create a Special Repository Matching Your Username
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  On GitHub, your profile README lives in a special repository whose name is{' '}
                  <strong style={{ color: '#63c6ae' }}>exactly identical to your username</strong>.
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-sm font-mono text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span>
                    Repository Name:{' '}
                    <strong style={{ color: '#63c6ae' }}>{validUsername}</strong>
                  </span>
                  <a
                    href={newRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-slate-950 font-bold text-xs transition-colors shrink-0"
                    style={{ backgroundColor: '#63c6ae' }}
                  >
                    <span>Create Repo on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span
                className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 font-mono"
                style={{
                  backgroundColor: 'rgba(99, 198, 174, 0.15)',
                  color: '#63c6ae',
                  borderColor: 'rgba(99, 198, 174, 0.3)',
                  borderWidth: '1px',
                }}
              >
                2
              </span>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-white font-display">Ensure it is Public &amp; Initialized</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Make sure you select <strong className="text-white">Public</strong> (GitHub won&apos;t display private profile readmes).
                  Check the box that says <strong className="text-white">&quot;Add a README file&quot;</strong>.
                </p>
                <div
                  className="p-3 rounded-lg text-sm flex items-center gap-2.5"
                  style={{
                    backgroundColor: 'rgba(99, 198, 174, 0.08)',
                    borderColor: 'rgba(99, 198, 174, 0.25)',
                    borderWidth: '1px',
                    color: '#63c6ae',
                  }}
                >
                  <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: '#63c6ae' }} />
                  <span>
                    GitHub will show a secret callout: <em>&quot;✨ You found a secret! {validUsername}/{validUsername} is a special repository...&quot;</em>
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span
                className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 font-mono"
                style={{
                  backgroundColor: 'rgba(99, 198, 174, 0.15)',
                  color: '#63c6ae',
                  borderColor: 'rgba(99, 198, 174, 0.3)',
                  borderWidth: '1px',
                }}
              >
                3
              </span>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-white font-display">Paste or Upload the README.md</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  You have two easy choices:
                </p>
                <ul className="text-sm text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>
                    <strong className="text-white">Option A (Fastest)</strong>: Click &quot;Copy Markdown&quot; in GitArchitect, open <code className="font-mono font-semibold" style={{ color: '#63c6ae' }}>README.md</code> in your repo, click the pencil edit button, and paste everything.
                  </li>
                  <li>
                    <strong className="text-white">Option B</strong>: Click &quot;Download README.md&quot; in GitArchitect, then in your repository click <code className="text-slate-200">Add file &gt; Upload files</code> and drag the downloaded file in.
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span
                className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 font-mono"
                style={{
                  backgroundColor: 'rgba(99, 198, 174, 0.15)',
                  color: '#63c6ae',
                  borderColor: 'rgba(99, 198, 174, 0.3)',
                  borderWidth: '1px',
                }}
              >
                4
              </span>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-white font-display">Commit Changes</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Click the green <strong style={{ color: '#63c6ae' }}>&quot;Commit changes...&quot;</strong> button at the bottom of the page on GitHub. Commit directly to the <code className="font-mono text-white">main</code> branch.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div
              className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl border"
              style={{
                backgroundColor: 'rgba(99, 198, 174, 0.08)',
                borderColor: 'rgba(99, 198, 174, 0.3)',
              }}
            >
              <span
                className="w-8 h-8 rounded-full text-slate-950 text-sm font-bold flex items-center justify-center shrink-0 font-mono"
                style={{ backgroundColor: '#63c6ae' }}
              >
                5
              </span>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold font-display" style={{ color: '#63c6ae' }}>
                  Celebrate! Your Profile is Live
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Visit your personal profile URL to see your beautiful new badges, metrics, and architecture layout:
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={`https://github.com/${validUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerCelebrate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-950 font-bold text-sm transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: '#63c6ae' }}
                  >
                    <span>View https://github.com/{validUsername}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={triggerCelebrate}
                    className="text-sm text-slate-300 hover:text-white transition-colors px-2 py-1"
                  >
                    🎉 Test Confetti
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white font-display">
                Automated Snake Contribution Action
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To have GitHub automatically generate the animated contribution snake SVG daily:
              </p>
              <ol className="text-sm text-slate-300 space-y-1.5 list-decimal list-inside">
                <li>In your <code className="font-mono font-semibold" style={{ color: '#63c6ae' }}>{validUsername}</code> repository, create a file named <code className="text-white">.github/workflows/snake.yml</code>.</li>
                <li>Paste the YAML below and commit to <code className="text-white">main</code>.</li>
                <li>Go to Settings &gt; Actions &gt; General &gt; Workflow permissions and enable <strong>&quot;Read and write permissions&quot;</strong>.</li>
              </ol>
            </div>

            <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800">
              <button
                onClick={() => copyText(snakeWorkflowYaml, 'snake')}
                className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
              >
                {copiedCode === 'snake' ? (
                  <>
                    <Check className="w-3.5 h-3.5" style={{ color: '#63c6ae' }} />
                    <span style={{ color: '#63c6ae' }}>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy YAML</span>
                  </>
                )}
              </button>
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto pr-24 leading-relaxed p-2">
                {snakeWorkflowYaml}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
