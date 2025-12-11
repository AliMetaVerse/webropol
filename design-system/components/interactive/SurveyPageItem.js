/**
 * SurveyPageItem Component
 * Represents a survey page in the Edit page's Survey Structure panel
 * Displays page information with collapsible question list
 */

import { BaseComponent } from '../../utils/base-component.js';

export class SurveyPageItem extends BaseComponent {
  static get observedAttributes() {
    return ['page-number', 'page-name', 'question-count', 'expanded', 'selected'];
  }

  init() {
    this.isExpanded = this.getBoolAttr('expanded', false);
    this.isSelected = this.getBoolAttr('selected', false);
    this.pageNumber = this.getAttr('page-number', '1');
    this.pageName = this.getAttr('page-name', `PAGE ${this.pageNumber}`);
    this.questionCount = this.getAttr('question-count', '0');
    this._initialized = false;
  }

  render() {
    // Only render structure once to preserve slotted content
    if (!this._initialized) {
      const expandIcon = this.isExpanded ? 'fa-chevron-down' : 'fa-chevron-right';
      const checkboxId = `page-${this.pageNumber}-checkbox`;
      
      // Save the slotted content
      const slottedContent = this.innerHTML;
      
      this.innerHTML = `
        <div class="bg-white rounded-xl border border-webropol-gray-200 hover:border-webropol-primary-300 transition-all shadow-sm hover:shadow-md mb-1">
          <!-- Page Header - Compact Design -->
          <div class="flex items-center gap-2 px-3 py-2.5 cursor-pointer page-header group">
            <input 
              type="checkbox" 
              ${this.isSelected ? 'checked' : ''}
              class="w-3.5 h-3.5 text-webropol-primary-600 border-webropol-gray-300 rounded focus:ring-2 focus:ring-webropol-primary-500 focus:ring-offset-0 page-checkbox" 
              id="${checkboxId}"
            >
            <i class="fal transition-all duration-200 ${expandIcon} text-webropol-primary-600 expand-icon text-sm"></i>
            <label for="${checkboxId}" class="flex-1 flex items-center gap-2 cursor-pointer page-label min-w-0">
              <span class="font-semibold text-webropol-gray-900 text-sm truncate">${this.pageName}</span>
              <span class="px-1.5 py-0.5 text-[10px] font-medium bg-webropol-gray-100 text-webropol-gray-600 rounded-md whitespace-nowrap">
                ${this.questionCount}
              </span>
            </label>
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-webropol-gray-100 rounded text-webropol-gray-500 hover:text-webropol-gray-700 page-menu-btn" title="Page options">
              <i class="fal fa-ellipsis-h text-xs"></i>
            </button>
          </div>
          
          <!-- Questions Container (Collapsible) -->
          <div class="questions-container px-3 pb-2 space-y-1 ${this.isExpanded ? '' : 'hidden'}">
            ${slottedContent}
          </div>
        </div>
      `;
      
      this._initialized = true;
    } else {
      // Just update the dynamic parts without re-rendering everything
      this.updateDynamicContent();
    }
  }
  
  updateDynamicContent() {
    const checkbox = this.querySelector('.page-checkbox');
    const pageName = this.querySelector('.page-label span:first-child');
    const badge = this.querySelector('.page-label span:last-child');
    const icon = this.querySelector('.expand-icon');
    const container = this.querySelector('.questions-container');
    
    if (checkbox) checkbox.checked = this.isSelected;
    if (pageName) pageName.textContent = this.pageName;
    if (badge) badge.textContent = this.questionCount;
    if (icon) {
      icon.classList.toggle('fa-chevron-down', this.isExpanded);
      icon.classList.toggle('fa-chevron-right', !this.isExpanded);
    }
    if (container) {
      container.classList.toggle('hidden', !this.isExpanded);
    }
  }

  bindEvents() {
    // Toggle expand/collapse on header click
    const header = this.querySelector('.page-header');
    header?.addEventListener('click', (e) => {
      // Don't toggle if clicking directly on checkbox or label
      if (e.target.closest('.page-checkbox') || e.target.closest('.page-label')) {
        return;
      }
      this.toggleExpanded();
    });

    // Handle checkbox selection
    const checkbox = this.querySelector('.page-checkbox');
    checkbox?.addEventListener('change', (e) => {
      e.stopPropagation();
      this.isSelected = checkbox.checked;
      this.emit('page-select', {
        pageNumber: this.pageNumber,
        selected: this.isSelected
      });
    });

    // Prevent label click from bubbling to header
    const label = this.querySelector('.page-label');
    label?.addEventListener('click', (e) => {
      e.stopPropagation();
      const checkbox = this.querySelector('.page-checkbox');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.updateDynamicContent();

    this.emit('page-toggle', {
      pageNumber: this.pageNumber,
      expanded: this.isExpanded
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._initialized) {
      if (name === 'expanded') {
        this.isExpanded = this.getBoolAttr('expanded', false);
      } else if (name === 'selected') {
        this.isSelected = this.getBoolAttr('selected', false);
      } else if (name === 'page-number') {
        this.pageNumber = newValue;
      } else if (name === 'page-name') {
        this.pageName = newValue;
      } else if (name === 'question-count') {
        this.questionCount = newValue;
      }
      this.updateDynamicContent();
    }
  }
}

customElements.define('webropol-survey-page', SurveyPageItem);
