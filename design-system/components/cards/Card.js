/**
 * Webropol Card Component
 * Flexible container component for content organization
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolCard extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'title', 'subtitle', 'image', 'clickable', 'badge'];
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
    
    // Only render if we haven't already
    if (!this.querySelector('.card-wrapper')) {
      // Store original content nodes (not innerHTML to preserve web components)
      const originalNodes = Array.from(this.childNodes);
      
      // Base classes
      const baseClasses = this.classNames(
        'card-wrapper rounded-2xl transition-all duration-200',
        clickable ? 'cursor-pointer hover:transform hover:scale-[1.02] hover:shadow-lg' : '',
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
      
      // Image section
      if (image) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'relative';
        imageContainer.innerHTML = `
          <img src="${image}" alt="${title || ''}" class="w-full h-48 object-cover rounded-t-2xl">
          ${badge ? `<span class="absolute top-4 right-4 bg-webropol-gray-700 text-white text-xs px-3 py-1 rounded-full">${badge}</span>` : ''}
        `;
        wrapper.appendChild(imageContainer);
      } else if (badge) {
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'relative';
        badgeContainer.innerHTML = `<span class="absolute top-4 right-4 bg-webropol-gray-700 text-white text-xs px-3 py-1 rounded-full">${badge}</span>`;
        wrapper.appendChild(badgeContainer);
      }
      
      // Content section
      const contentSection = document.createElement('div');
      contentSection.className = 'space-y-4';
      
      // Header section
      if (title || subtitle) {
        const headerSection = document.createElement('div');
        headerSection.className = 'space-y-2';
        
        if (title) {
          const titleElement = document.createElement('h3');
          titleElement.className = 'text-lg font-semibold text-webropol-gray-900';
          titleElement.textContent = title;
          headerSection.appendChild(titleElement);
        }
        
        if (subtitle) {
          const subtitleElement = document.createElement('p');
          subtitleElement.className = 'text-sm text-webropol-gray-600';
          subtitleElement.textContent = subtitle;
          headerSection.appendChild(subtitleElement);
        }
        
        contentSection.appendChild(headerSection);
      }
      
      // Main content container
      const mainContent = document.createElement('div');
      mainContent.className = 'card-content';
      
      // Move original nodes (preserving web components)
      originalNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          mainContent.appendChild(node);
        }
      });
      
      contentSection.appendChild(mainContent);
      wrapper.appendChild(contentSection);
      
      // Clear and append wrapper
      this.innerHTML = '';
      this.appendChild(wrapper);
    }
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
