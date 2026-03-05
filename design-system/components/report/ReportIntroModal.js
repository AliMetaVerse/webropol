import { BaseComponent } from '../../utils/base-component.js';

/**
 * ReportIntroModal Component
 * 
 * Self-contained intro/onboarding modal for the Webropol reporting module.
 * Explains the 4 levels of context-aware editing (Widget, Chart, Table, Element).
 * Automatically shows on first visit; respects a "Don't show again" preference stored in localStorage.
 *
 * Usage:
 *   <webropol-report-intro-modal></webropol-report-intro-modal>
 *
 * Attributes:
 *   storage-key  - localStorage key used to persist "seen" state (default: 'webropol_reporting_intro_seen')
 *   force-show   - Boolean; if present, always shows the modal regardless of localStorage
 */
export class ReportIntroModal extends BaseComponent {
  static get observedAttributes() {
    return ['storage-key', 'force-show'];
  }

  init() {
    this._visible = false;
    this._dontShowAgain = false;
    const key = this.getAttr('storage-key', 'webropol_reporting_intro_seen');
    const forceSow = this.getBoolAttr('force-show');
    const seen = localStorage.getItem(key);
    if (!seen || forceSow) this._visible = true;
  }

  render() {
    this.innerHTML = `
      <div class="webropol-report-intro-overlay"
           role="dialog"
           aria-modal="true"
           aria-labelledby="intro-modal-title"
           style="
             display: ${this._visible ? 'flex' : 'none'};
             position: fixed;
             inset: 0;
             z-index: 2147483640;
             align-items: center;
             justify-content: center;
             background: rgba(0,0,0,0.5);
             backdrop-filter: blur(4px);
             padding: 1rem;
             transition: opacity 0.3s ease;
           ">

        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
             id="intro-modal-panel">

          <!-- Header -->
          <div class="p-8 bg-gradient-to-br from-webropol-primary-50 to-white border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <h2 id="intro-modal-title" class="text-2xl font-bold text-gray-900 mb-2">Introducing Setting Island</h2>
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-webropol-primary-600 text-white uppercase tracking-wider shadow-sm">New</span>
                  <p class="text-lg text-gray-600">Context-Aware Editing</p>
                </div>
              </div>
              <button class="js-intro-close text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                <i class="fal fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-8">
            <p class="text-gray-600 mb-6 text-lg">We&rsquo;ve introduced 4 levels of granular control for your reports. Start by clicking specifically on what you want to edit.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <!-- Level 1: Widget -->
              <div class="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group">
                <div class="w-12 h-12 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i class="fal fa-cube text-2xl"></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">1. Widget Level</h3>
                <p class="text-xs text-gray-500 mb-3">The container</p>
                <p class="text-sm text-gray-600">Control overall hierarchy, weighting, and widget-wide settings.</p>
              </div>

              <!-- Level 2: Chart -->
              <div class="bg-blue-50 rounded-xl p-5 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group">
                <div class="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i class="fal fa-chart-bar text-2xl"></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">2. Chart Level</h3>
                <p class="text-xs text-blue-500 mb-3">The visualization</p>
                <p class="text-sm text-gray-600">Change chart types, sort order, and axis configurations.</p>
              </div>

              <!-- Level 3: Table -->
              <div class="bg-green-50 rounded-xl p-5 border border-green-100 hover:border-green-300 hover:shadow-md transition-all group">
                <div class="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i class="fal fa-table text-2xl"></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">3. Table Level</h3>
                <p class="text-xs text-green-500 mb-3">The data grid</p>
                <p class="text-sm text-gray-600">Filter rows, show/hide columns, and adjust table layouts.</p>
              </div>

              <!-- Level 4: Element -->
              <div class="bg-purple-50 rounded-xl p-5 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all group">
                <div class="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i class="fal fa-square text-2xl"></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">4. Element Level</h3>
                <p class="text-xs text-purple-500 mb-3">Individual data points</p>
                <p class="text-sm text-gray-600">Click a specific bar to change its color or filter by that value.</p>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none hover:text-gray-800 transition-colors">
              <input type="checkbox" class="js-intro-dont-show rounded border-gray-300 text-webropol-primary-500 focus:ring-webropol-primary-500 w-4 h-4">
              <span>Don&rsquo;t show this again</span>
            </label>
            <button class="js-intro-close px-6 py-2.5 bg-webropol-primary-500 hover:bg-webropol-primary-600 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all">
              Let&rsquo;s go!
            </button>
          </div>

        </div>
      </div>
    `;
  }

  bindEvents() {
    const overlay = this.querySelector('.webropol-report-intro-overlay');

    // Close on overlay click (outside panel)
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this._close();
    });

    // Close buttons
    this.querySelectorAll('.js-intro-close').forEach(btn => {
      btn.addEventListener('click', () => this._close());
    });

    // Escape key
    this._keyHandler = (e) => {
      if (e.key === 'Escape' && this._visible) this._close();
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  cleanup() {
    super.cleanup();
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
    }
  }

  _close() {
    const checkbox = this.querySelector('.js-intro-dont-show');
    if (checkbox?.checked) {
      const key = this.getAttr('storage-key', 'webropol_reporting_intro_seen');
      try {
        localStorage.setItem(key, 'true');
      } catch (e) {
        console.error('ReportIntroModal: localStorage error', e);
      }
    }
    const overlay = this.querySelector('.webropol-report-intro-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 200);
    }
    this._visible = false;
    this.emit('intro-closed', {});
  }

  /** Programmatically open the modal (e.g. from a "Show intro" button) */
  show() {
    this._visible = true;
    const overlay = this.querySelector('.webropol-report-intro-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '0';
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });
    }
  }
}

customElements.define('webropol-report-intro-modal', ReportIntroModal);
