"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeOff } from "lucide-react";

/**
 * Background music toggle. Starts muted/paused — the song only plays
 * once the visitor clicks the button. (Browsers block audio-with-sound
 * autoplay anyway, so starting paused and letting the click be what
 * kicks it off is both simpler and more reliable than trying to
 * autoplay and falling back.)
 */
export default function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggleSound() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0.6;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }

  return (
    <>
      {/* Put your song file at /public/music.mp3 (or change the src below) */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isPlaying ? "Matikan musik" : "Nyalakan musik"}
        className="fixed top-5 right-16 z-50 h-10 w-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] backdrop-blur shadow-sm transition-transform hover:scale-105 active:scale-95"
      >
        {isPlaying ? (
          <Volume2 size={25} color="var(--icon-on)" />
        ) : (
          <VolumeOff size={25} color="var(--icon-off)" />
        )}
      </button>
    </>
  );
}