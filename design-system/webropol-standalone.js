/**
 * Webropol Design System - Complete Standalone Bundle
 * All components with full functionality, no ES6 module dependencies
 * This file contains ALL components used in the demo
 */

// Global utilities first
window.WebropolUtils = {
  classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  },
  
  getAttr(element, name, defaultValue = '') {
    return element.getAttribute(name) || defaultValue;
  },
  
  getBoolAttr(element, name) {
    return element.hasAttribute(name);
  },
  
  emitEvent(element, name, detail = {}) {
    const event = new CustomEvent(name, {
      detail,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }
};

// Base Component Class
class BaseComponent extends HTMLElement {
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

  init() {
    // Override in subclasses
  }

  render() {
    // Override in subclasses
  }

  bindEvents() {
    // Override in subclasses
  }

  setupAccessibility() {
    if (this.hasAttribute('tabindex') || this.hasAttribute('role')) {
      this.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.hasAttribute('role') && (this.getAttribute('role') === 'button' || this.getAttribute('role') === 'tab')) {
        event.preventDefault();
        this.click();
      }
    }
  }

  cleanup() {
    this.eventListeners.forEach((listener, element) => {
      element.removeEventListener(listener.type, listener.handler);
    });
    this.eventListeners.clear();
  }

  // Utility methods
  getAttr(name, defaultValue = '') {
    return WebropolUtils.getAttr(this, name, defaultValue);
  }

  getBoolAttr(name) {
    return WebropolUtils.getBoolAttr(this, name);
  }

  classNames(...classes) {
    return WebropolUtils.classNames(...classes);
  }

  emitEvent(name, detail = {}) {
    WebropolUtils.emitEvent(this, name, detail);
  }

  // Styling utilities
  getVariantClasses(component, variant) {
    const variants = {
      button: {
        primary: 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white hover:from-webropol-primary-600 hover:to-webropol-primary-700 focus:ring-webropol-primary-300 shadow-lg',
        secondary: 'bg-white text-webropol-gray-700 border-2 border-webropol-gray-300 hover:bg-webropol-gray-50 hover:border-webropol-primary-400 focus:ring-webropol-primary-300 shadow-md',
        tertiary: 'bg-transparent text-webropol-primary-600 hover:bg-webropol-primary-50 focus:ring-webropol-primary-300',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-300 shadow-lg'
      },
      badge: {
        primary: 'bg-webropol-primary-100 text-webropol-primary-800 border border-webropol-primary-200',
        secondary: 'bg-webropol-gray-100 text-webropol-gray-800 border border-webropol-gray-200',
        success: 'bg-green-100 text-green-800 border border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        error: 'bg-red-100 text-red-800 border border-red-200',
        neutral: 'bg-gray-100 text-gray-600 border border-gray-200'
      }
    };
    
    return variants[component]?.[variant] || '';
  }

  getSizeClasses(component, size) {
    const sizes = {
      button: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
      },
      badge: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
      }
    };
    
    return sizes[component]?.[size] || '';
  }
}

// Button Component
class WebropolButton extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'icon', 'icon-position', 'full-width', 'href', 'target', 'type'];
  }

  init() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    
    if (!this.hasAttribute('tabindex') && !this.getBoolAttr('disabled')) {
      this.setAttribute('tabindex', '0');
    }
  }

  render() {
    const variant = this.getAttr('variant', 'primary');
    const size = this.getAttr('size', 'md');
    const disabled = this.getBoolAttr('disabled');
    const loading = this.getBoolAttr('loading');
    const fullWidth = this.getBoolAttr('full-width');
    const icon = this.getAttr('icon');
    const iconPosition = this.getAttr('icon-position', 'left');
    const href = this.getAttr('href');
    
    const text = this.textContent.trim();
    
    const baseClasses = this.classNames(
      'inline-flex items-center justify-center font-semibold rounded-full font-sans',
      'transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-offset-2',
      'transform hover:scale-105 active:scale-95',
      fullWidth ? 'w-full' : '',
      disabled || loading ? 'cursor-not-allowed opacity-60 transform-none hover:scale-100' : 'cursor-pointer',
      this.getVariantClasses('button', variant),
      this.getSizeClasses('button', size)
    );

    const iconHtml = icon ? `<i class="fal fa-${icon} ${text ? (iconPosition === 'right' ? 'ml-2' : 'mr-2') : ''}"></i>` : '';
    const loadingHtml = loading ? '<i class="fal fa-spinner animate-spin mr-2"></i>' : '';

    const content = loading ? loadingHtml + text : 
                   iconPosition === 'right' ? text + iconHtml : iconHtml + text;

    if (href && !disabled && !loading) {
      this.innerHTML = `<a href="${href}" class="${baseClasses}" ${this.getAttr('target') ? `target="${this.getAttr('target')}"` : ''}>${content}</a>`;
    } else {
      this.innerHTML = `<button class="${baseClasses}" ${disabled ? 'disabled' : ''} type="${this.getAttr('type', 'button')}">${content}</button>`;
    }
  }

  bindEvents() {
    const button = this.querySelector('button, a');
    if (button) {
      button.addEventListener('click', (e) => {
        if (!this.getBoolAttr('disabled') && !this.getBoolAttr('loading')) {
          this.emitEvent('webropol-button-click', { originalEvent: e });
        }
      });
    }
  }
}

