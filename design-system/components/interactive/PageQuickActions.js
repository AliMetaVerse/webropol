import { BaseComponent } from '../../utils/base-component.js';
import '../buttons/ButtonHue.js';
import '../feedback/Tooltip.js';

const ICONS_ONLY_STORAGE_KEY = 'webropol_display_icons_only';
const ICONS_ONLY_EVENT = 'webropol-icons-only-changed';

/**
 * PageQuickActions Component
 * 
 * Displays centered quick action buttons for page-level operations
 * Used in survey/form editors to provide quick access to common actions
 * 
 * @element webropol-page-quick-actions
 * 
 * @attr {string} actions - JSON array of action objects
 * @attr {boolean} show-label - Show "Quick Actions" label (default: true)
 * 
 * Action object structure:
 * {
 *   id: string,
 *   label: string,
 *   icon: string (FontAwesome class),
 *   color: string (primary|purple|orange|green|red)
 * }
 * 
 * @fires action-click - Fired when an action button is clicked
 * 
 * @example
 * <webropol-page-quick-actions 
 *   actions='[
 *     {"id":"add-question","label":"Add Question","icon":"fal fa-plus-circle","color":"primary"},
 *     {"id":"add-text","label":"Add Text/Media","icon":"fal fa-text","color":"purple"},
 *     {"id":"add-break","label":"Add Page Break","icon":"fal fa-cut","color":"orange"}
 *   ]'
 * ></webropol-page-quick-actions>
 */
export class PageQuickActions extends BaseComponent {
  static get observedAttributes() {
    return ['actions', 'show-label'];
  }

  init() {
    this.actions = this.getActions();
    this.showLabel = this.getBoolAttr('show-label', true);
    this.iconsOnly = false;
    this.isMobile = this.getIsMobile();
    this.quickActionsMenuOpen = false;

    this.handleIconsOnlyChange = (event) => {
      this.iconsOnly = Boolean(event.detail?.enabled);
      this.render();
      this.bindEvents();
    };

    this.handleViewportChange = (event) => {
      const nextIsMobile = Boolean(event.detail?.isMobile);
      if (nextIsMobile === this.isMobile) return;
      this.isMobile = nextIsMobile;
      this.quickActionsMenuOpen = false;
      this.render();
      this.bindEvents();
    };

    this.handleDocumentClick = (event) => {
      if (!this.quickActionsMenuOpen || this.contains(event.target)) return;
      this.quickActionsMenuOpen = false;
      this.render();
      this.bindEvents();
    };

    try {
      this.iconsOnly = localStorage.getItem(ICONS_ONLY_STORAGE_KEY) === 'true';
    } catch (e) {
      this.iconsOnly = false;
    }

    window.addEventListener(ICONS_ONLY_EVENT, this.handleIconsOnlyChange);
    window.addEventListener('viewport:change', this.handleViewportChange);
    document.addEventListener('click', this.handleDocumentClick);
  }

  getIsMobile() {
    if (window.WebropolViewport?.state) return Boolean(window.WebropolViewport.state.isMobile);
    return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 767px)').matches;
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  getActions() {
    const actionsAttr = this.getAttr('actions');
    if (!actionsAttr) {
      // Default actions
      return [
        { id: 'add-question', label: 'Add Question', icon: 'fal fa-plus-circle', color: 'primary' },
        { id: 'add-text', label: 'Add Text/Media', icon: 'fal fa-text', color: 'purple' },
        { id: 'add-break', label: 'Add Page Break', icon: 'fal fa-cut', color: 'orange' }
      ];
    }

    try {
      return JSON.parse(actionsAttr);
    } catch (e) {
      console.error('Invalid actions JSON:', e);
      return [];
    }
  }

  getHue(color) {
    const hueMap = {
      primary: 'primary',
      purple: 'royal-violet',
      orange: 'accent',
      green: 'success',
      red: 'error'
    };

    return hueMap[color] || 'primary';
  }

