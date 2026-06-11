import { NavLink } from 'react-router-dom'
import { getCategoryLabel } from '../lib/ui'

export default function CategoryFilter({ categories = [], active = 'Semua' }) {
  const isAllActive = active === 'Semua' || active === 'All'

  return (
    <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
      <NavLink
        to="/"
        data-focusable="true"
        className={({ isActive }) => [
          'shrink-0 rounded px-3 py-1.5 text-sm font-medium transition',
          (isActive && isAllActive) || isAllActive
            ? 'bg-[#ff5722] text-white'
            : 'bg-[#242424] text-[#8a8a8a] hover:text-[#ececec]',
        ].join(' ')}
      >
        Semua
      </NavLink>
      {categories.map((category) => (
        <NavLink
          key={category}
          to={`/category/${encodeURIComponent(category)}`}
          data-focusable="true"
          className={({ isActive }) => [
            'shrink-0 rounded px-3 py-1.5 text-sm font-medium transition',
            isActive || active === category
              ? 'bg-[#ff5722] text-white'
              : 'bg-[#242424] text-[#8a8a8a] hover:text-[#ececec]',
          ].join(' ')}
        >
          {getCategoryLabel(category)}
        </NavLink>
      ))}
    </div>
  )
}
