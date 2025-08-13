# Webropol Design System - Usage Guide

## Quick Start

### 1. Import the Design System
```html
<!-- Import all components -->
<script type="module" src="./design-system/components/index.js"></script>

<!-- Or import individual components -->
<script type="module" src="./design-system/components/buttons/Button.js"></script>
```

### 2. Use Components in HTML
```html
<webropol-button variant="primary" size="lg">
  Get Started
</webropol-button>
```

## Component Categories

### 🔘 Buttons
Flexible button component with multiple variants and configurations.

```html
<!-- Basic buttons -->
<webropol-button variant="primary">Primary Action</webropol-button>
<webropol-button variant="secondary">Secondary</webropol-button>
<webropol-button variant="tertiary">Tertiary</webropol-button>
<webropol-button variant="danger">Delete</webropol-button>
<webropol-button variant="success">Save</webropol-button>

<!-- With icons -->
<webropol-button variant="primary" icon="fal fa-plus">Add Item</webropol-button>
<webropol-button variant="secondary" icon="fal fa-download" icon-position="right">Download</webropol-button>

<!-- States -->
<webropol-button variant="primary" loading>Saving...</webropol-button>
<webropol-button variant="secondary" disabled>Disabled</webropol-button>

<!-- Sizes -->
<webropol-button variant="primary" size="sm">Small</webropol-button>
<webropol-button variant="primary" size="md">Medium</webropol-button>
<webropol-button variant="primary" size="lg">Large</webropol-button>
<webropol-button variant="primary" size="xl">Extra Large</webropol-button>

<!-- Full width -->
<webropol-button variant="primary" full-width>Full Width Button</webropol-button>

<!-- As links -->
<webropol-button variant="primary" href="/surveys">Go to Surveys</webropol-button>
```

**Button Events:**
```javascript
document.querySelector('webropol-button').addEventListener('webropol-button-click', (e) => {
  console.log('Button clicked:', e.detail);
});
```

### 🃏 Cards
Flexible card system for content organization.

#### Simple Cards
```html
<!-- Basic card -->
<webropol-card>
  <h3>Card Title</h3>
  <p>Your content goes here.</p>
</webropol-card>

<!-- Card variants -->
<webropol-card variant="elevated">Elevated Card</webropol-card>
<webropol-card variant="gradient">Gradient Card</webropol-card>

<!-- Interactive card -->
<webropol-card clickable>
  <h3>Clickable Card</h3>
  <p>Click anywhere on this card.</p>
</webropol-card>

<!-- Card with attributes -->
<webropol-card 
  title="Survey Results" 
  subtitle="Customer Satisfaction"
  badge="Live"
  image="/path/to/image.jpg">
</webropol-card>
```

#### Complex Cards (Legacy System)
```html
<webropol-card-legacy variant="standard" hoverable>
  
  <!-- Card Header -->
  <webropol-card-header 
    icon="fal fa-chart-bar"
    title="Analytics Dashboard" 
    subtitle="Real-time survey insights"
    badge="Pro"
    badge-variant="primary">
  </webropol-card-header>
  
  <!-- Card Content -->
  <webropol-card-content padding="normal">
    <p>Dashboard content with charts and metrics.</p>
    
    <!-- Card List -->
    <webropol-card-list title="Recent Surveys" collapsible default-open>
      <webropol-card-list-item 
        icon="fal fa-poll" 
        title="Customer Satisfaction Survey" 
        subtitle="Created 2 hours ago"
        status="active"
        clickable>
      </webropol-card-list-item>
      
      <webropol-card-list-item 
        icon="fal fa-users" 
        title="Employee Feedback" 
        subtitle="Created yesterday"
        status="pending"
        action="View Results"
        action-icon="fal fa-eye">
      </webropol-card-list-item>
    </webropol-card-list>
  </webropol-card-content>
  
  <!-- Card Actions -->
  <webropol-card-actions alignment="right">
    <webropol-button variant="tertiary" size="sm">View All</webropol-button>
    <webropol-button variant="primary" size="sm">Create Survey</webropol-button>
  </webropol-card-actions>
  
</webropol-card-legacy>
```

