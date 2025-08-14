/**
 * Webropol Sidebar Enhanced Component
 * Navigation sidebar with dynamic menu items and branding
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolSidebarEnhanced extends BaseComponent {
  static get observedAttributes() {
    return ['active', 'base', 'brand-title', 'brand-subtitle', 'brand-icon'];
  }

  render() {
    const active = this.getAttr('active', 'home');
    const base = this.getAttr('base', '');
    const brandTitle = this.getAttr('brand-title', 'Webropol');
    const brandSubtitle = this.getAttr('brand-subtitle', 'Survey Platform');
    const brandIcon = this.getAttr('brand-icon', 'fal fa-chart-bar');
    
    // Helper to prefix base to links - ensure proper path concatenation
    const link = (path) => {
      if (!base) return path;
      // Ensure base ends with / and path doesn't start with /
      const normalizedBase = base.endsWith('/') ? base : base + '/';
      const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      return normalizedBase + normalizedPath;
    };

    this.innerHTML = `
      <aside class="h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-webropol-gray-200/50 flex flex-col flex-shrink-0 shadow-soft">
        <div class="h-20 flex items-center px-8 border-b border-webropol-gray-200/50">
          <div class="w-10 h-10 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center">
            <i class="${brandIcon} text-white text-lg"></i>
          </div>
          <div class="ml-3">
            <h1 class="font-bold text-webropol-gray-900 text-lg">${brandTitle}</h1>
            <p class="text-xs text-webropol-gray-500 -mt-1">${brandSubtitle}</p>
          </div>
        </div>
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <a href="${link('index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='home' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fal fa-home w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Home</span>
          </a>
          <a href="${link('surveys/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='surveys' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fal fa-chart-bar w-5 mr-4"></i>
            <span>Surveys</span>
          </a>
          <a href="${link('events/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='events' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fal fa-calendar-alt w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Events</span>
          </a>
          <a href="${link('sms/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='sms' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fal fa-sms w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">2-Way SMS</span>
          </a>
          <a href="${link('dashboards/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='dashboards' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fal fa-chart-line w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Dashboards</span>
          </a>
          <div class="pt-4 border-t border-webropol-gray-200/50 mt-4">
            <a href="${link('mywebropol/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='mywebropol' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fal fa-book-open w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">MyWebropol</span>
            </a>
            <a href="${link('admin-tools/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='admin-tools' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fal fa-tools w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">Admin Tools</span>
            </a>
            <a href="${link('training-videos/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='training-videos' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fal fa-play-circle w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">Training Videos</span>
            </a>
            <a href="${link('shop/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='shop' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fal fa-shopping-cart w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">Shop</span>
            </a>
          </div>
          <!-- Slot for custom menu items -->
          <slot name="menu-items"></slot>
        </nav>
        <div class="p-4 border-t border-webropol-gray-200/50">
          <slot name="footer"></slot>
        </div>
      </aside>
    `;
  }

  bindEvents() {
    // Add click handlers for navigation items
    const navLinks = this.querySelectorAll('nav a[href]');
    navLinks.forEach(link => {
      this.addListener(link, 'click', (e) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        this.emit('navigation-click', { href, text, originalEvent: e });
      });
    });
  }
}

// Register the component
customElements.define('webropol-sidebar-enhanced', WebropolSidebarEnhanced);

