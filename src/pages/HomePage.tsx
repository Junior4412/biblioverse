import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, BookOpen, MapPin, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { BookCard } from '../shared/components/ui/BookCard'
import { ReviewCard } from '../shared/components/ui/ReviewCard'
import { MOCK_BOOKS, MOCK_REVIEWS, STATS, GENRES } from '../shared/constants/mockData'

export function HomePage() {
  const trendingBooks = MOCK_BOOKS.filter((b) => b.trending).slice(0, 6)
  const recentReviews = MOCK_REVIEWS.slice(0, 3)

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-purple-800/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-violet-500/6 rounded-full blur-[80px]" />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-violet-500/20 text-sm animate-fade-in">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-zinc-400">A plataforma social para leitores</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl leading-none tracking-tight">
              <span className="text-foreground">Seu universo</span>
              <br />
              <span className="text-gradient">literário</span>
              <br />
              <span className="text-foreground">começa aqui</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
              Descubra novos livros, compartilhe reviews, acompanhe suas leituras e conecte-se com milhares de leitores apaixonados.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Link to="/register">
              <button className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 group">
                Começar gratuitamente
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/books">
              <button className="btn-ghost text-base px-8 py-3.5 flex items-center gap-2">
                <BookOpen size={18} />
                Explorar livros
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-500 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['Ana', 'Rafael', 'Marina', 'João'].map((name, i) => (
                  <img
                    key={name}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                    className="w-8 h-8 rounded-full ring-2 ring-zinc-950"
                    alt={name}
                  />
                ))}
              </div>
              <span>+47.000 leitores ativos</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
              ))}
              <span>4.9/5 de avaliação</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-violet-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20 border-y border-zinc-800/60 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ label, value, suffix }) => (
              <div key={label} className="text-center">
                <div className="font-display font-black text-4xl text-gradient mb-2">
                  {value}{suffix}
                </div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Books */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-violet-400" />
                <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">Em alta agora</span>
              </div>
              <h2 className="font-display font-bold text-3xl text-foreground">Livros em Destaque</h2>
            </div>
            <Link
              to="/books"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
            >
              Ver todos
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingBooks.map((book, i) => (
              <div
                key={book.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <BookCard book={book} variant="default" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap size={16} className="text-violet-400" />
              <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">Funcionalidades</span>
            </div>
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">
              Tudo que um leitor precisa
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Do simples rastreamento de leituras ao compartilhamento social — BiblioVerse cobre cada aspecto da sua jornada literária.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📚',
                title: 'Catálogo Vasto',
                desc: 'Mais de 128 mil livros catalogados com informações detalhadas, capas e metadados precisos.',
              },
              {
                icon: '⭐',
                title: 'Reviews Ricas',
                desc: 'Escreva reviews detalhadas, avalie com estrelas e interaja com outros leitores.',
              },
              {
                icon: '🗺️',
                title: 'Mapa de Bibliotecas',
                desc: 'Encontre bibliotecas próximas com horários, contatos e rotas integradas.',
              },
              {
                icon: '🏆',
                title: 'Gamificação',
                desc: 'Conquiste badges, mantenha streak de leitura e suba no ranking da comunidade.',
              },
              {
                icon: '📊',
                title: 'Analytics Pessoal',
                desc: 'Acompanhe suas metas, tempo de leitura e estatísticas detalhadas.',
              },
              {
                icon: '🤖',
                title: 'IA Recommendations',
                desc: 'Recomendações personalizadas baseadas no seu histórico e preferências.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="card-base p-6 group"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-violet-300 transition-colors">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-amber-400" />
                <span className="text-xs font-medium text-amber-400 uppercase tracking-widest">Comunidade</span>
              </div>
              <h2 className="font-display font-bold text-3xl text-foreground">Reviews Recentes</h2>
            </div>
            <Link
              to="/feed"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
            >
              Ver feed completo
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="py-24 px-6 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">Explore por Gênero</h2>
            <p className="text-zinc-500">Encontre o próximo livro que vai te conquistar</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {GENRES.slice(0, 14).map(({ name, icon, color, count }) => (
              <Link key={name} to={`/genres?g=${encodeURIComponent(name)}`}>
                <div className="card-base p-4 text-center group cursor-pointer">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {icon}
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">{name}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map teaser */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="card-base overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-transparent z-0" />

            {/* Fake map bg */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237C3AED' fill-opacity='0.3'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-20 p-10 md:p-16 max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-violet-400" />
                <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">Bibliotecas</span>
              </div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-4">
                Descubra Bibliotecas Próximas
              </h2>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Mapeamos mais de 2.341 bibliotecas no Brasil com horários, contatos, avaliações e rotas para facilitar sua visita.
              </p>
              <Link to="/libraries">
                <button className="btn-primary flex items-center gap-2">
                  <MapPin size={16} />
                  Ver mapa completo
                </button>
              </Link>
            </div>

            {/* Floating library cards */}
            <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3">
              {['Biblioteca Mário de Andrade', 'Biblioteca Villa-Lobos', 'Biblioteca Nacional'].map((lib, i) => (
                <div
                  key={lib}
                  className="glass border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-3 animate-float"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <MapPin size={14} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{lib}</p>
                    <div className="flex items-center gap-1">
                      <Star size={9} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-zinc-500">4.8</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-radial from-violet-900/20 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-display font-black text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Pronto para explorar<br />
            <span className="text-gradient">seu próximo livro?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
            Junte-se a milhares de leitores apaixonados. Gratuito para sempre.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 group shadow-glow">
                Criar conta grátis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/books">
              <button className="btn-ghost text-base px-8 py-4">
                Explorar sem cadastro
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
