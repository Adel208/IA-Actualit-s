const mongoose = require('mongoose');

const newsSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['rss', 'scraping', 'api'],
    default: 'rss'
  },
  category: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  lastScraped: {
    type: Date
  },
  scrapeCount: {
    type: Number,
    default: 0
  },
  errorCount: {
    type: Number,
    default: 0
  },
  lastError: {
    message: String,
    date: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NewsSource', newsSourceSchema);
