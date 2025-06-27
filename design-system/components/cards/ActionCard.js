/**
 * Webropol Action Card Component
 * Cards with icons, titles, content, and action buttons
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolActionCard extends BaseComponent {
  static get observedAttributes() {
    return ['icon', 'title', 'subtitle', 'variant', 'gradient-from', 'gradient-to'];
  }

  constructor() {
    super();
    this.hasRendered = false;
  }

  connectedCallback() {
    if (!this.hasRendered) {
      this.render();
      this.bindEvents();
      this.hasRendered = true;
    }
  }

  render() {
    const icon = this.getAttr('icon');
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const variant = this.getAttr('variant', 'default');
    const gradientFrom = this.getAttr('gradient-from', 'blue-100');
    const gradientTo = this.getAttr('gradient-to', 'teal-100');
    
    // Variant classes
    const variantClasses = {
      default: 'bg-gradient-to-br from-webropol-blue-100 to-webropol-teal-100/80',
      orange: 'bg-gradient-to-br from-orange-50 to-webropol-teal-100/80',
      pink: 'bg-gradient-to-br from-pink-50 to-webropol-teal-100/80',
      custom: `bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`
    };

    // Only render if we haven't already
    if (!this.querySelector('.action-card-wrapper')) {
      // Store original content nodes (not innerHTML to preserve web components)
      const originalNodes = Array.from(this.childNodes);
      
      // Create the wrapper
      const wrapper = document.createElement('div');
      wrapper.className = `action-card-wrapper rounded-2xl ${variantClasses[variant] || variantClasses.default} p-6 flex flex-col items-center shadow-card border border-webropol-teal-100 transition-shadow duration-200 hover:shadow-2xl group cursor-pointer`;
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('tabindex', '0');

      // Build the header content
      let headerHtml = '';
      
      if (icon) {
        headerHtml += `
          <div class="w-16 h-16 mb-4 flex items-center justify-center">
            <i class="fas fa-${icon} text-4xl text-webropol-teal-600 group-hover:scale-110 transition-transform duration-200"></i>
          </div>
        `;
      }
      
      if (title) {
        headerHtml += `<h3 class="font-semibold text-lg text-webropol-gray-900 mb-2 text-center">${title}</h3>`;
      }
      
      if (subtitle) {
        headerHtml += `<p class="text-sm text-webropol-gray-600 mb-4 text-center">${subtitle}</p>`;
      }

      // Add header content
      if (headerHtml) {
        wrapper.innerHTML = headerHtml;
      }

      // Create content container and move original nodes there
      const contentContainer = document.createElement('div');
      contentContainer.className = 'action-card-content flex-1 w-full text-center';
      
      // Move original nodes (preserving web components)
      originalNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          contentContainer.appendChild(node);
        }
      });

      wrapper.appendChild(contentContainer);

      // Clear and append wrapper
      this.innerHTML = '';
      this.appendChild(wrapper);
    }
  }

  bindEvents() {
    const cardElement = this.querySelector('.action-card-wrapper[role="button"]');
    if (cardElement) {
      this.addListener(cardElement, 'click', this.handleClick.bind(this));
      this.addListener(cardElement, 'keydown', this.handleKeydown.bind(this));
    }
  }

  handleClick(event) {
    this.emit('webropol-action-card-click', {
      title: this.getAttr('title'),
      icon: this.getAttr('icon'),
      originalEvent: event
    });
  }

  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(event);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.hasRendered) {
      // Clear hasRendered flag and re-render
      this.hasRendered = false;
      this.render();
      this.bindEvents();
      this.hasRendered = true;
    }
  }
}

// Register the component
customElements.define('webropol-action-card', WebropolActionCard);
