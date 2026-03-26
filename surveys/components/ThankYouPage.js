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

                        // z-index: keep header below modal overlay while settings are open
                        this.$watch('settingsOpen', value => {
                            if (value) document.body.classList.add('modal-open');
                            else document.body.classList.remove('modal-open');
                        });
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
  <div class="px-10 py-12 text-center relative overflow-hidden">

    <!-- Background blobs (ambient glow) -->
    <div class="ty-blob ty-blob-1" aria-hidden="true"></div>
    <div class="ty-blob ty-blob-2" aria-hidden="true"></div>
    <div class="ty-blob ty-blob-3" aria-hidden="true"></div>
    <div class="ty-blob ty-blob-4" aria-hidden="true"></div>

    <!-- Confetti burst — CSS-only, plays once on load -->
    <div class="ty-confetti" aria-hidden="true">
      <span class="ty-c ty-c-1"></span>
      <span class="ty-c ty-c-2"></span>
      <span class="ty-c ty-c-3"></span>
      <span class="ty-c ty-c-4"></span>
      <span class="ty-c ty-c-5"></span>
      <span class="ty-c ty-c-6"></span>
      <span class="ty-c ty-c-7"></span>
      <span class="ty-c ty-c-8"></span>
      <span class="ty-c ty-c-9"></span>
      <span class="ty-c ty-c-10"></span>
    </div>

    <!-- Thumbs up icon with sparkles -->
    <div class="ty-thumbs-wrap flex items-center justify-center mb-6">
      <div class="ty-icon-wrap relative inline-flex items-center justify-center">
        <!-- Sparkle stars -->
        <span class="ty-spark ty-spark-1">&#10022;</span>
        <span class="ty-spark ty-spark-2">&#10022;</span>
        <span class="ty-spark ty-spark-3">&#10038;</span>
        <span class="ty-spark ty-spark-4">&#10022;</span>
        <!-- Icon circle -->
        <div class="ty-thumbs-circle w-20 h-20 rounded-full flex items-center justify-center relative z-10"
             style="background:linear-gradient(135deg,#eefbfd 0%,#d0f5fb 60%,#c7f0fd 100%);
                    border:2px solid rgba(6,182,212,0.25);">
          <i class="fal fa-thumbs-up text-3xl" style="color:#0e7490;"></i>
        </div>
      </div>
    </div>

    <!-- Heading -->
    <h2 class="ty-heading text-2xl font-semibold text-webropol-gray-900 mb-7"
        x-text="heading"></h2>

    <!-- Contact us (only when email is set) -->
    <div x-show="contactEmail" class="ty-contact mb-6">
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

    <style>
      /* (powered-by footer styles are in the footer block below) */

      /* ── Thank You Page Animations ───────────────────────── */

      /* Icon: joyful pop-in then slow breathe-glow */
      @keyframes ty-celebrate-in {
        0%   { opacity:0; transform:scale(0.45); }
        55%  { opacity:1; transform:scale(1.14); }
        75%  { transform:scale(0.96); }
        100% { opacity:1; transform:scale(1); }
      }
      @keyframes ty-breathe {
        0%,100% { transform:scale(1);
                  box-shadow:0 4px 20px -4px rgba(6,182,212,0.3),
                             0 0 0 8px rgba(6,182,212,0.06); }
        50%     { transform:scale(1.05);
                  box-shadow:0 6px 32px -2px rgba(6,182,212,0.45),
                             0 0 0 16px rgba(6,182,212,0.09); }
      }

      /* Text entries */
      @keyframes ty-fade-up {
        from { opacity:0; transform:translateY(10px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes ty-heading-pulse {
        0%,100% { transform:scale(1); }
        50%     { transform:scale(1.025); }
      }

      /* Confetti fall */
      @keyframes ty-fall {
        0%   { transform:translateY(-8px) rotate(0deg) scaleX(1); opacity:1; }
        100% { transform:translateY(220px) rotate(600deg) scaleX(0.4); opacity:0; }
      }

      /* Sparkles twinkle */
      @keyframes ty-sparkle {
        0%,100% { opacity:0; transform:scale(0) rotate(0deg); }
        40%,60% { opacity:1; transform:scale(1) rotate(25deg); }
      }

      /* Background blob drifts */
      @keyframes ty-blob-1 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(14px,-12px) scale(1.07);} }
      @keyframes ty-blob-2 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-12px,14px) scale(0.95);} }
      @keyframes ty-blob-3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(10px,8px) scale(1.05);} }
      @keyframes ty-blob-4 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-8px,-12px) scale(1.09);} }

      /* ── Apply ──────────────────────────────────────────── */
      .ty-thumbs-circle {
        animation:
          ty-celebrate-in 0.7s cubic-bezier(0.34,1.2,0.64,1) both,
          ty-breathe 5s ease-in-out 0.9s infinite;
      }
      .ty-heading {
        animation:
          ty-fade-up 0.5s ease 0.4s both,
          ty-heading-pulse 0.45s ease 1.1s both;
      }
      .ty-contact {
        animation: ty-fade-up 0.5s ease 0.6s both;
        animation-fill-mode:both;
      }

      /* Confetti */
      .ty-confetti {
        position:absolute; top:0; left:0; right:0;
        height:0; pointer-events:none; overflow:visible;
      }
      .ty-c {
        position:absolute; top:2px;
        animation: ty-fall linear forwards;
        border-radius:2px;
      }
      .ty-c-1  { width:8px;  height:8px;  left:8%;  background:#06b6d4; border-radius:50%; animation-duration:1.6s; animation-delay:0.05s; }
      .ty-c-2  { width:6px;  height:10px; left:17%; background:#f59e0b; border-radius:1px;  animation-duration:1.8s; animation-delay:0.18s; }
      .ty-c-3  { width:7px;  height:7px;  left:27%; background:#0e7490; border-radius:50%; animation-duration:2.0s; animation-delay:0.03s; }
      .ty-c-4  { width:5px;  height:9px;  left:36%; background:#a78bfa; border-radius:1px;  animation-duration:1.7s; animation-delay:0.22s; }
      .ty-c-5  { width:9px;  height:5px;  left:46%; background:#34d399; border-radius:1px;  animation-duration:1.9s; animation-delay:0.10s; }
      .ty-c-6  { width:6px;  height:6px;  left:55%; background:#fbbf24; border-radius:50%; animation-duration:1.6s; animation-delay:0.30s; }
      .ty-c-7  { width:9px;  height:6px;  left:64%; background:#06b6d4; border-radius:1px;  animation-duration:1.5s; animation-delay:0.14s; }
      .ty-c-8  { width:7px;  height:7px;  left:73%; background:#f87171; border-radius:50%; animation-duration:2.1s; animation-delay:0.07s; }
      .ty-c-9  { width:5px;  height:10px; left:82%; background:#10b981; border-radius:1px;  animation-duration:1.8s; animation-delay:0.25s; }
      .ty-c-10 { width:8px;  height:5px;  left:91%; background:#818cf8; border-radius:1px;  animation-duration:1.6s; animation-delay:0.12s; }

      /* Sparkles */
      .ty-spark {
        position:absolute;
        pointer-events:none;
        line-height:1;
        animation: ty-sparkle 2.8s ease-in-out infinite;
      }
      .ty-spark-1 { font-size:12px; color:#06b6d4; top:-16px;  left:50%;  transform:translateX(-50%); animation-delay:0s;    }
      .ty-spark-2 { font-size:16px; color:#f59e0b; top:50%;   right:-20px; transform:translateY(-50%); animation-delay:0.7s;  }
      .ty-spark-3 { font-size:10px; color:#a78bfa; bottom:-14px; left:50%;  transform:translateX(-50%); animation-delay:1.4s;  }
      .ty-spark-4 { font-size:14px; color:#34d399; top:50%;   left:-20px;  transform:translateY(-50%); animation-delay:1.05s; }

      /* Background blobs */
      .ty-blob {
        position:absolute; border-radius:50%;
        pointer-events:none; filter:blur(48px); will-change:transform;
      }
      .ty-blob-1 {
        width:220px; height:220px;
        background:radial-gradient(circle,rgba(6,182,212,0.2) 0%,transparent 70%);
        top:-50px; right:6%;
        animation:ty-blob-1 9s ease-in-out infinite;
      }
      .ty-blob-2 {
        width:170px; height:170px;
        background:radial-gradient(circle,rgba(14,116,144,0.14) 0%,transparent 70%);
        bottom:-20px; left:4%;
        animation:ty-blob-2 11s ease-in-out infinite;
      }
      .ty-blob-3 {
        width:130px; height:130px;
        background:radial-gradient(circle,rgba(167,139,250,0.11) 0%,transparent 70%);
        top:40%; left:35%;
        animation:ty-blob-3 13s ease-in-out infinite;
      }
      .ty-blob-4 {
        width:160px; height:160px;
        background:radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%);
        bottom:0; right:10%;
        animation:ty-blob-4 10s ease-in-out infinite;
      }
    </style>

  </div><!-- /body -->

  <!-- ── Powered-by footer — hidden when layout = simple ─────────── -->
  <a x-show="layout !== 'simple'"
     href="https://webropol.com" target="_blank" rel="noopener noreferrer"
     class="ty-powered-footer group flex items-center justify-center gap-3 px-6 py-3.5
            border-t border-webropol-gray-100
            rounded-b-2xl overflow-hidden relative
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-webropol-primary-300"
     style="background:linear-gradient(90deg,#f0fdff 0%,#f8fffe 50%,#f0fdff 100%);">

    <!-- Subtle shimmer on hover -->
    <span class="ty-footer-shimmer absolute inset-0 pointer-events-none"></span>

    <!-- Logo -->
    <img :src="logoSrc" alt="Webropol"
         class="h-4 w-auto flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />

    <!-- Vertical rule -->
    <span style="width:1px;height:12px;background:rgba(6,182,212,0.3);flex-shrink:0;display:inline-block;"></span>

    <!-- Label -->
    <span class="text-xs font-semibold tracking-wide"
          style="background:linear-gradient(90deg,#1d809d 0%,#0e7490 100%);
                 -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
      Survey Powered by Webropol
    </span>

    <!-- Dot -->
    <span style="width:3px;height:3px;border-radius:50%;background:#06b6d4;opacity:0.55;flex-shrink:0;display:inline-block;"></span>

    <!-- CTA -->
    <span class="text-xs font-medium transition-colors duration-200"
          style="color:#e07020;">
      Click here to read more
    </span>

    <!-- Arrow -->
    <i class="fal fa-arrow-right text-[10px] transition-all duration-300 opacity-0 -translate-x-1
              group-hover:opacity-100 group-hover:translate-x-0 flex-shrink-0"
       style="color:#e07020;"></i>
  </a>

  <style>
    .ty-powered-footer:hover {
      background: linear-gradient(90deg,#e8fbff 0%,#f0fefc 50%,#e8fbff 100%) !important;
    }
    .ty-footer-shimmer {
      background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%);
      transform: translateX(-100%);
      transition: transform 0s;
    }
    .ty-powered-footer:hover .ty-footer-shimmer {
      transform: translateX(100%);
      transition: transform 0.6s ease;
    }
  </style>

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
       :class="{ 'active': settingsOpen }"
       class="modal-overlay fixed inset-0 flex items-center justify-center"
       style="background:rgba(0,0,0,0.35); z-index:2147483640 !important;">

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
        <div class="">
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
