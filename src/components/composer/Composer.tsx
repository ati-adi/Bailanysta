import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { POST_MAX_LENGTH } from '@contracts/types'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import CharCounter from './CharCounter'
import { cn } from '@/lib/utils'

export interface ComposerHandle {
  focus: () => void
}

interface ComposerProps {
  /** Плейсхолдер; по умолчанию — «Что нового, {имя}?» */
  placeholder?: string
  /** Колбэк после успешной публикации */
  onPublished?: () => void
  className?: string
}

/**
 * Форма создания поста (shared, используется страницей профиля).
 * Авто-рост textarea (3–10 строк), кольцевой счётчик 280,
 * спиннер на кнопке, пока идёт реальная мутация posts.create.
 */
const Composer = forwardRef<ComposerHandle, ComposerProps>(function Composer(
  { placeholder, onPublished, className },
  ref,
) {
  const { currentUser, addPost, pushToast } = useApp()
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }))

  // Авто-рост textarea: min 3 строки, max 10
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const lineHeight = 24
    const min = lineHeight * 3
    const max = lineHeight * 10
    el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
  }, [text])

  const length = text.length
  const canPublish = length > 0 && length <= POST_MAX_LENGTH && !publishing

  const handlePublish = async () => {
    if (!canPublish) return
    setPublishing(true)
    try {
      await addPost(text.trim())
      setText('')
      pushToast('Пост опубликован ✦', 'success')
      onPublished?.()
    } catch {
      pushToast('Не удалось опубликовать пост. Попробуйте ещё раз', 'info')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border bg-paper-raised p-5 shadow-card transition-all duration-200',
        focused
          ? 'border-[1.5px] border-accent shadow-[0_0_0_4px_rgba(91,75,232,0.12)]'
          : 'border-line',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar src={currentUser.avatar} alt={currentUser.name} size={56} />
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder ?? `Что нового, ${currentUser.name.split(' ')[0]}?`}
          rows={3}
          aria-label="Текст нового поста"
          className="min-w-0 flex-1 resize-none bg-transparent pt-2 text-base leading-6 text-ink outline-none placeholder:text-ink-faint"
        />
      </div>

      <div className="mt-3 flex items-center justify-end gap-3 border-t border-line pt-3">
        <CharCounter value={length} />
        <Button
          size="lg"
          onClick={handlePublish}
          disabled={!canPublish}
          className="min-w-[136px]"
        >
          {publishing ? <Loader2 size={16} className="animate-spin" /> : 'Опубликовать'}
        </Button>
      </div>
    </div>
  )
})

export default Composer
