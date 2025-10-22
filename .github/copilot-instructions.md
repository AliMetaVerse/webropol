# Webropol AI Coding Agent Instructions

## Project Overview

Webropol is a **pure frontend survey/event platform** built as a multi-page application (MPA) with:
- **Tech Stack**: Vanilla HTML5 + Tailwind CSS + Alpine.js + ES6 modules (NO frameworks, NO build tools, NO npm)
- **Design System**: Custom Web Components (`webropol-*`) extending `HTMLElement` via `BaseComponent` base class
- **Data Layer**: 100% localStorage persistence (key: `webropol_*` prefixes) - NEVER mutate without preserving existing structure
- **AI Features**: Native JavaScript AI models in `webroai/ai-engine.js` (SurveyAI, EventAI, AnalyticsAI, DistributionAI)
- **Icons**: FontAwesome Pro (`fal fa-*` class prefix) loaded via CDN

## Critical Architecture Rules

### 1. Page Structure (MANDATORY Template)
Every page follows this EXACT pattern with path-adjusted imports:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  
  <!-- Tailwind config with Webropol tokens -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'webropol-primary': { 50: '#f0fdff', 500: '#06b6d4', 700: '#0e7490', 900: '#164e63' },
            'webropol-gray': { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' }
          },
          fontFamily: { 'sans': ['Inter', 'system-ui', 'sans-serif'] }
        }
      }
    }
  </script>
  
  <!-- Inter font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Design system components (adjust ../paths for depth) -->
  <script src="../design-system/components/navigation/Sidebar.js" type="module"></script>
  <script src="../design-system/components/navigation/Header.js" type="module"></script>
  <script src="../design-system/components/navigation/Breadcrumbs.js" type="module"></script>
  <script src="../design-system/components/interactive/FloatingButton.js" type="module"></script>
</head>
<body x-data="moduleApp()">
  <div class="flex h-screen">
    <webropol-sidebar active="[module]" base="../"></webropol-sidebar>
    <div class="flex-1 flex flex-col overflow-hidden">
      <webropol-header username="User" show-notifications show-help show-user-menu show-theme-selector></webropol-header>
      <div class="bg-white/70 backdrop-blur px-0 sm:px-4">
        <webropol-breadcrumbs trail='[{"label":"Home","url":"../index.html"}]'></webropol-breadcrumbs>
      </div>
      <main class="flex-1 overflow-y-auto px-6 py-12" role="main">
        <!-- Content here -->
      </main>
    </div>
  </div>
  
  <webropol-floating-button position="bottom-center" theme="primary-blue" items='[...]'></webropol-floating-button>
</body>
</html>
```

**Path Rules**:
- Root level (`/index.html`): `base=""` + `src="design-system/..."`
- One level deep (`/surveys/index.html`): `base="../"` + `src="../design-system/..."`
- Two levels deep (`/surveys/create/index.html`): `base="../../"` + `src="../../design-system/..."`

### 2. Web Components Pattern
ALL UI components extend `BaseComponent` from `design-system/utils/base-component.js`:

```javascript
import { BaseComponent } from '../../utils/base-component.js';

export class WebropolCustom extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled']; // Watched attributes
  }
  
  init() {
    // Setup before render (optional)
  }
  
  render() {
    const variant = this.getAttr('variant', 'primary');
    this.innerHTML = `
      <div class="${this.getVariantClasses('button', variant)}">
        <slot></slot>
      </div>
    `;
  }
  
  bindEvents() {
    this.addEventListener('click', () => this.emit('custom-event', { data: 'value' }));
  }
}

