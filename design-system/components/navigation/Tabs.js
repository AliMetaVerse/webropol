/**
 * Webropol Tabs Component
 * Modern pill-style tabs with smooth animations
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolTabs extends BaseComponent {
  static get observedAttributes() {
    return ['active-tab', 'variant'];
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
    const variant = this.getAttr('variant', 'pills');
    
    if (this.tabs.length === 0) {
      this.innerHTML = '<div class="text-webropol-gray-500 text-sm">No tabs defined</div>';
      return;
    }

    const tabsHtml = variant === 'pills' ? this.renderPillTabs(activeTab) : this.renderUnderlineTabs(activeTab);
    
    this.innerHTML = `
      <div class="tabs-container">
        ${tabsHtml}
        <div class="tab-panels mt-6">
          ${this.renderPanels(activeTab)}
        </div>
      </div>
    `;
  }

  renderPillTabs(activeTab) {
    return `
      <div class="tabs-list flex">
        <div class="inline-flex bg-webropol-teal-50 p-1.5 rounded-full shadow-soft border border-webropol-teal-100 gap-1">
          ${this.tabs.map(tab => `
            <button
              class="tab-button px-7 py-3 rounded-full font-semibold min-w-[120px] text-center text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-webropol-teal-300 focus:ring-offset-2 transition-all duration-300 ease-out mx-1 ${
                activeTab === tab.id 
                  ? 'bg-webropol-teal-600 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-webropol-gray-600 hover:text-webropol-teal-700 hover:bg-white hover:shadow-md hover:scale-[1.01]'
              }"
              data-tab="${tab.id}"
              role="tab"
              aria-selected="${activeTab === tab.id}"
              aria-controls="panel-${tab.id}"
              id="tab-${tab.id}">
              ${tab.icon ? `<i class="fal fa-${tab.icon} mr-2"></i>` : ''}
              ${tab.label}
              ${tab.badge ? `<span class="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">${tab.badge}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderUnderlineTabs(activeTab) {
    return `
      <div class="tabs-list flex border-b border-webropol-gray-200">
        ${this.tabs.map(tab => `
          <button
            class="tab-button relative px-6 py-3 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-webropol-teal-300 focus:ring-offset-2 transition-all duration-200 ${
              activeTab === tab.id 
                ? 'text-webropol-teal-600 border-b-2 border-webropol-teal-600' 
                : 'text-webropol-gray-600 hover:text-webropol-teal-700 border-b-2 border-transparent hover:border-webropol-gray-300'
            }"
            data-tab="${tab.id}"
            role="tab"
            aria-selected="${activeTab === tab.id}"
            aria-controls="panel-${tab.id}"
            id="tab-${tab.id}">
            ${tab.icon ? `<i class="fal fa-${tab.icon} mr-2"></i>` : ''}
            ${tab.label}
            ${tab.badge ? `<span class="ml-2 px-2 py-1 bg-webropol-teal-100 text-webropol-teal-600 rounded-full text-xs">${tab.badge}</span>` : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderPanels(activeTab) {
    return this.tabs.map(tab => `
      <div
        id="panel-${tab.id}"
        class="tab-panel ${activeTab === tab.id ? 'block' : 'hidden'}"
        role="tabpanel"
        aria-labelledby="tab-${tab.id}"
        tabindex="0">
        ${tab.content || `<div class="text-webropol-gray-500">Content for ${tab.label}</div>`}
      </div>
    `).join('');
  }

  bindEvents() {
    const tabButtons = this.querySelectorAll('.tab-button');
    
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
    const tabButtons = Array.from(this.querySelectorAll('.tab-button'));
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

  // Public methods
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
}

// Register the component
customElements.define('webropol-tabs', WebropolTabs);
