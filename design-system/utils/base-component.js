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
    if (!this.hasAttribute(name)) {
      return defaultValue;
    }
    const value = this.getAttribute(name);
    return value !== 'false' && value !== '0' && value !== '';
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
        primary: 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white border-2 border-transparent hover:from-webropol-teal-600 hover:to-webropol-teal-700 focus:ring-webropol-teal-200 active:from-webropol-teal-700 active:to-webropol-teal-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        secondary: 'bg-white text-webropol-teal-700 border-2 border-webropol-teal-500 hover:bg-webropol-teal-50 hover:border-webropol-teal-600 focus:ring-webropol-teal-200 active:bg-webropol-teal-100 active:border-webropol-teal-700 shadow-card hover:shadow-medium disabled:bg-webropol-gray-100 disabled:text-webropol-gray-400 disabled:border-webropol-gray-300',
        tertiary: 'bg-transparent text-webropol-teal-700 border-2 border-transparent hover:bg-webropol-teal-50 hover:text-webropol-teal-800 focus:ring-webropol-teal-200 active:bg-webropol-teal-100 disabled:text-webropol-gray-400 disabled:hover:bg-transparent',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-transparent hover:from-red-600 hover:to-red-700 focus:ring-red-200 active:from-red-700 active:to-red-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-transparent hover:from-green-600 hover:to-green-700 focus:ring-green-200 active:from-green-700 active:to-green-800 shadow-medium hover:shadow-lg disabled:from-webropol-gray-300 disabled:to-webropol-gray-400'
      },
      card: {
        default: 'bg-white border border-webropol-gray-200 shadow-card',
        elevated: 'bg-white border border-webropol-gray-200 shadow-medium hover:shadow-lg',
        gradient: 'bg-sun-to-br from-webropol-teal-50 to-webropol-teal-50 border border-webropol-teal-100 shadow-card'
      },
      badge: {
        primary: 'bg-webropol-teal-100 text-webropol-teal-700',
        secondary: 'bg-webropol-teal-100 text-webropol-teal-700',
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
        xl: 'px-10 py-4 text-lg font-semibold'
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
