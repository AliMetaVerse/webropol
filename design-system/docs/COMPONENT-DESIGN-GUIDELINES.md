# Webropol Component Design Guidelines

## Overview
This guide provides comprehensive specifications for building consistent UI components within the Webropol design system. All components should follow these standards to ensure visual consistency and maintainability across the platform.

---

## Color System

### Primary Colors
The primary color palette uses teal/cyan tones for main interactive elements:

```css
webropol-primary-50:  #f0fdff  /* Lightest - backgrounds, hover states */
webropol-primary-100: #ccfbff  /* Very light - subtle highlights */
webropol-primary-200: #99f6ff  /* Light - disabled states */
webropol-primary-300: #5ceeff  /* Light-medium - hover backgrounds */
webropol-primary-400: #22d3ee  /* Medium - secondary buttons */
webropol-primary-500: #06b6d4  /* Base primary - main brand color */
webropol-primary-600: #0891b2  /* Medium-dark - hover states */
webropol-primary-700: #0e7490  /* Dark - active states */
webropol-primary-800: #155e75  /* Darker - text on light backgrounds */
webropol-primary-900: #164e63  /* Darkest - high contrast text */
```

### Gray Scale
Neutral colors for text, borders, and backgrounds:

```css
webropol-gray-50:  #f8fafc  /* Lightest - page backgrounds */
webropol-gray-100: #f1f5f9  /* Very light - card backgrounds */
webropol-gray-200: #e2e8f0  /* Light - borders, dividers */
webropol-gray-300: #cbd5e1  /* Light-medium - disabled elements */
webropol-gray-400: #94a3b8  /* Medium - placeholder text */
webropol-gray-500: #64748b  /* Base - secondary text */
webropol-gray-600: #475569  /* Medium-dark - body text */
webropol-gray-700: #334155  /* Dark - headings */
webropol-gray-800: #1e293b  /* Darker - emphasized text */
webropol-gray-900: #0f172a  /* Darkest - high contrast headings */
```

### Semantic Colors
Status and feedback colors:

```css
/* Success - Green */
webropol-green-50:  #f0fdf4
webropol-green-500: #22c55e  /* Primary success color */
webropol-green-600: #16a34a  /* Success hover */
webropol-green-700: #15803d  /* Success active */

/* Error - Red */
webropol-red-50:  #fef2f2
webropol-red-500: #ef4444  /* Primary error color */
webropol-red-600: #dc2626  /* Error hover */
webropol-red-700: #b91c1c  /* Error active */

/* Warning - Yellow/Amber */
webropol-yellow-50:  #fffbeb
webropol-yellow-500: #f59e0b  /* Primary warning color */
webropol-yellow-600: #d97706  /* Warning hover */

/* Info - Blue */
webropol-blue-50:  #eff6ff
webropol-blue-500: #3b82f6  /* Primary info color */
webropol-blue-600: #2563eb  /* Info hover */
```

### Color Usage Guidelines

**Do:**
- Use `webropol-primary-500` for primary actions and brand elements
- Use `webropol-gray-*` for text hierarchy (900 for headings, 600 for body, 500 for secondary)
- Use semantic colors consistently (green for success, red for errors)
- Maintain WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI elements)

**Don't:**
- Mix arbitrary Tailwind colors with design tokens
- Use primary colors for error states or destructive actions
- Use colors lighter than `gray-400` for body text

---

## Size System

### Spacing Scale
Based on a 4px base unit (Tailwind spacing system):

```
0    = 0px       /* No spacing */
0.5  = 2px       /* Micro spacing */
1    = 4px       /* Minimal spacing */
1.5  = 6px       /* Compact spacing */
2    = 8px       /* Small spacing */
3    = 12px      /* Medium-small spacing */
4    = 16px      /* Base spacing unit */
6    = 24px      /* Medium spacing */
8    = 32px      /* Large spacing */
10   = 40px      /* Extra large spacing */
12   = 48px      /* XXL spacing */
16   = 64px      /* Section spacing */
20   = 80px      /* Large section spacing */
```

### Component Sizes
Standard size variants for interactive components:

#### Buttons & Inputs
```css
/* Extra Small (xs) */
height: 28px (h-7)
padding: 4px 12px (px-3 py-1)
font-size: 12px (text-xs)

/* Small (sm) */
height: 36px (h-9)
padding: 8px 16px (px-4 py-2)
font-size: 14px (text-sm)

/* Medium (md) - Default */
height: 40px (h-10)
padding: 10px 20px (px-5 py-2.5)
font-size: 14px (text-sm)

/* Large (lg) */
height: 44px (h-11)
padding: 12px 24px (px-6 py-3)
font-size: 16px (text-base)

/* Extra Large (xl) */
height: 52px (h-13)
padding: 14px 28px (px-7 py-3.5)
font-size: 18px (text-lg)
```

