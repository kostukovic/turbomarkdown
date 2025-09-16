# Kompakte, praxisorientierte CSS-Referenz
Mit **kurzen Erklärungen** und **funktionierenden Mini-Beispielen** – alles in `css`-Codeblöcken (inkl. Kommentare). Ich decke die wichtigsten Module/Features ab (Flex, Grid, Variablen, Kaskade/Layers, Media/Container Queries, Selektoren, Pseudo-Klassen/Elemente, Transforms/Transitions/Animationen, Scroll-APIs, View Transitions, Farb-/Typo-Basics, Mask/Filter, Logical Properties, Anchor Positioning u. a.).

---

## Quick-Template (für jede Eigenschaft)

```css
/* TEMPLATE: Was macht die Eigenschaft? Kurzer Satz.
   Syntax: property: value;
   Tipp: Browser-Support / Fallback, wenn nötig. */

.selector {
  /* Beispiel */
  property: value;
}
```

---

## Variablen & Kaskade

**Custom Properties + Fallbacks**

```css
/* Beschreibung: Wiederverwendbare Farb-/Abstands-Variablen, dynamisch zur Laufzeit. */
:root {
  --brand: oklch(0.65 0.16 250);
  --space: 1rem;
}
.button {
  color: white;
  background: var(--brand);
  padding: var(--space, 16px); /* Fallback 16px */
}
.dark { --brand: oklch(0.75 0.12 260); }
```

**Cascade Layers (@layer) + Reihenfolge**

```css
/* Beschreibung: Steuert die Kaskadenreihenfolge logisch (Base→Components→Utilities). */
@layer reset, base, components, utilities;

@layer reset {
  *,*::before,*::after { box-sizing: border-box; }
}

@layer base {
  :root { color-scheme: light dark; }
  body { margin: 0; font: 16px/1.5 system-ui, sans-serif; }
}

@layer components {
  .card { padding: 1rem; border: 1px solid #ddd; border-radius: 12px; }
}

@layer utilities {
  .mt-2 { margin-top: .5rem; }
}
```

**Nesting (CSS Nesting)**

```css
/* Beschreibung: Verschachtelte Selektoren ohne Präprozessor.
   Beachte: & referenziert den Elternselektor. */
.card {
  padding: 1rem;
  & > h3 { margin: 0 0 .5rem; }
  &:hover { outline: 2px solid color-mix(in oklab, currentColor, transparent 60%); }
  & .btn { display: inline-block; }
}
```

---

## Media & Container Queries

**@media (Viewport-basierte Bedingungen)**

```css
/* Beschreibung: Reagiert auf Viewport-Breite/Helligkeit/Pointer usw. */
@media (max-width: 48rem) {
  .grid { grid-template-columns: 1fr; }
}
@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}
```

**Container Queries (@container)**

```css
/* Beschreibung: Komponenten reagieren auf die Breite ihres Containers statt des Viewports. */
.card-wrap { container-type: inline-size; }

@container (min-width: 28rem) {
  .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
}
```

---

## Layout – Flexbox & Grid

**Flexbox (1D-Layout)**

```css
/* Beschreibung: Ein Achsen-Layout (Zeile/Spalte), Ausrichtung & Verteilung. */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
}
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
```

**Grid (2D-Layout)**

```css
/* Beschreibung: Zwei Achsen, explizite Tracks, auto-placement. */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
.sidebar { grid-column: 1 / span 3; }
.main    { grid-column: 4 / -1; }

/* Auto-Layouts */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
}
```

**Subgrid (wenn verfügbar)**

```css
/* Beschreibung: Kind übernimmt Grid-Tracks vom Eltern-Grid. */
.article {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
.article-content {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}
```

---

## Positionierung, Anchor Positioning & Logical Properties

**Positionierung klassisch**

```css
/* Beschreibung: relative/absolute/fixed/sticky; stacking via z-index. */
.box { position: relative; }
.badge {
  position: absolute;
  top: .5rem; right: .5rem;
}
.sticky-header {
  position: sticky; top: 0; background: inherit;
}
```

**Anchor Positioning (Experimentell, wenn aktiviert)**

```css
/* Beschreibung: Positioniere Popover/Tooltip an Ankerpunkten ohne JS-Berechnung. */
.anchor { anchor-name: --btn; position: relative; }
.tooltip {
  position: fixed;
  position-anchor: --btn;
  inset-area: top;              /* oder: bottom / left / right */
  translate: 0 calc(-100% - .5rem);
  background: #111; color: #fff; padding: .5rem .75rem; border-radius: .5rem;
}
```

**Logical Properties (RTL/LTR-sicher)**

