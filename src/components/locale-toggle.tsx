"use client";

import { addTransitionType, startTransition, useState } from "react";
import type t from "@/components/t";
import type { Locale } from "@/i18n/generated";
import { changeLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

type Labels = { [K in keyof typeof t.language]: string };

const locales = ["en", "pt"] as const satisfies readonly Locale[];

// The cookie is set by a Server Action, which sends the page back in the new
// language in the same round trip; the transition type cross-fades it.
export function LocaleToggle({
  locale,
  labels,
  className,
}: {
  locale: Locale;
  labels: Labels;
  className?: string;
}) {
  const [shown, setShown] = useState(locale);

  const speak = (next: Locale) => {
    if (next === shown) return;
    startTransition(async () => {
      addTransitionType("locale");
      setShown(next);
      await changeLocale(next);
    });
  };

  return (
    <fieldset className={cn("inline-flex h-9 items-center p-0.5", className)}>
      <legend className="sr-only">{labels.label}</legend>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={shown === code}
          onClick={() => speak(code)}
          className="label h-8 px-2 text-muted-foreground transition-[color,background-color] duration-150 hover:text-foreground aria-pressed:bg-foreground/8 aria-pressed:text-foreground"
        >
          {code}
          <span className="sr-only"> {labels[code]}</span>
        </button>
      ))}
    </fieldset>
  );
}
