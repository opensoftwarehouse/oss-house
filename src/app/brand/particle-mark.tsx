"use client";

import { useEffect, useRef } from "react";
import { BODY, HEAD_PATH, NECK, S } from "@/components/logo";
import { cn } from "@/lib/utils";

// The Signal mark: the logo as a field of particles with depth. They fly in,
// settle into the letters, and the whole mark tilts toward the cursor and
// parts around it, inside a sparse shell of dust, like Motion's sphere. The
// targets are sampled from the SVG logo's own geometry; the head samples at
// the body's density, with its eye cut out.

const VIEW = { x: 18, y: 40, w: 476, h: 192 };
const STOPS = 12;

// Points in mark space (0..1 on each axis). The head is sampled apart: same
// density as the body, but almost half its points sit on its outline and the
// rim of its eye, so the silhouette reads without being brighter.
function sample(count: number) {
  const scale = 2;
  const W = VIEW.w * scale;
  const H = VIEW.h * scale;
  const [nx, ny] = NECK.split(" ").map(Number);
  const layer = (draw: (ctx: CanvasRenderingContext2D) => void) => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return new Uint8ClampedArray(W * H * 4);
    ctx.scale(scale, scale);
    ctx.translate(-VIEW.x, -VIEW.y);
    draw(ctx);
    return ctx.getImageData(0, 0, W, H).data;
  };

  const body = layer((ctx) => {
    ctx.fill(new Path2D(BODY));
    ctx.lineWidth = 32;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(new Path2D(S));
    ctx.translate(146, 0);
    ctx.stroke(new Path2D(S));
  });
  const head = layer((ctx) => {
    ctx.translate(nx, ny);
    ctx.rotate((345 * Math.PI) / 180);
    ctx.fill(new Path2D(HEAD_PATH));
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(25, -7, 8.5, 0, Math.PI * 2);
    ctx.fill();
  });

  const on = (data: Uint8ClampedArray, x: number, y: number) =>
    x >= 0 && y >= 0 && x < W && y < H && data[(y * W + x) * 4 + 3] > 128;
  const bodyPx: number[] = [];
  const headPx: number[] = [];
  const edgePx: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (on(head, x, y)) {
        headPx.push(y * W + x);
        if (
          !on(head, x + 3, y) ||
          !on(head, x - 3, y) ||
          !on(head, x, y + 3) ||
          !on(head, x, y - 3)
        )
          edgePx.push(y * W + x);
      } else if (on(body, x, y)) bodyPx.push(y * W + x);
    }
  }
  const headCount = Math.round(
    (count * headPx.length) / (headPx.length + bodyPx.length),
  );
  const pick = (list: number[], n: number, isHead: boolean) =>
    Array.from({ length: list.length ? n : 0 }, () => {
      const p = list[Math.floor(Math.random() * list.length)];
      return [(p % W) / W, Math.floor(p / W) / H, isHead] as const;
    });
  return [
    ...pick(bodyPx, count - headCount, false),
    ...pick(edgePx, Math.round(headCount * 0.45), true),
    ...pick(headPx, Math.round(headCount * 0.55), true),
  ];
}

// Any CSS colour (the tokens may come back as lab() or oklch()) as sRGB.
function rgb(value: string): number[] {
  const probe = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  if (!probe) return [128, 128, 128];
  probe.fillStyle = "#888";
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  return [...probe.getImageData(0, 0, 1, 1).data.slice(0, 3)];
}

type Particle = {
  // target and live position, centred, in units of the mark's height
  tx: number;
  ty: number;
  tz: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  // screen-space push from the cursor
  ox: number;
  oy: number;
  at: number;
  hue: number;
  size: number;
  dust: boolean;
};

