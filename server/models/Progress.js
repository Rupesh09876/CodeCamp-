const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
  savedCode: [{
    lessonId: mongoose.Schema.Types.ObjectId,
    code: { html: String, css: String, js: String },
    updatedAt: Date
  }],
  completionPercentage: { type: Number, default: 0 },
  lastAccessed: Date
});

module.exports = mongoose.model('Progress', progressSchema);
