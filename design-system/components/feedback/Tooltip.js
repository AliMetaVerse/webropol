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
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  init() {
    if (!this._capturedContent) {
      this.triggerNodes = Array.from(this.childNodes);
      this._capturedContent = true;
    }

    this.style.position = 'relative';
    this.style.display = 'inline-flex';
    this.ensureTooltipElement();
  }

  render() {
    const text = this.getAttr('text') || this.getAttr('content');
    const variant = this.getAttr('variant', 'default');
    const maxWidth = this.getAttr('max-width', '18rem');
    const variantClasses = this.getVariantClasses(variant);

    this.innerHTML = `
      <span class="webropol-tooltip-trigger inline-flex items-center" aria-describedby="${this.tooltipId}"></span>
    `;

    const trigger = this.querySelector('.webropol-tooltip-trigger');
    this.triggerNodes.forEach((node) => trigger.appendChild(node));

    if (!this.hasFocusableChild(trigger) && !this.getBoolAttr('disabled')) {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', text || 'Show tooltip');
    }

    this.tooltipElement.innerHTML = `
      <div
        id="${this.tooltipId}"
        class="webropol-tooltip-popup fixed left-0 top-0 z-[70] opacity-0 invisible pointer-events-none"
        role="tooltip"
        aria-hidden="true"
        style="max-width:min(${maxWidth}, calc(100vw - 24px));"
      >
        <div class="webropol-tooltip-surface ${variantClasses.surface}">
          <div class="${variantClasses.text}">${text}</div>
          <span class="webropol-tooltip-arrow absolute h-3 w-3 rotate-45 ${variantClasses.arrow}"></span>
        </div>
      </div>
    `;

    if (!text) {
      this.hide(true);
    }
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

    this.addListener(window, 'resize', this.handleWindowResize);
    this.addListener(document, 'scroll', () => this.hide(true), { passive: true, capture: true });
  }

  ensureTooltipElement() {
    if (this.tooltipElement) {
      return;
    }

    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'webropol-tooltip-layer';
    document.body.appendChild(this.tooltipElement);
  }

  /**
   * Modal-aware stacking. When the tooltip is triggered from inside a modal
   * (or an open <webropol-modal>), bump the portal's z-index above the modal
   * overlay so the tip is not buried. Otherwise keep the default tier.
   */
  resolveStackZIndex() {
    const inModal = this.closest('.modal-overlay, [role="dialog"], webropol-modal[open], .webropol-modal[open]');
    if (inModal) {
      // Sit just above the modal-overlay tier (2147483640 per project convention).
      return 2147483645;
    }
    return null;
  }

  getPosition() {
    return this.getAttr('position', this.getAttr('direction', 'top'));
  }

  getVariantClasses(variant) {
    // Unified light-gray border + soft elevation shadow on a white surface.
    // Variants only adjust text emphasis so tooltips stay visually consistent
    // across the product.
    const baseSurface = 'relative rounded-2xl border border-[#e5e7eb] bg-white px-3.5 py-2.5 shadow-[0_20px_44px_rgba(16,46,60,0.16)]';
    const baseText = 'text-sm font-medium leading-5 text-[#102e3c]';

    const variants = {
      default: {
        surface: baseSurface,
        text: baseText,
        arrow: 'border-[#e5e7eb] bg-white'
      },
      subtle: {
        surface: baseSurface,
        text: `${baseText} text-[#374151]`,
        arrow: 'border-[#e5e7eb] bg-white'
      },
      brand: {
        surface: baseSurface,
        text: `${baseText} text-[#1e6880]`,
        arrow: 'border-[#e5e7eb] bg-white'
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
    const popup = this.tooltipElement?.querySelector('.webropol-tooltip-popup');

    if (!popup || !(this.getAttr('text') || this.getAttr('content'))) {
      return;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }

    this.showTimeout = setTimeout(() => {
      this.updatePosition();
      popup.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
      popup.classList.add('opacity-100', 'visible');
      popup.setAttribute('aria-hidden', 'false');
      this.isVisible = true;
      this.emit('webropol-tooltip-show', { text: this.getAttr('text') || this.getAttr('content') });
    }, delay);
  }

  hide(immediate = false) {
    const popup = this.tooltipElement?.querySelector('.webropol-tooltip-popup');

    if (!popup) {
      return;
    }

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    const delay = immediate ? 0 : 80;

    this.hideTimeout = setTimeout(() => {
      popup.classList.remove('opacity-100', 'visible');
      popup.classList.add('opacity-0', 'invisible', 'pointer-events-none');
      popup.setAttribute('aria-hidden', 'true');
      this.isVisible = false;
      this.emit('webropol-tooltip-hide', { text: this.getAttr('text') || this.getAttr('content') });
    }, delay);
  }

  updatePosition() {
    const popup = this.tooltipElement?.querySelector('.webropol-tooltip-popup');
    const arrow = this.tooltipElement?.querySelector('.webropol-tooltip-arrow');
    const surface = this.tooltipElement?.querySelector('.webropol-tooltip-surface');
    const trigger = this.querySelector('.webropol-tooltip-trigger');

    if (!popup || !arrow || !surface || !trigger) {
      return;
    }

    const viewportPadding = 12;
    const gap = 12;
    const position = this.getPosition();

    popup.style.left = '0px';
    popup.style.top = '0px';
    popup.style.width = 'max-content';

    const triggerRect = trigger.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const popupWidth = Math.min(popupRect.width, window.innerWidth - viewportPadding * 2);
    const popupHeight = popupRect.height;

    let left = triggerRect.left + (triggerRect.width / 2) - (popupWidth / 2);
    let top = triggerRect.top - popupHeight - gap;
    let placement = position;

    if (position.startsWith('bottom')) {
      top = triggerRect.bottom + gap;
    }

    if (position === 'left') {
      left = triggerRect.left - popupWidth - gap;
      top = triggerRect.top + (triggerRect.height / 2) - (popupHeight / 2);
    }

    if (position === 'right') {
      left = triggerRect.right + gap;
      top = triggerRect.top + (triggerRect.height / 2) - (popupHeight / 2);
    }

    if (position.endsWith('start')) {
      left = triggerRect.left;
    }

    if (position.endsWith('end')) {
      left = triggerRect.right - popupWidth;
    }

    if (position.startsWith('top') && top < viewportPadding) {
      top = triggerRect.bottom + gap;
      placement = position.replace('top', 'bottom');
    } else if (position.startsWith('bottom') && top + popupHeight > window.innerHeight - viewportPadding) {
      top = triggerRect.top - popupHeight - gap;
      placement = position.replace('bottom', 'top');
    }

    if (position === 'left' && left < viewportPadding) {
      left = triggerRect.right + gap;
      placement = 'right';
    } else if (position === 'right' && left + popupWidth > window.innerWidth - viewportPadding) {
      left = triggerRect.left - popupWidth - gap;
      placement = 'left';
    }

    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - popupWidth - viewportPadding));
    top = Math.max(viewportPadding, Math.min(top, window.innerHeight - popupHeight - viewportPadding));

    popup.style.width = `${popupWidth}px`;
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    const stackZ = this.resolveStackZIndex();
    if (stackZ !== null) {
      popup.style.zIndex = String(stackZ);
    } else {
      popup.style.zIndex = '';
    }

    const arrowLeft = Math.max(18, Math.min(triggerRect.left + (triggerRect.width / 2) - left - 6, popupWidth - 24));
    const arrowTop = Math.max(18, Math.min(triggerRect.top + (triggerRect.height / 2) - top - 6, popupHeight - 24));

    const variantArrow = this.getVariantClasses(this.getAttr('variant', 'default')).arrow
      .replace(/border-[ltrb]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Outward-facing edges of the rotated diamond carry the surface border
    // colour while the half overlapping the surface stays seamless.
    const placementBorderClasses = (() => {
      if (placement.startsWith('top')) return 'border-r border-b';
      if (placement.startsWith('bottom')) return 'border-l border-t';
      if (placement === 'left') return 'border-t border-r';
      return 'border-b border-l';
    })();

    arrow.className = `webropol-tooltip-arrow absolute h-3 w-3 rotate-45 ${placementBorderClasses} ${variantArrow}`;

    // Position arrow so its centre sits on the surface edge — half overlaps
    // the surface (hiding the seam), half extends outward as the visible tip.
    if (placement.startsWith('top')) {
      arrow.style.left = `${arrowLeft}px`;
      arrow.style.top = `${popupHeight - 6}px`;
    } else if (placement.startsWith('bottom')) {
      arrow.style.left = `${arrowLeft}px`;
      arrow.style.top = '-6px';
    } else if (placement === 'left') {
      arrow.style.left = `${popupWidth - 6}px`;
      arrow.style.top = `${arrowTop}px`;
    } else {
      arrow.style.left = '-6px';
      arrow.style.top = `${arrowTop}px`;
    }
  }

  handleWindowResize() {
    if (this.isVisible) {
      this.updatePosition();
    }
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
    if (this.tooltipElement?.parentNode) {
      this.tooltipElement.parentNode.removeChild(this.tooltipElement);
    }
    this.tooltipElement = null;
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
