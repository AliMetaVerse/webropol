/**
 * Webropol Tooltip Component
 * Contextual information display on hover/focus
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolTooltip extends BaseComponent {
  static get observedAttributes() {
    return ['text', 'position', 'trigger', 'delay'];
  }

  constructor() {
    super();
    this.tooltipElement = null;
    this.showTimeout = null;
    this.hideTimeout = null;
  }

  init() {
    this.setAttribute('role', 'tooltip');
    this.style.position = 'relative';
    this.style.display = 'inline-block';
  }

  render() {
    const text = this.getAttr('text');
    const position = this.getAttr('position', 'top');
    
    if (!text) {
      console.warn('WebropolTooltip: text attribute is required');
      return;
    }

    // Wrap content and add tooltip
    const content = this.innerHTML;
    const tooltipId = this.generateId('tooltip');
    
    this.innerHTML = `
      <div class="tooltip-trigger" aria-describedby="${tooltipId}">
        ${content}
      </div>
      <div id="${tooltipId}" 
           class="tooltip-popup absolute z-50 px-3 py-2 text-sm font-medium text-white bg-webropol-gray-900 rounded-lg shadow-lg opacity-0 invisible transition-all duration-200 pointer-events-none whitespace-nowrap ${this.getPositionClasses(position)}"
           role="tooltip">
        ${text}
        <div class="tooltip-arrow absolute w-2 h-2 bg-webropol-gray-900 transform rotate-45 ${this.getArrowClasses(position)}"></div>
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

  getArrowClasses(position) {
    const arrows = {
      top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
      left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
      right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
    };
    return arrows[position] || arrows.top;
  }

  bindEvents() {
    const trigger = this.querySelector('.tooltip-trigger');
    const tooltip = this.querySelector('.tooltip-popup');
    const triggerType = this.getAttr('trigger', 'hover');
    const delay = parseInt(this.getAttr('delay', '500'));

    if (!trigger || !tooltip) return;

    this.tooltipElement = tooltip;

    if (triggerType === 'hover' || triggerType === 'both') {
      this.addListener(trigger, 'mouseenter', () => this.show(delay));
      this.addListener(trigger, 'mouseleave', () => this.hide());
      this.addListener(trigger, 'focus', () => this.show(delay));
      this.addListener(trigger, 'blur', () => this.hide());
    }

    if (triggerType === 'click' || triggerType === 'both') {
      this.addListener(trigger, 'click', () => this.toggle());
    }

    // Hide on scroll
    this.addListener(document, 'scroll', () => this.hide(), { passive: true });
    
    // Hide on window resize
    this.addListener(window, 'resize', () => this.hide());
  }

  show(delay = 0) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.showTimeout = setTimeout(() => {
      if (this.tooltipElement) {
        this.tooltipElement.classList.remove('opacity-0', 'invisible');
        this.tooltipElement.classList.add('opacity-100', 'visible');
        this.emit('webropol-tooltip-show');
      }
    }, delay);
  }

  hide() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    this.hideTimeout = setTimeout(() => {
      if (this.tooltipElement) {
        this.tooltipElement.classList.remove('opacity-100', 'visible');
        this.tooltipElement.classList.add('opacity-0', 'invisible');
        this.emit('webropol-tooltip-hide');
      }
    }, 100);
  }

  toggle() {
    if (this.tooltipElement && this.tooltipElement.classList.contains('opacity-100')) {
      this.hide();
    } else {
      this.show();
    }
  }

  cleanup() {
    super.cleanup();
    if (this.showTimeout) clearTimeout(this.showTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }
}

// Register the component
customElements.define('webropol-tooltip', WebropolTooltip);
