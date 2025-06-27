# Webropol Design System

A modular, scalable design system built with HTML, CSS (Tailwind), and JavaScript for the Webropol platform.

## 🏗️ Structure

```
design-system/
├── components/          # Reusable UI components
│   ├── buttons/
│   ├── cards/
│   ├── modals/
│   ├── forms/
│   ├── navigation/
│   ├── feedback/
│   └── layout/
├── utils/              # Utility functions and helpers
│   ├── base-component.js
│   ├── theme-utils.js
│   └── accessibility.js
├── styles/             # Global styles and tokens
│   ├── tokens.js
│   ├── animations.css
│   └── utilities.css
└── index.js           # Main entry point
```

## 🎨 Design Tokens

### Colors
- **Primary**: Webropol Teal (`webropol-teal-*`)
- **Secondary**: Webropol Blue (`webropol-blue-*`)
- **Neutral**: Webropol Gray (`webropol-gray-*`)

### Typography
- **Font Family**: Inter
- **Font Weights**: 300, 400, 500, 600, 700

### Spacing & Layout
- **Border Radius**: `rounded-xl` (12px) for cards, `rounded-full` for pills
- **Shadows**: `shadow-card`, `shadow-soft`, `shadow-medium`

## 🧩 Components

### Core Components
- **Button** - Various styles and states
- **Card** - Content containers with consistent styling
- **Modal** - Overlay dialogs and popups
- **Tooltip** - Contextual information display
- **Badge** - Status indicators and labels
- **Tabs** - Content organization and navigation
- **Form Controls** - Input fields, selects, checkboxes
- **Loading** - Progress indicators and spinners

### Navigation Components
- **Sidebar** - Primary navigation
- **Header** - Top navigation bar
- **Breadcrumbs** - Navigation trail
- **Pagination** - Content navigation

### Layout Components
- **Container** - Content wrappers
- **Grid** - Layout system
- **Spacer** - Consistent spacing

## 🚀 Usage

### 1. Include the design system
```html
<script src="design-system/index.js" type="module"></script>
```

### 2. Use components
```html
<webropol-button variant="primary" size="md">
  Click me
</webropol-button>

<webropol-card title="Card Title" variant="elevated">
  Card content goes here
</webropol-card>
```

### 3. Customize with attributes
Most components accept standard attributes for customization:
- `variant` - Style variation (primary, secondary, etc.)
- `size` - Size variation (sm, md, lg, xl)
- `disabled` - Disabled state
- `icon` - Icon name (FontAwesome)

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader compatibility

## 🔧 Development

### Adding New Components
1. Create component file in appropriate subfolder
2. Extend `BaseComponent` class
3. Define component markup and behavior
4. Add to main index.js
5. Update documentation

### Best Practices
- Use semantic HTML
- Follow Tailwind utility-first approach
- Maintain consistent naming conventions
- Test accessibility features
- Document component APIs
