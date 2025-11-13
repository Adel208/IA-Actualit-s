const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

/**
 * Scrape l'image directement depuis l'article source
 */
async function scrapeImageFromSource(sourceUrl) {
  try {
    logger.info(`🔍 Tentative de scraping image depuis: ${sourceUrl}`);
    
    const response = await axios.get(sourceUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Chercher les images dans l'ordre de priorité
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'article img[src]',
      '.article-image img',
      '.post-image img',
      'img[src*="featured"]',
      'img[src*="hero"]'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      let imageUrl = element.attr('content') || element.attr('src');
      
      if (imageUrl) {
        // Convertir URL relative en absolue
        if (imageUrl.startsWith('/')) {
          const urlObj = new URL(sourceUrl);
          imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
        }
        
        // Vérifier que c'est une vraie image
        if (imageUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) || imageUrl.includes('image')) {
          logger.info(`✅ Image trouvée dans l'article source`);
          return imageUrl;
        }
      }
    }
    
    return null;
  } catch (error) {
    logger.warn(`⚠️ Impossible de scraper l'image source: ${error.message}`);
    return null;
  }
}

/**
 * Recherche une image sur Pexels (gratuit, pas de clé API nécessaire pour 200 req/h)
 */
async function searchPexelsImage(query) {
  try {
    // Pexels offre 200 requêtes/heure gratuitement
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query: query,
        per_page: 5,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': process.env.PEXELS_API_KEY || 'DEMO_KEY'
      }
    });
    
    if (response.data.photos && response.data.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(3, response.data.photos.length));
      const photo = response.data.photos[randomIndex];
      logger.info(`✅ Image Pexels trouvée: ${photo.alt || 'Sans description'}`);
      return {
        url: photo.src.large2x,
        alt: photo.alt || query,
        credit: `Photo par ${photo.photographer} sur Pexels`
      };
    }
    
    return null;
  } catch (error) {
    logger.warn('⚠️ Erreur recherche Pexels:', error.message);
    return null;
  }
}

/**
 * Recherche une image sur Unsplash
 */
async function searchUnsplashImage(query) {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      logger.warn('⚠️ Clé Unsplash non configurée');
      return null;
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: query,
        per_page: 5,
        orientation: 'landscape',
        order_by: 'relevant'
      },
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      // Prendre une image aléatoire parmi les 3 premières pour plus de variété
      const randomIndex = Math.floor(Math.random() * Math.min(3, response.data.results.length));
      const photo = response.data.results[randomIndex];
      logger.info(`✅ Image trouvée: ${photo.alt_description || 'Sans description'}`);
      return {
        url: photo.urls.full, // Utiliser 'full' au lieu de 'regular' pour meilleure qualité
        alt: photo.alt_description || query,
        credit: `Photo par ${photo.user.name} sur Unsplash`,
        downloadUrl: photo.links.download_location
      };
    }

    return null;
  } catch (error) {
    logger.error('❌ Erreur recherche Unsplash:', error.message);
    return null;
  }
}

/**
 * Télécharge et optimise une image
 */
async function downloadAndOptimizeImage(imageUrl, filename) {
  try {
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(__dirname, '../../uploads/images');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Télécharger l'image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000
    });

    const imageBuffer = Buffer.from(response.data);

    // Optimiser l'image avec Sharp - Haute qualité
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(1920, 1080, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: false
      })
      .jpeg({
        quality: 92,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer();

    // Sauvegarder l'image
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, optimizedBuffer);

    logger.info(`✅ Image optimisée et sauvegardée: ${filename}`);

    return `/uploads/images/${filename}`;

  } catch (error) {
    logger.error('❌ Erreur téléchargement/optimisation image:', error.message);
    return null;
  }
}

/**
 * Génère une image placeholder
 */
