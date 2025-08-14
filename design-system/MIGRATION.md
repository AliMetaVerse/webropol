# Component Migration Guide

This document outlines the migration from `/components` to `/design-system/components` and the unified component architecture.

## Migration Overview

All components from `/components` have been successfully merged into `/design-system/components` with the following enhancements:

### ✅ Completed Migrations

#### 1. Button Component (`buttons.js` → `buttons/Button.js`)
- **Enhanced**: Added `success` variant, improved styling with `rounded-full`
- **Features**: All original variants (primary, secondary, tertiary, danger, success)
- **New**: Better accessibility, loading states, enhanced hover effects
- **Usage**: Same API, fully backward compatible

#### 2. Card Components (`cards.js` → `cards/Card.js` + `cards/CardLegacy.js`)
- **Main Card**: Enhanced with glass morphism and better flexibility
- **Legacy Cards**: All sub-components preserved for backward compatibility
  - `webropol-card-header`
  - `webropol-card-content`
  - `webropol-card-list`
  - `webropol-card-list-item`
  - `webropol-card-actions`
  - `webropol-gradient-card`
- **New Features**: Better prop-based configuration, slots for flexible content

#### 3. Navigation Components
- **Header**: Enhanced from `header.js` → `navigation/HeaderEnhanced.js`
  - Added configurable notifications, help, user menu
  - Flexible slot system for custom content
- **Sidebar**: Enhanced from `sidebar.js` → `navigation/SidebarEnhanced.js`
  - All original menu items preserved
  - Configurable branding
  - Event system for navigation tracking
- **Breadcrumbs**: Migrated from `breadcrumbs.js` → `navigation/Breadcrumbs.js`
  - Enhanced JSON and string trail support
  - Programmatic trail management

#### 4. Interactive Components
- **Floating Button**: Migrated from `floating-button.js` → `interactive/FloatingButton.js`
  - Enhanced with configurable positions and sizes
  - Improved event system
  - Better animation and accessibility

## New Architecture Benefits

### 1. **BaseComponent Foundation**
All components now extend `BaseComponent` which provides:
- Consistent event handling
- Attribute management utilities
- Accessibility helpers
- Cleanup and lifecycle management

### 2. **Configurable Design System**
- Centralized design tokens in `utils/base-component.js`
- Variant and size classes managed centrally
- Easy theming and customization

### 3. **Enhanced Props & Configuration**
```javascript
// Old way - limited configuration
<webropol-button variant="primary">Click me</webropol-button>

// New way - rich configuration
<webropol-button 
  variant="primary" 
  size="lg" 
  loading="true"
  full-width
  icon="fal fa-save"
  icon-position="left">
  Save Changes
</webropol-button>
```

### 4. **Flexible Content with Slots**
```html
<!-- Enhanced Header with slots -->
<webropol-header-enhanced username="John Doe" show-notifications show-help>
  <h1 slot="title">Dashboard</h1>
  <div slot="actions">
    <webropol-button variant="tertiary" size="sm">Export</webropol-button>
  </div>
</webropol-header-enhanced>
```

## Usage Examples

### Basic Button Usage
```html
<!-- All variants available -->
<webropol-button variant="primary">Primary</webropol-button>
<webropol-button variant="secondary">Secondary</webropol-button>
<webropol-button variant="tertiary">Tertiary</webropol-button>
<webropol-button variant="danger">Delete</webropol-button>
<webropol-button variant="success">Save</webropol-button>

<!-- With icons and loading -->
<webropol-button variant="primary" icon="fal fa-save" loading>Saving...</webropol-button>
```

### Enhanced Card System
```html
<!-- Simple card -->
<webropol-card variant="elevated" clickable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</webropol-card>

<!-- Complex card with legacy components -->
<webropol-card-legacy variant="gradient">
  <webropol-card-header 
    icon="fal fa-chart-bar" 
    title="Analytics Dashboard" 
    subtitle="Real-time insights"
    badge="Pro">
  </webropol-card-header>
  
  <webropol-card-content>
    <webropol-card-list title="Recent Activity">
      <webropol-card-list-item 
        icon="fal fa-users" 
        title="New Survey Response" 
        subtitle="Customer Satisfaction Survey"
        status="active">
      </webropol-card-list-item>
    </webropol-card-list>
  </webropol-card-content>
  
  <webropol-card-actions alignment="right">
    <webropol-button variant="tertiary" size="sm">View Details</webropol-button>
    <webropol-button variant="primary" size="sm">Take Action</webropol-button>
  </webropol-card-actions>
</webropol-card-legacy>
```

