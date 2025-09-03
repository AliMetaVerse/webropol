# Webropol Unified Tabs Component System

## Overview

This document describes the redesigned and unified tabs component system implemented across all Webropol applications. The system provides consistent styling, behavior, and accessibility while maintaining the existing color scheme.

## Design Principles

### 1. Consistency
- All tab implementations use the same visual language
- Consistent spacing, typography, and interaction patterns
- Unified color system based on design tokens

### 2. Accessibility
- Full keyboard navigation support (Arrow keys, Home, End)
- Proper ARIA attributes and roles
- Focus management and visible focus indicators
- Screen reader compatibility
- High contrast mode support
- Reduced motion support

### 3. Visual Hierarchy
- Clear active/inactive states
- Smooth transitions and animations
- Consistent iconography
- Proper spacing and alignment

### 4. Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interaction areas

## Tab Variants

### 1. Pills Variant (Default)
**Usage**: Primary navigation, main interfaces
**Appearance**: Rounded pill-shaped tabs with background container
**Best for**: 2-4 primary navigation options

```html
<webropol-tabs 
  variant="pills" 
  size="md" 
  tabs='[{"id":"tab1","label":"Overview","icon":"chart-bar"},{"id":"tab2","label":"Details","icon":"list-ul"}]'
  active-tab="tab1">
</webropol-tabs>
```

### 2. Underline Variant
**Usage**: Secondary navigation, content organization
**Appearance**: Underlined tabs with border bottom
**Best for**: Multiple content sections, filtering

```html
<webropol-tabs 
  variant="underline" 
  size="md" 
  tabs='[{"id":"all","label":"All","icon":"list"},{"id":"drafts","label":"Drafts","icon":"edit"}]'
  active-tab="all">
</webropol-tabs>
```

### 3. Modern Variant
**Usage**: Feature toggles, mode switching
**Appearance**: Gradient background with glassmorphism effect
**Best for**: Interface modes, special states

```html
<webropol-tabs 
  variant="modern" 
  size="lg" 
  tabs='[{"id":"upcoming","label":"Upcoming Events","icon":"calendar-alt"}]'
  active-tab="upcoming">
</webropol-tabs>
```

### 4. Admin Variant
**Usage**: Administrative interfaces, complex navigation
**Appearance**: Bordered tabs in a container
**Best for**: Admin panels, management interfaces

```html
<webropol-tabs 
  variant="admin" 
  size="md" 
  tabs='[{"id":"users","label":"User Management","icon":"users"}]'
  active-tab="users">
</webropol-tabs>
```

## Size Options

### Small (sm)
- Padding: 8px 16px
- Font size: 14px
- Min width: 80px
- Use for: Compact interfaces, mobile views

### Medium (md) - Default
- Padding: 12px 24px
- Font size: 14px
- Min width: 120px
- Use for: Standard interfaces

### Large (lg)
- Padding: 16px 32px
- Font size: 16px
- Min width: 140px
- Use for: Primary navigation, prominent interfaces

## Color System

The tab system uses the unified Webropol design tokens:

