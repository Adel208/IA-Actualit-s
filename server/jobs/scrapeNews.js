require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { initializeSources, scrapeAllSources, selectBestArticles } = require('../services/scraper');

/**
 * Job de scraping des actualités
 */
async function scrapeNewsJob() {
  try {
    logger.info('🔍 === DÉBUT DU JOB DE SCRAPING ===');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connecté à MongoDB');

    // Initialiser les sources si nécessaire
    await initializeSources();

    // Scraper toutes les sources
    const articles = await scrapeAllSources();

    if (articles.length === 0) {
      logger.warn('⚠️ Aucun article trouvé');
      return { success: true, articlesCount: 0 };
    }

    // Sélectionner les meilleurs articles
    const bestArticles = selectBestArticles(articles, 5);

    logger.info(`✅ ${bestArticles.length} articles sélectionnés pour génération`);
    logger.info('🔍 === FIN DU JOB DE SCRAPING ===');

    return {
      success: true,
      articlesCount: articles.length,
      selectedCount: bestArticles.length,
      articles: bestArticles
    };

  } catch (error) {
    logger.error('❌ Erreur dans le job de scraping:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Si exécuté directement
if (require.main === module) {
  scrapeNewsJob()
    .then(result => {
      console.log('✅ Job terminé:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = scrapeNewsJob;
