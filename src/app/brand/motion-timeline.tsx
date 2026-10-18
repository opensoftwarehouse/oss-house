"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { duration, Logo, timeline, tracks } from "@/components/logo";
import type { BrandLabels } from "./brand-book";

const speeds = [1, 0.5, 0.25] as const;

// The logo's intro on a timing sheet: one bar per track, a playhead, and a
// scrubber. The logo is parked at the playhead (Logo's `seek`), so what the
// sheet shows is exactly what the CSS plays.
export function MotionTimeline({ labels }: { labels: BrandLabels["motion"] }) {
  const total = duration + 240;
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof speeds)[number]>(1);
  const root = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // Plays itself the first time it scrolls into view.
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        setTime(0);
        setPlaying(true);
      },
      { threshold: 0.5 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) * speed;
      last = now;
      setTime((t) => {
        const next = t + dt;
        if (next >= total) {
          setPlaying(false);
          return total;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, total]);

  const toggle = () => {
    if (playing) return setPlaying(false);
    if (time >= total) setTime(0);
    setPlaying(true);
  };
  const restart = () => {
    setTime(0);
    setPlaying(true);
  };

  const pct = (ms: number) => `${(ms / total) * 100}%`;
  const ticks = Array.from(
    { length: Math.floor(total / 500) + 1 },
    (_, i) => i * 500,
  );

  return (
    <div ref={root} className="grid gap-px overflow-hidden border bg-border">
      <div className="relative grid min-h-[min(46vw,26rem)] place-items-center bg-background px-6 py-12">
        <Logo
          seek={time}
          style={{ "--h": "clamp(5rem, 18vw, 12rem)" } as CSSProperties}
        />
        <p className="num absolute end-5 top-4 text-muted-foreground text-xs">
          {(time / 1000).toFixed(2)} / {(total / 1000).toFixed(2)}s
        </p>
      </div>

      <div className="bg-background px-4 pt-4 pb-5 sm:px-6">
        <div className="flex gap-4">
          <div className="w-[6.5rem] shrink-0 pt-6 sm:w-32">
            {tracks.map((name) => {
              const [delay, dur] = timeline[name];
              return (
                <p
                  key={name}
                  className="label flex h-9 items-center truncate text-muted-foreground data-live:text-foreground"
                  data-live={
                    (time >= delay && time <= delay + dur) || undefined
                  }
                >
                  {labels.tracks[name]}
                </p>
              );
            })}
          </div>
          <div className="relative flex-1">
            <div className="relative h-6">
              {ticks.map((ms) => (
                <span
                  key={ms}
                  className={`num absolute top-0 -translate-x-1/2 text-muted-foreground text-xs first:translate-x-0 ${ms % 1000 ? "max-sm:hidden" : ""}`}
                  style={{ left: pct(ms) }}
                >
                  {(ms / 1000).toFixed(1)}
                </span>
              ))}
            </div>
            {tracks.map((name) => {
              const [delay, dur] = timeline[name];
              return (
                <div key={name} className="relative h-9">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                  <div
                    className="track-bar absolute top-1/2 h-2 -translate-y-1/2"
                    data-live={
                      (time >= delay && time <= delay + dur) || undefined
                    }
                    data-done={time > delay + dur || undefined}
                    style={{ left: pct(delay), width: pct(dur) }}
                  />
                </div>
              );
            })}
            <div
              aria-hidden
              className="playhead absolute top-5 bottom-0 w-px -translate-x-px bg-brand"
              style={{ left: pct(time) }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="btn btn-line h-9 gap-2 px-3"
          >
            {playing ? (
              <Pause className="size-4" strokeWidth={1.5} aria-hidden />
            ) : (
              <Play className="size-4" strokeWidth={1.5} aria-hidden />
            )}
            <span>{playing ? labels.pause : labels.play}</span>
          </button>
          <button
            type="button"
            onClick={restart}
            aria-label={labels.restart}
            className="btn btn-line size-9 p-0"
          >
            <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
          <fieldset className="flex items-center gap-1">
            <legend className="sr-only">{labels.speed}</legend>
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={speed === s}
                onClick={() => setSpeed(s)}
                className="num h-9 px-2.5 text-muted-foreground text-xs transition-colors hover:text-foreground aria-pressed:bg-foreground/8 aria-pressed:text-foreground"
              >
                {s}×
              </button>
            ))}
          </fieldset>
          <label className="ms-auto flex min-w-48 flex-1 items-center gap-3 sm:max-w-sm">
            <span className="label text-muted-foreground">{labels.time}</span>
            <input
              type="range"
              min={0}
              max={total}
              step={10}
              value={Math.round(time)}
              onChange={(e) => {
                setPlaying(false);
                setTime(Number(e.target.value));
              }}
              className="scrubber flex-1"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
