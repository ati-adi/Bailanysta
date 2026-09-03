import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowUp } from 'lucide-react'
import LeftRail from './LeftRail'
import RightSidebar from './RightSidebar'
import MobileTopBar from './MobileTopBar'
import MobileBottomNav from './MobileBottomNav'
import Toaster from '@/components/ui/Toaster'
import { setLenis, scrollToTop } from '@/lib/scroll'

/** Круглая кнопка «наверх», появляется после 600px скролла */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={scrollToTop}
          aria-label="Наверх"
          className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-toast transition-colors hover:bg-accent md:bottom-6 md:right-6"
        >
          <ArrowUp size={18} strokeWidth={1.75} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function AppShell() {
  const location = useLocation()

  // Lenis: мягкий скролл по всей странице
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12 })
    setLenis(lenis)
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <div className="min-h-[100dvh]">
      <MobileTopBar />
      <div className="mx-auto flex w-full max-w-[1240px] justify-center gap-8">
        <LeftRail />
        <main className="w-full min-w-0 max-w-[640px] px-3 pb-24 md:px-4 md:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <RightSidebar />
      </div>
      <MobileBottomNav />
      <BackToTop />
      <Toaster />
    </div>
  )
}