#### Icons
```css
xs: 12px (w-3 h-3)
sm: 16px (w-4 h-4)
md: 20px (w-5 h-5)
lg: 24px (w-6 h-6)
xl: 32px (w-8 h-8)
```

### Size Usage Guidelines

**Do:**
- Use `md` as the default size for most components
- Use `sm` for compact layouts and secondary actions
- Use `lg` for prominent CTAs and hero sections
- Maintain consistent spacing within component groups

**Don't:**
- Mix size variants randomly within the same context
- Use `xs` for primary actions (poor accessibility)
- Create custom sizes outside the scale

---

## Border System

### Border Width
```css
border-0:   0px       /* No border */
border:     1px       /* Default border - most common */
border-2:   2px       /* Emphasized border */
border-4:   4px       /* Heavy border - focus states */
border-8:   8px       /* Very heavy - decorative only */
```

### Border Colors
```css
/* Neutral Borders */
border-webropol-gray-200  /* Default - subtle separation */
border-webropol-gray-300  /* Medium - card outlines */
border-webropol-gray-400  /* Strong - active borders */

/* Interactive Borders */
border-webropol-primary-500  /* Primary - focused inputs */
border-webropol-primary-300  /* Primary hover */

/* State Borders */
border-webropol-green-500   /* Success state */
border-webropol-red-500     /* Error state */
border-webropol-yellow-500  /* Warning state */
```

### Border Styles
```css
border-solid   /* Default - standard borders */
border-dashed  /* Dashed - upload areas, placeholders */
border-dotted  /* Dotted - subtle separators */
border-none    /* Remove borders */
```

### Border Usage Guidelines

**Do:**
- Use `border-webropol-gray-200` for most component borders
- Use `border-2` with primary color for focus states
- Use dashed borders for drag-and-drop zones
- Apply borders consistently across similar components

**Don't:**
- Use borders heavier than 2px for standard UI elements
- Mix border widths on the same component
- Use borders darker than `gray-400` unless intentional emphasis

---

## Rounded Corners (Border Radius)

### Radius Scale
```css
rounded-none:   0px        /* Sharp corners - data tables */
rounded-sm:     2px        /* Subtle - tags, badges */
rounded:        4px        /* Small - inputs, small buttons */
rounded-md:     6px        /* Medium - standard buttons, cards */
rounded-lg:     8px        /* Large - prominent cards, modals */
rounded-xl:     12px       /* Extra large - hero sections */
rounded-2xl:    16px       /* XXL - feature cards */
rounded-3xl:    24px       /* XXXL - decorative elements */
rounded-full:   9999px     /* Circular - avatars, pills */
```

### Component-Specific Radius

#### Buttons
```css
rounded-md (6px)  /* Default for all button sizes */
rounded-full      /* Pill-style buttons (optional) */
```

#### Cards
```css
rounded-lg (8px)   /* Standard cards */
rounded-xl (12px)  /* Featured/hero cards */
```

#### Inputs
```css
rounded (4px)      /* Text inputs, selects */
rounded-md (6px)   /* Larger input fields */
```

#### Modals
```css
rounded-lg (8px)   /* Standard modals */
rounded-xl (12px)  /* Large modals/dialogs */
```

#### Avatars & Badges
```css
rounded-full       /* Avatars, circular badges */
rounded (4px)      /* Rectangular badges */
```

### Radius Usage Guidelines

**Do:**
- Use `rounded-md` (6px) as the default for most components
- Use `rounded-full` for avatars and pill-shaped elements
- Apply consistent radius to related components
- Use larger radius (`rounded-xl`) for prominent, standalone elements

**Don't:**
- Mix different radius values on the same component
- Use sharp corners (`rounded-none`) except for data tables
- Use radius larger than `rounded-xl` for standard UI components

---

## Button Components

### Button Variants

#### Primary Button
**Purpose:** Main call-to-action, highest emphasis

```html
<button class="
  px-5 py-2.5 
  bg-webropol-primary-500 
  text-white 
  rounded-md 
  font-medium 
  transition-colors 
  hover:bg-webropol-primary-600 
  active:bg-webropol-primary-700
  focus:outline-none 
  focus:ring-2 
  focus:ring-webropol-primary-500 
  focus:ring-offset-2
  disabled:bg-webropol-gray-300 
  disabled:cursor-not-allowed
">
  Primary Action
</button>
```

