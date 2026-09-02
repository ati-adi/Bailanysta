import { POST_MAX_LENGTH } from '@/data/mockData'

interface CharCounterProps {
  value: number
  max?: number
}

/** Кольцевой счётчик символов (SVG progress ring) для композера */
export default function CharCounter({ value, max = POST_MAX_LENGTH }: CharCounterProps) {
  const remaining = max - value
  const progress = Math.min(1, value / max)

  const size = 28
  const stroke = 2.5
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  // До 240 — серое кольцо, 240–279 — gold, 280+ — coral
  const color =
    value >= max ? 'var(--coral)' : value >= max - 40 ? 'var(--gold)' : 'var(--ink-faint)'

  return (
    <div
      className="relative flex items-center justify-center"
      role="status"
      aria-label={`Осталось символов: ${remaining}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 150ms ease, stroke 150ms ease' }}
        />
      </svg>
      {value >= max - 40 && (
        <span
          className="absolute text-[10px] font-semibold tabular-nums"
          style={{ color }}
        >
          {remaining}
        </span>
      )}
    </div>
  )
}
