import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import {
  AlertTriangle,
  List,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  Wifi,
} from 'lucide-react'
import ChannelListPanel from './ChannelListPanel'
import FavoriteButton from './FavoriteButton'
import { normalizeStreamUrl } from '../lib/streamProxy'
import { getCategoryLabel } from '../lib/ui'
import { useTvStore } from '../store/tvStore'

const buildQualityOptions = (levels = []) => {
  const byHeight = new Map()
  levels.forEach((level, index) => {
    if (!level?.height) return
    const current = byHeight.get(level.height)
    if (!current || level.bitrate > current.bitrate) {
      byHeight.set(level.height, {
        height: level.height,
        bitrate: level.bitrate || 0,
        levelIndex: index,
      })
    }
  })
  return Array.from(byHeight.values()).sort((a, b) => a.height - b.height)
}

const findLevelIndexByHeight = (levels, height) => {
  const matches = levels
    .map((level, index) => ({ ...level, levelIndex: index }))
    .filter((level) => level.height === height)
    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))
  return matches[0]?.levelIndex ?? -1
}

const HLS_CONFIG = {
  liveDurationInfinity: true,
  lowLatencyMode: true,
  liveBackBufferLength: 30,
  backBufferLength: 30,
  maxBufferLength: 30,
  maxMaxBufferLength: 60,
  maxBufferSize: 30 * 1000 * 1000,
  maxBufferHole: 0.5,
  enableWorker: true,
  manifestLoadingMaxRetry: 6,
  manifestLoadingRetryDelay: 500,
  manifestLoadingMaxRetryTimeout: 8000,
  fragLoadingMaxRetry: 6,
  fragLoadingRetryDelay: 500,
  levelLoadingMaxRetry: 6,
  levelLoadingRetryDelay: 500,
  nudgeMaxRetry: 5,
  nudgeOffset: 0.3,
  maxStarvationDelay: 4,
  maxLoadingDelay: 4,
  startPosition: -1,
}

