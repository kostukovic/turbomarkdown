# CSS Animation
Beispiele CSSs in Codeblöcken

---

## `animation-*` (komplett & praxisnah)

```css
/* ANIMATION – Überblick
   - animation: <name> <duration> <timing> <delay> <iteration-count> <direction> <fill-mode> <play-state> <timeline(optional)>
   - Subprops: animation-name | -duration | -timing-function | -delay | -iteration-count | -direction | -fill-mode | -play-state
               | -timeline | -range | -range-start | -range-end | -composition
   - Tipps:
     • prefers-reduced-motion beachten.
     • steps(), cubic-bezier(), linear(), spring() (falls verfügbar) gezielt einsetzen.
     • -composition: replace | add | accumulate (wie mehrere Animations-Stacks interagieren)
     • Scroll-gesteuert: animation-timeline + animation-range (siehe unten)
*/

/* Baseline: einfache Loop-Animation */
.spinner {
  animation-name: spin;
  animation-duration: 1.2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: normal;           /* alternate | reverse | alternate-reverse */
  animation-fill-mode: none;             /* forwards | backwards | both */
  animation-play-state: running;         /* paused */
}
@keyframes spin { to { transform: rotate(1turn); } }

/* Mehrere Animationen kombinieren (Komma-separiert) */
.btn-cta {
  animation:
    pop .28s cubic-bezier(.2,.8,.2,1) 0s 1 both,
    glow 2.2s ease-in-out .1s infinite alternate both;
}
@keyframes pop  { from { transform: scale(.94); } to { transform: scale(1); } }
@keyframes glow { to   { box-shadow: 0 0 0 12px color-mix(in oklab, currentColor, transparent 85%); } }

/* steps() – Frame-Animation (z. B. Counter / Sprite) */
.counter { animation: tick 10s steps(10, end) infinite; }
@keyframes tick { to { background-position: 0 -100%; } }

/* composition – wie mehrere Keyframes auf dieselbe Eigenschaft wirken */
.layered {
  animation: float 2s ease-in-out infinite alternate both;
  animation-composition: add; /* addiert transform statt replace (wenn unterstützt) */
}
@keyframes float { to { transform: translateY(-6px); } }

/* Reduced Motion respektieren */
@media (prefers-reduced-motion: reduce) {
  .spinner, .btn-cta, .counter, .layered { animation: none !important; }
}
```

---

## Scroll-Driven Animations (`animation-timeline`, `animation-range`, Scroll Snap)

```css
/* Scroll-Timeline (CSS nur; erfordert scrollbarer Container in HTML)
   - animation-timeline: <custom-ident> | view() | scroll()
   - animation-range: <start> <end> (%, px, element-edges)
*/
.scroller {
  overflow: auto;
  scroll-timeline-name: --y;           /* definiert Timeline */
  scroll-timeline-axis: block;         /* block | inline */
}
.progress {
  animation: fill 1s linear both;
  animation-timeline: --y;             /* bindet an Scrollfortschritt */
  animation-range: 0% 100%;
}
@keyframes fill { from { scale: 0 1; } to { scale: 1 1; } }

/* Scroll Snap – Seitenweise Galerie */
.snap {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 80%;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-gutter: stable;
}
.snap > * { scroll-snap-align: start; }
```

---

## Grid (`grid-*` vollständig im Alltag)

