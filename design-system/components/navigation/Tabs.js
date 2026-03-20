/**
 * Webropol Unified Tabs Component
 * Consistent tab styling across all applications
 * Supports multiple variants from the Figma Royal Design System (node 627:3889)
 *
 * Variants:
 *   unified      – Pill/rounded container with active fill (default)
 *   primary      – Regular Primary: transparent bg, #1e6880 fill on active
 *   secondary    – Regular Secondary: transparent bg, #b0e8f1 fill on active/hover
 *   light        – Underline indicator only (no fill)
 *   heavy        – Large card-style tabs with optional description (horizontal OR vertical via orientation attr)
 *   main-primary – Avatar icon + label with bottom-line selection indicator
 *
 * Tab data properties:
 *   id, label, icon?, badge?, description? (heavy), badgeCircle? (heavy-horizontal), content?
 *
 * Attributes:
 *   tabs          – JSON array of tab objects
 *   active-tab    – id of the currently active tab
 *   variant       – see above (default: unified)
 *   orientation   – horizontal | vertical (heavy variant only, default: horizontal)
 *   size          – sm | md | lg (unified variant only, default: md)
 *   alignment     – start | center | end (default: start)
 *   shape         – pill | rounded (unified variant only, default: pill)
 *   no-panels     – boolean, suppresses tab panel rendering
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolTabs extends BaseComponent {
  static get observedAttributes() {
    return ['active-tab', 'variant', 'size', 'alignment', 'shape', 'tabs', 'no-panels', 'orientation'];
  }

  constructor() {
    super();
    this.tabs = [];
  }

  init() {
    const tabsData = this.getAttr('tabs');
    if (tabsData) {
      try {
        this.tabs = JSON.parse(tabsData);
      } catch (e) {
        console.warn('Invalid tabs data format');
      }
    }
    this.setAttribute('role', 'tablist');
  }

  render() {
    const activeTab = this.getAttr('active-tab', this.tabs[0]?.id || '');
    const variant = this.getAttr('variant', 'unified');
    const size = this.getAttr('size', 'md');
    const alignment = this.getAttr('alignment', 'start');
    const shape = this.getAttr('shape', 'pill');
    const orientation = this.getAttr('orientation', 'horizontal');

    if (this.tabs.length === 0) {
      this.innerHTML = '<div class="text-neutral-500 text-sm">No tabs defined</div>';
      return;
    }

    let tabsHtml;
    switch (variant) {
      case 'heavy':
        tabsHtml = this.renderHeavyTabs(activeTab, orientation, alignment);
        break;
      case 'main-primary':
        tabsHtml = this.renderMainPrimaryTabs(activeTab, alignment);
        break;
      case 'primary':
      case 'secondary':
      case 'light':
        tabsHtml = this.renderFigmaTabs(activeTab, variant, alignment);
        break;
      default:
        tabsHtml = this.renderUnifiedTabs(activeTab, size, alignment, shape);
    }

    const noPanels = this.hasAttribute('no-panels');
    this.innerHTML = `
      <div class="tabs-container">
        ${tabsHtml}
        ${!noPanels ? `
        <div class="tab-panels mt-6">
          ${this.renderPanels(activeTab)}
        </div>
        ` : ''}
      </div>
    `;
  }

  // ─── Heavy variant ─────────────────────────────────────────────────────────
  renderHeavyTabs(activeTab, orientation, alignment) {
    const isVertical = orientation === 'vertical';
    const alignClass = alignment === 'center' ? 'justify-center' :
                       alignment === 'end'    ? 'justify-end'    : '';
    const dirClass = isVertical ? 'flex-col' : 'flex-row flex-wrap';

    return `
      <div class="webropol-tabs-heavy flex ${dirClass} gap-3 ${alignClass}">
        ${this.tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const disabledAttr = tab.disabled ? 'disabled' : '';
          return `
            <button
              class="webropol-tab-heavy ${isVertical ? 'is-vertical' : 'is-horizontal'}${isActive ? ' active' : ''}${tab.disabled ? ' disabled' : ''}"
              data-tab="${tab.id}"
              role="tab"
              aria-selected="${isActive}"
              aria-controls="panel-${tab.id}"
              id="tab-${tab.id}"
              ${disabledAttr}>
              ${isVertical
                ? this._heavyVerticalInner(tab, isActive)
                : this._heavyHorizontalInner(tab, isActive)}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  _heavyVerticalInner(tab, isActive) {
    return `
      ${tab.icon ? `<i class="fal fa-${tab.icon} heavy-tab-icon"></i>` : ''}
      <div class="heavy-tab-body heavy-tab-body--center">
        <span class="heavy-tab-label">${tab.label}</span>
        ${tab.description ? `<span class="heavy-tab-desc">${tab.description}</span>` : ''}
      </div>
      ${isActive ? `<i class="fas fa-circle-check heavy-tab-check"></i>` : ''}
    `;
  }

  _heavyHorizontalInner(tab, isActive) {
    return `
      ${tab.icon ? `<i class="fal fa-${tab.icon} heavy-tab-icon"></i>` : ''}
      ${tab.badgeCircle ? `<div class="heavy-tab-badge-circle">${tab.badgeCircle}</div>` : ''}
      <div class="heavy-tab-body">
        <span class="heavy-tab-label">${tab.label}</span>
        ${tab.description ? `<span class="heavy-tab-desc">${tab.description}</span>` : ''}
      </div>
      ${isActive ? `<i class="fas fa-circle-check heavy-tab-check-right"></i>` : ''}
    `;
  }

  // ─── Main Primary variant ───────────────────────────────────────────────────
  renderMainPrimaryTabs(activeTab, alignment) {
    const alignClass = alignment === 'center' ? 'justify-center' :
                       alignment === 'end'    ? 'justify-end'    : '';
    return `
      <div class="webropol-tabs-main-primary flex ${alignClass}">
        ${this.tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const disabledAttr = tab.disabled ? 'disabled' : '';
          return `
            <button
              class="webropol-tab-main-primary${isActive ? ' active' : ''}${tab.disabled ? ' disabled' : ''}"
              data-tab="${tab.id}"
              role="tab"
              aria-selected="${isActive}"
              aria-controls="panel-${tab.id}"
              id="tab-${tab.id}"
              ${disabledAttr}>
              <div class="main-primary-row">
                ${tab.icon ? `<div class="main-primary-avatar"><i class="fal fa-${tab.icon}"></i></div>` : ''}
                <span class="main-primary-label">${tab.label}</span>
                ${tab.badge !== undefined && tab.badge !== null
                  ? `<span class="main-primary-number-badge">${tab.badge}</span>`
                  : ''}
              </div>
              <div class="main-primary-indicator"></div>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  // ─── Unified (pill/rounded) ─────────────────────────────────────────────────
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
              ${tab.icon ? `<i class="fa-duotone fa-thin fa-${tab.icon} ${sizeClasses.icon}"></i>` : ''}
              ${tab.label}
              ${tab.badge ? `<span class="webropol-tab-badge ${sizeClasses.badge}">${tab.badge}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Renders tabs using Figma Regular Primary or Regular Secondary variant tokens.
   * Primary:   selected bg #1e6880 (white text), hover bg #79d6e7
   * Secondary: selected bg #b0e8f1 (dark text), hover bg #b0e8f1, badge always #215669
   * Light:     no fill; selected/hover shown by border-bottom indicator only
   */
  renderFigmaTabs(activeTab, variant, alignment) {
    const alignmentClass = alignment === 'center' ? 'justify-center' :
                           alignment === 'end' ? 'justify-end' : 'justify-start';

    let buttonClass, containerClass;
    if (variant === 'primary') {
      buttonClass = 'webropol-tab-primary';
      containerClass = `webropol-tabs-primary-container flex ${alignmentClass}`;
    } else if (variant === 'light') {
      buttonClass = 'webropol-tab-light';
      containerClass = `webropol-tabs-light-container flex ${alignmentClass}`;
    } else {
      // secondary
      buttonClass = 'webropol-tab-secondary';
      containerClass = `webropol-tabs-secondary-container flex ${alignmentClass}`;
    }

    return `
      <div class="${containerClass}">
        ${this.tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const disabledAttr = tab.disabled ? 'disabled' : '';
          return `
            <button
              class="${buttonClass}${isActive ? ' active' : ''}${tab.disabled ? ' disabled' : ''}"
              data-tab="${tab.id}"
              role="tab"
              aria-selected="${isActive}"
              aria-controls="panel-${tab.id}"
              id="tab-${tab.id}"
              ${disabledAttr}>
              ${tab.icon ? `<i class="fal fa-${tab.icon}"></i>` : ''}
              <span>${tab.label}</span>
              ${tab.badge !== undefined && tab.badge !== null
                ? `<span class="webropol-tab-badge">${tab.badge}</span>`
                : ''}
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
    return shape === 'pill' ? { button: 'webropol-tab-pill' } : { button: 'webropol-tab-rounded' };
  }

  getSizeClasses(size) {
    const sizes = {
      sm: { button: 'size-sm', icon: 'mr-1.5', badge: 'size-sm' },
      md: { button: 'size-md', icon: 'mr-2',   badge: 'size-md' },
      lg: { button: 'size-lg', icon: 'mr-2.5', badge: 'size-lg' }
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
    const tabButtons = this.querySelectorAll('[role="tab"]:not([disabled])');

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
    const tabButtons = Array.from(this.querySelectorAll('[role="tab"]:not([disabled])'));
    const currentIndex = tabButtons.indexOf(currentTab);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % tabButtons.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
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
    const previousTab = this.getAttr('active-tab');
    this.setAttribute('active-tab', tabId);
    this.emit('webropol-tab-change', { activeTab: tabId, previousTab });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'tabs') {
        try { this.tabs = JSON.parse(newValue); } catch (e) { console.warn('Invalid tabs data format'); }
      }
      this.render();
      this.bindEvents();
    }
  }

  // ─── Public API ────────────────────────────────────────────────────────────
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

  setShape(shape) { this.setAttribute('shape', shape); }

  toggleShape() {
    const currentShape = this.getAttr('shape', 'pill');
    this.setShape(currentShape === 'pill' ? 'rounded' : 'pill');
  }
}

customElements.define('webropol-tabs', WebropolTabs);

