# CSS-Fehlerfibel 

Kurz, praxisnah, mit **Do/Don't**-Snippets.

---

## 1) Baseline & Defaults

**Fehler:** Unklare Box-Modelle, Schriftfluss/RTL nicht bedacht.

```css
/* DO: defensiver Reset + logische Eigenschaften */
*, *::before, *::after { box-sizing: border-box; }

:root {
  color-scheme: light dark;
  --space: 1rem;
}

body {
  margin: 0;
  font: 16px/1.5 system-ui, sans-serif;
}

/* DO: logical properties statt left/right/top/bottom */
.container {
  padding-inline: var(--space);
  margin-block: var(--space);
}
```

---

## 2) Responsives Layout ohne Überlauf

**Fehler:** Starre Pixelbreiten → Layout bricht/scrollt horizontal.
**Besser:** `min()`, `max()`, `clamp()`, Grid/Flex mit `minmax()`.

```css
/* DON'T: starre Breite erzeugt Overflow */
.app { width: 1100px; }

/* DO: schrumpft bis 100% Viewport */
.app { inline-size: min(1100px, 100%); }

/* DO: Grid, das schrumpft statt zu überlaufen */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(22rem, 100%), 1fr));
  gap: clamp(.5rem, 1vw + .25rem, 1rem);
}

/* DO: Flex mit Wrap statt gequetscht/Overflow */
.row {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}
.row > .cell { flex: 1 1 16rem; } /* Basisbreite, schrumpft bei Bedarf */
```

---

## 3) Textbruch, lange Wörter & Trunkierung

**Fehler:** Lange URLs/Wörter sprengen Spalten.
**Besser:** `overflow-wrap`, `hyphens`, `text-wrap`.

```css
/* DO: harte Wortbrüche erlauben */
.text {
  overflow-wrap: anywhere;   /* robust bei URLs */
  hyphens: auto;             /* Silbentrennung, wo möglich */
  text-wrap: pretty;         /* harmonische Umbrüche */
}

/* DO: Einzeilige Ellipse */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* DO: Mehrzeilige Trunkierung */
.clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;           /* Standardalias */
  -webkit-line-clamp: 3;   /* WebKit */
}
```

---

## 4) Breite/Viewport-Fallen (100vh, Mobile)

**Fehler:** `100vh` auf Mobile verdeckt hinter Browserchrome.
**Besser:** dynamische Einheiten `dvh/svh`.

```css
/* DO: volle Höhe ohne Adressleisten-Bug */
.full-height {
  min-block-size: 100dvh; /* statt 100vh */
}
```

---

## 5) Scrollen, Sticky, Ankerziele

**Fehler:** Sticky-Header überdeckt Ankerziele. Scroll-Ketten nerven.
**Besser:** `scroll-margin`, `scroll-padding`, `overscroll-behavior`.

```css
/* DO: Ankerziel nicht unterm Header */
:target { scroll-margin-top: 6rem; }
.main   { scroll-padding-top: 6rem; }

/* DO: Scroll-Ketten verhindern */
.scroller {
  max-block-size: 40vh;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}
```

---

## 6) Komponenten, Container-Queries

**Fehler:** Komponenten brechen bei schmalen Sidebars, weil nur Viewport-Breakpoints.
**Besser:** Container-Queries.

```css
/* DO: Komponente reagiert auf Containerbreite */
.card-wrap { container-type: inline-size; }

@container (min-width: 28rem) {
  .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
}
```

---

## 7) Fokus, States & A11y

**Fehler:** `outline: none` ohne Ersatz → Tastatur-Nutzer verlieren Fokus.
**Besser:** `:focus-visible` & ausreichend Kontrast.

```css
/* DO: nur sichtbarer Tastaturfokus überschrieben */
:focus { outline: none; }
:focus-visible {
  outline: 3px solid Highlight;
  outline-offset: 2px;
}

/* DO: Form-Akzent, ausreichender Kontrast */
input, select { accent-color: oklch(0.68 0.14 260); }
```

---

## 8) Animationen & Reduced Motion

**Fehler:** Dauerhafte, große Parallax/Blur-Animationen ohne Rücksicht.
**Besser:** sparsam, **und** `prefers-reduced-motion` respektieren.

```css
/* DO: sanfte Hover-Transformationen */
.tile {
  transform: translateY(0);
  transition: transform .2s ease, box-shadow .2s ease;
}
.tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
}

/* DO: Reduced Motion respektieren */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 9) Spezifität, `!important` & Layers

**Fehler:** `!important` überall; schwer wartbar.
**Besser:** klare Kaskaden via `@layer`, low-spec Utilities mit `:where()`.

```css
/* DO: Kaskade strukturieren */
@layer reset, base, components, utilities;

@layer reset {
  *,*::before,*::after { box-sizing: border-box; }
}
@layer base {
  body { margin: 0; font: 16px/1.5 system-ui, sans-serif; }
}
@layer components {
  .button { padding: .6rem 1rem; border-radius: 12px; }
}
@layer utilities {
  .mt-2 { margin-block-start: .5rem; }
  /* niedrige Spezifität: */
  :where(.text-muted) { color: color-mix(in oklab, currentColor, transparent 40%); }
}
```

---

## 10) Performance-Kleinigkeiten

**Fehler:** Großflächige, dauerhafte box-shadow/blur & `position: fixed` + transform Eltern → jank.
**Besser:** sparsame Effekte, Stacking-Kontexte bewusst.

```css
/* DO: Schatten nur auf Hover und moderat */
.card { transition: box-shadow .2s ease; }
.card:hover { box-shadow: 0 10px 24px rgba(0,0,0,.12); }

/* DO: unnötige transform/filter vermeiden (neue Stacking-Kontexte!) */
.layer { will-change: auto; } /* nicht will-change überall setzen */
```

---

## 11) Checkliste (kurz)

* [ ] **Layout schrumpft:** `inline-size: min(X, 100%)`, Grid/Flex mit `minmax()`/`flex-wrap`.
* [ ] **Text bricht:** `overflow-wrap:anywhere; hyphens:auto; text-wrap:pretty;`
* [ ] **Viewport sicher:** `100dvh` statt `100vh` auf Mobile.
* [ ] **Scroll UX:** `scroll-margin`/`scroll-padding` für Anker, `overscroll-behavior`.
* [ ] **Komponenten-Breakpoints:** `@container` statt nur `@media`.
* [ ] **A11y Fokus:** `:focus-visible` statt `outline: none` global.
* [ ] **Motion:** sparsam; `prefers-reduced-motion` beachten.
* [ ] **Kaskade:** `@layer` + `:where()`; `!important` vermeiden.
* [ ] **Logical props:** `margin/padding-inline|block` für RTL/LTR.
* [ ] **Typo/Flüssig:** `clamp()` für Schrift/Abstände.

---

## Bonus-Snippets (fertig zum Einbauen)

```css
/* Anti-Overflow Basis */
.responsive-shell {
  inline-size: min(1100px, 100%);
  margin-inline: auto;
  padding-inline: clamp(1rem, 2vw, 2rem);
}

/* Medien & Bilder brechen nicht aus */
img, svg, video, canvas { max-inline-size: 100%; block-size: auto; }

/* Text-Defaults */
.prose {
  overflow-wrap: anywhere;
  hyphens: auto;
  text-wrap: pretty;
  line-height: 1.6;
}

/* Sticky-Header + Anker */
.header { position: sticky; inset-block-start: 0; z-index: 10; }
:target { scroll-margin-top: 64px; }

/* Komponentengröße via Container */
.component-wrap { container-type: inline-size; }
@container (min-width: 36rem) {
  .component-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
}
```

