import { useMemo, useState } from 'react'
import EventCalendar from '../components/EventCalendar'
import EventCard from '../components/EventCard'
import Hero from '../components/Hero'
import LoaderState from '../components/LoaderState'
import { useEvents } from '../hooks/useEvents'
import { startAndEndOfDay } from '../utils/date'

export default function HomePage() {
  const { events, isLoading, error } = useEvents({ sort: 'asc' })
  const [selectedDate, setSelectedDate] = useState(null)

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []

    const { start, end } = startAndEndOfDay(selectedDate)
    return events.filter((event) => event.date && event.date >= start && event.date <= end)
  }, [events, selectedDate])

  const upcomingEvents = useMemo(
    () => events.filter((event) => event.date && event.date >= new Date()).slice(0, 6),
    [events],
  )

  return (
    <div className="space-y-8">
      <Hero />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-white">Calendario</h2>
        <EventCalendar events={events} onDateSelect={setSelectedDate} />
      </section>

      {selectedDate && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Eventos del dia seleccionado</h3>
          {eventsForSelectedDate.length === 0 ? (
            <p className="rounded-xl bg-slate-900/65 p-4 text-slate-300">No hay eventos para esta fecha.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {eventsForSelectedDate.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Proximos eventos</h3>

        {isLoading && <LoaderState message="Cargando eventos proximos..." />}
        {!isLoading && error && <p className="rounded-xl bg-rose-900/30 p-4 text-rose-200">{error}</p>}
        {!isLoading && !error && upcomingEvents.length === 0 && (
          <p className="rounded-xl bg-slate-900/65 p-4 text-slate-300">Aun no hay eventos publicados.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  )
}
