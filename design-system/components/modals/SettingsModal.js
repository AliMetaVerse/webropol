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
      showFloatingButton: false,
      darkMode: false,
      autoSave: true,
      notifications: true,
      compactMode: false,
      autoLogout: 30, // minutes
      language: 'en',
  // Promos
  promosEnabled: false,
      promoFrequency: 'per-route-session',
      // New: control visibility of Header Create menu
      showHeaderCreateMenu: true,
      // New: control visibility of Rating selector
      showRatingSelector: true,
      // New: feedback question type
      feedbackQuestionType: 'rating', // 'rating', 'openended', 'nps'
  // Align with rating animation terms from request
      ratingAnimationEnabled: true,
      ratingAnimationFrequency: 3, // times per day
      ratingAnimationDuration: 5000, // milliseconds
  ratingAnimationType: 'wave',
  // Back-compat: keep existing settingsAnimation* keys used by UI/Header
  settingsAnimationEnabled: true,
  settingsAnimationFrequency: 3,
  settingsAnimationDuration: 5000,
  settingsAnimationType: 'ripple', // closest to "wave"
  // AI assistant default struct (master off by default; settings flag true so it takes effect once master is enabled from CP Features)
  aiAssistant: { enabledInApp: false, enabledFromSettings: true },
  // Meta: control what this modal shows
      settingsModal: {
        showInterfaceSection: true,
        showBehaviorSection: true,
        showAnimationSection: true,
        showDarkMode: false,
        showCompactMode: false,
        showFloatingButton: false,
        showPromosEnabled: false,
        showHeaderCreateMenu: true,
        showRatingSelector: true,
        showAutoSave: true,
        showNotifications: true,
        showAutoLogout: true,
        showFeedbackType: true,
        showSettingsAnimation: true,
        showAnimationType: true,
        showAnimationFrequency: true,
  showAnimationDuration: true
      }
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
        showFloatingButton: false,
        darkMode: false,
        autoSave: true,
        notifications: true,
        compactMode: false,
        autoLogout: 30,
        language: 'en',
  promosEnabled: false,
        promoFrequency: 'per-route-session',
        showHeaderCreateMenu: true,
        showRatingSelector: true,
        feedbackQuestionType: 'rating',
  ratingAnimationEnabled: true,
  ratingAnimationFrequency: 3,
  ratingAnimationDuration: 5000,
  ratingAnimationType: 'wave',
  // Back-compat for UI/Header controls
  settingsAnimationEnabled: true,
  settingsAnimationFrequency: 3,
  settingsAnimationDuration: 5000,
  settingsAnimationType: 'ripple',
  aiAssistant: { enabledInApp: false, enabledFromSettings: true },
        settingsModal: {
          showInterfaceSection: true,
          showBehaviorSection: true,
          showAnimationSection: true,
          showDarkMode: false,
          showCompactMode: false,
          showFloatingButton: false,
          showPromosEnabled: false,
          showHeaderCreateMenu: true,
          showRatingSelector: true,
          showAutoSave: true,
          showNotifications: true,
          showAutoLogout: true,
          showFeedbackType: true,
          showSettingsAnimation: true,
          showAnimationType: true,
          showAnimationFrequency: true,
          showAnimationDuration: true
        }
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

      // If duration > 4s, loop for the full duration by increasing iteration count
      const baseCycleMap = {
        magnetic: 1500,
        morphing: 2500,
        ripple: 1800,
        breathing: 2200,
        elastic: 1000,
        particle: 1200
      };
      const baseCycle = baseCycleMap[type] || 1500;
      const targetEl = (type === 'breathing' || type === 'elastic' || type === 'particle') ? feedbackButton : feedbackContainer;
      if (duration > 4000 && targetEl) {
        const iterations = Math.max(2, Math.ceil(duration / baseCycle));
        targetEl.style.animationIterationCount = String(iterations);
      }
      
       // Auto-cleanup based on animation duration
       setTimeout(() => {
         feedbackContainer.classList.remove('settings-magnetic-active', 'settings-morphing-active', 'settings-ripple-active');
         feedbackButton.classList.remove('settings-breathing-active', 'settings-elastic-active', 'settings-particle-active');
        // Cleanup inline overrides
        if (feedbackContainer) feedbackContainer.style.animationIterationCount = '';
        if (feedbackButton) feedbackButton.style.animationIterationCount = '';
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

  _applyNavActiveStyles() {
    const activePanel = this._activePanel || 'interface';
    this.querySelectorAll('.settings-nav-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-panel') === activePanel;
      btn.style.background = isActive ? '#ffffff' : '';
      btn.style.color = isActive ? '#0e7490' : '#6b7280';
      btn.style.boxShadow = isActive ? '0 1px 3px rgba(0,0,0,0.08)' : '';
      btn.style.fontWeight = isActive ? '500' : '400';
    });
  }

  render() {
    const isOpen = this.getBoolAttr('open');
    const sm = (this.settings && this.settings.settingsModal) ? this.settings.settingsModal : {};

    // Row helpers — each row is a self-contained card for grid layout
    const toggle = (key, label, desc, icon, checked) => `
      <div class="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl group hover:border-webropol-primary-100 hover:bg-webropol-primary-50/30 transition-colors">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-webropol-primary-100 border border-gray-100 flex items-center justify-center flex-shrink-0 transition-colors">
            <i class="fal ${icon} text-gray-400 group-hover:text-webropol-primary-500 text-sm transition-colors"></i>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-medium text-gray-800">${label}</div>
            <div class="text-xs text-gray-400 mt-0.5 leading-tight">${desc}</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
          <input type="checkbox" class="sr-only peer" data-setting="${key}" ${checked ? 'checked' : ''}>
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-webropol-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-primary-500"></div>
        </label>
      </div>`;

    const select = (key, label, desc, icon, optionsHtml) => `
      <div class="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl group hover:border-webropol-primary-100 hover:bg-webropol-primary-50/30 transition-colors">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-webropol-primary-100 border border-gray-100 flex items-center justify-center flex-shrink-0 transition-colors">
            <i class="fal ${icon} text-gray-400 group-hover:text-webropol-primary-500 text-sm transition-colors"></i>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-medium text-gray-800">${label}</div>
            <div class="text-xs text-gray-400 mt-0.5 leading-tight">${desc}</div>
          </div>
        </div>
        <select data-setting="${key}" class="ml-3 flex-shrink-0 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-webropol-primary-300 focus:border-transparent cursor-pointer max-w-[100px]">
          ${optionsHtml}
        </select>
      </div>`;

    const section = (title, desc, icon, rows) => {
      const content = rows.filter(Boolean).join('');
      if (!content.trim()) return '';
      return `
      <div class="flex flex-col">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-7 h-7 rounded-lg bg-webropol-primary-50 border border-webropol-primary-100 flex items-center justify-center flex-shrink-0">
            <i class="fal ${icon} text-webropol-primary-500 text-xs"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800 leading-none">${title}</p>
            <p class="text-xs text-gray-400 mt-0.5">${desc}</p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          ${content}
        </div>
      </div>`;
    };

    // Build interface rows
    const interfaceRows = [
      sm.showDarkMode !== false ? toggle('darkMode', 'Dark Mode', 'Switch to a dark color scheme', 'fa-moon', this.settings.darkMode) : '',
      sm.showCompactMode !== false ? toggle('compactMode', 'Compact Mode', 'Reduce spacing for a denser layout', 'fa-compress-alt', this.settings.compactMode) : '',
      sm.showFloatingButton !== false ? toggle('showFloatingButton', 'Floating Button', 'Show the quick-create overlay button', 'fa-circle-plus', this.settings.showFloatingButton) : '',
      sm.showPromosEnabled !== false ? toggle('promosEnabled', 'Promotions', 'Show promotional toasts and banners', 'fa-tag', this.settings.promosEnabled) : '',
      sm.showHeaderCreateMenu !== false ? toggle('showHeaderCreateMenu', 'Header Create Menu', 'Show the Create dropdown in the header', 'fa-plus-circle', this.settings.showHeaderCreateMenu) : '',
    ];

    // Build behavior rows
    const behaviorRows = [
      this.settings.aiAssistant?.enabledInApp ? toggle('aiAssistant.enabledFromSettings', 'AI Assistant', 'Enable AI-powered features and suggestions', 'fa-robot', this.settings.aiAssistant?.enabledFromSettings) : '',
      sm.showAutoSave !== false ? toggle('autoSave', 'Auto-save', 'Automatically save changes while editing', 'fa-save', this.settings.autoSave) : '',
      sm.showNotifications !== false ? toggle('notifications', 'Notifications', 'Receive alerts for important events', 'fa-bell', this.settings.notifications) : '',
      toggle('settingsModal.showDevModeToggle', 'Dev Mode Toggle', 'Show draft/published toggle in collection pages', 'fa-code', this.settings.settingsModal?.showDevModeToggle || false),
      sm.showAutoLogout !== false ? select('autoLogout', 'Auto Logout', 'Sign out after a period of inactivity', 'fa-sign-out-alt',
        `<option value="15" ${this.settings.autoLogout === 15 ? 'selected' : ''}>15 min</option>
         <option value="30" ${this.settings.autoLogout === 30 ? 'selected' : ''}>30 min</option>
         <option value="60" ${this.settings.autoLogout === 60 ? 'selected' : ''}>1 hour</option>
         <option value="120" ${this.settings.autoLogout === 120 ? 'selected' : ''}>2 hours</option>
         <option value="0" ${this.settings.autoLogout === 0 ? 'selected' : ''}>Never</option>`) : '',
    ];

    // Build animation rows
    const animationRows = [
      sm.showRatingSelector !== false ? toggle('showRatingSelector', 'Rating Selector', 'Display the star rating control in the header', 'fa-star', this.settings.showRatingSelector) : '',
      sm.showSettingsAnimation !== false ? toggle('settingsAnimationEnabled', 'Settings Animation', 'Animate the settings icon periodically', 'fa-sparkles', this.settings.settingsAnimationEnabled) : '',
      sm.showFeedbackType !== false ? select('feedbackQuestionType', 'Feedback Type', 'Choose the feedback question style', 'fa-comment-dots',
        `<option value="rating" ${this.settings.feedbackQuestionType === 'rating' ? 'selected' : ''}>Star Rating</option>
         <option value="openended" ${this.settings.feedbackQuestionType === 'openended' ? 'selected' : ''}>Open-ended</option>
         <option value="nps" ${this.settings.feedbackQuestionType === 'nps' ? 'selected' : ''}>NPS Score</option>`) : '',
      sm.showAnimationType !== false ? select('settingsAnimationType', 'Animation Style', 'Choose the animation effect type', 'fa-wand-magic',
        `<option value="magnetic" ${this.settings.settingsAnimationType === 'magnetic' ? 'selected' : ''}>Magnetic Pull</option>
         <option value="morphing" ${this.settings.settingsAnimationType === 'morphing' ? 'selected' : ''}>Morphing Gradient</option>
         <option value="ripple" ${this.settings.settingsAnimationType === 'ripple' ? 'selected' : ''}>Ripple Wave</option>
         <option value="breathing" ${this.settings.settingsAnimationType === 'breathing' ? 'selected' : ''}>Breathing Glow</option>
         <option value="elastic" ${this.settings.settingsAnimationType === 'elastic' ? 'selected' : ''}>Elastic Bounce</option>
         <option value="particle" ${this.settings.settingsAnimationType === 'particle' ? 'selected' : ''}>Particle Burst</option>`) : '',
      sm.showAnimationFrequency !== false ? select('settingsAnimationFrequency', 'Daily Frequency', 'How many times per day to show the animation', 'fa-repeat',
        `<option value="1" ${this.settings.settingsAnimationFrequency === 1 ? 'selected' : ''}>Once</option>
         <option value="2" ${this.settings.settingsAnimationFrequency === 2 ? 'selected' : ''}>Twice</option>
         <option value="3" ${this.settings.settingsAnimationFrequency === 3 ? 'selected' : ''}>3 times</option>
         <option value="4" ${this.settings.settingsAnimationFrequency === 4 ? 'selected' : ''}>4 times</option>
         <option value="5" ${this.settings.settingsAnimationFrequency === 5 ? 'selected' : ''}>5 times</option>
         <option value="6" ${this.settings.settingsAnimationFrequency === 6 ? 'selected' : ''}>6 times</option>`) : '',
      sm.showAnimationDuration !== false ? select('settingsAnimationDuration', 'Duration', 'How long each animation plays', 'fa-clock',
        `<option value="1500" ${this.settings.settingsAnimationDuration === 1500 ? 'selected' : ''}>1.5 sec</option>
         <option value="2000" ${this.settings.settingsAnimationDuration === 2000 ? 'selected' : ''}>2 sec</option>
         <option value="2500" ${this.settings.settingsAnimationDuration === 2500 ? 'selected' : ''}>2.5 sec</option>
         <option value="3000" ${this.settings.settingsAnimationDuration === 3000 ? 'selected' : ''}>3 sec</option>
         <option value="4000" ${this.settings.settingsAnimationDuration === 4000 ? 'selected' : ''}>4 sec</option>
         <option value="6000" ${this.settings.settingsAnimationDuration === 6000 ? 'selected' : ''}>6 sec</option>
         <option value="8000" ${this.settings.settingsAnimationDuration === 8000 ? 'selected' : ''}>8 sec</option>
         <option value="10000" ${this.settings.settingsAnimationDuration === 10000 ? 'selected' : ''}>10 sec</option>`) : '',
      // Preview & test row
      `<div class="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl">
        <div class="flex items-center gap-3">
          <div class="preview-settings settings-animation-container w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
            <i class="fal fa-cog preview-settings-icon text-gray-400 text-sm"></i>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-800">Preview</div>
            <div class="text-xs text-gray-400">See the current animation</div>
          </div>
        </div>
        <button class="test-animation-btn ml-4 px-4 py-1.5 bg-webropol-primary-500 hover:bg-webropol-primary-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
          <i class="fal fa-play text-xs"></i>
          Test
        </button>
      </div>`,
    ];

    this.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100001] p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
