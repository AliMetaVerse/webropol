import { BaseComponent } from '../../design-system/utils/base-component.js';

/**
 * WebropolThankYouPage — Web Component
 *
 * Attributes:
 *   heading       — main heading text
 *   contact-email — contact email address shown as "Contact us" link
 *   mode          — "edit" (shows gear settings button) | "preview"
 *   logo-src      — path to Webropol logo image
 */

export class ThankYouPage extends BaseComponent {
    static get observedAttributes() {
        return ['heading', 'contact-email', 'mode', 'logo-src'];
    }

    attributeChangedCallback() { /* Alpine owns state after init */ }

    init() {
        if (!window.__webropolThankYouData) {
            window.__webropolThankYouData = function (cfgId) {
                const cfg = (window.__webropolThankYouCfg || {})[cfgId] || {};
                return {
                    heading:      cfg.heading      || 'Thank you for your participation!',
                    contactEmail: cfg.contactEmail || '',
                    mode:         cfg.mode         || 'preview',
                    logoSrc:      cfg.logoSrc      || '../img/logo/W-logo-dark.svg',

                    // Settings modal state
                    settingsOpen:  false,
                    layout:        'with-layout',  // 'with-layout' | 'simple'
                    pendingLayout: 'with-layout',

                    openSettings() {
                        this.pendingLayout = this.layout;
                        this.settingsOpen = true;
                    },
                    applySettings() {
                        this.layout = this.pendingLayout;
                        this.settingsOpen = false;
                        // Persist to localStorage
                        try {
                            const saved = JSON.parse(localStorage.getItem('webropol_ty_settings') || '{}');
                            saved.layout = this.layout;
                            localStorage.setItem('webropol_ty_settings', JSON.stringify(saved));
                        } catch (e) { /* quota / private browsing */ }
                    },
                    cancelSettings() {
                        this.settingsOpen = false;
                    },

                    init() {
                        try {
                            const saved = JSON.parse(localStorage.getItem('webropol_ty_settings') || '{}');
                            if (saved.layout) { this.layout = saved.layout; this.pendingLayout = saved.layout; }
                        } catch (e) { /* ignore */ }
                    }
                };
            };
        }
    }

