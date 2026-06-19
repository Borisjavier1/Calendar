import { Link } from 'react-router-dom'
import { getCompetitionColor, getReadableTextColor } from '../utils/constants'
import { formatEventDate } from '../utils/date'
import { formatLocation } from '../utils/location'

export default function EventCard({ event }) {
  const competitionLabel = event.competitionName || event.type || 'Competencia'
  const typeColor = event.color || getCompetitionColor(event.competitionId, true)
  const typeTextColor = getReadableTextColor(typeColor)

  return (
    <article className="overflow-hidden rounded-2xl border-2 border-yellow-400/30 bg-gray-900/70 shadow-[0_0_20px_rgba(250,204,21,0.1)] transition hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)]">
      {event.imageUrl ? (
        <div className="flex h-44 w-full items-center justify-center bg-black p-4">
          <img src={event.imageUrl} alt={event.name} className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="h-44 w-full bg-gradient-to-r from-red-700/60 via-yellow-600/50 to-blue-600/60" />
      )}

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-yellow-300">{event.name}</h3>
          <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: typeColor, color: typeTextColor }}>
            {competitionLabel}
          </span>
        </div>

        <p className="text-sm text-gray-300">{formatEventDate(event.date, event.hasCustomTime)}</p>
        <p className="text-sm text-gray-200">{formatLocation(event.place, event.city)}</p>

        <Link
          to={`/event/${event.id}`}
          className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300 uppercase tracking-widest"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  )
}
