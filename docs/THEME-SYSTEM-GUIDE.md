# Webropol Theme System

## Overview

The Webropol theme system allows users to switch between different visual themes that affect the background appearance of the application. Currently, two themes are available:

- **Warm Theme**: Uses a warm orange/peach background (`#fed7aa`)
 **Ocean Theme**: Uses a cool ocean blue background (`#ebf4f7`)

## Implementation

### Theme Manager

The `ThemeManager` class (`design-system/utils/theme-manager.js`) handles all theme-related functionality:

```javascript
// Set theme

// Get current theme
const currentTheme = ThemeManager.getCurrentTheme();

// Set theme
ThemeManager.setTheme('warm'); // or 'sky'

// Listen for theme changes
  background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff) !important;
  console.log('Theme changed to:', e.detail.theme);
});
```

### Header Integration

The Header component includes a theme selector when the `show-theme-selector` attribute is set to `true`:

```html
<webropol-header 
  username="Ali Al-Zuhairi" 
  show-theme-selector="true"
  show-notifications="true" 
  show-help="true" 
  show-user-menu="true">
</webropol-header>
  ocean: {
    name: 'Ocean',
### CSS Classes

      class: 'bg-ocean-to-br',

```css
.bg-sun-to-br {
  background: linear-gradient(to bottom right, #fed7aa, #fed7aa) !important;
}

.bg-sky-to-br {
  background: linear-gradient(to bottom right, #ebf4f7, #ebf4f7) !important;
}
```

## Usage

### In HTML Pages

1. Import the theme manager:
```html
<script src="../design-system/utils/theme-manager.js" type="module"></script>
```

2. Add theme selector to header:
```html
<webropol-header show-theme-selector="true"></webropol-header>
```

3. Remove any hardcoded background styles from the body tag:
```html
<!-- Before -->
<body class="bg-sun-to-br" style="background-color: #ebf4f7;">

<!-- After -->
<body>
```

### Theme Persistence

Themes are automatically saved to `localStorage` and restored on page load.

### Extending Themes

To add new themes, update the `THEME_CONFIGS` in `theme-manager.js`:

```javascript
static THEME_CONFIGS = {
  warm: {
    name: 'Warm',
    icon: 'fa-sun',
    background: {
      class: 'bg-sun-to-br',
      style: 'background: linear-gradient(to bottom right, #fdf5ecff, #fff0dfff);'
    }
  },
  sky: {
    name: 'Sky',
    icon: 'fa-cloud',
    background: {
      class: 'bg-sky-to-br',
      style: 'background: linear-gradient(to bottom right, #ebf4f7, #ebf4f7);'
    }
  },
  // Add new themes here
  ocean: {
    name: 'Ocean',
    icon: 'fa-water',
    background: {
      class: 'bg-ocean-to-br',
      style: 'background: linear-gradient(to bottom right, #ebf4f7, #ebf4f7);'
    }
  }
};
```

## File Structure

```
design-system/
├── utils/
│   ├── theme-manager.js       # Main theme management
│   └── base-component.js      # Updated with better getBoolAttr
├── components/
│   └── navigation/
│       └── Header.js          # Updated with theme selector
```

## Browser Support

- Modern browsers supporting ES6 modules
- CSS custom properties
- Local storage
- CSS gradients

## Testing

Use `theme-test.html` or `theme-complete-test.html` to test the theme system functionality.
