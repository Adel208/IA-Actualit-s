const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'twitter', 'linkedin'],
    required: true
  },
  postId: {
    type: String
  },
  postUrl: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'failed'],
    default: 'pending'
  },
  publishedAt: {
    type: Date
  },
  error: {
    message: String,
    date: Date
  },
  engagement: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

socialPostSchema.index({ article: 1, platform: 1 });
socialPostSchema.index({ status: 1 });

module.exports = mongoose.model('SocialPost', socialPostSchema);
