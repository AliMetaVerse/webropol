import { BaseComponent } from '../../utils/base-component.js';

/**
 * SurveyActionTabs Component
 * Navigation tabs for survey actions in SPA mode (hash-based routing)
 * (Edit, Collect Answers, Follow up, Report, AI Text Analysis)
 * 
 * @attr {string} active - Currently active tab: 'edit' | 'collect' | 'follow' | 'report' | 'aita'
 * 
 * @example
 * <webropol-survey-action-tabs active="edit"></webropol-survey-action-tabs>
 */
export class SurveyActionTabs extends BaseComponent {
  static get observedAttributes() {
    return ['active'];
  }

  init() {
    this.tabs = [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'fal fa-edit',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-700',
        url: '#/surveys/edit'
      },
      {
        id: 'collect',
        label: 'Collect Answers',
        icon: 'fa-light fa-users',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-700',
        url: '#/surveys/collect'
      },
      {
        id: 'follow',
        label: 'Follow up',
        icon: 'fal fa-eye',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-700',
        url: '#/surveys/follow'
      },
      {
        id: 'report',
        label: 'Report',
        icon: 'fal fa-chart-line',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-700',
        url: '#/surveys/report'
      },
      {
        id: 'aita',
        label: 'AI Text Analysis',
        icon: 'fal fa-magnifying-glass-chart',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-700',
        url: '#/surveys/aita'
      }
    ];
  }

  render() {
    const active = this.getAttr('active', 'edit');

    const tabsHTML = this.tabs.map(tab => {
      const isActive = tab.id === active;
      const baseClasses = 'px-4 py-3 font-semibold text-webropol-gray-800 border-b-2 border-transparent flex items-center gap-2 rounded-xl transition-all duration-200 ease-out -mb-[1px]';
      const activeClasses = isActive 
        ? 'bg-white shadow-sm relative -mb-[2px]' 
        : 'hover:text-webropol-gray-900 hover:bg-white hover:shadow-md hover:scale-[1.01]';
      
      return `
        <button 
          onclick="window.location.href='${tab.url}'" 
          class="${baseClasses} ${activeClasses}"
          aria-label="${tab.label}"
          ${isActive ? 'aria-current="page"' : ''}
        >
          <span class="inline-flex w-8 h-8 rounded-full ${tab.iconBg} items-center justify-center">
            <i class="${tab.icon} ${tab.iconColor}"></i>
          </span>
          <span>${tab.label}</span>
          ${isActive ? '<div class="absolute bottom-0 left-4 right-4 h-1 bg-webropol-primary-600 rounded-t"></div>' : ''}
        </button>
      `;
    }).join('');

    this.innerHTML = `
      <div class="flex gap-4" role="navigation" aria-label="Survey actions">
        ${tabsHTML}
      </div>
    `;
  }

  bindEvents() {
    // No custom events needed - using onclick navigation
  }
}

customElements.define('webropol-survey-action-tabs', SurveyActionTabs);
