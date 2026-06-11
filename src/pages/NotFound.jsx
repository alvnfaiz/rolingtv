import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Seo title="404" description="Halaman tidak ditemukan di SRG TV." noIndex />
      <p className="text-6xl font-bold text-[#333]">404</p>
      <h1 className="mt-4 text-xl font-semibold">Halaman tidak ada</h1>
      <p className="mt-2 text-sm text-[#8a8a8a]">Alamat yang Anda buka tidak tersedia.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Ke beranda
      </Link>
    </div>
  )
}
