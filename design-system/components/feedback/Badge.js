/**
 * Webropol Badge Component
 * Status indicators and labels
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolBadge extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'icon', 'dismissible'];
  }

  render() {
    const variant = this.getAttr('variant', 'primary');
    const size = this.getAttr('size', 'md');
    const icon = this.getAttr('icon');
    const dismissible = this.getBoolAttr('dismissible');
    
    // Get text content
    const text = this.textContent.trim();
    
    // Base classes
    const baseClasses = this.classNames(
      'inline-flex items-center font-medium rounded-full',
      this.getVariantClasses('badge', variant),
      this.getSizeClasses('badge', size)
    );

    // Create icon HTML if specified
    const iconHtml = icon ? `<i class="fal fa-${icon} ${text ? 'mr-1.5' : ''} text-xs"></i>` : '';
    
    // Create dismiss button if dismissible
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
      this.addListener(dismissButton, 'click', (event) => {
        event.stopPropagation();
        this.handleDismiss();
      });
    }
  }

  handleDismiss() {
    this.emit('webropol-badge-dismiss', {
      text: this.textContent.trim(),
      variant: this.getAttr('variant')
    });
    
    // Add exit animation
    this.style.transition = 'all 200ms ease-out';
    this.style.transform = 'scale(0.8)';
    this.style.opacity = '0';
    
    setTimeout(() => {
      this.remove();
    }, 200);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }
}

// Register the component
customElements.define('webropol-badge', WebropolBadge);
