# Floating Toolbar Component

A versatile floating toolbar component that can be positioned anywhere on the screen with support for buttons, dropdowns, and separators.

## Import

```html
<script src="../design-system/components/interactive/FloatingToolbar.js" type="module"></script>
```

## Basic Usage

```html
<webropol-floating-toolbar
  position="top-center"
  variant="default"
  size="medium"
  tools='[
    {
      "type": "dropdown",
      "label": "Table content",
      "icon": "fal fa-table",
      "options": [
        {"label": "Show all", "value": "all", "icon": "fal fa-eye"},
        {"label": "Show selected", "value": "selected", "icon": "fal fa-check-square"},
        {"label": "Hide empty", "value": "hide-empty", "icon": "fal fa-eye-slash"}
      ]
    },
    {
      "type": "separator"
    },
    {
      "type": "button",
      "icon": "fal fa-copy",
      "action": "copy",
      "tooltip": "Copy"
    },
    {
      "type": "button",
      "icon": "fal fa-trash",
      "action": "delete",
      "variant": "danger",
      "tooltip": "Delete"
    },
    {
      "type": "button",
      "icon": "fal fa-cog",
      "action": "settings",
      "tooltip": "Settings"
    }
  ]'>
</webropol-floating-toolbar>
```

## Attributes

### position
Position of the toolbar on screen.

**Options**: 
- `top-left`
- `top-center` (default)
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`

```html
<webropol-floating-toolbar position="bottom-right"></webropol-floating-toolbar>
```

### variant
Visual style of the toolbar container.

**Options**:
- `default` - Rounded corners with medium shadow
- `compact` - Smaller rounded corners with card shadow
- `rounded` - Fully rounded (pill shape) with soft shadow

```html
<webropol-floating-toolbar variant="rounded"></webropol-floating-toolbar>
```

### size
Size of toolbar buttons.

**Options**:
- `small` - 8x8 buttons
- `medium` - 10x10 buttons (default)
- `large` - 12x12 buttons

```html
<webropol-floating-toolbar size="large"></webropol-floating-toolbar>
```

### tools
JSON array of toolbar items.

## Tool Types

### 1. Button
Simple clickable button.

```json
{
  "type": "button",
  "icon": "fal fa-copy",
  "label": "Copy",
  "action": "copy",
  "variant": "default",
  "tooltip": "Copy to clipboard"
}
```

**Properties**:
- `type`: `"button"`
- `icon`: FontAwesome icon class (optional)
- `label`: Text label (optional, shown if no icon)
- `action`: Action identifier emitted in events
- `variant`: `default`, `primary`, `danger`, `success`
- `tooltip`: Tooltip text

### 2. Dropdown
Button with dropdown menu.

```json
{
  "type": "dropdown",
  "label": "Table content",
  "icon": "fal fa-table",
  "options": [
    {"label": "Option 1", "value": "opt1", "icon": "fal fa-check", "action": "select-opt1"},
    {"label": "Option 2", "value": "opt2", "icon": "fal fa-times"}
  ]
}
```

**Properties**:
- `type`: `"dropdown"`
- `label`: Dropdown button label
- `icon`: FontAwesome icon class (optional)
- `options`: Array of dropdown items
  - `label`: Option text
  - `value`: Option value
  - `icon`: Option icon (optional)
  - `action`: Action identifier (optional)

### 3. Separator
Visual separator between tools.

```json
{
  "type": "separator"
}
```

## Events

### tool-action
Fired when a regular button is clicked.

```javascript
toolbar.addEventListener('tool-action', (e) => {
  console.log('Action:', e.detail.action);
});
```

### option-select
Fired when a dropdown option is selected.

```javascript
toolbar.addEventListener('option-select', (e) => {
  console.log('Action:', e.detail.action);
  console.log('Value:', e.detail.value);
});
```

## Examples

### Chart Controls Toolbar
```html
<webropol-floating-toolbar
  position="top-center"
  variant="default"
  tools='[
    {
      "type": "dropdown",
      "label": "Chart Type",
      "icon": "fal fa-chart-bar",
      "options": [
        {"label": "Bar Chart", "value": "bar", "icon": "fal fa-chart-bar"},
        {"label": "Line Chart", "value": "line", "icon": "fal fa-chart-line"},
        {"label": "Pie Chart", "value": "pie", "icon": "fal fa-chart-pie"}
      ]
    },
    {"type": "separator"},
    {
      "type": "button",
      "icon": "fal fa-download",
      "action": "export",
      "tooltip": "Export Chart"
    },
    {
      "type": "button",
      "icon": "fal fa-expand",
      "action": "fullscreen",
      "tooltip": "Fullscreen"
    }
  ]'>
</webropol-floating-toolbar>
```

### Table Actions Toolbar
```html
<webropol-floating-toolbar
  position="bottom-center"
  variant="rounded"
  size="medium"
  tools='[
    {
      "type": "dropdown",
      "label": "Table content",
      "options": [
        {"label": "Show all rows", "value": "all"},
        {"label": "Show filtered", "value": "filtered"},
        {"label": "Export visible", "value": "export"}
      ]
    },
    {"type": "separator"},
    {
      "type": "button",
      "icon": "fal fa-copy",
      "action": "copy",
      "tooltip": "Copy"
    },
    {"type": "separator"},
    {
      "type": "button",
      "icon": "fal fa-trash",
      "action": "delete",
      "variant": "danger",
      "tooltip": "Delete"
    },
    {"type": "separator"},
    {
      "type": "button",
      "icon": "fal fa-cog",
      "action": "settings",
      "tooltip": "Settings"
    }
  ]'>
</webropol-floating-toolbar>
```

### Compact Toolbar
```html
<webropol-floating-toolbar
  position="top-right"
  variant="compact"
  size="small"
  tools='[
    {"type": "button", "icon": "fal fa-save", "action": "save"},
    {"type": "button", "icon": "fal fa-undo", "action": "undo"},
    {"type": "button", "icon": "fal fa-redo", "action": "redo"}
  ]'>
</webropol-floating-toolbar>
```

## Styling

The component uses Webropol design tokens:
- Background: `bg-white`
- Borders: `border-webropol-gray-200`
- Hover states: `hover:bg-webropol-primary-50`
- Shadows: `shadow-medium`, `shadow-card`, `shadow-soft`

## JavaScript Integration

```javascript
const toolbar = document.querySelector('webropol-floating-toolbar');

// Listen to button clicks
toolbar.addEventListener('tool-action', (e) => {
  switch(e.detail.action) {
    case 'copy':
      copyToClipboard();
      break;
    case 'delete':
      confirmDelete();
      break;
    case 'settings':
      openSettings();
      break;
  }
});

// Listen to dropdown selections
toolbar.addEventListener('option-select', (e) => {
  console.log(`Selected ${e.detail.value}`);
});
```

## Best Practices

1. **Keep it Simple**: Don't overcrowd the toolbar with too many tools
2. **Use Separators**: Group related tools with separators
3. **Meaningful Icons**: Use clear, recognizable FontAwesome icons
4. **Position Carefully**: Consider the content it floats over
5. **Variants**: Use appropriate button variants (danger for destructive actions)
6. **Tooltips**: Always provide tooltips for icon-only buttons

## Accessibility

- All buttons have proper `title` attributes for tooltips
- Keyboard navigation supported
- Click outside to close dropdowns
- Semantic button elements used throughout
