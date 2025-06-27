/**
 * Webropol Configurable Card Component
 * Expandable card with configurable content, details, and actions
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolConfigurableCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'subtitle', 'status', 'icon', 'expandable', 'badge', 'actions'];
  }

  constructor() {
    super();
    this.isExpanded = false;
  }

  render() {
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const status = this.getAttr('status');
    const icon = this.getAttr('icon');
    const expandable = this.getAttribute('expandable') !== null;
    const badge = this.getAttr('badge');
    const actions = this.getAttr('actions');

    // Status color mapping
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'draft': 'bg-gray-100 text-gray-800',
      'completed': 'bg-blue-100 text-blue-800',
      'error': 'bg-red-100 text-red-800'
    };

    this.innerHTML = `
      <div class="bg-white rounded-2xl shadow-card border border-webropol-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <!-- Header -->
        <div class="p-6 ${expandable ? 'cursor-pointer' : ''}" ${expandable ? 'data-expand-trigger' : ''}>
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              ${icon ? `
                <div class="w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-${icon} text-white text-lg"></i>
                </div>
              ` : ''}
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-webropol-gray-900 truncate">${title || 'Configurable Card'}</h3>
                  ${badge ? `
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-webropol-teal-100 text-webropol-teal-800">
                      ${badge}
                    </span>
                  ` : ''}
                </div>
                
                ${subtitle ? `
                  <p class="text-sm text-webropol-gray-600 mb-2">${subtitle}</p>
                ` : ''}
                
                ${status ? `
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.draft}">
                      ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              ${expandable ? `
                <button class="w-8 h-8 flex items-center justify-center text-webropol-gray-400 hover:text-webropol-gray-600 transition-colors expand-button">
                  <i class="fas fa-chevron-down text-sm transition-transform duration-200"></i>
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Expandable Content -->
        ${expandable ? `
          <div class="expandable-content overflow-hidden transition-all duration-300" style="max-height: 0;">
            <div class="px-6 pb-6 border-t border-webropol-gray-100">
              <div class="pt-4">
                <div class="configurable-details">
                  <slot name="details">
                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-webropol-gray-600">Created:</span>
                        <span class="text-sm font-medium text-webropol-gray-900">2 days ago</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-webropol-gray-600">Modified:</span>
                        <span class="text-sm font-medium text-webropol-gray-900">1 hour ago</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-webropol-gray-600">Size:</span>
                        <span class="text-sm font-medium text-webropol-gray-900">2.4 MB</span>
                      </div>
                    </div>
                  </slot>
                </div>
                
                ${actions ? `
                  <div class="mt-4 pt-4 border-t border-webropol-gray-100">
                    <div class="flex flex-wrap gap-2 configurable-actions">
                      <slot name="actions">
                        <button class="px-3 py-1.5 text-sm font-medium text-webropol-teal-600 bg-webropol-teal-50 rounded-lg hover:bg-webropol-teal-100 transition-colors">
                          Edit
                        </button>
                        <button class="px-3 py-1.5 text-sm font-medium text-webropol-gray-600 bg-webropol-gray-50 rounded-lg hover:bg-webropol-gray-100 transition-colors">
                          Share
                        </button>
                        <button class="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                          Delete
                        </button>
                      </slot>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Non-expandable content -->
        ${!expandable ? `
          <div class="configurable-content px-6 pb-6">
            <slot></slot>
          </div>
        ` : ''}
      </div>
    `;

    // Add event listeners for expandable functionality
    if (expandable) {
      this.addExpandableListeners();
    }
  }

  addExpandableListeners() {
    const trigger = this.querySelector('[data-expand-trigger]');
    const expandButton = this.querySelector('.expand-button');
    const content = this.querySelector('.expandable-content');
    const chevron = this.querySelector('.expand-button i');

    const toggleExpand = () => {
      this.isExpanded = !this.isExpanded;
      
      if (this.isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        chevron?.classList.add('rotate-180');
        this.setAttribute('aria-expanded', 'true');
      } else {
        content.style.maxHeight = '0';
        chevron?.classList.remove('rotate-180');
        this.setAttribute('aria-expanded', 'false');
      }
    };

    trigger?.addEventListener('click', toggleExpand);
    expandButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleExpand();
    });

    // Keyboard support
    trigger?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpand();
      }
    });
  }
}

customElements.define('webropol-configurable-card', WebropolConfigurableCard);
