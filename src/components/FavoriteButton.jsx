import { memo } from 'react'
import { Heart } from 'lucide-react'
import { useTvStore } from '../store/tvStore'

function FavoriteButton({ channel, compact = false }) {
  const isFavorite = useTvStore((state) => state.favoriteIds.includes(channel?.id))
  const toggleFavorite = useTvStore((state) => state.toggleFavorite)

  const onClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    toggleFavorite(channel)
  }

  return (
    <button
      type="button"
      data-focusable="true"
      aria-label={isFavorite ? `Hapus ${channel?.name} dari favorit` : `Tambahkan ${channel?.name} ke favorit`}
      onClick={onClick}
      className={[
        'flex shrink-0 items-center justify-center rounded transition',
        compact ? 'h-8 w-8' : 'h-9 w-9',
        isFavorite
          ? 'text-[#ff5722]'
          : 'text-[#8a8a8a] hover:bg-[#242424] hover:text-[#ececec]',
      ].join(' ')}
    >
      <Heart
        className={compact ? 'h-4 w-4' : 'h-[1.125rem] w-[1.125rem]'}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={1.75}
      />
    </button>
  )
}

export default memo(FavoriteButton)
