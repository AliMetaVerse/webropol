# Responsive Pages Plan

This plan makes the Webropol app usable across desktop widths, tablets, and mobile. The goal is not only to stack layouts at smaller widths. Several screens need adaptive mobile experiences where the interaction model changes: tables become cards, filters become drawers, editors become stepped workspaces, and reports move from dense inspection to readable summaries with drill-downs.

## Target Viewports

- Mobile: 320-767px, touch-first, one task per screen, 44px minimum touch targets.
- Tablet: 768-1023px, compact navigation, two-column layouts where useful, drawers for secondary panels.
- Desktop: 1024-1279px, full product UI with compact sidebar behavior.
- Wide desktop: 1280px and above, current rich desktop layouts with controlled max widths.

## Success Rules

- No page-level horizontal scrolling except intentional data/chart scrollers inside a clearly bounded region.
- Header, sidebar, breadcrumbs, modals, floating button, and SPA route scroll behavior work the same in standalone and hash-routed mode.
- Text, buttons, badges, tabs, cards, and modal headers do not overlap or clip at 320px, 375px, 414px, 768px, 1024px, 1280px, and 1536px.
- Desktop remains dense and efficient. Mobile becomes task-focused rather than a squeezed version of desktop.
- Reuse the existing Webropol design system, Tailwind utilities, Alpine.js, and FontAwesome. No framework or build-tool additions.

## Shared Foundation Work

1. Normalize the responsive foundation.
   - Import `design-system/styles/mobile-responsive.css` in every active standalone app page, not only the SPA shell.
   - Consider splitting it into `responsive-core.css` and `responsive-spa.css` so standalone pages get safe layout rules without SPA-only assumptions.
   - Reconcile the mobile z-index scale with the modal rules. Keep headers below modals, keep the mobile drawer above page content, and avoid header z-index values that can cover modal overlays.

2. Standardize the shell.
   - Use `flex h-screen` or `min-h-dvh` wrappers with `min-w-0` on the content column.
   - Keep one vertical scroll owner per route. For normal pages it should be `main`; for report/editor pages it may be the app workspace if explicitly required.
   - Keep `webropol-sidebar` or `webropol-sidebar-enhanced` plus `webropol-header-enhanced` consistent across modules.
   - Breadcrumbs should wrap or hide secondary crumbs on mobile, not force width.

3. Add reusable responsive primitives.
   - `responsive-page-shell`: standard main padding and max-width behavior.
   - `responsive-toolbar`: wraps controls on tablet and becomes a horizontal scroller or bottom action bar on mobile.
   - `responsive-data-list`: desktop table plus mobile card/list variant.
   - `responsive-filter-panel`: desktop sidebar, tablet drawer, mobile bottom sheet.
   - `responsive-modal`: desktop centered modal, mobile full-screen sheet with sticky header/footer.
   - `responsive-tabs`: scrollable tablist with stable touch targets.
   - `responsive-chart-frame`: aspect-ratio bounded chart container with mobile summary fallback.

4. Define adaptive patterns.
   - List pages: desktop folder/sidebar plus table; tablet collapsible folder drawer; mobile filter button plus cards.
   - Editors: desktop multi-panel; tablet drawer side panels; mobile stepped modes such as Structure, Edit, Preview, Settings.
   - Reports: desktop dashboards and tables; tablet collapsible controls; mobile insight cards with chart/table drill-down.
   - Product/shop pages: desktop grid; tablet two-column; mobile category chips, product cards, and sticky cart/action area.
   - Admin pages: desktop management tables; mobile entity cards and explicit bulk-action mode.

5. Verification workflow.
   - Use the SPA route and standalone URL for pages that support both.
   - Test at 320, 375, 414, 768, 1024, 1280, and 1536px.
   - Open every modal, dropdown, tab row, table, chart, drawer, and floating menu at each relevant breakpoint.
   - Confirm keyboard focus order and Escape/backdrop behavior for drawers and modals.

## Implementation Order

