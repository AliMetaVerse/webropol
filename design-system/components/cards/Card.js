/**
 * Webropol Card Component
 * Flexible container component for content organization
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolCard extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'title', 'subtitle', 'image', 'clickable', 'badge'];
  }

  render() {
    const variant = this.getAttr('variant', 'default');
    const size = this.getAttr('size', 'md');
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const image = this.getAttr('image');
    const clickable = this.getBoolAttr('clickable');
    const badge = this.getAttr('badge');
    
    // Get slot content
    const content = this.innerHTML;
    
    // Base classes
    const baseClasses = this.classNames(
      'rounded-2xl transition-all duration-200',
      clickable ? 'cursor-pointer hover:transform hover:scale-[1.02] hover:shadow-lg' : '',
      this.getVariantClasses('card', variant),
      this.getSizeClasses('card', size)
    );

    // Build card HTML
    let cardHtml = `<div class="${baseClasses}" ${clickable ? 'role="button" tabindex="0"' : ''}>`;
    
    // Image section
    if (image) {
      cardHtml += `
        <div class="relative">
          <img src="${image}" alt="${title || ''}" class="w-full h-48 object-cover rounded-t-2xl">
          ${badge ? `<span class="absolute top-4 right-4 bg-webropol-gray-700 text-white text-xs px-3 py-1 rounded-full">${badge}</span>` : ''}
        </div>
      `;
    } else if (badge) {
      cardHtml += `
        <div class="relative">
          <span class="absolute top-4 right-4 bg-webropol-gray-700 text-white text-xs px-3 py-1 rounded-full">${badge}</span>
        </div>
      `;
    }
    
    // Content section
    cardHtml += '<div class="space-y-4">';
    
    // Header section
    if (title || subtitle) {
      cardHtml += '<div class="space-y-2">';
      
      if (title) {
        cardHtml += `<h3 class="text-lg font-semibold text-webropol-gray-900">${title}</h3>`;
      }
      
      if (subtitle) {
        cardHtml += `<p class="text-sm text-webropol-gray-600">${subtitle}</p>`;
      }
      
      cardHtml += '</div>';
    }
    
    // Main content
    if (content.trim()) {
      cardHtml += `<div class="card-content">${content}</div>`;
    }
    
    cardHtml += '</div></div>';
    
    this.innerHTML = cardHtml;
  }

  bindEvents() {
    if (this.getBoolAttr('clickable')) {
      const cardElement = this.querySelector('div[role="button"]');
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
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }
}

// Register the component
customElements.define('webropol-card', WebropolCard);
