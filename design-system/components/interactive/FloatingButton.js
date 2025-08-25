/**
 * Webropol Floating Button Component
 * Floating action button with expandable menu
 */

import { BaseComponent } from '../../utils/base-component.js';

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
          <div class="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30 min-w-96 overflow-hidden">
            <!-- Animated background -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-teal-50/50 rounded-3xl"></div>
            
            <!-- Floating particles background -->
            <div class="absolute inset-0 overflow-hidden rounded-3xl">
              <div class="floating-particle absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float-1"></div>
              <div class="floating-particle absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float-2"></div>
              <div class="floating-particle absolute w-3 h-3 bg-teal-400/30 rounded-full animate-float-3"></div>
            </div>
            
            <!-- Header -->
            <div class="relative mb-6 text-center">
              <div class="flex items-center justify-center space-x-3 mb-2">
                <div class="w-8 h-8 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-full flex items-center justify-center">
                  <i class="fal fa-plus text-white text-sm"></i>
                </div>
                <h3 class="text-xl font-bold bg-gradient-to-r from-webropol-teal-600 to-webropol-teal-700 bg-clip-text text-transparent">Create Something Amazing</h3>
              </div>
              <p class="text-sm text-gray-600">What would you like to build today?</p>
            </div>
            
            <div class="relative space-y-3">
              <!-- Surveys -->
              <button data-type="surveys"
                class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i class="fal fa-chart-bar text-white text-lg group-hover:animate-pulse"></i>
                </div>
                <div class="ml-4 flex-1">
                  <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">Surveys</span>
                  <span class="text-sm text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Create custom surveys</span>
                </div>
                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <i class="fal fa-arrow-right text-webropol-teal-600"></i>
                </div>
              </button>

              <!-- Events -->
              <button data-type="events"
                class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i class="fal fa-calendar-alt text-white text-lg group-hover:animate-pulse"></i>
                </div>
                <div class="ml-4 flex-1">
                  <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">Events</span>
                  <span class="text-sm text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Event management</span>
                </div>
                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <i class="fal fa-arrow-right text-webropol-teal-600"></i>
                </div>
              </button>

              <!-- 2-Way SMS -->
              <button data-type="2-way-sms"
                class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i class="fal fa-sms text-white text-lg group-hover:animate-pulse"></i>
                </div>
                <div class="ml-4 flex-1">
                  <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">2-Way SMS</span>
                  <span class="text-sm text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Send and receive</span>
                </div>
                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <i class="fal fa-arrow-right text-webropol-teal-600"></i>
                </div>
              </button>

              <!-- EXW Surveys -->
              <button data-type="exw-surveys"
                class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i class="fal fa-user-chart text-white text-lg group-hover:animate-pulse"></i>
                </div>
                <div class="ml-4 flex-1">
                  <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">EXW Surveys</span>
                  <span class="text-sm text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Employee experience</span>
                </div>
                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <i class="fal fa-arrow-right text-webropol-teal-600"></i>
                </div>
              </button>

              <!-- Case Management -->
              <button data-type="case-management"
                class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i class="fal fa-briefcase text-white text-lg group-hover:animate-pulse"></i>
                </div>
                <div class="ml-4 flex-1">
                  <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">Case Management</span>
                  <span class="text-sm text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Manage your team</span>
                </div>
                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <i class="fal fa-arrow-right text-webropol-teal-600"></i>
                </div>
              </button>
            </div>
            
            <!-- Inspirational footer -->
            <div class="relative mt-6 pt-4 border-t border-white/30">
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span class="font-medium">Build something extraordinary</span>
              </div>
            </div>
          </div>
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
    const createButtons = this.querySelectorAll('.create-item-btn');

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

      // Handle create item clicks
      createButtons.forEach(btn => {
        this.addListener(btn, 'click', (e) => {
          e.stopPropagation();
          const type = btn.getAttribute('data-type');
          
          // Handle navigation based on type
          this.handleNavigation(type);
          
          this.emit('create-item', { type, originalEvent: e });
          this.hideMenu();
        });
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

