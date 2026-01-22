/**
 * Webropol Global Settings Manager
 * Manages application-wide settings and provides a centralized API
 */

export class GlobalSettingsManager {
  constructor() {
    this.defaultSettings = {
  showFloatingButton: false,
      darkMode: false,
      autoSave: true,
      notifications: true,
      compactMode: false,
      autoLogout: 30, // minutes
  // Behavior: enable the new Library sidebar (collapse + floating menu)
  librarySidebarEnhanced: false,
  language: 'en',
  // Promo settings
  promosEnabled: false,
  promoFrequency: 'per-route-session', // future: 'always' | 'daily' | 'per-route-session'
  // New: control visibility of Header Create menu
  showHeaderCreateMenu: true,
  // New: control visibility of Rating selector
  showRatingSelector: true,
  // New: feedback question type
  feedbackQuestionType: 'rating', // 'rating', 'openended', 'nps'
  // Rating animation settings
  ratingAnimationEnabled: true,
  ratingAnimationFrequency: 3, // times per day
  ratingAnimationDuration: 5000, // milliseconds
  ratingAnimationType: 'wave', // 'wave' or 'attention'
  // Back-compat for Header/UI that read settingsAnimation*
  settingsAnimationEnabled: true,
  settingsAnimationFrequency: 3,
  settingsAnimationDuration: 5000,
  settingsAnimationType: 'ripple'
    ,
    // AI assistant visibility controls
    aiAssistant: {
      // Control Panel (Features): master app-wide visibility toggle. Default hidden.
      // If hidden here => hidden everywhere in the App (but still configurable in CP view itself).
      enabledInApp: false,
  // Settings Modal control (user-level): when master is on, this flag controls header visibility.
      enabledFromSettings: true
    },
    // Settings Modal meta-controls (control what the Settings modal shows)
    settingsModal: {
      // Section visibility
      showInterfaceSection: true,
      showBehaviorSection: true,
      showAnimationSection: true,
      // Control-level visibility
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
      showAnimationDuration: true,
      showDevModeToggle: false
    },
    // Module controls
    modules: {
      surveysEnabled: true,
  dashboardsEnabled: false,
  adminToolsEnabled: false,
  brandingEnabled: false,
  shopEnabled: false,
  eventsEnabled: false,
      mywebropolEnabled: true,
  newsEnabled: true,
  trainingEnabled: false,
  smsEnabled: false,
  exwEnabled: false,
  caseManagementEnabled: false,
      showInSidebar: true,
      showInHeader: true,
      mobileResponsive: true
    },
    // Feature controls
    features: {
      // Survey features
      surveyCreateEnabled: true,
      surveyEditEnabled: true,
      surveyPreviewEnabled: true,
      surveyAnalyticsEnabled: true,
      surveyExportEnabled: true,
      // Dashboard features
      dashboardWidgetsEnabled: true,
      customDashboardsEnabled: true,
      realtimeUpdatesEnabled: true,
      dashboardExportEnabled: true,
      // Admin features
      userManagementEnabled: true,
      permissionsEnabled: true,
      auditLogsEnabled: true,
      backupRestoreEnabled: true,
      // Shop features
      smsCreditsEnabled: true,
      productCatalogEnabled: true,
      billingEnabled: true,
      customerSupportEnabled: true
    }
    };
    
    this.settings = this.loadSettings();
    this.listeners = new Set();
    this.moduleGroupMap = new Map([
      ['surveys', 'survey'],
      ['survey', 'survey'],
      ['sms', 'survey'],
      ['2-way sms', 'survey'],
      ['two-way sms', 'survey'],
      ['exw', 'survey'],
      ['case-management', 'survey'],
      ['case management', 'survey'],
      ['case_management', 'survey'],
      ['events', 'events']
    ]);
    this.moduleBrandingObserver = null;
    this.setupAutoLogout();
  }

  /**
   * Load settings from localStorage with fallback to defaults
   */
  loadSettings() {
    try {
      const stored = localStorage.getItem('webropol_global_settings');
      return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : { ...this.defaultSettings };
    } catch (error) {
      console.warn('Error loading settings from localStorage:', error);
      return { ...this.defaultSettings };
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('webropol_global_settings', JSON.stringify(this.settings));
      this.applySettings();
      this.notifyListeners('settings-changed', this.settings);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }

  /**
   * Get a specific setting value
   */
  getSetting(key) {
    return this.settings[key] !== undefined ? this.settings[key] : this.defaultSettings[key];
  }

  /**
   * Set a specific setting value
   */
  setSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }

  /**
   * Toggle a boolean setting
   */
  toggleSetting(key) {
    if (typeof this.settings[key] === 'boolean') {
      this.settings[key] = !this.settings[key];
      this.saveSettings();
    }
  }

