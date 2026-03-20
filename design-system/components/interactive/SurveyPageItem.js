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
    // NOTE: do NOT reset _initialized here — doing so causes a double-render
    // when the panel component moves this node into its slot container.
    if (this._initialized === undefined) this._initialized = false;
  }

  render() {
    if (!this._initialized) {
      const expandIcon = this.isExpanded ? 'fa-chevron-down' : 'fa-chevron-right';
      const checkboxId = `page-${this.pageNumber}-checkbox`;
      const slottedContent = this.innerHTML;

      this.innerHTML = `
        <div class="group _page-root">
          <!-- Page Header -->
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer page-header
                      border border-transparent
                      hover:border-webropol-gray-200 hover:bg-white
                      transition-all duration-150 select-none">

            <input
              type="checkbox"
              ${this.isSelected ? 'checked' : ''}
              class="w-3.5 h-3.5 shrink-0 rounded border-webropol-gray-300
                     text-webropol-primary-600
                     focus:ring-2 focus:ring-webropol-primary-400 focus:ring-offset-0
                     page-checkbox"
              id="${checkboxId}"
            >

            <i class="fal fa-file-lines text-webropol-gray-400 text-xs shrink-0"></i>

            <label for="${checkboxId}" class="flex-1 flex items-center gap-2 cursor-pointer page-label min-w-0">
              <span class="font-semibold text-webropol-gray-800 text-xs tracking-wide uppercase truncate">${this.pageName}</span>
              <span class="_count-badge inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                           text-[10px] font-semibold bg-webropol-gray-100 text-webropol-gray-500
                           rounded-full whitespace-nowrap leading-none">
                ${this.questionCount}
              </span>
            </label>

            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded
                           text-webropol-gray-400 hover:text-webropol-gray-600
                           hover:bg-webropol-gray-100 page-menu-btn"
                    title="Page options" type="button">
              <i class="fal fa-ellipsis-h text-xs"></i>
            </button>

            <button class="p-1 rounded text-webropol-gray-400 hover:text-webropol-gray-600
                           hover:bg-webropol-gray-100 transition-colors expand-toggle-btn"
                    title="${this.isExpanded ? 'Collapse' : 'Expand'}" type="button">
              <i class="fal ${expandIcon} expand-icon text-[10px] transition-transform duration-200"></i>
            </button>
          </div>

          <!-- Questions Container (collapsible) -->
          <div class="questions-container ml-4 mt-1 space-y-0.5 ${this.isExpanded ? '' : 'hidden'}">
            ${slottedContent}
          </div>
        </div>
      `;

      this._initialized = true;
    } else {
      this.updateDynamicContent();
    }
  }
  
  updateDynamicContent() {
    const checkbox  = this.querySelector('.page-checkbox');
    const nameEl    = this.querySelector('.page-label span:first-child');
    const badge     = this.querySelector('._count-badge');
    const icon      = this.querySelector('.expand-icon');
    const container = this.querySelector('.questions-container');
    const toggleBtn = this.querySelector('.expand-toggle-btn');

    if (checkbox)  checkbox.checked = this.isSelected;
    if (nameEl)    nameEl.textContent = this.pageName;
    if (badge)     badge.textContent  = this.questionCount;
    if (icon) {
      icon.classList.toggle('fa-chevron-down',  this.isExpanded);
      icon.classList.toggle('fa-chevron-right', !this.isExpanded);
    }
    if (container) container.classList.toggle('hidden', !this.isExpanded);
    if (toggleBtn) toggleBtn.title = this.isExpanded ? 'Collapse' : 'Expand';
  }

  bindEvents() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    // Expand/collapse via dedicated toggle button
    this.querySelector('.expand-toggle-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleExpanded();
    });

    // Also allow clicking anywhere on the header row (except checkbox/label)
    const header = this.querySelector('.page-header');
    header?.addEventListener('click', (e) => {
      if (e.target.closest('.page-checkbox') ||
          e.target.closest('.page-label')    ||
          e.target.closest('.page-menu-btn') ||
          e.target.closest('.expand-toggle-btn')) return;
      this.toggleExpanded();
    });

    // Checkbox selection
    const checkbox = this.querySelector('.page-checkbox');
    checkbox?.addEventListener('change', (e) => {
      e.stopPropagation();
      this.isSelected = checkbox.checked;
      this.emit('page-select', { pageNumber: this.pageNumber, selected: this.isSelected });
    });

    // Label click → toggle checkbox
    this.querySelector('.page-label')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const cb = this.querySelector('.page-checkbox');
      if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); }
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
