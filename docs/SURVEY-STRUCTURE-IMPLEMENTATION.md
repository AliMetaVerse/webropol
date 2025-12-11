# Survey Structure Components - Implementation Guide

## Overview

This document outlines the implementation of two new design system components for the Webropol Edit page's Survey Structure panel:

1. **SurveyPageItem** - Represents a survey page with collapsible question list
2. **SurveyQuestionItem** - Represents a single survey question in neutral style

## Implementation Breakdown

### Phase 1: Component Creation ✅

#### 1.1 SurveyPageItem Component
**Location**: `design-system/components/interactive/SurveyPageItem.js`

**Features**:
- Extends `BaseComponent` for consistent behavior
- Collapsible question container with smooth animations
- Page selection checkbox with proper event handling
- Question count badge
- Expand/collapse icon with rotation animation
- Custom events for page toggle and selection

**Attributes**:
- `page-number` - Page number identifier (default: "1")
- `page-name` - Display name (default: "PAGE {number}")
- `question-count` - Number of questions (default: "0")
- `expanded` - Boolean to show/hide questions (default: false)
- `selected` - Boolean for checkbox state (default: false)

**Events**:
- `page-toggle` - Fires when page is expanded/collapsed
  - Detail: `{ pageNumber, expanded }`
- `page-select` - Fires when page checkbox changes
  - Detail: `{ pageNumber, selected }`

**Styling**:
- Uses Webropol primary color tokens (`webropol-primary-*`)
- Rounded borders and smooth transitions
- Consistent with existing design system patterns

#### 1.2 SurveyQuestionItem Component
**Location**: `design-system/components/interactive/SurveyQuestionItem.js`

**Features**:
- Neutral white background (no colored containers)
- Icon mapping for different question types
- Hover-activated action buttons (settings, delete)
- Selection checkbox with proper event handling
- Smooth transitions and hover effects
- Accessibility-friendly button labels

**Attributes**:
- `question-id` - Unique identifier
- `question-text` - Question display text (default: "Untitled Question")
- `question-type` - Type of question (text, radio, checkbox, etc.)
- `selected` - Boolean for checkbox state (default: false)

**Events**:
- `question-select` - Fires when checkbox changes
  - Detail: `{ questionId, selected }`
- `question-settings` - Fires when settings button clicked
  - Detail: `{ questionId, questionType }`
- `question-delete` - Fires when delete button clicked
  - Detail: `{ questionId }`

**Supported Question Types**:
- `text` - Text input (fa-text)
- `textarea` - Multi-line text (fa-align-left)
- `radio` - Single choice (fa-dot-circle)
- `checkbox` - Multiple choice (fa-check-square)
- `dropdown` - Select dropdown (fa-caret-square-down)
- `scale` - Rating scale (fa-sliders-h)
- `nps` - Net Promoter Score (fa-chart-line)
- `rating` - Star rating (fa-star)
- `matrix` - Matrix grid (fa-table)
- `ranking` - Rank order (fa-sort-amount-down)
- `contact` - Contact form (fa-address-card)
- `autosuggest` - Auto-complete (fa-magic)
- `date` - Date picker (fa-calendar-alt)
- `file` - File upload (fa-file-upload)

### Phase 2: Edit Page Integration ✅

#### 2.1 Component Imports
**File**: `surveys/edit.html`

Added module imports in the `<head>` section:
```html
<script src="../design-system/components/interactive/SurveyPageItem.js" type="module"></script>
<script src="../design-system/components/interactive/SurveyQuestionItem.js" type="module"></script>
```

#### 2.2 HTML Structure Replacement
Replaced hardcoded HTML in the Survey Structure panel with web components:

**Before**: ~150 lines of repetitive HTML with Alpine.js state management
**After**: Clean, declarative component usage

```html
<webropol-survey-page 
  page-number="1" 
  page-name="PAGE 1" 
  question-count="3" 
  expanded
>
  <webropol-survey-question 
    question-id="contactform" 
    question-text="Please fill in your details" 
    question-type="contact"
  ></webropol-survey-question>
  <!-- More questions... -->
</webropol-survey-page>
```

#### 2.3 Event Handler Integration
Updated `surveyStructureApp()` function with:

**New Methods**:
- `setupComponentListeners()` - Registers global event listeners
- `handlePageToggle(event)` - Handles page expand/collapse
- `handlePageSelect(event)` - Handles page selection
- `openQuestionSettingsModal(questionId)` - Opens question settings
- `handleQuestionDelete(questionId)` - Handles question deletion with confirmation

**Event Listeners**:
```javascript
document.addEventListener('page-toggle', (e) => { ... });
document.addEventListener('page-select', (e) => { ... });
document.addEventListener('question-select', (e) => { ... });
document.addEventListener('question-settings', (e) => { ... });
document.addEventListener('question-delete', (e) => { ... });
```

### Phase 3: Documentation & Demo ✅

#### 3.1 Demo Page
**Location**: `design-system/demos/survey-structure-demo.html`

**Features**:
- Interactive demonstration of both components
- Live event log showing component interactions
- Three example pages with various question types
- Complete component documentation
- Attribute and event reference

#### 3.2 This Implementation Guide
Comprehensive breakdown of the entire implementation process.

