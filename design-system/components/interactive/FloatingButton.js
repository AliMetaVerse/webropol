/**
 * Webropol Floating Button Component
 * Floating action button with expandable menu
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolFloatingButton extends BaseComponent {
  constructor() {
    super();
    this.showMenu = false;
  }

  static get observedAttributes() {
    return ['position', 'size', 'show-menu'];
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
      'top-left': 'fixed top-6 left-6'
    };

    // Size classes
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-14 h-14',
      lg: 'w-16 h-16'
    };

    this.innerHTML = `
      <div class="${positionClasses[position]} z-40">
        <!-- Menu Items Grid -->
        <div class="floating-menu absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 opacity-0 translate-y-4 pointer-events-none">
          <div class="bg-white rounded-2xl shadow-2xl p-6 border border-webropol-gray-200 min-w-64">
            <h3 class="text-lg font-bold text-webropol-gray-900 mb-4 text-center">Create New</h3>
            <div class="space-y-2">
              <!-- Surveys -->
              <button data-type="surveys"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fal fa-chart-bar text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Surveys</span>
                  <span class="text-xs text-webropol-gray-500">Custom surveys</span>
                </div>
              </button>

              <!-- Events -->
              <button data-type="events"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fal fa-calendar-alt text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Events</span>
                  <span class="text-xs text-webropol-gray-500">Event management</span>
                </div>
              </button>

              <!-- EXW Surveys -->
              <button data-type="exw-surveys"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fal fa-chart-line text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">EXW Surveys</span>
                  <span class="text-xs text-webropol-gray-500">Employee experience</span>
                </div>
              </button>

              <!-- Employee -->
              <button data-type="employee"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fal fa-users text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Employee</span>
                  <span class="text-xs text-webropol-gray-500">HR management</span>
                </div>
              </button>

              <!-- Campaign -->
              <button data-type="campaign"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fal fa-bullhorn text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Campaign</span>
                  <span class="text-xs text-webropol-gray-500">Marketing campaigns</span>
                </div>
              </button>

            </div>
          </div>
        </div>

        <!-- Main Floating Button -->
        <button class="main-floating-btn ${sizeClasses[size]} bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group">
          <i class="fal fa-plus text-xl transition-transform duration-300 group-hover:rotate-180"></i>
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
          this.emit('create-item', { type, originalEvent: e });
          this.hideMenu();
        });
      });
    }
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
      menu.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      menu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
    if (icon) {
      icon.classList.add('rotate-45');
    }
  }

  hideMenuVisually(menu, icon) {
    if (menu) {
      menu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      menu.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }
    if (icon) {
      icon.classList.remove('rotate-45');
    }
  }
}

// Register the component
customElements.define('webropol-floating-button', WebropolFloatingButton);

