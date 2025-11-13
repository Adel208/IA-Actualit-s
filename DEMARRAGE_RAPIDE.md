# ⚡ Démarrage Rapide - IA Actualités

## 🚀 Installation en 5 minutes

### 1. Installer les dépendances
```bash
cd /Users/admin/iaai
npm install
cd client && npm install && cd ..
```

### 2. Configurer MongoDB
```bash
# Option simple : Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou avec Homebrew (macOS)
brew services start mongodb-community
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Éditez `.env` et ajoutez **au minimum** :
```env
MONGODB_URI=mongodb://localhost:27017/ia-actualites
OPENAI_API_KEY=sk-votre-cle-openai
```

### 4. Lancer l'application
```bash
npm run dev
```

✅ Frontend : http://localhost:3000  
✅ Backend : http://localhost:5000

### 5. Générer le premier contenu
```bash
# Dans un nouveau terminal
npm run generate
```

Attendez 2-3 minutes, puis rafraîchissez http://localhost:3000

## 🎯 C'est tout !

Votre site d'actualités IA est maintenant opérationnel !

## 📋 Commandes essentielles

```bash
# Développement
npm run dev              # Lance frontend + backend

# Jobs manuels
npm run scrape          # Scraper les actualités
npm run generate        # Générer des articles
npm run publish         # Publier sur réseaux sociaux

# Automatisation
npm run cron            # Active les tâches automatiques

# Production
npm run build           # Build le frontend
npm start               # Lance en production
```

## 🔑 Obtenir les clés API

### OpenAI (OBLIGATOIRE)
1. Aller sur https://platform.openai.com
2. Créer un compte
3. Générer une clé API
4. Ajouter dans `.env` : `OPENAI_API_KEY=sk-...`

### Unsplash (optionnel, pour les images)
1. Aller sur https://unsplash.com/developers
2. Créer une app
3. Copier l'Access Key
4. Ajouter dans `.env` : `UNSPLASH_ACCESS_KEY=...`

### Facebook, Twitter, LinkedIn (optionnel)
Voir la documentation complète dans `README.md`

## 🎨 Structure du projet

```
iaai/
├── server/              # Backend Node.js
│   ├── models/         # Modèles MongoDB
│   ├── routes/         # Routes API
│   ├── services/       # Services (scraping, génération, etc.)
│   ├── jobs/           # Jobs automatiques
│   └── index.js        # Point d'entrée
│
├── client/             # Frontend React
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── pages/      # Pages
│   │   └── lib/        # Utilitaires
│   └── package.json
│
├── package.json        # Dépendances backend
├── .env.example        # Template de configuration
└── README.md           # Documentation complète
```

## 💡 Fonctionnalités principales

✅ **Scraping automatique** depuis 8+ sources d'actualités IA  
✅ **Génération d'articles** de 800+ mots avec GPT-4  
✅ **Optimisation SEO** complète (meta tags, sitemap, RSS)  
✅ **Images automatiques** via Unsplash  
✅ **Publication sociale** sur Facebook, Twitter, LinkedIn  
✅ **Interface moderne** avec React + TailwindCSS  
✅ **Responsive** et fluide sur tous les appareils  
✅ **Automatisation CRON** pour publication quotidienne  

## 🐛 Problèmes courants

### MongoDB ne démarre pas
```bash
brew services restart mongodb-community
# ou
docker restart mongodb
```

### Erreur OpenAI "Invalid API Key"
Vérifiez que votre clé commence par `sk-` et est valide

### Port 3000 ou 5000 déjà utilisé
Modifiez le port dans `.env` :
```env
PORT=5001
```

### Aucun article généré
1. Vérifiez les logs : `tail -f logs/combined.log`
2. Testez le scraping : `npm run scrape`
3. Vérifiez votre clé OpenAI

## 📚 Documentation complète

- **README.md** : Vue d'ensemble et fonctionnalités
- **INSTALLATION.md** : Guide d'installation détaillé
- **GUIDE_UTILISATION.md** : Guide d'utilisation complet

## 🎉 Prochaines étapes

1. ✅ Générez vos premiers articles
2. ✅ Personnalisez le design dans `client/src/`
3. ✅ Ajoutez vos propres sources RSS
4. ✅ Configurez les réseaux sociaux
5. ✅ Activez l'automatisation avec `npm run cron`
6. ✅ Déployez en production

## 🚀 Déploiement rapide

### Avec PM2
```bash
npm install -g pm2
pm2 start server/index.js --name "ia-actualites"
pm2 start server/jobs/cronManager.js --name "ia-cron"
pm2 save
pm2 startup
```

### Variables d'environnement production
```env
NODE_ENV=production
SITE_URL=https://votre-domaine.com
```

---

**Besoin d'aide ?** Consultez les logs dans `logs/` ou la documentation complète.

**Bon lancement ! 🎊**
