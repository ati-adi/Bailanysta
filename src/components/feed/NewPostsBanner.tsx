import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

interface NewPostsBannerProps {
  visible: boolean
  onClick: () => void
}

/** Плавающая пилюля «Показать новые посты» под хедером ленты */
export default function NewPostsBanner({ visible, onClick }: NewPostsBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onClick}
          className="sticky top-[68px] z-20 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-toast transition-colors hover:bg-accent-deep"
        >
          <ArrowUp size={15} strokeWidth={2} />
          Показать новые посты
        </motion.button>
      )}
    </AnimatePresence>
  )
}
