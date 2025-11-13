const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const { generateSlug, extractKeywords, generateExcerpt, optimizeTitle } = require('../utils/seoHelper');
const Article = require('../models/Article');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Génère un article complet à partir d'une actualité
 */
async function generateArticle(newsItem) {
  try {
    logger.info(`📝 Génération d'article pour: ${newsItem.title}`);

    // 1. Générer le contenu principal (800+ mots)
    const content = await generateContent(newsItem);

    // 2. Générer un titre optimisé SEO
    const title = await generateSEOTitle(newsItem.title);

    // 3. Créer le slug
    const slug = generateSlug(title);

    // 4. Vérifier si l'article existe déjà
    const existingArticle = await Article.findOne({ slug });
    if (existingArticle) {
      logger.info(`⚠️ Article déjà existant: ${slug}`);
      return null;
    }

    // 5. Générer l'extrait
    let excerpt = generateExcerpt(content, 160);
    
    // Valider et tronquer l'extrait à 160 caractères max
    if (excerpt.length > 160) {
      logger.warn(`⚠️ Extrait trop long (${excerpt.length} car.), troncature à 160`);
      excerpt = excerpt.substring(0, 157) + '...';
    }

    // 6. Extraire les mots-clés
    const keywords = extractKeywords(content, 10);

    // 7. Déterminer la catégorie
    const category = determineCategory(newsItem, content);

    // 8. Générer les tags
    const tags = await generateTags(content);

    // 9. Créer l'article
    const article = new Article({
      title: optimizeTitle(title, 60),
      slug,
      content,
      excerpt,
      category,
      tags,
      keywords,
      metaTitle: optimizeTitle(title, 60),
      metaDescription: excerpt,
      sourceUrl: newsItem.link,
      sourceTitle: newsItem.source,
      featuredImage: newsItem.image ? {
        url: newsItem.image,
        alt: title,
        credit: newsItem.source
      } : null,
      status: 'draft',
      publishedAt: new Date()
    });

    await article.save();
    logger.info(`✅ Article généré avec succès: ${slug}`);

    return article;

  } catch (error) {
    logger.error('❌ Erreur lors de la génération d\'article:', error);
    throw error;
  }
}

/**
 * Génère le contenu de l'article (800+ mots)
 */
async function generateContent(newsItem) {
  const prompt = `Tu es un journaliste expert en Intelligence Artificielle. 

Écris un article de blog complet et détaillé (minimum 800 mots) sur le sujet suivant :

Titre: ${newsItem.title}
Description: ${newsItem.description}
Source: ${newsItem.source}

L'article doit :
- Être informatif, engageant et accessible au grand public
- Contenir au minimum 800 mots
- Être structuré avec des sous-titres (utilise des balises HTML <h2>, <h3>)
- Inclure des paragraphes bien formatés (balises <p>)
- Expliquer les concepts techniques de manière claire
- Inclure des exemples concrets et des applications pratiques
- Discuter des implications et de l'impact de cette actualité
- Conclure avec une perspective sur l'avenir
- Être optimisé pour le SEO (mots-clés naturellement intégrés)
- Être écrit en français de qualité journalistique

Format de sortie: HTML pur (sans balises <html>, <body>, commence directement avec le contenu)

Ne mentionne pas que tu es une IA. Écris comme un journaliste professionnel.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 3000,
    temperature: 0.7,
    system: 'Tu es un journaliste expert en Intelligence Artificielle qui écrit des articles de qualité pour un site d\'actualités tech.',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return response.content[0].text.trim();
}

/**
 * Génère un titre optimisé SEO
 */
async function generateSEOTitle(originalTitle) {
  const prompt = `Améliore ce titre pour le SEO et l'engagement.

"${originalTitle}"

CONTRAINTE ABSOLUE : Le titre doit faire EXACTEMENT 60 caractères MAXIMUM (espaces compris).

Exigences :
- Accrocheur et informatif
- Mots-clés pertinents
- En français
- IMPÉRATIF : 60 caractères maximum

Réponds UNIQUEMENT avec le titre, sans guillemets, sans explications.
Si le titre dépasse 60 caractères, RACCOURCIS-LE.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 100,
    temperature: 0.5,
    messages: [{ role: 'user', content: prompt }]
  });

  let title = response.content[0].text.trim().replace(/['"]/g, '');
  
  // Validation et troncature si nécessaire
  if (title.length > 60) {
    logger.warn(`⚠️ Titre trop long (${title.length} car.), troncature à 60`);
    title = title.substring(0, 57) + '...';
  }
  
  return title;
}

/**
 * Génère des tags pertinents
 */
async function generateTags(content) {
  const prompt = `Analyse ce contenu et génère 5-8 tags pertinents pour cet article sur l'IA :

${content.substring(0, 1000)}...

Les tags doivent être :
- Pertinents et spécifiques
- En français
- Courts (1-3 mots)
- Utiles pour la catégorisation

Format: retourne uniquement les tags séparés par des virgules, sans numérotation.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 150,
    temperature: 0.5,
    messages: [{ role: 'user', content: prompt }]
  });

  const tagsString = response.content[0].text.trim();
  return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

/**
 * Détermine la catégorie de l'article
 */
function determineCategory(newsItem, content) {
  const categories = {
    'Machine Learning': ['machine learning', 'apprentissage automatique', 'ml', 'modèle'],
    'Deep Learning': ['deep learning', 'apprentissage profond', 'réseau de neurones', 'neural network'],
    'NLP': ['nlp', 'traitement du langage', 'natural language', 'chatbot', 'gpt', 'llm'],
    'Computer Vision': ['vision par ordinateur', 'computer vision', 'reconnaissance d\'image', 'détection'],
    'Robotique': ['robot', 'robotique', 'automatisation', 'drone'],
    'IA Générative': ['génératif', 'generative', 'dalle', 'midjourney', 'stable diffusion', 'génération'],
    'Éthique IA': ['éthique', 'biais', 'régulation', 'législation', 'responsabilité'],
    'Recherche': ['recherche', 'étude', 'paper', 'publication', 'découverte']
  };

  const text = (newsItem.title + ' ' + newsItem.description + ' ' + content).toLowerCase();

  let maxScore = 0;
  let selectedCategory = 'Actualités';

  for (const [category, keywords] of Object.entries(categories)) {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);

    if (score > maxScore) {
      maxScore = score;
      selectedCategory = category;
    }
  }

  return selectedCategory;
}

/**
 * Génère plusieurs articles à partir d'une liste d'actualités
 */
async function generateMultipleArticles(newsItems, maxArticles = 3) {
  const articles = [];
  let count = 0;

  for (const newsItem of newsItems) {
    if (count >= maxArticles) break;

    try {
      const article = await generateArticle(newsItem);
      if (article) {
        articles.push(article);
        count++;
        
        // Pause pour éviter de surcharger l'API OpenAI
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      logger.error(`❌ Erreur génération article ${newsItem.title}:`, error.message);
      continue;
    }
  }

  logger.info(`✅ ${articles.length} articles générés avec succès`);
  return articles;
}

module.exports = {
  generateArticle,
  generateMultipleArticles,
  generateContent,
  generateSEOTitle,
  generateTags
};
