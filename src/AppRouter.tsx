import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard' 
import AdminPanel from './components/AdminPanel/AdminPanel'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import './Global.css'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/music" element={<MusicPlayer />} />
    </Routes>
  )
}

export default AppRouter
