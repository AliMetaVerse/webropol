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
    const { icon, color } = this.getQuestionTypeMeta(this.questionType);

    this.innerHTML = `
      <div class="relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                  cursor-pointer transition-all duration-150
                  hover:bg-white hover:shadow-sm
                  group question-item">

        <!-- Checkbox -->
        <input
          type="checkbox"
          ${this.isSelected ? 'checked' : ''}
          class="w-3.5 h-3.5 shrink-0 rounded border-webropol-gray-300
                 text-webropol-primary-600
                 focus:ring-2 focus:ring-webropol-primary-400 focus:ring-offset-0
                 question-checkbox"
          id="${checkboxId}"
        >

        <!-- Type icon chip -->
        <span class="shrink-0 w-5 h-5 rounded flex items-center justify-center ${color}">
          <i class="fal ${icon} text-[10px]"></i>
        </span>

        <!-- Question text -->
        <span class="flex-1 text-xs text-webropol-gray-700 truncate cursor-pointer question-label select-none">
          ${this.questionText}
        </span>

        <!-- Hover action buttons -->
        <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100
                    transition-opacity action-buttons shrink-0">
          <button type="button"
                  class="w-6 h-6 flex items-center justify-center rounded
                         text-webropol-gray-400 hover:text-webropol-primary-600
                         hover:bg-webropol-primary-50 transition-colors settings-btn"
                  title="Settings" aria-label="Question settings">
            <i class="fal fa-sliders-h text-[10px]"></i>
          </button>
          <button type="button"
                  class="w-6 h-6 flex items-center justify-center rounded
                         text-webropol-gray-400 hover:text-red-500
                         hover:bg-red-50 transition-colors delete-btn"
                  title="Delete" aria-label="Delete question">
            <i class="fal fa-trash-can text-[10px]"></i>
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
   * Returns { icon, color } for the question type chip
   */
  getQuestionTypeMeta(type) {
    const map = {
      'text':        { icon: 'fa-text',              color: 'bg-blue-50   text-blue-500'    },
      'textarea':    { icon: 'fa-align-left',         color: 'bg-blue-50   text-blue-500'    },
      'radio':       { icon: 'fa-circle-dot',         color: 'bg-violet-50 text-violet-500'  },
      'checkbox':    { icon: 'fa-square-check',       color: 'bg-violet-50 text-violet-500'  },
      'dropdown':    { icon: 'fa-caret-square-down',  color: 'bg-indigo-50 text-indigo-500'  },
      'scale':       { icon: 'fa-sliders-h',          color: 'bg-cyan-50   text-cyan-600'    },
      'nps':         { icon: 'fa-chart-line',         color: 'bg-cyan-50   text-cyan-600'    },
      'rating':      { icon: 'fa-star',               color: 'bg-amber-50  text-amber-500'   },
      'matrix':      { icon: 'fa-table',              color: 'bg-teal-50   text-teal-600'    },
      'ranking':     { icon: 'fa-sort-amount-down',   color: 'bg-orange-50 text-orange-500'  },
      'contact':     { icon: 'fa-address-card',       color: 'bg-green-50  text-green-600'   },
      'autosuggest': { icon: 'fa-magic',              color: 'bg-purple-50 text-purple-500'  },
      'date':        { icon: 'fa-calendar-alt',       color: 'bg-rose-50   text-rose-500'    },
      'file':        { icon: 'fa-file-upload',        color: 'bg-gray-100  text-gray-500'    },
    };
    return map[type] || { icon: 'fa-question-circle', color: 'bg-gray-100 text-gray-400' };
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
