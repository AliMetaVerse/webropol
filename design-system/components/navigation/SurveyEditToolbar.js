import { BaseComponent } from '../../utils/base-component.js';
import '../buttons/ButtonHue.js';
import '../feedback/Tooltip.js';

const ICONS_ONLY_STORAGE_KEY = 'webropol_display_icons_only';
const ICONS_ONLY_EVENT = 'webropol-icons-only-changed';

export class SurveyEditToolbar extends BaseComponent {
  static get observedAttributes() {
    return ['items'];
  }

  init() {
    this.iconsOnly = false;

    try {
      this.iconsOnly = localStorage.getItem(ICONS_ONLY_STORAGE_KEY) === 'true';
    } catch (e) {
      this.iconsOnly = false;
    }

    this.handleIconsOnlyChange = (event) => {
      this.iconsOnly = Boolean(event.detail?.enabled);
      this.render();
      this.bindEvents();
    };

    window.addEventListener(ICONS_ONLY_EVENT, this.handleIconsOnlyChange);
  }

  render() {
    const itemsAttr = this.getAttr('items', '');
    const filter = itemsAttr ? itemsAttr.split(',').map(s => s.trim()) : null;

    const tool = (action, label, icon, hue = 'primary') => {
      if (filter && !filter.includes(action)) return '';
      const buttonMarkup = this.iconsOnly
        ? `
          <webropol-button-hue
            orientation="icon"
            theme="icon"
            size="micro"
            fit-content
            hue="${hue}"
            icon="${icon}"
            label="${label}"
          ></webropol-button-hue>
        `
        : `
          <webropol-button-hue
            orientation="vertical"
            theme="outline"
            size="micro"
            fit-content
            hue="${hue}"
            icon="${icon}"
            label="${label}"
          ></webropol-button-hue>
        `;

      return `
        <div class="toolbar-item-wrap" data-action="${action}" aria-label="${label}" title="${label}" role="button" tabindex="0">
          <webropol-tooltip text="${label}" position="top">
            ${buttonMarkup}
          </webropol-tooltip>
        </div>
      `;
    };

    const sep = () => '<div class="toolbar-separator"></div>';

    // Define groups; separators are placed between non-empty groups
    const groups = [
      [tool('add-question', 'Add Question', 'fal fa-plus-circle', 'accent')],
      [tool('etest', 'eTest', 'fal fa-flask'), tool('library', 'Library', 'fal fa-books')],
      [tool('add-page', 'Add Page', 'fal fa-file-plus'), tool('add-phase', 'Add Phase', 'fal fa-layer-plus')],
      [tool('language', 'Language', 'fal fa-globe'), tool('image-gallery', 'Image Gallery', 'fal fa-images'), tool('layout', 'Layout', 'fal fa-palette')],
      [tool('personal-data', 'Personal Data', 'fal fa-user-shield'), tool('settings', 'Settings', 'fal fa-cog'), tool('preview', 'Preview & Test', 'fal fa-eye')],
    ];

    const visibleGroups = groups.map(g => g.filter(Boolean).join('\n        ')).filter(g => g.trim());
    const toolsHTML = visibleGroups.join(`\n        ${sep()}\n        `);

    this.innerHTML = `
      <style>
        .survey-edit-toolbar {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .survey-edit-toolbar .toolbar-item-wrap {
          display: inline-flex;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 12px;
        }

        .survey-edit-toolbar .toolbar-item-wrap:focus-visible {
          outline: 2px solid #06b6d4;
          outline-offset: 2px;
        }

        .toolbar-separator {
          width: 1px;
          height: 40px;
          background: #e2e8f0;
          margin: 0 4px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .survey-edit-toolbar {
            padding: 6px;
            gap: 4px;
            overflow-x: auto;
            max-width: 100%;
            justify-content: flex-start;
          }

          .toolbar-separator {
            display: none;
          }
        }
      </style>
      <div class="survey-edit-toolbar" role="toolbar" aria-label="Survey quick actions">
        ${toolsHTML}
      </div>
    `;
  }

  bindEvents() {
    this.querySelectorAll('[data-action]').forEach(item => {
      const triggerAction = (e) => {
        const action = item.dataset.action;
        
        this.emit(action, { originalEvent: e });
        
        // Handle Add Question - Open the modal
        if (action === 'add-question') {
          const addQuestionModal = document.getElementById('addQuestionModal');
          if (addQuestionModal) {
            console.log('Toolbar: Opening Add Question Modal');
            addQuestionModal.open();
          } else {
            console.error('Add Question Modal not found');
            // Fallback to legacy function if modal not available
            if (typeof window.openAddQuestionModal === 'function') {
              window.openAddQuestionModal();
            }
          }
        }
        
        // Handle Settings
        if (action === 'settings' && typeof window.openSurveySettingsModal === 'function') {
          window.openSurveySettingsModal();
        }

        // Handle Preview & Test (SPA-safe fallback)
        if (action === 'preview' && typeof window.previewSurvey === 'function') {
          window.previewSurvey();
        }
      };

      item.addEventListener('click', triggerAction);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerAction(e);
        }
      });
    });
  }

  cleanup() {
    window.removeEventListener(ICONS_ONLY_EVENT, this.handleIconsOnlyChange);
    super.cleanup();
  }
}

customElements.define('webropol-survey-edit-toolbar', SurveyEditToolbar);
