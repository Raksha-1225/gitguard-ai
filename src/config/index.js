require('dotenv').config();

module.exports = {
  port:         process.env.PORT || 3000,
  githubSecret: process.env.GITHUB_WEBHOOK_SECRET,
  githubToken:  process.env.GITHUB_TOKEN,
  geminiKey:    process.env.GEMINI_API_KEY,
};