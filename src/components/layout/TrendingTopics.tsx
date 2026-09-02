import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { TOPICS } from '@/data/mockData'
import { pluralize } from '@/lib/utils'

/** Виджет «Актуальные темы» */
export default function TrendingTopics() {
  const { pushToast } = useApp()

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
      <ul className="flex flex-col">
        {TOPICS.map((topic) => (
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
    </motion.section>
  )
}
