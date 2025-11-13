const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const Article = require('../models/Article');
const logger = require('../utils/logger');

/**
 * Génère le sitemap.xml
 */
async function generateSitemap(req, res) {
  try {
    const articles = await Article.find({ status: 'published' })
      .select('slug updatedAt')
      .sort({ publishedAt: -1 });

    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/articles', changefreq: 'daily', priority: 0.9 },
      { url: '/categories', changefreq: 'weekly', priority: 0.8 },
      { url: '/about', changefreq: 'monthly', priority: 0.5 },
      { url: '/contact', changefreq: 'monthly', priority: 0.5 }
    ];

    // Ajouter tous les articles
    articles.forEach(article => {
      links.push({
        url: `/article/${article.slug}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: article.updatedAt.toISOString()
      });
    });

    const stream = new SitemapStream({ hostname: process.env.SITE_URL });
    const xml = await streamToPromise(Readable.from(links).pipe(stream));

    res.header('Content-Type', 'application/xml');
    res.send(xml.toString());

  } catch (error) {
    logger.error('Erreur génération sitemap:', error);
    res.status(500).send('Erreur génération sitemap');
  }
}

module.exports = generateSitemap;
