import { BaseComponent } from '../../utils/base-component.js';

export class WebropolDashboardConfig extends BaseComponent {
  static get observedAttributes() {
    return ['actions', 'size', 'variant'];
  }

  init() {
    this.state = {
      activeAction: null,
      menuOpen: false
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
      { id: 'chart', icon: 'fal fa-chart-column', label: 'Chart' },
      { id: 'settings', icon: 'fal fa-cog', label: 'Settings' },
      { id: 'copy', icon: 'fal fa-copy', label: 'Copy' },
      { id: 'filter', icon: 'fal fa-filter', label: 'Filter' },
      { id: 'group', icon: 'fal fa-users', label: 'Group' },
      { id: 'delete', icon: 'fa-light fa-trash-can', label: 'Delete' }
    ];

    const finalActions = actions.length > 0 ? actions : defaultActions;

    this.innerHTML = `
      <div class="relative">
        <button type="button" 
                class="config-toggle-btn inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-webropol-gray-700 bg-white border border-webropol-gray-300 rounded-lg hover:bg-webropol-gray-50 focus:outline-none focus:ring-2 focus:ring-webropol-primary-500 focus:ring-offset-1 transition-all"
                aria-haspopup="true"
                aria-expanded="false">
          <i class="fa-light fa-square-sliders"></i>
          <span>Config</span>
          <i class="fal fa-chevron-down text-xs"></i>
        </button>
        
        <div class="config-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-webropol-gray-200 py-1 z-50 hidden"
             role="menu"
             aria-orientation="vertical">
          ${finalActions.map((action, index) => {
            const isDanger = action.id === 'delete';
            const needsSeparator = isDanger && index > 0;
            const itemClass = isDanger 
              ? 'config-menu-item w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left'
              : 'config-menu-item w-full flex items-center gap-3 px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 transition-colors text-left';
            
            return `
              ${needsSeparator ? '<div class="border-t border-webropol-gray-200 my-1"></div>' : ''}
              <button type="button" 
                      class="${itemClass}"
                      data-action="${action.id}"
                      role="menuitem">
                <i class="${action.icon} w-4 text-center"></i>
                <span>${action.label || action.tooltip || action.id}</span>
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

    // Toggle menu
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !menu.classList.contains('hidden');
      
      if (isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    });

    // Menu item clicks
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        this.emit('action-click', { action });
        this.closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        this.closeMenu();
        toggleBtn.focus();
      }
    });
  }

  openMenu() {
    const toggleBtn = this.querySelector('.config-toggle-btn');
    const menu = this.querySelector('.config-menu');
    const chevron = toggleBtn.querySelector('.fa-chevron-down');
    
    menu.classList.remove('hidden');
    toggleBtn.setAttribute('aria-expanded', 'true');
    chevron.style.transform = 'rotate(180deg)';
  }

  closeMenu() {
    const toggleBtn = this.querySelector('.config-toggle-btn');
    const menu = this.querySelector('.config-menu');
    const chevron = toggleBtn.querySelector('.fa-chevron-down');
    
    menu.classList.add('hidden');
    toggleBtn.setAttribute('aria-expanded', 'false');
    chevron.style.transform = 'rotate(0deg)';
  }
}

customElements.define('webropol-dashboard-config', WebropolDashboardConfig);
