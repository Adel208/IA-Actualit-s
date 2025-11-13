const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const logger = require('../utils/logger');

/**
 * GET /api/articles - Liste des articles avec pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const search = req.query.search;

    const query = { status: 'published' };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content'); // Exclure le contenu complet

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Erreur récupération articles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/articles/featured - Articles en vedette
 */
router.get('/featured', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .sort({ views: -1, publishedAt: -1 })
      .limit(3)
      .select('-content');

    res.json(articles);
  } catch (error) {
    logger.error('Erreur récupération articles vedette:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/articles/latest - Derniers articles
 */
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('-content');

    res.json(articles);
  } catch (error) {
    logger.error('Erreur récupération derniers articles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/articles/category/:category - Articles par catégorie
 */
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const query = { 
      status: 'published',
      category: category
    };

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content');

    res.json({
      articles,
      category,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Erreur récupération articles par catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/articles/search - Recherche d'articles
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    if (!q) {
      return res.status(400).json({ error: 'Paramètre de recherche manquant' });
    }

    const query = {
      status: 'published',
      $text: { $search: q }
    };

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content');

    res.json({
      articles,
      query: q,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Erreur recherche articles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/articles/:slug - Article par slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({ 
      slug, 
      status: 'published' 
    });

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Incrémenter les vues
    article.views += 1;
    await article.save();

    // Récupérer les articles similaires
    const relatedArticles = await Article.find({
      status: 'published',
      category: article.category,
      _id: { $ne: article._id }
    })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select('-content');

    res.json({
      article,
      relatedArticles
    });
  } catch (error) {
    logger.error('Erreur récupération article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/articles/:id/like - Liker un article
 */
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json({ likes: article.likes });
  } catch (error) {
    logger.error('Erreur like article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/articles/stats/categories - Statistiques par catégorie
 */
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await Article.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    logger.error('Erreur stats catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
