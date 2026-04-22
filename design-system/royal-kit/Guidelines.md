# Webropol Platform Guidelines

This project is the **Homepage of the Webropol Survey SaaS Platform**. Webropol is a SaaS platform for survey creation, distribution, and analysis. It enables users to design surveys, collect responses, and monitor results through reporting tools, plus AI-powered text analysis for actionable summaries.

**Treat Webropol as a platform, not a website.**

---

## 1. Design System — MUST READ

Before making any UI changes, read:

- [WebropolRoyalDesignSystem Guidelines](../src/WebropolRoyalDesignSystem/guidelines/Guidelines.md)

All visual work must conform to the Webropol Royal Design System tokens, color palette, and typography.

---

## 2. Kit Components — Use These First

Never hand-roll layout markup when a kit component exists. Kit lives in `src/app/components/ui/`:

| Component | Purpose |
|-----------|---------|
| `Sidebar` | Left navigation shell — collapsible, sticky logo + footer, scrollable middle, scroll shadows, no horizontal scroll |
| `TopHeader` | Sticky top bar — Create New RoyalButton dropdown, icon actions, user menu; supports `scrolled` prop for shadow |
| `NavigationLink` | Single nav item (icon + label), supports `collapsed` and `isActive` |
| `Button` | Primary / secondary / tertiary / outlined / success / destructive / icon variants, `shape="rounded"` for pill |
| `RoyalButton` | Purple gradient CTAs — `dark`, `light`, `secondary`, `tertiary` variants |
| `FeatureCard` | Homepage card with icon, title, button (`outline` or `tertiary`), optional image / background / badge |
| `Banner` | Page banner — `regular` or `outlined`, icon, title, description, up to two buttons, close |
| `Tabs` | Inline-flex tab group, selected = primary/300, hover = primary/200 |
| `DropdownMenu` | Menu built on `NavigationLink`; pass `{ id, label, icon }[]` |
| `Modal` | Generic dialog — vertical/horizontal orientation, icon circle, actions via `Button` |
| `SignIn` | Full sign-in page — logo header, language switcher, username/password, remember-me, SSO |
| `FAIcon` | Font Awesome wrapper — `weight` = `light` (default) / `solid` / `regular` |

**Rule:** if a new UI piece is reused more than once, add it to `src/app/components/ui/` instead of inlining.

---

## 3. Color & Interaction Tokens

| Role | Token | Hex |
|------|-------|-----|
| Primary | primary/500 | `#1e6880` |
| Hover surface | primary/200 | `#B0E8F1` |
| Selected / active surface | primary/300 | `#79D6E7` |
| Light surface | primary/50 | `#EEFBFD` |
| Neutral border | neutral/300 | `#D1D5D6` |
| Accent bg (banner icon) | accent/100 | `#FFE5D4` |
| Accent fg (banner icon) | accent/600 | `#EF2F07` |
| Destructive | `#BE1241` |
| Success | `#1A7E4A` |

**Interaction rules:**
- Nav / tabs / icon buttons / secondary + tertiary buttons: **hover = primary/200**, **selected/active = primary/300**.
- Cards hover effect: shadow only (`0px 10px 24px rgba(39,42,43,0.15)`), no scale or color shift.
- Focus ring: dark `#1e6880` border (treat as focus state, not hover).

---

## 4. Icons

- Always use **Font Awesome** icons via the `<FAIcon />` kit component — never inline `<i>` tags.
- Kit script: `https://kit.fontawesome.com/50ef2d3cf8.js`
- Default weight is `fa-light`. Use `weight="solid"` for filled CTAs (e.g. `circle-plus` on Create New), `weight="regular"` where the design calls for it.
- Sidebar canonical icons:
  - Home `home`, Surveys `user-magnifying-glass`, Events `microphone-stand`, 2-way SMS `comment-sms`, EXW `user`, BI dashboards `chart-simple`, Case management `list-check`, Case form setup `split`, eTests `graduation-cap`, Assessments `chart-pie`, Touch tablets `tablet-screen-button`, Direct mobile `mobile`, Course feedback `comment-smile`, MyWebropol `books`, Admin tools `screwdriver-wrench`, Training videos `clapperboard-play`, Shop `cart-shopping`, Contact Us `headset`.

---

## 5. Internationalisation — Required

The platform ships in three locales: **English (`en`)**, **Finnish (`fi`)**, **Swedish (`sv`)**.

- All user-facing strings **must** live in `src/app/i18n.ts` under the matching section (`nav`, `header`, `createNewItems`, `user`, `cards`, `banners`, `activity`, `badges`, `language`, `signIn`, …).
- Every key added to `en` **must** also be added to `fi` and `sv`. Never leave a locale missing.
- Read strings inside components via the `useT()` hook (from `src/imports/Home.tsx`) or `translations[language]`. Never hardcode UI copy.
- The app is wrapped in `LanguageContext.Provider` in `Home.tsx`; new pages/components that render text must live inside that context.
- The language can be changed from the user menu → language item, which opens the `Modal`-based `LanguageModal`.

---

## 6. Layout Rules

- **Sidebar:** logo + collapse button at top are sticky, Contact Us is sticky at bottom. Middle nav list scrolls vertically only (no horizontal scroll). Scroll shadow appears on the sticky parts when there is more content to scroll in that direction.
- **TopHeader:** sticky at `top-0 z-30`. Gains a drop shadow once the main content scrolls down (`scrolled` prop).
- **Cards:** equal height (`self-stretch`), thin white border (`border border-white`), rounded 8px, shadow-only hover.
- **Buttons:** always `inline-flex flex-row items-center justify-center gap-[8px]` so icon + label sit on one row, centred as a group.
- **Banners:** `outlined` variant uses transparent background with `#D1D5D6` border; icon circle is `#FFE5D4` bg + `#EF2F07` icon.

---

## 7. Typography

- Headings: `Roboto Condensed Bold`.
- Body / UI copy: `Roboto Regular` / `Roboto Medium`.
- Do **not** apply Tailwind font-size / font-weight / line-height utilities (e.g. `text-2xl`, `font-bold`, `leading-none`) unless the user explicitly asks to change them — rely on the kit components' baked-in type.

---

## 8. General

- Do **not** use emojis anywhere (UI, code, commits).
- Prefer editing existing files over creating new ones; only add a new file when a new reusable component is introduced.
- Always import raster images with the `figma:asset/...` scheme (no path prefix). SVGs come from `src/imports/...` via relative path.
- When creating new images use `ImageWithFallback` from `src/app/components/figma/ImageWithFallback.tsx`.

---

## 9. Agent Instructions

When asked to extend the homepage or build new pages:

1. **Identify** the kit component that matches the need before writing JSX. If none fits, add the component to `src/app/components/ui/` so it can be reused.
2. **Wire** every string through `src/app/i18n.ts` in all three locales — en, fi, sv — and read via `useT()`.
3. **Respect** the color / hover / selected tokens above. Do not introduce new colors without adding them to the design system.
4. **Respect** layout shell rules: sticky logo + Contact Us in sidebar, sticky TopHeader with `scrolled` shadow, cards with thin white border and shadow-only hover.
5. **Confirm** icons exist in Font Awesome and match the canonical sidebar mapping where relevant.