  /**
   * Reset all settings to defaults
   */
  resetSettings() {
    this.settings = { ...this.defaultSettings };
    this.saveSettings();
    this.notifyListeners('settings-reset', this.settings);
  }

  /**
   * Get all current settings
   */
  getAllSettings() {
    return { ...this.settings };
  }

  /**
   * Apply settings to the DOM and application
   */
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
    this.applyFloatingButtonVisibility();

  // Apply promo settings (show/hide existing instance)
  this.applyPromoVisibility();

  // Apply header create menu visibility
  this.applyHeaderCreateMenuVisibility();

  // Apply rating selector visibility
  this.applyRatingVisibility();

  // Apply AI assistant visibility rules across headers
  this.applyAIAssistantVisibility();

  // Apply module-specific branding tokens
  this.applyModuleBranding();

    // Update auto-logout timer
    this.setupAutoLogout();

    // Notify listeners that settings have been applied
    this.notifyListeners('settings-applied', this.settings);
    
    // Dispatch global event for non-component listeners
    window.dispatchEvent(new CustomEvent('webropol-settings-applied', { 
      detail: { settings: this.settings } 
    }));
  }

  /**
   * Apply floating button visibility setting
   */
  applyFloatingButtonVisibility() {
    const floatingButtons = document.querySelectorAll('webropol-floating-button');
    floatingButtons.forEach(button => {
      if (this.settings.showFloatingButton) {
        button.style.display = '';
        button.removeAttribute('hidden');
      } else {
        button.style.display = 'none';
        button.setAttribute('hidden', '');
      }
    });
  }

  /**
   * Apply header create menu visibility across any headers on the page
   */
  applyHeaderCreateMenuVisibility() {
    const headers = document.querySelectorAll('webropol-header');
    headers.forEach(header => {
      const container = header.querySelector('[data-create-menu]');
      if (!container) return;
      if (this.settings.showHeaderCreateMenu) {
        container.style.display = '';
        container.removeAttribute('hidden');
      } else {
        container.style.display = 'none';
        container.setAttribute('hidden', '');
      }
    });
  }

  /**
   * Apply promo visibility across pages
   */
  applyPromoVisibility() {
    try {
      const inst = document.querySelector('webropol-promo');
      if (!inst) return;
      if (this.settings.promosEnabled) {
        // trigger internal logic to show on next route or immediately
        if (typeof inst.applyVisibilityFromSettings === 'function') inst.applyVisibilityFromSettings();
      } else {
        if (typeof inst.hide === 'function') inst.hide();
      }
    } catch (_) {}
  }

  /**
   * Apply rating selector visibility across any headers on the page
   */
  applyRatingVisibility() {
    const headers = document.querySelectorAll('webropol-header');
    headers.forEach(header => {
      // Re-render the header to apply visibility changes
      if (typeof header.render === 'function') {
        header.render();
      }
    });
  }

  /**
   * Apply AI assistant visibility to headers based on rules
   * Rules summary:
   * - Control Panel (Features) toggle (aiAssistant.enabledInApp): if false => assistant hidden across the App (but CP unaffected)
   * - Settings (Functions → Control) toggle (aiAssistant.enabledFromSettings): controls App header visibility only; Settings always keeps control UI
   */
  applyAIAssistantVisibility() {
    const headers = document.querySelectorAll('webropol-header');
    headers.forEach(header => {
      if (typeof header.render === 'function') {
        header.render();
      }
    });
  // Settings modal will conditionally render the AI control based on master flag; no need to disable dynamically here.
  }

  /**
   * Setup auto-logout functionality
   */
  setupAutoLogout() {
    // Clear existing timer
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }

    // If auto-logout is disabled, return
    if (!this.settings.autoLogout || this.settings.autoLogout === 0) {
      return;
    }

    const timeoutMs = this.settings.autoLogout * 60 * 1000; // Convert minutes to milliseconds
    
    const resetTimer = () => {
      if (this.autoLogoutTimer) {
        clearTimeout(this.autoLogoutTimer);
      }
      
      this.autoLogoutTimer = setTimeout(() => {
        this.notifyListeners('auto-logout-triggered');
        window.dispatchEvent(new CustomEvent('webropol-auto-logout'));
      }, timeoutMs);
    };

    // Reset timer on user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Remove existing listeners
    if (this.activityResetTimer) {
      activityEvents.forEach(event => {
        document.removeEventListener(event, this.activityResetTimer);
      });
    }
    
    this.activityResetTimer = resetTimer;
    
    // Add activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // Initial timer setup
    resetTimer();
  }

  /**
   * Open the global settings modal
   */
  openSettingsModal() {
    let settingsModal = document.querySelector('webropol-settings-modal');
    
    if (!settingsModal) {
      // Create the modal if it doesn't exist
      settingsModal = document.createElement('webropol-settings-modal');
      document.body.appendChild(settingsModal);
    }
    
    // Open the modal
    if (settingsModal.open) {
      settingsModal.open();
    } else {
      settingsModal.setAttribute('open', '');
    }
  }

  /**
   * Add a listener for settings events
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return unsubscribe function
  }

  /**
   * Remove a listener
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of an event
   */
  notifyListeners(eventType, data = null) {
    this.listeners.forEach(callback => {
      try {
        callback(eventType, data);
      } catch (error) {
        console.error('Error in settings listener:', error);
      }
    });
  }

  /**
   * Import settings from an object (useful for user preferences sync)
   */
  importSettings(newSettings) {
    // Validate and merge settings
    const validatedSettings = {};
    
    Object.keys(this.defaultSettings).forEach(key => {
      if (newSettings.hasOwnProperty(key)) {
        validatedSettings[key] = newSettings[key];
      }
    });
    
    this.settings = { ...this.settings, ...validatedSettings };
    this.saveSettings();
  }

  /**
   * Export current settings (useful for user preferences sync)
   */
  exportSettings() {
    return { ...this.settings };
  }

  /**
   * Initialize the settings manager
   */
  init() {
    // Apply settings immediately
    this.applySettings();
    
    // Listen for settings modal events
    document.addEventListener('settings-changed', (e) => {
      if (e.detail && e.detail.settings) {
        this.settings = { ...this.settings, ...e.detail.settings };
      }
    });

    // Listen globally for requests to open settings (from components like Header)
    document.addEventListener('settings-open', (e) => {
      // Prevent any default navigation from link clicks
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      this.openSettingsModal();
    });

    // Add keyboard shortcut for settings (Ctrl/Cmd + ,)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        this.openSettingsModal();
      }
    });

    // Listen for page visibility changes to handle auto-logout
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden, pause auto-logout timer
        if (this.autoLogoutTimer) {
          clearTimeout(this.autoLogoutTimer);
        }
      } else {
        // Page is visible again, restart auto-logout timer
        this.setupAutoLogout();
      }
    });

    // Ensure module branding stays in sync with navigation state
    this.observeModuleBranding();

    // Listen for SPA navigation events to refresh module branding immediately
    window.addEventListener('spa-route-change', () => {
      this.applyModuleBranding();
    });
  }

  /**
   * Cleanup function
   */
  destroy() {
    // Clear timers
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }

    // Remove activity listeners
    if (this.activityResetTimer) {
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      activityEvents.forEach(event => {
        document.removeEventListener(event, this.activityResetTimer);
      });
    }

    if (this.moduleBrandingObserver) {
      this.moduleBrandingObserver.disconnect();
      this.moduleBrandingObserver = null;
    }

    // Clear listeners
    this.listeners.clear();
  }

  resolveModuleGroup(moduleKey) {
    if (!moduleKey) return null;
    const normalized = moduleKey.toString().toLowerCase().trim();
    return this.moduleGroupMap.get(normalized) || null;
  }

  applyModuleBranding() {
    const body = document.body;
    if (!body) return;

    const manualOverride = body.getAttribute('data-module-group-manual') || body.dataset.moduleGroupManual;
    if (manualOverride) {
      body.setAttribute('data-module-group', manualOverride);
      return;
    }

    const sidebar = document.querySelector('webropol-sidebar');
    const activeModule = sidebar?.getAttribute('active');
    const fallbackModule = body.getAttribute('data-module-id') || body.dataset.moduleId;

    const moduleGroup = this.resolveModuleGroup(activeModule) || this.resolveModuleGroup(fallbackModule);

    if (moduleGroup) {
      body.setAttribute('data-module-group', moduleGroup);
    } else {
      body.removeAttribute('data-module-group');
    }
  }

  observeModuleBranding(retryCount = 0) {
    const MAX_RETRIES = 5;
    if (this.moduleBrandingObserver) {
      return;
    }

    const sidebar = document.querySelector('webropol-sidebar');

    if (sidebar) {
      this.moduleBrandingObserver = new MutationObserver(() => this.applyModuleBranding());
      this.moduleBrandingObserver.observe(sidebar, { attributes: true, attributeFilter: ['active'] });
      this.applyModuleBranding();
      return;
    }

    if (retryCount < MAX_RETRIES) {
      setTimeout(() => this.observeModuleBranding(retryCount + 1), 300);
    }
  }
}

// Create and export a singleton instance
export const globalSettingsManager = new GlobalSettingsManager();

// Make it available globally for easy access
window.globalSettingsManager = globalSettingsManager;

// Auto-initialize when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    globalSettingsManager.init();
  });
} else {
  globalSettingsManager.init();
}
