import { AnimatePresence, motion } from 'framer-motion'
import type { Post } from '@/types'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
  /** Меняется для повторного проигрывания stagger-анимации (фильтр/обновление) */
  animateKey?: string | number
}

/**
 * Анимированный список карточек постов.
 * Первая загрузка: stagger 0.06s для первых 8 карточек, дальше — без задержки.
 * Смена фильтра: popLayout, exit 150ms, enter stagger 0.05s.
 */
export default function PostList({ posts, animateKey = 'initial' }: PostListProps) {
  return (
    <div className="flex flex-col gap-4 pb-12">
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => {
          const isNew = post.id.startsWith('local-')
          return (
            <motion.div
              key={`${animateKey}-${post.id}`}
              layout
              initial={isNew ? { opacity: 0, scale: 0.97, height: 0 } : { opacity: 0, y: 20 }}
              animate={
                isNew
                  ? { opacity: 1, scale: 1, height: 'auto' }
                  : { opacity: 1, y: 0 }
              }
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
              transition={
                isNew
                  ? { type: 'spring', stiffness: 300, damping: 26 }
                  : {
                      duration: 0.35,
                      ease: 'easeOut',
                      delay: animateKey === 'initial' ? Math.min(index, 7) * 0.06 : Math.min(index, 7) * 0.05,
                    }
              }
              style={isNew ? { overflow: 'hidden' } : undefined}
            >
              <PostCard post={post} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
