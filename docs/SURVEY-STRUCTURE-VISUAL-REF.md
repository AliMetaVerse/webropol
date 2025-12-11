# Survey Structure Components - Visual Reference

## Component Hierarchy

```
Survey Structure Panel
│
├── Pages Tab
│   │
│   ├── <webropol-survey-page> ─────────────┐
│   │   │                                    │
│   │   ├── Header                           │  Page Component
│   │   │   ├── Checkbox                     │  - Collapsible container
│   │   │   ├── Page Name                    │  - Question count badge
│   │   │   ├── Question Count Badge         │  - Expand/collapse icon
│   │   │   └── Expand Icon                  │
│   │   │                                    │
│   │   └── Questions Container (slot) ──────┤
│   │       │                                │
│   │       ├── <webropol-survey-question>   │  Question Components
│   │       │   ├── Checkbox                 │  - Neutral white style
│   │       │   ├── Type Icon                │  - Hover action buttons
│   │       │   ├── Question Text            │  - Settings & delete
│   │       │   └── Action Buttons (hover)   │
│   │       │       ├── Settings Button      │
│   │       │       └── Delete Button        │
│   │       │                                │
│   │       ├── <webropol-survey-question>   │
│   │       └── <webropol-survey-question>   │
│   │                                        │
│   ├── <webropol-survey-page> ─────────────┘
│   └── ...more pages
│
└── Styles Tab
    └── (existing implementation)
```

## Visual Anatomy

### SurveyPageItem (`webropol-survey-page`)

```
┌─────────────────────────────────────────────────────────────┐
│  ☐  PAGE 1                              [3 questions]  ▼   │ ← Header
│─────────────────────────────────────────────────────────────│
│  │  ┌──────────────────────────────────────────────────┐   │
│  │  │ ☐ 📝 What is your name?            [⚙] [🗑]     │   │ ← Question
│  │  └──────────────────────────────────────────────────┘   │
│  │  ┌──────────────────────────────────────────────────┐   │
│  │  │ ☐ 📋 Contact details               [⚙] [🗑]     │   │ ← Question
│  │  └──────────────────────────────────────────────────┘   │
│  │  ┌──────────────────────────────────────────────────┐   │
│  │  │ ☐ ⭐ Rate our service              [⚙] [🗑]     │   │ ← Question
│  └  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
     └── Questions Container (collapsible)
```

**Color Scheme**:
- Background: `bg-webropol-primary-50` (light cyan/teal)
- Border: `border-webropol-primary-200`
- Text: `text-webropol-primary-900`
- Badge: `bg-webropol-primary-100` / `text-webropol-primary-700`

### SurveyQuestionItem (`webropol-survey-question`)

```
┌────────────────────────────────────────────────────────┐
│  ☐  [📝]  What is your name?        [⚙] [🗑]        │
│         └─ Icon                      └─ Hover Actions  │
└────────────────────────────────────────────────────────┘
```

**States**:

**Default (Not Hovering)**:
```
┌────────────────────────────────────────────┐
│  ☐  [📝]  What is your name?              │
└────────────────────────────────────────────┘
```

**Hover State**:
```
┌────────────────────────────────────────────────────┐
│  ☐  [📝]  What is your name?    [⚙] [🗑]        │
│                            └─ Buttons appear ──┘   │
└────────────────────────────────────────────────────┘
```

**Selected**:
```
┌────────────────────────────────────────────────────┐
│  ☑  [📝]  What is your name?    [⚙] [🗑]        │
└────────────────────────────────────────────────────┘
```

**Color Scheme**:
- Background: `bg-white`
- Border: `border-webropol-gray-200`
- Hover Border: `hover:border-webropol-primary-300`
- Hover Background: `hover:bg-webropol-gray-50`
- Icon: `text-webropol-gray-500`
- Text: `text-webropol-gray-900`
- Settings Button: `bg-webropol-primary-600` / `hover:bg-webropol-primary-700`
- Delete Button: `bg-red-500` / `hover:bg-red-600`

## Question Type Icons

| Type | Icon | Visual |
|------|------|--------|
| Text | `fa-text` | 📝 |
| Textarea | `fa-align-left` | 📄 |
| Radio | `fa-dot-circle` | 🔘 |
| Checkbox | `fa-check-square` | ☑️ |
| Dropdown | `fa-caret-square-down` | 📋 |
| Scale | `fa-sliders-h` | 🎚️ |
| NPS | `fa-chart-line` | 📊 |
| Rating | `fa-star` | ⭐ |
| Matrix | `fa-table` | 📊 |
| Ranking | `fa-sort-amount-down` | 📉 |
| Contact | `fa-address-card` | 👤 |
| Autosuggest | `fa-magic` | ✨ |
| Date | `fa-calendar-alt` | 📅 |
| File | `fa-file-upload` | 📁 |

