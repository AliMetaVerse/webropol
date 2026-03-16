import { BaseComponent } from '../../utils/base-component.js';

export class SurveyEditToolbar extends BaseComponent {
  static get observedAttributes() {
    return ['items'];
  }

  init() {
    // No specific initialization needed
  }

  render() {
    const itemsAttr = this.getAttr('items', '');
    const filter = itemsAttr ? itemsAttr.split(',').map(s => s.trim()) : null;

    const tool = (action, label, icon, isPrimary = false) => {
      if (filter && !filter.includes(action)) return '';
      const cls = isPrimary ? 'tool-item add-question-btn' : 'tool-item';
      return `<button type="button" class="${cls}" aria-label="${label}" title="${label}" data-action="${action}">
          <div class="tool-icon"><i class="${icon}"></i></div>
          <span class="tool-label">${label}</span>
        </button>`;
    };

    const sep = () => '<div class="toolbar-separator"></div>';

    // Define groups; separators are placed between non-empty groups
    const groups = [
      [tool('add-question', 'Add Question', 'fal fa-plus-circle', true)],
      [tool('etest', 'eTest', 'fal fa-flask'), tool('library', 'Library', 'fal fa-books')],
      [tool('add-page', 'Add Page', 'fal fa-file-plus'), tool('add-phase', 'Add Phase', 'fal fa-layer-plus')],
      [tool('language', 'Language', 'fal fa-globe'), tool('image-gallery', 'Image Gallery', 'fal fa-images'), tool('layout', 'Layout', 'fal fa-palette')],
      [tool('personal-data', 'Personal Data', 'fal fa-user-shield'), tool('settings', 'Settings', 'fal fa-cog'), tool('preview', 'Preview & Test', 'fal fa-eye')],
    ];

    const visibleGroups = groups.map(g => g.filter(Boolean).join('\n        ')).filter(g => g.trim());
    const toolsHTML = visibleGroups.join(`\n        ${sep()}\n        `);

    this.innerHTML = `
      <style>
        /* Modern Survey Edit Toolbar Styles */
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
        
        .survey-edit-toolbar .tool-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          min-width: 76px;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        .survey-edit-toolbar .tool-item:hover {
          background: #f0fdff; /* webropol-primary-50 */
          transform: translateY(-1px);
        }
        
        .survey-edit-toolbar .tool-item:active {
          transform: translateY(0);
          background: #ccf7fe; /* webropol-primary-100 */
        }
        
        /* Add Question - Primary Action */
        .survey-edit-toolbar .tool-item.add-question-btn {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); /* webropol-primary-500 to 600 */
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn:hover::before {
          left: 100%;
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn:hover {
          background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn .tool-icon {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(4px);
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn:hover .tool-icon {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn .tool-label {
          color: #ffffff;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn:hover .tool-label {
          color: #ffffff;
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn i {
          color: #ffffff !important;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }
        
        .survey-edit-toolbar .tool-item.add-question-btn:hover i {
          color: #ffffff !important;
        }
        
        /* Icon Container */
        .survey-edit-toolbar .tool-item .tool-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        
        .survey-edit-toolbar .tool-item:hover .tool-icon {
          background: #ffffff;
          border-color: #06b6d4; /* webropol-primary-500 */
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(6, 182, 212, 0.1);
        }
        
        /* Icons */
        .survey-edit-toolbar .tool-item i {
          font-size: 20px;
          color: #64748b; /* webropol-gray-500 */
          transition: color 0.2s ease;
        }
        
        .survey-edit-toolbar .tool-item:hover i {
          color: #0891b2; /* webropol-primary-600 */
        }
        
        /* Labels */
        .survey-edit-toolbar .tool-item .tool-label {
          font-size: 11px;
          font-weight: 500;
          color: #475569; /* webropol-gray-600 */
          text-align: center;
          line-height: 1.2;
          transition: color 0.2s ease;
        }
        
        .survey-edit-toolbar .tool-item:hover .tool-label {
          color: #0e7490; /* webropol-primary-700 */
        }
        
        .survey-edit-toolbar .tool-item:focus-visible {
          outline: 2px solid #06b6d4;
          outline-offset: 2px;
        }
        
        /* Separator */
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
          
          .survey-edit-toolbar .tool-item {
            min-width: 64px;
            padding: 6px 8px;
          }
          
          .survey-edit-toolbar .tool-item .tool-icon {
            width: 36px;
            height: 36px;
          }
          
          .survey-edit-toolbar .tool-item i {
            font-size: 18px;
          }
          
          .survey-edit-toolbar .tool-item .tool-label {
            font-size: 10px;
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
    // Bind click events for all buttons with data-action
    this.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        
        // Emit custom event
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
      });
    });
  }
}

customElements.define('webropol-survey-edit-toolbar', SurveyEditToolbar);
