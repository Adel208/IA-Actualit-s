# 🤖 IA Actualités - Site Automatisé d'Actualités sur l'Intelligence Artificielle

Site web moderne et entièrement automatisé qui publie quotidiennement des articles sur l'actualité de l'IA, avec génération automatique de contenu SEO-optimisé et partage sur les réseaux sociaux.

## 🚀 Fonctionnalités

### Automatisation Complète
- ✅ **Scraping automatique** : Collecte quotidienne des dernières actualités IA depuis plusieurs sources
- ✅ **Génération d'articles** : Création automatique d'articles de 800+ mots avec normes SEO
- ✅ **Images automatiques** : Téléchargement et optimisation d'images pertinentes
- ✅ **Publication automatique** : Partage automatique sur Facebook, Twitter, LinkedIn
- ✅ **Planification CRON** : Exécution automatique des tâches quotidiennes

### SEO & Performance
- ✅ Optimisation SEO complète (meta tags, structured data, sitemap)
- ✅ URLs optimisées (slugs SEO-friendly)
- ✅ Génération automatique de sitemap.xml
- ✅ Flux RSS automatique
- ✅ Images optimisées avec Sharp
- ✅ Compression et cache

### Design Moderne
- ✅ Interface responsive et fluide
- ✅ Design moderne avec React + TailwindCSS
- ✅ Composants shadcn/ui
- ✅ Icônes Lucide React
- ✅ Animations et transitions fluides
- ✅ Mode sombre/clair

## 📋 Prérequis

- Node.js 18+ 
- MongoDB 6+
- Compte OpenAI (pour génération d'articles)
- Comptes API réseaux sociaux (Facebook, Twitter, LinkedIn)
- Compte Unsplash (pour images)

## 🛠️ Installation

### 1. Cloner et installer les dépendances

```bash
cd /Users/admin/iaai
npm run install-all
```

### 2. Configuration

Copier `.env.example` vers `.env` et remplir les clés API :

```bash
cp .env.example .env
```

Éditer `.env` avec vos clés API :
- OpenAI API Key (obligatoire)
- Facebook, Twitter, LinkedIn tokens
- Unsplash Access Key
- MongoDB URI

### 3. Démarrer MongoDB

```bash
# macOS avec Homebrew
brew services start mongodb-community

# Ou avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Lancer l'application

```bash
# Mode développement (frontend + backend)
npm run dev

# Backend seul
npm run server

# Frontend seul
npm run client

# Production
npm run build
npm start
```

## 🤖 Automatisation

### Lancer les jobs manuellement

```bash
# Scraper les actualités
npm run scrape

# Générer des articles
npm run generate

# Publier sur les réseaux sociaux
npm run publish
```

### Automatisation avec CRON

Lancer le gestionnaire de tâches automatiques :

```bash
npm run cron
```

Configuration par défaut :
- **Scraping** : Toutes les 6 heures
- **Génération** : 3 fois par jour (8h, 14h, 20h)
- **Publication** : 3 fois par jour (9h, 15h, 21h)

Modifier dans `.env` :
```
SCRAPE_CRON=0 */6 * * *
GENERATE_CRON=0 8,14,20 * * *
PUBLISH_CRON=0 9,15,21 * * *
```

## 📁 Structure du Projet

```
iaai/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/         # Composants React
│   │   ├── pages/              # Pages
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Utilitaires
│   │   └── App.jsx             # App principale
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Node.js
│   ├── models/                 # Modèles MongoDB
│   │   ├── Article.js
│   │   ├── NewsSource.js
│   │   └── SocialPost.js
│   ├── routes/                 # Routes API
│   │   ├── articles.js
│   │   └── admin.js
│   ├── services/               # Services métier
│   │   ├── scraper.js
│   │   ├── articleGenerator.js
│   │   ├── imageService.js
│   │   └── socialMediaService.js
│   ├── jobs/                   # Jobs automatiques
│   │   ├── scrapeNews.js
│   │   ├── generateArticles.js
│   │   ├── publishToSocial.js
│   │   └── cronManager.js
│   ├── utils/                  # Utilitaires
│   │   ├── logger.js
│   │   └── seoHelper.js
│   └── index.js                # Point d'entrée
│
├── package.json
├── .env.example
└── README.md
```

## 🔑 Configuration des APIs

### OpenAI
1. Créer un compte sur https://platform.openai.com
2. Générer une clé API
3. Ajouter dans `.env` : `OPENAI_API_KEY=sk-...`

### Facebook
1. Créer une app sur https://developers.facebook.com
2. Obtenir App ID, App Secret, Access Token
3. Créer une page Facebook et obtenir le Page ID

### Twitter (X)
1. Créer une app sur https://developer.twitter.com
2. Obtenir API Key, API Secret, Access Token, Access Secret

### Unsplash
1. Créer une app sur https://unsplash.com/developers
2. Obtenir Access Key

## 🎨 Personnalisation

### Modifier les sources d'actualités

Éditer `server/services/scraper.js` pour ajouter/modifier les sources RSS.

### Modifier le style du site

Le design utilise TailwindCSS. Personnaliser dans :
- `client/tailwind.config.js` : Configuration Tailwind
- `client/src/components/` : Composants React

### Modifier les prompts de génération

Éditer `server/services/articleGenerator.js` pour personnaliser les prompts OpenAI.

## 📊 API Endpoints

### Articles
- `GET /api/articles` - Liste des articles
- `GET /api/articles/:slug` - Article par slug
- `GET /api/articles/category/:category` - Articles par catégorie
- `POST /api/articles` - Créer un article (admin)

### Admin
- `POST /api/admin/scrape` - Lancer le scraping
- `POST /api/admin/generate` - Générer des articles
- `POST /api/admin/publish` - Publier sur réseaux sociaux

### SEO
- `GET /sitemap.xml` - Sitemap
- `GET /rss.xml` - Flux RSS

## 🚀 Déploiement

### Avec PM2 (recommandé)

```bash
npm install -g pm2

# Démarrer l'app
pm2 start server/index.js --name "ia-actualites"

# Démarrer les jobs CRON
pm2 start server/jobs/cronManager.js --name "ia-cron"

# Sauvegarder la configuration
pm2 save
pm2 startup
```

### Variables d'environnement en production

Modifier `.env` :
```
NODE_ENV=production
SITE_URL=https://votre-domaine.com
```

## 📈 Monitoring

Les logs sont enregistrés avec Winston :
- `logs/error.log` : Erreurs
- `logs/combined.log` : Tous les logs

## 🔒 Sécurité

- Helmet.js pour les headers HTTP
- Rate limiting sur les APIs
- Validation des données avec Joi
- Variables d'environnement pour les secrets
- CORS configuré

## 🤝 Support

Pour toute question ou problème :
1. Vérifier les logs dans `logs/`
2. Vérifier la configuration `.env`
3. Vérifier que MongoDB est démarré
4. Vérifier les clés API

## 📝 Licence

MIT

---

**Développé avec ❤️ pour l'automatisation de contenu IA**
