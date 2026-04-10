const crypto = require('crypto');
const { githubSecret } = require('../config');

function verifySignature(rawBody, signatureHeader) {
  const signature = crypto
    .createHmac('sha256', githubSecret)
    .update(rawBody)
    .digest('hex');

  const expected = `sha256=${signature}`;

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}

module.exports = { verifySignature };