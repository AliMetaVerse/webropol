/**
 * Webropol Button Hue Component
 * Category-selector buttons with icon + label, faithfully reproduced from the
 * Webropol Royal Design System (Figma node 12641:1144).
 *
 * Attributes
 * ----------
 *   hue          string   Color theme: royal-blue | royal-turquoise | royal-violet |
 *                         primary | accent | success | warning | error  (default: primary)
 *   orientation  string   Layout: vertical | horizontal | icon  (default: vertical)
 *   theme        string   Fill style: filled | outline  (default: filled)
 *   size         string   Button size: micro | sm | md | lg  (default: md)
 *   icon         string   FontAwesome icon class, e.g. "fal fa-chart-bar"  (default: fal fa-heart)
 *   label        string   Primary label text  (default: Button Label)
 *   description  string   Optional sub-label below label  (default: '')
 *   disabled     boolean  Disabled / non-interactive state
 *   href         string   When set, renders as <a> instead of <button>
 *   fit-content  boolean  Size to content width instead of the preset minimum width
 *
 * Events emitted
 * --------------
 *   webropol-button-hue-click  — { hue, orientation, label }
 *
 * Usage
 * -----
 *   <webropol-button-hue
 *     hue="royal-blue"
 *     orientation="vertical"
 *     theme="filled"
 *     size="md"
 *     icon="fal fa-chart-bar"
 *     label="Surveys"
 *     description="Create & manage"
 *   ></webropol-button-hue>
 */

import { BaseComponent } from '../../utils/base-component.js';

