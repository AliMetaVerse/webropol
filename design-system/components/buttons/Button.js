/**
 * Webropol Button Component
 * Unified button component with consistent styling and behavior
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolButton extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'icon', 'icon-position', 'full-width', 'href', 'target', 'type'];
  }

  init() {
    // Set default ARIA role
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    
    // Set tabindex if not present
    if (!this.hasAttribute('tabindex') && !this.getBoolAttr('disabled')) {
      this.setAttribute('tabindex', '0');
    }
  }

  render() {
    const variant = this.getAttr('variant', 'primary');
    const size = this.getAttr('size', 'md');
    const disabled = this.getBoolAttr('disabled');
    const loading = this.getBoolAttr('loading');
    const fullWidth = this.getBoolAttr('full-width');
    const icon = this.getAttr('icon');
    const iconPosition = this.getAttr('icon-position', 'left');
    const href = this.getAttr('href');
    
    // Get text content
    const text = this.textContent.trim();
    
    // Base classes with enhanced styling from components version
    const baseClasses = this.classNames(
      'inline-flex items-center justify-center font-semibold rounded-full font-sans',
      'transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-offset-2',
      'transform hover:scale-105 active:scale-95',
      fullWidth ? 'w-full' : '',
      disabled || loading ? 'cursor-not-allowed opacity-60 transform-none hover:scale-100' : 'cursor-pointer',
      this.getVariantClasses('button', variant),
      this.getSizeClasses('button', size)
    );

    // Create icon HTML if specified
    const iconHtml = icon ? `<i class="fal fa-${icon} ${text ? (iconPosition === 'right' ? 'ml-2' : 'mr-2') : ''}"></i>` : '';
    
    // Create loading spinner
    const loadingHtml = loading ? `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ` : '';

    // Determine content order
    let content;
    if (loading) {
      content = `${loadingHtml} ${loading === true ? 'Loading...' : text}`;
    } else if (icon && iconPosition === 'right') {
      content = `${text} ${iconHtml}`;
    } else {
      content = `${iconHtml} ${text}`.trim();
    }

    // Create the button element
    if (href && !disabled && !loading) {
      // Render as link
      this.innerHTML = `
        <a href="${href}" 
           class="${baseClasses}"
           ${this.getAttr('target') ? `target="${this.getAttr('target')}"` : ''}
           ${this.getAttr('rel') ? `rel="${this.getAttr('rel')}"` : ''}
           aria-disabled="false">
          ${content}
        </a>
      `;
    } else {
      // Render as button
      this.innerHTML = `
        <button type="${this.getAttr('type', 'button')}"
                class="${baseClasses}"
                ${disabled || loading ? 'disabled' : ''}
                aria-disabled="${disabled || loading}"
                aria-busy="${loading}">
          ${content}
        </button>
      `;
    }
  }

  bindEvents() {
    const buttonElement = this.querySelector('button, a');
    if (buttonElement && !this.getBoolAttr('disabled') && !this.getBoolAttr('loading')) {
      this.addListener(buttonElement, 'click', this.handleClick.bind(this));
    }
  }

  handleClick(event) {
    // Emit custom event
    this.emit('webropol-button-click', {
      variant: this.getAttr('variant'),
      size: this.getAttr('size'),
      originalEvent: event
    });

    // Prevent default if disabled or loading
    if (this.getBoolAttr('disabled') || this.getBoolAttr('loading')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  handleKeydown(event) {
    super.handleKeydown(event);
    
    // Handle specific button keyboard interactions
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.getBoolAttr('disabled') && !this.getBoolAttr('loading')) {
        this.handleClick(event);
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
  setLoading(loading = true) {
    if (loading) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  setDisabled(disabled = true) {
    if (disabled) {
      this.setAttribute('disabled', '');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute('disabled');
      this.setAttribute('tabindex', '0');
    }
  }
}

// Register the component
customElements.define('webropol-button', WebropolButton);