<div class="settings-modal-content bg-gray-50 rounded-2xl shadow-xl w-full max-w-7xl flex flex-col overflow-hidden transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}"
             style="max-height: min(90vh, 860px)"
             role="dialog" aria-modal="true" aria-labelledby="settings-title">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-webropol-primary-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <i class="fal fa-cog text-white text-base"></i>
              </div>
              <div>
                <h2 id="settings-title" class="text-base font-semibold text-gray-900 leading-tight">Settings</h2>
                <p class="text-xs text-gray-400 mt-0.5">Customize your experience</p>
              </div>
            </div>
            <button class="modal-close w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close settings">
              <i class="fal fa-times text-sm"></i>
            </button>
          </div>

          <!-- Body: 3-col section grid -->
          <div class="modal-body flex-1 overflow-y-auto px-6 py-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              ${sm.showInterfaceSection !== false ? section('Interface', 'Control how the UI looks', 'fa-desktop', interfaceRows) : ''}
              ${sm.showBehaviorSection !== false ? section('Behavior', 'Manage how the app works for you', 'fa-sliders-h', behaviorRows) : ''}
              ${sm.showAnimationSection !== false ? section('Animations', 'Configure motion and feedback effects', 'fa-wand-magic', animationRows) : ''}
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-3.5 border-t border-gray-200 bg-white flex-shrink-0">
            <span class="text-xs text-gray-400 flex items-center gap-1.5">
              <i class="fal fa-circle-check" style="color: #10b981"></i>
              Changes saved automatically
            </span>
            <div class="flex items-center gap-2">
              <button class="reset-button px-5 py-2 text-sm font-medium text-webropol-primary-600 hover:bg-webropol-primary-50 rounded-lg transition-colors">
                Reset to defaults
              </button>
              <button class="done-button px-5 py-2 text-sm font-medium rounded-lg border border-webropol-primary-400 text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors">
                Done
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    this.bindEvents();
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
    const modalContent = this.querySelector('.settings-modal-content');
    if (modalContent) {
      this.addListener(modalContent, 'click', (e) => e.stopPropagation());
    }

    // Settings toggles
    checkboxes.forEach(checkbox => {
      this.addListener(checkbox, 'change', (e) => {
        const settingKey = e.target.getAttribute('data-setting');
        const value = e.target.checked;
        if (settingKey && settingKey.startsWith('aiAssistant.')) {
          // deep update
          const subKey = settingKey.split('.')[1];
          this.settings.aiAssistant = { ...(this.settings.aiAssistant||{}), [subKey]: value };
          this.saveSettings();
        } else if (settingKey && settingKey.startsWith('settingsModal.')) {
          // deep update for settingsModal nested keys
          const subKey = settingKey.split('.')[1];
          this.settings.settingsModal = { ...(this.settings.settingsModal||{}), [subKey]: value };
          this.saveSettings();
        } else {
          this.toggleSetting(settingKey, value);
        }
        if (['settingsAnimationEnabled'].includes(settingKey)) {
          this.triggerPreviewAnimation();
        }
      });
    });

    selects.forEach(select => {
      this.addListener(select, 'change', (e) => {
        const settingKey = e.target.getAttribute('data-setting');
        const value = e.target.value === '0' ? 0 : (isNaN(e.target.value) ? e.target.value : parseInt(e.target.value));
        if (settingKey && settingKey.startsWith('aiAssistant.')) {
          const subKey = settingKey.split('.')[1];
          this.settings.aiAssistant = { ...(this.settings.aiAssistant||{}), [subKey]: value };
          this.saveSettings();
        } else if (settingKey && settingKey.startsWith('settingsModal.')) {
          // deep update for settingsModal nested keys
          const subKey = settingKey.split('.')[1];
          this.settings.settingsModal = { ...(this.settings.settingsModal||{}), [subKey]: value };
          this.saveSettings();
        } else {
          this.toggleSetting(settingKey, value);
        }
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
