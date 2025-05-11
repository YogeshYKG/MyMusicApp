import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import styles from './MenuPanel.module.css'

interface Track {
  title: string
  artist: string
  url: string
  coverImage: string
  favorited: boolean
  audioSrc: string
}

const MenuPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false)
  const [trackList, setTrackList] = useState<Track[]>([])
  const panelRef = useRef<HTMLDivElement | null>(null)  // Ref to the panel div

  useEffect(() => {
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    if (lib.currentPlaying_library) {
      setTrackList(lib.currentPlaying_library)
    }

    // Close the panel when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()  // Close the panel after animation
    }, 100)  // Matches the duration of the slideOut animation
  }

  const handleTrackClick = (track: Track) => {
    // Fetch the current library from localStorage
    const raw = localStorage.getItem('MusicLibrary')
    if (!raw) return

    const lib = JSON.parse(raw)
    lib.currentPlayingTrack = track  // Update the current track
    lib.currentPlayingIndex = lib.currentPlaying_library.findIndex((t: { title: string; artist: string; audioSrc: string }) => 
        t.title === track.title &&
        t.artist === track.artist &&
        t.audioSrc === track.audioSrc
    );

    // Save the updated library back to localStorage
    localStorage.setItem('MusicLibrary', JSON.stringify(lib))

    // Close the panel
    handleClose()
  }

  return (
    <div 
      ref={panelRef}  // Attach the ref to the panel div
      className={`${styles.OffsetPanel} ${isClosing ? styles.slideOut : ''}`}
    >
      <div className={styles.OffsetHeader}>
        <span className={styles.Heading}>Music List</span>
        <button onClick={handleClose} className={styles.IconButton}>
          <X size="1rem" />
        </button>
      </div>

      <div className={styles.TrackList}>
        {trackList.map((track, index) => (
          <div
            key={index}
            className={styles.TrackItem}
            onClick={() => handleTrackClick(track)}
          >
            <div className={styles.Sno}>{index}</div>
            <img src={track.coverImage} alt={track.title} className={styles.TrackImage} />
            <div className={styles.TrackText}>
              <span className={styles.Title}>{track.title}</span>
              <span className={styles.Artist}>{`~~${track.artist}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuPanel
