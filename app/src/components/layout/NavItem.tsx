import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  icon: LucideIcon
  label: string
  to?: string
  active?: boolean
  onClick?: () => void
}

/**
 * Пункт левой навигации. Адаптив: ниже lg панель схлопнута до 72px —
 * подпись скрывается (CSS), иконка центрируется, tooltip через title.
 */
export default function NavItem({ icon: Icon, label, to, active = false, onClick }: NavItemProps) {
  const content = (
    <>
      {active && (
        <span className="absolute left-0 top-1/2 hidden h-6 w-[3px] -translate-y-1/2 rounded-full bg-coral lg:block" />
      )}
      <Icon
        size={20}
        strokeWidth={1.75}
        className={cn(
          'shrink-0 transition-all duration-150',
          active ? 'text-white' : 'group-hover:translate-x-0.5 group-hover:text-white lg:group-hover:translate-x-0.5',
        )}
      />
      <span className="hidden truncate lg:inline">{label}</span>
    </>
  )

  const classes = cn(
    'group relative flex w-full items-center justify-center gap-3.5 rounded-xl px-0 py-3 text-[15px] font-medium transition-colors duration-150 lg:justify-start lg:px-3.5 lg:py-2.5',
    active ? 'bg-white/[0.08] text-white' : 'text-[#8F8C9C] hover:bg-white/5 hover:text-white',
  )

  if (to) {
    return (
      <motion.div whileTap={{ scale: 0.97 }}>
        <Link to={to} title={label} aria-label={label} className={classes}>
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(classes, 'text-left')}
    >
      {content}
    </motion.button>
  )
}
