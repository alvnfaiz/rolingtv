import ChannelCard from './ChannelCard'

export default function ChannelGrid({
  channels,
  emptyTitle = 'Saluran tidak ditemukan',
  emptyText = 'Coba kategori atau kata kunci lain.',
}) {
  if (!channels?.length) {
    return (
      <div className="surface px-6 py-12 text-center">
        <p className="font-semibold text-[#ececec]">{emptyTitle}</p>
        <p className="mt-1.5 text-sm text-[#8a8a8a]">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} />
      ))}
    </div>
  )
}
