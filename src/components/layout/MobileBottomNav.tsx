import { useLocation, useNavigate } from 'react-router-dom'
import { Home, SquarePen, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Мобильная нижняя навигация (<md): Лента / Создать / Профиль */
export default function MobileBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const items = [
    { icon: Home, label: 'Лента', to: '/', active: location.pathname === '/' },
    { icon: SquarePen, label: 'Создать', to: '/profile?compose=1', active: false },
    { icon: UserRound, label: 'Профиль', to: '/profile', active: location.pathname === '/profile' },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch justify-around border-t border-line bg-paper-raised/95 backdrop-blur-md md:hidden">
      {items.map(({ icon: Icon, label, to, active }) => (
        <motion.button
          key={label}
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate(to)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors duration-150',
            active ? 'text-accent' : 'text-ink-faint',
          )}
          aria-label={label}
        >
          <Icon size={22} strokeWidth={1.75} />
          {label}
        </motion.button>
      ))}
    </nav>
  )
}
