import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.28;
    audio.loop = true;

    const tryAutoplay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        console.log('Autoplay bloqueado.');
      }
    };
    tryAutoplay();

    const handleFirstClick = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {}
      document.removeEventListener('click', handleFirstClick);
    };
    document.addEventListener('click', handleFirstClick);

    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      await audio.play();
      setPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/theme.mp3" preload="auto" />
      <button
        className={'music-toggle ' + (playing ? 'playing' : '')}
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
      >
        <span className="music-bars"><span /><span /><span /><span /></span>
      </button>
    </>
  );
}
