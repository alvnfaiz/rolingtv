import { useMemo, useState } from 'react'
import { matchesSearch } from '../lib/ui'
import useChannelCatalog from '../hooks/useChannelCatalog'
import ChannelGrid from '../components/ChannelGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import Seo from '../components/Seo'

export default function Search() {
  const [query, setQuery] = useState('')
  const { loading, channels, categories } = useChannelCatalog()

  const results = useMemo(() => {
    if (!query.trim()) return []
    return channels.filter((channel) => matchesSearch(channel, query)).slice(0, 120)
  }, [channels, query])

  return (
    <div className="space-y-6">
      <Seo
        title="Cari Saluran TV"
        description="Cari saluran TV langsung dari SRG TV dan iptv-org."
      />
      <header>
        <h1 className="page-title">Cari saluran</h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">Cari di seluruh katalog SRG TV + iptv-org.</p>
      </header>

      <SearchBar value={query} onChange={setQuery} autoFocus placeholder="Cari dari semua saluran..." />
      {!query && <CategoryFilter categories={categories} />}

      {loading && !query ? (
        <div className="surface px-6 py-10 text-center text-sm text-[#8a8a8a]">
          Memuat katalog saluran…
        </div>
      ) : query ? (
        <>
          <p className="text-sm text-[#8a8a8a]">
            {results.length} hasil{results.length >= 120 ? ' (menampilkan 120 pertama)' : ''}
          </p>
          <ChannelGrid
            channels={results}
            emptyTitle="Tidak ada hasil"
            emptyText="Coba kata kunci lain, misalnya olahraga atau berita."
          />
        </>
      ) : (
        <div className="surface px-6 py-12 text-center">
          <p className="font-semibold">Ketik untuk mulai mencari</p>
          <p className="mt-1.5 text-sm text-[#8a8a8a]">Hasil muncul otomatis saat Anda mengetik.</p>
        </div>
      )}
    </div>
  )
}