1. Shared shell and components: responsive CSS import strategy, z-index scale, sidebar/header, floating create menu, modal sheet behavior, tabs.
2. High-traffic app routes: home, create, surveys list/edit/report, SMS list/edit/report, admin index, MyWebropol index, shop index.
3. Remaining active routes: AI pages, collection/follow pages, events, dashboards, news, training, branding, EXW, case management.
4. Standalone management pages: user management, do-not-contact, folder rights, MyWebropol library, shop product pages.
5. Email/newsletter templates, demos, examples, experiments.

## Active Route Plan

### SPA Shell and Home

Page: `index.html`

- Current role: SPA shell, home dashboard, route host, global imports.
- Desktop: keep current sidebar/header/content composition; ensure content column has `min-w-0`; keep dashboard cards at 4 columns on wide desktop and 3 or 4 depending on available sidebar width.
- Tablet: sidebar should use compact/tablet behavior; dashboard cards go to 2 columns; activity tabs remain horizontally scrollable; breadcrumbs may hide if route-editor-tabs is active.
- Mobile adaptive: home becomes a quick-action hub with one-column cards, compact activity feed, and full-screen mobile modals. Floating create menu must not cover bottom content or modal actions.
- Key work: import and refine responsive CSS here first, remove duplicate header import, reconcile SPA report/editor scroll rules with page-level needs, and validate all home modals.

### Create Flow

Page: `create/index.html`

- Current role: central creation wizard for survey, event, SMS, and related items.
- Desktop: preserve max-width wizard layout and card choices; keep preview/help side content visible where available.
- Tablet: two-column method cards; wizard steps remain visible but compressed; long generated content scrolls inside the step content only when needed.
- Mobile adaptive: convert to a step-by-step flow: choose type, choose method, configure basics, review. Method cards become full-width selectable rows. Primary action is sticky at the bottom.
- Key work: reduce fixed horizontal padding, make prompt/result blocks wrap, keep generated priority tags and validation messages from overflowing.

### Surveys Landing

Page: `surveys/index.html`

- Desktop: keep three-card management grid and optional survey cards.
- Tablet: two-column cards with consistent heights.
- Mobile responsive: single-column cards; page heading left-aligned or centered consistently; buttons full-width; optional survey list becomes compact cards.
- Key work: add shared responsive CSS import, reduce large `p-8` card padding on small screens, ensure card descriptions and buttons do not force overflow.

### Surveys List

Page: `surveys/list.html`

- Desktop: keep folder sidebar plus survey table/content area.
- Tablet adaptive: turn the `w-80` folder sidebar into a collapsible drawer or top folder selector. Keep table columns reduced and filters accessible from a toolbar.
- Mobile adaptive: replace the desktop table with survey cards showing title, status, language count, owner, and primary actions. Folder navigation becomes a bottom sheet or full-screen drawer. Bulk selection becomes an explicit selection mode with sticky bottom actions.
- Key work: change `.flex gap-6` main layout to stack/drawer under `lg`; add `min-w-0` to content; provide a mobile card renderer instead of relying only on `overflow-x-auto`.

### Survey Editor

Page: `surveys/edit.html`

- Desktop: keep full editor workspace with navigation, canvas, toolbars, and settings panels.
- Tablet adaptive: side panels become drawers; canvas remains central; toolbar wraps into grouped icon controls.
- Mobile adaptive: use modes: Structure, Question, Preview, Settings. Show one mode at a time. Use a bottom toolbar for add/preview/save, and full-screen sheets for question settings and add-question flows.
- Key work: audit every fixed-height and fixed-width panel, keep only one scroll container, ensure modal z-index works in standalone and `#/surveys/edit`, and avoid canvas controls overlapping the header.

### Blank Survey

Page: `surveys/blank-survey.html`

- Desktop: keep as a simplified editor/onboarding surface.
- Tablet: same adaptive panel behavior as the editor, but with fewer visible controls.
- Mobile adaptive: guided first-question flow with add-question CTA, template suggestions, and preview as a separate mode.
- Key work: share editor responsive primitives so blank survey does not diverge.

