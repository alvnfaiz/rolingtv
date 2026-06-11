import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loading from '../components/Loading'

const Home = lazy(() => import('../pages/Home'))
const Player = lazy(() => import('../pages/Player'))
const Favorites = lazy(() => import('../pages/Favorites'))
const Category = lazy(() => import('../pages/Category'))
const Search = lazy(() => import('../pages/Search'))
const Settings = lazy(() => import('../pages/Settings'))
const Developer = lazy(() => import('../pages/Developer'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading label="Menyiapkan saluran" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<Navigate to="/" replace />} />
        <Route path="/live/:id" element={<Player />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
