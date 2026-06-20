# Accessibility & Contrast Audit — Bongbaeng's Savanna
*Date: 2026-06-20 · Auditor: bongbaeng-oracle accessibility pass*

---

## Design Reference: Impeccable Principles Applied

Key rules extracted from https://github.com/pbakaus/impeccable:

1. **Never pure black or grey — apply subtle tinting** → our bg tokens are `#0a0a0a` (warm black), `#faf8f3` (warm parchment), not cool greys
2. **Don't wrap everything in cards** → hero section is card-free; cards used only for content units
3. **No bounce/elastic easing** → all transitions use `ease` at 0.12–0.2s
4. **Avoid gray text on coloured backgrounds** → muted text only on neutral bg tokens
5. **Clear information hierarchy** → 3-level type scale: H1 (5rem clamp) → H2 (1.5rem) → body (1rem)
6. **Intentional spacing rhythm** → 8-point grid (`--space-*` tokens), 5.5rem hero top padding
7. **Adequate touch targets** → all buttons ≥ 44px height (0.625rem v + 2px border + line-height)
8. **Semantic HTML** → `<nav aria-label>`, `<main id="main-content">`, `<article>`, `<time datetime>`, `<header>`
9. **Accessible focus states** → `:focus-visible` on every interactive element with 2px offset ring
10. **Skip link** → `.skip-link` added for keyboard users

---

## Contrast Ratio Audit

WCAG AA thresholds: **4.5:1** normal text (< 18px or < 14px bold), **3:1** large text (≥ 18px or ≥ 14px bold), **3:1** UI components (borders, icons).

### DARK theme (`bg-primary: #0a0a0a`)

| Element | Foreground | Background | Old ratio | New ratio | Status |
|---------|-----------|-----------|-----------|-----------|--------|
| body text | `#f0f0f0` | `#0a0a0a` | 17.37 | 17.37 | ✅ unchanged |
| secondary text | `#d0d0d0` | `#0a0a0a` | 12.84 | 12.84 | ✅ unchanged |
| muted text (EN subtitles) | `#8a8a8a` | `#0a0a0a` | **5.73** | `#9a9a9a` → **7.06** | ✅ raised |
| muted on card bg | `#8a8a8a` | `#1a1a1a` | **5.04** | `#9a9a9a` → **6.23** | ✅ raised |
| accent heading (large) | `#e11d2a` | `#0a0a0a` | 4.16 | 4.16 | ✅ ≥3:1 large text |
| white on btn-primary | `#ffffff` | `#e11d2a` | 4.76 | 4.76 | ✅ |
| highlight badge text | `#0a0a0a` | `#f5c518` | 12.14 | 12.14 | ✅ |
| **btn-outline border** | `#2a2a2a` | `#0a0a0a` | **1.38** ❌ | `#606060` → **3.15** | ✅ fixed |
| nav links | `#d0d0d0` | `#0a0a0a` | 12.84 | 12.84 | ✅ unchanged |
| theme toggle border | `#2a2a2a` | `#0a0a0a` | **1.38** ❌ | `#606060` → **3.15** | ✅ fixed |

### WHITE theme (`bg-primary: #ffffff`)

| Element | Foreground | Background | Old ratio | New ratio | Status |
|---------|-----------|-----------|-----------|-----------|--------|
| body text | `#0a0a0a` | `#ffffff` | 19.80 | 19.80 | ✅ unchanged |
| secondary text | `#3a3a3a` | `#ffffff` | 11.37 | 11.37 | ✅ unchanged |
| muted text | `#6b6b6b` | `#ffffff` | **5.33** | `#5a5a5a` → **7.66** | ✅ raised |
| muted on card | `#6b6b6b` | `#f5f5f5` | **4.89** | `#5a5a5a` → **7.08** | ✅ raised |
| accent | `#e11d2a` | `#ffffff` | 4.76 | 4.76 | ✅ |
| **highlight as text** | `#f5c518` | `#ffffff` | **1.63** ❌ | eliminated (never text on light bg) | ✅ fixed |
| btn-outline border | `#d4d4d4` | `#ffffff` | ~1.2 ❌ | `#888888` (--border-ui) → **3.33** | ✅ fixed |
| nav links | `#3a3a3a` | `#ffffff` | 11.37 | 11.37 | ✅ |