### Survey Report

Page: `surveys/report.html`

- Desktop: preserve dense report controls, charts, tables, and color controls.
- Tablet adaptive: filters and chart settings collapse into drawers; charts maintain bounded aspect ratios; data tables hide secondary columns where possible.
- Mobile adaptive: show report overview cards first, then question-by-question cards. Charts become full-width with a button to open a detailed chart/table sheet. Long tables use card rows unless exact matrix comparison requires horizontal scroll.
- Key work: follow the existing note that report pages need careful scroll ownership and non-clipping wrappers for chart color popups. Reconcile this with the SPA `route-surveys-report` overflow rules before changing page content.

### Survey AI Text Analysis

Page: `surveys/aita.html`

- Desktop: keep prompt/input area, result cards, and configuration panels visible.
- Tablet: configuration moves to a side drawer; results remain readable in one or two columns.
- Mobile adaptive: prompt-first workflow. Advanced options move to a sheet. Results are grouped as cards with expandable details and sticky run/export actions.
- Key work: prevent long generated labels and insight text from expanding cards; make result tables card-based.

### AI Survey Creator

Page: `surveys/ai-survey.html`

- Desktop: keep prompt, generated structure, and preview side by side where space allows.
- Tablet: prompt above generated outline; preview in a drawer or tab.
- Mobile adaptive: wizard with Generate, Review, Edit, Preview steps. Generated questions become editable accordion cards.
- Key work: avoid horizontal overflow in generated question controls and keep regeneration actions reachable.

### Survey Collection

Pages: `surveys/collect.html`, `surveys/collect/email-survey.html`, `surveys/collect/private.html`

- Desktop: keep distribution settings, recipient/source panels, and preview areas.
- Tablet: split setup and preview into tabs or drawers.
- Mobile adaptive: sender/recipient setup becomes a guided flow. Recipient lists become cards. Email/private-link previews open full-screen.
- Key work: make recipient tables adaptive, keep form fields at 16px minimum on iOS, and ensure collection modals use mobile full-screen sheets.

### Survey Follow-Up

Page: `surveys/follow.html`

- Desktop: keep campaign status table and actions.
- Tablet: reduce visible columns and move filters to a drawer.
- Mobile adaptive: respondent/campaign cards with delivery status, response state, and quick actions. Timeline/history opens in detail view.
- Key work: define mobile status cards and sticky bulk action behavior.

### Survey Preview

Page: `surveys/preview.html`

- Desktop: keep preview canvas and control toolbar.
- Tablet: controls wrap and preview width is bounded.
- Mobile adaptive: actual preview should occupy the viewport like a respondent experience; editor-only controls collapse into a top/bottom bar.
- Key work: avoid nested fixed-width preview frames on real mobile.

### Survey Create Legacy Pages

Pages: `surveys/create/index.html`, `surveys/create/create-legacy.html`, `surveys/create/create-legacy-new.html`

- Desktop: keep only if still needed; otherwise redirect to `create/index.html`.
- Tablet/mobile: match the central create flow patterns.
- Key work: decide whether these are active. If they remain, import responsive CSS and convert large choice grids to mobile rows.

## SMS Plan

### SMS Landing

Page: `sms/index.html`

- Desktop: keep feature cards and stat row.
- Tablet: cards at two columns, stats at two columns.
- Mobile responsive: feature cards and stats stack, with credits/campaign status first.
- Key work: import responsive CSS and make the floating button spacing safe.

### SMS List

Page: `sms/list.html`

- Desktop: keep campaign table and filters.
- Tablet adaptive: filters collapse; secondary columns hide.
- Mobile adaptive: campaign cards with name, status, audience size, delivery rate, and primary actions. Filters become chips plus a sheet.
- Key work: match `surveys/list.html` list primitives so SMS and surveys behave consistently.

### SMS Editor

Page: `sms/edit.html`

