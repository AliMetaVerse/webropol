/**
 * Webropol Banner Component
 * Based on Figma Royal Design System — node 770:12471
 *
 * Usage:
 *   <webropol-banner
 *     heading="Software Updated"
 *     description="New features are now available."
 *     type="regular"            <!-- regular | outlined -->
 *     size="desktop"            <!-- desktop | tablet | mobile -->
 *     icon="fal fa-sparkles"
 *     primary-label="Learn more"
 *     primary-url="#"
 *     secondary-label="Dismiss"
 *     dismissible>
 *   </webropol-banner>
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolBanner extends BaseComponent {
    static get observedAttributes() {
        return [
            'heading',
            'description',
            'type',
            'size',
            'icon',
            'primary-label',
            'primary-url',
            'secondary-label',
            'dismissible',
            'show-icon',
            'show-actions',
        ];
    }

    init() {
        this._dismissed = false;
    }

    render() {
        if (this._dismissed) {
            this.style.display = 'none';
            return;
        }

        const heading     = this.getAttr('heading', 'Banner heading');
        const description = this.getAttr('description', '');
        const type        = this.getAttr('type', 'regular');          // regular | outlined
        const size        = this.getAttr('size', 'desktop');          // desktop | tablet | mobile
        const icon        = this.getAttr('icon', 'fal fa-sparkles');
        const primaryLabel   = this.getAttr('primary-label', '');
        const primaryUrl     = this.getAttr('primary-url', '#');
        const secondaryLabel = this.getAttr('secondary-label', '');
        const dismissible    = this.getBoolAttr('dismissible');
        const showIcon       = this.getAttr('show-icon', 'true') !== 'false';
        const showActions    = this.getAttr('show-actions', 'true') !== 'false';

        const isOutlined = type === 'outlined';
        const isMobile   = size === 'mobile';
        const isDesktop  = size === 'desktop';

        // Container classes — mirrors Figma exactly using project tokens
        const containerBase = 'relative flex gap-4 rounded-lg';
        const containerVariant = isOutlined
            ? 'border border-webropol-gray-300 bg-transparent'
            : 'bg-white shadow-card border border-webropol-gray-200';
        const containerPadding = isMobile ? 'p-4' : isDesktop ? 'p-6' : 'p-4';
        const containerDirection = isMobile ? 'flex-col' : 'flex-row items-start';

        // Icon sizes
        const iconBoxSize   = isMobile ? 'w-11 h-11 rounded-2xl' : isDesktop ? 'w-12 h-12 rounded-3xl' : 'w-11 h-11 rounded-2xl';
        const iconTextSize  = isMobile ? 'text-[20px]' : isDesktop ? 'text-[24px]' : 'text-[20px]';

        // Heading sizes — Figma uses Roboto Condensed Bold
        const headingSize = isMobile ? 'text-base font-bold' : 'text-[1.25rem] font-bold';

        // Description sizes
        const descSize = isMobile ? 'text-[13px]' : 'text-sm';

        const iconSection = showIcon ? `
            <div class="flex-shrink-0 ${iconBoxSize} bg-webropol-accent-100 flex items-center justify-center">
                <i class="${icon} ${iconTextSize} text-webropol-accent-600"></i>
            </div>` : '';

        const closeBtn = dismissible ? `
            <button type="button"
                    class="dismiss-btn absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-webropol-gray-100 text-webropol-gray-500 hover:text-webropol-gray-700 transition-colors"
                    aria-label="Dismiss banner">
                <i class="fal fa-xmark text-sm"></i>
            </button>` : '';

        const primaryBtn = primaryLabel ? `
            <a href="${primaryUrl}"
               class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-webropol-primary-700 bg-webropol-primary-50 text-webropol-primary-700 text-sm font-medium hover:bg-webropol-primary-100 transition-colors whitespace-nowrap">
                ${primaryLabel}
            </a>` : '';

        const secondaryBtn = secondaryLabel ? `
            <button type="button"
                    class="secondary-action inline-flex items-center justify-center px-4 py-2 rounded-full text-webropol-primary-700 text-sm font-medium hover:bg-webropol-primary-50 transition-colors whitespace-nowrap">
                ${secondaryLabel}
            </button>` : '';

        const actionsSection = showActions && (primaryLabel || secondaryLabel) ? `
            <div class="flex items-center gap-2 ${isMobile ? 'w-full flex-col' : 'justify-end'}">
                ${secondaryBtn}
                ${primaryBtn}
            </div>` : '';

        if (isMobile) {
            this.innerHTML = `
                <div class="${containerBase} ${containerVariant} ${containerPadding} ${containerDirection}">
                    ${closeBtn}
                    ${iconSection}
                    <div class="flex flex-col gap-1 flex-1 ${dismissible ? 'pr-10' : ''}">
                        <p class="${headingSize} text-webropol-gray-950 leading-6" style="font-family:'Roboto Condensed',sans-serif">${heading}</p>
                        ${description ? `<p class="${descSize} text-webropol-gray-950 leading-5">${description}</p>` : ''}
                    </div>
                    ${actionsSection}
                </div>`;
        } else {
            this.innerHTML = `
                <div class="${containerBase} ${containerVariant} ${containerPadding} ${containerDirection}">
                    ${closeBtn}
                    ${iconSection}
                    <div class="flex flex-col gap-2 flex-1 min-w-0 ${dismissible ? 'pr-10' : ''}">
                        <p class="${headingSize} text-webropol-gray-950 leading-6" style="font-family:'Roboto Condensed',sans-serif">${heading}</p>
                        ${description ? `<p class="${descSize} text-webropol-gray-950 leading-5">${description}</p>` : ''}
                        ${actionsSection}
                    </div>
                </div>`;
        }
    }

    bindEvents() {
        this.addEventListener('click', (e) => {
            if (e.target.closest('.dismiss-btn') || e.target.closest('.secondary-action')) {
                this._dismissed = true;
                const wrapper = this.querySelector('[class*="flex"]');
                if (wrapper) {
                    wrapper.style.transition = 'opacity 0.25s ease, max-height 0.35s ease';
                    wrapper.style.opacity = '0';
                    wrapper.style.overflow = 'hidden';
                    wrapper.style.maxHeight = wrapper.offsetHeight + 'px';
                    requestAnimationFrame(() => {
                        wrapper.style.maxHeight = '0';
                    });
                    setTimeout(() => {
                        this.style.display = 'none';
                        this.emit('banner-dismissed', {});
                    }, 380);
                } else {
                    this.style.display = 'none';
                    this.emit('banner-dismissed', {});
                }
            }
        });
    }
}

customElements.define('webropol-banner', WebropolBanner);
