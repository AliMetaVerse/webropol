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

> Full ramps below mirror the Tailwind config in `index.html` (`webropol-*` and the unprefixed `primary` / `neutral` aliases). The **Purpose** column flags shades with a documented semantic role; unflagged shades are part of the ramp and available for custom compositions.

### Primary (brand teal) — `webropol-primary` / `primary`

| Token | Hex | Semantic purpose | Usage frequency |
|-------|-----|------------------|-----------------|
| primary/50 | `#EEFBFD` | Secondary-button surface, subtle brand tint | Common |
| primary/100 | `#D5F4F8` | — | — |
| primary/200 | `#B0E8F1` | **Hover** surface for nav / tabs / icon buttons / secondary+tertiary buttons | Very common |
| primary/300 | `#79D6E7` | **Selected / active** surface for nav / tabs / dropdown row | Very common |
| primary/400 | `#3FBCD5` | — | — |
| primary/500 | `#209FBA` | Filled CTA bg, brand text, active nav icon | Very common |
| primary/600 | `#1D809D` | — | — |
| primary/700 | `#1E6880` | Button hover text, darker brand surface | Occasional |
| primary/800 | `#215669` | — | — |
| primary/900 | `#204859` | Active button state | Rare |
| primary/950 | `#102E3C` | — | — |

**Decision tree for a teal surface**
1. Is the element in the **selected / active** state? → `primary/300`.
2. Is this a **hover** state? → `primary/200`.
3. Is this a **resting secondary** surface? → `primary/50`.
4. Is this a **filled brand CTA**? → `primary/500`.

### Neutral — `webropol-gray` / `neutral`

| Token | Hex | Purpose |
|-------|-----|---------|
| neutral/0 | `#FFFFFF` | Cards, header, sidebar background |
| neutral/50 | `#F9FAFA` | — |
| neutral/100 | `#F3F4F4` | Page background (main content area) |
| neutral/200 | `#E6E7E8` | Subtle borders, closed badge bg |
| neutral/300 | `#D1D5D6` | Default border (banner outline, dividers, input) |
| neutral/400 | `#B5BBBD` | — |
| neutral/500 | `#9BA2A4` | Disabled text |
| neutral/600 | `#787F81` | — |
| neutral/700 | `#61686A` | — |
| neutral/800 | `#515557` | Body text, heading text |
| neutral/900 | `#45484A` | — |
| neutral/950 | `#272A2B` | — |

### Accent (warm orange) — `webropol-accent`

| Token | Hex | Purpose |
|-------|-----|---------|
| accent/50 | `#FFF4ED` | — |
| accent/100 | `#FFE5D4` | Banner icon circle bg, sign-in icon circle bg |
| accent/200 | `#FFC8A8` | — |
| accent/300 | `#FFA171` | — |
| accent/400 | `#FF6429` | — |
| accent/500 | `#FE4911` | — |
| accent/600 | `#EF2F07` | Banner icon fg, sign-in icon fg |
| accent/700 | `#C61E08` | — |
| accent/800 | `#9D1A0F` | — |
| accent/900 | `#7E1910` | — |
| accent/950 | `#440806` | — |

### Status — Success (green) — `webropol-success`

| Token | Hex | Purpose |
|-------|-----|---------|
| success/50 | `#F5FAF3` | — |
| success/100 | `#E8F4E4` | — |
| success/200 | `#CFE9C9` | Published badge bg |
| success/300 | `#A9D69F` | — |
| success/400 | `#69B259` | — |
| success/500 | `#579F48` | Success Button fill |
| success/600 | `#448237` | — |
| success/700 | `#38672E` | — |
| success/800 | `#305229` | — |
| success/900 | `#284423` | — |
| success/950 | `#11240F` | — |

### Status — Warning (amber) — `webropol-warning`

| Token | Hex | Purpose |
|-------|-----|---------|
| warning/50 | `#FFFAE9` | — |
| warning/100 | `#FEF2C7` | — |
| warning/200 | `#FDE38A` | — |
| warning/300 | `#FCCE4D` | Draft badge bg |
| warning/400 | `#FBB924` | — |
| warning/500 | `#F5980B` | — |
| warning/600 | `#D97106` | — |
| warning/700 | `#B44E09` | — |
| warning/800 | `#923C0E` | — |
| warning/900 | `#78320F` | — |
| warning/950 | `#451803` | — |

