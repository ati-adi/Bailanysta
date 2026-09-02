import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'
import type { ToastItem } from '@/types'

export default function Toast({ toast }: { toast: ToastItem }) {
  const Icon = toast.type === 'success' ? CheckCircle2 : Sparkles
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper shadow-toast"
    >
      <Icon
        size={18}
        strokeWidth={1.75}
        style={{ color: toast.type === 'success' ? 'var(--success)' : 'var(--gold)' }}
      />
      <span>{toast.message}</span>
    </motion.div>
  )
}
