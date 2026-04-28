import { BaseComponent } from '../../utils/base-component.js';
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

    const tool = (action, label, icon, hue = 'primary', primary = false) => {
      if (filter && !filter.includes(action)) return '';

      const classes = [
        'tb-btn',
        `tb-hue-${hue}`,
        primary ? 'tb-btn-primary' : '',
        this.iconsOnly ? 'tb-btn-icon-only' : ''
      ].filter(Boolean).join(' ');

      const labelHTML = this.iconsOnly ? '' : `<span class="tb-btn-label">${label}</span>`;

      return `
        <webropol-tooltip text="${label}" position="bottom">
          <button
            type="button"
            class="${classes}"
            data-action="${action}"
            aria-label="${label}"
          >
            <span class="tb-btn-icon"><i class="${icon}" aria-hidden="true"></i></span>
            ${labelHTML}
          </button>
        </webropol-tooltip>
      `;
    };

    const sep = () => '<span class="tb-separator" aria-hidden="true"></span>';

    // Define groups; separators are placed between non-empty groups
    const groups = [
      [tool('add-question', 'Add Question', 'fal fa-plus', 'danger', true)],
      [tool('etest', 'eTest', 'fal fa-flask', 'primary'), tool('library', 'Library', 'fal fa-books', 'primary')],
      [tool('add-page', 'Add Page', 'fal fa-file-plus', 'primary'), tool('add-phase', 'Add Phase', 'fal fa-layer-plus', 'primary')],
      [tool('language', 'Language', 'fal fa-globe', 'primary'), tool('image-gallery', 'Image Gallery', 'fal fa-images', 'primary'), tool('layout', 'Layout', 'fal fa-palette', 'primary')],
      [tool('personal-data', 'Personal Data', 'fal fa-user-shield', 'primary'), tool('settings', 'Settings', 'fal fa-cog', 'primary'), tool('preview', 'Preview & Test', 'fal fa-eye', 'primary')],
    ];

    const visibleGroups = groups.map(g => g.filter(Boolean).join('\n        ')).filter(g => g.trim());
    const toolsHTML = visibleGroups.join(`\n        ${sep()}\n        `);

    this.innerHTML = `
      <style>
        :host, webropol-survey-edit-toolbar {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }

        .survey-edit-toolbar {
          --tb-radius: 18px;
          --tb-btn-radius: 12px;
          --tb-transition: 180ms cubic-bezier(.4, 0, .2, 1);

          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px;
          border-radius: var(--tb-radius);
          background:
            linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(248,250,252,.92) 100%);
          border: 1px solid rgba(226, 232, 240, .9);
          box-shadow:
            0 1px 0 rgba(255,255,255,.8) inset,
            0 1px 2px rgba(15, 23, 42, .04),
            0 8px 24px -12px rgba(15, 23, 42, .12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Decorative top sheen */
        .survey-edit-toolbar::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent);
          border-radius: var(--tb-radius) var(--tb-radius) 0 0;
          pointer-events: none;
        }

        /* Tooltip wrapper should not break flex flow */
        .survey-edit-toolbar webropol-tooltip {
          display: inline-flex;
        }

        /* Base button */
        .survey-edit-toolbar .tb-btn {
          --hue-50:  #f0fdff;
          --hue-100: #ecfeff;
          --hue-500: #06b6d4;
          --hue-600: #0891b2;
          --hue-700: #0e7490;

          appearance: none;
          border: 1px solid transparent;
          background: transparent;
          color: #334155;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          min-height: 36px;
          font: 500 12.5px/1 'Inter', system-ui, sans-serif;
          letter-spacing: .01em;
          border-radius: var(--tb-btn-radius);
          white-space: nowrap;
          transition: background var(--tb-transition), color var(--tb-transition),
                      border-color var(--tb-transition), transform var(--tb-transition),
                      box-shadow var(--tb-transition);
        }

        .survey-edit-toolbar .tb-btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: var(--hue-600);
          font-size: 15px;
          transition: transform var(--tb-transition), color var(--tb-transition);
        }

        .survey-edit-toolbar .tb-btn-label {
          font-weight: 500;
          color: #475569;
          transition: color var(--tb-transition);
        }

        /* Hover */
        .survey-edit-toolbar .tb-btn:hover {
          background: var(--hue-50);
          border-color: color-mix(in srgb, var(--hue-500) 18%, transparent);
          color: var(--hue-700);
        }
        .survey-edit-toolbar .tb-btn:hover .tb-btn-label { color: var(--hue-700); }
        .survey-edit-toolbar .tb-btn:hover .tb-btn-icon { transform: translateY(-1px); color: var(--hue-700); }

        /* Active press */
        .survey-edit-toolbar .tb-btn:active {
          transform: translateY(0);
          background: color-mix(in srgb, var(--hue-500) 14%, white);
        }

        /* Focus */
        .survey-edit-toolbar .tb-btn:focus-visible {
          outline: 2px solid var(--hue-500);
          outline-offset: 2px;
        }

        /* Icons-only mode → square pill */
        .survey-edit-toolbar .tb-btn-icon-only {
          padding: 0;
          width: 36px;
          height: 36px;
          justify-content: center;
        }

        /* Primary CTA — Add Question (danger / red) */
        .survey-edit-toolbar .tb-btn-primary {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow:
            0 1px 0 rgba(255,255,255,.25) inset,
            0 6px 14px -6px rgba(220, 38, 38, .55),
            0 2px 4px rgba(220, 38, 38, .25);
        }
        .survey-edit-toolbar .tb-btn-primary .tb-btn-icon,
        .survey-edit-toolbar .tb-btn-primary .tb-btn-label { color: #ffffff; }
        .survey-edit-toolbar .tb-btn-primary:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow:
            0 1px 0 rgba(255,255,255,.3) inset,
            0 10px 20px -8px rgba(185, 28, 28, .6),
            0 3px 6px rgba(185, 28, 28, .3);
        }
        .survey-edit-toolbar .tb-btn-primary:hover .tb-btn-label,
        .survey-edit-toolbar .tb-btn-primary:hover .tb-btn-icon { color: #ffffff; }

        /* Hue palettes */
        .survey-edit-toolbar .tb-hue-primary {
          --hue-50:#f0fdff; --hue-100:#ecfeff; --hue-500:#06b6d4; --hue-600:#0891b2; --hue-700:#0e7490;
        }
        .survey-edit-toolbar .tb-hue-accent {
          --hue-50:#f0fdff; --hue-100:#ecfeff; --hue-500:#06b6d4; --hue-600:#0891b2; --hue-700:#0e7490;
        }
        .survey-edit-toolbar .tb-hue-violet {
          --hue-50:#f5f3ff; --hue-100:#ede9fe; --hue-500:#8b5cf6; --hue-600:#7c3aed; --hue-700:#6d28d9;
        }
        .survey-edit-toolbar .tb-hue-blue {
          --hue-50:#eff6ff; --hue-100:#dbeafe; --hue-500:#3b82f6; --hue-600:#2563eb; --hue-700:#1d4ed8;
        }
        .survey-edit-toolbar .tb-hue-amber {
          --hue-50:#fffbeb; --hue-100:#fef3c7; --hue-500:#f59e0b; --hue-600:#d97706; --hue-700:#b45309;
        }
        .survey-edit-toolbar .tb-hue-green {
          --hue-50:#ecfdf5; --hue-100:#d1fae5; --hue-500:#10b981; --hue-600:#059669; --hue-700:#047857;
        }
        .survey-edit-toolbar .tb-hue-slate {
          --hue-50:#f8fafc; --hue-100:#f1f5f9; --hue-500:#64748b; --hue-600:#475569; --hue-700:#334155;
        }
        .survey-edit-toolbar .tb-hue-danger {
          --hue-50:#fef2f2; --hue-100:#fee2e2; --hue-500:#ef4444; --hue-600:#dc2626; --hue-700:#b91c1c;
        }

        /* Separator */
        .survey-edit-toolbar .tb-separator {
          flex: 0 0 auto;
          width: 1px;
          height: 24px;
          margin: 0 4px;
          background: linear-gradient(180deg, transparent, rgba(148, 163, 184, .35), transparent);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .survey-edit-toolbar {
            width: 100%;
            overflow-x: auto;
            max-width: 100%;
            justify-content: flex-start;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }
          .survey-edit-toolbar .tb-btn-label { display: none; }
          .survey-edit-toolbar .tb-btn { padding: 0; width: 36px; height: 36px; justify-content: center; }
          .survey-edit-toolbar .tb-btn-primary { width: auto; padding: 0 14px; }
          .survey-edit-toolbar .tb-btn-primary .tb-btn-label { display: inline; }
          .survey-edit-toolbar .tb-separator { height: 20px; margin: 0 2px; }
        }

        @media (max-width: 900px) {
          webropol-survey-edit-toolbar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 60;
            background: rgba(255, 255, 255, 0.96);
            box-shadow: 0 -10px 24px -18px rgba(15, 23, 42, 0.35);
            padding-bottom: env(safe-area-inset-bottom, 0);
          }

          .survey-edit-toolbar {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 0;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }

          .survey-edit-toolbar .tb-btn {
            width: 44px;
            height: 44px;
          }

          .survey-edit-toolbar .tb-btn-primary {
            min-width: max-content;
            height: 44px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .survey-edit-toolbar .tb-btn,
          .survey-edit-toolbar .tb-btn-icon,
          .survey-edit-toolbar .tb-btn-label { transition: none; }
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