### Status — Danger / Error (red) — `webropol-danger` / `webropol-error`

> `webropol-danger` and `webropol-error` share the same ramp.

| Token | Hex | Purpose |
|-------|-----|---------|
| danger/50 | `#FFEBED` | — |
| danger/100 | `#FFE4E7` | Destructive outline Button bg |
| danger/200 | `#FECDD4` | — |
| danger/300 | `#FDA4B2` | — |
| danger/400 | `#FB7189` | — |
| danger/500 | `#F43F63` | Destructive Button fill, notification dot |
| danger/600 | `#E11D4E` | — |
| danger/700 | `#BE1241` | — |
| danger/800 | `#9F123D` | — |
| danger/900 | `#88133A` | — |
| danger/950 | `#4C051B` | — |

### Status — Info (blue) — `webropol-info`

| Token | Hex | Purpose |
|-------|-----|---------|
| info/50 | `#EFF6FF` | — |
| info/100 | `#DBEAFE` | — |
| info/200 | `#BFDBFE` | — |
| info/300 | `#93C5FD` | — |
| info/400 | `#60A5FA` | — |
| info/500 | `#3B82F6` | Informational state fill |
| info/600 | `#2563EB` | — |
| info/700 | `#1D4ED8` | — |
| info/800 | `#1E40AF` | — |
| info/900 | `#1E3A8A` | — |

### Royal — Violet — `webropol-royalViolet`

| Token | Hex | Purpose |
|-------|-----|---------|
| royalViolet/50 | `#F1E9FB` | RoyalButton light variant gradient start |
| royalViolet/100 | `#D5BEF4` | — |
| royalViolet/200 | `#BA92EC` | — |
| royalViolet/300 | `#9E67E5` | — |
| royalViolet/400 | `#8C50E0` | — |
| royalViolet/500 | `#823BDD` | RoyalButton dark variant gradient start |
| royalViolet/600 | `#6922C4` | — |
| royalViolet/700 | `#511A98` | RoyalButton text / border |
| royalViolet/800 | `#3A136D` | — |
| royalViolet/900 | `#230B41` | — |
| royalViolet/950 | `#0C0416` | — |

### Royal — Blue — `webropol-royalBlue`

| Token | Hex | Purpose |
|-------|-----|---------|
| royalBlue/50 | `#EEF2FF` | RoyalButton light variant gradient end |
| royalBlue/100 | `#E0E7FF` | — |
| royalBlue/200 | `#C7D2FE` | — |
| royalBlue/300 | `#A5B4FC` | — |
| royalBlue/400 | `#818CF8` | — |
| royalBlue/500 | `#6366F1` | — |
| royalBlue/600 | `#4F46E5` | RoyalButton dark variant gradient end |
| royalBlue/700 | `#4338CA` | — |
| royalBlue/800 | `#3730A3` | — |
| royalBlue/900 | `#312E81` | — |
| royalBlue/950 | `#1E1B4B` | — |

### Royal — Turquoise — `webropol-royalTurquoise`

| Token | Hex | Purpose |
|-------|-----|---------|
| royalTurquoise/50 | `#ECFEFF` | — |
| royalTurquoise/100 | `#CFFAFE` | — |
| royalTurquoise/200 | `#A5F3FC` | — |
| royalTurquoise/300 | `#67E8F9` | — |
| royalTurquoise/400 | `#22D3EE` | — |
| royalTurquoise/500 | `#06B6D4` | — |
| royalTurquoise/600 | `#0891B2` | — |
| royalTurquoise/700 | `#0E7490` | — |
| royalTurquoise/800 | `#155E75` | — |
| royalTurquoise/900 | `#164E63` | — |
| royalTurquoise/950 | `#083344` | — |

### Royal gradient recipes

| Recipe | Tokens | Purpose |
|--------|--------|---------|
| Dark royal gradient | `royalViolet/500 → royalBlue/600` (`#823BDD → #4F46E5`) | RoyalButton dark variant |
| Light royal gradient | `royalViolet/50 → royalBlue/50` (`#F1E9FB → #EEF2FF`) | RoyalButton light variant |
| Royal text / border | `royalViolet/700` (`#6922C4`) | RoyalButton label & outline |

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
