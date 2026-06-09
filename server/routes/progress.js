const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');

// POST /api/progress/start
// Initialize progress for a course so it shows in My Courses
router.post('/start', auth, async (req, res) => {
  const { slug } = req.body;
  try {
    // Find course by mapping slug to category (e.g. 'html' -> 'HTML')
    const course = await Course.findOne({ category: { $regex: new RegExp(`^${slug}$`, 'i') } });
    
    // If no course in DB yet, just return success so the frontend doesn't break
    if (!course) return res.json({ msg: 'Course not in DB yet, progress tracking skipped' });

    let progress = await Progress.findOne({ userId: req.user.id, courseId: course._id });
    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        courseId: course._id,
        completedLessons: [],
        savedCode: [],
        lastAccessed: Date.now(),
        completionPercentage: 0
      });
      await progress.save();
    } else {
      progress.lastAccessed = Date.now();
      await progress.save();
    }
    res.json({ msg: 'Course started', progress });
  } catch (err) {
    console.error('Progress Start Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/progress/complete
// Mark a lesson as complete, add 50 XP to user
router.post('/complete', auth, async (req, res) => {
  const { slug, level } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Try to find course
    const course = await Course.findOne({ category: { $regex: new RegExp(`^${slug}$`, 'i') } });

    // Build a deterministic but unique ObjectId from slug+level so duplicate-completion check works
    const lessonKey = `${slug}-level-${level}`;
    const fakeId = new mongoose.Types.ObjectId(Buffer.from(lessonKey.padEnd(12, '0').slice(0, 12)));

    let progress = null;
    if (course) {
      progress = await Progress.findOne({ userId: req.user.id, courseId: course._id });
      if (!progress) {
        progress = new Progress({
          userId: req.user.id,
          courseId: course._id,
          completedLessons: [],
          savedCode: []
        });
      }
    }

    // Check if already completed
    const alreadyKey = `${slug}:${level}`;
    const alreadyCompleted = user._completed_lessons ? user._completed_lessons.includes(alreadyKey) : false;

    if (!alreadyCompleted) {
      if (progress) {
        // Check the progress record for duplicates
        const alreadyInProgress = progress.completedLessons.some(id => id.toString() === fakeId.toString());
        if (!alreadyInProgress) {
          progress.completedLessons.push(fakeId);
          
          // Calculate completion percentage
          if (course && course.modules) {
            const totalLessons = course.modules.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0);
            if (totalLessons > 0) {
              progress.completionPercentage = Math.round((progress.completedLessons.length / totalLessons) * 100);
            }
          }
          
          progress.lastAccessed = Date.now();
          await progress.save();
        }
      }

      // Add XP and update level
      user.xp += 50;
      user.level = Math.floor(user.xp / 500) + 1;
      
      // Update completed lessons list for user (legacy tracking)
      if (!user._completed_lessons) user._completed_lessons = [];
      if (!user._completed_lessons.includes(alreadyKey)) {
        user._completed_lessons.push(alreadyKey);
      }

      // Notify User about XP
      const xpNotif = new Notification({
        user: user._id,
        title: 'XP Earned! ✨',
        message: `You earned 50 XP for completing a lesson. Keep it up!`,
        type: 'success'
      });
      await xpNotif.save();

      // --- BADGE AWARDING LOGIC ---
      const availableBadges = await Badge.find({ isActive: true });
      for (const badge of availableBadges) {
        // Skip if user already has this badge
        if (user.badges.includes(badge._id)) continue;

        let awarded = false;
        if (badge.criteria.type === 'xp_earned' && user.xp >= badge.criteria.target) {
          awarded = true;
        } else if (badge.criteria.type === 'lessons_completed') {
          // Total lessons across all courses
          const totalCompleted = user._completed_lessons.length;
          if (totalCompleted >= badge.criteria.target) {
            awarded = true;
          }
        }
        // Streak logic would go here if implemented

        if (awarded) {
          user.badges.push(badge._id);
          
          // Notify User about Badge
          const badgeNotif = new Notification({
            user: user._id,
            title: 'New Badge Unlocked! 🏆',
            message: `Congratulations! You've earned the "${badge.name}" badge.`,
            type: 'success'
          });
          await badgeNotif.save();
        }
      }
      
      await user.save();

      return res.json({ 
        msg: 'Lesson marked complete', 
        xpGained: 50, 
        currentXp: user.xp, 
        level: user.level, 
        progress,
        user 
      });
    } else {
      return res.json({ msg: 'Lesson already completed', xpGained: 0, currentXp: user.xp, level: user.level, user });
    }
  } catch (err) {
    console.error('Progress Complete Error:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// GET /api/progress/my-courses
// Get courses the user has started or completed
router.get('/my-courses', auth, async (req, res) => {
  try {
    const progressList = await Progress.find({ userId: req.user.id })
      .populate('courseId', 'title category thumbnail level');
    
    // Format the response
    const courses = progressList.map(p => ({
      course: p.courseId,
      completedLessonsCount: p.completedLessons.length,
      lastAccessed: p.lastAccessed,
      completionPercentage: p.completionPercentage || 0
    })).filter(c => c.course != null); // filter out null courses if any were deleted

    res.json(courses);
  } catch (err) {
    console.error('My Courses Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/progress/reset
// Reset all progress, XP, and Level for the user
router.delete('/reset', auth, async (req, res) => {
  try {
    // 1. Delete all progress records
    await Progress.deleteMany({ userId: req.user.id });

    // 2. Reset user XP and Level
    const user = await User.findById(req.user.id);
    if (user) {
      user.xp = 0;
      user.level = 1;
      user.badges = []; // Optional: reset badges too
      user.streak = 0;
      await user.save();
    }

    res.json({ msg: 'Progress and stats reset successfully' });
  } catch (err) {
    console.error('Reset Progress Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
