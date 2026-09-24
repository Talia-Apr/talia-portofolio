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
const LOGO_SRC = "/talogo.png";

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

function TaLogo() {
  return (
    <div
      className="talogo-mark absolute bottom-3 left-3 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16"
      style={{
        backgroundColor: "var(--logo-color)",
        WebkitMaskImage: `url(${LOGO_SRC})`,
        maskImage: `url(${LOGO_SRC})`,
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
  );
}

export default function WaveHill() {
  return (
    <div
      aria-hidden
      className="fixed inset-x-0 bottom-0 h-36 sm:h-48 md:h-56 overflow-hidden pointer-events-none"
    >
      <WaveStrip id="waveGradientBack" className="wave-layer--back" />
      <WaveStrip id="waveGradientFront" className="wave-layer--front" />
      <TaLogo />
    </div>
  );
}