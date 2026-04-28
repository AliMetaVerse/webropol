import { BaseComponent } from '../../utils/base-component.js';
import '../feedback/Tooltip.js';

const ICONS_ONLY_STORAGE_KEY = 'webropol_display_icons_only';
const ICONS_ONLY_EVENT = 'webropol-icons-only-changed';

/**
 * SurveyActionTabs Component
 * Navigation tabs for survey/SMS actions in SPA mode (hash-based routing)
 * (Edit, Collect Answers, Follow up, Report, AI Text Analysis)
 * 
 * @attr {string} active         - Currently active tab: 'edit' | 'collect' | 'follow' | 'report' | 'aita'
 * @attr {string} context        - Context mode: 'survey' (default) | 'sms'
 * @attr {string} disabled-tabs  - Comma-separated tab IDs to disable, e.g. "collect,follow,report,aita"
 * 
 * @example
 * <webropol-survey-action-tabs active="edit"></webropol-survey-action-tabs>
 * <webropol-survey-action-tabs active="edit" context="sms"></webropol-survey-action-tabs>
 */
export class SurveyActionTabs extends BaseComponent {
  static get observedAttributes() {
    return ['active', 'context', 'disabled-tabs'];
  }

  /** Returns the tab definitions for a given context ('survey' or 'sms'). */
  getTabsForContext(context) {
    const isSms = context === 'sms';
    return [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'fal fa-edit',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-700',
        url: isSms ? '#/sms/edit' : '#/surveys/edit'
      },
      {
        id: 'collect',
        label: 'Collect Answers',
        icon: 'fa-light fa-users',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-700',
        url: isSms ? '#/sms/collect' : '#/surveys/collect'
      },
      {
        id: 'follow',
        label: 'Follow up',
        icon: 'fal fa-eye',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-700',
        url: isSms ? '#/sms/follow' : '#/surveys/follow'
      },
      {
        id: 'report',
        label: 'Report',
        icon: 'fal fa-chart-line',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-700',
        url: isSms ? '#/sms/report' : '#/surveys/report'
      },
      {
        id: 'aita',
        label: 'AI Text Analysis',
        icon: 'fal fa-magnifying-glass-chart',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-700',
        url: isSms ? '#/sms/aita' : '#/surveys/aita'
      }
    ];
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
    const active = this.getAttr('active', 'edit');
    const context = this.getAttr('context', 'survey');
    const tabs = this.getTabsForContext(context);
    const disabledAttr = this.getAttr('disabled-tabs', '');
    const disabledSet = new Set(disabledAttr.split(',').map(s => s.trim()).filter(Boolean));

    const tabsHTML = tabs.map(tab => {
      const isActive = tab.id === active;
      const isDisabled = disabledSet.has(tab.id);
      const tabLabelMarkup = this.iconsOnly ? '' : `<span class="main-primary-label">${tab.label}</span>`;
      const tabIconClass = `${tab.icon} ${tab.iconColor}`;
      const tabRowClass = this.iconsOnly ? 'main-primary-row justify-center' : 'main-primary-row';
      const tabRowStyle = this.iconsOnly ? 'style="gap:0;padding:6px 6px 4px;"' : '';
      const tabIconWrapperClass = this.iconsOnly
        ? `inline-flex w-9 h-9 rounded-lg ${tab.iconBg} items-center justify-center flex-shrink-0`
        : `inline-flex w-9 h-9 rounded-lg ${tab.iconBg} items-center justify-center flex-shrink-0`;

      if (isDisabled) {
        const disabledMarkup = `
          <span
            class="webropol-tab-main-primary adaptive-overflow-tabs__item disabled no-underline"
            role="tab"
            aria-label="${tab.label}"
            aria-disabled="true"
            tabindex="-1"
            style="cursor: not-allowed; pointer-events: none;"
          >
            <div class="${tabRowClass}" ${tabRowStyle}>
              <span class="${this.iconsOnly ? tabIconWrapperClass : 'main-primary-avatar'}">
                <i class="${tabIconClass}"></i>
              </span>
              ${tabLabelMarkup}
            </div>
            <div class="main-primary-indicator"></div>
          </span>
        `;

        return this.iconsOnly
          ? `<webropol-tooltip text="${tab.label}" position="bottom">${disabledMarkup}</webropol-tooltip>`
          : disabledMarkup;
      }

      const tabMarkup = `
        <a
          href="${tab.url}"
          class="webropol-tab-main-primary adaptive-overflow-tabs__item no-underline${isActive ? ' active' : ''}"
          role="tab"
          aria-label="${tab.label}"
          ${isActive ? 'aria-current="page" aria-selected="true"' : ''}
        >
          <div class="${tabRowClass}" ${tabRowStyle}>
            <span class="${tabIconWrapperClass}">
              <i class="${tabIconClass}"></i>
            </span>
            ${tabLabelMarkup}
          </div>
          <div class="main-primary-indicator"></div>
        </a>
      `;

      return this.iconsOnly
        ? `<webropol-tooltip text="${tab.label}" position="bottom">${tabMarkup}</webropol-tooltip>`
        : tabMarkup;
    }).join('');

