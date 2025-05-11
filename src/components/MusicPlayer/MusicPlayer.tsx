import React, { useEffect, useState } from 'react'
import {
  ChevronLeft,
  Menu,
  Sun,
  Moon,
} from 'lucide-react'
import styles from './MusicPlayer.module.css'


import MusicPanel from './MusicPanel/MusicPanel'
import AudioPanel from './AudioPanel/AudioPanel'

import MenuPanel from '../OffsetPanel/MenuPanel'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'music-player-theme'

interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  favorited: boolean;
  coverImage: string;
  // other properties you may need
}

const MusicPlayer: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light')
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  
  useEffect(() => {
    // Theme setup
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    const loadCurrentTrack = () => {
      const raw = localStorage.getItem('MusicLibrary');
      if (!raw) return;

      const lib = JSON.parse(raw);
      if (lib.currentPlayingTrack) {
        setCurrentTrack(lib.currentPlayingTrack);
      }
    };

    // Polling or waiting for localStorage to be ready
    const interval = setInterval(() => {
      loadCurrentTrack();
    }, 1000); // Check every second

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

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

      <div className={`${styles.MusicCard} ${!currentTrack ? 'shimmer' : ''}`}>
        <div className={styles.NavPanel}>
          {currentTrack ? (
              <>
                <button className={styles.IconButton} aria-label="Back">
                  <ChevronLeft size="1rem" />
                </button>

                <h6 className={styles.SmlHeading}>Now Playing</h6>

                <div className={styles.RightIcons}>
                  <button
                    className={styles.IconButton}
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? <Moon size="1rem" /> : <Sun size="1rem" />}
                  </button>
                  <button
                    className={styles.IconButton}
                    aria-label="Menu"
                    onClick={toggleMenu}
                  >
                    <Menu size="1rem" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={`shimmer ${styles.IconButton}`} />
                <div className="shimmer" style={{ width: '5rem', height: '1rem', borderRadius: '0.3rem' }} />
                <div className={styles.RightIcons}>
                  <div className={`shimmer ${styles.IconButton}`} />
                  <div className={`shimmer ${styles.IconButton}`} />
                </div>
              </>
            )
          }
        </div>

        <div className={styles.TileSwiper}>
          {currentTrack?.coverImage ? (
            <img
              src={currentTrack.coverImage}
              alt="Album cover"
              className={styles.CoverImage}
            />
          ) : (
            <div className={`shimmer ${styles.CoverImage}`}></div>
          )}
        </div>
        {isMenuOpen && (
            <MenuPanel onClose={toggleMenu} />
        )}

        <div className={styles.Panel}>
            <AudioPanel />

            <MusicPanel currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} />
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
