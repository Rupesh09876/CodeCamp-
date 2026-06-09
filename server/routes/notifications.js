const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @desc    Get all notifications for current user (or admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // If admin, they might see all admin notifications (where user is null) or specific to them
    // For simplicity, let's say admins see user=null notifications, regular users see their own
    let filter = { user: req.user.id };
    
    // Check if user is admin
    const User = require('../models/User');
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role === 'admin') {
      filter = { $or: [{ user: req.user.id }, { user: null }] };
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    let filter = { user: req.user.id };
    
    const User = require('../models/User');
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role === 'admin') {
      filter = { $or: [{ user: req.user.id }, { user: null }] };
    }

    await Notification.updateMany(filter, { $set: { isRead: true } });
    
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark single notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/notifications/all
// @desc    Delete all notifications
// @access  Private
router.delete('/all', auth, async (req, res) => {
  try {
    let filter = { user: req.user.id };
    
    const User = require('../models/User');
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role === 'admin') {
      filter = { $or: [{ user: req.user.id }, { user: null }] };
    }

    await Notification.deleteMany(filter);
    
    res.json({ msg: 'All notifications deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete single notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Notification removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
