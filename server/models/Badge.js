const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  xpRequired: Number,
  criteria: {
    type: { type: String, enum: ['lessons_completed', 'streak_days', 'challenges_solved', 'xp_earned'] },
    target: Number
  },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Badge', badgeSchema);
