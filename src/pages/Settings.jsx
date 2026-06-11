import { RotateCcw, Volume2 } from 'lucide-react'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <label className="surface flex cursor-pointer items-center justify-between gap-4 p-4">
      <span>
        <span className="block text-[0.9375rem] font-semibold">{title}</span>
        <span className="mt-0.5 block text-sm text-[#8a8a8a]">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[#ff5722]"
      />
    </label>
  )
}

export default function Settings() {
  const settings = useTvStore((state) => state.settings)
  const updateSettings = useTvStore((state) => state.updateSettings)
  const clearRecentlyWatched = useTvStore((state) => state.clearRecentlyWatched)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Seo
        title="Pengaturan"
        description="Atur preferensi pemutaran SRG TV."
        noIndex
      />
      <header>
        <h1 className="page-title">Pengaturan</h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">Disimpan di perangkat ini.</p>
      </header>

      <section className="space-y-2">
        <ToggleRow
          title="Putar otomatis"
          description="Mulai siaran begitu saluran siap."
          checked={settings.autoplay}
          onChange={(autoplay) => updateSettings({ autoplay })}
        />
        <ToggleRow
          title="Mulai tanpa suara"
          description="Buka saluran dalam mode bisu."
          checked={settings.muted}
          onChange={(muted) => updateSettings({ muted })}
        />
        <ToggleRow
          title="Kurangi animasi"
          description="Transisi lebih ringan di perangkat lambat."
          checked={settings.reducedMotion}
          onChange={(reducedMotion) => updateSettings({ reducedMotion })}
        />
      </section>

      <section className="surface p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <Volume2 className="h-4 w-4 text-[#8a8a8a]" />
          <div>
            <h2 className="text-[0.9375rem] font-semibold">Volume default</h2>
            <p className="text-sm text-[#8a8a8a]">{Math.round(settings.volume * 100)}%</p>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.volume}
          onChange={(event) => updateSettings({ volume: Number(event.target.value), muted: Number(event.target.value) === 0 })}
          className="h-2 w-full accent-[#ff5722]"
          aria-label="Volume default"
        />
      </section>

      <section className="space-y-2">
        <button type="button" onClick={clearRecentlyWatched} className="btn btn-ghost w-full">
          <RotateCcw className="h-4 w-4" />
          Hapus riwayat tonton
        </button>
        <p className="px-1 text-center text-xs text-[#666]">
          HLS.js · kualitas adaptif aktif
        </p>
      </section>
    </div>
  )
}