## Interaction Flow

### Page Expansion
```
User clicks page header
         ↓
Component toggles 'expanded' state
         ↓
Questions container shows/hides
         ↓
Chevron icon rotates (right → down)
         ↓
'page-toggle' event fires
         ↓
Event detail: { pageNumber, expanded }
```

### Question Settings
```
User hovers over question
         ↓
Action buttons fade in (opacity 0 → 100)
         ↓
User clicks settings button [⚙]
         ↓
'question-settings' event fires
         ↓
Event detail: { questionId, questionType }
         ↓
Parent handler opens settings modal
```

### Question Delete
```
User clicks delete button [🗑]
         ↓
'question-delete' event fires
         ↓
Event detail: { questionId }
         ↓
Parent handler shows confirmation
         ↓
If confirmed → Delete question
```

## Event Flow Diagram

```
┌─────────────────────────────────────────────────┐
│          SurveyPageItem Component               │
│                                                 │
│  User Action → Component State → Custom Event  │
│                                                 │
│  Header Click ──→ Toggle expanded ──→ page-toggle
│  Checkbox    ──→ Toggle selected ──→ page-select
│                                                 │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│       Document Event Listener (Alpine.js)       │
│                                                 │
│  document.addEventListener('page-toggle', ...)  │
│  document.addEventListener('page-select', ...)  │
│                                                 │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│         surveyStructureApp() Handler            │
│                                                 │
│  handlePageToggle(event) {                      │
│    console.log(event.detail)                    │
│    // Update UI, save state, etc.               │
│  }                                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (lg+)
```
┌─────────────────────────────────────────────────────┐
│ ☐  PAGE 1                    [3 questions]  ▼     │
│─────────────────────────────────────────────────────│
│   ┌──────────────────────────────────────────────┐ │
│   │ ☐ 📝 What is your name?        [⚙] [🗑]    │ │
│   └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Mobile (sm)
```
┌────────────────────────────────┐
│ ☐  PAGE 1     [3 questions] ▼ │
│────────────────────────────────│
│  ┌──────────────────────────┐ │
│  │ ☐ 📝 Question            │ │
│  │          [⚙] [🗑]       │ │
│  └──────────────────────────┘ │
└────────────────────────────────┘
```

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between checkboxes and buttons
- **Enter/Space**: Toggle checkboxes, activate buttons
- **Arrow Keys**: Navigate within component (future)

### ARIA Labels
- All buttons have `aria-label` attributes
- Checkboxes have associated `<label>` elements
- Tabs have `role="tab"` and `aria-selected`

### Screen Reader Support
```html
<button aria-label="Question settings" title="Settings">
  <i class="fal fa-cog"></i>
</button>

<button aria-label="Delete question" title="Delete">
  <i class="fa-light fa-trash-can"></i>
</button>
```

## State Management

### Component Internal State
```javascript
// SurveyPageItem
{
  isExpanded: boolean,
  isSelected: boolean,
  pageNumber: string,
  pageName: string,
  questionCount: string
}

// SurveyQuestionItem
{
  questionId: string,
  questionText: string,
  questionType: string,
  isSelected: boolean
}
```

### External State (Alpine.js)
```javascript
// surveyStructureApp()
{
  activeTab: 'pages' | 'styles',
  selectedStyle: null
}
```

## CSS Classes Reference

### Page Component
```css
/* Container */
.bg-webropol-primary-50
.rounded-lg
.border
.border-webropol-primary-200

/* Header */
.flex
.items-center
.space-x-3
.p-3
.cursor-pointer

/* Badge */
.px-2
.py-1
.text-xs
.bg-webropol-primary-100
.text-webropol-primary-700
.rounded-full
```

### Question Component
```css
/* Container */
.bg-white
.rounded-lg
.border
.border-webropol-gray-200
.hover:border-webropol-primary-300
.hover:bg-webropol-gray-50

/* Action Buttons */
.opacity-0
.group-hover:opacity-100
.transition-opacity
.bg-webropol-primary-600
.hover:bg-webropol-primary-700
```

---

**Reference**: See live examples in `design-system/demos/survey-structure-demo.html`
