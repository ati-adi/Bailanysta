import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-deep disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent',
  outline:
    'border border-line bg-transparent text-ink hover:bg-accent-soft hover:text-accent hover:border-accent/30 disabled:opacity-40 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-ink-soft hover:bg-accent-soft hover:text-accent',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1 text-[13px]',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none transition-colors duration-150 select-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
})

export default Button
