import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cast,
  Heart,
  MonitorPlay,
  RadioTower,
  Search,
  Sparkles,
  Tv,
} from 'lucide-react'
import channelData from '../lib/channelData'
import { formatChannelCount } from '../lib/ui'
import Seo from '../components/Seo'

const features = [
  {
    title: 'Siaran Langsung',
    description: 'Nonton ratusan saluran TV langsung dari olahraga, berita, film, musik, hingga hiburan internasional.',
    icon: RadioTower,
  },
  {
    title: 'Favorit & Riwayat',
    description: 'Simpan saluran favorit dan lanjutkan menonton dari daftar yang baru saja Anda buka.',
    icon: Heart,
  },
  {
    title: 'Cari & Kategori',
    description: 'Temukan saluran dengan cepat lewat pencarian atau filter kategori yang mudah dipahami.',
    icon: Search,
  },
  {
    title: 'Google Cast',
    description: 'Putar siaran ke Google TV atau perangkat Cast lain langsung dari pemutar SRG TV.',
    icon: Cast,
  },
  {
    title: 'Multi Perangkat',
    description: 'Nyaman dipakai di HP, tablet, laptop, browser desktop, maupun layar TV besar.',
    icon: MonitorPlay,
  },
  {
    title: 'Antarmuka Indonesia',
    description: 'Tampilan dan menu dalam Bahasa Indonesia agar lebih mudah digunakan sehari-hari.',
    icon: Tv,
  },
]

export default function Developer() {
  return (
    <div className="space-y-8 tv:space-y-12">
      <Seo
        title="Tentang SRG TV"
        description="SRG TV adalah aplikasi streaming TV langsung dengan favorit, pencarian, kategori, dan dukungan Google Cast."
      />
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8 tv:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(34,211,238,0.18),transparent_28%),linear-gradient(135deg,rgba(244,63,94,0.16),transparent_50%)]" />
        <div className="relative max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 tv:text-base">
            <Sparkles className="h-4 w-4 tv:h-6 tv:w-6" />
            Tentang Aplikasi
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl tv:text-8xl">SRG TV</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold text-cyan-100 sm:text-2xl tv:text-4xl">
            Platform nonton TV langsung yang praktis, gratis, dan ramah pengguna Indonesia.
          </p>
          <p className="mt-4 max-w-3xl text-base font-medium text-white/62 sm:text-lg tv:text-3xl">
            SRG TV menghadirkan pengalaman menonton siaran langsung dalam satu tempat — dari olahraga dan berita hingga film, musik, dan hiburan keluarga.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-6 text-base font-black text-slate-950 shadow-xl shadow-white/10 transition hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300/70 tv:min-h-20 tv:px-10 tv:text-3xl"
            >
              <Tv className="h-5 w-5 tv:h-9 tv:w-9" />
              Mulai Nonton
            </Link>
            <span className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-white/70 tv:text-2xl">
              {formatChannelCount(channelData.length)}
            </span>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 tv:gap-7">
        {features.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: index * 0.04 }}
              className="rounded-card border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl tv:p-8"
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300 text-slate-950 tv:h-20 tv:w-20">
                <Icon className="h-6 w-6 tv:h-11 tv:w-11" />
              </div>
              <h2 className="text-xl font-black tv:text-4xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/58 tv:text-2xl tv:leading-9">{item.description}</p>
            </motion.article>
          )
        })}
      </section>

      <section className="rounded-card border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl tv:p-8">
        <h2 className="text-2xl font-black tv:text-5xl">Catatan Penggunaan</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55 tv:text-2xl tv:leading-10">
          SRG TV menyediakan akses ke saluran siaran langsung untuk keperluan hiburan pribadi.
          Pastikan Anda memiliki hak atau izin yang diperlukan untuk menonton konten yang diputar.
          Kualitas siaran dapat berbeda tergantung jaringan internet dan ketersediaan sumber stream.
        </p>
      </section>
    </div>
  )
}
