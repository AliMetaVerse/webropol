/**
 * Webropol Modal Component
 * Accessible modal dialog with backdrop and animations
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolModal extends BaseComponent {
  static get observedAttributes() {
    return ['open', 'size', 'title', 'closable', 'backdrop-close', 'z-index'];
  }

  constructor() {
    super();
    this.previouslyFocused = null;
    this.trapFocus = this.trapFocus.bind(this);
  }

  init() {
    // Set ARIA attributes
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    if (!this.hasAttribute('aria-labelledby') && this.getAttr('title')) {
      this.setAttribute('aria-labelledby', this.generateId('modal-title'));
    }
  }

  render() {
    const isOpen = this.getBoolAttr('open');
    const size = this.getAttr('size', 'md');
    const title = this.getAttr('title');
    const closable = this.getBoolAttr('closable', true);
    const backdropClose = this.getBoolAttr('backdrop-close', true);
    
    // Get slot content
    const content = this.innerHTML;
    
    // Size classes
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-[95vw] max-h-[95vh]'
    };

    // NOTE: Elevated z-index to ensure the modal layers above the header (which uses z-40 and
    // some dropdowns that may reach higher values). Also, by portaling the component to <body>
    // (implemented in show()), we escape any transformed stacking contexts that previously
    // caused the header to visually cover the modal.
    // Allow consumer to override z-index via attribute or CSS variable.
    // Priority: attribute z-index > CSS var(--webropol-modal-z) > default 12000 (covers header dropdowns z-[9999]).
    const attrZ = this.getAttribute('z-index');
    const cssVarZ = getComputedStyle(this).getPropertyValue('--webropol-modal-z').trim();
    const resolvedZ = parseInt(attrZ || cssVarZ || '12000', 10) || 12000;

    const modalHtml = `
      <div class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
           style="z-index:${resolvedZ};transition: opacity 300ms ease-out">
        
        <div class="modal-content bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col overflow-hidden transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}"
             style="transition: all 300ms ease-out"
             role="document">
          
          ${title || closable ? `
            <div class="modal-header flex items-center justify-between p-6 border-b border-webropol-gray-200 bg-gradient-to-r from-webropol-gray-50 to-webropol-primary-50/30">
              ${title ? `
                <div>
                  <h2 id="${this.getAttribute('aria-labelledby') || this.generateId('modal-title')}" 
                      class="text-xl font-bold text-webropol-gray-900">${title}</h2>
                </div>
              ` : '<div></div>'}
              
              ${closable ? `
                <button class="modal-close w-10 h-10 flex items-center justify-center text-webropol-gray-400 hover:text-webropol-gray-600 hover:bg-webropol-gray-100 rounded-xl transition-all"
                        aria-label="Close modal">
                  <i class="fal fa-times text-lg"></i>
                </button>
              ` : ''}
            </div>
          ` : ''}
          
          <div class="modal-body flex-1 overflow-y-auto p-6">
            ${content}
          </div>
        </div>
      </div>
    `;

    this.innerHTML = modalHtml;
    
    // Handle visibility
    if (isOpen) {
      this.show();
    } else {
      this.hide();
    }
  }

  bindEvents() {
    const backdrop = this.querySelector('.modal-backdrop');
    const closeButton = this.querySelector('.modal-close');
    const modalContent = this.querySelector('.modal-content');

    if (backdrop) {
      this.addListener(backdrop, 'click', (event) => {
        if (event.target === backdrop && this.getBoolAttr('backdrop-close', true)) {
          this.close();
        }
      });
    }

    if (closeButton) {
      this.addListener(closeButton, 'click', () => this.close());
    }

    // Prevent click on modal content from closing
    if (modalContent) {
      this.addListener(modalContent, 'click', (event) => {
        event.stopPropagation();
      });
    }

    // Keyboard events
    this.addListener(document, 'keydown', (event) => {
      if (this.getBoolAttr('open')) {
        if (event.key === 'Escape' && this.getBoolAttr('closable', true)) {
          this.close();
        } else if (event.key === 'Tab') {
          this.trapFocus(event);
        }
      }
    });
  }

  show() {
    // Portal to body to avoid being trapped in a lower stacking context (e.g., parent with transform)
    if (!this._portaled) {
      this._originalParent = this.parentElement;
      try {
        document.body.appendChild(this);
        this._portaled = true;
      } catch (e) {
        console.warn('[WebropolModal] Failed to portal modal to body:', e);
      }
    }
    // Ensure host itself is not constrained by ancestor positioning (some SPA wrappers may set transform or perspective).
    // We apply a fixed positioning layer only while open so any internal absolute elements align to viewport.
    this._prevHostStyle = this._prevHostStyle || this.getAttribute('style') || '';
    const currentInline = this._prevHostStyle.replace(/position:\s*fixed;?/,'').replace(/top:\s*0;?/,'').replace(/left:\s*0;?/,'').replace(/width:\s*100vw;?/,'').replace(/height:\s*100vh;?/,'');
    this.setAttribute('style', `position:fixed;top:0;left:0;width:100vw;height:100vh;${currentInline}`.trim());
    // Store previously focused element
    this.previouslyFocused = document.activeElement;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Set focus to modal
    setTimeout(() => {
      const focusTarget = this.querySelector('.modal-close') || this.querySelector('[autofocus]') || this.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusTarget) {
        focusTarget.focus();
      }
    }, 100);

    this.emit('webropol-modal-open');
  }

  hide() {
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restore focus
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }

    // (Optional) restore original DOM position if it existed and parent is still in document
    if (this._portaled && this._originalParent && document.contains(this._originalParent)) {
      try {
        this._originalParent.appendChild(this);
      } catch (e) {
        console.warn('[WebropolModal] Failed to restore modal to original parent:', e);
      }
      this._portaled = false;
    }

    // Restore host inline style
    if (this._prevHostStyle !== undefined) {
      if (this._prevHostStyle) this.setAttribute('style', this._prevHostStyle);
      else this.removeAttribute('style');
    }

    this.emit('webropol-modal-close');
  }

  trapFocus(event) {
    const focusableElements = this.querySelectorAll(
      'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'open') {
        this.render();
        this.bindEvents();
      } else {
        this.render();
      }
    }
  }

  // Public methods
  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }

  toggle() {
    if (this.getBoolAttr('open')) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Register the component
customElements.define('webropol-modal', WebropolModal);
