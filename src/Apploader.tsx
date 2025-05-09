import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ShimmerLoader from './components/ShimmerLoader/ShimmerLoader'
import AppRouter from './AppRouter'

// Fallback JSON from local store
import DefaultMusicLib from './store/dafaultMusicLibrary.json'

const Apploader = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchAndPreload = async () => {
      let dashboardLibrary = []

      // 1. Simulate API call
      try {
        // Simulate fetch failure
        throw new Error('API not available')

        // If you had a real API:
        // const response = await fetch('/api/music')
        // dashboardLibrary = await response.json()

      } catch (error) {
        // 2. Fallback to default
        dashboardLibrary = DefaultMusicLib
      }

      // 3. Save to localStorage
      const musicData = { dashboard_library: dashboardLibrary }
      localStorage.setItem('MusicLibrary', JSON.stringify(musicData))

      // 4. Preload all cover images
      const loadImage = (src: string) =>
        new Promise((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = resolve
          img.onerror = resolve
        })

      await Promise.all(dashboardLibrary.map((track: any) => loadImage(track.coverImage)))

      // 5. Continue to app
      setTimeout(() => {
        setLoading(false)
        if (location.pathname === '/') {
          navigate('/')
        }
        
      }, 900)
    }

    fetchAndPreload()
  }, [navigate, location.pathname])

  return loading ? <ShimmerLoader /> : <AppRouter />
}

export default Apploader
