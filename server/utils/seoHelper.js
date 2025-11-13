const slugify = require('slugify');

/**
 * Génère un slug SEO-friendly
 */
function generateSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'fr',
    remove: /[*+~.()'"!:@]/g
  });
}

/**
 * Extrait les mots-clés d'un texte
 */
function extractKeywords(text, limit = 10) {
  // Mots vides en français
  const stopWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais',
    'donc', 'or', 'ni', 'car', 'ce', 'cette', 'ces', 'mon', 'ton', 'son',
    'ma', 'ta', 'sa', 'mes', 'tes', 'ses', 'notre', 'votre', 'leur', 'nos',
    'vos', 'leurs', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
    'on', 'qui', 'que', 'quoi', 'dont', 'où', 'dans', 'sur', 'sous', 'avec',
    'sans', 'pour', 'par', 'en', 'au', 'aux', 'à', 'est', 'sont', 'être',
    'avoir', 'fait', 'faire', 'plus', 'moins', 'très', 'bien', 'tout', 'tous'
  ]);

  // Nettoyer et tokeniser
  const words = text
    .toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüÿæœç\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Compter les occurrences
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Trier par fréquence et retourner les top mots-clés
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * Génère un extrait optimisé pour le SEO
 */
function generateExcerpt(content, maxLength = 160) {
  // Enlever les balises HTML
  const text = content.replace(/<[^>]*>/g, ' ');
  
  // Nettoyer les espaces multiples
  const cleaned = text.replace(/\s+/g, ' ').trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Couper au dernier espace avant la limite
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Optimise le titre pour le SEO
 */
function optimizeTitle(title, maxLength = 60) {
  if (title.length <= maxLength) {
    return title;
  }
  
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Génère des balises Open Graph
 */
function generateOpenGraphTags(article) {
  return {
    'og:title': article.metaTitle || article.title,
    'og:description': article.metaDescription || article.excerpt,
    'og:image': article.featuredImage?.url,
    'og:url': `${process.env.SITE_URL}/article/${article.slug}`,
    'og:type': 'article',
    'og:site_name': process.env.SITE_NAME,
    'article:published_time': article.publishedAt,
    'article:modified_time': article.updatedAt,
    'article:author': article.author,
    'article:section': article.category,
    'article:tag': article.tags
  };
}

/**
 * Génère des balises Twitter Card
 */
function generateTwitterCardTags(article) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': article.metaTitle || article.title,
    'twitter:description': article.metaDescription || article.excerpt,
    'twitter:image': article.featuredImage?.url,
    'twitter:site': '@ia_actualites'
  };
}

module.exports = {
  generateSlug,
  extractKeywords,
  generateExcerpt,
  optimizeTitle,
  generateOpenGraphTags,
  generateTwitterCardTags
};
