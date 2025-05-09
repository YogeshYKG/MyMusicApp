import React, { useEffect, useState } from 'react'
import { Shuffle, Link, Heart, Repeat, Repeat1 } from 'lucide-react'
import styles from '../MusicPlayer.module.css'
import { shuffleArray } from '../../../Utls/ShuffleArray'

const MusicPanel: React.FC = () => {
  const [activeStates, setActiveStates] = useState<{ [key: string]: boolean }>({})
  const [loopState, setLoopState] = useState(0)

  const icons = [
    { Icon: Shuffle, key: 'Shuffle' },
    { Icon: Link, key: 'Link' },
    { Icon: Heart, key: 'Heart' },
    { Icon: Repeat, key: 'Repeat' },
  ]

  // Helpers
  const toggleActive = (key: string, value?: boolean) => {
    setActiveStates(prev => ({ ...prev, [key]: value ?? !prev[key] }))
  }

  const getRepeatIcon = () => (loopState === 2 ? Repeat1 : Repeat)

  // Actions
  const handleShuffle = () => {
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    const { currentPlaying_library: tracks, currentPlayingIndex: index } = lib
    if (!Array.isArray(tracks) || typeof index !== 'number') return

    const before = shuffleArray(tracks.slice(0, index))
    const current = tracks[index]
    const after = shuffleArray(tracks.slice(index + 1))

    lib.currentPlaying_library = [...before, current, ...after]
    localStorage.setItem('MusicLibrary', JSON.stringify(lib))
    toggleActive('Shuffle')
  }

  const handleLink = () => {
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    const index = lib.currentPlayingIndex
    const track = lib.currentPlaying_library?.[index]
    if (track?.url) window.open(track.url, '_blank')
  }

  const handleHeart = () => {
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    const index = lib.currentPlayingIndex
    const track = lib.currentPlaying_library?.[index]
    if (!track) return

    const newFav = !track.favorited
    lib.currentPlaying_library[index].favorited = newFav
    localStorage.setItem('MusicLibrary', JSON.stringify(lib))
    toggleActive('Heart', newFav)
  }

  const handleRepeat = () => {
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    const newLoop = (lib.loopState + 1) % 3

    lib.loopState = newLoop
    localStorage.setItem('MusicLibrary', JSON.stringify(lib))
    setLoopState(newLoop)
    toggleActive('Repeat', newLoop > 0)
  }

  const getClickHandler = (key: string) => {
    switch (key) {
      case 'Shuffle': return handleShuffle
      case 'Link': return handleLink
      case 'Heart': return handleHeart
      case 'Repeat': return handleRepeat
      default: return undefined
    }
  }

  // Sync UI with localStorage (on mount)
  useEffect(() => {
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    const index = lib.currentPlayingIndex
    const track = lib.currentPlaying_library?.[index]

    setLoopState(lib.loopState || 0)
    setActiveStates({
      Heart: !!track?.favorited,
      Repeat: lib.loopState > 0,
      Shuffle: false,
      Link: false,
    })
  }, [])

  // Listen for localStorage changes (track change)
  useEffect(() => {
    const handleStorage = () => {
      const raw = localStorage.getItem('MusicLibrary')
      if (!raw) return

      const lib = JSON.parse(raw)
      const index = lib.currentPlayingIndex
      const track = lib.currentPlaying_library?.[index]

      toggleActive('Heart', !!track?.favorited)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <div className={styles.MusicPanel}>
      {icons.map(({ Icon, key }) => {
        const CurrentIcon = key === 'Repeat' ? getRepeatIcon() : Icon
        return (
          <button
            key={key}
            className={`${styles.ControlIcon} ${activeStates[key] ? styles.active : ''}`}
            aria-label={key}
            onClick={getClickHandler(key)}
          >
            <CurrentIcon size="1rem" />
          </button>
        )
      })}
    </div>
  )
}

export default MusicPanel
