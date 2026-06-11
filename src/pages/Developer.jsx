import { Link } from 'react-router-dom'
import { Cast, Heart, RadioTower, Search, Tv } from 'lucide-react'
import useChannelCatalog from '../hooks/useChannelCatalog'
import { formatChannelCount } from '../lib/ui'
import Seo from '../components/Seo'

const features = [
  {
    title: 'Siaran langsung',
    description: 'Saluran kurasi SRG TV ditambah ribuan saluran dari iptv-org.',
    icon: RadioTower,
  },
  {
    title: 'Favorit',
    description: 'Simpan saluran yang sering Anda tonton.',
    icon: Heart,
  },
  {
    title: 'Pencarian',
    description: 'Cari saluran berdasarkan nama atau kategori.',
    icon: Search,
  },
  {
    title: 'Google Cast',
    description: 'Putar ke Google TV dari pemutar.',
    icon: Cast,
  },
]

export default function Developer() {
  const { count, loading } = useChannelCatalog()

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Seo
        title="Tentang SRG TV"
        description="SRG TV — aplikasi nonton TV langsung dengan katalog iptv-org, favorit, dan Google Cast."
      />
      <header>
        <h1 className="page-title">Tentang SRG TV</h1>
        <p className="mt-2 text-[0.9375rem] text-[#8a8a8a]">
          Aplikasi nonton TV langsung yang ringan dan mudah dipakai.
          {loading ? ' Memuat katalog…' : ` ${formatChannelCount(count)}.`}
        </p>
        <p className="mt-2 text-sm text-[#666]">
          Daftar IPTV diambil dari{' '}
          <a href="https://iptv-org.github.io/iptv/index.m3u" target="_blank" rel="noreferrer" className="text-[#ff5722] hover:underline">
            iptv-org
          </a>
          {' '}dan{' '}
          <a href="https://github.com/iptv-org/database/tree/master/data" target="_blank" rel="noreferrer" className="text-[#ff5722] hover:underline">
            database
          </a>
          .
        </p>
        <Link to="/" className="btn btn-primary mt-4">
          <Tv className="h-4 w-4" />
          Mulai nonton
        </Link>
      </header>

      <section className="space-y-2">
        {features.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="surface flex gap-4 p-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5722]" strokeWidth={1.75} />
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-0.5 text-sm text-[#8a8a8a]">{item.description}</p>
              </div>
            </div>
          )
        })}
      </section>

      <p className="text-xs leading-relaxed text-[#666]">
        SRG TV untuk hiburan pribadi. Pastikan Anda berhak menonton konten yang diputar.
        Kualitas siaran bergantung pada koneksi internet dan ketersediaan sumber.
      </p>
    </div>
  )
}