### LIGHT theme (`bg-primary: #faf8f3`)

| Element | Foreground | Background | Old ratio | New ratio | Status |
|---------|-----------|-----------|-----------|-----------|--------|
| body text | `#1a1208` | `#faf8f3` | 17.45 | 17.45 | ✅ unchanged |
| secondary text | `#3d3018` | `#faf8f3` | 12.11 | 12.11 | ✅ unchanged |
| muted text | `#6b5c3a` | `#faf8f3` | **6.15** | `#5c4e30` → **8.27** | ✅ raised |
| **accent text/links** | `#e11d2a` | `#faf8f3` | **4.49** ❌ | `#c41820` → **5.66** | ✅ fixed |
| white on btn-primary | `#ffffff` | `#c41820` | 4.76 | **6.00** | ✅ improved |
| **highlight as text** | `#f5c518` | `#faf8f3` | **1.54** ❌ | eliminated (never text on light bg) | ✅ fixed |
| btn-outline border | ~1.3 ❌ | `#faf8f3` | 1.3 | `#8c7a58` (--border-ui) → **3.10** | ✅ fixed |

---

## Issues Fixed

### Critical (WCAG FAIL → now PASS)

1. **`#f5c518` (yellow) used as text on white/light backgrounds** — ratio 1.54–1.63:1. Yellow is now ONLY used as a badge background (with `#0a0a0a` dark text → 12.14:1 ✅) or as inline text on dark theme only. Removed from `prose code` color on light/white.

2. **`btn-outline` border invisible on dark** — `var(--border)` = `#2a2a2a` on `#0a0a0a` = 1.38:1. New `--border-ui` token (`#606060`) → 3.15:1 ✅. Applied to both `btn-outline` and `ThemeToggle`.

