const { getPRDiff, postReviewComment } = require('./githubClient');
const { analyzeCodeDiff } = require('./llmAnalyzer');

async function analyzePR(payload) {
  const owner     = payload.repository.owner.login;
  const repo      = payload.repository.name;
  const prNumber  = payload.pull_request.number;

  console.log(`[Analyzer] Starting PR #${prNumber} in ${owner}/${repo}`);

  const diff = await getPRDiff(owner, repo, prNumber);

  if (!diff || diff.trim() === '') {
    console.log('[Analyzer] No reviewable diff found, skipping.');
    return;
  }

  console.log('[Analyzer] Diff fetched. Sending to Claude...');

  const review = await analyzeCodeDiff(diff);

  const comment = [
    '## 🛡️ GitGuard AI Review',
    '',
    review,
    '',
    '---',
    `*Automated review by GitGuard AI · PR #${prNumber}*`,
  ].join('\n');

  await postReviewComment(owner, repo, prNumber, comment);

  console.log(`[Analyzer] ✅ Review posted to PR #${prNumber}`);
}

module.exports = { analyzePR };