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

    WebropolLoading.ensureStyles();

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
          <svg class="${sizeClass} animate-spin text-webropol-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        `;
      
      case 'dots':
        return `
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-webropol-primary-600 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-webropol-primary-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-webropol-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        `;
      
      case 'pulse':
        return `
          <div class="${sizeClass} bg-webropol-primary-600 rounded-full animate-pulse"></div>
        `;
      
      case 'bars':
        return `
          <div class="flex space-x-1 items-end">
            <div class="w-1 h-6 bg-webropol-primary-600 animate-pulse"></div>
            <div class="w-1 h-4 bg-webropol-primary-600 animate-pulse" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-8 bg-webropol-primary-600 animate-pulse" style="animation-delay: 0.2s"></div>
            <div class="w-1 h-3 bg-webropol-primary-600 animate-pulse" style="animation-delay: 0.3s"></div>
          </div>
        `;

      case 'royal': {
        // Royal AI loader: ring + sparkles, matches the AI Question Generator
        const dimMap = { sm: 32, md: 40, lg: 56, xl: 72 };
        const size = this.getAttr('size', 'md');
        const dim = dimMap[size] || dimMap.md;
        return `
          <div class="webropol-royal-loader" style="width:${dim}px;height:${dim}px;">
            <div class="webropol-royal-loader__track"></div>
            <div class="webropol-royal-loader__head"></div>
            <i class="fal fa-sparkles webropol-royal-loader__icon"></i>
          </div>
        `;
      }

      default:
        return this.renderLoadingType('spinner', sizeClass);
    }
  }

  static ensureStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('webropol-loading-styles')) return;
    const style = document.createElement('style');
    style.id = 'webropol-loading-styles';
    style.textContent = `
      .webropol-royal-loader {
        position: relative;
        display: inline-block;
      }
      .webropol-royal-loader__track,
      .webropol-royal-loader__head {
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        border: 4px solid transparent;
        box-sizing: border-box;
      }
      .webropol-royal-loader__track {
        border-color: #f1e9fb;
      }
      .webropol-royal-loader__head {
        border-top-color: #823bdd;
        animation: webropol-royal-spin 0.9s linear infinite;
      }
      .webropol-royal-loader__icon {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 40%;
        height: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6922c4;
        font-size: 0.95em;
      }
      @keyframes webropol-royal-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
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
