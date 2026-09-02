import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Image, MapPin, Smile, SquarePen } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Composer from '@/components/composer/Composer'
import type { ComposerHandle } from '@/components/composer/Composer'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'
import UserPostList from '@/components/profile/UserPostList'
import Button from '@/components/ui/Button'

/** Декоративные иконки-заглушки вложений (profile.md §2.3) */
const ATTACHMENTS = [
  { icon: Image, label: 'Прикрепить изображение' },
  { icon: Smile, label: 'Добавить эмодзи' },
  { icon: MapPin, label: 'Добавить геометку' },
] as const

/**
 * Страница профиля (/profile): шапка, табы, композер, посты пользователя.
 * Создание поста — через AppContext.addPost (пост виден и здесь, и в ленте).
 * Открытие по ?compose=1 — автофокус на композер.
 */
export default function ProfilePage() {
  const { posts, currentUser, pushToast, removePost } = useApp()
  const [searchParams] = useSearchParams()
  const composerRef = useRef<ComposerHandle>(null)
  const composerSectionRef = useRef<HTMLElement | null>(null)
  // Посты текущего пользователя, новые сверху
  const userPosts = useMemo(
    () =>
      posts
        .filter((p) => p.author.id === currentUser.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts, currentUser.id],
  )

  const focusComposer = () => {
    composerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => composerRef.current?.focus(), 350)
  }

  // Приход по ссылке «Создать» / «Создать пост →» (query ?compose=1)
  useEffect(() => {
    if (searchParams.get('compose') === '1') focusComposer()
  }, [searchParams])

  const handleDelete = (postId: string) => {
    removePost(postId)
    pushToast('Пост удалён', 'info')
  }

  return (
    <div className="pb-4">
      <ProfileHeader postsCount={userPosts.length} />
      <ProfileTabs total={userPosts.length} />

      {/* Композер — главная секция страницы */}
      <motion.section
        ref={composerSectionRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
        className="mt-4 scroll-mt-20"
        aria-label="Новый пост"
      >
        <h2 className="flex items-center gap-1.5 text-[15px] font-bold uppercase tracking-[0.08em] text-ink-soft">
          <SquarePen size={16} strokeWidth={1.75} className="text-accent" />
          Новый пост
        </h2>

        {/* Фиолетовое свечение при монтировании, растворяется за 1.5s */}
        <motion.div
          initial={{ boxShadow: '0 0 0 3px rgba(91,75,232,0.15)' }}
          animate={{ boxShadow: '0 0 0 0px rgba(91,75,232,0)' }}
          transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
          className="relative mt-3 rounded-2xl"
        >
          <Composer ref={composerRef} />

          {/* Иконки вложений — левая часть нижней панели композера */}
          <div className="absolute bottom-6 left-5 flex items-center gap-1">
            {ATTACHMENTS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => pushToast('Вложения появятся на Уровне 2 ✦')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-accent transition-colors duration-150 hover:bg-accent-soft"
              >
                <Icon size={18} strokeWidth={1.75} />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Мои посты */}
      <section className="mt-6" aria-label="Мои посты">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4, ease: 'easeOut' }}
          className="flex items-center gap-2"
        >
          <h2 className="text-[15px] font-bold uppercase tracking-[0.08em] text-ink-soft">
            Мои посты
          </h2>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold leading-none text-accent">
            {userPosts.length}
          </span>
        </motion.div>

        <div className="mt-4">
          {userPosts.length > 0 ? (
            <UserPostList posts={userPosts} onDelete={handleDelete} />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-center py-16 text-center"
            >
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute h-[120px] w-[120px] rounded-full bg-accent-soft"
                  aria-hidden
                />
                <img
                  src="/empty-feed.png"
                  alt=""
                  className="relative h-40 w-40 object-contain"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                Здесь появятся ваши посты
              </h3>
              <p className="mt-2 max-w-[360px] text-sm leading-relaxed text-ink-soft">
                Напишите первый пост в форме выше — он сразу попадёт в общую ленту.
              </p>
              <Button className="mt-5" onClick={focusComposer}>
                Написать пост
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
