# Vietnam AI Overview Atlas — design system

The Atlas is a research-publication dashboard, not a product UI. The visual system is built around editorial primitives — eyebrow → title → finding-stat → chart — drawn from Pew Research, NYT Upshot, Stripe Press, Linear, and Distill.pub.

This document is the source of truth for what's allowed in the codebase. If you're tempted to add a new color, font size, or component, check whether one already exists here first.

---

## 1. Tokens

All tokens live in `src/app/globals.css` under `:root` and are registered as Tailwind v4 utility classes via `@theme inline`. **Never** introduce raw `slate-*`, `zinc-*`, or `gray-*` utilities — they fight the token system.

### 1.1 Color

A 9-step gray ramp + ONE accent + state semantics. That's it.

| Token | Hex | Use |
|---|---|---|
| `--color-page` | `#fafafa` | Page background |
| `--color-card` | `#ffffff` | Card / sidebar surface |
| `--color-card-2` | `#f4f4f5` | Subtle surface (hover, alt rows) |
| `--color-line` | `#e4e4e7` | Default border |
| `--color-line-strong` | `#d4d4d8` | Hover / focus border |
| `--color-ink` | `#18181b` | Primary text |
| `--color-ink-2` | `#52525b` | Secondary text, labels |
| `--color-ink-3` | `#71717a` | Axis ticks, captions |
| `--color-ink-4` | `#a1a1aa` | Placeholders, sub-text |
| `--color-accent` | `#4f46e5` | Electric indigo |
| `--color-accent-hover` | `#4338ca` | Hover state |
| `--color-accent-tint` | `#eef2ff` | Backgrounds, active nav |
| `--color-accent-ring` | `rgba(79,70,229,.30)` | Focus ring |
| `--color-positive` | `#16a34a` | Positive delta only |
| `--color-negative` | `#dc2626` | Negative delta only |
| `--color-warning` | `#d97706` | Warning state only |

**Rule:** state colors are reserved for state. Never use `text-positive` to "make a stat green because green looks good."

### 1.2 Type

Two families. No serif. No third axis.

- `--font-sans` → Inter (display + body + UI). Tight tracking on display sizes.
- `--font-mono` → JetBrains Mono (every number-bearing surface).

Type scale — anything outside this list is a bug:

| Size | Weight | Use |
|---|---|---|
| 11px | 700, uppercase, tracked 0.18em | Eyebrow labels |
| 12px | 400 | Captions, source lines, axis ticks |
| 13px | 400 | Sidebar links, footer |
| 14px | 400/500 | Secondary UI |
| 16px | 400/500 | Body |
| 17–18px | 400 | Lead paragraph, takeaway |
| 20px | 600 | h3 / KPI value |
| 24–28px | 600/700 | Section subtitle |
| 28–36px | 700 | Finding title (h2) |
| 44–64px | 700 | Hero (h1) |
| 56–64px | 700, accent | Headline keyStat |

Number presentation:
- `.font-mono-num` — JetBrains Mono + tabular numerals (axis ticks, table cells).
- `.font-num` — Inter + tabular + tight tracking (prose-adjacent numbers).

Always render numbers through the `<Num>` component (see §2) — never raw `.toFixed()` or `.toLocaleString()` in JSX.

### 1.3 Spacing

Geist 8pt grid. Forbidden values: `5, 7, 9, 10, 11`.

- Section gaps: 48 or 64 (`py-12 md:py-16`)
- Card padding: 16 or 24 (`p-4` / `p-6`)
- Inline gaps: 8 or 12 (`gap-2` / `gap-3`)

### 1.4 Motion

