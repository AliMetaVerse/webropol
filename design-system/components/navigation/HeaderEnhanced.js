/**
 * Mobile-Enhanced Webropol Header Component
 * Top navigation header with mobile menu toggle and responsive controls
 */

import { BaseComponent } from '../../utils/base-component.js';
import { WebropolHeader as LegacyHeader } from './Header.js';

export class WebropolHeader extends BaseComponent {
  static get observedAttributes() {
  return ['username', 'title', 'show-notifications', 'show-help', 'show-user-menu', 'show-feedback'];
  }

  constructor() {
    super();
    this.isMobile = false;
    this.checkViewport = this.checkViewport.bind(this);
  this._dropdownLayer = null;
  this._activeDropdown = null; // 'user' | 'notifications' | 'help' | null
  this.handleDocClick = this.handleDocClick.bind(this);
  this.handleKeyDown = this.handleKeyDown.bind(this);
  // Legacy feedback reuse
  this._legacyHost = null; // instance of legacy header to reuse feedback dropdown
  this._legacyFeedbackEl = null; // reference to moved dropdown element
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.checkViewport);
  document.removeEventListener('click', this.handleDocClick, true);
  document.removeEventListener('keydown', this.handleKeyDown, true);
  this.destroyDropdownLayer();
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
  const showFeedback = this.hasAttribute('show-feedback') ? this.getBoolAttr('show-feedback') : true;

    console.log('Header: Rendering - isMobile:', this.isMobile, 'width:', window.innerWidth);

    if (this.isMobile) {
      console.log('Header: Rendering mobile header');
      this.innerHTML = this.renderMobileHeader(username, title, showNotifications, showHelp, showUserMenu, showFeedback);
    } else {
      // On desktop, delegate to the full-featured legacy header to preserve all elements
      console.log('Header: Rendering legacy desktop header via proxy');
      const notifAttr = showNotifications ? ' show-notifications' : '';
      const helpAttr = showHelp ? ' show-help' : '';
      const userAttr = showUserMenu !== false ? ' show-user-menu' : '';
      const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
      const usernameAttr = ` username="${username.replace(/"/g, '&quot;')}"`;
      // Legacy header supports theme selector and feedback menus; keep them on
      this.innerHTML = `
        <webropol-header${usernameAttr}${titleAttr}${notifAttr}${helpAttr}${userAttr} show-theme-selector>
          <!-- Optional projected areas if used in pages -->
          <slot name="title"></slot>
          <slot name="left"></slot>
          <slot name="actions"></slot>
          <slot name="right"></slot>
        </webropol-header>
      `;
    }

