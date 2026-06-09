const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Badge = require('../models/Badge'); // Required so Mongoose registers the Badge model for populate()

// GET /api/users/dashboard
// Get user dashboard data (stats, progress, etc.)
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('badges').select('-passwordHash');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Dashboard Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/users/leaderboard
// Get top users by XP
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const topUsers = await User.find({ role: 'user' })
      .sort({ xp: -1 })
      .select('name xp level badges');
      
    res.json(topUsers);
  } catch (err) {
    console.error('Leaderboard Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
