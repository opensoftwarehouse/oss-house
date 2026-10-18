"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type t from "@/components/t";
import { cn } from "@/lib/utils";

type Labels = typeof t.theme;

// The new theme grows from the button as a blurred circle (globals.css), so
// the swap reads as coming from the control rather than from nowhere.
export function ThemeToggle({
  labels,
  className,
}: {
  labels: { [K in keyof Labels]: string };
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = dark ? "light" : "dark";
    const html = document.documentElement;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !document.startViewTransition) return setTheme(next);

    const box = ref.current?.getBoundingClientRect();
    if (box) {
      html.style.setProperty(
        "--reveal-origin",
        `${box.left + box.width / 2}px ${box.top + box.height / 2}px`,
      );
    }
    html.dataset.reveal = "";
    // next-themes swaps the class in an effect, which a sync render runs
    // before returning, so the transition snapshots the new theme.
    const transition = document.startViewTransition(() =>
      flushSync(() => setTheme(next)),
    );
    transition.finished.finally(() => delete html.dataset.reveal);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={dark ? labels.toLight : labels.toDark}
      className={cn(
        "inline-flex size-9 items-center justify-center text-foreground/80 transition-[color,background-color,scale] duration-150 ease-out hover:bg-foreground/6 hover:text-foreground active:scale-[0.96]",
        className,
      )}
    >
      {mounted ? (
        dark ? (
          <Sun className="size-[18px]" strokeWidth={1.5} aria-hidden />
        ) : (
          <Moon className="size-[18px]" strokeWidth={1.5} aria-hidden />
        )
      ) : (
        <span className="size-[18px]" aria-hidden />
      )}
    </button>
  );
}
