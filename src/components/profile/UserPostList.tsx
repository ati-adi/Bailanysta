import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { Post } from '@/types'
import ProfilePostCard from './ProfilePostCard'

interface UserPostListProps {
  posts: Post[]
  onDelete: (postId: string) => void
}

/**
 * Список постов пользователя на странице профиля (profile.md §2.4).
 * Первая загрузка: stagger y 16→0, delay index * 0.06s (максимум 8 карточек).
 * Пост, созданный после монтирования списка: height-spring сверху + вспышка фона.
 * Удаление: схлопывание внутри ProfilePostCard, соседи разъезжаются через layout.
 */
export default function UserPostList({ posts, onDelete }: UserPostListProps) {
  // id постов на момент первого рендера — они получают stagger,
  // появившиеся позже считаются «свежими» (анимация нового поста)
  const initialIdsRef = useRef<Set<string> | null>(null)
  if (initialIdsRef.current === null) {
    initialIdsRef.current = new Set(posts.map((p) => p.id))
  }
  const initialIds = initialIdsRef.current

  return (
    <div className="flex flex-col gap-4 pb-12">
      {posts.map((post, index) => {
        const isFresh = !initialIds.has(post.id)
        return (
          <motion.div
            key={post.id}
            layout="position"
            initial={isFresh ? { height: 0, opacity: 0, scale: 0.97 } : { opacity: 0, y: 16 }}
            animate={isFresh ? { height: 'auto', opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
            transition={
              isFresh
                ? { type: 'spring', stiffness: 300, damping: 26 }
                : {
                    duration: 0.3,
                    ease: 'easeOut',
                    delay: Math.min(index, 7) * 0.06,
                  }
            }
            style={isFresh ? { overflow: 'hidden' } : undefined}
          >
            <ProfilePostCard
              post={post}
              isFresh={isFresh}
              onDelete={() => onDelete(post.id)}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
