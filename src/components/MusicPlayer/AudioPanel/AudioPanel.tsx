import { SkipBack, Play, Pause, SkipForward } from 'lucide-react'
import styles from '../MusicPlayer.module.css'
import { useEffect, useRef, useState, useCallback } from 'react'

const AudioPanel: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)

  // State
  const [track, setTrack] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loopState, setLoopState] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Helpers
  const parseLibrary = useCallback(() => {
    const raw = localStorage.getItem('MusicLibrary')
    return raw ? JSON.parse(raw) : null
  }, [])

  const saveLibrary = useCallback((lib: any) => {
    localStorage.setItem('MusicLibrary', JSON.stringify(lib))
  }, [])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Load initial state
  useEffect(() => {
    const lib = parseLibrary()
    if (!lib) return

    const ls = lib.loopState ?? 0
    setLoopState(ls)

    const idx = lib.currentPlayingIndex
    if (Array.isArray(lib.currentPlaying_library) && typeof idx === 'number') {
      const t = lib.currentPlaying_library[idx]
      setTrack(t)
      lib.currentPlayingTrack = t
      saveLibrary(lib)
    }
  }, [parseLibrary, saveLibrary])

  useEffect(() => {
  }, [loopState])

  useEffect(() => {
    const onStorage = () => {
      const lib = parseLibrary()
      if (!lib) return
      const idx = lib.currentPlayingIndex
      if (Array.isArray(lib.currentPlaying_library) && typeof idx === 'number') {
        setTrack(lib.currentPlaying_library[idx])
      }
      if (typeof lib.loopState === 'number') {
        setLoopState(lib.loopState)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [parseLibrary])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const update = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }

    audio.addEventListener('timeupdate', update)
    audio.addEventListener('loadedmetadata', update)
    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('loadedmetadata', update)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onEnded = () => {
      const lib = parseLibrary()
      if (!lib) return

      const currentLoopState = lib.loopState ?? 0
      const { currentPlaying_library, currentPlayingIndex } = lib
      const lastIndex = currentPlaying_library.length - 1
      const isLast = currentPlayingIndex === lastIndex

      if (currentLoopState === 2) {
        audio.currentTime = 0
        audio.play()
        return
      }

      if (currentLoopState === 0 && isLast) {
        setIsPlaying(false)
        return
      }

      handleNextTrack()
    }

    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [isPlaying, parseLibrary])

  const playAudio = () => {
    audioRef.current?.play()
    setIsPlaying(true)
  }

  const pauseAudio = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const togglePlayPause = () => (isPlaying ? pauseAudio() : playAudio())

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = t
      setCurrentTime(t)
    }
  }

  const handleNextTrack = useCallback(() => {
    const lib = parseLibrary()
    if (!lib) return

    const currentLoopState = lib.loopState ?? 0
    setLoopState(currentLoopState)

    const { currentPlaying_library, currentPlayingIndex } = lib
    const lastIndex = currentPlaying_library.length - 1
    const isLast = currentPlayingIndex === lastIndex

    if (currentLoopState === 2) {
      audioRef.current!.currentTime = 0
      audioRef.current!.play()
      return
    }

    if (currentLoopState === 0 && isLast) {
      setIsPlaying(false)
      return
    }

    const nextIndex = (currentPlayingIndex + 1) % currentPlaying_library.length
    lib.currentPlayingIndex = nextIndex
    lib.currentPlayingTrack = currentPlaying_library[nextIndex]
    saveLibrary(lib)
    setTrack(lib.currentPlayingTrack)
    if (isPlaying) setTimeout(playAudio, 50)
  }, [isPlaying, parseLibrary, saveLibrary])

  const handlePrevTrack = () => {
    const lib = parseLibrary()
    if (!lib) return

    const { currentPlaying_library, currentPlayingIndex } = lib
    const prevIndex =
      (currentPlayingIndex - 1 + currentPlaying_library.length) %
      currentPlaying_library.length
    lib.currentPlayingIndex = prevIndex
    lib.currentPlayingTrack = currentPlaying_library[prevIndex]
    saveLibrary(lib)
    setTrack(lib.currentPlayingTrack)
    if (isPlaying) setTimeout(playAudio, 50)
  }

  return (
    <div className={styles.AudioPanel}>
      <audio ref={audioRef} src={track?.audioSrc} />

      <h5 className={styles.Musicname}>{track?.title}</h5>
      <p className={styles.ArtistName}>{track?.artist}</p>

      {track?.audioSrc && (
        <div className={styles.MusicProgress}>
          <span className={styles.TimePlayed}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSliderChange}
            className={styles.Slider}
          />
          <span className={styles.TotalTime}>{formatTime(duration)}</span>
        </div>
      )}

      <div className={styles.PlayerControls}>
        <button
          className={styles.Back}
          aria-label="Previous"
          onClick={handlePrevTrack}
        >
          <SkipBack size="1rem" />
        </button>
        <button
          className={styles.PlayPause}
          aria-label="Play/Pause"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size="1.2rem" /> : <Play size="1.2rem" />}
        </button>
        <button
          className={styles.Next}
          aria-label="Next"
          onClick={handleNextTrack}
        >
          <SkipForward size="1rem" />
        </button>
      </div>
    </div>
  )
}

export default AudioPanel
