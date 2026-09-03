import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CloudOff, RefreshCw, Sparkles } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import FeedFilters from '@/components/feed/FeedFilters'
import type { FeedFilter } from '@/components/feed/FeedFilters'
import PostList from '@/components/post/PostList'
import { PostCardSkeletonList } from '@/components/post/PostCardSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

/** Sticky-хедер центральной колонки: «Лента» + пульсирующая точка + «Обновить» */
function PageHeader({ onRefresh, spinning }: { onRefresh: () => void; spinning: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-30 -mx-4 hidden h-[60px] items-center justify-between border-b border-line bg-paper/85 px-4 backdrop-blur-md transition-shadow duration-200 md:flex',
        scrolled && 'shadow-card',
      )}
    >
      <div className="flex items-center gap-2.5">
        <h1 className="font-display text-[22px] font-semibold leading-none text-ink">Лента</h1>
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-coral" aria-hidden />
      </div>
      <button
        type="button"
        onClick={onRefresh}
        aria-label="Обновить ленту"
        title="Обновить"
        className="group flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-accent-soft hover:text-accent"
      >
        <motion.span
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="flex transition-transform duration-150 group-hover:rotate-90"
        >
          <RefreshCw size={20} strokeWidth={1.75} />
        </motion.span>
      </button>
    </motion.header>
  )
}

/** Финальный маркер конца ленты */
function FeedFooter() {
  const navigate = useNavigate()
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-1.5 bg-transparent px-4 pb-12 pt-8 text-center"
    >
      <div className="flex items-center gap-2 text-[13px] text-ink-soft">
        <Sparkles size={16} strokeWidth={1.75} className="text-gold" />
        Вы всё прочитали. Самое время написать свой пост!
      </div>
      <button
        type="button"
        onClick={() => navigate('/profile?compose=1')}
        className="text-sm font-semibold text-accent transition-colors duration-150 hover:text-accent-deep hover:underline"
      >
        Создать пост →
      </button>
    </motion.footer>
  )
}

export default function FeedPage() {
  const navigate = useNavigate()
  const { posts, postsLoading, postsError, refetchPosts, currentUser, followedIds, pushToast } = useApp()
  const [filter, setFilter] = useState<FeedFilter>('all')
  const [animateKey, setAnimateKey] = useState<string>('initial')
  const [spinning, setSpinning] = useState(false)

  const filteredPosts = useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    if (filter === 'following') {
      return sorted.filter(
        (p) => followedIds.has(p.author.id) || p.author.id === currentUser.id,
      )
    }
    return sorted
  }, [posts, filter, followedIds, currentUser.id])

  const handleFilterChange = (next: FeedFilter) => {
    if (next === filter) return
    setFilter(next)
    setAnimateKey(`filter-${next}-${Date.now()}`)
  }

  const handleRefresh = () => {
    setSpinning(true)
    setAnimateKey(`refresh-${Date.now()}`)
    refetchPosts()
    pushToast('Лента обновлена', 'success')
    window.setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div>
      <PageHeader onRefresh={handleRefresh} spinning={spinning} />

      <div className="mt-4">
        <FeedFilters value={filter} onChange={handleFilterChange} />
      </div>

      <div className="mt-4">
        {postsLoading ? (
          <PostCardSkeletonList count={3} />
        ) : postsError ? (
          <EmptyState
            icon={<CloudOff size={36} strokeWidth={1.75} />}
            title="Не удалось загрузить ленту"
            description="Проверьте соединение и попробуйте ещё раз"
            ctaLabel="Повторить"
            onCta={refetchPosts}
          />
        ) : filteredPosts.length > 0 ? (
          <PostList posts={filteredPosts} animateKey={animateKey} />
        ) : filter === 'following' ? (
          <EmptyState
            image="/empty-feed.png"
            title="Здесь пока тихо"
            description="Читайте других пользователей, чтобы их посты появлялись в этой ленте"
          />
        ) : (
          <EmptyState
            image="/empty-feed.png"
            title="Лента пуста"
            description="Станьте первым, кто поделится мыслями с Bailanysta"
            ctaLabel="Написать первый пост"
            onCta={() => navigate('/profile?compose=1')}
          />
        )}
      </div>

      {filteredPosts.length > 0 && <FeedFooter />}
    </div>
  )
}
