require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { scrapeAllSources, selectBestArticles } = require('../services/scraper');
const { generateMultipleArticles } = require('../services/articleGenerator');
const { optimizeArticleImages } = require('../services/imageService');
const Article = require('../models/Article');

/**
 * Job de génération d'articles
 */
async function generateArticlesJob() {
  try {
    logger.info('📝 === DÉBUT DU JOB DE GÉNÉRATION D\'ARTICLES ===');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connecté à MongoDB');

    // Scraper les actualités
    logger.info('🔍 Scraping des actualités...');
    const scrapedArticles = await scrapeAllSources();

    if (scrapedArticles.length === 0) {
      logger.warn('⚠️ Aucune actualité trouvée');
      return { success: true, articlesGenerated: 0 };
    }

    // Sélectionner les meilleurs articles
    const bestArticles = selectBestArticles(scrapedArticles, 3);
    logger.info(`✅ ${bestArticles.length} actualités sélectionnées`);

    // Générer les articles
    logger.info('📝 Génération des articles...');
    const generatedArticles = await generateMultipleArticles(bestArticles, 3);

    if (generatedArticles.length === 0) {
      logger.warn('⚠️ Aucun article généré');
      return { success: true, articlesGenerated: 0 };
    }

    // Optimiser les images
    logger.info('🖼️ Optimisation des images...');
    for (const article of generatedArticles) {
      await optimizeArticleImages(article);
    }

    // Publier les articles
    logger.info('📢 Publication des articles...');
    for (const article of generatedArticles) {
      article.status = 'published';
      await article.save();
    }

    logger.info(`✅ ${generatedArticles.length} articles générés et publiés`);
    logger.info('📝 === FIN DU JOB DE GÉNÉRATION ===');

    return {
      success: true,
      articlesGenerated: generatedArticles.length,
      articles: generatedArticles.map(a => ({
        title: a.title,
        slug: a.slug,
        category: a.category
      }))
    };

  } catch (error) {
    logger.error('❌ Erreur dans le job de génération:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Si exécuté directement
if (require.main === module) {
  generateArticlesJob()
    .then(result => {
      console.log('✅ Job terminé:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = generateArticlesJob;
