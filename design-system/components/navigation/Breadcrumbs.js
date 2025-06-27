/**
 * Webropol Breadcrumbs Component
 * Navigation breadcrumbs with flexible trail support
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolBreadcrumbs extends BaseComponent {
  static get observedAttributes() {
    return ['trail'];
  }

  render() {
    let trail = [];
    try {
      const trailAttr = this.getAttr('trail');
      if (trailAttr) {
        trail = JSON.parse(trailAttr) || [];
      }
    } catch {
      // fallback: allow comma-separated string: Home,/index.html,Surveys,/surveys.html
      const str = this.getAttr('trail', '');
      if (str.includes(',')) {
        const arr = str.split(',');
        for (let i = 0; i < arr.length; i += 2) {
          trail.push({ label: arr[i], url: arr[i + 1] || null });
        }
      }
    }

    if (!trail.length) {
      this.style.display = 'none';
      return (this.innerHTML = '');
    }

    this.style.display = '';
    this.innerHTML = `
      <nav class="flex items-center text-sm text-webropol-gray-500 py-4 px-4 sm:px-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          ${trail
            .map((item, i) =>
              i < trail.length - 1
                ? `<li><a href="${item.url}" class="hover:text-webropol-teal-600 font-medium transition-colors">${item.label}</a><span class="mx-2 text-webropol-gray-400">/</span></li>`
                : `<li class="text-webropol-gray-900 font-semibold">${item.label}</li>`
            )
            .join('')}
        </ol>
      </nav>
    `;
  }

  bindEvents() {
    const links = this.querySelectorAll('a[href]');
    links.forEach(link => {
      this.addListener(link, 'click', (e) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        this.emit('breadcrumb-click', { href, text, originalEvent: e });
      });
    });
  }

  // Public method to update trail programmatically
  updateTrail(newTrail) {
    if (Array.isArray(newTrail)) {
      this.setAttribute('trail', JSON.stringify(newTrail));
    }
  }

  // Public method to add a breadcrumb
  addBreadcrumb(label, url = null) {
    try {
      const currentTrail = JSON.parse(this.getAttr('trail', '[]'));
      currentTrail.push({ label, url });
      this.updateTrail(currentTrail);
    } catch {
      this.updateTrail([{ label, url }]);
    }
  }
}

// Register the component
customElements.define('webropol-breadcrumbs', WebropolBreadcrumbs);
