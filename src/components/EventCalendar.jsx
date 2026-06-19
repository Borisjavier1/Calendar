import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { getCompetitionColor } from '../utils/constants'

export default function EventCalendar({ events, onDateSelect }) {
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.name,
    date: event.date,
    allDay: true,
    backgroundColor: getCompetitionColor(event.competitionName || event.type),
    borderColor: 'transparent',
    textColor: '#ffffff',
  }))

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-3 shadow-[0_0_25px_rgba(56,189,248,0.14)] sm:p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={esLocale}
        initialView="dayGridMonth"
        events={calendarEvents}
        displayEventTime={false}
        selectable
        dateClick={(info) => onDateSelect?.(info.date)}
        height="auto"
      />
    </div>
  )
}
