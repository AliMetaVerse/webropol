/**
 * Webropol Unified Tabs Component
 * Consistent tab styling across all applications
 * Supports multiple variants: pills, underline, modern, admin
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolTabs extends BaseComponent {
  static get observedAttributes() {
    return ['active-tab', 'variant', 'size', 'alignment', 'shape'];
  }

  constructor() {
    super();
    this.tabs = [];
    this.panels = [];
  }

  init() {
    // Parse tabs from data attribute or child elements
    const tabsData = this.getAttr('tabs');
    if (tabsData) {
      try {
        this.tabs = JSON.parse(tabsData);
      } catch (e) {
        console.warn('Invalid tabs data format');
      }
    }
    
    // Set ARIA attributes
    this.setAttribute('role', 'tablist');
  }

  render() {
    const activeTab = this.getAttr('active-tab', this.tabs[0]?.id || '');
    const variant = this.getAttr('variant', 'unified');
    const size = this.getAttr('size', 'md');
    const alignment = this.getAttr('alignment', 'start');
    const shape = this.getAttr('shape', 'pill'); // 'pill' or 'rounded'
    
    if (this.tabs.length === 0) {
      this.innerHTML = '<div class="text-neutral-500 text-sm">No tabs defined</div>';
      return;
    }

    const tabsHtml = this.renderUnifiedTabs(activeTab, size, alignment, shape);
    
    this.innerHTML = `
      <div class="tabs-container">
        ${tabsHtml}
        <div class="tab-panels mt-6">
          ${this.renderPanels(activeTab)}
        </div>
      </div>
    `;
  }

  renderUnifiedTabs(activeTab, size, alignment, shape) {
    const containerClasses = this.getContainerClasses(alignment, shape);
    const sizeClasses = this.getSizeClasses(size);
    const shapeClasses = this.getShapeClasses(shape);
    
    return `
      <div class="${containerClasses}">
        ${this.tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const buttonClasses = `webropol-unified-tab ${sizeClasses.button} ${shapeClasses.button} ${isActive ? 'active' : ''}`;
          
          return `
            <button
              class="${buttonClasses}"
              data-tab="${tab.id}"
              role="tab"
              aria-selected="${isActive}"
              aria-controls="panel-${tab.id}"
              id="tab-${tab.id}">
              ${tab.icon ? `<i class="fal fa-${tab.icon} ${sizeClasses.icon}"></i>` : ''}
              ${tab.label}
              ${tab.badge ? `<span class="webropol-tab-badge ${sizeClasses.badge}">${tab.badge}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  getContainerClasses(alignment, shape) {
    const alignmentClass = alignment === 'center' ? 'justify-center' : 
                          alignment === 'end' ? 'justify-end' : 'justify-start';
    
    const shapeClass = shape === 'pill' ? 'webropol-tabs-pill-container' : 'webropol-tabs-rounded-container';
    
    return `webropol-tabs-unified flex ${alignmentClass} ${shapeClass}`;
  }

  getShapeClasses(shape) {
    if (shape === 'pill') {
      return {
        button: 'webropol-tab-pill'
      };
    } else {
      return {
        button: 'webropol-tab-rounded'
      };
    }
  }

  getSizeClasses(size) {
    const sizes = {
      sm: {
        button: 'size-sm',
        icon: 'mr-1.5',
        badge: 'size-sm'
      },
      md: {
        button: 'size-md',
        icon: 'mr-2',
        badge: 'size-md'
      },
      lg: {
        button: 'size-lg',
        icon: 'mr-2.5',
        badge: 'size-lg'
      }
    };
    
    return sizes[size] || sizes.md;
  }

  renderPanels(activeTab) {
    return this.tabs.map(tab => `
      <div
        id="panel-${tab.id}"
        class="tab-panel ${activeTab === tab.id ? 'block' : 'hidden'}"
        role="tabpanel"
        aria-labelledby="tab-${tab.id}"
        tabindex="0">
        ${tab.content || `<div class="text-neutral-500">Content for ${tab.label}</div>`}
      </div>
    `).join('');
  }

  bindEvents() {
    const tabButtons = this.querySelectorAll('.webropol-unified-tab');
    
    tabButtons.forEach(button => {
      this.addListener(button, 'click', (event) => {
        const tabId = event.currentTarget.dataset.tab;
        this.setActiveTab(tabId);
      });

      this.addListener(button, 'keydown', (event) => {
        this.handleKeyNavigation(event);
      });
    });
  }

  handleKeyNavigation(event) {
    const currentTab = event.currentTarget;
    const tabButtons = Array.from(this.querySelectorAll('.webropol-unified-tab'));
    const currentIndex = tabButtons.indexOf(currentTab);

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % tabButtons.length;
        break;
      
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex === 0 ? tabButtons.length - 1 : currentIndex - 1;
        break;
      
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      
      case 'End':
        event.preventDefault();
        nextIndex = tabButtons.length - 1;
        break;
      
      default:
        return;
    }

    tabButtons[nextIndex].focus();
    const tabId = tabButtons[nextIndex].dataset.tab;
    this.setActiveTab(tabId);
  }

  setActiveTab(tabId) {
    this.setAttribute('active-tab', tabId);
    this.emit('webropol-tab-change', {
      activeTab: tabId,
      previousTab: this.getAttr('active-tab')
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }

  // Public methods for dynamic tab management
  addTab(tab) {
    this.tabs.push(tab);
    this.render();
    this.bindEvents();
  }

  removeTab(tabId) {
    this.tabs = this.tabs.filter(tab => tab.id !== tabId);
    if (this.getAttr('active-tab') === tabId && this.tabs.length > 0) {
      this.setActiveTab(this.tabs[0].id);
    }
    this.render();
    this.bindEvents();
  }

  updateTab(tabId, updates) {
    const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
      this.tabs[tabIndex] = { ...this.tabs[tabIndex], ...updates };
      this.render();
      this.bindEvents();
    }
  }

  // Shape switching methods
  setShape(shape) {
    this.setAttribute('shape', shape);
  }

  toggleShape() {
    const currentShape = this.getAttr('shape', 'pill');
    this.setShape(currentShape === 'pill' ? 'rounded' : 'pill');
  }
}

// Register the component
customElements.define('webropol-tabs', WebropolTabs);

