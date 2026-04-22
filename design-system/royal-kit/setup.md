# Project Setup

This project is the **Webropol Survey SaaS Homepage** built on React + TypeScript + Tailwind CSS v4 in the Figma Make environment.

---

## 1. Environment notes

- The Vite dev server is auto-started by the Figma Make runtime. **Do not** run `vite`, `vite build`, `npm run dev`, or `pnpm run build` manually.
- The entrypoint `__figma__entrypoint__.ts` is auto-generated at runtime. **Do not** create or edit `index.html` or the entrypoint file.
- Users cannot access `localhost` — always point them to the Figma Make preview surface.
- Use **pnpm** for installing packages (`pnpm add <package>`), not npm or yarn.

## 2. Required styles

Global styles are loaded in this order:

1. `src/styles/fonts.css` — all `@import url(...)` calls for web fonts. Font imports **must** go here, at the top.
2. `src/styles/theme.css` — design-system tokens (colours, radius, font stacks). Do not edit unless the user explicitly asks.
3. `src/styles/index.css` — Tailwind v4 entry that pulls in the preflight and the tokens above.

Font Awesome is loaded via the kit script: `https://kit.fontawesome.com/50ef2d3cf8.js`. Reference icons through the `<FAIcon />` component, never via raw `<i class="fa-…">`.

## 3. File layout

```
src/
├── app/
│   ├── App.tsx                  # main default export, wraps the Home import
│   ├── i18n.ts                  # EN / FI / SV translations — single source of truth
│   └── components/
│       ├── ui/                  # shared kit (Sidebar, TopHeader, Button, …)
│       └── figma/ImageWithFallback.tsx
├── imports/
│   ├── Home.tsx                 # dashboard composition + LanguageContext provider
│   ├── svg-*.ts                 # imported SVG path data
│   └── image-*.png              # imported Figma frames + screenshots
├── styles/
│   ├── fonts.css
│   ├── theme.css
│   └── index.css
└── lib/utils.ts                 # `cn()` class-merge helper
```

**Rules**
- Only create `.tsx` files. Do not create `.html`, `.js`, or `.jsx`.
- New reusable components go in `src/app/components/ui/`.
- The main app component is `src/app/App.tsx` and it **must** have a default export.

## 4. Design system reference

Read the design-system stylesheet before generating new UI:

```
src/WebropolRoyalDesignSystem/guidelines/Guidelines.md
src/styles/theme.css
```

The `:root` / `@theme` blocks in `theme.css` define every token exposed to Tailwind v4. Do not invent new colour or spacing values — extend the token set instead.

## 5. Internationalisation

- The platform ships in **English (`en`)**, **Finnish (`fi`)**, **Swedish (`sv`)**.
- All user-facing strings live in `src/app/i18n.ts`.
- Every key added in one locale **must** be added in all three.
- Components consume strings via the `useT()` hook (exported from `src/imports/Home.tsx`). The app is wrapped in `LanguageContext.Provider` so any descendant can call `useT()` to read the active locale.

## 6. Images & SVGs

- **Raster images** (PNG, JPG): `import img from "figma:asset/<hash>.png"` — no `./` prefix.
- **SVGs**: stored under `src/imports/` and imported with a relative path (`import svgPaths from "../imports/svg-…"`).
- **New images**: use `ImageWithFallback` from `src/app/components/figma/ImageWithFallback.tsx`. Do not copy this component.

## 7. Dependencies already available

- `lucide-react` (general icons — prefer `FAIcon` when the design calls for Font Awesome).
- `class-variance-authority` + `clsx` (variant-driven components).
- `recharts` (charts), `motion` (animation), `sonner` (toasts), `react-slick` (carousels).
- When adding a new dependency, verify it's not already installed and install via `pnpm add`.

## 8. Authentication scaffold

`Home.tsx` manages an `authenticated` boolean. When `false`, it renders the `<SignIn />` page. The user menu's **Log out** sets `authenticated` to `false`; submitting the sign-in form (or **Sign in with SSO**) sets it back to `true`. Credentials are cached under the localStorage key `webropol.signin.credentials` when **Remember me** is checked.

## 9. What NOT to do

- Do not create `index.html`, `vite.config.*`, or modify the generated entrypoint.
- Do not run destructive git operations without explicit permission.
- Do not remove or rewrite `src/app/components/figma/ImageWithFallback.tsx`.
- Do not add emojis anywhere — UI, code, or commits.
- Do not hardcode user-facing strings; they **must** flow through `i18n.ts`.
