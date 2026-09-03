import WhoToFollow from './WhoToFollow'
import TrendingTopics from './TrendingTopics'

/** Правая колонка (xl+): виджеты «Кого читать» и «Актуальные темы» */
export default function RightSidebar() {
  return (
    <aside className="sticky top-6 hidden w-[300px] shrink-0 flex-col gap-4 self-start py-6 pr-4 xl:flex">
      <WhoToFollow />
      <TrendingTopics />
      <p className="mt-2 px-1 text-xs leading-relaxed text-ink-faint">
        Bailanysta · Прототип · Уровень 1
        <br />
        Сделано с ✦ в Казахстане
      </p>
    </aside>
  )
}
