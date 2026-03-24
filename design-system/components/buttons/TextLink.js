/**
 * Webropol Text Link Component
 * Based on Figma: Webropol Royal Design System → Text links (node 443-127)
 *
 * Attributes:
 *   variant       — "primary" (default) | "secondary" | "delete"
 *   size          — "lg" | "md" (default) | "sm"
 *   href          — link target (default "#")
 *   target        — anchor target, e.g. "_blank"
 *   icon-left     — FontAwesome icon name without "fa-" prefix, e.g. "chart-line"
 *   icon-right    — FontAwesome icon name without "fa-" prefix, e.g. "arrow-right"
 *   label         — visible link text (falls back to element textContent)
 *
 * Variants:
 *   primary   — Medium weight, no underline by default; underline + bg tint on hover
 *   secondary — Regular weight, always underlined; bg tint on hover
 *   delete    — Regular weight, error red palette; for destructive / remove actions
 *
 * States are CSS-driven (hover, active, focus-visible, visited).
 *
 * Usage:
 *   <webropol-text-link variant="secondary" size="sm" href="/surveys/report.html"
 *     icon-left="chart-line" label="Report"></webropol-text-link>
 *
 *   <webropol-text-link variant="primary" size="md" href="/surveys/aita.html"
 *     icon-right="arrow-right" label="AI Text Analysis"></webropol-text-link>
 *
 *   <!-- Alpine.js click handler on the host element -->
 *   <webropol-text-link @click.prevent="doSomething()"
 *     variant="secondary" size="sm" href="#" label="Report"></webropol-text-link>
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolTextLink extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'href', 'target', 'icon-left', 'icon-right', 'label'];
  }

  render() {
    const variant   = this.getAttr('variant', 'primary');
    const size      = this.getAttr('size', 'md');
    const href      = this.getAttr('href', '#');
    const target    = this.getAttr('target');
    const iconLeft  = this.getAttr('icon-left');
    const iconRight = this.getAttr('icon-right');
    // Prefer the `label` attribute; fall back to the element's text content so
    // <webropol-text-link>Report</webropol-text-link> works too.
    const label = this.getAttr('label') || this.textContent.trim();

    // ── Size map ────────────────────────────────────────────────────────────
    // Figma: Large=16px/24lh  Medium=14px/20lh  Small=13px/20lh
    //        icon sizes: 20px / 16px / 14px
    const sizes = {
      lg: { text: 'text-base',        icon: 'text-xl',   gap: 'gap-2'   },
      md: { text: 'text-sm',          icon: 'text-base', gap: 'gap-1.5' },
      sm: { text: 'text-[13px]',      icon: 'text-sm',   gap: 'gap-1'   },
    };
    const s = sizes[size] || sizes.md;

    // ── Variant map ─────────────────────────────────────────────────────────
    // Colors taken directly from design tokens in Figma:
    //   Primary/700 #1e6880 · Primary/800 #215669 · Primary/900 #204859
    //   Primary/200 #b0e8f1 · Primary/300 #79d6e7
    //   Neutral/950 #272a2b (focus ring)
    //   Error/700 #be1241 · Error/800 #9f123d · Error/900 #88133a
    //   Error/200 #fecdd4 · Error/300 #fda4b2
    const variants = {
      primary: [
        'font-medium',
        'text-[#1e6880] no-underline border-b border-transparent',
        'hover:bg-[#b0e8f1] hover:text-[#215669] hover:border-[#215669]',
        'active:bg-[#79d6e7] active:text-[#204859] active:border-transparent',
        'visited:text-[#1e6880]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#272a2b]',
      ].join(' '),

      secondary: [
        'font-normal',
        'text-[#1e6880] no-underline border-b border-[#1e6880]',
        'hover:bg-[#b0e8f1] hover:text-[#215669] hover:border-[#215669]',
        'active:bg-[#79d6e7] active:text-[#204859] active:border-[#204859]',
        'visited:text-[#1e6880]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#272a2b]',
      ].join(' '),

      delete: [
        'font-normal',
        'text-[#be1241] no-underline border-b border-transparent',
        'hover:bg-[#fecdd4] hover:text-[#9f123d] hover:border-[#9f123d]',
        'active:bg-[#fda4b2] active:text-[#88133a] active:border-transparent',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#272a2b]',
      ].join(' '),
    };
    const variantClasses = variants[variant] || variants.primary;

    // ── Icon HTML ────────────────────────────────────────────────────────────
    const leftIconHtml  = iconLeft  ? `<i class="fal fa-${iconLeft}  ${s.icon} flex-shrink-0" aria-hidden="true"></i>` : '';
    const rightIconHtml = iconRight ? `<i class="fal fa-${iconRight} ${s.icon} flex-shrink-0" aria-hidden="true"></i>` : '';

    // ── Assembled classes ────────────────────────────────────────────────────
    const classes = [
      'inline-flex items-center rounded-sm',
      'transition-colors duration-150',
      'px-0.5',   // minimal padding to keep focus ring visible without pushing layout
      s.gap,
      s.text,
      variantClasses,
    ].join(' ');

    const relAttr  = target === '_blank' ? ' rel="noopener noreferrer"' : '';
    const tgtAttr  = target             ? ` target="${target}"`        : '';

    this.innerHTML = `
      <a href="${href}"${tgtAttr}${relAttr}
         class="${classes}"
         aria-label="${label}">
        ${leftIconHtml}
        <span>${label}</span>
        ${rightIconHtml}
      </a>
    `;
  }

  bindEvents() {
    const link = this.querySelector('a');
    if (link) {
      this.addListener(link, 'click', () => {
        this.emit('webropol-text-link-click', {
          href:    this.getAttr('href'),
          variant: this.getAttr('variant'),
          label:   this.getAttr('label'),
        });
      });
    }
  }
}

customElements.define('webropol-text-link', WebropolTextLink);
