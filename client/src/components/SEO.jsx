import { Helmet } from 'react-helmet-async'

export default function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  article 
}) {
  const siteTitle = 'IA Actualités'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const siteDescription = description || 'Votre source quotidienne d\'actualités sur l\'Intelligence Artificielle'
  const siteUrl = url || window.location.href
  const siteImage = image || '/og-image.jpg'

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* Article specific */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedAt} />
          <meta property="article:modified_time" content={article.updatedAt} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.category} />
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
    </Helmet>
  )
}
