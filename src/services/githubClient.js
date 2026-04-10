const { Octokit } = require('@octokit/rest');
const { githubToken } = require('../config');

const octokit = new Octokit({ auth: githubToken });

async function getPRDiff(owner, repo, pullNumber) {
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
  });

  const diffText = files
    .filter(f => f.patch)
    .map(f => [
      `### File: ${f.filename}`,
      `Status: ${f.status}`,
      f.patch
    ].join('\n'))
    .join('\n\n---\n\n');

  return diffText;
}

async function postReviewComment(owner, repo, pullNumber, body) {
  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: pullNumber,
    body,
    event: 'COMMENT',
  });
}

module.exports = { getPRDiff, postReviewComment };