const express = require('express');
const router = express.Router();
const { verifySignature } = require('../utils/verifySignature');
//const { analyzePR } = require('../services/analyzer');

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {

  const rawBody = req.body.toString();
  const sig = req.headers['x-hub-signature-256'];

  if (!sig || !verifySignature(rawBody, sig)) {
    console.warn('❌ Invalid signature — rejecting');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const event = req.headers['x-github-event'];
  const payload = JSON.parse(rawBody);

  if (event === 'pull_request' && payload.action === 'opened') {
    console.log(`✅ PR #${payload.pull_request.number} opened`);

    res.status(202).json({ message: 'Accepted' });

   // analyzePR(payload).catch(err => console.error('Analysis error:', err));

  } else {
    res.status(200).json({ message: 'Event ignored' });
  }
});

module.exports = router;