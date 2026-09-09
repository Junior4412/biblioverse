'tsx'
import { useEffect, useState } from 'react'
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  Library,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface LibraryData {
  id: string
  name: string
  city?: string | null
  address?: string | null
  hours?: string | null
  phone?: string | null
  website?: string | null
  rating?: number | null
  lat?: number | null
  lng?: number | null
}

export function LibrariesPage() {
  const [libraries, setLibraries] = useState<LibraryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLibraries() {
      setLoading(true)

      const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Erro ao carregar bibliotecas:', error)
        setLibraries([])
      } else {
        setLibraries((data ?? []) as LibraryData[])
      }

      setLoading(false)
    }

    loadLibraries()
  }, [])

  // =========================
  // ESTATÍSTICAS REAIS
  // =========================
  const totalLibraries = libraries.length

  const totalCities = new Set(
    libraries
      .map((library) => library.city)
      .filter(Boolean)
  ).size

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-base p-10 text-center">
          <p className="text-zinc-400">
            Carregando bibliotecas...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">
          Bibliotecas
        </h1>

        <p className="text-zinc-400">
          Encontre bibliotecas próximas e explore acervos incríveis
        </p>
      </div>

      {/* =========================
          STATS REAIS
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card-base p-5 text-center">
          <p className="text-2xl font-bold text-foreground">
            {totalLibraries.toLocaleString('pt-BR')}
          </p>

          <p className="text-sm text-zinc-500 mt-0.5">
            Bibliotecas Mapeadas
          </p>
        </div>

        <div className="card-base p-5 text-center">
          <p className="text-2xl font-bold text-foreground">
            {totalCities.toLocaleString('pt-BR')}
          </p>

          <p className="text-sm text-zinc-500 mt-0.5">
            Cidades
          </p>
        </div>
      </div>

      {/* =========================
          BIBLIOTECAS
      ========================= */}
      {libraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {libraries.map((library) => {
            const hasCoordinates =
              library.lat !== null &&
              library.lat !== undefined &&
              library.lng !== null &&
              library.lng !== undefined

            const mapUrl = hasCoordinates
              ? `https://maps.google.com/?q=${library.lat},${library.lng}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${library.name} ${library.address ?? ''} ${library.city ?? ''}`
                )}`

            return (
              <div
                key={library.id}
                className="card-base p-6"
              >
                {/* Nome */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg leading-tight">
                      {library.name}
                    </h3>

                    {library.city && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin
                          size={12}
                          className="text-zinc-500"
                        />

                        <span className="text-sm text-zinc-500">
                          {library.city}
                        </span>
                      </div>
                    )}
                  </div>

                  {library.rating !== null &&
                    library.rating !== undefined && (
                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 flex-shrink-0">
                        <Star
                          size={12}
                          className="text-amber-400 fill-amber-400"
                        />

                        <span className="text-sm font-semibold text-amber-400">
                          {Number(library.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                </div>

                {/* Informações */}
                <div className="space-y-2">

                  {library.address && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <MapPin
                        size={13}
                        className="text-zinc-600 flex-shrink-0"
                      />

                      <span>
                        {library.address}
                      </span>
                    </div>
                  )}

                  {library.hours && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock
                        size={13}
                        className="text-zinc-600 flex-shrink-0"
                      />

                      <span>
                        {library.hours}
                      </span>
                    </div>
                  )}

                  {library.phone && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Phone
                        size={13}
                        className="text-zinc-600 flex-shrink-0"
                      />

                      <span>
                        {library.phone}
                      </span>
                    </div>
                  )}

                </div>

                {/* Botões */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-2 flex-wrap">

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <MapPin size={12} />
                    Ver no Mapa
                  </a>

                  {library.website && (
                    <a
                      href={library.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
                    >
                      <Globe size={12} />
                      Site Oficial
                    </a>
                  )}

                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card-base p-10 text-center">
          <Library
            size={40}
            className="mx-auto text-zinc-700 mb-3"
          />

          <h2 className="text-sm font-semibold text-foreground">
            Nenhuma biblioteca cadastrada
          </h2>

          <p className="text-xs text-zinc-500 mt-2">
            As bibliotecas cadastradas no Biblioverse aparecerão aqui.
          </p>
        </div>
      )}

      {/* Rodapé */}
      <p className="text-center text-sm text-zinc-600 mt-8">
        Conhece uma biblioteca que não está aqui?{' '}
        <button className="text-[#5E6E4E] hover:text-green-300">
          Nos envie!
        </button>
      </p>

    </div>
  )
}