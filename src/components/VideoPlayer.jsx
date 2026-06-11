import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Cast,
  List,
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
import ChannelListPanel from './ChannelListPanel'
import FavoriteButton from './FavoriteButton'
import { loadJwPlayer } from '../lib/jwplayerLoader'
import { getCategoryLabel } from '../lib/ui'
import { useTvStore } from '../store/tvStore'

const normalizeStreamUrl = (url = '') => url.replace(/&amp;/g, '&')

export default function VideoPlayer({ channel, channels = [], onNext, onPrevious, onSelectChannel }) {
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
  const [listOpen, setListOpen] = useState(false)

  const streamUrl = useMemo(() => normalizeStreamUrl(channel?.url), [channel?.url])
  const playerId = useMemo(() => `jwplayer-${channel?.id || 'live'}`, [channel?.id])

  const showControls = useCallback((autoHide = true) => {
    setControlsVisible(true)
    window.clearTimeout(hideTimerRef.current)
    if (autoHide && !listOpen) {
      hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3000)
    }
  }, [listOpen])

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
      if (event.key.toLowerCase() === 'l') {
        event.preventDefault()
        setListOpen((value) => !value)
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

  const toggleList = () => {
    setListOpen((value) => {
      const next = !value
      if (next) {
        window.clearTimeout(hideTimerRef.current)
        setControlsVisible(true)
      }
      return next
    })
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex items-center gap-3 text-sm text-[#ccc]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#444] border-t-[#ff5722]" />
            Memuat siaran…
          </div>
        </div>
      )}

      <ChannelListPanel
        open={listOpen}
        onClose={() => setListOpen(false)}
        channels={channels}
        currentId={channel?.id}
        onSelect={onSelectChannel}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-4">
          <div className="max-w-sm rounded border border-[#333] bg-[#1a1a1a] p-6 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-[#ff5722]" />
            <p className="mt-3 text-base font-semibold">{error}</p>
            <button type="button" onClick={reconnect} className="btn btn-primary mt-5">
              <RotateCcw className="h-4 w-4" />
              Coba lagi
            </button>
          </div>
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 z-20 p-3 transition-opacity duration-200 sm:p-4"
        style={{ opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? 'auto' : 'none' }}
      >
        <div className="rounded border border-[#333] bg-[#1a1a1a]/95 p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={channel.logo}
                alt={`Logo ${channel.name}`}
                className="h-11 w-11 rounded bg-[#242424] object-contain p-1.5"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
              <div className="min-w-0">
                <span className="live-badge mb-1">Live</span>
                <h1 className="truncate text-base font-semibold sm:text-lg">{channel.name}</h1>
                <p className="text-xs text-[#8a8a8a]">{getCategoryLabel(channel.category)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                className="h-2 w-24 accent-[#ff5722] sm:h-8 sm:w-28"
                aria-label="Volume"
              />
              <button
                type="button"
                aria-label="Daftar siaran"
                aria-pressed={listOpen}
                onClick={toggleList}
                className={listOpen ? 'player-button primary' : 'player-button'}
              >
                <List />
              </button>
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
      </div>
    </section>
  )
}
