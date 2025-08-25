/**
 * Webropol Floating Button Component
 * Floating action button with expandable menu
 */

import { BaseComponent } from '../../utils/base-component.js';
import { renderCreateMenu, bindCreateMenu } from './CreateMenu.js';

export class WebropolFloatingButton extends BaseComponent {
  constructor() {
    super();
    this.showMenu = false;
    this.setupGlobalSettingsListener();
  }

  static get observedAttributes() {
    return ['position', 'size', 'show-menu'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.applyVisibilityFromSettings();
  }

  setupGlobalSettingsListener() {
    // Listen for global settings changes
    document.addEventListener('webropol-settings-applied', (e) => {
      this.applyVisibilityFromSettings();
    });
  }

  applyVisibilityFromSettings() {
    // Check if global settings manager is available
    if (typeof window !== 'undefined' && window.globalSettingsManager) {
      const showFloatingButton = window.globalSettingsManager.getSetting('showFloatingButton');
      if (showFloatingButton) {
        this.style.display = '';
        this.removeAttribute('hidden');
      } else {
        this.style.display = 'none';
        this.setAttribute('hidden', '');
      }
    }
  }

  render() {
    const position = this.getAttr('position', 'bottom-center');
    const size = this.getAttr('size', 'md');
    const showMenu = this.getBoolAttr('show-menu');
    
    // Position classes
    const positionClasses = {
      'bottom-center': 'fixed bottom-6 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'fixed bottom-6 right-6',
      'bottom-left': 'fixed bottom-6 left-6',
      'top-right': 'fixed top-6 right-6',
      'top-left': 'fixed top-6 left-6',
      'relative': 'relative'
    };

    // Size classes
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-14 h-14',
      lg: 'w-16 h-16'
    };

    this.innerHTML = `
      <div class="${positionClasses[position]} z-40">
        <!-- Menu Items Grid with New Design -->
        <div class="floating-menu absolute ${position === 'relative' ? 'bottom-full mb-4' : 'bottom-20'} left-1/2 transform -translate-x-1/2 transition-all duration-500 opacity-0 translate-y-8 scale-95 pointer-events-none">
          ${renderCreateMenu()}
        </div>

        <!-- Main Floating Button with Enhanced Design -->
        <button class="main-floating-btn ${sizeClasses[size]} relative overflow-hidden bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 hover:from-webropol-teal-600 hover:to-webropol-teal-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center group transform hover:scale-110 hover:-translate-y-1">
          <!-- Animated background layers -->
          <div class="absolute inset-0 bg-gradient-to-br from-webropol-teal-400 to-webropol-teal-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-500"></div>
          
          <!-- Rotating border effect -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-webropol-teal-300 to-webropol-teal-500 opacity-75 blur-md group-hover:animate-spin-slow"></div>
          
          <!-- Shimmer effect -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          
          <!-- Main icon -->
          <div class="relative z-10 transform transition-all duration-300 group-hover:rotate-180 group-hover:scale-110">
            <i class="fal fa-plus text-2xl font-bold"></i>
          </div>
          
          <!-- Floating sparkles -->
          <div class="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300 delay-100"></div>
          <div class="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300 delay-200"></div>
          <div class="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300 delay-300"></div>
        </button>
      </div>
    `;
  }

  bindEvents() {
  const mainButton = this.querySelector('.main-floating-btn');
  const menu = this.querySelector('.floating-menu');

    if (mainButton && menu) {
      this.addListener(mainButton, 'click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // Close menu when clicking outside
      this.addListener(document, 'click', (e) => {
        if (!this.contains(e.target)) {
          this.hideMenu();
        }
      });

      // Bind shared create menu interactions
      bindCreateMenu(menu, (type, e) => {
        e && e.stopPropagation();
        this.handleNavigation(type);
        this.emit('create-item', { type, source: 'floating-button', originalEvent: e });
        this.hideMenu();
      });
    }
  }

  handleNavigation(type) {
    const currentPath = window.location.pathname;
    let targetUrl = '';

    // Determine the correct base path more robustly
    let basePath = '';
    
    // Count the depth level by counting slashes after the initial one
    const pathParts = currentPath.split('/').filter(part => part); // Remove empty parts
    const depth = pathParts.length;
    
    // If we're in the root (like /index.html), no base path needed
    if (depth <= 1) {
      basePath = './';
    } else {
      // Go up directories based on depth
      basePath = '../'.repeat(depth - 1);
    }

    // Map floating button types to URL types
    const typeMapping = {
      'surveys': 'survey',
      'events': 'event', 
      '2-way-sms': 'sms',
      'exw-surveys': 'exw',
      'case-management': 'case-management'
    };

    const urlType = typeMapping[type] || type;
    targetUrl = `${basePath}create/index.html?type=${urlType}`;

    window.location.href = targetUrl;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    const menu = this.querySelector('.floating-menu');
    const mainButton = this.querySelector('.main-floating-btn i');
    
    if (this.showMenu) {
      this.showMenuVisually(menu, mainButton);
    } else {
      this.hideMenuVisually(menu, mainButton);
    }
  }

  showMenu() {
    this.showMenu = true;
    const menu = this.querySelector('.floating-menu');
    const mainButton = this.querySelector('.main-floating-btn i');
    this.showMenuVisually(menu, mainButton);
  }

  hideMenu() {
    this.showMenu = false;
    const menu = this.querySelector('.floating-menu');
    const mainButton = this.querySelector('.main-floating-btn i');
    this.hideMenuVisually(menu, mainButton);
  }

  showMenuVisually(menu, icon) {
    if (menu) {
      menu.classList.remove('opacity-0', 'translate-y-8', 'scale-95', 'pointer-events-none');
      menu.classList.add('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
    }
    if (icon) {
      icon.classList.add('rotate-180', 'scale-110');
    }
  }

  hideMenuVisually(menu, icon) {
    if (menu) {
      menu.classList.remove('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
      menu.classList.add('opacity-0', 'translate-y-8', 'scale-95', 'pointer-events-none');
    }
    if (icon) {
      icon.classList.remove('rotate-180', 'scale-110');
    }
  }
}

// Register the component
customElements.define('webropol-floating-button', WebropolFloatingButton);

