import { BaseComponent } from '../../utils/base-component.js';

/**
 * WebropolAccordion - Customizable accordion component
 * 
 * @element webropol-accordion
 * 
 * @attr {string} title - Main accordion title (required)
 * @attr {string} subtitle - Optional subtitle text
 * @attr {boolean} expanded - Initial expanded state (default: false)
 * @attr {string} variant - Visual style variant (default: 'default')
 *   - 'default': White background with border
 *   - 'elevated': White background with shadow
 *   - 'minimal': Transparent background, bottom border only
 * @attr {boolean} show-icon - Show left icon (default: false)
 * @attr {string} icon - FontAwesome icon class (e.g., 'fa-light fa-heart')
 * @attr {string} icon-color - Icon color class (default: 'text-webropol-primary-500')
 * @attr {string} badge-label - Optional badge text
 * @attr {string} badge-variant - Badge color variant (default: 'primary')
 *   - 'primary': Cyan/teal
 *   - 'danger': Red
 *   - 'success': Green
 *   - 'warning': Yellow
 * 
 * @slot default - Accordion body content
 * @slot header-actions - Custom action buttons in header (before chevron)
 * 
 * @fires accordion-toggle - Emitted when accordion is toggled
 *   detail: { expanded: boolean, title: string }
 * 
 * @example
 * <webropol-accordion title="Rule Group 1" subtitle="3 conditions • 2 actions" show-icon icon="fa-light fa-layer-group">
 *   <div slot="header-actions">
 *     <button class="btn-edit">Edit</button>
 *     <button class="btn-delete">Delete</button>
 *   </div>
 *   <div class="content">Body content here</div>
 * </webropol-accordion>
 */
export class WebropolAccordion extends BaseComponent {
  static get observedAttributes() {
    return [
      'title',
      'subtitle',
      'expanded',
      'variant',
      'show-icon',
      'icon',
      'icon-color',
      'badge-label',
      'badge-variant'
    ];
  }

  init() {
    this.state = {
      isExpanded: this.getBoolAttr('expanded')
    };
  }

  render() {
    const title = this.getAttr('title', 'Accordion Title');
    const subtitle = this.getAttr('subtitle', '');
    const variant = this.getAttr('variant', 'default');
    const showIcon = this.getBoolAttr('show-icon');
    const icon = this.getAttr('icon', 'fa-light fa-layer-group');
    const iconColor = this.getAttr('icon-color', 'text-webropol-primary-500');
    const badgeLabel = this.getAttr('badge-label', '');
    const badgeVariant = this.getAttr('badge-variant', 'primary');

    const containerClass = this.getVariantClass(variant);
    const badgeClass = this.getBadgeClass(badgeVariant);

    this.innerHTML = `
      <div class="${containerClass}">
        <!-- Accordion Header -->
        <div class="accordion-header">
          <div class="flex items-start justify-between gap-4">
            <!-- Left: Icon + Title/Subtitle -->
            <div class="flex items-start gap-3 flex-1 min-w-0">
              ${showIcon ? `
                <div class="accordion-icon mt-1">
                  <div class="w-10 h-10 rounded-lg bg-webropol-primary-50 flex items-center justify-center flex-shrink-0">
                    <i class="${icon} ${iconColor}"></i>
                  </div>
                </div>
              ` : ''}
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="accordion-title text-webropol-gray-900 font-bold text-lg tracking-tight">
                    ${title}
                  </h3>
                  ${badgeLabel ? `
                    <span class="${badgeClass}">
                      ${badgeLabel}
                    </span>
                  ` : ''}
                </div>
                ${subtitle ? `
                  <p class="accordion-subtitle text-sm text-webropol-gray-600 mt-1">
                    ${subtitle}
                  </p>
                ` : ''}
              </div>
            </div>

            <!-- Right: Action Buttons + Chevron -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <slot name="header-actions"></slot>
              <button class="accordion-toggle" aria-label="Toggle accordion">
                <i class="fa-solid fa-chevron-down text-lg text-webropol-primary-600 transition-transform duration-200 ${this.state.isExpanded ? 'rotate-180' : ''}"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Accordion Body -->
        <div class="accordion-body ${this.state.isExpanded ? 'expanded' : ''}">
          <div class="accordion-body-content">
            <slot></slot>
          </div>
        </div>
      </div>

      <style>
        .accordion-header {
          cursor: default;
        }

        .accordion-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .accordion-toggle:hover {
          background: rgb(240 253 255 / 1); /* webropol-primary-50 */
          color: rgb(14 116 144 / 1); /* webropol-primary-700 */
        }

        .accordion-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .accordion-body.expanded {
          max-height: 2000px;
          transition: max-height 0.5s ease-in;
        }

        .accordion-body-content {
          padding-top: 1.25rem;
          border-top: 1px solid rgb(226 232 240 / 1); /* webropol-gray-200 */
          margin-top: 1.25rem;
        }
      </style>
    `;
  }

  getVariantClass(variant) {
    const variants = {
      default: 'bg-white border border-webropol-gray-200 rounded-xl p-6 transition-shadow hover:shadow-md',
      elevated: 'bg-white rounded-xl p-6 shadow-card hover:shadow-medium transition-shadow',
      minimal: 'bg-transparent border-b border-webropol-gray-200 pb-4 mb-4'
    };
    return variants[variant] || variants.default;
  }

  getBadgeClass(variant) {
    const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';
    const variants = {
      primary: 'bg-webropol-primary-100 text-webropol-primary-700 border border-webropol-primary-200',
      danger: 'bg-red-100 text-red-700 border border-red-200',
      success: 'bg-green-100 text-green-700 border border-green-200',
      warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    };
    return `${baseClass} ${variants[variant] || variants.primary}`;
  }

  bindEvents() {
    const toggleBtn = this.querySelector('.accordion-toggle');
    const body = this.querySelector('.accordion-body');
    const chevron = toggleBtn?.querySelector('i');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.state.isExpanded = !this.state.isExpanded;
        
        // Update classes
        body?.classList.toggle('expanded');
        chevron?.classList.toggle('rotate-180');

        // Emit event
        this.emit('accordion-toggle', {
          expanded: this.state.isExpanded,
          title: this.getAttr('title', '')
        });
      });
    }
  }
}

customElements.define('webropol-accordion', WebropolAccordion);
