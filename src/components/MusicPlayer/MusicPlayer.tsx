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

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'music-player-theme'

const MusicPlayer: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light')

  // On mount, read theme from localStorage (fallback to system)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else {
      // optional: detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
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
          <h5 className={styles.Musicname}>Sample Song</h5>
          <p className={styles.ArtistName}>Sample Artist</p>

          <div className={styles.MusicProgress}>
            <span className={styles.TimePlayed}>0:00</span>
            <div className={styles.Slider} />
            <span className={styles.TotalTime}>3:45</span>
          </div>

          <div className={styles.PlayerControls}>
            <button className={styles.Back} aria-label="Previous">
              <SkipBack size="1rem" />
            </button>
            <button className={styles.PlayPause} aria-label="Play/Pause">
              <Play size="1.2rem" />
            </button>
            <button className={styles.Next} aria-label="Next">
              <SkipForward size="1rem" />
            </button>
          </div>

          <div className={styles.MusicPanel}>
            {[Shuffle, Link, Heart, Repeat].map((Icon, idx) => (
              <button
                key={idx}
                className={styles.ControlIcon}
                aria-label={Icon.name}
              >
                <Icon size="1rem" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
