import { AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import Toast from './Toast'

/** Фиксированный контейнер тостов: bottom-center, z-50 */
export default function Toaster() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  )
}
