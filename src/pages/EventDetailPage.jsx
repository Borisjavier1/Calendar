import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoaderState from '../components/LoaderState'
import { getEventById } from '../services/eventsService'
import { formatEventDate } from '../utils/date'
import { formatLocation } from '../utils/location'

const getInstagramEmbedUrl = (value = '') => {
  try {
    const url = new URL(value)
    if (!url.hostname.includes('instagram.com')) return ''

    const cleanedPath = url.pathname.replace(/\/+$/, '')
    const match = cleanedPath.match(/(?:^|\/)\b(p|reel|tv)\/([^/?#]+)/)
    if (!match) return ''

    const [, type, code] = match
    return `https://www.instagram.com/${type}/${code}/embed`
  } catch {
    return ''
  }
}

const getDirectImageUrl = (value = '') => {
  if (!value) return ''

  try {
    const url = new URL(value)
    const pathname = url.pathname.toLowerCase()
    const isImagePath = /\.(jpg|jpeg|png|webp|gif)(\?|$)/.test(pathname)
    const isInstagramCdn =
      url.hostname.includes('cdninstagram.com') ||
      url.hostname.includes('fbcdn.net') ||
      url.hostname.includes('instagram.f')

    return isImagePath || isInstagramCdn ? value : ''
  } catch {
    return ''
  }
}

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setError('')
        setIsLoading(true)
        const eventData = await getEventById(id)
        setEvent(eventData)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [id])

  if (isLoading) return <LoaderState message="Cargando evento..." />
  if (error) return <p className="rounded-xl bg-red-900/40 p-4 text-yellow-200">{error}</p>
  if (!event) return <p className="rounded-xl bg-gray-900/65 p-4 text-gray-300">Evento no encontrado.</p>

  const competitionLabel = event.competitionName || event.type || 'Competencia'
  const description = event.description?.trim()
  const normalizedDescription = description?.toLowerCase()
  const shouldShowDescription = Boolean(description && normalizedDescription !== 'fecha')
  const eventInstagramUrl = event.eventInstagramUrl?.trim() || ''
  const directImageUrl = getDirectImageUrl(eventInstagramUrl)
  const instagramEmbedUrl = getInstagramEmbedUrl(eventInstagramUrl)

  return (
    <article className="overflow-hidden rounded-3xl border border-yellow-400/30 bg-gray-900/70 shadow-[0_0_35px_rgba(56,189,248,0.18)]">
      {event.imageUrl ? (
        <div className="flex h-80 w-full items-center justify-center bg-black p-6">
          <img src={event.imageUrl} alt={event.name} className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="h-80 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />
      )}

      <div className="space-y-4 p-6 sm:p-8">
        <h1 className="text-3xl font-black uppercase text-white">{event.name}</h1>
        <p className="inline-block rounded-full bg-yellow-400/90 px-4 py-1 text-sm font-semibold text-white">{competitionLabel}</p>

        <div className="grid gap-3 text-gray-200 sm:grid-cols-2">
          <p><span className="font-semibold text-white">Cuando:</span> {formatEventDate(event.date, event.hasCustomTime)}</p>
          <p><span className="font-semibold text-white">Lugar:</span> {formatLocation(event.place, event.city)}</p>
        </div>

        {event.competitionInstagramUrl && (
          <p>
            <span className="font-semibold text-white">Instagram competencia:</span>{' '}
            <a
              href={event.competitionInstagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200"
            >
              Abrir perfil
            </a>
          </p>
        )}

        {eventInstagramUrl && (
          <div className="space-y-2">
            <p className="font-semibold text-white">Flyer del evento:</p>

            {directImageUrl && (
              <div className="overflow-hidden rounded-xl border border-yellow-400/20 bg-black/30 p-2">
                <img src={directImageUrl} alt={`Flyer ${event.name}`} className="max-h-[640px] w-full object-contain" />
              </div>
            )}

            {!directImageUrl && instagramEmbedUrl && (
              <div className="overflow-hidden rounded-xl border border-yellow-400/20 bg-black/30">
                <iframe
                  title={`Instagram ${event.name}`}
                  src={instagramEmbedUrl}
                  className="h-[540px] w-full"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            )}

            {!directImageUrl && !instagramEmbedUrl && (
              <a
                href={eventInstagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-fuchsia-300 hover:text-fuchsia-200"
              >
                Abrir en Instagram
              </a>
            )}
          </div>
        )}

        {shouldShowDescription && <p className="leading-relaxed text-gray-300">{description}</p>}
      </div>
    </article>
  )
}
