import styles from "./GifLoader.module.css";
import { Loader2 } from "lucide-react"; // Lucide spinner icon

const GifLoader = () => {
  return (
    <div className={styles.MusicPlayerContainer}>
      <div className={`${styles.MusicCard} shimmer`}>

        <div className={styles.LoaderWrapper}>
          <Loader2 className={styles.Spinner} size="2.5rem" />
          <p className={styles.LoadingText} style={{color:'white'}}>Loading Music App...</p>
        </div>

      </div>
    </div>
  );
};

export default GifLoader;
