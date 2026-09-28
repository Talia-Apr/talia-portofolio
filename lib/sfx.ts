"use client";

// Tiny sound-effects engine. Every sound is synthesized with the Web
// Audio API, so there are no audio files to download or host.
//
//   playHover()   soft, high "tick"      -> hovering cards / pills / tabs
//   playClick()   round "pop"            -> clicking tabs, buttons, links
//   playToggle()  two-note retro "blip"  -> theme toggle & sound toggle
//                 (rising when turned on, falling when turned off)
//
// The on/off state is remembered in localStorage and shared with the
// SoundToggle button through useSfxEnabled().

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sfx-enabled";

let enabled = true;
let loaded = false;
let ctx: AudioContext | null = null;
let lastHover = 0;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) enabled = saved === "1";
  } catch {
    /* storage blocked — keep default */
  }
}

export function getSfxEnabled(): boolean {
  load();
  return enabled;
}

export function setSfxEnabled(value: boolean) {
  load();
  enabled = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// For React components (SoundToggle) that need to show the current state.
export function useSfxEnabled(): boolean {
  return useSyncExternalStore(subscribe, getSfxEnabled, () => true);
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Tone = {
  freq: number;
  endFreq?: number; // glide to this pitch over the note
  start?: number; // seconds after the sound begins
  dur: number;
  type?: OscillatorType;
  gain?: number;
};

function play(tones: Tone[]) {
  if (!getSfxEnabled()) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;
  for (const t of tones) {
    const s = t0 + (t.start ?? 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = t.type ?? "sine";
    osc.frequency.setValueAtTime(t.freq, s);
    if (t.endFreq) osc.frequency.exponentialRampToValueAtTime(t.endFreq, s + t.dur);
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(t.gain ?? 0.08, s + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, s + t.dur);
    osc.connect(g).connect(c.destination);
    osc.start(s);
    osc.stop(s + t.dur + 0.03);
  }
}

export function playHover() {
  const now = Date.now();
  if (now - lastHover < 70) return; // don't machine-gun while sweeping the mouse
  lastHover = now;
  play([{ freq: 1300, endFreq: 1700, dur: 0.05, type: "sine", gain: 0.03 }]);
}

export function playClick() {
  play([
    { freq: 540, endFreq: 240, dur: 0.1, type: "triangle", gain: 0.13 },
    { freq: 1100, endFreq: 800, dur: 0.05, type: "sine", gain: 0.04 },
  ]);
}

export function playToggle(on: boolean) {
  const [a, b] = on ? [660, 990] : [990, 660];
  play([
    { freq: a, dur: 0.07, type: "square", gain: 0.045 },
    { freq: b, start: 0.07, dur: 0.11, type: "square", gain: 0.045 },
  ]);
}