# Survey Structure Components - Quick Reference

## Component Imports

```html
<script src="../design-system/components/interactive/SurveyPageItem.js" type="module"></script>
<script src="../design-system/components/interactive/SurveyQuestionItem.js" type="module"></script>
```

## SurveyPageItem

### Basic Usage
```html
<webropol-survey-page 
  page-number="1" 
  page-name="PAGE 1" 
  question-count="3" 
  expanded
>
  <!-- Questions go here as children -->
</webropol-survey-page>
```

### Attributes
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `page-number` | string | "1" | Page number identifier |
| `page-name` | string | "PAGE {number}" | Display name |
| `question-count` | string | "0" | Number of questions |
| `expanded` | boolean | false | Show/hide questions |
| `selected` | boolean | false | Checkbox state |

### Events
| Event | Detail | Description |
|-------|--------|-------------|
| `page-toggle` | `{ pageNumber, expanded }` | Page expanded/collapsed |
| `page-select` | `{ pageNumber, selected }` | Checkbox changed |

### Example with Events
```html
<webropol-survey-page 
  page-number="1"
  @page-toggle="console.log('toggled', $event.detail)"
  @page-select="console.log('selected', $event.detail)"
>
  <!-- Questions -->
</webropol-survey-page>
```

## SurveyQuestionItem

### Basic Usage
```html
<webropol-survey-question 
  question-id="q1" 
  question-text="What is your name?" 
  question-type="text"
></webropol-survey-question>
```

### Attributes
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `question-id` | string | "" | Unique identifier |
| `question-text` | string | "Untitled Question" | Display text |
| `question-type` | string | "text" | Question type |
| `selected` | boolean | false | Checkbox state |

### Events
| Event | Detail | Description |
|-------|--------|-------------|
| `question-select` | `{ questionId, selected }` | Checkbox changed |
| `question-settings` | `{ questionId, questionType }` | Settings clicked |
| `question-delete` | `{ questionId }` | Delete clicked |

### Question Types & Icons
| Type | Icon | Description |
|------|------|-------------|
| `text` | fa-text | Single-line text |
| `textarea` | fa-align-left | Multi-line text |
| `radio` | fa-dot-circle | Single choice |
| `checkbox` | fa-check-square | Multiple choice |
| `dropdown` | fa-caret-square-down | Dropdown select |
| `scale` | fa-sliders-h | Rating scale |
| `nps` | fa-chart-line | Net Promoter Score |
| `rating` | fa-star | Star rating |
| `matrix` | fa-table | Matrix grid |
| `ranking` | fa-sort-amount-down | Rank order |
| `contact` | fa-address-card | Contact form |
| `autosuggest` | fa-magic | Auto-complete |
| `date` | fa-calendar-alt | Date picker |
| `file` | fa-file-upload | File upload |

### Example with Events
```html
<webropol-survey-question 
  question-id="q1" 
  question-text="Rate our service" 
  question-type="rating"
  @question-settings="openSettings($event.detail)"
  @question-delete="deleteQuestion($event.detail)"
  @question-select="selectQuestion($event.detail)"
></webropol-survey-question>
```

## Complete Example

```html
<div class="survey-structure">
  <!-- Page 1 -->
  <webropol-survey-page 
    page-number="1" 
    page-name="Customer Information" 
    question-count="2" 
    expanded
    @page-toggle="handlePageToggle"
    @page-select="handlePageSelect"
  >
    <webropol-survey-question 
      question-id="name" 
      question-text="What is your name?" 
      question-type="text"
      @question-settings="openQuestionSettings"
      @question-delete="deleteQuestion"
    ></webropol-survey-question>
    
    <webropol-survey-question 
      question-id="contact" 
      question-text="Contact details" 
      question-type="contact"
      @question-settings="openQuestionSettings"
      @question-delete="deleteQuestion"
    ></webropol-survey-question>
  </webropol-survey-page>

  <!-- Page 2 -->
  <webropol-survey-page 
    page-number="2" 
    page-name="Feedback" 
    question-count="1"
    @page-toggle="handlePageToggle"
    @page-select="handlePageSelect"
  >
    <webropol-survey-question 
      question-id="nps" 
      question-text="How likely are you to recommend us?" 
      question-type="nps"
      @question-settings="openQuestionSettings"
      @question-delete="deleteQuestion"
    ></webropol-survey-question>
  </webropol-survey-page>
</div>
```

## JavaScript Event Handlers (Alpine.js)

```javascript
function surveyStructureApp() {
  return {
    init() {
      this.setupComponentListeners();
    },
    
    setupComponentListeners() {
      // Page events
      document.addEventListener('page-toggle', (e) => {
        console.log('Page toggled:', e.detail);
      });
      
      document.addEventListener('page-select', (e) => {
        console.log('Page selected:', e.detail);
      });
      
      // Question events
      document.addEventListener('question-select', (e) => {
        console.log('Question selected:', e.detail);
      });
      
      document.addEventListener('question-settings', (e) => {
        this.openQuestionSettings(e.detail.questionId);
      });
      
      document.addEventListener('question-delete', (e) => {
        this.deleteQuestion(e.detail.questionId);
      });
    },
    
    handlePageToggle(event) {
      const { pageNumber, expanded } = event.detail;
      console.log(`Page ${pageNumber} ${expanded ? 'expanded' : 'collapsed'}`);
    },
    
    handlePageSelect(event) {
      const { pageNumber, selected } = event.detail;
      console.log(`Page ${pageNumber} ${selected ? 'selected' : 'deselected'}`);
    },
    
    openQuestionSettings(questionId) {
      console.log('Opening settings for:', questionId);
      // Open settings modal
    },
    
    deleteQuestion(questionId) {
      if (confirm('Delete this question?')) {
        console.log('Deleting question:', questionId);
        // Delete logic
      }
    }
  }
}
```

## Programmatic Access

```javascript
// Get component
const page = document.querySelector('webropol-survey-page[page-number="1"]');

// Update attributes
page.setAttribute('expanded', 'true');
page.setAttribute('question-count', '5');

// Listen to events
page.addEventListener('page-toggle', (e) => {
  console.log(e.detail);
});

// Call methods (if needed)
page.toggleExpanded();
```

## Styling Notes

- Components use Webropol color tokens (`webropol-primary-*`, `webropol-gray-*`)
- Questions have neutral white background
- Action buttons appear on hover
- Smooth transitions on all interactions
- Fully responsive with Tailwind classes

## Demo & Documentation

- **Demo Page**: `design-system/demos/survey-structure-demo.html`
- **Full Guide**: `docs/SURVEY-STRUCTURE-IMPLEMENTATION.md`
- **Base Component**: `design-system/utils/base-component.js`

---

**Quick Start**: Copy the "Complete Example" above and modify attributes to match your survey structure.
