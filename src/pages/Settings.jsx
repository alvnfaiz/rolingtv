import { RotateCcw, Settings as SettingsIcon, Volume2, Zap } from 'lucide-react'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-card border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl transition hover:bg-white/[0.09] tv:p-7">
      <span>
        <span className="block text-lg font-black tv:text-3xl">{title}</span>
        <span className="mt-1 block text-sm text-white/55 tv:text-xl">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-7 w-7 accent-cyan-300 tv:h-11 tv:w-11"
      />
    </label>
  )
}

export default function Settings() {
  const settings = useTvStore((state) => state.settings)
  const updateSettings = useTvStore((state) => state.updateSettings)
  const clearRecentlyWatched = useTvStore((state) => state.clearRecentlyWatched)

  return (
    <div className="mx-auto max-w-4xl space-y-6 tv:max-w-6xl tv:space-y-10">
      <Seo
        title="Pengaturan"
        description="Atur preferensi pemutaran SRG TV: volume, putar otomatis, dan opsi JWPlayer."
        noIndex
      />
      <header>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 tv:text-base">
          <SettingsIcon className="h-4 w-4 tv:h-6 tv:w-6" />
          Preferensi
        </div>
        <h1 className="text-3xl font-black sm:text-5xl tv:text-7xl">Pengaturan</h1>
        <p className="mt-2 text-white/55 tv:text-2xl">Pengaturan disimpan di perangkat ini.</p>
      </header>

      <section className="space-y-3">
        <ToggleRow
          title="Putar otomatis"
          description="Mulai siaran langsung begitu saluran siap diputar."
          checked={settings.autoplay}
          onChange={(autoplay) => updateSettings({ autoplay })}
        />
        <ToggleRow
          title="Mulai tanpa suara"
          description="Buka saluran dalam mode bisu sampai Anda menyalakan suara."
          checked={settings.muted}
          onChange={(muted) => updateSettings({ muted })}
        />
        <ToggleRow
          title="Kurangi animasi"
          description="Buat transisi lebih ringan untuk perangkat dengan performa terbatas."
          checked={settings.reducedMotion}
          onChange={(reducedMotion) => updateSettings({ reducedMotion })}
        />
      </section>

      <section className="rounded-card border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl tv:p-7">
        <div className="mb-4 flex items-center gap-3">
          <Volume2 className="h-6 w-6 text-cyan-200 tv:h-9 tv:w-9" />
          <div>
            <h2 className="text-lg font-black tv:text-3xl">Volume Default</h2>
            <p className="text-sm text-white/55 tv:text-xl">{Math.round(settings.volume * 100)}%</p>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.volume}
          onChange={(event) => updateSettings({ volume: Number(event.target.value), muted: Number(event.target.value) === 0 })}
          className="h-12 w-full accent-cyan-300"
          aria-label="Volume default"
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={clearRecentlyWatched}
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-card border border-white/10 bg-white/[0.07] px-5 font-bold text-white/80 transition hover:bg-white/[0.12] focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:min-h-20 tv:text-2xl"
        >
          <RotateCcw className="h-5 w-5 tv:h-8 tv:w-8" />
          Hapus Riwayat Tonton
        </button>
        <div className="flex min-h-14 items-center justify-center gap-3 rounded-card border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white/45 tv:min-h-20 tv:text-2xl">
          <Zap className="h-5 w-5 tv:h-8 tv:w-8" />
          JWPlayer + Google Cast aktif
        </div>
      </section>
    </div>
  )
}
