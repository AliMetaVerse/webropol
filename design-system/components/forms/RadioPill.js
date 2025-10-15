/**
 * Webropol Radio Pill Component
 * A radio input styled inside a pill/badge for clear, large click targets
 *
 * Attributes:
 * - name: radio group name (string)
 * - value: radio value (string)
 * - label: text label (optional, falls back to slotted content)
 * - checked: boolean attribute to set checked state
 * - disabled: boolean attribute to disable
 * - variant: visual style, one of: 'primary' | 'accent' (default: primary)
 * - size: 'sm' | 'md' (default: md)
 *
 * Events:
 * - webropol-change: { checked, value, name }
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolRadioPill extends BaseComponent {
  static get observedAttributes() {
    return ['name', 'value', 'label', 'checked', 'disabled', 'variant', 'size'];
  }

  init() {
    this.inputId = this.generateId('radio');
  }

  render() {
    const name = this.getAttr('name');
    const value = this.getAttr('value');
    const label = this.getAttr('label');
    const checked = this.getBoolAttr('checked');
    const disabled = this.getBoolAttr('disabled');
    const variant = this.getAttr('variant', 'primary');
    const size = this.getAttr('size', 'md');

    const sizeClasses = {
      sm: 'pl-2.5 pr-3 py-1 text-xs',
      md: 'pl-3 pr-4 py-1.5 text-sm'
    };

    // Map variant to tokenized classes
    const variantMap = {
      primary: {
        badge: 'bg-webropol-primary-100 text-webropol-primary-700 group-hover:bg-webropol-primary-200',
        radio: 'text-webropol-primary-500 focus:ring-webropol-primary-500'
      },
      accent: {
        // Accent maps to purple family used in examples
        badge: 'bg-purple-100 text-purple-700 group-hover:bg-purple-200',
        radio: 'text-purple-500 focus:ring-purple-500'
      }
    };
    const v = variantMap[variant] || variantMap.primary;

    const badgeClasses = this.classNames(
      'condition-badge inline-flex items-center gap-2 rounded-full border border-white transition-colors select-none',
      sizeClasses[size] || sizeClasses.md,
      v.badge,
      disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    );

    const radioClasses = this.classNames('w-4 h-4', v.radio);

    // Use slotted content if provided; otherwise label attribute
    const labelContent = label || this.innerHTML || '';

    this.innerHTML = `
      <label for="${this.inputId}" class="group ${disabled ? 'pointer-events-none' : 'cursor-pointer'}">
        <span class="${badgeClasses}">
          <input 
            id="${this.inputId}"
            type="radio" 
            class="${radioClasses}"
            ${name ? `name="${name}"` : ''}
            ${value ? `value="${value}"` : ''}
            ${checked ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}
            aria-checked="${checked ? 'true' : 'false'}"
            aria-disabled="${disabled ? 'true' : 'false'}"
          />
          <span>${labelContent}</span>
        </span>
      </label>
    `;
  }

  bindEvents() {
    const input = this.querySelector('input[type="radio"]');
    if (!input) return;

    this.addListener(input, 'change', (e) => {
      const isChecked = e.target.checked;
      // Reflect to attribute so external frameworks observing attributes can react
      if (isChecked) this.setAttribute('checked', ''); else this.removeAttribute('checked');
      this.emit('webropol-change', { checked: isChecked, value: this.getAttr('value'), name: this.getAttr('name') });
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }
}

customElements.define('webropol-radio-pill', WebropolRadioPill);
