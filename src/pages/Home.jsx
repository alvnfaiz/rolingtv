import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { formatChannelCount, matchesSearch } from '../lib/ui'
import { getChannelsPage, getLocalChannels } from '../lib/channelRegistry'
import useChannelCatalog from '../hooks/useChannelCatalog'
import { useTvStore } from '../store/tvStore'
import ChannelCard from '../components/ChannelCard'
import ChannelGrid from '../components/ChannelGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import Pagination from '../components/Pagination'
import Seo from '../components/Seo'

const PAGE_SIZE = 48

const byIds = (ids, pool) => ids.map((id) => pool.find((channel) => channel.id === id)).filter(Boolean)

function Section({ title, action, children }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { loading, error, channels, categories, count } = useChannelCatalog()
  const favoriteIds = useTvStore((state) => state.favoriteIds)
  const recentlyWatchedIds = useTvStore((state) => state.recentlyWatchedIds)
  const currentChannelId = useTvStore((state) => state.currentChannelId)

  const localChannels = useMemo(() => getLocalChannels(), [])
  const featured = channels.find((channel) => channel.id === currentChannelId)
    || localChannels[0]
    || channels[0]

  const favorites = useMemo(() => byIds(favoriteIds, channels).slice(0, 8), [favoriteIds, channels])
  const recentlyWatched = useMemo(() => byIds(recentlyWatchedIds, channels).slice(0, 8), [recentlyWatchedIds, channels])

  const catalogPage = useMemo(() => {
    if (query.trim()) {
      const filtered = channels.filter((channel) => matchesSearch(channel, query))
      const start = (page - 1) * PAGE_SIZE
      return {
        items: filtered.slice(start, start + PAGE_SIZE),
        total: filtered.length,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
      }
    }
    return getChannelsPage({ page, pageSize: PAGE_SIZE })
  }, [channels, query, page])

  const onSearchChange = (value) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <>
      <Seo
        title="Beranda Siaran Langsung"
        description={`Nonton ${count || localChannels.length}+ saluran TV langsung. Termasuk daftar iptv-org dan saluran kurasi SRG TV.`}
      />
      <div className="space-y-8">
        {featured && (
          <section className="surface overflow-hidden">
            <div className="border-b border-[#2e2e2e] px-5 py-4 sm:px-6">
              <p className="text-sm text-[#8a8a8a]">
                {loading ? 'Memuat daftar IPTV…' : formatChannelCount(count || localChannels.length)}
              </p>
              <h1 className="page-title mt-1">Siaran TV Langsung</h1>
              <p className="mt-2 max-w-xl text-sm text-[#8a8a8a] sm:text-[0.9375rem]">
                Saluran kurasi SRG TV + ribuan saluran dari{' '}
                <a
                  href="https://iptv-org.github.io/iptv/index.m3u"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#ff5722] hover:underline"
                >
                  iptv-org
                </a>
                .
              </p>
              <Link to={`/live/${featured.id}`} data-focusable="true" className="btn btn-primary mt-4">
                <Play className="h-4 w-4 fill-current" />
                Lanjutkan nonton
              </Link>
            </div>
            <div className="p-4 sm:p-5">
              <ChannelCard channel={featured} featured />
            </div>
          </section>
        )}

        {error && (
          <div className="surface border-[#5c2b1f] bg-[#2a1510] px-4 py-3 text-sm text-[#ffb199]">
            {error}. Saluran lokal SRG TV tetap tersedia.
          </div>
        )}

        <div className="space-y-3">
          <SearchBar value={query} onChange={onSearchChange} placeholder="Cari dari semua saluran..." />
          {!query && <CategoryFilter categories={categories} />}
        </div>

        {recentlyWatched.length > 0 && (
          <Section title="Baru ditonton">
            <ChannelGrid channels={recentlyWatched} />
          </Section>
        )}

        {favorites.length > 0 && (
          <Section
            title="Favorit"
            action={
              <Link to="/favorites" className="text-sm font-medium text-[#ff5722] hover:underline">
                Semua
              </Link>
            }
          >
            <ChannelGrid channels={favorites} />
          </Section>
        )}

        {localChannels.length > 0 && !query && (
          <Section title="Saluran SRG TV">
            <ChannelGrid channels={localChannels} />
          </Section>
        )}

        <Section title={query ? 'Hasil pencarian' : 'Semua saluran'}>
          {loading && !query ? (
            <div className="surface px-6 py-10 text-center text-sm text-[#8a8a8a]">
              Memuat 11.000+ saluran iptv-org…
            </div>
          ) : (
            <>
              <ChannelGrid
                channels={catalogPage.items}
                emptyTitle="Saluran tidak ditemukan"
                emptyText="Coba nama saluran atau kategori lain."
              />
              <Pagination
                page={catalogPage.page}
                totalPages={catalogPage.totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </Section>
      </div>
    </>
  )
}
