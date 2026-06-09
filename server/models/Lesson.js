const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  title: { type: String, required: true },
  youtubeVideoId: { type: String, required: true },
  timestamps: [{
    time: { type: Number },
    label: { type: String }
  }],
  starterCode: {
    html: { type: String, default: '' },
    css: { type: String, default: '' },
    js: { type: String, default: '' }
  },
  description: { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  xpReward: { type: Number, default: 50 },
  order: { type: Number, required: true }
});

module.exports = mongoose.model('Lesson', lessonSchema);
