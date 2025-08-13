/**
 * Webropol Input Component
 * Unified input field with consistent styling and validation
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolInput extends BaseComponent {
  static get observedAttributes() {
    return ['label', 'type', 'placeholder', 'required', 'disabled', 'error', 'helper-text', 'icon', 'size'];
  }

  init() {
    this.inputId = this.generateId('input');
  }

  render() {
    const label = this.getAttr('label');
    const type = this.getAttr('type', 'text');
    const placeholder = this.getAttr('placeholder');
    const required = this.getBoolAttr('required');
    const disabled = this.getBoolAttr('disabled');
    const error = this.getAttr('error');
    const helperText = this.getAttr('helper-text');
    const icon = this.getAttr('icon');
    const size = this.getAttr('size', 'md');
    const value = this.getAttr('value', '');

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base'
    };

    // Base input classes
    const inputClasses = this.classNames(
      'w-full rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-webropol-teal-300 focus:border-transparent',
      sizeClasses[size] || sizeClasses.md,
      icon ? 'pl-10' : '',
      error ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-webropol-gray-200 bg-white hover:border-webropol-gray-300',
      disabled ? 'bg-webropol-gray-100 cursor-not-allowed opacity-60' : ''
    );

    this.innerHTML = `
      <div class="input-field">
        ${label ? `
          <label for="${this.inputId}" class="block text-sm font-medium text-webropol-gray-700 mb-2">
            ${label}
            ${required ? '<span class="text-red-500 ml-1">*</span>' : ''}
          </label>
        ` : ''}
        
        <div class="relative">
          ${icon ? `
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fal fa-${icon} text-webropol-gray-400"></i>
            </div>
          ` : ''}
          
          <input
            id="${this.inputId}"
            type="${type}"
            class="${inputClasses}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${required ? 'required' : ''}
            ${disabled ? 'disabled' : ''}
            ${value ? `value="${value}"` : ''}
            aria-invalid="${error ? 'true' : 'false'}"
            ${error ? `aria-describedby="${this.inputId}-error"` : ''}
            ${helperText && !error ? `aria-describedby="${this.inputId}-helper"` : ''}
          />
        </div>
        
        ${error ? `
          <p id="${this.inputId}-error" class="mt-2 text-sm text-red-600 flex items-center">
            <i class="fal fa-exclamation-circle mr-1"></i>
            ${error}
          </p>
        ` : ''}
        
        ${helperText && !error ? `
          <p id="${this.inputId}-helper" class="mt-2 text-sm text-webropol-gray-500">
            ${helperText}
          </p>
        ` : ''}
      </div>
    `;
  }

  bindEvents() {
    const input = this.querySelector('input');
    if (input) {
      this.addListener(input, 'input', (event) => {
        this.emit('webropol-input-change', {
          value: event.target.value,
          name: event.target.name,
          type: this.getAttr('type')
        });
      });

      this.addListener(input, 'focus', () => {
        this.emit('webropol-input-focus');
      });

      this.addListener(input, 'blur', (event) => {
        this.emit('webropol-input-blur', {
          value: event.target.value
        });
      });
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }

  // Public methods
  getValue() {
    const input = this.querySelector('input');
    return input ? input.value : '';
  }

  setValue(value) {
    const input = this.querySelector('input');
    if (input) {
      input.value = value;
      this.setAttribute('value', value);
    }
  }

  setError(message) {
    if (message) {
      this.setAttribute('error', message);
    } else {
      this.removeAttribute('error');
    }
  }

  focus() {
    const input = this.querySelector('input');
    if (input) {
      input.focus();
    }
  }

  validate() {
    const input = this.querySelector('input');
    if (input) {
      const isValid = input.checkValidity();
      if (!isValid) {
        this.setError(input.validationMessage);
      } else {
        this.setError('');
      }
      return isValid;
    }
    return true;
  }
}

// Register the component
customElements.define('webropol-input', WebropolInput);
