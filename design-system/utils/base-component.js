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
    this.init();
    this.render();
    this.bindEvents();
    this.setupAccessibility();
  }

  disconnectedCallback() {
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
        primary: 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white border-2 border-transparent hover:from-webropol-primary-600 hover:to-webropol-primary-700 focus:ring-webropol-primary-200 active:from-webropol-primary-700 active:to-webropol-primary-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        secondary: 'bg-white text-webropol-primary-700 border-2 border-webropol-primary-500 hover:bg-webropol-primary-50 hover:border-webropol-primary-600 focus:ring-webropol-primary-200 active:bg-webropol-primary-100 active:border-webropol-primary-700 shadow-card hover:shadow-medium disabled:bg-webropol-gray-100 disabled:text-webropol-gray-400 disabled:border-webropol-gray-300',
        tertiary: 'bg-transparent text-webropol-primary-700 border-2 border-transparent hover:bg-webropol-primary-50 hover:text-webropol-primary-800 focus:ring-webropol-primary-200 active:bg-webropol-primary-100 disabled:text-webropol-gray-400 disabled:hover:bg-transparent',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-transparent hover:from-red-600 hover:to-red-700 focus:ring-red-200 active:from-red-700 active:to-red-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        'danger-outline': 'bg-white text-red-600 border-2 border-red-500 hover:bg-red-50 hover:border-red-600 focus:ring-red-200 active:bg-red-100 active:border-red-700 shadow-card hover:shadow-medium disabled:bg-webropol-gray-100 disabled:text-webropol-gray-400 disabled:border-webropol-gray-300',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-transparent hover:from-green-600 hover:to-green-700 focus:ring-green-200 active:from-green-700 active:to-green-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        // Royal gradient buttons (fully rounded with premium gradients)
        royal: 'bg-gradient-to-r from-webropol-royalViolet-500 to-webropol-royalBlue-600 text-white border-2 border-transparent hover:from-webropol-royalViolet-600 hover:to-webropol-royalBlue-700 focus:ring-webropol-royalViolet-200 active:from-webropol-royalViolet-700 active:to-webropol-royalBlue-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        royalViolet: 'bg-gradient-to-r from-webropol-royalViolet-500 to-webropol-royalViolet-600 text-white border-2 border-transparent hover:from-webropol-royalViolet-600 hover:to-webropol-royalViolet-700 focus:ring-webropol-royalViolet-200 active:from-webropol-royalViolet-700 active:to-webropol-royalViolet-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        royalBlue: 'bg-gradient-to-r from-webropol-royalBlue-500 to-webropol-royalBlue-600 text-white border-2 border-transparent hover:from-webropol-royalBlue-600 hover:to-webropol-royalBlue-700 focus:ring-webropol-royalBlue-200 active:from-webropol-royalBlue-700 active:to-webropol-royalBlue-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        royalTurquoise: 'bg-gradient-to-r from-webropol-royalTurquoise-500 to-webropol-royalTurquoise-600 text-white border-2 border-transparent hover:from-webropol-royalTurquoise-600 hover:to-webropol-royalTurquoise-700 focus:ring-webropol-royalTurquoise-200 active:from-webropol-royalTurquoise-700 active:to-webropol-royalTurquoise-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400'
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
        sm: 'px-3 py-1.5 text-sm font-medium',
        md: 'px-6 py-2.5 text-sm font-semibold',
        lg: 'px-8 py-3 text-base font-semibold',
        xl: 'px-10 py-4 text-lg font-semibold',
        // Icon-only button sizes (square)
        'icon-sm': 'p-2 text-sm',
        'icon-md': 'p-3 text-base',
        'icon-lg': 'p-4 text-lg',
        'icon-xl': 'p-5 text-xl'
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