export default function VideoPlayer({ channel, channels = [], onNext, onPrevious, onSelectChannel }) {
  const videoRef = useRef(null)
  const shellRef = useRef(null)
  const hlsRef = useRef(null)
  const reconnectRef = useRef(0)
  const hideTimerRef = useRef(null)
  const stallTimerRef = useRef(null)
  const mountedRef = useRef(true)
  const selectedQualityRef = useRef('auto')

  const settings = useTvStore((state) => state.settings)
  const updateSettings = useTvStore((state) => state.updateSettings)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(settings.muted)
  const [volume, setVolume] = useState(settings.volume)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState('')
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [qualityOptions, setQualityOptions] = useState([])
  const [selectedQuality, setSelectedQuality] = useState(settings.streamQuality || 'auto')
  const [activeQuality, setActiveQuality] = useState('auto')
  const [networkError, setNetworkError] = useState(false)
  const [listOpen, setListOpen] = useState(false)

  const streamUrl = useMemo(() => normalizeStreamUrl(channel?.url), [channel?.url])

  selectedQualityRef.current = selectedQuality

  const showControls = useCallback((autoHide = true) => {
    setControlsVisible(true)
    window.clearTimeout(hideTimerRef.current)
    if (autoHide && !listOpen) {
      hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3000)
    }
  }, [listOpen])

  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    try {
      await video.play()
      if (mountedRef.current) {
        setIsPlaying(true)
        setError('')
        setNetworkError(false)
      }
    } catch (playError) {
      if (!mountedRef.current) return
      setIsPlaying(false)
      if (playError?.name !== 'AbortError') {
        setError('Pemutaran diblokir. Tekan putar untuk memulai siaran.')
      }
    }
  }, [])

  const reconnect = useCallback(() => {
    if (!streamUrl) return
    reconnectRef.current = 0
    setError('')
    setNetworkError(false)
    setIsLoading(true)
    setIsBuffering(false)
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    setReloadKey((key) => key + 1)
  }, [streamUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !streamUrl) return undefined

    mountedRef.current = true
    reconnectRef.current = 0
    setError('')
    setNetworkError(false)
    setIsLoading(true)
    setIsBuffering(false)
    setIsPlaying(false)
    setQualityOptions([])
    setActiveQuality('auto')

    let lastTime = -1
    let stallCount = 0

    function startStallWatchdog() {
      window.clearInterval(stallTimerRef.current)
      stallTimerRef.current = window.setInterval(() => {
        const v = videoRef.current
        if (!v || v.paused || v.ended) return
        if (v.currentTime === lastTime) {
          stallCount++
          if (stallCount >= 3 && hlsRef.current) {
            hlsRef.current.startLoad()
          }
        } else {
          stallCount = 0
        }
        lastTime = v.currentTime
      }, 2000)
    }

    const onWaiting = () => {
      if (mountedRef.current) setIsBuffering(true)
    }
    const onStalled = () => {
      if (mountedRef.current) setIsBuffering(true)
    }
    const onPlaying = () => {
      if (!mountedRef.current) return
      setIsLoading(false)
      setIsBuffering(false)
      setIsPlaying(true)
      setError('')
      startStallWatchdog()
    }
    const onPause = () => {
      if (mountedRef.current) setIsPlaying(false)
    }
    const onCanPlay = () => {
      if (!mountedRef.current) return
      setIsLoading(false)
      if (settings.autoplay) play()
    }
    const onTimeUpdate = () => {
      if (mountedRef.current) setIsBuffering(false)
    }
    const onVideoError = () => {
      if (!mountedRef.current) return
      setError('Siaran sementara tidak tersedia.')
      setIsLoading(false)
      setIsBuffering(false)
    }

    video.addEventListener('waiting', onWaiting)
    video.addEventListener('stalled', onStalled)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('pause', onPause)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('error', onVideoError)

    if (Hls.isSupported()) {
      const hls = new Hls(HLS_CONFIG)
      hlsRef.current = hls

      hls.loadSource(streamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!mountedRef.current) return
        const options = buildQualityOptions(hls.levels)
        setQualityOptions(options)

        const preferredQuality = selectedQualityRef.current
        if (preferredQuality === 'auto') {
          hls.currentLevel = -1
        } else {
          const levelIndex = findLevelIndexByHeight(hls.levels, Number(preferredQuality))
          if (levelIndex >= 0) {
            hls.currentLevel = levelIndex
          } else {
            selectedQualityRef.current = 'auto'
            setSelectedQuality('auto')
            updateSettings({ streamQuality: 'auto' })
            hls.currentLevel = -1
          }
        }

        setIsLoading(false)
        if (settings.autoplay) play()
      })

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        if (!mountedRef.current) return
        const height = hls.levels[data.level]?.height
        setActiveQuality(height ? String(height) : 'auto')
      })

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        if (mountedRef.current) setIsBuffering(false)
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!mountedRef.current || !data?.fatal) return

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setNetworkError(true)
          if (reconnectRef.current < 5) {
            reconnectRef.current++
            setIsBuffering(true)
            const delay = Math.min(500 * 2 ** (reconnectRef.current - 1), 8000)
            window.setTimeout(() => {
              if (hlsRef.current) hlsRef.current.startLoad()
            }, delay)
            return
          }
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR && reconnectRef.current < 3) {
          reconnectRef.current++
          hls.recoverMediaError()
          return
        }

        setError('Koneksi siaran gagal. Coba sambungkan ulang.')
        setIsLoading(false)
        setIsBuffering(false)
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl
      video.load()
    } else {
      setError('Browser ini tidak mendukung siaran HLS.')
      setIsLoading(false)
    }

    return () => {
      mountedRef.current = false
      window.clearTimeout(hideTimerRef.current)
      window.clearInterval(stallTimerRef.current)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('stalled', onStalled)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('error', onVideoError)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      setQualityOptions([])
      video.removeAttribute('src')
      video.load()
    }
  }, [streamUrl, settings.autoplay, play, reloadKey, updateSettings])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = isMuted
    video.volume = volume
    updateSettings({ muted: isMuted, volume })
  }, [isMuted, volume, updateSettings])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    window.clearTimeout(hideTimerRef.current)
    if (!listOpen) {
      hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3000)
    }

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
        isPlaying ? videoRef.current?.pause() : play()
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
  }, [isPlaying, onNext, onPrevious, play, showControls, listOpen])

  const togglePlay = () => {
    showControls()
    if (isPlaying) {
      videoRef.current?.pause()
    } else {
      play()
    }
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

  const onQualityChange = (event) => {
    const nextQuality = event.target.value
    const hls = hlsRef.current

    selectedQualityRef.current = nextQuality
    setSelectedQuality(nextQuality)
    updateSettings({ streamQuality: nextQuality })

    if (hls) {
      if (nextQuality === 'auto') {
        hls.currentLevel = -1
      } else {
        const levelIndex = findLevelIndexByHeight(hls.levels, Number(nextQuality))
        hls.currentLevel = levelIndex >= 0 ? levelIndex : -1
      }
    }

    showControls()
  }

  const visibleQualityOptions = qualityOptions.filter((quality) =>
    [240, 360, 480, 720, 1080].includes(quality.height),
  )
  const qualityChoices = visibleQualityOptions.length > 1 ? visibleQualityOptions : qualityOptions
  const showSpinner = isLoading || isBuffering
  const bufferingLabel = isLoading ? 'Memuat siaran…' : networkError ? 'Menyambung ulang…' : 'Buffering…'

  return (
    <section
      ref={shellRef}
      onMouseMove={showControls}
      onFocus={showControls}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        playsInline
        autoPlay={settings.autoplay}
        muted={isMuted}
        className="h-screen w-full bg-black object-contain"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      {showSpinner && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-12 w-12">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-[#444] border-t-[#ff5722]" />
              {networkError
                ? <Wifi className="absolute inset-0 m-auto h-5 w-5 text-[#ff8a65]" />
                : <Play className="absolute inset-0 m-auto h-5 w-5 fill-[#ff8a65] text-[#ff8a65]" />
              }
            </div>
            <p className="text-sm font-medium text-[#ccc]">{bufferingLabel}</p>
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
              {qualityChoices.length > 1 && (
                <label className="quality-select-wrap">
                  <Settings2 className="h-4 w-4 text-[#ff8a65]" />
                  <span className="sr-only">Kualitas HLS</span>
                  <select
                    value={selectedQuality}
                    onChange={onQualityChange}
                    onFocus={showControls}
                    aria-label={`Kualitas siaran${selectedQuality === 'auto' && activeQuality !== 'auto' ? `, aktif ${activeQuality}p` : selectedQuality !== 'auto' ? ` ${selectedQuality}p` : ''}`}
                    className="quality-select"
                  >
                    <option value="auto">Auto{activeQuality !== 'auto' ? ` (${activeQuality}p)` : ''}</option>
                    {qualityChoices.map((quality) => (
                      <option key={quality.height} value={quality.height}>
                        {quality.height}p
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                type="button"
                aria-label="Daftar siaran"
                aria-pressed={listOpen}
                onClick={toggleList}
                className={listOpen ? 'player-button primary' : 'player-button'}
              >
                <List />
              </button>
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
