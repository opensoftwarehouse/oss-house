---
name: OSS House
description: Signal. A near-black page, one signal yellow, and a mark made of particles.
colors:
  ground-dark: "oklch(0.135 0.003 250)"
  ink-dark: "oklch(0.96 0.004 100)"
  muted-ink-dark: "oklch(0.68 0.006 100)"
  ring-dark: "oklch(0.5 0.006 100)"
  spark-dark: "oklch(0.74 0.17 52)"
  ground-light: "oklch(0.973 0.003 106)"
  ink-light: "oklch(0.18 0 0)"
  muted-ink-light: "oklch(0.5 0.006 100)"
  ring-light: "oklch(0.62 0.006 100)"
  spark-light: "oklch(0.64 0.19 45)"
  logo-amber-light: "oklch(0.66 0.17 65)"
  signal: "oklch(0.88 0.18 94)"
  signal-ink: "oklch(0.18 0.02 90)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  note:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "0.12em"
  num:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontFeature: "tnum"
rounded:
  none: "0"
  base: "0.125rem"
spacing:
  hairline: "1px"
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  section: "80px"
  section-lg: "112px"
  container: "1240px"
components:
  button-brand:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "48px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "48px"
  header:
    backgroundColor: "{colors.ground-dark}"
    textColor: "{colors.ink-dark}"
    height: "64px"
  segmented-pressed:
    backgroundColor: "{colors.ink-dark}"
    textColor: "{colors.ground-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
---

# Design System: OSS House

## Overview

**Creative North Star: "Signal"**

Motion's night for a software house. The page is a near-black ground (an off-white one in light), set in ink, with exactly one colour that fills anything: a signal yellow. The mark itself is the spectacle: the lowercase "oss" logo, drawn as a field of particles with depth, flies in, settles into its letters, tilts toward the cursor and parts around it inside a sparse shell of dust. Everything around it is quiet, flat and ruled.

Density is editorial rather than dashboard: wide sections separated by hairlines, a 12-column grid that splits titles from leads, and mono uppercase labels doing the wayfinding. Depth exists in exactly one place, the particle mark. Elsewhere the system is flat, square and hairline-drawn, and its controls feel like instrument panels: tracked mono, square edges, a yellow block for the one action that matters.

The system is seeded, not painted: each theme declares six seeds (ground, ink, muted ink, focus ring, signal with its ink, spark) and every surface, hairline and fill is mixed from ground and ink. A region that re-declares the seeds under a scheme attribute re-derives itself, which is how light and dark panels sit side by side on one page.

**Key Characteristics:**
- One fill colour (signal yellow); orange appears only inside the particle mark's gradient.
- Geist set tight for display; Geist Mono, uppercase and tracked, for every label, value and control.
- Square everywhere: buttons, panels, swatches, the scrubber thumb.
- Hairline-ruled sections and 1px-gap panel grids instead of cards and shadows.
- A logo that animates in, compacts to the snake on scroll, and is simply finished under reduced motion.

## Colors

A near-neutral ground and ink with a hairline of hue, and one saturated yellow that carries all the signal. Values are OKLCH and canonical as written.

### Primary
- **Signal Yellow** (`signal`): the only fill colour. The primary button block, text selection, the input caret, the square bullet before notes, the timeline playhead, the live track bar, the scrubber thumb, and the "on yellow" logo tile. Identical in both themes.
- **Signal Ink** (`signal-ink`): text and marks placed on yellow. A warm near-black, never the page ink.

### Secondary
- **Spark** (`spark-dark`, `spark-light`): orange, used only as the far stop of the particle mark's ink → yellow → orange gradient across the letters. Light mode deepens it so it holds on off-white.
- **Logo Amber** (`logo-amber-light`): light mode's stand-in for yellow inside the logo (the intro's ring and s strokes, the tongue, construction accents), because yellow strokes vanish on off-white. In dark mode the logo accent is Signal Yellow itself.

### Neutral
- **Night Ground** (`ground-dark`) / **Paper Ground** (`ground-light`): the page. A cold near-black; a barely warm off-white.
- **Ink** (`ink-dark`, `ink-light`): body text, the logo, the inverted pressed state of segmented controls.
- **Muted Ink** (`muted-ink-dark`, `muted-ink-light`): leads, notes, captions, inactive labels. Holds at least 4.5:1 on its ground.
- **Focus Ring** (`ring-dark`, `ring-light`): the 2px focus outline, offset 2px.
- **Derived surfaces** (not seeds, never hard-coded): card is 4% ink mixed into ground; hover and muted fills are 5% ink over transparent; hairline borders are 13% ink; input strokes 16%; the scrollbar thumb 22%; dotted leaders 30%; the line-button hover edge 40%. All are `color-mix(in oklab, ink N%, transparent)`.

