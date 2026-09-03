/**
 * Скелетон карточки поста в стиле PostCard:
 * paper-raised карточка, пульсирующие серые блоки под аватар и строки текста.
 */
export default function PostCardSkeleton() {
  return (
    <div
      aria-hidden
      className="rounded-2xl border border-line bg-paper-raised p-5 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-line" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="w-full">
              <div className="h-3.5 w-2/5 animate-pulse rounded-full bg-line" />
              <div className="mt-2 h-3 w-1/4 animate-pulse rounded-full bg-line" />
            </div>
            <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-line" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded-full bg-line" />
            <div className="h-3 w-11/12 animate-pulse rounded-full bg-line" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-line" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-4 w-12 animate-pulse rounded-full bg-line" />
            <div className="h-4 w-12 animate-pulse rounded-full bg-line" />
            <div className="h-4 w-12 animate-pulse rounded-full bg-line" />
            <div className="h-4 w-8 animate-pulse rounded-full bg-line" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Набор скелетонов на время загрузки ленты/профиля */
export function PostCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4 pb-12" role="status" aria-label="Загрузка постов">
      {Array.from({ length: count }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
