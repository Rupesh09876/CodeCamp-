const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// POST /api/ai/query
// Requires authentication (rate limiting is handled in the controller)
router.post('/query', auth, aiController.askAI);

// GET /api/ai/usage
// Get current AI queries usage
router.get('/usage', auth, aiController.getUsage);

module.exports = router;
