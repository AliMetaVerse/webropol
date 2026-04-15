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
    this.portalElement = null;
    this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
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
    this.ensurePortalElement();
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
    const variantClasses = this.getVariantClasses(variant);

    this.innerHTML = `
      <span
        class="webropol-popover-trigger inline-flex items-center"
        aria-expanded="${isOpen ? 'true' : 'false'}"
        aria-haspopup="dialog"
        aria-controls="${this.panelId}"
      ></span>
    `;

    const trigger = this.querySelector('.webropol-popover-trigger');

    this.triggerNodes.forEach((node) => trigger.appendChild(node));

    if (!this.hasFocusableChild(trigger)) {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', title || text || 'Open popover');
    }

    this.portalElement.innerHTML = `
      <div
        id="${this.panelId}"
        class="webropol-popover-panel fixed left-0 top-0 z-[75] ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}"
        role="dialog"
        aria-modal="false"
        aria-hidden="${isOpen ? 'false' : 'true'}"
        style="width:min(${maxWidth}, calc(100vw - 24px));"
      >
        <div class="webropol-popover-surface ${variantClasses.surface}">
          ${showArrow ? `<span class="webropol-popover-arrow absolute h-3 w-3 rotate-45 ${variantClasses.arrow}"></span>` : ''}
          ${title || text || closable ? `
            <div class="flex items-start justify-between gap-4 border-b border-[#d5f4f8] px-5 py-4 ${this.panelNodes.length ? '' : 'pb-3'}">
              <div class="space-y-1">
                ${title ? `<div class="text-sm font-semibold text-[#102e3c]">${title}</div>` : ''}
                ${text ? `<p class="text-sm leading-6 text-[#61686a]">${text}</p>` : ''}
              </div>
              ${closable ? `
                <button type="button" class="webropol-popover-close flex h-9 w-9 items-center justify-center rounded-xl border border-[#d5f4f8] bg-white text-[#61686a] hover:border-[#b0e8f1] hover:bg-[#eefbfd] hover:text-[#102e3c]" aria-label="Close popover">
                  <i class="fal fa-times text-sm"></i>
                </button>
              ` : ''}
            </div>
          ` : ''}
          <div class="webropol-popover-body ${this.panelNodes.length ? 'px-5 py-4' : 'px-5 pb-5 pt-2'}"></div>
        </div>
      </div>
    `;

    const body = this.portalElement.querySelector('.webropol-popover-body');
    this.panelNodes.forEach((node) => body.appendChild(node));

    if (isOpen) {
      this.updatePosition();
    }
  }

  bindEvents() {
    const trigger = this.querySelector('.webropol-popover-trigger');
    const panel = this.portalElement?.querySelector('.webropol-popover-panel');
    const closeButton = this.portalElement?.querySelector('.webropol-popover-close');
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
      this.addListener(trigger, 'mouseenter', () => this.openPopover());
      this.addListener(trigger, 'mouseleave', (event) => {
        if (!panel.contains(event.relatedTarget)) {
          this.closePopover();
        }
      });
      this.addListener(trigger, 'focusin', () => this.openPopover());
      this.addListener(trigger, 'focusout', (event) => {
        if (!this.contains(event.relatedTarget) && !panel.contains(event.relatedTarget)) {
          this.closePopover();
        }
      });
      this.addListener(panel, 'mouseenter', () => this.openPopover());
      this.addListener(panel, 'mouseleave', (event) => {
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
    this.addListener(window, 'resize', this.handleViewportChange);
    this.addListener(document, 'scroll', this.handleViewportChange, { passive: true, capture: true });
  }

  ensurePortalElement() {
    if (this.portalElement) {
      return;
    }

    this.portalElement = document.createElement('div');
    this.portalElement.className = 'webropol-popover-layer';
    document.body.appendChild(this.portalElement);
  }

  getVariantClasses(variant) {
    const variants = {
      default: {
        surface: 'relative overflow-hidden rounded-[28px] border border-[#b0e8f1] bg-white shadow-[0_28px_60px_rgba(16,46,60,0.16)]',
        arrow: 'border-l border-t border-[#b0e8f1] bg-white'
      },
      subtle: {
        surface: 'relative overflow-hidden rounded-[28px] border border-[#d5f4f8] bg-[#f8feff] shadow-[0_22px_48px_rgba(16,46,60,0.12)]',
        arrow: 'border-l border-t border-[#d5f4f8] bg-[#f8feff]'
      },
      brand: {
        surface: 'relative overflow-hidden rounded-[28px] border border-[#1e6880] bg-white shadow-[0_28px_60px_rgba(30,104,128,0.18)]',
        arrow: 'border-l border-t border-[#b0e8f1] bg-[#f8feff]'
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

    const panel = this.portalElement?.querySelector('.webropol-popover-panel');

    if (this.getBoolAttr('open') && !this.contains(event.target) && !panel?.contains(event.target)) {
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
    } else {
      this.updatePosition();
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

  updatePosition() {
    const panel = this.portalElement?.querySelector('.webropol-popover-panel');
    const arrow = this.portalElement?.querySelector('.webropol-popover-arrow');
    const surface = this.portalElement?.querySelector('.webropol-popover-surface');
    const body = this.portalElement?.querySelector('.webropol-popover-body');
    const trigger = this.querySelector('.webropol-popover-trigger');

    if (!panel || !surface || !body || !trigger) {
      return;
    }

    const viewportPadding = 12;
    const gap = 16;
    const triggerRect = trigger.getBoundingClientRect();
    const requestedPosition = this.getAttr('position', 'bottom-start');
    const spaceAbove = Math.max(0, triggerRect.top - viewportPadding - gap);
    const spaceBelow = Math.max(0, window.innerHeight - triggerRect.bottom - viewportPadding - gap);
    const spaceLeft = Math.max(0, triggerRect.left - viewportPadding - gap);
    const spaceRight = Math.max(0, window.innerWidth - triggerRect.right - viewportPadding - gap);

    panel.style.left = '0px';
    panel.style.top = '0px';
    panel.style.maxHeight = 'none';
    body.style.maxHeight = '';
    body.style.overflowY = 'visible';

    const panelRect = panel.getBoundingClientRect();
    const naturalWidth = panelRect.width;
    const naturalHeight = panelRect.height;
    const width = Math.min(naturalWidth, window.innerWidth - viewportPadding * 2);
    let height = naturalHeight;

    let left = triggerRect.left;
    let top = triggerRect.bottom + gap;
    let placement = requestedPosition;

    if (requestedPosition === 'bottom') {
      left = triggerRect.left + (triggerRect.width / 2) - (width / 2);
    }

    if (requestedPosition === 'bottom-end') {
      left = triggerRect.right - width;
    }

    if (requestedPosition.startsWith('top')) {
      top = triggerRect.top - height - gap;
      if (requestedPosition === 'top') {
        left = triggerRect.left + (triggerRect.width / 2) - (width / 2);
      }
      if (requestedPosition === 'top-end') {
        left = triggerRect.right - width;
      }
    }

    if (requestedPosition === 'left') {
      left = triggerRect.left - width - gap;
      top = triggerRect.top + (triggerRect.height / 2) - (height / 2);
    }

    if (requestedPosition === 'right') {
      left = triggerRect.right + gap;
      top = triggerRect.top + (triggerRect.height / 2) - (height / 2);
    }

    if (requestedPosition.startsWith('bottom') && naturalHeight > spaceBelow && spaceAbove > spaceBelow) {
      top = triggerRect.top - naturalHeight - gap;
      placement = requestedPosition.replace('bottom', 'top');
    } else if (requestedPosition.startsWith('top') && naturalHeight > spaceAbove && spaceBelow > spaceAbove) {
      top = triggerRect.bottom + gap;
      placement = requestedPosition.replace('top', 'bottom');
    }

    if (placement.startsWith('bottom') && top + naturalHeight > window.innerHeight - viewportPadding) {
      const available = Math.max(160, spaceBelow);
      height = Math.min(naturalHeight, available);
    } else if (placement.startsWith('top') && top < viewportPadding) {
      const available = Math.max(160, spaceAbove);
      height = Math.min(naturalHeight, available);
      top = triggerRect.top - height - gap;
    } else if (requestedPosition.startsWith('bottom') && top + height > window.innerHeight - viewportPadding) {
      top = triggerRect.top - height - gap;
      placement = requestedPosition.replace('bottom', 'top');
    } else if (requestedPosition.startsWith('top') && top < viewportPadding) {
      top = triggerRect.bottom + gap;
      placement = requestedPosition.replace('top', 'bottom');
    }

    if (requestedPosition === 'left' && naturalWidth > spaceLeft && spaceRight > spaceLeft) {
      left = triggerRect.right + gap;
      placement = 'right';
    } else if (requestedPosition === 'right' && naturalWidth > spaceRight && spaceLeft > spaceRight) {
      left = triggerRect.left - width - gap;
      placement = 'left';
    }

    if (requestedPosition === 'left' && left < viewportPadding) {
      left = triggerRect.right + gap;
      placement = 'right';
    } else if (requestedPosition === 'right' && left + width > window.innerWidth - viewportPadding) {
      left = triggerRect.left - width - gap;
      placement = 'left';
    }

    if ((placement === 'left' || placement === 'right') && naturalHeight > window.innerHeight - viewportPadding * 2) {
      height = window.innerHeight - viewportPadding * 2;
    }

    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - width - viewportPadding));
    top = Math.max(viewportPadding, Math.min(top, window.innerHeight - height - viewportPadding));

    const constrainedByViewport = height < naturalHeight - 1;

    panel.style.width = `${width}px`;
    panel.style.maxHeight = constrainedByViewport ? `${height}px` : 'none';
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;

    const header = surface.querySelector('.border-b');
    const chromeHeight = (header?.offsetHeight || 0) + 24;
    const availableBodyHeight = Math.max(140, height - chromeHeight);
    const needsScroll = constrainedByViewport && body.scrollHeight > availableBodyHeight + 2;
    body.style.maxHeight = needsScroll ? `${availableBodyHeight}px` : '';
    body.style.overflowY = needsScroll ? 'auto' : 'visible';

    if (arrow) {
      const finalRect = panel.getBoundingClientRect();
      const finalWidth = finalRect.width;
      const finalHeight = finalRect.height;
      const triggerCenterX = triggerRect.left + (triggerRect.width / 2);
      const triggerCenterY = triggerRect.top + (triggerRect.height / 2);
      const arrowLeft = Math.max(22, Math.min(triggerCenterX - finalRect.left - 6, finalWidth - 28));
      const arrowTop = Math.max(22, Math.min(triggerCenterY - finalRect.top - 6, finalHeight - 28));

      arrow.className = `webropol-popover-arrow absolute h-3 w-3 rotate-45 ${this.getVariantClasses(this.getAttr('variant', 'default')).arrow}`;

      if (placement.startsWith('top')) {
        arrow.style.left = `${arrowLeft}px`;
        arrow.style.top = `${finalHeight - 6}px`;
      } else if (placement.startsWith('bottom')) {
        arrow.style.left = `${arrowLeft}px`;
        arrow.style.top = '-6px';
      } else if (placement === 'left') {
        arrow.style.left = `${finalWidth - 6}px`;
        arrow.style.top = `${arrowTop}px`;
      } else {
        arrow.style.left = '-6px';
        arrow.style.top = `${arrowTop}px`;
      }
    }
  }

  handleViewportChange() {
    if (this.getBoolAttr('open')) {
      this.updatePosition();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._connected || oldValue === newValue) {
      return;
    }

    this.render();
    this.bindEvents();
  }

  cleanup() {
    super.cleanup();
    if (this.portalElement?.parentNode) {
      this.portalElement.parentNode.removeChild(this.portalElement);
    }
    this.portalElement = null;
  }
}

customElements.define('webropol-popover', WebropolPopover);