### Navigation Components
```html
<!-- Enhanced Sidebar -->
<webropol-sidebar-enhanced 
  active="surveys" 
  brand-title="MyWebropol"
  brand-subtitle="Survey Platform">
  
  <div slot="menu-items">
    <a href="/custom" class="sidebar-link">Custom Link</a>
  </div>
  
  <div slot="footer">
    <p class="text-xs text-gray-500">v2.1.0</p>
  </div>
</webropol-sidebar-enhanced>

<!-- Enhanced Header -->
<webropol-header-enhanced 
  username="John Doe" 
  show-notifications 
  show-help
  title="Survey Dashboard">
  
  <div slot="actions">
    <webropol-button variant="primary" size="sm">Create Survey</webropol-button>
  </div>
</webropol-header-enhanced>

<!-- Breadcrumbs -->
<webropol-breadcrumbs trail='[
  {"label": "Home", "url": "/"},
  {"label": "Surveys", "url": "/surveys"},
  {"label": "Customer Satisfaction", "url": null}
]'></webropol-breadcrumbs>
```

### Floating Action Button
```html
<webropol-floating-button 
  position="bottom-right" 
  size="lg">
</webropol-floating-button>

<script>
// Listen for create events
document.querySelector('webropol-floating-button')
  .addEventListener('create-item', (e) => {
    console.log('Create:', e.detail.type);
    // Handle creation based on type
  });
</script>
```

## Event System

All enhanced components emit consistent events:

```javascript
// Button events
button.addEventListener('webropol-button-click', (e) => {
  console.log('Button clicked:', e.detail.variant);
});

// Card events
card.addEventListener('webropol-card-click', (e) => {
  console.log('Card clicked:', e.detail.title);
});

// Navigation events
sidebar.addEventListener('navigation-click', (e) => {
  console.log('Navigate to:', e.detail.href);
});

// Floating button events
floatingBtn.addEventListener('create-item', (e) => {
  console.log('Create:', e.detail.type);
});
```

## Import Methods

### ES6 Modules
```javascript
import { WebropolButton, WebropolCard } from './design-system/components/index.js';
```

### Script Tags
```html
<script type="module" src="./design-system/components/index.js"></script>
```

### Individual Components
```html
<script type="module" src="./design-system/components/buttons/Button.js"></script>
<script type="module" src="./design-system/components/cards/CardLegacy.js"></script>
```

## Backward Compatibility

All original component names and APIs are preserved:
- `webropol-button` - Enhanced with new features
- `webropol-card` - Enhanced main card component
- `webropol-card-header`, `webropol-card-content`, etc. - Preserved exactly
- `webropol-header` - Available as both enhanced and original
- `webropol-sidebar` - Available as both enhanced and original

## Migration Checklist

- ✅ **Buttons**: Enhanced with success variant and better styling
- ✅ **Cards**: All card types preserved + enhanced main card
- ✅ **Headers**: Enhanced with flexible configuration
- ✅ **Sidebars**: Enhanced with all menu items + customization
- ✅ **Breadcrumbs**: Enhanced with programmatic management
- ✅ **Floating Buttons**: Enhanced with position/size options
- ✅ **Base Architecture**: All components use BaseComponent
- ✅ **Design Tokens**: Centralized theme management
- ✅ **Event System**: Consistent event handling
- ✅ **Documentation**: Complete usage examples
- ✅ **Backward Compatibility**: All existing APIs preserved

## Next Steps

1. **Test all components** in your existing pages
2. **Gradually migrate** to enhanced versions for new features
3. **Customize design tokens** in `utils/base-component.js` for branding
4. **Leverage new props** for better configurability
5. **Use event system** for better interactivity

The `/components` directory can now be safely removed as all functionality has been preserved and enhanced in `/design-system/components`.