  getMobileActionsMarkup(actions) {
    if (!actions.length) return '';

    const visibleAction = actions.find(action => action.id === 'add-question') || actions[0];
    const hiddenActions = actions.filter(action => action !== visibleAction);
    const makeActionButton = (action, extraClass = '') => {
      const hue = this.getHue(action.color);
      const label = this.escapeHtml(action.label);
      const icon = this.escapeHtml(action.icon);
      return `
        <button
          type="button"
          class="page-quick-action-mobile-btn page-quick-action-mobile-btn--${hue} page-quick-action-mobile-btn--${this.escapeHtml(action.color)} ${extraClass}"
          data-action-id="${this.escapeHtml(action.id)}"
          aria-label="${label}"
        >
          <i class="${icon}" aria-hidden="true"></i>
          <span>${label}</span>
        </button>
      `;
    };

    const hiddenMarkup = hiddenActions.map(action => makeActionButton(action, 'page-quick-action-mobile-btn--menu-item')).join('');

    return `
      <div class="page-quick-actions-primary">
        ${makeActionButton(visibleAction, 'page-quick-action-mobile-btn--primary-action')}
      </div>
      ${hiddenActions.length ? `
        <div class="page-quick-actions-more-wrap">
          <button
            type="button"
            class="page-quick-actions-more-btn${this.quickActionsMenuOpen ? ' is-open' : ''}"
            aria-label="More quick actions"
            aria-haspopup="menu"
            aria-expanded="${this.quickActionsMenuOpen ? 'true' : 'false'}"
          >
            <i class="fal fa-ellipsis-h" aria-hidden="true"></i>
          </button>
          <div class="page-quick-actions-more-menu" role="menu" ${this.quickActionsMenuOpen ? '' : 'hidden'}>
            ${hiddenMarkup}
          </div>
        </div>
      ` : ''}
    `;
  }

