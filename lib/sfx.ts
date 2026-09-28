"use client";

// Tiny sound-effects engine. Every sound is synthesized with the Web
// Audio API, so there are no audio files to download or host.
//
//   playHover()   soft, high "tick"      -> hovering cards / pills / tabs
//   playClick()   crisp "click"          -> clicking tabs, buttons, links
//   playPop()     round "pop"            -> clicking the mascot logo
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

type NoiseBurst = {
  freq: number; // center of the band that gets through (Hz)
  q?: number; // how narrow that band is (higher = narrower)
  start?: number;
  dur: number;
  gain?: number;
};

// A tiny burst of filtered white noise. Tones can't make a real
// "click" — a click is a sharp transient, which is noise, not a pitch.
function playNoise(bursts: NoiseBurst[]) {
  if (!getSfxEnabled()) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;
  for (const b of bursts) {
    const s = t0 + (b.start ?? 0);
    const len = Math.max(1, Math.floor(c.sampleRate * b.dur));
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = b.freq;
    filter.Q.value = b.q ?? 0.9;
    const g = c.createGain();
    g.gain.setValueAtTime(b.gain ?? 0.15, s); // instant attack = the "snap"
    g.gain.exponentialRampToValueAtTime(0.0001, s + b.dur);
    src.connect(filter).connect(g).connect(c.destination);
    src.start(s);
    src.stop(s + b.dur + 0.01);
  }
}

export function playHover() {
  const now = Date.now();
  if (now - lastHover < 70) return; // don't machine-gun while sweeping the mouse
  lastHover = now;
  play([{ freq: 1300, endFreq: 1700, dur: 0.05, type: "sine", gain: 0.03 }]);
}

export function playClick() {
  // A crisp, short "tik": a ~20ms burst of high-passed noise for the
  // snap, plus a barely-there sine for a little body. No low thump.
  playNoise([{ freq: 3500, q: 0.8, dur: 0.02, gain: 0.12 }]);
  play([{ freq: 1600, endFreq: 900, dur: 0.02, type: "sine", gain: 0.035 }]);
}

// Round, bubbly "pop" for the mascot logo: a sine that drops fast in
// pitch (that falling glide is what reads as a pop), a quicker, higher
// overtone on top for sparkle, and a tiny puff of noise at the very
// start for the "p" of the pop.
export function playPop() {
  playNoise([{ freq: 1800, q: 0.7, dur: 0.012, gain: 0.05 }]);
  play([
    { freq: 720, endFreq: 190, dur: 0.11, type: "sine", gain: 0.12 },
    { freq: 1500, endFreq: 520, dur: 0.05, type: "sine", gain: 0.035 },
  ]);
}

export function playToggle(on: boolean) {
  const [a, b] = on ? [660, 990] : [990, 660];
  play([
    { freq: a, dur: 0.07, type: "square", gain: 0.045 },
    { freq: b, start: 0.07, dur: 0.11, type: "square", gain: 0.045 },
  ]);
}