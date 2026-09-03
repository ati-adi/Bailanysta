import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { Post } from '@/types'
import Avatar from '@/components/ui/Avatar'
import TimeAgo from '@/components/ui/TimeAgo'
import PostText from './PostText'
import PostActions from './PostActions'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { currentUser, pushToast } = useApp()
  const navigate = useNavigate()
  const isOwn = post.author.id === currentUser.id

  const openAuthor = () => {
    if (isOwn) navigate('/profile')
    else pushToast('Профили других пользователей появятся на Уровне 2')
  }

  return (
    <motion.article
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-2xl border border-line bg-paper-raised p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
    >
      <div className="flex items-start gap-3">
        <button type="button" onClick={openAuthor} aria-label={`Профиль: ${post.author.name}`} className="rounded-full">
          <Avatar src={post.author.avatar} alt={post.author.name} size={44} hoverRing />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <button
                type="button"
                onClick={openAuthor}
                className="block max-w-full truncate text-left text-[15px] font-semibold leading-[1.3] text-ink hover:underline"
              >
                {post.author.name}
              </button>
              <div className="text-[13px] leading-[1.3] text-ink-soft">
                @{post.author.handle} · <TimeAgo date={post.createdAt} />
              </div>
            </div>
            <button
              type="button"
              aria-label="Меню поста"
              onClick={() => pushToast('Меню поста появится позже')}
              className="-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-accent-soft hover:text-accent"
            >
              <MoreHorizontal size={18} strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-2">
            <PostText text={post.text} />
          </div>

          <PostActions post={post} />
        </div>
      </div>
    </motion.article>
  )
}
