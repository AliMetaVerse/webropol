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

    // Determine whether to show the rating selector from global settings (default: true)
    const showRatingSelector = (typeof window !== 'undefined' && window.globalSettingsManager && typeof window.globalSettingsManager.getSetting === 'function')
      ? !!window.globalSettingsManager.getSetting('showRatingSelector')
      : true;

    // Get the feedback question type from settings
    const feedbackQuestionType = (typeof window !== 'undefined' && window.globalSettingsManager && typeof window.globalSettingsManager.getSetting === 'function')
      ? window.globalSettingsManager.getSetting('feedbackQuestionType') || 'rating'
      : 'rating';

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
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="2-way-sms">
                  <i class="fal fa-comments text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">2-Way SMS</div>
                    <div class="text-xs text-webropol-gray-500">Send and receive</div>
                  </div>
                </button>
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="exw-surveys">
                  <i class="fal fa-chart-line text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">EXW Surveys</div>
                    <div class="text-xs text-webropol-gray-500">Employee experience</div>
                  </div>
                </button>
                <button class="flex items-center justify-start w-full px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 create-item" data-type="case-management">
                  <i class="fal fa-users-cog text-webropol-teal-600 w-5 mr-3"></i>
                  <div class="flex-1 text-left">
                    <div class="font-medium">Case Management</div>
                    <div class="text-xs text-webropol-gray-500">Manage your team</div>
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
            
            ${showRatingSelector ? `
              <div class="relative settings-animation-container">
                <div class="settings-notification-badge"></div>
                <button class="settings-button rating-selector-btn">
                  <i class="fal fa-star"></i>
                </button>
                
                <!-- Settings dropdown -->
                <div class="absolute right-0 top-full mt-2 w-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-lg border border-webropol-gray-200 py-4 opacity-0 invisible transition-all duration-200 feedback-dropdown z-[9999]">
                  ${this.getFeedbackContent(feedbackQuestionType)}
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
    this.addRatingListeners();
    this.addCreateMenuListeners();
    
    // Initialize settings animation scheduler
    this.initializeSettingsAnimationScheduler();

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

  getFeedbackContent(questionType) {
    const currentPath = window.location.pathname;
    const pageContext = this.getPageContext(currentPath);
    
    switch (questionType) {
      case 'rating':
        return this.getRatingContent();
      case 'openended':
        return this.getOpenEndedContent(pageContext);
      case 'nps':
        return this.getNPSContent(pageContext);
      default:
        return this.getRatingContent();
    }
  }

  getPageContext(path) {
    if (path.includes('/surveys/')) {
      if (path.includes('/edit.html')) return { area: 'Survey Editor', question: 'How would you improve the survey editing experience?' };
      if (path.includes('/list.html')) return { area: 'Survey List', question: 'How can we make managing your surveys easier?' };
      return { area: 'Surveys', question: 'How is your experience with the surveys section?' };
    }
    if (path.includes('/events/')) {
      if (path.includes('/list.html')) return { area: 'Events List', question: 'What features would help you manage events better?' };
      return { area: 'Events', question: 'How can we improve the events experience?' };
    }
    if (path.includes('/admin-tools/')) return { area: 'Admin Tools', question: 'What admin features would be most helpful?' };
    if (path.includes('/training-videos/')) return { area: 'Training Videos', question: 'What training content would you like to see?' };
    if (path.includes('/dashboards/')) return { area: 'Dashboards', question: 'How can we make the dashboards more useful?' };
    
    return { area: 'Platform', question: 'How can we improve your overall experience?' };
  }

  getRatingContent() {
    return `
      <div class="px-4 py-2">
        <h4 class="text-sm font-semibold text-webropol-gray-800 mb-3">Rate Your Experience</h4>
        <div class="space-y-2">
          <button class="flex items-center w-full px-3 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 rounded-lg rating-option" data-rating="5">
            <div class="flex mr-3">
              ${[1,2,3,4,5].map(() => '<i class="fas fa-star text-yellow-400 text-xs"></i>').join('')}
            </div>
            Excellent
          </button>
          <button class="flex items-center w-full px-3 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 rounded-lg rating-option" data-rating="4">
            <div class="flex mr-3">
              ${[1,2,3,4].map(() => '<i class="fas fa-star text-yellow-400 text-xs"></i>').join('')}
              <i class="fal fa-star text-gray-300 text-xs"></i>
            </div>
            Good
          </button>
          <button class="flex items-center w-full px-3 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 rounded-lg rating-option" data-rating="3">
            <div class="flex mr-3">
              ${[1,2,3].map(() => '<i class="fas fa-star text-yellow-400 text-xs"></i>').join('')}
              ${[4,5].map(() => '<i class="fal fa-star text-gray-300 text-xs"></i>').join('')}
            </div>
            Average
          </button>
          <button class="flex items-center w-full px-3 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 rounded-lg rating-option" data-rating="2">
            <div class="flex mr-3">
              ${[1,2].map(() => '<i class="fas fa-star text-yellow-400 text-xs"></i>').join('')}
              ${[3,4,5].map(() => '<i class="fal fa-star text-gray-300 text-xs"></i>').join('')}
            </div>
            Poor
          </button>
          <button class="flex items-center w-full px-3 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 rounded-lg rating-option" data-rating="1">
            <div class="flex mr-3">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              ${[2,3,4,5].map(() => '<i class="fal fa-star text-gray-300 text-xs"></i>').join('')}
            </div>
            Terrible
          </button>
        </div>
      </div>
    `;
  }

  getOpenEndedContent(pageContext) {
    return `
      <div class="px-4 py-2">
        <h4 class="text-sm font-semibold text-webropol-gray-800 mb-2">${pageContext.area} Feedback</h4>
        <p class="text-xs text-webropol-gray-600 mb-3">${pageContext.question}</p>
        <form class="feedback-form" data-type="openended">
          <textarea 
            class="w-full h-20 px-3 py-2 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-teal-500 focus:border-webropol-teal-500 resize-none"
            placeholder="Share your thoughts..."
            name="feedback"
            maxlength="500"
          ></textarea>
          <div class="flex justify-between items-center mt-3">
            <span class="text-xs text-webropol-gray-500">Max 500 characters</span>
            <button type="submit" class="px-4 py-1.5 bg-webropol-teal-600 hover:bg-webropol-teal-700 text-white text-sm rounded-lg transition-colors">
              Submit
            </button>
          </div>
        </form>
      </div>
    `;
  }

  getNPSContent(pageContext) {
    return `
      <div class="px-6 py-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <!-- Header Section with Icon -->
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <i class="fas fa-chart-line text-white text-lg"></i>
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-800 leading-tight">Net Promoter Score</h4>
            <p class="text-xs text-gray-600 font-medium">Help us improve ${pageContext.area}</p>
          </div>
        </div>
        
        <!-- Question -->
        <div class="mb-6">
          <p class="text-sm text-gray-700 font-medium text-center leading-relaxed">
            How likely are you to recommend our <span class="font-bold text-indigo-600">${pageContext.area}</span> to a colleague?
          </p>
        </div>
        
        <form class="feedback-form" data-type="nps">
          <!-- NPS Score Grid with Modern Design -->
          <div class="mb-5">
            <div class="grid grid-cols-11 gap-2 mb-4">
              ${Array.from({length: 11}, (_, i) => {
                let colorClass = '';
                let hoverClass = '';
                if (i <= 6) {
                  // Detractors (0-6) - Red gradient
                  colorClass = 'bg-gradient-to-br from-red-100 to-red-200 border-red-300 text-red-700';
                  hoverClass = 'hover:from-red-200 hover:to-red-300 hover:border-red-400 hover:shadow-lg hover:scale-110';
                } else if (i <= 8) {
                  // Passives (7-8) - Yellow gradient
                  colorClass = 'bg-gradient-to-br from-yellow-100 to-amber-200 border-amber-300 text-amber-700';
                  hoverClass = 'hover:from-yellow-200 hover:to-amber-300 hover:border-amber-400 hover:shadow-lg hover:scale-110';
                } else {
                  // Promoters (9-10) - Green gradient
                  colorClass = 'bg-gradient-to-br from-green-100 to-emerald-200 border-emerald-300 text-emerald-700';
                  hoverClass = 'hover:from-green-200 hover:to-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:scale-110';
                }
                
                return `
                  <button type="button" class="nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl ${colorClass} ${hoverClass} transition-all duration-300 transform active:scale-95 shadow-sm" data-score="${i}">
                    ${i}
                  </button>
                `;
              }).join('')}
            </div>
            
            <!-- Labels with enhanced styling -->
            <div class="flex justify-between items-center px-1">
              <div class="text-center">
                <div class="text-xs font-semibold text-red-600 mb-1">Not likely</div>
                <div class="w-3 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full mx-auto"></div>
              </div>
              <div class="text-center">
                <div class="text-xs font-semibold text-emerald-600 mb-1">Very likely</div>
                <div class="w-3 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
          
          <!-- Category Indicator -->
          <div class="mb-5">
            <div class="nps-category-indicator hidden p-3 rounded-xl text-center font-medium text-sm transition-all duration-300">
              <div class="nps-category-icon text-2xl mb-1"></div>
              <div class="nps-category-title font-bold"></div>
              <div class="nps-category-desc text-xs opacity-90"></div>
            </div>
          </div>
          
          <!-- Enhanced Textarea -->
          <div class="mb-5">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-comment-dots mr-2 text-indigo-500"></i>
              Tell us more (optional)
            </label>
            <textarea 
              class="w-full h-28 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 resize-none transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-400 leading-relaxed"
              placeholder="Share your thoughts on how we can improve..."
              name="reason"
              maxlength="300"
            ></textarea>
            <div class="text-right mt-1">
              <span class="text-xs text-gray-400">0/300 characters</span>
            </div>
          </div>
          
          <!-- Enhanced Footer -->
          <div class="flex justify-between items-center pt-2 border-t border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-gray-600">Score: <span class="nps-score-display font-bold text-indigo-600">-</span></span>
              </div>
            </div>
            <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" disabled>
              <i class="fas fa-paper-plane mr-2"></i>
              Submit Feedback
            </button>
          </div>
        </form>
        
        <!-- Thank You Message (Hidden by default) -->
        <div class="nps-thank-you hidden px-6 py-8 text-center">
          <div class="mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <i class="fas fa-check text-white text-2xl"></i>
            </div>
            <div class="text-4xl mb-2 animate-pulse">🎉</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Thank you for your feedback!</h3>
            <p class="text-sm text-gray-600 mb-4 leading-relaxed">Your input helps us make ${pageContext.area} even better for everyone.</p>
          </div>
          
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
            <div class="nps-thank-you-message text-sm font-medium"></div>
          </div>
          
          <div class="space-y-2">
            <button class="nps-close-btn w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
              <i class="fas fa-heart mr-2"></i>
              Awesome, thanks!
            </button>
          </div>
        </div>
      </div>
    `;
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
      document.addEventListener('click', (e) => {
        // Only close if clicking outside the user dropdown and button
        if (!dropdown.contains(e.target) && !userButton.contains(e.target)) {
          dropdown.classList.add('opacity-0', 'invisible');
        }
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
        const feedbackDropdown = this.querySelector('.feedback-dropdown');
        [userDropdown, feedbackDropdown].forEach(dropdown => {
          if (dropdown) {
            dropdown.classList.add('opacity-0', 'invisible');
          }
        });
        
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
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        // Only close if clicking outside the theme dropdown and button
        if (!themeDropdown.contains(e.target) && !themeButton.contains(e.target)) {
          themeDropdown.classList.add('opacity-0', 'invisible');
        }
      });

      // Prevent dropdown from closing when clicking inside it
      themeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  addRatingListeners() {
    const ratingButton = this.querySelector('.rating-selector-btn');
    const feedbackDropdown = this.querySelector('.feedback-dropdown');

    if (ratingButton && feedbackDropdown) {
      ratingButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = !feedbackDropdown.classList.contains('opacity-0');
        
        // Close other dropdowns if open
        const userDropdown = this.querySelector('.user-dropdown');
        const themeDropdown = this.querySelector('.theme-dropdown');
        const createDropdown = this.querySelector('.create-menu-dropdown');
        
        [userDropdown, themeDropdown, createDropdown].forEach(dropdown => {
          if (dropdown) {
            dropdown.classList.add('opacity-0', 'invisible');
          }
        });
        
        if (isVisible) {
          feedbackDropdown.classList.add('opacity-0', 'invisible');
        } else {
          feedbackDropdown.classList.remove('opacity-0', 'invisible');
        }
      });

      // Handle rating selection (for star ratings)
      this.addEventListenerToDropdown(feedbackDropdown, '.rating-option', (option, e) => {
        e.stopPropagation();
        const selectedRating = option.getAttribute('data-rating');
        this.handleFeedbackSubmission('rating', { rating: parseInt(selectedRating) });
        feedbackDropdown.classList.add('opacity-0', 'invisible');
      });

      // Handle NPS button clicks with enhanced visual feedback
      this.addEventListenerToDropdown(feedbackDropdown, '.nps-option', (option, e) => {
        e.preventDefault(); // Prevent default button behavior
        e.stopPropagation(); // Stop event from bubbling up
        console.log('NPS button clicked:', option.getAttribute('data-score'));
        
        const score = parseInt(option.getAttribute('data-score'));
        
        // Update visual selection - remove from all buttons
        feedbackDropdown.querySelectorAll('.nps-option').forEach(btn => {
          btn.classList.remove('ring-4', 'ring-indigo-300', 'ring-offset-2', 'shadow-xl', 'scale-110');
          btn.classList.remove('bg-gradient-to-br', 'from-indigo-500', 'to-purple-600', 'text-white', 'border-indigo-500');
          
          // Reset to original colors based on score
          const btnScore = parseInt(btn.getAttribute('data-score'));
          if (btnScore <= 6) {
            btn.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-red-100 to-red-200 border-red-300 text-red-700 hover:from-red-200 hover:to-red-300 hover:border-red-400 hover:shadow-lg hover:scale-110 transition-all duration-300 transform active:scale-95 shadow-sm';
          } else if (btnScore <= 8) {
            btn.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-200 border-amber-300 text-amber-700 hover:from-yellow-200 hover:to-amber-300 hover:border-amber-400 hover:shadow-lg hover:scale-110 transition-all duration-300 transform active:scale-95 shadow-sm';
          } else {
            btn.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 border-emerald-300 text-emerald-700 hover:from-green-200 hover:to-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:scale-110 transition-all duration-300 transform active:scale-95 shadow-sm';
          }
        });
        
        // Add vibrant selection to clicked button
        option.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500 ring-4 ring-indigo-300 ring-offset-2 shadow-xl scale-110 transition-all duration-300 transform';
        
        // Update score display and enable submit
        const scoreDisplay = feedbackDropdown.querySelector('.nps-score-display');
        const submitBtn = feedbackDropdown.querySelector('button[type="submit"]');
        if (scoreDisplay) {
          scoreDisplay.textContent = score;
          console.log('Score display updated to:', score);
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          console.log('Submit button enabled');
        }
        
        // Show and update category indicator
        const categoryIndicator = feedbackDropdown.querySelector('.nps-category-indicator');
        const categoryIcon = feedbackDropdown.querySelector('.nps-category-icon');
        const categoryTitle = feedbackDropdown.querySelector('.nps-category-title');
        const categoryDesc = feedbackDropdown.querySelector('.nps-category-desc');
        
        if (categoryIndicator && categoryIcon && categoryTitle && categoryDesc) {
          categoryIndicator.classList.remove('hidden');
          
          if (score <= 6) {
            // Detractors
            categoryIndicator.className = 'nps-category-indicator p-3 rounded-xl text-center font-medium text-sm transition-all duration-300 bg-gradient-to-br from-red-100 to-pink-100 border-2 border-red-200';
            categoryIcon.innerHTML = '😔';
            categoryTitle.textContent = 'Detractor';
            categoryTitle.className = 'nps-category-title font-bold text-red-700';
            categoryDesc.textContent = 'Help us understand what we can improve';
            categoryDesc.className = 'nps-category-desc text-xs opacity-90 text-red-600';
          } else if (score <= 8) {
            // Passives
            categoryIndicator.className = 'nps-category-indicator p-3 rounded-xl text-center font-medium text-sm transition-all duration-300 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-amber-200';
            categoryIcon.innerHTML = '😐';
            categoryTitle.textContent = 'Passive';
            categoryTitle.className = 'nps-category-title font-bold text-amber-700';
            categoryDesc.textContent = 'What would make this experience amazing?';
            categoryDesc.className = 'nps-category-desc text-xs opacity-90 text-amber-600';
          } else {
            // Promoters
            categoryIndicator.className = 'nps-category-indicator p-3 rounded-xl text-center font-medium text-sm transition-all duration-300 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-emerald-200';
            categoryIcon.innerHTML = '😊';
            categoryTitle.textContent = 'Promoter';
            categoryTitle.className = 'nps-category-title font-bold text-emerald-700';
            categoryDesc.textContent = 'Thank you! Tell us what you love most';
            categoryDesc.className = 'nps-category-desc text-xs opacity-90 text-emerald-600';
          }
        }
      });

      // Backup direct event listener for NPS buttons (in case event delegation fails)
      setTimeout(() => {
        const npsButtons = feedbackDropdown.querySelectorAll('.nps-option');
        npsButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Direct NPS button clicked:', button.getAttribute('data-score'));
            
            const score = parseInt(button.getAttribute('data-score'));
            
            // Remove selection from all buttons
            npsButtons.forEach(btn => {
              btn.classList.remove('ring-4', 'ring-indigo-300', 'ring-offset-2', 'shadow-xl', 'scale-110');
              btn.classList.remove('bg-gradient-to-br', 'from-indigo-500', 'to-purple-600', 'text-white', 'border-indigo-500');
              
              // Reset to original colors
              const btnScore = parseInt(btn.getAttribute('data-score'));
              if (btnScore <= 6) {
                btn.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-red-100 to-red-200 border-red-300 text-red-700 hover:from-red-200 hover:to-red-300 hover:border-red-400 hover:shadow-lg hover:scale-110 transition-all duration-300 transform active:scale-95 shadow-sm';
              } else if (btnScore <= 8) {
                btn.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-200 border-amber-300 text-amber-700 hover:from-yellow-200 hover:to-amber-300 hover:border-amber-400 hover:shadow-lg hover:scale-110 transition-all duration-300 transform active:scale-95 shadow-sm';
              } else {
                btn.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 border-emerald-300 text-emerald-700 hover:from-green-200 hover:to-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:scale-110 transition-all duration-300 transform active:scale-95 shadow-sm';
              }
            });
            
            // Add selection to clicked button
            button.className = 'nps-option w-8 h-8 text-sm font-bold border-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500 ring-4 ring-indigo-300 ring-offset-2 shadow-xl scale-110 transition-all duration-300 transform';
            
            // Update score display and enable submit
            const scoreDisplay = feedbackDropdown.querySelector('.nps-score-display');
            const submitBtn = feedbackDropdown.querySelector('button[type="submit"]');
            if (scoreDisplay) {
              scoreDisplay.textContent = score;
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
          });
        });
      }, 100);

      // Handle form submissions with thank you message
      this.addEventListenerToDropdown(feedbackDropdown, '.feedback-form', (form, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const formType = form.getAttribute('data-type');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (formType === 'nps') {
          // Find selected score with new styling classes
          const selectedScore = feedbackDropdown.querySelector('.nps-option[class*="from-indigo-500"]');
          if (selectedScore) {
            data.score = parseInt(selectedScore.getAttribute('data-score'));
            
            // Show thank you message instead of closing dropdown
            this.showNPSThankYou(feedbackDropdown, data.score, data.reason);
            
            // Submit the feedback
            this.handleFeedbackSubmission(formType, data);
            return;
          }
        }
        
        // For other feedback types, handle normally
        this.handleFeedbackSubmission(formType, data);
        feedbackDropdown.classList.add('opacity-0', 'invisible');
      }, 'submit');

      // Add character count functionality for textarea
      this.addEventListenerToDropdown(feedbackDropdown, 'textarea[name="reason"]', (textarea, e) => {
        const charCount = textarea.value.length;
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 300;
        const charCountDisplay = feedbackDropdown.querySelector('.text-xs.text-gray-400');
        
        if (charCountDisplay) {
          charCountDisplay.textContent = `${charCount}/${maxLength} characters`;
          
          // Change color based on character count
          if (charCount > maxLength * 0.9) {
            charCountDisplay.className = 'text-xs text-red-500 font-medium';
          } else if (charCount > maxLength * 0.7) {
            charCountDisplay.className = 'text-xs text-amber-500 font-medium';
          } else {
            charCountDisplay.className = 'text-xs text-gray-400';
          }
        }
      }, 'input');

      // Handle thank you close button
      this.addEventListenerToDropdown(feedbackDropdown, '.nps-close-btn', (button, e) => {
        e.preventDefault();
        e.stopPropagation();
        feedbackDropdown.classList.add('opacity-0', 'invisible');
      });

      // Close dropdown when clicking outside
      const handleOutsideClick = (e) => {
        // Don't close if clicking inside the feedback dropdown or its children
        if (!feedbackDropdown.contains(e.target) && !e.target.closest('.feedback-dropdown')) {
          feedbackDropdown.classList.add('opacity-0', 'invisible');
        }
      };
      
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('mousedown', handleOutsideClick);

      // Prevent dropdown from closing when clicking inside it
      feedbackDropdown.addEventListener('click', (e) => {
        // Always stop propagation for clicks inside the dropdown
        e.stopPropagation();
        
        // Extra protection for form elements and buttons
        if (e.target.matches('textarea, input, button, .nps-option') || 
            e.target.closest('textarea, input, button, .nps-option')) {
          e.stopPropagation();
        }
      });

      // Prevent dropdown from closing when interacting with form elements
      feedbackDropdown.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });

      feedbackDropdown.addEventListener('focus', (e) => {
        e.stopPropagation();
      }, true);

      feedbackDropdown.addEventListener('input', (e) => {
        e.stopPropagation();
      });

      // Specifically prevent text areas and inputs from closing dropdown
      feedbackDropdown.querySelectorAll('textarea, input').forEach(element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        element.addEventListener('mousedown', (e) => {
          e.stopPropagation();
        });
        element.addEventListener('focus', (e) => {
          e.stopPropagation();
        });
      });

      // Specifically prevent NPS buttons from closing dropdown
      feedbackDropdown.querySelectorAll('.nps-option').forEach(element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        element.addEventListener('mousedown', (e) => {
          e.stopPropagation();
        });
      });
    }
  }

  addEventListenerToDropdown(dropdown, selector, callback, eventType = 'click') {
    // Use event delegation since dropdown content is dynamic
    // Create a separate handler that doesn't interfere with dropdown's own click handling
    const delegationHandler = (e) => {
      const target = e.target.closest(selector);
      if (target) {
        // Don't interfere with event propagation - let dropdown handle it
        callback(target, e);
      }
    };
    
    // Add the handler with a unique identifier to avoid duplicates
    if (!dropdown._eventHandlers) dropdown._eventHandlers = new Map();
    
    const handlerKey = `${eventType}-${selector}`;
    if (!dropdown._eventHandlers.has(handlerKey)) {
      dropdown.addEventListener(eventType, delegationHandler);
      dropdown._eventHandlers.set(handlerKey, delegationHandler);
    }
    
    // Also handle submit events for forms
    if (eventType === 'click' && selector.includes('form')) {
      const submitHandlerKey = `submit-${selector}`;
      if (!dropdown._eventHandlers.has(submitHandlerKey)) {
        const submitHandler = (e) => {
          const target = e.target.closest(selector);
          if (target) {
            callback(target, e);
          }
        };
        dropdown.addEventListener('submit', submitHandler);
        dropdown._eventHandlers.set(submitHandlerKey, submitHandler);
      }
    }
  }

  showNPSThankYou(feedbackDropdown, score, reason) {
    // Hide the form
    const form = feedbackDropdown.querySelector('.feedback-form');
    const thankYou = feedbackDropdown.querySelector('.nps-thank-you');
    
    if (form && thankYou) {
      form.style.display = 'none';
      thankYou.classList.remove('hidden');
      
      // Generate personalized thank you message based on score
      const thankYouMessage = feedbackDropdown.querySelector('.nps-thank-you-message');
      if (thankYouMessage) {
        let message = '';
        let emoji = '';
        
        if (score <= 6) {
          // Detractors
          const messages = [
            "We really appreciate your honest feedback! 😊 We're committed to making improvements.",
            "Thank you for helping us identify areas to improve! 🛠️ Your voice matters.",
            "We hear you loud and clear! 📣 We'll work hard to earn a higher score next time.",
            "Your feedback is a gift! 🎁 We'll use it to make meaningful changes."
          ];
          message = messages[Math.floor(Math.random() * messages.length)];
          emoji = '🔧';
        } else if (score <= 8) {
          // Passives
          const messages = [
            "Thanks for the feedback! 😊 We'd love to know what would make this a 10/10 experience.",
            "We appreciate you taking the time! ⭐ What can we do to wow you next time?",
            "Great feedback! 👍 We're always looking for ways to make things even better.",
            "Thank you! 🙏 Your suggestions help us reach for excellence."
          ];
          message = messages[Math.floor(Math.random() * messages.length)];
          emoji = '⭐';
        } else {
          // Promoters
          const messages = [
            "You're amazing! 🌟 Thanks for being such a fantastic advocate!",
            "Woohoo! 🎉 Your enthusiasm gives us energy to keep innovating!",
            "You made our day! ☀️ Thank you for spreading the love!",
            "High five! 🙌 We're thrilled you're having such a great experience!",
            "You rock! 🎸 Thanks for being part of our success story!"
          ];
          message = messages[Math.floor(Math.random() * messages.length)];
          emoji = '🌟';
        }
        
        thankYouMessage.innerHTML = `
          <div class="flex items-center justify-center mb-2">
            <span class="text-2xl mr-2">${emoji}</span>
            <span class="font-semibold text-gray-700">Score: ${score}/10</span>
          </div>
          <p class="text-gray-600">${message}</p>
          ${reason ? `<div class="mt-3 p-2 bg-white/50 rounded-lg"><span class="text-xs font-medium text-gray-500">Your comment:</span><br><span class="text-sm text-gray-700 italic">"${reason}"</span></div>` : ''}
        `;
      }
    }
  }

  handleFeedbackSubmission(type, data) {
    // Add timestamp and page context
    const submissionData = {
      type,
      data,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      pageContext: this.getPageContext(window.location.pathname)
    };

    // Emit events
    this.emit('feedback-submitted', submissionData);
    document.dispatchEvent(new CustomEvent('webropol-feedback-submitted', { 
      detail: submissionData 
    }));

    // Store in localStorage for now (you can replace with API call)
    const existingFeedback = JSON.parse(localStorage.getItem('webropol_feedback') || '[]');
    existingFeedback.push(submissionData);
    localStorage.setItem('webropol_feedback', JSON.stringify(existingFeedback));

    // Show success feedback
    this.showFeedbackSuccess(type);
    
    console.log('Feedback submitted:', submissionData);
  }

  showFeedbackSuccess(type) {
    const ratingButton = this.querySelector('.rating-selector-btn');
    if (ratingButton) {
      const originalContent = ratingButton.innerHTML;
      ratingButton.innerHTML = '<i class="fal fa-check text-green-500"></i>';
      
      setTimeout(() => {
        ratingButton.innerHTML = originalContent;
      }, 2000);
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
          
          // Handle navigation to universal create page
          this.handleCreateNavigation(type);
          
          // Emit event from component
          this.emit('create-item', { type, source: 'header' });
          // Also dispatch a global event for pages to listen to
          document.dispatchEvent(new CustomEvent('create-item', { detail: { type, source: 'header' } }));
          // Close dropdown
          createDropdown.classList.add('opacity-0', 'invisible');
        });
      });

      // Close on outside click
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        // Only close if clicking outside the create dropdown and button
        if (!createDropdown.contains(e.target) && !createButton.contains(e.target)) {
          createDropdown.classList.add('opacity-0', 'invisible');
        }
      });

      // Prevent close when clicking inside
      createDropdown.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  handleCreateNavigation(type) {
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

    // Map header create types to URL types
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

  initializeSettingsAnimationScheduler() {
    // Clear any existing timers
    if (this.settingsAnimationTimer) {
      clearTimeout(this.settingsAnimationTimer);
    }
    if (this.settingsIntervalTimer) {
      clearInterval(this.settingsIntervalTimer);
    }

    // Get animation settings from global settings manager
    const getAnimationSettings = () => {
      if (typeof window !== 'undefined' && window.globalSettingsManager) {
        return {
          enabled: window.globalSettingsManager.getSetting('settingsAnimationEnabled') !== false,
          frequency: window.globalSettingsManager.getSetting('settingsAnimationFrequency') || 3, // times per day
          duration: window.globalSettingsManager.getSetting('settingsAnimationDuration') || 2000, // milliseconds
          startTime: window.globalSettingsManager.getSetting('settingsAnimationStartTime') || '09:00',
          endTime: window.globalSettingsManager.getSetting('settingsAnimationEndTime') || '17:00',
          type: window.globalSettingsManager.getSetting('settingsAnimationType') || 'magnetic' // modern animation type
        };
      }
      return {
        enabled: true,
        frequency: 3,
        duration: 2000,
        startTime: '09:00',
        endTime: '17:00',
        type: 'magnetic'
      };
    };

    const scheduleNextAnimation = () => {
      const settings = getAnimationSettings();
      
      if (!settings.enabled) {
        return;
      }

      const now = new Date();
      const [startHour, startMinute] = settings.startTime.split(':').map(Number);
      const [endHour, endMinute] = settings.endTime.split(':').map(Number);
      
      const startTime = new Date(now);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(now);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      // If we're not in the active time window, schedule for tomorrow
      if (now < startTime) {
        // Schedule for start time today
        const timeUntilStart = startTime.getTime() - now.getTime();
        this.settingsAnimationTimer = setTimeout(() => {
          this.startDailyAnimationCycle();
        }, timeUntilStart);
      } else if (now > endTime) {
        // Schedule for start time tomorrow
        const tomorrowStart = new Date(startTime);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        const timeUntilTomorrow = tomorrowStart.getTime() - now.getTime();
        this.settingsAnimationTimer = setTimeout(() => {
          this.startDailyAnimationCycle();
        }, timeUntilTomorrow);
      } else {
        // We're in the active window, start immediately
        this.startDailyAnimationCycle();
      }
    };

    scheduleNextAnimation();

    // Re-schedule when settings change
    window.addEventListener('webropol-settings-applied', () => {
      scheduleNextAnimation();
    });
  }

  startDailyAnimationCycle() {
    const settings = this.getSettingsAnimationSettings();
    
    if (!settings.enabled) {
      return;
    }

    const now = new Date();
    const [endHour, endMinute] = settings.endTime.split(':').map(Number);
    const endTime = new Date(now);
    endTime.setHours(endHour, endMinute, 0, 0);
    
    const timeWindow = endTime.getTime() - now.getTime();
    const interval = timeWindow / settings.frequency;
    
    let animationCount = 0;
    
    const triggerAnimation = () => {
      if (animationCount < settings.frequency && new Date() < endTime) {
        this.triggerSettingsAnimation(settings.duration, settings.type);
        animationCount++;
        
        if (animationCount < settings.frequency) {
          // Add some randomness to make it feel more natural (±20% of interval)
          const randomOffset = (Math.random() - 0.5) * 0.4 * interval;
          const nextAnimationTime = interval + randomOffset;
          
          this.settingsAnimationTimer = setTimeout(triggerAnimation, nextAnimationTime);
        }
      }
    };

    // Trigger first animation immediately
    triggerAnimation();
  }

  getSettingsAnimationSettings() {
    if (typeof window !== 'undefined' && window.globalSettingsManager) {
      return {
        enabled: window.globalSettingsManager.getSetting('settingsAnimationEnabled') !== false,
        frequency: window.globalSettingsManager.getSetting('settingsAnimationFrequency') || 3,
        duration: window.globalSettingsManager.getSetting('settingsAnimationDuration') || 2000,
        startTime: window.globalSettingsManager.getSetting('settingsAnimationStartTime') || '09:00',
        endTime: window.globalSettingsManager.getSetting('settingsAnimationEndTime') || '17:00',
        type: window.globalSettingsManager.getSetting('settingsAnimationType') || 'magnetic'
      };
    }
    return {
      enabled: true,
      frequency: 3,
      duration: 2000,
      startTime: '09:00',
      endTime: '17:00',
      type: 'magnetic'
    };
  }

  triggerSettingsAnimation(duration = 2000, type = 'magnetic') {
    const settingsContainer = this.querySelector('.settings-animation-container');
    const settingsButton = this.querySelector('.settings-button');
    
    if (!settingsContainer || !settingsButton) {
      console.warn('[Header] Settings container or button not found');
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasReduceMotionClass = document.body.classList.contains('reduce-motion');
    
    if (prefersReducedMotion || hasReduceMotionClass) {
      // For reduced motion users, just show a subtle static indicator
      settingsButton.style.border = '2px solid #06b6d4';
      settingsButton.style.background = 'rgba(6, 182, 212, 0.05)';
      const badge = settingsContainer.querySelector('.settings-notification-badge');
      if (badge) {
        badge.style.opacity = '1';
        badge.style.background = '#06b6d4';
      }
      setTimeout(() => {
        settingsButton.style.border = '';
        settingsButton.style.background = '';
        if (badge) {
          badge.style.opacity = '';
          badge.style.background = '';
        }
      }, 2000);
      return;
    }

    console.log(`[Header] Triggering ${type} settings animation for ${duration}ms`);

    // Remove any existing animation classes
    const animationClasses = [
      'settings-magnetic-active',
      'settings-morphing-active', 
      'settings-ripple-active',
      'settings-breathing-active',
      'settings-elastic-active',
      'settings-particle-active'
    ];
    
    animationClasses.forEach(cls => settingsContainer.classList.remove(cls));

    // Add the appropriate animation class based on type
    let animationClass = '';
    let animationDuration = duration;
    
    switch(type) {
      case 'magnetic':
        animationClass = 'settings-magnetic-active';
        animationDuration = 1500;
        break;
      case 'morphing':
        animationClass = 'settings-morphing-active';
        animationDuration = 2500;
        break;
      case 'ripple':
        animationClass = 'settings-ripple-active';
        animationDuration = 1800;
        break;
      case 'breathing':
        animationClass = 'settings-breathing-active';
        animationDuration = 4400; // 2.2s × 2 iterations
        break;
      case 'elastic':
        animationClass = 'settings-elastic-active';
        animationDuration = 800;
        break;
      case 'particle':
        animationClass = 'settings-particle-active';
        animationDuration = 1200;
        break;
      default:
        animationClass = 'settings-magnetic-active';
        animationDuration = 1500;
    }
    
    settingsContainer.classList.add(animationClass);

    // Auto-remove animation class after animation completes
    setTimeout(() => {
      settingsContainer.classList.remove(animationClass);
      console.log(`[Header] Settings animation ${type} completed`);
    }, Math.min(duration, animationDuration));

    // Emit event for analytics or other purposes
    this.emit('settings-animation-triggered', { 
      type, 
      duration: Math.min(duration, animationDuration), 
      timestamp: new Date().toISOString() 
    });
  }

  // Cleanup method
  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this.settingsAnimationTimer) {
      clearTimeout(this.settingsAnimationTimer);
    }
    if (this.settingsIntervalTimer) {
      clearInterval(this.settingsIntervalTimer);
    }
  }

  // Test method to manually trigger animation (for development/testing)
  testAnimation(type = 'magnetic') {
    console.log(`[Header] Manual test: triggering ${type} settings animation`);
    this.triggerSettingsAnimation(2000, type);
  }
}

customElements.define('webropol-header', WebropolHeader);

// Global test function for browser console
window.testSettingsAnimation = function(type = 'magnetic') {
  const header = document.querySelector('webropol-header');
  if (header && header.testAnimation) {
    header.testAnimation(type);
  } else {
    console.error('Header component not found or testAnimation method not available');
  }
};

// Log available test commands
console.log('🎨 Settings Animation Test Commands:');
console.log('testSettingsAnimation() - Test magnetic animation');
console.log('testSettingsAnimation("magnetic") - Test magnetic pull');
console.log('testSettingsAnimation("morphing") - Test morphing gradient');
console.log('testSettingsAnimation("ripple") - Test ripple wave');
console.log('testSettingsAnimation("breathing") - Test breathing glow');
console.log('testSettingsAnimation("elastic") - Test elastic bounce');
console.log('testSettingsAnimation("particle") - Test particle burst');

