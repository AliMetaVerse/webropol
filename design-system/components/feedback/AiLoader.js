/**
 * Webropol AI Loader Component
 *
 * Full-screen overlay used while an AI flow is generating content
 * (e.g. AI Survey Creator, AI Question Generator).
 *
 * Renders a violet/fuchsia animated badge, headline, sub-copy,
 * a thin progress bar driven by `progress`, a dynamic step caption
 * that updates as `progress` advances, and three shimmering skeleton
 * preview cards.
 *
 * Usage:
 *   <webropol-ai-loader
 *     active="true"
 *     progress="42"
 *     title="Generating your survey…"
 *     subtitle="AI is crafting the perfect questions"
 *     steps='["Analyzing your prompt…","Selecting optimal questions…","Structuring survey logic…","Finalising your survey…"]'>
 *   </webropol-ai-loader>
 *
 * Attributes:
 *   active    Boolean. When present (or "true") the overlay is shown.
 *   progress  Number 0-100. Drives the progress bar and the active step.
 *   title     Headline text.
 *   subtitle  Supporting copy under the headline.
 *   steps     JSON array of step captions. Distributed evenly across 0-100%.
 *   inline    Boolean. Renders inside its parent box instead of fixed overlay.
 *   skeletons Number of skeleton preview rows (default 3, set to 0 to hide).
 */

import { BaseComponent } from '../../utils/base-component.js';

const STYLE_ID = 'webropol-ai-loader-styles';

