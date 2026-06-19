import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/events', label: 'Eventos' },
  { to: '/organizer', label: 'Panel Organizador' },
  { to: '/admin', label: 'Admin' },
]

export default function Layout() {
  return (
    <div className="min-h-screen text-gray-100 relative overflow-hidden">
      {/* Bandera de Costa Rica como fondo sutil */}
      <div className="absolute inset-0">
        <div className="flex h-full w-full">
          <div className="w-1/5 bg-blue-700/10" />
          <div className="w-1/5 bg-white/5" />
          <div className="w-1/5 bg-red-700/10" />
          <div className="w-1/5 bg-white/5" />
          <div className="w-1/5 bg-blue-700/10" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-gray-950/80 to-black/95" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl border-2 border-yellow-400/30 bg-gray-900/60 px-5 py-4 backdrop-blur-md shadow-[0_0_25px_rgba(250,204,21,0.1)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="text-lg font-black tracking-widest text-yellow-300 uppercase drop-shadow-lg">
              🎤 Batallas Freestyle CR
            </Link>

            <nav className="flex flex-wrap gap-2 text-sm font-bold uppercase">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 transition tracking-widest',
                      isActive
                        ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                        : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 border border-yellow-400/20',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