- Desktop: keep editor plus phone/message preview.
- Tablet adaptive: settings and preview switch between tabs/drawers.
- Mobile adaptive: compose message first, recipients second, preview third, schedule/review fourth. Phone preview opens full-screen instead of sitting beside the form.
- Key work: ensure message counters, recipient controls, and CTA buttons stay visible and do not overlap the header or bottom controls.

### SMS Collection

Page: `sms/collect.html`

- Desktop: keep collection setup panels.
- Tablet: panels become two-column or tabbed.
- Mobile adaptive: stepper for audience, message, automation, review. Long recipient lists become cards.
- Key work: share recipient-list pattern with survey collection.

### SMS Follow-Up

Page: `sms/follow.html`

- Desktop: delivery/follow-up table.
- Tablet: reduced table with drawer filters.
- Mobile adaptive: delivery status cards and message timeline details.
- Key work: maintain quick resend/follow-up actions as sticky mobile actions.

### SMS Report

Page: `sms/report.html`

- Desktop: report charts and tables.
- Tablet: charts in two columns, filters in drawer.
- Mobile adaptive: KPI cards first, chart details second, recipient/message detail cards third.
- Key work: reuse survey report chart/table responsive primitives.

### SMS AI Text Analysis

Page: `sms/aita.html`

- Desktop/tablet/mobile: mirror `surveys/aita.html`, but prioritize message text, sentiment, and response clustering.
- Key work: share AI result card patterns.

## Events Plan

### Events Route

Pages: `events/list.html`, `events/events.html`

- Important route issue: `spa-router.js` currently maps `/events` to `events/index.html`, but this file is not present. Decide whether to create `events/index.html`, route `/events` to `events/list.html`, or retire `events/events.html`.
- Desktop: event list/table plus create modal.
- Tablet adaptive: filters in drawer, event cards or reduced table.
- Mobile adaptive: event cards with date, registration count, status, and primary action. Create-new modal becomes a full-screen sheet with one-column choices.
- Key work: fix the route mismatch before responsive QA, then align list/create behavior with surveys and SMS.

## Admin Tools Plan

### Admin Tools Index

Page: `admin-tools/index.html`

- Desktop: keep searchable categorized cards and tab filters.
- Tablet: two-column cards, horizontal scroll tabs.
- Mobile responsive: one-column cards, search first, tabs as chips/scroller, keyboard hint hidden.
- Key work: import responsive CSS, verify search shell width, and avoid card text clipping.

### Admin Dashboard Variant

Page: `admin-tools/index-dash.html`

- Desktop: keep dashboard widgets and categorized cards.
- Tablet: widgets at two columns, cards at two columns.
- Mobile responsive: widgets become compact KPI cards, categories stack, search/filter controls stay sticky if useful.
- Key work: reduce nested section spacing and validate large card grids.

### User Management

Pages: `admin-tools/user-management.html`, `admin-tools/user-manage-list.html`

- Desktop: keep table/list management with filters and bulk actions.
- Tablet adaptive: hide secondary columns, filters in drawer.
- Mobile adaptive: user cards with role/status/group, explicit selection mode for bulk actions, detail/edit full-screen sheet.
- Key work: table-to-card conversion, sticky bulk bar, mobile-friendly role/group selectors.

### Survey Folder Rights

Page: `admin-tools/survey-folder-rights.html`

- Desktop: keep two-panel rights management.
- Tablet adaptive: left folder/tree and right permissions switch to tabs or drawer.
- Mobile adaptive: choose folder first, then manage users/rights in a second screen. Large permissions modal becomes full-screen.
- Key work: remove reliance on side-by-side panels below `lg`, and ensure `max-w-7xl` modal can become full-screen on mobile.

### Do-Not-Contact

Page: `admin-tools/do-not-contact.html`

- Desktop: keep active/archived lists and add modal.
- Tablet: lists stack if needed; action row wraps.
- Mobile adaptive: contact cards with status, selection mode, and full-screen add/import sheet.
- Key work: make active/archived tabs touch-friendly and avoid fixed action bars.

## MyWebropol Plan

### MyWebropol Index

Page: `mywebropol/index.html`

