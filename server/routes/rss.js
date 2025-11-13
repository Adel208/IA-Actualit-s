const { Feed } = require('feed');
const Article = require('../models/Article');
const logger = require('../utils/logger');

/**
 * Génère le flux RSS
 */
async function generateRSS(req, res) {
  try {
    const feed = new Feed({
      title: process.env.SITE_NAME || 'IA Actualités',
      description: process.env.SITE_DESCRIPTION || 'Actualités quotidiennes sur l\'Intelligence Artificielle',
      id: process.env.SITE_URL,
      link: process.env.SITE_URL,
      language: 'fr',
      image: `${process.env.SITE_URL}/logo.png`,
      favicon: `${process.env.SITE_URL}/favicon.ico`,
      copyright: `Tous droits réservés ${new Date().getFullYear()}, ${process.env.SITE_NAME}`,
      updated: new Date(),
      generator: 'IA Actualités Generator',
      feedLinks: {
        rss: `${process.env.SITE_URL}/rss.xml`,
        json: `${process.env.SITE_URL}/rss.json`,
        atom: `${process.env.SITE_URL}/atom.xml`
      },
      author: {
        name: process.env.SITE_NAME,
        link: process.env.SITE_URL
      }
    });

    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(20);

    articles.forEach(article => {
      feed.addItem({
        title: article.title,
        id: `${process.env.SITE_URL}/article/${article.slug}`,
        link: `${process.env.SITE_URL}/article/${article.slug}`,
        description: article.excerpt,
        content: article.content,
        author: [
          {
            name: article.author,
            link: process.env.SITE_URL
          }
        ],
        date: article.publishedAt,
        image: article.featuredImage?.url 
          ? `${process.env.SITE_URL}${article.featuredImage.url}`
          : undefined,
        category: [
          {
            name: article.category
          }
        ]
      });
    });

    res.header('Content-Type', 'application/xml');
    res.send(feed.rss2());

  } catch (error) {
    logger.error('Erreur génération RSS:', error);
    res.status(500).send('Erreur génération RSS');
  }
}

module.exports = generateRSS;
