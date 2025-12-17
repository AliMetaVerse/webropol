/**
 * Webropol Toast Component
 * Part of Smart Notifier system (Alert, Toast, Promo)
 * 
 * Usage:
 * <webropol-toast 
 *   variant="info|success|warning|error" 
 *   position="top-right|top-left|bottom-right|bottom-left|top-center|bottom-center"
 *   duration="3000"
 *   dismissible="true">
 *   Toast message
 * </webropol-toast>
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolToast extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'position', 'duration', 'dismissible', 'show'];
  }

  constructor() {
    super();
    this.state = {
      visible: false
    };
    this.autoHideTimer = null;
  }

  init() {
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
    
    // Position container
    this.style.position = 'fixed';
    this.style.zIndex = '9999';
    this.applyPosition();
  }

  applyPosition() {
    const position = this.getAttr('position', 'top-right');
    const positions = {
      'top-right': { top: '1rem', right: '1rem' },
      'top-left': { top: '1rem', left: '1rem' },
      'bottom-right': { bottom: '1rem', right: '1rem' },
      'bottom-left': { bottom: '1rem', left: '1rem' },
      'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }
    };

    const pos = positions[position] || positions['top-right'];
    Object.assign(this.style, pos);
  }

  getVariantConfig(variant) {
    const configs = {
      info: {
        bg: 'bg-white',
        border: 'border-webropol-primary-500',
        iconBg: 'bg-webropol-primary-50',
        iconColor: 'text-webropol-primary-600',
        textColor: 'text-webropol-gray-900',
        defaultIcon: 'fal fa-info-circle'
      },
      success: {
        bg: 'bg-white',
        border: 'border-green-500',
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
        textColor: 'text-green-900',
        defaultIcon: 'fal fa-check-circle'
      },
      warning: {
        bg: 'bg-white',
        border: 'border-yellow-500',
        iconBg: 'bg-yellow-50',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-900',
        defaultIcon: 'fal fa-exclamation-triangle'
      },
      error: {
        bg: 'bg-white',
        border: 'border-red-500',
        iconBg: 'bg-red-50',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
        defaultIcon: 'fal fa-exclamation-circle'
      }
    };
    
    return configs[variant] || configs.info;
  }

  render() {
    if (!this.state.visible) {
      this.innerHTML = '';
      return;
    }

    const variant = this.getAttr('variant', 'info');
    const dismissible = this.getBoolAttr('dismissible');
    
    const config = this.getVariantConfig(variant);

    this.innerHTML = `
      <div class="toast-container ${config.bg} ${config.border} border-l-4 rounded-lg shadow-lg p-4 min-w-[300px] max-w-md animate-slide-in">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center">
            <i class="${config.defaultIcon} text-xl ${config.iconColor}"></i>
          </div>
          <div class="flex-1 pt-1 ${config.textColor}">
            <slot></slot>
          </div>
          ${dismissible ? `
            <button 
              class="flex-shrink-0 w-6 h-6 rounded hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-400 hover:text-gray-600"
              aria-label="Dismiss toast"
              data-dismiss>
              <i class="fal fa-times"></i>
            </button>
          ` : ''}
        </div>
      </div>
      <style>
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      </style>
    `;
  }

  bindEvents() {
    const dismissBtn = this.querySelector('[data-dismiss]');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => this.dismiss());
    }
  }

  show() {
    this.state.visible = true;
    this.render();
    this.emit('shown');
    
    // Auto-hide after duration
    const duration = parseInt(this.getAttr('duration', '3000'));
    if (duration > 0) {
      this.autoHideTimer = setTimeout(() => {
        this.dismiss();
      }, duration);
    }
  }

  dismiss() {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }
    this.state.visible = false;
    this.render();
    this.emit('dismissed');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'show' && (newValue === 'true' || newValue === '')) {
        this.show();
      } else if (name === 'position') {
        this.applyPosition();
      } else {
        this.render();
      }
    }
  }
}

customElements.define('webropol-toast', WebropolToast);
