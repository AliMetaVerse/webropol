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

    // Store original content nodes
    const originalNodes = Array.from(this.childNodes);
    
    const wrapper = document.createElement(href ? 'a' : 'div');
    wrapper.className = 'list-card-wrapper group flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-gray-300/50 hover:bg-white transition-all duration-200 cursor-pointer relative overflow-hidden';
    wrapper.setAttribute('role', href ? 'link' : 'button');
    wrapper.setAttribute('tabindex', '0');
    
    if (href) {
      wrapper.href = href;
    }

    // Add subtle gradient background on hover
    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'absolute inset-0 bg-gradient-to-r from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-300 pointer-events-none';
    wrapper.appendChild(gradientOverlay);

    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex items-center space-x-4 w-full relative z-10';

    // Add icon
    if (icon) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'flex-shrink-0 w-10 h-10 bg-sun-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200';
      iconDiv.innerHTML = `<i class="fal fa-${icon} text-white text-sm"></i>`;
      contentDiv.appendChild(iconDiv);
    }

    // Add text content
    const textDiv = document.createElement('div');
    textDiv.className = 'flex-grow min-w-0';
    
    let textHtml = '';
    if (title) {
      textHtml += `<h3 class="font-medium text-gray-900 group-hover:text-blue-900 transition-colors duration-200 truncate">${title}</h3>`;
    }
    if (subtitle) {
      textHtml += `<p class="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">${subtitle}</p>`;
    }
    
    textDiv.innerHTML = textHtml;
    contentDiv.appendChild(textDiv);

    // Add badge
    if (badge) {
      const badgeDiv = document.createElement('div');
      badgeDiv.className = 'flex-shrink-0';
      badgeDiv.innerHTML = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group-hover:bg-blue-200 transition-colors duration-200">${badge}</span>`;
      contentDiv.appendChild(badgeDiv);
    }

    // Add original content if any
    if (originalNodes.some(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()))) {
      const originalContentDiv = document.createElement('div');
      originalContentDiv.className = 'flex-shrink-0 ml-4';
      originalNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          originalContentDiv.appendChild(node);
        }
      });
      contentDiv.appendChild(originalContentDiv);
    }

    // Add arrow indicator
    const arrowDiv = document.createElement('div');
    arrowDiv.className = 'flex-shrink-0 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200';
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
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        ${title ? `
          <div class="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
          </div>
        ` : ''}
        
        <div class="divide-y divide-gray-100/50">
          ${items.map(item => `
            <div class="flex items-center justify-between p-4 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                 data-item-id="${item.id || ''}" role="button" tabindex="0">
              
              <!-- Hover gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-300 pointer-events-none"></div>
              
              <div class="flex items-center flex-1 min-w-0 relative z-10">
                ${item.icon ? `
                  <div class="w-8 h-8 mr-3 flex items-center justify-center bg-sun-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
                    <i class="fal fa-${item.icon} text-white text-xs"></i>
                  </div>
                ` : ''}
                
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 group-hover:text-blue-900 transition-colors duration-200 truncate">${item.name || item.title || ''}</div>
                  ${item.description ? `
                    <div class="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">${item.description}</div>
                  ` : ''}
                  ${item.meta ? `
                    <div class="text-xs text-gray-500 mt-1">${item.meta}</div>
                  ` : ''}
                </div>
              </div>
              
              <div class="flex items-center space-x-3 ml-4 relative z-10">
                ${item.answers ? `
                  <span class="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                    <i class="fal fa-paper-plane text-blue-600 mr-1"></i>
                    ${item.answers} answers
                  </span>
                ` : ''}
                
                ${item.status ? `
                  <span class="px-3 py-1 rounded-full text-xs font-medium ${this.getStatusClasses(item.status)}">
                    ${item.status}
                  </span>
                ` : ''}
                
                ${item.badge ? `
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-white">
                    ${item.badge}
                  </span>
                ` : ''}
                
                <div class="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200">
                  <i class="fal fa-chevron-right text-sm"></i>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        ${items.length === 0 ? `
          <div class="p-8 text-center text-gray-500">
            <i class="fal fa-inbox text-2xl mb-2 block opacity-50"></i>
            <p>No items to display</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  getStatusClasses(status) {
    const statusClasses = {
      'Open': 'bg-green-100 text-green-700',
      'Draft': 'bg-yellow-100 text-yellow-700',
      'Closed': 'bg-red-100 text-red-700',
      'Active': 'bg-blue-100 text-blue-700',
      'Answered': 'bg-webropol-teal-100 text-webropol-teal-700'
    };
    return statusClasses[status] || 'bg-webropol-gray-100 text-webropol-gray-700';
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

