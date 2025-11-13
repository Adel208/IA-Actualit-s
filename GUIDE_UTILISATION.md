# 📖 Guide d'Utilisation - IA Actualités

## Vue d'ensemble

IA Actualités est un système entièrement automatisé qui :
1. **Scrape** les actualités IA depuis plusieurs sources
2. **Génère** des articles de 800+ mots optimisés SEO
3. **Publie** automatiquement sur le site et les réseaux sociaux

## 🎯 Utilisation quotidienne

### Automatisation complète (recommandé)

Une fois configuré, le système fonctionne de manière autonome :

```bash
npm run cron
```

Le système exécutera automatiquement :
- **6h, 12h, 18h, 00h** : Scraping des actualités
- **8h, 14h, 20h** : Génération de 3 nouveaux articles
- **9h, 15h, 21h** : Publication sur les réseaux sociaux

### Exécution manuelle

#### 1. Scraper les actualités
```bash
npm run scrape
```
Collecte les dernières actualités IA depuis :
- MIT Technology Review
- OpenAI Blog
- DeepMind Blog
- TechCrunch AI
- VentureBeat AI
- The Verge AI
- Et plus...

#### 2. Générer des articles
```bash
npm run generate
```
Génère automatiquement 3 articles :
- Contenu de 800+ mots
- Optimisation SEO complète
- Images pertinentes
- Catégorisation automatique
- Tags et mots-clés

#### 3. Publier sur les réseaux sociaux
```bash
npm run publish
```
Partage les articles sur :
- Facebook
- Twitter (X)
- LinkedIn

## 📊 Interface d'administration

### Accéder aux statistiques
```
GET http://localhost:5000/api/admin/stats
```

Retourne :
- Nombre total d'articles
- Vues et likes totaux
- Posts sur réseaux sociaux
- Articles récents

### Gérer les articles

#### Lister tous les articles
```
GET http://localhost:5000/api/admin/articles
```

#### Modifier un article
```
PATCH http://localhost:5000/api/admin/articles/:id
```

#### Supprimer un article
```
DELETE http://localhost:5000/api/admin/articles/:id
```

### Gérer les sources

#### Lister les sources
```
GET http://localhost:5000/api/admin/sources
```

#### Activer/désactiver une source
```
PATCH http://localhost:5000/api/admin/sources/:id
{
  "active": false
}
```

## 🎨 Personnalisation

### Modifier les catégories

Éditez `server/services/articleGenerator.js` :
```javascript
function determineCategory(newsItem, content) {
  const categories = {
    'Votre Catégorie': ['mot-clé1', 'mot-clé2'],
    // ...
  }
}
```

### Ajouter des sources RSS

Éditez `server/services/scraper.js` :
```javascript
const AI_NEWS_SOURCES = [
  {
    name: 'Nouvelle Source',
    url: 'https://example.com/feed',
    type: 'rss',
    category: 'Actualités'
  },
  // ...
]
```

### Modifier les prompts de génération

Éditez `server/services/articleGenerator.js` dans la fonction `generateContent()` pour personnaliser le style et le ton des articles.

### Personnaliser le design

Le frontend utilise TailwindCSS :
- **Couleurs** : `client/tailwind.config.js`
- **Composants** : `client/src/components/`
- **Pages** : `client/src/pages/`

## 📈 Monitoring

### Consulter les logs

```bash
# Logs d'erreurs
tail -f logs/error.log

# Tous les logs
tail -f logs/combined.log
```

### Vérifier l'état du système

```bash
curl http://localhost:5000/health
```

### Surveiller MongoDB

```bash
# Se connecter à MongoDB
mongosh

# Utiliser la base de données
use ia-actualites

# Compter les articles
db.articles.countDocuments()

# Voir les derniers articles
db.articles.find().sort({publishedAt: -1}).limit(5)
```

## 🔄 Workflow typique

### Première utilisation

1. **Initialiser les sources**
```bash
npm run scrape
```

2. **Générer les premiers articles**
```bash
npm run generate
```

3. **Vérifier sur le frontend**
Ouvrir http://localhost:3000

4. **Publier sur les réseaux sociaux**
```bash
npm run publish
```

### Utilisation quotidienne

Laissez simplement le CRON tourner :
```bash
npm run cron
```

Le système s'occupe de tout automatiquement !

## 🛠️ Maintenance

### Nettoyer les anciens articles

```javascript
// Dans MongoDB
db.articles.deleteMany({
  publishedAt: { $lt: new Date(Date.now() - 90*24*60*60*1000) }
})
```

### Réinitialiser les statistiques

```javascript
db.articles.updateMany({}, {
  $set: { views: 0, likes: 0 }
})
```

### Sauvegarder la base de données

```bash
mongodump --db ia-actualites --out ./backup
```

### Restaurer la base de données

```bash
mongorestore --db ia-actualites ./backup/ia-actualites
```

## 📱 API Publique

### Récupérer les articles

```javascript
// Derniers articles
GET /api/articles/latest?limit=10

// Articles par catégorie
GET /api/articles/category/Machine%20Learning

// Rechercher
GET /api/articles/search?q=GPT-4

// Article spécifique
GET /api/articles/:slug
```

### Exemple d'intégration

```javascript
// Récupérer les derniers articles
fetch('http://localhost:5000/api/articles/latest?limit=5')
  .then(res => res.json())
  .then(articles => {
    articles.forEach(article => {
      console.log(article.title)
    })
  })
```

## 🎯 Optimisation SEO

Le système génère automatiquement :
- ✅ Titres optimisés (max 60 caractères)
- ✅ Meta descriptions (max 160 caractères)
- ✅ Mots-clés pertinents
- ✅ URLs SEO-friendly (slugs)
- ✅ Sitemap XML
- ✅ Flux RSS
- ✅ Structured Data (Schema.org)
- ✅ Open Graph tags
- ✅ Twitter Cards

### Vérifier le SEO

- **Sitemap** : http://localhost:5000/sitemap.xml
- **RSS** : http://localhost:5000/rss.xml

## 💡 Astuces

### Augmenter la fréquence de publication

Modifiez `.env` :
```env
GENERATE_CRON=0 */4 * * *  # Toutes les 4 heures
```

### Générer plus d'articles par batch

Éditez `server/jobs/generateArticles.js` :
```javascript
const bestArticles = selectBestArticles(scrapedArticles, 5); // Au lieu de 3
```

### Améliorer la qualité des articles

Dans `server/services/articleGenerator.js`, augmentez `max_tokens` :
```javascript
max_tokens: 3000  // Au lieu de 2500
```

## 🚨 Résolution de problèmes

### Les articles ne se génèrent pas
- Vérifiez votre clé OpenAI
- Vérifiez les crédits OpenAI
- Consultez `logs/error.log`

### Pas d'articles scrapés
- Vérifiez votre connexion internet
- Les sources RSS peuvent être temporairement indisponibles
- Consultez les erreurs dans `logs/combined.log`

### Publication sociale échoue
- Vérifiez les tokens d'accès
- Les tokens peuvent expirer
- Vérifiez les permissions des apps

## 📞 Support

Pour toute question :
1. Consultez les logs dans `logs/`
2. Vérifiez la configuration `.env`
3. Testez les composants individuellement
4. Consultez la documentation des APIs tierces

---

**Bonne utilisation ! 🎉**
