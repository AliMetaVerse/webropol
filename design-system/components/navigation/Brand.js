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
  <span style="font-size: 1.22em;">WEB</span>
        <span class="webropol-brand-ro" style="
          color: var(--accent-500);
          display: inline-flex;
          transform: rotate(-90deg);
          transform-origin: center center;
          line-height: 1;
          font-size: 0.7em;
          margin: -5px -2px 0px -8px;
          padding-top: 9px;
        ">RO</span>
  <span style="font-size: 1.22em;">POL</span>
      </span>
    `;
  }
}

customElements.define('webropol-brand', WebropolBrand);

export default WebropolBrand;
