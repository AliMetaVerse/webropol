# Webropol Analytics Inventory

This inventory lists all SPA routes (hash-based) and standalone HTML files, and flags analytics script coverage so you can track everything consistently.

Notes
- SPA shell (index.html) already includes scripts/analytics-global-tracker.js; routed pages loaded into the shell will be tracked automatically.
- The SPA router skips injecting analytics scripts from routed pages to prevent double-counting.
- Standalone pages (opened directly, not via SPA) should include the global tracker themselves.

## SPA routes (path → file)
- / → index.html
- /home → index.html
- /surveys → surveys/index.html
- /surveys/list → surveys/list.html
- /surveys/edit → surveys/edit.html
- /surveys/report → surveys/report.html
- /surveys/aita → surveys/aita.html
- /events → events/index.html
- /events/list → events/list.html
- /sms → sms/index.html
- /exw → exw/index.html
- /case-management → case-management/index.html
- /mywebropol → mywebropol/index.html
- /news → news/index.html
- /admin-tools → admin-tools/index.html
- /admin-tools/user-management → admin-tools/user-management.html
- /training-videos → training-videos/index.html
- /shop → shop/index.html
- /shop/sms-credits → shop/sms-credits.html
- /shop/products/bi-view → shop/products/bi-view.html
- /shop/products/ai-text-analysis → shop/products/ai-text-analysis.html
- /shop/products/etest → shop/products/etest.html
- /shop/products/360-assessments → shop/products/360-assessments.html
- /shop/products/direct-mobile-feedback → shop/products/direct-mobile-feedback.html
- /shop/products/analytics → shop/products/analytics.html
- /shop/products/case-management → shop/products/case-management.html
- /shop/products/wott → shop/products/wott.html
- /create → create/index.html
- /design-system → design-system/index.html
- /promo → promo/index.html

All target files exist. SPA tracking: Covered by shell + router.

## Standalone HTML files (tracked = includes global tracker)
- Top-level
  - index.html — tracked (shell)
  - 404.html — missing
  - analytics-monitor.html — missing (dashboard/utility)
  - analytics-integration-snippet.html — example doc (not meant to track)
  - spa-diagnostic.html — missing (diagnostic tool)

- admin-tools/
  - index.html — tracked
  - user-management.html — tracked (also SPA route)
  - user-manage-list.html — tracked

- case-management/
  - index.html — tracked (also SPA route)

- cp/
  - cp.html — tracked
  - login.html — missing

- create/
  - index.html — tracked (also SPA route)

- dashboards/
  - index.html — tracked

- design-system/
  - index.html — missing (SPA route covers when loaded via shell)
  - components/tabs/tabs.html — missing
  - components/tabs/modern-tabs-showcase.html — missing

- events/
  - events.html — tracked (legacy/standalone)
  - list.html — tracked (also SPA route)

- exw/
  - index.html — tracked (also SPA route)

- examples/
  - create-calcs.html — tracked
  - group-rules.html — tracked
  - nested-list.html — tracked
  - preview-crowlers.html — tracked

- misc/
  - add-image-modal.html — tracked

- mywebropol/
  - index.html — tracked (also SPA route)
  - library.html — tracked

- news/
  - index.html — tracked (also SPA route)

- promo/
  - index.html — tracked (also SPA route)

- shop/
  - index.html — tracked (also SPA route)
  - product-base.html — tracked (base/demo)
  - sms-credits.html — tracked (also SPA route)
  - products/
    - 360-assessments.html — tracked (also SPA route)
    - ai-text-analysis.html — tracked (also SPA route)
    - analytics.html — tracked (also SPA route)
    - bi-view.html — tracked (also SPA route)
    - case-management.html — tracked (also SPA route)
    - direct-mobile-feedback.html — tracked (also SPA route)
    - direct.html — tracked (standalone)
    - etest.html — tracked (also SPA route)
    - wott.html — tracked (also SPA route)

- sms/
  - index.html — tracked (also SPA route)

- surveys/
  - index.html — tracked (also SPA route)
  - list.html — tracked (also SPA route)
  - edit.html — tracked (also SPA route)
  - report.html — tracked (also SPA route)
  - follow.html — tracked (standalone; not routed)
  - aita.html — tracked (also SPA route)
  - collect.html — tracked (standalone; not routed)
  - collect/private.html — tracked (standalone)
  - create/
    - index.html — tracked (used by /create)
    - create-legacy.html — tracked (standalone)
    - create-legacy-new.html — tracked (standalone)
  - questions/settings/auto-suggest.html — tracked (standalone/doc)

- training-videos/
  - index.html — tracked (also SPA route)

- webroai/
  - index.html — tracked (standalone; not routed)

Email templates under email/ are out of scope for web analytics (no tracker needed).

## Pages missing the analytics tracker (recommended to add)
- 404.html (consider tracking 404 hits)
- spa-diagnostic.html (optional; diagnostic tool)
- analytics-monitor.html (optional; admin utility)
- cp/login.html (optional; if you want login page tracked)
- design-system/index.html (optional; SPA covers it when routed; add if opened directly)
- design-system/components/tabs/tabs.html (docs/demo)
- design-system/components/tabs/modern-tabs-showcase.html (docs/demo)

## Correct snippet to add
Use the right relative path per folder depth:
- From repo root pages (e.g., index.html):
  <script src="scripts/analytics-global-tracker.js"></script>
- From first-level subfolders (e.g., surveys/index.html):
  <script src="../scripts/analytics-global-tracker.js"></script>
- From second-level subfolders (e.g., surveys/collect/private.html):
  <script src="../../scripts/analytics-global-tracker.js"></script>

See analytics-integration-snippet.html for more examples.

## Suggested new SPA routes (optional)
If desired, add routes for frequently used standalone pages:
- /dashboards → dashboards/index.html
- /surveys/follow → surveys/follow.html
- /surveys/collect → surveys/collect.html
- /webroai → webroai/index.html
- /admin-tools/user-manage-list → admin-tools/user-manage-list.html

These will make navigation consistent and ensure titles/breadcrumbs are set automatically.

---
Updated automatically by Copilot to reflect current repo state. To refresh later, re-run a repo scan and update this doc.
