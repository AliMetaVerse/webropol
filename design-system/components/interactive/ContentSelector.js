import { BaseComponent } from '../../utils/base-component.js';

/**
 * ContentSelector Component
 * Displays a selection interface for adding different types of content to surveys
 * @element webropol-content-selector
 * 
 * @attr {string} title - Selector title (default: "Select to add content")
 * @attr {boolean} show-main-actions - Show the three main action cards
 * @attr {boolean} show-question-types - Show question type options
 * 
 * @fires content-type-selected - Emitted when a content type is selected
 *   detail: { type: string, category: string }
 */
export class ContentSelector extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'show-main-actions', 'show-question-types'];
  }

  constructor() {
    super();
    this.hasRendered = false;
  }

  connectedCallback() {
    if (!this.hasRendered) {
      this.init();
      this.render();
      this.bindEvents();
      this.hasRendered = true;
    }
  }

  init() {
    this.state = {
      title: this.getAttr('title', 'Select to add content'),
      showMainActions: this.getBoolAttr('show-main-actions') !== false,
      showQuestionTypes: this.getBoolAttr('show-question-types') !== false
    };
  }

  render() {
    const { title, showMainActions, showQuestionTypes } = this.state;

    // Clear existing content
    this.innerHTML = '';

    // Create main container
    const container = document.createElement('div');
    container.className = 'w-full bg-white rounded-2xl shadow-soft border border-webropol-gray-200 p-8';
    
    // Create title
    const titleEl = document.createElement('h3');
    titleEl.className = 'text-2xl font-semibold text-webropol-gray-900 text-center mb-8';
    titleEl.textContent = title;
    container.appendChild(titleEl);

    // Add main actions if enabled
    if (showMainActions) {
      container.appendChild(this.createMainActions());
    }

    // Add question types if enabled
    if (showQuestionTypes) {
      container.appendChild(this.createQuestionTypes());
    }

    this.appendChild(container);
  }

  createMainActions() {
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-8';

    // Add Question
    const addQuestionBtn = this.createActionButton(
      'add-question',
      'fal fa-plus-square',
      'Add More Question Type',
      'from-orange-50 to-orange-100/50',
      'border-orange-200 hover:border-orange-400',
      'text-orange-500'
    );
    grid.appendChild(addQuestionBtn);

    // Import Library
    const importBtn = this.createActionButton(
      'import-library',
      'fal fa-books',
      'Import from Library',
      'from-webropol-primary-50 to-webropol-primary-100/50',
      'border-webropol-primary-200 hover:border-webropol-primary-400',
      'text-webropol-primary-600'
    );
    grid.appendChild(importBtn);

    // Free Text & Media
    const freeTextBtn = this.createActionButton(
      'free-text-media',
      'fal fa-align-left',
      'Free Text & Media',
      'from-purple-50 to-purple-100/50',
      'border-purple-200 hover:border-purple-400',
      'text-purple-600'
    );
    grid.appendChild(freeTextBtn);

    return grid;
  }

  createActionButton(action, iconClass, label, bgGradient, borderClass, iconColor) {
    const btn = document.createElement('button');
    btn.setAttribute('data-action', action);
    btn.className = `group p-6 bg-gradient-to-br ${bgGradient} rounded-xl border-2 ${borderClass} transition-all duration-300 hover:shadow-medium flex flex-col items-center gap-4 hover:-translate-y-1`;

    const iconDiv = document.createElement('div');
    iconDiv.className = `text-5xl ${iconColor} group-hover:scale-110 transition-transform duration-300`;
    iconDiv.innerHTML = `<i class="${iconClass}"></i>`;
    btn.appendChild(iconDiv);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'text-lg font-semibold text-webropol-gray-800';
    labelSpan.textContent = label;
    btn.appendChild(labelSpan);

    return btn;
  }

  createQuestionTypes() {
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    const questionTypes = [
      { type: 'matrix', icon: 'fal fa-th', label: 'Matrix (Scale selection)', color: 'from-blue-500 to-blue-600' },
      { type: 'selection', icon: 'fal fa-list-ul', label: 'Selection', color: 'from-green-500 to-green-600' },
      { type: 'multiselection', icon: 'fal fa-check-double', label: 'Multiselection', color: 'from-teal-500 to-teal-600' },
      { type: 'open-ended', icon: 'fal fa-font', label: 'Open ended', color: 'from-orange-400 to-orange-500' },
      { type: 'contact-form', icon: 'fal fa-address-card', label: 'Contact form', color: 'from-amber-500 to-amber-600' },
      { type: 'csat', icon: 'fal fa-star', label: 'CSAT', color: 'from-purple-500 to-purple-600' }
    ];

    questionTypes.forEach(qt => {
      grid.appendChild(this.createQuestionTypeButton(qt.type, qt.icon, qt.label, qt.color));
    });

    return grid;
  }

  createQuestionTypeButton(type, iconClass, label, colorGradient) {
    const btn = document.createElement('button');
    btn.setAttribute('data-type', type);
    btn.className = 'question-type-btn group p-5 bg-white rounded-xl border-2 border-webropol-gray-200 hover:border-webropol-primary-400 hover:bg-webropol-primary-50/30 transition-all duration-300 flex items-center gap-4 hover:shadow-card';

    const iconDiv = document.createElement('div');
    iconDiv.className = `w-12 h-12 rounded-lg bg-gradient-to-br ${colorGradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`;
    iconDiv.innerHTML = `<i class="${iconClass} text-xl text-white"></i>`;
    btn.appendChild(iconDiv);

    const textDiv = document.createElement('div');
    textDiv.className = 'text-left flex-1';
    const labelDiv = document.createElement('div');
    labelDiv.className = 'font-semibold text-webropol-gray-900 mb-0.5';
    labelDiv.textContent = label;
    textDiv.appendChild(labelDiv);
    btn.appendChild(textDiv);

    const infoBtn = document.createElement('button');
    infoBtn.className = 'info-btn w-8 h-8 rounded-full border border-webropol-gray-300 flex items-center justify-center text-webropol-gray-500 hover:bg-webropol-gray-100 transition-colors duration-200';
    infoBtn.innerHTML = '<i class="fal fa-info text-sm"></i>';
    btn.appendChild(infoBtn);

    return btn;
  }

  bindEvents() {
    // Main action buttons
    const actionButtons = this.querySelectorAll('[data-action]');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        this.emit('content-type-selected', { 
          type: action, 
          category: 'main-action' 
        });
      });
    });

    // Question type buttons
    const questionTypeBtns = this.querySelectorAll('.question-type-btn');
    questionTypeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.dataset.type;
        this.emit('content-type-selected', { 
          type: type, 
          category: 'question-type' 
        });
      });
    });

    // Info buttons (prevent propagation)
    const infoBtns = this.querySelectorAll('.info-btn');
    infoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentBtn = btn.closest('[data-type]');
        const type = parentBtn?.dataset.type;
        this.emit('info-requested', { type });
      });
    });
  }
}

customElements.define('webropol-content-selector', ContentSelector);
