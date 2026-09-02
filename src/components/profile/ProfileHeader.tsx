import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate, motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Link2, MapPin, Sparkle } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { User } from '@/types'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { pluralize } from '@/lib/utils'

interface ProfileHeaderProps {
  user?: User
  postsCount: number
}

/** Число с count-up анимацией от 0 (800ms, ease-out) — profile.md §2.1 */
function CountUp({ value, delay = 0.4 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      delay,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value, delay])

  return <>{display}</>
}

/** Порядковая анимация строк идентичности: y 14→0, delay 0.2s + 0.06s на строку */
function RevealLine({
  index,
  className,
  children,
}: {
  index: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 + index * 0.06, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Шапка профиля (profile.md §2.1): обложка с кнопкой «Назад» и бейджем «Это вы»,
 * аватар с кольцом, имя/handle/био, метастрока, статистика с count-up.
 */
export default function ProfileHeader({ user, postsCount }: ProfileHeaderProps) {
  const { currentUser, pushToast } = useApp()
  const navigate = useNavigate()
  const u = user ?? currentUser

  const statButtonClass =
    'group flex items-baseline gap-1 rounded-sm text-left'

  return (
    <section aria-label="Шапка профиля">
      {/* Обложка */}
      <div className="relative h-[140px] w-full overflow-hidden rounded-b-2xl md:h-[200px]">
        <motion.img
          src="/profile-cover.png"
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Назад к ленте"
          className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/60"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
        </button>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-coral px-3 py-1 text-xs font-semibold leading-none text-white">
          Это вы
        </span>
      </div>

      {/* Блок идентичности: карточка заезжает под обложку на -48px */}
      <div className="relative -mt-12 rounded-t-2xl border border-line bg-paper-raised p-5 shadow-card">
        <div className="-mt-[56px] flex items-end justify-between gap-3 md:-mt-[72px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
            className="shrink-0 rounded-full"
          >
            <Avatar
              src={u.avatar}
              alt={u.name}
              size={96}
              className="h-[72px] w-[72px] ring-4 ring-[#FDFCF9] md:h-24 md:w-24"
            />
          </motion.div>
          <Button
            variant="outline"
            className="mb-1 px-5"
            onClick={() => pushToast('Редактирование профиля появится на Уровне 2 ✦')}
          >
            Редактировать профиль
          </Button>
        </div>

        <RevealLine index={0} className="mt-3 flex items-center gap-1.5">
          <h1 className="font-display text-[22px] font-semibold leading-[1.15] text-ink md:text-[26px]">
            {u.name}
          </h1>
          <Sparkle
            size={16}
            strokeWidth={1.75}
            className="shrink-0 text-gold"
            aria-label="Метка первопроходца"
          />
        </RevealLine>

        <RevealLine index={1} className="mt-1 text-sm text-ink-soft">
          @{u.handle}
        </RevealLine>

        {u.bio && (
          <RevealLine index={2} className="mt-3 text-[15px] leading-[1.5] text-ink">
            {u.bio}
          </RevealLine>
        )}

        <RevealLine
          index={3}
          className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink-soft"
        >
          <span className="flex items-center gap-1.5">
            <MapPin size={14} strokeWidth={1.75} className="shrink-0" />
            Алматы, Казахстан
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} strokeWidth={1.75} className="shrink-0" />
            В сети с ноября 2025
          </span>
          <button
            type="button"
            onClick={() => pushToast('bailanysta.kz/aliya — демо-ссылка профиля ✦')}
            className="flex items-center gap-1.5 text-accent transition-colors duration-150 hover:text-accent-deep hover:underline"
          >
            <Link2 size={14} strokeWidth={1.75} className="shrink-0" />
            bailanysta.kz/aliya
          </button>
        </RevealLine>

        {/* Статистика: подписки · подписчики · посты */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4, ease: 'easeOut' }}
          className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5"
        >
          <button
            type="button"
            onClick={() => pushToast('Списки появятся на Уровне 2')}
            className={statButtonClass}
          >
            <span className="font-display text-base font-semibold text-ink group-hover:underline">
              <CountUp value={u.following} />
            </span>
            <span className="text-[13px] text-ink-soft">
              {pluralize(u.following, 'подписка', 'подписки', 'подписок')}
            </span>
          </button>
          <span className="h-1 w-1 rounded-full bg-ink-faint" aria-hidden />
          <button
            type="button"
            onClick={() => pushToast('Списки появятся на Уровне 2')}
            className={statButtonClass}
          >
            <span className="font-display text-base font-semibold text-ink group-hover:underline">
              <CountUp value={u.followers} />
            </span>
            <span className="text-[13px] text-ink-soft">
              {pluralize(u.followers, 'подписчик', 'подписчика', 'подписчиков')}
            </span>
          </button>
          <span className="h-1 w-1 rounded-full bg-ink-faint" aria-hidden />
          <div className="flex items-baseline gap-1">
            <span className="font-display text-base font-semibold text-ink">{postsCount}</span>
            <span className="text-[13px] text-ink-soft">
              {pluralize(postsCount, 'пост', 'поста', 'постов')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