    this.innerHTML = `
      <style>
        webropol-survey-action-tabs {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }

        webropol-survey-action-tabs .webropol-tabs-main-primary {
          max-width: 100%;
          min-width: 0;
        }

        /* Desktop: no horizontal scroll — overflow goes into the More menu
           via the .adaptive-overflow-tabs controller. Mobile keeps the
           snap-scroll behavior defined in the @media block below. */
        webropol-survey-action-tabs .adaptive-overflow-tabs {
          width: 100%;
        }
        webropol-survey-action-tabs .adaptive-overflow-tabs__more-btn {
          padding: 8px 12px;
          height: 36px;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          webropol-survey-action-tabs {
            overflow: visible;
          }

          webropol-survey-action-tabs .adaptive-overflow-tabs {
            min-width: 0;
            overflow: hidden;
          }

          webropol-survey-action-tabs .webropol-tabs-main-primary {
            width: 100%;
            flex-direction: row !important;
            gap: 0.375rem;
            padding: 0 0.5rem 0.25rem;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x proximity;
            scrollbar-width: none;
          }

          webropol-survey-action-tabs .webropol-tabs-main-primary::-webkit-scrollbar {
            display: none;
          }

          webropol-survey-action-tabs .webropol-tab-main-primary {
            width: auto;
            min-width: 2.75rem;
            max-width: 8.5rem;
            flex: 0 0 auto;
            align-items: center;
            border-radius: 0.875rem;
            scroll-snap-align: start;
          }

          webropol-survey-action-tabs .webropol-tab-main-primary.active {
            min-width: min(8.5rem, calc(100vw - 1rem));
          }

          webropol-survey-action-tabs .main-primary-row {
            width: auto;
            max-width: 100%;
            gap: 0.375rem;
            padding: 0.5rem 0.5rem;
          }

          webropol-survey-action-tabs .main-primary-row span[class*="w-9"] {
            width: 2rem;
            height: 2rem;
          }

          webropol-survey-action-tabs .webropol-tab-main-primary:not(.active) .main-primary-label {
            display: none;
          }

          webropol-survey-action-tabs .main-primary-label {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          webropol-survey-action-tabs .main-primary-indicator {
            height: 2px;
          }
        }
      </style>
      <div class="adaptive-overflow-tabs" role="navigation" aria-label="Survey actions">
        <div class="adaptive-overflow-tabs__track webropol-tabs-main-primary flex">
          ${tabsHTML}
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Navigation handled natively by <a href> elements
  }

  cleanup() {
    window.removeEventListener(ICONS_ONLY_EVENT, this.handleIconsOnlyChange);
    super.cleanup();
  }
}

customElements.define('webropol-survey-action-tabs', SurveyActionTabs);
