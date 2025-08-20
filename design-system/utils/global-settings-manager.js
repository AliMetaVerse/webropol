/**
 * Webropol Global Settings Manager
 * Manages application-wide settings and provides a centralized API
 */

export class GlobalSettingsManager {
  constructor() {
    this.defaultSettings = {
      showFloatingButton: true,
      darkMode: false,
      autoSave: true,
      notifications: true,
      compactMode: false,
      autoLogout: 30, // minutes
      language: 'en'
    };
    
    this.settings = this.loadSettings();
    this.listeners = new Set();
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
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply compact mode
    if (this.settings.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }

    // Apply floating button visibility
    this.applyFloatingButtonVisibility();

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

    // Clear listeners
    this.listeners.clear();
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