**Characteristics:**
- Background: `webropol-primary-500`
- Text: White
- Border: None
- Hover: `webropol-primary-600`
- Active: `webropol-primary-700`
- Disabled: `webropol-gray-300` with reduced opacity

#### Secondary Button
**Purpose:** Secondary actions, medium emphasis

```html
<button class="
  px-5 py-2.5 
  bg-white 
  text-webropol-primary-700 
  border 
  border-webropol-primary-500 
  rounded-md 
  font-medium 
  transition-all 
  hover:bg-webropol-primary-50 
  hover:border-webropol-primary-600
  active:bg-webropol-primary-100
  focus:outline-none 
  focus:ring-2 
  focus:ring-webropol-primary-500 
  focus:ring-offset-2
  disabled:border-webropol-gray-300 
  disabled:text-webropol-gray-400 
  disabled:cursor-not-allowed
">
  Secondary Action
</button>
```

**Characteristics:**
- Background: White
- Text: `webropol-primary-700`
- Border: 1px solid `webropol-primary-500`
- Hover: `webropol-primary-50` background
- Active: `webropol-primary-100` background
- Disabled: `webropol-gray-300` border, `gray-400` text

#### Tertiary Button
**Purpose:** Low emphasis actions, subtle interactions

```html
<button class="
  px-5 py-2.5 
  bg-transparent 
  text-webropol-gray-700 
  rounded-md 
  font-medium 
  transition-colors 
  hover:bg-webropol-gray-100 
  hover:text-webropol-gray-900
  active:bg-webropol-gray-200
  focus:outline-none 
  focus:ring-2 
  focus:ring-webropol-gray-400 
  focus:ring-offset-2
  disabled:text-webropol-gray-400 
  disabled:cursor-not-allowed
">
  Tertiary Action
</button>
```

**Characteristics:**
- Background: Transparent
- Text: `webropol-gray-700`
- Border: None
- Hover: `webropol-gray-100` background
- Active: `webropol-gray-200` background
- Disabled: `webropol-gray-400` text

### Button Sizes

```html
<!-- Extra Small -->
<button class="px-3 py-1 text-xs h-7">XS Button</button>

<!-- Small -->
<button class="px-4 py-2 text-sm h-9">Small Button</button>

<!-- Medium (Default) -->
<button class="px-5 py-2.5 text-sm h-10">Medium Button</button>

<!-- Large -->
<button class="px-6 py-3 text-base h-11">Large Button</button>

<!-- Extra Large -->
<button class="px-7 py-3.5 text-lg h-13">XL Button</button>
```

### Button States

#### Loading State
```html
<button class="px-5 py-2.5 bg-webropol-primary-500 text-white rounded-md" disabled>
  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  Loading...
</button>
```

#### With Icon
```html
<!-- Icon Left -->
<button class="px-5 py-2.5 bg-webropol-primary-500 text-white rounded-md flex items-center gap-2">
  <i class="fas fa-plus w-4 h-4"></i>
  Add Item
</button>

<!-- Icon Right -->
<button class="px-5 py-2.5 bg-webropol-primary-500 text-white rounded-md flex items-center gap-2">
  Continue
  <i class="fas fa-arrow-right w-4 h-4"></i>
</button>

<!-- Icon Only -->
<button class="w-10 h-10 bg-webropol-primary-500 text-white rounded-md flex items-center justify-center">
  <i class="fas fa-search w-4 h-4"></i>
</button>
```

### Button Groups

```html
<div class="inline-flex rounded-md shadow-sm" role="group">
  <button class="px-4 py-2 text-sm font-medium text-webropol-gray-700 bg-white border border-webropol-gray-300 rounded-l-md hover:bg-webropol-gray-50">
    Left
  </button>
  <button class="px-4 py-2 text-sm font-medium text-webropol-gray-700 bg-white border-t border-b border-webropol-gray-300 hover:bg-webropol-gray-50">
    Middle
  </button>
  <button class="px-4 py-2 text-sm font-medium text-webropol-gray-700 bg-white border border-webropol-gray-300 rounded-r-md hover:bg-webropol-gray-50">
    Right
  </button>
</div>
```

### Button Usage Guidelines

**Do:**
- Use primary buttons sparingly (1-2 per screen)
- Use secondary buttons for alternative actions
- Use tertiary buttons for low-priority actions (cancel, dismiss)
- Include loading states for async operations
- Maintain consistent sizing within button groups
- Add proper focus states for accessibility

