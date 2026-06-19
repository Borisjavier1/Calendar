import { SORT_OPTIONS } from '../utils/constants'

export default function FilterControls({
  selectedCompetition,
  onCompetitionChange,
  competitions,
  sortOrder,
  onSortChange,
}) {
  return (
    <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-300">Competencia</label>
        <select
          className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-rose-400"
          value={selectedCompetition}
          onChange={(event) => onCompetitionChange(event.target.value)}
        >
          <option value="all">Todos</option>
          {competitions.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.name}{competition.city ? ` - ${competition.city}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-300">Orden</label>
        <select
          className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-rose-400"
          value={sortOrder}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value={SORT_OPTIONS.ASC}>Fecha ascendente</option>
          <option value={SORT_OPTIONS.DESC}>Fecha descendente</option>
        </select>
      </div>
    </section>
  )
}
