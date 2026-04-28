# Responsive Pages Plan — Adaptive-First Mobile

## Philosophy Shift

Previous approach (rejected): take the desktop layout and squeeze it into mobile via media queries — stacking, hiding, scrolling. This produced cramped pages that were neither responsive nor adaptive.

New approach: **Mobile is a distinct product surface.** Pages render different markup, different navigation, and different interaction primitives below the mobile breakpoint. Desktop and tablet remain dense and information-rich. Mobile becomes task-focused with mode rails, bottom action bars, full-screen sheets, and drawers.

Adaptive vs responsive in this project:

| | Responsive | Adaptive (this plan) |
| --- | --- | --- |
| Source of truth | CSS media queries reflowing one DOM | Alpine viewport store + conditional templates |
| Mobile layout | Stacked desktop blocks | Purpose-built mobile UI (mode rail, bottom sheet, stepper) |
| Composite components | Same DOM, different widths | Mobile/desktop variants picked by `$store.viewport` |
| Tables | Horizontal scroll | Card list + bulk-mode bar |
| Editors | Multi-panel shrunk | Mode tabs (Structure / Edit / Preview / Settings) |
| Modals | Centered, smaller | Full-screen sheet with sticky header/footer |
| Filters | Inline | Bottom sheet drawer |

## Breakpoints

- `mobile`: ≤767px — adaptive markup, single primary task per screen, 44px touch targets, full-bleed.
- `tablet`: 768–1023px — compact desktop with drawers for secondary panels; sidebar collapses.
- `desktop`: 1024–1279px — full product UI, compact sidebar.
- `wide`: ≥1280px — current rich layouts, controlled max-widths.

## Foundation Deliverables

### 1. Viewport store (`design-system/utils/viewport-store.js`)

A single Alpine store, registered once at SPA boot and on every standalone page. Drives all adaptive decisions in JS — no duplicated `window.innerWidth` checks.

```js
Alpine.store('viewport', {
  mode: 'desktop',          // 'mobile' | 'tablet' | 'desktop' | 'wide'
  isMobile: false,
  isTablet: false,
  isTouch: false,
  init() { /* matchMedia listeners */ }
});
```

Exposed helpers:
- `$store.viewport.isMobile` — for `x-if`, `x-show`, `:class`.
- Body class mirror: `body.is-mobile`, `body.is-tablet`, etc., for CSS-only rules.
- Custom event `viewport:change` for vanilla web components.

### 2. Adaptive primitives (CSS + Alpine recipes)

Documented patterns, each with a desktop/tablet/mobile reference implementation:

- **`adaptive-shell`** — full-bleed mobile, padded desktop. No nested wrapper padding on mobile.
- **`adaptive-mode-rail`** — horizontal segmented control at the top of mobile editor/report routes (replaces vertical tab lists).
- **`adaptive-bottom-bar`** — fixed primary actions on mobile only; static footer on desktop.
- **`adaptive-sheet`** — modal that opens centered on desktop and full-screen-from-bottom on mobile. Sticky header (title + close) and sticky footer (primary CTA).
- **`adaptive-drawer`** — sidebar/filter panel that is always-visible on desktop, collapsible on tablet, bottom sheet on mobile.
- **`adaptive-list`** — `<table>` on desktop, card list on mobile via `x-if="$store.viewport.isMobile"` swap.
- **`adaptive-stepper`** — wizard renders all sections on desktop; on mobile splits into discrete steps with sticky Next/Back.
- **`adaptive-toolbar`** — wraps icon controls into a horizontal scroller on tablet, collapses to bottom-bar on mobile.

### 3. Web component contract

Every composite component (`webropol-survey-action-tabs`, `webropol-survey-edit-toolbar`, `webropol-survey-helper-toolbar`, `webropol-survey-structure-panel`, `webropol-page-quick-actions`, etc.) must:

