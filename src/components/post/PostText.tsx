import { useApp } from '@/context/AppContext'
import { parseHashtags } from '@/lib/utils'

interface PostTextProps {
  text: string
}

/** Текст поста с подсветкой хэштегов (#...) цветом accent */
export default function PostText({ text }: PostTextProps) {
  const { pushToast } = useApp()
  const parts = parseHashtags(text)

  return (
    <p className="whitespace-pre-wrap text-base leading-[1.55] text-ink">
      {parts.map((part, i) =>
        part.type === 'hashtag' ? (
          <button
            key={i}
            type="button"
            onClick={() => pushToast('Поиск по темам появится на Уровне 2')}
            className="font-medium text-accent transition-colors duration-150 hover:underline"
          >
            {part.value}
          </button>
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
    </p>
  )
}