### Primary Colors (Teal)
- **Active State**: `--primary-600` (#1d809d)
- **Hover State**: `--primary-700` (#1e6880)
- **Background**: `--primary-50` (#eefbfd)
- **Border**: `--primary-100` (#d5f4f8)

### Neutral Colors
- **Inactive Text**: `--neutral-600` (#787f81)
- **Hover Text**: `--neutral-800` (#515557)
- **Borders**: `--neutral-200` (#e6e7e8)
- **Backgrounds**: `--neutral-50` (#f9fafa)

## Implementation Examples

### 1. Surveys List Page
```html
<!-- Filter tabs using pills variant -->
<div class="webropol-tabs">
    <button class="webropol-tab active">
        <i class="fas fa-list mr-2"></i>
        All
    </button>
    <button class="webropol-tab">
        <i class="fas fa-edit mr-2"></i>
        Drafts
    </button>
    <button class="webropol-tab">
        <i class="fas fa-globe mr-2"></i>
        Published
    </button>
    <button class="webropol-tab">
        <i class="fas fa-lock mr-2"></i>
        Closed
    </button>
</div>
```

### 2. Events List Page
```html
<!-- Mode switching using modern variant -->
<div class="webropol-tabs mb-6">
    <button class="webropol-tab active">
        <i class="fas fa-calendar-alt mr-2"></i>
        Upcoming Events
    </button>
    <button class="webropol-tab">
        <i class="fas fa-archive mr-2"></i>
        Archived Events
    </button>
</div>
```

### 3. Admin Panel
```html
<!-- Admin navigation using admin variant -->
<div class="admin-tabs">
    <button class="admin-tab active">
        <i class="fal fa-users"></i>
        User Management
    </button>
    <button class="admin-tab">
        <i class="fal fa-server"></i>
        Environments
    </button>
    <button class="admin-tab">
        <i class="fal fa-cog"></i>
        System Settings
    </button>
</div>
```

### 4. Main Interface
```html
<!-- Primary interface switching -->
<div class="webropol-main-tabs">
    <button class="webropol-main-tab active">
        <i class="fal fa-th-large mr-2"></i>
        Classic
    </button>
    <button class="webropol-main-tab">
        <i class="fal fa-magic mr-2"></i>
        Magic
    </button>
</div>
```

## CSS Architecture

### Base Styles
All tabs inherit from base tab component styles defined in `design-system/styles/tabs.css`:

```css
.tab-button {
  cursor: pointer;
  border: none;
  background: none;
  transition: all var(--transition-normal) cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}
```

### Variant-Specific Styles
Each variant has its own container and styling:

- `.tabs-pills` - Pill variant container
- `.tabs-underline` - Underline variant container
- `.tabs-modern` - Modern variant container
- `.tabs-admin` - Admin variant container

### State Management
Active states are managed through CSS classes:

- `.active` - Applied to active tab buttons
- `:hover` - Hover state styling
- `:focus-visible` - Keyboard focus styling

## JavaScript Integration

### Custom Element
The `WebropolTabs` custom element provides programmatic control:

```javascript
// Create tabs programmatically
const tabsElement = document.createElement('webropol-tabs');
tabsElement.setAttribute('variant', 'pills');
tabsElement.setAttribute('tabs', JSON.stringify([
  { id: 'tab1', label: 'Tab 1', icon: 'home' },
  { id: 'tab2', label: 'Tab 2', icon: 'settings' }
]));

// Listen for tab changes
tabsElement.addEventListener('webropol-tab-change', (event) => {
  console.log('Active tab:', event.detail.activeTab);
});
```

### Alpine.js Integration
For Alpine.js applications, use reactive classes:

```html
<button :class="activeTab === 'overview' ? 'webropol-tab active' : 'webropol-tab'"
        @click="activeTab = 'overview'">
  Overview
</button>
```

## Browser Support

- **Modern Browsers**: Full feature support
- **IE11**: Basic functionality with graceful degradation
- **Mobile**: Touch-optimized interactions
- **Screen Readers**: Full accessibility support

## Migration Guide

### From Old Tab Implementations

1. **Replace CSS classes**:
   - `.tab-active` → `.webropol-tab.active`
   - `.tab-inactive` → `.webropol-tab`
   - `.tab-modern` → `.webropol-tab` (in modern variant container)
   - `.admin-tab` → `.admin-tab` (updated styles)

2. **Update HTML structure**:
   - Wrap tabs in appropriate variant container
   - Add consistent icon and text structure
   - Ensure proper ARIA attributes

3. **Include design system CSS**:
   ```html
   <link rel="stylesheet" href="design-system/styles/tabs.css">
   ```

### Backward Compatibility
Old implementations will continue to work but should be migrated for consistency and improved accessibility.

## Testing

### Accessibility Testing
- Keyboard navigation (Tab, Arrow keys, Enter, Space)
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- High contrast mode
- Reduced motion preferences

### Visual Testing
- Cross-browser consistency
- Responsive behavior
- Animation smoothness
- Color contrast ratios

### Functional Testing
- Tab switching behavior
- State persistence
- Event handling
- Dynamic content updates

## Performance Considerations

- **CSS**: Optimized selectors and minimal reflows
- **JavaScript**: Event delegation and efficient DOM updates
- **Animations**: GPU-accelerated transforms
- **Bundle Size**: Minimal impact on overall application size

## Future Enhancements

1. **Vertical Tabs**: Support for vertical tab layouts
2. **Closable Tabs**: Add close buttons for dynamic tabs
3. **Drag & Drop**: Reorderable tab functionality
4. **Badge Support**: Enhanced badge styling and positioning
5. **Theme Variants**: Additional color themes

## Support

For questions or issues with the tab system:
1. Check this documentation first
2. Review the design system files
3. Test in the component playground
4. Submit issues through the development workflow

---

**Last Updated**: August 20, 2025
**Version**: 1.0.0
**Maintainer**: Webropol Development Team
