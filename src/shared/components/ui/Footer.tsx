import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                Biblio<span className="text-gradient">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              A plataforma social para amantes de livros. Descubra, avalie e compartilhe suas leituras.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="p-2 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-all">
                <Github size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-all">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-2.5">
              {['Feed', 'Explorar Livros', 'Bibliotecas', 'Gêneros', 'Dashboard'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Comunidade</h4>
            <ul className="space-y-2.5">
              {['Reviews', 'Rankings', 'Badges', 'Metas de Leitura', 'Clubes'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {['Sobre', 'Blog', 'Contato', 'Termos de Uso', 'Privacidade'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">© 2025 BiblioVerse. Todos os direitos reservados.</p>
          <p className="text-xs text-zinc-600">Feito com ❤️ para leitores do Brasil e do mundo</p>
        </div>
      </div>
    </footer>
  )
}
