# Context Menu Component

A vertical context menu component with icon-labeled actions, hover states, and danger variants. Perfect for dropdown menus, right-click actions, and action lists.

## Features

- Icon + label layout with clean spacing
- Hover states with gradient backgrounds (cyan for default, red for danger)
- Danger variant for destructive actions (Delete, Cancel, etc.)
- Disabled state for individual items
- Keyboard navigation support
- Custom widths and border radius
- Event emission on item click

## Usage

### Basic Example

```html
<webropol-context-menu
  items='[
    {"id": "rename", "label": "Rename", "icon": "fal fa-pen"},
    {"id": "copy", "label": "Copy", "icon": "fal fa-copy"},
    {"id": "move", "label": "Move to a folder", "icon": "fal fa-folder-arrow-up"},
    {"id": "rights", "label": "Rights", "icon": "fal fa-key"},
    {"id": "properties", "label": "Properties, rights and log", "icon": "fal fa-list-ul"},
    {"id": "delete", "label": "Delete", "icon": "fal fa-trash-alt", "variant": "danger"}
  ]'
></webropol-context-menu>
```

### Import

```html
<script src="../design-system/components/menus/ContextMenu.js" type="module"></script>
```

## Attributes

### `items` (required)
JSON array of menu item objects. Each item supports:

- `id` (string, required) - Unique identifier for the item
- `label` (string, required) - Display text
- `icon` (string, optional) - FontAwesome icon class (e.g., "fal fa-pen")
- `variant` (string, optional) - "default" or "danger"
- `disabled` (boolean, optional) - Disables the item
- `data` (object, optional) - Custom data passed in events
- `onClick` (function, optional) - Callback function

```html
<webropol-context-menu
  items='[
    {"id": "view", "label": "View", "icon": "fal fa-eye"},
    {"id": "edit", "label": "Edit", "icon": "fal fa-pen", "disabled": true},
    {"id": "delete", "label": "Delete", "icon": "fal fa-trash-alt", "variant": "danger"}
  ]'
></webropol-context-menu>
```

### `width`
Menu width preset.

- **Values**: `auto`, `sm` (200px), `md` (250px), `lg` (300px), `full`
- **Default**: `auto`

```html
<webropol-context-menu items='[...]' width="md"></webropol-context-menu>
```

### `rounded`
Border radius style.

- **Values**: `none`, `sm`, `md`, `lg`, `xl`
- **Default**: `md`

```html
<webropol-context-menu items='[...]' rounded="xl"></webropol-context-menu>
```

### `disabled`
Disables the entire menu.

```html
<webropol-context-menu items='[...]' disabled></webropol-context-menu>
```

## Events

### `item-click`
Fired when a menu item is clicked.

**Event Detail:**
```javascript
{
  id: "rename",           // Item ID
  label: "Rename",        // Item label
  data: { ... }          // Custom data from item
}
```

**Usage:**
```html
<webropol-context-menu
  items='[...]'
  @item-click="handleMenuClick($event)"
></webropol-context-menu>

<script>
function handleMenuClick(event) {
  const { id, label, data } = event.detail;
  console.log(`Clicked: ${label}`);
  
  if (id === 'delete') {
    // Handle delete
  }
}
</script>
```

## Examples

### Survey Actions Menu

```html
<webropol-context-menu
  items='[
    {"id": "edit", "label": "Edit survey", "icon": "fal fa-pen"},
    {"id": "preview", "label": "Preview", "icon": "fal fa-eye"},
    {"id": "duplicate", "label": "Duplicate", "icon": "fal fa-copy"},
    {"id": "export", "label": "Export results", "icon": "fal fa-file-export"},
    {"id": "share", "label": "Share", "icon": "fal fa-share-nodes"},
    {"id": "archive", "label": "Archive", "icon": "fal fa-box-archive"},
    {"id": "delete", "label": "Delete", "icon": "fal fa-trash-alt", "variant": "danger"}
  ]'
  width="md"
  @item-click="handleSurveyAction($event)"
></webropol-context-menu>
```

### Event Actions Menu

