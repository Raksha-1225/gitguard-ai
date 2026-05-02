const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const { analyzeCode } = require('../services/aiAnalyzer');
const { fetchPRDiff, postPRComment } = require('../services/githubService');
const { saveReview, getRepoSettings } = require('../services/database');

function validateWebhookSignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('📬 Webhook received!');

  const signature = req.headers['x-hub-signature-256'];
  if (!signature || !validateWebhookSignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = JSON.parse(req.body.toString());
  const event = req.headers['x-github-event'];

  if (event !== 'pull_request') {
    return res.status(200).json({ message: 'Event ignored' });
  }

  const action = payload.action;
  if (action !== 'opened' && action !== 'synchronize') {
    return res.status(200).json({ message: 'Action ignored' });
  }

  const pr = payload.pull_request;
  const repo = payload.repository;
  const repoFullName = repo.full_name;

  console.log(`🔍 Processing PR #${pr.number}: "${pr.title}" in ${repoFullName}`);

  res.status(200).json({ message: 'Webhook received, processing...' });

  try {
    const settings = getRepoSettings(repoFullName);
    if (settings && settings.enabled === 0) return;

    const diff = await fetchPRDiff(repoFullName, pr.number);
    if (!diff || diff.trim() === '') return;

    const strictMode = settings?.strict_mode === 1;
    const ignoreStyling = settings?.ignore_styling === 1;

    const aiReview = await analyzeCode(diff, { strictMode, ignoreStyling });

    await postPRComment(repoFullName, pr.number, aiReview);

    saveReview({
      repo_name: repoFullName,
      pr_number: pr.number,
      pr_title: pr.title,
      pr_author: pr.user.login,
      pr_url: pr.html_url,
      ai_review: aiReview
    });

    console.log(`✅ Review complete for PR #${pr.number}!`);

  } catch (error) {
    console.error('❌ Error processing PR:', error.message);
  }
});

module.exports = router;