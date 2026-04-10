const express = require('express');
const { port } = require('./config');
const webhookRouter = require('./routes/webhook');

const app = express();

app.use('/webhook', webhookRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🛡️  GitGuard AI running on port ${port}`);
});