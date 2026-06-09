const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const auth = require('../middleware/auth'); // If we want only logged in users to fetch

// @route   GET api/challenges
// @desc    Get all active challenges
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Only return published challenges for regular users
    const challenges = await Challenge.find({ isPublished: { $ne: false } }).sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/challenges/:id
// @desc    Get challenge by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Challenge not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
