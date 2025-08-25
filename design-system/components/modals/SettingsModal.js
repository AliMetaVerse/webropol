/**
 * Webropol Global Settings Modal Component
 * Application-wide settings modal that can be used across all pages
 */

import { BaseComponent } from '../../utils/base-component.js';
import { ThemeManager } from '../../utils/theme-manager.js';

export class WebropolSettingsModal extends BaseComponent {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.settings = this.loadSettings();
    this.bindMethods();
  }

  bindMethods() {
    this.close = this.close.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
    this.toggleSetting = this.toggleSetting.bind(this);
    this.testSettingsAnimation = this.testSettingsAnimation.bind(this);
  this.animateHeader = this.animateHeader.bind(this);
  this.triggerPreviewAnimation = this.triggerPreviewAnimation.bind(this);
  }

  loadSettings() {
    const defaultSettings = {
      showFloatingButton: true,
      darkMode: false,
      autoSave: true,
      notifications: true,
      compactMode: false,
      autoLogout: 30, // minutes
      language: 'en',
      // New: control visibility of Header Create menu
      showHeaderCreateMenu: true,
      // New: control visibility of Rating selector
      showRatingSelector: true,
      // New: feedback question type
      feedbackQuestionType: 'rating', // 'rating', 'openended', 'nps'
      // New: settings animation settings (modern, attractive)
      settingsAnimationEnabled: true,
      settingsAnimationFrequency: 3, // times per day
      settingsAnimationDuration: 2000, // milliseconds - modern animations are shorter
      settingsAnimationType: 'magnetic' // 'magnetic', 'morphing', 'ripple', 'breathing', 'elastic', 'particle'
    };

    const stored = localStorage.getItem('webropol_global_settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  }

  saveSettings() {
    localStorage.setItem('webropol_global_settings', JSON.stringify(this.settings));
    this.applySettings();
    this.emit('settings-changed', { settings: this.settings });
  }

  applySettings() {
    // Apply dark mode
    if (this.settings.darkMode) {
      document.documentElement.classList.add('dark');
  try { localStorage.setItem('webropol-theme', 'dark'); } catch (_) {}
    } else {
      document.documentElement.classList.remove('dark');
  try { localStorage.setItem('webropol-theme', 'light'); } catch (_) {}
    }

    // Apply compact mode
    if (this.settings.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }

    // Apply floating button visibility
    const floatingButton = document.querySelector('webropol-floating-button');
    if (floatingButton) {
      floatingButton.style.display = this.settings.showFloatingButton ? 'block' : 'none';
    }

    // Emit global settings applied event
    window.dispatchEvent(new CustomEvent('webropol-settings-applied', { 
      detail: { settings: this.settings } 
    }));
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      this.settings = this.loadSettings();
      // Reset to actual defaults
      this.settings = {
        showFloatingButton: true,
        darkMode: false,
        autoSave: true,
        notifications: true,
        compactMode: false,
        autoLogout: 30,
        language: 'en',
        showHeaderCreateMenu: true,
        showRatingSelector: true,
        feedbackQuestionType: 'rating',
        settingsAnimationEnabled: true,
        settingsAnimationFrequency: 3,
        settingsAnimationDuration: 2000,
        settingsAnimationType: 'magnetic'
      };
      this.saveSettings();
      this.render();
    }
  }

  toggleSetting(key, value = null) {
    if (value !== null) {
      this.settings[key] = value;
    } else {
      this.settings[key] = !this.settings[key];
    }
    this.saveSettings();
  }

  testSettingsAnimation() {
    console.log('Test animation button clicked!');
    
    // Close the modal first
    this.close();
    
    // Wait a bit for modal to close, then trigger animation
    setTimeout(() => {
      this.animateHeader(this.settings.settingsAnimationType, this.settings.settingsAnimationDuration);
    }, 300); // Wait 300ms for modal close animation
  }

  // Trigger header settings animation without closing the modal (used for live preview)
  animateHeader(type = 'magnetic', duration = 2000) {
    try {
      // Prefer calling the component API if available
      const headers = document.querySelectorAll('webropol-header');
      if (headers && headers.length) {
        headers.forEach(header => {
          if (typeof header.triggerSettingsAnimation === 'function') {
            header.triggerSettingsAnimation(duration, type);
          }
        });
        return;
      }

      // Fallback: manipulate DOM classes directly if header API not found
      // Target the actual elements in the header (star/feedback icon)
      const feedbackContainer = document.querySelector('.settings-animation-container');
      const feedbackButton = document.querySelector('.rating-selector-btn');
      if (!feedbackContainer || !feedbackButton) {
        console.warn('[SettingsModal] No feedback/star button found in header for animation preview');
        return;
      }

      // Check for reduced motion preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasReduceMotionClass = document.body.classList.contains('reduce-motion');
      
      if (prefersReducedMotion || hasReduceMotionClass) {
        // Show static indicator for reduced motion users
        feedbackButton.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          feedbackButton.style.boxShadow = '';
        }, 1500);
        return;
      }

      // Clear any existing animation classes
      feedbackContainer.classList.remove('settings-magnetic-active', 'settings-morphing-active', 'settings-ripple-active');
      feedbackButton.classList.remove('settings-breathing-active', 'settings-elastic-active', 'settings-particle-active');

      // Apply the appropriate animation class based on type
      if (type === 'magnetic') {
        feedbackContainer.classList.add('settings-magnetic-active');
      } else if (type === 'morphing') {
        feedbackContainer.classList.add('settings-morphing-active');
      } else if (type === 'ripple') {
        feedbackContainer.classList.add('settings-ripple-active');
      } else if (type === 'breathing') {
        feedbackButton.classList.add('settings-breathing-active');
      } else if (type === 'elastic') {
        feedbackButton.classList.add('settings-elastic-active');
      } else if (type === 'particle') {
        feedbackButton.classList.add('settings-particle-active');
      }

      // Auto-cleanup based on animation duration
      setTimeout(() => {
        feedbackContainer.classList.remove('settings-magnetic-active', 'settings-morphing-active', 'settings-ripple-active');
        feedbackButton.classList.remove('settings-breathing-active', 'settings-elastic-active', 'settings-particle-active');
      }, duration);
    } catch (err) {
      console.warn('[SettingsModal] Failed to animate header preview:', err);
    }
  }

  // Inline preview animation inside the modal (on the small settings icon)
  triggerPreviewAnimation() {
    try {
      const container = this.querySelector('.preview-settings');
      const icon = this.querySelector('.preview-settings-icon');
      if (!container || !icon) return;

      // Check for reduced motion preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasReduceMotionClass = document.body.classList.contains('reduce-motion');

      // Clear any state
      container.classList.remove('settings-magnetic-active', 'settings-morphing-active', 'settings-ripple-active');
      icon.classList.remove('settings-breathing-active', 'settings-elastic-active', 'settings-particle-active');

      if (!this.settings.settingsAnimationEnabled) return;

      const type = this.settings.settingsAnimationType || 'magnetic';
      const duration = this.settings.settingsAnimationDuration || 2000;

      if (prefersReducedMotion || hasReduceMotionClass) {
        // Show static indicator for reduced motion users
        icon.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          icon.style.boxShadow = '';
        }, 1500);
        return;
      }

      if (type === 'magnetic') {
        container.classList.add('settings-magnetic-active');
      } else if (type === 'morphing') {
        container.classList.add('settings-morphing-active');
      } else if (type === 'ripple') {
        container.classList.add('settings-ripple-active');
      } else if (type === 'breathing') {
        icon.classList.add('settings-breathing-active');
      } else if (type === 'elastic') {
        icon.classList.add('settings-elastic-active');
      } else if (type === 'particle') {
        icon.classList.add('settings-particle-active');
      }

      // Auto-cleanup
      setTimeout(() => {
        container.classList.remove('settings-magnetic-active', 'settings-morphing-active', 'settings-ripple-active');
        icon.classList.remove('settings-breathing-active', 'settings-elastic-active', 'settings-particle-active');
      }, duration);
    } catch {}
  }

  render() {
    const isOpen = this.getBoolAttr('open');
    
    this.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
           style="transition: opacity 300ms ease-out">
        
        <div class="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}"
             style="transition: all 300ms ease-out"
             role="document">
          
          <!-- Modal Header -->
          <div class="modal-header flex items-center justify-between p-6 border-b border-webropol-gray-200 bg-gradient-to-r from-webropol-gray-50 to-webropol-teal-50/30">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center mr-4">
                <i class="fal fa-cog text-white text-lg"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-webropol-gray-900">Settings</h2>
                <p class="text-sm text-webropol-gray-600">Customize your experience</p>
              </div>
            </div>
            <button class="modal-close w-10 h-10 flex items-center justify-center text-webropol-gray-400 hover:text-webropol-gray-600 hover:bg-webropol-gray-100 rounded-xl transition-all"
                    aria-label="Close settings modal">
              <i class="fal fa-times text-lg"></i>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="modal-body flex-1 overflow-y-auto p-6">
            <div class="space-y-6">
              
              <!-- Interface Settings Section -->
              <div class="settings-section">
                <h3 class="text-lg font-semibold text-webropol-gray-800 mb-4 flex items-center">
                  <i class="fal fa-desktop mr-2 text-webropol-teal-600"></i>
                  Interface
                </h3>
                <div class="space-y-4">
                  
                  <!-- Dark Mode Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Dark Mode</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Switch between light and dark themes">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Toggle dark mode interface</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.darkMode ? 'checked' : ''} 
                             data-setting="darkMode">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                  <!-- Compact Mode Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Compact Mode</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Reduce spacing and padding for a more compact interface">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Reduce interface spacing</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.compactMode ? 'checked' : ''} 
                             data-setting="compactMode">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                  <!-- Floating Button Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Show Floating Button</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Show or hide the floating create button in the bottom right corner">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Toggle the floating create button visibility</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.showFloatingButton ? 'checked' : ''} 
                             data-setting="showFloatingButton">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                  <!-- Header Create Menu Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Show Header Create Menu</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Show or hide the Create dropdown in the header">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Toggle the Create dropdown visibility in the header</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.showHeaderCreateMenu ? 'checked' : ''} 
                             data-setting="showHeaderCreateMenu">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                </div>
              </div>
              
              <!-- Behavior Settings Section -->
              <div class="settings-section">
                <h3 class="text-lg font-semibold text-webropol-gray-800 mb-4 flex items-center">
                  <i class="fal fa-cogs mr-2 text-webropol-teal-600"></i>
                  Behavior
                </h3>
                <div class="space-y-4">
                  
                  <!-- Auto-save Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Auto-save</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Automatically save your work while editing">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Automatically save changes</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.autoSave ? 'checked' : ''} 
                             data-setting="autoSave">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                  <!-- Notifications Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Notifications</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Receive notifications for important events">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Enable system notifications</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.notifications ? 'checked' : ''} 
                             data-setting="notifications">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                  <!-- Auto Logout Setting -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Auto Logout</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Automatically log out after a period of inactivity">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Minutes of inactivity before logout</p>
                    </div>
                    <select class="px-3 py-1.5 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-teal-500"
                            data-setting="autoLogout">
                      <option value="15" ${this.settings.autoLogout === 15 ? 'selected' : ''}>15 minutes</option>
                      <option value="30" ${this.settings.autoLogout === 30 ? 'selected' : ''}>30 minutes</option>
                      <option value="60" ${this.settings.autoLogout === 60 ? 'selected' : ''}>1 hour</option>
                      <option value="120" ${this.settings.autoLogout === 120 ? 'selected' : ''}>2 hours</option>
                      <option value="0" ${this.settings.autoLogout === 0 ? 'selected' : ''}>Never</option>
                    </select>
                  </div>
                  
                </div>
              </div>
              
              <!-- User Feedback Settings Section -->
              <div class="settings-section">
                <h3 class="text-lg font-semibold text-webropol-gray-800 mb-4 flex items-center">
                  <i class="fal fa-cog mr-2 text-webropol-blue-600"></i>
                  Settings Animation
                </h3>
                <div class="space-y-4">
                  
                  <!-- Rating Selector Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Show Rating Selector</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Show or hide the star rating selector in the header">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Toggle the rating selector visibility in the header</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.showRatingSelector ? 'checked' : ''} 
                             data-setting="showRatingSelector">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                  <!-- Feedback Question Type -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Feedback Question Type</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Choose the type of feedback question to display">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Select the feedback method for user input</p>
                    </div>
                    <select class="px-3 py-1.5 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-teal-500"
                            data-setting="feedbackQuestionType">
                      <option value="rating" ${this.settings.feedbackQuestionType === 'rating' ? 'selected' : ''}>Star Rating</option>
                      <option value="openended" ${this.settings.feedbackQuestionType === 'openended' ? 'selected' : ''}>Open-ended Question</option>
                      <option value="nps" ${this.settings.feedbackQuestionType === 'nps' ? 'selected' : ''}>NPS Score</option>
                    </select>
                  </div>
                  
                  <!-- Animation Enabled Toggle -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Enable Settings Animation</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Enable modern animations on the settings button to draw attention">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Show modern, attractive animations on settings icon</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.settingsAnimationEnabled ? 'checked' : ''} 
                             data-setting="settingsAnimationEnabled">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-teal-600"></div>
                    </label>
                  </div>
                  
                  <!-- Animation Type -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Animation Type</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Choose between different modern animation styles">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Modern animations based on 2025 UI trends</p>
                    </div>
                    <select class="px-3 py-1.5 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-teal-500"
                            data-setting="settingsAnimationType">
                      <option value="magnetic" ${this.settings.settingsAnimationType === 'magnetic' ? 'selected' : ''}>Magnetic Pull (Recommended)</option>
                      <option value="morphing" ${this.settings.settingsAnimationType === 'morphing' ? 'selected' : ''}>Morphing Gradient</option>
                      <option value="ripple" ${this.settings.settingsAnimationType === 'ripple' ? 'selected' : ''}>Ripple Wave</option>
                      <option value="breathing" ${this.settings.settingsAnimationType === 'breathing' ? 'selected' : ''}>Breathing Glow</option>
                      <option value="elastic" ${this.settings.settingsAnimationType === 'elastic' ? 'selected' : ''}>Elastic Bounce</option>
                      <option value="particle" ${this.settings.settingsAnimationType === 'particle' ? 'selected' : ''}>Particle Burst</option>
                    </select>
                  </div>
                  
                  <!-- Animation Frequency -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Daily Frequency</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="How many times per day the animation should appear">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Number of animations per day</p>
                    </div>
                    <select class="px-3 py-1.5 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-teal-500"
                            data-setting="settingsAnimationFrequency">
                      <option value="1" ${this.settings.settingsAnimationFrequency === 1 ? 'selected' : ''}>1 time</option>
                      <option value="2" ${this.settings.settingsAnimationFrequency === 2 ? 'selected' : ''}>2 times</option>
                      <option value="3" ${this.settings.settingsAnimationFrequency === 3 ? 'selected' : ''}>3 times</option>
                      <option value="4" ${this.settings.settingsAnimationFrequency === 4 ? 'selected' : ''}>4 times</option>
                      <option value="5" ${this.settings.settingsAnimationFrequency === 5 ? 'selected' : ''}>5 times</option>
                      <option value="6" ${this.settings.settingsAnimationFrequency === 6 ? 'selected' : ''}>6 times</option>
                    </select>
                  </div>
                  
                  <!-- Animation Duration -->
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Animation Duration</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="How long each animation should last">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Duration of each animation</p>
                    </div>
                    <select class="px-3 py-1.5 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-teal-500"
                            data-setting="settingsAnimationDuration">
                      <option value="1500" ${this.settings.settingsAnimationDuration === 1500 ? 'selected' : ''}>1.5 seconds</option>
                      <option value="2000" ${this.settings.settingsAnimationDuration === 2000 ? 'selected' : ''}>2 seconds</option>
                      <option value="2500" ${this.settings.settingsAnimationDuration === 2500 ? 'selected' : ''}>2.5 seconds</option>
                      <option value="3000" ${this.settings.settingsAnimationDuration === 3000 ? 'selected' : ''}>3 seconds</option>
                      <option value="4000" ${this.settings.settingsAnimationDuration === 4000 ? 'selected' : ''}>4 seconds</option>
                    </select>
                  </div>
                  
                  <!-- Test Animation Button -->
                  <div class="py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center">
                          <label class="text-sm font-medium text-webropol-gray-700">Test Animation</label>
                          <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                               title="Trigger the settings animation immediately for testing">
                            <i class="fal fa-question-circle text-sm"></i>
                          </div>
                        </div>
                        <p class="text-xs text-webropol-gray-500 mt-1">Trigger the animation now to see how it looks</p>
                      </div>
                      <div class="flex items-center space-x-3">
                        <!-- Inline preview: visible while modal is open -->
                        <div class="preview-settings settings-animation-container inline-flex items-center justify-center w-10 h-10 rounded-xl bg-webropol-blue-50 text-webropol-blue-600 border border-webropol-blue-100">
                          <i class="fal fa-cog preview-settings-icon"></i>
                        </div>
                        <button class="test-animation-btn px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors font-medium">
                          <i class="fal fa-play mr-1"></i>
                          Test Now
                        </button>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex items-center justify-between p-6 border-t border-webropol-gray-200 bg-webropol-gray-50/30">
            <div class="text-xs text-webropol-gray-500">
              <i class="fal fa-info-circle mr-1"></i>
              Settings are saved automatically
            </div>
            <div class="flex items-center space-x-3">
              <button class="reset-button px-6 py-2.5 text-sm text-webropol-gray-600 hover:text-webropol-gray-800 hover:bg-webropol-gray-100 rounded-full transition-all">
                <i class="fal fa-undo mr-2"></i>
                Reset to Default
              </button>
              <button class="done-button px-6 py-2.5 bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 hover:from-webropol-teal-600 hover:to-webropol-teal-700 text-white font-medium rounded-full transition-all">
                <i class="fal fa-check mr-2"></i>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  // Kick off a quick inline preview after rendering the modal
  setTimeout(() => this.triggerPreviewAnimation(), 200);
  }

  bindEvents() {
    const backdrop = this.querySelector('.modal-backdrop');
    const closeButton = this.querySelector('.modal-close');
    const doneButton = this.querySelector('.done-button');
    const resetButton = this.querySelector('.reset-button');
    const checkboxes = this.querySelectorAll('input[type="checkbox"][data-setting]');
    const selects = this.querySelectorAll('select[data-setting]');

    // Close modal events
    if (closeButton) {
      this.addListener(closeButton, 'click', this.close);
    }

    if (doneButton) {
      this.addListener(doneButton, 'click', this.close);
    }

    if (resetButton) {
      this.addListener(resetButton, 'click', this.resetSettings);
    }

    // Test animation button
    const testButton = this.querySelector('.test-animation-btn');
    if (testButton) {
      this.addListener(testButton, 'click', this.testSettingsAnimation);
    }

    // Backdrop click
    if (backdrop) {
      this.addListener(backdrop, 'click', this.handleBackdropClick);
    }

    // Prevent modal content clicks from closing modal
    const modalContent = this.querySelector('.modal-content');
    if (modalContent) {
      this.addListener(modalContent, 'click', (e) => e.stopPropagation());
    }

    // Settings toggles
    checkboxes.forEach(checkbox => {
      this.addListener(checkbox, 'change', (e) => {
        const settingKey = e.target.getAttribute('data-setting');
        this.toggleSetting(settingKey, e.target.checked);
        if (['settingsAnimationEnabled'].includes(settingKey)) {
          this.triggerPreviewAnimation();
        }
      });
    });

    selects.forEach(select => {
      this.addListener(select, 'change', (e) => {
        const settingKey = e.target.getAttribute('data-setting');
        const value = e.target.value === '0' ? 0 : (isNaN(e.target.value) ? e.target.value : parseInt(e.target.value));
        this.toggleSetting(settingKey, value);
        if (['settingsAnimationType','settingsAnimationDuration'].includes(settingKey)) {
          this.triggerPreviewAnimation();
        }
      });
    });

    // Keyboard events
    this.addListener(document, 'keydown', this.handleKeydown);
  }

  handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  handleKeydown(e) {
    if (this.getBoolAttr('open') && e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  open() {
    this.setAttribute('open', '');
    this.render();
    
    // Focus management
    setTimeout(() => {
      const closeButton = this.querySelector('.modal-close');
      if (closeButton) {
        closeButton.focus();
      }
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    this.emit('settings-modal-opened');
  }

  close() {
    this.removeAttribute('open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    this.emit('settings-modal-closed');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && oldValue !== newValue) {
      this.render();
    }
  }

  // Initialize settings on component creation
  connectedCallback() {
    super.connectedCallback();
    this.applySettings();
  }
}

// Register the component
customElements.define('webropol-settings-modal', WebropolSettingsModal);
