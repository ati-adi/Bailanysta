import { formatTimeAgo } from '@/lib/utils'

interface TimeAgoProps {
  date: string
  className?: string
}

/** «2 ч назад» из ISO-даты */
export default function TimeAgo({ date, className }: TimeAgoProps) {
  return (
    <time dateTime={date} title={new Date(date).toLocaleString('ru-RU')} className={className}>
      {formatTimeAgo(date)}
    </time>
  )
}