export function ParticleMark({
  fill,
  interactive = true,
  className,
}: {
  /** share of the stage's height the mark may take; it also never takes
      more than a third of the width or 88% of it, whichever fits */
  fill: number;
  interactive?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const ratio = VIEW.w / VIEW.h;
    let width = 0;
    let tall = 0;
    let h = 0;
    let particles: Particle[] = [];
    let palette: string[][] = [];
    const pointer = { x: -1e4, y: -1e4, nx: 0, ny: 0 };
    const tilt = { yaw: 0, pitch: 0 };
    let raf = 0;
    let visible = true;
    const born = performance.now();

    // ink across the o, signal yellow (amber on light) on the first s, spark
    // on the second;
    // three alphas for depth, far to near
    const colours = () => {
      const style = getComputedStyle(canvas);
      const [ink, brand, spark] = [
        "--foreground",
        "--logo-accent",
        "--spark",
      ].map((token) => rgb(style.getPropertyValue(token).trim()));
      palette = Array.from({ length: STOPS }, (_, i) => {
        const t = i / (STOPS - 1);
        const [a, b, k] =
          t < 0.5 ? [ink, brand, t / 0.5] : [brand, spark, (t - 0.5) / 0.5];
        const c = a.map((v, j) => Math.round(v + (b[j] - v) * k));
        return [0.5, 0.78, 1].map(
          (alpha) => `rgba(${c[0]},${c[1]},${c[2]},${alpha})`,
        );
      });
    };

    const build = () => {
      const area = h * h * ratio;
      const count = Math.round(
        Math.min(9500, Math.max(1800, area / (interactive ? 22 : 36))),
      );
      const far = () => (Math.random() - 0.5) * 3;
      particles = sample(count).map(([u, v, head]) => {
        const tx = (u - 0.5) * ratio;
        const ty = v - 0.5;
        // the head stays nearly flat so depth doesn't blur its outline
        const tz = (Math.random() - 0.5) * (head ? 0.03 : 0.17);
        return {
          tx,
          ty,
          tz,
          x: still ? tx : far() * ratio,
          y: still ? ty : far(),
          z: still ? tz : far(),
          vx: 0,
          vy: 0,
          vz: 0,
          ox: 0,
          oy: 0,
          at: still ? 0 : 150 + Math.random() * 1000 + u * 450,
          hue: Math.min(
            1,
            Math.max(0, (u - 0.2) / 0.7 + (Math.random() - 0.5) * 0.16),
          ),
          size: Math.random() < 0.07 ? 2 : 1.15,
          dust: false,
        };
      });
      const dust = interactive ? Math.round(count * 0.28) : 0;
      for (let i = 0; i < dust; i++) {
        // a loose ellipsoid shell around the mark
        const a = Math.random() * Math.PI * 2;
        const b = Math.acos(2 * Math.random() - 1);
        const r = 0.55 + Math.random() ** 0.5 * 1.1;
        const tx = Math.cos(a) * Math.sin(b) * r * ratio * 0.62;
        const ty = Math.sin(a) * Math.sin(b) * r * 0.75;
        const tz = Math.cos(b) * r * 0.9;
        particles.push({
          tx,
          ty,
          tz,
          x: tx,
          y: ty,
          z: tz,
          vx: 0,
          vy: 0,
          vz: 0,
          ox: 0,
          oy: 0,
          at: 0,
          hue: Math.min(1, Math.max(0, (tx / ratio + 0.3) / 0.7)),
          size: 1,
          dust: true,
        });
      }
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      tall = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(tall * dpr);
      h = Math.min(width * 0.34, tall * fill, (width * 0.88) / ratio);
      if (!particles.length) build();
    };

    const draw = (now: number) => {
      const t = now - born;
      const idleYaw = still ? 0 : Math.sin(t / 3800) * 0.16;
      const idlePitch = still ? 0 : Math.sin(t / 5200) * 0.05;
      tilt.yaw += (idleYaw + pointer.nx * 0.32 - tilt.yaw) * 0.05;
      tilt.pitch += (idlePitch - pointer.ny * 0.14 - tilt.pitch) * 0.05;
      const cosY = Math.cos(tilt.yaw);
      const sinY = Math.sin(tilt.yaw);
      const cosP = Math.cos(tilt.pitch);
      const sinP = Math.sin(tilt.pitch);
      const focal = 3.2;
      const cx = width / 2;
      const cy = tall / 2;

      const bins: number[][] = Array.from({ length: STOPS * 3 }, () => []);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!still) {
          if (p.dust) {
            p.x = p.tx + Math.sin(t / 2400 + i) * 0.01;
            p.y = p.ty + Math.cos(t / 2900 + i) * 0.01;
          } else {
            if (t > p.at) {
              p.vx += (p.tx - p.x) * 0.02;
              p.vy += (p.ty - p.y) * 0.02;
              p.vz += (p.tz - p.z) * 0.02;
            }
            p.vx *= 0.86;
            p.vy *= 0.86;
            p.vz *= 0.86;
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
          }
        }
        // yaw, then pitch, then perspective
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosP - z1 * sinP;
        const z2 = p.y * sinP + z1 * cosP;
        const s = focal / (focal + z2);
        let px = cx + x1 * h * s;
        let py = cy + y1 * h * s;
        if (!still && !p.dust) {
          const dx = px + p.ox - pointer.x;
          const dy = py + p.oy - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 6400) {
            const d = Math.sqrt(d2) || 1;
            const push = (1 - d / 80) * 3;
            p.ox += (dx / d) * push;
            p.oy += (dy / d) * push;
          }
          p.ox *= 0.9;
          p.oy *= 0.9;
          px += p.ox;
          py += p.oy;
        }
        const depth = p.dust ? 0 : z2 > 0.04 ? 0 : z2 < -0.03 ? 2 : 1;
        bins[Math.round(p.hue * (STOPS - 1)) * 3 + depth].push(
          px,
          py,
          p.size * s,
        );
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, tall);
      for (let b = 0; b < bins.length; b++) {
        const list = bins[b];
        if (!list.length) continue;
        ctx.fillStyle = palette[Math.floor(b / 3)][b % 3];
        for (let i = 0; i < list.length; i += 3) {
          ctx.fillRect(list[i], list[i + 1], list[i + 2], list[i + 2]);
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      if (visible) raf = requestAnimationFrame(loop);
    };

    colours();
    layout();
    if (still) draw(performance.now());
    else raf = requestAnimationFrame(loop);

    const resize = new ResizeObserver(() => {
      layout();
      if (still) draw(performance.now());
    });
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) raf = requestAnimationFrame(loop);
    });
    seen.observe(canvas);
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      pointer.nx = clamp((pointer.x - rect.width / 2) / (rect.width / 2));
      pointer.ny = clamp((pointer.y - rect.height / 2) / (rect.height / 2));
    };
    const leave = () => {
      Object.assign(pointer, { x: -1e4, y: -1e4, nx: 0, ny: 0 });
    };
    if (interactive) {
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
    }
    const repaint = new MutationObserver(() => {
      colours();
      if (still) draw(performance.now());
    });
    repaint.observe(document.documentElement, { attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      repaint.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fill, interactive]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("absolute inset-0 size-full", className)}
    />
  );
}
