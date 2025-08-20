/**
 * Enhanced Theme Manager
 * Manages multiple themes including background variations
 */

export class ThemeManager {
  static THEMES = {
    WARM: 'warm',
    SKY: 'sky'
  };

  static THEME_CONFIGS = {
    [this.THEMES.WARM]: {
      name: 'Warm',
      icon: 'fa-sun',
      background: {
        class: 'bg-sun-to-br',
        style: 'background: linear-gradient(to bottom right, #fed7aa, #fed7aa);'
      }
    },
    [this.THEMES.SKY]: {
      name: 'Sky',
      icon: 'fa-cloud',
      background: {
        class: 'bg-sky-to-br',
        style: 'background: linear-gradient(to bottom right, #ebf4f7, #ebf4f7);'
      }
    }
  };

  static STORAGE_KEY = 'webropol-theme';

  /**
   * Get current theme
   */
  static getCurrentTheme() {
    return localStorage.getItem(this.STORAGE_KEY) || this.THEMES.SKY;
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

    // Add current theme class
    body.classList.add(config.background.class);
    
    // Apply inline style as fallback
    body.style.cssText = config.background.style;

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
        background: linear-gradient(to bottom right, #ffead1ff, #fed7aa) !important;
      }

      .bg-sky-to-br {
        background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff) !important;
      }

      /* Theme transition for smooth changes */
      body {
        transition: background 0.3s ease;
      }
    `;
    
    document.head.appendChild(style);
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
