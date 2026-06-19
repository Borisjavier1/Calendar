import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoaderState from '../components/LoaderState'
import { getEventById } from '../services/eventsService'
import { formatEventDate } from '../utils/date'
import { formatLocation } from '../utils/location'

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
  if (error) return <p className="rounded-xl bg-rose-900/30 p-4 text-rose-200">{error}</p>
  if (!event) return <p className="rounded-xl bg-slate-900/65 p-4 text-slate-300">Evento no encontrado.</p>

  const competitionLabel = event.competitionName || event.type || 'Competencia'

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-[0_0_35px_rgba(56,189,248,0.18)]">
      {event.imageUrl ? (
        <div className="flex h-80 w-full items-center justify-center bg-black p-6">
          <img src={event.imageUrl} alt={event.name} className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="h-80 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />
      )}

      <div className="space-y-4 p-6 sm:p-8">
        <h1 className="text-3xl font-black uppercase text-white">{event.name}</h1>
        <p className="inline-block rounded-full bg-rose-500/90 px-4 py-1 text-sm font-semibold text-white">{competitionLabel}</p>

        <div className="grid gap-3 text-slate-200 sm:grid-cols-2">
          <p><span className="font-semibold text-white">Fecha:</span> {formatEventDate(event.date, event.hasCustomTime)}</p>
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

        <p className="leading-relaxed text-slate-300">{event.description}</p>
      </div>
    </article>
  )
}
