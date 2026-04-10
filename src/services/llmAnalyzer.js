const Anthropic = require('@anthropic-ai/sdk');
const { anthropicKey } = require('../config');

const client = new Anthropic({ apiKey: anthropicKey });

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
  const message = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system:     SYSTEM_PROMPT,
    messages: [
      {
        role:    'user',
        content: `Please review this pull request diff:\n\n${diffText}`,
      }
    ],
  });

  return message.content[0].text;
}

module.exports = { analyzeCodeDiff };