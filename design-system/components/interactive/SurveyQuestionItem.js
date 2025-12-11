/**
 * SurveyQuestionItem Component
 * Represents a single survey question in neutral style (no colored backgrounds)
 * Used in the Edit page's Survey Structure panel
 */

import { BaseComponent } from '../../utils/base-component.js';

export class SurveyQuestionItem extends BaseComponent {
  static get observedAttributes() {
    return ['question-id', 'question-text', 'question-type', 'selected'];
  }

  init() {
    this.questionId = this.getAttr('question-id', '');
    this.questionText = this.getAttr('question-text', 'Untitled Question');
    this.questionType = this.getAttr('question-type', 'text');
    this.isSelected = this.getBoolAttr('selected', false);
  }

  render() {
    const checkboxId = `question-${this.questionId}-checkbox`;
    const questionTypeIcon = this.getQuestionTypeIcon(this.questionType);
    
    this.innerHTML = `
      <div class="flex items-center gap-2 px-2.5 py-2 bg-webropol-gray-50 hover:bg-white rounded-lg border border-transparent hover:border-webropol-gray-200 cursor-pointer transition-all group question-item mb-1">
        <!-- Checkbox -->
        <input 
          type="checkbox" 
          ${this.isSelected ? 'checked' : ''}
          class="w-3.5 h-3.5 text-webropol-primary-600 border-webropol-gray-300 rounded focus:ring-2 focus:ring-webropol-primary-500 focus:ring-offset-0 question-checkbox" 
          id="${checkboxId}"
        >
        
        <!-- Question Content -->
        <label for="${checkboxId}" class="flex-1 flex items-center gap-2 cursor-pointer question-label min-w-0">
          <i class="fal ${questionTypeIcon} text-webropol-gray-400 text-xs flex-shrink-0"></i>
          <span class="text-webropol-gray-700 text-xs truncate flex-1">${this.questionText}</span>
        </label>
        
        <!-- Action Buttons (Hidden by default, shown on hover) -->
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity action-buttons flex-shrink-0">
          <button 
            class="w-5 h-5 flex items-center justify-center rounded bg-webropol-primary-600 text-white hover:bg-webropol-primary-700 transition-colors settings-btn" 
            title="Settings"
            aria-label="Question settings"
          >
            <i class="fal fa-cog text-[10px]"></i>
          </button>
          <button 
            class="w-5 h-5 flex items-center justify-center rounded bg-webropol-gray-400 text-white hover:bg-red-500 transition-colors delete-btn" 
            title="Delete"
            aria-label="Delete question"
          >
            <i class="fa-light fa-trash-can text-[10px]"></i>
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Handle checkbox selection
    const checkbox = this.querySelector('.question-checkbox');
    checkbox?.addEventListener('change', (e) => {
      e.stopPropagation();
      this.isSelected = checkbox.checked;
      this.emit('question-select', {
        questionId: this.questionId,
        selected: this.isSelected
      });
    });

    // Prevent label click from triggering parent clicks
    const label = this.querySelector('.question-label');
    label?.addEventListener('click', (e) => {
      e.stopPropagation();
      const checkbox = this.querySelector('.question-checkbox');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });

    // Settings button
    const settingsBtn = this.querySelector('.settings-btn');
    settingsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.emit('question-settings', {
        questionId: this.questionId,
        questionType: this.questionType
      });
    });

    // Delete button
    const deleteBtn = this.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.emit('question-delete', {
        questionId: this.questionId
      });
    });
  }

  /**
   * Get FontAwesome icon class based on question type
   */
  getQuestionTypeIcon(type) {
    const iconMap = {
      'text': 'fa-text',
      'textarea': 'fa-align-left',
      'radio': 'fa-dot-circle',
      'checkbox': 'fa-check-square',
      'dropdown': 'fa-caret-square-down',
      'scale': 'fa-sliders-h',
      'nps': 'fa-chart-line',
      'rating': 'fa-star',
      'matrix': 'fa-table',
      'ranking': 'fa-sort-amount-down',
      'contact': 'fa-address-card',
      'autosuggest': 'fa-magic',
      'date': 'fa-calendar-alt',
      'file': 'fa-file-upload'
    };
    
    return iconMap[type] || 'fa-question-circle';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'question-id') {
        this.questionId = newValue;
      } else if (name === 'question-text') {
        this.questionText = newValue;
      } else if (name === 'question-type') {
        this.questionType = newValue;
      } else if (name === 'selected') {
        this.isSelected = this.getBoolAttr('selected', false);
      }
      this.render();
      this.bindEvents();
    }
  }
}

customElements.define('webropol-survey-question', SurveyQuestionItem);
