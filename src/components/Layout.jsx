import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/events', label: 'Eventos' },
  { to: '/organizer', label: 'Panel Organizador' },
  { to: '/admin', label: 'Admin' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl border-2 border-yellow-400/30 bg-gray-900/80 px-5 py-4 backdrop-blur-md shadow-[0_0_25px_rgba(250,204,21,0.1)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="text-lg font-black tracking-widest text-yellow-300 uppercase drop-shadow-lg">
              🎤 Batallas de Freestyle CR
            </Link>

            <nav className="flex flex-wrap gap-2 text-sm font-bold uppercase">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 transition tracking-widest text-xs sm:text-sm',
                      isActive
                        ? 'bg-yellow-400 text-black font-bold'
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

        <footer className="mt-10 rounded-2xl border border-yellow-400/30 bg-gray-900/70 px-5 py-4 text-sm text-gray-300">
          <p className="font-semibold text-yellow-300 uppercase tracking-wider">Soporte</p>
          <p className="mt-1">
            Si necesitas soprte con la web, escribe a{' '}
            <a
              href="https://www.instagram.com/borisjavier_1"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-fuchsia-300 hover:text-fuchsia-200"
            >
              @borisjavier_1
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  )
}
