import { useMemo, useState } from 'react'
import EventForm from '../components/EventForm'
import ColorPicker from '../components/ColorPicker'
import LoaderState from '../components/LoaderState'
import { useAuth } from '../hooks/useAuth'
import { useCompetitions } from '../hooks/useCompetitions'
import { useEvents } from '../hooks/useEvents'
import { useOrganizers } from '../hooks/useOrganizers'
import {
  createOrganizerAuthAccount,
  loginAdmin,
  logoutAdmin,
  normalizeUsername,
} from '../services/authService'
import {
  createCompetition,
  deleteCompetition,
  updateCompetition,
} from '../services/competitionsService'
import { deleteEvent, updateEvent } from '../services/eventsService'
import { createOrganizerProfile, deleteOrganizerProfile } from '../services/organizersService'
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

const initialCompetitionForm = {
  name: '',
  city: '',
  imageUrl: '',
  color: '#ef4444',
  instagramUrl: '',
}

const initialOrganizerForm = {
  username: '',
  password: '',
  competitionId: '',
}

const generateSimplePassword = () => {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let result = ''

  for (let index = 0; index < 10; index += 1) {
    result += charset[Math.floor(Math.random() * charset.length)]
  }

  return result
}

export default function AdminPage() {
  const { user, isChecking, isAdmin } = useAuth()
  const { events, isLoading, error } = useEvents({ sort: 'asc' })
  const {
    competitions,
    isLoading: isLoadingCompetitions,
    error: competitionsError,
  } = useCompetitions()
  const {
    organizers,
    isLoading: isLoadingOrganizers,
    error: organizersError,
  } = useOrganizers({ enabled: isAdmin })

  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')

  const [eventEditTarget, setEventEditTarget] = useState(null)
  const [isSavingEventEdit, setIsSavingEventEdit] = useState(false)

  const [competitionForm, setCompetitionForm] = useState(initialCompetitionForm)
  const [competitionEditTarget, setCompetitionEditTarget] = useState(null)
  const [isSavingCompetition, setIsSavingCompetition] = useState(false)
  const [competitionStatus, setCompetitionStatus] = useState('')

  const [organizerForm, setOrganizerForm] = useState(initialOrganizerForm)
  const [organizerStatus, setOrganizerStatus] = useState('')
  const [isSavingOrganizer, setIsSavingOrganizer] = useState(false)

  const eventEditDefaults = useMemo(() => {
    if (!eventEditTarget) return undefined

    return {
      name: eventEditTarget.name,
      date: eventEditTarget.date ? formatForInputDate(eventEditTarget.date) : '',
      eventTime: eventEditTarget.hasCustomTime ? formatForInputTime(eventEditTarget.date) : '',
      city: eventEditTarget.city,
      place: eventEditTarget.place || '',
      competitionId: eventEditTarget.competitionId || competitions[0]?.id || '',
      description: eventEditTarget.description,
    }
  }, [eventEditTarget, competitions])

  const loginHandler = async (event) => {
    event.preventDefault()

    try {
      setAuthError('')
      await loginAdmin(credentials)
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const deleteEventHandler = async (eventId) => {
    const confirmed = window.confirm('Esta accion eliminara el evento definitivamente. Continuar?')
    if (!confirmed) return

    await deleteEvent(eventId)
    if (eventEditTarget?.id === eventId) {
      setEventEditTarget(null)
    }
  }

  const saveEventEdit = async (formData) => {
    if (!eventEditTarget) return

    try {
      setIsSavingEventEdit(true)
      await updateEvent(eventEditTarget.id, formData)
      setEventEditTarget(null)
    } finally {
      setIsSavingEventEdit(false)
    }
  }

  const submitCompetition = async (event) => {
    event.preventDefault()

    try {
      setCompetitionStatus('')
      setIsSavingCompetition(true)

      if (competitionEditTarget) {
        await updateCompetition(competitionEditTarget.id, competitionForm)
        setCompetitionStatus('Competencia actualizada correctamente.')
      } else {
        await createCompetition(competitionForm)
        setCompetitionStatus('Competencia creada correctamente.')
      }

      setCompetitionForm(initialCompetitionForm)
      setCompetitionEditTarget(null)
    } catch (err) {
      setCompetitionStatus(err.message)
    } finally {
      setIsSavingCompetition(false)
    }
  }

  const startEditCompetition = (competition) => {
    setCompetitionEditTarget(competition)
    setCompetitionForm({
      name: competition.name || '',
      city: competition.city || '',
      imageUrl: competition.imageUrl || '',
      color: competition.color || '#ef4444',
      instagramUrl: competition.instagramUrl || '',
    })
  }

  const cancelEditCompetition = () => {
    setCompetitionEditTarget(null)
    setCompetitionForm(initialCompetitionForm)
  }

  const deleteCompetitionHandler = async (competitionId) => {
    const linkedEvents = events.filter((event) => event.competitionId === competitionId)
    const eventMessage = linkedEvents.length > 0 
      ? ` (Se eliminarÃ¡n tambiÃ©n ${linkedEvents.length} evento${linkedEvents.length > 1 ? 's' : ''} asociado${linkedEvents.length > 1 ? 's' : ''})` 
      : ''
    
    const confirmed = window.confirm(`Se eliminarÃ¡ esta competencia${eventMessage}. Â¿Deseas continuar?`)
    if (!confirmed) return

    try {
      await deleteCompetition(competitionId)
      setCompetitionStatus('Competencia eliminada correctamente.')
      if (competitionEditTarget?.id === competitionId) {
        cancelEditCompetition()
      }
    } catch (err) {
      setCompetitionStatus(`Error al eliminar: ${err.message}`)
    }
  }

  const createOrganizerHandler = async (event) => {
    event.preventDefault()

    try {
      setOrganizerStatus('')
      setIsSavingOrganizer(true)

      const normalizedUsername = normalizeUsername(organizerForm.username)
      const linkedCompetition = competitions.find(
        (competition) => competition.id === organizerForm.competitionId,
      )

      if (!linkedCompetition) {
        throw new Error('Selecciona una competencia valida para el organizador.')
      }

      const authAccount = await createOrganizerAuthAccount({
        username: normalizedUsername,
        password: organizerForm.password,
      })

      await createOrganizerProfile({
        uid: authAccount.uid,
        username: authAccount.username,
        email: authAccount.email,
        competitionId: linkedCompetition.id,
        competitionName: linkedCompetition.name,
      })

      setOrganizerStatus(`Organizador creado: ${authAccount.username}`)
      setOrganizerForm({
        username: '',
        password: '',
        competitionId: organizerForm.competitionId,
      })
    } catch (err) {
      setOrganizerStatus(err.message)
    } finally {
      setIsSavingOrganizer(false)
    }
  }

  const deleteOrganizerHandler = async (organizerId, organizerUsername) => {
    const confirmed = window.confirm(`Eliminar organizador "${organizerUsername}"? Esta acciÃ³n no se puede deshacer.`)
    if (!confirmed) return

    try {
      await deleteOrganizerProfile(organizerId)
      setOrganizerStatus(`Organizador "${organizerUsername}" eliminado correctamente.`)
    } catch (err) {
      setOrganizerStatus(`Error al eliminar organizador: ${err.message}`)
    }
  }

  const suggestPassword = () => {
    setOrganizerForm((current) => ({
      ...current,
      password: generateSimplePassword(),
    }))
  }

  if (isChecking) {
    return <LoaderState message="Validando sesion..." />
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border-4 border-yellow-400 bg-black/70 p-6 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
        <h1 className="mb-4 text-2xl font-black uppercase text-yellow-300">Admin Login</h1>

        {authError && <p className="mb-3 rounded-xl bg-red-900/40 p-3 text-sm text-yellow-200">{authError}</p>}

        <form onSubmit={loginHandler} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-gray-300">Email</span>
            <input
              type="email"
              required
              value={credentials.email}
              onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-gray-300">Contrasena</span>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          <button type="submit" className="w-full rounded-xl bg-yellow-400 px-4 py-2 font-bold text-black hover:bg-yellow-300 uppercase tracking-widest">
            Ingresar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white">Panel Admin</h1>
          <p className="text-sm text-gray-300 font-semibold">Sesion: {user.email}</p>
        </div>

        <button onClick={logoutAdmin} className="rounded-xl border-2 border-yellow-400 bg-transparent px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-400/10 font-semibold uppercase">
          Cerrar sesion
        </button>
      </div>

      <section className="space-y-4 rounded-2xl border-2 border-yellow-400/30 bg-gray-900/60 p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
        <h2 className="text-xl font-bold uppercase text-yellow-300">Competencias</h2>

        {competitionStatus && (
          <p className="rounded-xl bg-gray-800 p-3 text-sm text-yellow-200">{competitionStatus}</p>
        )}
        {competitionsError && (
          <p className="rounded-xl bg-red-900/40 p-3 text-sm text-yellow-200">{competitionsError}</p>
        )}

        <form onSubmit={submitCompetition} className="grid gap-3 md:grid-cols-4">
          <input
            required
            value={competitionForm.name}
            onChange={(event) => setCompetitionForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Nombre de competencia"
            className="rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500"
          />
          <input
            value={competitionForm.city}
            onChange={(event) => setCompetitionForm((current) => ({ ...current, city: event.target.value }))}
            placeholder="Ciudad"
            className="rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500"
          />
          <input
            type="url"
            value={competitionForm.imageUrl}
            onChange={(event) => setCompetitionForm((current) => ({ ...current, imageUrl: event.target.value }))}
            placeholder="URL de imagen (opcional)"
            className="rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500"
          />
          <input
            type="url"
            value={competitionForm.instagramUrl}
            onChange={(event) => setCompetitionForm((current) => ({ ...current, instagramUrl: event.target.value }))}
            placeholder="URL Instagram (opcional)"
            className="rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500"
          />

          <div className="md:col-span-4">
            <ColorPicker 
              value={competitionForm.color} 
              onChange={(color) => setCompetitionForm((current) => ({ ...current, color }))}
              label="Color del evento"
            />
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSavingCompetition}
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 disabled:bg-yellow-400/50 uppercase tracking-widest"
            >
              {competitionEditTarget ? 'Actualizar competencia' : 'Crear competencia'}
            </button>

            {competitionEditTarget && (
              <button type="button" onClick={cancelEditCompetition} className="rounded-xl border-2 border-yellow-400 bg-transparent px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-400/10 font-semibold uppercase">
                Cancelar edicion
              </button>
            )}
          </div>
        </form>

        {isLoadingCompetitions ? (
          <LoaderState message="Cargando competencias..." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-yellow-400/30">
            <table className="min-w-full text-left text-sm text-gray-200">
              <thead className="bg-gray-800/70 text-xs uppercase tracking-wide text-gray-300">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Ciudad</th>
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Instagram</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {competitions.map((competition) => (
                  <tr key={competition.id} className="border-t border-yellow-400/10">
                    <td className="px-4 py-3">{competition.name}</td>
                    <td className="px-4 py-3">{competition.city || '-'}</td>
                    <td className="px-4 py-3">
                      {competition.imageUrl ? (
                        <a href={competition.imageUrl} target="_blank" rel="noreferrer" className="text-sky-300 hover:text-sky-200">
                          Ver imagen
                        </a>
                      ) : (
                        <span className="text-gray-400">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {competition.instagramUrl ? (
                        <a href={competition.instagramUrl} target="_blank" rel="noreferrer" className="text-fuchsia-300 hover:text-fuchsia-200">
                          Ver instagram
                        </a>
                      ) : (
                        <span className="text-gray-400">Sin link</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-6 w-6 rounded-full border border-gray-500" 
                          style={{ backgroundColor: competition.color || '#ef4444' }}
                        />
                        <span className="text-xs text-gray-400">{competition.color || '#ef4444'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditCompetition(competition)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteCompetitionHandler(competition.id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
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

      <section className="space-y-4 rounded-2xl border-2 border-yellow-400/30 bg-gray-900/60 p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
        <h2 className="text-xl font-bold uppercase text-yellow-300">Organizadores</h2>

        {organizerStatus && (
          <p className="rounded-xl bg-gray-800 p-3 text-sm text-yellow-200">{organizerStatus}</p>
        )}
        {organizersError && (
          <p className="rounded-xl bg-red-900/40 p-3 text-sm text-yellow-200">{organizersError}</p>
        )}

        <form onSubmit={createOrganizerHandler} className="grid gap-3 md:grid-cols-4">
          <input
            required
            value={organizerForm.username}
            onChange={(event) =>
              setOrganizerForm((current) => ({
                ...current,
                username: event.target.value,
              }))
            }
            placeholder="Usuario (una palabra)"
            className="rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500"
          />

          <div className="flex gap-2 md:col-span-2">
            <input
              required
              minLength={6}
              value={organizerForm.password}
              onChange={(event) =>
                setOrganizerForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Clave temporal"
              className="flex-1 rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={suggestPassword}
              className="rounded-xl bg-gray-700 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-600"
            >
              Generar
            </button>
          </div>

          <select
            required
            value={organizerForm.competitionId}
            onChange={(event) =>
              setOrganizerForm((current) => ({
                ...current,
                competitionId: event.target.value,
              }))
            }
            className="rounded-xl border border-yellow-400/30 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500"
          >
            <option value="">Asignar competencia...</option>
            {competitions.map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.name}
              </option>
            ))}
          </select>

          <div className="md:col-span-4">
            <button
              type="submit"
              disabled={isSavingOrganizer}
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 disabled:bg-yellow-400/50 uppercase tracking-widest"
            >
              {isSavingOrganizer ? 'Creando organizador...' : 'Crear organizador'}
            </button>
          </div>
        </form>

        {isLoadingOrganizers ? (
          <LoaderState message="Cargando organizadores..." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-yellow-400/30">
            <table className="min-w-full text-left text-sm text-gray-200">
              <thead className="bg-gray-800/70 text-xs uppercase tracking-wide text-gray-300">
                <tr>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Correo tecnico</th>
                  <th className="px-4 py-3">Competencia</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((organizer) => (
                  <tr key={organizer.id} className="border-t border-yellow-400/10">
                    <td className="px-4 py-3">{organizer.username}</td>
                    <td className="px-4 py-3">{organizer.email}</td>
                    <td className="px-4 py-3">{organizer.competitionName || '-'}</td>
                    <td className="px-4 py-3">{organizer.isActive ? 'Activo' : 'Inactivo'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteOrganizerHandler(organizer.id, organizer.username)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-400"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border-2 border-yellow-400/30 bg-gray-900/60 p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
        <h2 className="text-xl font-bold uppercase text-yellow-300">Eventos</h2>

        {isLoading && <LoaderState />}
        {!isLoading && error && <p className="rounded-xl bg-red-900/40 p-4 text-yellow-200">{error}</p>}

        <div className="overflow-x-auto rounded-2xl border-2 border-yellow-400/30 bg-gray-900/50">
          <table className="min-w-full text-left text-sm text-gray-200">
            <thead className="bg-gray-800/70 text-xs uppercase tracking-wide text-yellow-300">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Lugar</th>
                <th className="px-4 py-3">Competencia</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-yellow-400/10">
                  <td className="px-4 py-3">{event.name}</td>
                  <td className="px-4 py-3">{formatEventDate(event.date, event.hasCustomTime)}</td>
                  <td className="px-4 py-3">{formatLocation(event.place, event.city)}</td>
                  <td className="px-4 py-3">{event.competitionName || event.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEventEditTarget(event)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteEventHandler(event.id)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
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

        {eventEditTarget && (
          <section className="space-y-4 rounded-2xl border-2 border-yellow-400/30 bg-gray-900/60 p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
            <h3 className="text-xl font-bold uppercase text-yellow-300">Editar evento</h3>
            <EventForm
              key={eventEditTarget.id}
              defaultValues={eventEditDefaults}
              onSubmit={saveEventEdit}
              isSubmitting={isSavingEventEdit}
              competitions={competitions}
            />
            <button onClick={() => setEventEditTarget(null)} className="rounded-xl border-2 border-yellow-400 bg-transparent px-4 py-2 text-yellow-400 hover:bg-yellow-400/10 font-semibold uppercase tracking-widest">
              Cancelar edicion
            </button>
          </section>
        )}
      </section>
    </div>
  )
}
