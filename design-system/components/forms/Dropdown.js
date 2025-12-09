import { BaseComponent } from '../../utils/base-component.js';

export class WebropolDropdown extends BaseComponent {
  static get observedAttributes() {
    return ['label', 'placeholder', 'value', 'options', 'disabled', 'size'];
  }

  init() {
    this.state = {
      isOpen: false,
      selected: null
    };
    this._clickOutsideHandler = this._handleClickOutside.bind(this);
  }

  render() {
    const label = this.getAttr('label');
    const placeholder = this.getAttr('placeholder', 'Select...');
    const rawOptions = this.getAttr('options', '[]');
    const disabled = this.hasAttribute('disabled');
    const size = this.getAttr('size', 'medium');
    
    let options = [];
    try {
      options = JSON.parse(rawOptions);
    } catch (e) {
      console.error('Invalid options JSON:', e);
    }

    // Normalize options to {label, value}
    const normalizedOptions = options.map(opt => {
      if (typeof opt === 'object' && opt !== null) return opt;
      return { label: opt, value: opt };
    });

    const currentValue = this.getAttr('value');
    const selectedOption = normalizedOptions.find(o => o.value === currentValue) || 
                          (currentValue ? { label: currentValue, value: currentValue } : null);
    
    const displayValue = selectedOption ? selectedOption.label : placeholder;
    const isSelected = !!selectedOption;

    // Size variants
    const sizeClasses = {
      medium: {
        trigger: 'px-3 py-2 rounded-lg text-sm',
        menu: 'mt-1 rounded-lg shadow-lg',
        option: 'px-3 py-2 rounded-md text-sm',
        maxHeight: 'max-h-60'
      },
      large: {
        trigger: 'px-4 py-3 rounded-xl text-base',
        menu: 'mt-2 rounded-xl shadow-xl',
        option: 'px-4 py-2.5 rounded-lg text-base',
        maxHeight: 'max-h-80'
      }
    };

    const currentSize = sizeClasses[size] || sizeClasses.medium;

    this.innerHTML = `
      <div class="w-full font-sans">
        ${label ? `<label class="block text-sm text-webropol-gray-600 mb-2 font-medium">${label}</label>` : ''}
        
        <div class="relative dropdown-container" data-value="${currentValue || ''}">
          <button type="button" 
            class="dropdown-trigger w-full ${currentSize.trigger} bg-white border border-webropol-gray-200 text-webropol-gray-700 font-medium flex items-center justify-between hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all group ${this.state.isOpen ? 'border-purple-500 ring-2 ring-purple-500/20' : ''} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}"
            ${disabled ? 'disabled' : ''}>
            <span class="selected-text truncate mr-2">${displayValue}</span>
            <i class="fal fa-chevron-down text-webropol-gray-400 group-hover:text-purple-500 transition-transform duration-200 ${this.state.isOpen ? 'rotate-180' : ''}"></i>
          </button>
          
          <div class="dropdown-menu absolute top-full left-0 ${currentSize.menu} bg-white border border-webropol-gray-100 transition-all duration-200 z-50 overflow-hidden min-w-[180px] ${this.state.isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}">
            <div class="p-1 ${currentSize.maxHeight} overflow-y-auto custom-scrollbar whitespace-nowrap">
              ${normalizedOptions.map(opt => {
                const isOptSelected = opt.value === currentValue;
                
                // Icon mapping for common chart types
                const iconMap = {
                  'bar': 'fa-chart-bar',
                  'pie': 'fa-chart-pie',
                  'line': 'fa-chart-line',
                  'area': 'fa-chart-area',
                  'table': 'fa-table'
                };
                
                const icon = opt.icon || iconMap[opt.value] || 'fa-circle';
                
                return `
                  <button type="button" class="dropdown-option w-full text-left ${currentSize.option} font-medium text-webropol-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center justify-between group ${isOptSelected ? 'bg-purple-50 text-purple-700 selected' : ''}" data-value="${opt.value}" data-label="${opt.label}">
                    <span class="flex items-center gap-2 flex-1">
                      <i class="fal ${icon} w-4 text-center"></i>
                      <span>${opt.label}</span>
                    </span>
                    <i class="fal fa-check text-purple-600 ${isOptSelected ? '' : 'opacity-0'} group-[.selected]:opacity-100 transition-opacity flex-shrink-0 ml-2"></i>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    if (this.hasAttribute('disabled')) return;

    const trigger = this.querySelector('.dropdown-trigger');
    const options = this.querySelectorAll('.dropdown-option');

    if (trigger) {
      trigger.onclick = (e) => {
        e.stopPropagation();
        this.toggle();
      };
    }

    options.forEach(opt => {
      opt.onclick = (e) => {
        e.stopPropagation();
        const value = opt.dataset.value;
        const label = opt.dataset.label;
        this.select(value, label);
      };
    });

    // Re-attach global click listener if open
    if (this.state.isOpen) {
      document.addEventListener('click', this._clickOutsideHandler);
    } else {
      document.removeEventListener('click', this._clickOutsideHandler);
    }
  }

  toggle() {
    this.state.isOpen = !this.state.isOpen;
    this.render();
    this.bindEvents();
  }

  close() {
    if (this.state.isOpen) {
      this.state.isOpen = false;
      this.render();
      this.bindEvents();
    }
  }

  select(value, label) {
    this.setAttribute('value', value);
    this.close();
    this.emit('change', { value, label });
  }

  _handleClickOutside(e) {
    if (!this.contains(e.target)) {
      this.close();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._clickOutsideHandler);
  }
}

customElements.define('webropol-dropdown', WebropolDropdown);
