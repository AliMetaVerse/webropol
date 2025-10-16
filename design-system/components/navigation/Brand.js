/**
 * Webropol Brand Component
 * Renders the brand text: WEB(RO)POL with orange RO using design tokens
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolBrand extends BaseComponent {
  static get observedAttributes() {
    return ['simple'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'simple' && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const isSimple = this.hasAttribute('simple');
    
    if (isSimple) {
      // Simple mode: just "Webropol" without rotation
      this.innerHTML = `
        <span class="webropol-brand-text" style="display:inline-flex; align-items:center; line-height:1;">
          <span style="font-size: 1em; line-height:1;">WEB</span>
          <span class="webropol-brand-ro" style="
            color: var(--accent-500, #ff6429);
            font-size: 1em;
            line-height:1;
          ">RO</span>
          <span style="font-size: 1em; line-height:1;">POL</span>
        </span>
      `;
    } else {
      // Original mode with rotation
      this.innerHTML = `
        <span class="webropol-brand-text" style="display:inline-flex; align-items:center; line-height:1;">
          <span style="font-size: 1.22em; line-height:1;">WEB</span>
          <span class="webropol-brand-ro" style="
            color: var(--accent-500, #ff6429);
            display: inline-flex;
            transform: rotate(-90deg);
            transform-origin: center center;
            line-height: 1;
            font-size: 0.5em;
            margin: 0 -3px;
            padding: 0;
          ">RO</span>
          <span style="font-size: 1.22em; line-height:1;">POL</span>
        </span>
      `;
    }
  }
}

customElements.define('webropol-brand', WebropolBrand);

export default WebropolBrand;
