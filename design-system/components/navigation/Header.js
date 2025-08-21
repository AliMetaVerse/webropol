/**
 * Webropol Header Component
 * Top navigation header with user info and controls
 */

import { BaseComponent } from '../../utils/base-component.js';
import { ThemeManager } from '../../utils/theme-manager.js';

export class WebropolHeader extends BaseComponent {
  static get observedAttributes() {
    return ['username', 'title', 'show-notifications', 'show-help', 'show-user-menu', 'show-theme-selector'];
  }

  render() {
    const username = this.getAttr('username', 'Ali Al-Zuhairi');
    const title = this.getAttr('title');
    const showNotifications = this.getBoolAttr('show-notifications');
    const showHelp = this.getBoolAttr('show-help');
    const showUserMenu = this.getBoolAttr('show-user-menu');
    const showThemeSelector = this.getBoolAttr('show-theme-selector', true); // Default to true

    // Determine whether to show the header Create menu from global settings (default: true)
    const showCreateMenu = (typeof window !== 'undefined' && window.globalSettingsManager && typeof window.globalSettingsManager.getSetting === 'function')
      ? !!window.globalSettingsManager.getSetting('showHeaderCreateMenu')
      : true;

    const currentTheme = ThemeManager.getCurrentTheme();
    const allThemes = ThemeManager.getAllThemes();

    this.innerHTML = `
      <header class="min-h-[5rem] h-20 glass-effect border-b border-webropol-gray-200/50 flex items-center justify-between px-8 shadow-soft relative z-40">
        <div class="flex items-center space-x-4">
          ${showCreateMenu ? `
            <div class="relative" data-create-menu>
              <button class="p-6 h-10 inline-flex items-center justify-center text-white bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 hover:from-webropol-teal-600 hover:to-webropol-teal-700 rounded-xl transition-all create-menu-btn">
                <i class="fal fa-plus mr-2"></i>
                <span>Create</span>
              </button>
              <!-- Create dropdown -->
              <div class="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-webropol-gray-200 py-2 opacity-0 invisible transition-all duration-200 create-menu-dropdown z-[9999]">
                <div class="px-4 py-2 text-xs uppercase tracking-wide text-webropol-gray-500">Create new</div>
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="surveys">
                  <i class="fal fa-chart-bar text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">Surveys</div>
                    <div class="text-xs text-webropol-gray-500">Custom surveys</div>
                  </div>
                </button>
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="events">
                  <i class="fal fa-calendar-alt text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">Events</div>
                    <div class="text-xs text-webropol-gray-500">Event management</div>
                  </div>
                </button>
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="exw-surveys">
                  <i class="fal fa-chart-line text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">EXW Surveys</div>
                    <div class="text-xs text-webropol-gray-500">Employee experience</div>
                  </div>
                </button>
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="employee">
                  <i class="fal fa-users text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">Employee</div>
                    <div class="text-xs text-webropol-gray-500">HR management</div>
                  </div>
                </button>
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="campaign">
                  <i class="fal fa-bullhorn text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">Campaign</div>
                    <div class="text-xs text-webropol-gray-500">Marketing campaigns</div>
                  </div>
                </button>
              </div>
            </div>
          ` : ''}
          ${title ? `
            <h1 class="text-xl font-semibold text-webropol-gray-900">${title}</h1>
          ` : ''}
          <slot name="title"></slot>
          <slot name="left"></slot>
        </div>
        
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3">
            ${showThemeSelector ? `
              <div class="relative">
                <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all theme-selector-btn">
                  <i class="fal ${ThemeManager.getThemeConfig(currentTheme)?.icon || 'fa-palette'}"></i>
                </button>
                
                <!-- Theme dropdown -->
                <div class="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-webropol-gray-200 py-2 opacity-0 invisible transition-all duration-200 theme-dropdown z-[9999]">
                  ${allThemes.map(theme => `
                    <button class="flex items-center w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 theme-option ${theme.key === currentTheme ? 'bg-webropol-teal-50 text-webropol-teal-700' : ''}" data-theme="${theme.key}">
                      <i class="fal ${theme.icon} w-4 mr-3"></i>
                      ${theme.name}
                      ${theme.key === currentTheme ? '<i class="fal fa-check ml-auto"></i>' : ''}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${showNotifications ? `
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all relative">
                <i class="fal fa-bell"></i>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            ` : ''}
            
            ${showHelp ? `
              <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all">
                <i class="fal fa-question-circle"></i>
              </button>
            ` : ''}
            
            ${showUserMenu !== false ? `
              <div class="relative">
                <button class="flex items-center text-webropol-gray-700 hover:text-webropol-teal-600 transition-colors group" data-action="user-menu-toggle">
                  <div class="w-8 h-8 bg-sky-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-full flex items-center justify-center mr-3">
                    <span class="text-webropol-teal-800 text-sm font-semibold">${username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span class="mr-2 font-medium">${username}</span>
                  <i class="fal fa-chevron-down text-xs group-hover:rotate-180 transition-transform"></i>
                </button>
                
                <!-- Dropdown menu (hidden by default) -->
                <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-webropol-gray-200 py-2 opacity-0 invisible transition-all duration-200 user-dropdown z-[9999]">
                  <a href="#" data-action="profile" class="flex items-center px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50">
                    <i class="fal fa-user-circle w-4 mr-3"></i>
                    Profile
                  </a>
                  <a href="#" data-action="settings" class="flex items-center px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50">
                    <i class="fal fa-cog w-4 mr-3"></i>
                    Settings
                  </a>
                  <hr class="my-2 border-webropol-gray-200">
                  <a href="#" class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <i class="fal fa-sign-out-alt w-4 mr-3"></i>
                    Sign Out
                  </a>
                </div>
              </div>
            ` : ''}
            
            <slot name="actions"></slot>
          </div>
          <slot name="right"></slot>
        </div>
      </header>
    `;

    // Add dropdown functionality
    this.addDropdownListeners();
    this.addThemeListeners();
    this.addCreateMenuListeners();

    // Re-render header if global settings applied (to reflect visibility changes)
    if (!this._settingsListenerAdded) {
      window.addEventListener('webropol-settings-applied', () => {
        // Debounce minorly to avoid double renders
        clearTimeout(this._reRenderTimer);
        this._reRenderTimer = setTimeout(() => this.render(), 50);
      });
      this._settingsListenerAdded = true;
    }
  }

  addDropdownListeners() {
  const userButton = this.querySelector('button[data-action="user-menu-toggle"]');
    const dropdown = this.querySelector('.user-dropdown');

    if (userButton && dropdown) {
      userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = !dropdown.classList.contains('opacity-0');
        
        if (isVisible) {
          dropdown.classList.add('opacity-0', 'invisible');
        } else {
          dropdown.classList.remove('opacity-0', 'invisible');
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdown.classList.add('opacity-0', 'invisible');
      });

      // Prevent dropdown from closing when clicking inside it
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      // Handle settings link click
  const settingsLink = dropdown.querySelector('a[data-action="settings"]');
      if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Close dropdown
          dropdown.classList.add('opacity-0', 'invisible');
          
          // Try opening the global settings modal directly with graceful fallbacks
          try {
            // 1) Preferred: global helper if present
            if (typeof window !== 'undefined' && typeof window.openGlobalSettings === 'function') {
              window.openGlobalSettings();
            // 2) If a global manager exists
            } else if (typeof window !== 'undefined' && window.globalSettingsManager && typeof window.globalSettingsManager.openSettingsModal === 'function') {
              window.globalSettingsManager.openSettingsModal();
            // 3) Direct fallback: ensure element exists and open it
            } else if (typeof customElements !== 'undefined' && customElements.get('webropol-settings-modal')) {
              let modal = document.querySelector('webropol-settings-modal');
              if (!modal) {
                modal = document.createElement('webropol-settings-modal');
                document.body.appendChild(modal);
              }
              if (typeof modal.open === 'function') {
                modal.open();
              } else {
                modal.setAttribute('open', '');
              }
            } else {
              // 4) Last resort: emit event for any page-level listeners
              this.emit('settings-open');
            }
          } catch (err) {
            // As a safety net, still emit event
            this.emit('settings-open');
            console.warn('Failed to open settings modal directly, emitted settings-open instead:', err);
          }
        });
      }
    }
  }

  addThemeListeners() {
    const themeButton = this.querySelector('.theme-selector-btn');
    const themeDropdown = this.querySelector('.theme-dropdown');

    if (themeButton && themeDropdown) {
      themeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = !themeDropdown.classList.contains('opacity-0');
        
        // Close user dropdown if open
        const userDropdown = this.querySelector('.user-dropdown');
        if (userDropdown) {
          userDropdown.classList.add('opacity-0', 'invisible');
        }
        
        if (isVisible) {
          themeDropdown.classList.add('opacity-0', 'invisible');
        } else {
          themeDropdown.classList.remove('opacity-0', 'invisible');
        }
      });

      // Handle theme selection
      const themeOptions = this.querySelectorAll('.theme-option');
      themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const selectedTheme = option.getAttribute('data-theme');
          ThemeManager.setTheme(selectedTheme);
          themeDropdown.classList.add('opacity-0', 'invisible');
          
          // Re-render header to update active theme indicator
          setTimeout(() => this.render(), 100);
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        themeDropdown.classList.add('opacity-0', 'invisible');
      });

      // Prevent dropdown from closing when clicking inside it
      themeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  addCreateMenuListeners() {
    const createBtn = this.querySelector('.create-menu-btn');
    const createDropdown = this.querySelector('.create-menu-dropdown');

    if (createBtn && createDropdown) {
      // Toggle dropdown
      createBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = !createDropdown.classList.contains('opacity-0');
        if (isVisible) {
          createDropdown.classList.add('opacity-0', 'invisible');
        } else {
          createDropdown.classList.remove('opacity-0', 'invisible');
        }
      });

      // Item clicks
      const itemButtons = this.querySelectorAll('.create-item');
      itemButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const type = btn.getAttribute('data-type');
          // Emit event from component
          this.emit('create-item', { type, source: 'header' });
          // Also dispatch a global event for pages to listen to
          document.dispatchEvent(new CustomEvent('create-item', { detail: { type, source: 'header' } }));
          // Close dropdown
          createDropdown.classList.add('opacity-0', 'invisible');
        });
      });

      // Close on outside click
      document.addEventListener('click', () => {
        createDropdown.classList.add('opacity-0', 'invisible');
      });

      // Prevent close when clicking inside
      createDropdown.addEventListener('click', (e) => e.stopPropagation());
    }
  }
}

customElements.define('webropol-header', WebropolHeader);