| Token | Value | Use |
|---|---|---|
| `--motion-fast` | 120ms | Color, focus ring |
| `--motion-base` | 150ms | Shadows, borders |
| `--motion-slow` | 200ms | Background-size sweeps |
| `--motion-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Everything |

**Never use `transition-all`.** A global rule in `globals.css` transitions only `background-color`, `color`, `border-color`, `box-shadow`. Add explicit per-property transitions for anything else.

`prefers-reduced-motion: reduce` short-circuits all animations.

### 1.5 Focus ring

The single highest-leverage polish move. Applied globally via:

```css
:where(button, a, input, select, textarea, [role="button"], [role="option"]):focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-page),       /* inner gap */
    0 0 0 4px var(--color-accent-ring); /* the ring */
}
```

Stacked `box-shadow` means **no layout shift** when the ring appears. Inherits `border-radius`. Works on every interactive element automatically.

---

## 2. Components

All primitives live in `src/components/ui/`. Page-level composition lives in `src/components/`.

### 2.1 `<Eyebrow>` — small caps label

Used 30+ times. Three tones:

```tsx
<Eyebrow tone="accent">finding 1</Eyebrow>   // accent indigo
<Eyebrow tone="muted">findings</Eyebrow>     // ink-3
<Eyebrow tone="ink">2026 atlas</Eyebrow>     // ink-2
```

### 2.2 `<Num>` — number formatting

Single source of truth. Replaces all ad-hoc `.toFixed()` / `.toLocaleString()`.

```tsx
<Num value={231365} format="count" />              // "231,365"
<Num value={80.8} format="pct" precision={1} />    // "80.8%"
<Num value={4.71} format="ratio" suffix="×" />     // "4.71×"
<Num value={2.8} format="pp-delta" />              // "+2.8pp"
<Num value={NaN} format="pct" />                   // "—"
```

Named `Num` (not `Number`) so the JS global `Number()` constructor remains usable.

`<MonoNum>` is the same component pre-set with `font-mono-num` for axis ticks and table cells.

### 2.3 `<Icon>` — Lucide wrapper

Locks stroke-width to `1.75`, sizes to `14 | 16 | 20 | 24`. Color via `currentColor`.

```tsx
import { Quote } from "lucide-react";
<Icon name={Quote} size={14} />
```

**Never** import a Lucide icon into a component without going through `<Icon>` — keeps stroke and size invariant across the app.

### 2.4 `<Button>` — three variants

```tsx
<Button variant="primary">Apply filter</Button>    // filled accent
<Button variant="secondary">Clear</Button>         // bordered card
<Button variant="ghost">Skip</Button>              // text + hover tint
```

Sizes: `sm` (h-7) and `md` (h-9). No `lg` — large CTAs aren't part of the editorial language.

### 2.5 `<Stat>` and `<DataRow>`

Both render eyebrow + tabular number. Use:
- `<Stat>` for prominent stat blocks (hero KPI, F2 metrics).
- `<DataRow>` for editorial definition lists (`<dt>/<dd>`) — tighter, more dignified.

### 2.6 `<Card>`

Wrapper with token-aware border + optional `hover` affordance. Reserved for grouped content (e.g. F6 vertical-by-vertical citation tables). **Not** the primary layout primitive — most of the dashboard is hairline-divider-driven, not card-driven.

### 2.7 `<Select>` and `<SegmentedToggle>`

Custom replacements for native `<select>` and `<button>` toggles.

- `<Select>` — popover with token-aware list, ChevronDown icon, focus ring.
- `<SegmentedToggle>` — pill row, accent fill on active.

### 2.8 `<EmptyState>`, `<ErrorState>`, `<Skeleton>`

State primitives. Always render *inside* a `<FindingCard>` so the surrounding chrome (eyebrow, title, takeaway) survives.

---

## 3. Patterns

### 3.1 Hero

NYT Upshot pattern: eyebrow → giant editorial h1 → lede paragraph → metadata strip (definition list, two columns).

```tsx
<header>
  <Eyebrow tone="accent">2026 atlas · preliminary</Eyebrow>
  <h1 className="font-display-tight text-[44px] md:text-[64px] font-bold">…</h1>
  <p className="text-[18px] md:text-[20px] text-ink-2 leading-relaxed max-w-2xl">…</p>
  <dl className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-2xl">
    <DataRow label="Total queries" value={…} format="count" />
    …
  </dl>
</header>
```

### 3.2 `<FindingCard>` — every finding

Standardized order: eyebrow → title → optional keyStat → takeaway → chart/data.

The keyStat block is the design's biggest typographic move (56–64px accent number). Reserve it for findings with one clear headline number; null findings (F4) and pure-grid findings (F2, F6) skip it.

```tsx
<FindingCard
  id="f1"
  eyebrow="finding 1"
  title="AI Overviews appear 2.5× more often on long-tail queries."
  keyStat={{
    value: <Num value={80.8} format="pct" />,
    label: "of 10+ word queries get an AIO",
  }}
  takeaway="Bottom-funnel commercial keywords are now AIO-saturated …"
