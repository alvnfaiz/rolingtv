import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatChannelCount, getCategoryLabel } from '../lib/ui'
import { getChannelsPage } from '../lib/channelRegistry'
import useChannelCatalog from '../hooks/useChannelCatalog'
import ChannelGrid from '../components/ChannelGrid'
import CategoryFilter from '../components/CategoryFilter'
import Pagination from '../components/Pagination'
import Seo from '../components/Seo'

const PAGE_SIZE = 48

export default function Category() {
  const { name = '' } = useParams()
  const category = decodeURIComponent(name)
  const categoryLabel = getCategoryLabel(category)
  const [page, setPage] = useState(1)
  const { loading, categories } = useChannelCatalog()

  const catalogPage = useMemo(
    () => getChannelsPage({ page, pageSize: PAGE_SIZE, category }),
    [page, category],
  )

  return (
    <div className="space-y-6">
      <Seo
        title={`Saluran ${categoryLabel}`}
        description={`Nonton saluran ${categoryLabel} secara langsung di SRG TV.`}
      />
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-[#8a8a8a]">Kategori</p>
            <h1 className="page-title mt-0.5">{categoryLabel}</h1>
            <p className="mt-1 text-sm text-[#8a8a8a]">{formatChannelCount(catalogPage.total)}</p>
          </div>
          <Link to="/search" className="btn btn-ghost w-fit">
            Cari
          </Link>
        </div>
        {!loading && <CategoryFilter categories={categories} active={category} />}
      </header>

      {loading ? (
        <div className="surface px-6 py-10 text-center text-sm text-[#8a8a8a]">
          Memuat saluran…
        </div>
      ) : (
        <>
          <ChannelGrid
            channels={catalogPage.items}
            emptyTitle="Kategori tidak ditemukan"
            emptyText="Pilih kategori lain dari daftar di atas."
          />
          <Pagination
            page={catalogPage.page}
            totalPages={catalogPage.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
