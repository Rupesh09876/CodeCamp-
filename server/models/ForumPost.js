const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: Date
  }],
  tags: [String],
  isReported: { type: Boolean, default: false },
  createdAt: Date
});
  
module.exports = mongoose.model('ForumPost', forumPostSchema);