#### Gradient Cards (Homepage Style)
```html
<webropol-gradient-card 
  icon="fal fa-poll-h"
  title="Surveys" 
  subtitle="Create and manage surveys"
  button-text="Get Started"
  button-href="/surveys"
  badge="Popular"
  gradient="from-blue-100 to-teal-100">
</webropol-gradient-card>
```

**Card Events:**
```javascript
// Main card clicks
document.querySelector('webropol-card').addEventListener('webropol-card-click', (e) => {
  console.log('Card clicked:', e.detail);
});

// Legacy card events
document.querySelector('webropol-card-legacy').addEventListener('card-click', (e) => {
  console.log('Legacy card clicked');
});

document.querySelector('webropol-card-list-item').addEventListener('list-item-click', (e) => {
  console.log('List item clicked');
});
```

### 🧭 Navigation
Complete navigation system with headers, sidebars, and breadcrumbs.

#### Header
```html
<!-- Basic header -->
<webropol-header-enhanced 
  username="John Doe" 
  title="Dashboard"
  show-notifications 
  show-help>
</webropol-header-enhanced>

<!-- Header with slots -->
<webropol-header-enhanced username="Jane Smith">
  <h1 slot="title">Survey Analytics</h1>
  
  <div slot="actions">
    <webropol-button variant="tertiary" size="sm">Export</webropol-button>
    <webropol-button variant="primary" size="sm">Create</webropol-button>
  </div>
  
  <div slot="left">
    <webropol-breadcrumbs trail='[{"label":"Home","url":"/"}, {"label":"Analytics","url":null}]'></webropol-breadcrumbs>
  </div>
</webropol-header-enhanced>
```

#### Sidebar
```html
<!-- Basic sidebar -->
<webropol-sidebar-enhanced 
  active="surveys" 
  base="/app">
</webropol-sidebar-enhanced>

<!-- Custom branded sidebar -->
<webropol-sidebar-enhanced 
  active="dashboards"
  brand-title="MyWebropol" 
  brand-subtitle="Analytics Platform"
  brand-icon="fal fa-analytics">
  
  <!-- Custom menu items -->
  <div slot="menu-items">
    <a href="/custom-reports" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700">
      <i class="fal fa-file-alt w-5 mr-4"></i>
      <span>Custom Reports</span>
    </a>
  </div>
  
  <!-- Footer content -->
  <div slot="footer">
    <div class="text-center">
      <p class="text-xs text-webropol-gray-500">Version 2.1.0</p>
      <webropol-button variant="tertiary" size="sm" full-width>Help & Support</webropol-button>
    </div>
  </div>
</webropol-sidebar-enhanced>
```

#### Breadcrumbs
```html
<!-- JSON trail -->
<webropol-breadcrumbs trail='[
  {"label": "Home", "url": "/"},
  {"label": "Surveys", "url": "/surveys"},
  {"label": "Customer Satisfaction", "url": null}
]'></webropol-breadcrumbs>

<!-- Comma-separated trail -->
<webropol-breadcrumbs trail="Home,/,Surveys,/surveys,Current Survey"></webropol-breadcrumbs>
```

**Programmatic Breadcrumb Management:**
```javascript
const breadcrumbs = document.querySelector('webropol-breadcrumbs');

// Add a breadcrumb
breadcrumbs.addBreadcrumb('New Page', '/new-page');

// Update entire trail
breadcrumbs.updateTrail([
  { label: 'Home', url: '/' },
  { label: 'Reports', url: '/reports' },
  { label: 'Current Report', url: null }
]);
```

**Navigation Events:**
```javascript
// Sidebar navigation
document.querySelector('webropol-sidebar-enhanced').addEventListener('navigation-click', (e) => {
  console.log('Navigate to:', e.detail.href);
});

// Breadcrumb navigation
document.querySelector('webropol-breadcrumbs').addEventListener('breadcrumb-click', (e) => {
  console.log('Breadcrumb clicked:', e.detail.href);
});

// Header events
document.querySelector('webropol-header-enhanced').addEventListener('notification-click', () => {
  console.log('Notifications clicked');
});
```

### 🎯 Interactive Elements