```css
/* Beschreibung: Schreibfluss-neutrale Abstände/Größen. */
.card {
  margin-block: 1rem;
  padding-inline: 1rem;
  border-inline-start: 4px solid rebeccapurple;
}
```

---

## Overflow, Scroll Snap & Scroll-gesteuerte Animationen

**Overflow & Wrap**

```css
.scroller {
  max-height: 40vh;
  overflow: auto;           /* erzeugt Scrollbars bei Bedarf */
  overscroll-behavior: contain; /* verhindert Bounce/Scroll-Ketten */
  scrollbar-gutter: stable;
}
```

**Scroll Snap**

```css
.gallery {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 80%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
}
.gallery > * { scroll-snap-align: start; }
```

**Scroll-Driven Animations (Scroll-Timelines)**

```css
/* Beschreibung: Animationen werden durch Scrollen getrieben, nicht Zeit. */
.scroller { overflow: auto; scroll-timeline-name: --t; scroll-timeline-axis: block; }

.progress {
  animation: fill 1s linear both;
  animation-timeline: --t;
  animation-range: 0% 100%;
}

@keyframes fill { from { scale: 0 1; } to { scale: 1 1; } }
```

---

## Transforms, Transitions & Keyframe-Animationen

```css
/* Transforms */
.tile {
  transform: translateY(0) scale(1);
  transition: transform .2s ease, box-shadow .2s ease;
}
.tile:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
}

/* Keyframes + prefer-reduced-motion */
@media (prefers-reduced-motion: no-preference) {
  .pulse { animation: pulse 1.2s ease-in-out infinite; }
}
@keyframes pulse {
  50% { transform: scale(1.05); }
}
```

---

## Typografie, Text & Farbe

```css
/* Schrift & OpenType */
:root { --leading: 1.5; }
body {
  font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif;
  font-size: 16px;
  line-height: var(--leading);
  font-variant-ligatures: common-ligatures contextual;
}
h1 { font-size: clamp(1.8rem, 2vw + 1rem, 3rem); }

/* Textfluss & Trunkierung */
.p {
  text-wrap: pretty;              /* bessere Zeilenumbrüche */
  hyphens: auto;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Farbe & Farbschemata */
:root { color-scheme: light dark; }
.button-contrast {
  color: contrast-color(in oklab, white, black, oklch(0.6 0.2 260));
  background: color-mix(in oklab, canvas, oklch(0.6 0.2 260) 30%);
}

/* Akzentfarbe (Form Controls) */
input[type="checkbox"] { accent-color: oklch(0.7 0.2 260); }
```

---

## Selektoren (Kern)

```css
/* Klassen/IDs/Typ */
.card    { /* … */ }
#hero    { /* … */ }
article  { /* … */ }

/* Attribute */
a[target="_blank"] { text-decoration: underline dotted; }

/* Kombinatoren */
.list > li      { /* Child */ }
.card .btn      { /* Descendant */ }
.item + .item   { /* Adjacent sibling */ }
.item ~ .note   { /* General sibling */ }

/* :is / :where / :not – Komplexität vereinfachen */
.btn:is(:hover,:focus-visible) { outline: 2px solid currentColor; }
.menu :where(li, a) { margin: 0; padding: 0; }
input:not([type="checkbox"]) { /* … */ }

/* :has – Eltern selektieren (stark!) */
.card:has(img) { padding-block-end: 2rem; }

/* :focus-visible / :focus-within */
.button:focus-visible { outline: 3px solid Highlight; }
.field:focus-within    { box-shadow: 0 0 0 4px color-mix(in oklab, currentColor, transparent 70%); }

/* :nth-* Beispiele */
.list li:nth-child(odd)   { background: color-mix(in oklab, canvas, currentColor 5%); }
.grid > *:nth-child(3n)   { outline: 1px dashed currentColor; }
```

---

## Pseudo-Elemente (häufig)

```css
/* ::before / ::after – Deko/Inhalte */
.button {
  position: relative;
  padding-inline: 1.25rem;
}
.button::after {
  content: "";
  position: absolute;
  inset-inline-end: .5rem; inset-block: 50%;
  translate: 0 -50%;
  width: .5rem; height: .5rem;
  border: 2px solid currentColor; border-left: 0; border-top: 0;
  transform: rotate(45deg); /* kleiner Pfeil */
}

/* ::marker – Listensymbole */
ul.fancy { list-style: none; padding: 0; }
ul.fancy li::marker { content: "– "; color: oklch(0.7 0.2 260); }

/* ::selection – Auswahlfarbe */
::selection {
  background: oklch(0.8 0.1 260);
  color: black;
}

/* ::placeholder – Platzhalterstyling */
input::placeholder { opacity: .6; }
```

---

## Backgrounds, Gradients, Filter & Masking

