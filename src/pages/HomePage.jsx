import { useEffect, useMemo, useState } from 'react'
import EventCalendar from '../components/EventCalendar'
import EventCard from '../components/EventCard'
import Hero from '../components/Hero'
import LoaderState from '../components/LoaderState'
import { useEvents } from '../hooks/useEvents'
import { startAndEndOfDay } from '../utils/date'

export default function HomePage() {
  const { events, isLoading, error } = useEvents({ sort: 'asc' })
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    if (!selectedDate) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedDate(null)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedDate])

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []

    const { start, end } = startAndEndOfDay(selectedDate)
    return events.filter((event) => event.date && event.date >= start && event.date <= end)
  }, [events, selectedDate])

  const upcomingEvents = useMemo(
    () => events.filter((event) => event.date && event.date >= currentTime).slice(0, 6),
    [currentTime, events],
  )

  return (
    <div className="space-y-8">
      <Hero />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-white">Calendario</h2>
        <EventCalendar events={events} onDateSelect={setSelectedDate} />
      </section>

      {selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedDate(null)
            }
          }}
        >
          <section
            className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border-2 border-yellow-400/40 bg-gray-950 shadow-[0_0_35px_rgba(250,204,21,0.15)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-yellow-400/20 px-5 py-4">
              <h3 className="text-xl font-bold uppercase text-yellow-300">Eventos del dia seleccionado</h3>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="rounded-lg border border-yellow-400/40 px-3 py-1.5 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              {eventsForSelectedDate.length === 0 ? (
                <p className="rounded-xl bg-gray-900 p-4 text-gray-300">No hay eventos para esta fecha.</p>
              ) : eventsForSelectedDate.length === 1 ? (
                <div className="mx-auto w-full max-w-md">
                  <EventCard key={eventsForSelectedDate[0].id} event={eventsForSelectedDate[0]} />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {eventsForSelectedDate.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
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
