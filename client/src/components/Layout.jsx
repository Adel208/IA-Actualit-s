import { Link } from 'react-router-dom'
import { Brain, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = [
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Computer Vision',
    'Robotique',
    'IA Générative',
    'Éthique IA',
    'Recherche'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">IA Actualités</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link to="/category/Actualités" className="text-sm font-medium hover:text-primary transition-colors">
                Actualités
              </Link>
              <Link to="/category/Recherche" className="text-sm font-medium hover:text-primary transition-colors">
                Recherche
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                À propos
              </Link>
            </nav>

            {/* Search & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </Link>
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 animate-slide-in">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Accueil
                </Link>
                <Link to="/category/Actualités" className="text-sm font-medium hover:text-primary transition-colors">
                  Actualités
                </Link>
                <Link to="/category/Recherche" className="text-sm font-medium hover:text-primary transition-colors">
                  Recherche
                </Link>
                <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  À propos
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Categories Bar */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 space-x-4 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-bold">IA Actualités</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Votre source quotidienne d'actualités sur l'Intelligence Artificielle.
                Articles générés automatiquement et mis à jour quotidiennement.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
                <li><Link to="/category/Actualités" className="hover:text-primary transition-colors">Actualités</Link></li>
                <li><Link to="/category/Recherche" className="hover:text-primary transition-colors">Recherche</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">À propos</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Catégories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {categories.slice(0, 4).map((category) => (
                  <li key={category}>
                    <Link to={`/category/${category}`} className="hover:text-primary transition-colors">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} IA Actualités. Tous droits réservés.</p>
            <p className="mt-2">Propulsé par l'Intelligence Artificielle</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
