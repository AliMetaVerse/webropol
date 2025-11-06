/**
 * Webropol Brand Component
 * Renders the brand text: WEB(RO)POL with orange RO using design tokens
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolBrand extends BaseComponent {
  static get observedAttributes() {
    return ['simple', 'base'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name === 'simple' || name === 'base') && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const isSimple = this.hasAttribute('simple');
    const base = this.getAttr('base', '');
    
    // Always use logo image instead of text
    this.innerHTML = `
      <img src="${base}img/logo/logo.png" 
           alt="Webropol" 
           style="height: 32px; width: auto; display: block; object-fit: contain;" 
           class="webropol-brand-logo" />
    `;
  }
}

customElements.define('webropol-brand', WebropolBrand);

export default WebropolBrand;
