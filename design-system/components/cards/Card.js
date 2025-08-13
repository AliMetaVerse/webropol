/**
 * Webropol Card Component
 * Flexible container component for content organization with glass morphism design
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolCard extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'title', 'subtitle', 'image', 'clickable', 'badge', 'icon', 'status'];
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
    const variant = this.getAttr('variant', 'default');
    const size = this.getAttr('size', 'md');
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const image = this.getAttr('image');
    const clickable = this.getBoolAttr('clickable');
    const badge = this.getAttr('badge');
    const icon = this.getAttr('icon');
    const status = this.getAttr('status');
    
    // Only render if we haven't already
    if (!this.querySelector('.card-wrapper')) {
      // Store original content nodes (not innerHTML to preserve web components)
      const originalNodes = Array.from(this.childNodes);
      
      // Base classes with glass morphism
      const baseClasses = this.classNames(
        'card-wrapper bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-webropol-gray-100/80 transition-all duration-300',
        clickable ? 'cursor-pointer hover:shadow-2xl hover:transform hover:scale-[1.02]' : 'hover:shadow-2xl',
        this.getVariantClasses('card', variant),
        this.getSizeClasses('card', size)
      );

      // Create the wrapper
      const wrapper = document.createElement('div');
      wrapper.className = baseClasses;
      if (clickable) {
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('tabindex', '0');
      }

      // Header section with icon and badge
      if (icon || badge || title || subtitle) {
        const headerSection = document.createElement('div');
        headerSection.className = 'mb-4';

        // Icon and badge row
        if (icon || badge) {
          const iconBadgeRow = document.createElement('div');
          iconBadgeRow.className = 'flex items-center justify-between mb-4';

          if (icon) {
            const iconContainer = document.createElement('div');
            iconContainer.className = 'w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-2xl flex items-center justify-center';
            iconContainer.innerHTML = `<i class="fal fa-${icon} text-white text-lg"></i>`;
            iconBadgeRow.appendChild(iconContainer);
          }

          if (badge) {
            const badgeElement = document.createElement('span');
            const badgeClasses = this.getBadgeClasses(status || 'default');
            badgeElement.className = `${badgeClasses} text-xs px-3 py-1 rounded-full font-medium`;
            badgeElement.textContent = badge;
            iconBadgeRow.appendChild(badgeElement);
          }

          headerSection.appendChild(iconBadgeRow);
        }

        // Title and subtitle
        if (title) {
          const titleElement = document.createElement('h3');
          titleElement.className = 'text-xl font-bold text-webropol-gray-900 mb-2';
          titleElement.textContent = title;
          headerSection.appendChild(titleElement);
        }

        if (subtitle) {
          const subtitleElement = document.createElement('p');
          subtitleElement.className = 'text-webropol-gray-600 text-sm mb-4';
          subtitleElement.textContent = subtitle;
          headerSection.appendChild(subtitleElement);
        }

        wrapper.appendChild(headerSection);
      }
      
      // Image section (if provided)
      if (image) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'relative mb-4';
        imageContainer.innerHTML = `
          <img src="${image}" alt="${title || ''}" class="w-full h-48 object-cover rounded-xl">
          ${badge && !icon ? `<span class="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">${badge}</span>` : ''}
        `;
        wrapper.appendChild(imageContainer);
      }
      
      // Main content container
      const mainContent = document.createElement('div');
      mainContent.className = 'card-content space-y-4';
      
      // Move original nodes (preserving web components)
      originalNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          mainContent.appendChild(node);
        }
      });
      
      wrapper.appendChild(mainContent);
      
      // Clear and append wrapper
      this.innerHTML = '';
      this.appendChild(wrapper);
    }
  }

  getBadgeClasses(status) {
    const statusClasses = {
      'live': 'bg-emerald-100 text-emerald-700',
      'active': 'bg-blue-100 text-blue-700',
      'pro': 'bg-yellow-100 text-yellow-700',
      'recent': 'bg-webropol-teal-100 text-webropol-teal-700',
      'draft': 'bg-gray-100 text-gray-700',
      'default': 'bg-webropol-gray-100 text-webropol-gray-700'
    };
    return statusClasses[status] || statusClasses.default;
  }

  bindEvents() {
    if (this.getBoolAttr('clickable')) {
      const cardElement = this.querySelector('.card-wrapper[role="button"]');
      if (cardElement) {
        this.addListener(cardElement, 'click', this.handleClick.bind(this));
        this.addListener(cardElement, 'keydown', this.handleKeydown.bind(this));
      }
    }
  }

  handleClick(event) {
    if (this.getBoolAttr('clickable')) {
      this.emit('webropol-card-click', {
        title: this.getAttr('title'),
        variant: this.getAttr('variant'),
        originalEvent: event
      });
    }
  }

  handleKeydown(event) {
    if (this.getBoolAttr('clickable') && (event.key === 'Enter' || event.key === ' ')) {
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
customElements.define('webropol-card', WebropolCard);
