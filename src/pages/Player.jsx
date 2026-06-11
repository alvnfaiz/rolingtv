import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { findChannelById, findChannelIndex, getMergedChannels } from '../lib/channelRegistry'
import useChannelCatalog from '../hooks/useChannelCatalog'
import { getCategoryLabel } from '../lib/ui'
import VideoPlayer from '../components/VideoPlayer'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'
import Loading from '../components/Loading'

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading, version } = useChannelCatalog()
  const setCurrentChannel = useTvStore((state) => state.setCurrentChannel)

  const channel = useMemo(() => findChannelById(id), [id, version])
  const index = useMemo(() => findChannelIndex(id), [id, version])

  useEffect(() => {
    if (channel) setCurrentChannel(channel)
  }, [channel, setCurrentChannel])

  if (loading && !channel) {
    return <Loading label="Memuat saluran" />
  }

  if (!channel) {
    return (
      <>
        <Seo title="Saluran Tidak Ditemukan" description="Saluran tidak tersedia di SRG TV." noIndex />
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#101010] px-6 text-center">
          <p className="text-xl font-semibold">Saluran tidak ditemukan</p>
          <p className="mt-2 text-sm text-[#8a8a8a]">Saluran ini tidak ada di daftar kami.</p>
          <Link to="/" className="btn btn-primary mt-6">
            Ke beranda
          </Link>
        </div>
      </>
    )
  }

  const allChannels = getMergedChannels()

  const goNext = () => {
    const next = allChannels[(index + 1) % allChannels.length]
    if (next) navigate(`/live/${next.id}`)
  }

  const goPrevious = () => {
    const previous = allChannels[(index - 1 + allChannels.length) % allChannels.length]
    if (previous) navigate(`/live/${previous.id}`)
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Seo
        title={`${channel.name} Siaran Langsung`}
        description={`Nonton ${channel.name} di SRG TV. Kategori: ${getCategoryLabel(channel.category)}.`}
        image={channel.logo || '/favicon.svg'}
        type="video.other"
      />
      <Link
        to="/"
        aria-label="Kembali"
        className="absolute left-3 top-3 z-30 flex h-9 items-center gap-1.5 rounded bg-black/70 px-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/90 sm:left-4 sm:top-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
      <VideoPlayer
        channel={channel}
        channels={allChannels}
        onNext={goNext}
        onPrevious={goPrevious}
        onSelectChannel={(next) => navigate(`/live/${next.id}`)}
      />
    </div>
  )
}
