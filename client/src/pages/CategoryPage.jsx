import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Folder } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import SEO from '../components/SEO'
import { articlesAPI } from '../lib/api'

export default function CategoryPage() {
  const { category } = useParams()
  const [articles, setArticles] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadArticles()
    window.scrollTo(0, 0)
  }, [category, page])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const response = await articlesAPI.getByCategory(category, { page, limit: 12 })
      setArticles(response.data.articles)
      setPagination(response.data.pagination)
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
      <SEO
        title={`${category} - Actualités IA`}
        description={`Découvrez les derniers articles sur ${category} en Intelligence Artificielle`}
      />

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Folder className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">{category}</h1>
        </div>
        <p className="text-muted-foreground">
          {articles.length} article{articles.length > 1 ? 's' : ''} dans cette catégorie
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun article dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} sur {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
