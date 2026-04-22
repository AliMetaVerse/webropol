# Component Guidelines

All reusable components live in `src/app/components/ui/`. When building new pages or extending the homepage, reach for these first; only introduce new components when nothing in the kit matches.

---

## Sidebar

**Usage:** Primary left-side navigation shell for the Webropol platform. Use once per layout at the far left.

**Semantic purpose:** Collapsible shell that groups platform navigation into three regions — a sticky top (logo + collapse/expand toggle), a scrollable middle (module links + supportive links), and a sticky bottom (footer link such as Contact Us). Scroll shadows appear automatically on the sticky regions when the middle region has more items in that direction.

**API**

```ts
interface SidebarItem { id: string; label: string; icon: string }
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  moduleItems: SidebarItem[];      // top group above divider
  supportiveItems: SidebarItem[];  // group below divider
  footerItem?: SidebarItem;        // sticky at bottom (e.g. Contact Us)
  activeId: string;
  onSelect?: (id: string) => void;
  collapseLabel?: string;          // aria-label for collapse chevron
  expandLabel?: string;            // aria-label for expand chevron
}
```

**Rules**
- Collapsed width `72px`, expanded width `224px`; width transitions automatically.
- No horizontal scrolling — labels clip when collapsed/overflow.
- Labels **must** come from `i18n.ts` (`t.nav.*`).
- Selected state uses `NavigationLink`'s active style (primary/300 `#79D6E7`). Hover is primary/200 `#B0E8F1`.

**Correct**
```tsx
<Sidebar
  collapsed={collapsed}
  onToggle={toggle}
  activeId="home"
  moduleItems={[{ id: "home", label: t.nav.home, icon: "home" }, ...]}
  supportiveItems={[{ id: "shop", label: t.nav.shop, icon: "cart-shopping" }]}
  footerItem={{ id: "contact", label: t.nav.contactUs, icon: "headset" }}
/>
```

**Incorrect** — building a bespoke `<aside>` with hand-written `NavigationLink` loops.

---

## TopHeader

**Usage:** Sticky top bar on authenticated pages. Contains the Create New CTA on the left and user-facing actions (search, help, notifications, user menu) on the right.

**Semantic purpose:** Global actions header. Gains a drop shadow when the page content scrolls down so users understand they are not at the top.

**API**

```ts
interface TopHeaderProps {
  createLabel: string;                 // t.header.createNew
  createItems: DropdownItem[];
  createSelectedId?: string;
  onCreateSelect?: (id: string) => void;

  iconActions?: { icon: string; ariaLabel: string; showDot?: boolean; onClick?: () => void }[];

  userName: string;
  userMenuItems: DropdownItem[];
  userSelectedId?: string;
  onUserSelect?: (id: string) => void;

  scrolled?: boolean;                  // drives shadow
}
```

**Rules**
- Parent owns scroll detection and passes `scrolled`.
- `iconActions` must use aria-labels from `t.header.*`.
- User menu logout should route to the `SignIn` page by clearing the authenticated state.

---

## NavigationLink

**Usage:** A single nav row or dropdown row. Consumed internally by `Sidebar` and `DropdownMenu`; avoid using directly in pages.

**API:** `icon`, `label`, `isActive?`, `collapsed?`, `onClick?`.

**Rules**
- `collapsed` renders a 44px icon-only square tile.
- Active = `bg-[#79D6E7] text-[#1e6880]`. Hover = `bg-[#B0E8F1] text-[#1e6880]`.

---

## Button

**Usage:** All standard actions. Do not use native `<button>` styling for anything other than purely icon-only utility buttons.

**Variants**
- `primary` — main CTA, filled `#1e6880`.
- `secondary` — light surface `#EEFBFD`, border `#1e6880`.
- `tertiary` — transparent, text only.
- `outlined` — white bg with `#1e6880` border.
- `success` / `destructive` / `destructive-outline` — domain actions.
- `icon-secondary` / `icon-tertiary` — square icon tiles.
- `home-card-btn` — legacy feature-card pill.

**Props:** `variant`, `size` (`default|sm|lg|icon|micro`), `shape` (`default|rounded`).

