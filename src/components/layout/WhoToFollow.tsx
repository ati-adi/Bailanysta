import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

/** Виджет «Кого читать»: 3 пользователя, на которых текущий не подписан */
export default function WhoToFollow() {
  const { users, currentUser, toggleFollow, pushToast } = useApp()
  const suggestions = users.filter((u) => u.id !== currentUser.id && !u.isFollowed).slice(0, 3)

  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
      className="rounded-2xl border border-line bg-paper-raised p-4 shadow-card"
    >
      <h2 className="mb-3 text-[15px] font-bold uppercase tracking-[0.08em] text-ink">
        Кого читать
      </h2>
      <ul className="flex flex-col">
        {suggestions.map((user, i) => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.07 }}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-150 hover:bg-accent-soft/40"
          >
            <Avatar src={user.avatar} alt={user.name} size={40} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
              <span className="block truncate text-[13px] text-ink-soft">@{user.handle}</span>
            </span>
            <FollowButton
              followed={user.isFollowed}
              onToggle={() => toggleFollow(user.id)}
            />
          </motion.li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => pushToast('Скоро появится')}
        className="mt-2 w-full rounded-xl px-2 py-1.5 text-left text-[13px] font-medium text-accent transition-colors duration-150 hover:bg-accent-soft/40"
      >
        Показать ещё
      </button>
    </motion.section>
  )
}

function FollowButton({ followed, onToggle }: { followed: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      className={cn(
        'flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[13px] font-semibold transition-colors duration-150',
        followed
          ? 'bg-accent-soft text-accent'
          : 'border border-line text-ink hover:border-accent/30 hover:bg-accent-soft hover:text-accent',
      )}
    >
      {followed ? (
        <>
          <Check size={13} strokeWidth={2.5} />
          Вы читаете
        </>
      ) : (
        'Читать'
      )}
    </motion.button>
  )
}
