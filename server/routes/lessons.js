const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Seed some initial lessons (for testing)
router.post('/seed', async (req, res) => {
  try {
    await Lesson.deleteMany({});
    
    const seedLessons = [
      {
        moduleId: 'html-basics',
        title: 'Introduction to HTML',
        youtubeVideoId: 'qz0aGYrrlhU',
        timestamps: [{time: 0, label: 'Intro'}, {time: 120, label: 'Tags'}],
        starterCode: { html: '<h1>Hello CodeCamp</h1>', css: '', js: '' },
        description: 'Learn the basics of HTML.',
        difficulty: 'Beginner',
        xpReward: 50,
        order: 1
      },
      {
        moduleId: 'css-basics',
        title: 'Styling with CSS',
        youtubeVideoId: '1Rs2ND1ryYc',
        timestamps: [{time: 0, label: 'Intro'}, {time: 60, label: 'Selectors'}],
        starterCode: { html: '<h1 class="title">Style Me</h1>', css: '.title { color: red; }', js: '' },
        description: 'Learn how to style your web pages.',
        difficulty: 'Beginner',
        xpReward: 50,
        order: 2
      }
    ];

    await Lesson.insertMany(seedLessons);
    res.json({ msg: 'Lessons seeded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
