/*
 * portal-dropdown.js
 * Utility: portalDropdown()
 * Returns AlpineJS x-data object for a dropdown that appends its menu to document.body
 * and positions it taking viewport bounds into account. It also cleans up listeners.
 *
 * Usage:
 * <div x-data="portalDropdown()">
 *   <button x-ref="button" @click="open ? closeMenu() : openMenu()">Toggle</button>
 *   <div x-ref="menu" x-show="open" @click.away="closeMenu()">...</div>
 * </div>
 *
 * Or call with options: portalDropdown({defaultWidth:240, align: 'right'})
 */

export function portalDropdown(options = {}) {
  const opts = Object.assign({ defaultWidth: 224, align: 'right' }, options);
  return {
    open: false,
    _onScroll: null,
    openMenu() {
      this.open = true;
      this.$nextTick(() => {
        const btn = this.$refs.button; const menu = this.$refs.menu;
        if (!btn || !menu) return;
        if (!this.$refs.placeholder) {
          const ph = document.createElement('div'); ph.style.display = 'none'; this.$el.appendChild(ph); this.$refs.placeholder = ph;
        }
        // Append to body
        if (menu.parentElement !== document.body) document.body.appendChild(menu);
        menu.style.position = 'fixed';
        menu.style.zIndex = '9999';
        this.reposition(btn);
        this._onScroll = () => this.reposition(btn);
        window.addEventListener('scroll', this._onScroll, true);
        window.addEventListener('resize', this._onScroll);
      });
    },
    closeMenu() {
      this.open = false;
      const menu = this.$refs.menu;
      if (menu && this.$refs.placeholder && menu.parentElement === document.body) {
        this.$refs.placeholder.appendChild(menu);
        menu.style.position = '';
        menu.style.top = '';
        menu.style.left = '';
        menu.style.zIndex = '';
      }
      if (this._onScroll) { window.removeEventListener('scroll', this._onScroll, true); window.removeEventListener('resize', this._onScroll); this._onScroll = null; }
    },
    reposition(btn) {
      const menu = this.$refs.menu; if (!menu || !btn) return;
      menu.style.maxWidth = (window.innerWidth - 20) + 'px';
      const rect = btn.getBoundingClientRect();
      const width = menu.offsetWidth || opts.defaultWidth;
      let top = rect.bottom + 8; let left = (opts.align === 'left' ? rect.left : rect.right - width);
      if (left + width > window.innerWidth - 10) left = window.innerWidth - width - 10;
      if (left < 10) left = 10;
      if (top + menu.offsetHeight > window.innerHeight - 10) { top = rect.top - menu.offsetHeight - 8; if (top < 10) top = 10; }
      menu.style.top = top + 'px'; menu.style.left = left + 'px';
    }
  };
}

// Make available on window for pages that don't use ES module import
if (typeof window !== 'undefined') {
  window.portalDropdown = portalDropdown;
}
