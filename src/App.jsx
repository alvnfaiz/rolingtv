import { BrowserRouter, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import AppRoutes from './app/routes'
import useKeyboardNavigation from './hooks/useKeyboardNavigation'

function Layout() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/live/')
  useKeyboardNavigation({ enabled: !isPlayer })

  return (
    <div className="app-shell text-[#ececec]">
      {!isPlayer && <Navbar />}
      <main className={isPlayer ? 'min-h-screen' : 'page-wrap'}>
        <AppRoutes />
      </main>
      {!isPlayer && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
