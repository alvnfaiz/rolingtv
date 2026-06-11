export default function Loading({ label = 'Memuat' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-[#8a8a8a]">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#333] border-t-[#ff5722]" />
        {label}
      </div>
    </div>
  )
}
