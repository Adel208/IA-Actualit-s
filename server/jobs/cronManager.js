require('dotenv').config();
const cron = require('node-cron');
const logger = require('../utils/logger');
const scrapeNewsJob = require('./scrapeNews');
const generateArticlesJob = require('./generateArticles');
const publishToSocialJob = require('./publishToSocial');

/**
 * Gestionnaire de tâches CRON
 */
class CronManager {
  constructor() {
    this.jobs = [];
  }

  /**
   * Démarre tous les jobs CRON
   */
  start() {
    logger.info('🤖 === DÉMARRAGE DU GESTIONNAIRE CRON ===');

    // Job de scraping (toutes les 6 heures par défaut)
    const scrapeCron = process.env.SCRAPE_CRON || '0 */6 * * *';
    this.jobs.push(
      cron.schedule(scrapeCron, async () => {
        logger.info('⏰ Déclenchement du job de scraping');
        try {
          await scrapeNewsJob();
        } catch (error) {
          logger.error('❌ Erreur job scraping:', error);
        }
      })
    );
    logger.info(`✅ Job scraping programmé: ${scrapeCron}`);

    // Job de génération d'articles (3 fois par jour par défaut: 8h, 14h, 20h)
    const generateCron = process.env.GENERATE_CRON || '0 8,14,20 * * *';
    this.jobs.push(
      cron.schedule(generateCron, async () => {
        logger.info('⏰ Déclenchement du job de génération');
        try {
          await generateArticlesJob();
        } catch (error) {
          logger.error('❌ Erreur job génération:', error);
        }
      })
    );
    logger.info(`✅ Job génération programmé: ${generateCron}`);

    // Job de publication sociale (3 fois par jour par défaut: 9h, 15h, 21h)
    const publishCron = process.env.PUBLISH_CRON || '0 9,15,21 * * *';
    this.jobs.push(
      cron.schedule(publishCron, async () => {
        logger.info('⏰ Déclenchement du job de publication sociale');
        try {
          await publishToSocialJob();
        } catch (error) {
          logger.error('❌ Erreur job publication:', error);
        }
      })
    );
    logger.info(`✅ Job publication programmé: ${publishCron}`);

    logger.info('🤖 === GESTIONNAIRE CRON ACTIF ===');
    logger.info('💡 Appuyez sur Ctrl+C pour arrêter');
  }

  /**
   * Arrête tous les jobs CRON
   */
  stop() {
    logger.info('🛑 Arrêt des jobs CRON...');
    this.jobs.forEach(job => job.stop());
    logger.info('✅ Tous les jobs arrêtés');
  }
}

// Si exécuté directement
if (require.main === module) {
  const manager = new CronManager();
  manager.start();

  // Gestion de l'arrêt propre
  process.on('SIGINT', () => {
    logger.info('\n🛑 Signal d\'arrêt reçu');
    manager.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.info('\n🛑 Signal de terminaison reçu');
    manager.stop();
    process.exit(0);
  });
}

module.exports = CronManager;
