export default function Hero() {
  return (
    <section className="mb-8 rounded-xl overflow-hidden border-4 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.3)] h-56 relative">
      {/* Bandera de Costa Rica horizontal */}
      <div className="absolute inset-0 w-full h-full">
        <div className="flex h-full w-full">
          <div className="w-1/5 bg-blue-700" />
          <div className="w-1/5 bg-white" />
          <div className="w-1/5 bg-red-700" />
          <div className="w-1/5 bg-white" />
          <div className="w-1/5 bg-blue-700" />
        </div>
        {/* Overlay oscuro para readabilidad */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-center">
        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-yellow-300 font-bold">
          🎤 Escena Urbana Costa Rica
        </p>
        <h1 className="text-3xl font-black uppercase leading-tight text-white sm:text-5xl drop-shadow-lg">
          Batallas de Freestyle CR
        </h1>
        <p className="mt-3 max-w-3xl text-xs text-gray-200 sm:text-sm font-semibold">
          Publica, descubre y organiza eventos de freestyle/rap. Toda la escena en tiempo real.
        </p>
      </div>
    </section>
  )
}
