import { useState } from 'react'
import EventForm from '../components/EventForm'
import LoaderState from '../components/LoaderState'
import { useAuth } from '../hooks/useAuth'
import { useCompetitions } from '../hooks/useCompetitions'
import { createEvent } from '../services/eventsService'

export default function SubmitEventPage() {
  const { isChecking, isAuthenticated } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const { competitions, isLoading, error } = useCompetitions()

  if (isChecking) {
    return <LoaderState message="Validando acceso..." />
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h1 className="text-2xl font-black uppercase text-white">Acceso restringido</h1>
        <p className="mt-2 text-slate-300">Solo organizadores o admin pueden publicar eventos.</p>
      </div>
    )
  }

  const submitEvent = async (formData, resetForm) => {
    try {
      setStatus({ type: '', message: '' })
      setIsSubmitting(true)

      await createEvent({
        ...formData,
      })

      resetForm()
      setStatus({ type: 'success', message: 'Evento publicado correctamente.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-black uppercase text-white">Publicar Evento</h1>
      <p className="text-slate-300">Todos los eventos se muestran inmediatamente y se asocian a una competencia.</p>

      {status.message && (
        <p className={status.type === 'success' ? 'rounded-xl bg-emerald-900/30 p-3 text-emerald-200' : 'rounded-xl bg-rose-900/30 p-3 text-rose-200'}>
          {status.message}
        </p>
      )}

      {isLoading && <LoaderState message="Cargando competencias..." />}
      {!isLoading && error && <p className="rounded-xl bg-rose-900/30 p-3 text-rose-200">{error}</p>}
      {!isLoading && !error && competitions.length === 0 && (
        <p className="rounded-xl bg-amber-900/30 p-3 text-amber-200">
          No hay competencias registradas. El admin debe crear al menos una competencia.
        </p>
      )}

      {!isLoading && !error && (
        <EventForm
          key={competitions[0]?.id || 'no-competitions'}
          onSubmit={submitEvent}
          isSubmitting={isSubmitting}
          competitions={competitions}
        />
      )}
    </div>
  )
}
