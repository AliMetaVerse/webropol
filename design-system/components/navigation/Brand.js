/**
 * Webropol Brand Component
 * Renders the brand text: WEB(RO)POL with orange RO using design tokens
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolBrand extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  render() {
    // Keep styling inherited from the host element's classes
    this.innerHTML = `
      <span class="webropol-brand-text inline-block">
        <span>WEB</span>
        <span class="webropol-brand-ro" style="color: var(--accent-500)">RO</span>
        <span>POL</span>
      </span>
    `;
  }
}

customElements.define('webropol-brand', WebropolBrand);

export default WebropolBrand;
