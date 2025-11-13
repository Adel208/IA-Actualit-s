# 📋 Liste des Commandes - IA Actualités

## 🚀 Démarrage

```bash
# Démarrage automatique (recommandé)
./start.sh

# Développement (frontend + backend)
npm run dev

# Backend seul
npm run server

# Frontend seul
npm run client

# Production
npm run build
npm start
```

## 📦 Installation

```bash
# Installer toutes les dépendances
npm run install-all

# Backend uniquement
npm install

# Frontend uniquement
cd client && npm install
```

## 🤖 Jobs automatiques

```bash
# Scraper les actualités
npm run scrape

# Générer des articles
npm run generate

# Publier sur les réseaux sociaux
npm run publish

# Lancer le gestionnaire CRON (automatisation complète)
npm run cron
```

## 🗄️ MongoDB

```bash
# Démarrer MongoDB (Homebrew)
brew services start mongodb-community

# Arrêter MongoDB
brew services stop mongodb-community

# Redémarrer MongoDB
brew services restart mongodb-community

# MongoDB avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker start mongodb
docker stop mongodb

# Se connecter à MongoDB
mongosh

# Dans mongosh
use ia-actualites
db.articles.find().limit(5)
db.articles.countDocuments()
```

## 🔍 Monitoring & Logs

```bash
# Voir les logs en temps réel
tail -f logs/combined.log

# Voir uniquement les erreurs
tail -f logs/error.log

# Vérifier l'état du serveur
curl http://localhost:5000/health

# Statistiques
curl http://localhost:5000/api/admin/stats
```

## 🧪 Tests manuels

```bash
# Tester le scraping
npm run scrape

# Tester la génération (peut prendre 2-3 minutes)
npm run generate

# Tester la publication sociale
npm run publish

# Vérifier les articles générés
curl http://localhost:5000/api/articles/latest
```

## 🛠️ Développement

```bash
# Lancer en mode développement
npm run dev

# Build du frontend
cd client && npm run build

# Preview du build
cd client && npm run preview
```

## 📊 API Endpoints

```bash
# Articles
curl http://localhost:5000/api/articles
curl http://localhost:5000/api/articles/latest
curl http://localhost:5000/api/articles/featured
curl http://localhost:5000/api/articles/category/Machine%20Learning

# Recherche
curl "http://localhost:5000/api/articles/search?q=GPT-4"

# Admin
curl http://localhost:5000/api/admin/stats
curl http://localhost:5000/api/admin/articles
curl http://localhost:5000/api/admin/sources

# SEO
curl http://localhost:5000/sitemap.xml
curl http://localhost:5000/rss.xml
```

## 🔧 Maintenance

```bash
# Nettoyer node_modules
rm -rf node_modules client/node_modules
npm run install-all

# Nettoyer les logs
rm -rf logs/*.log

# Sauvegarder MongoDB
mongodump --db ia-actualites --out ./backup

# Restaurer MongoDB
mongorestore --db ia-actualites ./backup/ia-actualites

# Vérifier les dépendances obsolètes
npm outdated
cd client && npm outdated
```

## 🚀 Production avec PM2

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start server/index.js --name "ia-actualites"

# Démarrer les jobs CRON
pm2 start server/jobs/cronManager.js --name "ia-cron"

# Lister les processus
pm2 list

# Voir les logs
pm2 logs ia-actualites
pm2 logs ia-cron

# Arrêter
pm2 stop ia-actualites
pm2 stop ia-cron

# Redémarrer
pm2 restart ia-actualites
pm2 restart ia-cron

# Supprimer
pm2 delete ia-actualites
pm2 delete ia-cron

# Sauvegarder la configuration
pm2 save

# Démarrage automatique au boot
pm2 startup

# Monitoring
pm2 monit
```

## 🐛 Dépannage

```bash
# Vérifier les ports utilisés
lsof -i :3000
lsof -i :5000
lsof -i :27017

# Tuer un processus sur un port
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:5000)

# Vérifier MongoDB
brew services list | grep mongodb

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📝 Git

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Initial commit - Site IA Actualités"

# Ajouter un remote
git remote add origin https://github.com/votre-username/ia-actualites.git

# Push
git push -u origin main
```

## 🌐 Déploiement

```bash
# Build pour production
npm run build

# Variables d'environnement production
export NODE_ENV=production
export SITE_URL=https://votre-domaine.com

# Démarrer en production
npm start
```

## 📱 Tests d'intégration

```bash
# Tester l'API
curl -X GET http://localhost:5000/api/articles/latest

# Tester le scraping manuel
curl -X POST http://localhost:5000/api/admin/scrape

# Tester la génération manuelle
curl -X POST http://localhost:5000/api/admin/generate

# Tester la publication manuelle
curl -X POST http://localhost:5000/api/admin/publish
```

## 🔐 Sécurité

```bash
# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix

# Mettre à jour les dépendances
npm update
cd client && npm update
```

## 📊 Statistiques MongoDB

```javascript
// Dans mongosh
use ia-actualites

// Compter les articles
db.articles.countDocuments()

// Articles par catégorie
db.articles.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])

// Articles les plus vus
db.articles.find().sort({ views: -1 }).limit(10)

// Articles récents
db.articles.find().sort({ publishedAt: -1 }).limit(10)

// Supprimer les anciens articles (90 jours)
db.articles.deleteMany({
  publishedAt: { $lt: new Date(Date.now() - 90*24*60*60*1000) }
})
```

## 🎯 Commandes rapides

```bash
# Tout en un : installer et démarrer
npm run install-all && npm run dev

# Générer du contenu rapidement
npm run scrape && npm run generate

# Cycle complet
npm run scrape && npm run generate && npm run publish

# Redémarrer tout
pm2 restart all

# Voir tout
pm2 logs --lines 100
```

## 💡 Astuces

```bash
# Exécuter en arrière-plan
nohup npm run cron > cron.log 2>&1 &

# Voir les processus Node
ps aux | grep node

# Libérer de la mémoire
pm2 reload all

# Exporter les logs
pm2 logs --out > logs_export.txt

# Surveiller les ressources
pm2 monit
```

---

**💡 Conseil** : Ajoutez ces commandes à vos alias bash/zsh pour un accès rapide !

```bash
# Dans ~/.zshrc ou ~/.bashrc
alias ia-dev="cd /Users/admin/iaai && npm run dev"
alias ia-gen="cd /Users/admin/iaai && npm run generate"
alias ia-logs="tail -f /Users/admin/iaai/logs/combined.log"
```
