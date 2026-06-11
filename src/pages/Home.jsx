import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock3, Heart, Play, RadioTower, Sparkles } from 'lucide-react'
import channelData from '../lib/channelData'
import { formatChannelCount, matchesSearch } from '../lib/ui'
import { useTvStore } from '../store/tvStore'
import ChannelCard from '../components/ChannelCard'
import ChannelGrid from '../components/ChannelGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import Seo from '../components/Seo'

const byIds = (ids) => ids.map((id) => channelData.find((channel) => channel.id === id)).filter(Boolean)

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-cyan-200 tv:h-14 tv:w-14">
          <Icon className="h-5 w-5 tv:h-7 tv:w-7" />
        </span>
        <h2 className="text-xl font-black tv:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const favoriteIds = useTvStore((state) => state.favoriteIds)
  const recentlyWatchedIds = useTvStore((state) => state.recentlyWatchedIds)
  const currentChannelId = useTvStore((state) => state.currentChannelId)

  const featured = channelData.find((channel) => channel.id === currentChannelId) || channelData[0]
  const favorites = useMemo(() => byIds(favoriteIds).slice(0, 8), [favoriteIds])
  const recentlyWatched = useMemo(() => byIds(recentlyWatchedIds).slice(0, 8), [recentlyWatchedIds])
  const filteredChannels = useMemo(() => {
    if (!query.trim()) return channelData
    return channelData.filter((channel) => matchesSearch(channel, query))
  }, [query])

  return (
    <>
      <Seo
        title="Beranda Siaran Langsung"
        description={`Nonton ${channelData.length} saluran TV langsung gratis. Simpan favorit, cari saluran, dan jelajahi kategori olahraga, berita, film, dan hiburan.`}
      />
      <div className="space-y-8 tv:space-y-12">
      <motion.section
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-6 lg:p-8 tv:p-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(34,211,238,0.18),transparent_28%),linear-gradient(135deg,rgba(244,63,94,0.12),transparent_45%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex min-h-[24rem] flex-col justify-between gap-6 rounded-[1.4rem] bg-black/25 p-5 sm:p-6 tv:min-h-[34rem] tv:p-10">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-100 tv:text-base">
                <Sparkles className="h-4 w-4 tv:h-6 tv:w-6" />
                Rekomendasi Hari Ini
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl tv:text-8xl">
                Nonton TV langsung, gratis & praktis.
              </h1>
              <p className="mt-4 max-w-2xl text-base font-medium text-white/62 sm:text-lg tv:text-3xl">
                Olahraga, berita, film, musik, kartun, dan hiburan internasional — semua dalam satu layar, cocok untuk HP, laptop, dan Smart TV.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/live/${featured.id}`}
                data-focusable="true"
                className="inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-6 text-base font-black text-slate-950 shadow-xl shadow-white/10 transition hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300/70 tv:min-h-20 tv:px-10 tv:text-3xl"
              >
                <Play className="h-5 w-5 fill-current tv:h-9 tv:w-9" />
                Tonton Sekarang
              </Link>
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-white/70 tv:text-2xl">
                {formatChannelCount(channelData.length)}
              </span>
            </div>
          </div>
          <ChannelCard channel={featured} featured />
        </div>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter compact />
      </section>

      {recentlyWatched.length > 0 && (
        <section>
          <SectionHeader icon={Clock3} title="Baru Ditonton" />
          <ChannelGrid channels={recentlyWatched} />
        </section>
      )}

      {favorites.length > 0 && (
        <section>
          <SectionHeader
            icon={Heart}
            title="Saluran Favorit"
            action={<Link to="/favorites" className="text-sm font-bold text-cyan-200 hover:text-white tv:text-xl">Lihat semua</Link>}
          />
          <ChannelGrid channels={favorites} />
        </section>
      )}

      <section>
        <SectionHeader icon={RadioTower} title={query ? 'Hasil Pencarian' : 'Semua Saluran'} />
        <ChannelGrid
          channels={filteredChannels}
          emptyTitle="Saluran tidak ditemukan"
          emptyText="Coba nama saluran atau kategori lain."
        />
      </section>
      </div>
    </>
  )
}
