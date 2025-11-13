import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import SEO from '../components/SEO'
import { articlesAPI } from '../lib/api'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [])

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setSearched(true)
      const response = await articlesAPI.search(searchQuery)
      setArticles(response.data.articles)
    } catch (error) {
      console.error('Erreur recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query })
      performSearch(query)
    }
  }

  return (
    <>
      <SEO
        title="Recherche"
        description="Recherchez des articles sur l'Intelligence Artificielle"
      />

      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Rechercher des articles
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher des articles sur l'IA..."
            className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && searched && (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground">
              {articles.length} résultat{articles.length > 1 ? 's' : ''} pour "{searchParams.get('q')}"
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun article trouvé. Essayez avec d'autres mots-clés.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Entrez un mot-clé pour rechercher des articles
          </p>
        </div>
      )}
    </>
  )
}