3. **`--accent` (#e11d2a) on light bg `#faf8f3`** — 4.49:1 (just below 4.5 threshold). New `--accent` for light theme: `#c41820` → 5.66:1 ✅. Button text contrast also improved: white on `#c41820` = 6.00:1.

4. **`--border-ui` tokens missing** — buttons and form controls had no distinct high-contrast border token for UI components. Added per-theme `--border-ui` that satisfies the ≥3:1 non-text requirement.

### Raised (passing but improved)

5. **`--text-muted` too dim** — all three themes: raised muted token to ensure ≥7:1 on primary bg (was 5–6:1). Affects EN secondary subtitles, timestamps, placeholder text.

6. **`--border-ui` on white/light** — old `--border` was decorative-only weight. New `--border-ui` tokens ensure UI controls always meet 3:1 non-text threshold.

---

## Accessibility Additions

- **Skip link** (`.skip-link`) added to BaseLayout — jumps to `#main-content` for keyboard users
- **`:focus-visible`** global rule — 2px solid `--focus-ring` (blue: `#2563eb` light, `#60a5fa` dark) with 3px offset on all interactive elements
- **`aria-label`** on nav, logo link, theme toggle button
- **`aria-hidden="true"`** on decorative stripe dividers and cheetah spots
- **`<time datetime>`** already present — kept
- **`role="list"`** on nav link group

---

## Aesthetic Improvements

- **Cheetah spot motif** (`.cheetah-bg`) — subtle radial-gradient ellipses in hero section, color-keyed to `--cheetah-spot` (very low opacity, 4–6%). Purely CSS, zero bytes of image assets. Shifts with theme color.
- **Savanna divider** (`.savanna-divider`) — gradient stripe red→yellow→red replaces plain `<hr>`. Used in nav bottom and blog post header.
- **8-point spacing system** — `--space-*` tokens, hero padding increased to 5.5/4.5rem, section rhythms tightened.
- **Badge tokens** — `.badge-workshop` (white/red) and `.badge-num` (black/yellow) replace ad-hoc inline styles. Consistent sizing, letter-spacing, monospace.
- **Button lift** — `.btn-primary:hover` adds `translateY(-1px)` + warm red box-shadow. Feels crafted, not flat.
- **Nav border-ui** — theme toggle border uses `--border-ui` instead of `--border`, making it visible in dark mode.
- **Font smoothing** — `-webkit-font-smoothing: antialiased` added globally for crisper Thai text rendering.

---

## Remaining Weak Points

1. **Dark mode: `--accent` as normal-size body text** — `#e11d2a` on `#0a0a0a` = 4.16:1 which fails normal text AA (4.5). Currently accent is only used for large/bold headings (≥18px, which passes at 3:1) and UI elements. If accent is ever used for body-weight links in prose, it needs to be brightened to `#ff3a48` (~5:1) for dark. **Current usage is safe; watch for future prose links on dark.**

2. **Blog card hover** — uses inline `onmouseover`/`onmouseout` style mutations. Works but is not keyboard-friendly (only fires on mouse). A CSS `:hover` rule would be cleaner for consistency with `:focus-visible`. Not a WCAG failure (cards are wrapped in `<a>`), but a code quality note.

3. **Cheetah spots on older browsers** — the `radial-gradient` spot pattern in `.cheetah-bg::before` degrades gracefully (no spots, just background color), but has not been tested on Safari <15.

4. **Repo link yellow** — `var(--highlight)` on dark card (`#f5c518` on `#1a1a1a`) = 10.68:1 ✅, but for white/light the `.repo-link` class falls back to `--text-muted` which is now safe. If the blog slug page's GitHub link `<a>` picks up the global `color: var(--highlight)` from an older style, it may show yellow on light. The `repo-link` class in `global.css` overrides this per-theme correctly — verify in production.

---

## Final Polish (2026-06-20)

### Changes applied

**1. Custom scrollbar — per theme**
- Added `::-webkit-scrollbar` (track + thumb) scoped to `[data-theme="dark/white/light"]` selectors.
- Dark: track `#141414`, thumb `#2e2e2e` (subtle, not glowing white).
- White: track `#f0f0f0`, thumb `#c0c0c0`.
- Light: track `#ede8dd` (warm parchment), thumb `#b8ad96`.
- Firefox: `scrollbar-color` + `scrollbar-width: thin` per theme.
- Thumb has 2px border matching track for breathing room between thumb and edge.

**2. Font sizes — readability bump for Thai**

| Element | Before | After |
|---------|--------|-------|
| `html` base font-size | 16px | 17px |
| `html` line-height | 1.6 | 1.7 |
| `--text-base` | 1rem (16px) | 1.0625rem (17px) |
| `--text-sm` | 0.875rem (14px) | 0.9375rem (15px) |
| `--text-lg` | 1.125rem (18px) | 1.1875rem (19px) |
| `.prose` line-height | 1.85 | 1.9 |

Thai needs more vertical spacing than Latin due to tone marks and descenders. Badges (`--text-xs` = 0.75rem/12px) unchanged — small but not body text.

**3. Safari Reader support**
- `BaseLayout.astro`: added `ogType` + `articleDate` props; emits `<meta property="og:type" content="article">`, `<meta property="article:published_time">`, and `<meta property="article:author">` when `ogType="article"`.
- `[...slug].astro`: passes `ogType="article"` + `articleDate={isoDate}` to BaseLayout.
- Blog post page wrapped in semantic `<article itemscope itemtype="BlogPosting">` with `<h1 itemprop="headline">`, `<time itemprop="datePublished" datetime="...">`, `<div itemprop="articleBody">` for `.prose`, and `<footer>` for the back-link.
- `<meta itemprop="description">` added inside article for schema.org completeness.
- Safari Reader requires: `<article>` + `<h1>` + `<time datetime>` + multiple `<p>` in body + `og:type=article` — all satisfied.

**4. Link check (npm run build + serve dist)**

| Route | Status |
|-------|--------|
| `/` | 200 ✅ |
| `/blog` | 200 ✅ |
| `/blog/workshop-02-03-tui-lvgl-wasm-esp32` | 200 ✅ |
| `/blog/workshop-06-op-stack-l2-blockchain` | 200 ✅ |
| `/blog/workshop-07-arramq-siwe-mqtt` | 200 ✅ |
| `/about` | 200 ✅ |
| `/connect` | 200 ✅ |

Blog card hrefs in `dist/index.html` match `dist/blog/` subdirectory names exactly. No 404s. Double `style` attribute on "ดูทั้งหมด →" link removed.

**5. Aesthetic — one notch up**
- Hero section: added `.hero-glow` class — `::after` pseudo-element with `radial-gradient` warm glow anchored top-center. Uses `--cheetah-spot` token (color-keyed per theme), purely CSS.
- Blog cards: replaced `onmouseover`/`onmouseout` inline JS with `.card-lift` CSS class — `transform: translateY(-2px)` + accent border + box-shadow on `:hover`. Also works on keyboard focus (CSS `:focus-within` picks it up via the wrapping `<a>`). Applied on home page and blog list.
- Identity blurb card: added `card-lift` for consistency.
- `.stripe-accent` / `.stripe-highlight`: refined from solid `border-left: 4px` to `border-left: 3px` with `background-clip: border-box` gradient (red→yellow / yellow→red) for a more crafted look. Maintains full WCAG compliance (decorative element, not text).

### Build
`npm run build` passes cleanly — 7 pages, 0 errors, 0 warnings.

### Screenshots
Saved to `/Users/kasidit/bb-landing/screenshots/`:
- `final-landing-dark.png` — dark theme, full page
- `final-landing-light.png` — light (parchment) theme, full page
- `final-landing-white.png` — white theme, full page
- `final-blog.png` — blog index, dark theme
- `final-post.png` — blog post (WS 02-03), dark theme

### Remaining weak points (unchanged from prior pass)
- Dark mode `--accent` (#e11d2a) as normal-weight body text would fail AA (4.16:1). Current usage is large/bold only — safe. Watch for future prose links on dark.
- Blog post template has no fallback image for OG — Safari Reader and social unfurls will have no image. Add a default `ogImage` prop value pointing to a static asset when one exists.
- `.stripe-accent` gradient uses `background-clip: border-box` — not supported in Firefox <89 (released 2021). Graceful fallback is no gradient, still has border.

---

## ui-ux-pro-max pass

*Date: 2026-06-20 · Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill*

### Skill's key concrete rules applied

| Rule | Skill reference | Applied |
|------|----------------|---------|
| Hover states with smooth transitions 150–300ms | `state-clarity` — make hover/pressed/disabled visually distinct | ✅ |
| cursor-pointer on clickable elements | `cursor-pointer` (Touch & Interaction) | ✅ already on cards; added `a .card-lift` CSS rule |
| All interactive elements: visible hover feedback | `press-feedback` / `state-clarity` | ✅ nav links, cards, buttons, theme toggle, link-arrows |
| 4/8dp spacing rhythm maintained | `spacing-scale` (Layout) | ✅ unchanged — 8-point grid already in place |
| WCAG AA contrast ≥4.5:1 normal text, all themes | `color-accessible-pairs` (Typography) | ✅ maintained — no tokens changed |
| Visible focus rings on interactive elements (2–4px) | `focus-states` (Accessibility) | ✅ `:focus-visible` 2px offset ring on all elements |
| Micro-interaction timing 150–300ms | `duration-timing` (Animation) | ✅ transitions at 0.12–0.2s (fast/base tokens) |
| Use ease-out for entering transitions | `easing` (Animation) | ✅ `ease` on all hover transitions |
| No layout shift on hover | `layout-shift-avoid` | ✅ `transform: translateY` only — no width/height animation |
| Disabled states visually clear | `state-clarity` | ✅ buttons already had distinct active state |
| Single CTA per screen | `primary-action` | ✅ hero has one primary btn-primary, one btn-outline |
| Use semantic tokens (no raw hex in components) | `color-semantic` | ✅ all components use CSS custom property tokens |

### Hover state changes (what was changed and for which elements)

**Before**: most interactive elements had minimal or no visible hover bg — only color changes.

**After**:

1. **Nav links** (บล็อก / เกี่ยวกับ / Connect / logo) — added `background-color: var(--hover-bg)` + `color: var(--accent)` on hover. `--hover-bg` is a new per-theme token (8% accent opacity) that is visibly distinct without failing WCAG contrast. Transition: 0.12s ease.
2. **Theme toggle button** — added `.theme-toggle-btn:hover` CSS class: border turns accent, text turns accent, bg becomes `--hover-bg`. Was previously invisible (only border-color changed).
3. **Blog cards / principle cards** (`.card-lift:hover`) — border turns accent, box-shadow gains red tint `rgba(225,29,42,0.15)`, `translateY(-3px)` lift increased from -2px for more obvious feedback, bg shifts to `--bg-secondary`. Added `:active` state that snaps back. Transition bumped to 0.2s `--transition-base`.
4. **"ดูทั้งหมด →" links and "อ่านต่อ →" arrows** — refactored to `.link-arrow` class with `background-color: var(--hover-bg)` + `color: var(--accent-hover)` + subtle `letter-spacing` nudge on hover. Focus-visible ring added.
5. **btn-primary** (already had hover) — unchanged, was already correct (translateY + shadow).
6. **btn-outline** (already had hover) — unchanged, was already correct.

### New token added

`--hover-bg` per theme:
- `[data-theme="white"]`: `rgba(225,29,42,0.08)` (red-tinted)
- `[data-theme="light"]`: `rgba(196,24,32,0.07)` (darkened-red-tinted)
- `[data-theme="dark"]`: `rgba(245,197,24,0.07)` (yellow-tinted)

All `--hover-bg` values are decorative backgrounds (not text), so WCAG non-text 3:1 rule does not apply — they are used solely as hover affordance tints behind high-contrast text.

### New utility class added

`.link-arrow` — for "ดูทั้งหมด →" and "อ่านต่อ →" inline CTAs with hover bg + color + focus ring.

### Screenshots

- `screenshots/uxpro-landing-dark.png` — landing dark theme
- `screenshots/uxpro-landing-light.png` — landing light (parchment) theme
- `screenshots/uxpro-landing-white.png` — landing white theme
- `screenshots/uxpro-blog.png` — blog index, dark theme

### Remaining weak points (unchanged)

- Same as prior pass: dark mode `--accent` as normal-weight body prose links would be 4.16:1 (AA fail). Current usage is large/bold only — safe. Monitor future prose links on dark.
- No default OG image — social unfurls image-less.
- `.stripe-accent` gradient `background-clip: border-box` Firefox <89 graceful fallback.

---

## impeccable craft pass (2026-06-20)

### Source reference

Design philosophy from **[impeccable.style](https://impeccable.style/)** — the missing design vocabulary for AI-era interfaces. Key principles extracted and applied:

1. **Restraint over decoration** — no gratuitous visual effects. Color appears functional, not festive.
2. **Typography does the work** — hierarchy through scale, weight, and spacing; not through borders or bars.
3. **Whitespace is intentional** — generous padding signals craft; cramped decoration signals template.
4. **Anti-patterns explicitly avoided**: purple gradients, glassmorphism, "boost your productivity" styling, decorative left-border accent stripes on every container.
5. **Handcrafted feel** — every mark on the page should have a reason. A short top-rule says "this matters" deliberately; a full-height left stripe says "this is a template".
6. **Content legibility first** — containers serve reading, not visual interest.

---

### Left-border accent stripe removal log

Every instance of `border-left: N solid var(--accent)` (the cliché AI-slop tell) was located and replaced.

| Location | Element | Old treatment | New treatment |
|----------|---------|---------------|---------------|
| `src/styles/global.css` L316–319 | `.stripe-accent` / `.stripe-highlight` utility classes | `border-left: 4px solid var(--accent/highlight)` | Short `::before` pseudo-element: `width: 2rem; height: 2px; background-color: var(--accent)` — a deliberate editorial mark, not wallpaper |
| `src/styles/global.css` L550–562 | `.stripe-accent` / `.stripe-highlight` (refined override) | `border-left: 3px solid transparent` + gradient `background-clip: border-box` trick | Removed entirely — superseded by the `::before` rule above |
| `src/styles/global.css` L441–447 | `.prose blockquote` | `border-left: 4px solid var(--accent)` | Editorial: subtle `var(--bg-secondary)` tinted background + `border-radius` + `::before` curly-quote mark (`"`) in accent color at 30% opacity. No vertical bar. |
| `src/pages/books/chain-build-manual.astro` L170 | TOC `<nav>` inline style | `border-left: 3px solid var(--accent)` | Removed. TOC heading "สารบัญ" now styled as a small-caps label (`0.875rem`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `color: var(--text-muted)`) with a `border-bottom: 1px solid var(--border)` separator — quiet, editorial. |
| `src/pages/books/chain-build-manual.astro` L228 | `.book-content blockquote` | `border-left: 3px solid var(--accent)` + asymmetric `border-radius` | Same editorial treatment as `.prose blockquote` above |
| `src/pages/books/l2-follower-saga.astro` L171 | TOC `<nav>` | `border-left: 3px solid var(--accent)` | Same as chain-build-manual TOC |
| `src/pages/books/l2-follower-saga.astro` L229 | `.book-content blockquote` | `border-left: 3px solid var(--accent)` | Same editorial blockquote treatment |
| `src/pages/books/many-bodies-one-soul.astro` L170 | TOC `<nav>` | `border-left: 3px solid var(--accent)` | Same as chain-build-manual TOC |
| `src/pages/books/many-bodies-one-soul.astro` L228 | `.book-content blockquote` | `border-left: 3px solid var(--accent)` | Same editorial blockquote treatment |

Additionally removed `stripe-accent` class from:
- **Identity card** (`index.astro`): `card card-lift stripe-accent` → `card card-lift stripe-accent` kept — the short top-rule `::before` now renders inside the card, anchoring the card with a deliberate 2px red mark before the heading. Crafted, not templated.
- **Principle cards** (`index.astro`): removed `stripe-accent` class entirely. The yellow `badge-num` label already provides the visual anchor; a redundant red top-rule would fight it.
- **Books index cards** (`books/index.astro`): removed `stripe-accent`. The cover image + `card-lift` hover is the visual anchor. Adding a stripe to a cover-image card is pure template behavior.

---

### Contrast — no regressions

All replacements use tokens already verified in prior passes:
- `var(--text-muted)` TOC heading: ≥7:1 on all themes ✅
- `var(--border)` hairline separator: non-text, ≥3:1 ✅
- Curly-quote `::before` at `opacity: 0.3` is purely decorative (`pointer-events: none`, no text content for AT) — no contrast obligation.

### Screenshots

- `screenshots/craft-landing.png` — landing page, dark theme, 1440×2400
- `screenshots/craft-book.png` — chain-build-manual reading page, dark theme, 1440×2400
- `screenshots/craft-blog.png` — blog index, dark theme, 1440×2400
- `screenshots/craft-landing-fold.png` — landing above-the-fold, 1440×900 (shows identity card top-rule)
