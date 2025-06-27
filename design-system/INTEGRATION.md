# Integration Guide: Webropol Design System

This guide shows how to integrate the Webropol Design System into your existing project.

## Quick Start

### 1. Include the Design System in your HTML

Add this to your HTML `<head>` section:

```html
<!-- Include the design system CSS -->
<link rel="stylesheet" href="design-system/styles/animations.css">

<!-- Include the design system JS (at the end of body) -->
<script type="module" src="design-system/index.js"></script>
```

### 2. Update your existing index.html

Replace the existing component imports in your `index.html`:

```html
<!-- OLD: Individual component imports -->
<!-- 
<script src="components/sidebar.js" type="module"></script>
<script src="components/header.js" type="module"></script>
<script src="components/breadcrumbs.js" type="module"></script>
<script src="components/floating-button.js" type="module"></script>
-->

<!-- NEW: Design system import -->
<script type="module" src="design-system/index.js"></script>
```

### 3. Replace existing components with design system components

#### Before (using existing components):
```html
<button class="mt-2 px-6 py-2 bg-webropol-teal-600 text-white font-semibold rounded-full shadow hover:bg-webropol-teal-700 transition">
    Create survey
</button>
```

#### After (using design system):
```html
<webropol-button variant="primary" size="md" icon="plus">
    Create survey
</webropol-button>
```

## Component Migration Examples

### 1. Migrating Activity Cards

#### Before:
```html
<div class="flex items-center justify-between bg-white/80 border border-webropol-teal-50 rounded-xl px-6 py-4 transition-shadow duration-200 hover:shadow-xl">
    <span class="font-medium text-webropol-gray-900">Survey Name</span>
    <span class="bg-webropol-green-100 text-webropol-green-700 text-xs px-3 py-1 rounded-full">Open</span>
</div>
```

#### After:
```html
<webropol-card variant="elevated" title="Survey Name" clickable>
    <div class="flex justify-end">
        <webropol-badge variant="success">Open</webropol-badge>
    </div>
</webropol-card>
```

### 2. Migrating the Activity Tabs

#### Before:
```html
<div class="inline-flex bg-webropol-teal-50 p-1.5 rounded-full shadow-soft border border-webropol-teal-100 gap-1">
    <button :class="selectedActivityTab === 'all' ? 'bg-webropol-teal-600 text-white' : 'text-webropol-gray-600'"
            class="px-7 py-3 rounded-full font-semibold"
            @click="selectedActivityTab = 'all'">
        All
    </button>
    <!-- More buttons... -->
</div>
```

#### After:
```html
<webropol-tabs 
    active-tab="all"
    variant="pills"
    tabs='[
        {"id": "all", "label": "All"},
        {"id": "surveys", "label": "Surveys"},
        {"id": "events", "label": "Events"}
    ]'>
</webropol-tabs>
```

### 3. Migrating Modals

#### Before:
```html
<div x-show="showCreateFolder" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="p-6 border-b border-webropol-gray-200">
            <h3 class="text-xl font-bold text-webropol-gray-900">Create New Folder</h3>
        </div>
        <!-- Content -->
    </div>
</div>
```

#### After:
```html
<webropol-modal id="create-folder-modal" title="Create New Folder" size="md" closable>
    <!-- Content goes here -->
</webropol-modal>
```

## Alpine.js Integration

The design system works alongside Alpine.js. Here's how to integrate them:

### 1. Update your Alpine.js data function

```javascript
function libraryApp() {
    return {
        // Existing data properties
        selectedActivityTab: 'all',
        activities: [...],
        
        // Methods for design system integration
        handleTabChange(event) {
            this.selectedActivityTab = event.detail.activeTab;
        },
        
        openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.open();
        },
        
        closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.close();
        }
    }
}
```

### 2. Listen to design system events

```javascript
// In your Alpine.js component or globally
document.addEventListener('webropol-tab-change', (event) => {
    // Handle tab changes
    console.log('Tab changed to:', event.detail.activeTab);
});

document.addEventListener('webropol-button-click', (event) => {
    // Handle button clicks
    console.log('Button clicked:', event.detail);
});
```

## Existing Components Integration

Your existing components can still be used alongside the design system:

### Keep using your existing components:
- `<webropol-sidebar>` (already well-structured)
- `<webropol-header>` (already well-structured)
- `<webropol-breadcrumbs>` (already well-structured)
- `<webropol-floating-button>` (already well-structured)

### Replace with design system components:
- Manual button elements → `<webropol-button>`
- Manual cards → `<webropol-card>`
- Manual modals → `<webropol-modal>`
- Manual badges → `<webropol-badge>`
- Manual form fields → `<webropol-input>`

## Step-by-Step Migration

### Phase 1: Setup (Low Risk)
1. Add design system files to your project
2. Include design system CSS and JS
3. Test that everything still works

### Phase 2: Replace Simple Components (Medium Risk)
1. Replace button elements with `<webropol-button>`
2. Replace badge/status elements with `<webropol-badge>`
3. Add tooltips where helpful with `<webropol-tooltip>`

### Phase 3: Replace Complex Components (High Risk)
1. Replace manual modals with `<webropol-modal>`
2. Replace custom tabs with `<webropol-tabs>`
3. Replace form elements with `<webropol-input>`

### Phase 4: Enhance with New Features
1. Add loading states with `<webropol-loading>`
2. Improve cards with `<webropol-card>`
3. Add consistent styling across all pages

## Configuration Options

You can customize the design system initialization:

```javascript
// Manual initialization with options
window.WebropolDesignSystem.init({
    theme: 'light', // 'light', 'dark', 'auto'
    accessibility: true,
    cssCustomProperties: true,
    announcements: false // Set to false to reduce console output
});
```

## Testing

After migration, test these scenarios:

1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with screen reader software
3. **Mobile Responsiveness**: Test on different screen sizes
4. **Theme Switching**: If using dark mode
5. **Component Events**: Ensure all interactions work
6. **Performance**: Check page load times

## Troubleshooting

### Common Issues:

1. **Components not rendering**: Check that design system JS is loaded
2. **Styling conflicts**: Design system components should be self-contained
3. **Event handling**: Use design system events instead of direct DOM events
4. **Alpine.js conflicts**: Make sure Alpine.js loads after design system

### Debug Mode:

```javascript
// Enable debug logging
window.WebropolDesignSystem.init({
    announcements: true
});

// Check what components are loaded
console.log(window.WebropolDesignSystem.getVersion());
```

## Benefits After Migration

1. **Consistency**: All components follow the same design patterns
2. **Accessibility**: Built-in WCAG compliance
3. **Maintainability**: Centralized component logic
4. **Scalability**: Easy to add new components
5. **Developer Experience**: Clear component APIs
6. **Performance**: Optimized component loading
7. **Documentation**: Self-documenting component system
