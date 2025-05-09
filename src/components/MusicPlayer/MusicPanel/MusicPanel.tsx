import React, { useEffect, useState } from 'react'
import { Shuffle, Link, Heart, Repeat, Repeat1 } from 'lucide-react'
import styles from '../MusicPlayer.module.css'
import { shuffleArray } from '../../../Utls/ShuffleArray'

interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  favorited: boolean;
  coverImage: string;
  // other properties you may need
}
interface MusicPanelProps {
  currentTrack: Track | null; // Allow currentTrack to be either Track or null
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>; // Update the type of setCurrentTrack as well
}


const MusicPanel: React.FC<MusicPanelProps> = ({ currentTrack, setCurrentTrack }) => {
  const [activeStates, setActiveStates] = useState<{ [key: string]: boolean }>({});
  const [loopState, setLoopState] = useState(0);

  const icons = [
    { Icon: Shuffle, key: 'Shuffle' },
    { Icon: Link, key: 'Link' },
    { Icon: Heart, key: 'Heart' },
    { Icon: Repeat, key: 'Repeat' },
  ];

  // Helpers
  const toggleActive = (key: string, value?: boolean) => {
    setActiveStates(prev => ({ ...prev, [key]: value ?? !prev[key] }));
  };

  const getRepeatIcon = () => (loopState === 2 ? Repeat1 : Repeat);

  // Actions
  const handleShuffle = () => { /* same as before */ };
  const handleLink = () => { /* same as before */ };
  
  const handleHeart = () => {
    const raw = localStorage.getItem('MusicLibrary');
    if (!raw) return;

    const lib = JSON.parse(raw);
    const index = lib.currentPlayingIndex;
    const track = lib.currentPlaying_library?.[index];
    if (!track) return;

    const newFav = !track.favorited;

    lib.currentPlaying_library[index].favorited = newFav;
    lib.currentPlayingTrack = { ...track, favorited: newFav };

    localStorage.setItem('MusicLibrary', JSON.stringify(lib));
    toggleActive('Heart', newFav);

    // Broadcast update to other tabs/components
    window.dispatchEvent(new CustomEvent('music-library-update'));
  };

  const handleRepeat = () => { /* same as before */ };

  const getClickHandler = (key: string) => {
    switch (key) {
      case 'Shuffle': return handleShuffle;
      case 'Link': return handleLink;
      case 'Heart': return handleHeart;
      case 'Repeat': return handleRepeat;
      default: return undefined;
    }
  };

  // Sync UI with localStorage (on mount)
  useEffect(() => {
    const raw = localStorage.getItem('MusicLibrary');
    if (!raw) return;

    const lib = JSON.parse(raw);
    const index = lib.currentPlayingIndex;
    const track = lib.currentPlaying_library?.[index];

    setLoopState(lib.loopState || 0);
    setActiveStates({
      Heart: !!track?.favorited,
      Repeat: lib.loopState > 0,
      Shuffle: false,
      Link: false,
    });
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const raw = localStorage.getItem('MusicLibrary');
      if (!raw) return;

      const lib = JSON.parse(raw);
      const track = lib.currentPlayingTrack;

      if (track) {
        toggleActive('Heart', !!track?.favorited);
      }
    };

    window.addEventListener('storage', handleStorage); // cross-tab updates
    window.addEventListener('music-library-update', handleStorage); // same-tab updates

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('music-library-update', handleStorage);
    };
  }, []);

  // Sync with currentTrack prop
  useEffect(() => {
    if (currentTrack) {
      const newFavState = currentTrack.favorited;
      toggleActive('Heart', newFavState);
    }
  }, [currentTrack]);

  return (
    <div className={styles.MusicPanel}>
      {icons.map(({ Icon, key }) => {
        const CurrentIcon = key === 'Repeat' ? getRepeatIcon() : Icon;
        return (
          <button
            key={key}
            className={`${styles.ControlIcon} ${activeStates[key] ? styles.active : ''}`}
            aria-label={key}
            onClick={getClickHandler(key)}
          >
            <CurrentIcon size="1rem" />
          </button>
        );
      })}
    </div>
  );
};


export default MusicPanel
