import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  title: string
  description: string
  /** URL иллюстрации; если не задан — рисуется мягкий фиолетовый круг с иконкой */
  image?: string
  icon?: ReactNode
  ctaLabel?: string
  onCta?: () => void
}

export default function EmptyState({ title, description, image, icon, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper-raised px-6 py-12 text-center shadow-card"
    >
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-accent-soft">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(142,91,232,0.35), transparent 70%)' }}
        />
        {image ? (
          <img src={image} alt="" width={72} height={72} className="relative h-[72px] w-[72px] object-contain" />
        ) : (
          <span className="relative text-accent">{icon}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-[320px] text-sm leading-relaxed text-ink-soft">{description}</p>
      {ctaLabel && onCta && (
        <Button className="mt-2" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </motion.div>
  )
}
