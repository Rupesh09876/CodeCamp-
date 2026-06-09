const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');

// GET /api/admin/stats
// Get overview stats for the dashboard
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const proUsers = await User.countDocuments({ role: 'user', plan: 'pro' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Real user growth data for the last 6 months
    const growthData = await User.aggregate([
      {
        $match: { role: 'user' }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Get last 6 months
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6Months.push({
        month: d.getMonth() + 1,
        name: monthNames[d.getMonth()],
        users: 0,
        revenue: 0
      });
    }

    growthData.forEach(item => {
      const monthObj = last6Months.find(m => m.month === item._id);
      if (monthObj) monthObj.users = item.count;
    });

    const formattedGrowth = last6Months.map(m => ({ name: m.name, users: m.users }));

    // Revenue growth data for the last 6 months
    const revenueGrowth = await Payment.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    revenueGrowth.forEach(item => {
      const monthObj = last6Months.find(m => m.month === item._id);
      if (monthObj) monthObj.revenue = item.total;
    });

    const formattedRevenueGrowth = last6Months.map(m => ({ name: m.name, revenue: m.revenue }));

    // Active challenges count
    const Challenge = require('../models/Challenge');
    const activeChallenges = await Challenge.countDocuments();

    const stats = {
      totalUsers,
      proUsers,
      revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      activeChallenges: activeChallenges,
      userGrowthData: formattedGrowth.length > 0 ? formattedGrowth : [{ name: monthNames[new Date().getMonth()], users: totalUsers }],
      revenueGrowthData: formattedRevenueGrowth.length > 0 ? formattedRevenueGrowth : [{ name: monthNames[new Date().getMonth()], revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0 }]
    };

    res.json(stats);
  } catch (err) {
    console.error('Admin Stats Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/users
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Admin Users Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/badges
router.get('/badges', auth, admin, async (req, res) => {
  try {
    const badges = await Badge.find().sort({ xpRequired: 1 });
    res.json(badges);
  } catch (err) {
    console.error('Admin Badges Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/admin/badges
router.post('/badges', auth, admin, async (req, res) => {
  try {
    const newBadge = new Badge(req.body);
    await newBadge.save();
    res.json(newBadge);
  } catch (err) {
    console.error('Create Badge Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/admin/badges/:id
router.delete('/badges/:id', auth, admin, async (req, res) => {
  try {
    await Badge.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Badge deleted' });
  } catch (err) {
    console.error('Delete Badge Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/transactions
router.get('/transactions', auth, admin, async (req, res) => {
  try {
    const transactions = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(transactions);
  } catch (err) {
    console.error('Admin Transactions Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/courses
router.get('/courses', auth, admin, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error('Admin Courses Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/admin/courses
router.post('/courses', auth, admin, async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();

    // Notify ALL users about the new course
    const allUsers = await User.find({ role: 'user' });
    const notifications = allUsers.map(u => ({
      user: u._id,
      title: 'New Course Available! 📚',
      message: `A new course "${newCourse.title}" has been added. Start learning now!`,
      type: 'info'
    }));
    await Notification.insertMany(notifications);

    res.json(newCourse);
  } catch (err) {
    console.error('Create Course Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/admin/courses/:id
router.put('/courses/:id', auth, admin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    console.error('Update Course Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/admin/courses/:id
router.delete('/courses/:id', auth, admin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    console.error('Delete Course Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/challenges
router.get('/challenges', auth, admin, async (req, res) => {
  try {
    const Challenge = require('../models/Challenge');
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    console.error('Admin Challenges Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/admin/challenges
router.post('/challenges', auth, admin, async (req, res) => {
  try {
    const Challenge = require('../models/Challenge');
    const newChallenge = new Challenge(req.body);
    await newChallenge.save();

    // Notify ALL users about the new challenge
    const allUsers = await User.find({ role: 'user' });
    const notifications = allUsers.map(u => ({
      user: u._id,
      title: 'New Challenge Alert! ⚡',
      message: `Challenge yourself with "${newChallenge.title}". Earn ${newChallenge.xpReward} XP!`,
      type: 'info'
    }));
    await Notification.insertMany(notifications);

    res.json(newChallenge);
  } catch (err) {
    console.error('Create Challenge Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/admin/challenges/:id
router.put('/challenges/:id', auth, admin, async (req, res) => {
  try {
    const Challenge = require('../models/Challenge');
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(challenge);
  } catch (err) {
    console.error('Update Challenge Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/admin/challenges/:id
router.delete('/challenges/:id', auth, admin, async (req, res) => {
  try {
    const Challenge = require('../models/Challenge');
    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Challenge deleted' });
  } catch (err) {
    console.error('Delete Challenge Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/admin/badges/:id
router.put('/badges/:id', auth, admin, async (req, res) => {
  try {
    const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(badge);
  } catch (err) {
    console.error('Update Badge Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
