import { Link } from 'react-router-dom'
import { getCompetitionColor } from '../utils/constants'
import { formatEventDate } from '../utils/date'
import { formatLocation } from '../utils/location'

export default function EventCard({ event }) {
  const competitionLabel = event.competitionName || event.type || 'Competencia'
  const typeColor = getCompetitionColor(competitionLabel)

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-[0_0_30px_rgba(14,165,233,0.12)] transition hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(236,72,153,0.22)]">
      {event.imageUrl ? (
        <div className="flex h-44 w-full items-center justify-center bg-black p-4">
          <img src={event.imageUrl} alt={event.name} className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="h-44 w-full bg-gradient-to-r from-sky-700/60 via-blue-600/50 to-rose-600/60" />
      )}

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{event.name}</h3>
          <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: typeColor }}>
            {competitionLabel}
          </span>
        </div>

        <p className="text-sm text-slate-300">{formatEventDate(event.date, event.hasCustomTime)}</p>
        <p className="text-sm text-slate-200">{formatLocation(event.place, event.city)}</p>

        <Link
          to={`/event/${event.id}`}
          className="inline-block rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  )
}
