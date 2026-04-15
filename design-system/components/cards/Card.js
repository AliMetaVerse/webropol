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
        'card-wrapper bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-card border border-webropol-gray-200/90 transition-all duration-300',
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
            iconContainer.className = 'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-webropol-gray-100 text-webropol-gray-700 shadow-soft';
            iconContainer.innerHTML = `<i class="fal fa-${icon} text-lg"></i>`;
            iconBadgeRow.appendChild(iconContainer);
          }

          if (badge) {
            const badgeElement = document.createElement('span');
            const badgeClasses = this.getBadgeClasses(status || 'default');
            badgeElement.className = this.classNames(
              'inline-flex items-center whitespace-nowrap rounded-md border border-white/50 font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]',
              badgeClasses,
              this.getSizeClasses('badge', 'sm')
            );
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
      live: this.getVariantClasses('badge', 'success'),
      active: this.getVariantClasses('badge', 'primary'),
      pro: this.getVariantClasses('badge', 'warning'),
      recent: this.getVariantClasses('badge', 'secondary'),
      draft: this.getVariantClasses('badge', 'neutral'),
      default: this.getVariantClasses('badge', 'neutral')
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

