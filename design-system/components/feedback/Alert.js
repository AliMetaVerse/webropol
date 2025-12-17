/**
 * Webropol Alert Component
 * Part of Smart Notifier system (Alert, Toast, Promo)
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolAlertInfo extends BaseComponent {
  static get observedAttributes() {
    return ['dismissible', 'icon'];
  }

  constructor() {
    super();
    this._hasRendered = false;
    this._originalContent = '';
  }

  connectedCallback() {
    // Capture original content only once
    if (!this._hasRendered) {
      this._originalContent = this.innerHTML.trim();
      this.innerHTML = '';
    }
    super.connectedCallback();
  }

  init() {
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-live', 'polite');
  }

  render() {
    // Only render once
    if (this._hasRendered) return;
    this._hasRendered = true;

    const dismissible = this.getBoolAttr('dismissible');
    const customIcon = this.getAttr('icon', '');
    
    const config = {
      bg: 'from-cyan-50 to-blue-50',
      border: '#06b6d4',
      iconBg: 'bg-cyan-100',
      iconBorder: 'border-cyan-200',
      iconColor: 'text-cyan-600',
      icon: 'fal fa-info-circle'
    };
    
    const icon = customIcon || config.icon;

    this.className = `flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r ${config.bg} border shadow-sm`;
    this.style.borderColor = config.border;

    this.innerHTML = `
      <div class="flex-shrink-0 w-12 h-12 rounded-full ${config.iconBg} border-2 ${config.iconBorder} shadow-sm flex items-center justify-center">
        <i class="${icon} text-2xl ${config.iconColor}"></i>
      </div>
      <div class="flex-1 text-webropol-gray-900">
        ${this._originalContent}
      </div>
    `;
  }

  bindEvents() {
    // No events needed for basic alert
  }
}

customElements.define('webropol-alert-info', WebropolAlertInfo);
