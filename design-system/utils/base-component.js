/**
 * Base Component Class
 * Provides common functionality for all Webropol components
 */

export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.state = {};
    this.eventListeners = new Map();
  }

  connectedCallback() {
    this._connected = true;
    this.init();
    this.render();
    this.bindEvents();
    this.setupAccessibility();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._connected || oldValue === newValue) return;
    this.render();
    this.bindEvents();
  }

  disconnectedCallback() {
    this._connected = false;
    this.cleanup();
  }

  /**
   * Initialize component - override in subclasses
   */
  init() {
    // Override in subclasses
  }

  /**
   * Render component HTML - override in subclasses
   */
  render() {
    // Override in subclasses
  }

  /**
   * Bind event listeners - override in subclasses
   */
  bindEvents() {
    // Override in subclasses
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add keyboard navigation if interactive
    if (this.hasAttribute('tabindex') || this.hasAttribute('role')) {
      this.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event) {
    // Override in subclasses for specific keyboard behavior
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.hasAttribute('onclick') || this.onclick) {
        event.preventDefault();
        this.click();
      }
    }
  }

  /**
   * Clean up event listeners and resources
   */
  cleanup() {
    this.eventListeners.forEach((listener, element) => {
      element.removeEventListener(listener.event, listener.handler);
    });
    this.eventListeners.clear();
  }

  /**
   * Add event listener with cleanup tracking
   */
  addListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    this.eventListeners.set(element, { event, handler });
  }

  /**
   * Get attribute with default value
   */
  getAttr(name, defaultValue = '') {
    return this.getAttribute(name) || defaultValue;
  }

  /**
   * Get boolean attribute
   */
  getBoolAttr(name, defaultValue = false) {
    // If the attribute is not present, return the provided default
    if (!this.hasAttribute(name)) {
      return defaultValue;
    }
    // For boolean attributes, the mere presence implies true
    const value = this.getAttribute(name);
    if (value === '' || value === null) {
      return true;
    }
    // Explicit falsy string values
    const lowered = String(value).toLowerCase();
    if (lowered === 'false' || lowered === '0' || lowered === 'no' || lowered === 'off') {
      return false;
    }
    return true;
  }

  /**
   * Set state and trigger re-render if needed
   */
  setState(newState, shouldRerender = true) {
    this.state = { ...this.state, ...newState };
    if (shouldRerender) {
      this.render();
    }
  }

  /**
   * Emit custom event
   */
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(event);
  }

  /**
   * Generate unique ID for component
   */
  generateId(prefix = 'webropol') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create element with classes and attributes
   */
  createElement(tag, classes = '', attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    if (classes) {
      element.className = classes;
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    if (content) {
      element.innerHTML = content;
    }
    
    return element;
  }

  /**
   * Add CSS classes conditionally
   */
  classNames(...classes) {
    return classes
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  /**
   * Get variant classes based on component type
   */
  getVariantClasses(componentType, variant = 'primary') {
    const variants = {
      button: {
        // Colors aligned with Webropol Royal Design System (Figma) — flat solid colors, no gradients
        // Primary/700: #1E6880 | Hover: Primary/800 #215669 | Pressed: Primary/900 #204859
        primary: '[background-color:#1e6880] text-white border border-[rgba(255,255,255,0.2)] hover:[background-color:#215669] active:[background-color:#204859] focus:ring-2 focus:ring-[#1e6880] focus:ring-offset-2 focus:outline-none disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:cursor-not-allowed',
        // Secondary: #eefbfd bg, #1E6880 border+text | Hover: #b0e8f1 bg, #215669 border+text
        secondary: '[background-color:#eefbfd] text-[#1e6880] border border-[#1e6880] hover:[background-color:#b0e8f1] hover:text-[#215669] hover:border-[#215669] active:[background-color:#9cd9e6] active:border-[#204859] active:text-[#204859] focus:ring-2 focus:ring-[#1e6880] focus:ring-offset-2 focus:outline-none disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:border-[#bfc3c4] disabled:cursor-not-allowed',
        tertiary: 'bg-transparent text-[#1e6880] border border-transparent hover:[background-color:#eefbfd] hover:text-[#215669] active:[background-color:#b0e8f1] active:text-[#204859] focus:ring-2 focus:ring-[#1e6880] focus:ring-offset-2 focus:outline-none disabled:text-[#61686a] disabled:cursor-not-allowed',
        // Destructive/700: #BE1241 | Hover: Destructive/800 | Pressed: Destructive/900
        danger: '[background-color:#be1241] text-white border border-[rgba(255,255,255,0.2)] hover:[background-color:#a60e38] active:[background-color:#8e0c30] focus:ring-2 focus:ring-[#be1241] focus:ring-offset-2 focus:outline-none disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:cursor-not-allowed',
        // Destructive Outline: Error/100 #FFE4E7 bg, Error/900 #88133A border+text
        'danger-outline': '[background-color:#ffe4e7] text-[#88133a] border border-[#88133a] hover:[background-color:#fcc8cf] hover:border-[#7a1133] hover:text-[#7a1133] active:[background-color:#f9acb6] active:border-[#6b0f2d] active:text-[#6b0f2d] focus:ring-2 focus:ring-[#be1241] focus:ring-offset-2 focus:outline-none disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:border-[#bfc3c4] disabled:cursor-not-allowed',
        success: '[background-color:#1a7e4a] text-white border border-[rgba(255,255,255,0.2)] hover:[background-color:#156b3e] active:[background-color:#105833] focus:ring-2 focus:ring-[#1a7e4a] focus:ring-offset-2 focus:outline-none disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:cursor-not-allowed',
        // Royal gradient buttons (fully rounded with premium gradients)
        // Royal Dark — violet→blue gradient, white text. Use roundness="full" (pill, default) or "lg".
        royal: 'bg-gradient-to-r from-webropol-royalViolet-500 to-webropol-royalBlue-600 text-white border border-[rgba(255,255,255,0.2)] hover:from-webropol-royalViolet-600 hover:to-webropol-royalBlue-700 active:from-webropol-royalViolet-700 active:to-webropol-royalBlue-800 focus:ring-2 focus:ring-webropol-royalViolet-300 focus:ring-offset-2 focus:outline-none disabled:[background-image:none] disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:cursor-not-allowed',
        // Royal Light — light gradient bg (violet-50→blue-50) + violet border + violet text.
        // Hover reveals reversed gradient + drop shadow. Pressed = saturated light gradient + turquoise border.
        royalLight: 'bg-gradient-to-br from-[#F1E9FB] to-[#EEF2FF] text-[#6922c4] border-2 border-[#6922c4] hover:from-[#EEF2FF] hover:to-[#F1E9FB] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.2)] active:from-[#D5BEF4] active:to-[#EEF2FF] active:border-[#67e8f9] focus:ring-2 focus:ring-[#6922c4] focus:ring-offset-2 focus:outline-none disabled:[background-image:none] disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:border-transparent disabled:cursor-not-allowed',
        // Royal Secondary — transparent bg + violet border + violet text. Gradient fill appears on hover.
        royalSecondary: 'bg-transparent text-[#6922c4] border-2 border-[#6922c4] hover:bg-gradient-to-br hover:from-[#EEF2FF] hover:to-[#F1E9FB] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.2)] active:from-[#D5BEF4] active:to-[#EEF2FF] focus:ring-2 focus:ring-[#6922c4] focus:ring-offset-2 focus:outline-none disabled:[background-image:none] disabled:[background-color:#e6e7e8] disabled:text-[#61686a] disabled:border-transparent disabled:cursor-not-allowed',
        // Royal Tertiary — ghost (no bg, invisible border) + violet text. Border + gradient fill appear on hover.
        royalTertiary: 'bg-transparent text-[#6922c4] border-2 border-transparent hover:bg-gradient-to-br hover:from-[#EEF2FF] hover:to-[#F1E9FB] hover:border-[#6922c4] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.2)] active:from-[#D5BEF4] active:to-[#EEF2FF] focus:ring-2 focus:ring-[#6922c4] focus:ring-offset-2 focus:outline-none disabled:text-[#61686a] disabled:cursor-not-allowed',
        // Royal Icon — icon-only variant (use with icon-only attribute). Invisible border that appears on hover.
        royalIcon: 'bg-transparent text-[#6922c4] border-2 border-transparent hover:bg-gradient-to-br hover:from-[#EEF2FF] hover:to-[#F1E9FB] hover:border-[#6922c4] hover:shadow-[0px_6px_15px_rgba(0,0,0,0.2)] active:from-[#D5BEF4] active:to-[#EEF2FF] focus:ring-2 focus:ring-[#6922c4] focus:ring-offset-2 focus:outline-none disabled:text-[#61686a] disabled:cursor-not-allowed'
      },
      card: {
        default: 'bg-white border border-webropol-gray-200 shadow-card',
        elevated: 'bg-white border border-webropol-gray-200 shadow-medium hover:shadow-lg',
        gradient: 'bg-sun-to-br from-webropol-primary-50 to-webropol-primary-50 border border-webropol-primary-100 shadow-card'
      },
      badge: {
        primary: 'bg-webropol-primary-100 text-webropol-primary-700',
        secondary: 'bg-webropol-primary-100 text-webropol-primary-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        error: 'bg-red-100 text-red-700',
        neutral: 'bg-webropol-gray-100 text-webropol-gray-700'
      }
    };

    return variants[componentType]?.[variant] || '';
  }

  /**
   * Get size classes based on component type
   */
  getSizeClasses(componentType, size = 'md') {
    const sizes = {
      button: {
        // Sizes from Figma: Large px-5 py-3 (20/12px), Medium px-4 py-2.5 (16/10px), Small px-3.5 py-2 (14/8px), Micro px-3 py-1.5 (12/6px)
        sm: 'px-3.5 py-2 text-sm font-medium leading-5',
        md: 'px-4 py-2.5 text-sm font-medium leading-5',
        lg: 'px-5 py-3 text-base font-medium leading-6',
        xl: 'px-6 py-3.5 text-lg font-medium leading-7',
        micro: 'px-3 py-1.5 text-xs font-medium leading-5',
        // Icon-only button sizes (square)
        'icon-sm': 'p-2 text-sm',
        'icon-md': 'p-2.5 text-base',
        'icon-lg': 'p-3 text-lg',
        'icon-xl': 'p-3.5 text-xl'
      },
      badge: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
      },
      card: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      }
    };

    return sizes[componentType]?.[size] || '';
  }

  /**
   * Get border radius classes based on roundness level
   */
  getRoundnessClasses(roundness = 'full') {
    const roundnessMap = {
      'none': 'rounded-none',
      'sm': 'rounded-sm',
      'md': 'rounded-md',
      'lg': 'rounded-lg',
      'xl': 'rounded-xl',
      '2xl': 'rounded-2xl',
      'full': 'rounded-full' // Default for buttons (fully rounded)
    };
    
    return roundnessMap[roundness] || 'rounded-full';
  }

  /**
   * Validate required attributes
   */
  validateAttributes(required = []) {
    const missing = required.filter(attr => !this.hasAttribute(attr));
    if (missing.length > 0) {
      console.warn(`${this.constructor.name}: Missing required attributes: ${missing.join(', ')}`);
    }
    return missing.length === 0;
  }
}
