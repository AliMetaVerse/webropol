# Webropol Design System - Simple HTML/CSS/JS Integration

## 🎯 Direct Integration for HTML/CSS/JS Projects

Since you're working directly with HTML, CSS, and JavaScript (without Node.js/NPM), here's a simplified approach to use the redesigned card components.

## 📁 What You Actually Need

Instead of the complex `dist` folder, you only need these files from your design system:

### Core Files:
```
design-system/
├── components/cards/
│   ├── Card.js
│   ├── ActionCard.js  
│   ├── ListCard.js
│   ├── VideoCard.js
│   └── ConfigurableCard.js
├── utils/
│   ├── base-component.js
│   ├── theme-utils.js
│   └── accessibility.js
├── styles/
│   ├── animations.css
│   └── tokens.js
└── img/backgrounds/      # Your existing background images
```

## 🚀 Simple Integration

### Option 1: Direct Script Tags (Recommended for HTML/CSS/JS)

Create a single file that imports everything you need:

**webropol-cards.js** (create this file):
```javascript
// Import utilities first
import './utils/base-component.js';
import './utils/theme-utils.js'; 
import './utils/accessibility.js';

// Import card components
import './components/cards/Card.js';
import './components/cards/ActionCard.js';
import './components/cards/ListCard.js';
import './components/cards/VideoCard.js';
import './components/cards/ConfigurableCard.js';

console.log('Webropol Cards loaded successfully!');
```

**In your HTML:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Webropol App</title>
    <!-- Include Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Include FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Include your animations -->
    <link rel="stylesheet" href="design-system/styles/animations.css">
</head>
<body>
    <!-- Your content with card components -->
    <webropol-card title="My Survey" icon="chart-bar" badge="New">
        <p>Survey content here</p>
    </webropol-card>

    <!-- Load the components at the end -->
    <script type="module" src="design-system/webropol-cards.js"></script>
</body>
</html>
```

### Option 2: Individual Component Loading

**In your HTML:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Webropol App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="design-system/styles/animations.css">
</head>
<body>
    <!-- Your content -->
    
    <!-- Load only what you need -->
    <script type="module" src="design-system/utils/base-component.js"></script>
    <script type="module" src="design-system/components/cards/Card.js"></script>
    <script type="module" src="design-system/components/cards/ActionCard.js"></script>
    <!-- Add other components as needed -->
</body>
</html>
```

## 📋 Simplified File Structure

You can ignore the `dist` folder entirely and work directly with:

```
your-project/
├── index.html
├── design-system/
│   ├── webropol-cards.js     # ← Create this simple loader
│   ├── components/cards/     # ← Your updated components
│   ├── utils/               # ← Base utilities  
│   ├── styles/              # ← CSS animations
│   └── demo.html            # ← For testing designs
└── img/backgrounds/         # ← Your background images
```

## 🎨 Key Benefits of This Approach

1. **No Build Process**: Use files directly as they are
2. **No NPM/Node.js**: Pure HTML/CSS/JS workflow
3. **Easy Debugging**: All source files visible and editable
4. **Simple Updates**: Just edit the component files directly
5. **Flexible Loading**: Load only the components you need

## 🔧 Usage Examples (Same as Before)

The HTML usage remains exactly the same:

```html
<!-- Glass morphism card -->
<webropol-card 
  title="Survey Analytics" 
  variant="glass"
  icon="chart-bar"
  badge="Active">
  <p>Your survey content</p>
</webropol-card>

<!-- Video card with background -->
<webropol-video-card
  title="Tutorial Video"
  duration="5:24"
  background="fluid-pink"
  tag="Beginner">
</webropol-video-card>
```

## ❌ What You DON'T Need

- ✖️ `dist` folder
- ✖️ `package.json`
- ✖️ `deploy.js` script
- ✖️ `node_modules`
- ✖️ Build processes
- ✖️ NPM commands

## ✅ What You DO Need

- ✅ Your existing HTML/CSS/JS workflow
- ✅ Component files from `design-system/components/cards/`
- ✅ Utility files from `design-system/utils/`
- ✅ CSS animations from `design-system/styles/`
- ✅ Background images from `img/backgrounds/`

Would you like me to create the simplified `webropol-cards.js` loader file for you?
