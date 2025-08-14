/**
 * Webropol Header Component
 * Top navigation header with user info and controls
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolHeader extends BaseComponent {
  static get observedAttributes() {
    return ['username', 'title', 'show-notifications', 'show-help', 'show-user-menu'];
  }

  render() {
    const username = this.getAttr('username', 'Ali Al-Zuhairi');
    const title = this.getAttr('title');
    const showNotifications = this.getBoolAttr('show-notifications');
    const showHelp = this.getBoolAttr('show-help');
    const showUserMenu = this.getBoolAttr('show-user-menu');

    this.innerHTML = `
      <header class="min-h-[5rem] h-20 glass-effect border-b border-webropol-gray-200/50 flex items-center justify-between px-8 shadow-soft">
        <div class="flex items-center space-x-4">
          ${title ? `
            <h1 class="text-xl font-semibold text-webropol-gray-900">${title}</h1>
          ` : ''}
          <slot name="title"></slot>
          <slot name="left"></slot>
        </div>
        
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3">
            ${showNotifications ? `
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all">
                <i class="fal fa-bell"></i>
              </button>
            ` : ''}
            ${showHelp ? `
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all">
                <i class="fal fa-question-circle"></i>
              </button>
            ` : ''}
            <slot name="actions"></slot>
            ${showUserMenu !== false ? `
              <div class="relative">
                <button class="flex items-center text-webropol-gray-700 hover:text-webropol-teal-600 transition-colors">
                  <span class="mr-2 font-medium">${username}</span>
                  <i class="fal fa-chevron-down text-xs"></i>
                </button>
              </div>
            ` : ''}
          </div>
          <slot name="right"></slot>
        </div>
      </header>
    `;
  }

  bindEvents() {
    // Add any click handlers for notifications, help, etc.
    const notifications = this.querySelector('button .fa-bell');
    const help = this.querySelector('button .fa-question-circle');
    
    if (notifications) {
      this.addListener(notifications.parentElement, 'click', () => {
        this.emit('notification-click');
      });
    }
    
    if (help) {
      this.addListener(help.parentElement, 'click', () => {
        this.emit('help-click');
      });
    }
  }
}

// Register the component
customElements.define('webropol-header', WebropolHeader);

