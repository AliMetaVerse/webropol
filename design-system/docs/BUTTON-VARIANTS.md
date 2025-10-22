# Button Variants Reference

Complete reference for all Webropol button variants with visual examples and usage guidelines.

## Standard Variants

### Primary
**Use for:** Main actions, CTAs, primary workflows
```html
<webropol-button variant="primary" size="md">Save Changes</webropol-button>
<webropol-button variant="primary" size="md" icon="check">Confirm</webropol-button>
```
**Color:** Teal gradient (`webropol-primary-500` → `webropol-primary-600`)

### Secondary
**Use for:** Secondary actions, alternative options
```html
<webropol-button variant="secondary" size="md">Cancel</webropol-button>
<webropol-button variant="secondary" size="md" icon="download">Download</webropol-button>
```
**Color:** White with teal border (`border-webropol-primary-500`)

### Tertiary
**Use for:** Low-priority actions, inline actions
```html
<webropol-button variant="tertiary" size="md">Learn More</webropol-button>
<webropol-button variant="tertiary" size="md" icon="edit">Edit</webropol-button>
```
**Color:** Transparent with teal text (`text-webropol-primary-700`)

## Status Variants

### Success
**Use for:** Positive actions, confirmations, completions
```html
<webropol-button variant="success" size="md">Submit</webropol-button>
<webropol-button variant="success" size="md" icon="check-circle">Complete</webropol-button>
```
**Color:** Green gradient (`green-500` → `green-600`)

### Danger
**Use for:** Destructive actions, deletions, critical warnings
```html
<webropol-button variant="danger" size="md">Delete</webropol-button>
<webropol-button variant="danger" size="md" icon="trash">Remove</webropol-button>
```
**Color:** Red gradient (`red-500` → `red-600`)

### Danger Outline (NEW) ⭐
**Use for:** Secondary destructive actions, less severe deletions
```html
<webropol-button variant="danger-outline" size="md">Delete Item</webropol-button>
<webropol-button variant="danger-outline" size="md" icon="trash">Remove</webropol-button>
```
**Color:** White with red border (`border-red-500`)
**Best for:** Confirmations, non-primary delete actions, archive operations

## Royal Gradient Variants (Premium) ⭐

### Royal (Mixed Gradient)
**Use for:** Premium features, VIP actions, exclusive content
```html
<webropol-button variant="royal" size="md">Upgrade to Pro</webropol-button>
<webropol-button variant="royal" size="md" icon="crown">Premium</webropol-button>
```
**Color:** Violet to Blue gradient (`royalViolet-500` → `royalBlue-600`)
**Best for:** Subscription CTAs, premium upgrades, exclusive features

### Royal Violet
**Use for:** Creative actions, special features, magic moments
```html
<webropol-button variant="royalViolet" size="md">Create Magic</webropol-button>
<webropol-button variant="royalViolet" size="md" icon="magic">AI Generate</webropol-button>
```
**Color:** Purple gradient (`royalViolet-500` → `royalViolet-600`)
**Best for:** AI features, creative tools, special workflows

### Royal Blue
**Use for:** Professional features, enterprise actions, trust signals
```html
<webropol-button variant="royalBlue" size="md">Enterprise Plan</webropol-button>
<webropol-button variant="royalBlue" size="md" icon="gem">Premium Support</webropol-button>
```
**Color:** Indigo gradient (`royalBlue-500` → `royalBlue-600`)
**Best for:** Enterprise features, professional plans, trust-building

### Royal Turquoise
**Use for:** Fresh actions, modern features, innovative options
```html
<webropol-button variant="royalTurquoise" size="md">Try New Feature</webropol-button>
<webropol-button variant="royalTurquoise" size="md" icon="sparkles">Beta Access</webropol-button>
```
**Color:** Teal gradient (`royalTurquoise-500` → `royalTurquoise-600`)
**Best for:** New features, beta programs, modern functionality

## Sizes

All variants support 4 standard sizes and 4 icon-only sizes:

### Standard Sizes (with text)
- **`sm`**: Small (padding: 6px 12px, text: sm)
- **`md`**: Medium/Default (padding: 10px 24px, text: sm)
- **`lg`**: Large (padding: 12px 32px, text: base)
- **`xl`**: Extra Large (padding: 16px 40px, text: lg)

```html
<webropol-button variant="royal" size="sm">Small</webropol-button>
<webropol-button variant="royal" size="md">Medium</webropol-button>
<webropol-button variant="royal" size="lg">Large</webropol-button>
<webropol-button variant="royal" size="xl">Extra Large</webropol-button>
```

### Icon-Only Sizes (square buttons) ⭐
- **`icon-sm`**: Small icon (padding: 8px, text: sm)
- **`icon-md`**: Medium icon (padding: 12px, text: base)
- **`icon-lg`**: Large icon (padding: 16px, text: lg)
- **`icon-xl`**: Extra Large icon (padding: 20px, text: xl)

