import { SkipBack, Play, SkipForward } from 'lucide-react'
import styles from '../MusicPlayer.module.css' // Make sure the path is correct
import { useEffect, useState } from 'react'

const AudioPanel = () => {
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<any>(null)

  useEffect(() => {
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    const { currentPlaying_library, currentPlayingIndex } = lib

    if (Array.isArray(currentPlaying_library) && typeof currentPlayingIndex === 'number') {
      const currentTrack = currentPlaying_library[currentPlayingIndex]
      setCurrentPlayingTrack(currentTrack)

      // Save currentPlayingTrack back to localStorage
      lib.currentPlayingTrack = currentTrack
      localStorage.setItem('MusicLibrary', JSON.stringify(lib))
    }
  }, []) // Runs once on component mount

  useEffect(() => {
    const handleStorage = () => {
      const raw = localStorage.getItem('MusicLibrary')
      if (!raw) return

      const lib = JSON.parse(raw)
      const { currentPlaying_library, currentPlayingIndex } = lib

      if (Array.isArray(currentPlaying_library) && typeof currentPlayingIndex === 'number') {
        const currentTrack = currentPlaying_library[currentPlayingIndex]
        setCurrentPlayingTrack(currentTrack)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, []) // Listens for changes in localStorage

  const handleNextTrack = () => {
  const raw = localStorage.getItem('MusicLibrary')
  if (!raw) return

  const lib = JSON.parse(raw)
  const { currentPlaying_library, currentPlayingIndex } = lib

  if (Array.isArray(currentPlaying_library)) {
    const nextIndex = (currentPlayingIndex + 1) % currentPlaying_library.length
    lib.currentPlayingIndex = nextIndex
    lib.currentPlayingTrack = currentPlaying_library[nextIndex]

    localStorage.setItem('MusicLibrary', JSON.stringify(lib))
    setCurrentPlayingTrack(currentPlaying_library[nextIndex])
  }
}

const handlePrevTrack = () => {
  const raw = localStorage.getItem('MusicLibrary')
  if (!raw) return

  const lib = JSON.parse(raw)
  const { currentPlaying_library, currentPlayingIndex } = lib

  if (Array.isArray(currentPlaying_library)) {
    const prevIndex =
      (currentPlayingIndex - 1 + currentPlaying_library.length) %
      currentPlaying_library.length
    lib.currentPlayingIndex = prevIndex
    lib.currentPlayingTrack = currentPlaying_library[prevIndex]

    localStorage.setItem('MusicLibrary', JSON.stringify(lib))
    setCurrentPlayingTrack(currentPlaying_library[prevIndex])
  }
}

  return (
    <div className={styles.AudioPanel}>
      <h5 className={styles.Musicname}>{currentPlayingTrack?.title}</h5>
      <p className={styles.ArtistName}>{currentPlayingTrack?.artist}</p>

      <div className={styles.MusicProgress}>
        <span className={styles.TimePlayed}>0:00</span>
        <div className={styles.Slider} />
        <span className={styles.TotalTime}>3:45</span>
      </div>

      <div className={styles.PlayerControls}>
        <button className={styles.Back} aria-label="Previous" onClick={handlePrevTrack}>
          <SkipBack size="1rem" />
        </button>
        <button className={styles.PlayPause} aria-label="Play/Pause">
          <Play size="1.2rem" />
        </button>
        <button className={styles.Next} aria-label="Next" onClick={handleNextTrack}>
          <SkipForward size="1rem" />
        </button>
      </div>
    </div>
  )
}

export default AudioPanel