// Card Component
class WebropolCard extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'title', 'subtitle', 'badge', 'clickable', 'padding'];
  }

  render() {
    const variant = this.getAttr('variant', 'default');
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const badge = this.getAttr('badge');
    const clickable = this.getBoolAttr('clickable');
    const padding = this.getAttr('padding', 'default');

    const cardClasses = this.classNames(
      'rounded-2xl transition-all duration-200',
      clickable ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : '',
      this.getCardVariantClasses(variant),
      this.getCardPaddingClasses(padding)
    );

    let headerHtml = '';
    if (title || badge) {
      headerHtml = `
        <div class="flex items-start justify-between mb-4">
          <div>
            ${title ? `<h3 class="text-lg font-semibold text-webropol-gray-900 mb-1">${title}</h3>` : ''}
            ${subtitle ? `<p class="text-sm text-webropol-gray-600">${subtitle}</p>` : ''}
          </div>
          ${badge ? `<span class="bg-webropol-primary-100 text-webropol-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">${badge}</span>` : ''}
        </div>
      `;
    }

    this.innerHTML = `
      <div class="${cardClasses}">
        ${headerHtml}
        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  getCardVariantClasses(variant) {
    const variants = {
      default: 'bg-white shadow-lg border border-webropol-gray-100',
      elevated: 'bg-white shadow-xl',
      gradient: 'bg-sun-to-br from-webropol-primary-50 to-webropol-primary-50 border border-webropol-primary-100',
      flat: 'bg-webropol-gray-50 border border-webropol-gray-200'
    };
    return variants[variant] || variants.default;
  }

  getCardPaddingClasses(padding) {
    const paddings = {
      none: '',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8'
    };
    return paddings[padding] || paddings.default;
  }

  bindEvents() {
    if (this.getBoolAttr('clickable')) {
      this.addEventListener('click', (e) => {
        this.emitEvent('webropol-card-click', { originalEvent: e });
      });
    }
  }
}

// Action Card Component - Enhanced workshop/event style
class WebropolActionCard extends BaseComponent {
  static get observedAttributes() {
    return ['badge', 'title', 'description', 'variant'];
  }

  constructor() {
    super();
    this.hasRendered = false;
  }

  connectedCallback() {
    if (!this.hasRendered) {
      this.render();
      this.bindEvents();
      this.hasRendered = true;
    }
  }

  render() {
    const badge = this.getAttr('badge');
    const title = this.getAttr('title');
    const description = this.getAttr('description');
    const variant = this.getAttr('variant', 'default');
    
    // Variant gradient classes
    const variantClasses = {
      default: 'bg-sun-to-br from-webropol-primary-500 to-webropol-primary-500',
      workshop: 'bg-sun-to-br from-webropol-primary-500 to-webropol-primary-500',
      event: 'bg-sun-to-br from-purple-500 to-pink-500',
      meeting: 'bg-sun-to-br from-green-500 to-blue-500',
      orange: 'bg-sun-to-br from-orange-500 to-red-500',
      pink: 'bg-sun-to-br from-pink-500 to-purple-500'
    };

    // Only render if we haven't already
    if (!this.querySelector('.action-card-wrapper')) {
      // Store original content nodes
      const originalNodes = Array.from(this.childNodes);
      
      // Create the main wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'action-card-wrapper bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl group cursor-pointer';
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('tabindex', '0');
      
      // Create the header section (gradient)
      const headerSection = document.createElement('div');
      headerSection.className = `${variantClasses[variant] || variantClasses.default} p-6 text-white relative`;
      
      // Add badge if provided
      if (badge) {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full mb-4';
        badgeElement.textContent = badge;
        headerSection.appendChild(badgeElement);
      }
      
      // Add title
      if (title) {
        const titleElement = document.createElement('h3');
        titleElement.className = 'text-2xl font-bold text-white mb-3';
        titleElement.textContent = title;
        headerSection.appendChild(titleElement);
      }
      
      // Add description
      if (description) {
        const descElement = document.createElement('p');
        descElement.className = 'text-white/90 text-sm leading-relaxed';
        descElement.textContent = description;
        headerSection.appendChild(descElement);
      }
      
      wrapper.appendChild(headerSection);
      
      // Create the content section (white background)
      const contentSection = document.createElement('div');
      contentSection.className = 'action-card-content p-6 space-y-4';
      
      // Move original content to content section
      originalNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          contentSection.appendChild(node.cloneNode(true));
        }
      });
      
      wrapper.appendChild(contentSection);
      
      // Clear original content and append wrapper
      this.innerHTML = '';
      this.appendChild(wrapper);
    }
  }

  bindEvents() {
    const wrapper = this.querySelector('.action-card-wrapper');
    if (wrapper) {
      wrapper.addEventListener('click', (e) => {
        // Don't trigger card click if clicking on buttons or other interactive elements
        if (!e.target.closest('button, a, input, select, textarea')) {
          this.emitEvent('webropol-action-card-click', { originalEvent: e });
        }
      });

      wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.emitEvent('webropol-action-card-click', { originalEvent: e });
        }
      });
    }
  }
}

// Badge Component
class WebropolBadge extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'icon', 'dismissible'];
  }

  render() {
    const variant = this.getAttr('variant', 'primary');
    const size = this.getAttr('size', 'md');
    const icon = this.getAttr('icon');
    const dismissible = this.getBoolAttr('dismissible');
    
    const text = this.textContent.trim();
    
    const baseClasses = this.classNames(
      'inline-flex items-center font-medium rounded-full',
      this.getVariantClasses('badge', variant),
      this.getSizeClasses('badge', size)
    );

    const iconHtml = icon ? `<i class="fal fa-${icon} ${text ? 'mr-1.5' : ''} text-xs"></i>` : '';
    
    const dismissHtml = dismissible ? `
      <button class="badge-dismiss ml-1.5 -mr-1 p-0.5 hover:bg-black/10 rounded-full transition-colors" 
              aria-label="Remove ${text}">
        <i class="fal fa-times text-xs"></i>
      </button>
    ` : '';

    this.innerHTML = `
      <span class="${baseClasses}" role="status" aria-label="${text}">
        ${iconHtml}
        ${text}
        ${dismissHtml}
      </span>
    `;
  }

  bindEvents() {
    const dismissButton = this.querySelector('.badge-dismiss');
    if (dismissButton) {
      dismissButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emitEvent('webropol-badge-dismiss');
        this.remove();
      });
    }
  }
}

// Basic Badge Component
class WebropolBadge extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'icon', 'dismissible'];
  }

  render() {
    const variant = this.getAttr('variant', 'primary');
    const size = this.getAttr('size', 'md');
    const icon = this.getAttr('icon');
    const dismissible = this.getBoolAttr('dismissible');

    const badgeClasses = this.classNames(
      'inline-flex items-center font-medium rounded-full',
      this.getVariantClasses('badge', variant),
      this.getSizeClasses('badge', size)
    );

    const iconHtml = icon ? `<i class="fal fa-${icon} mr-1"></i>` : '';
    const dismissHtml = dismissible ? '<button class="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"><i class="fal fa-times text-xs"></i></button>' : '';

    this.innerHTML = `
      <span class="${badgeClasses}">
        ${iconHtml}
        <slot></slot>
        ${dismissHtml}
      </span>
    `;
  }

  bindEvents() {
    const dismissBtn = this.querySelector('button');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emitEvent('webropol-badge-dismiss');
        this.remove();
      });
    }
  }
}

// Header Component
class WebropolHeader extends BaseComponent {
  static get observedAttributes() {
    return ['username', 'title', 'show-notifications', 'show-help'];
  }

  render() {
    const username = this.getAttr('username', 'User');
    const title = this.getAttr('title', 'Dashboard');
    const showNotifications = this.getBoolAttr('show-notifications');
    const showHelp = this.getBoolAttr('show-help');

    this.innerHTML = `
      <header class="bg-white border-b border-webropol-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold text-webropol-gray-900">${title}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <slot name="actions"></slot>
            ${showNotifications ? '<button class="p-2 text-webropol-gray-400 hover:text-webropol-gray-600 transition-colors"><i class="fal fa-bell"></i></button>' : ''}
            ${showHelp ? '<button class="p-2 text-webropol-gray-400 hover:text-webropol-gray-600 transition-colors"><i class="fal fa-question-circle"></i></button>' : ''}
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-sun-to-br from-webropol-primary-500 to-webropol-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">${username.charAt(0).toUpperCase()}</span>
              </div>
              <span class="text-sm font-medium text-webropol-gray-700">${username}</span>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

// Sidebar Component
class WebropolSidebar extends BaseComponent {
  static get observedAttributes() {
    return ['active', 'base'];
  }

  render() {
    const active = this.getAttr('active', '');
    const base = this.getAttr('base', '');

    const menuItems = [
      { id: 'dashboards', label: 'Dashboards', icon: 'chart-bar' },
      { id: 'surveys', label: 'Surveys', icon: 'clipboard-list' },
      { id: 'events', label: 'Events', icon: 'calendar-alt' },
      { id: 'mywebropol', label: 'MyWebropol', icon: 'user' },
      { id: 'shop', label: 'Shop', icon: 'shopping-cart' },
      { id: 'sms', label: 'SMS', icon: 'sms' },
      { id: 'training-videos', label: 'Training', icon: 'play-circle' },
      { id: 'admin-tools', label: 'Admin Tools', icon: 'tools' }
    ];

    const menuHtml = menuItems.map(item => {
      const isActive = item.id === active;
      return `
        <a href="${base}${item.id}/" class="${this.classNames(
          'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
          isActive 
            ? 'bg-webropol-primary-100 text-webropol-primary-700 border-r-2 border-webropol-primary-500' 
            : 'text-webropol-gray-600 hover:bg-webropol-gray-100 hover:text-webropol-gray-900'
        )}">
          <i class="fal fa-${item.icon} w-5 h-5 mr-3"></i>
          ${item.label}
        </a>
      `;
    }).join('');

    this.innerHTML = `
      <nav class="bg-white h-full shadow-lg">
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-10 h-10 bg-sun-to-br from-webropol-primary-500 to-webropol-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">W</span>
            </div>
            <span class="text-xl font-bold text-webropol-gray-900">Webropol</span>
          </div>
          <div class="space-y-2">
            ${menuHtml}
          </div>
        </div>
      </nav>
    `;
  }
}

// List Card Component
class WebropolListCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'icon', 'items', 'compact'];
  }

  render() {
    const title = this.getAttr('title');
    const icon = this.getAttr('icon');
    const itemsAttr = this.getAttr('items');
    const compact = this.getBoolAttr('compact');

    let items = [];
    try {
      items = itemsAttr ? JSON.parse(itemsAttr) : [];
    } catch (e) {
      console.warn('Invalid JSON in items attribute:', e);
    }

    const itemsHtml = items.map(item => `
      <div class="flex items-center justify-between py-3 border-b border-webropol-gray-100 last:border-b-0">
        <div class="flex-1">
          <div class="font-medium text-webropol-gray-900">${item.title}</div>
          ${item.meta ? `<div class="text-sm text-webropol-gray-600">${item.meta}</div>` : ''}
        </div>
        ${item.badge ? `<span class="ml-3 px-2 py-1 text-xs font-medium rounded-full ${this.getStatusColor(item.status)}">${item.badge}</span>` : ''}
      </div>
    `).join('');

    this.innerHTML = `
      <div class="bg-white rounded-2xl p-6 shadow-lg border border-webropol-gray-100">
        <div class="flex items-center mb-4">
          ${icon ? `<i class="fal fa-${icon} text-webropol-primary-600 mr-2"></i>` : ''}
          <h3 class="text-lg font-semibold text-webropol-gray-900">${title}</h3>
        </div>
        <div class="${compact ? 'space-y-1' : 'space-y-2'}">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      draft: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}

// Video Card Component
class WebropolVideoCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'duration', 'thumbnail', 'views', 'badge'];
  }

  render() {
    const title = this.getAttr('title');
    const duration = this.getAttr('duration');
    const thumbnail = this.getAttr('thumbnail');
    const views = this.getAttr('views');
    const badge = this.getAttr('badge');

    this.innerHTML = `
      <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-webropol-gray-100 transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer">
        <div class="relative">
          <img src="${thumbnail}" alt="${title}" class="w-full h-48 object-cover">
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div class="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <i class="fal fa-play-circle text-webropol-primary-600 text-xl ml-1"></i>
            </div>
          </div>
          <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            ${duration}
          </div>
          ${badge ? `<div class="absolute top-2 left-2 bg-webropol-primary-500 text-white text-xs px-2 py-1 rounded-full">${badge}</div>` : ''}
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-webropol-gray-900 mb-2">${title}</h3>
          <div class="text-sm text-webropol-gray-600 mb-3">
            <slot></slot>
          </div>
          <div class="flex items-center text-sm text-webropol-gray-500">
            <i class="fal fa-eye mr-1"></i>
            ${views} views
          </div>
        </div>
      </div>
    `;
  }
}

// Configurable Card Component
class WebropolConfigurableCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'subtitle', 'icon', 'status', 'badge', 'expandable', 'actions'];
  }

  render() {
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const icon = this.getAttr('icon');
    const status = this.getAttr('status');
    const badge = this.getAttr('badge');
    const expandable = this.getBoolAttr('expandable');
    const hasActions = this.getBoolAttr('actions');

    this.innerHTML = `
      <div class="bg-white rounded-2xl p-6 shadow-lg border border-webropol-gray-100">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            ${icon ? `<i class="fal fa-${icon} text-webropol-primary-600 mr-3"></i>` : ''}
            <div>
              <h3 class="text-lg font-semibold text-webropol-gray-900">${title}</h3>
              ${subtitle ? `<p class="text-sm text-webropol-gray-600">${subtitle}</p>` : ''}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            ${badge ? `<span class="px-2 py-1 text-xs font-medium rounded-full bg-webropol-primary-100 text-webropol-primary-800">${badge}</span>` : ''}
            ${status ? `<span class="w-2 h-2 rounded-full ${this.getStatusColor(status)}"></span>` : ''}
          </div>
        </div>
        
        ${expandable ? '<div class="expandable-content"><slot name="details"></slot></div>' : ''}
        
        <div class="card-content mb-4">
          <slot></slot>
        </div>
        
        ${hasActions ? '<div class="flex flex-wrap gap-2"><slot name="actions"></slot></div>' : ''}
      </div>
    `;
  }

  getStatusColor(status) {
    const colors = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      draft: 'bg-gray-500',
      error: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  }
}

// Input Component
class WebropolInput extends BaseComponent {
  static get observedAttributes() {
    return ['label', 'type', 'placeholder', 'required', 'icon', 'helper-text'];
  }

  render() {
    const label = this.getAttr('label');
    const type = this.getAttr('type', 'text');
    const placeholder = this.getAttr('placeholder');
    const required = this.getBoolAttr('required');
    const icon = this.getAttr('icon');
    const helperText = this.getAttr('helper-text');

    this.innerHTML = `
      <div class="space-y-2">
        ${label ? `<label class="block text-sm font-medium text-webropol-gray-700">${label}${required ? ' *' : ''}</label>` : ''}
        <div class="relative">
          ${icon ? `<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i class="fal fa-${icon} text-webropol-gray-400"></i></div>` : ''}
          <input 
            type="${type}" 
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${required ? 'required' : ''}
            class="block w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-webropol-gray-300 rounded-lg focus:ring-2 focus:ring-webropol-primary-500 focus:border-webropol-primary-500 transition-colors"
          >
        </div>
        ${helperText ? `<p class="text-sm text-webropol-gray-500">${helperText}</p>` : ''}
      </div>
    `;
  }
}

// Loading Component
class WebropolLoading extends BaseComponent {
  static get observedAttributes() {
    return ['type', 'size', 'text'];
  }

  render() {
    const type = this.getAttr('type', 'spinner');
    const size = this.getAttr('size', 'md');
    const text = this.getAttr('text');

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    let loadingHtml = '';
    
    if (type === 'spinner') {
      loadingHtml = `<i class="fal fa-spinner animate-spin ${sizeClasses[size]} text-webropol-primary-600"></i>`;
    } else if (type === 'dots') {
      loadingHtml = `
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-webropol-primary-600 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-webropol-primary-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-webropol-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      `;
    } else if (type === 'pulse') {
      loadingHtml = `<div class="${sizeClasses[size]} bg-webropol-primary-600 rounded-full animate-pulse"></div>`;
    } else if (type === 'bars') {
      loadingHtml = `
        <div class="flex space-x-1 items-end">
          <div class="w-1 h-4 bg-webropol-primary-600 animate-pulse"></div>
          <div class="w-1 h-6 bg-webropol-primary-600 animate-pulse" style="animation-delay: 0.1s"></div>
          <div class="w-1 h-4 bg-webropol-primary-600 animate-pulse" style="animation-delay: 0.2s"></div>
        </div>
      `;
    }

    this.innerHTML = `
      <div class="flex items-center justify-center space-x-2">
        ${loadingHtml}
        ${text ? `<span class="text-sm text-webropol-gray-600">${text}</span>` : ''}
      </div>
    `;
  }
}

// Tooltip Component
class WebropolTooltip extends BaseComponent {
  static get observedAttributes() {
    return ['text', 'position'];
  }

  render() {
    const text = this.getAttr('text');
    const position = this.getAttr('position', 'top');

    this.innerHTML = `
      <div class="relative inline-block">
        <div class="tooltip-trigger">
          <slot></slot>
        </div>
        <div class="tooltip-content absolute z-50 px-2 py-1 text-xs text-white bg-webropol-gray-800 rounded opacity-0 pointer-events-none transition-opacity duration-200 ${this.getPositionClasses(position)}" role="tooltip">
          ${text}
        </div>
      </div>
    `;
  }

  getPositionClasses(position) {
    const positions = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    return positions[position] || positions.top;
  }

  bindEvents() {
    const trigger = this.querySelector('.tooltip-trigger');
    const tooltip = this.querySelector('.tooltip-content');

    if (trigger && tooltip) {
      trigger.addEventListener('mouseenter', () => {
        tooltip.classList.remove('opacity-0');
        tooltip.classList.add('opacity-100');
      });

      trigger.addEventListener('mouseleave', () => {
        tooltip.classList.remove('opacity-100');
        tooltip.classList.add('opacity-0');
      });
    }
  }
}

// Tabs Component
class WebropolTabs extends BaseComponent {
  static get observedAttributes() {
    return ['active-tab', 'variant', 'size', 'alignment'];
  }

  render() {
    const activeTab = this.getAttr('active-tab');
    const variant = this.getAttr('variant', 'pills');
    const size = this.getAttr('size', 'md');
    const alignment = this.getAttr('alignment', 'start');
    const tabsAttr = this.getAttr('tabs');

    let tabs = [];
    try {
      tabs = tabsAttr ? JSON.parse(tabsAttr) : [];
    } catch (e) {
      console.warn('Invalid JSON in tabs attribute:', e);
    }

    const containerClasses = this.getContainerClasses(variant, alignment);
    const tabsHtml = this.renderTabsByVariant(tabs, variant, size, activeTab);

    const contentHtml = tabs.map(tab => `
      <div class="tab-content ${tab.id === activeTab ? 'block' : 'hidden'}" data-content="${tab.id}" role="tabpanel">
        ${tab.content || ''}
      </div>
    `).join('');

    this.innerHTML = `
      <div class="tabs-container">
        <div class="${containerClasses}">
          ${tabsHtml}
        </div>
        <div class="tab-contents mt-4">
          ${contentHtml}
        </div>
      </div>
    `;
  }

  getContainerClasses(variant, alignment) {
    const alignmentClass = alignment === 'center' ? 'justify-center' : 
                          alignment === 'end' ? 'justify-end' : 'justify-start';
    
    const variantClass = variant === 'pills' ? 'tabs-pills' :
                        variant === 'underline' ? 'tabs-underline' :
                        variant === 'modern' ? 'tabs-modern' :
                        variant === 'admin' ? 'tabs-admin' : 'tabs-pills';
    
    return `tabs-list ${variantClass} ${alignmentClass}`;
  }

  renderTabsByVariant(tabs, variant, size, activeTab) {
    const sizeClass = `size-${size}`;
    
    return tabs.map(tab => {
      const isActive = tab.id === activeTab;
      const classes = `tab-button ${sizeClass} ${isActive ? 'active' : ''}`;
      
      return `
        <button 
          class="${classes}" 
          data-tab="${tab.id}"
          role="tab"
          aria-selected="${isActive}"
          aria-controls="panel-${tab.id}"
          id="tab-${tab.id}">
          ${tab.icon ? `<i class="fal fa-${tab.icon}"></i>` : ''}
          ${tab.label}
          ${tab.badge ? `<span class="tab-badge">${tab.badge}</span>` : ''}
        </button>
      `;
    }).join('');
  }

  bindEvents() {
    const buttons = this.querySelectorAll('.tab-button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.switchTab(tabId);
        this.emitEvent('webropol-tab-change', { tab: tabId });
      });
    });
  }

  switchTab(tabId) {
    // Update active tab attribute
    this.setAttribute('active-tab', tabId);
    
    // Update button states
    const buttons = this.querySelectorAll('.tab-button');
    buttons.forEach(button => {
      const isActive = button.dataset.tab === tabId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive);
    });

    // Update content visibility
    const contents = this.querySelectorAll('.tab-content');
    contents.forEach(content => {
      if (content.dataset.content === tabId) {
        content.classList.remove('hidden');
        content.classList.add('block');
      } else {
        content.classList.remove('block');
        content.classList.add('hidden');
      }
    });
  }
}

// Modal Component
class WebropolModal extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'size', 'closable', 'backdrop-close'];
  }

  render() {
    const title = this.getAttr('title');
    const size = this.getAttr('size', 'md');
    const closable = this.getBoolAttr('closable');

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    this.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200">
        <div class="modal-content bg-white rounded-2xl shadow-xl ${sizeClasses[size]} w-full m-4 transform scale-95 transition-transform duration-200">
          ${title || closable ? `
            <div class="modal-header flex items-center justify-between p-6 border-b border-webropol-gray-200">
              ${title ? `<h2 class="text-xl font-semibold text-webropol-gray-900">${title}</h2>` : '<div></div>'}
              ${closable ? '<button class="modal-close text-webropol-gray-400 hover:text-webropol-gray-600 transition-colors"><i class="fal fa-times"></i></button>' : ''}
            </div>
          ` : ''}
          <div class="modal-body p-6">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const backdrop = this.querySelector('.modal-backdrop');
    const closeBtn = this.querySelector('.modal-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.getBoolAttr('backdrop-close') && backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.close();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    const backdrop = this.querySelector('.modal-backdrop');
    const content = this.querySelector('.modal-content');
    
    if (backdrop && content) {
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100');
      content.classList.remove('scale-95');
      content.classList.add('scale-100');
      
      // Focus management
      const focusableElements = content.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }

  close() {
    const backdrop = this.querySelector('.modal-backdrop');
    const content = this.querySelector('.modal-content');
    
    if (backdrop && content) {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      content.classList.remove('scale-100');
      content.classList.add('scale-95');
    }
  }

  isOpen() {
    const backdrop = this.querySelector('.modal-backdrop');
    return backdrop && !backdrop.classList.contains('pointer-events-none');
  }
}

// Register all components
customElements.define('webropol-button', WebropolButton);
customElements.define('webropol-card', WebropolCard);
customElements.define('webropol-action-card', WebropolActionCard);
customElements.define('webropol-badge', WebropolBadge);
customElements.define('webropol-header', WebropolHeader);
customElements.define('webropol-sidebar', WebropolSidebar);
customElements.define('webropol-list-card', WebropolListCard);
customElements.define('webropol-video-card', WebropolVideoCard);
customElements.define('webropol-configurable-card', WebropolConfigurableCard);
customElements.define('webropol-input', WebropolInput);
customElements.define('webropol-loading', WebropolLoading);
customElements.define('webropol-tooltip', WebropolTooltip);
customElements.define('webropol-tabs', WebropolTabs);
customElements.define('webropol-modal', WebropolModal);

// Global Settings Modal Component
class WebropolSettingsModal extends BaseComponent {
  constructor() {
    super();
    this.settings = this.loadSettings();
    this.bindMethods();
  }

  bindMethods() {
    this.close = this.close.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
    this.toggleSetting = this.toggleSetting.bind(this);
  }

  loadSettings() {
    const defaultSettings = {
      showFloatingButton: true,
      darkMode: false,
      autoSave: true,
      notifications: true,
      compactMode: false,
      autoLogout: 30,
      language: 'en'
    };

    const stored = localStorage.getItem('webropol_global_settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  }

  saveSettings() {
    localStorage.setItem('webropol_global_settings', JSON.stringify(this.settings));
    this.applySettings();
    WebropolUtils.emitEvent(this, 'settings-changed', { settings: this.settings });
  }

  applySettings() {
    if (this.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (this.settings.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }

    const floatingButton = document.querySelector('webropol-floating-button');
    if (floatingButton) {
      floatingButton.style.display = this.settings.showFloatingButton ? 'block' : 'none';
    }

    window.dispatchEvent(new CustomEvent('webropol-settings-applied', { 
      detail: { settings: this.settings } 
    }));
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      this.settings = this.loadSettings();
      this.settings = {
        showFloatingButton: true,
        darkMode: false,
        autoSave: true,
        notifications: true,
        compactMode: false,
        autoLogout: 30,
        language: 'en'
      };
      this.saveSettings();
      this.render();
    }
  }

  toggleSetting(key, value = null) {
    if (value !== null) {
      this.settings[key] = value;
    } else {
      this.settings[key] = !this.settings[key];
    }
    this.saveSettings();
  }

  render() {
    const isOpen = WebropolUtils.getBoolAttr(this, 'open');
    
    this.innerHTML = `
      <div class="modal-backdrop mobile-modal fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100001] p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
           style="transition: opacity 300ms ease-out">
        
        <div class="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}"
             style="transition: all 300ms ease-out"
             role="document">
          
          <div class="modal-header flex items-center justify-between p-6 border-b border-webropol-gray-200 bg-gradient-to-r from-webropol-gray-50 to-webropol-primary-50/30">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-webropol-primary-500 to-webropol-primary-600 rounded-xl flex items-center justify-center mr-4">
                <i class="fal fa-cog text-white text-lg"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-webropol-gray-900">Settings</h2>
                <p class="text-sm text-webropol-gray-600">Customize your experience</p>
              </div>
            </div>
            <button class="modal-close w-10 h-10 flex items-center justify-center text-webropol-gray-400 hover:text-webropol-gray-600 hover:bg-webropol-gray-100 rounded-xl transition-all"
                    aria-label="Close settings modal">
              <i class="fal fa-times text-lg"></i>
            </button>
          </div>
          
          <div class="modal-body flex-1 overflow-y-auto p-6">
            <div class="space-y-6">
              
              <div class="settings-section">
                <h3 class="text-lg font-semibold text-webropol-gray-800 mb-4 flex items-center">
                  <i class="fal fa-desktop mr-2 text-webropol-primary-600"></i>
                  Interface
                </h3>
                <div class="space-y-4">
                  
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Dark Mode</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Switch between light and dark themes">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Toggle dark mode interface</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.darkMode ? 'checked' : ''} 
                             data-setting="darkMode">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-primary-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Show Floating Button</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Show or hide the floating create button">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Toggle floating button visibility</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.showFloatingButton ? 'checked' : ''} 
                             data-setting="showFloatingButton">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-primary-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between py-3 px-4 bg-webropol-gray-50 rounded-xl">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <label class="text-sm font-medium text-webropol-gray-700">Auto-save</label>
                        <div class="ml-2 text-webropol-gray-400 hover:text-webropol-gray-600 cursor-help" 
                             title="Automatically save your work">
                          <i class="fal fa-question-circle text-sm"></i>
                        </div>
                      </div>
                      <p class="text-xs text-webropol-gray-500 mt-1">Automatically save changes</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" ${this.settings.autoSave ? 'checked' : ''} 
                             data-setting="autoSave">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-webropol-primary-600"></div>
                    </label>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
          
          <div class="flex items-center justify-between p-6 border-t border-webropol-gray-200 bg-webropol-gray-50/30">
            <div class="text-xs text-webropol-gray-500">
              <i class="fal fa-info-circle mr-1"></i>
              Settings are saved automatically
            </div>
            <div class="flex items-center space-x-3">
              <button class="reset-button px-4 py-2 text-sm text-webropol-gray-600 hover:text-webropol-gray-800 hover:bg-webropol-gray-100 rounded-lg transition-all">
                <i class="fal fa-undo mr-2"></i>
                Reset to Default
              </button>
              <button class="done-button px-6 py-2.5 bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 hover:from-webropol-primary-600 hover:to-webropol-primary-700 text-white font-medium rounded-lg transition-all">
                <i class="fal fa-check mr-2"></i>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const backdrop = this.querySelector('.modal-backdrop');
    const closeButton = this.querySelector('.modal-close');
    const doneButton = this.querySelector('.done-button');
    const resetButton = this.querySelector('.reset-button');
    const checkboxes = this.querySelectorAll('input[type="checkbox"][data-setting]');

    if (closeButton) {
      this.addListener(closeButton, 'click', this.close);
    }

    if (doneButton) {
      this.addListener(doneButton, 'click', this.close);
    }

    if (resetButton) {
      this.addListener(resetButton, 'click', this.resetSettings);
    }

    if (backdrop) {
      this.addListener(backdrop, 'click', this.handleBackdropClick);
    }

    const modalContent = this.querySelector('.modal-content');
    if (modalContent) {
      this.addListener(modalContent, 'click', (e) => e.stopPropagation());
    }

    checkboxes.forEach(checkbox => {
      this.addListener(checkbox, 'change', (e) => {
        const settingKey = e.target.getAttribute('data-setting');
        this.toggleSetting(settingKey, e.target.checked);
      });
    });

    this.addListener(document, 'keydown', this.handleKeydown);
  }

  handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  handleKeydown(e) {
    if (WebropolUtils.getBoolAttr(this, 'open') && e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  open() {
    this.setAttribute('open', '');
    this.render();
    
    setTimeout(() => {
      const closeButton = this.querySelector('.modal-close');
      if (closeButton) {
        closeButton.focus();
      }
    }, 100);

    document.body.style.overflow = 'hidden';
    WebropolUtils.emitEvent(this, 'settings-modal-opened');
  }

  close() {
    this.removeAttribute('open');
    document.body.style.overflow = '';
    WebropolUtils.emitEvent(this, 'settings-modal-closed');
  }

  static get observedAttributes() {
    return ['open'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.applySettings();
  }
}

customElements.define('webropol-settings-modal', WebropolSettingsModal);

// Global Settings Manager
class GlobalSettingsManager {
  constructor() {
    this.defaultSettings = {
      showFloatingButton: true,
      darkMode: false,
      autoSave: true,
      notifications: true,
      compactMode: false,
      autoLogout: 30,
      language: 'en'
    };
    
    this.settings = this.loadSettings();
    this.listeners = new Set();
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem('webropol_global_settings');
      return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : { ...this.defaultSettings };
    } catch (error) {
      console.warn('Error loading settings from localStorage:', error);
      return { ...this.defaultSettings };
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('webropol_global_settings', JSON.stringify(this.settings));
      this.applySettings();
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }

  getSetting(key) {
    return this.settings[key] !== undefined ? this.settings[key] : this.defaultSettings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }

  toggleSetting(key) {
    if (typeof this.settings[key] === 'boolean') {
      this.settings[key] = !this.settings[key];
      this.saveSettings();
    }
  }

  resetSettings() {
    this.settings = { ...this.defaultSettings };
    this.saveSettings();
  }

  getAllSettings() {
    return { ...this.settings };
  }

  applySettings() {
    if (this.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (this.settings.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }

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
    
    window.dispatchEvent(new CustomEvent('webropol-settings-applied', { 
      detail: { settings: this.settings } 
    }));
  }

  openSettingsModal() {
    let settingsModal = document.querySelector('webropol-settings-modal');
    
    if (!settingsModal) {
      settingsModal = document.createElement('webropol-settings-modal');
      document.body.appendChild(settingsModal);
    }
    
    settingsModal.open();
  }

  init() {
    this.applySettings();
    
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        this.openSettingsModal();
      }
    });
  }
}

