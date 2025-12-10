# Accordion Component

A reusable, accessible accordion component for collapsible content sections with customizable variants and header actions.

## Features

- ✅ **Multiple Variants**: Default, elevated, and minimal styles
- ✅ **Header Actions Slot**: Add custom buttons (Edit, Delete, etc.)
- ✅ **Badge Support**: Display status badges with different color variants
- ✅ **Icon Support**: Optional left-side icon with custom colors
- ✅ **Smooth Animations**: CSS transitions for expand/collapse
- ✅ **Accessibility**: Proper ARIA attributes and keyboard support
- ✅ **Events**: Emits custom events on toggle

## Installation

```html
<script src="../design-system/components/interactive/Accordion.js" type="module"></script>
```

## Basic Usage

```html
<webropol-accordion title="Accordion Title" subtitle="Optional subtitle">
  <p>Content goes here</p>
</webropol-accordion>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | required | Main accordion title |
| `subtitle` | string | - | Optional subtitle text |
| `expanded` | boolean | `false` | Initial expanded state |
| `variant` | string | `'default'` | Visual style variant |
| `show-icon` | boolean | `false` | Show left-side icon |
| `icon` | string | `'fa-light fa-layer-group'` | FontAwesome icon class |
| `icon-color` | string | `'text-webropol-primary-500'` | Icon color class |
| `badge-label` | string | - | Optional badge text |
| `badge-variant` | string | `'primary'` | Badge color variant |

### Variant Options

- `default`: White background with border
- `elevated`: White background with shadow (recommended for cards)
- `minimal`: Transparent background, bottom border only (good for FAQs)
- `grouped`: For use inside a parent container (no border radius, transparent background, bottom border between items)

### Badge Variant Options

- `primary`: Cyan/teal (webropol-primary)
- `success`: Green
- `warning`: Yellow
- `danger`: Red

## Slots

| Slot Name | Description |
|-----------|-------------|
| `default` | Main accordion body content |
| `header-actions` | Custom action buttons (placed before chevron) |

## Events

| Event Name | Detail | Description |
|------------|--------|-------------|
| `accordion-toggle` | `{ expanded: boolean, title: string }` | Emitted when accordion is toggled |

## Examples

### Elevated Variant with Actions (Rule Group Style)

```html
<webropol-accordion 
  title="Rule Group 1" 
  subtitle="3 conditions • 2 actions"
  variant="elevated"
  show-icon
  icon="fa-light fa-layer-group"
  badge-label="Active"
  badge-variant="success">
  
  <div slot="header-actions" class="flex items-center gap-3">
    <button class="px-5 py-2.5 bg-white text-webropol-primary-600 border-2 border-webropol-primary-600 rounded-full hover:bg-webropol-primary-50 transition-all text-sm font-semibold">
      <i class="fa-light fa-pencil"></i>
      Edit
    </button>
    <button class="px-5 py-2.5 bg-white text-red-600 border-2 border-red-600 rounded-full hover:bg-red-50 transition-all text-sm font-semibold">
      <i class="fa-light fa-trash-can"></i>
      Delete
    </button>
    <div class="w-px h-8 bg-webropol-gray-300 mx-1"></div>
  </div>

  <div class="space-y-4">
    <div>
      <h4 class="font-semibold mb-2">IF</h4>
      <p>Conditions go here...</p>
    </div>
    <div>
      <h4 class="font-semibold mb-2">THEN</h4>
      <p>Actions go here...</p>
    </div>
  </div>
</webropol-accordion>
```

### Minimal Variant (FAQ Style)

```html
<webropol-accordion 
  title="How do I create a survey?" 
  variant="minimal">
  <p>To create a survey, navigate to the Surveys section and click "Add new survey".</p>
</webropol-accordion>
```

### Grouped Variant (Shared Container)

```html
<div class="border border-webropol-gray-200 rounded-xl overflow-hidden bg-white shadow-card">
  <webropol-accordion 
    title="Grouped Accordion 1" 
    subtitle="First item in the group"
    variant="grouped">
    <p>Content for first accordion item.</p>
  </webropol-accordion>

  <webropol-accordion 
    title="Grouped Accordion 2" 
    subtitle="Second item in the group"
    variant="grouped"
    show-icon
    icon="fa-light fa-layer-group">
    <p>Content for second accordion item.</p>
  </webropol-accordion>

  <webropol-accordion 
    title="Grouped Accordion 3" 
    subtitle="Third item in the group"
    variant="grouped"
    show-icon
    icon="fa-light fa-heart">
    <p>Content for third accordion item. Notice no border on the last item.</p>
  </webropol-accordion>
</div>
```

### With Alpine.js Integration

```html
<webropol-accordion 
  :title="group.name"
  :subtitle="`${group.conditions.length} conditions • ${group.actions.length} actions`"
  variant="elevated"
  show-icon
  @accordion-toggle="console.log($event.detail)">
  
  <div x-html="group.content"></div>
</webropol-accordion>
```

### Listen to Events

```javascript
document.querySelector('webropol-accordion')
  .addEventListener('accordion-toggle', (event) => {
    const { expanded, title } = event.detail;
    console.log(`${title} is now ${expanded ? 'expanded' : 'collapsed'}`);
  });
```

## Styling

The component uses Webropol design tokens for consistency:

- **Primary colors**: `webropol-primary-*` (cyan/teal)
- **Gray scale**: `webropol-gray-*`
- **Borders**: `border-webropol-gray-200`
- **Shadows**: `shadow-card`, `shadow-medium`

### Custom Styling

You can override styles using CSS:

```css
webropol-accordion {
  margin-bottom: 1rem;
}

webropol-accordion .accordion-title {
  font-size: 1.25rem;
}
```

## Accessibility

The component follows accessibility best practices:

- Semantic HTML structure
- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Proper button labels

## Browser Support

Works in all modern browsers that support:
- Custom Elements (Web Components)
- CSS Flexbox
- CSS Transitions

## Integration with rule-groups-list.html

The accordion is being used in `examples/group-rules-list.html`:

```html
<template x-for="(group, index) in savedGroups.slice().reverse()" :key="index">
  <webropol-accordion 
    :title="group.groupName || 'Group Rule Name'"
    :subtitle="`${(group.conditions || []).length} conditions • ${(group.actions || []).length} actions`"
    variant="elevated"
    show-icon
    icon="fa-light fa-layer-group"
    x-data="{ groupData: group }">
    
    <div slot="header-actions">
      <!-- Edit, Delete buttons -->
    </div>
    
    <!-- Rule content -->
  </webropol-accordion>
</template>
```

## Demo

See the live demo at: `design-system/demos/accordion-demo.html`

## Related Components

- **Card** (`webropol-card`): For static content containers
- **Modal** (`webropol-modal`): For overlay dialogs
- **Tabs** (`webropol-tabs`): For tabbed content organization
