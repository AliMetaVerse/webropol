/**
 * Webropol Checkbox Component
 *
 * Attributes:
 *   value    – string (passed in name/value form submission)
 *   label    – string (visible label text, optional)
 *   checked  – boolean
 *   disabled – boolean
 *   size     – 'sm' | 'md' | 'lg'  (default: md)
 *   indeterminate – boolean  (shows a dash; overrides checked visual)
 *
 * Events:
 *   webropol-change  → { checked: boolean, value: string }
 *
 * Note: Visual state is managed with inline styles + a tiny SVG so the
 * component works regardless of Tailwind JIT scan order (styles injected
 * via JS innerHTML are NOT guaranteed to be picked up by the Tailwind CDN
 * JIT scanner before first paint).
 */

import { BaseComponent } from '../../utils/base-component.js';

// ---------- One-time global style injection ----------
const STYLE_ID = 'webropol-checkbox-global-styles';
if (!document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    webropol-checkbox { display: inline-flex; }

    .wbr-cb-label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    }
    .wbr-cb-label.is-disabled {
      opacity: 0.55;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Hidden native input – keeps forms/screen-readers happy */
    .wbr-cb-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    /* Visual box */
    .wbr-cb-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 2px solid #cbd5e1;
      background: #ffffff;
      flex-shrink: 0;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .wbr-cb-label:not(.is-disabled):hover .wbr-cb-box {
      border-color: #06b6d4;
    }
    .wbr-cb-box.is-checked {
      background: #06b6d4;
      border-color: #06b6d4;
    }
    .wbr-cb-box.is-indeterminate {
      background: #06b6d4;
      border-color: #06b6d4;
    }

    /* Size variants */
    .wbr-cb-box--sm  { width: 1rem;   height: 1rem;   }
    .wbr-cb-box--md  { width: 1.25rem; height: 1.25rem; }
    .wbr-cb-box--lg  { width: 1.5rem;  height: 1.5rem;  }

    .wbr-cb-icon { display: none; pointer-events: none; }
    .wbr-cb-box.is-checked       .wbr-cb-icon-check       { display: block; }
    .wbr-cb-box.is-indeterminate .wbr-cb-icon-indeterminate { display: block; }

    /* Label text */
    .wbr-cb-text { font-size: 0.875rem; color: #334155; line-height: 1.4; }
    .wbr-cb-box--lg ~ .wbr-cb-text { font-size: 1rem; }
  `;
  document.head.appendChild(s);
}

// ---------- Component ----------
export class WebropolCheckbox extends BaseComponent {
  static get observedAttributes() {
    return ['value', 'label', 'checked', 'disabled', 'size', 'indeterminate'];
  }

  init() {
    this._id = this.generateId('wbr-cb');
  }

  render() {
    const value         = this.getAttr('value', '');
    const label         = this.getAttr('label', '');
    const checked       = this.getBoolAttr('checked', false);
    const disabled      = this.getBoolAttr('disabled', false);
    const indeterminate = this.getBoolAttr('indeterminate', false);
    const size          = this.getAttr('size', 'md');

    const boxSize = { sm: 'wbr-cb-box--sm', md: 'wbr-cb-box--md', lg: 'wbr-cb-box--lg' }[size] || 'wbr-cb-box--md';
    const iconSize = { sm: 8, md: 10, lg: 12 }[size] || 10;
    const boxState = indeterminate ? 'is-indeterminate' : checked ? 'is-checked' : '';
    const innerLabel = label || '';

    this.innerHTML = `
      <label for="${this._id}" class="wbr-cb-label${disabled ? ' is-disabled' : ''}">
        <input
          id="${this._id}"
          class="wbr-cb-input"
          type="checkbox"
          ${value    ? `value="${this._esc(value)}"` : ''}
          ${checked  ? 'checked' : ''}
          ${disabled ? 'disabled' : ''}
          aria-checked="${indeterminate ? 'mixed' : checked ? 'true' : 'false'}"
        />
        <span class="wbr-cb-box ${boxSize} ${boxState}">
          <!-- Checkmark -->
          <svg class="wbr-cb-icon wbr-cb-icon-check" width="${iconSize}" height="${iconSize}" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Indeterminate dash -->
          <svg class="wbr-cb-icon wbr-cb-icon-indeterminate" width="${iconSize}" height="${iconSize}" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="6" x2="10" y2="6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        ${innerLabel ? `<span class="wbr-cb-text">${innerLabel}</span>` : ''}
      </label>
    `;
  }

  bindEvents() {
    const input = this.querySelector('.wbr-cb-input');
    const box   = this.querySelector('.wbr-cb-box');
    if (!input || !box) return;

    this.addListener(input, 'change', (e) => {
      const isChecked = e.target.checked;
      // Sync attribute so external observers work
      if (isChecked) this.setAttribute('checked', '');
      else this.removeAttribute('checked');
      this.removeAttribute('indeterminate');

      // Update visual without full re-render (avoids losing focus)
      box.classList.toggle('is-checked', isChecked);
      box.classList.remove('is-indeterminate');

      this.emit('webropol-change', { checked: isChecked, value: this.getAttr('value') });
    });
  }

  /** Set indeterminate state imperatively (call from JS) */
  setIndeterminate(val) {
    const input = this.querySelector('.wbr-cb-input');
    const box   = this.querySelector('.wbr-cb-box');
    if (input) input.indeterminate = val;
    if (box) {
      box.classList.toggle('is-indeterminate', val);
      if (val) box.classList.remove('is-checked');
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render();
      this.bindEvents();
    }
  }

  /** Safely escape attribute values */
  _esc(str) {
    return String(str).replace(/"/g, '&quot;');
  }
}

customElements.define('webropol-checkbox', WebropolCheckbox);
