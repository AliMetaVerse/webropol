/**
 * Webropol Card Legacy Components
 * Complete card system with all sub-components from the original /components/cards.js
 * This provides backward compatibility while leveraging the BaseComponent architecture
 */

import { BaseComponent } from '../../utils/base-component.js';

// Main Card Component (Enhanced)
export class WebropolCardLegacy extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'gradient', 'hoverable', 'elevated'];
  }

  render() {
    const variant = this.getAttr('variant', 'standard');
    const gradient = this.getAttr('gradient');
    const hoverable = this.getBoolAttr('hoverable');
    const elevated = this.getBoolAttr('elevated');
    
    // Base card classes
    const baseClasses = this.classNames(
      'rounded-2xl border transition-all duration-200',
      hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '',
      elevated ? 'shadow-medium' : 'shadow-card'
    );

    // Variant classes
    const variantClasses = {
      standard: 'bg-white border-webropol-gray-200',
      light: 'bg-white/80 border-webropol-teal-100',
      gradient: gradient ? 
        `bg-gradient-to-br ${gradient} border-webropol-teal-100` : 
        'bg-gradient-to-br from-webropol-blue-50 to-webropol-teal-50/80 border-webropol-teal-100',
      glass: 'bg-white/70 backdrop-blur-xl border-webropol-gray-200/50'
    };

    this.innerHTML = `
      <div class="${baseClasses} ${variantClasses[variant]}">
        <slot></slot>
      </div>
    `;
  }

  bindEvents() {
    if (this.getBoolAttr('hoverable')) {
      this.addListener(this, 'click', (e) => {
        this.emit('card-click', { originalEvent: e });
      });
    }
  }
}

// Card Header Component
export class WebropolCardHeader extends BaseComponent {
  static get observedAttributes() {
    return ['icon', 'title', 'subtitle', 'badge', 'badge-variant'];
  }

  render() {
    const icon = this.getAttr('icon');
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const badge = this.getAttr('badge');
    const badgeVariant = this.getAttr('badge-variant', 'default');
    
    const badgeClasses = {
      default: 'bg-webropol-gray-700 text-white',
      primary: 'bg-webropol-teal-600 text-white',
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-600 text-white',
      danger: 'bg-red-600 text-white'
    };

    this.innerHTML = `
      <div class="flex items-start justify-between p-6 ${subtitle ? 'pb-4' : ''}">
        <div class="flex items-center space-x-4 flex-1">
          ${icon ? `<div class="flex-shrink-0">
            <i class="${icon} text-3xl text-webropol-teal-600"></i>
          </div>` : ''}
          <div class="flex-1 min-w-0">
            ${title ? `<h3 class="text-lg font-semibold text-webropol-gray-900 truncate">${title}</h3>` : ''}
            ${subtitle ? `<p class="text-sm text-webropol-gray-600 mt-1">${subtitle}</p>` : ''}
            <slot></slot>
          </div>
        </div>
        ${badge ? `<span class="text-xs px-3 py-1 rounded-full font-medium ${badgeClasses[badgeVariant]} flex-shrink-0">${badge}</span>` : ''}
      </div>
    `;
  }
}

// Card Content Component
export class WebropolCardContent extends BaseComponent {
  static get observedAttributes() {
    return ['padding'];
  }

  render() {
    const padding = this.getAttr('padding', 'normal');
    
    const paddingClasses = {
      none: '',
      sm: 'px-4 pb-4',
      normal: 'px-6 pb-6',
      lg: 'px-8 pb-8'
    };

    this.innerHTML = `
      <div class="${paddingClasses[padding]}">
        <slot></slot>
      </div>
    `;
  }
}

