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
      'fas fa-plus-square',
      'Add More Question Type',
      'from-red-50 to-red-100/50',
      'border-red-200 hover:border-red-400',
      'text-red-500'
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
      'fal fa-block-quote',
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
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    const questions = [
      { type: 'matrix', label: 'Matrix (Scale selection)', icon: 'table', color: 'green' },
      { type: 'selection', label: 'Selection', icon: 'list-ul', color: 'blue' },
      { type: 'multiselection', label: 'Multiselection', icon: 'list-check', color: 'blue' },
      { type: 'open-ended', label: 'Open ended', icon: 'font-case', color: 'orange' },
      { type: 'contact', label: 'Contact form', icon: 'address-card', color: 'orange' },
      { type: 'csat', label: 'CSAT', icon: 'smile-heart', color: 'purple' }
    ];

    questions.forEach(q => {
      container.appendChild(this.createQuestionItem(q));
    });

    return container;
  }

  createQuestionItem({ type, label, icon, color }) {
    const btn = document.createElement('div');
    btn.className = `flex items-center justify-between p-2 transition-all border border-transparent cursor-pointer group rounded-lg hover:bg-${color}-50 hover:border-${color}-100`;
    btn.setAttribute('data-type', type);
    btn.classList.add('question-type-btn'); // Marker class for event binding

    const leftContent = document.createElement('div');
    leftContent.className = 'flex items-center gap-2 pointer-events-none';
    
    const iconContainer = document.createElement('div');
    iconContainer.className = `flex items-center justify-center w-8 h-8 text-sm text-${color}-600 bg-${color}-100 rounded-md`;
    iconContainer.innerHTML = `<i class="fal fa-${icon}"></i>`;
    leftContent.appendChild(iconContainer);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'text-sm font-medium text-gray-700 group-hover:text-gray-900';
    labelSpan.textContent = label;
    leftContent.appendChild(labelSpan);

    btn.appendChild(leftContent);

    const infoBtn = document.createElement('button');
    infoBtn.className = 'text-gray-300 hover:text-webropol-primary-500 transition-colors info-btn';
    infoBtn.title = 'Info';
    infoBtn.innerHTML = '<i class="fal fa-info-circle text-sm pointer-events-none"></i>';
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
