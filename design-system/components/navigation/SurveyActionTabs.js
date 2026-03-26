import { BaseComponent } from '../../utils/base-component.js';

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
    // Tabs are resolved dynamically per context in render()
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

      if (isDisabled) {
        return `
          <span
            class="webropol-tab-main-primary disabled no-underline"
            role="tab"
            aria-label="${tab.label}"
            aria-disabled="true"
            tabindex="-1"
            style="cursor: not-allowed; pointer-events: none;"
          >
            <div class="main-primary-row">
              <span class="main-primary-avatar">
                <i class="${tab.icon}"></i>
              </span>
              <span class="main-primary-label">${tab.label}</span>
            </div>
            <div class="main-primary-indicator"></div>
          </span>
        `;
      }

      return `
        <a
          href="${tab.url}"
          class="webropol-tab-main-primary no-underline${isActive ? ' active' : ''}"
          role="tab"
          aria-label="${tab.label}"
          ${isActive ? 'aria-current="page" aria-selected="true"' : ''}
        >
          <div class="main-primary-row">
            <span class="inline-flex w-9 h-9 rounded-lg ${tab.iconBg} items-center justify-center flex-shrink-0">
              <i class="${tab.icon} ${tab.iconColor}"></i>
            </span>
            <span class="main-primary-label">${tab.label}</span>
          </div>
          <div class="main-primary-indicator"></div>
        </a>
      `;
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
}

customElements.define('webropol-survey-action-tabs', SurveyActionTabs);
