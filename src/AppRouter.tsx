import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard' 
import AdminPanel from './components/AdminPanel/AdminPanel'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import './Global.css'


import NotFound from './components/NotFound/NotFound'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MusicPlayer />} />      {/* Music Player */}
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/music" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />         {/* 404 fallback route */}
    </Routes>
  )
}

export default AppRouter