- Desktop: keep search, tabs, resource cards/widgets.
- Tablet: two-column cards and scrollable tabs.
- Mobile responsive: search at top, tabs as chips, resource cards one column.
- Key work: ensure search meta and keyboard hints collapse, and tabs do not overflow.

### MyWebropol Widgets

Page: `mywebropol/index-widgets.html`

- Desktop: keep widget dashboard and create modal.
- Tablet: widget grid two columns, modal choices two columns.
- Mobile adaptive: widgets one column; create modal full-screen with single-column choices and sticky close/action area.
- Key work: replace `grid-cols-2 md:grid-cols-4` modal grid on mobile.

### MyWebropol Library

Page: `mywebropol/lib/library.html`

- Desktop: keep table with responsive hidden columns already partly implemented.
- Tablet: reduce table columns and keep filters accessible.
- Mobile adaptive: use existing mobile info pattern as full card view, not just hidden metadata inside a table row. Bulk action bar becomes sticky bottom.
- Key work: finish table-to-card behavior and selection mode.

### Layout Templates

Page: `mywebropol/layout-templates.html`

- Desktop: keep template browsing grid.
- Tablet: two-column templates.
- Mobile responsive: one-column template cards with preview images constrained by aspect ratio.
- Key work: ensure template previews do not force horizontal scroll.

## Shop Plan

### Shop Index

Page: `shop/index.html`

- Desktop: keep product/category grid and help panel.
- Tablet: two-column product grid, category filter row scrolls.
- Mobile adaptive: category chips at top, product cards one column, cart/primary action sticky when relevant, help block moves below products.
- Key work: import responsive CSS, replace hardcoded Slate/Primary classes with Webropol tokens over time, and verify floating button overlap.

### SMS Credits

Page: `shop/sms-credits.html`

- Desktop: pricing/credit packages and purchase controls.
- Tablet: two-column package cards.
- Mobile adaptive: package selector cards, checkout/review as a bottom sheet or stepped flow.
- Key work: make pricing and quantity controls touch-friendly.

### Product Detail Base and Product Pages

Pages: `shop/product-base.html`, `shop/products/bi-view.html`, `shop/products/ai-text-analysis.html`, `shop/products/etest.html`, `shop/products/360-assessments.html`, `shop/products/direct-mobile-feedback.html`, `shop/products/direct.html`, `shop/products/analytics.html`, `shop/products/case-management.html`, `shop/products/wott.html`

- Desktop: consistent product detail layout with feature content and CTA area.
- Tablet: media/content stack or two-column depending on density.
- Mobile responsive: product identity and primary CTA visible in the first viewport; feature lists become accordions; CTA can become sticky if page is long.
- Key work: create one responsive product template and apply it to every product page rather than tuning each separately.

## Other App Modules

### Dashboards

Page: `dashboards/index.html`

- Desktop: dashboard cards and report entry points.
- Tablet: two-column card layout.
- Mobile adaptive: dashboard list cards with KPI snippets and quick open actions.
- Key work: use responsive chart/card primitives if charts are embedded.

### BI Dashboards

Pages: `bi-dashboards/index.html`, `bi-dashboards/dash.html`, `bi-dashboards/login.html`

- Desktop: preserve dashboard density.
- Tablet: chart grid two columns.
- Mobile adaptive: KPI summary first, charts as swipe/stacked sections, detail tables in sheets.
- Key work: chart containers need stable aspect ratios and no clipped legends.

### EXW

Page: `exw/index.html`

- Desktop: keep module landing/dashboard layout.
- Tablet/mobile: follow the surveys landing pattern unless EXW has specialized tables.
- Key work: import shared responsive CSS and validate grids.

### Case Management

Page: `case-management/index.html`

- Desktop: keep case overview and queues.
- Tablet adaptive: queue/sidebar becomes drawer.
- Mobile adaptive: case cards with status, owner, priority, due date, and quick actions. Case detail opens as a full-screen view.
- Key work: avoid desktop-only queue tables on mobile.

### News

Page: `news/index.html`

