# 🚀 Guide d'Installation - IA Actualités

## Étape 1 : Installation des dépendances

### Backend
```bash
cd /Users/admin/iaai
npm install
```

### Frontend
```bash
cd client
npm install
cd ..
```

## Étape 2 : Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Éditez le fichier `.env` et remplissez les valeurs suivantes :

### Configuration obligatoire

```env
# MongoDB (requis)
MONGODB_URI=mongodb://localhost:27017/ia-actualites

# OpenAI (requis pour la génération d'articles)
OPENAI_API_KEY=sk-votre-cle-openai-ici
```

### Configuration optionnelle (réseaux sociaux)

```env
# Facebook
FACEBOOK_APP_ID=votre_app_id
FACEBOOK_APP_SECRET=votre_app_secret
FACEBOOK_ACCESS_TOKEN=votre_access_token
FACEBOOK_PAGE_ID=votre_page_id

# Twitter
TWITTER_API_KEY=votre_api_key
TWITTER_API_SECRET=votre_api_secret
TWITTER_ACCESS_TOKEN=votre_access_token
TWITTER_ACCESS_SECRET=votre_access_secret

# LinkedIn
LINKEDIN_CLIENT_ID=votre_client_id
LINKEDIN_CLIENT_SECRET=votre_client_secret
LINKEDIN_ACCESS_TOKEN=votre_access_token

# Unsplash (pour les images)
UNSPLASH_ACCESS_KEY=votre_unsplash_key
```

## Étape 3 : Démarrer MongoDB

### Option 1 : MongoDB local (macOS avec Homebrew)
```bash
brew services start mongodb-community
```

### Option 2 : MongoDB avec Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option 3 : MongoDB Atlas (cloud)
Utilisez l'URL de connexion MongoDB Atlas dans `MONGODB_URI`

## Étape 4 : Lancer l'application

### Mode développement (recommandé pour tester)
```bash
npm run dev
```

Cela démarre :
- Backend sur http://localhost:5000
- Frontend sur http://localhost:3000

### Mode production
```bash
# Build du frontend
npm run build

# Démarrer le serveur
npm start
```

## Étape 5 : Tester le système

### Tester le scraping
```bash
npm run scrape
```

### Générer des articles
```bash
npm run generate
```

### Publier sur les réseaux sociaux
```bash
npm run publish
```

## Étape 6 : Activer l'automatisation

Pour activer les tâches automatiques quotidiennes :

```bash
npm run cron
```

Cela lancera :
- Scraping toutes les 6 heures
- Génération d'articles 3 fois par jour (8h, 14h, 20h)
- Publication sociale 3 fois par jour (9h, 15h, 21h)

### Avec PM2 (production)
```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start server/index.js --name "ia-actualites"

# Démarrer les jobs CRON
pm2 start server/jobs/cronManager.js --name "ia-cron"

# Sauvegarder la configuration
pm2 save
pm2 startup
```

## 🔧 Dépannage

### MongoDB ne démarre pas
```bash
# Vérifier le statut
brew services list

# Redémarrer
brew services restart mongodb-community
```

### Port déjà utilisé
Modifiez le port dans `.env` :
```env
PORT=5001
```

### Erreur OpenAI
Vérifiez que votre clé API OpenAI est valide et que vous avez des crédits.

### Erreur de connexion MongoDB
Vérifiez que MongoDB est démarré et que l'URL de connexion est correcte.

## 📱 Accès à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Health Check** : http://localhost:5000/health
- **Sitemap** : http://localhost:5000/sitemap.xml
- **RSS** : http://localhost:5000/rss.xml

## 🎯 Prochaines étapes

1. Configurez vos clés API (OpenAI obligatoire)
2. Testez le scraping et la génération d'articles
3. Vérifiez que les articles apparaissent sur le frontend
4. Configurez les réseaux sociaux (optionnel)
5. Activez l'automatisation avec CRON

## 💡 Conseils

- Commencez avec OpenAI uniquement pour tester
- Ajoutez les réseaux sociaux progressivement
- Surveillez les logs dans `logs/`
- Utilisez PM2 pour la production

Bon lancement ! 🚀
