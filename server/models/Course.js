const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['HTML', 'CSS', 'JavaScript', 'React', 'Node'] },
  description: String,
  thumbnail: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  isPremium: { type: Boolean, default: false },
  price: Number,
  status: { type: String, enum: ['active', 'draft'], default: 'active' },
  modules: [{
    name: String,
    lessons: [{
      title: String,
      youtubeUrl: String,
      xpReward: { type: Number, default: 10 },
      starterCode: {
        html: String,
        css: String,
        js: String
      },
      duration: Number,
      order: Number
    }],
    order: Number
  }],
  totalStudents: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