```css
/* GRID – 2D-Layout, Tracks, Auto-Placement, Areas
   - display: grid | inline-grid | subgrid
   - Wichtige Props: grid-template(-columns|-rows|-areas) | grid-auto-(columns|rows|flow)
                     gap/row-gap/column-gap | justify-*/align-* | place-*
   - repeat(), minmax(), auto-fill/auto-fit, named lines, areas
*/

/* Basis: 12-Spalten-Grid mit Gap */
.layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(.5rem, 1vw + .25rem, 1rem);
}

/* Responsiv ohne Media Query: Kartenbreite begrenzen */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(22rem, 100%), 1fr)));
  gap: 1rem;
}

/* Grid Areas (HTML: Elemente mit .header .sidebar .main .footer klassen) */
.page {
  display: grid;
  grid-template-columns: 16rem 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100dvh;
}
.header { grid-area: header; }
.sidebar{ grid-area: sidebar; }
.main   { grid-area: main; }
.footer { grid-area: footer; }

/* Named Lines + span */
.content {
  display: grid;
  grid-template-columns:
    [full-start] minmax(1rem,1fr)
    [wrap-start] repeat(12, minmax(0, 4.5rem))
    [wrap-end]   minmax(1rem,1fr) [full-end];
}
.content > .wide {
  grid-column: wrap-start / wrap-end;
}
.content > .full {
  grid-column: full-start / full-end;
}

/* Auto-Placement steuern */
.masonry {
  display: grid;
  grid-auto-flow: dense;     /* füllt Lücken */
  grid-auto-rows: 0;
  grid-template-columns: repeat(4, 1fr);
  gap: .75rem;
}
.masonry > .tall { grid-row: span 2; }

/* Subgrid (wo verfügbar): Kind übernimmt Spalten/Zeilen des Elterns */
.article {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}
.article > .meta {
  display: grid;
  grid-template-columns: subgrid; /* übernimmt 1fr 2fr */
  grid-column: 1 / -1;
}
```

---

## Flexbox (`flex-*` komplett im Alltag)

```css
/* FLEX – 1D-Layout, ideal für Toolbar/Listen/Navigationsleisten
   - Container: display:flex; flex-direction; flex-wrap; gap
   - Alignment: justify-content (Hauptachse) | align-items (Querachse) | align-content (mehrere Zeilen)
   - Items: order | flex: <grow> <shrink> <basis> | align-self
*/

.toolbar {
  display: flex;
  align-items: center;            /* Querachse */
  justify-content: space-between; /* Hauptachse */
  gap: .75rem;
}
.badges { display: flex; flex-wrap: wrap; gap: .5rem; }

/* Gleich hohe Karten, seitlich scrollbare Chips */
.equal { display: flex; gap: 1rem; align-items: stretch; }
.chips { display: flex; overflow-x: auto; gap: .5rem; scroll-snap-type: x proximity; }

/* Wachstum & Schrumpfen gezielt steuern */
.col-fixed  { flex: 0 0 18rem; }  /* wächst/ schrumpft nicht, Basis 18rem */
.col-fluid  { flex: 1 1 auto;   } /* füllt Rest */
.col-prio   { flex: 2 1 14rem; }  /* wächst doppelt so stark wie .col-fluid */

/* Reihenfolge ändern (ohne DOM) */
.item-a { order: 2; }
.item-b { order: 1; }
```

---

## Selektoren, Kombinatoren & Power-Selectoren (`:is()`, `:where()`, `:has()`)

```css
/* Selektor-Baukasten:
   - Attribut: [data-state="open"]
   - Kombinatoren: A > B (Child) | A B (Descendant) | A + B (Adjacent) | A ~ B (General sibling)
   - Gruppen: :is(), :where() (wie :is, aber 0 Spezifität), :not()
   - Eltern-beeinflussen mit :has() (Achtung Performance, gezielt einsetzen)
*/

a[target="_blank"] { text-decoration: underline dotted; }

.list > li { margin-block: .5rem; }          /* Child */
.card .btn { inline-size: max-content; }     /* Descendant */
.item + .item { border-top: 1px solid #ddd;} /* Adjacent */
.term ~ .def  { opacity: .8; }               /* General sibling */

.btn:is(:hover, :focus-visible) { outline: 2px solid currentColor; }

/* :where – gruppiert ohne Spezifität aufzubauen */
.menu :where(ul, li, a) { margin: 0; padding: 0; list-style: none; }

/* :has – Eltern abhängig von Kindzustand stylen (z. B. Fehlerfeld) */
.field:has(input:invalid) { outline: 2px solid oklch(0.7 0.2 30); }

/* :nth-* – Muster */
.grid > *:nth-child(3n) { outline: 1px dashed currentColor; }
```

