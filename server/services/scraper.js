const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');
const NewsSource = require('../models/NewsSource');

const parser = new Parser({
  customFields: {
    item: ['media:content', 'content:encoded']
  }
});

/**
 * Sources RSS d'actualités IA
 */
const AI_NEWS_SOURCES = [
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    type: 'rss',
    category: 'Recherche'
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    type: 'rss',
    category: 'Actualités'
  },
  {
    name: 'DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
    type: 'rss',
    category: 'Recherche'
  },
  {
    name: 'AI News',
    url: 'https://www.artificialintelligence-news.com/feed/',
    type: 'rss',
    category: 'Actualités'
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    type: 'rss',
    category: 'Actualités'
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    type: 'rss',
    category: 'Actualités'
  },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    type: 'rss',
    category: 'Actualités'
  },
  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    type: 'rss',
    category: 'Machine Learning'
  }
];

/**
 * Initialise les sources dans la base de données
 */
async function initializeSources() {
  try {
    for (const source of AI_NEWS_SOURCES) {
      await NewsSource.findOneAndUpdate(
        { name: source.name },
        source,
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ ${AI_NEWS_SOURCES.length} sources initialisées`);
  } catch (error) {
    logger.error('❌ Erreur lors de l\'initialisation des sources:', error);
  }
}

/**
 * Scrape un flux RSS
 */
async function scrapeRSS(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const articles = [];

    for (const item of feed.items.slice(0, 5)) { // Limiter à 5 articles par source
      articles.push({
        title: item.title,
        link: item.link,
        description: item.contentSnippet || item.content || item.description,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        category: source.category,
        source: source.name,
        image: extractImageFromItem(item)
      });
    }

    // Mettre à jour les stats de la source
    await NewsSource.findByIdAndUpdate(source._id, {
      lastScraped: new Date(),
      $inc: { scrapeCount: 1 },
      errorCount: 0,
      lastError: null
    });

    logger.info(`✅ ${articles.length} articles scrapés depuis ${source.name}`);
    return articles;

  } catch (error) {
    logger.error(`❌ Erreur scraping ${source.name}:`, error.message);
    
    // Enregistrer l'erreur
    await NewsSource.findByIdAndUpdate(source._id, {
      $inc: { errorCount: 1 },
      lastError: {
        message: error.message,
        date: new Date()
      }
    });

    return [];
  }
}

/**
 * Extrait l'image d'un item RSS
 */
function extractImageFromItem(item) {
  // Essayer media:content
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }

  // Essayer enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  // Essayer de trouver une image dans le contenu HTML
  if (item['content:encoded'] || item.content) {
    const content = item['content:encoded'] || item.content;
    const $ = cheerio.load(content);
    const img = $('img').first();
    if (img.length) {
      return img.attr('src');
    }
  }

  return null;
}

/**
 * Scrape toutes les sources actives
 */
async function scrapeAllSources() {
  try {
    logger.info('🔍 Début du scraping des actualités IA...');

    const sources = await NewsSource.find({ active: true });
    const allArticles = [];

    for (const source of sources) {
      if (source.type === 'rss') {
        const articles = await scrapeRSS(source);
        allArticles.push(...articles);
      }
      // Ajouter d'autres types de scraping si nécessaire
    }

    logger.info(`✅ Scraping terminé: ${allArticles.length} articles collectés`);
    return allArticles;

  } catch (error) {
    logger.error('❌ Erreur lors du scraping:', error);
    throw error;
  }
}

/**
 * Filtre les articles en doublon
 */
function filterDuplicates(articles) {
  const seen = new Set();
  return articles.filter(article => {
    const key = article.title.toLowerCase().trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Sélectionne les meilleurs articles pour génération
 */
function selectBestArticles(articles, count = 3) {
  // Filtrer les doublons
  const unique = filterDuplicates(articles);

  // Trier par date (plus récent en premier)
  const sorted = unique.sort((a, b) => b.pubDate - a.pubDate);

  // Prioriser les articles avec images
  const withImages = sorted.filter(a => a.image);
  const withoutImages = sorted.filter(a => !a.image);

  // Retourner les meilleurs articles
  return [...withImages, ...withoutImages].slice(0, count);
}

module.exports = {
  initializeSources,
  scrapeAllSources,
  scrapeRSS,
  filterDuplicates,
  selectBestArticles
};