**Don't:**
- Use multiple primary buttons in the same context
- Mix button variants randomly
- Omit disabled states when applicable
- Use buttons for navigation (use links instead)
- Make buttons too small (minimum 36px height for touch targets)

---

## Web Component Implementation

### Using Webropol Button Component

```javascript
// Component Definition
import { BaseComponent } from '../utils/base-component.js';

export class WebropolButton extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading'];
  }
  
  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');
    
    const variantClasses = {
      primary: 'bg-webropol-primary-500 text-white hover:bg-webropol-primary-600 active:bg-webropol-primary-700',
      secondary: 'bg-white text-webropol-primary-700 border border-webropol-primary-500 hover:bg-webropol-primary-50',
      tertiary: 'bg-transparent text-webropol-gray-700 hover:bg-webropol-gray-100'
    };
    
    const sizeClasses = {
      xs: 'px-3 py-1 text-xs h-7',
      sm: 'px-4 py-2 text-sm h-9',
      md: 'px-5 py-2.5 text-sm h-10',
      lg: 'px-6 py-3 text-base h-11',
      xl: 'px-7 py-3.5 text-lg h-13'
    };
    
    this.shadowRoot.innerHTML = `
      <button 
        class="
          ${variantClasses[variant]} 
          ${sizeClasses[size]} 
          rounded-md 
          font-medium 
          transition-all 
          focus:outline-none 
          focus:ring-2 
          focus:ring-webropol-primary-500 
          focus:ring-offset-2
          disabled:opacity-50 
          disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
        ${disabled || loading ? 'disabled' : ''}
      >
        ${loading ? '<span class="animate-spin">⟳</span>' : ''}
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('webropol-button', WebropolButton);
```

### Usage Example

```html
<!-- Primary Button -->
<webropol-button variant="primary" size="md">Save Changes</webropol-button>

<!-- Secondary Button -->
<webropol-button variant="secondary" size="md">Cancel</webropol-button>

<!-- Tertiary Button -->
<webropol-button variant="tertiary" size="sm">Learn More</webropol-button>

<!-- Loading State -->
<webropol-button variant="primary" size="lg" loading>Processing...</webropol-button>

<!-- Disabled State -->
<webropol-button variant="primary" disabled>Submit</webropol-button>
```

---

## Accessibility Considerations

### Color Contrast
- Ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Primary buttons: White text on `primary-500` background ✓
- Secondary buttons: `primary-700` text on white background ✓
- Tertiary buttons: `gray-700` text on light backgrounds ✓

### Focus States
- Always include visible focus indicators (`focus:ring-2`)
- Use `focus:ring-offset-2` for better visibility
- Maintain focus state color consistency

### Touch Targets
- Minimum size: 44×44px (use `lg` size for touch interfaces)
- Adequate spacing between interactive elements (8px minimum)

### Screen Readers
- Use semantic HTML (`<button>` not `<div>`)
- Include `aria-label` for icon-only buttons
- Announce loading states with `aria-busy="true"`
- Announce disabled states with `aria-disabled="true"`

---

## Quick Reference

### Component Checklist
- [ ] Uses design token colors (`webropol-*`)
- [ ] Follows size scale (xs, sm, md, lg, xl)
- [ ] Includes all button variants (primary, secondary, tertiary)
- [ ] Has consistent border radius (`rounded-md` for most)
- [ ] Includes hover, active, focus, disabled states
- [ ] Meets WCAG AA contrast requirements
- [ ] Has adequate touch target size (44×44px minimum)
- [ ] Includes loading state for async actions
- [ ] Uses proper semantic HTML

### Common Tailwind Classes

```css
/* Layout */
flex items-center justify-center gap-2

/* Sizing */
px-5 py-2.5 h-10 w-full

/* Colors */
bg-webropol-primary-500 text-white border-webropol-gray-200

/* Typography */
font-medium text-sm text-webropol-gray-700

/* Effects */
rounded-md shadow-sm transition-all hover:bg-webropol-primary-600

/* States */
focus:outline-none focus:ring-2 focus:ring-webropol-primary-500 disabled:opacity-50
```

---

## Resources

- **Design Tokens**: `/design-system/styles/tokens.css`
- **Base Component**: `/design-system/utils/base-component.js`
- **Component Examples**: `/design-system/components/`
- **Integration Guide**: `/design-system/INTEGRATION.md`
- **Color Palette**: `/docs/webropol-color-palette.md`

---

*Last Updated: October 1, 2025*
*Version: 1.0.0*
