const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  starterCode: { html: String, css: String, js: String },
  testCases: [{
    input: String,
    expectedOutput: String,
    description: String
  }],
  xpReward: Number,
  isPremium: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
});

module.exports = mongoose.model('Challenge', challengeSchema);