```html
<webropol-context-menu
  items='[
    {"id": "manage", "label": "Manage event", "icon": "fal fa-calendar-edit"},
    {"id": "attendees", "label": "View attendees", "icon": "fal fa-users"},
    {"id": "send", "label": "Send invitations", "icon": "fal fa-envelope"},
    {"id": "qr", "label": "QR code", "icon": "fal fa-qrcode"},
    {"id": "cancel", "label": "Cancel event", "icon": "fal fa-ban", "variant": "danger"}
  ]'
  @item-click="handleEventAction($event)"
></webropol-context-menu>
```

### Text-Only Menu

```html
<webropol-context-menu
  items='[
    {"id": "edit", "label": "Edit"},
    {"id": "duplicate", "label": "Duplicate"},
    {"id": "archive", "label": "Archive"},
    {"id": "delete", "label": "Delete", "variant": "danger"}
  ]'
  width="sm"
></webropol-context-menu>
```

### With Disabled Items

```html
<webropol-context-menu
  items='[
    {"id": "view", "label": "View", "icon": "fal fa-eye"},
    {"id": "edit", "label": "Edit", "icon": "fal fa-pen", "disabled": true},
    {"id": "share", "label": "Share", "icon": "fal fa-share-nodes"},
    {"id": "download", "label": "Download", "icon": "fal fa-download", "disabled": true},
    {"id": "delete", "label": "Delete", "icon": "fal fa-trash-alt", "variant": "danger"}
  ]'
></webropol-context-menu>
```

## Integration with Alpine.js

### Dropdown Toggle

```html
<div x-data="{ open: false }" @click.away="open = false">
  <button @click="open = !open" class="px-4 py-2 bg-white rounded-lg shadow">
    <i class="fal fa-ellipsis-v"></i>
  </button>
  
  <div x-show="open" x-transition class="absolute mt-2 z-10">
    <webropol-context-menu
      items='[
        {"id": "rename", "label": "Rename", "icon": "fal fa-pen"},
        {"id": "delete", "label": "Delete", "icon": "fal fa-trash-alt", "variant": "danger"}
      ]'
      @item-click="open = false; handleAction($event)"
    ></webropol-context-menu>
  </div>
</div>
```

### Right-Click Context Menu

```html
<div 
  x-data="{ showMenu: false, menuX: 0, menuY: 0 }"
  @contextmenu.prevent="showMenu = true; menuX = $event.clientX; menuY = $event.clientY"
  @click.away="showMenu = false"
>
  <div class="p-4 bg-white rounded-lg">
    Right-click me for context menu
  </div>
  
  <div 
    x-show="showMenu"
    :style="`position: fixed; left: ${menuX}px; top: ${menuY}px; z-index: 50;`"
    x-transition
  >
    <webropol-context-menu
      items='[...]'
      @item-click="showMenu = false; handleContextAction($event)"
    ></webropol-context-menu>
  </div>
</div>
```

## Styling

### Hover States

- **Default items**: Gradient from cyan-50 to cyan-100
- **Danger items**: Gradient from red-50 to red-100

### Colors

- **Default text**: `text-webropol-gray-900`
- **Default icon**: `text-webropol-gray-600`
- **Danger text**: `text-red-600`
- **Danger icon**: `text-red-500`
- **Border**: `border-webropol-gray-100` (between items)

### Accessibility

- **ARIA roles**: `role="menu"` and `role="menuitem"`
- **Keyboard navigation**: Tab, Enter, Space
- **Disabled state**: `aria-disabled="true"`
- **Focus management**: `tabindex="0"` on active items

## Best Practices

1. **Use danger variant sparingly** - Only for destructive actions
2. **Provide meaningful icons** - FontAwesome Pro light icons work best
3. **Group related actions** - Items are visually separated by borders
4. **Handle disabled state** - Don't remove items, disable them instead
5. **Close on click** - Emit events and close the menu after selection
6. **Position carefully** - Use z-index and positioning for dropdowns

## Demo

See the full interactive demo at: `design-system/demos/context-menu-demo.html`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 modules support required
- Custom Elements API required
