require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { publishMultipleArticles } = require('../services/socialMediaService');
const Article = require('../models/Article');

/**
 * Job de publication sur les réseaux sociaux
 */
async function publishToSocialJob() {
  try {
    logger.info('📢 === DÉBUT DU JOB DE PUBLICATION SOCIALE ===');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connecté à MongoDB');

    // Trouver les articles publiés non partagés sur les réseaux sociaux
    const articlesToShare = await Article.find({
      status: 'published',
      $or: [
        { 'socialShares.facebook': false },
        { 'socialShares.twitter': false },
        { 'socialShares.linkedin': false }
      ]
    })
    .sort({ publishedAt: -1 })
    .limit(3);

    if (articlesToShare.length === 0) {
      logger.info('ℹ️ Aucun article à partager');
      return { success: true, articlesShared: 0 };
    }

    logger.info(`📢 ${articlesToShare.length} articles à partager`);

    // Publier sur les réseaux sociaux
    const results = await publishMultipleArticles(articlesToShare);

    const successCount = results.filter(r => !r.error).length;
    logger.info(`✅ ${successCount}/${articlesToShare.length} articles partagés avec succès`);
    logger.info('📢 === FIN DU JOB DE PUBLICATION SOCIALE ===');

    return {
      success: true,
      articlesShared: successCount,
      results
    };

  } catch (error) {
    logger.error('❌ Erreur dans le job de publication sociale:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Si exécuté directement
if (require.main === module) {
  publishToSocialJob()
    .then(result => {
      console.log('✅ Job terminé:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = publishToSocialJob;
