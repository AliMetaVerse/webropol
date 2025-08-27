/**
 * Webropol Promo Toast Component
 * Bottom slide-in promo/toast supporting eSales and Feedback (NPS + open text)
 */

import { BaseComponent } from '../../utils/base-component.js';

class WebropolPromo extends BaseComponent {
  static get observedAttributes() {
    return ['open', 'mode']; // mode: auto | esales | feedback
  }

  constructor() {
    super();
    this.state = {
      visible: false,
      step: 1, // for feedback flow: 1=NPS, 2=Text, 3=Thanks
      npsScore: null,
      text: '',
      suggestion: null, // for eSales
    };
    this._route = (typeof window !== 'undefined' && window.__pageRoute) || location.hash.replace(/^#/, '') || '/home';
    this._settings = null;
    this._lastShownKey = 'webropol_promo_last_shown_v1';
  }

  init() {
    this.setAttribute('role', 'region');
    this.setAttribute('aria-live', 'polite');
    this.classList.add('webropol-promo-root');
    this.readSettings();
    this.setupListeners();
    // Initial content
    this.updateContentForRoute();
  }

  connectedCallback() {
    super.connectedCallback();
    // Decide initial visibility
    this.applyVisibilityFromSettings();
  }

  readSettings() {
    try {
      this._settings = (window.globalSettingsManager && window.globalSettingsManager.getAllSettings && window.globalSettingsManager.getAllSettings()) || {};
    } catch (_) { this._settings = {}; }
  }

  setupListeners() {
    // React to SPA route changes
    window.addEventListener('spa-route-change', (e) => {
      this._route = (e && e.detail && e.detail.path) || this._route;
      this.updateContentForRoute();
      // show again based on throttle rules
      this.applyVisibilityFromSettings();
    });

    // React to settings changes
    window.addEventListener('webropol-settings-applied', () => {
      this.readSettings();
      this.applyVisibilityFromSettings();
    });
  }

  // Simple throttle: show once per route per session
  canShowNow() {
    try {
      const store = JSON.parse(localStorage.getItem(this._lastShownKey) || '{}');
      const key = this._route || '/';
      return !store[key];
    } catch (_) { return true; }
  }

  markShown() {
    try {
      const store = JSON.parse(localStorage.getItem(this._lastShownKey) || '{}');
      const key = this._route || '/';
      store[key] = Date.now();
      localStorage.setItem(this._lastShownKey, JSON.stringify(store));
    } catch (_) { /* noop */ }
  }

  applyVisibilityFromSettings() {
    const enabled = this._settings?.promosEnabled === true; // default off unless explicitly enabled
    if (!enabled) {
      this.hide();
      return;
    }
    // only auto-show if not already visible and allowed by throttle
    if (!this.state.visible && this.canShowNow()) {
      // In auto mode, choose based on route; else respect explicit mode attribute
      const mode = this.getAttr('mode', 'auto');
      if (mode === 'auto') {
        const picked = this.pickModeForRoute(this._route);
        this.setAttribute('mode', picked);
      }
      // Show with fresh state
      this.setState({ step: 1, npsScore: null, text: '' }, false);
      this.show();
    }
  }

  pickModeForRoute(route) {
    const r = (route || '').toLowerCase();
    if (r.startsWith('/shop')) return 'feedback'; // gathering shop feedback
    if (r.startsWith('/design-system')) return 'feedback';
    // Default to eSales for functional sections
    return 'esales';
  }

  updateContentForRoute() {
    const route = (this._route || '/').split('?')[0];
    // Map routes to eSales suggestions
    const mapping = {
      '/surveys': {
        icon: 'fal fa-chart-line',
        title: 'Boost your insights with Analytics',
        desc: 'Advanced dashboards for survey results.',
        cta: 'Explore Analytics',
        href: '#/shop/products/analytics'
      },
      '/events': {
        icon: 'fal fa-sms',
        title: 'Engage via 2‑Way SMS',
        desc: 'Reach participants instantly with SMS.',
        cta: 'Get SMS Credits',
        href: '#/shop/sms-credits'
      },
      '/sms': {
        icon: 'fal fa-coins',
        title: 'Top up SMS credits',
        desc: 'Ensure uninterrupted messaging.',
        cta: 'Buy Credits',
        href: '#/shop/sms-credits'
      },
      '/case-management': {
        icon: 'fal fa-analytics',
        title: 'Add AI Text Analysis',
        desc: 'Understand themes in case feedback.',
        cta: 'See AI Text Analysis',
        href: '#/shop/products/ai-text-analysis'
      },
      '/exw': {
        icon: 'fal fa-user-chart',
        title: '360° Assessments',
        desc: 'Deep insights into employee performance.',
        cta: 'View 360',
        href: '#/shop/products/360-assessments'
      },
      '/home': {
        icon: 'fal fa-magic',
        title: 'Try AI Text Analysis',
        desc: 'Faster, smarter feedback insights.',
        cta: 'Explore AI',
        href: '#/shop/products/ai-text-analysis'
      }
    };
    // Find best match by prefix
    const key = Object.keys(mapping).find(k => route === k || route.startsWith(k + '/')) || '/home';
    this.state.suggestion = mapping[key];
    // Trigger re-render if visible
    if (this.state.visible) this.render();
  }

  show() {
    this.setState({ visible: true });
    this.markShown();
  }

  hide() {
    this.setState({ visible: false });
  }

  dismiss() {
    this.hide();
    // mark as shown for this route to avoid flicker
    this.markShown();
  }

  handleNpsSelect(score) {
    this.setState({ npsScore: score, step: 2 });
  }

  handleFeedbackSubmit() {
    const payload = {
      route: this._route,
      score: this.state.npsScore,
      text: (this.state.text || '').trim(),
      ts: Date.now(),
    };
    try {
      const k = 'webropol_promo_feedback_v1';
      const arr = JSON.parse(localStorage.getItem(k) || '[]');
      arr.push(payload);
      localStorage.setItem(k, JSON.stringify(arr));
    } catch(_) {}
    this.setState({ step: 3 });
    setTimeout(() => this.hide(), 2000);
  }

  // helpers for feedback UI
  renderNpsButton(n) {
    const isSel = this.state.npsScore === n;
    const clsSel = isSel ? 'border-webropol-teal-600 bg-webropol-teal-50 text-webropol-teal-800' : 'border-webropol-gray-300 text-webropol-gray-700 hover:border-webropol-teal-400 hover:bg-webropol-teal-50';
    return `<button class="w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg border-2 ${clsSel} transition font-semibold" data-action="nps" data-score="${n}">${n}</button>`;
  }
  renderNpsRow(start, end) {
    const parts = [];
    for (let i = start; i <= end; i++) parts.push(this.renderNpsButton(i));
    return parts.join('');
  }

  render() {
    const visible = !!this.state.visible;
    const mode = this.getAttr('mode', 'auto');
    const isEsales = (mode === 'esales');
    const isFeedback = (mode === 'feedback');

    const rootClasses = `
      fixed z-[60] max-w-md w-[92vw] sm:w-[420px]
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
      transition-all duration-300 ease-out
      bottom-4 right-4 sm:right-6 sm:bottom-6 left-1/2 sm:left-auto -translate-x-1/2 sm:-translate-x-0
    `;

    const closeBtn = `
      <button class="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-webropol-gray-500 hover:text-webropol-gray-700 hover:bg-webropol-gray-100 transition"
              aria-label="Dismiss promo" title="Dismiss" data-action="dismiss">
        <i class="fal fa-times"></i>
      </button>
    `;

    const esales = () => {
      const s = this.state.suggestion || {};
      return `
        <div class="relative overflow-hidden rounded-2xl border border-webropol-gray-200 bg-white shadow-2xl">
          ${closeBtn}
          <div class="p-4 sm:p-5 flex items-start space-x-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 text-white flex items-center justify-center shadow">
              <i class="${s.icon || 'fal fa-gift'} text-xl"></i>
            </div>
            <div class="flex-1">
              <div class="text-base sm:text-lg font-semibold text-webropol-gray-900">${s.title || 'Discover more in the Shop'}</div>
              <div class="text-sm text-webropol-gray-600 mt-1">${s.desc || 'Explore add-ons and capabilities to enhance your workflow.'}</div>
              <div class="mt-3">
                <a class="inline-flex items-center px-3 py-2 rounded-xl text-white bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 hover:from-webropol-teal-600 hover:to-webropol-teal-700 text-sm font-semibold shadow" href="${s.href || '#/shop'}">
                  ${s.cta || 'Explore'}
                  <i class="fal fa-arrow-right ml-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    const feedback = () => {
      if (this.state.step === 1) {
        return `
          <div class="relative overflow-hidden rounded-2xl border border-webropol-gray-200 bg-white shadow-2xl">
            ${closeBtn}
            <div class="p-4 sm:p-5">
              <div class="flex items-center mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mr-3">
                  <i class="fal fa-star"></i>
                </div>
                <div class="font-semibold text-webropol-gray-900">How likely are you to recommend Webropol?</div>
              </div>
              <div class="flex items-center justify-between text-xs text-webropol-gray-500 mb-2">
                <span>Not at all likely</span>
                <span>Extremely likely</span>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-1.5 sm:gap-2">${this.renderNpsRow(0,5)}</div>
                <div class="flex items-center justify-between gap-1.5 sm:gap-2">${this.renderNpsRow(6,10)}</div>
              </div>
            </div>
          </div>
        `;
      }
      if (this.state.step === 2) {
        return `
          <div class="relative overflow-hidden rounded-2xl border border-webropol-gray-200 bg-white shadow-2xl">
            ${closeBtn}
            <div class="p-4 sm:p-5">
              <div class="font-semibold text-webropol-gray-900 mb-2">Thanks! What’s the main reason for your score?</div>
              <textarea class="w-full p-3 border border-webropol-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-webropol-teal-100 focus:border-webropol-teal-500 text-sm" rows="3" placeholder="Your feedback helps us improve" data-ref="text">${this.state.text || ''}</textarea>
              <div class="mt-3 flex items-center justify-between">
                <button class="text-sm text-webropol-gray-500 hover:text-webropol-gray-700" data-action="back">Back</button>
                <button class="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 hover:from-webropol-teal-600 hover:to-webropol-teal-700 text-sm font-semibold" data-action="submit">Send</button>
              </div>
            </div>
          </div>
        `;
      }
      // Step 3 - Thank you
      return `
        <div class="relative overflow-hidden rounded-2xl border border-webropol-gray-200 bg-white shadow-2xl">
          ${closeBtn}
          <div class="p-5 flex items-center">
            <div class="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center mr-3"><i class="fal fa-check"></i></div>
            <div class="text-webropol-gray-900 font-semibold">Thank you for your feedback!</div>
          </div>
        </div>
      `;
    };

    this.innerHTML = `
      <div class="${rootClasses}" aria-hidden="${visible ? 'false' : 'true'}">
        ${isEsales ? esales() : ''}
        ${isFeedback ? feedback() : ''}
      </div>
    `;
  }

  bindEvents() {
    this.addListener(this, 'click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'dismiss') {
        e.preventDefault();
        this.dismiss();
      } else if (action === 'nps') {
        const n = parseInt(btn.getAttribute('data-score'), 10);
        this.handleNpsSelect(n);
        this.render();
      } else if (action === 'back') {
        this.setState({ step: 1 });
        this.render();
      } else if (action === 'submit') {
        const ta = this.querySelector('textarea[data-ref="text"]');
        const v = ta ? ta.value : this.state.text;
        this.setState({ text: v }, false);
        this.handleFeedbackSubmit();
        this.render();
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'open') {
      this.setState({ visible: this.getBoolAttr('open', false) });
    }
    if (name === 'mode') {
      // reset flow on mode change
      this.setState({ step: 1, npsScore: null, text: '' });
    }
    this.render();
  }
}

customElements.define('webropol-promo', WebropolPromo);

// Auto-inject a single instance into the page when settings allow
(function ensureSingleton() {
  if (typeof window === 'undefined') return;
  if (window.__webropolPromoAdded) return;
  window.__webropolPromoAdded = true;
  window.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('webropol-promo')) {
      const el = document.createElement('webropol-promo');
      document.body.appendChild(el);
    }
  });
})();
