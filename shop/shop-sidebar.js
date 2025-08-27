// Shop-specific left sidebar (not the global app sidebar)
// Provides navigation for Modules and SMS Credits, highlights active page

class ShopSidebar extends HTMLElement {
  connectedCallback() {
    const current = location.pathname.replace(/\\/g, '/');
  // Use SPA hash routes to avoid direct GETs
  const withinProducts = /#\//.test(location.hash);
  const href = (file) => `#/shop/products/${file.replace(/\.html$/,'')}`;
  const isActive = (filename) => /#\/shop\//.test(location.hash) && location.hash.endsWith(filename.replace(/\.html$/,''));

    // Build sidebar markup using Tailwind utility classes
    this.innerHTML = `
  <aside class="hidden lg:block w-72 rounded-3xl shadow-lg shrink-0 border-r border-slate-200/70 bg-white/70 backdrop-blur sticky top-0 h-[calc(100vh-64px)]">
        <div class="px-4 py-5">
          <div class="flex items-center gap-2 mb-4 text-slate-700">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 grid place-items-center text-white">
              <i class="fal fa-shopping-bag"></i>
            </div>
            <h2 class="font-semibold">Shop</h2>
          </div>

          <nav class="space-y-6">
            <div>
              <div class="text-xs uppercase tracking-wider text-slate-500 mb-2">Modules</div>
              <ul class="space-y-1">
                ${this.linkItem('BI View', href('bi-view.html'), isActive('bi-view'))}
                ${this.linkItem('AI Text Analysis', href('ai-text-analysis.html'), isActive('ai-text-analysis'))}
                ${this.linkItem('eTest', href('etest.html'), isActive('etest'))}
                ${this.linkItem('360 Assessments', href('360-assessments.html'), isActive('360-assessments'))}
                ${this.linkItem('Direct Mobile Feedback', href('direct-mobile-feedback.html'), isActive('direct-mobile-feedback'))}
                ${this.linkItem('Analytics', href('analytics.html'), isActive('analytics'))}
                ${this.linkItem('Case Management', href('case-management.html'), isActive('case-management'))}
                ${this.linkItem('WOTT', href('wott.html'), isActive('wott'))}
              </ul>
            </div>

            <div>
              <div class="text-xs uppercase tracking-wider text-slate-500 mb-2">SMS Credits</div>
              <a href="#/shop/sms-credits" class="group flex items-center gap-3 rounded-xl px-3 py-2 ${/#\/shop\/sms-credits$/.test(location.hash) ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' : 'hover:bg-slate-50 text-slate-700'}">
                <i class="fal fa-sms text-teal-600"></i>
                <span class="font-medium">Buy credits</span>
              </a>
            </div>
          </nav>
        </div>
      </aside>
    `;
  }

  linkItem(label, href, active) {
    return `
      <li>
        <a href="${href}" class="group flex items-center gap-3 rounded-xl px-3 py-2 ${active ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' : 'hover:bg-slate-50 text-slate-700'}">
          <span class="w-1.5 h-1.5 rounded-full ${active ? 'bg-teal-500' : 'bg-slate-300 group-hover:bg-teal-300'}"></span>
          <span class="font-medium">${label}</span>
        </a>
      </li>`;
  }
}

customElements.define('shop-sidebar', ShopSidebar);