customElements.define('webropol-custom', WebropolCustom);
```

**BaseComponent Utilities** (use these, don't reinvent):
- `getAttr(name, default)` - Get attribute with fallback
- `getBoolAttr(name)` - Boolean attribute check
- `getVariantClasses(component, variant)` - Predefined style variants
- `getSizeClasses(component, size)` - Size utility classes
- `emit(eventName, detail)` - Custom event dispatcher
- `setState(obj, rerender=true)` - Internal state management

### 3. Alpine.js State Management
Standard Alpine.js app function pattern (NO x-cloak unless styled):

```javascript
function moduleName() {
  return {
    // Data
    items: [],
    loading: false,
    selectedTab: 'all',
    
    // Lifecycle
    init() {
      this.loadFromLocalStorage();
      this.setupEventListeners();
    },
    
    // Methods
    loadFromLocalStorage() {
      const data = localStorage.getItem('webropol_module_data');
      this.items = data ? JSON.parse(data) : [];
    },
    
    saveToLocalStorage() {
      localStorage.setItem('webropol_module_data', JSON.stringify(this.items));
    }
  }
}
```

### 4. localStorage Conventions (CRITICAL)
- **Prefix ALL keys**: `webropol_*` (e.g., `webropol_global_settings`, `webropol_survey_123`)
- **Preserve existing data**: Read full object, merge changes, then write back
- **Error handling**: Wrap in try/catch (quota limits, private browsing)

```javascript
// CORRECT pattern
try {
  const existing = JSON.parse(localStorage.getItem('webropol_surveys') || '{}');
  existing.newSurvey = { id: 123, name: 'Test' };
  localStorage.setItem('webropol_surveys', JSON.stringify(existing));
} catch (e) {
  console.error('localStorage error:', e);
}

// WRONG: overwrites all data
localStorage.setItem('webropol_surveys', JSON.stringify({ newSurvey: {...} }));
```

## Design System Integration

### Quick Component Loading Options

**Option 1: Standalone Bundle** (loads all components at once)
```html
<script type="module" src="design-system/webropol-standalone.js"></script>
```

**Option 2: Modular Imports** (recommended for performance)
```html
<script src="../design-system/components/buttons/Button.js" type="module"></script>
<script src="../design-system/components/cards/Card.js" type="module"></script>
```

### Available Components (see `design-system/components/`)
- **Navigation**: `Sidebar`, `Header`, `Breadcrumbs`
- **Buttons**: `Button` (9 variants: primary, secondary, tertiary, danger, success, royal, royalViolet, royalBlue, royalTurquoise)
- **Cards**: `Card`, `ActionCard`, `ListCard`, `VideoCard`, `ConfigurableCard`
- **Forms**: `Input`, `Badge`, `Tooltip`
- **Modals**: `Modal`, `SettingsModal`
- **Feedback**: `Loading` (types: spinner, dots, pulse, bars)
- **Interactive**: `FloatingButton`, `Tabs`

### Color Token System (ALWAYS use these)
```html
<!-- Primary (cyan/teal) -->
<div class="bg-webropol-primary-500 text-white">...</div>
<button class="hover:bg-webropol-primary-600">...</button>

<!-- Grays -->
<div class="bg-webropol-gray-50 text-webropol-gray-900">...</div>

<!-- Extended (status) -->
<span class="bg-webropol-green-100 text-webropol-green-700">Active</span>

<!-- Royal gradients (special) -->
<div class="bg-gradient-to-br from-webropol-royalViolet-500 to-webropol-royalBlue-600">...</div>
```

**NEVER use**: `bg-blue-500`, `text-gray-600`, etc. (arbitrary Tailwind colors)

### Typography & Spacing
```html
<!-- Font weights (Inter family) -->
<h1 class="font-semibold">Title</h1>  <!-- 600 -->
<p class="font-medium">Body</p>       <!-- 500 -->

<!-- Shadows (predefined) -->
<div class="shadow-card">Card</div>
<div class="shadow-medium">Elevated</div>
<div class="shadow-soft">Subtle</div>

