import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Radio } from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import { getCategoryLabel } from '../lib/ui'

function ChannelCard({ channel, index = 0, featured = false }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.025, 0.22) }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group relative"
    >
      <Link
        to={`/live/${channel.id}`}
        data-focusable="true"
        className={[
          'relative block overflow-hidden rounded-card border border-white/10 bg-white/[0.075] shadow-2xl shadow-black/20 backdrop-blur-2xl transition',
          'hover:border-cyan-300/50 hover:bg-white/[0.11]',
          'focus:outline-none focus:ring-4 focus:ring-cyan-300/75 focus:ring-offset-4 focus:ring-offset-[#06070d]',
          featured ? 'min-h-[22rem] p-5 sm:p-6 tv:min-h-[28rem]' : 'min-h-44 p-4 sm:min-h-52 tv:min-h-64 tv:p-6',
        ].join(' ')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/8 via-cyan-400/10 to-rose-500/10 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300/30 bg-red-500/18 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-red-100 tv:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.9)]" />
              LIVE
            </span>
            <FavoriteButton channel={channel} compact={!featured} />
          </div>

          <div className="flex flex-1 items-center justify-center py-5">
            <div className={[
              'grid place-items-center rounded-2xl border border-white/10 bg-black/25 p-4 shadow-inner shadow-white/5',
              featured ? 'h-32 w-32 sm:h-40 sm:w-40 tv:h-52 tv:w-52' : 'h-20 w-20 sm:h-24 sm:w-24 tv:h-32 tv:w-32',
            ].join(' ')}
            >
              {imageFailed || !channel.logo ? (
                <Radio className="h-10 w-10 text-white/45 tv:h-14 tv:w-14" />
              ) : (
                <img
                  src={channel.logo}
                  alt={`Logo ${channel.name}`}
                  loading="lazy"
                  decoding="async"
                  onError={() => setImageFailed(true)}
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className={featured ? 'line-clamp-2 text-2xl font-black tv:text-4xl' : 'line-clamp-2 text-base font-bold tv:text-2xl'}>
                {channel.name}
              </p>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-300 text-slate-950 opacity-0 shadow-lg shadow-cyan-400/30 transition group-hover:opacity-100 group-focus-within:opacity-100 tv:h-12 tv:w-12">
                <Play className="h-4 w-4 fill-current tv:h-6 tv:w-6" />
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55 tv:text-sm">
              <span className="truncate">{getCategoryLabel(channel.category)}</span>
              {channel.number && <span className="text-white/35">#{channel.number}</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default memo(ChannelCard)
