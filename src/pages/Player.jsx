import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import channelData from '../lib/channelData'
import { getCategoryLabel } from '../lib/ui'
import VideoPlayer from '../components/VideoPlayer'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const setCurrentChannel = useTvStore((state) => state.setCurrentChannel)

  const index = useMemo(() => channelData.findIndex((channel) => channel.id === id), [id])
  const channel = index >= 0 ? channelData[index] : null

  useEffect(() => {
    if (channel) setCurrentChannel(channel)
  }, [channel, setCurrentChannel])

  if (!channel) {
    return (
      <>
        <Seo title="Saluran Tidak Ditemukan" description="Saluran TV yang diminta tidak tersedia di katalog SRG TV." noIndex />
        <div className="grid min-h-screen place-items-center bg-[#06070d] px-6 text-center">
          <div>
            <p className="text-3xl font-black tv:text-6xl">Saluran tidak ditemukan</p>
            <p className="mt-3 text-white/55 tv:text-2xl">Saluran yang Anda minta tidak ada di daftar kami.</p>
            <Link to="/" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-slate-950 focus:outline-none focus:ring-4 focus:ring-cyan-300/70 tv:min-h-20 tv:px-10 tv:text-3xl">
              <Home className="h-5 w-5 tv:h-9 tv:w-9" />
              Ke Beranda
            </Link>
          </div>
        </div>
      </>
    )
  }

  const goNext = () => {
    const next = channelData[(index + 1) % channelData.length]
    navigate(`/live/${next.id}`)
  }

  const goPrevious = () => {
    const previous = channelData[(index - 1 + channelData.length) % channelData.length]
    navigate(`/live/${previous.id}`)
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Seo
        title={`${channel.name} Siaran Langsung`}
        description={`Nonton ${channel.name} secara langsung di SRG TV. Kategori: ${getCategoryLabel(channel.category)}.`}
        image={channel.logo || '/favicon.svg'}
        type="video.other"
      />
      <Link
        to="/"
        aria-label="Kembali ke beranda"
        className="absolute left-4 top-4 z-30 inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 font-bold text-white backdrop-blur-2xl transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-cyan-300/70 tv:left-8 tv:top-8 tv:h-20 tv:px-8 tv:text-3xl"
      >
        <ArrowLeft className="h-5 w-5 tv:h-9 tv:w-9" />
        <span className="hidden sm:inline">Kembali</span>
      </Link>
      <VideoPlayer channel={channel} onNext={goNext} onPrevious={goPrevious} />
    </div>
  )
}
