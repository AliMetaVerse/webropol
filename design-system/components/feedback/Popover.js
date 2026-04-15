/**
 * Webropol Popover Component
 * Click-first contextual panel for short workflows and secondary actions
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolPopover extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'text', 'position', 'trigger', 'open', 'max-width', 'variant', 'closable', 'show-arrow'];
  }

  constructor() {
    super();
    this.triggerNodes = [];
    this.panelNodes = [];
    this.panelId = this.generateId('popover');
    this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
  }

  init() {
    if (!this._capturedContent) {
      Array.from(this.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node.getAttribute('slot') === 'panel' || node.hasAttribute('data-popover-panel'))) {
          this.panelNodes.push(node);
          return;
        }

        this.triggerNodes.push(node);
      });

      this._capturedContent = true;
    }

    this.style.position = 'relative';
    this.style.display = 'inline-flex';
  }

  render() {
    const title = this.getAttr('title');
    const text = this.getAttr('text');
    const position = this.getAttr('position', 'bottom-start');
    const variant = this.getAttr('variant', 'default');
    const maxWidth = this.getAttr('max-width', '22rem');
    const isOpen = this.getBoolAttr('open');
    const showArrow = this.getBoolAttr('show-arrow', true);
    const closable = this.getBoolAttr('closable');
    const positionConfig = this.getPositionConfig(position);
    const variantClasses = this.getVariantClasses(variant);

    this.innerHTML = `
      <span
        class="webropol-popover-trigger inline-flex items-center"
        aria-expanded="${isOpen ? 'true' : 'false'}"
        aria-haspopup="dialog"
        aria-controls="${this.panelId}"
      ></span>
      <div
        id="${this.panelId}"
        class="webropol-popover-panel absolute z-[75] ${positionConfig.container} ${isOpen ? positionConfig.visible : positionConfig.hidden} ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'} transition-all duration-200 ease-out"
        role="dialog"
        aria-modal="false"
        aria-hidden="${isOpen ? 'false' : 'true'}"
        style="max-width: ${maxWidth};"
      >
        <div class="${variantClasses.surface}">
          ${showArrow ? `<span class="webropol-popover-arrow absolute h-3 w-3 rotate-45 ${positionConfig.arrow} ${variantClasses.arrow}"></span>` : ''}
          ${title || text || closable ? `
            <div class="flex items-start justify-between gap-4 border-b border-black/5 px-5 py-4 ${this.panelNodes.length ? '' : 'pb-3'}">
              <div class="space-y-1">
                ${title ? `<div class="text-sm font-semibold text-[#102e3c]">${title}</div>` : ''}
                ${text ? `<p class="text-sm leading-6 text-[#61686a]">${text}</p>` : ''}
              </div>
              ${closable ? `
                <button type="button" class="webropol-popover-close flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6e7e8] text-[#61686a] transition hover:border-[#b0e8f1] hover:bg-[#eefbfd] hover:text-[#102e3c]" aria-label="Close popover">
                  <i class="fal fa-times text-sm"></i>
                </button>
              ` : ''}
            </div>
          ` : ''}
          <div class="webropol-popover-body ${this.panelNodes.length ? 'px-5 py-4' : 'px-5 pb-5 pt-2'}"></div>
        </div>
      </div>
    `;

    const trigger = this.querySelector('.webropol-popover-trigger');
    const body = this.querySelector('.webropol-popover-body');

    this.triggerNodes.forEach((node) => trigger.appendChild(node));
    this.panelNodes.forEach((node) => body.appendChild(node));

    if (!this.hasFocusableChild(trigger)) {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', title || text || 'Open popover');
    }
  }

  bindEvents() {
    const trigger = this.querySelector('.webropol-popover-trigger');
    const panel = this.querySelector('.webropol-popover-panel');
    const closeButton = this.querySelector('.webropol-popover-close');
    const triggerType = this.getAttr('trigger', 'click');

    if (!trigger || !panel) {
      return;
    }

    if (triggerType === 'click') {
      this.addListener(trigger, 'click', (event) => {
        event.preventDefault();
        this.togglePopover();
      });
    }

    if (triggerType === 'hover') {
      this.addListener(this, 'mouseenter', () => this.openPopover());
      this.addListener(this, 'mouseleave', () => this.closePopover());
      this.addListener(this, 'focusin', () => this.openPopover());
      this.addListener(this, 'focusout', (event) => {
        if (!this.contains(event.relatedTarget)) {
          this.closePopover();
        }
      });
    }

    if (closeButton) {
      this.addListener(closeButton, 'click', () => this.closePopover());
    }

    this.addListener(panel, 'click', (event) => {
      if (event.target.closest('[data-popover-close]')) {
        this.closePopover();
      }
    });

    this.addListener(document, 'pointerdown', this.handleDocumentPointerDown);
    this.addListener(document, 'keydown', this.handleDocumentKeydown);
    this.addListener(window, 'resize', () => this.closePopover());
  }

  getPositionConfig(position) {
    const positions = {
      top: {
        container: 'bottom-full left-1/2 mb-4 -translate-x-1/2',
        hidden: 'translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-bottom-1.5 left-1/2 -translate-x-1/2'
      },
      'top-start': {
        container: 'bottom-full left-0 mb-4',
        hidden: 'translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-bottom-1.5 left-6'
      },
      'top-end': {
        container: 'bottom-full right-0 mb-4',
        hidden: 'translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-bottom-1.5 right-6'
      },
      bottom: {
        container: 'top-full left-1/2 mt-4 -translate-x-1/2',
        hidden: '-translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-top-1.5 left-1/2 -translate-x-1/2'
      },
      'bottom-start': {
        container: 'top-full left-0 mt-4',
        hidden: '-translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-top-1.5 left-6'
      },
      'bottom-end': {
        container: 'top-full right-0 mt-4',
        hidden: '-translate-y-2 scale-95',
        visible: 'translate-y-0 scale-100',
        arrow: '-top-1.5 right-6'
      },
      left: {
        container: 'right-full top-1/2 mr-4 -translate-y-1/2',
        hidden: 'translate-x-2 scale-95',
        visible: 'translate-x-0 scale-100',
        arrow: '-right-1.5 top-1/2 -translate-y-1/2'
      },
      right: {
        container: 'left-full top-1/2 ml-4 -translate-y-1/2',
        hidden: '-translate-x-2 scale-95',
        visible: 'translate-x-0 scale-100',
        arrow: '-left-1.5 top-1/2 -translate-y-1/2'
      }
    };

    return positions[position] || positions['bottom-start'];
  }

  getVariantClasses(variant) {
    const variants = {
      default: {
        surface: 'relative overflow-hidden rounded-[28px] border border-[#d5f4f8] bg-white shadow-[0_28px_60px_rgba(16,46,60,0.16)]',
        arrow: 'border-l border-t border-[#d5f4f8] bg-white'
      },
      brand: {
        surface: 'relative overflow-hidden rounded-[28px] border border-[#215669] bg-gradient-to-br from-[#f7fdff] via-white to-[#eefbfd] shadow-[0_28px_60px_rgba(30,104,128,0.18)]',
        arrow: 'border-l border-t border-[#b0e8f1] bg-[#f8feff]'
      },
      royal: {
        surface: 'relative overflow-hidden rounded-[28px] border border-[#d5bef4] bg-gradient-to-br from-white via-[#f8f4ff] to-[#eef2ff] shadow-[0_28px_60px_rgba(105,34,196,0.16)]',
        arrow: 'border-l border-t border-[#e9d8fd] bg-[#f8f4ff]'
      }
    };

    return variants[variant] || variants.default;
  }

  hasFocusableChild(element) {
    return Boolean(
      element.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
  }

  handleDocumentPointerDown(event) {
    if (this.getAttr('trigger', 'click') === 'manual') {
      return;
    }

    if (this.getBoolAttr('open') && !this.contains(event.target)) {
      this.closePopover();
    }
  }

  handleDocumentKeydown(event) {
    if (event.key === 'Escape' && this.getBoolAttr('open')) {
      this.closePopover();
    }
  }

  openPopover() {
    if (!this.getBoolAttr('open')) {
      this.setAttribute('open', '');
      this.emit('webropol-popover-open', { title: this.getAttr('title') });
    }
  }

  closePopover() {
    if (this.getBoolAttr('open')) {
      this.removeAttribute('open');
      this.emit('webropol-popover-close', { title: this.getAttr('title') });
    }
  }

  togglePopover() {
    if (this.getBoolAttr('open')) {
      this.closePopover();
      return;
    }

    this.openPopover();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._connected || oldValue === newValue) {
      return;
    }

    this.render();
    this.bindEvents();
  }
}

customElements.define('webropol-popover', WebropolPopover);