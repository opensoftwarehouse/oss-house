import type { CSSProperties } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

// The mark, refined from public/logo/oss-house.svg: the "o" is a snake coiled
// clockwise from its tail (upper right) round to its head (upper left), the
// two "s" letters share its 32-unit round stroke. Refinements: the tail tapers
// so the coil reads as a body, the head is a touch longer with a larger eye so
// it survives header sizes, and a forked tongue waits behind the snout.

const C = { x: 110, y: 136 };
const R = 66;
const HALF = 16; // half the stroke
const TAIL = -54; // degrees, clockwise from 3 o'clock
const HEAD = 246;
const TAPER = 48; // degrees of the body the tail narrows over
const TAIL_HALF = 6;

const rad = (deg: number) => (deg * Math.PI) / 180;
const at = (deg: number, d: number) =>
  `${(C.x + d * Math.cos(rad(deg))).toFixed(2)} ${(C.y + d * Math.sin(rad(deg))).toFixed(2)}`;
const halfAt = (deg: number) => {
  const t = Math.min(1, (deg - TAIL) / TAPER);
  return TAIL_HALF + (HALF - TAIL_HALF) * t * t * (3 - 2 * t);
};

function body() {
  const steps = 24;
  const taper = Array.from(
    { length: steps + 1 },
    (_, i) => TAIL + (TAPER * i) / steps,
  );
  const outer = taper.map((a) => `L${at(a, R + halfAt(a))}`).join("");
  const inner = [...taper]
    .reverse()
    .map((a) => `L${at(a, R - halfAt(a))}`)
    .join("");
  const end = TAIL + TAPER;
  return [
    `M${at(TAIL, R + TAIL_HALF)}`,
    outer,
    `A${R + HALF} ${R + HALF} 0 1 1 ${at(HEAD, R + HALF)}`,
    `L${at(HEAD, R - HALF)}`,
    `A${R - HALF} ${R - HALF} 0 1 0 ${at(end, R - HALF)}`,
    inner,
    `A${TAIL_HALF} ${TAIL_HALF} 0 0 1 ${at(TAIL, R + TAIL_HALF)}Z`,
  ].join("");
}

export const BODY = body();
export const NECK = at(HEAD, R);
export const S =
  "M318 94C308.8 74.27 296.32 70 276 70C252.22 70 230 79.22 230 103C230 125.65 255.01 124.84 276 136C296.99 147.16 322 146.35 322 169C322 192.78 299.78 202 276 202C255.68 202 243.2 197.73 234 178";
export const HEAD_PATH =
  "M-6 -16C4 -16 9 -21 21 -21C35 -21 45 -9 46 0C45 9 35 21 21 21C9 21 4 16 -6 16Z";

// Delay and duration of each track, in ms; globals.css names the keyframes.
export const timeline = {
  seed: [0, 360],
  ring: [300, 720],
  open: [980, 460],
  head: [1300, 460],
  eye: [1700, 260],
  s1: [1040, 940],
  s2: [1260, 940],
  tongue: [2300, 520],
} satisfies Record<string, [number, number]>;

export type Track = keyof typeof timeline;
export const tracks = Object.keys(timeline) as Track[];

export const duration = Math.max(
  ...Object.values(timeline).map(([delay, length]) => delay + length),
);

export function Logo({
  label = "oss house",
  compact = false,
  animate = true,
  seek,
  className,
  style,
}: {
  label?: string;
  compact?: boolean;
  /** play the intro; off shows the finished mark */
  animate?: boolean;
  /** park every track at this time (ms), for the timeline */
  seek?: number;
  className?: string;
  style?: CSSProperties;
}) {
  // useId can carry characters a url(#…) reference trips on
  const id = useId().replace(/[^\w-]/g, "");
  const track = (name: Track) =>
    ({
      "--delay": `${timeline[name][0]}ms`,
      "--dur": `${timeline[name][1]}ms`,
    }) as CSSProperties;

  return (
    <span
      className={cn("logo", className)}
      data-compact={compact || undefined}
      data-static={animate ? undefined : ""}
      data-seek={seek === undefined ? undefined : ""}
      style={
        {
          ...(seek === undefined ? null : { "--seek": `${seek}ms` }),
          ...style,
        } as CSSProperties
      }
    >
      <svg viewBox="18 40 476 192" role="img" aria-label={label}>
        <defs>
          <mask id={`${id}eye`}>
            <rect x="-20" y="-40" width="120" height="80" fill="white" />
            <circle
              className="eye"
              data-track="eye"
              style={track("eye")}
              cx="26"
              cy="-9"
              r="4.6"
              fill="black"
            />
          </mask>
          <mask
            id={`${id}swallow`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="600"
            height="300"
          >
            <rect
              className="swallow"
              x="194"
              y="-100"
              width="2000"
              height="500"
              fill="white"
            />
          </mask>
        </defs>

        <g className="snake-turn">
          <g className="t-seed" data-track="seed" style={track("seed")}>
            <g className="t-open" data-track="open" style={track("open")}>
              <circle
                className="t-ring"
                data-track="ring"
                style={track("ring")}
                cx={C.x}
                cy={C.y}
                r={R}
                pathLength={1}
                transform={`rotate(${TAIL} ${C.x} ${C.y})`}
                fill="none"
                stroke="currentColor"
                strokeWidth={HALF * 2}
                strokeLinecap="round"
              />
            </g>
          </g>
          <path
            className="o"
            data-track="open"
            style={track("open")}
            d={BODY}
            fill="currentColor"
          />
          <g transform={`translate(${NECK}) rotate(345)`}>
            <g className="t-head" data-track="head" style={track("head")}>
              <path
                className="tongue"
                data-track="tongue"
                style={track("tongue")}
                d="M44 0H60M60 0L68 -6M60 0L68 6"
                fill="none"
                stroke="var(--logo-accent, currentColor)"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d={HEAD_PATH} fill="currentColor" mask={`url(#${id}eye)`} />
            </g>
          </g>
        </g>

        <g mask={`url(#${id}swallow)`}>
          {(["s1", "s2"] as const).map((name, i) => (
            <g key={name} className={`s-slot ${name}`}>
              <g className="t-s" data-track={name} style={track(name)}>
                <path
                  d={S}
                  transform={i ? "translate(146 0)" : undefined}
                  pathLength={1}
                  fill="none"
                  strokeWidth={HALF * 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </span>
  );
}
