/**
 * Webropol Magical Header Component
 * Alternative top navigation header for the Magical UI view
 * Redesigned to include all classic header elements with a magical theme
 */

import { BaseComponent } from '../../utils/base-component.js';
import { ThemeManager } from '../../utils/theme-manager.js';
import { renderCreateMenu, bindCreateMenu } from '../interactive/CreateMenu.js';

export class WebropolMagicalHeader extends BaseComponent {
  static get observedAttributes() {
    return ['username', 'title', 'show-notifications', 'show-help', 'show-user-menu', 'show-theme-selector'];
  }

  render() {
    const username = this.getAttr('username', 'User');
    const title = this.getAttr('title', 'Magical Workspace');
    const showNotifications = this.getBoolAttr('show-notifications', true);
    const showHelp = this.getBoolAttr('show-help', true);
    const showUserMenu = this.getBoolAttr('show-user-menu', true);
    const showThemeSelector = this.getBoolAttr('show-theme-selector', true);

    // Determine whether to show the header Create menu from global settings (default: true)
    const showCreateMenu = (typeof window !== 'undefined' && window.globalSettingsManager && typeof window.globalSettingsManager.getSetting === 'function')
      ? !!window.globalSettingsManager.getSetting('showHeaderCreateMenu')
      : true;

    const currentTheme = ThemeManager.getCurrentTheme();
    const allThemes = ThemeManager.getAllThemes();

    this.innerHTML = `
      <header class="h-16 flex items-center justify-between px-6 relative z-40 text-slate-700 transition-all duration-300">
        
        <!-- Subtle Bottom Border -->
        <div class="absolute bottom-0 left-6 right-6 h-px bg-slate-200"></div>

        <!-- Left Section -->
        <div class="flex items-center space-x-3 relative z-10">
          
          <!-- Navigate Button -->
          <div class="relative" data-navigate-menu>
            <button class="navigate-menu-btn group flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-webropol-royalBlue-300 hover:text-webropol-royalBlue-600 hover:shadow-sm transition-all duration-200">
              <i class="fa-regular fa-compass text-slate-400 group-hover:text-webropol-royalBlue-500 transition-colors"></i>
              <span class="text-sm font-semibold tracking-wide">Navigate</span>
              <i class="fa-regular fa-chevron-down text-[10px] text-slate-300 group-hover:text-webropol-royalBlue-400 transition-colors ml-1"></i>
            </button>
            
            <div class="navigate-menu-dropdown absolute left-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 opacity-0 invisible transition-all duration-200 z-[9999] origin-top-left">
                <div class="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apps</div>
                
                <div class="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <a href="#/home" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-home text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">Home</span>
                    </a>
                    <a href="#/surveys/list" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-user-magnifying-glass text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">Surveys</span>
                    </a>
                    <a href="#/events/list" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-calendar-star text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">Events</span>
                    </a>
                    <a href="#/sms" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-sms text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">2-Way SMS</span>
                    </a>
                    <a href="#/exw" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-user-chart text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">EXW</span>
                    </a>
                    <a href="#/case-management" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-briefcase text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">Case Management</span>
                    </a>
                    
                    <div class="my-2 border-t border-slate-100 mx-5"></div>
                    <div class="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tools</div>

                    <a href="#/mywebropol" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-book-open text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">MyWebropol</span>
                    </a>
                    <a href="#/admin-tools" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-tools text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">Admin Tools</span>
                    </a>
                    <a href="#/training-videos" class="flex items-center px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-webropol-royalBlue-600 transition-colors group">
                        <span class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-webropol-royalBlue-50 transition-colors border border-slate-100 group-hover:border-webropol-royalBlue-100">
                            <i class="fa-regular fa-video text-slate-400 group-hover:text-webropol-royalBlue-500"></i>
                        </span>
                        <span class="font-medium">Training Videos</span>
                    </a>
                </div>
            </div>
          </div>

          <!-- Create Button -->
          ${showCreateMenu ? `
            <div class="relative" data-create-menu>
              <button class="create-menu-btn group flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-webropol-royalViolet-600 hover:shadow-lg hover:shadow-webropol-royalViolet-500/20 transition-all duration-200">
                <i class="fa-regular fa-plus text-white/70 group-hover:text-white transition-colors"></i>
                <span class="text-sm font-semibold tracking-wide">Create</span>
              </button>
              <div class="create-menu-dropdown absolute left-0 top-full mt-3 w-[26rem] transition-all duration-300 opacity-0 translate-y-1 pointer-events-none z-[9999]">
                ${renderCreateMenu()}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-1 relative z-10">
            
            <!-- Theme -->
            ${showThemeSelector ? `
              <div class="relative">
                <button class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all theme-selector-btn">
                  <i class="fa-regular ${ThemeManager.getThemeConfig(currentTheme)?.icon || 'fa-palette'} text-sm"></i>
                </button>
                <div class="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 opacity-0 invisible transition-all duration-200 theme-dropdown z-[9999]">
                  ${allThemes.map(theme => `
                    <button class="flex items-center w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 theme-option ${theme.key === currentTheme ? 'text-webropol-royalViolet-600 bg-slate-50 font-medium' : ''}" data-theme="${theme.key}">
                      <i class="fa-regular ${theme.icon} w-4 mr-2.5 text-[10px]"></i>
                      ${theme.name}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Notifications -->
            ${showNotifications ? `
              <button class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all relative">
                <i class="fa-regular fa-bell text-sm"></i>
                <span class="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
            ` : ''}

            <!-- Help -->
            ${showHelp ? `
              <button class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
                <i class="fa-regular fa-circle-question text-sm"></i>
              </button>
            ` : ''}

            <div class="w-px h-5 bg-slate-200 mx-2"></div>

            <!-- User -->
            ${showUserMenu ? `
            <div class="relative">
                <button class="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-all" data-action="user-menu-toggle">
                    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-webropol-royalViolet-500 to-webropol-royalBlue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        ${username.charAt(0)}
                    </div>
                    <i class="fa-regular fa-chevron-down text-[10px] text-slate-400"></i>
                </button>

                <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 opacity-0 invisible transition-all duration-200 user-dropdown z-[9999]">
                  <div class="px-3 py-2 border-b border-slate-100 mb-1">
                    <p class="text-xs text-slate-800 font-semibold">${username}</p>
                    <p class="text-[10px] text-slate-500">ali@webropol.com</p>
                  </div>
                  <a href="#" data-action="profile" class="flex items-center px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <i class="fa-regular fa-user w-4 mr-2.5 text-[10px] text-slate-400"></i>
                    Profile
                  </a>
                  <a href="#" data-action="settings" class="flex items-center px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <i class="fa-regular fa-gear w-4 mr-2.5 text-[10px] text-slate-400"></i>
                    Settings
                  </a>
                  <div class="my-1 border-t border-slate-100"></div>
                  <a href="#" class="flex items-center px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <i class="fa-regular fa-arrow-right-from-bracket w-4 mr-2.5 text-[10px]"></i>
                    Sign Out
                  </a>
                </div>
            </div>
            ` : ''}
        </div>
      </header>
    `;

    this.addNavigateListener();
    this.addDropdownListeners();
    this.addThemeListeners();
    this.addCreateMenuListeners();
    this.addNotificationsListener();
  }

  addNavigateListener() {
    const navBtn = this.querySelector('.navigate-menu-btn');
    const navDropdown = this.querySelector('.navigate-menu-dropdown');
    
    if (navBtn && navDropdown) {
      navBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = navDropdown.classList.contains('invisible');
        this.closeAllDropdowns();
        if (isHidden) {
          navDropdown.classList.remove('opacity-0', 'invisible', 'translate-y-1');
          navDropdown.classList.add('opacity-100', 'visible', 'translate-y-0');
        }
      });
    }
  }

  addDropdownListeners() {
    // User Menu Toggle
    const userBtn = this.querySelector('[data-action="user-menu-toggle"]');
    const userDropdown = this.querySelector('.user-dropdown');
    
    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = userDropdown.classList.contains('invisible');
        this.closeAllDropdowns();
        if (isHidden) {
          userDropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
          userDropdown.classList.add('opacity-100', 'visible', 'scale-100');
        }
      });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeAllDropdowns();
      }
    });
  }

  addThemeListeners() {
    const themeBtn = this.querySelector('.theme-selector-btn');
    const themeDropdown = this.querySelector('.theme-dropdown');
    
    if (themeBtn && themeDropdown) {
      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = themeDropdown.classList.contains('invisible');
        this.closeAllDropdowns();
        if (isHidden) {
          themeDropdown.classList.remove('opacity-0', 'invisible');
          themeDropdown.classList.add('opacity-100', 'visible');
        }
      });

      this.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const theme = e.currentTarget.dataset.theme;
          ThemeManager.setTheme(theme);
          this.render(); // Re-render to update icon
        });
      });
    }
  }

  addCreateMenuListeners() {
    const container = this.querySelector('[data-create-menu]');
    if (container) {
      bindCreateMenu(container);
    }
  }

  addNotificationsListener() {
    const btn = this.querySelector('button:has(.fa-bell)');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.WebropolSPA && typeof window.WebropolSPA.navigate === 'function') {
        window.WebropolSPA.navigate('/news');
      } else {
        window.location.hash = '#/news';
      }
    });
  }

  closeAllDropdowns() {
    const dropdowns = this.querySelectorAll('.user-dropdown, .theme-dropdown, .create-menu-dropdown, .navigate-menu-dropdown');
    dropdowns.forEach(d => {
      d.classList.add('opacity-0', 'invisible');
      if (d.classList.contains('user-dropdown')) d.classList.add('scale-95');
      if (d.classList.contains('navigate-menu-dropdown')) d.classList.add('translate-y-1');
      d.classList.remove('opacity-100', 'visible', 'scale-100', 'translate-y-0');
    });
  }
}

customElements.define('webropol-magical-header', WebropolMagicalHeader);
