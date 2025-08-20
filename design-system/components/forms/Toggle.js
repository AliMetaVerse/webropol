/**
 * Webropol Toggle/Switch Component
 * A modern toggle switch for boolean settings
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolToggle extends BaseComponent {
  static get observedAttributes() {
    return ['label', 'checked', 'disabled', 'size', 'color', 'description'];
  }

  init() {
    this.toggleId = this.generateId('toggle');
  }

  render() {
    const label = this.getAttr('label');
    const checked = this.getBoolAttr('checked');
    const disabled = this.getBoolAttr('disabled');
    const size = this.getAttr('size', 'md');
    const color = this.getAttr('color', 'primary');
    const description = this.getAttr('description');

    // Size classes
    const sizeClasses = {
      sm: {
        switch: 'w-8 h-5',
        thumb: 'w-3 h-3',
        translate: 'translate-x-3'
      },
      md: {
        switch: 'w-11 h-6',
        thumb: 'w-4 h-4',
        translate: 'translate-x-5'
      },
      lg: {
        switch: 'w-14 h-7',
        thumb: 'w-5 h-5',
        translate: 'translate-x-7'
      }
    };

    // Color classes
    const colorClasses = {
      primary: 'bg-webropol-teal-600',
      secondary: 'bg-webropol-gray-600',
      success: 'bg-webropol-green-600',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500'
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;
    const currentColor = colorClasses[color] || colorClasses.primary;

    // Switch classes
    const switchClasses = this.classNames(
      'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-webropol-teal-300 focus-within:ring-offset-2',
      currentSize.switch,
      checked ? currentColor : 'bg-webropol-gray-200',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    );

    // Thumb classes
    const thumbClasses = this.classNames(
      'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
      currentSize.thumb,
      checked ? currentSize.translate : 'translate-x-1'
    );

    this.innerHTML = `
      <div class="toggle-field">
        <div class="flex items-start ${description ? 'space-x-3' : 'space-x-2'}">
          <div class="${switchClasses}" role="switch" aria-checked="${checked}" ${disabled ? 'aria-disabled="true"' : ''}>
            <input
              id="${this.toggleId}"
              type="checkbox"
              class="sr-only"
              ${checked ? 'checked' : ''}
              ${disabled ? 'disabled' : ''}
              aria-labelledby="${this.toggleId}-label"
              ${description ? `aria-describedby="${this.toggleId}-description"` : ''}
            />
            <span class="${thumbClasses}" aria-hidden="true"></span>
          </div>
          
          ${label || description ? `
            <div class="flex-1 min-w-0">
              ${label ? `
                <label id="${this.toggleId}-label" for="${this.toggleId}" class="block text-sm font-medium text-webropol-gray-700 ${disabled ? 'opacity-60' : 'cursor-pointer'}">
                  ${label}
                </label>
              ` : ''}
              ${description ? `
                <p id="${this.toggleId}-description" class="text-sm text-webropol-gray-500 mt-1">
                  ${description}
                </p>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const toggle = this.querySelector('[role="switch"]');
    const input = this.querySelector('input[type="checkbox"]');
    const label = this.querySelector('label');

    if (toggle && input) {
      // Handle click on the switch
      this.addListener(toggle, 'click', () => {
        if (!this.getBoolAttr('disabled')) {
          this.toggleState();
        }
      });

      // Handle click on label
      if (label) {
        this.addListener(label, 'click', () => {
          if (!this.getBoolAttr('disabled')) {
            this.toggleState();
          }
        });
      }

      // Handle keyboard events
      this.addListener(input, 'keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          if (!this.getBoolAttr('disabled')) {
            this.toggleState();
          }
        }
      });

      // Handle direct input changes
      this.addListener(input, 'change', () => {
        const checked = input.checked;
        this.setChecked(checked);
        this.emit('webropol-toggle-change', {
          checked,
          value: checked,
          name: input.name
        });
      });
    }
  }

  toggleState() {
    const checked = !this.getBoolAttr('checked');
    this.setChecked(checked);
    
    this.emit('webropol-toggle-change', {
      checked,
      value: checked,
      name: this.getAttr('name')
    });
  }

  setChecked(checked) {
    const input = this.querySelector('input[type="checkbox"]');
    const toggle = this.querySelector('[role="switch"]');
    
    if (checked) {
      this.setAttribute('checked', '');
      if (input) input.checked = true;
      if (toggle) toggle.setAttribute('aria-checked', 'true');
    } else {
      this.removeAttribute('checked');
      if (input) input.checked = false;
      if (toggle) toggle.setAttribute('aria-checked', 'false');
    }
    
    // Update visual state
    this.updateVisualState();
  }

  updateVisualState() {
    const checked = this.getBoolAttr('checked');
    const disabled = this.getBoolAttr('disabled');
    const color = this.getAttr('color', 'primary');
    const size = this.getAttr('size', 'md');
    
    const toggle = this.querySelector('[role="switch"]');
    const thumb = this.querySelector('span[aria-hidden="true"]');
    
    if (toggle && thumb) {
      // Update switch background
      const colorClasses = {
        primary: 'bg-webropol-teal-600',
        secondary: 'bg-webropol-gray-600',
        success: 'bg-webropol-green-600',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500'
      };
      
      const sizeClasses = {
        sm: { translate: 'translate-x-3' },
        md: { translate: 'translate-x-5' },
        lg: { translate: 'translate-x-7' }
      };
      
      const currentColor = colorClasses[color] || colorClasses.primary;
      const currentSize = sizeClasses[size] || sizeClasses.md;
      
      // Remove old color classes
      Object.values(colorClasses).forEach(cls => {
        toggle.classList.remove(cls);
      });
      
      // Add appropriate background
      if (checked) {
        toggle.classList.add(currentColor);
        toggle.classList.remove('bg-webropol-gray-200');
      } else {
        toggle.classList.add('bg-webropol-gray-200');
        toggle.classList.remove(currentColor);
      }
      
      // Update thumb position
      Object.values(sizeClasses).forEach(size => {
        thumb.classList.remove(size.translate);
      });
      
      if (checked) {
        thumb.classList.add(currentSize.translate);
        thumb.classList.remove('translate-x-1');
      } else {
        thumb.classList.add('translate-x-1');
        thumb.classList.remove(currentSize.translate);
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }

  // Public methods
  isChecked() {
    return this.getBoolAttr('checked');
  }

  check() {
    this.setChecked(true);
  }

  uncheck() {
    this.setChecked(false);
  }

  toggle() {
    this.toggleState();
  }

  enable() {
    this.removeAttribute('disabled');
  }

  disable() {
    this.setAttribute('disabled', '');
  }
}

// Register the component
customElements.define('webropol-toggle', WebropolToggle);
