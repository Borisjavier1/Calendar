export default function LoaderState({ message = 'Cargando...' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-8 text-center text-slate-300">
      {message}
    </div>
  )
}
