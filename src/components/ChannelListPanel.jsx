import { useEffect, useMemo, useRef, useState } from 'react'
import { Radio, Search, X } from 'lucide-react'
import { getCategoryLabel } from '../lib/ui'

export default function ChannelListPanel({
  open,
  onClose,
  channels = [],
  currentId,
  onSelect,
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const current = channels.find((channel) => channel.id === currentId)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    if (term) {
      return channels
        .filter((channel) =>
          `${channel.name} ${channel.category}`.toLowerCase().includes(term),
        )
        .slice(0, 100)
    }

    if (current?.category) {
      const sameCategory = channels.filter((channel) => channel.category === current.category)
      if (sameCategory.length > 0) return sameCategory.slice(0, 120)
    }

    return channels.slice(0, 80)
  }, [channels, query, current])

  useEffect(() => {
    if (!open) {
      setQuery('')
      return undefined
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 120)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const heading = query.trim()
    ? `Hasil pencarian (${filtered.length})`
    : current?.category
      ? `Kategori: ${getCategoryLabel(current.category)}`
      : 'Daftar saluran'

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-end bg-black/65 sm:items-stretch"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Daftar saluran"
    >
      <aside
        className="flex h-[78vh] w-full flex-col border-t border-[#333] bg-[#141414] sm:h-full sm:max-w-md sm:border-l sm:border-t-0"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2e2e2e] px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">Daftar siaran</h2>
            <p className="text-xs text-[#8a8a8a]">{heading}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar"
            className="flex h-9 w-9 items-center justify-center rounded text-[#8a8a8a] hover:bg-[#242424] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[#2e2e2e] px-4 py-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari saluran..."
              className="h-10 w-full rounded border border-[#2e2e2e] bg-[#1a1a1a] py-2 pl-9 pr-3 text-sm text-white placeholder:text-[#666] focus:border-[#ff5722] focus:outline-none"
            />
          </label>
          {!query.trim() && (
            <p className="mt-2 text-xs text-[#666]">
              Ketik untuk mencari di {channels.length.toLocaleString('id-ID')} saluran.
            </p>
          )}
        </div>

        <ul className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-[#8a8a8a]">
              Saluran tidak ditemukan.
            </li>
          ) : (
            filtered.map((item) => {
              const active = item.id === currentId
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect?.(item)
                      onClose()
                    }}
                    className={[
                      'flex w-full items-center gap-3 border-b border-[#1f1f1f] px-4 py-3 text-left transition',
                      active ? 'bg-[#2a1812] text-[#ffab91]' : 'hover:bg-[#1f1f1f]',
                    ].join(' ')}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#242424] p-1.5">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <Radio className="h-4 w-4 text-[#666]" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.name}</span>
                      <span className="block truncate text-xs text-[#8a8a8a]">
                        {getCategoryLabel(item.category)}
                      </span>
                    </span>
                    {active && (
                      <span className="shrink-0 text-[0.625rem] font-semibold uppercase text-[#ff5722]">
                        Aktif
                      </span>
                    )}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </aside>
    </div>
  )
}
