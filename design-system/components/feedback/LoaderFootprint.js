import { BaseComponent } from '../../utils/base-component.js';

const STYLE_ID = 'webropol-loader-footprint-styles';

function normalizeDimension(value, fallback) {
  if (!value) return fallback;
  return /^\d+$/.test(String(value).trim()) ? `${value}px` : String(value).trim();
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    webropol-loader-footprint {
      display: inline-block;
    }
    .wplf-root {
      position: relative;
      width: var(--wplf-width);
      height: var(--wplf-height);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wplf-content {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wplf-guide {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }
    .wplf-grid {
      position: absolute;
      inset: 18px;
      border-radius: 24px;
      background-image:
        linear-gradient(rgba(176, 232, 241, 0.38) 1px, transparent 1px),
        linear-gradient(90deg, rgba(176, 232, 241, 0.38) 1px, transparent 1px);
      background-size: 20px 20px;
      background-position: center center;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.82), rgba(0,0,0,0.18));
      opacity: 0.95;
    }
    .wplf-corner {
      position: absolute;
      width: 22px;
      height: 22px;
      border-color: #79d6e7;
      border-style: solid;
      filter: drop-shadow(0 1px 0 rgba(255,255,255,0.85));
    }
    .wplf-corner--tl {
      top: 10px;
      left: 10px;
      border-width: 2px 0 0 2px;
      border-top-left-radius: 10px;
    }
    .wplf-corner--tr {
      top: 10px;
      right: 10px;
      border-width: 2px 2px 0 0;
      border-top-right-radius: 10px;
    }
    .wplf-corner--br {
      right: 10px;
      bottom: 10px;
      border-width: 0 2px 2px 0;
      border-bottom-right-radius: 10px;
    }
    .wplf-corner--bl {
      bottom: 10px;
      left: 10px;
      border-width: 0 0 2px 2px;
      border-bottom-left-radius: 10px;
    }
    .wplf-label {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid rgba(176, 232, 241, 0.9);
      background: rgba(255,255,255,0.88);
      color: #1d809d;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      backdrop-filter: blur(6px);
      box-shadow: 0 6px 18px rgba(32, 159, 186, 0.08);
      white-space: nowrap;
    }
    .wplf-label::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #1d809d;
      opacity: 0.8;
    }
  `;

  document.head.appendChild(style);
}

export class WebropolLoaderFootprint extends BaseComponent {
  static get observedAttributes() {
    return ['width', 'height', 'label', 'show-grid', 'show-corners', 'show-label'];
  }

  init() {
    ensureStyles();
    if (this._contentMarkup === undefined) {
      this._contentMarkup = this.innerHTML;
    }
  }

  render() {
    ensureStyles();

    const width = normalizeDimension(this.getAttr('width', '220'), '220px');
    const height = normalizeDimension(this.getAttr('height', '220'), '220px');
    const showGrid = this.getBoolAttr('show-grid', false);
    const showCorners = this.getBoolAttr('show-corners', true);
    const showLabel = this.getBoolAttr('show-label', true);
    const label = this.getAttr('label', `${width.replace('px', '')} x ${height.replace('px', '')}`);
    const contentMarkup = this._contentMarkup || '';

    this.innerHTML = `
      <div class="wplf-root" style="--wplf-width:${width}; --wplf-height:${height};">
        <div class="wplf-guide" aria-hidden="true">
          ${showGrid ? '<div class="wplf-grid"></div>' : ''}
          ${showCorners ? '<span class="wplf-corner wplf-corner--tl"></span><span class="wplf-corner wplf-corner--tr"></span><span class="wplf-corner wplf-corner--br"></span><span class="wplf-corner wplf-corner--bl"></span>' : ''}
          ${showLabel ? `<span class="wplf-label">${label}</span>` : ''}
        </div>
        <div class="wplf-content">
          ${contentMarkup}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('webropol-loader-footprint')) {
  customElements.define('webropol-loader-footprint', WebropolLoaderFootprint);
}