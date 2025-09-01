/**
 * Enhanced Theme Manager
 * Manages multiple themes including background variations
 */

export class ThemeManager {
  static THEMES = {
    WARM: 'warm',
    OCEAN: 'ocean'
  };

  static THEME_CONFIGS = {
    [this.THEMES.WARM]: {
      name: 'Warm',
      icon: 'fa-sun-bright',
      background: {
        class: 'bg-sun-to-br',
    // Use 'style' to align with applyTheme() expectation (no !important to allow dark-mode override)
    style: 'background: linear-gradient(to bottom right, #fff1e0ff, #ffead1ff);'
      }
    },
    [this.THEMES.OCEAN]: {
      name: 'Ocean',
      icon: 'fa-droplet',
      background: {
        class: 'bg-ocean-to-br',
    style: 'background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff);'
      }
    }
  };

  // Use a dedicated storage key for background theme to avoid conflict with dark/light preference
  static STORAGE_KEY = 'webropol-bg-theme';

  /**
   * Get current theme
   */
  static getCurrentTheme() {
    // Prefer the new key
    let stored = localStorage.getItem(this.STORAGE_KEY);
    // Migrate legacy value 'sky' -> 'ocean'
    if (stored === 'sky') {
      localStorage.setItem(this.STORAGE_KEY, this.THEMES.OCEAN);
      return this.THEMES.OCEAN;
    }
    // Backward-compat: if old key 'webropol-theme' contained a background theme value, migrate it
    if (!stored) {
      const legacy = localStorage.getItem('webropol-theme');
      if (legacy === this.THEMES.WARM || legacy === this.THEMES.OCEAN || legacy === 'sky') {
        const migrated = legacy === 'sky' ? this.THEMES.OCEAN : legacy;
        localStorage.setItem(this.STORAGE_KEY, migrated);
        stored = migrated;
      }
    }
    return stored || this.THEMES.OCEAN;
  }

  /**
   * Set theme
   */
  static setTheme(theme) {
    if (!this.THEME_CONFIGS[theme]) {
      console.warn(`Unknown theme: ${theme}`);
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, theme);
    this.applyTheme(theme);
    this.dispatchThemeChange(theme);
  }

  /**
   * Apply theme to document
   */
  static applyTheme(theme) {
    const config = this.THEME_CONFIGS[theme];
    if (!config) return;

    const body = document.body;
    
    // Remove all theme classes
    Object.values(this.THEME_CONFIGS).forEach(themeConfig => {
      body.classList.remove(themeConfig.background.class);
    });
  // Backward-compat: remove legacy class name if present
  body.classList.remove('bg-sky-to-br');

    // Add current theme class
    body.classList.add(config.background.class);
    
    // Apply or clear background inline style depending on dark mode
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      // Let CSS dark overrides control the background; clear inline background only
      body.style.removeProperty('background');
    } else {
      try {
        // Only set background property to avoid clobbering other inline styles
        const match = (config.background.style || '').match(/background:\s*([^;]+);?/i);
        const bg = match ? match[1].trim() : '';
        if (bg) body.style.setProperty('background', bg);
      } catch (_) {
        // best effort, ignore
      }
    }

