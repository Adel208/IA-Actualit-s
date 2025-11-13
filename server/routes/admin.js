const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const scrapeNewsJob = require('../jobs/scrapeNews');
const generateArticlesJob = require('../jobs/generateArticles');
const publishToSocialJob = require('../jobs/publishToSocial');
const Article = require('../models/Article');
const SocialPost = require('../models/SocialPost');
const NewsSource = require('../models/NewsSource');

/**
 * POST /api/admin/scrape - Lancer le scraping manuellement
 */
router.post('/scrape', async (req, res) => {
  try {
    logger.info('🔍 Scraping manuel déclenché');
    const result = await scrapeNewsJob();
    res.json(result);
  } catch (error) {
    logger.error('Erreur scraping manuel:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/generate - Générer des articles manuellement
 */
router.post('/generate', async (req, res) => {
  try {
    logger.info('📝 Génération manuelle déclenchée');
    const result = await generateArticlesJob();
    res.json(result);
  } catch (error) {
    logger.error('Erreur génération manuelle:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/publish - Publier sur les réseaux sociaux manuellement
 */
router.post('/publish', async (req, res) => {
  try {
    logger.info('📢 Publication manuelle déclenchée');
    const result = await publishToSocialJob();
    res.json(result);
  } catch (error) {
    logger.error('Erreur publication manuelle:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/stats - Statistiques globales
 */
router.get('/stats', async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments({ status: 'published' });
    const draftArticles = await Article.countDocuments({ status: 'draft' });
    const totalViews = await Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    const totalLikes = await Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ]);

    const socialPosts = await SocialPost.countDocuments({ status: 'published' });
    const activeSources = await NewsSource.countDocuments({ active: true });

    const recentArticles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title slug publishedAt views likes');

    res.json({
      articles: {
        total: totalArticles,
        draft: draftArticles,
        published: totalArticles
      },
      engagement: {
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0
      },
      social: {
        totalPosts: socialPosts
      },
      sources: {
        active: activeSources
      },
      recentArticles
    });
  } catch (error) {
    logger.error('Erreur stats admin:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/articles - Liste complète des articles (admin)
 */
router.get('/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;

    const query = status ? { status } : {};

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content');

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
    logger.error('Erreur liste articles admin:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/admin/articles/:id - Mettre à jour un article
 */
router.patch('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const article = await Article.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json(article);
  } catch (error) {
    logger.error('Erreur mise à jour article:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/articles/:id - Supprimer un article
 */
router.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json({ message: 'Article supprimé', article });
  } catch (error) {
    logger.error('Erreur suppression article:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/sources - Liste des sources
 */
router.get('/sources', async (req, res) => {
  try {
    const sources = await NewsSource.find().sort({ name: 1 });
    res.json(sources);
  } catch (error) {
    logger.error('Erreur liste sources:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/admin/sources/:id - Mettre à jour une source
 */
router.patch('/sources/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const source = await NewsSource.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!source) {
      return res.status(404).json({ error: 'Source non trouvée' });
    }

    res.json(source);
  } catch (error) {
    logger.error('Erreur mise à jour source:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
