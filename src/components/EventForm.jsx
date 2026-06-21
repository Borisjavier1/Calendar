import { useState } from 'react'

const initialState = {
  name: '',
  date: '',
  eventTime: '',
  city: '',
  place: '',
  competitionId: '',
  description: '',
  instagramPostUrl: '',
}

export default function EventForm({ onSubmit, isSubmitting, defaultValues, competitions = [] }) {
  const [form, setForm] = useState(() => {
    const fallbackCompetitionId = competitions[0]?.id ?? ''
    return { ...initialState, competitionId: fallbackCompetitionId, ...defaultValues }
  })

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const submitHandler = async (event) => {
    event.preventDefault()

    const hasCustomTime = Boolean(form.eventTime)
    const dateValue = hasCustomTime ? `${form.date}T${form.eventTime}` : form.date

    await onSubmit({ ...form, date: dateValue, hasCustomTime }, () => {
      const fallbackCompetitionId = competitions[0]?.id ?? ''
      setForm({ ...initialState, competitionId: fallbackCompetitionId })
    })
  }

  return (
    <form onSubmit={submitHandler} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/65 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-200">Nombre</span>
          <input required value={form.name} onChange={updateField('name')} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-200">Fecha</span>
          <input required type="date" value={form.date} onChange={updateField('date')} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-200">Hora (opcional)</span>
          <input type="time" value={form.eventTime} onChange={updateField('eventTime')} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-200">Lugar exacto (opcional)</span>
          <input value={form.place} onChange={updateField('place')} placeholder="Ej: Parque Central" className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-200">Provincia o zona (opcional)</span>
          <input value={form.city} onChange={updateField('city')} placeholder="Ej: Heredia" className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400" />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm text-slate-200">Competencia</span>
          <select
            required
            value={form.competitionId}
            onChange={updateField('competitionId')}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
          >
            {competitions.length === 0 && <option value="">Sin competencias registradas</option>}
            {competitions.map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.name}{competition.city ? ` - ${competition.city}` : ''}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm text-slate-200">Descripcion</span>
          <textarea required value={form.description} onChange={updateField('description')} rows={5} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400" />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm text-slate-200">Link de Instagram del flyer (opcional)</span>
          <input
            type="url"
            value={form.instagramPostUrl}
            onChange={updateField('instagramPostUrl')}
            placeholder="https://www.instagram.com/p/XXXXXXXX/"
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || competitions.length === 0}
        className="w-full rounded-xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-rose-500/50"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar evento'}
      </button>
    </form>
  )
}
