import { BaseComponent } from '../../utils/base-component.js';

export class WebropolAvatar extends BaseComponent {
  static get observedAttributes() {
    return ['icon', 'size', 'variant', 'shape'];
  }

  render() {
    const icon = this.getAttr('icon', 'sparkles').replace(/^fa-/, '');
    const size = this.getAttr('size', 'md');
    const variant = this.getAttr('variant', 'primary');
    const shape = this.getAttr('shape', 'xl');

    this.style.display = 'inline-flex';

    const sizeClasses = {
      sm: 'h-10 w-10 text-base',
      md: 'h-12 w-12 text-lg',
      lg: 'h-14 w-14 text-2xl',
      xl: 'h-16 w-16 text-[1.75rem]'
    };

    const shapeClasses = {
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
      full: 'rounded-full'
    };

    const variantClasses = {
      primary: 'bg-webropol-primary-100 text-webropol-primary-700 ring-2 ring-white shadow-[0_18px_36px_-20px_rgba(29,128,157,0.45)]',
      success: 'bg-webropol-green-100 text-webropol-green-700 ring-2 ring-white shadow-[0_18px_36px_-20px_rgba(21,128,61,0.35)]',
      violet: 'bg-webropol-purple-100 text-webropol-purple-700 ring-2 ring-white shadow-[0_18px_36px_-20px_rgba(126,34,206,0.35)]',
      orange: 'bg-webropol-orange-100 text-webropol-orange-700 ring-2 ring-white shadow-[0_18px_36px_-20px_rgba(194,65,12,0.35)]',
      neutral: 'bg-webropol-gray-100 text-webropol-gray-700 ring-2 ring-white shadow-soft'
    };

    this.innerHTML = `
      <span class="${this.classNames(
        'inline-flex items-center justify-center transition-transform duration-300',
        sizeClasses[size] || sizeClasses.md,
        shapeClasses[shape] || shapeClasses.xl,
        variantClasses[variant] || variantClasses.primary
      )}" aria-hidden="true">
        <i class="fal fa-${icon}"></i>
      </span>
    `;
  }
}

if (!customElements.get('webropol-avatar')) {
  customElements.define('webropol-avatar', WebropolAvatar);
}