```css
/* Mehrere Background-Layer + Gradients */
.hero {
  background:
    linear-gradient(to bottom, rgba(0,0,0,.4), rgba(0,0,0,.6)),
    url(cover.jpg) center/cover no-repeat;
  color: white;
}

/* Filter & Backdrop */
.glass {
  background: rgba(255,255,255,.2);
  backdrop-filter: blur(12px) saturate(120%);
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 16px;
}

/* Maskierungen (SVG/CSS Shapes) */
.avatar {
  -webkit-mask: radial-gradient(circle at 50% 50%, #000 60%, transparent 62%);
          mask: radial-gradient(circle at 50% 50%, #000 60%, transparent 62%);
}
```

---

## Forms, Pointer & Accessibility-Hilfen

```css
/* appearance / field-sizing / caret / pointer-events */
input[type="search"] {
  appearance: none;
  field-sizing: content; /* experimentell: Höhe folgt Inhalt */
}
textarea { caret-color: oklch(0.7 0.2 260); }
.icon-disabled { pointer-events: none; }

/* focus-styles konsistent, nur bei Tastatur */
:focus { outline: none; }
:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
```

---

## Scrollbars (Vendor-abhängig, minimal portabel)

```css
/* Firefox */
* { scrollbar-width: thin; scrollbar-color: currentColor transparent; }

/* WebKit */
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-thumb { background: currentColor; border-radius: 999px; }
```

---

## View Transitions (Seiten-/Zustandswechsel)

```css
/* Beschreibung: Sanfte Übergänge zwischen Routen/Zuständen.
   Voraussetzung: document.startViewTransition() im JS auslösen. */
::view-transition-old(root),
::view-transition-new(root) { animation-duration: .35s; }

.card {
  view-transition-name: card;
  /* optional Styles während Transition */
}
```

---

## @keyframes, @supports, @property, @font-face

```css
/* @supports – Feature Queries */
@supports (anchor-name: --x) {
  .tooltip { /* progressive enhancement */ }
}

/* @property – registriert animierbare Custom Properties */
@property --spin {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
.spinner { transform: rotate(var(--spin)); }

/* @font-face – Schrift einbinden */
@font-face {
  font-family: "InterVar";
  src: url("/fonts/Inter.var.woff2") format("woff2-variations");
  font-display: swap;
}
body { font-family: InterVar, system-ui, sans-serif; }
```

---

## Container-, Position-Try & Try-Order (Layout-Fallbacks)

```css
/* position-try: Browser testet Positionsvorschläge in Reihenfolge */
.pop {
  position: absolute;
  position-try: flip-block, flip-inline, flip-start, most-space;
  position-try-order: normal;
}
```

---

## Farben & moderne Farbräume

```css
.palette {
  /* Moderne Farbräume: oklch / oklab liefern bessere Wahrnehmungskonstanz */
  --accent: oklch(0.68 0.14 260);
  color: oklch(0.18 0.02 260);
  background: color-mix(in oklab, canvas, var(--accent) 20%);
}

/* color-scheme für native UI (Form Controls, Scrollbars) */
:root { color-scheme: light dark; }
```

---

## Funktionen (praktische Beispiele)

```css
/* clamp – fluid responsive ohne Media Queries */
.title { font-size: clamp(1.25rem, 2vw + .5rem, 2.25rem); }

/* min/max – Grenzen */
.card { width: min(72ch, 100%); }

/* calc – Berechnungen */
.sidebar { inline-size: calc(25% - 1rem); }

/* color-mix, contrast-color (experimentell) siehe oben */

/* var – dynamische Werte */
.box { border-radius: var(--radius, 12px); }
```

---

## Z-Index & Stacking-Kontext

```css
/* Neue Kontexte: position + z-index (nicht auto), opacity<1, transform, filter etc. */
.modal {
  position: fixed; inset: 0;
  z-index: 1000;
  display: grid; place-items: center;
  background: color-mix(in oklab, black, transparent 40%);
}
```

---

## Druck, Paged Media (Basics)

```css
@media print {
  .no-print { display: none !important; }
  @page { margin: 1.5cm; }
}
```

---

## Sicherheit & Präferenzen

```css
/* user-select / touch-action / text-size-adjust */
.noselect { user-select: none; }
.clicky    { touch-action: manipulation; }
html       { text-size-adjust: 100%; }
```

---

## Vendor-Präfixe (nur falls nötig)

```css
/* Beispiele: -webkit-text-stroke, -webkit-tap-highlight-color, -moz-… (selten) */
.title {
  -webkit-text-stroke: 1px rgba(0,0,0,.4);
  text-stroke: 1px rgba(0,0,0,.4); /* künftiger Standardname */
}
a { -webkit-tap-highlight-color: transparent; }
```

---
