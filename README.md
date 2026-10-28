# GitArchitect AI - Local Installation Guide

**GitArchitect AI** transforms developer resumes (PDF, DOCX, TXT, or JSON) into high-impact, customizable GitHub Profile README markdown files with drag-and-drop sections, tech badge pickers, live metrics, and instant GitHub deployment instructions.

---

## 🛠️ Prerequisites

Before installing locally, make sure you have:

1. **Node.js**: Version **18.x** or higher (Node 20+ LTS recommended).
   - Check version: `node -v`
2. **npm**: Version **9.x** or higher (bundled with Node.js) or `pnpm` / `yarn`.
   - Check version: `npm -v`
3. **Google Gemini API Key**:
   - Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🚀 Quick Start (Local Setup)

### 1. Clone or Download the Project
```bash
git clone https://github.com/your-username/gitarchitect.git
cd gitarchitect
```
*(Or navigate to your extracted project directory)*

---

### 2. Install Dependencies
```bash
npm install
```
*(If your local npm version has strict peer-dependency checks on older cached lockfiles, you can also use `npm install --legacy-peer-deps`)*

---

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` in your text editor and add your Gemini API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

> **Note:** If you don't provide a Gemini API key immediately, GitArchitect includes built-in fallback heuristic parsing, but the Gemini API powers intelligent profile summary generation, tech categorization, and project impact bullet points.

---

### 4. Start the Development Server
```bash
npm run dev
```

The application will start with full Express backend and Vite frontend integration:
```
Server running at http://localhost:3000
```
Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Production Build & Run

To test or deploy the production build locally:

```bash
# 1. Build the frontend client bundle
npm run build

# 2. Start the production server
npm start
```
The server serves optimized static production assets from `/dist` while maintaining all backend API endpoints at `/api/*`.

---

## ⚙️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the full-stack server (Express + Vite middlewares) with hot reloading |
| `npm run build` | Compiles client assets into the production-ready `dist/` directory |
| `npm run start` | Runs the production Node/Express server serving the compiled app |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans up previous build artifacts (`dist`) |

---

## 🔍 Troubleshooting

- **Port in use (`EADDRINUSE: 3000`)**:
  Start on a custom port using the `--port` flag or `PORT` environment variable:
  ```bash
  npm run dev -- --port 3001
  # or
  PORT=3001 npm run dev
  ```
- **Node version mismatch**:
  Ensure you are using Node 18 or 20 (`node -v`). If using NVM, run:
  ```bash
  nvm install 20
  nvm use 20
  ```
- **Gemini API Key Rate Limits**:
  GitArchitect includes an automatic retry handler with exponential backoff on `/api/parse-resume`. Ensure your key is valid and has Gemini 2.5 Flash / Flash Lite quotas enabled.

---

## 🌐 Brand & Platform Integration
GitArchitect is part of the **[CodeExecute](https://codeexecute.com)** developer ecosystem.
- Platform: [https://codeexecute.com](https://codeexecute.com)
- Live Tool: [https://codeexecute.com/ai-tools/gitarchitect](https://codeexecute.com/ai-tools/gitarchitect)
