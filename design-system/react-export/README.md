# React Export Surface

This folder exposes the current Webropol design-system tokens and component state metadata in a React-friendly, framework-neutral ESM module.

It does not add React runtime code to this repository. The goal is to let a React application import the same colors, navigation items, component variants, and state rules that already exist in the vanilla design system.

## File

- `index.js`: aggregate export for colors, typography, navbar items, buttons, tabs, smart notifier, banner, badge, and loading.

## Included Exports

- `reactColorTokens`: all token palettes from `design-system/styles/tokens.js`, plus aliases for `webropolGray` and `webropolPrimary`.
- `reactTypographyTokens`: base typography tokens plus React-ready preset text styles.
- `reactNavbarSpec`: sidebar items from the current sidebar source and header actions from the header source.
- `reactButtonSpec`: button sizes, roundness options, and state maps for default, hover, active, focus, disabled, and loading.
- `reactTabsSpec`: tab variants, sizes, shapes, orientations, and state coverage.
- `reactSmartNotifierSpec`: semantic and royal notifier variants, size presets, and action/dismiss toggles.
- `reactBannerSpec`: regular and outlined banner types, responsive sizes, action styles, and dismiss state.
- `reactBadgeSpec`: badge variants, sizes, and dismiss behavior.
- `reactLoadingSpec`: loading types, sizes, overlay state, and token color.
- `getReactCssVariables(prefix)`: helper that serializes design tokens to CSS custom properties for a React app shell.
- `reactDesignSystemExport`: single aggregate object.

## Example

```js
import {
  reactButtonSpec,
  reactColorTokens,
  reactNavbarSpec,
  getReactCssVariables
} from './design-system/react-export/index.js';

const primaryButton = reactButtonSpec.variants.primary;
const sidebarItems = reactNavbarSpec.sidebarItems;
const cssVariables = getReactCssVariables();
```

## Notes

- The exported state objects are normalized from the current vanilla component sources. They are intended for React mapping, not direct DOM rendering inside this repo.
- Sidebar item visibility rules are preserved with `moduleKey` and `defaultEnabled` metadata.
- Header actions are exported as configuration items rather than finished React components because the source header behavior depends on runtime settings and layout state.