// Create global instance
window.globalSettingsManager = new GlobalSettingsManager();

// Global Design System object
window.WebropolDesignSystem = {
  version: '1.0.0',
  initialized: true,
  components: [
    'webropol-button', 'webropol-card', 'webropol-action-card', 'webropol-badge',
    'webropol-header', 'webropol-sidebar', 'webropol-list-card', 'webropol-video-card',
    'webropol-configurable-card', 'webropol-input', 'webropol-loading', 'webropol-tooltip',
    'webropol-tabs', 'webropol-modal', 'webropol-settings-modal'
  ],
  
  // Theme utilities
  getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  },
  
  setTheme(theme) {
    if (!theme) {
      // Toggle between light and dark
      const currentTheme = this.getTheme();
      theme = currentTheme === 'dark' ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('webropol-theme', theme);
  },
  
  // Component registration check
  checkComponents() {
    const registered = this.components.filter(name => customElements.get(name));
    console.log(`✅ ${registered.length}/${this.components.length} components registered:`, registered);
    return registered.length === this.components.length;
  }
};

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Webropol Design System loaded successfully!');
  WebropolDesignSystem.checkComponents();
  
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('webropol-theme');
  if (savedTheme) {
    WebropolDesignSystem.setTheme(savedTheme);
  }
  
  // Initialize global settings manager
  if (window.globalSettingsManager) {
    window.globalSettingsManager.init();
  }
});

