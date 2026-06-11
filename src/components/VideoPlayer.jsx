import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Cast,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import { loadJwPlayer } from '../lib/jwplayerLoader'
import { getCategoryLabel } from '../lib/ui'
import { useTvStore } from '../store/tvStore'

const normalizeStreamUrl = (url = '') => url.replace(/&amp;/g, '&')

export default function VideoPlayer({ channel, onNext, onPrevious }) {
  const containerRef = useRef(null)
  const shellRef = useRef(null)
  const playerRef = useRef(null)
  const hideTimerRef = useRef(null)
  const mountedRef = useRef(true)

  const settings = useTvStore((state) => state.settings)
  const updateSettings = useTvStore((state) => state.updateSettings)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(settings.muted)
  const [volume, setVolume] = useState(settings.volume)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [castAvailable, setCastAvailable] = useState(false)

  const streamUrl = useMemo(() => normalizeStreamUrl(channel?.url), [channel?.url])
  const playerId = useMemo(() => `jwplayer-${channel?.id || 'live'}`, [channel?.id])

  const showControls = useCallback(() => {
    setControlsVisible(true)
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3000)
  }, [])

  const reconnect = useCallback(() => {
    setError('')
    setIsLoading(true)
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !streamUrl) return undefined

    mountedRef.current = true
    let player = null

    const initPlayer = async () => {
      try {
        const jw = await loadJwPlayer()
        if (!mountedRef.current || !containerRef.current) return

        container.innerHTML = `<div id="${playerId}"></div>`

        player = jw(playerId).setup({
          playlist: [{
            file: streamUrl,
            type: 'hls',
            title: channel.name,
            image: channel.logo,
          }],
          width: '100%',
          height: '100%',
          autostart: settings.autoplay,
          mute: settings.muted,
          controls: false,
          stretching: 'uniform',
          cast: {},
          abouttext: 'SRG TV',
          aboutlink: window.location.origin,
        })

        playerRef.current = player

        player.on('ready', () => {
          if (!mountedRef.current) return
          setIsLoading(false)
          setCastAvailable(Boolean(player.getPlugin?.('cast') || player.castToggle))
          player.setVolume(Math.round(settings.volume * 100))
          if (settings.muted) player.setMute(true)
        })

        player.on('play', () => {
          if (!mountedRef.current) return
          setIsPlaying(true)
          setIsLoading(false)
          setError('')
        })

        player.on('pause', () => {
          if (mountedRef.current) setIsPlaying(false)
        })

        player.on('buffer', () => {
          if (mountedRef.current) setIsLoading(true)
        })

        player.on('bufferFull', () => {
          if (mountedRef.current) setIsLoading(false)
        })

        player.on('complete', () => {
          if (mountedRef.current) setIsPlaying(false)
        })

        player.on('error', () => {
          if (!mountedRef.current) return
          setError('Koneksi siaran gagal. Coba sambungkan ulang.')
          setIsLoading(false)
          setIsPlaying(false)
        })
      } catch {
        if (mountedRef.current) {
          setError('Pemutar video gagal dimuat.')
          setIsLoading(false)
        }
      }
    }

    setError('')
    setIsLoading(true)
    setIsPlaying(false)
    initPlayer()

    return () => {
      mountedRef.current = false
      window.clearTimeout(hideTimerRef.current)
      if (playerRef.current) {
        playerRef.current.remove()
        playerRef.current = null
      }
      container.innerHTML = ''
    }
  }, [streamUrl, settings.autoplay, settings.muted, settings.volume, reloadKey, playerId, channel.logo, channel.name])

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    player.setVolume(Math.round(volume * 100))
    player.setMute(isMuted)
    updateSettings({ muted: isMuted, volume })
  }, [isMuted, volume, updateSettings])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3000)

    const onKeyDown = (event) => {
      const tagName = document.activeElement?.tagName?.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        onPrevious?.()
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        onNext?.()
      }
      if (event.key === ' ') {
        event.preventDefault()
        const player = playerRef.current
        if (!player) return
        player.getState() === 'playing' ? player.pause() : player.play()
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        toggleFullscreen()
      }
      showControls()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onNext, onPrevious, showControls])

  const togglePlay = () => {
    showControls()
    const player = playerRef.current
    if (!player) return
    player.getState() === 'playing' ? player.pause() : player.play()
  }

  const toggleCast = () => {
    showControls()
    playerRef.current?.castToggle?.()
  }

  function toggleFullscreen() {
    const shell = shellRef.current
    if (!shell) return
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      shell.requestFullscreen?.()
    }
  }

  const onVolumeChange = (event) => {
    const nextVolume = Number(event.target.value)
    setVolume(nextVolume)
    setIsMuted(nextVolume === 0)
    showControls()
  }

  return (
    <section
      ref={shellRef}
      onMouseMove={showControls}
      onFocus={showControls}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <div ref={containerRef} className="h-screen w-full bg-black" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/65" />

      {isLoading && !error && (
        <div className="absolute inset-0 grid place-items-center bg-black/35">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16 tv:h-24 tv:w-24">
              <svg className="absolute inset-0 h-full w-full animate-spin" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="rgb(255 255 255 / 0.12)" strokeWidth="4" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgb(103 232 249)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="62.83"
                  strokeDashoffset="47"
                />
              </svg>
              <Play className="absolute inset-0 m-auto h-6 w-6 fill-cyan-300 text-cyan-300 tv:h-9 tv:w-9" />
            </div>
            <p className="text-base font-semibold text-white tv:text-2xl">Memuat siaran langsung…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 px-4">
          <div className="max-w-xl rounded-card border border-red-300/30 bg-red-950/35 p-6 text-center shadow-2xl backdrop-blur-2xl tv:max-w-3xl tv:p-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-300 tv:h-20 tv:w-20" />
            <p className="mt-4 text-xl font-black tv:text-4xl">{error}</p>
            <button
              type="button"
              onClick={reconnect}
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 font-bold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/70 tv:min-h-16 tv:px-8 tv:text-2xl"
            >
              <RotateCcw className="h-5 w-5 tv:h-8 tv:w-8" />
              Sambungkan Ulang
            </button>
          </div>
        </div>
      )}

      <motion.div
        animate={{ opacity: controlsVisible ? 1 : 0, y: controlsVisible ? 0 : 18 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6 tv:p-10"
      >
        <div className="rounded-card border border-white/10 bg-black/45 p-4 shadow-2xl backdrop-blur-2xl tv:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <img
                src={channel.logo}
                alt={`Logo ${channel.name}`}
                className="h-14 w-14 rounded-2xl border border-white/10 bg-white/10 object-contain p-2 tv:h-24 tv:w-24"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-100 tv:text-base">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                  LIVE
                </div>
                <h1 className="truncate text-xl font-black sm:text-3xl tv:text-5xl">{channel.name}</h1>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/50 tv:text-xl">{getCategoryLabel(channel.category)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button type="button" aria-label="Saluran sebelumnya" onClick={onPrevious} className="player-button">
                <SkipBack />
              </button>
              <button type="button" aria-label={isPlaying ? 'Jeda' : 'Putar'} onClick={togglePlay} className="player-button primary">
                {isPlaying ? <Pause /> : <Play className="fill-current" />}
              </button>
              <button type="button" aria-label="Saluran berikutnya" onClick={onNext} className="player-button">
                <SkipForward />
              </button>
              <button type="button" aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'} onClick={() => setIsMuted((value) => !value)} className="player-button">
                {isMuted || volume === 0 ? <VolumeX /> : volume > 0.55 ? <Volume2 /> : <Volume1 />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={onVolumeChange}
                className="h-12 w-28 accent-cyan-300 tv:w-48"
                aria-label="Volume"
              />
              {castAvailable && (
                <button type="button" aria-label="Putar ke Google TV" onClick={toggleCast} className="player-button">
                  <Cast />
                </button>
              )}
              <FavoriteButton channel={channel} />
              <button type="button" aria-label="Layar penuh" onClick={toggleFullscreen} className="player-button">
                {isFullscreen ? <Minimize /> : <Maximize />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
