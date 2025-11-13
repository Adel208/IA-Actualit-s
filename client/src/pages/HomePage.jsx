import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Sparkles } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import SEO from '../components/SEO'
import { articlesAPI } from '../lib/api'

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [latestArticles, setLatestArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const [featured, latest] = await Promise.all([
        articlesAPI.getFeatured(),
        articlesAPI.getLatest(9)
      ])
      setFeaturedArticles(featured.data)
      setLatestArticles(latest.data)
    } catch (error) {
      console.error('Erreur chargement articles:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <SEO />
      
      {/* Hero Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Actualités IA Quotidiennes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les dernières avancées en Intelligence Artificielle. 
            Articles générés automatiquement et mis à jour tous les jours.
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Articles en vedette</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Derniers articles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Ne manquez aucune actualité IA</h3>
          <p className="text-muted-foreground mb-6">
            Nouveaux articles publiés quotidiennement sur les dernières avancées en Intelligence Artificielle
          </p>
          <Link
            to="/category/Actualités"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voir toutes les actualités
          </Link>
        </div>
      </section>
    </>
  )
}