>
  <ChartFigure …>
    <BarV data={…} format="pct" />
  </ChartFigure>
</FindingCard>
```

### 3.3 `<ChartFigure>` — every chart

Wraps every chart with: optional eyebrow → title → subtitle → chart → source line. Encodes the publication pattern in one component.

### 3.4 Charts (Visx)

All charts use Visx, not Recharts. Theming lives in `src/lib/chartTheme.ts`. Universal rules:

- Gridlines: horizontal only, 1px, `var(--color-line)`.
- Axes: no axis line on top/right. Bottom and left: 1px `var(--color-line-strong)`.
- Tick marks: none. Just the numeral, 11px, mono, tabular.
- Tick density: 4–6 max. Round numbers only.
- Bar bandwidth: 60–70%.
- Bar color: `var(--color-ink-2)` default, `var(--color-accent)` for highlighted series.
- Lines: 2px stroke. No markers unless <8 data points.

### 3.5 Number formatting rules per context

- Counts (rows, citations, projects): `format="count"` — `231,365`.
- Percentages displayed as percent: `format="pct"` precision 1 by default; precision 0 in tight cells; precision 2 only for very small deltas (<1%).
- Ratios / multiples: `format="ratio"` — `4.71×`.
- Deltas vs baseline: `format="pp-delta"` — `+2.8pp` / `−2.8pp` (note the typographic minus).
- Raw integers: `format="raw"` — `459`.

---

## 4. Voice

### 4.1 Capitalization

- **Eyebrow labels** — lowercase, tracked, accent or muted. Examples: `finding 1`, `by the numbers`, `headline finding`.
- **Titles** — sentence case, never Title Case. The finding title states the result, not its category. *"AI Overviews appear 2.5× more often on long-tail queries"*, not *"AIO Presence by Query Length"*.
- **Buttons** — sentence case, no terminal punctuation.

### 4.2 Numbers in prose

Numbers always live in their format context. **Never** write `80.8 percent`. Prefer `80.8%` rendered through `<Num>`. Currency, durations, and compound units may bypass `<Num>` if they're rare and stand alone.

### 4.3 Citations and sources

Every chart carries a source line. Format: `Source: SEONGON SERP-tracking pipeline · YYYY-MM-DD → YYYY-MM-DD`. Vietnamese: `Nguồn: hệ thống tracking SERP của SEONGON · …`.

---

## 5. Bilingual rules

The dashboard ships in English and Vietnamese. UI strings live in `src/lib/i18n.ts` and route through the `tx(lang, key)` helper.

### 5.1 Vietnamese typography

Vietnamese has many combining diacritics (`̀ ́ ̉ ̃ ̂ ̆`). At display sizes (32px+), some clusters can clash with line-height or letter-spacing:

- Verify `leading-[1.04]` at 64px hero title in VI before shipping any change to display-size leading.
- Eyebrow at 11px works fine in VI — diacritics are tested against the `0.18em` tracking and `1.2` leading.
- Numbers are font-agnostic; mono numerals look identical EN/VI.

If diacritics ever clash, increase line-height first, tracking second, font-size third (in that order).

### 5.2 Translation conventions

- Finding titles are translated by intent, not literally. Vietnamese tends to be longer — copy is sometimes shortened to fit `max-w-3xl`.
- Eyebrow words follow standard SEO industry usage in Vietnamese: `phát hiện` (finding), `truy vấn` (query), `trích dẫn` (citation), `ngành` (vertical).

---

## 6. What's *not* allowed

- ❌ Raw `slate-*` / `zinc-*` / `gray-*` utility classes.
- ❌ `transition-all`, `duration-300`, decorative shadows beyond focus rings.
- ❌ Native `<select>` or `<input type="checkbox">` — always use the UI primitives.
- ❌ Raw `.toFixed()` / `.toLocaleString()` in JSX — go through `<Num>`.
- ❌ Inline Lucide imports — go through `<Icon>`.
- ❌ Arbitrary `text-[XYZrem]` font sizes — use the type scale.
- ❌ More than one accent color. Indigo is the only chromatic color.
- ❌ Decorative emojis in UI text.
- ❌ Recharts. Visx only.

If you need to break a rule, leave a comment explaining why so the next contributor doesn't undo it.
