import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center">
      <h1 className="text-4xl font-black text-white">404</h1>
      <p className="mt-3 text-slate-300">La pagina que buscas no existe.</p>
      <Link to="/" className="mt-5 inline-block rounded-xl bg-rose-500 px-5 py-2 font-semibold text-white hover:bg-rose-400">
        Volver al inicio
      </Link>
    </div>
  )
}
