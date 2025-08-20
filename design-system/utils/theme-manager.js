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
  // Use 'style' to align with applyTheme() expectation
  style: 'background: linear-gradient(to bottom right, #fff1e0ff, #ffead1ff) !important;'
      }
    },
    [this.THEMES.OCEAN]: {
      name: 'Ocean',
      icon: 'fa-droplet',
      background: {
        class: 'bg-ocean-to-br',
        style: 'background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff) !important;'
      }
    }
  };

  static STORAGE_KEY = 'webropol-theme';

  /**
   * Get current theme
   */
  static getCurrentTheme() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    // Migrate legacy value 'sky' -> 'ocean'
    if (stored === 'sky') {
      localStorage.setItem(this.STORAGE_KEY, this.THEMES.OCEAN);
      return this.THEMES.OCEAN;
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
    
    // Apply inline style as fallback
  body.style.cssText = config.background.style || '';

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
        background: linear-gradient(to bottom right, #fff1e0ff, #ffead1ff) !important;
      }

      /* Ocean theme */
      .bg-ocean-to-br {
        background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff) !important;
      }

      /* Legacy alias for backward compatibility */
      .bg-sky-to-br { background: linear-gradient(to bottom right, #ebf4f7, #ddf0f7ff) !important; }

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
