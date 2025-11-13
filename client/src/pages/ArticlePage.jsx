import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Eye, Heart, Share2, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import SEO from '../components/SEO'
import ArticleCard from '../components/ArticleCard'
import { articlesAPI } from '../lib/api'

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    loadArticle()
    window.scrollTo(0, 0)
  }, [slug])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const response = await articlesAPI.getBySlug(slug)
      setArticle(response.data.article)
      setRelatedArticles(response.data.relatedArticles || [])
    } catch (error) {
      console.error('Erreur chargement article:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (liked || !article) return
    try {
      await articlesAPI.like(article._id)
      setArticle({ ...article, likes: article.likes + 1 })
      setLiked(true)
    } catch (error) {
      console.error('Erreur like:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Partage annulé')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papier!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
        <Link to="/" className="text-primary hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        image={article.featuredImage?.url}
        type="article"
        article={article}
      />

      <article className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>

        {/* Category Badge */}
        <div className="mb-4">
          <Link
            to={`/category/${article.category}`}
            className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            {article.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{article.readTime} min de lecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>{article.views} vues</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>{article.likes} likes</span>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage?.url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.featuredImage.url}
              alt={article.featuredImage.alt || article.title}
              className="w-full h-auto"
            />
            {article.featuredImage.credit && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {article.featuredImage.credit}
              </p>
            )}
          </div>
        )}

        {/* Excerpt */}
        <div className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
          {article.excerpt}
        </div>

        {/* Content */}
        <div
          className="article-content prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 py-8 border-y">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              liked
                ? 'bg-red-100 text-red-600'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span>{liked ? 'Aimé' : 'J\'aime'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Partager</span>
          </button>
        </div>

        {/* Source */}
        {article.sourceUrl && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Source:{' '}
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {article.sourceTitle || 'Lien externe'}
              </a>
            </p>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle._id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
