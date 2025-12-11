# Page Quick Actions Component

## Overview

The `PageQuickActions` component provides a centered, visually separated toolbar for page-level actions in survey/form editors. It displays action buttons in a subtle, non-distractive manner with a dashed separator line to distinguish them from content.

## Usage

### Basic Usage

```html
<!-- Import the component -->
<script src="../design-system/components/interactive/PageQuickActions.js" type="module"></script>

<!-- Use with default actions -->
<webropol-page-quick-actions></webropol-page-quick-actions>
```

### Custom Actions

```html
<webropol-page-quick-actions 
  actions='[
    {"id":"add-question","label":"Add Question","icon":"fal fa-plus-circle","color":"primary"},
    {"id":"add-text","label":"Add Text/Media","icon":"fal fa-text","color":"purple"},
    {"id":"add-break","label":"Add Page Break","icon":"fal fa-cut","color":"orange"}
  ]'
></webropol-page-quick-actions>
```

### Without Label

```html
<webropol-page-quick-actions show-label="false"></webropol-page-quick-actions>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `actions` | JSON string | Default actions | Array of action button configurations |
| `show-label` | boolean | `true` | Whether to show "Quick Actions" label |

## Action Object Structure

```javascript
{
  id: string,        // Unique identifier for the action
  label: string,     // Button text
  icon: string,      // FontAwesome icon class (e.g., "fal fa-plus-circle")
  color: string      // Color theme: primary, purple, orange, green, red
}
```

## Color Themes

Available color themes for actions:

- **primary** - Webropol cyan/teal (for primary actions)
- **purple** - Purple/pink (for content actions)
- **orange** - Orange/amber (for structural actions)
- **green** - Green (for positive actions)
- **red** - Red (for destructive actions)

## Events

### `action-click`

Fired when an action button is clicked.

**Event Detail:**
```javascript
{
  actionId: string,      // ID of the clicked action
  action: object,        // Full action object
  originalEvent: Event   // Original click event
}
```

**Example:**
```javascript
const quickActions = document.querySelector('webropol-page-quick-actions');
quickActions.addEventListener('action-click', (e) => {
  console.log('Action clicked:', e.detail.actionId);
  
  switch(e.detail.actionId) {
    case 'add-question':
      // Handle add question
      break;
    case 'add-text':
      // Handle add text/media
      break;
    case 'add-break':
      // Handle add page break
      break;
  }
});
```

## Default Actions

If no `actions` attribute is provided, these defaults are used:

```javascript
[
  { 
    id: 'add-question', 
    label: 'Add Question', 
    icon: 'fal fa-plus-circle', 
    color: 'primary' 
  },
  { 
    id: 'add-text', 
    label: 'Add Text/Media', 
    icon: 'fal fa-text', 
    color: 'purple' 
  },
  { 
    id: 'add-break', 
    label: 'Add Page Break', 
    icon: 'fal fa-cut', 
    color: 'orange' 
  }
]
```

## Styling

The component uses Webropol design tokens and is fully styled internally. It includes:

- Dashed separator line for visual separation
- Centered layout with pill-shaped background
- Subtle hover effects on buttons
- Color-coded icons based on action theme
- Responsive design (wraps on smaller screens)

## Accessibility

- All buttons are keyboard accessible
- Proper semantic HTML with button elements
- Clear visual feedback on hover/focus
- Icon + text labels for clarity

## Examples

### Survey Editor

```html
<section class="survey-page">
  <!-- Page content here -->
  
  <webropol-page-quick-actions></webropol-page-quick-actions>
</section>

<script>
  const actions = document.querySelector('webropol-page-quick-actions');
  actions.addEventListener('action-click', (e) => {
    if (e.detail.actionId === 'add-question') {
      openQuestionModal();
    }
  });
</script>
```

### Form Builder

```html
<webropol-page-quick-actions 
  actions='[
    {"id":"add-field","label":"Add Field","icon":"fal fa-plus","color":"primary"},
    {"id":"add-section","label":"Add Section","icon":"fal fa-layer-plus","color":"purple"},
    {"id":"add-logic","label":"Add Logic","icon":"fal fa-project-diagram","color":"orange"}
  ]'
></webropol-page-quick-actions>
```

### Minimal Version

```html
<webropol-page-quick-actions 
  show-label="false"
  actions='[
    {"id":"add","label":"Add Item","icon":"fal fa-plus","color":"primary"}
  ]'
></webropol-page-quick-actions>
```

## Design Principles

1. **Non-intrusive** - Subtle styling that doesn't compete with content
2. **Clearly separated** - Dashed line makes it clear these are tools, not content
3. **Centered** - Central placement emphasizes they're page-level functions
4. **Contextual** - Color coding helps users understand action types
5. **Accessible** - Clear labels and proper semantics

## Browser Support

- Modern browsers with Custom Elements support
- Requires FontAwesome for icons
- Uses Tailwind CSS utility classes

## Related Components

- `FloatingButton` - For persistent global actions
- `ContextMenu` - For contextual right-click actions
- `Accordion` - For collapsible content sections
