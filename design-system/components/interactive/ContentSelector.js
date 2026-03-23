import { BaseComponent } from '../../utils/base-component.js';
import '../buttons/ButtonHue.js';

// Stretch button-hue elements to fill their grid cells
(function injectContentSelectorHueStyles() {
  const STYLE_ID = 'webropol-content-selector-hue-styles';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .wcs-main-actions webropol-button-hue,
    .wcs-question-types webropol-button-hue {
      display: flex !important;
      width: 100%;
    }
    .wcs-main-actions webropol-button-hue .wbh-btn,
    .wcs-question-types webropol-button-hue .wbh-btn {
      width: 100% !important;
      min-width: 0 !important;
    }
  `;
  (document.head || document.body).appendChild(style);
}());

/**
 * ContentSelector Component
 * Displays a selection interface for adding different types of content to surveys.
 * Uses webropol-button-hue components:
 *   - Vertical / Filled  → main action cards (Add Question, Import Library, Free Text)
 *   - Horizontal / Outline → question type list (Matrix, Selection, …)
 *
 * @element webropol-content-selector
 * @attr {string}  title              - Selector title (default: "Select to add content")
 * @attr {boolean} show-main-actions  - Show the three main action cards
 * @attr {boolean} show-question-types - Show question type options
 * @fires content-type-selected       - detail: { type: string, category: string }
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

    this.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'w-full bg-white rounded-3xl shadow-soft border border-webropol-gray-100 p-8';

    const titleEl = document.createElement('h3');
    titleEl.className = 'text-sm font-semibold text-webropol-gray-500 text-center mb-8 uppercase tracking-widest';
    titleEl.textContent = title;
    container.appendChild(titleEl);

    if (showMainActions) {
      container.appendChild(this.createMainActions());
    }

    if (showQuestionTypes) {
      if (showMainActions) {
        const separator = document.createElement('div');
        separator.className = 'h-px w-full max-w-2xl mx-auto bg-gradient-to-r from-transparent via-webropol-gray-200 to-transparent my-8';
        container.appendChild(separator);
      }
      container.appendChild(this.createQuestionTypes());
    }

    this.appendChild(container);
  }

  // ── Main actions — Vertical / Filled ─────────────────────────────────────
  createMainActions() {
    const grid = document.createElement('div');
    grid.className = 'wcs-main-actions grid grid-cols-1 md:grid-cols-3 gap-6 mb-8';

    const actions = [
      { action: 'add-question',    hue: 'error',           icon: 'fal fa-plus',        label: 'Add More Question Type' },
      { action: 'import-library',  hue: 'royal-turquoise', icon: 'fal fa-books',        label: 'Import from Library'    },
      { action: 'free-text-media', hue: 'royal-violet',    icon: 'fal fa-block-quote',  label: 'Free Text & Media'      },
    ];

    actions.forEach(({ action, hue, icon, label }) => {
      const btn = document.createElement('webropol-button-hue');
      btn.setAttribute('hue', hue);
      btn.setAttribute('orientation', 'vertical');
      btn.setAttribute('theme', 'filled');
      btn.setAttribute('icon', icon);
      btn.setAttribute('label', label);
      btn.setAttribute('data-action', action);
      grid.appendChild(btn);
    });

    return grid;
  }

  // ── Question types — Horizontal / Outline ────────────────────────────────
  createQuestionTypes() {
    const container = document.createElement('div');
    container.className = 'wcs-question-types grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    const questions = [
      { type: 'matrix',         label: 'Matrix (Scale selection)', icon: 'fal fa-table-cells',      hue: 'success'        },
      { type: 'selection',      label: 'Selection',                icon: 'fal fa-list-ul',            hue: 'royal-blue'     },
      { type: 'multiselection', label: 'Multiselection',           icon: 'fal fa-list-check',         hue: 'royal-blue'     },
      { type: 'open-ended',     label: 'Open ended',               icon: 'fal fa-font-case',          hue: 'accent'         },
      { type: 'contact',        label: 'Contact form',             icon: 'fal fa-address-card',       hue: 'accent'         },
      { type: 'csat',           label: 'CSAT',                     icon: 'fal fa-face-smile-hearts',  hue: 'royal-violet'   },
    ];

    questions.forEach(({ type, label, icon, hue }) => {
      const btn = document.createElement('webropol-button-hue');
      btn.setAttribute('hue', hue);
      btn.setAttribute('orientation', 'horizontal');
      btn.setAttribute('theme', 'outline');
      btn.setAttribute('size', 'sm');
      btn.setAttribute('icon', icon);
      btn.setAttribute('label', label);
      btn.setAttribute('data-type', type);
      container.appendChild(btn);
    });

    return container;
  }

  // ── Events ───────────────────────────────────────────────────────────────
  bindEvents() {
    // webropol-button-hue-click bubbles from the component with e.target = the element
    this.addEventListener('webropol-button-hue-click', (e) => {
      const target = e.target;
      const action = target.getAttribute('data-action');
      const type   = target.getAttribute('data-type');

      e.stopPropagation();

      if (action) {
        this.emit('content-type-selected', { type: action, category: 'main-action' });
      } else if (type) {
        this.emit('content-type-selected', { type, category: 'question-type' });
      }
    });
  }
}

customElements.define('webropol-content-selector', ContentSelector);
