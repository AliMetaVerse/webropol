# Jira Spec — Chart Colours Modal (`webropol-chart-colours-modal`)

**Component file:** `design-system/components/report/ChartColoursModal.js`  
**Web component tag:** `<webropol-chart-colours-modal>`  
**Alpine data store:** `coloursModal`  
**Created:** 2026-03-05  

---

## Epic

> **Report Customisation — Chart & Table Colour Settings**  
> Allow users to configure the colour scheme applied to survey report charts, mean/index table cells, and excluded answer option columns from a single modal panel.

---

## Stories

### STORY-1 — Bar Colours: Colour Editor Tab

**As a** report user  
**I want to** view and edit up to 12 bar colours used in chart visualisations  
**So that** my export matches corporate branding or personal preference

#### Acceptance Criteria

- [ ] Modal displays 12 colour swatches in a 4-column grid
- [ ] Each swatch shows:
  - A circular colour preview (clickable — opens native `<input type="color">`)
  - Label: `Option 1` … `Option 12`
  - Editable hex text field (max 7 characters, uppercase, monospace font)
- [ ] Hex input validates format `#RRGGBB`; invalid values are silently rejected
- [ ] Clicking the colour circle opens the native browser colour picker
- [ ] Colour circle and hex input stay in sync (bidirectional binding)
- [ ] "Reset to defaults" button restores all 12 colours to the original palette:
  `#1a5276`, `#e55e1e`, `#27ae60`, `#d4ac0d`, `#1abc9c`, `#7f8c9a`, `#c0392b`, `#2e4ba0`, `#e91e8c`, `#1a7d60`, `#7d5a3c`, `#95a5a6`
- [ ] Resetting also clears the selected accessible palette indicator

---

### STORY-2 — Bar Colours: Accessible Colour Palettes Tab

**As a** report user  
**I want to** apply a research-backed, CVD-safe colour palette in one click  
**So that** my charts are accessible to users with colour vision deficiency

#### Acceptance Criteria

- [ ] Tab "Accessible colours" lists **5 palettes**:

| # | Name | Source |
|---|------|--------|
| 1 | Wong (2011) | Nature Methods 8, 441 (2011) |
| 2 | Okabe & Ito | Color Universal Design (2002) |
| 3 | IBM Colour Blind Safe | IBM Design Language (2023) |
| 4 | Paul Tol Muted | SRON/EPS/TOL (2023) |
| 5 | Tableau Colorblind 10+ | Tableau 10 (2016) |

- [ ] Each palette card shows:
  - Name and short description
  - 12 colour swatches in a 6-column, 2-row grid
  - Academic/source citation as a clickable external link (opens in new tab)
  - A radio-style selected indicator (filled circle with checkmark when active, empty circle when inactive)
- [ ] Clicking a palette card:
  - Marks it as selected
  - Copies all 12 colours into the Colours tab (index-matched, left to right)
  - Switches view back to the **Colours** tab automatically
- [ ] Only one palette may be selected at a time
- [ ] An info banner explains CVD testing coverage (deuteranopia, protanopia, tritanopia) and that extended palettes are perceptually compatible

---

### STORY-3 — Bar Colours: Accessible Patterns Tab

**As a** report user  
**I want to** toggle hatch/fill patterns on chart bars  
**So that** charts remain distinguishable in greyscale print and for colourblind users

#### Acceptance Criteria

- [ ] Tab "Accessible patterns" displays **10 SVG fill patterns** in a 5-column grid:

| ID | Label |
|----|-------|
| `hc-pat-0` | Diagonal / |
| `hc-pat-1` | Diagonal \ |
| `hc-pat-2` | Horizontal |
| `hc-pat-3` | Zigzag |
| `hc-pat-4` | Vert. bars |
| `hc-pat-5` | Horiz. bars |
| `hc-pat-6` | Squares |
| `hc-pat-7` | Circles |
| `hc-pat-8` | Filled dots |
| `hc-pat-9` | Steps |

- [ ] Each pattern tile shows:
  - A square SVG preview: the pattern is rendered in white on top of the pattern's assigned base colour
  - Pattern label and ID (`pattern-0` … `pattern-9`)
  - Active state: blue ring (`ring-2 ring-webropol-primary-500`) + checkmark badge
  - Inactive state: subtle grey ring, ring highlights on hover
- [ ] Clicking a tile toggles its `active` flag (multiple patterns may be active simultaneously)
- [ ] SVG `<defs>` for all 10 patterns are embedded inline (hidden, `aria-hidden="true"`)
- [ ] Pattern IDs follow the Highcharts `default-pattern-N` naming convention
- [ ] An info banner at the bottom notes pattern-fill is based on the Highcharts pattern fill convention

---

### STORY-4 — Averages & Index Colour Rules

**As a** report user  
**I want to** define colour-coded threshold rules for mean or index values  
**So that** table cells are automatically coloured when values fall within a given range

#### Acceptance Criteria

- [ ] Section header shows an amber chart-line icon, title "Averages & index colours", and a subtitle
- [ ] A **Mean / Index toggle** (radio pill group) selects which value type the rules apply to:
  - `Mean` (default) — sine-wave icon
  - `Index value` — percent icon
