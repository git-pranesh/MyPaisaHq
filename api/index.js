const express = require('express');

const app = express();

app.use(express.json());

// Submit to IndexNow
app.post('/api/submit-indexnow', async (req, res) => {
  try {
    const { submitToIndexNow } = require('../server/indexnow');
    const result = await submitToIndexNow();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

module.exports = app;
