import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import styles from "../MusicPlayer/MusicPlayer.module.css"; // Reusing same container & card styles
import nfStyles from "./NotFound.module.css"

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.MusicPlayerContainer}>
      <div className={styles.MusicCard}>
        <div className={nfStyles.LoaderWrapper}>
          <AlertTriangle size="2.5rem" className={nfStyles.Spinner} />
          <p className={nfStyles.LoadingText}>404 | Page Not Found</p>

          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "0.75rem",
              padding: "0.6rem 1.5rem",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
