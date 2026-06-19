import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/events', label: 'Eventos' },
  { to: '/organizer', label: 'Panel Organizador' },
  { to: '/admin', label: 'Admin' },
]

export default function Layout() {
  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/bg-flag.svg')] bg-cover bg-center opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 backdrop-blur-md shadow-[0_0_40px_rgba(15,23,42,0.65)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="text-lg font-black tracking-wider text-white">
              Batallas Freestyle CR
            </Link>

            <nav className="flex flex-wrap gap-2 text-sm font-medium">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 transition',
                      isActive
                        ? 'bg-rose-500/80 text-white shadow-[0_0_18px_rgba(244,63,94,0.45)]'
                        : 'bg-slate-800/70 text-slate-200 hover:bg-slate-700/70',
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
