/**
 * Webropol Sidebar Component
 * Navigation sidebar with menu items and branding
 * Responsive: Shows icons only on screens <= 1280px, expands on hover as overlay
 */

import { BaseComponent } from '../../utils/base-component.js';
import './Brand.js';

export class WebropolSidebar extends BaseComponent {
  static get observedAttributes() {
    return ['active', 'base'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const active = this.getAttr('active', 'home');
    const base = this.getAttr('base', '');

    if (typeof document !== 'undefined' && document.body) {
      document.body.setAttribute('data-module-id', active);
      if (window.globalSettingsManager && typeof window.globalSettingsManager.applyModuleBranding === 'function') {
        window.globalSettingsManager.applyModuleBranding();
      }
    }
    
    // Helper to prefix base to links - ensure proper path concatenation
    const link = (path) => {
      if (!base) return path;
      // Ensure base ends with / and path doesn't start with /
      const normalizedBase = base.endsWith('/') ? base : base + '/';
      const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      return normalizedBase + normalizedPath;
    };

  this.innerHTML = `
      <aside class="sidebar-container group h-screen bg-white/80 backdrop-blur-xl border-r border-webropol-gray-200/50 flex flex-col flex-shrink-0 shadow-soft
                     xl:w-72 w-16 
                     relative
                     xl:z-auto z-50
                     transition-all duration-300 ease-in-out
                     hover:w-72 hover:shadow-2xl hover:absolute hover:h-screen
                     xl:hover:w-72 xl:hover:shadow-soft xl:hover:relative xl:hover:h-screen">
        
        <!-- Header -->
        <div class="h-20 flex items-center border-b border-webropol-gray-200/50
                    xl:px-8 px-4
                    group-hover:px-8
                    transition-all duration-300">
          <div class="w-10 h-10 bg-gradient-to-br from-webropol-primary-500 to-webropol-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fal fa-chart-bar text-white text-lg"></i>
          </div>
          <div class="ml-3 overflow-hidden transition-all duration-300
                      xl:opacity-100 xl:w-auto
                      opacity-0 w-0
                      group-hover:opacity-100 group-hover:w-auto group-hover:ml-3">
            <h1 class="font-bold text-webropol-gray-900 text-lg whitespace-nowrap uppercase">
              <webropol-brand></webropol-brand>
            </h1>
            <p class="text-xs text-webropol-gray-500 -mt-1 whitespace-nowrap">Survey Tool Forerunner</p>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 space-y-1
                    xl:px-4 px-2
                    group-hover:px-4
                    transition-all duration-300">
          <a href="#/home" data-route="/home" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                  xl:px-4 px-3
                                                  group-hover:px-4
                                                  py-3
                                                  ${active==='home' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
            <i class="fal fa-home w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                     xl:mr-4 mr-0
                     group-hover:mr-4"></i>
            <span class="font-medium overflow-hidden transition-all duration-300
                        xl:opacity-100 xl:w-auto
                        opacity-0 w-0
                        group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Home</span>
          </a>
          
          <a href="#/surveys/list" data-route="/surveys/list" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                          xl:px-4 px-3
                                                          group-hover:px-4
                                                          py-3
                                                          ${active==='surveys' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
            <i class="fal fa-chart-bar w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                     xl:mr-4 mr-0
                     group-hover:mr-4"></i>
            <span class="overflow-hidden transition-all duration-300
                        xl:opacity-100 xl:w-auto
                        opacity-0 w-0
                        group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Surveys</span>
          </a>
          
          <a href="#/events/list" data-route="/events/list" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                        xl:px-4 px-3
                                                        group-hover:px-4
                                                        py-3
                                                        ${active==='events' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
            <i class="fal fa-calendar-alt w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                     xl:mr-4 mr-0
                     group-hover:mr-4"></i>
            <span class="font-medium overflow-hidden transition-all duration-300
                        xl:opacity-100 xl:w-auto
                        opacity-0 w-0
                        group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Events</span>
          </a>
          
          <a href="#/sms" data-route="/sms" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                    xl:px-4 px-3
                                                    group-hover:px-4
                                                    py-3
                                                    ${active==='sms' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
            <i class="fal fa-sms w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                     xl:mr-4 mr-0
                     group-hover:mr-4"></i>
            <span class="font-medium overflow-hidden transition-all duration-300
                        xl:opacity-100 xl:w-auto
                        opacity-0 w-0
                        group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">2-Way SMS</span>
          </a>
          
          <a href="#/exw" data-route="/exw" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                     xl:px-4 px-3
                                                     group-hover:px-4
                                                     py-3
                                                     ${active==='exw' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
            <i class="fal fa-user-chart w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                     xl:mr-4 mr-0
                     group-hover:mr-4"></i>
            <span class="font-medium overflow-hidden transition-all duration-300
                        xl:opacity-100 xl:w-auto
                        opacity-0 w-0
                        group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">EXW</span>
          </a>
          
          <a href="#/case-management" data-route="/case-management" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                               xl:px-4 px-3
                                                               group-hover:px-4
                                                               py-3
                                                               ${active==='case-management' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
            <i class="fal fa-briefcase w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                     xl:mr-4 mr-0
                     group-hover:mr-4"></i>
            <span class="font-medium overflow-hidden transition-all duration-300
                        xl:opacity-100 xl:w-auto
                        opacity-0 w-0
                        group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Case Management</span>
          </a>
          
          <div class="pt-4 border-t border-webropol-gray-200/50 mt-4">
            <a href="#/mywebropol" data-route="/mywebropol" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                              xl:px-4 px-3
                                                              group-hover:px-4
                                                              py-3
                                                              ${active==='mywebropol' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
              <i class="fal fa-book-open w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                       xl:mr-4 mr-0
                       group-hover:mr-4"></i>
              <span class="font-medium overflow-hidden transition-all duration-300
                          xl:opacity-100 xl:w-auto
                          opacity-0 w-0
                          group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">MyWebropol</span>
            </a>
            
            <a href="#/admin-tools" data-route="/admin-tools" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                              xl:px-4 px-3
                                                              group-hover:px-4
                                                              py-3
                                                              ${active==='admin-tools' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
              <i class="fal fa-tools w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                       xl:mr-4 mr-0
                       group-hover:mr-4"></i>
              <span class="font-medium overflow-hidden transition-all duration-300
                          xl:opacity-100 xl:w-auto
                          opacity-0 w-0
                          group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Admin Tools</span>
            </a>
            
            <a href="#/training-videos" data-route="/training-videos" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                                  xl:px-4 px-3
                                                                  group-hover:px-4
                                                                  py-3
                                                                  ${active==='training-videos' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
              <i class="fal fa-video w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                       xl:mr-4 mr-0
                       group-hover:mr-4"></i>
              <span class="font-medium overflow-hidden transition-all duration-300
                          xl:opacity-100 xl:w-auto
                          opacity-0 w-0
                          group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Training Videos</span>
            </a>
            
            <a href="#/shop" data-route="/shop" class="nav-item flex items-center rounded-xl font-semibold transition-all duration-200 group/item
                                                        xl:px-4 px-3
                                                        group-hover:px-4
                                                        py-3
                                                        ${active==='shop' ? 'bg-gradient-to-r from-webropol-primary-500 to-webropol-primary-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-primary-50 hover:text-webropol-primary-700'}">
              <i class="fal fa-shopping-cart w-5 flex-shrink-0 group-hover/item:scale-110 transition-transform
                       xl:mr-4 mr-0
                       group-hover:mr-4"></i>
              <span class="font-medium overflow-hidden transition-all duration-300
                          xl:opacity-100 xl:w-auto
                          opacity-0 w-0
                          group-hover:opacity-100 group-hover:w-auto whitespace-nowrap">Shop</span>
            </a>
          </div>
        </nav>
        
        <!-- Footer -->
        <div class="mt-auto transition-all duration-300
                    xl:px-4 px-2
                    group-hover:px-4
                    pb-6">
          <!-- Contact Us - Redesigned Footer Button -->
          <div class="relative">
            <a href="#/contact" data-route="/contact" class="contact-footer-btn group/contact flex items-center rounded-2xl font-semibold transition-all duration-300 p-4 bg-gradient-to-r from-webropol-primary-50 to-webropol-primary-100 hover:from-webropol-primary-500 hover:to-webropol-primary-600 border border-webropol-primary-200 hover:border-webropol-primary-500 shadow-sm hover:shadow-lg" title="Contact Us - Gain Insight & Get Support">
              <!-- Icon with animated background -->
              <div class="relative flex-shrink-0">
                <div class="w-10 h-10 bg-gradient-to-br from-webropol-primary-500 to-webropol-primary-600 group-hover/contact:from-white group-hover/contact:to-white rounded-xl flex items-center justify-center transition-all duration-300 group-hover/contact:scale-110">
                  <i class="fal fa-headset text-white group-hover/contact:text-webropol-primary-600 transition-colors duration-300 text-lg"></i>
                </div>
                <!-- Pulse animation on hover -->
                <div class="absolute inset-0 w-10 h-10 bg-webropol-primary-400 rounded-xl opacity-0 group-hover/contact:opacity-20 group-hover/contact:animate-ping"></div>
              </div>
              
              <!-- Text content -->
              <div class="ml-4 overflow-hidden transition-all duration-300
                          xl:opacity-100 xl:w-auto xl:block
                          opacity-0 w-0 hidden
                          group-hover:opacity-100 group-hover:w-auto group-hover:block">
                <div class="font-semibold text-webropol-primary-700 group-hover/contact:text-white transition-colors duration-300 text-sm whitespace-nowrap">
                  Contact Us
                </div>
                <div class="text-xs text-webropol-primary-600 group-hover/contact:text-webropol-primary-100 transition-colors duration-300 whitespace-nowrap">
                  Gain Insight & Get Support
                </div>
              </div>
            </a>
          </div>
          
          <!-- Version info -->
          <div class="mt-3 text-center overflow-hidden transition-all duration-300
                      xl:opacity-100 xl:block
                      opacity-0 hidden
                      group-hover:opacity-100 group-hover:block">
            <div class="text-xs text-webropol-gray-400 whitespace-nowrap">
              Webropol Development v3.2.1
            </div>
          </div>
        </div>
      </aside>
    `;

    // Add event listeners for SPA navigation and collapsing
    this.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item');
      if (!navItem) return;

      // SPA client-side route
      const route = navItem.getAttribute('data-route');
      if (route && window.WebropolSPA) {
        e.preventDefault();
        window.WebropolSPA.navigate(route);
      }

      // Collapse on small screens after navigation
      if (window.innerWidth <= 1280) {
        setTimeout(() => {
          const sc = this.querySelector('.sidebar-container');
          if (!sc) return;
          sc.classList.remove('hover:w-72');
          setTimeout(() => sc.classList.add('hover:w-72'), 100);
        }, 150);
      }
    });
  }
}

customElements.define('webropol-sidebar', WebropolSidebar);

