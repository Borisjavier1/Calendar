import { useState } from 'react'
import EventCard from '../components/EventCard'
import FilterControls from '../components/FilterControls'
import LoaderState from '../components/LoaderState'
import { useCompetitions } from '../hooks/useCompetitions'
import { useEvents } from '../hooks/useEvents'
import { SORT_OPTIONS } from '../utils/constants'

export default function EventsPage() {
  const [selectedCompetition, setSelectedCompetition] = useState('all')
  const [sortOrder, setSortOrder] = useState(SORT_OPTIONS.ASC)
  const { competitions } = useCompetitions()

  const { events, isLoading, error } = useEvents({
    sort: sortOrder,
    competitionId: selectedCompetition,
  })

  return (
    <div>
      <h1 className="mb-4 text-3xl font-black uppercase text-white">Eventos</h1>

      <FilterControls
        selectedCompetition={selectedCompetition}
        onCompetitionChange={setSelectedCompetition}
        competitions={competitions}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {isLoading && <LoaderState />}
      {!isLoading && error && <p className="rounded-xl bg-rose-900/30 p-4 text-rose-200">{error}</p>}
      {!isLoading && !error && events.length === 0 && (
        <p className="rounded-xl bg-slate-900/65 p-4 text-slate-300">No hay eventos con estos filtros.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
