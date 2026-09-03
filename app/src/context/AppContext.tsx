import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CURRENT_USER_ID } from '@contracts/types'
import { trpc } from '@/providers/trpc'
import type { Post, ToastItem, ToastType, User } from '@/types'

interface AppContextValue {
  posts: Post[]
  /** true, пока идёт первая загрузка ленты с сервера */
  postsLoading: boolean
  /** true, если запрос ленты завершился ошибкой */
  postsError: boolean
  refetchPosts: () => void
  users: User[]
  usersLoading: boolean
  currentUser: User
  followedIds: Set<string>
  toasts: ToastItem[]
  addPost: (text: string) => Promise<Post>
  removePost: (postId: string) => void
  toggleLike: (postId: string) => void
  toggleFollow: (userId: string) => void
  pushToast: (message: string, type?: ToastType) => void
  dismissToast: (id: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

let toastId = 0

/** Заглушка на время загрузки users.list — заменяется реальным пользователем */
const CURRENT_USER_PLACEHOLDER: User = {
  id: CURRENT_USER_ID,
  name: '',
  handle: '',
  avatar: '',
  bio: '',
  isFollowed: false,
  followers: 0,
  following: 0,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const utils = trpc.useUtils()

  // === Данные с бэкенда (tRPC — источник истины) ===
  const postsQuery = trpc.posts.list.useQuery()
  const usersQuery = trpc.users.list.useQuery()

  const posts = useMemo<Post[]>(() => postsQuery.data ?? [], [postsQuery.data])
  const users = useMemo<User[]>(() => usersQuery.data ?? [], [usersQuery.data])

  const currentUser = useMemo<User>(
    () => users.find((u) => u.id === CURRENT_USER_ID) ?? CURRENT_USER_PLACEHOLDER,
    [users],
  )

  const followedIds = useMemo(
    () => new Set(users.filter((u) => u.isFollowed).map((u) => u.id)),
    [users],
  )

  // === Тосты (чистый UI) ===
  const [toasts, setToasts] = useState<ToastItem[]>([])

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

  // === Мутации ===

  const createPost = trpc.posts.create.useMutation({
    onMutate: async ({ text }) => {
      await utils.posts.list.cancel()
      const previous = utils.posts.list.getData()
      // Оптимистичный пост: префикс local- включает анимацию «нового поста» в списках
      const optimistic: Post = {
        id: `local-${Date.now()}`,
        author: currentUser,
        text,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        reposts: 0,
        liked: false,
      }
      utils.posts.list.setData(undefined, (old) => [optimistic, ...(old ?? [])])
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.posts.list.setData(undefined, context.previous)
    },
    onSettled: () => {
      void utils.posts.list.invalidate()
    },
  })

  const removePostMutation = trpc.posts.remove.useMutation({
    onMutate: async ({ postId }) => {
      await utils.posts.list.cancel()
      const previous = utils.posts.list.getData()
      utils.posts.list.setData(undefined, (old) =>
        (old ?? []).filter((p) => p.id !== postId),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.posts.list.setData(undefined, context.previous)
      pushToast('Не удалось удалить пост', 'info')
    },
    onSettled: () => {
      void utils.posts.list.invalidate()
    },
  })

  const toggleLikeMutation = trpc.posts.toggleLike.useMutation({
    onMutate: async ({ postId }) => {
      await utils.posts.list.cancel()
      const previous = utils.posts.list.getData()
      utils.posts.list.setData(undefined, (old) =>
        (old ?? []).map((p) =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
            : p,
        ),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.posts.list.setData(undefined, context.previous)
    },
    onSettled: () => {
      void utils.posts.list.invalidate()
    },
  })

  const toggleFollowMutation = trpc.users.toggleFollow.useMutation({
    onMutate: async ({ userId }) => {
      await utils.users.list.cancel()
      const previous = utils.users.list.getData()
      utils.users.list.setData(undefined, (old) =>
        (old ?? []).map((u) =>
          u.id === userId ? { ...u, isFollowed: !u.isFollowed } : u,
        ),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.users.list.setData(undefined, context.previous)
    },
    onSettled: () => {
      void utils.users.list.invalidate()
      void utils.posts.list.invalidate()
    },
  })

  const addPost = useCallback(
    (text: string) => createPost.mutateAsync({ text }),
    [createPost],
  )

  const removePost = useCallback(
    (postId: string) => {
      removePostMutation.mutate({ postId })
    },
    [removePostMutation],
  )

  const toggleLike = useCallback(
    (postId: string) => {
      toggleLikeMutation.mutate({ postId })
    },
    [toggleLikeMutation],
  )

  const toggleFollow = useCallback(
    (userId: string) => {
      toggleFollowMutation.mutate({ userId })
    },
    [toggleFollowMutation],
  )

  const refetchPosts = useCallback(() => {
    void postsQuery.refetch()
  }, [postsQuery.refetch])

  const value = useMemo<AppContextValue>(
    () => ({
      posts,
      postsLoading: postsQuery.isLoading,
      postsError: postsQuery.isError,
      refetchPosts,
      users,
      usersLoading: usersQuery.isLoading,
      currentUser,
      followedIds,
      toasts,
      addPost,
      removePost,
      toggleLike,
      toggleFollow,
      pushToast,
      dismissToast,
    }),
    [
      posts,
      postsQuery.isLoading,
      postsQuery.isError,
      refetchPosts,
      users,
      usersQuery.isLoading,
      currentUser,
      followedIds,
      toasts,
      addPost,
      removePost,
      toggleLike,
      toggleFollow,
      pushToast,
      dismissToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
