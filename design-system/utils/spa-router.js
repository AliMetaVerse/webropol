// Webropol SPA Router
// Hash-based client-side router that swaps the main content without reloading header/sidebar

class WebropolSPA {
  constructor() {
    // Container inside the shell where we inject page content
    this.container = null;
    this.sidebar = null;
    this.breadcrumbs = null;
    this.loadedExternalScripts = new Set();
    this.routeHtmlCache = new Map();
    this.routeCacheLimit = 32;
    this.activeLoadToken = 0;
    this.prefetchQueue = new Set();
    this.postRouteRefreshFrame = 0;
    this.postRouteIdle = 0;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDocumentPrefetch = this.handleDocumentPrefetch.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.pageStyleNodes = [];
  this.pageScriptNodes = [];
  this.pageModalNodes = [];
  // Detect hosting base segment (e.g., "/webropol" on GitHub Pages project sites)
  const seg = (location.pathname || '/')
    .split('/')
    .filter(Boolean)[0] || '';
  this._baseSegment = seg; // e.g., "webropol" or '' when hosted at root
  this._basePrefix = seg ? `/${seg}` : '';
  // Map routes to source HTML files (relative to repo root)
    this.routes = new Map([
      ['/', 'index.html'],
      ['/home', 'index.html'],
      ['/surveys', 'surveys/index.html'],
      ['/surveys/list', 'surveys/list.html'],
      ['/surveys/edit', 'surveys/edit.html'],
      ['/surveys/blank-survey', 'surveys/blank-survey.html'],
  // Added explicit routes for survey report, AI text analysis & AI survey creator views
  ['/surveys/report', 'surveys/report.html'],
  ['/surveys/aita', 'surveys/aita.html'],
  ['/surveys/ai-survey', 'surveys/ai-survey.html'],
      ['/events', 'events/list.html'],
      ['/events/list', 'events/list.html'],
      ['/sms', 'sms/list.html'],
      ['/sms/list', 'sms/list.html'],
      ['/sms/edit', 'sms/edit.html'],
      ['/sms/collect', 'sms/collect.html'],
      ['/sms/follow', 'sms/follow.html'],
      ['/sms/report', 'sms/report.html'],
      ['/sms/aita', 'sms/aita.html'],
      ['/exw', 'exw/index.html'],
      ['/case-management', 'case-management/index.html'],
      ['/mywebropol', 'mywebropol/index.html'],
      ['/news', 'news/index.html'],
      ['/admin-tools', 'admin-tools/index.html'],
      ['/admin-tools/user-management', 'admin-tools/user-management.html'],
      ['/training-videos', 'training-videos/index.html'],
      ['/shop', 'shop/index.html'],
  ['/shop/sms-credits', 'shop/sms-credits.html'],
  ['/shop/products/bi-view', 'shop/products/bi-view.html'],
  ['/shop/products/ai-text-analysis', 'shop/products/ai-text-analysis.html'],
  ['/shop/products/etest', 'shop/products/etest.html'],
  ['/shop/products/360-assessments', 'shop/products/360-assessments.html'],
  ['/shop/products/direct-mobile-feedback', 'shop/products/direct-mobile-feedback.html'],
  ['/shop/products/analytics', 'shop/products/analytics.html'],
  ['/shop/products/case-management', 'shop/products/case-management.html'],
  ['/shop/products/wott', 'shop/products/wott.html'],
      ['/create', 'create/index.html'],
      ['/design-system', 'design-system/index.html'],
  ['/promo', 'promo/index.html'],
  ['/branding', 'branding/branding.html'],
    ]);

    // Labels for breadcrumb generation
    this.labels = {
      '': 'Home',
      home: 'Home',
      branding: 'Branding',
      surveys: 'Surveys',
      events: 'Events',
      sms: '2-Way SMS',
      exw: 'EXW',
      'case-management': 'Case Management',
      'mywebropol': 'MyWebropol',
      news: 'News',
      'admin-tools': 'Admin Tools',
  'user-management': 'User Management and Rights',
      'training-videos': 'Training Videos',
      shop: 'Shop',
      create: 'Create',
      'design-system': 'Design System',
  promo: 'Promo',
      list: 'List',
      edit: 'Edit',
      collect: 'Collect Answers',
      follow: 'Follow Up',
      report: 'Report',
      aita: 'AI Text Analysis',
      'ai-survey': 'AI Survey Creator',
      index: 'Home'
    };
  }