**Rules**
- Hover for secondary/tertiary is **primary/200** `#B0E8F1`.
- Always place icon + label as siblings; the component sets `inline-flex flex-row items-center justify-center gap-[8px]` so they lay out horizontally and centred.
- Use `shape="rounded"` for pill buttons that appear in cards, banners, modals.

---

## RoyalButton

**Usage:** Purple gradient button used for the Create New CTA and other "royal" actions.

**Variants:** `dark` (default gradient), `light` (light gradient when menu open), `secondary`, `tertiary`.

**Rule:** Use for Create New and similarly elevated CTAs only — never as a generic submit button.

---

## FeatureCard

**Usage:** Homepage "what do you want to do next" cards.

**API:** `image?`, `background?`, `icon`, `title`, `buttonText`, `isNew?`, `badge?`, `buttonVariant?: "outline" | "tertiary"`, `onClick?`.

**Rules**
- Cards have a thin white border (`border border-white`), rounded 8px.
- Hover effect is **shadow only** (`0px 10px 24px rgba(39,42,43,0.15)`) — no scale, no colour shift on the card itself.
- First two cards on the homepage use `outline` button, last two use `tertiary`.
- Cards in a row should stretch to equal height (the component already handles `self-stretch`).

---

## Banner

**Usage:** Promotional / informational strip on dashboard pages (tutorials, release notes).

**API:** `title`, `description`, `icon`, `iconBgColor?`, `iconColor?`, `type?: "regular" | "outlined"`, `imageRight?`, `buttons?`, `onClose?`.

**Rules**
- Default homepage banners use `type="outlined"` (transparent bg, `#D1D5D6` border).
- Icon circle uses accent palette: `bg-[#FFE5D4]` + `text-[#EF2F07]`.
- Up to two buttons; use `secondary` (Watch / Read more) and `tertiary` (Don't show again).
- Close button hover uses primary/300 `#79D6E7`.

---

## Tabs

**Usage:** Section-level filter (e.g. My Latest Activity → All / Surveys / Events).

**API:** `items: { id, label, icon? }[]`, `activeId`, `onChange`.

**Rules**
- Wrapper is `inline-flex` — it hugs the tab group rather than stretching full width.
- Selected = primary/300, hover = primary/200.
- Do not add icons unless the design explicitly shows them.

---

## DropdownMenu

**Usage:** Menu panel anchored to a trigger. Built on `NavigationLink` rows.

**API:** `items: { id, label, icon? }[]`, `selectedId?`, `onSelect?`.

**Rule:** Do not build dropdowns from raw `<ul>`/`<li>` — always go through this component so hover / selected states stay consistent.

---

## Modal

**Usage:** Blocking dialog (confirmations, language picker).

**API:** `open`, `onClose`, `title`, `description?`, `icon?`, `iconBgColor?`, `iconColor?`, `children?`, `actions?`, `orientation?: "vertical" | "horizontal"`.

**Rules**
- Vertical (320px) for simple prompts; horizontal (560px) for content-rich dialogs.
- Actions render as `Button`s with `shape="rounded"`.
- Close button hover uses primary/300.

---

## SignIn

**Usage:** Pre-auth page. Rendered when `authenticated` is false in `Home`.

**API:** `language`, `onLanguageChange`, `onSignIn`.

**Rules**
- Reuses the homepage `WMark` + `Slogan` logo.
- Persists username + password to `localStorage` under `webropol.signin.credentials` when **Remember me** is checked.
- Language switcher uses the same locale codes as the rest of the app and updates `LanguageContext`.

---

## FAIcon

**Usage:** All iconography. Never use raw `<i class="fa-…">` in pages.

**API:** `icon: string`, `weight?: "light" | "solid" | "regular"`, `className?: string`.

**Rule:** Default weight `light`. Use `solid` only for filled CTAs (e.g. `circle-plus` on Create New).

---

## ImageWithFallback

**Usage:** Any new image. Lives at `src/app/components/figma/ImageWithFallback.tsx`. Do not create your own fallback image component.

---

## Do / Don't

- **Do** compose new pages out of `Sidebar` + `TopHeader` + kit primitives.
- **Do** add a new component to `src/app/components/ui/` once a pattern is used twice.
- **Don't** duplicate the layout shell in a new page — wire the existing shell through props.
- **Don't** inline Font Awesome tags, hardcode copy, or introduce new colours.
