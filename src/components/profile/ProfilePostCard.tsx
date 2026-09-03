import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { Post } from '@/types'
import Avatar from '@/components/ui/Avatar'
import TimeAgo from '@/components/ui/TimeAgo'
import PostText from '@/components/post/PostText'
import PostActions from '@/components/post/PostActions'

interface ProfilePostCardProps {
  post: Post
  /** Пост создан в этой сессии: вспышка фона accent-soft → paper-raised */
  isFresh?: boolean
  /** Вызывается после завершения анимации схлопывания */
  onDelete: () => void
}

/**
 * Карточка поста на странице профиля (profile.md §2.4).
 * Отличие от shared PostCard: вместо «•••» — удаление с inline-confirm
 * «Удалить? Да / Нет» и анимацией схлопывания (height → 0, 300ms).
 */
export default function ProfilePostCard({ post, isFresh = false, onDelete }: ProfilePostCardProps) {
  const [confirming, setConfirming] = useState(false)
  const [leaving, setLeaving] = useState(false)

  return (
    <motion.div
      initial={false}
      animate={leaving ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        if (leaving) onDelete()
      }}
      style={{ overflow: leaving ? 'hidden' : 'visible' }}
    >
      <motion.article
        initial={{ backgroundColor: isFresh ? '#ECEAFC' : '#FDFCF9' }}
        animate={{
          x: confirming ? [0, -4, 4, -2, 2, 0] : 0,
          backgroundColor: '#FDFCF9',
        }}
        transition={{
          x: { duration: 0.3 },
          backgroundColor: { duration: 1.2, delay: isFresh ? 0.4 : 0, ease: 'easeOut' },
        }}
        className="rounded-2xl border border-line bg-paper-raised p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
      >
        <div className="flex items-start gap-3">
          <Avatar src={post.author.avatar} alt={post.author.name} size={44} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold leading-[1.3] text-ink">
                  {post.author.name}
                </div>
                <div className="text-[13px] leading-[1.3] text-ink-soft">
                  @{post.author.handle} · <TimeAgo date={post.createdAt} />
                </div>
              </div>

              {confirming ? (
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[13px] font-medium text-ink-soft">Удалить?</span>
                  <button
                    type="button"
                    onClick={() => setLeaving(true)}
                    className="rounded-full bg-coral-soft px-2.5 py-1 text-[13px] font-semibold text-coral transition-colors duration-150 hover:bg-coral hover:text-white"
                  >
                    Да
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="rounded-full bg-line/60 px-2.5 py-1 text-[13px] font-semibold text-ink-soft transition-colors duration-150 hover:bg-line hover:text-ink"
                  >
                    Нет
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Удалить пост"
                  onClick={() => setConfirming(true)}
                  className="-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-coral-soft hover:text-coral"
                >
                  <Trash2 size={18} strokeWidth={1.75} />
                </button>
              )}
            </div>

            <div className="mt-2">
              <PostText text={post.text} />
            </div>

            <PostActions post={post} />
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
