# Context Menu Integration Examples

Quick examples showing how to integrate the context menu component into Webropol pages.

## Basic Dropdown Menu

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  
  <!-- Context Menu Component -->
  <script src="../design-system/components/menus/ContextMenu.js" type="module"></script>
</head>
<body x-data="{ menuOpen: false }">
  
  <!-- Trigger Button -->
  <div class="relative" @click.away="menuOpen = false">
    <button 
      @click="menuOpen = !menuOpen"
      class="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <i class="fal fa-ellipsis-v"></i>
    </button>
    
    <!-- Context Menu -->
    <div 
      x-show="menuOpen" 
      x-transition
      class="absolute right-0 mt-2 z-50"
    >
      <webropol-context-menu
        items='[
          {"id": "rename", "label": "Rename", "icon": "fal fa-pen"},
          {"id": "copy", "label": "Copy", "icon": "fal fa-copy"},
          {"id": "delete", "label": "Delete", "icon": "fa-light fa-trash-can-alt", "variant": "danger"}
        ]'
        @item-click="menuOpen = false; handleAction($event)"
      ></webropol-context-menu>
    </div>
  </div>

  <script>
    function handleAction(event) {
      const { id, label } = event.detail;
      console.log(`Action: ${id}`);
      // Handle action
    }
  </script>
</body>
</html>
```

## Survey List with Context Menus

```html
<div x-data="surveyList()">
  <!-- Survey Card with Menu -->
  <template x-for="survey in surveys" :key="survey.id">
    <div class="bg-white p-4 rounded-xl shadow-card flex items-center justify-between">
      <div>
        <h3 class="font-semibold" x-text="survey.name"></h3>
        <p class="text-sm text-webropol-gray-600" x-text="survey.status"></p>
      </div>
      
      <!-- Menu Toggle -->
      <div class="relative" @click.away="survey.menuOpen = false">
        <button 
          @click="survey.menuOpen = !survey.menuOpen"
          class="p-2 hover:bg-webropol-gray-100 rounded-lg transition-colors"
        >
          <i class="fal fa-ellipsis-v"></i>
        </button>
        
        <!-- Context Menu -->
        <div 
          x-show="survey.menuOpen" 
          x-transition
          class="absolute right-0 mt-2 z-50"
        >
          <webropol-context-menu
            :items='JSON.stringify([
              {"id": "edit", "label": "Edit survey", "icon": "fal fa-pen"},
              {"id": "preview", "label": "Preview", "icon": "fal fa-eye"},
              {"id": "duplicate", "label": "Duplicate", "icon": "fal fa-copy"},
              {"id": "export", "label": "Export results", "icon": "fal fa-file-export"},
              {"id": "delete", "label": "Delete", "icon": "fa-light fa-trash-can-alt", "variant": "danger"}
            ])'
            @item-click="survey.menuOpen = false; handleSurveyAction($event, survey)"
          ></webropol-context-menu>
        </div>
      </div>
    </div>
  </template>
</div>

<script>
  function surveyList() {
    return {
      surveys: [
        { id: 1, name: 'Customer Satisfaction', status: 'Active', menuOpen: false },
        { id: 2, name: 'Employee Feedback', status: 'Draft', menuOpen: false }
      ],
      
      handleSurveyAction(event, survey) {
        const { id } = event.detail;
        
        switch(id) {
          case 'edit':
            window.location.href = `edit.html?id=${survey.id}`;
            break;
          case 'preview':
            window.open(`preview.html?id=${survey.id}`, '_blank');
            break;
          case 'duplicate':
            this.duplicateSurvey(survey);
            break;
          case 'export':
            this.exportResults(survey);
            break;
          case 'delete':
            if (confirm(`Delete "${survey.name}"?`)) {
              this.deleteSurvey(survey);
            }
            break;
        }
      },
      
      duplicateSurvey(survey) {
        // Implementation
      },
      
      exportResults(survey) {
        // Implementation
      },
      
      deleteSurvey(survey) {
        this.surveys = this.surveys.filter(s => s.id !== survey.id);
      }
    }
  }
</script>
```

## Right-Click Context Menu

```html
<div 
  x-data="{ showMenu: false, menuX: 0, menuY: 0, selectedItem: null }"
  @click.away="showMenu = false"
>
  <!-- Contextable Item -->
  <div
    @contextmenu.prevent="
      showMenu = true; 
      menuX = $event.clientX; 
      menuY = $event.clientY;
      selectedItem = 'item-1'
    "
    class="p-6 bg-white rounded-xl shadow-card cursor-pointer"
  >
    Right-click me for context menu
  </div>
  
  <!-- Floating Context Menu -->
  <div 
    x-show="showMenu"
    :style="`position: fixed; left: ${menuX}px; top: ${menuY}px; z-index: 9999;`"
    x-transition
  >
    <webropol-context-menu
      items='[
        {"id": "open", "label": "Open", "icon": "fal fa-folder-open"},
        {"id": "rename", "label": "Rename", "icon": "fal fa-pen"},
        {"id": "copy", "label": "Copy", "icon": "fal fa-copy"},
        {"id": "move", "label": "Move to folder", "icon": "fal fa-folder-arrow-up"},
        {"id": "rights", "label": "Rights", "icon": "fal fa-key"},
        {"id": "properties", "label": "Properties, rights and log", "icon": "fal fa-list-ul"},
        {"id": "delete", "label": "Delete", "icon": "fa-light fa-trash-can-alt", "variant": "danger"}
      ]'
      @item-click="showMenu = false; handleContextAction($event, selectedItem)"
    ></webropol-context-menu>
  </div>
