/**
 * Webropol Action Card Component
 * Cards with gradient headers, content sections, and action buttons
 * Styled like workshop/event cards
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolActionCard extends BaseComponent {
  static get observedAttributes() {
    return ['badge', 'title', 'description', 'variant'];
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
    const badge = this.getAttr('badge');
    const title = this.getAttr('title');
    const description = this.getAttr('description');
    const variant = this.getAttr('variant', 'default');
    
    // Variant gradient classes
    const variantClasses = {
      default: 'bg-sun-to-br from-webropol-teal-500 to-webropol-teal-500',
      workshop: 'bg-sun-to-br from-webropol-teal-500 to-webropol-teal-500',
      event: 'bg-sun-to-br from-purple-500 to-pink-500',
      meeting: 'bg-sun-to-br from-green-500 to-blue-500',
      orange: 'bg-sun-to-br from-orange-500 to-red-500',
      pink: 'bg-sun-to-br from-pink-500 to-purple-500'
    };

    // Only render if we haven't already
    if (!this.querySelector('.action-card-wrapper')) {
      // Store original content nodes
      const originalNodes = Array.from(this.childNodes);
      
      // Create the main wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'action-card-wrapper bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl group cursor-pointer';
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('tabindex', '0');
      
      // Create the header section (gradient)
      const headerSection = document.createElement('div');
      headerSection.className = `${variantClasses[variant] || variantClasses.default} p-6 text-white relative`;
      
      // Add top-right actions (edit icon, menu)
      const topActions = document.createElement('div');
      topActions.className = 'absolute top-4 right-4 flex items-center space-x-2';
      topActions.innerHTML = `
        <button class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
          <i class="fal fa-edit text-sm"></i>
        </button>
        <button class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
          <i class="fal fa-ellipsis-v text-sm"></i>
        </button>
      `;
      headerSection.appendChild(topActions);
      
      // Add badge if provided
      if (badge) {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full mb-4';
        badgeElement.textContent = badge;
        headerSection.appendChild(badgeElement);
      }
      
      // Add title
      if (title) {
        const titleElement = document.createElement('h3');
        titleElement.className = 'text-2xl font-bold text-white mb-3';
        titleElement.textContent = title;
        headerSection.appendChild(titleElement);
      }
      
      // Add description
      if (description) {
        const descElement = document.createElement('p');
        descElement.className = 'text-white/90 text-sm leading-relaxed';
        descElement.textContent = description;
        headerSection.appendChild(descElement);
      }
      
      wrapper.appendChild(headerSection);
      
      // Create the content section (white background)
      const contentSection = document.createElement('div');
      contentSection.className = 'action-card-content p-6 space-y-4';
      
      // Move original content (details) to content section
      if (originalNodes.length > 0) {
        originalNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
            contentSection.appendChild(node);
          }
        });
      }
      
      wrapper.appendChild(contentSection);
      
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
      badge: this.getAttr('badge'),
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

