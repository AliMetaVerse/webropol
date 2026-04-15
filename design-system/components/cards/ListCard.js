/**
 * Webropol List Card Component
 * Cards with list-style items and status indicators
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolListCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'items', 'mode', 'icon', 'subtitle', 'badge', 'href'];
  }

  render() {
    const mode = this.getAttr('mode', 'list'); // 'list' or 'single'
    
    if (mode === 'single') {
      this.renderSingleCard();
    } else {
      this.renderListCard();
    }
  }

  renderSingleCard() {
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const icon = this.getAttr('icon');
    const badge = this.getAttr('badge');
    const href = this.getAttr('href');

    if (this._singleExtraContent === undefined) {
      this._singleExtraContent = this.innerHTML.trim();
    }
    
    const wrapper = document.createElement(href ? 'a' : 'div');
    wrapper.className = 'list-card-wrapper group relative flex items-center overflow-hidden rounded-2xl border border-webropol-gray-200/90 bg-white/90 p-4 shadow-card transition-all duration-200 hover:border-webropol-primary-200 hover:shadow-medium hover:bg-white';
    wrapper.setAttribute('role', href ? 'link' : 'button');
    wrapper.setAttribute('tabindex', '0');
    
    if (href) {
      wrapper.href = href;
    }

    // Add subtle gradient background on hover
    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'pointer-events-none absolute inset-0 bg-gradient-to-r from-webropol-primary-50/0 to-webropol-gray-50/0 transition-all duration-300 group-hover:from-webropol-primary-50/70 group-hover:to-white';
    wrapper.appendChild(gradientOverlay);

    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex items-center space-x-4 w-full relative z-10';

    // Add icon
    if (icon) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-webropol-gray-100 text-webropol-gray-700 shadow-soft transition-all duration-200 group-hover:scale-105 group-hover:bg-webropol-primary-100 group-hover:text-webropol-primary-700';
      iconDiv.innerHTML = `<i class="fal fa-${icon} text-sm"></i>`;
      contentDiv.appendChild(iconDiv);
    }

    // Add text content
    const textDiv = document.createElement('div');
    textDiv.className = 'flex-grow min-w-0';
    
    let textHtml = '';
    if (title) {
      textHtml += `<h3 class="truncate text-sm font-semibold text-webropol-gray-900 transition-colors duration-200 group-hover:text-webropol-primary-700">${title}</h3>`;
    }
    if (subtitle) {
      textHtml += `<p class="truncate text-sm text-webropol-gray-600 transition-colors duration-200 group-hover:text-webropol-gray-700">${subtitle}</p>`;
    }
    
    textDiv.innerHTML = textHtml;
    contentDiv.appendChild(textDiv);

    // Add badge
    if (badge) {
      const badgeDiv = document.createElement('div');
      badgeDiv.className = 'flex-shrink-0';
      badgeDiv.innerHTML = this.renderBadgeMarkup(badge, 'neutral');
      contentDiv.appendChild(badgeDiv);
    }

    // Add original content if any
    if (this._singleExtraContent) {
      const originalContentDiv = document.createElement('div');
      originalContentDiv.className = 'flex-shrink-0 ml-4';
      originalContentDiv.innerHTML = this._singleExtraContent;
      contentDiv.appendChild(originalContentDiv);
    }

    // Add arrow indicator
    const arrowDiv = document.createElement('div');
    arrowDiv.className = 'flex-shrink-0 text-webropol-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-webropol-primary-700';
    arrowDiv.innerHTML = '<i class="fal fa-chevron-right text-sm"></i>';
    contentDiv.appendChild(arrowDiv);

    wrapper.appendChild(contentDiv);

    // Add click handler for single mode
    this.addListener(wrapper, 'click', (event) => {
      if (!href) {
        this.emit('webropol-list-card-click', {
          title,
          subtitle,
          originalEvent: event
        });
      }
    });

    // Clear and append wrapper
    this.innerHTML = '';
    this.appendChild(wrapper);
  }

  renderListCard() {
    const title = this.getAttr('title');
    const itemsData = this.getAttr('items');
    
    let items = [];
    if (itemsData) {
      try {
        items = JSON.parse(itemsData);
      } catch (e) {
        console.warn('Invalid items data format');
      }
    }

    this.innerHTML = `
      <div class="overflow-hidden rounded-2xl border border-webropol-gray-200/90 bg-white/95 shadow-card backdrop-blur-sm">
        ${title ? `
          <div class="border-b border-webropol-gray-200/90 bg-webropol-gray-50/80 px-6 py-4">
            <h3 class="text-lg font-semibold text-webropol-gray-900">${title}</h3>
          </div>
        ` : ''}
        
        <div class="divide-y divide-webropol-gray-100">
          ${items.map(item => `
            <div class="group relative flex cursor-pointer items-center justify-between overflow-hidden p-4 transition-all duration-200 hover:bg-webropol-primary-50/40"
                 data-item-id="${item.id || ''}" role="button" tabindex="0">
              
              <!-- Hover gradient overlay -->
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-webropol-primary-50/0 to-white transition-all duration-300 group-hover:from-webropol-primary-50/70"></div>
              
              <div class="flex items-center flex-1 min-w-0 relative z-10">
                ${item.icon ? `
                  <div class="mr-3 flex h-8 w-8 items-center justify-center rounded-xl border border-white/70 bg-webropol-gray-100 text-webropol-gray-700 shadow-soft transition-all duration-200 group-hover:scale-105 group-hover:bg-webropol-primary-100 group-hover:text-webropol-primary-700">
                    <i class="fal fa-${item.icon} text-xs"></i>
                  </div>
                ` : ''}
                
                <div class="flex-1 min-w-0">
                  <div class="truncate font-semibold text-webropol-gray-900 transition-colors duration-200 group-hover:text-webropol-primary-700">${item.name || item.title || ''}</div>
                  ${item.description ? `
                    <div class="truncate text-sm text-webropol-gray-600 transition-colors duration-200 group-hover:text-webropol-gray-700">${item.description}</div>
                  ` : ''}
                  ${item.meta ? `
                    <div class="mt-1 text-xs text-webropol-gray-500">${item.meta}</div>
                  ` : ''}
                </div>
              </div>
              
              <div class="flex items-center space-x-3 ml-4 relative z-10">
                ${item.answers ? `
                  <span class="flex items-center text-sm text-webropol-gray-600 transition-colors duration-200 group-hover:text-webropol-gray-700">
                    <i class="fal fa-paper-plane mr-1 text-webropol-primary-600"></i>
                    ${item.answers} answers
                  </span>
                ` : ''}
                
                ${item.status ? `
                  ${this.renderBadgeMarkup(item.status, this.getStatusVariant(item.status))}
                ` : ''}
                
                ${item.badge ? `
                  ${this.renderBadgeMarkup(item.badge, 'neutral')}
                ` : ''}
                
                <div class="text-webropol-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-webropol-primary-700">
                  <i class="fal fa-chevron-right text-sm"></i>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        ${items.length === 0 ? `
          <div class="p-8 text-center text-webropol-gray-500">
            <i class="fal fa-inbox text-2xl mb-2 block opacity-50"></i>
            <p>No items to display</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderBadgeMarkup(label, variant = 'neutral') {
    return `<span class="${this.classNames(
      'inline-flex items-center whitespace-nowrap rounded-md border border-white/50 font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]',
      this.getVariantClasses('badge', variant),
      this.getSizeClasses('badge', 'sm')
    )}">${label}</span>`;
  }

  getStatusVariant(status) {
    const statusVariants = {
      Open: 'success',
      Draft: 'warning',
      Closed: 'error',
      Active: 'primary',
      Answered: 'secondary'
    };
    return statusVariants[status] || 'neutral';
  }

  bindEvents() {
    const itemElements = this.querySelectorAll('[data-item-id]');
    itemElements.forEach(element => {
      this.addListener(element, 'click', (event) => {
        const itemId = event.currentTarget.dataset.itemId;
        this.handleItemClick(itemId, event);
      });

      this.addListener(element, 'keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const itemId = event.currentTarget.dataset.itemId;
          this.handleItemClick(itemId, event);
        }
      });
    });
  }

  handleItemClick(itemId, event) {
    this.emit('webropol-list-item-click', {
      itemId,
      originalEvent: event
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }

  // Public methods
  addItem(item) {
    const currentItems = this.getAttr('items');
    let items = [];
    try {
      items = currentItems ? JSON.parse(currentItems) : [];
    } catch (e) {
      items = [];
    }
    items.push(item);
    this.setAttribute('items', JSON.stringify(items));
  }

  removeItem(itemId) {
    const currentItems = this.getAttr('items');
    let items = [];
    try {
      items = currentItems ? JSON.parse(currentItems) : [];
    } catch (e) {
      items = [];
    }
    items = items.filter(item => item.id !== itemId);
    this.setAttribute('items', JSON.stringify(items));
  }
}

// Register the component
customElements.define('webropol-list-card', WebropolListCard);