## Usage Examples

### Basic Page with Questions
```html
<webropol-survey-page 
  page-number="1" 
  page-name="Customer Feedback" 
  question-count="2" 
  expanded
>
  <webropol-survey-question 
    question-id="q1" 
    question-text="How satisfied are you?" 
    question-type="scale"
  ></webropol-survey-question>
  
  <webropol-survey-question 
    question-id="q2" 
    question-text="Any suggestions?" 
    question-type="textarea"
  ></webropol-survey-question>
</webropol-survey-page>
```

### With Event Handlers (Alpine.js)
```html
<webropol-survey-page 
  page-number="1"
  @page-toggle="handlePageToggle"
  @page-select="handlePageSelect"
>
  <webropol-survey-question 
    question-id="q1"
    question-text="Question text"
    question-type="radio"
    @question-settings="openSettings"
    @question-delete="deleteQuestion"
    @question-select="selectQuestion"
  ></webropol-survey-question>
</webropol-survey-page>
```

### Programmatic Control
```javascript
// Get component reference
const page = document.querySelector('webropol-survey-page[page-number="1"]');

// Change attributes
page.setAttribute('expanded', 'true');
page.setAttribute('question-count', '5');

// Listen for events
page.addEventListener('page-toggle', (e) => {
  console.log('Page toggled:', e.detail);
});
```

## Design Decisions

### 1. Neutral Question Styling
**Decision**: Use white background with gray borders instead of colored backgrounds
**Rationale**: 
- Improves visual hierarchy (pages are primary, questions secondary)
- Reduces visual clutter with many questions
- Allows question type icons to be the primary identifier
- More professional and clean appearance

### 2. Web Components vs. Alpine.js Templates
**Decision**: Use Web Components extending `BaseComponent`
**Rationale**:
- Reusable across different pages and contexts
- Encapsulated behavior and styling
- Better maintainability and testability
- Consistent with existing design system architecture
- Easier to update globally

### 3. Event-Driven Architecture
**Decision**: Emit custom events instead of direct callbacks
**Rationale**:
- Decouples components from parent implementations
- Allows multiple listeners
- More flexible for future enhancements
- Standard web platform approach

### 4. Slot-Based Question Container
**Decision**: Use `<slot>` for question content in pages
**Rationale**:
- Flexible - can contain any number of questions
- Standard web component pattern
- Allows mixing questions with other elements if needed
- Clean, declarative syntax

## Integration Checklist

- [x] Create SurveyPageItem component
- [x] Create SurveyQuestionItem component
- [x] Add component imports to edit.html
- [x] Replace hardcoded HTML with components
- [x] Add event handlers to surveyStructureApp
- [x] Create demo page
- [x] Write documentation
- [ ] Test in live environment
- [ ] Add to design system index
- [ ] Update CHANGELOG

## Testing Plan

### Manual Testing
1. Open `surveys/edit.html`
2. Navigate to Survey Structure panel
3. Verify pages render correctly
4. Test expand/collapse functionality
5. Test checkbox selection
6. Test question action buttons (hover to reveal)
7. Test settings and delete modals
8. Check console for event logs

### Demo Page Testing
1. Open `design-system/demos/survey-structure-demo.html`
2. Interact with all pages and questions
3. Monitor event log for correct event firing
4. Test all question types display correct icons
5. Verify accessibility (keyboard navigation, ARIA labels)

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### Short Term
- Add drag-and-drop reordering for pages and questions
- Implement multi-select with bulk actions
- Add keyboard shortcuts for common actions
- Add question type indicator badges

### Medium Term
- Question preview on hover
- Inline editing of question text
- Duplicate page/question functionality
- Question templates library

### Long Term
- Advanced filtering and search
- Question logic visualization
- A/B testing variant indicators
- Collaborative editing indicators

## Related Files

### Components
- `design-system/components/interactive/SurveyPageItem.js`
- `design-system/components/interactive/SurveyQuestionItem.js`
- `design-system/utils/base-component.js`

### Pages
- `surveys/edit.html`
- `design-system/demos/survey-structure-demo.html`

### Styles
- `design-system/styles/tokens.css`
- `design-system/styles/button-classes.css`

### Documentation
- `design-system/README.md`
- `docs/COMPONENT-GUIDE.md`

## Troubleshooting

### Components Not Rendering
1. Check browser console for import errors
2. Verify module paths are correct relative to page location
3. Ensure BaseComponent is loading properly
4. Check for JavaScript errors preventing component registration

### Events Not Firing
1. Verify event listener registration in `setupComponentListeners()`
2. Check event names match between component and handler
3. Use browser DevTools to monitor custom events
4. Ensure Alpine.js is fully initialized before components load

### Styling Issues
1. Verify Tailwind config is loaded
2. Check color tokens are defined in tailwind.config
3. Ensure no CSS conflicts with existing styles
4. Test with browser DevTools style inspector

## Support

For questions or issues with these components:
1. Check this documentation first
2. Review the demo page for usage examples
3. Inspect existing implementation in `surveys/edit.html`
4. Check browser console for errors
5. Review BaseComponent documentation

---

**Last Updated**: December 11, 2025
**Version**: 1.0.0
**Author**: Webropol Design System Team
