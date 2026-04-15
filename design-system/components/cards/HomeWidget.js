import { BaseComponent } from '../../utils/base-component.js';

export class WebropolHomeWidget extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'icon', 'tone'];
  }

  render() {
    const title = this.getAttr('title');
    const icon = this.getAttr('icon', 'grid-2');
    const tone = this.getAttr('tone', 'primary');

    const existingSlot = this.querySelector('.home-widget-slot');
    const contentNodes = existingSlot ? Array.from(existingSlot.childNodes) : Array.from(this.childNodes);

    const tones = {
      primary: {
        shell: 'bg-white/95 border border-webropol-gray-200/90 shadow-card',
        icon: 'border border-white/70 bg-webropol-primary-100 text-webropol-primary-700 shadow-soft',
        ring: 'ring-webropol-primary-100/80'
      },
      success: {
        shell: 'bg-white/95 border border-webropol-gray-200/90 shadow-card',
        icon: 'border border-white/70 bg-webropol-green-100 text-webropol-green-700 shadow-soft',
        ring: 'ring-webropol-green-100/80'
      },
      accent: {
        shell: 'bg-white/95 border border-webropol-gray-200/90 shadow-card',
        icon: 'border border-white/70 bg-webropol-orange-100 text-webropol-orange-700 shadow-soft',
        ring: 'ring-webropol-orange-100/80'
      },
      royal: {
        shell: 'bg-white/95 border border-webropol-gray-200/90 shadow-card',
        icon: 'border border-white/70 bg-webropol-royalViolet-100 text-webropol-royalViolet-700 shadow-soft',
        ring: 'ring-webropol-royalViolet-100/80'
      },
      neutral: {
        shell: 'bg-white/95 border border-webropol-gray-200/90 shadow-card',
        icon: 'border border-white/70 bg-webropol-gray-100 text-webropol-gray-700 shadow-soft',
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
    header.className = 'mb-5 flex items-center gap-3';
    header.innerHTML = `
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl ${palette.icon}">
        <i class="fal fa-${icon} text-lg"></i>
      </div>
      <div class="min-w-0 flex-1">
        ${title ? `<h2 class="text-xl font-bold text-webropol-gray-900 md:text-2xl">${title}</h2>` : ''}
      </div>
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