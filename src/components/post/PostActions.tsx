import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { Post } from '@/types'
import { cn } from '@/lib/utils'

interface PostActionsProps {
  post: Post
}

interface ActionSpotProps {
  label: string
  count?: number
  onClick: () => void
  active?: boolean
  activeColor?: string
  hoverBg: string
  hoverColor: string
  children: React.ReactNode
}

function ActionSpot({ label, count, onClick, active, activeColor, hoverBg, hoverColor, children }: ActionSpotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group -ml-1.5 flex items-center gap-1.5"
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors duration-150',
          hoverBg,
          active && activeColor,
        )}
      >
        {children}
      </span>
      {count !== undefined && (
        <span
          className={cn(
            'text-[13px] font-medium text-ink-faint transition-colors duration-150',
            hoverColor,
            active && activeColor,
          )}
        >
          {count > 0 ? count : ''}
        </span>
      )}
    </button>
  )
}

/** Ряд действий поста: лайк (интерактивный), комментарии, репост, поделиться */
export default function PostActions({ post }: PostActionsProps) {
  const { toggleLike, pushToast } = useApp()
  const [pulseKey, setPulseKey] = useState(0)

  const handleLike = () => {
    toggleLike(post.id)
    if (!post.liked) setPulseKey((k) => k + 1)
  }

  const soon = () => pushToast('Скоро появится на Уровне 2 ✦')

  return (
    <div className="mt-3 flex items-center justify-between">
      <ActionSpot
        label={post.liked ? 'Убрать лайк' : 'Нравится'}
        count={post.likes}
        onClick={handleLike}
        active={post.liked}
        activeColor="text-coral"
        hoverBg="group-hover:bg-coral-soft group-hover:text-coral"
        hoverColor="group-hover:text-coral"
      >
        <motion.span
          key={pulseKey}
          initial={pulseKey > 0 ? { scale: 1 } : false}
          animate={pulseKey > 0 ? { scale: [1, 1.3, 1] } : undefined}
          transition={{ duration: 0.25, type: 'spring', stiffness: 500, damping: 18 }}
          className="flex"
        >
          <Heart
            size={18}
            strokeWidth={1.75}
            className={cn(post.liked && 'fill-coral text-coral')}
          />
        </motion.span>
      </ActionSpot>

      <ActionSpot
        label="Комментарии"
        count={post.comments}
        onClick={soon}
        hoverBg="group-hover:bg-accent-soft group-hover:text-accent"
        hoverColor="group-hover:text-accent"
      >
        <MessageCircle size={18} strokeWidth={1.75} />
      </ActionSpot>

      <ActionSpot
        label="Репосты"
        count={post.reposts}
        onClick={soon}
        hoverBg="group-hover:bg-accent-soft group-hover:text-accent"
        hoverColor="group-hover:text-accent"
      >
        <Repeat2 size={18} strokeWidth={1.75} />
      </ActionSpot>

      <ActionSpot
        label="Поделиться"
        onClick={soon}
        hoverBg="group-hover:bg-accent-soft group-hover:text-accent"
        hoverColor="group-hover:text-accent"
      >
        <Share size={18} strokeWidth={1.75} />
      </ActionSpot>
    </div>
  )
}
