/**
 * Webropol Settings System Initializer
 * Ensures proper loading order and initialization of the global settings system
 */

class SettingsSystemInitializer {
  constructor() {
    this.initialized = false;
    this.components = {
      baseComponent: false,
      settingsModal: false,
      globalSettingsManager: false
    };
    this.callbacks = [];
  }

  async initialize() {
    if (this.initialized) {
      return Promise.resolve();
    }

    try {
      console.log('Initializing Webropol Settings System...');

      // Load BaseComponent first
      console.log('Loading BaseComponent...');
      await import('./base-component.js');
      this.components.baseComponent = true;
      console.log('✓ BaseComponent loaded');

      // Load SettingsModal
      console.log('Loading SettingsModal...');
      await import('../components/modals/SettingsModal.js');
      this.components.settingsModal = true;
      console.log('✓ SettingsModal loaded');

      // Load GlobalSettingsManager
      console.log('Loading GlobalSettingsManager...');
      const { globalSettingsManager } = await import('./global-settings-manager.js');
      this.components.globalSettingsManager = true;
      
      // Make it globally available
      window.globalSettingsManager = globalSettingsManager;
      console.log('✓ GlobalSettingsManager loaded and available globally');

      // Wait a bit for custom elements to register
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify custom element registration
      if (!customElements.get('webropol-settings-modal')) {
        throw new Error('webropol-settings-modal component failed to register');
      }

      this.initialized = true;
      console.log('✅ Webropol Settings System initialized successfully');

      // Call any pending callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(globalSettingsManager);
        } catch (error) {
          console.error('Error in settings system callback:', error);
        }
      });
      this.callbacks = [];

      return globalSettingsManager;

    } catch (error) {
      console.error('❌ Failed to initialize Webropol Settings System:', error);
      throw error;
    }
  }

  onReady(callback) {
    if (this.initialized && window.globalSettingsManager) {
      callback(window.globalSettingsManager);
    } else {
      this.callbacks.push(callback);
      // Auto-initialize if not already in progress
      if (!this.initialized) {
        this.initialize().catch(console.error);
      }
    }
  }

  isReady() {
    return this.initialized && window.globalSettingsManager;
  }

  getStatus() {
    return {
      initialized: this.initialized,
      components: { ...this.components },
      customElementRegistered: !!customElements.get('webropol-settings-modal'),
      globalManagerAvailable: !!window.globalSettingsManager
    };
  }
}

// Create and export singleton
export const settingsSystemInitializer = new SettingsSystemInitializer();

// Make it globally available for debugging
window.settingsSystemInitializer = settingsSystemInitializer;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    settingsSystemInitializer.initialize().catch(console.error);
  });
} else {
  settingsSystemInitializer.initialize().catch(console.error);
}
