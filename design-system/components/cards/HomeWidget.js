import { BaseComponent } from '../../utils/base-component.js';

export class WebropolHomeWidget extends BaseComponent {
  static get observedAttributes() {
    return ['eyebrow', 'title', 'description', 'icon', 'tone', 'action-label', 'action-href'];
  }

  render() {
    const eyebrow = this.getAttr('eyebrow');
    const title = this.getAttr('title');
    const description = this.getAttr('description');
    const icon = this.getAttr('icon', 'grid-2');
    const tone = this.getAttr('tone', 'primary');
    const actionLabel = this.getAttr('action-label');
    const actionHref = this.getAttr('action-href');

    const existingSlot = this.querySelector('.home-widget-slot');
    const contentNodes = existingSlot ? Array.from(existingSlot.childNodes) : Array.from(this.childNodes);

    const tones = {
      primary: {
        shell: 'bg-white/95 border border-webropol-gray-200 shadow-card',
        icon: 'bg-webropol-primary-100 text-webropol-primary-700',
        eyebrow: 'text-webropol-primary-700',
        ring: 'ring-webropol-primary-100/80'
      },
      success: {
        shell: 'bg-white/95 border border-webropol-gray-200 shadow-card',
        icon: 'bg-webropol-green-100 text-webropol-green-700',
        eyebrow: 'text-webropol-green-700',
        ring: 'ring-webropol-green-100/80'
      },
      accent: {
        shell: 'bg-white/95 border border-webropol-gray-200 shadow-card',
        icon: 'bg-webropol-orange-100 text-webropol-orange-700',
        eyebrow: 'text-webropol-orange-700',
        ring: 'ring-webropol-orange-100/80'
      },
      royal: {
        shell: 'bg-white/95 border border-webropol-gray-200 shadow-card',
        icon: 'bg-webropol-royalViolet-100 text-webropol-royalViolet-700',
        eyebrow: 'text-webropol-royalViolet-700',
        ring: 'ring-webropol-royalViolet-100/80'
      },
      neutral: {
        shell: 'bg-white/95 border border-webropol-gray-200 shadow-card',
        icon: 'bg-webropol-gray-100 text-webropol-gray-700',
        eyebrow: 'text-webropol-gray-600',
        ring: 'ring-webropol-gray-100'
      }
    };

    const palette = tones[tone] || tones.primary;
    const wrapper = document.createElement('section');
    wrapper.className = this.classNames(
      'home-widget rounded-3xl p-6 md:p-7 ring-1 backdrop-blur-sm transition-shadow duration-200 hover:shadow-medium',
      palette.shell,
      palette.ring
    );

    const header = document.createElement('div');
    header.className = 'mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between';
    header.innerHTML = `
      <div class="min-w-0">
        <div class="mb-3 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl ${palette.icon}">
            <i class="fal fa-${icon} text-lg"></i>
          </div>
          <div class="min-w-0">
            ${eyebrow ? `<p class="text-xs font-semibold uppercase tracking-[0.24em] ${palette.eyebrow}">${eyebrow}</p>` : ''}
            ${title ? `<h2 class="text-xl font-bold text-webropol-gray-900 md:text-2xl">${title}</h2>` : ''}
          </div>
        </div>
        ${description ? `<p class="max-w-2xl text-sm leading-6 text-webropol-gray-600">${description}</p>` : ''}
      </div>
      ${actionLabel ? `
        <div class="shrink-0">
          <a href="${actionHref || '#'}" class="inline-flex items-center gap-2 rounded-full border border-webropol-gray-200 bg-white px-4 py-2 text-sm font-medium text-webropol-gray-700 transition-colors hover:border-webropol-primary-300 hover:text-webropol-primary-700">
            ${actionLabel}
            <i class="fal fa-arrow-right text-xs"></i>
          </a>
        </div>
      ` : ''}
    `;

    const content = document.createElement('div');
    content.className = 'home-widget-slot space-y-3';
    contentNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        content.appendChild(node);
      }
    });

    wrapper.appendChild(header);
    wrapper.appendChild(content);

    this.innerHTML = '';
    this.appendChild(wrapper);
  }
}

if (!customElements.get('webropol-home-widget')) {
  customElements.define('webropol-home-widget', WebropolHomeWidget);
}