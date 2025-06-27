/**
 * Webropol List Card Component
 * Cards with list-style items and status indicators
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolListCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'items'];
  }

  render() {
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
      <div class="bg-white rounded-2xl shadow-card border border-webropol-gray-200 overflow-hidden">
        ${title ? `
          <div class="px-6 py-4 border-b border-webropol-gray-200 bg-webropol-gray-50">
            <h3 class="text-lg font-semibold text-webropol-gray-900">${title}</h3>
          </div>
        ` : ''}
        
        <div class="divide-y divide-webropol-gray-100">
          ${items.map(item => `
            <div class="flex items-center justify-between p-4 hover:bg-webropol-gray-50 transition-colors duration-150 cursor-pointer group"
                 data-item-id="${item.id || ''}" role="button" tabindex="0">
              
              <div class="flex items-center flex-1 min-w-0">
                ${item.icon ? `
                  <div class="w-8 h-8 mr-3 flex items-center justify-center">
                    <i class="fas fa-${item.icon} text-webropol-teal-600"></i>
                  </div>
                ` : ''}
                
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-webropol-gray-900 truncate">${item.name || item.title || ''}</div>
                  ${item.description ? `
                    <div class="text-sm text-webropol-gray-500 truncate">${item.description}</div>
                  ` : ''}
                  ${item.meta ? `
                    <div class="text-xs text-webropol-gray-400 mt-1">${item.meta}</div>
                  ` : ''}
                </div>
              </div>
              
              <div class="flex items-center space-x-3 ml-4">
                ${item.answers ? `
                  <span class="flex items-center text-sm text-webropol-gray-600">
                    <i class="fas fa-paper-plane text-webropol-teal-600 mr-1"></i>
                    ${item.answers} answers
                  </span>
                ` : ''}
                
                ${item.status ? `
                  <span class="px-3 py-1 rounded-full text-xs font-medium ${this.getStatusClasses(item.status)}">
                    ${item.status}
                  </span>
                ` : ''}
                
                ${item.badge ? `
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-webropol-gray-700 text-white">
                    ${item.badge}
                  </span>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        
        ${items.length === 0 ? `
          <div class="p-8 text-center text-webropol-gray-500">
            <i class="fas fa-inbox text-2xl mb-2 block"></i>
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
