/**
 * Webropol Platform Version Component
 *
 * Displays the current platform environment (Staging / Testing / Development) along
 * with the version label and build number. Designed primarily for the sidebar but
 * usable anywhere a small environment indicator is needed.
 *
 * Two visual modes are supported:
 *   - Expanded (default)  : pill with avatar icon + textual labels
 *   - Collapsed           : 44px square avatar icon only (with hover tooltip)
 *
 * Click behaviour: when `clickable` (default true), clicking the component cycles
 * the environment between the available environments and persists the selection in
 * `localStorage` under the key `webropol_platform_env`. A `platform-env-change`
 * custom event is emitted so other instances on the page can stay in sync.
 *
 * Usage:
 *   <webropol-platform-version environment="staging"></webropol-platform-version>
 *   <webropol-platform-version environment="testing" collapsed></webropol-platform-version>
 *   <webropol-platform-version environment="staging" version="v3 Peacock"
 *                              build="Build 123.4567.8901.2345"></webropol-platform-version>
 *
 * Source: Figma "Royal Design System" — Platform Version (node 14633:3184)
 */

import { BaseComponent } from '../../utils/base-component.js';

const STORAGE_KEY = 'webropol_platform_env';

// Ordered list used when cycling on click
const ENV_CYCLE = ['staging', 'testing'];

const ENV_PRESETS = {
  staging: {
    label: 'Staging',
    icon: 'fa-light fa-rocket',
    // Cyan / primary palette
    pillBorder: '#d5f4f8',     // webropol-primary-100
    avatarBg: '#d5f4f8',
    iconColor: '#1e6880',      // webropol-primary-700
    versionColor: '#1e6880'
  },
  testing: {
    label: 'Testing',
    icon: 'fa-light fa-flask',
    // Amber / warning palette
    pillBorder: '#fef2c7',     // warning-100
    avatarBg: '#fef2c7',
    iconColor: '#c61e08',      // error-700 (per Figma)
    versionColor: '#b44e09'    // amber-700
  },
  // Optional third option used by some pages
  development: {
    label: 'Development',
    icon: 'fa-light fa-code',
    pillBorder: '#e6e7e8',
    avatarBg: '#f3f4f4',
    iconColor: '#61686a',
    versionColor: '#61686a'
  }
};

export class WebropolPlatformVersion extends BaseComponent {
  static get observedAttributes() {
    return ['environment', 'collapsed', 'version', 'build', 'clickable', 'tooltip-position'];
  }

  constructor() {
    super();
    this._onGlobalEnvChange = this._onGlobalEnvChange.bind(this);
  }

  connectedCallback() {
    // If an environment hasn't been explicitly set, hydrate from localStorage so all
    // instances on the page stay in sync after a reload.
    if (!this.hasAttribute('environment')) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && ENV_PRESETS[saved]) {
          this.setAttribute('environment', saved);
        }
      } catch (_) { /* ignore quota / private mode */ }
    }
    super.connectedCallback();
    window.addEventListener('platform-env-change', this._onGlobalEnvChange);
  }

  disconnectedCallback() {
    window.removeEventListener('platform-env-change', this._onGlobalEnvChange);
    super.disconnectedCallback && super.disconnectedCallback();
  }

  _onGlobalEnvChange(e) {
    const next = e?.detail?.environment;
    if (!next || next === this.getAttr('environment')) return;
    if (!ENV_PRESETS[next]) return;
    // Update without re-emitting (avoid loops)
    this._suppressEmit = true;
    this.setAttribute('environment', next);
    this._suppressEmit = false;
  }

  render() {
    const envKey = (this.getAttr('environment', 'staging') || 'staging').toLowerCase();
    const preset = ENV_PRESETS[envKey] || ENV_PRESETS.staging;
    const collapsed = this.getBoolAttr('collapsed');
    const clickable = this.getAttr('clickable', 'true') !== 'false';
    const version = this.getAttr('version', 'v3 Peacock');
    const build = this.getAttr('build', 'Build xxx.xxxx.xxxx.xxxx');

    // Custom elements default to display:inline. Force the host to be a block-level
    // container so inner `w-full` / flex layout works as expected.
    this.style.display = collapsed ? 'inline-block' : 'block';

    const cursor = clickable ? 'cursor-pointer hover:shadow-soft' : '';
    const titleAttr = clickable ? `title="${preset.label} / ${version} — click to switch"` : `title="${preset.label} / ${version}"`;
    let markup = '';

    if (collapsed) {
      // Collapsed: icon-only 44px avatar with tooltip (uses native title)
      markup = `
        <button type="button"
                class="platform-version-trigger ${cursor}"
                style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:8px;border:2px solid #fff;box-shadow:0 2px 8px rgba(39,42,43,0.08);background:${preset.avatarBg};transition:all .15s ease;"
                aria-label="${preset.label} / ${version}"
                ${titleAttr}
                ${clickable ? '' : 'disabled'}>
          <i class="${preset.icon}" style="color:${preset.iconColor};font-size:20px;line-height:1;"></i>
          <span class="sr-only">${preset.label} ${version} ${build}</span>
        </button>
      `;
    } else {
      // Expanded: pill with avatar + text
      markup = `
        <button type="button"
                class="platform-version-trigger ${cursor}"
                style="display:flex;align-items:center;gap:8px;width:100%;padding:8px;border-radius:8px;border:1px solid ${preset.pillBorder};background:#fff;text-align:left;transition:all .15s ease;${clickable ? 'cursor:pointer;' : ''}"
                aria-label="${preset.label} / ${version}"
                ${titleAttr}
                ${clickable ? '' : 'disabled'}>
          <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:2px solid #fff;background:${preset.avatarBg};flex-shrink:0;">
            <i class="${preset.icon}" style="color:${preset.iconColor};font-size:12px;line-height:1;"></i>
          </span>
          <span style="display:flex;flex-direction:column;line-height:1.2;min-width:0;flex:1;">
            <span style="font-size:12px;font-weight:500;color:#61686a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${preset.label}
              <span style="color:#b5bbbd;"> / </span>
              <span style="color:${preset.versionColor};">${version}</span>
            </span>
            <span style="font-size:11px;font-weight:400;color:#9ba2a4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${build}</span>
          </span>
        </button>
      `;
    }

    this.innerHTML = markup;
  }

  bindEvents() {
    const trigger = this.querySelector('.platform-version-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clickable = this.getAttr('clickable', 'true') !== 'false';
      if (!clickable) return;
      this.cycleEnvironment();
    });
  }

  cycleEnvironment() {
    const current = (this.getAttr('environment', 'staging') || 'staging').toLowerCase();
    const idx = ENV_CYCLE.indexOf(current);
    const next = ENV_CYCLE[(idx + 1) % ENV_CYCLE.length];
    this.setEnvironment(next);
  }

  setEnvironment(env) {
    if (!ENV_PRESETS[env]) return;
    this.setAttribute('environment', env);
    try { localStorage.setItem(STORAGE_KEY, env); } catch (_) {}
    if (!this._suppressEmit) {
      // Notify other instances + listeners
      window.dispatchEvent(new CustomEvent('platform-env-change', {
        detail: { environment: env }
      }));
      this.emit('environment-changed', { environment: env });
    }
  }
}

if (!customElements.get('webropol-platform-version')) {
  customElements.define('webropol-platform-version', WebropolPlatformVersion);
}
