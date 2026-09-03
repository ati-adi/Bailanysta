import { useLocation } from 'react-router-dom'
import { Bell, Home, Mail, MoreHorizontal, Sparkles, UserRound } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Avatar from '@/components/ui/Avatar'
import NavItem from './NavItem'
import { cn } from '@/lib/utils'

export default function LeftRail() {
  const { currentUser, pushToast } = useApp()
  const location = useLocation()

  const soon = () => pushToast('Скоро появится на Уровне 2 ✦')

  return (
    <aside className="sticky top-0 hidden h-[100dvh] w-[72px] shrink-0 flex-col self-start bg-ink px-2 py-5 lg:w-[260px] lg:px-4 md:flex">
      {/* Логотип */}
      <div className="mb-7 flex items-center justify-center gap-2.5 px-1 lg:justify-start">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
          <Sparkles size={18} strokeWidth={1.75} className="text-white" />
        </span>
        <span className="hidden font-display text-xl font-semibold text-paper lg:inline">
          Bailanysta
        </span>
      </div>

      {/* Навигация */}
      <nav className="flex flex-col gap-1.5">
        <NavItem icon={Home} label="Лента" to="/" active={location.pathname === '/'} />
        <NavItem icon={UserRound} label="Профиль" to="/profile" active={location.pathname === '/profile'} />
        <NavItem icon={Bell} label="Уведомления" onClick={soon} />
        <NavItem icon={Mail} label="Сообщения" onClick={soon} />
      </nav>

      <div className="flex-1" />

      {/* Карточка текущего пользователя */}
      <button
        type="button"
        onClick={() => pushToast('Настройки аккаунта появятся на Уровне 2')}
        className={cn(
          'flex items-center gap-3 rounded-xl p-2.5 text-left transition-colors duration-150 hover:bg-white/5',
          'justify-center lg:justify-start',
        )}
      >
        <Avatar src={currentUser.avatar} alt={currentUser.name} size={40} />
        <span className="hidden min-w-0 flex-1 lg:block">
          <span className="block truncate text-sm font-semibold text-paper">{currentUser.name}</span>
          <span className="block truncate text-[13px] text-[#8F8C9C]">@{currentUser.handle}</span>
        </span>
        <MoreHorizontal size={18} strokeWidth={1.75} className="hidden shrink-0 text-[#8F8C9C] lg:block" />
      </button>
    </aside>
  )
}
