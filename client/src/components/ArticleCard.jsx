import { Link } from 'react-router-dom'
import { Calendar, Clock, Eye, Heart } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function ArticleCard({ article }) {
  return (
    <article className="group bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* Image */}
      <Link to={`/article/${article.slug}`} className="block relative overflow-hidden aspect-video">
        {article.featuredImage?.url ? (
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl">🤖</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {article.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={`/article/${article.slug}`}>
          <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
        </Link>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(article.publishedAt), 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime} min</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{article.likes}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