- [ ] When no rules exist, an empty-state box is shown with a paintbrush icon and instructional copy
- [ ] "Add colour rule" button (dashed outline) appends a new row with defaults:
  `fontColour: #000000`, `bgColour: #f0f9ff`, `minValue: ''`, `maxValue: ''`, `title: ''`
- [ ] Each rule row (grid layout 7 columns) contains:
  - Font colour swatch + editable hex (native colour picker trigger)
  - Background colour swatch + editable hex
  - Min value number input (placeholder `e.g. 0`)
  - Max value number input (placeholder `e.g. 100`)
  - Title text input (placeholder `Label`)
  - Live preview cell — renders with the rule's background and font colour; shows title or fallback `Aa 4.2`
  - Delete button (visible on row hover): removes the row
- [ ] Column headers (Font, Background, Min value, Max value, Title, Preview) are shown only when at least one row exists
- [ ] "Reset" link button (top-right) clears all rows; only shown when at least one row exists
- [ ] Multiple rules may coexist (no limit enforced in UI)

---

### STORY-5 — Excluded Option Column Colour Rules

**As a** report user  
**I want to** define colour rules for excluded answer option columns  
**So that** excluded options are visually distinct in result tables

#### Acceptance Criteria

- [ ] Section header shows a rose ban icon, title "Excluded option column colours", and a subtitle
- [ ] Behaviour is **identical to STORY-4 (Averages rules)** with the following differences:
  - Default new-row background colour: `#fff7ed` (warm amber tint)
  - Empty-state icon: `fal fa-eye-slash`
  - Empty-state copy: "Define how excluded columns are visually distinguished"
  - Managed via separate `excludedRows` array (independent from `averageRows`)
- [ ] Sections are separated by a horizontal divider

---

### STORY-6 — Modal Lifecycle & Events

**As a** developer integrating the modal  
**I want** a documented open/close API with a result event  
**So that** I can trigger the modal and consume its output from any context

#### Acceptance Criteria

**Opening the modal:**
- [ ] Dispatching `webropol:open-chart-colours` on `window` opens the modal
- [ ] Alpine shorthand: `$dispatch('webropol:open-chart-colours')` works from any Alpine context
- [ ] Opening adds class `modal-open` to `document.body` (z-index management, prevents scroll)

**Closing the modal:**
- [ ] Clicking the × button closes the modal
- [ ] Clicking the "Cancel" button closes the modal
- [ ] Pressing `Escape` closes the modal
- [ ] Clicking the backdrop overlay closes the modal
- [ ] Close removes `modal-open` from `document.body`
- [ ] "Save" button also triggers the close flow (no additional validation required)
- [ ] On close, `window` emits `webropol:chart-colours-closed` with the following payload:

```js
{
  barColours:     string[],   // 12 hex strings currently active
  activePatterns: string[],   // array of active patternIds e.g. ['hc-pat-0', 'hc-pat-3']
  averageRows:    object[],   // { fontColour, bgColour, minValue, maxValue, title }[]
  excludedRows:   object[]    // { fontColour, bgColour, minValue, maxValue, title }[]
}
```

---

### STORY-7 — Web Component Integration

**As a** page author  
**I want** to embed the modal via a single HTML tag  
**So that** no manual HTML scaffolding is needed

#### Acceptance Criteria

- [ ] Placing `<webropol-chart-colours-modal></webropol-chart-colours-modal>` anywhere in the DOM renders the full modal
- [ ] Component self-initialises Alpine data store (`coloursModal`) on `connectedCallback`
- [ ] If Alpine has already initialised (SPA re-navigation), `Alpine.initTree(this)` is called to initialise the subtree
- [ ] Alpine data store is registered only once; re-registering on the same page does not throw (guarded by `Alpine._coloursModalRegistered` flag)
- [ ] Works on first page load (`alpine:init` event) and on SPA route changes (direct `Alpine` check)
- [ ] Modal renders correctly at max-width 680px, with body scrollable up to `calc(90vh - 130px)`
- [ ] Modal is fully keyboard accessible: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` title linkage

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Accessibility | All interactive controls have visible focus styles; colour pickers supplemented by hex text inputs; screen reader labels on close/delete buttons |
| CVD Support | 5 built-in palettes tested against deuteranopia, protanopia, and tritanopia; pattern overlays provide a colour-independent channel |
| Performance | No external dependencies; SVG patterns inlined; no network requests at runtime |
| Compatibility | Works with Alpine.js 3.x CDN; no build tools or npm required |
| z-index | Modal overlay uses `z-index: 2147483640`; `body.modal-open` lowers header z-index to prevent overlap |

---

## Technical Notes

- **File:** `design-system/components/report/ChartColoursModal.js` (636 lines)
- **Pattern:** Self-contained Alpine data + Web Component in a single JS module
- **No external state**: all state is local to `coloursModal`; consumers receive data only via the close event
- **Hex validation regex:** `/^#[0-9a-fA-F]{6}$/`
- **Default 12 colours:** defined as `DEFAULT_BAR_COLOURS` constant, closed over by the Alpine data factory

---

## Out of Scope

- Persisting settings to localStorage (handled by the consuming page on `webropol:chart-colours-closed`)
- Applying colour rules to actual charts (chart rendering is external)
- Per-question overrides (this modal applies settings globally)
- More than 12 bar colour slots
