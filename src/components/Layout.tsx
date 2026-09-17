import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ToastHost } from './Toast'

export function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (isAdmin) {
    return (
      <>
        <Outlet />
        <ToastHost />
      </>
    )
  }

  return (
    <div className="bg-spice-texture min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ToastHost />
    </div>
  )
}