  init() {
    if (this.initialized) return;
    this.container = document.querySelector('#app-content');
    this.sidebar = document.querySelector('webropol-sidebar');
    this.breadcrumbs = document.querySelector('webropol-breadcrumbs');

    if (!this.container) {
      console.warn('[SPA] #app-content not found. SPA router will not run.');
      return;
    }

    this.initialized = true;
    this.ensureDesktopScrollbarGuard();

    // Intercept clicks on internal links to navigate client-side
  document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('pointerover', this.handleDocumentPrefetch, { passive: true });
    document.addEventListener('focusin', this.handleDocumentPrefetch);

    // React to hash changes
    window.addEventListener('hashchange', this.handleHashChange);

    // Initial navigation
    const initialRoute = this.currentRouteFromHash() || '/home';
    if (!location.hash) {
      // Preserve the current shell content for home and set hash
      location.replace(`#${initialRoute}`);
    } else {
      // Normalize an existing hash that might include the repo base segment
      const normalizedHash = `#${initialRoute.startsWith('/') ? initialRoute : `/${initialRoute}`}`;
      if (location.hash !== normalizedHash) {
        location.replace(normalizedHash);
      }
    }
    
    // Always update sidebar and breadcrumbs, even for initial load
    this.updateBreadcrumbs(initialRoute);
    this.updateSidebarActive(initialRoute);
    
    // Load if route is not home (shell already shows home content)
    if (initialRoute !== '/home' && initialRoute !== '/') {
      // Immediately clear home content to avoid flash while async fetch runs
      this.container.innerHTML = '<div class="flex items-center justify-center" style="height:60vh"><div style="width:2.5rem;height:2.5rem;border:3px solid #e2e8f0;border-top-color:#06b6d4;border-radius:50%;animation:spa-spin .7s linear infinite"></div></div><style>@keyframes spa-spin{to{transform:rotate(360deg)}}</style>';
      this.load(initialRoute);
    }
  }

  handleDocumentClick(e) {
    // Respect modifier keys and targets
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const route = this.routeFromAnchor(e.target.closest('a'));
    if (!route) return;

    e.preventDefault();
    this.navigate(route);
  }

  handleDocumentPrefetch(e) {
    const route = this.routeFromAnchor(e.target.closest('a'));
    if (!route) return;
    this.prefetchRoute(route);
  }

  handleHashChange() {
    const route = this.currentRouteFromHash();
    const normalizedHash = `#${route.startsWith('/') ? route : `/${route}`}`;
    // If the hash contains the repo base segment, rewrite it once to a clean hash
    if (location.hash !== normalizedHash) {
      location.replace(normalizedHash);
      return; // wait for next hashchange or proceed on next event
    }
    this.load(route);
  }

  routeFromAnchor(anchor) {
    if (!anchor) return '';
    const href = anchor.getAttribute('href');
    const target = anchor.getAttribute('target');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank') {
      return '';
    }

    // Handle hash routes like #/surveys/list directly
    if (href.startsWith('#/')) {
      return href.substring(1);
    }

    // Handle html page links possibly with query (e.g., surveys/list.html or surveys/list.html?x=1)
    if (/\.html(\?|$)/i.test(href)) {
      const { route, query } = this.hrefToRoute(href);
      return query ? `${route}?${query}` : route;
    }

