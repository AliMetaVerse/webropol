# Colors and Buttons Guide

Canonical reference for the Webropol design-system color tokens and `webropol-button` API.

Source of truth:
- `design-system/styles/tokens.js`
- `design-system/styles/tokens.css`
- `design-system/utils/base-component.js`
- `design-system/components/buttons/Button.js`

## Colors

The design system uses token palettes, not arbitrary Tailwind colors. When you need a new color decision, start from these palettes first.

### Core Palettesac

| Palette | Primary use | Key stops |
| --- | --- | --- |
| `primary` | Main brand actions, focus, emphasis | `500 #209fba`, `700 #1e6880`, `900 #204859` |
| `neutral` | Text, borders, surfaces | `0 #ffffff`, `200 #e6e7e8`, `700 #61686a`, `950 #272a2b` |
| `accent` | Promotional accents, warm highlights | `500 #fe4911`, `700 #c61e08` |
| `success` | Positive status and confirmations | `500 #579f48`, `700 #38672e` |
| `warning` | Caution and alert states | `500 #f5980b`, `700 #b44e09` |
| `error` | Destructive actions and error states | `500 #f43f63`, `700 #be1241`, `900 #88133a` |
| `royalViolet` | Premium and AI-facing visuals | `500 #823bdd`, `600 #6922c4` |
| `royalBlue` | Premium, enterprise, trust signals | `500 #6366f1`, `600 #4f46e5` |
| `royalTurquoise` | Premium secondary accent, innovation | `500 #06b6d4`, `600 #0891b2` |

### CSS Variable Access

Use the CSS custom properties from `tokens.css` when working outside Tailwind utilities.

```css
color: var(--primary-700);
background: var(--neutral-0);
border-color: var(--error-700);
```

### Tailwind Usage

For Tailwind-based page code, prefer the existing Webropol token naming already configured on the page.

Typical examples:

```html
<div class="bg-webropol-primary-500 text-white"></div>
<div class="border-webropol-primary-700 text-webropol-primary-700"></div>
<div class="bg-webropol-gray-50 text-webropol-gray-900"></div>
<div class="bg-gradient-to-r from-webropol-royalViolet-500 to-webropol-royalBlue-600"></div>
```

Notes:
- Many pages expose `webropol-gray` in Tailwind config, while the token source file names the same design intent `neutral`.
- Component internals should follow the design-system source files even if a page-level alias differs.
- Avoid raw Tailwind colors like `bg-blue-500` or `text-gray-600` for product UI.

### Recommended Color Roles

| Role | Preferred tokens |
| --- | --- |
| Primary CTA | `primary-700` to `primary-900` |
| Secondary surface | `primary-50` to `primary-200` |
| Default text | `neutral-700` to `neutral-950` |
| Muted text | `neutral-500` to `neutral-700` |
| Success message | `success-300` with `success-700` text |
| Warning message | `warning-300` with `warning-700` text |
| Error message | `error-300` with `error-700` or `error-900` text |
| Premium CTA | `royalViolet-500` to `royalBlue-600` |

## Buttons

`webropol-button` is the canonical button component.

```html
<script type="module" src="../design-system/components/buttons/Button.js"></script>
```

### Supported Attributes

| Attribute | Values | Notes |
| --- | --- | --- |
| `variant` | `primary`, `secondary`, `tertiary`, `danger`, `danger-outline`, `success`, `royal`, `royalLight`, `royalSecondary`, `royalTertiary`, `royalIcon` | Visual treatment |
| `size` | `sm`, `md`, `lg`, `xl`, `micro` | Text button sizes |
| `icon` | Font Awesome icon name | `icon="check"` renders `fal fa-check` |
| `icon-position` | `left`, `right` | Default is `left` |
| `icon-only` | boolean | Converts `sm/md/lg/xl` into square icon sizes |
| `roundness` | `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full` | Default is `full` |
| `full-width` | boolean | Makes the inner button span full width |
| `disabled` | boolean | Disabled state |
| `loading` | boolean | Busy state with spinner |
| `href` | URL | Renders as anchor when set and not disabled/loading |
| `target` | standard anchor target | Used with `href` |
| `type` | `button`, `submit`, `reset` | Defaults to `button` |

