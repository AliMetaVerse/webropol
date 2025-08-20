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

    const currentTheme = ThemeManager.getCurrentTheme();
    const allThemes = ThemeManager.getAllThemes();

    this.innerHTML = `
      <header class="min-h-[5rem] h-20 glass-effect border-b border-webropol-gray-200/50 flex items-center justify-between px-8 shadow-soft relative z-40">
        <div class="flex items-center space-x-4">
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
                <button class="flex items-center text-webropol-gray-700 hover:text-webropol-teal-600 transition-colors group">
                  <div class="w-8 h-8 bg-sun-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white text-sm font-semibold">${username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span class="mr-2 font-medium">${username}</span>
                  <i class="fal fa-chevron-down text-xs group-hover:rotate-180 transition-transform"></i>
                </button>
                
                <!-- Dropdown menu (hidden by default) -->
                <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-webropol-gray-200 py-2 opacity-0 invisible transition-all duration-200 user-dropdown z-[9999]">
                  <a href="#" class="flex items-center px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50">
                    <i class="fal fa-user-circle w-4 mr-3"></i>
                    Profile
                  </a>
                  <a href="#" class="flex items-center px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50">
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
  }

  addDropdownListeners() {
    const userButton = this.querySelector('button:has(.fa-chevron-down)');
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
}

customElements.define('webropol-header', WebropolHeader);

