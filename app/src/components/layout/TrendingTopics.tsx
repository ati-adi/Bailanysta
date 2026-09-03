import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import type { Topic } from '@/types'
import { extractHashtags, pluralize } from '@/lib/utils'

/**
 * Виджет «Актуальные темы».
 * Темы вычисляются на фронтенде из реальных постов:
 * хэштеги извлекаются из текстов и ранжируются по частоте (топ-5).
 */
export default function TrendingTopics() {
  const { posts, postsLoading, pushToast } = useApp()

  const topics = useMemo<Topic[]>(() => {
    const counts = new Map<string, number>()
    for (const post of posts) {
      for (const tag of extractHashtags(post.text)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return Array.from(counts, ([tag, postsCount]) => ({ tag, postsCount }))
      .sort((a, b) => b.postsCount - a.postsCount || a.tag.localeCompare(b.tag))
      .slice(0, 5)
  }, [posts])

  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
      className="rounded-2xl border border-line bg-paper-raised p-4 shadow-card"
    >
      <h2 className="mb-2 text-[15px] font-bold uppercase tracking-[0.08em] text-ink">
        Актуальные темы
      </h2>
      {postsLoading ? (
        <div className="flex flex-col gap-2 px-2 py-2" role="status" aria-label="Загрузка тем">
          <div className="h-4 w-24 animate-pulse rounded-full bg-line" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-line" />
          <div className="mt-1 h-4 w-20 animate-pulse rounded-full bg-line" />
          <div className="h-3 w-14 animate-pulse rounded-full bg-line" />
        </div>
      ) : topics.length > 0 ? (
        <ul className="flex flex-col">
          {topics.map((topic) => (
            <li key={topic.tag}>
              <button
                type="button"
                onClick={() => pushToast('Поиск по темам появится на Уровне 2')}
                className="group w-full rounded-xl px-2 py-2 text-left transition-colors duration-150 hover:bg-accent-soft"
              >
                <span className="block text-[15px] font-semibold text-accent group-hover:underline">
                  {topic.tag}
                </span>
                <span className="block text-xs text-ink-faint">
                  {topic.postsCount} {pluralize(topic.postsCount, 'пост', 'поста', 'постов')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-2 py-2 text-[13px] text-ink-faint">
          Темы появятся, когда в постах будут хэштеги
        </p>
      )}
    </motion.section>
  )
}
