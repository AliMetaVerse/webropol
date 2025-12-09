import { BaseComponent } from '../../utils/base-component.js';

export class WebropolFloatingToolbar extends BaseComponent {
  static get observedAttributes() {
    return ['position', 'tools', 'variant', 'size'];
  }

  init() {
    this.state = {
      activeDropdown: null
    };
  }

  render() {
    const position = this.getAttr('position', 'top-center'); // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
    const variant = this.getAttr('variant', 'default'); // default, compact, rounded
    const size = this.getAttr('size', 'medium'); // small, medium, large
    const rawTools = this.getAttr('tools', '[]');
    
    let tools = [];
    try {
      tools = JSON.parse(rawTools);
    } catch (e) {
      console.error('Invalid tools JSON:', e);
    }

    // Position classes
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4'
    };

    // Size classes
    const sizeClasses = {
      small: {
        button: 'w-8 h-8 text-sm',
        gap: 'gap-1',
        padding: 'p-1.5'
      },
      medium: {
        button: 'w-10 h-10 text-base',
        gap: 'gap-2',
        padding: 'p-2'
      },
      large: {
        button: 'w-12 h-12 text-lg',
        gap: 'gap-2.5',
        padding: 'p-2.5'
      }
    };

    // Variant classes
    const variantClasses = {
      default: 'rounded-lg shadow-medium border border-webropol-gray-200',
      compact: 'rounded-md shadow-card border border-webropol-gray-200',
      rounded: 'rounded-full shadow-soft border border-webropol-gray-100'
    };

    const currentSize = sizeClasses[size] || sizeClasses.medium;
    const currentVariant = variantClasses[variant] || variantClasses.default;
    const currentPosition = positionClasses[position] || positionClasses['top-center'];

    this.innerHTML = `
      <div class="fixed ${currentPosition} z-50 floating-toolbar">
        <div class="flex items-center ${currentSize.gap} ${currentSize.padding} bg-white backdrop-blur-sm ${currentVariant}">
          ${tools.map((tool, index) => this._renderTool(tool, index, currentSize)).join('')}
        </div>
      </div>
    `;
  }

  _renderTool(tool, index, sizeClasses) {
    if (tool.type === 'dropdown') {
      return `
        <div class="relative dropdown-tool" data-index="${index}">
          <button type="button" 
                  class="toolbar-dropdown-trigger px-4 py-2 flex items-center gap-2 rounded-lg bg-webropol-gray-50 text-webropol-gray-700 hover:bg-webropol-primary-50 hover:text-webropol-primary-700 transition-colors border border-webropol-gray-200 font-medium whitespace-nowrap"
                  data-index="${index}"
                  title="${tool.label || 'Options'}">
            <span class="text-sm">${tool.label || ''}</span>
            <i class="fal fa-chevron-down text-xs"></i>
          </button>
          
          <div class="dropdown-menu absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-webropol-gray-100 overflow-hidden transition-all duration-200 opacity-0 invisible -translate-y-2 min-w-max" data-index="${index}">
            <div class="py-1">
              ${(tool.options || []).map(opt => `
                <button type="button" 
                        class="dropdown-option w-full text-left px-4 py-2 text-sm font-medium text-webropol-gray-700 hover:bg-webropol-primary-50 hover:text-webropol-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        data-action="${opt.action || ''}"
                        data-value="${opt.value || ''}">
                  ${opt.icon ? `<i class="${opt.icon} w-4 text-center flex-shrink-0"></i>` : ''}
                  <span>${opt.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (tool.type === 'separator') {
      return `<div class="w-px h-6 bg-webropol-gray-200"></div>`;
    } else {
      // Regular button
      return `
        <button type="button" 
                class="toolbar-button w-10 h-10 flex items-center justify-center rounded-lg ${tool.variant === 'primary' ? 'bg-webropol-primary-500 text-white hover:bg-webropol-primary-600' : tool.variant === 'danger' ? 'bg-webropol-gray-50 text-red-500 hover:bg-red-50' : tool.variant === 'success' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-webropol-gray-50 text-webropol-gray-600 hover:bg-webropol-gray-100'} transition-colors border border-webropol-gray-200"
                data-action="${tool.action || ''}"
                title="${tool.tooltip || tool.label || ''}">
          ${tool.icon ? `<i class="${tool.icon}"></i>` : ''}
          ${tool.label && !tool.icon ? `<span class="text-sm font-medium">${tool.label}</span>` : ''}
        </button>
      `;
    }
  }

  bindEvents() {
    // Dropdown toggles
    const dropdownTriggers = this.querySelectorAll('.toolbar-dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = trigger.dataset.index;
        this.toggleDropdown(index);
      });
    });

    // Dropdown options
    const dropdownOptions = this.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = option.dataset.action;
        const value = option.dataset.value;
        this.emit('option-select', { action, value });
        this.closeAllDropdowns();
      });
    });

    // Regular buttons
    const buttons = this.querySelectorAll('.toolbar-button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.dataset.action;
        this.emit('tool-action', { action });
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeAllDropdowns();
      }
    });
  }

  toggleDropdown(index) {
    const menu = this.querySelector(`.dropdown-menu[data-index="${index}"]`);
    if (!menu) return;

    const isOpen = menu.classList.contains('opacity-100');
    
    // Close all dropdowns first
    this.closeAllDropdowns();

    if (!isOpen) {
      menu.classList.remove('opacity-0', 'invisible', '-translate-y-2');
      menu.classList.add('opacity-100', 'visible', 'translate-y-0');
      this.state.activeDropdown = index;
    }
  }

  closeAllDropdowns() {
    const menus = this.querySelectorAll('.dropdown-menu');
    menus.forEach(menu => {
      menu.classList.add('opacity-0', 'invisible', '-translate-y-2');
      menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
    });
    this.state.activeDropdown = null;
  }
}

customElements.define('webropol-floating-toolbar', WebropolFloatingToolbar);
