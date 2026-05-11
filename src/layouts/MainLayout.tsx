import { Outlet } from 'react-router-dom'
import { Navbar } from '../shared/components/ui/Navbar'
import { Footer } from '../shared/components/ui/Footer'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
