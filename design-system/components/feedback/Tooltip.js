/**
 * Webropol Tooltip Component
 * Contextual information display on hover, focus, or click
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolTooltip extends BaseComponent {
  static get observedAttributes() {
    return ['text', 'content', 'position', 'direction', 'trigger', 'delay', 'max-width', 'variant', 'disabled'];
  }

  constructor() {
    super();
    this.tooltipElement = null;
    this.triggerNodes = [];
    this.showTimeout = null;
    this.hideTimeout = null;
    this.isVisible = false;
    this.tooltipId = this.generateId('tooltip');
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  init() {
    if (!this._capturedContent) {
      this.triggerNodes = Array.from(this.childNodes);
      this._capturedContent = true;
    }

    this.style.position = 'relative';
    this.style.display = 'inline-flex';
  }

  render() {
    const text = this.getAttr('text') || this.getAttr('content');
    const position = this.getPosition();
    const variant = this.getAttr('variant', 'default');
    const maxWidth = this.getAttr('max-width', '18rem');
    const positionConfig = this.getPositionConfig(position);
    const variantClasses = this.getVariantClasses(variant);

    this.innerHTML = `
      <span class="webropol-tooltip-trigger inline-flex items-center" aria-describedby="${this.tooltipId}"></span>
      <div
        id="${this.tooltipId}"
        class="webropol-tooltip-popup absolute z-[70] ${positionConfig.container} ${positionConfig.hidden} opacity-0 invisible pointer-events-none transition-all duration-200 ease-out"
        role="tooltip"
        aria-hidden="true"
        style="max-width: ${maxWidth};"
      >
        <div class="${variantClasses.surface}">
          <div class="${variantClasses.text}">${text}</div>
          <span class="webropol-tooltip-arrow absolute h-3 w-3 rotate-45 ${positionConfig.arrow} ${variantClasses.arrow}"></span>
        </div>
      </div>
    `;

    const trigger = this.querySelector('.webropol-tooltip-trigger');
    this.triggerNodes.forEach((node) => trigger.appendChild(node));

    if (!this.hasFocusableChild(trigger) && !this.getBoolAttr('disabled')) {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', text || 'Show tooltip');
    }

    this.tooltipElement = this.querySelector('.webropol-tooltip-popup');
  }

  bindEvents() {
    const trigger = this.querySelector('.webropol-tooltip-trigger');
    const triggerType = this.getAttr('trigger', 'hover');
    const delay = Number.parseInt(this.getAttr('delay', '150'), 10) || 0;

    if (!trigger || !this.tooltipElement || this.getBoolAttr('disabled')) {
      return;
    }

    if (triggerType === 'hover' || triggerType === 'both') {
      this.addListener(trigger, 'mouseenter', () => this.show(delay));
      this.addListener(trigger, 'mouseleave', () => this.hide());
      this.addListener(trigger, 'focusin', () => this.show(0));
      this.addListener(trigger, 'focusout', (event) => {
        if (!this.contains(event.relatedTarget)) {
          this.hide();
        }
      });
    }

    if (triggerType === 'click' || triggerType === 'both') {
      this.addListener(trigger, 'click', (event) => {
        event.preventDefault();
        this.toggle();
      });
      this.addListener(document, 'pointerdown', this.handleOutsideClick);
    }

    this.addListener(window, 'resize', () => this.hide(true));
    this.addListener(document, 'scroll', () => this.hide(true), { passive: true, capture: true });
  }

  getPosition() {
    return this.getAttr('position', this.getAttr('direction', 'top'));
  }

  getPositionConfig(position) {
    const positions = {
      top: {
        container: 'bottom-full left-1/2 mb-3 -translate-x-1/2',
        hidden: 'translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-bottom-1.5 left-1/2 -translate-x-1/2'
      },
      'top-start': {
        container: 'bottom-full left-0 mb-3',
        hidden: 'translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-bottom-1.5 left-4'
      },
      'top-end': {
        container: 'bottom-full right-0 mb-3',
        hidden: 'translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-bottom-1.5 right-4'
      },
      bottom: {
        container: 'top-full left-1/2 mt-3 -translate-x-1/2',
        hidden: '-translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-top-1.5 left-1/2 -translate-x-1/2'
      },
      'bottom-start': {
        container: 'top-full left-0 mt-3',
        hidden: '-translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-top-1.5 left-4'
      },
      'bottom-end': {
        container: 'top-full right-0 mt-3',
        hidden: '-translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-top-1.5 right-4'
      },
      left: {
        container: 'right-full top-1/2 mr-3 -translate-y-1/2',
        hidden: 'translate-x-2 scale-95',
        visible: 'translate-x-0 scale-100',
        arrow: '-right-1.5 top-1/2 -translate-y-1/2'
      },
      right: {
        container: 'left-full top-1/2 ml-3 -translate-y-1/2',
        hidden: '-translate-x-2 scale-95',
        visible: 'translate-x-0 scale-100',
        arrow: '-left-1.5 top-1/2 -translate-y-1/2'
      }
    };

    return positions[position] || positions.top;
  }

  getVariantClasses(variant) {
    const variants = {
      default: {
        surface: 'relative rounded-2xl border border-[#204859] bg-[#102e3c] px-3.5 py-2.5 shadow-[0_18px_40px_rgba(16,46,60,0.24)]',
        text: 'text-sm font-medium leading-5 text-white',
        arrow: 'border-l border-t border-[#204859] bg-[#102e3c]'
      },
      subtle: {
        surface: 'relative rounded-2xl border border-[#d5f4f8] bg-white px-3.5 py-2.5 shadow-[0_18px_40px_rgba(16,46,60,0.14)]',
        text: 'text-sm font-medium leading-5 text-[#102e3c]',
        arrow: 'border-l border-t border-[#d5f4f8] bg-white'
      },
      brand: {
        surface: 'relative rounded-2xl border border-[#1e6880] bg-gradient-to-br from-[#215669] to-[#1e6880] px-3.5 py-2.5 shadow-[0_18px_40px_rgba(30,104,128,0.28)]',
        text: 'text-sm font-medium leading-5 text-white',
        arrow: 'border-l border-t border-[#1e6880] bg-[#1e6880]'
      }
    };

    return variants[variant] || variants.default;
  }

  hasFocusableChild(element) {
    return Boolean(
      element.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
  }

  handleOutsideClick(event) {
    if (!this.contains(event.target)) {
      this.hide(true);
    }
  }

  show(delay = 0) {
    if (!this.tooltipElement || !(this.getAttr('text') || this.getAttr('content'))) {
      return;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }

    const positionConfig = this.getPositionConfig(this.getPosition());

    this.showTimeout = setTimeout(() => {
      this.tooltipElement.classList.remove('opacity-0', 'invisible', 'pointer-events-none', ...positionConfig.hidden.split(' '));
      this.tooltipElement.classList.add('opacity-100', 'visible', ...positionConfig.visible.split(' '));
      this.tooltipElement.setAttribute('aria-hidden', 'false');
      this.isVisible = true;
      this.emit('webropol-tooltip-show', { text: this.getAttr('text') || this.getAttr('content') });
    }, delay);
  }

  hide(immediate = false) {
    if (!this.tooltipElement) {
      return;
    }

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    const positionConfig = this.getPositionConfig(this.getPosition());
    const delay = immediate ? 0 : 80;

    this.hideTimeout = setTimeout(() => {
      this.tooltipElement.classList.remove('opacity-100', 'visible', ...positionConfig.visible.split(' '));
      this.tooltipElement.classList.add('opacity-0', 'invisible', 'pointer-events-none', ...positionConfig.hidden.split(' '));
      this.tooltipElement.setAttribute('aria-hidden', 'true');
      this.isVisible = false;
      this.emit('webropol-tooltip-hide', { text: this.getAttr('text') || this.getAttr('content') });
    }, delay);
  }

  toggle() {
    if (this.isVisible) {
      this.hide(true);
      return;
    }

    this.show(0);
  }

  cleanup() {
    super.cleanup();
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._connected || oldValue === newValue) {
      return;
    }

    this.render();
    this.bindEvents();
  }
}

customElements.define('webropol-tooltip', WebropolTooltip);