function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    webropol-ai-loader { display: contents; }
    webropol-ai-loader[hidden] { display: none !important; }

    .wail-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      animation: wail-fade-in 220ms ease-out both;
    }
    .wail-inline {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
    }
    .wail-card {
      width: 100%;
      max-width: 22rem;
      padding: 0 32px;
      text-align: center;
      animation: wail-rise 320ms cubic-bezier(.4,0,.2,1) both;
    }
    .wail-badge {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
    }
    .wail-badge__ping,
    .wail-badge__pulse,
    .wail-badge__core {
      position: absolute;
      border-radius: 9999px;
    }
    .wail-badge__ping {
      inset: 0;
      background: linear-gradient(135deg, #a78bfa, #e879f9);
      opacity: 0.20;
      animation: wail-ping 1.6s cubic-bezier(0,0,0.2,1) infinite;
    }
    .wail-badge__pulse {
      inset: 4px;
      background: linear-gradient(135deg, #8b5cf6, #d946ef);
      opacity: 0.18;
      animation: wail-pulse 2s ease-in-out infinite;
    }
    .wail-badge__core {
      inset: 12px;
      background: linear-gradient(135deg, #7c3aed, #d946ef);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 12px 26px -10px rgba(124,58,237,0.55);
    }
    .wail-badge__core i { font-size: 1.25rem; }

    .wail-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px;
      line-height: 1.3;
    }
    .wail-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 24px;
      line-height: 1.5;
    }

    .wail-bar {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .wail-bar__fill {
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4);
      background-size: 200% 100%;
      animation: wail-bar-shine 2.4s linear infinite;
      transition: width 280ms ease;
      width: 0%;
    }
    .wail-step {
      font-size: 0.75rem;
      color: #94a3b8;
      margin: 0;
      min-height: 1em;
      transition: opacity 180ms ease;
    }

    .wail-skeletons {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: left;
    }
    .wail-skel-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #fff;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
    }
    .wail-skel-icon,
    .wail-skel-line {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: wail-shimmer 1.6s infinite;
      border-radius: 8px;
    }
    .wail-skel-icon { width: 32px; height: 32px; flex-shrink: 0; }
    .wail-skel-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .wail-skel-line { height: 12px; border-radius: 6px; }
    .wail-skel-line--short { height: 10px; width: 40%; }
    .wail-skel-line--long { width: 80%; }

    @keyframes wail-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes wail-rise {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes wail-ping {
      0%   { transform: scale(1);   opacity: 0.35; }
      75%, 100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes wail-pulse {
      0%, 100% { transform: scale(1);    opacity: 0.18; }
      50%      { transform: scale(1.08); opacity: 0.28; }
    }
    @keyframes wail-bar-shine {
      0%   { background-position: 0% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes wail-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .wail-overlay,
      .wail-card,
      .wail-badge__ping,
      .wail-badge__pulse,
      .wail-bar__fill,
      .wail-skel-icon,
      .wail-skel-line { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

const DEFAULT_STEPS = [
  'Analyzing your prompt…',
  'Selecting optimal questions…',
  'Structuring survey logic…',
  'Finalising…'
];

export class WebropolAiLoader extends BaseComponent {
  static get observedAttributes() {
    return ['active', 'progress', 'title', 'subtitle', 'steps', 'inline', 'skeletons'];
  }

  init() {
    ensureStyles();
  }

  parseSteps() {
    const raw = this.getAttr('steps');
    if (!raw) return DEFAULT_STEPS;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s) => String(s));
      }
    } catch (e) {
      // Fall back silently
    }
    return DEFAULT_STEPS;
  }

  getProgress() {
    const value = parseFloat(this.getAttr('progress', '0'));
    if (Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(100, value));
  }

  getCurrentStep(progress, steps) {
    if (!steps.length) return '';
    // Map progress 0..100 to step index, biased so the last step appears near the end
    const segment = 100 / steps.length;
    const idx = Math.min(steps.length - 1, Math.floor(progress / segment));
    return steps[idx];
  }

  render() {
    const isActive = this.getBoolAttr('active');
    if (!isActive) {
      this.hidden = true;
      this.innerHTML = '';
      return;
    }

    this.hidden = false;

    const inline = this.getBoolAttr('inline');
    const title = this.getAttr('title', 'Generating your content…');
    const subtitle = this.getAttr('subtitle', 'AI is preparing your result');
    const skeletonCount = Math.max(0, parseInt(this.getAttr('skeletons', '3'), 10) || 0);
    const progress = this.getProgress();
    const steps = this.parseSteps();
    const currentStep = this.getCurrentStep(progress, steps);

    const skeletonsHtml = skeletonCount > 0 ? `
      <div class="wail-skeletons" aria-hidden="true">
        ${Array.from({ length: skeletonCount }).map(() => `
          <div class="wail-skel-row">
            <div class="wail-skel-icon"></div>
            <div class="wail-skel-lines">
              <div class="wail-skel-line wail-skel-line--long"></div>
              <div class="wail-skel-line wail-skel-line--short"></div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '';

    this.innerHTML = `
      <div class="${inline ? 'wail-inline' : 'wail-overlay'}" role="status" aria-live="polite" aria-busy="true">
        <div class="wail-card">
          <div class="wail-badge" aria-hidden="true">
            <div class="wail-badge__ping"></div>
            <div class="wail-badge__pulse"></div>
            <div class="wail-badge__core"><i class="fal fa-sparkles"></i></div>
          </div>
          <h3 class="wail-title">${title}</h3>
          <p class="wail-subtitle">${subtitle}</p>
          <div class="wail-bar" aria-hidden="true">
            <div class="wail-bar__fill" style="width:${progress}%"></div>
          </div>
          <p class="wail-step">${currentStep}</p>
          <span class="sr-only">${title} ${Math.round(progress)} percent complete.</span>
          ${skeletonsHtml}
        </div>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._connected || oldValue === newValue) return;

    // For lightweight updates (progress only) avoid full re-render flicker.
    if (name === 'progress' && this.getBoolAttr('active')) {
      const fill = this.querySelector('.wail-bar__fill');
      const step = this.querySelector('.wail-step');
      if (fill && step) {
        const progress = this.getProgress();
        fill.style.width = `${progress}%`;
        step.textContent = this.getCurrentStep(progress, this.parseSteps());
        return;
      }
    }

    this.render();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('webropol-ai-loader')) {
  customElements.define('webropol-ai-loader', WebropolAiLoader);
}
