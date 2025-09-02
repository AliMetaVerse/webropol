/**
 * Mobile-Enhanced Webropol Sidebar Component
 * Navigation sidebar with mobile drawer pattern
 * Features: Desktop sidebar + Mobile drawer with backdrop
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolSidebarEnhanced extends BaseComponent {
  static get observedAttributes() {
  return ['active', 'base', 'mobile-open', 'collapsed'];
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
  // Collapsed launcher button (desktop)
  this._collapsedLauncher = null;
  // Route sync
  this.handleHashChange = this.handleHashChange.bind(this);
  // Header watcher to remove body launcher when header exists
  this._headerObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Sidebar: Connected to DOM');
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport);
    this.setupMobileMenu();
    // Sync active item from current route and listen for changes
    window.addEventListener('hashchange', this.handleHashChange);
    // Initialize active attribute if missing
    const initialActive = this.getAttr('active') || this.getActiveIdFromHash();
    if (initialActive && initialActive !== this.getAttr('active')) {
      this.setAttribute('active', initialActive);
    }
    // Restore collapsed preference on desktop only
    try {
      const saved = localStorage.getItem('webropol.sidebar.collapsed');
      if (saved !== null) {
        const wantCollapsed = saved === 'true';
        // Apply only for desktop states
        if (!this.isMobile && !this.isTablet) {
          if (wantCollapsed) {
            this.setAttribute('collapsed', 'true');
          } else {
            this.removeAttribute('collapsed');
          }
        }
      }
    } catch (_) {}
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.checkViewport);
    this.cleanupMobileMenu();
    window.removeEventListener('hashchange', this.handleHashChange);
    if (this._headerObserver) {
      try { this._headerObserver.disconnect(); } catch {}
      this._headerObserver = null;
    }
  }

  // Method to refresh sidebar when module settings change
  refreshSidebar() {
    const active = this.getAttr('active') || 'home';
    this.render();
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
      } else if (name === 'collapsed') {
        // Toggle collapsed state on desktop
        this.render();
        // When collapsing on desktop, immediately show the overlay menu; when expanding, close it
        if (!this.isMobile && !this.isTablet) {
          if (this.getBoolAttr('collapsed')) {
            try { this.openMobileMenu(); } catch {}
          } else {
            try { this.closeMobileMenu(); } catch {}
          }
        }
  // Persist preference
  try { localStorage.setItem('webropol.sidebar.collapsed', this.getBoolAttr('collapsed') ? 'true' : 'false'); } catch (_) {}
      } else {
        this.render();
      }
    }
  }

  render() {
    const active = this.getAttr('active') || this.getActiveIdFromHash() || 'home';
    const base = this.getAttr('base', '');
    const mobileOpen = this.getBoolAttr('mobile-open');
  const collapsed = this.getBoolAttr('collapsed');
    
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
      // No launcher on mobile
      this.removeCollapsedLauncher();
    } else if (this.isTablet) {
      this.innerHTML = this.renderTabletSidebar(navigationItems);
      this.style.display = '';
      this.removeCollapsedLauncher();
    } else {
      if (collapsed) {
        // Hide sidebar; provide launcher to open menu
        this.innerHTML = '';
        this.style.display = 'none';
        // If a header exists, it will provide the hamburger; skip body launcher
        if (!this.hasHeader()) {
          this.createCollapsedLauncher();
        } else {
          this.removeCollapsedLauncher();
        }
        // Ensure overlay has current items but closed
        this.syncBodyLayer(navigationItems, false);
      } else {
        this.style.display = '';
        this.innerHTML = this.renderDesktopSidebar(navigationItems);
        this.removeCollapsedLauncher();
      }
    }

    this.addEventListeners();

    // Watch for header insertion/removal to keep launcher hidden when header is present
    this.ensureHeaderObserver();
  }

  hasHeader() {
    return !!document.querySelector('webropol-header, webropol-header-enhanced');
  }

  // Map location.hash to our known nav ids
  getActiveIdFromHash() {
    const h = (window.location.hash || '#/home').toLowerCase();
    if (h === '' || h === '#' || h === '#/' || h.startsWith('#/home')) return 'home';
    if (h.startsWith('#/surveys')) return 'surveys';
    if (h.startsWith('#/events')) return 'events';
    if (h.startsWith('#/sms')) return 'sms';
    if (h.startsWith('#/exw')) return 'exw';
    if (h.startsWith('#/case-management')) return 'case-management';
    if (h.startsWith('#/mywebropol')) return 'mywebropol';
    if (h.startsWith('#/admin-tools')) return 'admin-tools';
    if (h.startsWith('#/training-videos')) return 'training-videos';
    if (h.startsWith('#/shop')) return 'shop';
    return 'home';
  }

  handleHashChange() {
    const active = this.getActiveIdFromHash();
    // Update attribute so desktop/tablet re-render and mobile sync updates
    if (this.getAttr('active') !== active) {
      this.setAttribute('active', active);
    } else if (this.isMobile && this.getBoolAttr('mobile-open')) {
      // Ensure open mobile drawer updates highlight too
      const navItems = this.generateNavigationItems(active, (p) => p);
      this.syncBodyLayer(navItems, true);
    }
  }

  generateNavigationItems(active, link) {
    // Get module settings from global settings manager
    const getModuleSettings = () => {
      try {
        return window.globalSettingsManager?.getAllSettings()?.modules || {};
      } catch {
        return {};
      }
    };

    const modules = getModuleSettings();
    
    // Default all modules to enabled if settings don't exist
    const isModuleEnabled = (moduleKey) => modules[moduleKey] !== false;

    const allItems = [
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
        active: active === 'surveys',
        moduleKey: 'surveysEnabled'
      },
      {
        id: 'events',
        href: '#/events/list',
        icon: 'fal fa-calendar-alt',
        label: 'Events',
        active: active === 'events',
        moduleKey: 'eventsEnabled'
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
        active: active === 'mywebropol',
        moduleKey: 'mywebropolEnabled'
      },
      {
        id: 'admin-tools',
        href: '#/admin-tools',
        icon: 'fal fa-tools',
        label: 'Admin Tools',
        active: active === 'admin-tools',
        moduleKey: 'adminToolsEnabled'
      },
      {
        id: 'training-videos',
        href: '#/training-videos',
        icon: 'fal fa-video',
        label: 'Training Videos',
        active: active === 'training-videos',
        moduleKey: 'trainingEnabled'
      },
      {
        id: 'shop',
        href: '#/shop',
        icon: 'fal fa-shopping-cart',
        label: 'Shop',
        active: active === 'shop',
        moduleKey: 'shopEnabled'
      }
    ];

    // Filter out disabled modules
    return allItems.filter(item => {
      // Always show dividers and items without moduleKey (like Home)
      if (item.type === 'divider' || !item.moduleKey) {
        return true;
      }
      // Check if module is enabled
      return isModuleEnabled(item.moduleKey);
    });
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
  // Start disabled and behind everything; we only raise z-index when open
  layer.style.zIndex = '-1';
  layer.style.pointerEvents = 'none';
  layer.style.display = 'block';

      const backdrop = document.createElement('div');
      backdrop.setAttribute('data-mobile-backdrop', '');
      backdrop.style.position = 'fixed';
      backdrop.style.inset = '0';
      backdrop.style.background = 'rgba(0,0,0,0.5)';
      backdrop.style.opacity = '0';
      backdrop.style.visibility = 'hidden';
      backdrop.style.transition = 'opacity 0.3s ease';
  // Backdrop should not catch events until menu is open
  backdrop.style.pointerEvents = 'none';

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
        // Enable interactions and bring layer to front
        this._mobileLayer.style.zIndex = '2147483647';
        this._mobileLayer.style.pointerEvents = 'auto';
        this._backdropEl.style.pointerEvents = 'auto';
        this._backdropEl.style.opacity = '1';
        this._backdropEl.style.visibility = 'visible';
        this._drawerEl.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
      } else {
        // Hide interactions and send layer behind everything
        this._mobileLayer.style.pointerEvents = 'none';
        this._mobileLayer.style.zIndex = '-1';
        this._backdropEl.style.pointerEvents = 'none';
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
          <div class="flex items-center min-w-0 flex-1">
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
          <button class="sidebar-collapse-btn ml-2 w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all" title="Hide sidebar" aria-label="Hide sidebar">
            <i class="fal fa-angle-double-left"></i>
          </button>
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
  <a href="${item.href}" data-route="${item.href.replace('#', '')}" data-id="${item.id}" 
           class="${baseClasses} px-4 py-3 mx-4 mb-1 ${activeClasses}">
          <i class="${item.icon} w-5 mr-4 group-hover/item:scale-110 transition-transform"></i>
          <span class="font-medium">${item.label}</span>
        </a>
      `;
    } else if (viewType === 'tablet') {
      return `
  <a href="${item.href}" data-route="${item.href.replace('#', '')}" data-id="${item.id}" 
           class="${baseClasses} px-3 py-3 mx-2 group-hover:px-4 group-hover:mx-4 transition-all duration-300 ${activeClasses}">
          <i class="${item.icon} w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform"></i>
          <span class="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium whitespace-nowrap">${item.label}</span>
        </a>
      `;
    } else {
      return `
  <a href="${item.href}" data-route="${item.href.replace('#', '')}" data-id="${item.id}" 
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
      const id = navItem.getAttribute('data-id');
      if (route && window.WebropolSPA) {
        e.preventDefault();
        window.WebropolSPA.navigate(route);
      }
      if (id) {
        this.setAttribute('active', id);
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
  const activeId = this.getAttr('active') || this.getActiveIdFromHash() || 'home';
  const navItems = this.generateNavigationItems(activeId, (p) => p);
  this.syncBodyLayer(navItems, true);
    this.emit('mobile-menu-opened');
  }

  closeMobileMenu() {
    console.log('Sidebar: closeMobileMenu called');
    this.setAttribute('mobile-open', 'false');
  const activeId = this.getAttr('active') || this.getActiveIdFromHash() || 'home';
  const navItems = this.generateNavigationItems(activeId, (p) => p);
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

  // ===== Collapsed (desktop) handling =====
  collapseSidebar() {
    if (this.isMobile || this.isTablet) return;
    this.setAttribute('collapsed', 'true');
  }

  expandSidebar() {
    this.removeAttribute('collapsed');
  }

  toggleCollapsedSidebar() {
    if (this.getBoolAttr('collapsed')) this.expandSidebar(); else this.collapseSidebar();
  }

  createCollapsedLauncher() {
  // Do not create if a header exists; header provides its own hamburger
  if (this.hasHeader()) { this.removeCollapsedLauncher(); return; }
    if (this._collapsedLauncher) return;
    const btn = document.createElement('button');
    btn.setAttribute('data-sidebar-launcher', '');
    btn.title = 'Open menu / Show sidebar';
    btn.setAttribute('aria-label', 'Open menu');
    Object.assign(btn.style, {
      position: 'fixed',
      top: '84px',
      left: '16px',
      zIndex: '2147483646'
    });
    btn.className = 'w-10 h-10 flex items-center justify-center rounded-xl bg-white text-webropol-gray-600 border border-webropol-gray-200 shadow-md hover:text-webropol-teal-600 hover:border-webropol-teal-300 hover:shadow-lg transition-all';
    btn.innerHTML = '<i class="fal fa-bars"></i>';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.openMobileMenu();
    });
    document.body.appendChild(btn);
    this._collapsedLauncher = btn;
  }

  removeCollapsedLauncher() {
    if (this._collapsedLauncher && this._collapsedLauncher.parentNode) {
      this._collapsedLauncher.parentNode.removeChild(this._collapsedLauncher);
    }
    this._collapsedLauncher = null;
  }

  ensureHeaderObserver() {
    if (this._headerObserver) return;
    try {
      this._headerObserver = new MutationObserver(() => {
        if (this.hasHeader()) {
          this.removeCollapsedLauncher();
        } else if (this.getBoolAttr('collapsed') && !this.isMobile && !this.isTablet) {
          this.createCollapsedLauncher();
        }
      });
      this._headerObserver.observe(document.body, { childList: true, subtree: true });
    } catch {}
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
      // Collapse button in desktop header
      const collapseBtn = this.querySelector('.sidebar-collapse-btn');
      if (collapseBtn) {
        collapseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.collapseSidebar();
        });
      }
    }
  }
}

customElements.define('webropol-sidebar-enhanced', WebropolSidebarEnhanced);

