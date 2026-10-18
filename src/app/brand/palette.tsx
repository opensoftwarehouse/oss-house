"use client";

import { useEffect, useRef, useState } from "react";
import type { BrandLabels } from "./brand-book";

type Role = keyof BrandLabels["colour"]["roles"];

const tokens = [
  "background",
  "foreground",
  "muted-foreground",
  "brand",
  "brand-foreground",
  "spark",
  "ring",
];
// --muted-foreground is labelled by roles.mutedForeground
const roleOf = (token: string) =>
  token.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) as Role;

// Any CSS colour, resolved by a 1px canvas to sRGB: the stylesheet may hand
// the tokens back as oklch() or lab() depending on how it was compiled.
let probe: CanvasRenderingContext2D | null = null;
function resolve(value: string) {
  probe ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  if (!probe) return null;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#000";
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const hex =
    `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  return {
    hex,
    luminance: 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b),
  };
}
const ratio = (a: number, b: number) =>
  (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

type Swatch = {
  role: Role;
  token: string;
  value: string;
  ratio: string;
  against: "ground" | "brand";
};

function read(panel: HTMLElement): Swatch[] {
  const style = getComputedStyle(panel);
  const get = (token: string) => style.getPropertyValue(token).trim();
  const ground = resolve(get("--background"))?.luminance ?? null;
  const brand = resolve(get("--brand"))?.luminance ?? null;
  return tokens.flatMap((name) => {
    const role = roleOf(name);
    const token = `--${name}`;
    const value = get(token);
    if (!value) return [];
    const colour = resolve(value);
    const own = colour?.luminance ?? null;
    const against = role === "brandForeground" ? "brand" : "ground";
    const base = against === "brand" ? brand : ground;
    const r =
      own !== null && base !== null && role !== "background"
        ? ratio(own, base)
        : null;
    return [
      {
        role,
        token,
        value: colour?.hex ?? value,
        ratio: r ? `${r.toFixed(1)}:1` : "",
        against,
      },
    ];
  });
}

export function Palette({ labels }: { labels: BrandLabels["colour"] }) {
  const light = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const [swatches, setSwatches] = useState<{ light: Swatch[]; dark: Swatch[] }>(
    {
      light: [],
      dark: [],
    },
  );

  useEffect(() => {
    if (!light.current || !dark.current) return;
    setSwatches({ light: read(light.current), dark: read(dark.current) });
  }, []);

  return (
    <div className="grid gap-px overflow-hidden border bg-border md:grid-cols-2">
      {(["light", "dark"] as const).map((scheme) => (
        <div
          key={scheme}
          ref={scheme === "light" ? light : dark}
          data-scheme={scheme}
          className="p-5 sm:p-8"
        >
          <p className="display text-2xl">{labels[scheme]}</p>
          <ul className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {swatches[scheme].map((s) => (
              <li key={s.token} className="flex items-center gap-4">
                <span
                  className="size-14 shrink-0 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_14%,transparent)]"
                  style={{ background: `var(${s.token})` }}
                />
                <span className="min-w-0">
                  <span className="block font-medium text-sm">
                    {labels.roles[s.role]}
                  </span>
                  <span className="num block truncate text-muted-foreground text-xs">
                    {s.value}
                  </span>
                  {s.ratio && (
                    <span className="num block text-muted-foreground text-xs">
                      {s.ratio}
                      {s.against === "brand" ? ` ${labels.onBrand}` : ""}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
