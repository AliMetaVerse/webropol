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
            
            ${showRatingSelector ? `
              <div class="relative rating-vibration-container">
                <div class="rating-wave rating-wave-left"></div>
                <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-orange-600 hover:bg-webropol-orange-50 rounded-xl transition-all rating-selector-btn rating-pulse">
                  <i class="fal fa-star"></i>
                </button>
                <div class="rating-wave rating-wave-right"></div>
                
                <!-- Feedback dropdown -->
                <div class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-webropol-gray-200 py-4 opacity-0 invisible transition-all duration-200 feedback-dropdown z-[9999]">
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
    
    // Initialize rating animation scheduler
    this.initializeRatingAnimationScheduler();

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
      <div class="px-4 py-2">
        <h4 class="text-sm font-semibold text-webropol-gray-800 mb-2">Net Promoter Score</h4>
        <p class="text-xs text-webropol-gray-600 mb-4">How likely are you to recommend our ${pageContext.area} to a colleague?</p>
        <form class="feedback-form" data-type="nps">
          <div class="grid grid-cols-11 gap-1 mb-4">
            ${Array.from({length: 11}, (_, i) => `
              <button type="button" class="nps-option w-6 h-6 text-xs border border-webropol-gray-300 rounded hover:bg-webropol-teal-50 hover:border-webropol-teal-300 transition-colors" data-score="${i}">
                ${i}
              </button>
            `).join('')}
          </div>
          <div class="flex justify-between text-xs text-webropol-gray-500 mb-4">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
          <textarea 
            class="w-full h-16 px-3 py-2 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-teal-500 focus:border-webropol-teal-500 resize-none"
            placeholder="Tell us why (optional)..."
            name="reason"
            maxlength="300"
          ></textarea>
          <div class="flex justify-between items-center mt-3">
            <span class="text-xs text-webropol-gray-500">Score: <span class="nps-score-display">-</span></span>
            <button type="submit" class="px-4 py-1.5 bg-webropol-teal-600 hover:bg-webropol-teal-700 text-white text-sm rounded-lg transition-colors" disabled>
              Submit
            </button>
          </div>
        </form>
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
      document.addEventListener('click', () => {
        themeDropdown.classList.add('opacity-0', 'invisible');
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

      // Handle NPS button clicks
      this.addEventListenerToDropdown(feedbackDropdown, '.nps-option', (option, e) => {
        e.preventDefault();
        e.stopPropagation();
        const score = parseInt(option.getAttribute('data-score'));
        
        // Update visual selection
        feedbackDropdown.querySelectorAll('.nps-option').forEach(btn => {
          btn.classList.remove('bg-webropol-teal-500', 'text-white', 'border-webropol-teal-500');
          btn.classList.add('border-webropol-gray-300');
        });
        option.classList.add('bg-webropol-teal-500', 'text-white', 'border-webropol-teal-500');
        option.classList.remove('border-webropol-gray-300');
        
        // Update score display and enable submit
        const scoreDisplay = feedbackDropdown.querySelector('.nps-score-display');
        const submitBtn = feedbackDropdown.querySelector('button[type="submit"]');
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (submitBtn) submitBtn.disabled = false;
      });

      // Handle form submissions
      this.addEventListenerToDropdown(feedbackDropdown, '.feedback-form', (form, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const formType = form.getAttribute('data-type');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (formType === 'nps') {
          const selectedScore = feedbackDropdown.querySelector('.nps-option.bg-webropol-teal-500');
          if (selectedScore) {
            data.score = parseInt(selectedScore.getAttribute('data-score'));
          }
        }
        
        this.handleFeedbackSubmission(formType, data);
        feedbackDropdown.classList.add('opacity-0', 'invisible');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        feedbackDropdown.classList.add('opacity-0', 'invisible');
      });

      // Prevent dropdown from closing when clicking inside it
      feedbackDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  addEventListenerToDropdown(dropdown, selector, callback) {
    // Use event delegation since dropdown content is dynamic
    dropdown.addEventListener('click', (e) => {
      const target = e.target.closest(selector);
      if (target) {
        callback(target, e);
      }
    });
    
    dropdown.addEventListener('submit', (e) => {
      const target = e.target.closest(selector);
      if (target && selector.includes('form')) {
        callback(target, e);
      }
    });
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

  initializeRatingAnimationScheduler() {
    // Clear any existing timers
    if (this.ratingAnimationTimer) {
      clearTimeout(this.ratingAnimationTimer);
    }
    if (this.ratingIntervalTimer) {
      clearInterval(this.ratingIntervalTimer);
    }

    // Get animation settings from global settings manager
    const getAnimationSettings = () => {
      if (typeof window !== 'undefined' && window.globalSettingsManager) {
        return {
          enabled: window.globalSettingsManager.getSetting('ratingAnimationEnabled') !== false,
          frequency: window.globalSettingsManager.getSetting('ratingAnimationFrequency') || 3, // times per day
          duration: window.globalSettingsManager.getSetting('ratingAnimationDuration') || 5000, // milliseconds
          startTime: window.globalSettingsManager.getSetting('ratingAnimationStartTime') || '09:00',
          endTime: window.globalSettingsManager.getSetting('ratingAnimationEndTime') || '17:00',
          type: window.globalSettingsManager.getSetting('ratingAnimationType') || 'wave' // 'wave' or 'attention'
        };
      }
      return {
        enabled: true,
        frequency: 3,
        duration: 5000,
        startTime: '09:00',
        endTime: '17:00',
        type: 'wave'
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
        this.ratingAnimationTimer = setTimeout(() => {
          this.startDailyAnimationCycle();
        }, timeUntilStart);
      } else if (now > endTime) {
        // Schedule for start time tomorrow
        const tomorrowStart = new Date(startTime);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        const timeUntilTomorrow = tomorrowStart.getTime() - now.getTime();
        this.ratingAnimationTimer = setTimeout(() => {
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
    const settings = this.getRatingAnimationSettings();
    
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
        this.triggerRatingAnimation(settings.duration, settings.type);
        animationCount++;
        
        if (animationCount < settings.frequency) {
          // Add some randomness to make it feel more natural (±20% of interval)
          const randomOffset = (Math.random() - 0.5) * 0.4 * interval;
          const nextAnimationTime = interval + randomOffset;
          
          this.ratingAnimationTimer = setTimeout(triggerAnimation, nextAnimationTime);
        }
      }
    };

    // Trigger first animation immediately
    triggerAnimation();
  }

  getRatingAnimationSettings() {
    if (typeof window !== 'undefined' && window.globalSettingsManager) {
      return {
        enabled: window.globalSettingsManager.getSetting('ratingAnimationEnabled') !== false,
        frequency: window.globalSettingsManager.getSetting('ratingAnimationFrequency') || 3,
        duration: window.globalSettingsManager.getSetting('ratingAnimationDuration') || 5000,
        startTime: window.globalSettingsManager.getSetting('ratingAnimationStartTime') || '09:00',
        endTime: window.globalSettingsManager.getSetting('ratingAnimationEndTime') || '17:00',
        type: window.globalSettingsManager.getSetting('ratingAnimationType') || 'wave'
      };
    }
    return {
      enabled: true,
      frequency: 3,
      duration: 5000,
      startTime: '09:00',
      endTime: '17:00',
      type: 'wave'
    };
  }

  triggerRatingAnimation(duration = 5000, type = 'wave') {
    const ratingContainer = this.querySelector('.rating-vibration-container');
    const ratingButton = this.querySelector('.rating-selector-btn');
    
    if (!ratingContainer || !ratingButton) {
      return;
    }

    // Remove any existing animation classes
    ratingContainer.classList.remove('rating-vibration-active');
    ratingButton.classList.remove('rating-attention-active');

    // Add the appropriate animation class
    if (type === 'wave') {
      ratingContainer.classList.add('rating-vibration-active');
    } else if (type === 'attention') {
      ratingButton.classList.add('rating-attention-active');
    }

    // Remove animation after specified duration
    setTimeout(() => {
      ratingContainer.classList.remove('rating-vibration-active');
      ratingButton.classList.remove('rating-attention-active');
    }, duration);

    // Emit event for analytics or other purposes
    this.emit('rating-animation-triggered', { 
      type, 
      duration, 
      timestamp: new Date().toISOString() 
    });
  }

  // Cleanup method
  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this.ratingAnimationTimer) {
      clearTimeout(this.ratingAnimationTimer);
    }
    if (this.ratingIntervalTimer) {
      clearInterval(this.ratingIntervalTimer);
    }
  }
}

customElements.define('webropol-header', WebropolHeader);

