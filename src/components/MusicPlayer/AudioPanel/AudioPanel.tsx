import { SkipBack, Play, SkipForward } from 'lucide-react'
import styles from '../MusicPlayer.module.css' // Make sure the path is correct

const AudioPanel = () => {
  return (
    <div className={styles.AudioPanel}>
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
    </div>
  )
}

export default AudioPanel
