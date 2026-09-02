import { Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import AppShell from '@/components/layout/AppShell'
import FeedPage from '@/pages/FeedPage'
import ProfilePage from '@/pages/ProfilePage'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<FeedPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}
