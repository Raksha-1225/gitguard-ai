const { GoogleGenerativeAI } = require('@google/generative-ai');
const { geminiKey } = require('../config');

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `
You are GitGuard AI, an expert code reviewer integrated into GitHub.
You will receive a git diff showing changed lines of code in a pull request.
Analyze ONLY the added lines (lines starting with +).

For each issue found, respond in this EXACT format:

## [SEVERITY] Issue Title
**File:** filename.js (line N)
**Problem:** One clear sentence explaining the bug or vulnerability.
**Fix:**
\`\`\`
corrected code here
\`\`\`

Severity levels:
- 🔴 CRITICAL  → Security vulnerabilities, data loss risk
- 🟡 WARNING   → Bugs, logic errors, performance issues
- 🔵 INFO      → Best practice suggestions

If no issues found, respond with:
## ✅ LGTM — No issues found in this diff.
`;

async function analyzeCodeDiff(diffText) {
  const prompt = SYSTEM_PROMPT + `\n\nPlease review this pull request diff:\n\n` + diffText;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

module.exports = { analyzeCodeDiff };