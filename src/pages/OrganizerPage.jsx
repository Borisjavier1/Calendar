import { useEffect, useMemo, useState } from 'react'
import EventForm from '../components/EventForm'
import LoaderState from '../components/LoaderState'
import AlertToast from '../components/AlertToast'
import AppModal from '../components/AppModal'
import { useAuth } from '../hooks/useAuth'
import { useCompetitions } from '../hooks/useCompetitions'
import { useEvents } from '../hooks/useEvents'
import {
  changeCurrentUserPassword,
  loginPanelUser,
  logoutAdmin,
} from '../services/authService'
import { updateOrganizerCompetitionSettings } from '../services/competitionsService'
import { createEvent, deleteEvent, updateEvent } from '../services/eventsService'
import { formatEventDate } from '../utils/date'
import { formatLocation } from '../utils/location'

const formatForInputDate = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const formatForInputTime = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export default function OrganizerPage() {
  const { user, isChecking, isOrganizer, organizerProfile } = useAuth()
  const { competitions } = useCompetitions()
  const { events, isLoading, error } = useEvents({
    sort: 'asc',
    competitionId: organizerProfile?.competitionId || undefined,
  })

  const [credentials, setCredentials] = useState({ identifier: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [eventAlert, setEventAlert] = useState({ message: '', type: 'success' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventEditTarget, setEventEditTarget] = useState(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordAlert, setPasswordAlert] = useState({ message: '', type: 'success' })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [instagramUrlInput, setInstagramUrlInput] = useState('')
  const [competitionNameInput, setCompetitionNameInput] = useState('')
  const [competitionCityInput, setCompetitionCityInput] = useState('')
  const [instagramAlert, setInstagramAlert] = useState({ message: '', type: 'success' })
  const [isSavingInstagram, setIsSavingInstagram] = useState(false)

  const clearEventAlert = () => setEventAlert({ message: '', type: 'success' })
  const clearPasswordAlert = () => setPasswordAlert({ message: '', type: 'success' })
  const clearInstagramAlert = () => setInstagramAlert({ message: '', type: 'success' })

  const assignedCompetition = useMemo(() => {
    if (!organizerProfile) return null
    return competitions.find((competition) => competition.id === organizerProfile.competitionId) || null
  }, [competitions, organizerProfile])

  const competitionOptions = useMemo(() => {
    if (!organizerProfile) return []

    return [
      {
        id: organizerProfile.competitionId,
        name: organizerProfile.competitionName,
        city: '',
      },
    ]
  }, [organizerProfile])

  const currentInstagramUrl = assignedCompetition?.instagramUrl || ''

  useEffect(() => {
    setCompetitionNameInput(assignedCompetition?.name || organizerProfile?.competitionName || '')
    setCompetitionCityInput(assignedCompetition?.city || '')
    setInstagramUrlInput(currentInstagramUrl)
  }, [assignedCompetition, currentInstagramUrl, organizerProfile?.competitionName])

  const syncInstagramInput = () => {
    setCompetitionNameInput(assignedCompetition?.name || organizerProfile?.competitionName || '')
    setCompetitionCityInput(assignedCompetition?.city || '')
    setInstagramUrlInput(currentInstagramUrl)
  }

  const eventEditDefaults = useMemo(() => {
    if (!eventEditTarget || !organizerProfile) return undefined

    return {
      name: eventEditTarget.name,
      date: eventEditTarget.date ? formatForInputDate(eventEditTarget.date) : '',
      eventTime: eventEditTarget.hasCustomTime ? formatForInputTime(eventEditTarget.date) : '',
      city: eventEditTarget.city || '',
      place: eventEditTarget.place || '',
      competitionId: organizerProfile.competitionId,
      description: eventEditTarget.description,
      instagramPostUrl: eventEditTarget.eventInstagramUrl || '',
    }
  }, [eventEditTarget, organizerProfile])

  const loginHandler = async (event) => {
    event.preventDefault()

    try {
      setAuthError('')
      await loginPanelUser(credentials)
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const submitNewEvent = async (formData, resetForm) => {
    if (!organizerProfile) return

    try {
      setIsSubmitting(true)

      await createEvent({
        ...formData,
        competitionId: organizerProfile.competitionId,
      })

      resetForm()
      setEventAlert({ type: 'success', message: '✅ Evento creado correctamente.' })
    } catch (error) {
      setEventAlert({ type: 'error', message: `❌ ${error.message}` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveEventEdit = async (formData) => {
    if (!eventEditTarget || !organizerProfile) return

    try {
      setIsSubmitting(true)

      await updateEvent(eventEditTarget.id, {
        ...formData,
        competitionId: organizerProfile.competitionId,
      })

      setEventEditTarget(null)
      setEventAlert({ type: 'success', message: '✅ Evento actualizado correctamente.' })
    } catch (error) {
      setEventAlert({ type: 'error', message: `❌ ${error.message}` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteEventHandler = async (eventId) => {
    const confirmed = window.confirm('Esta accion eliminara el evento definitivamente. Continuar?')
    if (!confirmed) return

    try {
      await deleteEvent(eventId)

      if (eventEditTarget?.id === eventId) {
        setEventEditTarget(null)
      }

      setEventAlert({ type: 'success', message: '✅ Evento eliminado correctamente.' })
    } catch (error) {
      setEventAlert({ type: 'error', message: `❌ No se pudo eliminar el evento: ${error.message}` })
    }
  }

  const changePasswordHandler = async (event) => {
    event.preventDefault()

    if (passwordForm.newPassword.length < 6) {
      setPasswordAlert({
        type: 'error',
        message: '❌ La nueva clave debe tener al menos 6 caracteres.',
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordAlert({
        type: 'error',
        message: '❌ La confirmacion no coincide con la nueva clave.',
      })
      return
    }

    try {
      setIsChangingPassword(true)

      await changeCurrentUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordAlert({ type: 'success', message: '✅ Clave actualizada correctamente.' })
    } catch (error) {
      setPasswordAlert({
        type: 'error',
        message: error?.code === 'auth/wrong-password'
          ? '❌ La clave actual es incorrecta.'
          : `❌ No se pudo cambiar la clave: ${error.message}`,
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const saveInstagramHandler = async (event) => {
    event.preventDefault()

    if (!organizerProfile) return

    try {
      setIsSavingInstagram(true)

      await updateOrganizerCompetitionSettings({
        competitionId: organizerProfile.competitionId,
        organizerUid: organizerProfile.id,
        name: competitionNameInput,
        city: competitionCityInput,
        instagramUrl: instagramUrlInput,
      })

      setInstagramAlert({ type: 'success', message: '✅ Competencia actualizada correctamente.' })
    } catch (error) {
      setInstagramAlert({ type: 'error', message: `❌ No se pudo actualizar la competencia: ${error.message}` })
    } finally {
      setIsSavingInstagram(false)
    }
  }

  if (isChecking) {
    return <LoaderState message="Validando acceso..." />
  }

  if (!isOrganizer) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-yellow-400/30 bg-gray-900/70 p-6">
        <h1 className="mb-4 text-2xl font-black uppercase text-white">Panel Organizador</h1>

        {authError && <p className="mb-3 rounded-xl bg-rose-900/30 p-3 text-sm text-rose-200">{authError}</p>}

        <form onSubmit={loginHandler} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-gray-300">Usuario o correo</span>
            <input
              required
              value={credentials.identifier}
              onChange={(event) => setCredentials((prev) => ({ ...prev, identifier: event.target.value }))}
              className="w-full rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-gray-300">Clave</span>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </label>

          <button type="submit" className="w-full rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-white hover:bg-yellow-300">
            Ingresar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AlertToast message={eventAlert.message} type={eventAlert.type} onClose={clearEventAlert} />
      <AlertToast message={passwordAlert.message} type={passwordAlert.type} onClose={clearPasswordAlert} />
      <AlertToast message={instagramAlert.message} type={instagramAlert.type} onClose={clearInstagramAlert} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white">Panel Organizador</h1>
          <p className="text-sm text-gray-300">Usuario: {user?.email}</p>
          <p className="text-sm text-gray-300">Competencia: {organizerProfile.competitionName}</p>
        </div>

        <button onClick={logoutAdmin} className="rounded-xl bg-gray-700 px-4 py-2 text-sm text-white hover:bg-slate-600">
          Cerrar sesion
        </button>
      </div>

      <section className="space-y-4 rounded-2xl border border-yellow-400/30 bg-gray-900/60 p-5">
        <h2 className="text-xl font-bold uppercase text-white">Cambiar clave</h2>

        <form onSubmit={changePasswordHandler} className="grid gap-3 md:grid-cols-3">
          <input
            type="password"
            required
            value={passwordForm.currentPassword}
            onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
            placeholder="Clave actual"
            className="rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
          />

          <input
            type="password"
            required
            minLength={6}
            value={passwordForm.newPassword}
            onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
            placeholder="Nueva clave"
            className="rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
          />

          <input
            type="password"
            required
            minLength={6}
            value={passwordForm.confirmPassword}
            onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            placeholder="Confirmar nueva clave"
            className="rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
          />

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-300 disabled:bg-yellow-300/50"
            >
              {isChangingPassword ? 'Actualizando clave...' : 'Actualizar clave'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-yellow-400/30 bg-gray-900/60 p-5">
        <h2 className="text-xl font-bold uppercase text-white">Configuracion de competencia</h2>

        <form onSubmit={saveInstagramHandler} className="space-y-3">
          <input
            type="text"
            required
            value={competitionNameInput}
            onChange={(event) => setCompetitionNameInput(event.target.value)}
            placeholder="Nombre de la competencia"
            className="w-full rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
          />

          <input
            type="text"
            value={competitionCityInput}
            onChange={(event) => setCompetitionCityInput(event.target.value)}
            placeholder="Sede principal (ciudad)"
            className="w-full rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
          />

          <input
            type="url"
            value={instagramUrlInput}
            onChange={(event) => setInstagramUrlInput(event.target.value)}
            placeholder="https://instagram.com/tu_perfil"
            className="w-full rounded-xl border border-yellow-400/30 bg-gray-800 px-3 py-2 text-gray-100"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSavingInstagram}
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-300 disabled:bg-yellow-300/50"
            >
              {isSavingInstagram ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={syncInstagramInput}
              className="rounded-xl bg-gray-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
            >
              Usar valor actual
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-300">Instagram actual: {currentInstagramUrl || 'Sin definir'}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-yellow-400/30 bg-gray-900/60 p-5">
        <h2 className="text-xl font-bold uppercase text-white">Crear evento</h2>
        <EventForm
          key={organizerProfile.competitionId}
          onSubmit={submitNewEvent}
          isSubmitting={isSubmitting}
          competitions={competitionOptions}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold uppercase text-white">Mis eventos</h2>

        {isLoading && <LoaderState message="Cargando eventos..." />}
        {!isLoading && error && <p className="rounded-xl bg-rose-900/30 p-4 text-rose-200">{error}</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-yellow-400/30 bg-gray-900/60">
            <table className="min-w-full text-left text-sm text-gray-200">
              <thead className="bg-gray-800/70 text-xs uppercase tracking-wide text-gray-300">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Lugar</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-white/5">
                    <td className="px-4 py-3">{event.name}</td>
                    <td className="px-4 py-3">{formatEventDate(event.date, event.hasCustomTime)}</td>
                    <td className="px-4 py-3">{formatLocation(event.place, event.city)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEventEditTarget(event)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteEventHandler(event.id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-400"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>

      {eventEditTarget && (
        <AppModal title="Editar evento" onClose={() => setEventEditTarget(null)} maxWidth="max-w-4xl">
          <div className="space-y-4">
            <EventForm
              key={eventEditTarget.id}
              defaultValues={eventEditDefaults}
              onSubmit={saveEventEdit}
              isSubmitting={isSubmitting}
              competitions={competitionOptions}
            />
            <button onClick={() => setEventEditTarget(null)} className="rounded-xl bg-gray-700 px-4 py-2 text-white hover:bg-slate-600">
              Cancelar edicion
            </button>
          </div>
        </AppModal>
      )}
    </div>
  )
}
