# Dashboard Config Component

A reusable toolbar component for dashboard widgets that provides standard action buttons like chart, settings, copy, filter, group, and delete.

## Import

```html
<script src="../design-system/components/interactive/DashboardConfig.js" type="module"></script>
```

## Basic Usage

```html
<webropol-dashboard-config></webropol-dashboard-config>
```

## With Default Actions

The component includes a default set of actions that will be displayed if no custom actions are provided:

- **Chart** - Switch to chart view
- **Settings** - Open settings
- **Copy** - Copy widget
- **Filter** - Apply filters
- **Group** - Group data
- **Delete** - Delete widget

## Custom Actions

```html
<webropol-dashboard-config
  actions='[
    {"id": "chart", "icon": "fal fa-chart-column", "tooltip": "Chart"},
    {"id": "settings", "icon": "fal fa-cog", "tooltip": "Settings"},
    {"id": "export", "icon": "fal fa-download", "tooltip": "Export"}
  ]'>
</webropol-dashboard-config>
```

## Attributes

### actions
JSON array of action button configurations.

**Structure**:
```json
{
  "id": "action-id",
  "icon": "fal fa-icon-name",
  "tooltip": "Tooltip text",
  "label": "Optional label"
}
```

**Example**:
```html
<webropol-dashboard-config
  actions='[
    {"id": "edit", "icon": "fal fa-edit", "tooltip": "Edit"},
    {"id": "share", "icon": "fal fa-share", "tooltip": "Share"}
  ]'>
</webropol-dashboard-config>
```

### size
Size of the action buttons.

**Options**:
- `small` - Smaller padding, base icon size
- `medium` - Default padding, large icon size (default)
- `large` - Larger padding, xl icon size

```html
<webropol-dashboard-config size="large"></webropol-dashboard-config>
```

### variant
Visual variant (reserved for future use).

**Options**:
- `default` - Standard appearance (default)
- `compact` - Reduced spacing

```html
<webropol-dashboard-config variant="compact"></webropol-dashboard-config>
```

## Events

### action-click
Fired when any action button is clicked.

**Event Detail**:
```javascript
{
  action: "action-id"
}
```

**Example**:
```javascript
const config = document.querySelector('webropol-dashboard-config');

config.addEventListener('action-click', (e) => {
  console.log('Action clicked:', e.detail.action);
  
  switch(e.detail.action) {
    case 'chart':
      showChart();
      break;
    case 'settings':
      openSettings();
      break;
    case 'delete':
      confirmDelete();
      break;
  }
});
```

## Examples

### Standard Widget Actions
```html
<webropol-dashboard-config></webropol-dashboard-config>
```

### Custom Action Set
```html
<webropol-dashboard-config
  actions='[
    {"id": "visualize", "icon": "fal fa-eye", "tooltip": "Visualize"},
    {"id": "analyze", "icon": "fal fa-calculator", "tooltip": "Analyze"},
    {"id": "export", "icon": "fal fa-file-export", "tooltip": "Export"}
  ]'>
</webropol-dashboard-config>
```

### Small Size
```html
<webropol-dashboard-config size="small"></webropol-dashboard-config>
```

## Usage in Dashboard Widgets

```html
<div class="widget">
  <div class="flex items-start justify-between mb-4 pb-4 border-b border-webropol-gray-200">
    <div class="flex-1">
      <h3 class="text-base font-semibold text-webropol-gray-900 mb-1">Widget Title</h3>
      <p class="text-sm text-webropol-gray-500">Number of respondents: 5</p>
    </div>
    <webropol-dashboard-config></webropol-dashboard-config>
  </div>
  
  <!-- Widget content -->
</div>
```

## Styling

The component uses Webropol design tokens:
- Text color: `text-webropol-gray-600`
- Hover background: `hover:bg-webropol-gray-100`
- Border radius: `rounded-lg`
- Transitions: `transition-colors`

## Accessibility

- All buttons have proper `title` attributes for tooltips
- Click events use `stopPropagation()` to prevent parent click handlers
- Semantic button elements used throughout

## Best Practices

1. **Consistent Actions**: Use the default action set for consistency across dashboards
2. **Custom Actions**: Only override when you need widget-specific actions
3. **Tooltips**: Always provide clear, concise tooltips
4. **Event Handling**: Handle the `action-click` event to respond to user interactions
5. **Placement**: Typically placed in the top-right corner of widget headers
