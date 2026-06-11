export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const prev = () => onPageChange(Math.max(1, page - 1))
  const next = () => onPageChange(Math.min(totalPages, page + 1))

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <button
        type="button"
        onClick={prev}
        disabled={page <= 1}
        className="btn btn-ghost disabled:opacity-40"
      >
        Sebelumnya
      </button>
      <span className="text-sm text-[#8a8a8a]">
        Halaman {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={next}
        disabled={page >= totalPages}
        className="btn btn-ghost disabled:opacity-40"
      >
        Berikutnya
      </button>
    </div>
  )
}
