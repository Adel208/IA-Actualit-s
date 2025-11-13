#!/bin/bash

echo "🤖 IA Actualités - Démarrage du système"
echo "========================================"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📝 Création depuis .env.example..."
    cp .env.example .env
    echo "✅ Fichier .env créé"
    echo ""
    echo "⚠️  IMPORTANT: Éditez le fichier .env et ajoutez vos clés API"
    echo "   - OPENAI_API_KEY (obligatoire)"
    echo "   - MONGODB_URI (obligatoire)"
    echo ""
    read -p "Appuyez sur Entrée après avoir configuré .env..."
fi

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    cd client && npm install && cd ..
fi

echo ""
echo "🚀 Démarrage de l'application..."
echo ""
echo "✅ Frontend: http://localhost:3000"
echo "✅ Backend: http://localhost:5000"
echo ""
echo "💡 Pour générer du contenu, ouvrez un nouveau terminal et lancez:"
echo "   npm run generate"
echo ""

npm run dev
