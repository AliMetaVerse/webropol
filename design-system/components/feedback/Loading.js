/**
 * Webropol Loading Component
 * Loading indicators and spinners
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolLoading extends BaseComponent {
  static get observedAttributes() {
    return ['type', 'size', 'text', 'overlay'];
  }

  render() {
    const type = this.getAttr('type', 'spinner');
    const size = this.getAttr('size', 'md');
    const text = this.getAttr('text');
    const overlay = this.getBoolAttr('overlay');

    // Size classes
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    const loadingContent = this.renderLoadingType(type, sizeClasses[size] || sizeClasses.md);
    
    const wrapperClasses = this.classNames(
      'flex items-center justify-center',
      overlay ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : ''
    );

    this.innerHTML = `
      <div class="${wrapperClasses}" role="status" aria-live="polite">
        <div class="flex flex-col items-center space-y-3">
          ${loadingContent}
          ${text ? `<p class="text-sm text-webropol-gray-600 font-medium">${text}</p>` : ''}
        </div>
      </div>
    `;
  }

  renderLoadingType(type, sizeClass) {
    switch (type) {
      case 'spinner':
        return `
          <svg class="${sizeClass} animate-spin text-webropol-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        `;
      
      case 'dots':
        return `
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-webropol-teal-600 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-webropol-teal-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-webropol-teal-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        `;
      
      case 'pulse':
        return `
          <div class="${sizeClass} bg-webropol-teal-600 rounded-full animate-pulse"></div>
        `;
      
      case 'bars':
        return `
          <div class="flex space-x-1 items-end">
            <div class="w-1 h-6 bg-webropol-teal-600 animate-pulse"></div>
            <div class="w-1 h-4 bg-webropol-teal-600 animate-pulse" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-8 bg-webropol-teal-600 animate-pulse" style="animation-delay: 0.2s"></div>
            <div class="w-1 h-3 bg-webropol-teal-600 animate-pulse" style="animation-delay: 0.3s"></div>
          </div>
        `;
      
      default:
        return this.renderLoadingType('spinner', sizeClass);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Public methods  
  show() {
    this.style.display = 'block';
    this.emit('webropol-loading-show');
  }

  hide() {
    this.style.display = 'none';
    this.emit('webropol-loading-hide');
  }
}

// Register the component
customElements.define('webropol-loading', WebropolLoading);
