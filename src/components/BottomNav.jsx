import { NavLink } from 'react-router-dom'
import { Heart, Home, Info, Search, Settings } from 'lucide-react'

const items = [
  { to: '/', label: 'Beranda', icon: Home, end: true },
  { to: '/search', label: 'Cari', icon: Search },
  { to: '/favorites', label: 'Favorit', icon: Heart },
  { to: '/developer', label: 'Tentang', icon: Info },
  { to: '/settings', label: 'Atur', icon: Settings },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#2e2e2e] bg-[#1a1a1a] md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={item.label}
              className={({ isActive }) => [
                'flex flex-col items-center gap-0.5 py-2.5 text-[0.625rem] font-medium transition',
                isActive ? 'text-[#ff5722]' : 'text-[#8a8a8a]',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
