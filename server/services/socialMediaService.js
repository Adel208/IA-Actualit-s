const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const logger = require('../utils/logger');
const SocialPost = require('../models/SocialPost');

/**
 * Génère un texte de post optimisé pour chaque plateforme
 */
function generatePostContent(article, platform) {
  const baseUrl = `${process.env.SITE_URL}/article/${article.slug}`;
  
  const templates = {
    facebook: `🤖 ${article.title}

${article.excerpt}

📖 Lire l'article complet: ${baseUrl}

#IA #IntelligenceArtificielle #Tech #Innovation`,

    twitter: `🤖 ${article.title}

${article.excerpt.substring(0, 200)}...

📖 ${baseUrl}

#IA #AI #Tech`,

    linkedin: `🤖 ${article.title}

${article.excerpt}

Dans cet article, nous explorons les dernières avancées en ${article.category}.

📖 Lire l'article complet: ${baseUrl}

#IntelligenceArtificielle #IA #Tech #Innovation #${article.category.replace(/\s+/g, '')}`
  };

  return templates[platform] || templates.facebook;
}

/**
 * Publie sur Facebook
 */
async function publishToFacebook(article) {
  try {
    // Facebook temporairement désactivé - À configurer plus tard
    logger.info('ℹ️ Publication Facebook désactivée (à configurer)');
    return null;
    
    /* Configuration à faire plus tard:
    if (!process.env.FACEBOOK_ACCESS_TOKEN || !process.env.FACEBOOK_PAGE_ID) {
      logger.warn('⚠️ Facebook non configuré');
      return null;
    }

    const content = generatePostContent(article, 'facebook');
    const imageUrl = article.featuredImage?.url 
      ? `${process.env.SITE_URL}${article.featuredImage.url}`
      : null;

    // Publier sur Facebook via Graph API
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
      {
        message: content,
        link: `${process.env.SITE_URL}/article/${article.slug}`,
        ...(imageUrl && { picture: imageUrl })
      },
      {
        params: {
          access_token: process.env.FACEBOOK_ACCESS_TOKEN
        }
      }
    );

    const postId = response.data.id;
    const postUrl = `https://facebook.com/${postId}`;

    // Enregistrer dans la base de données
    const socialPost = new SocialPost({
      article: article._id,
      platform: 'facebook',
      postId,
      postUrl,
      content,
      status: 'published',
      publishedAt: new Date()
    });

    await socialPost.save();

    // Mettre à jour l'article
    article.socialShares.facebook = true;
    await article.save();

    logger.info(`✅ Publié sur Facebook: ${postUrl}`);
    return socialPost;
    */

  } catch (error) {
    logger.error('❌ Erreur publication Facebook:', error.message);
    return null;
  }
}

/**
 * Publie sur Twitter (X)
 */
async function publishToTwitter(article) {
  try {
    // Twitter temporairement désactivé - À configurer plus tard
    logger.info('ℹ️ Publication Twitter désactivée (à configurer)');
    return null;
    
    /* Configuration à faire plus tard:
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      logger.warn('⚠️ Twitter non configuré');
      return null;
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    const content = generatePostContent(article, 'twitter');

    // Limiter à 280 caractères
    const tweetText = content.length > 280 
      ? content.substring(0, 277) + '...'
      : content;

    // Publier le tweet
    const tweet = await client.v2.tweet(tweetText);

    const postId = tweet.data.id;
    const postUrl = `https://twitter.com/user/status/${postId}`;

    // Enregistrer dans la base de données
    const socialPost = new SocialPost({
      article: article._id,
      platform: 'twitter',
      postId,
      postUrl,
      content: tweetText,
      status: 'published',
      publishedAt: new Date()
    });

    await socialPost.save();

    // Mettre à jour l'article
    article.socialShares.twitter = true;
    await article.save();

    logger.info(`✅ Publié sur Twitter: ${postUrl}`);
    return socialPost;
    */

  } catch (error) {
    logger.error('❌ Erreur publication Twitter:', error.message);
    return null;
  }
}

/**
 * Publie sur LinkedIn
 */
async function publishToLinkedIn(article) {
  try {
    // LinkedIn temporairement désactivé - À configurer plus tard
    logger.info('ℹ️ Publication LinkedIn désactivée (à configurer)');
    return null;
    
    /* Configuration à faire plus tard:
    if (!process.env.LINKEDIN_ACCESS_TOKEN) {
      logger.warn('⚠️ LinkedIn non configuré');
      return null;
    }

    const content = generatePostContent(article, 'linkedin');

    // Obtenir l'ID de l'utilisateur/organisation
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`
      }
    });

    const authorId = `urn:li:person:${profileResponse.data.id}`;

    // Créer le post
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: authorId,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'ARTICLE',
            media: [
              {
                status: 'READY',
                originalUrl: `${process.env.SITE_URL}/article/${article.slug}`,
                title: {
                  text: article.title
                },
                description: {
                  text: article.excerpt
                }
              }
            ]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    const postId = response.data.id;
    const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

    // Enregistrer dans la base de données
    const socialPost = new SocialPost({
      article: article._id,
      platform: 'linkedin',
      postId,
      postUrl,
      content,
      status: 'published',
      publishedAt: new Date()
    });

    await socialPost.save();

    // Mettre à jour l'article
    article.socialShares.linkedin = true;
    await article.save();

    logger.info(`✅ Publié sur LinkedIn: ${postUrl}`);
    return socialPost;
    */

  } catch (error) {
    logger.error('❌ Erreur publication LinkedIn:', error.message);
    return null;
  }
}

/**
 * Publie un article sur tous les réseaux sociaux
 */
async function publishToAllPlatforms(article) {
  logger.info(`📢 Publication de l'article sur les réseaux sociaux: ${article.title}`);

  const results = {
    facebook: null,
    twitter: null,
    linkedin: null
  };

  // Publier sur Facebook
  results.facebook = await publishToFacebook(article);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Pause de 2s

  // Publier sur Twitter
  results.twitter = await publishToTwitter(article);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Pause de 2s

  // Publier sur LinkedIn
  results.linkedin = await publishToLinkedIn(article);

  const successCount = Object.values(results).filter(r => r !== null).length;
  logger.info(`✅ Article publié sur ${successCount}/3 plateformes`);

  return results;
}

/**
 * Publie plusieurs articles
 */
async function publishMultipleArticles(articles) {
  const results = [];

  for (const article of articles) {
    try {
      const result = await publishToAllPlatforms(article);
      results.push({ article: article._id, ...result });

      // Pause entre chaque article
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      logger.error(`❌ Erreur publication article ${article.slug}:`, error);
      results.push({ article: article._id, error: error.message });
    }
  }

  return results;
}

module.exports = {
  publishToFacebook,
  publishToTwitter,
  publishToLinkedIn,
  publishToAllPlatforms,
  publishMultipleArticles,
  generatePostContent
};
