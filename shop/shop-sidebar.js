// Shop-specific modern sidebar with enhanced animations
// Provides elegant navigation for Modules and SMS Credits with modern styling

class ShopSidebar extends HTMLElement {
  static get observedAttributes() { return ['collapsed']; }

  constructor() {
    super();
    this._launcher = null; // floating launcher when collapsed
    this._menu = null; // floating menu content
  }

  connectedCallback() {
    // Restore collapsed preference (desktop only)
    try {
      const saved = localStorage.getItem('webropol.shopSidebar.collapsed');
      if (saved === 'true') this.setAttribute('collapsed', '');
      else if (saved === 'false') this.removeAttribute('collapsed');
    } catch (_) {}
    this.render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'collapsed' && oldVal !== newVal) {
  // Persist preference
  try { localStorage.setItem('webropol.shopSidebar.collapsed', this.hasAttribute('collapsed') ? 'true' : 'false'); } catch (_) {}
  this.render();
    }
  }

  isCollapsed() { return this.hasAttribute('collapsed'); }

  collapse() { this.setAttribute('collapsed', ''); }
  expand() { this.removeAttribute('collapsed'); }

  render() {
    const href = (file) => `#/shop/products/${file.replace(/\.html$/,'')}`;
    const isActive = (filename) => /#\/shop\//.test(location.hash) && location.hash.endsWith(filename.replace(/\.html$/,''));

    if (this.isCollapsed()) {
      // Hide the sidebar and show a floating launcher + menu
      this.innerHTML = '';
      this.style.display = 'none';
      this.createLauncher();
      this.buildMenu(href, isActive);
      return;
    }

    // Sidebar visible
    this.style.display = '';
    this.removeLauncher();
    this.removeMenu();

    this.innerHTML = `
      <aside class="shop-sidebar-root hidden lg:block w-80 shrink-0 sticky top-6 h-[calc(100vh-120px)]">
        <div class="glass-card rounded-3xl p-6 h-full flex flex-col overflow-hidden">
          <!-- Header with collapse toggle -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 grid place-items-center text-white shadow-lg">
                <i class="fal fa-shopping-bag text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900">Shop</h2>
                <p class="text-sm text-slate-500">Modules & Add-ons</p>
              </div>
            </div>
            <button class="shop-collapse-btn w-10 h-10 flex items-center justify-center text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all" title="Hide sidebar" aria-label="Hide sidebar">
              <i class="fal fa-angle-double-left"></i>
            </button>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-8 overflow-y-auto pr-2">
            <!-- Modules Section -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-semibold text-slate-900 uppercase tracking-wider">Modules</h3>
                <span class="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">8</span>
              </div>
              <ul class="space-y-2">
                ${this.linkItem('BI View', href('bi-view.html'), isActive('bi-view'), 'fal fa-chart-bar', 'analytics')}
                ${this.linkItem('AI Text Analysis', href('ai-text-analysis.html'), isActive('ai-text-analysis'), 'fal fa-brain', 'ai')}
                ${this.linkItem('eTest', href('etest.html'), isActive('etest'), 'fal fa-question-circle', 'assessment')}
                ${this.linkItem('360 Assessments', href('360-assessments.html'), isActive('360-assessments'), 'fal fa-sync', 'assessment')}
                ${this.linkItem('Direct Mobile', href('direct-mobile-feedback.html'), isActive('direct-mobile-feedback'), 'fal fa-mobile-alt', 'mobile')}
                ${this.linkItem('Analytics', href('analytics.html'), isActive('analytics'), 'fal fa-chart-line', 'analytics')}
                ${this.linkItem('Case Management', href('case-management.html'), isActive('case-management'), 'fal fa-tasks', 'case')}
                ${this.linkItem('WOTT Module', href('wott.html'), isActive('wott'), 'fal fa-cog', 'case')}
              </ul>
            </div>

            <!-- SMS Credits Section -->
            <div>
              <h3 class="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">SMS Credits</h3>
              <ul class="space-y-2">
                <li>
                  <a href="#/shop/sms-credits" class="nav-item group flex items-center gap-3 rounded-2xl px-4 py-3 ${/#\/shop\/sms-credits$/.test(location.hash) ? 'active text-teal-700 bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-slate-50 text-slate-700'}">
                    <i class="fal fa-sms w-4 text-center ${/#\/shop\/sms-credits$/.test(location.hash) ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}"></i>
                    <span class="font-medium text-sm flex-1">Buy Credits</span>
                    <i class="fal fa-chevron-right text-xs opacity-0 group-hover:opacity-100 ${/#\/shop\/sms-credits$/.test(location.hash) ? 'opacity-100 text-teal-500' : ''}"></i>
                  </a>
                </li>
              </ul>
            </div>

          </nav>
        </div>
      </aside>
      
      <style>
        /* Scope all styles to this component root to avoid leaking into main sidebar */
        .shop-sidebar-root .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 
            0 8px 32px rgba(6, 182, 212, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }
        
        .shop-sidebar-root .nav-item {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .shop-sidebar-root .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
          transition: left 0.6s ease;
        }
        
        .shop-sidebar-root .nav-item:hover::before {
          left: 100%;
        }
        
        .shop-sidebar-root .nav-item:hover {
          transform: translateX(4px);
          background: rgba(6, 182, 212, 0.05);
        }
        
        .shop-sidebar-root .nav-item.active {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
          border-left: 4px solid #06b6d4;
          transform: translateX(4px);
        }
      </style>
    `;

    // Wire collapse button
    const collapseBtn = this.querySelector('.shop-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.collapse();
      });
    }
  }

  createLauncher() {
    if (this._launcher) return;
    const btn = document.createElement('button');
    btn.setAttribute('data-shop-launcher', '');
    btn.title = 'Open shop menu / Show sidebar';
    btn.setAttribute('aria-label', 'Open shop menu');
    Object.assign(btn.style, {
      position: 'fixed',
      top: '140px',
      left: '16px',
      zIndex: '2147483645'
    });
    btn.className = 'w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 shadow-md hover:text-teal-600 hover:border-teal-300 hover:shadow-lg transition-all';
    btn.innerHTML = '<i class="fa-light fa-ellipsis-vertical"></i>';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });
    document.body.appendChild(btn);
    this._launcher = btn;
  }

  removeLauncher() {
    if (this._launcher && this._launcher.parentNode) this._launcher.parentNode.removeChild(this._launcher);
    this._launcher = null;
  }

  buildMenu(href, isActive) {
    if (this._menu) { this.updateMenuActiveStates(); return; }
    const menu = document.createElement('div');
    menu.setAttribute('data-shop-menu', '');
    Object.assign(menu.style, {
      position: 'fixed',
      top: '184px',
      left: '16px',
      width: '280px',
      maxHeight: '70vh',
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid rgba(203,213,225,0.8)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      zIndex: '2147483645',
      display: 'none'
    });
    menu.innerHTML = `
      <div class="p-3 border-b border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fal fa-shopping-bag text-teal-600"></i>
          <span class="font-semibold text-slate-800">Shop Menu</span>
        </div>
        <button class="shop-menu-close w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Close"><i class="fal fa-times"></i></button>
      </div>
      <div class="p-2">
        <div class="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Modules</div>
        <ul class="space-y-1 px-1">
          ${this.linkItem('BI View', href('bi-view.html'), isActive('bi-view'), 'fal fa-chart-bar')}
          ${this.linkItem('AI Text Analysis', href('ai-text-analysis.html'), isActive('ai-text-analysis'), 'fal fa-brain')}
          ${this.linkItem('eTest', href('etest.html'), isActive('etest'), 'fal fa-question-circle')}
          ${this.linkItem('360 Assessments', href('360-assessments.html'), isActive('360-assessments'), 'fal fa-sync')}
          ${this.linkItem('Direct Mobile', href('direct-mobile-feedback.html'), isActive('direct-mobile-feedback'), 'fal fa-mobile-alt')}
          ${this.linkItem('Analytics', href('analytics.html'), isActive('analytics'), 'fal fa-chart-line')}
          ${this.linkItem('Case Management', href('case-management.html'), isActive('case-management'), 'fal fa-tasks')}
          ${this.linkItem('WOTT Module', href('wott.html'), isActive('wott'), 'fal fa-cog')}
        </ul>
        <div class="mt-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">SMS Credits</div>
        <ul class="space-y-1 px-1 mb-2">
          <li>
            <a href="#/shop/sms-credits" class="nav-item group flex items-center gap-3 rounded-xl px-3 py-2 ${/#\/shop\/sms-credits$/.test(location.hash) ? 'active text-teal-700 bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-slate-50 text-slate-700'}">
              <i class="fal fa-sms w-4 text-center ${/#\/shop\/sms-credits$/.test(location.hash) ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}"></i>
              <span class="font-medium text-sm flex-1">Buy Credits</span>
              <i class="fal fa-chevron-right text-xs opacity-0 group-hover:opacity-100 ${/#\/shop\/sms-credits$/.test(location.hash) ? 'opacity-100 text-teal-500' : ''}"></i>
            </a>
          </li>
        </ul>
        <div class="flex items-center justify-start gap-2 p-2 border-t border-slate-200">
          <a href="#" class="flex items-center px-3 py-2 text-teal-700 hover:bg-teal-50 rounded-lg transition-all">
            <i class="fal fa-envelope w-4 mr-2"></i>
            <span class="font-medium text-sm">Contact Us</span>
          </a>
        </div>
      </div>`;

    document.body.appendChild(menu);
    this._menu = menu;

    // Wire menu interactions
    menu.addEventListener('click', (e) => {
      const close = e.target.closest('.shop-menu-close');
      const navItem = e.target.closest('.nav-item');
      if (close) { this.hideMenu(); }
      if (navItem) {
        setTimeout(() => this.hideMenu(), 150);
      }
    });
  }

  updateMenuActiveStates() {
    if (!this._menu) return;
    // Update active class based on current hash
    this._menu.querySelectorAll('a.nav-item').forEach(a => {
      const href = a.getAttribute('href') || '';
      const active = href && href === window.location.hash ? true : window.location.hash.endsWith((href || '').replace('#/shop/', ''));
      a.classList.toggle('active', active);
    });
  }

  toggleMenu() { if (!this._menu) return; this._menu.style.display = (this._menu.style.display === 'none' || !this._menu.style.display) ? 'block' : 'none'; }
  hideMenu() { if (this._menu) this._menu.style.display = 'none'; }
  removeMenu() { if (this._menu && this._menu.parentNode) this._menu.parentNode.removeChild(this._menu); this._menu = null; }

  linkItem(label, href, active, icon, category) {
    return `
      <li>
        <a href="${href}" class="nav-item group flex items-center gap-3 rounded-2xl px-4 py-3 ${active ? 'active text-teal-700 bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-slate-50 text-slate-700'}">
          <i class="${icon} w-4 text-center ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}"></i>
          <span class="font-medium text-sm flex-1">${label}</span>
          <i class="fal fa-chevron-right text-xs opacity-0 group-hover:opacity-100 ${active ? 'opacity-100 text-teal-500' : ''}"></i>
        </a>
      </li>`;
  }
}

customElements.define('shop-sidebar', ShopSidebar);