  render() {
    const actions = this.getActions();
    
    this.innerHTML = `
      <style>
        webropol-page-quick-actions {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }

        .page-quick-actions-shell {
          width: 100%;
          min-width: 0;
        }

        .page-quick-actions-strip {
          max-width: 100%;
          min-width: 0;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .page-quick-actions-panel {
            padding: 0.5rem 1rem;
            border-radius: 1.25rem;
          }
          .page-quick-actions-strip {
            gap: 0.5rem;
          }
        }

        @media (max-width: 767px) {
          .page-quick-actions-shell {
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          .page-quick-actions-panel {
            width: 100%;
            border-radius: 1rem;
            padding: 0.5rem;
            border: 1px solid rgba(226, 232, 240, 0.9);
            background: rgba(255, 255, 255, 0.96);
          }

          .page-quick-actions-strip {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: stretch;
            overflow: visible;
            flex-wrap: unset;
          }

          .page-quick-actions-strip > * {
            min-width: 0;
          }

          .page-quick-actions-strip > span,
          .page-quick-actions-strip > .h-4.w-px {
            display: none;
          }

          .page-quick-actions-primary {
            flex: 1 1 auto;
            min-width: 0;
          }

          .page-quick-actions-more-wrap {
            flex: 0 0 auto;
            position: relative;
          }

          .page-quick-actions-more-btn {
            appearance: none;
            width: 48px;
            height: 48px;
            border: 1px solid #cbd5e1;
            border-radius: 0.75rem;
            background: #ffffff;
            color: #475569;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .page-quick-actions-more-btn.is-open {
            color: #0e7490;
            border-color: #a5f3fc;
            background: #ecfeff;
          }

          .page-quick-actions-more-menu {
            position: absolute;
            right: 0;
            bottom: calc(100% + 0.5rem);
            min-width: min(16rem, calc(100vw - 2rem));
            display: grid;
            gap: 0.5rem;
            padding: 0.5rem;
            border: 1px solid rgba(226, 232, 240, 0.95);
            border-radius: 1rem;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 16px 36px -20px rgba(15, 23, 42, 0.35);
            z-index: 40;
          }

          .page-quick-actions-more-menu[hidden] {
            display: none;
          }

          .page-quick-action-mobile-btn {
            appearance: none;
            width: 100%;
            min-width: 0;
            min-height: 48px;
            border: 1px solid var(--quick-border, #bae6fd);
            border-radius: 0.75rem;
            background: var(--quick-bg, #f0fdff);
            color: var(--quick-text, #0e7490);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.375rem;
            padding: 0.45rem 0.375rem;
            font: 600 0.72rem/1.15 Inter, system-ui, sans-serif;
            text-align: center;
            cursor: pointer;
          }

          .page-quick-action-mobile-btn i {
            flex: 0 0 auto;
            font-size: 0.95rem;
          }

          .page-quick-action-mobile-btn span:last-child {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .page-quick-action-mobile-btn--primary-action {
            min-height: 50px;
            font-size: 0.8rem;
          }

          .page-quick-action-mobile-btn--menu-item {
            justify-content: flex-start;
            min-height: 44px;
            padding-left: 0.625rem;
            padding-right: 0.625rem;
          }

          .page-quick-action-mobile-btn--error,
          .page-quick-action-mobile-btn--red {
            --quick-bg: #fff1f2;
            --quick-border: #fecdd3;
            --quick-text: #be123c;
          }

          .page-quick-action-mobile-btn--royal-violet,
          .page-quick-action-mobile-btn--purple {
            --quick-bg: #f5f3ff;
            --quick-border: #ddd6fe;
            --quick-text: #6d28d9;
          }

          .page-quick-action-mobile-btn--accent,
          .page-quick-action-mobile-btn--orange {
            --quick-bg: #fff7ed;
            --quick-border: #fed7aa;
            --quick-text: #c2410c;
          }

          .page-quick-action-mobile-btn--success,
          .page-quick-action-mobile-btn--green {
            --quick-bg: #ecfdf5;
            --quick-border: #bbf7d0;
            --quick-text: #047857;
          }
        }
      </style>
      <div class="page-quick-actions-shell mt-8 mb-8 relative">
        <!-- Dashed separator line -->
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-dashed border-webropol-gray-300"></div>
        </div>
        
        <!-- Centered action buttons -->
        <div class="relative flex justify-center">
          <div class="page-quick-actions-panel bg-webropol-gray-50 px-6 py-3 rounded-full">
            <div class="page-quick-actions-strip flex items-center gap-3 flex-wrap justify-center">
              ${this.showLabel ? `
                <span class="text-xs font-medium text-webropol-gray-500 uppercase tracking-wider shrink-0">
                  Quick Actions
                </span>
                <div class="h-4 w-px bg-webropol-gray-300 shrink-0"></div>
              ` : ''}
              
              ${this.isMobile ? this.getMobileActionsMarkup(actions) : actions.map(action => {
                const hue = this.getHue(action.color);
                const buttonMarkup = this.iconsOnly
                  ? `
                    <webropol-button-hue
                      data-action-id="${action.id}"
                      orientation="icon"
                      size="micro"
                      fit-content
                      hue="${hue}"
                      icon="${action.icon}"
                      label="${action.label}"
                    ></webropol-button-hue>
                  `
                  : `
                    <webropol-button-hue
                      data-action-id="${action.id}"
                      orientation="horizontal"
                      theme="outline"
                      size="micro"
                      fit-content
                      hue="${hue}"
                      icon="${action.icon}"
                      label="${action.label}"
                    ></webropol-button-hue>
                  `;
                return `
                    <div class="inline-flex shrink-0">
                      <webropol-tooltip text="${action.label}" position="top">
                        ${buttonMarkup}
                      </webropol-tooltip>
                    </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const moreButton = this.querySelector('.page-quick-actions-more-btn');
    if (moreButton) {
      moreButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.quickActionsMenuOpen = !this.quickActionsMenuOpen;
        this.render();
        this.bindEvents();
      });
    }

    const buttons = this.querySelectorAll('[data-action-id]');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const actionId = button.getAttribute('data-action-id');
        const action = this.getActions().find(a => a.id === actionId);
        this.quickActionsMenuOpen = false;
        
        this.emit('action-click', { 
          actionId, 
          action,
          originalEvent: e 
        });

        if (this.isMobile) {
          this.render();
          this.bindEvents();
        }
      });
    });
  }

  cleanup() {
    window.removeEventListener(ICONS_ONLY_EVENT, this.handleIconsOnlyChange);
    window.removeEventListener('viewport:change', this.handleViewportChange);
    document.removeEventListener('click', this.handleDocumentClick);
    super.cleanup();
  }
}

customElements.define('webropol-page-quick-actions', PageQuickActions);