async function generatePlaceholder(text, filename) {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads/images');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Créer un SVG simple
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#1a1a2e"/>
        <text x="50%" y="50%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle">
          ${text.substring(0, 50)}
        </text>
      </svg>
    `;

    const buffer = await sharp(Buffer.from(svg))
      .jpeg({ quality: 85 })
      .toBuffer();

    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    return `/uploads/images/${filename}`;

  } catch (error) {
    logger.error('❌ Erreur génération placeholder:', error);
    return null;
  }
}

/**
 * Génère une requête de recherche intelligente basée sur l'article
 */
function generateSearchQuery(article) {
  // Extraire les mots-clés du titre
  const titleWords = article.title
    .toLowerCase()
    .replace(/[^a-zàâäéèêëïîôùûüÿæœç\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4);

  // Mapping des catégories vers des termes de recherche
  const categoryKeywords = {
    'Machine Learning': ['machine learning', 'neural network', 'algorithm', 'data science'],
    'Deep Learning': ['deep learning', 'artificial intelligence', 'neural network'],
    'NLP': ['natural language', 'text processing', 'chatbot', 'language model'],
    'Computer Vision': ['computer vision', 'image recognition', 'visual ai'],
    'Robotique': ['robot', 'robotics', 'automation', 'mechanical'],
    'IA Générative': ['generative ai', 'creative ai', 'digital art', 'ai generated'],
    'Éthique IA': ['ethics', 'technology ethics', 'responsible ai'],
    'Recherche': ['research', 'laboratory', 'science', 'innovation'],
    'Actualités': ['technology', 'innovation', 'futuristic']
  };

  // Combiner titre + catégorie pour une recherche plus précise
  const categoryTerms = categoryKeywords[article.category] || ['artificial intelligence'];
  const randomCategoryTerm = categoryTerms[Math.floor(Math.random() * categoryTerms.length)];
  
  // Si on a des mots du titre, les utiliser
  if (titleWords.length > 0) {
    const randomTitleWord = titleWords[Math.floor(Math.random() * Math.min(2, titleWords.length))];
    return `${randomCategoryTerm} ${randomTitleWord}`;
  }
  
  return randomCategoryTerm;
}

/**
 * Trouve ou génère une image pour un article
 */
async function getArticleImage(article) {
  try {
    // Si l'article a déjà une image
    if (article.featuredImage && article.featuredImage.url) {
      return article.featuredImage;
    }

    // ÉTAPE 1: Essayer de scraper l'image de l'article source
    if (article.sourceUrl) {
      const sourceImage = await scrapeImageFromSource(article.sourceUrl);
      if (sourceImage) {
        const filename = `${article.slug}-source-${Date.now()}.jpg`;
        const localUrl = await downloadAndOptimizeImage(sourceImage, filename);
        if (localUrl) {
          logger.info('✅ Image récupérée depuis l\'article source');
          return {
            url: localUrl,
            alt: article.title,
            credit: article.sourceTitle || 'Source'
          };
        }
      }
    }

    // ÉTAPE 2: Chercher sur Pexels avec mots-clés du titre
    const searchQuery = generateSearchQuery(article);
    logger.info(`🔍 Recherche image pour "${article.title}" avec: "${searchQuery}"`);
    
    const pexelsImage = await searchPexelsImage(searchQuery);
    if (pexelsImage) {
      const filename = `${article.slug}-pexels-${Date.now()}.jpg`;
      const localUrl = await downloadAndOptimizeImage(pexelsImage.url, filename);
      if (localUrl) {
        return {
          url: localUrl,
          alt: pexelsImage.alt,
          credit: pexelsImage.credit
        };
      }
    }

    // ÉTAPE 3: Fallback sur Unsplash
    const unsplashImage = await searchUnsplashImage(searchQuery);

    if (unsplashImage) {
      // Télécharger et optimiser
      const filename = `${article.slug}-${Date.now()}.jpg`;
      const localUrl = await downloadAndOptimizeImage(unsplashImage.url, filename);

      if (localUrl) {
        return {
          url: localUrl,
          alt: unsplashImage.alt,
          credit: unsplashImage.credit
        };
      }
    }

    // Générer un placeholder si aucune image trouvée
    const filename = `${article.slug}-placeholder.jpg`;
    const placeholderUrl = await generatePlaceholder(article.title, filename);

    return {
      url: placeholderUrl || '/images/default-ai.jpg',
      alt: article.title,
      credit: 'IA Actualités'
    };

  } catch (error) {
    logger.error('❌ Erreur obtention image article:', error);
    return {
      url: '/images/default-ai.jpg',
      alt: article.title,
      credit: 'IA Actualités'
    };
  }
}

/**
 * Optimise toutes les images d'un article
 */
async function optimizeArticleImages(article) {
  try {
    // Obtenir l'image principale
    const featuredImage = await getArticleImage(article);
    
    if (featuredImage) {
      article.featuredImage = featuredImage;
      await article.save();
      logger.info(`✅ Images optimisées pour: ${article.slug}`);
    }

    return article;

  } catch (error) {
    logger.error('❌ Erreur optimisation images:', error);
    return article;
  }
}

module.exports = {
  searchUnsplashImage,
  searchPexelsImage,
  scrapeImageFromSource,
  downloadAndOptimizeImage,
  generatePlaceholder,
  getArticleImage,
  optimizeArticleImages
};
