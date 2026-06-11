import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, autoFocus = false, placeholder = 'Cari saluran...' }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-11 w-full rounded border border-[#2e2e2e] bg-[#1a1a1a] py-2 pl-10 pr-10 text-[0.9375rem] text-[#ececec] placeholder:text-[#666] focus:border-[#ff5722] focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-[#8a8a8a] hover:bg-[#242424] hover:text-[#ececec]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </label>
  )
}