// ─── Shared hover/focus stylesheet – injected once ───────────────────────────
(function injectSharedStyles() {
  const STYLE_ID = 'webropol-button-hue-styles';
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    webropol-button-hue {
      display: inline-flex;
    }
    webropol-button-hue .wbh-btn {
      border: 1px solid var(--wbh-border);
      background-color: var(--wbh-bg);
      transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
      text-decoration: none;
      outline: none;
      font-family: inherit;
    }
    webropol-button-hue .wbh-btn:not([disabled]):hover {
      border-color: var(--wbh-hover-border);
      background-color: var(--wbh-hover-bg);
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    }
    webropol-button-hue .wbh-btn:not([disabled]):active {
      box-shadow: none;
      border-color: var(--wbh-active-border);
    }
    webropol-button-hue .wbh-btn:focus-visible {
      outline: 3px solid var(--wbh-hover-border);
      outline-offset: 2px;
    }
    webropol-button-hue .wbh-btn[disabled] {
      cursor: not-allowed;
    }
  `;
  (document.head || document.body).appendChild(style);
}());

// ─── Color tokens per hue (exact values from Figma) ──────────────────────────
const HUE_TOKENS = {
  'royal-blue': {
    bg:          '#eef2ff',   // blue-50  / indigo-50
    border:      '#c7d2fe',   // indigo-200
    avatarBg:    '#e0e7ff',   // indigo-100
    iconColor:   '#4338ca',   // indigo-700
    textColor:   '#312e81',   // indigo-900
    hoverBorder: '#4f46e5',   // indigo-600
    activeBorder:'#3730a3',   // indigo-700 pressed
  },
  'royal-turquoise': {
    bg:          '#ecfeff',
    border:      '#a5f3fc',
    avatarBg:    '#cffafe',
    iconColor:   '#0e7490',
    textColor:   '#164e63',
    hoverBorder: '#06b6d4',
    activeBorder:'#0891b2',
  },
  'royal-violet': {
    bg:          '#f1e9fb',
    border:      '#ba92ec',
    avatarBg:    '#f1e9fb',
    iconColor:   '#511a98',
    textColor:   '#230b41',
    hoverBorder: '#7c3aed',
    activeBorder:'#6d28d9',
  },
  'primary': {
    bg:          '#eefbfd',
    border:      '#b0e8f1',
    avatarBg:    '#d5f4f8',
    iconColor:   '#1d809d',
    textColor:   '#204859',
    hoverBorder: '#1e6880',
    activeBorder:'#215669',
  },
  'accent': {
    bg:          '#fff4ed',
    border:      '#ffc8a8',
    avatarBg:    '#ffe5d4',
    iconColor:   '#c61e08',
    textColor:   '#7e1910',
    hoverBorder: '#ea580c',
    activeBorder:'#c2410c',
  },
  'success': {
    bg:          '#f5faf3',
    border:      '#cfe9c9',
    avatarBg:    '#e8f4e4',
    iconColor:   '#38672e',
    textColor:   '#284423',
    hoverBorder: '#16a34a',
    activeBorder:'#15803d',
  },
  'warning': {
    bg:          '#fffae9',
    border:      '#fde38a',
    avatarBg:    '#fef2c7',
    iconColor:   '#c61e08',
    textColor:   '#78320f',
    hoverBorder: '#d97706',
    activeBorder:'#b45309',
  },
  'error': {
    bg:          '#ffebed',
    border:      '#fecdd4',
    avatarBg:    '#ffe4e7',
    iconColor:   '#be1241',
    textColor:   '#88133a',
    hoverBorder: '#e11d48',
    activeBorder:'#be123c',
  },
};

// Disabled state token overrides
const DISABLED_TOKENS = {
  bg:          '#f8fafc',
  border:      '#e2e8f0',
  avatarBg:    '#f1f5f9',
  iconColor:   '#94a3b8',
  textColor:   '#94a3b8',
  avatarBorder:'#e2e8f0',
};

// ─── Size configs (Figma base = md) ──────────────────────────────────────────
const SIZE_CONFIG = {
  micro: {
    minWidth:     '190px',
    padX:         '12px',
    padY:         '8px',
    padIcon:      '8px',
    gap:          '6px',
    avatarSize:   '24px',
    iconSize:     '12px',
    avatarPad:    '4px',
    avatarRadius: '6px',
    btnRadius:    '8px',
    fontSize:     '10px',
    lineH:        '14px',
    descSize:     '10px',
  },
  sm: {
    minWidth:     '130px',
    padX:         '16px',
    padY:         '10px',
    padIcon:      '10px',
    gap:          '8px',
    avatarSize:   '36px',
    iconSize:     '16px',
    avatarPad:    '6px',
    avatarRadius: '6px',
    btnRadius:    '10px',
    fontSize:     '13px',
    lineH:        '20px',
    descSize:     '11px',
  },
  md: {
    minWidth:     '190px',
    padX:         '32px',
    padY:         '12px',
    padIcon:      '12px',
    gap:          '12px',
    avatarSize:   '48px',
    iconSize:     '24px',
    avatarPad:    '10px',
    avatarRadius: '8px',
    btnRadius:    '12px',
    fontSize:     '16px',
    lineH:        '24px',
    descSize:     '12px',
  },
  lg: {
    minWidth:     '220px',
    padX:         '40px',
    padY:         '16px',
    padIcon:      '16px',
    gap:          '14px',
    avatarSize:   '56px',
    iconSize:     '28px',
    avatarPad:    '12px',
    avatarRadius: '10px',
    btnRadius:    '14px',
    fontSize:     '18px',
    lineH:        '28px',
    descSize:     '13px',
  },
};

// ─── Tiny HTML-escape helper to prevent XSS in label/description ─────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Component ────────────────────────────────────────────────────────────────
export class WebropolButtonHue extends BaseComponent {
  static get observedAttributes() {
    return ['hue', 'orientation', 'theme', 'size', 'icon', 'label', 'description', 'disabled', 'href', 'fit-content'];
  }

  init() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    if (!this.hasAttribute('tabindex') && !this.getBoolAttr('disabled')) {
      this.setAttribute('tabindex', '0');
    }
  }

  render() {
    const hue         = this.getAttr('hue', 'primary');
    const orientation = this.getAttr('orientation', 'vertical');   // vertical | horizontal | icon
    const theme       = this.getAttr('theme', 'filled');           // filled | outline
    const size        = this.getAttr('size', 'md');                // micro | sm | md | lg
    const iconClass   = this.getAttr('icon', 'fal fa-heart');
    const label       = escHtml(this.getAttr('label', 'Button Label'));
    const description = escHtml(this.getAttr('description', ''));
    const disabled    = this.getBoolAttr('disabled');
    const href        = this.getAttr('href', '');
    const fitContent  = this.getBoolAttr('fit-content');

    const t  = HUE_TOKENS[hue] || HUE_TOKENS['primary'];
    const sc = SIZE_CONFIG[size]  || SIZE_CONFIG['md'];

    // Resolve colours for each part
    const bgColor      = disabled ? DISABLED_TOKENS.bg      : (theme === 'outline' ? '#ffffff'         : t.bg);
    const bgHover      = disabled ? DISABLED_TOKENS.bg      : t.bg; // outline hovers to tinted bg
    const borderColor  = disabled ? DISABLED_TOKENS.border  : t.border;
    const hoverBorder  = disabled ? DISABLED_TOKENS.border  : t.hoverBorder;
    const activeBorder = disabled ? DISABLED_TOKENS.border  : t.activeBorder;
    const avatarBg     = disabled ? DISABLED_TOKENS.avatarBg : t.avatarBg;
    const avatarBorder = disabled ? DISABLED_TOKENS.avatarBorder : 'white';
    const iconColor    = disabled ? DISABLED_TOKENS.iconColor : t.iconColor;
    const textColor    = disabled ? DISABLED_TOKENS.textColor  : t.textColor;

    // Push CSS custom-properties onto the host so the shared stylesheet can use them
    this.style.setProperty('--wbh-bg',           bgColor);
    this.style.setProperty('--wbh-hover-bg',     bgHover);
    this.style.setProperty('--wbh-border',       borderColor);
    this.style.setProperty('--wbh-hover-border', hoverBorder);
    this.style.setProperty('--wbh-active-border',activeBorder);

    const isVertical   = orientation === 'vertical';
    const isHorizontal = orientation === 'horizontal';
    const isIconOnly   = orientation === 'icon';

    // ── Outer wrapper (button|a) ──────────────────────────────────────────────
    const outerStyles = [
      `min-width:${fitContent ? 'max-content' : (isIconOnly ? sc.avatarSize : sc.minWidth)}`,
      `width:${fitContent ? 'auto' : 'initial'}`,
      `border-radius:${sc.btnRadius}`,
      `display:inline-flex`,
      `flex-direction:${isVertical ? 'column' : 'row'}`,
      `align-items:center`,
      `justify-content:${isHorizontal ? 'flex-start' : 'center'}`,
      `cursor:${disabled ? 'not-allowed' : 'pointer'}`,
      `padding:0`,
    ].join(';');

    // ── Inner container ───────────────────────────────────────────────────────
    const padX = isIconOnly ? sc.padIcon : (isHorizontal ? sc.padY : sc.padX);
    const padY = isIconOnly ? sc.padIcon : sc.padY;

    const containerStyles = [
      `display:flex`,
      `flex-direction:${isVertical ? 'column' : 'row'}`,
      `align-items:center`,
      `justify-content:${isHorizontal ? 'flex-start' : 'center'}`,
      `gap:${isIconOnly ? '0' : sc.gap}`,
      `padding:${padY} ${padX}`,
      `border-radius:${sc.btnRadius}`,
    ].join(';');

    // ── Avatar (icon container) ───────────────────────────────────────────────
    const avatarStyles = [
      `width:${sc.avatarSize}`,
      `height:${sc.avatarSize}`,
      `min-width:${sc.avatarSize}`,
      `background-color:${avatarBg}`,
      `border:2px solid ${avatarBorder}`,
      `border-radius:${sc.avatarRadius}`,
      `display:flex`,
      `align-items:center`,
      `justify-content:center`,
      `flex-shrink:0`,
    ].join(';');

    // ── Icon ──────────────────────────────────────────────────────────────────
    const iconHtml = `
      <div style="${avatarStyles}">
        <i class="${iconClass}" style="color:${iconColor};font-size:${sc.iconSize};width:${sc.iconSize};text-align:center;display:block;" aria-hidden="true"></i>
      </div>`;

    // ── Label block ───────────────────────────────────────────────────────────
    const labelStyles = [
      `display:flex`,
      `flex-direction:column`,
      `align-items:${isVertical ? 'center' : 'flex-start'}`,
      `flex-shrink:0`,
    ].join(';');

    const labelTextStyles = [
      `color:${textColor}`,
      `font-family:Roboto,Inter,system-ui,sans-serif`,
      `font-size:${sc.fontSize}`,
      `font-weight:500`,
      `line-height:${sc.lineH}`,
      `white-space:nowrap`,
    ].join(';');

    const descTextStyles = [
      `color:${textColor}`,
      `font-family:Roboto,Inter,system-ui,sans-serif`,
      `font-size:${sc.descSize}`,
      `font-weight:400`,
      `line-height:16px`,
      `opacity:0.75`,
    ].join(';');

    const labelHtml = !isIconOnly ? `
      <div style="${labelStyles}">
        <span style="${labelTextStyles}">${label}</span>
        ${description ? `<span style="${descTextStyles}">${description}</span>` : ''}
      </div>` : '';

    const innerContent = `<div style="${containerStyles}">${iconHtml}${labelHtml}</div>`;

    // ── Render ────────────────────────────────────────────────────────────────
    if (href && !disabled) {
      this.innerHTML = `
        <a class="wbh-btn"
           href="${href}"
           style="${outerStyles}"
           aria-label="${label}">
          ${innerContent}
        </a>`;
    } else {
      this.innerHTML = `
        <button class="wbh-btn"
                type="button"
                style="${outerStyles}"
                ${disabled ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'}>
          ${innerContent}
        </button>`;
    }
  }

  bindEvents() {
    const el = this.querySelector('button, a');
    if (el && !this.getBoolAttr('disabled')) {
      this.addListener(el, 'click', this._onClick.bind(this));
    }
  }

  _onClick(event) {
    this.emit('webropol-button-hue-click', {
      hue:         this.getAttr('hue', 'primary'),
      orientation: this.getAttr('orientation', 'vertical'),
      label:       this.getAttr('label', ''),
      originalEvent: event,
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  setDisabled(disabled = true) {
    if (disabled) {
      this.setAttribute('disabled', '');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute('disabled');
      this.setAttribute('tabindex', '0');
    }
  }
}

customElements.define('webropol-button-hue', WebropolButtonHue);
