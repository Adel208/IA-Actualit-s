const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

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
 * Génère une image placeholder si aucune image n'est disponible
 */
async function generatePlaceholder(text, filename) {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads/images');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Créer une image placeholder avec Sharp
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#1e293b"/>
        <text x="50%" y="50%" 
              font-family="Arial, sans-serif" 
              font-size="48" 
              fill="#f1f5f9" 
              text-anchor="middle" 
              dominant-baseline="middle">
          ${text.substring(0, 50)}
        </text>
      </svg>
    `;

    const buffer = Buffer.from(svg);
    const filepath = path.join(uploadsDir, filename);

    await sharp(buffer)
      .resize(1200, 630)
      .jpeg({ quality: 85 })
      .toFile(filepath);

    logger.info(`✅ Image placeholder générée: ${filename}`);

    return `/uploads/images/${filename}`;
  } catch (error) {
    logger.error('❌ Erreur génération placeholder:', error.message);
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

    // Générer une requête de recherche intelligente
    const searchQuery = generateSearchQuery(article);
    logger.info(`🔍 Recherche image pour "${article.title}" avec: "${searchQuery}"`);
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
    if (!article.featuredImage || !article.featuredImage.url) {
      const image = await getArticleImage(article);
      article.featuredImage = image;
      await article.save();
    }

    logger.info(`✅ Images optimisées pour: ${article.slug}`);
    return article;
  } catch (error) {
    logger.error('❌ Erreur optimisation images:', error);
    return article;
  }
}

module.exports = {
  searchUnsplashImage,
  downloadAndOptimizeImage,
  generatePlaceholder,
  getArticleImage,
  optimizeArticleImages
};
