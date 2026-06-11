import { useMemo, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import channelData from '../lib/channelData'
import { matchesSearch } from '../lib/ui'
import ChannelGrid from '../components/ChannelGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import Seo from '../components/Seo'

export default function Search() {
  const [query, setQuery] = useState('')

  const channels = useMemo(() => {
    if (!query.trim()) return []
    return channelData.filter((channel) => matchesSearch(channel, query))
  }, [query])

  return (
    <div className="space-y-6 tv:space-y-10">
      <Seo
        title="Cari Saluran TV"
        description="Cari saluran TV langsung berdasarkan nama atau kategori di SRG TV."
      />
      <header>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 tv:text-base">
          <SearchIcon className="h-4 w-4 tv:h-6 tv:w-6" />
          Pencarian
        </div>
        <h1 className="text-3xl font-black sm:text-5xl tv:text-7xl">Cari Saluran TV</h1>
        <p className="mt-2 text-white/55 tv:text-2xl">Ketik nama saluran, negara, atau kategori.</p>
      </header>

      <SearchBar value={query} onChange={setQuery} autoFocus />
      {!query && <CategoryFilter />}

      {query ? (
        <ChannelGrid
          channels={channels}
          emptyTitle="Tidak ada hasil"
          emptyText="Coba kata kunci lain, misalnya olahraga, berita, atau film."
        />
      ) : (
        <div className="rounded-card border border-white/10 bg-white/[0.06] px-6 py-14 text-center backdrop-blur-2xl">
          <p className="text-xl font-bold text-white tv:text-3xl">Mulai ketik untuk mencari</p>
          <p className="mt-2 text-sm text-white/55 tv:text-lg">Hasil akan muncul langsung saat Anda mengetik.</p>
        </div>
      )}
    </div>
  )
}
