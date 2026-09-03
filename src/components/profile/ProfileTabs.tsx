import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const TABS = ['Посты', 'Медиа', 'Отметки'] as const
type ProfileTab = (typeof TABS)[number]

interface ProfileTabsProps {
  /** Счётчик-подсказка справа: «Всего постов: N» */
  total: number
}

/**
 * Табы профиля (profile.md §2.2) в стиле FilterTabs-пилюль.
 * «Посты» — единственный рабочий таб; «Медиа»/«Отметки» трясутся и показывают toast.
 */
export default function ProfileTabs({ total }: ProfileTabsProps) {
  const { pushToast } = useApp()
  const [shaking, setShaking] = useState<ProfileTab | null>(null)

  const handleClick = (tab: ProfileTab) => {
    if (tab === 'Посты') return
    setShaking(tab)
    pushToast('Появится на Уровне 2')
    window.setTimeout(() => {
      setShaking((current) => (current === tab ? null : current))
    }, 320)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
      className="mt-5 flex items-center justify-between gap-3"
    >
      <div
        role="tablist"
        aria-label="Разделы профиля"
        className="flex w-fit items-center gap-1 rounded-full bg-line/50 p-1"
      >
        {TABS.map((tab) => {
          const isActive = tab === 'Посты'
          return (
            <motion.button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleClick(tab)}
              animate={shaking === tab ? { x: [0, -4, 4, -2, 2, 0] } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-150',
                isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="profile-tab-pill"
                  className="absolute inset-0 rounded-full bg-paper-raised shadow-card"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{tab}</span>
            </motion.button>
          )
        })}
      </div>
      <span className="shrink-0 text-xs text-ink-faint">Всего постов: {total}</span>
    </motion.div>
  )
}
