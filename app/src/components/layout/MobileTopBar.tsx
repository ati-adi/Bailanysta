import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Avatar from '@/components/ui/Avatar'

/** Мобильная верхняя панель (<md): логотип + аватар текущего пользователя */
export default function MobileTopBar() {
  const { currentUser } = useApp()
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/85 px-4 backdrop-blur-md md:hidden">
      <Link to="/" className="flex items-center gap-2" aria-label="Bailanysta — на ленту">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
          <Sparkles size={15} strokeWidth={1.75} className="text-white" />
        </span>
        <span className="font-display text-base font-semibold text-ink">Bailanysta</span>
      </Link>
      <Link to="/profile" aria-label="Мой профиль">
        <Avatar src={currentUser.avatar} alt={currentUser.name} size={32} hoverRing />
      </Link>
    </header>
  )
}
