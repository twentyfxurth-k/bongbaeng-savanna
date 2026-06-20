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