// Card List Component
export class WebropolCardList extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'collapsible', 'default-open'];
  }

  render() {
    const title = this.getAttr('title');
    const collapsible = this.getBoolAttr('collapsible');
    const defaultOpen = this.getBoolAttr('default-open') || !collapsible;
    
    this.innerHTML = `
      <div class="p-6" ${collapsible ? `x-data="{ open: ${defaultOpen} }"` : ''}>
        ${title ? `
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-webropol-gray-900">${title}</h3>
            ${collapsible ? `
              <button @click="open = !open" class="text-webropol-teal-600 hover:text-webropol-teal-700 transition-colors">
                <i class="fas fa-chevron-down transition-transform duration-200" :class="{ 'rotate-180': open }"></i>
              </button>
            ` : ''}
          </div>
        ` : ''}
        <div class="space-y-3" ${collapsible ? 'x-show="open" x-transition' : ''}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// Card List Item Component
export class WebropolCardListItem extends BaseComponent {
  static get observedAttributes() {
    return ['icon', 'title', 'subtitle', 'action', 'action-icon', 'status', 'clickable'];
  }

  render() {
    const icon = this.getAttr('icon');
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const action = this.getAttr('action');
    const actionIcon = this.getAttr('action-icon');
    const status = this.getAttr('status');
    const clickable = this.getBoolAttr('clickable');
    
    const statusClasses = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700'
    };

    this.innerHTML = `
      <div class="flex items-center justify-between p-4 rounded-xl bg-webropol-gray-50/50 hover:bg-webropol-gray-50 transition-colors ${clickable ? 'cursor-pointer hover:shadow-card' : ''}">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          ${icon ? `<i class="${icon} text-webropol-teal-600 text-lg flex-shrink-0"></i>` : ''}
          <div class="flex-1 min-w-0">
            ${title ? `<div class="font-medium text-webropol-gray-900 truncate">${title}</div>` : ''}
            ${subtitle ? `<div class="text-sm text-webropol-gray-600 truncate">${subtitle}</div>` : ''}
            <slot></slot>
          </div>
        </div>
        <div class="flex items-center space-x-3 flex-shrink-0">
          ${status ? `<span class="text-xs px-2 py-1 rounded-full font-medium ${statusClasses[status]}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>` : ''}
          ${action ? `<button class="text-webropol-teal-600 hover:text-webropol-teal-700 font-medium text-sm transition-colors">
            ${actionIcon ? `<i class="${actionIcon} mr-1"></i>` : ''}${action}
          </button>` : ''}
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }

  bindEvents() {
    if (this.getBoolAttr('clickable')) {
      this.addListener(this, 'click', (e) => {
        this.emit('list-item-click', { originalEvent: e });
      });
    }
  }
}

// Card Actions/Footer Component
export class WebropolCardActions extends BaseComponent {
  static get observedAttributes() {
    return ['alignment', 'padding'];
  }

  render() {
    const alignment = this.getAttr('alignment', 'right');
    const padding = this.getAttr('padding', 'normal');
    
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between'
    };
    
    const paddingClasses = {
      none: '',
      sm: 'px-4 pb-4 pt-2',
      normal: 'px-6 pb-6 pt-4',
      lg: 'px-8 pb-8 pt-6'
    };

    this.innerHTML = `
      <div class="flex items-center space-x-3 border-t border-webropol-gray-100 ${paddingClasses[padding]} ${alignmentClasses[alignment]}">
        <slot></slot>
      </div>
    `;
  }
}

// Gradient Card Component (Homepage style)
export class WebropolGradientCard extends BaseComponent {
  static get observedAttributes() {
    return ['icon', 'title', 'subtitle', 'button-text', 'button-href', 'link-text', 'link-href', 'badge', 'gradient'];
  }

  render() {
    const icon = this.getAttr('icon');
    const title = this.getAttr('title');
    const subtitle = this.getAttr('subtitle');
    const buttonText = this.getAttr('button-text');
    const buttonHref = this.getAttr('button-href');
    const linkText = this.getAttr('link-text');
    const linkHref = this.getAttr('link-href');
    const badge = this.getAttr('badge');
    const gradient = this.getAttr('gradient', 'from-webropol-blue-100 to-webropol-teal-100/80');
    
    this.innerHTML = `
      <div class="relative rounded-2xl bg-gradient-to-br ${gradient} p-6 flex flex-col items-center shadow-card border border-webropol-teal-100 transition-shadow duration-200 hover:shadow-2xl">
        ${badge ? `
          <span class="absolute top-4 right-4 bg-webropol-gray-700 text-white text-xs px-3 py-1 rounded-full">
            ${badge}
          </span>
        ` : ''}
        ${icon ? `<i class="${icon} text-4xl text-webropol-teal-600 mb-4"></i>` : ''}
        ${title ? `<div class="font-semibold text-lg text-webropol-gray-900 mb-2 text-center">${title}</div>` : ''}
        ${subtitle ? `<div class="text-sm text-webropol-gray-600 text-center mb-4">${subtitle}</div>` : ''}
        <slot></slot>
        ${buttonText ? `
          <webropol-button variant="primary" class="mt-2" ${buttonHref ? `href="${buttonHref}"` : ''}>
            ${buttonText}
          </webropol-button>
        ` : ''}
        ${linkText ? `
          <a href="${linkHref || '#'}" class="mt-2 text-webropol-teal-700 font-semibold hover:underline">${linkText}</a>
        ` : ''}
      </div>
    `;
  }
}

// Register all legacy card components (keeping original names for backward compatibility)
customElements.define('webropol-card-legacy', WebropolCardLegacy);
customElements.define('webropol-card-header', WebropolCardHeader);
customElements.define('webropol-card-content', WebropolCardContent);
customElements.define('webropol-card-list', WebropolCardList);
customElements.define('webropol-card-list-item', WebropolCardListItem);
customElements.define('webropol-card-actions', WebropolCardActions);
customElements.define('webropol-gradient-card', WebropolGradientCard);
