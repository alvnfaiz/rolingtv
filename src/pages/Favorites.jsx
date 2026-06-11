import { Link } from 'react-router-dom'
import useChannelCatalog from '../hooks/useChannelCatalog'
import ChannelGrid from '../components/ChannelGrid'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'

export default function Favorites() {
  const { channels } = useChannelCatalog()
  const favoriteIds = useTvStore((state) => state.favoriteIds)
  const saved = favoriteIds.map((id) => channels.find((channel) => channel.id === id)).filter(Boolean)

  return (
    <div className="space-y-6">
      <Seo title="Saluran Favorit" description="Kelola saluran TV favorit Anda di SRG TV." />
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Favorit</h1>
          <p className="mt-1 text-sm text-[#8a8a8a]">Saluran yang Anda simpan.</p>
        </div>
        <Link to="/search" className="btn btn-ghost w-fit">
          Cari saluran
        </Link>
      </header>

      <ChannelGrid
        channels={saved}
        emptyTitle="Belum ada favorit"
        emptyText="Tekan ikon hati pada saluran untuk menyimpannya."
      />
    </div>
  )
}
