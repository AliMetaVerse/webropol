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
      <aside class="hidden lg:block w-80 shrink-0 sticky top-6 h-[calc(100vh-120px)] animate-fade-in">
        <div class="glass-card rounded-3xl p-6 h-full flex flex-col">
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
          <nav class="flex-1 space-y-8 overflow-y-auto">
            <!-- Quick Stats -->
            <div class="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-4 border border-teal-100">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-teal-700">8</div>
                  <div class="text-xs text-slate-600">Modules</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-teal-700">60€</div>
                  <div class="text-xs text-slate-600">From</div>
                </div>
              </div>
            </div>

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
              <a href="#/shop/sms-credits" class="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${/#\/shop\/sms-credits$/.test(location.hash) ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'hover:bg-orange-50 text-slate-700 hover:text-orange-700'}">
                <div class="w-10 h-10 rounded-xl ${/#\/shop\/sms-credits$/.test(location.hash) ? 'bg-white/20' : 'bg-orange-100 group-hover:bg-orange-200'} flex items-center justify-center transition-all">
                  <i class="fal fa-sms ${/#\/shop\/sms-credits$/.test(location.hash) ? 'text-white' : 'text-orange-600'}"></i>
                </div>
                <div class="flex-1">
                  <span class="font-semibold block">Buy Credits</span>
                  <span class="text-xs opacity-75">SMS messaging</span>
                </div>
                <i class="fal fa-chevron-right text-xs opacity-50 group-hover:opacity-100 transition-opacity"></i>
              </a>
            </div>

            <!-- Help Section -->
            <div class="bg-slate-50 rounded-2xl p-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i class="fal fa-question-circle text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h4 class="font-medium text-slate-900 text-sm mb-1">Need Help?</h4>
                  <p class="text-xs text-slate-600 mb-3">Our team can help you choose the right modules for your needs.</p>
                  <button class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </aside>
      
      <style>
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 
            0 8px 32px rgba(6, 182, 212, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }
        
        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .nav-item:hover::before {
          left: 100%;
        }
        
        .nav-item:hover {
          transform: translateX(4px);
        }
        
        .nav-item.active {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
          border-left: 3px solid #06b6d4;
        }
        
        .category-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        
        .analytics-dot { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .ai-dot { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .assessment-dot { background: linear-gradient(135deg, #10b981, #059669); }
        .mobile-dot { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .case-dot { background: linear-gradient(135deg, #ef4444, #dc2626); }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      </style>
    `;
  }

  linkItem(label, href, active, icon, category) {
    const categoryDots = {
      'analytics': 'analytics-dot',
      'ai': 'ai-dot', 
      'assessment': 'assessment-dot',
      'mobile': 'mobile-dot',
      'case': 'case-dot'
    };
    
    return `
      <li>
        <a href="${href}" class="nav-item group flex items-center gap-3 rounded-2xl px-4 py-3 ${active ? 'active text-teal-700 bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-slate-50 text-slate-700'}">
          <div class="category-dot ${categoryDots[category] || 'analytics-dot'} group-hover:scale-125"></div>
          <i class="${icon} w-4 text-center ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}"></i>
          <span class="font-medium text-sm flex-1">${label}</span>
          <i class="fal fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100 text-teal-500' : ''}"></i>
        </a>
      </li>`;
  }
}

customElements.define('shop-sidebar', ShopSidebar);