```html
<webropol-button variant="danger" icon="trash" icon-only size="sm"></webropol-button>
<webropol-button variant="danger" icon="trash" icon-only size="md"></webropol-button>
<webropol-button variant="danger" icon="trash" icon-only size="lg"></webropol-button>
<webropol-button variant="danger" icon="trash" icon-only size="xl"></webropol-button>
```

## Attributes

### Icon-Only Mode ⭐
Use `icon-only` attribute for square icon buttons without text:
```html
<!-- Icon-only button -->
<webropol-button variant="danger" icon="trash" icon-only size="md"></webropol-button>

<!-- Different sizes -->
<webropol-button variant="primary" icon="plus" icon-only size="sm"></webropol-button>
<webropol-button variant="royal" icon="crown" icon-only size="lg"></webropol-button>
```

### Icons
```html
<!-- Icon left (default) -->
<webropol-button variant="primary" icon="arrow-left">Previous</webropol-button>

<!-- Icon right -->
<webropol-button variant="primary" icon="arrow-right" icon-position="right">Next</webropol-button>

<!-- Icon only (no text) -->
<webropol-button variant="royal" icon="crown" icon-only></webropol-button>
```

### Roundness ⭐
Control border radius with the `roundness` attribute:
```html
<!-- Fully rounded (default) -->
<webropol-button variant="primary" roundness="full">Fully Rounded</webropol-button>

<!-- Regular rounded corners -->
<webropol-button variant="primary" roundness="lg">Rounded Corners</webropol-button>

<!-- Icon buttons with different roundness -->
<webropol-button variant="danger" icon="trash" icon-only roundness="full"></webropol-button>
<webropol-button variant="danger" icon="trash" icon-only roundness="lg"></webropol-button>
```

**Available roundness values:** `full` (default), `lg`, `xl`, `2xl`, `md`, `sm`, `none`

### States
```html
<!-- Disabled -->
<webropol-button variant="primary" disabled>Disabled</webropol-button>

<!-- Loading -->
<webropol-button variant="royal" loading>Processing...</webropol-button>

<!-- Full width -->
<webropol-button variant="royalBlue" full-width>Full Width</webropol-button>
```

### Links
```html
<!-- As link -->
<webropol-button variant="primary" href="/upgrade" target="_blank">
  Upgrade Now
</webropol-button>
```

## Usage Guidelines

### When to Use Royal Variants

✅ **DO use royal variants for:**
- Premium/paid features
- Exclusive content access
- VIP/enterprise features
- Special limited-time offers
- AI-powered features
- Beta/early access programs

❌ **DON'T use royal variants for:**
- Standard navigation
- Common CRUD operations
- Regular form submissions
- Basic confirmations

### Accessibility

All button variants include:
- Proper ARIA roles and labels
- Keyboard navigation support
- Focus indicators (4px ring)
- Disabled state handling
- Loading state announcements

### Best Practices

1. **Hierarchy**: Use one primary action per screen section
2. **Consistency**: Use the same variant for similar actions across the app
3. **Context**: Royal variants should feel special - use sparingly
4. **Contrast**: Ensure text is readable on all gradient backgrounds
5. **Icons**: Use icons that reinforce the action meaning

## Examples in Context

### Upgrade Flow
```html
<div class="space-x-4">
  <webropol-button variant="royal" size="lg" icon="crown">
    Upgrade to Pro - $29/mo
  </webropol-button>
  <webropol-button variant="secondary" size="lg">
    Continue Free
  </webropol-button>
</div>
```

### AI Feature Launch
```html
<webropol-button variant="royalViolet" size="md" icon="magic">
  Generate with AI
</webropol-button>
```

### Enterprise CTA
```html
<webropol-button variant="royalBlue" size="lg" full-width icon="gem">
  Contact Sales
</webropol-button>
```

### Beta Program
```html
<webropol-button variant="royalTurquoise" size="md" icon="sparkles">
  Join Beta Program
</webropol-button>
```

## Design Tokens

Royal variants use these color palettes from `design-system/styles/tokens.js`:

```javascript
royalViolet: {
  500: '#8b5cf6',
  600: '#6d28d9',
  700: '#5b21b6'
}

royalBlue: {
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca'
}

royalTurquoise: {
  500: '#14b8a6',
  600: '#0d9488',
  700: '#0f766e'
}
```

## Live Demo

See all variants in action:
- **Demo Page**: `/design-system/demos/buttons-demo.html`
- **Component File**: `/design-system/components/buttons/Button.js`
- **Standalone Bundle**: `/design-system/webropol-standalone.js`

---

*Updated: 2025-10-22 - Added royal gradient variants for premium features*
