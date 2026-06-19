export default function Hero() {
  return (
    <section className="mb-8 rounded-2xl overflow-hidden border-4 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
      {/* Bandera de Costa Rica como fondo */}
      <div className="absolute inset-0 h-full w-full">
        <div className="flex h-full w-full">
          <div className="w-1/5 bg-blue-700" />
          <div className="w-1/5 bg-white" />
          <div className="w-1/5 bg-red-700" />
          <div className="w-1/5 bg-white" />
          <div className="w-1/5 bg-blue-700" />
        </div>
        {/* Overlay oscuro para readabilidad */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-6 sm:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-yellow-300 font-bold">
          🎤 Escena Urbana Costa Rica
        </p>
        <h1 className="text-4xl font-black uppercase leading-tight text-white sm:text-6xl drop-shadow-lg">
          Batallas de<br />Freestyle CR
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-gray-200 sm:text-base font-semibold">
          Publica, descubre y organiza eventos de freestyle en todo el país. Sin aprobaciones, sin filtros innecesarios, toda la escena en tiempo real.
        </p>
      </div>
    </section>
  )
}
