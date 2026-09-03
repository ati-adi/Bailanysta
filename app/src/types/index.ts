// Доменные типы — единый источник истины в @contracts/types (общие с бэкендом).
// PostDTO.createdAt — это Date (superjson), не строка.
export type { UserDTO as User, PostDTO as Post, TopicDTO as Topic } from '@contracts/types'

export type ToastType = 'success' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}
