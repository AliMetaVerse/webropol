# Smart Notifier System

The Smart Notifier system provides three types of notification components for the Webropol design system:

## Components

### 1. Alert (`<webropol-alert>`)
**Purpose**: Inline contextual notifications within page content

**Features**:
- Four variants: `info`, `success`, `warning`, `error`
- Optional dismissible functionality
- Custom icons supported
- Automatic role and ARIA attributes for accessibility

**Usage**:
```html
<webropol-alert variant="info" dismissible="true">
  Your message here
</webropol-alert>

<webropol-alert variant="success" icon="fal fa-check">
  Operation completed successfully
</webropol-alert>

<webropol-alert variant="warning">
  Please review your input
</webropol-alert>

<webropol-alert variant="error" dismissible="true">
  An error occurred
</webropol-alert>
```

**Attributes**:
- `variant`: `info` (default), `success`, `warning`, `error`
- `dismissible`: `true` | `false` - Shows close button
- `icon`: Custom FontAwesome icon class (e.g., `fal fa-star`)
- `show`: `true` | `false` - Controls visibility

**Events**:
- `dismissed` - Fired when alert is dismissed
- `shown` - Fired when alert is shown

**Methods**:
- `dismiss()` - Programmatically dismiss the alert
- `show()` - Programmatically show the alert

---

### 2. Toast (`<webropol-toast>`)
**Purpose**: Temporary notifications that appear in screen corners

**Features**:
- Four variants: `info`, `success`, `warning`, `error`
- Six position options
- Auto-dismiss with configurable duration
- Optional manual dismissal
- Smooth animations

**Usage**:
```html
<webropol-toast 
  variant="success" 
  position="top-right" 
  duration="3000"
  dismissible="true"
  show="true">
  Changes saved successfully!
</webropol-toast>

<webropol-toast 
  variant="info" 
  position="bottom-center" 
  duration="5000">
  New features available
</webropol-toast>
```

**Attributes**:
- `variant`: `info` (default), `success`, `warning`, `error`
- `position`: `top-right` (default), `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`
- `duration`: Auto-dismiss duration in milliseconds (default: `3000`, set to `0` to disable auto-dismiss)
- `dismissible`: `true` | `false` - Shows close button
- `show`: `true` | `false` - Controls visibility

**Events**:
- `dismissed` - Fired when toast is dismissed
- `shown` - Fired when toast is shown

**Methods**:
- `dismiss()` - Programmatically dismiss the toast
- `show()` - Programmatically show the toast

---

### 3. Promo (`<webropol-promo>`)
**Purpose**: Bottom slide-in promotional notifications (existing component)

See `PromoToast.js` for full documentation.

---

## Design Tokens

All components use Webropol design tokens for consistent styling:

### Info Variant (Primary/Cyan)
- Background: Gradient from `cyan-50` to `blue-50`
- Border: `#06b6d4` (webropol-primary-500)
- Icon background: `webropol-primary-50`
- Icon border: `webropol-primary-200`
- Icon color: `webropol-primary-600`

### Success Variant
- Background: Gradient from `green-50` to `emerald-50`
- Border: `green-400`
- Icon: `fal fa-check-circle`

### Warning Variant
- Background: Gradient from `yellow-50` to `amber-50`
- Border: `yellow-400`
- Icon: `fal fa-exclamation-triangle`

### Error Variant
- Background: Gradient from `red-50` to `pink-50`
- Border: `red-400`
- Icon: `fal fa-exclamation-circle`

---

## Integration Examples

### With Alpine.js
```html
<div x-data="{ showAlert: false }">
  <button @click="showAlert = true">Show Alert</button>
  
  <webropol-alert 
    variant="success"
    :show="showAlert"
    @dismissed="showAlert = false">
    Your changes have been saved
  </webropol-alert>
</div>
```

### With JavaScript
```javascript
// Show toast programmatically
const toast = document.createElement('webropol-toast');
toast.setAttribute('variant', 'success');
toast.setAttribute('position', 'top-right');
toast.setAttribute('duration', '3000');
toast.textContent = 'Operation completed!';
document.body.appendChild(toast);
toast.show();

// Listen for events
toast.addEventListener('dismissed', () => {
  toast.remove();
});
```

### Survey Editor Example (edit.html)
```html
<webropol-alert 
  variant="info" 
  :show="hasMandatoryQuestions()">
  <p class="text-base font-medium">
    Mandatory questions are marked with an asterisk <span class="text-red-600 font-bold">(*)</span>
  </p>
</webropol-alert>
```

---

## Accessibility

All components include:
- Proper ARIA roles (`alert`, `status`)
- `aria-live="polite"` for screen reader announcements
- Keyboard navigation support for dismissible variants
- Color contrast compliant with WCAG 2.1 AA standards

---

## Files

- `/design-system/components/feedback/Alert.js` - Alert component
- `/design-system/components/feedback/Toast.js` - Toast component
- `/design-system/components/feedback/PromoToast.js` - Promo component
- `/design-system/components/index.js` - Unified exports

---

## Browser Support

- Modern browsers with Web Components support
- ES6 module support required
- FontAwesome Pro icons required