</div>

<script>
  function handleContextAction(event, itemId) {
    const { id, label } = event.detail;
    console.log(`Action "${id}" on item "${itemId}"`);
  }
</script>
```

## Table Row Actions

```html
<table class="w-full">
  <thead>
    <tr class="border-b border-webropol-gray-200">
      <th class="text-left py-3">Name</th>
      <th class="text-left py-3">Status</th>
      <th class="text-left py-3">Date</th>
      <th class="w-16"></th>
    </tr>
  </thead>
  <tbody x-data="tableData()">
    <template x-for="row in rows" :key="row.id">
      <tr class="border-b border-webropol-gray-100 hover:bg-webropol-gray-50">
        <td class="py-3" x-text="row.name"></td>
        <td class="py-3">
          <span 
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
            x-text="row.status"
          ></span>
        </td>
        <td class="py-3" x-text="row.date"></td>
        <td class="py-3">
          <!-- Row Actions Menu -->
          <div class="relative" @click.away="row.menuOpen = false">
            <button 
              @click="row.menuOpen = !row.menuOpen"
              class="p-2 hover:bg-webropol-gray-200 rounded-lg"
            >
              <i class="fal fa-ellipsis-h"></i>
            </button>
            
            <div 
              x-show="row.menuOpen"
              x-transition
              class="absolute right-0 mt-2 z-50"
            >
              <webropol-context-menu
                items='[
                  {"id": "view", "label": "View details", "icon": "fal fa-eye"},
                  {"id": "edit", "label": "Edit", "icon": "fal fa-pen"},
                  {"id": "archive", "label": "Archive", "icon": "fal fa-box-archive"},
                  {"id": "delete", "label": "Delete", "icon": "fa-light fa-trash-can", "variant": "danger"}
                ]'
                width="sm"
                @item-click="row.menuOpen = false; handleRowAction($event, row)"
              ></webropol-context-menu>
            </div>
          </div>
        </td>
      </tr>
    </template>
  </tbody>
</table>

<script>
  function tableData() {
    return {
      rows: [
        { id: 1, name: 'Survey A', status: 'Active', date: '2025-11-15', menuOpen: false },
        { id: 2, name: 'Survey B', status: 'Draft', date: '2025-11-18', menuOpen: false }
      ],
      
      handleRowAction(event, row) {
        const { id } = event.detail;
        console.log(`Action "${id}" on row ${row.id}`);
      }
    }
  }
</script>
```

## With Dynamic Items (Conditional Actions)

```html
<div x-data="dynamicMenu()">
  <div class="relative" @click.away="menuOpen = false">
    <button @click="menuOpen = !menuOpen">
      Actions
    </button>
    
    <div x-show="menuOpen" class="absolute mt-2 z-50">
      <webropol-context-menu
        :items="getMenuItems()"
        @item-click="menuOpen = false; handleAction($event)"
      ></webropol-context-menu>
    </div>
  </div>
</div>

<script>
  function dynamicMenu() {
    return {
      menuOpen: false,
      userRole: 'admin', // or 'editor', 'viewer'
      
      getMenuItems() {
        const items = [
          { id: 'view', label: 'View', icon: 'fal fa-eye' }
        ];
        
        // Only editors and admins can edit
        if (this.userRole === 'editor' || this.userRole === 'admin') {
          items.push({ id: 'edit', label: 'Edit', icon: 'fal fa-pen' });
        }
        
        // Only admins can delete
        if (this.userRole === 'admin') {
          items.push({ 
            id: 'delete', 
            label: 'Delete', 
            icon: 'fa-light fa-trash-can', 
            variant: 'danger' 
          });
        }
        
        return JSON.stringify(items);
      },
      
      handleAction(event) {
        console.log('Action:', event.detail.id);
      }
    }
  }
</script>
```

## Common Patterns

### Close Menu on Selection
Always close the menu after an action is selected:
```javascript
@item-click="menuOpen = false; handleAction($event)"
```

### Click Outside to Close
Use Alpine's `@click.away` directive:
```html
<div @click.away="menuOpen = false">
```

### Positioning
For dropdowns:
```html
<div class="absolute right-0 mt-2 z-50">
```

For right-click menus:
```html
<div :style="`position: fixed; left: ${menuX}px; top: ${menuY}px; z-index: 9999;`">
```

### Transitions
Use Alpine's `x-transition` for smooth animations:
```html
<div x-show="menuOpen" x-transition>
```

## Best Practices

1. **Always close on selection** - Set `menuOpen = false` in the event handler
2. **Use z-index properly** - Ensure menus appear above other content (z-50 or z-9999)
3. **Handle click outside** - Use `@click.away` to close menus
4. **Provide feedback** - Show loading states or confirmations for destructive actions
5. **Keyboard support** - Component handles keyboard navigation automatically
6. **Accessibility** - Use proper ARIA attributes (handled by component)
7. **Mobile considerations** - Ensure touch targets are large enough (44px minimum)

