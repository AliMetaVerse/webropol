# Global Settings System Implementation

## Overview

The Webropol application now features a unified, application-wide settings system that provides a consistent user experience across all pages and components. This system replaces page-specific settings modals with a centralized solution.

## Architecture

### Components

1. **Global Settings Modal** (`SettingsModal.js`)
   - Reusable modal component for settings configuration
   - Accessible from any page in the application
   - Auto-saves settings to localStorage
   - Supports keyboard navigation and ARIA accessibility

2. **Global Settings Manager** (`global-settings-manager.js`)
   - Centralized state management for application settings
   - Handles setting persistence, validation, and application
   - Provides event-driven updates across components
   - Manages auto-logout functionality

3. **Updated Header Component** (`Header.js`)
   - Integrates with global settings manager
   - Provides consistent access point through user menu
   - Supports keyboard shortcut (Ctrl/Cmd + ,)

## Features

### Available Settings

- **Dark Mode**: Toggle between light and dark themes
- **Compact Mode**: Reduce interface spacing for more compact UI
- **Show Floating Button**: Control visibility of floating action buttons
- **Auto-save**: Enable/disable automatic saving of user work
- **Notifications**: Control system notification preferences
- **Auto-logout**: Configure automatic logout after inactivity (15min-2hrs or never)

### Access Methods

1. **Header User Menu**: Click user avatar → Settings
2. **Keyboard Shortcut**: Ctrl/Cmd + , (global shortcut)
3. **Programmatic**: `globalSettingsManager.openSettingsModal()`

## Implementation Details

### Global Settings Manager API

```javascript
// Import the manager
import { globalSettingsManager } from './utils/global-settings-manager.js';

// Get a setting
const darkMode = globalSettingsManager.getSetting('darkMode');

// Set a setting
globalSettingsManager.setSetting('darkMode', true);

// Toggle a boolean setting
globalSettingsManager.toggleSetting('darkMode');

// Get all settings
const allSettings = globalSettingsManager.getAllSettings();

// Reset to defaults
globalSettingsManager.resetSettings();

// Open settings modal
globalSettingsManager.openSettingsModal();

// Listen for changes
globalSettingsManager.addListener((eventType, data) => {
  if (eventType === 'settings-changed') {
    console.log('Settings updated:', data);
  }
});
```

### Auto-Application of Settings

Settings are automatically applied when changed:

- **Dark Mode**: Adds/removes `dark` class on `document.documentElement`
- **Compact Mode**: Adds/removes `compact-mode` class on `document.documentElement`
- **Floating Button**: Controls visibility of all `webropol-floating-button` elements
- **Auto-logout**: Sets up/clears activity-based logout timers

### Event System

The system uses custom events for communication:

```javascript
// Fired when settings are applied
document.addEventListener('webropol-settings-applied', (e) => {
  const settings = e.detail.settings;
  // Handle settings application
});

// Fired when auto-logout is triggered
document.addEventListener('webropol-auto-logout', () => {
  // Handle logout logic
});
```

## Integration Guide

### For New Pages

1. **Import Required Components**:
```html
<script src="design-system/components/navigation/Header.js" type="module"></script>
<script src="design-system/components/modals/SettingsModal.js" type="module"></script>
<script src="design-system/utils/global-settings-manager.js" type="module"></script>
```

2. **Use the Header Component**:
```html
<webropol-header 
  username="User Name" 
  show-user-menu="true"
  show-theme-selector="true">
</webropol-header>
```

3. **Listen for Settings Changes** (if needed):
```javascript
document.addEventListener('webropol-settings-applied', (e) => {
  const settings = e.detail.settings;
  // Apply page-specific logic based on settings
});
```

### For Existing Pages

1. **Remove Page-Specific Settings**:
   - Remove local settings modals from HTML
   - Remove settings state from JavaScript
   - Remove settings-related methods

2. **Add Global Settings Imports**:
   - Import SettingsModal.js and global-settings-manager.js
   - Update header component if not already using the global one

3. **Update Event Handlers**:
   - Replace local settings events with global settings events
   - Remove `settings-open` event listeners (now handled globally)

## Benefits

### For Users
- **Consistent Experience**: Settings work the same way across all pages
- **Persistence**: Settings are remembered across sessions and page navigation
- **Accessibility**: Keyboard shortcuts and ARIA support
- **Immediate Application**: Changes take effect instantly

### For Developers
- **Reduced Code Duplication**: No need to implement settings on each page
- **Centralized Logic**: All settings logic in one place
- **Event-Driven Updates**: Components can react to settings changes
- **Easy Extension**: Simple to add new settings

### For Maintenance
- **Single Source of Truth**: One component to maintain for all settings
- **Consistent Styling**: Unified design across the application
- **Better Testing**: Centralized logic is easier to test
- **Scalability**: Easy to add new settings without touching every page

## Migration Example

### Before (Page-Specific)
```html
<!-- Each page had its own settings modal -->
<div x-show="showSettingsModal" class="...">
  <!-- Settings modal content -->
</div>

<script>
function pageApp() {
  return {
    showSettingsModal: false,
    settings: { /* page-specific settings */ },
    openSettings() { this.showSettingsModal = true; },
    saveSettings() { /* page-specific save logic */ }
  };
}
</script>
```

### After (Global)
```html
<!-- No page-specific settings modal needed -->

<script>
// Just import global settings
import { globalSettingsManager } from './utils/global-settings-manager.js';

// Settings are handled globally
// Access via header or Ctrl+, shortcut
</script>
```

## Future Enhancements

1. **User Preferences Sync**: Sync settings across devices/browsers
2. **Advanced Theming**: More theme options beyond dark/light
3. **Accessibility Settings**: Font size, contrast, motion preferences
4. **Workspace Settings**: Per-project or per-workspace configurations
5. **Export/Import**: Allow users to backup/restore their settings

## Files Modified

### New Files
- `design-system/components/modals/SettingsModal.js` - Global settings modal component
- `design-system/utils/global-settings-manager.js` - Settings management service
- `global-settings-demo.html` - Demo page showcasing the functionality

### Modified Files
- `design-system/components/navigation/Header.js` - Updated to use global settings
- `design-system/components/index.js` - Added new components to exports
- `design-system/webropol-standalone.js` - Added global settings to standalone build
- `index.html` - Removed page-specific settings, added global imports

### Backward Compatibility

The implementation maintains backward compatibility:
- Existing pages continue to work without modification
- Old settings are automatically migrated to global settings
- Page-specific settings logic can coexist during transition period

## Testing

Use the demo page (`global-settings-demo.html`) to test:
1. Settings modal accessibility
2. Real-time setting application
3. Persistence across page reloads
4. Keyboard shortcuts
5. Multiple access methods
