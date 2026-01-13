import { BaseComponent } from '../../utils/base-component.js';

export class WebropolDashboardConfig extends BaseComponent {
  static get observedAttributes() {
    return ['actions', 'size', 'variant'];
  }

  init() {
    this.state = {
      activeAction: null,
      menuOpen: false,
      currentMenu: 'main' // 'main' or action.id for submenu
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.bindEvents();
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
      { id: 'chart', icon: 'fal fa-chart-column', label: 'Chart' },
      { 
        id: 'settings', 
        icon: 'fal fa-cog', 
        label: 'Settings',
        children: [
            { id: 'configure_index', icon: 'fal fa-table-cells', label: 'Define Index Colours and Legend Table' },
            { id: 'toggle_viz', icon: 'fal fa-eye-slash', label: 'Show/hide chart, table, options or scale values' },
            { id: 'fonts', icon: 'fal fa-font', label: 'Fonts' },
            { id: 'combine_rename', icon: 'fal fa-chart-bar', label: 'Combine and rename columns' },
            { id: 'reset', icon: 'fal fa-history', label: 'Reset to default settings' }
        ]
      },
      { id: 'copy', icon: 'fal fa-copy', label: 'Copy' },
      { id: 'filter', icon: 'fal fa-filter', label: 'Filter' },
      { id: 'group', icon: 'fal fa-users', label: 'Group' },
      { id: 'delete', icon: 'fa-light fa-trash-can', label: 'Delete' }
    ];

    const allActions = actions.length > 0 ? actions : defaultActions;

    // Determine current actions to display
    let visibleActions = allActions;
    let menuTitle = null;
    let isSubmenu = false;

    if (this.state.currentMenu !== 'main') {
        const parentAction = allActions.find(a => a.id === this.state.currentMenu);
        if (parentAction && parentAction.children) {
            visibleActions = parentAction.children;
            menuTitle = parentAction.label;
            isSubmenu = true;
        }
    }

    const menuClasses = this.state.menuOpen 
        ? 'absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-webropol-gray-200 py-1 z-50' 
        : 'hidden absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-webropol-gray-200 py-1 z-50';

    this.innerHTML = `
      <div class="relative">
        <button type="button" 
                class="config-toggle-btn inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-webropol-gray-700 bg-white border border-webropol-gray-300 rounded-lg hover:bg-webropol-gray-50 focus:outline-none focus:ring-2 focus:ring-webropol-primary-500 focus:ring-offset-1 transition-all"
                aria-haspopup="true"
                aria-expanded="${this.state.menuOpen}">
          <i class="fa-light fa-square-sliders"></i>
          <span>Config</span>
          <i class="fal fa-chevron-down text-xs transition-transform duration-200 ${this.state.menuOpen ? 'rotate-180' : ''}"></i>
        </button>
        
        <div class="config-menu ${menuClasses}"
             role="menu"
             aria-orientation="vertical">
          
          ${isSubmenu ? `
            <div class="flex items-center gap-2 px-4 py-2 border-b border-webropol-gray-200 mb-1">
                <button type="button" class="back-btn text-webropol-gray-500 hover:text-webropol-gray-700 transition-colors">
                    <i class="fal fa-arrow-left"></i>
                </button>
                <span class="font-semibold text-sm text-webropol-gray-900">${menuTitle}</span>
            </div>
          ` : ''}

          ${visibleActions.map((action, index) => {
            const isDanger = action.id === 'delete';
            const hasChildren = !!action.children;
            const needsSeparator = isDanger && index > 0;
            const itemClass = isDanger 
              ? 'config-menu-item w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left'
              : 'config-menu-item w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 transition-colors text-left';
            
            return `
              ${needsSeparator ? '<div class="border-t border-webropol-gray-200 my-1"></div>' : ''}
              <button type="button" 
                      class="${itemClass}"
                      data-action="${action.id}"
                      data-has-children="${hasChildren}"
                      role="menuitem">
                <div class="flex items-center gap-3">
                    <i class="${action.icon} w-5 text-center"></i>
                    <span>${action.label || action.tooltip || action.id}</span>
                </div>
                ${hasChildren ? '<i class="fal fa-chevron-right text-xs text-webropol-gray-400"></i>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const toggleBtn = this.querySelector('.config-toggle-btn');
    const menu = this.querySelector('.config-menu');
    const menuItems = this.querySelectorAll('.config-menu-item');
    const backBtn = this.querySelector('.back-btn');

    // Toggle menu
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setState({ 
          menuOpen: !this.state.menuOpen,
          currentMenu: 'main' // Reset to main when toggling
      });
    });

    // Menu item clicks
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const actionId = item.dataset.action;
        const hasChildren = item.dataset.hasChildren === 'true';

        if (hasChildren) {
            this.setState({ currentMenu: actionId });
        } else {
            this.emit('action-click', { action: actionId });
            this.setState({ menuOpen: false, currentMenu: 'main' });
        }
      });
    });

    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setState({ currentMenu: 'main' });
        });
    }

    if (!this.documentListenersAttached) {
      this.documentListenersAttached = true;
      
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target) && this.state.menuOpen) {
           this.setState({ menuOpen: false, currentMenu: 'main' });
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.menuOpen) {
          this.setState({ menuOpen: false, currentMenu: 'main' });
          const btn = this.querySelector('.config-toggle-btn');
          if(btn) btn.focus();
        }
      });
    }
  }
}

customElements.define('webropol-dashboard-config', WebropolDashboardConfig);
