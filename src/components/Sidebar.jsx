import { NavLink } from 'react-router-dom'
import { Heart, Home, Info, Search, Settings, Tv } from 'lucide-react'

const items = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/search', label: 'Cari', icon: Search },
  { to: '/favorites', label: 'Favorit', icon: Heart },
  { to: '/developer', label: 'Tentang', icon: Info },
  { to: '/settings', label: 'Pengaturan', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-24 border-r border-white/10 bg-[#06070d]/78 backdrop-blur-2xl lg:block xl:w-28">
      <div className="flex h-full flex-col items-center gap-6 py-6">
        <NavLink
          to="/"
          data-focusable="true"
          aria-label="Beranda SRG TV"
          className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 via-cyan-300 to-rose-500 text-white shadow-xl shadow-cyan-500/20 focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:h-20 tv:w-20"
        >
          <Tv className="h-7 w-7 tv:h-11 tv:w-11" />
        </NavLink>
        <nav className="flex flex-1 flex-col items-center justify-center gap-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                data-focusable="true"
                aria-label={item.label}
                title={item.label}
                className={({ isActive }) => [
                  'grid h-14 w-14 place-items-center rounded-2xl border transition focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:h-20 tv:w-20',
                  isActive
                    ? 'border-cyan-200/70 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/20'
                    : 'border-white/10 bg-white/[0.06] text-white/65 hover:bg-white/[0.12] hover:text-white',
                ].join(' ')}
              >
                <Icon className="h-6 w-6 tv:h-9 tv:w-9" />
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