    render() {
        const heading      = this.getAttr('heading', 'Thank you for your participation!');
        const contactEmail = this.getAttr('contact-email', '');
        const mode         = this.getAttr('mode', 'preview');
        const logoSrc      = this.getAttr('logo-src', '../img/logo/W-logo-dark.svg');

        if (!window.__webropolThankYouCfg) window.__webropolThankYouCfg = {};
        if (!this._cfgId) this._cfgId = this.generateId('typage');
        window.__webropolThankYouCfg[this._cfgId] = { heading, contactEmail, mode, logoSrc };

        const id = this._cfgId;

        this.innerHTML = /* html */`
<!-- ── Section divider ──────────────────────────────────────────── -->
<div class="mt-16 mb-8 relative">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t-2 border-webropol-gray-200"></div>
  </div>
  <div class="relative flex justify-center">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-webropol-gray-50
                text-webropol-gray-500 text-xs font-semibold uppercase tracking-widest
                rounded-full border border-webropol-gray-200 shadow-sm">
      <i class="fal fa-check-circle text-webropol-primary-500"></i>
      <span>Thank you page &mdash; End of Survey</span>
    </div>
  </div>
</div>

<!-- ── Card ─────────────────────────────────────────────────────── -->
<div class="mt-4 relative rounded-2xl bg-white overflow-visible border border-webropol-gray-200 thank-you-card"
     style="box-shadow:0 1px 4px 0 rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.03);"
     x-data="__webropolThankYouData('${id}')">

  <!-- Settings gear (edit mode only) -->
  <button x-show="mode === 'edit'"
          @click="openSettings()"
          class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center
                 text-webropol-gray-400 hover:text-webropol-gray-600
                 rounded-full hover:bg-webropol-gray-100
                 transition-colors duration-150 z-10
                 focus:outline-none focus:ring-2 focus:ring-webropol-primary-300"
          aria-label="Thank you page settings">
    <i class="fal fa-cog text-base"></i>
  </button>

  <!-- ── Body ──────────────────────────────────────────────────── -->
  <div class="px-10 py-12 text-center">

    <!-- Heading -->
    <h2 class="text-2xl font-semibold text-webropol-gray-900 mb-7"
        x-text="heading"></h2>

    <!-- Contact us (only when email is set) -->
    <div x-show="contactEmail" class="mb-6">
      <a :href="'mailto:' + contactEmail"
         class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-webropol-primary-50 hover:bg-webropol-primary-100
                text-webropol-primary-700 text-sm font-medium
                border border-webropol-primary-200
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-webropol-primary-300">
        <i class="fal fa-envelope text-sm"></i>
        <span x-text="contactEmail"></span>
      </a>
    </div>

    <!-- Logo + "Powered by" — hidden when layout = simple -->
    <div x-show="layout !== 'simple'" class="mt-4 flex items-center justify-center">
      <a href="https://webropol.com" target="_blank" rel="noopener noreferrer"
         class="powered-by-strip group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-webropol-primary-300"
         style="background:linear-gradient(135deg,#eefbfd 0%,#f0fdf4 50%,#fdf4ff 100%);
                border:1px solid rgba(6,182,212,0.18);
                box-shadow:0 2px 12px -2px rgba(6,182,212,0.15);">
        <!-- Animated glow ring -->
        <span class="powered-by-glow-ring absolute inset-0 rounded-full pointer-events-none"></span>
        <!-- Logo -->
        <img :src="logoSrc" alt="Webropol"
             class="h-5 w-auto transition-transform duration-300 group-hover:scale-110" />
        <!-- Divider -->
        <span style="width:1px;height:14px;background:linear-gradient(to bottom,transparent,rgba(6,182,212,0.35),transparent);display:inline-block;"></span>
        <!-- Label -->
        <span class="text-xs font-semibold tracking-wide"
              style="background:linear-gradient(90deg,#1d809d 0%,#0e7490 100%);
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          Survey Powered by Webropol
        </span>
        <!-- Dot -->
        <span style="width:3px;height:3px;border-radius:50%;background:#06b6d4;opacity:0.5;display:inline-block;"></span>
        <!-- CTA -->
        <span class="text-xs font-medium transition-all duration-200 group-hover:underline"
              style="color:#e07020;">Click here to read more</span>
        <!-- Arrow that slides in on hover -->
        <i class="fal fa-arrow-right text-[10px] transition-all duration-300 opacity-0 -translate-x-1
                  group-hover:opacity-100 group-hover:translate-x-0"
           style="color:#e07020;"></i>
      </a>
    </div>
    <style>
      .powered-by-strip { position: relative; overflow: hidden; }
      .powered-by-strip:hover {
        box-shadow: 0 4px 20px -4px rgba(6,182,212,0.3) !important;
        transform: translateY(-1px);
      }
    </style>

  </div><!-- /body -->

  <!-- ── Settings Modal ───────────────────────────────────────────── -->
  <div x-show="settingsOpen"
       x-transition:enter="transition ease-out duration-150"
       x-transition:enter-start="opacity-0"
       x-transition:enter-end="opacity-100"
       x-transition:leave="transition ease-in duration-100"
       x-transition:leave-start="opacity-100"
       x-transition:leave-end="opacity-0"
       @click.self="cancelSettings()"
       @keydown.escape.window="cancelSettings()"
       class="fixed inset-0 z-50 flex items-center justify-center"
       style="background:rgba(0,0,0,0.35);">

    <div x-show="settingsOpen"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 scale-95"
         x-transition:enter-end="opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-100"
         x-transition:leave-start="opacity-100 scale-100"
         x-transition:leave-end="opacity-0 scale-95"
         class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
         @click.stop>

      <!-- Header -->
      <div class="flex items-center justify-between px-7 py-5 border-b border-webropol-gray-100">
        <h3 class="text-lg font-semibold text-webropol-gray-900 flex items-center gap-2.5">
          <i class="fal fa-cog text-webropol-gray-500"></i>
          Thank you page settings
        </h3>
        <button @click="cancelSettings()"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       text-webropol-gray-400 hover:text-webropol-gray-600
                       hover:bg-webropol-gray-100 transition-colors duration-150
                       focus:outline-none focus:ring-2 focus:ring-webropol-primary-300">
          <i class="fal fa-times text-base"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="px-7 py-6">
        <div class="border border-webropol-gray-200 rounded-xl p-5">
          <p class="text-sm font-semibold text-webropol-gray-700 mb-4">Thank You Page Layout</p>

          <!-- Option 1 -->
          <label class="flex items-start gap-3 mb-4 cursor-pointer group">
            <input type="radio"
                   name="ty-layout-${id}"
                   value="with-layout"
                   x-model="pendingLayout"
                   class="mt-0.5 w-4 h-4 flex-shrink-0 text-webropol-primary-600
                          border-webropol-gray-300
                          focus:ring-webropol-primary-400 focus:ring-2 cursor-pointer" />
            <span class="text-sm text-webropol-gray-700 group-hover:text-webropol-gray-900 leading-snug">
              Apply survey layout to Thank You page
            </span>
          </label>

          <!-- Option 2 -->
          <label class="flex items-start gap-3 cursor-pointer group">
            <input type="radio"
                   name="ty-layout-${id}"
                   value="simple"
                   x-model="pendingLayout"
                   class="mt-0.5 w-4 h-4 flex-shrink-0 text-webropol-primary-600
                          border-webropol-gray-300
                          focus:ring-webropol-primary-400 focus:ring-2 cursor-pointer" />
            <span class="text-sm text-webropol-gray-700 group-hover:text-webropol-gray-900 leading-snug">
              Disregard survey layout and keep Thank You page simple and without logos
            </span>
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-7 py-5 border-t border-webropol-gray-100">
        <button @click="cancelSettings()"
                class="px-5 py-2.5 rounded-full text-sm font-semibold
                       bg-white border-2 border-webropol-primary-600 text-webropol-primary-700
                       hover:bg-webropol-primary-50 transition-colors duration-150
                       focus:outline-none focus:ring-2 focus:ring-webropol-primary-300">
          Cancel
        </button>
        <button @click="applySettings()"
                class="px-6 py-2.5 rounded-full text-sm font-semibold
                       text-white transition-colors duration-150
                       focus:outline-none focus:ring-2 focus:ring-webropol-primary-300 focus:ring-offset-1"
                style="background-color:#1d809d;"
                onmouseover="this.style.backgroundColor='#176b84'"
                onmouseout="this.style.backgroundColor='#1d809d'">
          Apply
        </button>
      </div>

    </div><!-- /modal panel -->
  </div><!-- /modal overlay -->

</div><!-- /card -->
`;
    }
}

customElements.define('webropol-thank-you-page', ThankYouPage);
