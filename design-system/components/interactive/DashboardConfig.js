import { BaseComponent } from '../../utils/base-component.js';

export class WebropolDashboardConfig extends BaseComponent {
  static get observedAttributes() {
    return ['actions', 'size', 'variant'];
  }

  init() {
    this.state = {
      activeAction: null
    };
  }

  render() {
    const rawActions = this.getAttr('actions', '[]');
    const size = this.getAttr('size', 'medium'); // small, medium, large
    const variant = this.getAttr('variant', 'default'); // default, compact
    
    let actions = [];
    try {
      actions = JSON.parse(rawActions);
    } catch (e) {
      console.error('Invalid actions JSON:', e);
    }

    // Default action set
    const defaultActions = [
      { id: 'chart', icon: 'fal fa-chart-column', tooltip: 'Chart' },
      { id: 'settings', icon: 'fal fa-cog', tooltip: 'Settings' },
      { id: 'copy', icon: 'fal fa-copy', tooltip: 'Copy' },
      { id: 'filter', icon: 'fal fa-filter', tooltip: 'Filter' },
      { id: 'group', icon: 'fal fa-users', tooltip: 'Group' },
      { id: 'delete', icon: 'fal fa-trash', tooltip: 'Delete' }
    ];

    const finalActions = actions.length > 0 ? actions : defaultActions;

    // Size variants
    const sizeClasses = {
      small: {
        button: 'p-1.5',
        icon: 'text-base',
        gap: 'gap-0.5'
      },
      medium: {
        button: 'p-2',
        icon: 'text-lg',
        gap: 'gap-1'
      },
      large: {
        button: 'p-3',
        icon: 'text-xl',
        gap: 'gap-2'
      }
    };

    const currentSize = sizeClasses[size] || sizeClasses.medium;

    this.innerHTML = `
      <div class="flex items-center ${currentSize.gap}">
        ${finalActions.map(action => `
          <button type="button" 
                  class="dashboard-action-btn ${currentSize.button} text-webropol-gray-600 hover:bg-webropol-gray-100 rounded-lg transition-colors"
                  data-action="${action.id}"
                  title="${action.tooltip || action.label || ''}">
            <i class="${action.icon} ${currentSize.icon}"></i>
          </button>
        `).join('')}
      </div>
    `;
  }

  bindEvents() {
    const buttons = this.querySelectorAll('.dashboard-action-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.dataset.action;
        this.emit('action-click', { action });
      });
    });
  }
}

customElements.define('webropol-dashboard-config', WebropolDashboardConfig);
