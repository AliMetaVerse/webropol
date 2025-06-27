/**
 * Webropol Design System - Main Entry Point
 * Imports and initializes all components and utilities
 */

// Import utilities
import { BaseComponent } from './utils/base-component.js';
import { ThemeUtils } from './utils/theme-utils.js';
import { AccessibilityUtils } from './utils/accessibility.js';

// Import design tokens
import { designTokens, componentTokens } from './styles/tokens.js';

// Import components
import { WebropolButton } from './components/buttons/Button.js';
import { WebropolCard } from './components/cards/Card.js';
import { WebropolActionCard } from './components/cards/ActionCard.js';
import { WebropolListCard } from './components/cards/ListCard.js';
import { WebropolVideoCard } from './components/cards/VideoCard.js';
import { WebropolConfigurableCard } from './components/cards/ConfigurableCard.js';
import { WebropolModal } from './components/modals/Modal.js';
import { WebropolBadge } from './components/feedback/Badge.js';
import { WebropolTooltip } from './components/feedback/Tooltip.js';
import { WebropolLoading } from './components/feedback/Loading.js';
import { WebropolTabs } from './components/navigation/Tabs.js';
import { WebropolSidebar } from './components/navigation/Sidebar.js';
import { WebropolHeader } from './components/navigation/Header.js';
import { WebropolInput } from './components/forms/Input.js';

/**
 * Main Design System Class
 */
class WebropolDesignSystem {
  constructor() {
    this.version = '1.0.0';
    this.components = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the design system
   */
  async init(options = {}) {
    if (this.initialized) {
      console.warn('Webropol Design System is already initialized');
      return;
    }

    try {
      // Set default options
      const defaultOptions = {
        theme: 'auto', // 'light', 'dark', 'auto'
        accessibility: true,
        cssCustomProperties: true,
        announcements: true
      };

      const config = { ...defaultOptions, ...options };

      // Initialize accessibility features
      if (config.accessibility) {
        AccessibilityUtils.initialize();
      }

      // Initialize theme
      if (config.theme === 'auto') {
        ThemeUtils.initializeTheme();
      } else {
        if (config.theme === 'dark') {
          ThemeUtils.applyDarkTheme();
        } else {
          ThemeUtils.applyLightTheme();
        }
      }

      // Generate CSS custom properties
      if (config.cssCustomProperties) {
        this.injectCSSCustomProperties();
      }

      // Register all components
      this.registerComponents();

      // Set up global event listeners
      this.setupGlobalEvents();

      this.initialized = true;

      if (config.announcements) {
        console.log('🎨 Webropol Design System initialized successfully');
        console.log(`📦 Version: ${this.version}`);
        console.log(`🧩 Components loaded: ${this.components.size}`);
      }

    } catch (error) {
      console.error('Failed to initialize Webropol Design System:', error);
    }
  }

  /**
   * Register all components
   */
  registerComponents() {
    const componentList = [
      { name: 'webropol-button', class: WebropolButton },
      { name: 'webropol-card', class: WebropolCard },
      { name: 'webropol-action-card', class: WebropolActionCard },
      { name: 'webropol-list-card', class: WebropolListCard },
      { name: 'webropol-video-card', class: WebropolVideoCard },
      { name: 'webropol-configurable-card', class: WebropolConfigurableCard },
      { name: 'webropol-modal', class: WebropolModal },
      { name: 'webropol-badge', class: WebropolBadge },
      { name: 'webropol-tooltip', class: WebropolTooltip },
      { name: 'webropol-loading', class: WebropolLoading },
      { name: 'webropol-tabs', class: WebropolTabs },
      { name: 'webropol-sidebar', class: WebropolSidebar },
      { name: 'webropol-header', class: WebropolHeader },
      { name: 'webropol-input', class: WebropolInput }
    ];

    componentList.forEach(({ name, class: ComponentClass }) => {
      if (!customElements.get(name)) {
        customElements.define(name, ComponentClass);
        this.components.set(name, ComponentClass);
      }
    });
  }

  /**
   * Inject CSS custom properties
   */
  injectCSSCustomProperties() {
    const existingStyle = document.getElementById('webropol-design-tokens');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'webropol-design-tokens';
    style.textContent = ThemeUtils.generateCSSCustomProperties();
    document.head.appendChild(style);
  }

  /**
   * Set up global event listeners
   */
  setupGlobalEvents() {
    // Listen for theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('webropol-theme') === null) {
        if (e.matches) {
          ThemeUtils.applyDarkTheme();
        } else {
          ThemeUtils.applyLightTheme();
        }
      }
    });

    // Global component event listener for debugging
    document.addEventListener('webropol-component-error', (event) => {
      console.error('Webropol Component Error:', event.detail);
    });
  }

  /**
   * Get component instance by selector
   */
  getComponent(selector) {
    return document.querySelector(selector);
  }

  /**
   * Get all component instances by tag name
   */
  getComponents(tagName) {
    return Array.from(document.querySelectorAll(tagName));
  }

  /**
   * Create component programmatically
   */
  createComponent(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName);
    
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    if (content) {
      element.innerHTML = content;
    }
    
    return element;
  }

  /**
   * Get design tokens
   */
  getTokens() {
    return designTokens;
  }

  /**
   * Get component tokens
   */
  getComponentTokens() {
    return componentTokens;
  }

  /**
   * Switch theme
   */
  setTheme(theme) {
    if (theme === 'dark') {
      ThemeUtils.applyDarkTheme();
    } else if (theme === 'light') {
      ThemeUtils.applyLightTheme();
    } else {
      ThemeUtils.toggleTheme();
    }
  }

  /**
   * Get current theme
   */
  getTheme() {
    return ThemeUtils.getCurrentTheme();
  }

  /**
   * Check if component is registered
   */
  hasComponent(tagName) {
    return this.components.has(tagName);
  }

  /**
   * Get version information
   */
  getVersion() {
    return {
      version: this.version,
      components: Array.from(this.components.keys()),
      initialized: this.initialized
    };
  }
}

// Create and export global instance
const designSystem = new WebropolDesignSystem();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    designSystem.init();
  });
} else {
  designSystem.init();
}

// Export for manual usage
export default designSystem;
export {
  BaseComponent,
  ThemeUtils,
  AccessibilityUtils,
  designTokens,
  componentTokens,
  WebropolButton,
  WebropolCard,
  WebropolModal,
  WebropolBadge,
  WebropolTooltip,
  WebropolLoading,
  WebropolTabs,
  WebropolInput
};

// Make available globally for non-module usage
if (typeof window !== 'undefined') {
  window.WebropolDesignSystem = designSystem;
}