### Named Rules
**The One Signal Rule.** Signal Yellow is the only colour that fills a shape. Orange lives only inside the particle mark; nothing else on a surface is hued.

**The Seeded Surface Rule.** Declare only the six seeds per theme. Every surface and hairline is a mix of ink into ground, so any `[data-scheme]` scope re-derives its own world.

**The Light Edge Rule.** On a light ground the yellow block reads as a button only with an edge: a 1px inset ring of 16% ink. Dark mode needs none.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace)

**Character:** One family in two voices. Geist SemiBold set very tight speaks; Geist Mono, small, uppercase and widely tracked, labels and measures. The contrast in spacing (−4.5% against +14%) is the whole personality.

### Hierarchy
- **Display** (600, 3rem → 3.75rem at sm, line-height 1.08, −0.04em, balanced wrap): the page title over the hero; specimen headlines reach the same size.
- **Headline** (600, 2.25rem → 3rem at md, same tracking): section titles, in the left five columns of the section header.
- **Title** (600, 1.5rem, same tracking): sub-section titles and panel headings (Construction, Versions, Light, Dark).
- **Body** (400, 1rem; specimens at 1.125rem with relaxed leading): leads and paragraphs in Muted Ink, capped at 46ch beside a hero and 60ch in section leads. Small notes sit at 13px.
- **Label** (Geist Mono 500, 0.75rem / 1rem, 0.12em, uppercase): navigation, figure captions, button text, track names, face specs.
- **Numeric** (Geist Mono, tabular figures): hex values, contrast ratios, timecodes, row indices, version strings.

### Named Rules
**The Two Voices Rule.** Prose is Geist; anything that labels, counts or acts is Geist Mono uppercase. Never set a paragraph in mono or a button in sans.

**The Tight Display Rule.** Display sizes always carry −0.04em tracking (the floor) and 1.08 leading; no loose or light display setting.

## Layout

A centred container (max 1240px) with 16px, 24px and 32px gutters at base, sm and lg. Sections are full-bleed bands ruled by a top hairline, padded 80px vertically (112px from md), with a header grid of 12 columns: the title spans five, the lead starts at column seven and spans six. Content below follows the same 12-column split (3 / 9 for specimens, 6 / 6 or 7 / 5 for hero and sample blocks).

The hero is a full-viewport stage: the particle mark fills the space above a bottom band where the title and paragraph sit bottom-left and the note with the two actions sits bottom-right, aligned to the baseline. On small screens the stage becomes a 58vw band and the bottom band stacks.

The fixed header is 64px: logo left in a fixed-width slot, mono section links centred (hidden below 700px), language and theme controls right. At the top it is transparent; once scrolled it takes the ground and a bottom hairline (300ms) and the logo compacts to the snake. Anchored sections offset by the header height.

Breakpoints are Tailwind's (sm 640px, md 768px, lg 1024px), plus 700px for the header nav and 767px, below which construction labels drop.

## Elevation & Depth

Flat. There are no drop shadows anywhere in the system; depth is conveyed by tone (a 4% card mix), by 1px hairlines, and, once, by the particle mark's simulated 3D field (three alpha levels for far, mid and near particles, a gentle idle sway and cursor tilt).

### Shadow Vocabulary
- **Hairline edge** (`box-shadow: inset 0 0 0 1px <13% ink>`): the line button and swatch edges (swatches use 14%).
- **Hover edge** (`box-shadow: inset 0 0 0 1px <40% ink>`): the line button on hover.
- **Light-mode yellow edge** (`box-shadow: inset 0 0 0 1px <16% ink>`): the yellow block on light grounds.
- **Ground halo** (`box-shadow: 0 0 0 3px <ground>`): separates the scrubber thumb from its 1px track.

### Named Rules
**The Hairline-Only Rule.** Edges are 1px insets or 1px borders mixed from ink. Depth belongs to the particle mark alone.

## Shapes

Square. Buttons, panels, swatches, bullets, track bars and the scrubber thumb have no radius; the base radius token (0.125rem) exists only to scale the inherited component kit and is not part of the Signal silhouette. Panels are grouped into grids with a 1px gap over the border colour, so every tile is separated by an exact hairline without double borders. The only curves in the world belong to the mark: its single round 32-unit stroke, round caps, the snake's coil and head.

## Components