1. Have `display: block; width: 100%; min-width: 0` at the host level.
2. Listen for `viewport:change` and re-render the adaptive variant when crossing the mobile boundary, OR expose a `variant="mobile|desktop"` attribute set from the page.
3. Never assume parent flex direction or padding. Each component owns its own internal layout.

### 4. SPA shell rules

- `#app-content` is full-bleed on mobile (no `max-w-*`, no horizontal padding); padded on tablet+.
- One scroll owner per route. Default: `main`. Editor/report routes may delegate to an inner workspace, but only one.
- `body.route-*` classes drive route-specific overrides; `body.is-mobile` drives adaptive switches.
- After SPA injection, call `Alpine.initTree(#app-content)` and re-emit `viewport:change` so newly mounted components pick up the current mode.

## Implementation Order

1. **Foundation** — viewport store, body class mirror, primitive CSS, component contract enforcement on the 5 composites already in the editor.
2. **Surveys editor** — flagship adaptive: mode rail (Structure / Edit / Preview / Settings), bottom action bar, full-screen sheets for question settings.
3. **Surveys list** — adaptive table↔card swap, folder drawer becomes bottom sheet, bulk-select mode.
4. **Surveys report** — KPI overview cards on mobile, per-question accordion cards, charts as full-width with "open detail sheet".
5. **SMS list / edit / report** — reuse surveys primitives.
6. **Create flow** — adaptive stepper.
7. **Admin tables, MyWebropol library, shop** — list-to-card swaps, bottom action bars.
8. **Remaining routes** — apply primitives module by module.
9. **Email/newsletter templates** — separate track, email-client constraints.

## Page-by-Page (Adaptive Specs)

For each active page below: **Desktop** keeps current density. **Tablet** uses drawers. **Mobile** is the explicit adaptive design.

### `index.html` (SPA shell + home)

- Desktop/Tablet: current dashboard, 4→2 column cards.
- **Mobile (adaptive)**: single-column quick-action hub. Activity feed becomes a horizontal "today" rail of insight chips with tap-to-open sheets. Floating create button replaces the wide CTA row. No header dropdowns occlude content.
- Foundation work: viewport store init, full-bleed `#app-content`, sidebar drawer trigger in mobile header.

### `create/index.html`

- Desktop: wizard with side preview.
- **Mobile (adaptive)**: 4-step adaptive stepper — Type → Method → Basics → Review. Method cards become full-width selectable rows. Sticky bottom bar with Back / Continue. Generated AI content scrolls inside its step only.

### `surveys/index.html`

- Mobile: single-column action cards, page heading reduced, primary CTA full-width.

### `surveys/list.html`

- **Mobile (adaptive)**:
  - Folder sidebar → bottom-sheet drawer triggered by a top "Folder: …" pill.
  - Survey table → adaptive-list cards (title, status badge, owner avatar, language count, kebab actions).
  - Bulk select → explicit "Select" mode toggle that swaps the top bar for a sticky bottom action bar (Move / Share / Delete / Export).
  - Filter chips above the list, advanced filters in another bottom sheet.

### `surveys/edit.html` (flagship)

- **Mobile (adaptive)** — not a stacked desktop:
  - Top: compact title + status (1 line), kebab for "More".
  - **Mode rail** (segmented): Structure · Edit · Preview · Settings. Only one mode visible at a time.
  - Structure mode: full-screen reorderable list of pages/questions, tap to jump.
  - Edit mode: question canvas full-bleed, helper toolbar collapses into a single contextual button row.
  - Preview mode: respondent-style preview in viewport.
  - Settings mode: grouped accordions.
  - **Bottom bar** (fixed): primary action depends on mode (Add Question / Save / Share). Floating create button hidden when bottom bar is active.
  - All settings panels open as adaptive-sheets (full-screen from bottom).
- Composite components updated to render mobile variant when `$store.viewport.isMobile`.

### `surveys/blank-survey.html`

- Mobile: guided first-question flow. Add Question is the only CTA. Templates accessible via a sheet.

### `surveys/report.html`

