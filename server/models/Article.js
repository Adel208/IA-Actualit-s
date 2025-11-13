const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  category: {
    type: String,
    required: true,
    enum: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Robotique', 'IA Générative', 'Éthique IA', 'Actualités', 'Recherche']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    url: String,
    alt: String,
    credit: String
  },
  author: {
    type: String,
    default: 'IA Actualités'
  },
  readTime: {
    type: Number, // en minutes
    default: 5
  },
  wordCount: {
    type: Number,
    default: 0
  },
  // SEO
  metaTitle: {
    type: String,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  keywords: [{
    type: String
  }],
  // Statistiques
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  // Publication
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  // Source
  sourceUrl: String,
  sourceTitle: String,
  // Réseaux sociaux
  socialShares: {
    facebook: { type: Boolean, default: false },
    twitter: { type: Boolean, default: false },
    linkedin: { type: Boolean, default: false }
  },
  // Structured Data pour SEO
  structuredData: {
    type: Object
  }
}, {
  timestamps: true
});

// Index pour la recherche
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ slug: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ status: 1 });

// Méthode pour calculer le temps de lecture
articleSchema.methods.calculateReadTime = function() {
  const wordsPerMinute = 200;
  this.wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(this.wordCount / wordsPerMinute);
};

// Générer les données structurées pour SEO
articleSchema.methods.generateStructuredData = function() {
  this.structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": this.title,
    "description": this.excerpt,
    "image": this.featuredImage?.url,
    "datePublished": this.publishedAt,
    "dateModified": this.updatedAt,
    "author": {
      "@type": "Organization",
      "name": this.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "IA Actualités",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.SITE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.SITE_URL}/article/${this.slug}`
    }
  };
};

// Hook pre-save
articleSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.calculateReadTime();
  }
  if (this.isModified('title') || this.isModified('excerpt')) {
    this.generateStructuredData();
  }
  if (!this.metaTitle) {
    this.metaTitle = this.title.substring(0, 60);
  }
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt.substring(0, 160);
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