---

## Pseudo-Klassen & -Elemente (häufige Praxis)

```css
/* Fokus & States */
:focus { outline: none; }
:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
:disabled { opacity: .6; pointer-events: none; }
:placeholder-shown { color: color-mix(in oklab, currentColor, transparent 40%); }

/* Formular-States */
input:invalid { border-color: oklch(0.7 0.2 30); }
input:valid   { border-color: oklch(0.7 0.15 160); }

/* Interaktivität */
details[open] > summary { font-weight: 600; }
:target { scroll-margin-top: 6rem; } /* Ankerziel nicht unter Header verstecken */

/* Pseudo-Elemente */
::selection { background: oklch(0.85 0.08 260); color: #111; }
::marker    { color: oklch(0.7 0.2 260); }
::placeholder { opacity: .6; }

/* Web Components / Shadow DOM */
:host { display: block; }
:host([variant="primary"]) { color: white; background: oklch(0.65 0.16 250); }
::part(button) { border-radius: 999px; padding-inline: 1rem; }
::slotted(img) { block-size: 2rem; inline-size: 2rem; object-fit: cover; }
```

---

## Container Queries & Logical Properties

```css
/* Container: Komponenten reagieren auf ihre Umgebung, nicht auf den Viewport */
.card-wrap { container-type: inline-size; /* optional: container-name: cards; */ }

@container (min-width: 28rem) {
  .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
}

/* Logical Properties – sprachflussneutral (RTL/LTR) */
.panel {
  padding-inline: 1rem;
  margin-block: 1rem;
  border-inline-start: 4px solid rebeccapurple;
}
```

---

## Farben, Funktionen & moderne Farbräume

```css
/* OKLCH/OKLAB – bessere Wahrnehmungskonstanz als sRGB-HSL */
:root {
  --accent: oklch(0.68 0.14 260);
  --radius: 14px;
}
.cta {
  background: var(--accent);
  color: white;
  border-radius: var(--radius);
}

/* clamp – fluid responsive */
h1 { font-size: clamp(1.5rem, 2vw + .5rem, 3rem); }

/* min/max/calc – Layout-Mathematik */
.wrap { inline-size: min(72ch, 100%); }
.sidebar { inline-size: calc(25% - 1rem); }

/* color-mix – Akzente weich mischen */
.badge {
  background: color-mix(in oklab, canvas, var(--accent) 18%);
  color: color-mix(in oklab, black, white 20%);
}
```

---

## Bonus: View Transitions (Seiten-/Zustandswechsel)

```css
/* CSS-Seite: optische Dauer steuern (JS triggert document.startViewTransition()) */
::view-transition-old(root),
::view-transition-new(root) { animation-duration: .35s; }

/* Element-spezifische Transition */
.card { view-transition-name: card; }
```




## BACKGROUNDS – background-*

```css
/* ============================
   BACKGROUNDS – background-*
   Mehrere Layer, Position/Size, Attachment, Blend
===============================*/

/* Shorthand (Layer 1 oben, dann 2, …) */
.hero {
  background:
    linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.65)) center/cover no-repeat fixed,
    url("/img/cover.jpg") center/cover no-repeat;
  /* Einzel-Props: */
  background-image:
    linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.65)),
    url("/img/cover.jpg");
  background-position: center;
  background-size: cover;                  /* contain | <length> | <percentage> */
  background-repeat: no-repeat;            /* repeat-x | repeat-y | round | space */
  background-attachment: fixed;            /* local | scroll | fixed */
  background-origin: padding-box;          /* border-box | content-box */
  background-clip: padding-box;            /* text (mit -webkit-background-clip) */
  background-blend-mode: multiply;         /* multiply | screen | overlay | … */
}

/* Einzelne Achsen steuern */
.tile {
  background-position-x: 25%;
  background-position-y: 75%;
  background-size: 120% auto;
}

/* Muster/Gradients kombinieren */
.striped {
  background:
    repeating-linear-gradient(45deg, #0000 0 10px, #0002 10px 20px),
    oklch(0.97 0 0);
}
```


