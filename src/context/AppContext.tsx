import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Post, ToastItem, ToastType, User } from '@/types'
import { CURRENT_USER, POSTS, USERS } from '@/data/mockData'

interface AppContextValue {
  posts: Post[]
  currentUser: User
  users: User[]
  followedIds: Set<string>
  toasts: ToastItem[]
  /** true, если с момента последнего просмотра ленты появились новые посты */
  hasNewPosts: boolean
  addPost: (text: string) => Post
  removePost: (postId: string) => void
  toggleLike: (postId: string) => void
  toggleFollow: (userId: string) => void
  pushToast: (message: string, type?: ToastType) => void
  dismissToast: (id: number) => void
  markFeedSeen: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

let toastId = 0

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(POSTS)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [hasNewPosts, setHasNewPosts] = useState(false)
  const [followedIds, setFollowedIds] = useState<Set<string>>(
    () => new Set(USERS.filter((u) => u.isFollowed).map((u) => u.id)),
  )

  const users = useMemo(
    () => USERS.map((u) => ({ ...u, isFollowed: followedIds.has(u.id) })),
    [followedIds],
  )

  const currentUser = useMemo<User>(
    () => ({ ...CURRENT_USER, avatar: CURRENT_USER.avatar }),
    [],
  )

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = ++toastId
      setToasts((prev) => [...prev.slice(-2), { id, message, type }])
      window.setTimeout(() => dismissToast(id), 3000)
    },
    [dismissToast],
  )

  const addPost = useCallback((text: string) => {
    const post: Post = {
      id: `local-${Date.now()}`,
      author: { ...CURRENT_USER },
      text,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      reposts: 0,
      liked: false,
    }
    setPosts((prev) => [post, ...prev])
    setHasNewPosts(true)
    return post
  }, [])

  const removePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }, [])

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    )
  }, [])

  const toggleFollow = useCallback((userId: string) => {
    setFollowedIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }, [])

  const markFeedSeen = useCallback(() => setHasNewPosts(false), [])

  const value = useMemo<AppContextValue>(
    () => ({
      posts,
      currentUser,
      users,
      followedIds,
      toasts,
      hasNewPosts,
      addPost,
      removePost,
      toggleLike,
      toggleFollow,
      pushToast,
      dismissToast,
      markFeedSeen,
    }),
    [posts, currentUser, users, followedIds, toasts, hasNewPosts, addPost, removePost, toggleLike, toggleFollow, pushToast, dismissToast, markFeedSeen],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