    // Store current theme in data attribute
    body.setAttribute('data-theme', theme);
  }

  /**
   * Initialize theme on page load
   */
  static initialize() {
    const currentTheme = this.getCurrentTheme();
    this.applyTheme(currentTheme);
    
    // Add CSS for theme classes
    this.injectThemeStyles();

  // Ensure design tokens stylesheet is present for CSS variables and dark overrides
  this.ensureTokensStylesIncluded();

  // Ensure global mobile responsive stylesheet is present across pages
  this.ensureResponsiveStylesIncluded();

    // Re-apply theme when global settings (including dark mode) are applied
    if (typeof window !== 'undefined') {
      window.addEventListener('webropol-settings-applied', () => {
        this.applyTheme(this.getCurrentTheme());
      });

      // Provide a lightweight global helper to open settings across pages
      if (typeof window.openGlobalSettings !== 'function') {
        window.openGlobalSettings = async () => {
          try {
            // Prefer global manager if available
            if (window.globalSettingsManager && typeof window.globalSettingsManager.openSettingsModal === 'function') {
              window.globalSettingsManager.openSettingsModal();
              return;
            }
            // Ensure the SettingsModal is registered (dynamic import if needed)
            if (!customElements.get('webropol-settings-modal')) {
              try {
                await import('../components/modals/SettingsModal.js');
              } catch (_) {}
            }
            // Create/attach and open
            let modal = document.querySelector('webropol-settings-modal');
            if (!modal) {
              modal = document.createElement('webropol-settings-modal');
              document.body.appendChild(modal);
            }
            if (typeof modal.open === 'function') modal.open(); else modal.setAttribute('open', '');
          } catch (err) {
            // As a last resort emit an event others can listen to
            document.dispatchEvent(new CustomEvent('settings-open'));
          }
        };
      }
    }
  }

  /**
   * Inject theme CSS classes
   */
  static injectThemeStyles() {
    const existingStyle = document.getElementById('webropol-theme-styles');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'webropol-theme-styles';
    style.textContent = `
      .bg-sun-to-br {
        background: linear-gradient(to bottom right, #fff1e0ff, #ffead1ff);
      }

      /* Ocean theme */
      .bg-ocean-to-br {
        background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff);
      }

      /* Legacy alias for backward compatibility */
      .bg-sky-to-br { background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff); }

      /* Theme transition for smooth changes */
      body {
        transition: background 0.3s ease;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Ensure tokens.css is loaded regardless of page path
   */
  static ensureTokensStylesIncluded() {
    if (document.getElementById('webropol-tokens-css')) return;
    try {
      const tokensUrl = new URL('../styles/tokens.css', import.meta.url).href;
      const link = document.createElement('link');
      link.id = 'webropol-tokens-css';
      link.rel = 'stylesheet';
      link.href = tokensUrl;
      document.head.appendChild(link);
    } catch (e) {
      // Fallback: try common relative path from site root
      const link = document.createElement('link');
      link.id = 'webropol-tokens-css';
      link.rel = 'stylesheet';
      link.href = '/design-system/styles/tokens.css';
      document.head.appendChild(link);
    }
  }

  /**
   * Ensure mobile-responsive.css is loaded on all pages that include this theme manager
   */
  static ensureResponsiveStylesIncluded() {
    if (document.getElementById('webropol-mobile-responsive-css')) return;
    try {
      const responsiveUrl = new URL('../styles/mobile-responsive.css', import.meta.url).href;
      const link = document.createElement('link');
      link.id = 'webropol-mobile-responsive-css';
      link.rel = 'stylesheet';
      link.href = responsiveUrl;
      document.head.appendChild(link);
    } catch (e) {
      // Fallback: try common relative path from site root
      const link = document.createElement('link');
      link.id = 'webropol-mobile-responsive-css';
      link.rel = 'stylesheet';
      link.href = '/design-system/styles/mobile-responsive.css';
      document.head.appendChild(link);
    }
  }

  /**
   * Dispatch theme change event
   */
  static dispatchThemeChange(theme) {
    const event = new CustomEvent('theme-changed', {
      detail: { 
        theme,
        config: this.THEME_CONFIGS[theme]
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get theme configuration
   */
  static getThemeConfig(theme) {
    return this.THEME_CONFIGS[theme];
  }

  /**
   * Get all available themes
   */
  static getAllThemes() {
    return Object.entries(this.THEME_CONFIGS).map(([key, config]) => ({
      key,
      ...config
    }));
  }

  /**
   * Toggle between themes
   */
  static toggleTheme() {
    const current = this.getCurrentTheme();
    const themes = Object.keys(this.THEME_CONFIGS);
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    this.setTheme(nextTheme);
  }
}

// Auto-initialize theme when module loads
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.initialize());
  } else {
    ThemeManager.initialize();
  }
}
