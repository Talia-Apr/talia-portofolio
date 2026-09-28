"use client";

import { Volume2, VolumeX } from "lucide-react";
import { playToggle, setSfxEnabled, useSfxEnabled } from "../lib/sfx";

/**
 * Mute / unmute button for the sound effects (hover + click sounds).
 * Styled like ThemeToggle and placed just to its left. If your layout
 * already positions this button somewhere else, remove the `fixed ...`
 * classes below.
 */
export default function SoundToggle() {
  const enabled = useSfxEnabled();

  function handleClick() {
    if (enabled) {
      playToggle(false); // play the "off" blip first, then mute
      setSfxEnabled(false);
    } else {
      setSfxEnabled(true);
      playToggle(true); // then the "on" blip
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={enabled}
      aria-label={enabled ? "Matikan efek suara" : "Nyalakan efek suara"}
      className="fixed top-5 right-[4.5rem] z-50 h-10 w-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] backdrop-blur shadow-sm text-[#b23763] dark:text-white transition-transform hover:scale-105 active:scale-95"
    >
      {enabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
    </button>
  );
}