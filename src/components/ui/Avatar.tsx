import { cn } from '@/lib/utils'

const sizeMap: Record<number, string> = {
  32: 'w-8 h-8',
  40: 'w-10 h-10',
  44: 'w-11 h-11',
  56: 'w-14 h-14',
  96: 'w-24 h-24',
}

interface AvatarProps {
  src: string
  alt: string
  size?: 32 | 40 | 44 | 56 | 96
  className?: string
  /** Кольцо ring-accent/30 при hover (для кликабельных аватаров) */
  hoverRing?: boolean
}

export default function Avatar({ src, alt, size = 44, className, hoverRing = false }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={cn(
        'shrink-0 rounded-full object-cover bg-line',
        sizeMap[size],
        hoverRing && 'transition-shadow duration-150 hover:ring-2 hover:ring-accent/30',
        className,
      )}
    />
  )
}