- Desktop: keep news grid/list.
- Tablet: two-column cards.
- Mobile responsive: one-column news cards, category chips, readable article previews.
- Key work: constrain media and long titles.

### Training Videos

Page: `training-videos/index.html`

- Desktop: video catalog grid with filters.
- Tablet: two-column video cards.
- Mobile adaptive: one-column video cards, filters as chips/sheet, video player full-width with stable aspect ratio.
- Key work: prevent embedded video frames from exceeding viewport width.

### Branding

Page: `branding/branding.html`

- Desktop: keep brand settings and previews.
- Tablet adaptive: settings and preview become tabs.
- Mobile adaptive: edit fields first, preview in a separate full-screen tab/sheet, color pickers touch-friendly.
- Key work: make preview panels bounded and avoid color control overflow.

### Promo

Page: `promo/index.html`

- Desktop: keep promotional management layout.
- Tablet/mobile: card/grid patterns with stacked actions.
- Key work: validate modals and long promotional text.

### WebroAI and AI Assistant

Pages: `webroai/index.html`, `ai-assistant/index.html`

- Desktop: keep assistant/config panels.
- Tablet: side panels collapse.
- Mobile adaptive: chat/prompt screen first, settings in a sheet, results as cards.
- Key work: prompt input and result panels need keyboard-safe mobile behavior.

### Mobile Apps

Page: `mobile-apps/mobile.direct.html`

- Desktop/tablet/mobile: this should already be mobile-minded, but still validate desktop scaling and small-phone fit.
- Key work: check first viewport, touch targets, and no horizontal scroll.

### Analytics Monitor

Page: `analytics-monitor.html`

- Desktop: keep monitoring dashboard.
- Tablet: reduce grid density.
- Mobile adaptive: status cards first, event/log tables as cards or drill-down sheets.
- Key work: avoid raw log tables overflowing the viewport.

### 404

Page: `404.html`

- Desktop/tablet/mobile: simple centered error state.
- Key work: make actions full-width on mobile and ensure shell navigation works if present.

## Email, Newsletter, and Campaign Templates

Pages include `email/**`, `newsletter/**`, `campaigns/christmas-news25.html`, and `campaign-manager/email-campaign-classic.html`.

- These should be treated separately from app pages because email responsiveness depends on email-client constraints.
- Use email-safe responsive patterns: table layouts where needed, inline styles, conservative media queries, and image widths with `max-width: 100%`.
- Validate at 320, 375, 414, and common desktop email widths around 600-700px.
- Campaign manager/editor pages should follow app shell rules, but the email output itself should follow email-client rules.

## Design System Demos and Examples

Pages include `design-system/demos/**`, `examples/**`, `misc/add-image-modal.html`, `design-gen/**`, `animation/**`, `cp/**`, and prototype folders.

- Do these after shared components are fixed.
- Use demos as visual regression fixtures for components: button, card, modal, tabs, dropdown, table/list, chart/report, floating button, navigation.
- Prototype pages can be grouped by ownership before implementation. Only production or referenced demos should block the responsive release.

## Page QA Checklist

For each page, mark these before calling it done:

- Standalone URL loads without console import errors.
- SPA hash route loads if the page is routed.
- Desktop 1024, 1280, and 1536px have no clipped content and keep efficient density.
- Tablet 768 and 1024px use compact navigation and do not force horizontal page scroll.
- Mobile 320, 375, and 414px have no overlap, clipped text, or unreachable action.
- Header dropdowns, sidebar drawer, tabs, modals, and floating button work by touch and keyboard.
- Tables either become cards or use intentional inner scrolling with sticky context where needed.
- Charts have bounded aspect ratios and readable legends/tooltips.
- Forms use 16px input text on mobile and have 44px touch targets.
- Empty, loading, error, and long-content states were checked.

## Definition of Done

- All active SPA routes pass the QA checklist in standalone and SPA mode.
- All high-traffic standalone pages pass the QA checklist.
- Shared responsive primitives are documented in the design system docs or README.
- Remaining demos/prototypes are either updated, tagged as non-production, or tracked separately.