## BORDERS – border-*, radius, image

```css
/* ============================
   BORDERS – border-*, radius, image
   Logische Richtungen & Border-Image
===============================*/

/* Klassisch */
.card {
  border: 1px solid color-mix(in oklab, currentColor, transparent 80%);
  border-radius: 12px;                         /* / für elliptisch: 12px 24px / 8px 16px */
}

/* Seiten-spezifisch */
.rule {
  border-top: 2px dashed currentColor;
  border-bottom-width: 0;
}

/* Logische Aliase (schreibflussbewusst) */
.note {
  border-inline-start: 4px solid oklch(0.7 0.12 260);
  padding-inline-start: 1rem;
}

/* Radius pro Ecke (inkl. Start/End für RTL/LTR) */
.badge {
  border-start-start-radius: 999px;
  border-end-end-radius: 999px;
}

/* Border-Image (Slices, Repeat) */
.frame {
  border: 24px solid transparent;
  border-image-source: url("/img/frame.svg");
  border-image-slice: 30 fill;
  border-image-repeat: round;  /* stretch | round | space */
  border-image-width: 24;
  border-image-outset: 0;
}
```
## OVERFLOW & SCROLL – overflow-*, overscroll-*, scroll-*
```css
/* ============================
   OVERFLOW & SCROLL – overflow-*, overscroll-*, scroll-*
   Scrollbars, Snap, Margin/Padding, Behavior
===============================*/

/* Grund-Overflow + Overscroll-Behavior (Ketten verhindern) */
.scroller {
  max-block-size: 40vh;
  overflow: auto;
  overscroll-behavior: contain;          /* x|y|block|inline getrennt möglich */
  scrollbar-gutter: stable;              /* Layout-Sprung vermeiden */
}

/* X/Y getrennt */
.row {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Scroll-Snap (Galerie) */
.snap {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 80%;
  gap: 1rem;
  overflow: auto;
  scroll-snap-type: x mandatory;         /* proximity | y | block | inline */
}
.snap > * { scroll-snap-align: start; }

/* Scroll-Margin/Padding (Ankerziele unter Sticky-Headern) */
:target { scroll-margin-top: 6rem; }
.section { scroll-padding-top: 6rem; }

/* Weiches Scrollen */
html { scroll-behavior: smooth; }

/* Clip-Margin (Schlagschatten bei Clip nicht abschneiden) */
.card {
  overflow: clip;
  overflow-clip-margin: 12px;
}

/* Custom Scrollbar (Browser-abhängig) */
* { scrollbar-width: thin; scrollbar-color: currentColor transparent; }
*::-webkit-scrollbar { inline-size: 10px; block-size: 10px; }
*::-webkit-scrollbar-thumb { background: currentColor; border-radius: 999px; }
```
## TEXT & DEKORATION – text-*, decoration, emphasis
```css
/* ============================
   TEXT & DEKORATION – text-*, decoration, emphasis
   Trunkierung, Umbruch, Unterstreichung, Emphasis
===============================*/

/* Lesefluss & Zeilenumbruch */
.copy {
  text-wrap: pretty;                /* stable | balance | wrap | nowrap */
  hyphens: auto;                    /* automatische Silbentrennung */
}

/* Ellipsis (1 Zeile) */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multi-Line Truncate (mit line-clamp) */
.clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;                /* standardisierter Alias */
  -webkit-line-clamp: 3;        /* WebKit */
}

/* Unterstreichung fein steuern */
.link {
  text-decoration-line: underline;          /* underline | overline | line-through */
  text-decoration-style: wavy;              /* solid | double | dotted | dashed | wavy */
  text-decoration-thickness: from-font;     /* <length> | auto | from-font */
  text-underline-offset: .15em;
  text-decoration-color: color-mix(in oklab, currentColor, transparent 50%);
}

/* Text-Emphasis (Ruby/ostasiatisch nützlich) */
.emph {
  text-emphasis: circle oklch(0.7 0.12 260);  /* dot | circle | triangle | sesame | "文字" */
  text-emphasis-position: under right;
}

/* Text-Transform & Justify */
.title { text-transform: capitalize; }
.news  { text-align: justify; text-justify: inter-word; }

/* Sprachen-Feintuning */
:lang(tr) .i-dotless { font-variant-caps: small-caps; }
```
## MASKING & CLIP – mask-*, clip-path, shapes
```css
/* ============================
   MASKING & CLIP – mask-*, clip-path, shapes
   Bildmasken, CSS/SVG-Shapes, Shape-Outside
===============================*/

/* Einfache Kreis-Maske (kompatibel mit WebKit-Präfix) */
.avatar {
  -webkit-mask: radial-gradient(circle at 50% 50%, #000 60%, transparent 62%);
          mask: radial-gradient(circle at 50% 50%, #000 60%, transparent 62%);
}

/* SVG als Maske */
.logo-cut {
  mask-image: url("/img/mask.svg");
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
}

/* clip-path – Dekorative Ausschnitte */
.card--angle {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), 0 100%);
}

/* shape-outside – Text fließt um Form (Element muss floaten) */
.figure {
  float: inline-start;
  inline-size: 240px; block-size: 240px;
  shape-outside: circle(50%);
  clip-path: circle(50%);
  margin: 1rem;
}
```
## FILTER & BACKDROP – filter, backdrop-filter
```css
/* ============================
   FILTER & BACKDROP – filter, backdrop-filter
   Weichzeichnen, Kontrast, Glas-Effekt
===============================*/

.thumb { filter: grayscale(100%) contrast(110%) brightness(95%); }

/* Glas-Effekt (Transluzenz + Backdrop-Blur) */
.glass {
  background: color-mix(in oklab, canvas, white 12%);
  backdrop-filter: blur(14px) saturate(120%);
  border: 1px solid color-mix(in oklab, white, transparent 70%);
  border-radius: 16px;
}
```
## BILDER & OBJEKTANPASSUNG – images, object-fit/position, image-set
```css
/* ============================
   BILDER & OBJEKTANPASSUNG – images, object-fit/position, image-set
   Schärfe, DPR-Assets, Cropping
===============================*/

/* Bildschärfe / Rendern */
.pixel {
  image-rendering: pixelated;     /* crisp-edges | auto | pixelated */
}

/* Objektfüllung in Container (z. B. <img>, <video>) */
.media {
  inline-size: 100%;
  block-size: 240px;
  object-fit: cover;              /* contain | fill | none | scale-down */
  object-position: 50% 30%;       /* Fokuspunkt */
}

/* Retina/DPR-abhängige Quellen */
.hero {
  background-image: image-set(
    url("/img/hero@1x.jpg") 1x,
    url("/img/hero@2x.jpg") 2x,
    url("/img/hero.avif") type("image/avif") 2x
  );
}
```
## FUNKTIONEN – clamp/min/max/calc, color(), color-mix(), attr(), var()
```css
/* ============================
   FUNKTIONEN – clamp/min/max/calc, color(), color-mix(), attr(), var()
   Fluid-Design & moderne Farben
===============================*/

/* Fluider Titel ohne MQ */
h1 { font-size: clamp(1.6rem, 2.5vw + .5rem, 3rem); }

/* min/max/calc */
.sidebar { inline-size: min(22rem, 30%); }
.main    { inline-size: calc(100% - var(--sidebar, 20rem)); }

/* Moderne Farbräume (oklch/oklab/lch/lab) & color() */
.btn {
  --accent: oklch(0.68 0.14 260);
  background: var(--accent);
  color: color-mix(in oklab, white, black 20%);
}
.badge {
  background: color-mix(in oklab, canvas, var(--accent) 20%);
}

/* attr() für Content (sicher bei content, begrenzt für andere Props) */
.link::after { content: " (" attr(data-suffix) ")"; }
```
## AT-RULES – @media, @supports, @container, @layer, @counter-style, @scope
```css
/* ============================
   AT-RULES – @media, @supports, @container, @layer, @counter-style, @scope
   Feature-Queries, Komponentenscope, eigene Listenmarker
===============================*/

/* @media – diverse Features */
@media (prefers-color-scheme: dark) { html { color-scheme: dark; } }
@media (hover: hover) and (pointer: fine) { .btn:hover { transform: translateY(-2px); } }

/* @supports – Progressive Enhancement */
@supports (anchor-name: --a) {
  .tip { /* spezielle Positionierungs-Optimierungen */ }
}

/* @container – komponentenbasiertes Breakpointing */
.card-wrap { container-type: inline-size; }
@container (min-width: 32rem) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

/* @layer – Kaskadenordnung */
@layer reset, base, comps, utils;

/* @counter-style – eigene Listensymbole */
@counter-style dashes {
  system: cyclic;
  symbols: "–";
  suffix: "  ";
}
ul.custom { list-style: dashes; }

/* @scope – Styles nur in Teilbaum anwenden */
@scope (.dialog) to (.dialog) {
  :scope .title { font-weight: 700; }
  :scope .btn { inline-size: max-content; }
}
```
## SCROLL-DRIVEN (VIEW-TIMELINE) & VIEW TRANSITIONS
```css
/* ============================
   SCROLL-DRIVEN (VIEW-TIMELINE) & VIEW TRANSITIONS
   Sichtbarkeitsgesteuerte Animationen & Seitenwechsel
===============================*/

/* View-Timeline: Animation abhängig von Element im Viewport */
.section {
  view-timeline-name: --enter;
  view-timeline-axis: block;
}
.fade-in {
  animation: fade 1s ease both;
  animation-timeline: --enter;
  animation-range: entry 0% cover 40%;  /* von Eintritt bis 40% Abdeckung */
}
@keyframes fade { from { opacity: 0; translate: 0 2rem; } to { opacity: 1; translate: 0 0; } }

/* View Transitions: global (JS startet Transition), Dauer per CSS */
::view-transition-old(root),
::view-transition-new(root) { animation-duration: .35s; }

/* Element-spezifische Transition-Namen */
.card { view-transition-name: card; }
```
## POSITIONIERUNG – anchor-positioning & position-try (experimentell)
```css
/* ============================
   POSITIONIERUNG – anchor-positioning & position-try (experimentell)
   Tooltips/Popover ohne JS-Berechnungen
===============================*/

/* Anker definieren */
.button { position: relative; anchor-name: --btn; }

/* Tooltip an Anker ausrichten */
.tooltip {
  position: fixed;
  position-anchor: --btn;
  inset-area: top;                       /* top | bottom | left | right | center */
  translate: 0 calc(-100% - .5rem);
  padding: .5rem .75rem;
  background: #111; color: #fff; border-radius: .5rem;
}

/* Fallback-Vorschläge, wenn Platz fehlt */
.tooltip {
  position-try: flip-block, flip-inline, most-space;
  position-try-order: normal;            /* priorities: normal | most-space-first */
}
```
## ACCESSIBILITY & INTERAKTION
```css
/* ============================
   ACCESSIBILITY & INTERAKTION – focus, focus-visible, accent-color, touch-action
   Tastaturfokus, Systemfarben, Formakzente
===============================*/

:focus { outline: none; }
:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }

input[type="checkbox"],
input[type="radio"],
progress,
meter { accent-color: oklch(0.68 0.14 260); }

.button { touch-action: manipulation; user-select: none; }
```
