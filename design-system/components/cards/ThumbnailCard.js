/**
 * Webropol ThumbnailCard Component
 * A selectable thumbnail card for templates, images, and previews with selection states
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolThumbnailCard extends BaseComponent {
  static get observedAttributes() {
    return ['selected', 'title', 'image', 'preview-bars', 'disabled', 'variant'];
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
    const selected = this.getBoolAttr('selected');
    const title = this.getAttr('title');
    const image = this.getAttr('image');
    const previewBars = this.getAttr('preview-bars', '60,40,50'); // Default bar widths
    const disabled = this.getBoolAttr('disabled');
    const variant = this.getAttr('variant', 'default');

    // Parse preview bars
    const barWidths = previewBars.split(',').map(w => parseInt(w.trim()));

    // Base classes
    const baseClasses = this.classNames(
      'thumbnail-card relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200',
      'bg-white border-2 shadow-card',
      selected ? 'selected border-webropol-primary-500 shadow-lg' : 'border-webropol-gray-200',
      disabled ? 'disabled opacity-50 cursor-not-allowed' : 'hover:border-webropol-gray-300 hover:shadow-medium hover:-translate-y-0.5',
      'focus-within:outline-none focus-within:ring-4 focus-within:ring-webropol-primary-200'
    );

    this.innerHTML = `
      <div class="${baseClasses}" role="button" tabindex="0" aria-pressed="${selected}">
        <!-- Thumbnail Content Area -->
        <div class="thumbnail-content h-32 relative overflow-hidden">
          ${image ? `
            <!-- Image Background -->
            <div class="absolute inset-0 bg-cover bg-center bg-webropol-gray-100" 
                 style="background-image: url('${image}')">
            </div>
          ` : `
            <!-- Gradient Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-webropol-gray-50 to-webropol-gray-200"></div>
          `}
          
          <!-- Preview Content -->
          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 w-full">
              <div class="space-y-2">
                ${barWidths.map(width => `
                  <div class="h-1.5 bg-webropol-gray-700 rounded-full" style="width: ${width}%"></div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Selection Indicator -->
          <div class="selection-indicator absolute top-2 right-2 w-5 h-5 rounded-full bg-webropol-primary-500 flex items-center justify-center transition-all duration-200 ${selected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}">
            <i class="fas fa-check text-white text-xs"></i>
          </div>
        </div>

        <!-- Title -->
        ${title ? `
          <div class="p-3 bg-white border-t border-webropol-gray-100">
            <p class="text-sm font-medium text-webropol-gray-900 text-center truncate">${title}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  bindEvents() {
    const card = this.querySelector('.thumbnail-card');
    if (card && !this.getBoolAttr('disabled')) {
      this.addListener(card, 'click', this.handleClick.bind(this));
      this.addListener(card, 'keydown', this.handleKeydown.bind(this));
    }
  }

  handleClick(event) {
    if (this.getBoolAttr('disabled')) return;

    const wasSelected = this.getBoolAttr('selected');
    this.setAttribute('selected', (!wasSelected).toString());

    this.emit('webropol-thumbnail-select', {
      selected: !wasSelected,
      title: this.getAttr('title'),
      image: this.getAttr('image'),
      originalEvent: event
    });
  }

  handleKeydown(event) {
    if (this.getBoolAttr('disabled')) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(event);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.hasRendered) {
      if (name === 'selected') {
        this.updateSelectionState();
      } else {
        // Re-render for other attribute changes
        this.hasRendered = false;
        this.render();
        this.bindEvents();
        this.hasRendered = true;
      }
    }
  }

  updateSelectionState() {
    const card = this.querySelector('.thumbnail-card');
    const indicator = this.querySelector('.selection-indicator');
    const selected = this.getBoolAttr('selected');

    if (card && indicator) {
      if (selected) {
        card.classList.add('selected', 'border-webropol-primary-500', 'shadow-lg');
        card.classList.remove('border-webropol-gray-200');
        indicator.classList.add('opacity-100', 'scale-100');
        indicator.classList.remove('opacity-0', 'scale-75');
      } else {
        card.classList.remove('selected', 'border-webropol-primary-500', 'shadow-lg');
        card.classList.add('border-webropol-gray-200');
        indicator.classList.remove('opacity-100', 'scale-100');
        indicator.classList.add('opacity-0', 'scale-75');
      }
      card.setAttribute('aria-pressed', selected.toString());
    }
  }
}

// Register the component
customElements.define('webropol-thumbnail-card', WebropolThumbnailCard);