#### Floating Action Button
```html
<!-- Basic floating button -->
<webropol-floating-button></webropol-floating-button>

<!-- Positioned floating button -->
<webropol-floating-button position="bottom-right" size="lg"></webropol-floating-button>

<!-- Different positions -->
<webropol-floating-button position="bottom-center"></webropol-floating-button>
<webropol-floating-button position="bottom-right"></webropol-floating-button>
<webropol-floating-button position="bottom-left"></webropol-floating-button>
<webropol-floating-button position="top-right"></webropol-floating-button>
<webropol-floating-button position="top-left"></webropol-floating-button>
```

**Floating Button Events:**
```javascript
document.querySelector('webropol-floating-button').addEventListener('create-item', (e) => {
  const type = e.detail.type;
  
  switch(type) {
    case 'surveys':
      window.location.href = '/surveys/create';
      break;
    case 'events':
      window.location.href = '/events/create';
      break;
    case 'exw-surveys':
      window.location.href = '/surveys/create?type=exw';
      break;
    default:
      console.log('Create:', type);
  }
});
```

## Advanced Usage

### Custom Styling
```css
/* Override design tokens */
:root {
  --wr-color-primary: #your-brand-color;
  --wr-color-secondary: #your-secondary-color;
}

/* Custom component styling */
webropol-button[variant="primary"] {
  --button-bg: linear-gradient(45deg, #your-color1, #your-color2);
}
```

### Event Handling Patterns
```javascript
// Centralized event handling
document.addEventListener('webropol-button-click', (e) => {
  // Handle all button clicks
  console.log('Button clicked:', e.target, e.detail);
});

// Component-specific handling
const myCard = document.querySelector('#my-special-card');
myCard.addEventListener('webropol-card-click', (e) => {
  // Handle specific card click
  showModal(e.detail.title);
});
```

### Dynamic Content
```javascript
// Create components dynamically
const button = document.createElement('webropol-button');
button.setAttribute('variant', 'primary');
button.setAttribute('size', 'lg');
button.textContent = 'Dynamic Button';
document.body.appendChild(button);

// Update component attributes
const card = document.querySelector('webropol-card');
card.setAttribute('title', 'Updated Title');
card.setAttribute('badge', 'New');
```

### Accessibility
All components include built-in accessibility features:
- Proper ARIA roles and labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility

```html
<!-- Accessibility is automatic -->
<webropol-button variant="primary">
  Accessible by default
</webropol-button>

<!-- Additional ARIA attributes are preserved -->
<webropol-card 
  role="button" 
  aria-label="Survey dashboard card"
  tabindex="0">
  Content
</webropol-card>
```

## Performance Tips

1. **Import only what you need:**
```javascript
// Instead of importing everything
import './design-system/components/index.js';

// Import specific components
import './design-system/components/buttons/Button.js';
import './design-system/components/cards/Card.js';
```

2. **Use event delegation:**
```javascript
// Instead of adding listeners to each button
document.addEventListener('webropol-button-click', handleButtonClick);
```

3. **Lazy load components:**
```javascript
// Load components when needed
async function loadFloatingButton() {
  await import('./design-system/components/interactive/FloatingButton.js');
}
```

## Browser Support

- ✅ Modern browsers (Chrome 60+, Firefox 63+, Safari 11+, Edge 79+)
- ✅ Custom Elements v1
- ✅ ES6 Modules
- ⚠️ IE11 requires polyfills

## Troubleshooting

### Components not rendering?
1. Ensure scripts are loaded with `type="module"`
2. Check browser console for errors
3. Verify custom elements are defined

### Styling issues?
1. Check CSS custom properties are supported
2. Ensure Tailwind CSS is available
3. Verify no CSS conflicts

### Events not firing?
1. Add event listeners after DOM is ready
2. Check event names match documentation
3. Ensure `bubbles: true` for custom events

## Migration from Old Components

All old component names continue to work:
- `webropol-button` ✅ Enhanced
- `webropol-card` ✅ Enhanced
- `webropol-header` ✅ Available
- `webropol-sidebar` ✅ Available

For new features, use enhanced versions:
- `webropol-header-enhanced`
- `webropol-sidebar-enhanced`
- `webropol-card-legacy` (for complex cards)