### Button Variants

| Variant | Style | Use for |
| --- | --- | --- |
| `primary` | Solid brand teal | Main CTA in a section or form |
| `secondary` | Soft teal surface with teal border/text | Supporting actions |
| `tertiary` | Ghost button with teal text | Low-emphasis or inline actions |
| `success` | Solid green | Positive confirmations and completion |
| `danger` | Solid destructive red | High-risk destructive actions |
| `danger-outline` | Light red surface with dark red border/text | Secondary destructive actions |
| `royal` | Violet-to-blue premium gradient | Premium, paid, special flows |
| `royalLight` | Light premium surface with violet border/text | Premium secondary action |
| `royalSecondary` | Premium outlined treatment | Alternative premium action |
| `royalTertiary` | Premium ghost treatment | Low-emphasis premium action |
| `royalIcon` | Premium ghost icon treatment | Icon-only premium affordance |

### Sizes

Text buttons:

| Size | Classes | Typical use |
| --- | --- | --- |
| `micro` | `px-3 py-1.5 text-xs` | Dense toolbars and compact utility rows |
| `sm` | `px-3.5 py-2 text-sm` | Secondary actions in tight layouts |
| `md` | `px-4 py-2.5 text-sm` | Default size |
| `lg` | `px-5 py-3 text-base` | Primary actions in cards and forms |
| `xl` | `px-6 py-3.5 text-lg` | Hero or promotional CTA |

Icon-only buttons:

When `icon-only` is present, `size="sm|md|lg|xl"` maps to fixed square sizes internally.

| Markup | Actual sizing |
| --- | --- |
| `size="sm" icon-only` | `icon-sm` = `32x32` |
| `size="md" icon-only` | `icon-md` = `40x40` |
| `size="lg" icon-only` | `icon-lg` = `48x48` |
| `size="xl" icon-only` | `icon-xl` = `56x56` |

### Canonical Examples

#### Standard Actions

```html
<webropol-button variant="primary" size="md">Save changes</webropol-button>
<webropol-button variant="secondary" size="md">Cancel</webropol-button>
<webropol-button variant="tertiary" size="sm" icon="pen">Edit</webropol-button>
```

#### Status Actions

```html
<webropol-button variant="success" size="md" icon="check">Complete</webropol-button>
<webropol-button variant="danger" size="md" icon="trash">Delete</webropol-button>
<webropol-button variant="danger-outline" size="sm">Archive</webropol-button>
```

#### Premium Actions

```html
<webropol-button variant="royal" size="lg" icon="crown">Upgrade to Pro</webropol-button>
<webropol-button variant="royalLight" size="md">Compare plans</webropol-button>
<webropol-button variant="royalSecondary" size="md">Talk to sales</webropol-button>
<webropol-button variant="royalTertiary" size="sm">Learn more</webropol-button>
<webropol-button variant="royalIcon" size="md" icon="sparkles" icon-only></webropol-button>
```

#### Icon Position and Shape

```html
<webropol-button variant="primary" size="md" icon="arrow-left">Previous</webropol-button>
<webropol-button variant="primary" size="md" icon="arrow-right" icon-position="right">Next</webropol-button>
<webropol-button variant="secondary" size="md" roundness="lg">Rounded corners</webropol-button>
```

#### States and Link Mode

```html
<webropol-button variant="primary" loading>Saving</webropol-button>
<webropol-button variant="secondary" disabled>Disabled</webropol-button>
<webropol-button variant="primary" href="/surveys" target="_blank">Open surveys</webropol-button>
```

## Selection Rules

Use this hierarchy unless a module has a stronger existing convention.

1. One `primary` action per section.
2. Use `secondary` for clear alternatives to a primary action.
3. Use `tertiary` when the action should stay visible but quiet.
4. Reserve `danger` and `danger-outline` for destructive behavior only.
5. Reserve `royal*` variants for premium, special, or intentionally highlighted flows.
6. Use `micro` and `sm` only where layout density demands it.

## Known Documentation Drift

Older markdown in the repo may still refer to:
- gradient-based `primary`, `success`, or `danger` buttons
- a shorter button variant list
- only four text sizes

For new work, follow this file and the component source instead.