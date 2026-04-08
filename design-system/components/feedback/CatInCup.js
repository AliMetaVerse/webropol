import { BaseComponent } from '../../utils/base-component.js';

const STYLE_ID = 'webropol-cat-in-cup-styles';
const CAT_IN_CUP_ASSET_URL = new URL('../../../examples/svgs/cat-in-cup.svg', import.meta.url).href;

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .wcic-root {
      --wcic-width: 180px;
      position: relative;
      width: var(--wcic-width);
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .wcic-shell {
      position: relative;
      width: 100%;
      padding: 0;
      overflow: visible;
    }
    .wcic-art {
      position: relative;
      z-index: 1;
      width: 100%;
    }
    .wcic-art svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
    }
    .wcic-snooze {
      position: absolute;
      top: 2px;
      right: 24px;
      z-index: 3;
      display: inline-flex;
      align-items: flex-end;
      gap: 3px;
      font-weight: 400;
      letter-spacing: 0.04em;
      color: #fb7189;
      text-shadow: 0 8px 18px rgba(77, 54, 178, 0.22);
      text-transform: none;
      pointer-events: none;
    }
    .wcic-snooze span {
      display: inline-block;
      font-weight: 400;
      line-height: 1;
      opacity: 0.24;
      transform: translateY(8px) scale(0.88);
      animation: wcic-snooze 2.8s ease-in-out infinite;
    }
    .wcic-snooze span:nth-child(1) {
      font-size: 0.9rem;
      animation-delay: 0s;
    }
    .wcic-snooze span:nth-child(2) {
      font-size: 1.15rem;
      animation-delay: 0.28s;
    }
    .wcic-snooze span:nth-child(3) {
      font-size: 1.45rem;
      animation-delay: 0.56s;
    }
    .wcic-caption {
      max-width: calc(var(--wcic-width) + 24px);
      text-align: center;
      font-size: 0.8125rem;
      line-height: 1.45;
      color: #61686a;
    }
    @keyframes wcic-snooze {
      0%, 100% {
        opacity: 0.18;
        transform: translateY(8px) scale(0.88);
      }
      35% {
        opacity: 0.92;
        transform: translateY(-1px) scale(1);
      }
      70% {
        opacity: 0;
        transform: translateY(-15px) scale(1.08);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .wcic-snooze span {
        animation: none !important;
        opacity: 0.7;
        transform: none;
      }
    }
  `;

  document.head.appendChild(style);
}

function getSizing(size) {
  switch (size) {
    case 'sm':
      return { width: '132px' };
    case 'lg':
      return { width: '232px' };
    default:
      return { width: '180px' };
  }
}

export class WebropolCatInCup extends BaseComponent {
  static get observedAttributes() {
    return ['size', 'caption', 'label', 'decorative'];
  }

  render() {
    ensureStyles();

    const size = this.getAttr('size', 'md');
    const caption = this.getAttr('caption');
    const label = this.getAttr('label', 'Animated cat sitting in a cup');
    const decorative = this.getBoolAttr('decorative');
    const sizing = getSizing(size);

    this.innerHTML = `
      <div
        class="wcic-root"
        style="--wcic-width:${sizing.width};"
        ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="${label}"`}
      >
        <div class="wcic-shell">
          <span class="wcic-snooze" aria-hidden="true"><span>z</span><span>z</span><span>Z</span></span>
          <div class="wcic-art"><img src="${CAT_IN_CUP_ASSET_URL}" alt="" /></div>
        </div>
        ${caption ? `<span class="wcic-caption">${caption}</span>` : ''}
      </div>
    `;
  }
}

customElements.define('webropol-cat-in-cup', WebropolCatInCup);