    this.addEventListeners();
  }

  renderMobileHeader(username, title, showNotifications, showHelp, showUserMenu, showFeedback) {
    return `
      <header class="mobile-header h-16 bg-white/95 backdrop-blur-xl border-b border-webropol-gray-200/50 flex items-center justify-between px-4 shadow-soft sticky top-0"
              style="z-index: var(--z-mobile-header);">
        <!-- Mobile Left Section -->
        <div class="flex items-center space-x-3">
          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle w-10 h-10 flex items-center justify-center text-webropol-gray-600 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-lg transition-all duration-200"
                  aria-label="Toggle navigation menu">
            <i class="fal fa-bars text-lg"></i>
          </button>
          
          <!-- Mobile Logo -->
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-br from-webropol-primary-500 to-webropol-primary-600 rounded-lg flex items-center justify-center">
              <i class="fa-light fa-user-magnifying-glass text-white text-sm"></i>
            </div>
            ${title ? `<span class="ml-2 font-semibold text-webropol-gray-900 text-sm truncate max-w-[120px]">${title}</span>` : ''}
          </div>
        </div>
        
        <!-- Mobile Right Section -->
        <div class="flex items-center space-x-2">
          ${showFeedback ? `
            <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-lg transition-all duration-200" aria-label="Feedback">
              <i class="fal fa-star text-lg"></i>
            </button>
          ` : ''}
          ${showNotifications ? `
            <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-lg transition-all duration-200">
              <i class="fal fa-bell text-lg"></i>
            </button>
          ` : ''}
          
          ${showHelp ? `
            <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-lg transition-all duration-200">
              <i class="fal fa-question-circle text-lg"></i>
            </button>
          ` : ''}
          
          ${showUserMenu !== false ? `
            <button class="mobile-user-menu flex items-center px-3 py-2 text-webropol-gray-700 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-lg transition-all duration-200">
              <div class="w-6 h-6 bg-gradient-to-br from-webropol-primary-500 to-webropol-primary-600 rounded-full flex items-center justify-center mr-2">
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
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-xl transition-all duration-200 relative">
                <i class="fal fa-bell text-lg"></i>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-webropol-red-500 rounded-full opacity-0 animate-pulse"></span>
              </button>
            ` : ''}
            
            ${showHelp ? `
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-xl transition-all duration-200">
                <i class="fal fa-question-circle text-lg"></i>
              </button>
            ` : ''}
            
            <slot name="actions"></slot>
            
            ${showUserMenu !== false ? `
              <div class="relative">
                <button class="desktop-user-menu flex items-center px-4 py-2 text-webropol-gray-700 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-xl transition-all duration-200 group">
                  <div class="w-8 h-8 bg-gradient-to-br from-webropol-primary-500 to-webropol-primary-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
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
    // Desktop uses the legacy header implementation with its own listeners
    if (!this.isMobile) {
      // Ensure our mobile-only dropdown layer is torn down
      this.destroyDropdownLayer();
      return;
    }
    
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
  const notificationIcon = this.querySelector('button .fa-bell');
    if (notificationIcon) {
      const btn = notificationIcon.parentElement;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown('notifications', btn);
      });
    }
    
    // Feedback button → reuse existing flows
  const feedbackIcon = this.querySelector('button .fa-star');
    if (feedbackIcon) {
      const btn = feedbackIcon.parentElement;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.emit('feedback-click');
  // Prefer the legacy dropdown UI when possible
  this.openDropdown('legacy-feedback', btn);
      });
    }

    // Help button
  const helpIcon = this.querySelector('button .fa-question-circle');
    if (helpIcon) {
      const btn = helpIcon.parentElement;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown('help', btn);
      });
    }

    // User menu buttons
  const userMenuBtns = this.querySelectorAll('.mobile-user-menu, .desktop-user-menu');
    userMenuBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown('user', btn);
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

  // ===== Dropdowns (body-level) =====
  ensureDropdownLayer() {
    if (this._dropdownLayer) return this._dropdownLayer;
    const layer = document.createElement('div');
    layer.setAttribute('data-header-layer', '');
    layer.style.position = 'fixed';
    layer.style.inset = '0';
    layer.style.pointerEvents = 'none';
    layer.style.zIndex = '2147483646';
    document.body.appendChild(layer);
    this._dropdownLayer = layer;
    // Global listeners for outside click and ESC
    document.addEventListener('click', this.handleDocClick, true);
    document.addEventListener('keydown', this.handleKeyDown, true);
    return layer;
  }

  destroyDropdownLayer() {
    if (this._dropdownLayer && this._dropdownLayer.parentNode) {
      this._dropdownLayer.parentNode.removeChild(this._dropdownLayer);
    }
    this._dropdownLayer = null;
    this._activeDropdown = null;
  }

  handleDocClick(e) {
    if (!this._dropdownLayer || !this._activeDropdown) return;
    const dropdown = this._dropdownLayer.querySelector('[data-dropdown]');
    if (!dropdown) return;
    if (dropdown.contains(e.target)) return; // clicks inside allowed
    // Also ignore clicks on the anchor buttons within this header
    const isHeaderClick = this.contains(e.target);
    if (isHeaderClick) return;
  this.closeDropdown();
  }

  handleKeyDown(e) {
    if (e.key === 'Escape' && this._activeDropdown) {
      this.closeDropdown();
    }
  }

  toggleDropdown(type, anchorBtn) {
    if (this._activeDropdown === type) {
      this.closeDropdown();
    } else {
      this.openDropdown(type, anchorBtn);
    }
  }

  openDropdown(type, anchorBtn) {
    const layer = this.ensureDropdownLayer();
    // Clear previous
    layer.innerHTML = '';

  const rect = anchorBtn.getBoundingClientRect();
    const dropdown = document.createElement('div');
    dropdown.setAttribute('data-dropdown', type);
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${Math.round(rect.bottom + 8)}px`;
    // Align right edge with button when possible
  const width = type === 'user' ? 192 : 320; // px
    const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
    dropdown.style.left = `${Math.round(left)}px`;
    dropdown.style.width = `${width}px`;
    dropdown.style.pointerEvents = 'auto';
    dropdown.className = 'bg-white rounded-xl shadow-lg border border-webropol-gray-200 p-2 opacity-0 translate-y-1 transition-all duration-150';

    // Content per type (lightweight)
    if (type === 'user') {
      dropdown.innerHTML = `
        <button data-action="profile" class="w-full text-left px-3 py-2 rounded-lg text-webropol-gray-700 hover:bg-webropol-primary-50">Profile</button>
        <button data-action="settings" class="w-full text-left px-3 py-2 rounded-lg text-webropol-gray-700 hover:bg-webropol-primary-50">Settings</button>
        <div class="my-1 border-t border-webropol-gray-200"></div>
        <button data-action="signout" class="w-full text-left px-3 py-2 rounded-lg text-webropol-gray-700 hover:bg-webropol-primary-50">Sign out</button>
      `;
    } else if (type === 'notifications') {
      dropdown.innerHTML = `
        <div class="px-3 py-2 text-sm font-semibold text-webropol-gray-600">Notifications</div>
        <div class="max-h-64 overflow-auto">
          <div class="px-3 py-2 rounded-lg hover:bg-webropol-primary-50 text-webropol-gray-700">No new notifications</div>
        </div>
      `;
  } else if (type === 'help') {
      dropdown.innerHTML = `
        <div class="px-3 py-2 text-sm font-semibold text-webropol-gray-600">Help</div>
        <a class="block px-3 py-2 rounded-lg text-webropol-gray-700 hover:bg-webropol-primary-50" href="#/training-videos">Training Videos</a>
        <a class="block px-3 py-2 rounded-lg text-webropol-gray-700 hover:bg-webropol-primary-50" href="#/docs">Documentation</a>
        <a class="block px-3 py-2 rounded-lg text-webropol-gray-700 hover:bg-webropol-primary-50" href="#/support">Contact Support</a>
      `;
    } else if (type === 'legacy-feedback') {
      // Reuse the legacy header's feedback dropdown
      if (!this._legacyHost) {
        try {
          this._legacyHost = new LegacyHeader();
          // Render builds DOM and attaches listeners internally
          this._legacyHost.render();
        } catch (err) {
          console.error('Legacy header init failed:', err);
        }
      }
      const legacy = this._legacyHost || document.querySelector('webropol-header');
      const feedback = legacy && legacy.querySelector('.feedback-dropdown');
      if (feedback) {
        // Prepare element for body-layer use
        this._legacyFeedbackEl = feedback;
        this._legacyFeedbackEl.setAttribute('data-dropdown', 'legacy-feedback');
        this._legacyFeedbackEl.style.position = 'fixed';
        this._legacyFeedbackEl.style.top = `${Math.round(rect.bottom + 8)}px`;
        const w = 384; // match w-96
        const l = Math.min(Math.max(8, rect.right - w), window.innerWidth - w - 8);
        this._legacyFeedbackEl.style.left = `${Math.round(l)}px`;
        this._legacyFeedbackEl.style.width = `${w}px`;
        this._legacyFeedbackEl.style.pointerEvents = 'auto';
        this._legacyFeedbackEl.classList.remove('opacity-0', 'invisible');

        // Append into layer and skip our default dropdown
        layer.appendChild(this._legacyFeedbackEl);
        this._activeDropdown = 'legacy-feedback';
        // Tailwind refresh
        if (window.tailwind && typeof window.tailwind.refresh === 'function') {
          try { window.tailwind.refresh(); } catch {}
        }
        return; // early exit since we used the existing element
      } else {
        console.warn('Legacy feedback dropdown not found; falling back to promo');
        // Fallback to promo to avoid broken UX
        let promo = document.querySelector('webropol-promo');
        if (!promo) { promo = document.createElement('webropol-promo'); document.body.appendChild(promo); }
        promo.setAttribute('mode', 'feedback');
        promo.setAttribute('open', 'true');
        return;
      }
    }

    // Animate in
    requestAnimationFrame(() => {
      dropdown.classList.remove('opacity-0', 'translate-y-1');
      dropdown.classList.add('opacity-100', 'translate-y-0');
    });

    layer.appendChild(dropdown);
    this._activeDropdown = type;

    // Wire actions for user dropdown (open settings)
    if (type === 'user') {
      const settingsBtn = dropdown.querySelector('button[data-action="settings"]');
      if (settingsBtn) {
        settingsBtn.addEventListener('click', async (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          // Close the dropdown first so it doesn't overlay the modal
          this.closeDropdown();
          try {
            if (typeof window !== 'undefined' && typeof window.openGlobalSettings === 'function') {
              window.openGlobalSettings();
              return;
            }
            if (typeof window !== 'undefined' && window.globalSettingsManager && typeof window.globalSettingsManager.openSettingsModal === 'function') {
              window.globalSettingsManager.openSettingsModal();
              return;
            }
            if (typeof customElements !== 'undefined' && !customElements.get('webropol-settings-modal')) {
              try { await import('../modals/SettingsModal.js'); } catch (_) {}
            }
            let modal = document.querySelector('webropol-settings-modal');
            if (!modal) {
              modal = document.createElement('webropol-settings-modal');
              document.body.appendChild(modal);
            }
            if (typeof modal.open === 'function') { modal.open(); } else { modal.setAttribute('open', ''); }
          } catch (err) {
            document.dispatchEvent(new CustomEvent('settings-open'));
          }
        });
      }
    }

    // Tailwind play CDN refresh for dynamic classes
    if (window.tailwind && typeof window.tailwind.refresh === 'function') {
      try { window.tailwind.refresh(); } catch {}
    }
  }

  closeDropdown() {
    if (!this._dropdownLayer) return;
    const dropdown = this._dropdownLayer.querySelector('[data-dropdown]');
    if (dropdown) {
      dropdown.classList.add('opacity-0', 'translate-y-1');
      setTimeout(() => {
        if (dropdown && dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
        // If we moved the legacy feedback element, reattach it to its host for reuse
        if (this._activeDropdown === 'legacy-feedback' && this._legacyFeedbackEl && this._legacyHost) {
          try {
            // Restore classes and positioning for next use
            this._legacyFeedbackEl.classList.add('opacity-0', 'invisible');
            this._legacyFeedbackEl.style.position = '';
            this._legacyFeedbackEl.style.top = '';
            this._legacyFeedbackEl.style.left = '';
            this._legacyFeedbackEl.style.width = '';
            this._legacyFeedbackEl.style.pointerEvents = '';
            this._legacyHost.appendChild(this._legacyFeedbackEl);
          } catch {}
        }
      }, 150);
    }
    this._activeDropdown = null;
  }
}

// Register the component
customElements.define('webropol-header-enhanced', WebropolHeader);