    return '';
  }

  currentRouteFromHash() {
    const hash = location.hash || '';
    if (!hash.startsWith('#/')) return '';
    try {
      const url = new URL(hash.substring(1), location.origin);
      let route = url.pathname || '/';
      // Normalize routes like "/webropol/..." (shared externally) to "/..."
      route = this.stripBasePrefix(route);
      const query = url.search || '';
      return `${route}${query}`;
    } catch (_) {
      // Best-effort fallback
      const raw = hash.substring(1) || '/';
      return this.stripBasePrefix(raw) || '/';
    }
  }

  hrefToRoute(href) {
    // Normalize relative links like ../surveys/list.html as well
    const a = document.createElement('a');
    a.href = href;
    // Compute path relative to origin
    let path = a.pathname;
    if (!path) return '/';
    // Strip hosting base prefix if present (e.g., /webropol/...)
    path = this.stripBasePrefix(path);
    // Convert /surveys/list.html -> /surveys/list
    path = path.replace(/\\/g, '/').replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
    const query = (a.search || '').replace(/^\?/, '');
    return { route: path || '/', query };
  }

  pathToFile(path) {
    // Separate query from path
    const [purePath] = path.split('?');
    // Try exact match
    if (this.routes.has(purePath)) return this.routes.get(purePath);
    // Try with /index
    if (this.routes.has(`${purePath}/index`)) return this.routes.get(`${purePath}/index`);
    // Fallback to path + .html
    const candidate = purePath.endsWith('/') ? `${purePath}index.html` : `${purePath}.html`;
    return candidate.replace(/^\//, '');
  }

  navigate(path) {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (`#${normalized}` !== location.hash) {
      location.hash = normalized;
    } else {
      // Same route, force load
      this.load(normalized);
    }
  }

  // Remove the repo base prefix (e.g., "/webropol") from a path if present
  stripBasePrefix(p) {
    try {
      if (!p) return p;
      // Ensure leading slash for consistent checks
      const path = p.startsWith('/') ? p : `/${p}`;
      if (this._basePrefix && (path === this._basePrefix || path.startsWith(`${this._basePrefix}/`))) {
        const stripped = path.slice(this._basePrefix.length);
        return stripped || '/';
      }
      return path;
    } catch (_) {
      return p;
    }
  }

  async load(path) {
    const loadToken = ++this.activeLoadToken;
    this.applyRouteLayoutState(path);
    const file = this.pathToFile(path);
    if (!file) return;
  // Compute absolute URL and base directory URL for the fetched document
  const fileUrl = new URL(file, location.href);
  const baseUrl = new URL('./', fileUrl);
  // Make base URL available to helpers (e.g., script/link resolution)
  this._currentBaseUrl = baseUrl.href;
    this.setLoading(true);
    try {
      const html = await this.fetchRouteHtml(file);
      if (loadToken !== this.activeLoadToken) return;
      const doc = new DOMParser().parseFromString(html, 'text/html');

      // Extract main content if present; else body content
      let main = doc.querySelector('main');
      let nextHTML = '';
      let bodyAttribs = '';
      
      // Capture body attributes like x-data for Alpine.js
      const bodyEl = doc.querySelector('body');
      if (bodyEl) {
        const attrs = Array.from(bodyEl.attributes);
        bodyAttribs = attrs.map(attr => `${attr.name}="${attr.value}"`).join(' ');
      }
      
      if (main) {
        // If a shop-specific sidebar exists as a sibling, inject their shared container instead of just <main>
        const shopBar = doc.querySelector('shop-sidebar');
        if (shopBar && !main.contains(shopBar)) {
          const shared = main.closest('div.flex');
          if (shared && shared.contains(shopBar)) {
            // Clone and strip any nested webropol header/sidebar/breadcrumbs just in case
            const clone = shared.cloneNode(true);
            clone.querySelectorAll('webropol-sidebar, webropol-header, webropol-breadcrumbs').forEach(el => el.remove());
            nextHTML = clone.outerHTML;
          } else {
            nextHTML = main.outerHTML;
          }
        } else {
          // For pages with main tags, use the full main content including the wrapper
          // This preserves complex layouts like the create page's split screen
          nextHTML = main.outerHTML;
        }
      } else {
        // For pages without main, try to find content container
        const contentArea = doc.querySelector('.flex-1') || doc.querySelector('#app-content') || doc.body;
        if (contentArea === doc.body) {
          // If we're taking from body, exclude the navigation components that are already in shell
          const bodyClone = doc.body.cloneNode(true);
          // Remove sidebar, header, breadcrumbs that are already in the shell
          bodyClone.querySelectorAll('webropol-sidebar, webropol-header, webropol-breadcrumbs').forEach(el => el.remove());
          // Also remove the outer flex container if it exists
          const flexContainer = bodyClone.querySelector('.flex.h-screen');
          if (flexContainer) {
            const mainContent = flexContainer.querySelector('.flex-1') || flexContainer;
            nextHTML = mainContent.innerHTML;
          } else {
            nextHTML = bodyClone.innerHTML;
          }
        } else {
          // Clone and strip nested nav/header components before injecting
          const areaClone = contentArea.cloneNode(true);
          areaClone.querySelectorAll('webropol-sidebar, webropol-header, webropol-breadcrumbs').forEach(el => el.remove());
          nextHTML = areaClone.innerHTML;
        }
      }

      // Update globals so pages can read their own query via window.__pageQueryString
      // This MUST be done BEFORE injecting content so Alpine.js can read it during initialization
      const qIndex = path.indexOf('?');
      const queryString = qIndex >= 0 ? path.substring(qIndex) : '';
      window.__pageRoute = path;
      window.__pageQueryString = queryString;

      // Tear down the previous Alpine scope before reusing the shared SPA container.
      // Without this, route-scoped state and listeners can leak across navigations.
      try {
        if (window.Alpine && typeof window.Alpine.destroyTree === 'function') {
          window.Alpine.destroyTree(this.container);
        }
      } catch (e) {
        console.warn('[SPA] Alpine.js teardown failed:', e);
      }

  // Clean up previously injected page styles
  this.cleanupPageStyles();
  this.cleanupPageScripts();
  this.cleanupPageModals();
  this.cleanupContainerAttributes();

  // Swap content
      this.container.innerHTML = nextHTML;

  // Rewrite internal links and asset URLs inside injected content to be SPA- and base-aware
  this.rewriteContentUrls(baseUrl, this.container);

      // Ensure fluid layout by removing max-width caps from common containers.
      // Preserve page-owned content widths for routes that intentionally rely on them.
      try {
        const routePath = path.split('?')[0];
        const preservePageWidths = routePath === '/create';

        if (!preservePageWidths) {
          // Target typical layout wrappers that center content
          const candidates = this.container.querySelectorAll('.mx-auto, main, [class*="max-w-"], .container');
          candidates.forEach((el) => {
            if (!el.classList) return;
            // Skip elements inside modals — their max-w-* classes are intentional sizing
            if (el.closest('.modal-overlay, [class*="modal"], .fixed[class*="inset-0"]') || el.classList.contains('modal-overlay')) return;
            // Remove any Tailwind max-w-* classes, including arbitrary values like max-w-[1600px]
            const toRemove = [];
            el.classList.forEach((c) => {
              if (c.startsWith('max-w-') || c === 'container') toRemove.push(c);
            });
            toRemove.forEach((c) => el.classList.remove(c));

            // For common wrappers, make them fluid and centered
            if (toRemove.length || el.classList.contains('mx-auto') || el.tagName.toLowerCase() === 'main') {
              try { el.classList.add('w-full'); } catch(_) {}
              // Center if it’s intended as a centered wrapper
              if (!el.style.marginLeft && !el.style.marginRight) {
                el.style.marginLeft = 'auto';
                el.style.marginRight = 'auto';
              }
              // Do not enforce any inline max-width; let the page expand fully
              if (el.style.maxWidth) {
                el.style.maxWidth = '';
              }
            }
          });
        }
      } catch (_) { /* no-op */ }

      // Attach modal/pop-up elements that live outside <main> in the source page
      this.attachPageModals(doc, main, baseUrl);
      
      // Apply body attributes to container for Alpine.js context
      if (bodyAttribs) {
        // Parse and apply x-data and other Alpine attributes
        const bodyEl = doc.querySelector('body');
        if (bodyEl) {
          // 1) Apply x-* attributes directly (these are reactive scopes)
          Array.from(bodyEl.attributes).forEach(attr => {
            if (attr.name.startsWith('x-')) {
              this.container.setAttribute(attr.name, attr.value);
            }
          });

          // 2) Merge body classes into container without removing shell classes
          const newBodyClass = bodyEl.getAttribute('class') || '';
          // Remove any previously added per-page classes
          const prev = this.container.dataset.spaPageBodyClass || '';
          if (prev) {
            prev.split(/\s+/).filter(Boolean).forEach(c => this.container.classList.remove(c));
          }
          if (newBodyClass) {
            newBodyClass.split(/\s+/).filter(Boolean).forEach(c => this.container.classList.add(c));
            this.container.dataset.spaPageBodyClass = newBodyClass;
          } else {
            // Clear tracking if no classes on this page
            delete this.container.dataset.spaPageBodyClass;
          }
        }
      }

  // Attach page-specific styles from fetched document (respecting base path)
  this.attachPageStyles(doc, baseUrl);
  this.ensureDesktopScrollbarGuard();

      // Execute inline and external scripts before Alpine initialization so route-scoped
      // x-data functions exist when the shared SPA container is initialized.
      this.runPageScripts(doc, baseUrl);

      // Re-initialize Alpine components within the injected content (if Alpine is present).
      try {
        if (window.Alpine && typeof window.Alpine.initTree === 'function') {
          window.Alpine.initTree(this.container);
          if (this.pageModalNodes && this.pageModalNodes.length) {
            this.pageModalNodes.forEach((n) => {
              try { window.Alpine.initTree(n); } catch (_) {}
            });
          }
        }
      } catch (e) {
        console.warn('[SPA] Alpine.js re-initialization failed:', e);
      }

      this.queuePostRouteRefresh();

  // Emit custom event AFTER scripts and settings are applied so pages can listen during SPA loads
      window.dispatchEvent(new CustomEvent('spa-route-change', { 
        detail: { path, queryString } 
      }));

  // Update stateful UI parts
  this.updateBreadcrumbs(path);
  this.updateSidebarActive(path);
  this.updatePageTitle(path);
      this.scrollToTop();
    } catch (err) {
      if (loadToken !== this.activeLoadToken) return;
      console.error('[SPA] Failed to load route', path, err);
      this.container.innerHTML = `<div class="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700">Failed to load ${path}</div>`;
    } finally {
      if (loadToken === this.activeLoadToken) {
        this.setLoading(false);
      }
    }
  }

  async fetchRouteHtml(file) {
    const key = this.getRouteCacheKey(file);
    const cached = this.routeHtmlCache.get(key);
    if (cached) {
      if (cached.html) return cached.html;
      if (cached.promise) return cached.promise;
    }

    const promise = fetch(file, { cache: 'default' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} while loading ${file}`);
        }
        return res.text();
      })
      .then((html) => {
        this.rememberRouteHtml(key, html);
        return html;
      })
      .catch((err) => {
        this.routeHtmlCache.delete(key);
        throw err;
      });

    this.routeHtmlCache.set(key, { promise });
    return promise;
  }

  getRouteCacheKey(file) {
    try {
      return new URL(file, location.href).href;
    } catch (_) {
      return file;
    }
  }

  rememberRouteHtml(key, html) {
    this.routeHtmlCache.delete(key);
    this.routeHtmlCache.set(key, { html, cachedAt: Date.now() });

    while (this.routeHtmlCache.size > this.routeCacheLimit) {
      const oldestKey = this.routeHtmlCache.keys().next().value;
      if (!oldestKey) break;
      this.routeHtmlCache.delete(oldestKey);
    }
  }

  prefetchRoute(path) {
    const file = this.pathToFile(path);
    if (!file) return;
    const key = this.getRouteCacheKey(file);
    if (this.routeHtmlCache.has(key) || this.prefetchQueue.has(key)) return;

    this.prefetchQueue.add(key);
    const prefetch = () => {
      this.fetchRouteHtml(file)
        .catch(() => {})
        .finally(() => this.prefetchQueue.delete(key));
    };

    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(prefetch, { timeout: 1500 });
    } else {
      window.setTimeout(prefetch, 120);
    }
  }

  queuePostRouteRefresh() {
    const refreshToken = this.activeLoadToken;

    if (this.postRouteRefreshFrame) {
      cancelAnimationFrame(this.postRouteRefreshFrame);
      this.postRouteRefreshFrame = 0;
    }
    if (this.postRouteIdle && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(this.postRouteIdle);
      this.postRouteIdle = 0;
    }

    this.postRouteRefreshFrame = requestAnimationFrame(() => {
      this.postRouteRefreshFrame = 0;
      if (refreshToken !== this.activeLoadToken) return;

      try {
        if (window.tailwind && typeof window.tailwind.refresh === 'function') {
          window.tailwind.refresh();
        }
      } catch(_) {}

      const applyDeferredWork = () => {
        this.postRouteIdle = 0;
        if (refreshToken !== this.activeLoadToken) return;

        // Re-emit viewport state so newly mounted vanilla web components can pick up adaptive mode
        try {
          if (window.WebropolViewport && typeof window.WebropolViewport.refresh === 'function') {
            window.WebropolViewport.refresh();
          }
        } catch(_) {}

        // Re-apply global settings after content load so UI reflects current configuration
        try {
          if (window.globalSettingsManager && typeof window.globalSettingsManager.applySettings === 'function') {
            window.globalSettingsManager.applySettings();
          }
        } catch (_) {}
      };

      if (typeof window.requestIdleCallback === 'function') {
        if (this.postRouteIdle) window.cancelIdleCallback(this.postRouteIdle);
        this.postRouteIdle = window.requestIdleCallback(applyDeferredWork, { timeout: 700 });
      } else {
        applyDeferredWork();
      }
    });
  }

  ensureDesktopScrollbarGuard() {
    try {
      const styleId = 'webropol-spa-scrollbar-guard';
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @media (min-width: 768px) and (hover: hover) and (pointer: fine) {
            .main-content-transition > main[role="main"],
            #app-content,
            #app-content main[role="main"],
            #app-content .overflow-auto,
            #app-content .overflow-y-auto,
            #app-content .overflow-x-auto,
            #app-content .scrollbar-hide,
            #app-content .no-scrollbar {
              -ms-overflow-style: auto !important;
              scrollbar-width: auto !important;
              scrollbar-color: var(--primary-500, #209fba) rgba(249, 250, 250, 0.92) !important;
            }

            .main-content-transition > main[role="main"],
            #app-content main[role="main"],
            #app-content .overflow-auto,
            #app-content .overflow-y-auto {
              scrollbar-gutter: stable;
            }

            .main-content-transition > main[role="main"]::-webkit-scrollbar,
            #app-content::-webkit-scrollbar,
            #app-content main[role="main"]::-webkit-scrollbar,
            #app-content .overflow-auto::-webkit-scrollbar,
            #app-content .overflow-y-auto::-webkit-scrollbar,
            #app-content .overflow-x-auto::-webkit-scrollbar,
            #app-content .scrollbar-hide::-webkit-scrollbar,
            #app-content .no-scrollbar::-webkit-scrollbar {
              display: block !important;
              width: 12px !important;
              height: 12px !important;
            }

            .main-content-transition > main[role="main"]::-webkit-scrollbar-track,
            #app-content::-webkit-scrollbar-track,
            #app-content main[role="main"]::-webkit-scrollbar-track,
            #app-content .overflow-auto::-webkit-scrollbar-track,
            #app-content .overflow-y-auto::-webkit-scrollbar-track,
            #app-content .overflow-x-auto::-webkit-scrollbar-track,
            #app-content .scrollbar-hide::-webkit-scrollbar-track,
            #app-content .no-scrollbar::-webkit-scrollbar-track {
              background: rgba(249, 250, 250, 0.92) !important;
              border-radius: 999px;
            }

            .main-content-transition > main[role="main"]::-webkit-scrollbar-thumb,
            #app-content::-webkit-scrollbar-thumb,
            #app-content main[role="main"]::-webkit-scrollbar-thumb,
            #app-content .overflow-auto::-webkit-scrollbar-thumb,
            #app-content .overflow-y-auto::-webkit-scrollbar-thumb,
            #app-content .overflow-x-auto::-webkit-scrollbar-thumb,
            #app-content .scrollbar-hide::-webkit-scrollbar-thumb,
            #app-content .no-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, var(--primary-400, #3fbcd5), var(--primary-600, #1d809d)) !important;
              border: 3px solid rgba(249, 250, 250, 0.92) !important;
              border-radius: 999px !important;
            }
          }
        `;
      }

      document.head.appendChild(style);
    } catch (_) {}
  }

  dispose() {
    if (!this.initialized) return;
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('pointerover', this.handleDocumentPrefetch);
    document.removeEventListener('focusin', this.handleDocumentPrefetch);
    window.removeEventListener('hashchange', this.handleHashChange);

    if (this.postRouteRefreshFrame) {
      cancelAnimationFrame(this.postRouteRefreshFrame);
      this.postRouteRefreshFrame = 0;
    }
    if (this.postRouteIdle && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(this.postRouteIdle);
      this.postRouteIdle = 0;
    }

    this.prefetchQueue.clear();
    this.cleanupPageStyles();
    this.cleanupPageScripts();
    this.cleanupPageModals();
    this.initialized = false;
  }

  applyRouteLayoutState(path) {
    try {
      const purePath = (path || '').split('?')[0] || '/';
      const isSurveyEditRoute = purePath === '/surveys/edit' || purePath === '/surveys/blank-survey';
      const isSurveyCollectRoute = purePath === '/surveys/collect';
      const isSurveyFollowRoute = purePath === '/surveys/follow';
      const isSurveyReportRoute = purePath === '/surveys/report';
      const isSurveyAitaRoute = purePath === '/surveys/aita';
      const isSmsEditRoute = purePath === '/sms/edit';
      // Editor tab routes: hide breadcrumbs for all survey/sms tab pages
      const isEditorTabsRoute = [
        '/surveys/edit', '/surveys/blank-survey', '/surveys/collect', '/surveys/aita', '/surveys/follow', '/surveys/report',
        '/sms/edit', '/sms/collect', '/sms/aita', '/sms/follow', '/sms/report'
      ].includes(purePath);
      document.body.classList.toggle('route-surveys-edit', isSurveyEditRoute);
      document.body.classList.toggle('route-surveys-collect', isSurveyCollectRoute);
      document.body.classList.toggle('route-surveys-follow', isSurveyFollowRoute);
      document.body.classList.toggle('route-surveys-report', isSurveyReportRoute);
      document.body.classList.toggle('route-surveys-aita', isSurveyAitaRoute);
      document.body.classList.toggle('route-sms-edit', isSmsEditRoute);
      document.body.classList.toggle('route-editor-tabs', isEditorTabsRoute);
    } catch (_) {
      // ignore
    }
  }

  attachPageStyles(doc, baseUrl) {
    try {
      const head = doc.querySelector('head');
      const body = doc.querySelector('body');
      if (!head && !body) return;
      const nodes = [];

      // Helper to add <style> blocks from a given scope
      const addStyleBlocksFrom = (scopeEl) => {
        if (!scopeEl) return;
        scopeEl.querySelectorAll('style').forEach((styleEl) => {
          const clone = document.createElement('style');
          clone.textContent = styleEl.textContent || '';
          clone.setAttribute('data-spa-page-style', '');
          document.head.appendChild(clone);
          nodes.push(clone);
        });
      };

      // Copy meta tags that might affect styling (viewport, etc.) from head only
      if (head) head.querySelectorAll('meta[name="viewport"], meta[charset]').forEach((metaEl) => {
        const name = metaEl.getAttribute('name') || metaEl.getAttribute('charset');
        if (!name) return;
        const already = document.head.querySelector(`meta[name="${name}"], meta[charset="${name}"]`);
        if (already) return;
        const clone = metaEl.cloneNode(true);
        clone.setAttribute('data-spa-page-style', '');
        document.head.appendChild(clone);
        nodes.push(clone);
      });

      // Copy <style> blocks from head and body (some pages place critical CSS after <main>)
      addStyleBlocksFrom(head);
      addStyleBlocksFrom(body);

      // Copy <link rel="stylesheet"> not already present
      if (head) head.querySelectorAll('link[rel="stylesheet"]').forEach((linkEl) => {
        const href = linkEl.getAttribute('href');
        if (!href) return;
        // Resolve relative to the fetched page's base
        let abs;
        try {
          abs = new URL(href, baseUrl).href;
        } catch {
          abs = href;
        }
        // Skip if already in document.head, but don't skip design-system or common styles
        const already = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
          .some((l) => {
            try {
              return new URL(l.getAttribute('href'), location.href).href === abs;
            } catch {
              return false;
            }
          });
        if (already) return;
        const clone = document.createElement('link');
        clone.rel = 'stylesheet';
        clone.href = abs;
        clone.setAttribute('data-spa-page-style', '');
        document.head.appendChild(clone);
        nodes.push(clone);
      });

  // Also copy any Google Fonts or other external font links
  if (head) head.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"], link[href*="font-awesome"], link[href*="cdnjs.cloudflare.com/ajax/libs/font-awesome"]').forEach((linkEl) => {
        const href = linkEl.getAttribute('href');
        if (!href) return;
        const abs = new URL(href, location.href).href;
        const already = Array.from(document.head.querySelectorAll('link'))
          .some((l) => {
            try {
              return new URL(l.getAttribute('href'), location.href).href === abs;
            } catch {
              return false;
            }
          });
        if (already) return;
        const clone = linkEl.cloneNode(true);
        clone.setAttribute('data-spa-page-style', '');
        document.head.appendChild(clone);
        nodes.push(clone);
      });

      this.pageStyleNodes = nodes;
    } catch (e) {
      console.warn('[SPA] Failed to attach page styles', e);
    }
  }

  cleanupPageStyles() {
    try {
      if (!this.pageStyleNodes || !this.pageStyleNodes.length) return;
      this.pageStyleNodes.forEach((n) => {
        try { n.remove(); } catch (_) {}
      });
      this.pageStyleNodes = [];
    } catch (e) {
      // noop
    }
  }

  runPageScripts(doc) {
    const scripts = Array.from(doc.querySelectorAll('script'));
    for (const s of scripts) {
      const src = s.getAttribute('src');
      const type = s.getAttribute('type') || '';
      const isModule = type.toLowerCase() === 'module';
      const content = s.textContent && s.textContent.trim();

      if (src) {
        // Skip shared libs already in shell, but allow component scripts
        // Also skip analytics trackers to avoid double-counting when pages are injected into SPA
        const skip = /tailwindcss/.test(src)
          || /alpinejs/.test(src)
          || /kit\.fontawesome\.com/.test(src)
          || /analytics-global-tracker\.js/.test(src)
          || /analytics-tracker\.js/.test(src);
        if (skip) continue;
        // Resolve relative to the fetched page's base (not the shell)
        let abs;
        try {
          // Resolve relative to fetched page base
          abs = new URL(src, this._currentBaseUrl || location.href).href;
        } catch {
          abs = src;
        }
        if (this.loadedExternalScripts.has(abs)) continue;
        const script = document.createElement('script');
        script.src = abs;
        if (isModule) script.type = 'module';
        script.setAttribute('data-spa-page-script', '');
        document.body.appendChild(script);
        this.loadedExternalScripts.add(abs);
        this.pageScriptNodes.push(script);
      } else if (content) {
        // Skip re-defining Tailwind CDN config during SPA loads to prevent style resets
        const isTailwindConfig = /tailwind\.config\s*=/.test(content);
        if (isTailwindConfig) continue;
        // Execute other inline scripts (page logic, small helpers)
        const script = document.createElement('script');
        if (isModule) script.type = 'module';
        script.textContent = content;
        script.setAttribute('data-spa-page-script', '');
        document.body.appendChild(script);
        this.pageScriptNodes.push(script);
      }
    }
  }

  // Normalize all in-content URLs to work within the SPA and respect the loaded page base
  rewriteContentUrls(baseUrl, rootEl = this.container) {
    try {
      // Keep a reference for runPageScripts to resolve external script paths
      this._currentBaseUrl = baseUrl.href;

      // 1) Fix anchors to point to hash-based routes
      rootEl.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href');
        const target = a.getAttribute('target');
        if (!href) return;
        // Skip external and special schemes or explicit new tab
        if (/^(https?:|mailto:|tel:|javascript:)/i.test(href) || target === '_blank') return;
        // Already a hash route
        if (href.startsWith('#/')) return;
        // In-page anchors like #section
        if (href.startsWith('#')) return;

        try {
          const absUrl = new URL(href, baseUrl);
          const hasHtml = /\.html(\?|$)/i.test(absUrl.pathname + (absUrl.search || ''));
          if (hasHtml) {
            const { route, query } = this.hrefToRoute(absUrl.href);
            a.setAttribute('href', `#${query ? `${route}?${query}` : route}`);
          } else {
            // Non-HTML resources or clean paths: convert to hash route if internal path
            if (absUrl.pathname.startsWith('/')) {
              const stripped = this.stripBasePrefix(absUrl.pathname) + (absUrl.search || '');
              a.setAttribute('href', `#${stripped}`);
            }
          }
        } catch (_) {
          // If URL construction fails, leave it as-is
        }
      });

      // 2) Fix common asset attributes within content to be absolute to the loaded page
      const attrMap = [
        { sel: 'img[src]', attr: 'src' },
        { sel: 'source[src]', attr: 'src' },
        { sel: 'video[src]', attr: 'src' },
        { sel: 'audio[src]', attr: 'src' },
        { sel: 'link[rel="preload"][href], link[rel="prefetch"][href]', attr: 'href' },
      ];
      attrMap.forEach(({ sel, attr }) => {
        rootEl.querySelectorAll(sel).forEach((el) => {
          const v = el.getAttribute(attr);
          if (!v || /^(https?:|data:|blob:|#|\/)/i.test(v)) return;
          try {
            el.setAttribute(attr, new URL(v, baseUrl).href);
          } catch (_) {}
        });
      });
    } catch (e) {
      // no-op
    }
  }

  cleanupPageScripts() {
    try {
      if (!this.pageScriptNodes || !this.pageScriptNodes.length) return;
      this.pageScriptNodes.forEach((n) => {
        try { n.remove(); } catch (_) {}
      });
      this.pageScriptNodes = [];
    } catch (e) {
      // noop
    }
  }

  cleanupContainerAttributes() {
    try {
      if (!this.container) return;
      // Remove Alpine.js and previous page-specific attributes (but preserve shell class/style)
      const attrsToRemove = [];
      Array.from(this.container.attributes).forEach(attr => {
        if (attr.name.startsWith('x-') || attr.name.startsWith('data-spa-')) {
          attrsToRemove.push(attr.name);
        }
      });
      attrsToRemove.forEach(name => {
        this.container.removeAttribute(name);
      });

      // Also remove previously added per-page body classes if any
      const prev = this.container.dataset.spaPageBodyClass || '';
      if (prev) {
        prev.split(/\s+/).filter(Boolean).forEach(c => this.container.classList.remove(c));
        delete this.container.dataset.spaPageBodyClass;
      }
    } catch (e) {
      // noop
    }
  }

  // Extract and attach modal/pop-up nodes that are outside <main> in the source page
  attachPageModals(doc, mainEl, baseUrl) {
    try {
      const body = doc.querySelector('body');
      if (!body) return;

      const candidates = new Set();
      const pushAll = (list) => list.forEach((el) => candidates.add(el));
      pushAll(Array.from(body.querySelectorAll('.modal-overlay')));
      pushAll(Array.from(body.querySelectorAll('webropol-modal, webropol-settings-modal, webropol-chart-colours-modal')));
      pushAll(Array.from(body.querySelectorAll('[role="dialog"]')));
      // Common fixed full-screen overlays
      pushAll(Array.from(body.querySelectorAll('div.fixed.inset-0')));

      // Filter out anything already inside <main>
      const nodes = Array.from(candidates).filter((el) => {
        return !mainEl || !mainEl.contains(el);
      });

      if (!nodes.length) return;

      this.pageModalNodes = [];
      nodes.forEach((el) => {
        const clone = el.cloneNode(true);
        clone.setAttribute('data-spa-page-modal', '');
        // Ensure URLs inside the modal are rewritten too
        try { this.rewriteContentUrls(new URL(this._currentBaseUrl || location.href, location.href), clone); } catch (_) {}
        this.container.appendChild(clone);
        this.pageModalNodes.push(clone);
      });
    } catch (e) {
      console.warn('[SPA] Failed to attach page modals', e);
    }
  }

  cleanupPageModals() {
    try {
      if (!this.pageModalNodes || !this.pageModalNodes.length) return;
      this.pageModalNodes.forEach((n) => { try { n.remove(); } catch(_) {} });
      this.pageModalNodes = [];
    } catch (e) {
      // noop
    }
  }

  updateBreadcrumbs(path) {
    if (!this.breadcrumbs) return;
    const [purePath, queryStr] = path.split('?');
    const parts = purePath.replace(/^\//, '').split('/').filter(Boolean);
    const trail = [{ label: 'Home', url: 'index.html' }];

    // Special case: Create routes include section based on type
    if (purePath === '/create') {
      const params = new URLSearchParams(queryStr || '');
      const type = (params.get('type') || 'survey').toLowerCase();
      const sectionMap = {
        survey: { key: 'surveys', label: 'Surveys' },
        event: { key: 'events', label: 'Events' },
        exw: { key: 'exw', label: 'EXW' },
        'case-management': { key: 'case-management', label: 'Case Management' },
        sms: { key: 'sms', label: '2-Way SMS' },
      };
      const section = sectionMap[type] || sectionMap['survey'];
      trail.push({ label: section.label, url: `#/${section.key}` });
      trail.push({ label: 'Create', url: '#/create' + (queryStr ? `?${queryStr}` : '') });
    } else {
      let acc = '';
      for (const part of parts) {
        acc += `/${part}`;
        trail.push({ label: this.labels[part] || this.cap(part), url: `#${acc}` });
      }
    }

    this.breadcrumbs.setAttribute('trail', JSON.stringify(trail));
  }

  updateSidebarActive(path) {
    if (!this.sidebar) return;
    const [purePath, queryStr] = path.split('?');
    let first = purePath.split('/').filter(Boolean)[0] || 'home';

    // For create, derive section from type query
    if (first === 'create') {
      const params = new URLSearchParams(queryStr || '');
      const type = (params.get('type') || 'survey').toLowerCase();
      const typeToSection = {
        survey: 'surveys',
        event: 'events',
        exw: 'exw',
        'case-management': 'case-management',
        sms: 'sms',
      };
      first = typeToSection[type] || 'surveys';
    }

    const map = {
      '': 'home',
      home: 'home',
      surveys: 'surveys',
      events: 'events',
      sms: 'sms',
      exw: 'exw',
      'case-management': 'case-management',
      'mywebropol': 'mywebropol',
      news: 'news',
      'admin-tools': 'admin-tools',
      'training-videos': 'training-videos',
      shop: 'shop'
    };
    const active = map[first] || 'home';
    this.sidebar.setAttribute('active', active);
  }

  // Set document.title and header title based on current route
  updatePageTitle(path) {
    try {
      const [purePath] = (path || '/').split('?');
      // Determine label using configured labels map
      const parts = purePath.replace(/^\//, '').split('/').filter(Boolean);
      let label;
      if (!parts.length) {
        label = this.labels['home'] || 'Home';
      } else if (parts.length === 1) {
        label = this.labels[parts[0]] || this.cap(parts[0]);
      } else {
        // Prefer the deepest segment if it has a friendly label
        const deep = parts[parts.length - 1];
        label = this.labels[deep] || this.cap(deep);
        // Prepend top-level section for context (e.g., "Surveys • Edit")
        const top = this.labels[parts[0]] || this.cap(parts[0]);
        if (top && deep && top !== label) {
          label = `${top} • ${label}`;
        }
      }

      // Apply to document title
      if (label) {
        document.title = `Webropol - ${label}`;
      }

      // Update header component title if present (enhanced or legacy)
      // Skip title display on editor tab routes (surveys/sms edit/collect/aita/follow/report)
      const isEditorTabsRoute = [
        '/surveys/edit', '/surveys/blank-survey', '/surveys/collect', '/surveys/aita', '/surveys/follow', '/surveys/report',
        '/sms/edit', '/sms/collect', '/sms/aita', '/sms/follow', '/sms/report'
      ].includes(purePath);
      const header = document.querySelector('webropol-header-enhanced, webropol-header');
      if (header) {
        header.setAttribute('title', isEditorTabsRoute ? '' : (label || ''));
      }
    } catch (_) {
      // ignore
    }
  }

  setLoading(isLoading) {
    if (!this.container) return;
    if (isLoading) {
      this.container.classList.add('transition-loading');
    } else {
      this.container.classList.remove('transition-loading');
    }
  }

  scrollToTop() {
    try {
      this.container.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      this.container.scrollTop = 0;
    }
  }

  cap(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ') : s;
  }
}

function bootWebropolSPA() {
  if (window.WebropolSPA instanceof WebropolSPA) return;
  if (window.WebropolSPA && typeof window.WebropolSPA.dispose === 'function') {
    try { window.WebropolSPA.dispose(); } catch (_) {}
  }

  const spa = new WebropolSPA();
  spa.init();
  // Expose for sidebar to call navigate
  window.WebropolSPA = spa;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootWebropolSPA, { once: true });
} else {
  bootWebropolSPA();
}

export { WebropolSPA };
