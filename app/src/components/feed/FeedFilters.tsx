import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type FeedFilter = 'all' | 'following'

interface FeedFiltersProps {
  value: FeedFilter
  onChange: (value: FeedFilter) => void
  className?: string
}

const TABS: { key: FeedFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'following', label: 'Подписки' },
]

/** Переключатель «Все / Подписки» с пилюлей layoutId (design.md §4.4) */
export default function FeedFilters({ value, onChange, className }: FeedFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
      role="tablist"
      aria-label="Фильтр ленты"
      className={cn(
        'sticky top-16 z-20 flex w-fit items-center gap-1 rounded-full bg-line/50 p-1 md:static md:top-auto',
        className,
      )}
    >
      {TABS.map((tab) => {
        const isActive = value === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-150',
              isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="feed-tab"
                className="absolute inset-0 rounded-full bg-paper-raised shadow-card"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        )
      })}
    </motion.div>
  )
}
