# Style Guidelines

These rules apply to every page built on top of this kit. They implement the Webropol Royal Design System in Tailwind v4.

---

## Layout principles

- **Shell** — every authenticated page is `Sidebar` on the left + a right column containing `TopHeader` (sticky) and the scrollable main content. Do not rebuild this shell per page.
- **Sidebar width** — `224px` expanded, `72px` collapsed. Sticky top (logo + toggle) and sticky bottom (`footerItem`, e.g. Contact Us). Middle scrolls vertically only — **no horizontal scrolling**.
- **TopHeader** — `sticky top-0 z-30`, shows a drop shadow when the main content scrolls.
- **Main content padding** — `p-[32px]` on the homepage surface. Sections stack with `gap-[32px]`.
- **Cards row** — feature cards live in a `flex gap-[24px] items-stretch` row so they share height.

## Spacing scale

Use **4px base units**. Prefer:

`4, 8, 12, 16, 20, 24, 32, 48`

- Tight UI gaps (within a list row): `4–8px`.
- Inside a component (icon ↔ label): `8–12px`.
- Between cards / sections: `16–32px`.
- Between major regions (banner → activity list): `32px`.

Write these as arbitrary Tailwind values — e.g. `gap-[12px]`, `p-[24px]` — to match the rest of the code rather than using the default `p-4` shorthand.

## Border radius system

| Element | Radius |
|--------|--------|
| Cards, banners, modals, list items | `8px` |
| Icon buttons / nav tiles | `4px` |
| Pill buttons (Create survey, Read more) | `99px` (use `shape="rounded"`) |
| Badge chips | `4px` |
| Input fields | `4px` |
| Icon circles (banner / modal / sign-in) | `full` (48px circle) |

## Typography hierarchy

| Role | Font | Size / line-height |
|------|------|--------------------|
| Greeting / section title (h1/h2) | `Roboto Condensed Bold` | `23/32` |
| Card title, modal title | `Roboto Condensed Bold` | `18–20 / 24` |
| Banner title | `Roboto Condensed Bold` | `20/24` |
| Body / nav label | `Roboto Regular` | `14/20` |
| Button label | `Roboto Medium` | `14/20` |
| Metadata, badges | `Roboto Regular` | `13/20` |
| Sign-in heading | `Roboto Condensed Bold` | `24/28` |

**Rule:** do not apply Tailwind `text-2xl`, `font-bold`, `leading-none`, etc. unless the user explicitly asks. The kit components already bake in these values.

## Colour usage

| Role | Hex | Where |
|------|-----|-------|
| Primary (text + filled CTA) | `#1e6880` | primary Button, active nav icon, links |
| Primary darker | `#215669` | hover text on secondary/tertiary |
| primary/300 | `#79D6E7` | **selected** surface (nav, tabs, dropdown row) |
| primary/200 | `#B0E8F1` | **hover** surface (nav, tabs, dropdown row, icon buttons) |
| primary/50 | `#EEFBFD` | secondary button background, subtle surface |
| Neutral 300 | `#D1D5D6` | borders (banner outline, divider, header border) |
| Surface | `#EBF4F7` | page background (main area) |
| Accent bg | `#FFE5D4` | banner + sign-in icon circles |
| Accent fg | `#EF2F07` | banner + sign-in icon |
| Success bg | `#A9D69F` | Published badge |
| Warning bg | `#FCCE4D` | Draft badge |
| Closed bg | `#E6E7E8` | Closed badge |
| Danger | `#BE1241` | destructive Button, notification dot |
| Royal gradient | `#823BDD → #4F46E5` | Create New RoyalButton (dark) |

## Interaction states

| State | Surface | Text |
|-------|---------|------|
| Selected / active | primary/300 `#79D6E7` | primary `#1e6880` |
| Hover | primary/200 `#B0E8F1` | primary darker `#215669` |
| Focus | dark `#1e6880` border | inherited |
| Card hover | **shadow only** `0px 10px 24px rgba(39,42,43,0.15)` | — |

**Rule:** hover is never the same shade as selected — selected is darker (300), hover is lighter (200).

## Responsive behaviour

- The homepage is a desktop-first dashboard. Collapsing the sidebar to `72px` is the primary small-viewport affordance.
- The card row should wrap gracefully if space runs out, preserving equal heights within a row.
- SignIn card has `max-w-[440px]` and is centred — it is the only screen that reads well on mobile widths without further work.

## Shadows

| Purpose | Value |
|---------|-------|
| Card hover | `0px 10px 24px rgba(39,42,43,0.15)` |
| Dropdown menu | `0px 10px 24px rgba(39,42,43,0.12)` |
| Banner (regular) | `0px 2px 8px rgba(39,42,43,0.08)` |
| Sticky header shadow when scrolled | `0px 4px 8px rgba(39,42,43,0.08)` |
| Sticky footer shadow when scrollable below | `0px -4px 8px rgba(39,42,43,0.08)` |
| Modal | `0px 20px 40px rgba(39,42,43,0.2)` |

## Motion

- Transitions use Tailwind `transition-colors`, `transition-shadow`, and `transition-[width]` for the sidebar collapse animation.
- No scale, rotate or bounce animations on hover — the kit is restrained.
