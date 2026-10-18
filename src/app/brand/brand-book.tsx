"use client";

import { ArrowUpRight, ChevronRight, RotateCcw } from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { LocaleToggle } from "@/components/locale-toggle";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Locale, t } from "@/i18n/generated";
import { cn } from "@/lib/utils";
import { MotionTimeline } from "./motion-timeline";
import { Palette } from "./palette";
import { ParticleMark } from "./particle-mark";

export type BrandLabels = typeof t.app.brand;

const container = "mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8";
const sections = ["mark", "motion", "colour", "type", "inUse"] as const;

const h = (value: string) => ({ "--h": value }) as CSSProperties;

export function BrandBook({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    brand: BrandLabels;
    theme: typeof t.components.theme;
    language: typeof t.components.language;
  };
}) {
  const [run, setRun] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const L = labels.brand;

  useEffect(() => {
    const el = top.current;
    if (!el) return;
    const seen = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <div className="relative min-h-dvh">
      <a
        href="#content"
        className="label sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:bg-brand focus:px-4 focus:py-3 focus:text-brand-foreground"
      >
        {L.skip}
      </a>
      <div
        ref={top}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
      />

      <header
        data-scrolled={scrolled || undefined}
        className="fixed inset-x-0 top-0 z-40 border-transparent border-b transition-[background-color,border-color] duration-300 data-scrolled:border-border data-scrolled:bg-background"
      >
        <div
          className={cn(
            container,
            "grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-6",
          )}
        >
          <a href="/" className="flex items-center justify-self-start">
            <Logo compact={scrolled} animate={false} style={h("1.875rem")} />
          </a>
          <nav aria-label={L.title} className="hidden min-[700px]:block">
            <ul className="label flex gap-4 lg:gap-7">
              {sections.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="transition-colors hover:text-muted-foreground"
                  >
                    {L.sections[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-start-3 flex items-center gap-1 justify-self-end">
            <LocaleToggle locale={locale} labels={labels.language} />
            <ThemeToggle labels={labels.theme} />
          </div>
        </div>
      </header>

      <main id="content">
        <section className="relative flex flex-col pt-16 sm:min-h-dvh">
          <div className="relative h-[58vw] sm:h-auto sm:min-h-[22rem] sm:flex-1">
            <ParticleMark key={run} fill={0.74} />
          </div>
          <div
            className={cn(
              container,
              "grid gap-8 pb-14 md:grid-cols-12 md:items-end",
            )}
          >
            <div className="md:col-span-6">
              <h1 className="display text-5xl sm:text-6xl">{L.title}</h1>
              <p className="mt-5 max-w-[46ch] text-pretty text-muted-foreground">
                {L.intro}
              </p>
            </div>
            <div className="flex flex-col gap-4 md:col-span-6 md:items-end">
              <p className="pointer-fine:block hidden text-[13px] text-muted-foreground">
                {L.note}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setRun((n) => n + 1)}
                  className="btn btn-line"
                >
                  <RotateCcw
                    className="size-3.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  {L.replay}
                </button>
                <a href="#mark" className="btn btn-brand">
                  {L.seeMark}
                  <ChevronRight
                    className="size-3.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        <Section id="mark" title={L.sections.mark} lead={L.mark.lead}>
          <div className="grid gap-px border bg-border md:grid-cols-2">
            <figure className="bg-background p-6 sm:p-10">
              <div className="aspect-[476/192] overflow-hidden">
                {/* biome-ignore lint/performance/noImgElement: the untouched original SVG, cropped by its margins to the refined mark's frame */}
                <img
                  src="/logo/oss-house.svg"
                  alt="oss house"
                  className="block w-[107.56%] max-w-none dark:invert"
                  style={{ margin: "-8.4% 0 0 -3.78%" }}
                />
              </div>
              <figcaption className="label mt-6 text-muted-foreground">
                {L.mark.original}
              </figcaption>
            </figure>
            <figure className="bg-background p-6 sm:p-10">
              <Logo animate={false} className="fluid" />
              <figcaption className="label mt-6 text-muted-foreground">
                {L.mark.refined}
              </figcaption>
            </figure>
          </div>
          <ul className="mt-10 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {(["taper", "head", "tongue", "kept"] as const).map((key) => (
              <li key={key} className="flex gap-3 text-pretty">
                <span
                  aria-hidden
                  className="mt-2.5 size-1.5 shrink-0 bg-foreground"
                />
                {L.mark.notes[key]}
              </li>
            ))}
          </ul>

          <h3 className="display mt-20 text-2xl">{L.mark.construction}</h3>
          <figure className="mt-6 border p-6 sm:p-12">
            <div className="relative">
              <Logo animate={false} className="fluid opacity-90" />
              <Construction labels={L.mark.geometry} />
            </div>
          </figure>

          <h3 className="display mt-20 text-2xl">{L.mark.versions}</h3>
          <div className="mt-6 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <Tile caption={L.mark.full}>
              <Logo animate={false} style={h("3rem")} />
            </Tile>
            <Tile caption={L.mark.compact}>
              <Logo animate={false} compact style={h("4.5rem")} />
            </Tile>
            <Tile
              caption={L.mark.onBrand}
              className="bg-brand text-brand-foreground [--logo-accent:var(--brand-foreground)]"
            >
              <Logo animate={false} style={h("3rem")} />
            </Tile>
            <Tile caption={L.mark.sizes}>
              <div className="flex items-end gap-4">
                {["4rem", "2rem", "1.5rem", "1rem"].map((size) => (
                  <Logo key={size} animate={false} compact style={h(size)} />
                ))}
              </div>
            </Tile>
          </div>
        </Section>

        <Section id="motion" title={L.sections.motion} lead={L.motion.lead}>
          <MotionTimeline labels={L.motion} />
          <HeaderDemo
            labels={L.motion}
            sample={{ nav: L.inUse.nav, headline: L.type.headline }}
          />
        </Section>

        <Section id="colour" title={L.sections.colour} lead={L.colour.lead}>
          <Palette labels={L.colour} />
        </Section>

        <Section id="type" title={L.sections.type} lead={L.type.lead}>
          <div className="divide-y border-y">
            <Specimen label={L.type.display} face="Geist · SemiBold · −4%">
              <p className="display text-4xl sm:text-6xl">{L.type.headline}</p>
            </Specimen>
            <Specimen label={L.type.text} face="Geist · Regular">
              <p className="max-w-[60ch] text-pretty text-lg leading-relaxed">
                {L.type.paragraph}
              </p>
            </Specimen>
            <Specimen label={L.type.mono} face="Geist Mono · Medium">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <span className="label">{L.inUse.cta}</span>
                <span className="num text-sm">
                  v1.4.0 · 2026-10-17 · 0123456789
                </span>
              </div>
            </Specimen>
          </div>
        </Section>

        <Section id="inUse" title={L.sections.inUse}>
          <InUse labels={L.inUse} type={L.type} />
        </Section>
      </main>

      <footer className="border-t">
        <div
          className={cn(
            container,
            "flex items-center justify-between gap-4 py-10",
          )}
        >
          <Logo animate={false} compact style={h("1.75rem")} />
          <p className="label text-muted-foreground">{L.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-16 border-t py-20 md:py-28"
    >
      <div className={container}>
        <header className="mb-10 grid gap-4 md:mb-14 md:grid-cols-12">
          <h2
            id={`${id}-title`}
            className="display text-4xl md:col-span-5 md:text-5xl"
          >
            {title}
          </h2>
          {lead && (
            <p className="max-w-[60ch] text-pretty text-muted-foreground md:col-span-6 md:col-start-7 md:pt-2">
              {lead}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

function Tile({
  caption,
  className,
  children,
}: {
  caption: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn(
        "flex min-h-56 flex-col justify-between gap-8 bg-background p-6",
        className,
      )}
    >
      <div className="flex flex-1 items-center">{children}</div>
      <figcaption className="label opacity-70">{caption}</figcaption>
    </figure>
  );
}

function Specimen({
  label,
  face,
  children,
}: {
  label: string;
  face: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 py-10 md:grid-cols-12">
      <div className="md:col-span-3">
        <p className="font-medium text-sm">{label}</p>
        <p className="label mt-1 text-muted-foreground">{face}</p>
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}

// Geometry guides over the refined mark, in the logo's own units.
function Construction({ labels }: { labels: BrandLabels["mark"]["geometry"] }) {
  const cx = 110;
  const cy = 136;
  const polar = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = polar(from, r);
    const [x2, y2] = polar(to, r);
    return `M${x1} ${y1}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const [hx, hy] = polar(246, 104);
  const [tx, ty] = polar(306, 104);
  const [gx, gy] = polar(276, 116);
  return (
    <svg
      viewBox="18 40 476 192"
      aria-hidden
      className="construction absolute inset-0 size-full overflow-visible"
    >
      <g fill="none" strokeWidth="0.6">
        <circle cx={cx} cy={cy} r="66" strokeDasharray="3 3" />
        <circle cx={cx} cy={cy} r="50" />
        <circle cx={cx} cy={cy} r="82" />
        <path d={`M${cx} ${cy}L${hx} ${hy}M${cx} ${cy}L${tx} ${ty}`} />
        <path d={arc(246, 306, 98)} className="accent" strokeWidth="1.2" />
        <path d={arc(-54, -6, 96)} className="accent" strokeWidth="1.2" />
        {[54, 70, 202, 218].map((y) => (
          <path
            key={y}
            d={`M18 ${y}H494`}
            strokeDasharray={y === 70 || y === 202 ? "2 4" : undefined}
          />
        ))}
        <path
          d="M192 136H214M338 136H360"
          className="accent"
          strokeWidth="1.2"
        />
        <path d="M262 54V86" className="accent" strokeWidth="1.2" />
      </g>
      <g className="labels">
        <text x={gx} y={gy} textAnchor="middle">
          {labels.gap}
        </text>
        <text x="168" y="48">
          {labels.taper}
        </text>
        <text x={cx} y={cy + 3} textAnchor="middle">
          {labels.ring}
        </text>
        <text x="203" y="130" textAnchor="middle">
          {labels.spacing}
        </text>
        <text x="349" y="130" textAnchor="middle">
          {labels.spacing}
        </text>
        <text x="268" y="50">
          {labels.stroke}
        </text>
      </g>
    </svg>
  );
}

function HeaderDemo({
  labels,
  sample,
}: {
  labels: BrandLabels["motion"];
  sample: { nav: BrandLabels["inUse"]["nav"]; headline: string };
}) {
  const [compact, setCompact] = useState(false);
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-12">
      <div className="md:col-span-4">
        <h3 className="display text-2xl">{labels.header}</h3>
        <p className="mt-3 text-pretty text-muted-foreground">
          {labels.headerLead}
        </p>
        <fieldset className="mt-6 inline-flex border p-1">
          <legend className="sr-only">{labels.header}</legend>
          {([false, true] as const).map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={compact === value}
              onClick={() => setCompact(value)}
              className="label px-3 py-2 text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-foreground aria-pressed:text-background"
            >
              {value ? labels.scrolled : labels.top}
            </button>
          ))}
        </fieldset>
      </div>
      <div className="md:col-span-8">
        <div className="border bg-background">
          <div className="flex h-20 items-center justify-between border-b px-6">
            <Logo animate={false} compact={compact} style={h("2.5rem")} />
            <ul className="label hidden gap-6 sm:flex" aria-hidden>
              {(["work", "openSource", "contact"] as const).map((key) => (
                <li key={key}>{sample.nav[key]}</li>
              ))}
            </ul>
          </div>
          <p className="display p-6 text-2xl text-muted-foreground" aria-hidden>
            {sample.headline}
          </p>
        </div>
      </div>
    </div>
  );
}

function InUse({
  labels,
  type,
}: {
  labels: BrandLabels["inUse"];
  type: BrandLabels["type"];
}) {
  return (
    <figure>
      <div className="border bg-background">
        <div className="flex h-16 items-center justify-between gap-6 border-b px-5 sm:px-8">
          <Logo animate={false} style={h("1.625rem")} />
          <ul className="label hidden gap-7 md:flex">
            {(["work", "openSource", "services", "contact"] as const).map(
              (key) => (
                <li key={key}>{labels.nav[key]}</li>
              ),
            )}
          </ul>
          <span className="btn btn-line h-10 text-muted-foreground">
            {labels.cta}
          </span>
        </div>
        <div className="relative h-[clamp(14rem,32vw,24rem)]">
          <ParticleMark interactive={false} fill={0.7} />
        </div>
        <div className="grid gap-8 px-5 pb-10 sm:px-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="display text-4xl sm:text-5xl">{type.headline}</p>
            <p className="mt-5 max-w-[46ch] text-pretty text-muted-foreground">
              {type.paragraph}
            </p>
          </div>
          <div className="flex flex-col gap-4 md:col-span-5 md:items-end">
            <p className="text-[13px] text-muted-foreground">{labels.note}</p>
            <div className="flex flex-wrap gap-3">
              <span className="btn btn-line">{labels.code}</span>
              <span className="btn btn-brand">
                {labels.cta}
                <ChevronRight
                  className="size-3.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </div>
        <div className="border-t px-5 py-8 sm:px-8">
          <p className="label mb-2 text-muted-foreground">{labels.projects}</p>
          <ol>
            {(["a", "b", "c"] as const).map((key, i) => (
              <li key={key} className="index-row">
                <span aria-hidden className="num text-muted-foreground text-xs">
                  0{i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">
                    {labels.rows[key].name}
                  </span>
                  <span className="mt-0.5 block text-muted-foreground text-sm sm:hidden">
                    {labels.rows[key].note}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="hidden sm:inline">
                    {labels.rows[key].note}
                  </span>
                  <ArrowUpRight
                    className="size-3.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mt-4 text-muted-foreground text-sm">
        {labels.sample}
      </figcaption>
    </figure>
  );
}
