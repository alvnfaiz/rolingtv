import ChannelCard from './ChannelCard'

export default function ChannelGrid({
  channels,
  emptyTitle = 'Saluran tidak ditemukan',
  emptyText = 'Coba kategori atau kata kunci lain.',
  featured = false,
}) {
  if (!channels?.length) {
    return (
      <div className="rounded-card border border-white/10 bg-white/[0.06] px-6 py-14 text-center backdrop-blur-2xl">
        <p className="text-xl font-bold text-white tv:text-3xl">{emptyTitle}</p>
        <p className="mt-2 text-sm text-white/55 tv:text-lg">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 tv:grid-cols-4 tv:gap-7">
      {channels.map((channel, index) => (
        <ChannelCard key={channel.id} channel={channel} index={index} featured={featured} />
      ))}
    </div>
  )
}
