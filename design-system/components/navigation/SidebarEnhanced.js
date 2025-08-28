/**
 * Mobile-Enhanced Webropol Sidebar Component
 * Navigation sidebar with mobile drawer pattern
 * Features: Desktop sidebar + Mobile drawer with backdrop
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolSidebarEnhanced extends BaseComponent {
  static get observedAttributes() {
    return ['active', 'base', 'mobile-open'];
  }

  constructor() {
    super();
    this.isMobile = false;
    this.isTablet = false;
    this.checkViewport = this.checkViewport.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  // Body-level mobile layer nodes
  this._mobileLayer = null; // wrapper div
  this._backdropEl = null;  // backdrop div
  this._drawerEl = null;    // aside drawer
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Sidebar: Connected to DOM');
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport);
    this.setupMobileMenu();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.checkViewport);
    this.cleanupMobileMenu();
  }

  checkViewport() {
    const oldIsMobile = this.isMobile;
    const oldIsTablet = this.isTablet;
    
    this.isMobile = window.innerWidth <= 767;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1023;
    
    if (oldIsMobile !== this.isMobile || oldIsTablet !== this.isTablet) {
      this.render();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'mobile-open') {
        this.updateMobileState();
      } else {
        this.render();
      }
    }
  }

  render() {
    const active = this.getAttr('active', 'home');
    const base = this.getAttr('base', '');
    const mobileOpen = this.getBoolAttr('mobile-open');
    
    // Helper to prefix base to links
    const link = (path) => {
      if (!base) return path;
      const normalizedBase = base.endsWith('/') ? base : base + '/';
      const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      return normalizedBase + normalizedPath;
    };

    // Generate navigation items
    const navigationItems = this.generateNavigationItems(active, link);

    if (this.isMobile) {
      // On mobile we render the drawer at document.body level to escape stacking contexts.
      // Keep the component's own DOM minimal.
      this.innerHTML = '';
      // Ensure body layer reflects current state
      this.syncBodyLayer(navigationItems, mobileOpen);
    } else if (this.isTablet) {
      this.innerHTML = this.renderTabletSidebar(navigationItems);
    } else {
      this.innerHTML = this.renderDesktopSidebar(navigationItems);
    }

    this.addEventListeners();
  }

  generateNavigationItems(active, link) {
    return [
      {
        id: 'home',
        href: '#/home',
        icon: 'fal fa-home',
        label: 'Home',
        active: active === 'home'
      },
      {
        id: 'surveys',
        href: '#/surveys/list',
        icon: 'fal fa-chart-bar',
        label: 'Surveys',
        active: active === 'surveys'
      },
      {
        id: 'events',
        href: '#/events/list',
        icon: 'fal fa-calendar-alt',
        label: 'Events',
        active: active === 'events'
      },
      {
        id: 'sms',
        href: '#/sms',
        icon: 'fal fa-sms',
        label: '2-Way SMS',
        active: active === 'sms'
      },
      {
        id: 'exw',
        href: '#/exw',
        icon: 'fal fa-user-chart',
        label: 'EXW',
        active: active === 'exw'
      },
      {
        id: 'case-management',
        href: '#/case-management',
        icon: 'fal fa-briefcase',
        label: 'Case Management',
        active: active === 'case-management'
      },
      // Divider
      { type: 'divider' },
      {
        id: 'mywebropol',
        href: '#/mywebropol',
        icon: 'fal fa-book-open',
        label: 'MyWebropol',
        active: active === 'mywebropol'
      },
      {
        id: 'admin-tools',
        href: '#/admin-tools',
        icon: 'fal fa-tools',
        label: 'Admin Tools',
        active: active === 'admin-tools'
      },
      {
        id: 'training-videos',
        href: '#/training-videos',
        icon: 'fal fa-video',
        label: 'Training Videos',
        active: active === 'training-videos'
      },
      {
        id: 'shop',
        href: '#/shop',
        icon: 'fal fa-shopping-cart',
        label: 'Shop',
        active: active === 'shop'
      }
    ];
  }
  // Build just the inner HTML for the drawer content (used by body layer)
  renderMobileDrawerContent(navigationItems) {
    return `
      <!-- Mobile Header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-webropol-gray-200 bg-white">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fal fa-chart-bar text-white text-sm"></i>
          </div>
          <h2 class="font-bold text-webropol-gray-900 text-lg">Webropol</h2>
        </div>
        <button class="mobile-close-btn w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-gray-700 hover:bg-webropol-gray-100 rounded-lg transition-all"
                aria-label="Close navigation menu">
          <i class="fal fa-times text-lg"></i>
        </button>
      </div>
      
      <!-- Mobile Navigation Content -->
      <div class="flex-1 overflow-y-auto py-4">
        ${this.renderNavigationItems(navigationItems, 'mobile')}
      </div>
      
      <!-- Mobile Footer -->
      <div class="border-t border-webropol-gray-200 p-4">
        <a href="#" class="flex items-center px-4 py-3 text-webropol-teal-700 hover:bg-webropol-teal-50 rounded-xl transition-all">
          <i class="fal fa-envelope w-5 mr-3"></i>
          <span class="font-medium">Contact Us</span>
        </a>
      </div>
    `;
  }

  // Ensure body-level mobile layer exists and sync its state/content
  syncBodyLayer(navigationItems, isOpen) {
    // Create once
    if (!this._mobileLayer) {
      const layer = document.createElement('div');
      layer.setAttribute('data-mobile-layer', '');
      layer.style.position = 'fixed';
      layer.style.inset = '0';
      layer.style.zIndex = String(2147483647); // max practical
      layer.style.pointerEvents = 'none';

      const backdrop = document.createElement('div');
      backdrop.setAttribute('data-mobile-backdrop', '');
      backdrop.style.position = 'fixed';
      backdrop.style.inset = '0';
      backdrop.style.background = 'rgba(0,0,0,0.5)';
      backdrop.style.opacity = '0';
      backdrop.style.visibility = 'hidden';
      backdrop.style.transition = 'opacity 0.3s ease';
      backdrop.style.pointerEvents = 'auto';

      const drawer = document.createElement('aside');
      drawer.setAttribute('data-mobile-drawer', '');
      drawer.setAttribute('role', 'navigation');
      drawer.setAttribute('aria-label', 'Mobile navigation menu');
      drawer.style.position = 'fixed';
      drawer.style.top = '0';
      drawer.style.left = '0';
      drawer.style.width = '280px';
      drawer.style.height = '100vh';
      drawer.style.background = '#fff';
      drawer.style.boxShadow = '4px 0 24px rgba(0,0,0,0.15)';
      drawer.style.transform = 'translateX(-100%)';
      drawer.style.transition = 'transform 0.3s ease';
      drawer.style.pointerEvents = 'auto';
      drawer.style.display = 'flex';
      drawer.style.flexDirection = 'column';

      // Content
      drawer.innerHTML = this.renderMobileDrawerContent(navigationItems);

      // Assemble
      layer.appendChild(backdrop);
      layer.appendChild(drawer);
      document.body.appendChild(layer);

      // Save refs
      this._mobileLayer = layer;
      this._backdropEl = backdrop;
      this._drawerEl = drawer;

      // Listeners
      backdrop.addEventListener('click', () => this.closeMobileMenu());
      drawer.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.mobile-close-btn');
        const navItem = e.target.closest('.nav-item');
        if (closeBtn) {
          this.closeMobileMenu();
        } else if (navItem) {
          const route = navItem.getAttribute('data-route');
          if (route && window.WebropolSPA) {
            e.preventDefault();
            window.WebropolSPA.navigate(route);
          }
          setTimeout(() => this.closeMobileMenu(), 150);
        }
      });
    } else {
      // Update content if items changed
      if (this._drawerEl) {
        this._drawerEl.innerHTML = this.renderMobileDrawerContent(navigationItems);
      }
    }

    // Apply open/close state
    if (this._mobileLayer && this._backdropEl && this._drawerEl) {
      if (isOpen) {
        this._mobileLayer.style.pointerEvents = 'auto';
        this._backdropEl.style.opacity = '1';
        this._backdropEl.style.visibility = 'visible';
        this._drawerEl.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
      } else {
        this._mobileLayer.style.pointerEvents = 'none';
        this._backdropEl.style.opacity = '0';
        this._backdropEl.style.visibility = 'hidden';
        this._drawerEl.style.transform = 'translateX(-100%)';
        document.body.style.overflow = '';
      }
    }
  }

  renderTabletSidebar(navigationItems) {
    return `
      <aside class="fixed left-0 top-0 h-screen w-20 bg-white/80 backdrop-blur-xl border-r border-webropol-gray-200/50 flex flex-col shadow-soft z-40
                     hover:w-64 hover:shadow-2xl transition-all duration-300 ease-in-out group"
             role="navigation"
             aria-label="Navigation sidebar">
        
        <!-- Tablet Header -->
        <div class="h-20 flex items-center justify-center group-hover:justify-start group-hover:px-6 border-b border-webropol-gray-200/50 transition-all duration-300">
          <div class="w-10 h-10 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fal fa-chart-bar text-white text-lg"></i>
          </div>
          <div class="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
            <h1 class="font-bold text-webropol-gray-900 text-lg whitespace-nowrap">Webropol</h1>
            <p class="text-xs text-webropol-gray-500 -mt-1 whitespace-nowrap">Survey Platform</p>
          </div>
        </div>
        
        <!-- Tablet Navigation -->
        <nav class="flex-1 overflow-y-auto py-4">
          ${this.renderNavigationItems(navigationItems, 'tablet')}
        </nav>
        
        <!-- Tablet Footer -->
        <div class="p-2 group-hover:p-4 transition-all duration-300">
          <a href="#" class="flex items-center justify-center group-hover:justify-start px-3 py-3 text-webropol-teal-700 hover:bg-webropol-teal-50 rounded-xl transition-all">
            <i class="fal fa-envelope w-5 flex-shrink-0"></i>
            <span class="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium whitespace-nowrap">Contact Us</span>
          </a>
        </div>
      </aside>
    `;
  }

  renderDesktopSidebar(navigationItems) {
    return `
      <aside class="sidebar-container group h-screen bg-white/80 backdrop-blur-xl border-r border-webropol-gray-200/50 flex flex-col flex-shrink-0 shadow-soft
                     xl:w-72 w-16 
                     relative
                     xl:z-auto z-50
                     transition-all duration-300 ease-in-out
                     hover:w-72 hover:shadow-2xl hover:absolute hover:h-screen
                     xl:hover:w-72 xl:hover:shadow-soft xl:hover:relative xl:hover:h-screen"
             role="navigation"
             aria-label="Navigation sidebar">
        
        <!-- Desktop Header -->
        <div class="h-20 flex items-center border-b border-webropol-gray-200/50
                    xl:px-8 px-4
                    group-hover:px-8
                    transition-all duration-300">
          <div class="w-10 h-10 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fal fa-chart-bar text-white text-lg"></i>
          </div>
          <div class="ml-3 overflow-hidden transition-all duration-300
                      xl:opacity-100 xl:w-auto
                      opacity-0 w-0
                      group-hover:opacity-100 group-hover:w-auto group-hover:ml-3">
            <h1 class="font-bold text-webropol-gray-900 text-lg whitespace-nowrap">Webropol</h1>
            <p class="text-xs text-webropol-gray-500 -mt-1 whitespace-nowrap">Survey Platform</p>
          </div>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 space-y-1
                    xl:px-4 px-2
                    group-hover:px-4
                    transition-all duration-300">
          ${this.renderNavigationItems(navigationItems, 'desktop')}
        </nav>
        
        <!-- Desktop Footer -->
        <div class="mt-auto transition-all duration-300
                    xl:px-4 px-2
                    group-hover:px-4
                    pb-6">
          <a href="#" class="nav-item flex items-center rounded-xl font-semibold text-webropol-teal-700 hover:bg-webropol-teal-50 transition-all duration-200
                             xl:px-4 px-3
                             group-hover:px-4
                             py-3">
            <i class="fal fa-envelope w-5 flex-shrink-0
                     xl:mr-4 mr-0
                     group-hover:mr-4"></i>
            <span class="overflow-hidden transition-all duration-300
                        xl:opacity-100 xl:w-auto
                        opacity-0 w-0
                        group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Contact Us</span>
          </a>
        </div>
      </aside>
    `;
  }

  renderNavigationItems(items, viewType) {
    return items.map(item => {
      if (item.type === 'divider') {
        return this.renderDivider(viewType);
      }
      return this.renderNavigationItem(item, viewType);
    }).join('');
  }

  renderDivider(viewType) {
    if (viewType === 'mobile') {
      return `<div class="border-t border-webropol-gray-200 my-4 mx-4"></div>`;
    } else if (viewType === 'tablet') {
      return `<div class="border-t border-webropol-gray-200 my-4 mx-2 group-hover:mx-4 transition-all duration-300"></div>`;
    } else {
      return `<div class="pt-4 border-t border-webropol-gray-200/50 mt-4"></div>`;
    }
  }

  renderNavigationItem(item, viewType) {
    const baseClasses = `nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item`;
    const activeClasses = item.active 
      ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' 
      : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700';

    if (viewType === 'mobile') {
      return `
        <a href="${item.href}" data-route="${item.href.replace('#', '')}" 
           class="${baseClasses} px-4 py-3 mx-4 mb-1 ${activeClasses}">
          <i class="${item.icon} w-5 mr-4 group-hover/item:scale-110 transition-transform"></i>
          <span class="font-medium">${item.label}</span>
        </a>
      `;
    } else if (viewType === 'tablet') {
      return `
        <a href="${item.href}" data-route="${item.href.replace('#', '')}" 
           class="${baseClasses} px-3 py-3 mx-2 group-hover:px-4 group-hover:mx-4 transition-all duration-300 ${activeClasses}">
          <i class="${item.icon} w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform"></i>
          <span class="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium whitespace-nowrap">${item.label}</span>
        </a>
      `;
    } else {
      return `
        <a href="${item.href}" data-route="${item.href.replace('#', '')}" 
           class="${baseClasses} xl:px-4 px-3 group-hover:px-4 py-3 ${activeClasses}">
          <i class="${item.icon} w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                     xl:mr-4 mr-0 group-hover:mr-4"></i>
          <span class="font-medium overflow-hidden transition-all duration-300
                      xl:opacity-100 xl:w-auto
                      opacity-0 w-0
                      group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">${item.label}</span>
        </a>
      `;
    }
  }

  setupMobileMenu() {
    // Component-level clicks for desktop/tablet nav
    this.addEventListener('click', this.handleMenuClick.bind(this));
    // Only need ESC key globally
    document.addEventListener('keydown', this.handleKeyDown);
  }

  cleanupMobileMenu() {
    document.removeEventListener('keydown', this.handleKeyDown);
    // Remove body layer if it exists
    if (this._mobileLayer && this._mobileLayer.parentNode) {
      this._mobileLayer.parentNode.removeChild(this._mobileLayer);
    }
    this._mobileLayer = null;
    this._backdropEl = null;
    this._drawerEl = null;
  }

  handleMenuClick(e) {
    const backdrop = e.target.closest('[data-mobile-backdrop]');
    const closeBtn = e.target.closest('.mobile-close-btn');
    const navItem = e.target.closest('.nav-item');

    if (backdrop || closeBtn) {
      e.preventDefault();
      this.closeMobileMenu();
    } else if (navItem) {
      // Handle SPA navigation
      const route = navItem.getAttribute('data-route');
      if (route && window.WebropolSPA) {
        e.preventDefault();
        window.WebropolSPA.navigate(route);
      }

      // Close mobile menu after navigation
      if (this.isMobile) {
        setTimeout(() => this.closeMobileMenu(), 150);
      }
    }
  }

  // Outside click handling is managed on the body-layer elements.

  handleKeyDown(e) {
    if (e.key === 'Escape' && this.getBoolAttr('mobile-open')) {
      this.closeMobileMenu();
    }
  }

  openMobileMenu() {
    console.log('Sidebar: openMobileMenu called');
    this.setAttribute('mobile-open', 'true');
  // Ensure body-layer exists and sync open state
  const navItems = this.generateNavigationItems(this.getAttr('active', 'home'), (p) => p);
  this.syncBodyLayer(navItems, true);
    this.emit('mobile-menu-opened');
  }

  closeMobileMenu() {
    console.log('Sidebar: closeMobileMenu called');
    this.setAttribute('mobile-open', 'false');
  const navItems = this.generateNavigationItems(this.getAttr('active', 'home'), (p) => p);
  this.syncBodyLayer(navItems, false);
    this.emit('mobile-menu-closed');
  }

  toggleMobileMenu() {
    console.log('Sidebar: toggleMobileMenu called, current state:', this.getBoolAttr('mobile-open'));
    if (this.getBoolAttr('mobile-open')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  updateMobileState() {
    // This method is no longer needed since we're using inline styles
    // The state is managed through re-rendering
  }

  addEventListeners() {
    // Add collapsing functionality for desktop/tablet
    if (!this.isMobile) {
      const items = this.querySelectorAll('.nav-item');
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          const route = item.getAttribute('data-route');
          if (route && window.WebropolSPA) {
            e.preventDefault();
            window.WebropolSPA.navigate(route);
          }

          // Collapse on small screens after navigation
          if (window.innerWidth <= 1280) {
            setTimeout(() => {
              const sc = this.querySelector('.sidebar-container');
              if (!sc) return;
              sc.classList.remove('hover:w-72');
              setTimeout(() => sc.classList.add('hover:w-72'), 100);
            }, 150);
          }
        });
      });
    }
  }
}

customElements.define('webropol-sidebar-enhanced', WebropolSidebarEnhanced);