<!-- Border radius -->
<div class="rounded-xl">12px</div>
<div class="rounded-2xl">16px</div>
<div class="rounded-3xl">24px</div>
```

## Module-Specific Patterns

### Sidebar Active States (match module name)
```html
<webropol-sidebar active="surveys" base="../"></webropol-sidebar>
<!-- Valid: home, surveys, events, sms, dashboards, mywebropol, admin-tools, training-videos, shop -->
```

### FloatingButton Menu Items
```javascript
items='[
  {
    "id": "survey",
    "label": "Survey",
    "description": "Create custom survey",
    "icon": "fal fa-chart-bar",  // FontAwesome class
    "url": "../surveys/create.html"
  }
]'
```

### AI Integration (webroai module)
```javascript
import { AIEngine } from './ai-engine.js';

const ai = new AIEngine();

// Survey AI
const questions = ai.models.survey.generateQuestions('customer satisfaction survey');

// Event AI
const prediction = ai.models.events.predictAttendance({ capacity: 100, registrations: 120 });

// Analytics AI
const insights = ai.models.analytics.generateInsights(surveyData);

// Distribution AI
const bestTime = ai.models.distribution.optimizeSendTime(audienceData);
```

## Development Workflow

### Creating a New Page
1. **Copy template** from existing module page (e.g., `surveys/index.html`)
2. **Update paths**: Adjust `../` depth in script imports and `base` attribute
3. **Set sidebar active state**: Match module name
4. **Configure breadcrumbs**: Build navigation trail array
5. **Add Alpine.js app**: Create `moduleName()` function
6. **Test navigation**: Verify all links work from different page depths

### Creating a New Component
1. **Extend BaseComponent**: Import from `utils/base-component.js`
2. **Define observedAttributes**: List watched attributes
3. **Implement render()**: Generate innerHTML with Tailwind classes
4. **Implement bindEvents()**: Set up event listeners
5. **Register component**: `customElements.define('webropol-name', ClassName)`
6. **Document usage**: Add examples to design system docs

### Debugging Checklist
- [ ] Check browser console for import errors (ES6 module paths)
- [ ] Verify Tailwind config loaded (inspect element colors)
- [ ] Confirm Alpine.js initialized (`Alpine` global exists)
- [ ] Test localStorage in private browsing mode
- [ ] Validate web component registration (`customElements.get('webropol-*')`)

## Common Anti-Patterns (AVOID)

❌ **Hardcoded colors**: `bg-blue-500` → ✅ `bg-webropol-primary-500`  
❌ **Inline styles**: `style="color: red"` → ✅ `class="text-red-500"`  
❌ **Direct localStorage overwrite** → ✅ Merge with existing data  
❌ **Missing error handling** → ✅ Wrap localStorage in try/catch  
❌ **Framework imports**: `import React` → ✅ Vanilla JS only  
❌ **Build tool config**: `webpack.config.js` → ✅ Not used in this project  
❌ **npm scripts**: `package.json` → ✅ No dependencies  

## Essential Files Reference

- **`design-system/utils/base-component.js`** - Component base class with utilities
- **`design-system/webropol-standalone.js`** - All-in-one component bundle
- **`design-system/styles/tokens.css`** - CSS custom properties (design tokens)
- **`design-system/styles/tokens.js`** - JS design token exports
- **`webroai/ai-engine.js`** - AI model implementations (802 lines)
- **`agent-instructions.json`** - Project-specific rules (Tailwind-only, no emojis, etc.)
- **`docs/SIDEBAR-HEADER-GUIDE.md`** - Navigation component integration guide

## Getting Help

1. **Component APIs**: See `design-system/README.md` for available components
2. **Integration patterns**: Check `docs/INTEGRATION.md` for migration guides
3. **Example pages**: Reference `surveys/index.html` or `events/index.html` for complete implementations
4. **Design tokens**: Inspect `design-system/styles/tokens.js` for full color/spacing/typography scales

---

*Last updated: 2025-10-22. Based on codebase analysis of 50+ pages, 30+ components, and 15+ modules.*