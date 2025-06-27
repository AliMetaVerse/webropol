# Webropol Design System

A comprehensive, modular design system built with HTML, CSS, and JavaScript. Provides consistent, accessible, and scalable UI components for the Webropol platform.

## ✨ Redesigned Card Components

The card components have been completely redesigned with:
- **Glass Morphism Effects**: Modern backdrop blur and transparency
- **Enhanced Action Cards**: Event-style design with gradient headers
- **Navigation List Cards**: Smooth hover effects and better accessibility
- **Video Cards with Backgrounds**: Real background image support (20+ images)

## 🚀 Quick Start (HTML/CSS/JS)

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="design-system/styles/animations.css">
</head>
<body>
    <!-- Use your cards -->
    <webropol-card title="My Survey" icon="chart-bar" badge="New">
        <p>Survey content here</p>
    </webropol-card>

    <!-- Load components -->
    <script type="module" src="design-system/webropol-cards.js"></script>
</body>
</html>
```

## 📁 Simple Structure

```
design-system/
├── webropol-cards.js          # Simple loader for all components
├── simple-example.html        # Working example
├── demo.html                  # Full demo with all designs
├── components/cards/          # Updated card components
├── utils/                     # Base utilities
├── styles/                    # CSS animations
└── HTML-CSS-JS-GUIDE.md      # Integration guide
```

## 🎨 Design Tokens

### Colors
- **Primary**: Webropol Teal (`webropol-teal-*`)
- **Secondary**: Webropol Blue (`webropol-blue-*`)
- **Neutral**: Webropol Gray (`webropol-gray-*`)

### Typography
- **Font Family**: Inter
- **Font Weights**: 300, 400, 500, 600, 700

### Spacing & Layout
- **Border Radius**: `rounded-xl` (12px) for cards, `rounded-full` for pills
- **Shadows**: `shadow-card`, `shadow-soft`, `shadow-medium`

## 🧩 Components

### Core Components
- **Button** - Various styles and states
- **Card** - Content containers with consistent styling
- **Modal** - Overlay dialogs and popups
- **Tooltip** - Contextual information display
### Core Components
- **Button** - Primary actions and interactions
- **Card** - Content containers with various layouts
- **Modal** - Overlays and dialogs
- **Badge** - Status indicators and labels
- **Tabs** - Content organization and navigation
- **Form Controls** - Input fields, selects, checkboxes
- **Loading** - Progress indicators and spinners
- **Tooltip** - Contextual help and information

### Card Components
- **ActionCard** - Cards with icons, actions, and call-to-action buttons
- **ListCard** - Cards displaying lists of items with metadata and status
- **VideoCard** - Cards for video content with thumbnails and play buttons
- **ConfigurableCard** - Expandable cards with detailed information and actions

### Navigation Components
- **Sidebar** - Primary navigation with menu items and branding
- **Header** - Top navigation bar with user controls and actions
- **Breadcrumbs** - Navigation trail
- **Pagination** - Content navigation

### Layout Components
- **Container** - Content wrappers
- **Grid** - Layout system
- **Spacer** - Consistent spacing

## 🚀 Usage

### 1. Include the design system
```html
<script src="design-system/index.js" type="module"></script>
```

### 2. Use components
```html
<!-- Basic Button -->
<webropol-button variant="primary" size="md">
  Click me
</webropol-button>

<!-- Basic Card -->
<webropol-card title="Card Title" variant="elevated">
  Card content goes here
</webropol-card>

<!-- Action Card -->
<webropol-action-card 
  icon="poll-h" 
  title="Create Survey" 
  subtitle="Build your survey">
  <p>Description text</p>
  <webropol-button variant="primary" size="sm">Get Started</webropol-button>
</webropol-action-card>

<!-- List Card -->
<webropol-list-card 
  title="Recent Items" 
  icon="list"
  items='[
    {"title": "Item 1", "meta": "2 days ago", "status": "active"},
    {"title": "Item 2", "meta": "1 week ago", "status": "completed"}
  ]'>
</webropol-list-card>

<!-- Video Card -->
<webropol-video-card 
  title="Tutorial Video" 
  duration="5:24"
  thumbnail="path/to/thumbnail.jpg"
  views="1,234">
  <p>Video description</p>
</webropol-video-card>

<!-- Configurable Card -->
<webropol-configurable-card 
  title="Settings" 
  icon="cog"
  status="active"
  expandable>
  <div slot="details">
    <!-- Detailed content -->
  </div>
</webropol-configurable-card>

<!-- Layout Components -->
<webropol-header username="John Doe" show-notifications></webropol-header>
<webropol-sidebar active="home"></webropol-sidebar>
```

### 3. Customize with attributes
Most components accept standard attributes for customization:
- `variant` - Style variation (primary, secondary, etc.)
- `size` - Size variation (sm, md, lg, xl)
- `disabled` - Disabled state
- `icon` - Icon name (FontAwesome)

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader compatibility

## 🔧 Development

### Adding New Components
1. Create component file in appropriate subfolder
2. Extend `BaseComponent` class
3. Define component markup and behavior
4. Add to main index.js
5. Update documentation

### Best Practices
- Use semantic HTML
- Follow Tailwind utility-first approach
- Maintain consistent naming conventions
- Test accessibility features
- Document component APIs
