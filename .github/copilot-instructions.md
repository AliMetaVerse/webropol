# Webropol AI Coding Agent Instructions

## Project Overview

Webropol is a comprehensive survey and event management platform built as a **multi-page application (MPA)** with:
- **Frontend**: HTML5, CSS3 (Tailwind), JavaScript (vanilla ES6+ modules), Alpine.js for reactivity
- **Design System**: Custom web components (`webropol-*`) based on ES6 classes extending HTMLElement
- **Architecture**: Module-based with SPA navigation capabilities via `spa-router.js`
- **AI Features**: Native AI models for survey/event optimization in `webroai/` module
- **No Backend**: Pure frontend implementation with localStorage for data persistence

## Core Architecture Patterns

### 1. Modular Page Structure
```
webropol/
├── [module]/index.html          # Main module entry point  
├── design-system/               # Reusable UI components
│   ├── components/              # Web components organized by type
│   ├── utils/                   # Base classes and utilities
│   └── styles/                  # Consistent design tokens
├── webroai/                     # AI-first survey/event platform
└── docs/                        # Detailed specifications and guides
```

**Key Pattern**: Each module is self-contained with its own `index.html`, but shares the design system and follows consistent integration patterns.

### 2. Design System Integration
Every page MUST follow this standard pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Standard Tailwind + FontAwesome + Alpine.js stack -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  
  <!-- Webropol design tokens and components -->
  <script src="../design-system/components/navigation/Sidebar.js" type="module"></script>
  <script src="../design-system/components/navigation/Header.js" type="module"></script>
  <!-- Additional components as needed -->
</head>
<body>
  <div class="flex h-screen">
    <webropol-sidebar active="[module-name]" base="../"></webropol-sidebar>
    <div class="flex-1 overflow-hidden">
      <webropol-header title="[Page Title]"></webropol-header>
      <!-- Page content -->
    </div>
  </div>
</body>
</html>
```

### 3. Component Architecture
**Web Components Pattern**: All UI components extend `BaseComponent` (in `utils/base-component.js`):

```javascript
import { BaseComponent } from '../../utils/base-component.js';

export class WebropolButton extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled'];
  }
  
  render() {
    // Component HTML using Tailwind classes
  }
  
  bindEvents() {
    // Event handling logic
  }
}

customElements.define('webropol-button', WebropolButton);
```

**Usage in HTML**:
```html
<webropol-button variant="primary" size="md">Save Changes</webropol-button>
<webropol-card title="Survey Analytics" badge="Active">
  Content here
</webropol-card>
```

## Design Tokens & Styling

### Color System (Consistent Across All Pages)
- **Primary**: `webropol-primary-50` through `webropol-primary-900` (teal/cyan)
- **Gray Scale**: `webropol-gray-50` through `webropol-gray-900`
- **Extended**: `webropol-green`, `webropol-red` for status indicators

### Typography
- **Font Family**: Inter (loaded via Google Fonts)
- **Component Classes**: Use Tailwind utilities with design tokens

### Example Tailwind Config (Standard Pattern):
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'webropol-primary': { 
          50: '#f0fdff', 500: '#06b6d4', 700: '#0e7490', 900: '#164e63'
        },
        'webropol-gray': { 
          50: '#f8fafc', 500: '#64748b', 900: '#0f172a'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

## Critical Development Patterns

### 1. Page Creation Workflow
1. **Start with template**: Use existing page structure as reference
2. **Set active sidebar**: `<webropol-sidebar active="module-name">` 
3. **Load required components**: Import only needed design system components
4. **Follow path conventions**: `../components/` for relative imports

### 2. Component Integration
- **Standalone option**: Use `design-system/webropol-standalone.js` for all-in-one loading
- **Modular option**: Import specific components via ES6 modules
- **Always validate**: Run validation script if available

### 3. State Management (Alpine.js Pattern)
```javascript
// Standard Alpine.js app structure
function moduleName() {
  return {
    // Reactive data
    items: [],
    loading: false,
    
    // Lifecycle
    init() {
      this.loadData();
    },
    
    // Methods
    loadData() {
      // Implementation
    }
  }
}
```

### 4. SPA Navigation (Optional)
For complex modules, use `design-system/utils/spa-router.js`:
- Enables client-side routing between module pages
- Maintains consistent navigation experience
- Preserves Alpine.js state across route changes

## AI-Specific Features (WebropAI Module)

The `webroai/` directory contains AI-first survey and event management:
- **AI Models**: `ai-engine.js` with SurveyAI, EventAI, AnalyticsAI classes
- **Natural Language**: Prompt-to-question generation, intent detection
- **Predictive Analytics**: Attendance forecasting, engagement prediction
- **Real-time Insights**: Sentiment analysis, anomaly detection

**Integration Pattern**:
```javascript
import { AIEngine } from './ai-engine.js';

const ai = new AIEngine();
const suggestions = ai.surveyAI.generateQuestions(userInput);
const insights = ai.analyticsAI.generateInsights(surveyData);
```

## Validation & Quality Assurance

### Required Checks Before Submission
1. **Component Integration**: All `webropol-*` components properly imported
2. **Design Tokens**: Use `webropol-primary-*` and `webropol-gray-*` color classes
3. **Accessibility**: Proper ARIA labels, keyboard navigation support
4. **Mobile Responsive**: Test on mobile breakpoints
5. **Alpine.js Integration**: State management follows established patterns

### Validation Script
If available, run: `node validate-pages.js` to verify:
- Sidebar/Header component usage
- Required script imports  
- HTML structure compliance

## Common Pitfalls to Avoid

1. **Don't mix component patterns**: Stick to web components, avoid mixing with other frameworks
2. **Don't break path conventions**: Use relative imports consistently (`../design-system/`)
3. **Don't ignore design tokens**: Always use `webropol-*` color classes, not arbitrary Tailwind colors
4. **Don't skip component registration**: Ensure `customElements.define()` for new components
5. **Don't forget Alpine.js reactivity**: Use `x-data`, `x-show`, `x-model` for dynamic behavior

## Quick Reference

### Essential Files
- `design-system/utils/base-component.js` - Component base class
- `design-system/webropol-standalone.js` - All-in-one component bundle
- `agent-instructions.json` - Project-specific coding rules
- `README.md` - Page structure and validation guide

### Component Registry
Standard components available: `webropol-button`, `webropol-card`, `webropol-action-card`, `webropol-list-card`, `webropol-modal`, `webropol-sidebar`, `webropol-header`, `webropol-tabs`

### Module Sidebar Active States
- `home`, `surveys`, `events`, `sms`, `dashboards`, `mywebropol`, `admin-tools`, `training-videos`, `shop`

---
*Generated from codebase analysis. For questions about specific implementations, consult the detailed documentation in `/docs/` or examine existing module patterns.*