🛡️ GitGuard AI

An automated Pull Request code reviewer powered by AI.
GitGuard listens for GitHub webhooks, analyzes code diffs, and posts detailed review comments directly on your PRs.


🚀 FEATURES

• Automatic PR review when a Pull Request is opened
• AI-powered bug and security vulnerability detection
• Suggests actual code fixes in the review comment
• Dashboard to view all past reviews
• Per-repository settings (Strict Mode, Ignore Styling)
• Completely free tier (Groq AI + SQLite)


🧰 TECH STACK

Backend            — Node.js, Express
AI                 — Groq (Llama 3.3 70B)
Database           — SQLite
Frontend           — React + Vite
GitHub Integration — Octokit
Tunnel             — ngrok


📁 PROJECT STRUCTURE

gitguard-ai/
├── src/
│   ├── routes/
│   │   ├── webhook.js
│   │   └── api.js
│   └── services/
│       ├── aiAnalyzer.js
│       ├── database.js
│       └── githubService.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx
│       │   ├── Reviews.jsx
│       │   └── Settings.jsx
│       └── App.jsx
├── .env
└── package.json


⚙️ SETUP

1. Clone the repository

2. Install dependencies
   npm install
   cd frontend && npm install

3. Create a .env file
   GROQ_API_KEY=your_groq_key
   GITHUB_TOKEN=your_github_token
   GITHUB_WEBHOOK_SECRET=your_secret
   PORT=3001

4. Start the backend
   npm run dev

5. Start the frontend
   cd frontend
   npm run dev

6. Start ngrok
   .\ngrok.exe http 3001

7. Add the ngrok URL as a webhook in your GitHub repository


🔄 HOW IT WORKS

1. A Pull Request is opened on GitHub
2. GitHub sends a webhook to GitGuard
3. GitGuard fetches the PR diff using Octokit
4. The diff is sent to Groq AI for analysis
5. The AI review is posted as a comment on the PR
6. The review is saved to the database and visible on the dashboard


📊 DASHBOARD

Visit: http://localhost:5173

Sections:
• Dashboard — Overview stats and latest review
• Reviews   — Full history of all AI reviews
• Settings  — Configure per-repository rules

 
Sri Raksha S 
