import React, { useEffect, useState } from 'react'
import {
  ChevronLeft,
  Menu,
  SkipBack,
  Play,
  SkipForward,
  Shuffle,
  Link,
  Heart,
  Repeat,
  Sun,
  Moon,
} from 'lucide-react'
import styles from './MusicPlayer.module.css'


import MusicPanel from './MusicPanel/MusicPanel'
import AudioPanel from './AudioPanel/AudioPanel'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'music-player-theme'

const MusicPlayer: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light')

  
  useEffect(() => {
    // Theme setup
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
    // MusicLibrary sync
    const rawLibrary = localStorage.getItem('MusicLibrary')
    if (rawLibrary) {
      const musicLibrary = JSON.parse(rawLibrary)
    }
  }, [])

  // Whenever theme changes, persist it
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(curr => (curr === 'light' ? 'dark' : 'light'))

  return (
    <div className={styles.MusicPlayerContainer}>
      <audio src="/dummy-song.mp3" preload="auto" />

      <div className={styles.MusicCard}>
        <div className={styles.NavPanel}>
          <button className={styles.IconButton} aria-label="Back">
            <ChevronLeft size="1rem" />
          </button>

          <h6 className={styles.SmlHeading}>Now Playing</h6>

          <div className={styles.RightIcons}>
            {/* THEME TOGGLE */}
            <button
              className={styles.IconButton}
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size="1rem" /> : <Sun size="1rem" />}
            </button>

            <button className={styles.IconButton} aria-label="Menu">
              <Menu size="1rem" />
            </button>
          </div>
        </div>

        <div className={styles.TileSwiper}>
          <img
            src="/cover.jpg"
            alt="Album cover"
            className={styles.CoverImage}
          />
        </div>

        <div className={styles.Panel}>
            <AudioPanel />

            <MusicPanel />
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
