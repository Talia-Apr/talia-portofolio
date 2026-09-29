"use client";

import { useEffect, useRef, useState } from "react";
import { playPop, playHover } from "../lib/sfx";

// Decorative wave hill anchored to the bottom of the viewport. Two
// strips slide left forever at different speeds/opacities for a bit of
// parallax depth.
//
// Each strip is ONE svg containing two periods of the wave, so there is
// no join between separate elements (that join is what showed up as a
// thin gap on small screens, where the width rounds to fractional
// pixels). The strip is also never narrower than MIN_STRIP_WIDTH, so on
// phones the waves keep the same gentle shape as on desktop instead of
// being squeezed into steep, choppy hills.

const PERIOD = 1440;

// One period, then the same period shifted by PERIOD, in a single path.
const WAVE_PATH =
  `M0,100 C240,180 480,20 720,100 C960,180 1200,20 1440,100 ` +
  `C1680,180 1920,20 2160,100 C2400,180 2640,20 2880,100 ` +
  `L2880,220 L0,220 Z`;

// Each strip = two periods wide. 200% of the viewport on wide screens,
// but never less than this many px on narrow ones.
const MIN_STRIP_WIDTH = "1800px";

// Mascot logo. It sits above the waves and bobs gently up and down in
// place — it does not slide sideways with the wave layers, it just
// "rides" the motion the way something floating on water would.
const LOGO_SRC = "/logo/talogo.png";
// Same logo with happy "^ ^" eyes, shown while the speech bubble is open.
// Must be the same size (600x600) as talogo.png so nothing shifts.
const LOGO_SMILE_SRC = "/logo/talogo-smile.png";
// Eyes-closed version, flashed briefly to make the logo blink.
const LOGO_SLEEP_SRC = "/logo/talogo-sleep.png";
const BLINK_EVERY_MS = 5000; // blink once every 5 seconds
const BLINK_FOR_MS = 300; // how long the eyes stay closed

function WaveStrip({
  id,
  className,
}: {
  id: string;
  className: string;
}) {
  return (
    <div
      className={`wave-layer ${className} absolute bottom-0 left-0 h-full`}
      style={{ width: `max(200%, ${MIN_STRIP_WIDTH})`, willChange: "transform" }}
    >
      <svg
        viewBox={`0 0 ${PERIOD * 2} 220`}
        preserveAspectRatio="none"
        className="block h-full w-full"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--wave-top)" />
            <stop offset="100%" stopColor="var(--wave-bottom)" />
          </linearGradient>
        </defs>
        <path d={WAVE_PATH} fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

// The first click always says boo; after that the logo picks a random
// line from this list (never the same one twice in a row).
// lines freely — keep them short so the bubble stays small.
const LOGO_FIRST_LINE = "Boo!";
const LOGO_LINES = [
  "I'm a nice ghost..",
  "No Bother",
  "Hehe, that tickles!",
  "I'm stand for TA",
  "Have you eaten yet?",
  "Wanna chat? She's free!",
  "Hire her pls..",
  "Just floating",
  "Let's do some fun!",
  "Coffee? ☕ Please?",
  "Click me again!",
  "Btw, this is her porto!",
  "Bug? Not my fault!",
  "You look nice today!",
];
const BUBBLE_MS = 2500; // how long the bubble stays visible

function TaLogo() {
  const [showBubble, setShowBubble] = useState(false);
  const [message, setMessage] = useState(LOGO_FIRST_LINE);
  const [blink, setBlink] = useState(false);
  const clicks = useRef(0);
  const lastLine = useRef(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Preload the alternate faces so swapping has no flicker.
    new window.Image().src = LOGO_SMILE_SRC;
    new window.Image().src = LOGO_SLEEP_SRC;

    // Blink: close the eyes for a moment, every BLINK_EVERY_MS.
    let blinkEnd: ReturnType<typeof setTimeout> | undefined;
    const blinkLoop = setInterval(() => {
      setBlink(true);
      blinkEnd = setTimeout(() => setBlink(false), BLINK_FOR_MS);
    }, BLINK_EVERY_MS);

    return () => {
      clearInterval(blinkLoop);
      if (blinkEnd) clearTimeout(blinkEnd);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Smile while the bubble is open; otherwise blink now and then.
  const faceSrc = showBubble ? LOGO_SMILE_SRC : blink ? LOGO_SLEEP_SRC : LOGO_SRC;

  function handleClick() {
    playPop();

    if (clicks.current === 0) {
      setMessage(LOGO_FIRST_LINE);
    } else {
      let i = Math.floor(Math.random() * LOGO_LINES.length);
      if (i === lastLine.current) i = (i + 1) % LOGO_LINES.length;
      lastLine.current = i;
      setMessage(LOGO_LINES[i]);
    }
    clicks.current += 1;

    setShowBubble(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShowBubble(false), BUBBLE_MS);
  }

  return (
    // Wrapper carries the size, position and the floating animation, so
    // the speech bubble bobs together with the logo.
    <div
      className="talogo-mark absolute pointer-events-auto"
      style={{
        // Sized/placed with inline clamp() so it never depends on which
        // Tailwind classes get generated.
        width: "clamp(64px, 6vw, 110px)",
        height: "clamp(64px, 6vw, 110px)",
        left: "clamp(40px, 5vw, 110px)",
        bottom: "clamp(4px, 1vw, 20px)",
      }}
    >
      {/* Speech bubble */}
      <div
        aria-live="polite"
        className="pointer-events-none absolute whitespace-nowrap rounded-2xl px-3.5 py-1.5 font-display font-bold text-sm sm:text-base shadow-md"
        style={{
          left: "55%",
          bottom: "88%",
          background: "var(--bubble-bg)",
          color: "var(--bubble-text)",
          opacity: showBubble ? 1 : 0,
          transform: showBubble ? "scale(1) translateY(0)" : "scale(0.7) translateY(6px)",
          transformOrigin: "bottom left",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {message}
        {/* Tail pointing down at the logo */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-4 h-2.5 w-2.5 rotate-45"
          style={{ background: "var(--bubble-bg)" }}
        />
      </div>

      <button
        type="button"
        onClick={handleClick}
        onPointerEnter={(e) => {
          // Hover sound for a real mouse only (touch has no hover).
          if (e.pointerType === "mouse") playHover();
        }}
        aria-label="Sapa Talia"
        className="block h-full w-full cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundColor: "var(--logo-color)",
            WebkitMaskImage: `url(${faceSrc})`,
            maskImage: `url(${faceSrc})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            filter: "var(--logo-glow)",
            transition: "filter 0.4s ease, background-color 0.4s ease",
          }}
        />
      </button>
    </div>
  );
}

export default function WaveHill() {
  return (
    <>
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 h-36 sm:h-48 md:h-56 overflow-hidden pointer-events-none"
      >
        <WaveStrip id="waveGradientBack" className="wave-layer--back" />
        <WaveStrip id="waveGradientFront" className="wave-layer--front" />
      </div>

      {/* Logo lives outside the overflow-hidden wave box so the speech
          bubble is never clipped, and is the only clickable part. */}
      <div className="fixed inset-x-0 bottom-0 z-10 h-0 pointer-events-none">
        <TaLogo />
      </div>
    </>
  );
}
