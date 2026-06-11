import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio } from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import { getCategoryLabel } from '../lib/ui'

function ChannelCard({ channel, featured = false }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (featured) {
    return (
      <Link
        to={`/live/${channel.id}`}
        data-focusable="true"
        className="group flex items-center gap-5 rounded border border-[#2e2e2e] bg-[#1a1a1a] p-5 transition hover:border-[#444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5722] sm:p-6"
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded bg-[#242424] p-3 sm:h-24 sm:w-24">
          {imageFailed || !channel.logo ? (
            <Radio className="h-8 w-8 text-[#666]" />
          ) : (
            <img
              src={channel.logo}
              alt={`Logo ${channel.name}`}
              onError={() => setImageFailed(true)}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="live-badge mb-2">Live</span>
          <p className="truncate text-lg font-bold sm:text-xl">{channel.name}</p>
          <p className="mt-0.5 text-sm text-[#8a8a8a]">{getCategoryLabel(channel.category)}</p>
        </div>
        <FavoriteButton channel={channel} />
      </Link>
    )
  }

  return (
    <Link
      to={`/live/${channel.id}`}
      data-focusable="true"
      className="group flex flex-col rounded border border-[#2e2e2e] bg-[#1a1a1a] transition hover:border-[#444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5722]"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center border-b border-[#2e2e2e] bg-[#141414] p-4">
        {imageFailed || !channel.logo ? (
          <Radio className="h-8 w-8 text-[#555]" />
        ) : (
          <img
            src={channel.logo}
            alt={`Logo ${channel.name}`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="max-h-[70%] max-w-[80%] object-contain"
          />
        )}
        <div className="absolute right-2 top-2">
          <FavoriteButton channel={channel} compact />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="live-badge">Live</span>
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{channel.name}</p>
        <p className="truncate text-xs text-[#8a8a8a]">{getCategoryLabel(channel.category)}</p>
      </div>
    </Link>
  )
}

export default memo(ChannelCard)
