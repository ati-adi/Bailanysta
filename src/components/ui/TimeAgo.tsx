import { formatTimeAgo } from '@/lib/utils'

interface TimeAgoProps {
  date: Date | string
  className?: string
}

/** «2 ч назад» из даты (Date с бэкенда через superjson или ISO-строка) */
export default function TimeAgo({ date, className }: TimeAgoProps) {
  const d = date instanceof Date ? date : new Date(date)
  return (
    <time dateTime={d.toISOString()} title={d.toLocaleString('ru-RU')} className={className}>
      {formatTimeAgo(d)}
    </time>
  )
}
