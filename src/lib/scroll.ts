import type Lenis from 'lenis'

/** Модульный синглтон Lenis, чтобы любой компонент мог плавно скроллить */
let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 0.9 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
