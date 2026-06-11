import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import channelData from '../lib/channelData'
import ChannelGrid from '../components/ChannelGrid'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'

export default function Favorites() {
  const favoriteIds = useTvStore((state) => state.favoriteIds)
  const channels = favoriteIds.map((id) => channelData.find((channel) => channel.id === id)).filter(Boolean)

  return (
    <div className="space-y-6 tv:space-y-10">
      <Seo
        title="Saluran Favorit"
        description="Kelola saluran TV langsung favorit Anda di SRG TV."
      />
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-300/25 bg-rose-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100 tv:text-base">
            <Heart className="h-4 w-4 tv:h-6 tv:w-6" />
            Favorit
          </div>
          <h1 className="text-3xl font-black sm:text-5xl tv:text-7xl">Saluran Favorit</h1>
          <p className="mt-2 text-white/55 tv:text-2xl">Saluran yang Anda simpan akan tetap ada setelah halaman dimuat ulang.</p>
        </div>
        <Link to="/search" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] px-5 font-bold text-white/75 transition hover:bg-white/[0.12] focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:min-h-20 tv:px-8 tv:text-2xl">
          Cari Saluran
        </Link>
      </header>

      <ChannelGrid
        channels={channels}
        emptyTitle="Belum ada favorit"
        emptyText="Tekan ikon hati pada saluran mana pun untuk menyimpannya di sini."
      />
    </div>
  )
}