- **Mobile (adaptive)**:
  - Overview KPI cards (responses, completion %, avg time).
  - Question list as accordion cards; each opens its chart full-width with a "View detail" sheet for cross-tabs/raw data.
  - Filters and chart options in a bottom sheet.
  - No horizontal scrolling tables; matrix questions get their own scroll-bound region inside a sheet.

### `surveys/aita.html`, `surveys/ai-survey.html`

- Mobile: prompt-first single column. Results as cards. Advanced options in a sheet. Sticky Run/Generate button.

### `surveys/collect*.html`, `surveys/follow.html`, `surveys/preview.html`

- Mobile: stepped flow for collect; recipient/follow tables become cards; preview matches respondent viewport.

### `sms/index.html` · `sms/list.html` · `sms/edit.html` · `sms/collect.html` · `sms/follow.html` · `sms/report.html` · `sms/aita.html`

- Mirror surveys patterns. Editor uses Compose → Recipients → Preview → Schedule mode rail with phone preview as full-screen sheet.

### `events/list.html` (route fixed)

- Mobile: event cards with date, registrations, status; create-new is full-screen sheet.

### `admin-tools/*`

- Index: search-first, chips, single-column cards.
- User management: user cards + select-mode bottom bar; edit opens full-screen sheet.
- Folder rights: choose folder → manage rights, two screens with back navigation (no side-by-side panels on mobile).
- Do-not-contact: contact cards, full-screen import sheet.

### `mywebropol/*`

- Index: search + chip tabs + single-column cards.
- Widgets: create modal full-screen with single-column choices.
- Library: complete table→card conversion with sticky bulk bar.

### `shop/*`

- Index: category chips, single-column product cards, sticky cart action.
- SMS credits: package selector cards, checkout as bottom sheet.
- Product detail: shared template, accordion features, sticky CTA.

### Other modules

`dashboards/`, `bi-dashboards/`, `case-management/`, `news/`, `training-videos/`, `branding/`, `promo/`, `webroai/`, `ai-assistant/`, `exw/`, `analytics-monitor.html`, `404.html` — apply primitives. Charts use bounded aspect ratios and a "View data" sheet on mobile. Detail surfaces (case detail, article, video) become full-screen views with back navigation.

`mobile-apps/mobile.direct.html` — already mobile-minded; validate desktop scaling and small-phone fit.

### Email / Newsletter / Campaign templates

`email/**`, `newsletter/**`, `campaigns/**` — separate track with email-client constraints (table layouts, inline styles, conservative media queries). Out of scope for adaptive Alpine work.

### Demos, examples, prototypes

`design-system/demos/**`, `examples/**`, `design-gen/**`, `animation/**`, `cp/**` — after foundation. Use as visual fixtures for components.

## QA Checklist (per page)

- Standalone URL and SPA hash route both load without console errors.
- Alpine viewport store reports correct mode at 320 / 375 / 414 / 768 / 1024 / 1280 / 1536 px.
- Mobile shows the adaptive variant — not a stacked desktop. Verify by toggling viewport and confirming markup branches in `x-if`.
- No horizontal page scroll. Inner scroll regions are bounded and intentional.
- Composite web components render mobile variant when `body.is-mobile`.
- Modals/drawers/sheets open and close, trap focus, restore scroll, and respond to Escape and backdrop tap.
- Bottom action bars do not overlap floating buttons or system gesture areas; floating button hides when a bottom bar is active.
- Forms use 16px inputs and 44px touch targets on mobile.
- Header z-index stays below modal overlay z-index in both standalone and SPA mode.

## Definition of Done

- Adaptive primitives shipped and documented under `design-system/docs/adaptive/`.
- All composite components in the editor and report routes implement the variant contract.
- Surveys edit / list / report fully adaptive on mobile and validated in SPA + standalone.
- SMS, create, admin, mywebropol, shop pages migrated to primitives.
- QA checklist passes on each active route.
- Email/newsletter and prototype pages either updated, tagged non-production, or tracked separately.
