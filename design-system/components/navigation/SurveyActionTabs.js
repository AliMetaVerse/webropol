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
      const tabIconWrapperClass = this.iconsOnly
        ? `inline-flex w-9 h-9 rounded-lg ${tab.iconBg} items-center justify-center flex-shrink-0`
        : `inline-flex w-9 h-9 rounded-lg ${tab.iconBg} items-center justify-center flex-shrink-0`;

      if (isDisabled) {
        const disabledMarkup = `
          <span
            class="webropol-tab-main-primary disabled no-underline${this.iconsOnly ? ' !px-3' : ''}"
            role="tab"
            aria-label="${tab.label}"
            aria-disabled="true"
            tabindex="-1"
            style="cursor: not-allowed; pointer-events: none;"
            title="${tab.label}"
          >
            <div class="main-primary-row${this.iconsOnly ? ' justify-center' : ''}">
              <span class="${this.iconsOnly ? tabIconWrapperClass : 'main-primary-avatar'}">
                <i class="${tabIconClass}"></i>
              </span>
              ${tabLabelMarkup}
            </div>
            <div class="main-primary-indicator"></div>
          </span>
        `;

        return this.iconsOnly
          ? `<webropol-tooltip text="${tab.label}" position="right">${disabledMarkup}</webropol-tooltip>`
          : disabledMarkup;
      }

      const tabMarkup = `
        <a
          href="${tab.url}"
          class="webropol-tab-main-primary no-underline${isActive ? ' active' : ''}${this.iconsOnly ? ' !px-3' : ''}"
          role="tab"
          aria-label="${tab.label}"
          title="${tab.label}"
          ${isActive ? 'aria-current="page" aria-selected="true"' : ''}
        >
          <div class="main-primary-row${this.iconsOnly ? ' justify-center' : ''}">
            <span class="${tabIconWrapperClass}">
              <i class="${tabIconClass}"></i>
            </span>
            ${tabLabelMarkup}
          </div>
          <div class="main-primary-indicator"></div>
        </a>
      `;

      return this.iconsOnly
        ? `<webropol-tooltip text="${tab.label}" position="right">${tabMarkup}</webropol-tooltip>`
        : tabMarkup;
    }).join('');

    this.innerHTML = `
      <div class="webropol-tabs-main-primary flex" role="navigation" aria-label="Survey actions">
        ${tabsHTML}
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
