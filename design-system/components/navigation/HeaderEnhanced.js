/**
 * Mobile-Enhanced Webropol Header Component
 * Top navigation header with mobile menu toggle and responsive controls
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolHeader extends BaseComponent {
  static get observedAttributes() {
    return ['username', 'title', 'show-notifications', 'show-help', 'show-user-menu'];
  }

  constructor() {
    super();
    this.isMobile = false;
    this.checkViewport = this.checkViewport.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.checkViewport);
  }

  checkViewport() {
    const oldIsMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 767;
    
    console.log('Header: Viewport check - width:', window.innerWidth, 'isMobile:', this.isMobile);
    
    if (oldIsMobile !== this.isMobile) {
      console.log('Header: Mobile state changed, re-rendering');
      this.render();
    }
  }

  render() {
    const username = this.getAttr('username', 'Ali Al-Zuhairi');
    const title = this.getAttr('title');
    const showNotifications = this.getBoolAttr('show-notifications');
    const showHelp = this.getBoolAttr('show-help');
    const showUserMenu = this.getBoolAttr('show-user-menu');

    console.log('Header: Rendering - isMobile:', this.isMobile, 'width:', window.innerWidth);

    if (this.isMobile) {
      console.log('Header: Rendering mobile header');
      this.innerHTML = this.renderMobileHeader(username, title, showNotifications, showHelp, showUserMenu);
    } else {
      console.log('Header: Rendering desktop header');
      this.innerHTML = this.renderDesktopHeader(username, title, showNotifications, showHelp, showUserMenu);
    }

    this.addEventListeners();
  }

  renderMobileHeader(username, title, showNotifications, showHelp, showUserMenu) {
    return `
      <header class="mobile-header h-16 bg-white/95 backdrop-blur-xl border-b border-webropol-gray-200/50 flex items-center justify-between px-4 shadow-soft sticky top-0"
              style="z-index: var(--z-mobile-header);">
        <!-- Mobile Left Section -->
        <div class="flex items-center space-x-3">
          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle w-10 h-10 flex items-center justify-center text-webropol-gray-600 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-lg transition-all duration-200"
                  aria-label="Toggle navigation menu">
            <i class="fal fa-bars text-lg"></i>
          </button>
          
          <!-- Mobile Logo -->
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-lg flex items-center justify-center">
              <i class="fal fa-chart-bar text-white text-sm"></i>
            </div>
            ${title ? `<span class="ml-2 font-semibold text-webropol-gray-900 text-sm truncate max-w-[120px]">${title}</span>` : ''}
          </div>
        </div>
        
        <!-- Mobile Right Section -->
        <div class="flex items-center space-x-2">
          ${showNotifications ? `
            <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-lg transition-all duration-200">
              <i class="fal fa-bell text-lg"></i>
            </button>
          ` : ''}
          
          ${showHelp ? `
            <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-lg transition-all duration-200">
              <i class="fal fa-question-circle text-lg"></i>
            </button>
          ` : ''}
          
          ${showUserMenu !== false ? `
            <button class="mobile-user-menu flex items-center px-3 py-2 text-webropol-gray-700 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-lg transition-all duration-200">
              <div class="w-6 h-6 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-full flex items-center justify-center mr-2">
                <i class="fal fa-user text-white text-xs"></i>
              </div>
              <i class="fal fa-chevron-down text-xs"></i>
            </button>
          ` : ''}
          
          <slot name="mobile-actions"></slot>
        </div>
      </header>
    `;
  }

  renderDesktopHeader(username, title, showNotifications, showHelp, showUserMenu) {
    return `
      <header class="desktop-header min-h-[5rem] h-20 bg-white/85 backdrop-blur-xl border-b border-webropol-gray-200/50 flex items-center justify-between px-8 shadow-soft">
        <!-- Desktop Left Section -->
        <div class="flex items-center space-x-4">
          ${title ? `
            <h1 class="text-xl font-semibold text-webropol-gray-900">${title}</h1>
          ` : ''}
          <slot name="title"></slot>
          <slot name="left"></slot>
        </div>
        
        <!-- Desktop Right Section -->
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3">
            ${showNotifications ? `
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all duration-200 relative">
                <i class="fal fa-bell text-lg"></i>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-webropol-red-500 rounded-full opacity-0 animate-pulse"></span>
              </button>
            ` : ''}
            
            ${showHelp ? `
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all duration-200">
                <i class="fal fa-question-circle text-lg"></i>
              </button>
            ` : ''}
            
            <slot name="actions"></slot>
            
            ${showUserMenu !== false ? `
              <div class="relative">
                <button class="desktop-user-menu flex items-center px-4 py-2 text-webropol-gray-700 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all duration-200 group">
                  <div class="w-8 h-8 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <i class="fal fa-user text-white text-sm"></i>
                  </div>
                  <span class="mr-2 font-medium truncate max-w-[120px]">${username}</span>
                  <i class="fal fa-chevron-down text-xs group-hover:rotate-180 transition-transform duration-200"></i>
                </button>
              </div>
            ` : ''}
          </div>
          <slot name="right"></slot>
        </div>
      </header>
    `;
  }

  addEventListeners() {
    console.log('Header: Adding event listeners, isMobile:', this.isMobile);
    
    // Mobile menu toggle
    const mobileMenuToggle = this.querySelector('.mobile-menu-toggle');
    console.log('Header: Found mobile menu toggle:', mobileMenuToggle);
    
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', (e) => {
        console.log('Header: Mobile menu toggle clicked');
        e.preventDefault();
        e.stopPropagation(); // Prevent outside click handler from triggering
        this.toggleMobileMenu();
      });
    }

    // Notification button
    const notificationBtn = this.querySelector('button .fa-bell');
    if (notificationBtn) {
      notificationBtn.parentElement.addEventListener('click', () => {
        this.emit('notification-click');
      });
    }
    
    // Help button
    const helpBtn = this.querySelector('button .fa-question-circle');
    if (helpBtn) {
      helpBtn.parentElement.addEventListener('click', () => {
        this.emit('help-click');
      });
    }

    // User menu buttons
    const userMenuBtns = this.querySelectorAll('.mobile-user-menu, .desktop-user-menu');
    userMenuBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.emit('user-menu-click');
      });
    });
  }

  toggleMobileMenu() {
    console.log('Header: toggleMobileMenu called');
    
    // Find the sidebar component and toggle its mobile menu
    const sidebar = document.querySelector('webropol-sidebar-enhanced');
    console.log('Header: Found sidebar component:', sidebar);
    
    if (sidebar) {
      if (typeof sidebar.toggleMobileMenu === 'function') {
        console.log('Header: Calling sidebar.toggleMobileMenu()');
        sidebar.toggleMobileMenu();
        this.emit('mobile-menu-toggle');
      } else {
        console.error('Header: sidebar.toggleMobileMenu is not a function', typeof sidebar.toggleMobileMenu);
        // Fallback: directly set the attribute
        const isOpen = sidebar.getAttribute('mobile-open') === 'true';
        sidebar.setAttribute('mobile-open', !isOpen);
        
        // Trigger manual state update if the method exists
        if (typeof sidebar.updateMobileState === 'function') {
          sidebar.updateMobileState();
        }
      }
    } else {
      console.error('Header: Could not find webropol-sidebar-enhanced element');
      
      // Retry after a short delay in case components are still loading
      setTimeout(() => {
        const sidebarRetry = document.querySelector('webropol-sidebar-enhanced');
        if (sidebarRetry && typeof sidebarRetry.toggleMobileMenu === 'function') {
          console.log('Header: Retry successful, calling sidebar.toggleMobileMenu()');
          sidebarRetry.toggleMobileMenu();
          this.emit('mobile-menu-toggle');
        } else {
          console.error('Header: Retry failed - sidebar still not available');
        }
      }, 100);
    }
  }

  bindEvents() {
    // Legacy method for backward compatibility
    this.addEventListeners();
  }
}

// Register the component
customElements.define('webropol-header-enhanced', WebropolHeader);

