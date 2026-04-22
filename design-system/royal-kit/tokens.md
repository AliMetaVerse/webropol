# Token Guidelines

Tokens are the named colour / spacing / radius values that make the Webropol Royal Design System consistent. Always reach for a token name before hardcoding a hex.

---

## Naming pattern

- **Colour tokens** follow `<role>/<shade>` where shade is `50–950` (lighter → darker) for the primary ramp, or semantic (`accent/100`, `neutral/300`, `danger`, `success`).
- **Spacing tokens** follow the 4-px base scale: `4, 8, 12, 16, 20, 24, 32, 48, 64`.
- **Radius tokens**: `sm = 4px`, `md = 8px`, `lg = 16px`, `pill = 99px`, `full = 9999px`.
- **Shadow tokens** are named after their purpose (`card-hover`, `dropdown`, `modal`, `sticky-top`, `sticky-bottom`).

When writing Tailwind arbitrary values, use the hex from the ramp below rather than inventing a new colour.

---

## Colour tokens

### Primary (brand teal)

| Token | Hex | Semantic purpose | Usage frequency |
|-------|-----|------------------|-----------------|
| primary/50 | `#EEFBFD` | Secondary-button surface, subtle brand tint | Common |
| primary/200 | `#B0E8F1` | **Hover** surface for nav / tabs / icon buttons / secondary+tertiary buttons | Very common |
| primary/300 | `#79D6E7` | **Selected / active** surface for nav / tabs / dropdown row | Very common |
| primary/500 | `#1E6880` | Filled CTA bg, brand text, active nav icon | Very common |
| primary/700 | `#215669` | Button hover text, darker brand surface | Occasional |
| primary/900 | `#204859` | Active button state | Rare |

**Decision tree for a teal surface**
1. Is the element in the **selected / active** state? → `primary/300`.
2. Is this a **hover** state? → `primary/200`.
3. Is this a **resting secondary** surface? → `primary/50`.
4. Is this a **filled brand CTA**? → `primary/500`.

### Neutral

| Token | Hex | Purpose |
|-------|-----|---------|
| neutral/0 | `#FFFFFF` | Cards, header, sidebar background |
| neutral/100 | `#EBF4F7` | Page background (main content area) |
| neutral/200 | `#E6E7E8` | Subtle borders, closed badge bg |
| neutral/300 | `#D1D5D6` | Default border (banner outline, dividers, input) |
| neutral/500 | `#61686A` | Disabled text |
| neutral/800 | `#272A2B` | Body text, heading text |

### Accent (warm)

| Token | Hex | Purpose |
|-------|-----|---------|
| accent/100 | `#FFE5D4` | Banner icon circle bg, sign-in icon circle bg |
| accent/600 | `#EF2F07` | Banner icon fg, sign-in icon fg |

### Status

| Token | Hex | Purpose |
|-------|-----|---------|
| success/500 | `#1A7E4A` | Success Button fill |
| success/200 | `#A9D69F` | Published badge bg |
| warning/300 | `#FCCE4D` | Draft badge bg |
| danger/500 | `#BE1241` | Destructive Button fill, notification dot |
| danger/100 | `#FFE4E7` | Destructive outline Button bg |

### Royal gradient (purple)

| Token | Hex | Purpose |
|-------|-----|---------|
| royal/500 → royal/600 | `#823BDD → #4F46E5` | RoyalButton dark variant gradient |
| royal/100 → royal/200 | `#F1E9FB → #EEF2FF` | RoyalButton light variant gradient |
| royal/700 | `#6922C4` | RoyalButton text / border |

---

## Spacing tokens

Use the 4-px scale for all gaps, paddings, and margins:

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64
```

**Frequency**
- `8 / 12` — inside components (icon ↔ label, dropdown rows).
- `16 / 24` — between components in a row (cards, banners).
- `24 / 32` — between page sections.

**Avoid** non-scale values like `10`, `14`, `18`, `30` — round to the nearest scale step.

---

## Radius tokens

| Name | Value | Where |
|------|-------|-------|
| radius/sm | `4px` | Icon buttons, nav tiles, badges, inputs |
| radius/md | `8px` | Cards, banners, modals, list items |
| radius/pill | `99px` | Pill buttons |
| radius/full | `9999px` | Icon circles, avatars |

Decision:
1. Is it interactive text/icon tile? → `sm`.
2. Is it a container? → `md`.
3. Is it a pill CTA? → `pill`.
4. Is it a circle? → `full`.

---

## Shadow tokens

| Name | Value |
|------|-------|
| shadow/card-hover | `0px 10px 24px rgba(39, 42, 43, 0.15)` |
| shadow/dropdown | `0px 10px 24px rgba(39, 42, 43, 0.12)` |
| shadow/banner | `0px 2px 8px rgba(39, 42, 43, 0.08)` |
| shadow/sticky-top | `0px 4px 8px rgba(39, 42, 43, 0.08)` |
| shadow/sticky-bottom | `0px -4px 8px rgba(39, 42, 43, 0.08)` |
| shadow/modal | `0px 20px 40px rgba(39, 42, 43, 0.2)` |

---

## Typography tokens

| Token | Font | Weight | Size / line height |
|-------|------|--------|--------------------|
| type/heading-xl | Roboto Condensed | Bold | 24 / 28 |
| type/heading-lg | Roboto Condensed | Bold | 23 / 32 |
| type/heading-md | Roboto Condensed | Bold | 20 / 24 |
| type/heading-sm | Roboto Condensed | Bold | 18 / 24 |
| type/body | Roboto | Regular | 14 / 20 |
| type/label | Roboto | Medium | 14 / 20 |
| type/meta | Roboto | Regular | 13 / 20 |

---

## Common mistakes

**Don't** introduce a new hex for a "slightly different teal" — reuse the existing primary shade or extend the ramp in the design system.

**Don't** use `primary/300` for a hover state — `primary/300` is **selected** only; hover is `primary/200`.

**Don't** use `gray-500` / `slate-500` Tailwind defaults for neutrals — use the neutral palette above so colour stays consistent with the rest of the app.

**Don't** set custom shadows for hover — reuse `shadow/card-hover` so all cards animate identically.

**Don't** use fractional radii. Stick to the 4-px-aligned scale above.
