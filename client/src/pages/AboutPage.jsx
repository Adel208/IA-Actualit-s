import { Brain, Zap, Globe, TrendingUp } from 'lucide-react'
import SEO from '../components/SEO'

export default function AboutPage() {
  return (
    <>
      <SEO
        title="À propos"
        description="Découvrez IA Actualités, votre source automatisée d'actualités sur l'Intelligence Artificielle"
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos d'IA Actualités</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            IA Actualités est une plateforme entièrement automatisée qui vous apporte quotidiennement
            les dernières nouvelles et avancées en Intelligence Artificielle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="bg-card border rounded-lg p-6">
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Automatisé</h3>
              <p className="text-muted-foreground">
                Notre système scrape, analyse et génère automatiquement des articles de qualité
                sur l'actualité de l'IA.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Mises à jour quotidiennes</h3>
              <p className="text-muted-foreground">
                Nouveaux articles publiés plusieurs fois par jour pour rester à jour avec
                les dernières avancées.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Sources multiples</h3>
              <p className="text-muted-foreground">
                Agrégation d'actualités depuis les meilleures sources tech et IA du monde entier.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">SEO optimisé</h3>
              <p className="text-muted-foreground">
                Tous nos articles sont optimisés pour le référencement avec des mots-clés
                pertinents et du contenu de qualité.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 mt-12">Comment ça fonctionne ?</h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold mb-2">Scraping automatique</h3>
                <p className="text-muted-foreground">
                  Notre système scrape automatiquement les dernières actualités IA depuis des sources
                  fiables comme MIT Technology Review, OpenAI, DeepMind, TechCrunch et bien d'autres.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold mb-2">Génération d'articles</h3>
                <p className="text-muted-foreground">
                  Utilisant GPT-4, nous générons des articles complets de 800+ mots, optimisés SEO,
                  avec des titres accrocheurs et du contenu de qualité journalistique.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold mb-2">Optimisation des images</h3>
                <p className="text-muted-foreground">
                  Chaque article est accompagné d'images pertinentes, automatiquement recherchées
                  et optimisées pour le web.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold mb-2">Publication automatique</h3>
                <p className="text-muted-foreground">
                  Les articles sont automatiquement publiés sur le site et partagés sur les réseaux
                  sociaux (Facebook, Twitter, LinkedIn).
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 mt-12">Technologies utilisées</h2>

          <div className="bg-muted rounded-lg p-6">
            <ul className="space-y-2">
              <li><strong>Frontend:</strong> React, TailwindCSS, Vite</li>
              <li><strong>Backend:</strong> Node.js, Express, MongoDB</li>
              <li><strong>IA:</strong> OpenAI GPT-4 pour la génération de contenu</li>
              <li><strong>Scraping:</strong> Puppeteer, Cheerio, RSS Parser</li>
              <li><strong>Automatisation:</strong> Node-cron pour les tâches planifiées</li>
              <li><strong>Images:</strong> Unsplash API, Sharp pour l'optimisation</li>
              <li><strong>SEO:</strong> Sitemap XML, RSS, Structured Data</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
            <p className="text-muted-foreground mb-6">
              Visitez-nous quotidiennement pour découvrir les dernières actualités en Intelligence Artificielle
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
