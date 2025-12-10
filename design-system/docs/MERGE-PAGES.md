# MergePages Component

The `webropol-merge-pages` component provides a visual page separator with an optional merge button for survey editing interfaces.

## Features

- Visual page separator with consistent styling
- Optional merge button for pages 2 and beyond
- Customizable icon and page number
- Event-driven merge functionality
- Accessible with proper ARIA labels

## Usage

### Basic Usage

```html
<!-- Import the component -->
<script src="../design-system/components/interactive/MergePages.js" type="module"></script>

<!-- Page 1 - No merge button (first page) -->
<webropol-merge-pages page-number="1" show-merge="false"></webropol-merge-pages>

<!-- Page 2 - With merge button -->
<webropol-merge-pages page-number="2" show-merge="true"></webropol-merge-pages>

<!-- Page 3 - With merge button and custom icon -->
<webropol-merge-pages 
  page-number="3" 
  show-merge="true" 
  icon="fal fa-file-invoice"
></webropol-merge-pages>
```

### With Alpine.js Event Handling

```html
<body x-data="surveyApp()">
  <!-- Page separator with event listener -->
  <webropol-merge-pages 
    page-number="2" 
    show-merge="true" 
    @merge-page="handleMergePage($event)"
  ></webropol-merge-pages>
  
  <script>
    function surveyApp() {
      return {
        handleMergePage(event) {
          const { pageNumber, targetPage } = event.detail;
          console.log(`Merging page ${pageNumber} into page ${targetPage}`);
          
          // Your merge logic here
          if (confirm(`Merge Page ${pageNumber} into Page ${targetPage}?`)) {
            // Perform the merge operation
          }
        }
      }
    }
  </script>
</body>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `page-number` | string | `"1"` | The page number to display (required) |
| `show-merge` | boolean | `true` | Whether to show the merge button |
| `icon` | string | `"fal fa-file-alt"` | FontAwesome icon class for the page indicator |

## Events

### `merge-page`

Emitted when the merge button is clicked.

**Event Detail:**
```javascript
{
  pageNumber: 2,    // The page being merged
  targetPage: 1     // The page to merge into (pageNumber - 1)
}
```

**Example:**
```html
<webropol-merge-pages 
  page-number="3" 
  show-merge="true"
  @merge-page="onMerge($event)"
></webropol-merge-pages>

<script>
  function onMerge(event) {
    const { pageNumber, targetPage } = event.detail;
    // pageNumber = 3, targetPage = 2
  }
</script>
```

## Styling

The component uses Webropol design tokens and follows these conventions:

### Colors
- Border: `border-webropol-gray-200` (light gray)
- Page indicator: `border-webropol-gray-300` with white background
- Merge button: `border-webropol-primary-300` with hover to `border-webropol-primary-500`

### Spacing
- Margin: `my-8` (2rem top and bottom)
- Padding: `px-6 py-2` for buttons

### Hover Effects
- Merge button background: `hover:bg-webropol-primary-50`
- Icon scale: `group-hover:scale-110`

## Accessibility

- Proper `aria-label` on merge button
- Descriptive `title` attribute for tooltips
- Keyboard accessible
- Focus-visible states included

## Design Rules

### Page 1
- **MUST NOT** show the merge button
- First page is the base - nothing to merge into

```html
<webropol-merge-pages page-number="1" show-merge="false"></webropol-merge-pages>
```

### Page 2+
- **MUST** show the merge button
- Allows merging into the previous page

```html
<webropol-merge-pages page-number="2" show-merge="true"></webropol-merge-pages>
<webropol-merge-pages page-number="3" show-merge="true"></webropol-merge-pages>
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script src="../design-system/components/interactive/MergePages.js" type="module"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'webropol-primary': { 
              50: '#f0fdff', 300: '#66e0fa', 500: '#06b6d4', 600: '#0891b2' 
            },
            'webropol-gray': { 
              200: '#e2e8f0', 300: '#cbd5e1', 600: '#475569' 
            }
          }
        }
      }
    }
  </script>
</head>
<body x-data="surveyEditor()">
  <div class="container mx-auto p-8">
    <!-- Page 1 Content -->
    <section class="bg-white p-8 rounded-lg">
      <h2>Survey Page 1</h2>
      <!-- Questions here -->
    </section>
    
    <!-- Page 1 Separator (no merge) -->
    <webropol-merge-pages page-number="1" show-merge="false"></webropol-merge-pages>
    
    <!-- Page 2 Content -->
    <section class="bg-white p-8 rounded-lg">
      <h2>Survey Page 2</h2>
      <!-- Questions here -->
    </section>
    
    <!-- Page 2 Separator (with merge) -->
    <webropol-merge-pages 
      page-number="2" 
      show-merge="true"
      @merge-page="handleMergePage($event)"
    ></webropol-merge-pages>
    
    <!-- Page 3 Content -->
    <section class="bg-white p-8 rounded-lg">
      <h2>Survey Page 3</h2>
      <!-- Questions here -->
    </section>
  </div>
  
  <script>
    function surveyEditor() {
      return {
        pages: [
          { id: 1, questions: ['q1', 'q2'] },
          { id: 2, questions: ['q3', 'q4'] },
          { id: 3, questions: ['q5'] }
        ],
        
        handleMergePage(event) {
          const { pageNumber, targetPage } = event.detail;
          
          if (confirm(`Merge Page ${pageNumber} into Page ${targetPage}?`)) {
            // Find pages
            const sourcePage = this.pages.find(p => p.id === pageNumber);
            const targetPageObj = this.pages.find(p => p.id === targetPage);
            
            // Merge questions
            targetPageObj.questions.push(...sourcePage.questions);
            
            // Remove source page
            this.pages = this.pages.filter(p => p.id !== pageNumber);
            
            // Renumber pages
            this.pages.forEach((page, index) => {
              page.id = index + 1;
            });
            
            console.log('Pages merged successfully', this.pages);
          }
        }
      }
    }
  </script>
</body>
</html>
```

## Integration with Edit Page

In the survey edit page (`surveys/edit.html`), the component is used like this:

```html
<!-- Page 1 - no merge button -->
<webropol-merge-pages page-number="1" show-merge="false"></webropol-merge-pages>

<!-- Page 2 onwards - with merge button -->
<webropol-merge-pages 
  page-number="2" 
  show-merge="true" 
  @merge-page="handleMergePage($event)"
></webropol-merge-pages>
```

The `handleMergePage` function in `surveyEditApp()` handles the merge logic:

```javascript
function surveyEditApp() {
  return {
    handleMergePage(event) {
      const { pageNumber, targetPage } = event.detail;
      
      if (confirm(`Merge Page ${pageNumber} into Page ${targetPage}?`)) {
        // Merge implementation
        // 1. Move questions from pageNumber to targetPage
        // 2. Remove pageNumber
        // 3. Renumber subsequent pages
        // 4. Save to localStorage/backend
      }
    }
  }
}
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Requires ES6+ for Web Components

## Related Components

- `FloatingButton` - Action buttons
- `Accordion` - Collapsible sections
- Page structure components in survey editing
