/**
 * Webropol Smart Notifier
 * Unified in-page notifier based on the Webropol Royal Design System Figma.
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolSmartNotifier extends BaseComponent {
  static get observedAttributes() {
    return [
      'variant',
      'size',
      'title',
      'description',
      'icon',
      'dismissible',
      'show-icon',
      'show-description',
      'show-actions',
      'primary-label',
      'primary-url',
      'primary-icon',
      'secondary-label',
      'secondary-url',
      'secondary-icon'
    ];
  }

  constructor() {
    super();
    this._dismissed = false;
    this._capturedContent = false;
    this._bodyContent = '';
  }

  connectedCallback() {
    if (!this._capturedContent) {
      this._bodyContent = this.innerHTML.trim();
      this.innerHTML = '';
      this._capturedContent = true;
    }
    super.connectedCallback();
  }

  init() {
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
  }

  normalizeVariant(variant) {
    const value = (variant || 'informative').toLowerCase();
    const aliases = {
      info: 'informative',
      informational: 'informative',
      neutral: 'neutral',
      success: 'success',
      warning: 'warning',
      error: 'error',
      'royal-light': 'royal-light',
      royallight: 'royal-light',
      'royal-dark': 'royal-dark',
      royaldark: 'royal-dark'
    };

    return aliases[value] || 'informative';
  }

  getVariantConfig(variant) {
    const configs = {
      informative: {
        title: 'Info',
        icon: 'fal fa-circle-info',
        containerStyle: 'background:#eefbfd;border-color:#1d809d;color:#204859;',
        iconStyle: 'background:#d5f4f8;border-color:#b0e8f1;color:#1d809d;',
        titleClass: 'text-[#204859]',
        bodyClass: 'text-[#204859]',
        closeClass: 'text-[#204859] hover:bg-[#d5f4f8]',
        secondaryClass: 'text-[#1e6880] hover:bg-[#d5f4f8]',
        primaryClass: 'bg-[#1e6880] text-white hover:bg-[#204859]'
      },
      success: {
        title: 'Success',
        icon: 'fal fa-circle-check',
        containerStyle: 'background:#edf9f1;border-color:#1a7e4a;color:#155c37;',
        iconStyle: 'background:#d4f2df;border-color:#b7e6ca;color:#1a7e4a;',
        titleClass: 'text-[#155c37]',
        bodyClass: 'text-[#155c37]',
        closeClass: 'text-[#155c37] hover:bg-[#d4f2df]',
        secondaryClass: 'text-[#1a7e4a] hover:bg-[#d4f2df]',
        primaryClass: 'bg-[#1a7e4a] text-white hover:bg-[#155c37]'
      },
      warning: {
        title: 'Warning',
        icon: 'fal fa-triangle-exclamation',
        containerStyle: 'background:#fff7e8;border-color:#d97706;color:#8b4a06;',
        iconStyle: 'background:#ffedd5;border-color:#fed7aa;color:#d97706;',
        titleClass: 'text-[#8b4a06]',
        bodyClass: 'text-[#8b4a06]',
        closeClass: 'text-[#8b4a06] hover:bg-[#ffedd5]',
        secondaryClass: 'text-[#b45309] hover:bg-[#ffedd5]',
        primaryClass: 'bg-[#b45309] text-white hover:bg-[#92400e]'
      },
      error: {
        title: 'Error',
        icon: 'fal fa-circle-exclamation',
        containerStyle: 'background:#fff1f3;border-color:#be123c;color:#881337;',
        iconStyle: 'background:#ffe4e7;border-color:#fecdd3;color:#be123c;',
        titleClass: 'text-[#881337]',
        bodyClass: 'text-[#881337]',
        closeClass: 'text-[#881337] hover:bg-[#ffe4e7]',
        secondaryClass: 'text-[#be123c] hover:bg-[#ffe4e7]',
        primaryClass: 'bg-[#be123c] text-white hover:bg-[#9f1239]'
      },
      neutral: {
        title: 'Neutral',
        icon: 'fal fa-bell',
        containerStyle: 'background:#ffffff;border-color:#787f81;color:#45484a;',
        iconStyle: 'background:#f3f4f4;border-color:#e6e7e8;color:#787f81;',
        titleClass: 'text-[#45484a]',
        bodyClass: 'text-[#45484a]',
        closeClass: 'text-[#45484a] hover:bg-[#f3f4f4]',
        secondaryClass: 'text-[#1e6880] hover:bg-[#f3f4f4]',
        primaryClass: 'bg-[#1e6880] text-white hover:bg-[#204859]'
      },
      'royal-light': {
        title: 'Royal Light',
        icon: 'fal fa-megaphone',
        containerStyle: 'background:linear-gradient(135deg,#f4ecfc 0%,#eef7ff 100%);border-color:#6922c4;color:#3d2459;',
        iconStyle: 'background:rgba(255,255,255,0.55);border-color:#d5bef4;color:#6922c4;',
        titleClass: 'text-[#3d2459]',
        bodyClass: 'text-[#4f3b69]',
        closeClass: 'text-[#6922c4] hover:bg-white/60',
        secondaryClass: 'text-[#6922c4] hover:bg-white/60',
        primaryClass: 'bg-gradient-to-br from-[#f1e9fb] to-[#eef2ff] text-[#6922c4] border border-[#6922c4] hover:from-[#ede4fb] hover:to-[#e8efff]'
      },
      'royal-dark': {
        title: 'Royal Dark',
        icon: 'fal fa-megaphone',
        containerStyle: 'background:linear-gradient(90deg,#823bdd 0%,#5c3dd9 42%,#1096ba 100%);border-color:#f1e9fb;color:#ffffff;',
        iconStyle: 'background:rgba(0,0,0,0.10);border-color:#6922c4;color:#f1e9fb;',
        titleClass: 'text-white',
        bodyClass: 'text-white/95',
        closeClass: 'text-white hover:bg-white/10',
        secondaryClass: 'bg-gradient-to-br from-[#f1e9fb] to-[#eef2ff] text-[#6922c4] border border-[#6922c4] hover:from-[#ede4fb] hover:to-[#e8efff]',
        primaryClass: 'bg-gradient-to-br from-[#f1e9fb] to-[#eef2ff] text-[#6922c4] border border-[#6922c4] hover:from-[#ede4fb] hover:to-[#e8efff]'
      }
    };

    return configs[variant] || configs.informative;
  }

  getSizeConfig(size) {
    const configs = {
      desktop: {
        widthClass: 'max-w-[620px]',
        compact: false,
        stackActions: false
      },
      tablet: {
        widthClass: 'max-w-[580px]',
        compact: false,
        stackActions: false
      },
      mobile: {
        widthClass: 'max-w-[448px]',
        compact: false,
        stackActions: true
      },
      'mobile-compact': {
        widthClass: 'max-w-[448px]',
        compact: true,
        stackActions: false
      },
      auto: {
        widthClass: 'max-w-full',
        compact: false,
        stackActions: false
      }
    };

    return configs[size] || configs.auto;
  }

  renderAction(label, url, icon, actionName, variantClass, outline = false) {
    if (!label) {
      return '';
    }

    const tag = url ? 'a' : 'button';
    const href = url ? `href="${url}"` : 'type="button"';
    const borderClass = outline ? 'border border-white/20' : 'border border-white/20';
    const iconHtml = icon ? `<i class="${icon} text-[16px]"></i>` : '';

    return `
      <${tag}
        ${href}
        class="wsn-action inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full px-5 py-3 text-[16px] font-medium leading-6 transition-all duration-200 ${borderClass} ${variantClass}"
        data-action="${actionName}">
        ${iconHtml}
        <span>${label}</span>
      </${tag}>
    `;
  }

  render() {
    if (this._dismissed) {
      this.style.display = 'none';
      return;
    }

    const variant = this.normalizeVariant(this.getAttr('variant', 'informative'));
    const size = this.getAttr('size', 'auto');
    const config = this.getVariantConfig(variant);
    const sizeConfig = this.getSizeConfig(size);
    const title = this.getAttr('title', config.title);
    const description = this.getAttr('description', '');
    const customIcon = this.getAttr('icon', config.icon);
    const dismissible = this.getBoolAttr('dismissible', true);
    const showIcon = this.getBoolAttr('show-icon', true);
    const showActions = this.getBoolAttr('show-actions', true);
    const showDescription = this.hasAttribute('show-description')
      ? this.getBoolAttr('show-description', true)
      : !sizeConfig.compact;
    const primaryLabel = this.getAttr('primary-label', variant === 'royal-dark' ? 'Ask AI Assistant' : 'Benefits');
    const primaryUrl = this.getAttr('primary-url', '');
    const primaryIcon = this.getAttr('primary-icon', variant === 'royal-dark' ? 'fal fa-sparkles' : 'fal fa-thumbs-up');
    const secondaryLabel = this.getAttr('secondary-label', 'Not Now');
    const secondaryUrl = this.getAttr('secondary-url', '');
    const secondaryIcon = this.getAttr('secondary-icon', variant === 'royal-dark' ? 'fal fa-circle-play' : '');
    const bodyContent = this._bodyContent || '';
    const panelClasses = this.classNames(
      'wsn-panel relative w-full overflow-hidden rounded-lg border shadow-[0px_4px_16px_rgba(39,42,43,0.15)] transition-all duration-200',
      sizeConfig.widthClass
    );
    const actionWrapClasses = sizeConfig.stackActions
      ? 'flex w-full flex-col items-stretch gap-3'
      : 'flex w-full flex-wrap items-center justify-end gap-3';

    this.innerHTML = `
      <style>
        .wsn-panel { padding: 16px; }
        .wsn-content { display: flex; align-items: flex-start; gap: 12px; }
        .wsn-icon-shell { width: 40px; min-width: 40px; display: flex; justify-content: center; }
        .wsn-icon { width: 40px; height: 40px; border-radius: 999px; border: 1px solid transparent; display: flex; align-items: center; justify-content: center; font-size: 20px; line-height: 1; }
        .wsn-copy { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .wsn-title { font-size: 16px; line-height: 24px; font-weight: 700; margin: 0; }
        .wsn-body, .wsn-body p { font-size: 13px; line-height: 20px; margin: 0; }
        .wsn-close { width: 24px; min-width: 24px; height: 24px; border: 0; background: transparent; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s ease; }
        .wsn-footer { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .wsn-action { text-decoration: none; box-sizing: border-box; }
        .wsn-panel.is-dismissing { opacity: 0; transform: translateY(-4px); }
        @media (max-width: 768px) {
          .wsn-panel.max-w-full,
          .wsn-panel.max-w-\[620px\],
          .wsn-panel.max-w-\[580px\],
          .wsn-panel.max-w-\[448px\] { max-width: 100%; }
        }
      </style>
      <div class="${panelClasses}" style="${config.containerStyle}">
        <div class="wsn-content">
          ${showIcon ? `
            <div class="wsn-icon-shell">
              <div class="wsn-icon" style="${config.iconStyle}">
                <i class="${customIcon}"></i>
              </div>
            </div>
          ` : ''}
          <div class="wsn-copy">
            <h3 class="wsn-title ${config.titleClass}">${title}</h3>
            ${showDescription ? `<div class="wsn-body ${config.bodyClass}">${bodyContent || description || 'Your changes have been saved successfully.'}</div>` : ''}
          </div>
          ${dismissible ? `
            <button class="wsn-close ${config.closeClass}" type="button" aria-label="Dismiss notification" data-action="dismiss">
              <i class="fal fa-xmark text-[16px]"></i>
            </button>
          ` : ''}
        </div>
        ${showActions ? `
          <div class="wsn-footer">
            <div class="${actionWrapClasses}">
              ${this.renderAction(secondaryLabel, secondaryUrl, secondaryIcon, 'secondary', config.secondaryClass, true)}
              ${this.renderAction(primaryLabel, primaryUrl, primaryIcon, 'primary', config.primaryClass)}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  dismiss() {
    const panel = this.querySelector('.wsn-panel');
    if (panel) {
      panel.classList.add('is-dismissing');
      setTimeout(() => {
        this._dismissed = true;
        this.style.display = 'none';
        this.emit('dismissed', { variant: this.normalizeVariant(this.getAttr('variant', 'informative')) });
      }, 200);
      return;
    }

    this._dismissed = true;
    this.style.display = 'none';
    this.emit('dismissed', { variant: this.normalizeVariant(this.getAttr('variant', 'informative')) });
  }

  bindEvents() {
    const dismissButton = this.querySelector('[data-action="dismiss"]');
    if (dismissButton) {
      this.addListener(dismissButton, 'click', (event) => {
        event.preventDefault();
        this.dismiss();
      });
    }

    this.querySelectorAll('.wsn-action[data-action]').forEach((actionElement) => {
      this.addListener(actionElement, 'click', () => {
        this.emit('action-click', {
          action: actionElement.getAttribute('data-action'),
          variant: this.normalizeVariant(this.getAttr('variant', 'informative'))
        });
      });
    });
  }
}

customElements.define('webropol-smart-notifier', WebropolSmartNotifier);