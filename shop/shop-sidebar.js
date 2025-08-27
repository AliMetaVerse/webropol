// Shop-specific modern sidebar with enhanced animations
// Provides elegant navigation for Modules and SMS Credits with modern styling

class ShopSidebar extends HTMLElement {
  connectedCallback() {
    const current = location.pathname.replace(/\\/g, '/');
    // Use SPA hash routes to avoid direct GETs
    const withinProducts = /#\//.test(location.hash);
    const href = (file) => `#/shop/products/${file.replace(/\.html$/,'')}`;
    const isActive = (filename) => /#\/shop\//.test(location.hash) && location.hash.endsWith(filename.replace(/\.html$/,''));

    // Build modern sidebar markup with enhanced styling and animations
    this.innerHTML = `
      <aside class="shop-sidebar-root hidden lg:block w-80 shrink-0 sticky top-6 h-[calc(100vh-120px)]">
        <div class="glass-card rounded-3xl p-6 h-full flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 grid place-items-center text-white shadow-lg">
              <i class="fal fa-shopping-bag text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">Shop</h2>
              <p class="text-sm text-slate-500">Modules & Add-ons</p>
            </div>
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
  }

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
