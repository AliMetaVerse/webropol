import { BaseComponent } from '../../utils/base-component.js';

/**
 * Webropol Context Menu Component
 * A vertical menu with icon-labeled actions, supporting hover states and danger variants
 * 
 * @example
 * <webropol-context-menu
 *   items='[
 *     {"id": "rename", "label": "Rename", "icon": "fal fa-pen"},
 *     {"id": "copy", "label": "Copy", "icon": "fal fa-copy"},
 *     {"id": "move", "label": "Move to a folder", "icon": "fal fa-folder-arrow-up"},
 *     {"id": "rights", "label": "Rights", "icon": "fal fa-key"},
 *     {"id": "properties", "label": "Properties, rights and log", "icon": "fal fa-list-ul"},
 *     {"id": "delete", "label": "Delete", "icon": "fa-light fa-trash-can", "variant": "danger"}
 *   ]'
 *   width="auto"
 *   rounded="md"
 * ></webropol-context-menu>
 * 
 * @fires item-click - Emitted when a menu item is clicked, detail: { id, label, data }
 */
export class WebropolContextMenu extends BaseComponent {
  static get observedAttributes() {
    return ['items', 'width', 'rounded', 'disabled'];
  }

  init() {
    this.menuItems = [];
    try {
      const itemsAttr = this.getAttr('items', '[]');
      this.menuItems = JSON.parse(itemsAttr);
    } catch (e) {
      console.error('WebropolContextMenu: Invalid items JSON', e);
    }
  }

  render() {
    const width = this.getAttr('width', 'auto'); // auto, sm (200px), md (250px), lg (300px)
    const rounded = this.getAttr('rounded', 'md'); // none, sm, md, lg, xl
    const disabled = this.getBoolAttr('disabled', false);

    const widthClasses = this.getWidthClasses(width);
    const roundnessClasses = this.getRoundnessClasses(rounded);

    this.innerHTML = `
      <div 
        class="bg-white ${widthClasses} ${roundnessClasses} shadow-lg border border-webropol-gray-200 overflow-hidden ${disabled ? 'opacity-50 pointer-events-none' : ''}"
        role="menu"
        aria-label="Context menu"
      >
        ${this.menuItems.map((item, index) => this.renderMenuItem(item, index)).join('')}
      </div>
    `;
  }

  renderMenuItem(item, index) {
    const variant = item.variant || 'default';
    const disabled = item.disabled || false;
    const icon = item.icon || '';
    const label = item.label || '';
    const id = item.id || `item-${index}`;

    const variantClasses = this.getMenuItemVariantClasses(variant);
    const hoverClasses = disabled ? '' : this.getMenuItemHoverClasses(variant);
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    // Only show separator before danger variant items
    const showSeparator = variant === 'danger' && index > 0;

    return `
      <div 
        class="flex items-center gap-3 px-4 py-3 transition-all duration-200 ${variantClasses} ${hoverClasses} ${disabledClasses} ${showSeparator ? 'border-t border-webropol-gray-200' : ''}"
        role="menuitem"
        data-item-id="${id}"
        ${disabled ? 'aria-disabled="true"' : 'tabindex="0"'}
      >
        ${icon ? `<i class="${icon} text-lg ${variant === 'danger' ? 'text-red-500' : 'text-webropol-gray-600'}"></i>` : ''}
        <span class="flex-1 text-sm font-medium ${variant === 'danger' ? 'text-red-600' : 'text-webropol-gray-900'}">${label}</span>
      </div>
    `;
  }

  getWidthClasses(width) {
    const widthMap = {
      'auto': 'w-auto min-w-[200px]',
      'sm': 'w-[200px]',
      'md': 'w-[250px]',
      'lg': 'w-[300px]',
      'full': 'w-full'
    };
    return widthMap[width] || widthMap['auto'];
  }

  getMenuItemVariantClasses(variant) {
    const variants = {
      default: 'bg-white',
      danger: 'bg-white'
    };
    return variants[variant] || variants.default;
  }

  getMenuItemHoverClasses(variant) {
    const hoverMap = {
      default: 'hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-100',
      danger: 'hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100'
    };
    return hoverMap[variant] || hoverMap.default;
  }

  bindEvents() {
    // Click handlers for menu items
    this.querySelectorAll('[data-item-id]').forEach(itemEl => {
      const itemId = itemEl.getAttribute('data-item-id');
      const isDisabled = itemEl.getAttribute('aria-disabled') === 'true';

      if (!isDisabled) {
        itemEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleItemClick(itemId);
        });

        // Keyboard support
        itemEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            this.handleItemClick(itemId);
          }
        });
      }
    });
  }

  handleItemClick(itemId) {
    const item = this.menuItems.find(i => i.id === itemId);
    if (!item || item.disabled) return;

    this.emit('item-click', {
      id: item.id,
      label: item.label,
      data: item.data || {}
    });

    // Execute callback if provided
    if (typeof item.onClick === 'function') {
      item.onClick(item);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      if (name === 'items') {
        this.init();
      }
      this.render();
      this.bindEvents();
    }
  }
}

customElements.define('webropol-context-menu', WebropolContextMenu);
