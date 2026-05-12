import { MapPin, Clock, Phone, Globe, Star } from 'lucide-react'
import { MOCK_LIBRARIES } from '../shared/constants/mockData'

export function LibrariesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">Bibliotecas</h1>
        <p className="text-zinc-400">Encontre bibliotecas próximas e explore acervos incríveis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Bibliotecas Mapeadas', value: '2.341+' },
          { label: 'Cidades', value: '487+' },
          { label: 'Acervo Total', value: '12M+' },
        ].map(({ label, value }) => (
          <div key={label} className="card-base p-5 text-center">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Libraries list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_LIBRARIES.map((lib) => (
          <div key={lib.id} className="card-base p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg leading-tight">{lib.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-zinc-500" />
                  <span className="text-sm text-zinc-500">{lib.city}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 flex-shrink-0">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-amber-400">{lib.rating}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin size={13} className="text-zinc-600 flex-shrink-0" />
                <span>{lib.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock size={13} className="text-zinc-600 flex-shrink-0" />
                <span>{lib.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone size={13} className="text-zinc-600 flex-shrink-0" />
                <span>{lib.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-2">
              <a
                href={`https://maps.google.com/?q=${lib.lat},${lib.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <MapPin size={12} /> Ver no Mapa
              </a>
              {lib.website && (
                <a
                  href={lib.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <Globe size={12} /> Site Oficial
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-zinc-600 mt-8">
        Mais bibliotecas sendo adicionadas continuamente. Conhece uma biblioteca que não está aqui?{' '}
        <button className="text-violet-400 hover:text-violet-300">Nos envie!</button>
      </p>
    </div>
  )
}