### Buttons
Instrument-panel controls: square, tracked mono, 48px tall.
- **Shape:** square corners (0), 48px tall, 22px inline padding, 14px gap to an icon at 14px.
- **Primary (yellow block):** Signal Yellow with Signal Ink, a trailing chevron. Hover mixes 14% white into the yellow. Exactly one per action group.
- **Line:** transparent with a 1px inset hairline; hover (on hover-capable pointers only) strengthens the edge to 40% ink. Carries a leading icon when it replays or restarts.
- **Press:** every button scales to 0.96 (150ms, cubic-bezier(0.23, 1, 0.32, 1)); colour and edge transitions are 150ms ease.
- **Compact (40px):** the sample landing's header CTA uses the line button at 40px.

### Segmented control
A 1px-bordered strip with 4px inner padding holding mono label buttons (8px by 12px). Unpressed: Muted Ink, hover to Ink. Pressed: inverted, Ink fill with Ground text. The timeline's speed buttons use a softer pressed state (8% ink fill).

### Panel grid
Figures and tiles laid in a grid with a 1px gap over the hairline colour, each cell on the ground, padded 24px (40px from sm), captioned with a mono label in Muted Ink. Tiles are at least 224px tall with the caption pinned to the bottom at 70% opacity. A tile may take the yellow fill, in which case the logo and its accent turn Signal Ink.

### Index rows
Numbered rows: a two-digit tabular index in Muted Ink, the name in Geist Medium, a dotted leader (1px dotted, 30% ink) filling the space, and a muted note with an up-right arrow at the end. 14px vertical padding.

### Navigation
Mono label links (16px gaps, 28px from lg) that fade to Muted Ink on hover. The language control is two square mono label codes whose accessible name is the code plus the language's full name, and whose pressed code takes an 8% ink fill; the theme control is a 36px icon button with a 6% ink hover fill. The theme switch grows the new theme from the pressed control as a circle (700ms, cubic-bezier(0.4, 0, 0.2, 1), blur 8px to 0); a language switch cross-fades the page.

### Logo (signature)
The lowercase "oss" in one round stroke, the o a coiled snake with a tapered tail, a head with a cut-out eye and a forked tongue. Resting state is the finished mark. The intro: a yellow dot grows into the ring, the ring opens, the head grows out and the eye opens, each s is written in yellow and settles into ink, the tongue flicks once (about 2.8s in total; expo-out cubic-bezier(0.16, 1, 0.3, 1) for growth, cubic-bezier(0.65, 0, 0.35, 1) for writing). Compact (header on scroll): the s's slide left into the coil and vanish, then the snake turns 384°; the width collapses to a square over 560ms. Under reduced motion every track and transition resolves instantly.

### Particle mark (signature)
The logo as a canvas field of 1,800 to 9,500 particles sampled from the mark's own geometry, coloured ink across the o, yellow (amber in light) through the first s, spark on the second, at three alphas for depth. Particles fly in and spring to their targets, the mark sways and tilts toward the cursor and parts around it, inside a dust shell. The snake's head samples at the body's density, held nearly flat so its outline stays crisp. A non-interactive variant (no dust, sparser) is used inside sample layouts. Reduced motion places every particle at rest.

### Timing sheet
One bar per logo track on a 1px rule: bars at 22% ink, 72% once done, Signal Yellow while live; a 1px yellow playhead; a 1px-track range scrubber with a square yellow thumb; tabular timecodes.

## Do's and Don'ts

### Do:
- **Do** derive every surface and hairline from ink mixed into ground; declare only the six seeds per theme.
- **Do** keep Signal Yellow as the single fill colour, with Signal Ink on it, and add the 16% ink inset edge to the yellow block on light grounds.
- **Do** set every label, value, nav link and button text in Geist Mono 500 at 0.75rem, uppercase, 0.12em.
- **Do** set display type in Geist 600 at −0.04em and 1.08 leading.
- **Do** separate sections with a top hairline and group panels with a 1px gap over the border colour.
- **Do** let the logo rest finished under reduced motion and compact to the snake in a scrolled header.
- **Do** label demonstration content as sample; real projects, clients and services are not decided yet.

### Don't:
- **Don't** introduce a second fill colour, or use orange outside the particle mark's gradient.
- **Don't** round buttons, panels, swatches or bullets.
- **Don't** use blurred or offset drop shadows; edges are 1px insets.
- **Don't** set paragraphs in mono or buttons in sans.
- **Don't** put a mono label above a section title as a kicker; section headers are the title and its lead.
- **Don't** use yellow strokes inside the logo on a light ground; use Logo Amber.
