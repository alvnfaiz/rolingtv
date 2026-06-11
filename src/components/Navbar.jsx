import { Link, NavLink } from 'react-router-dom'
import { Settings } from 'lucide-react'

const links = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/search', label: 'Cari' },
  { to: '/favorites', label: 'Favorit' },
  { to: '/developer', label: 'Tentang' },
]

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#2e2e2e] bg-[#101010]">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:h-16 sm:px-6">
        <Link
          to="/"
          data-focusable="true"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5722]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded bg-[#ff5722] text-sm font-bold text-white">
            S
          </span>
          <span className="text-base font-bold tracking-tight sm:text-lg">SRG TV</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              data-focusable="true"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/settings"
          data-focusable="true"
          aria-label="Pengaturan"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded text-[#8a8a8a] transition hover:bg-[#242424] hover:text-[#ececec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5722] md:ml-0"
        >
          <Settings className="h-[1.125rem] w-[1.125rem]" />
        </Link>
      </div>
    </header>
  )
}
