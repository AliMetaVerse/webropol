// Webropol SPA Router
// Hash-based client-side router that swaps the main content without reloading header/sidebar

class WebropolSPA {
  constructor() {
    // Container inside the shell where we inject page content
    this.container = null;
    this.sidebar = null;
    this.breadcrumbs = null;
    this.loadedExternalScripts = new Set();
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
  // Added explicit routes for survey report & AI text analysis views so SPA can navigate without reload
  ['/surveys/report', 'surveys/report.html'],
  ['/surveys/aita', 'surveys/aita.html'],
      ['/events', 'events/index.html'],
      ['/events/list', 'events/list.html'],
      ['/sms', 'sms/index.html'],
      ['/exw', 'exw/index.html'],
      ['/case-management', 'case-management/index.html'],
      ['/mywebropol', 'mywebropol/index.html'],
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
    ]);

    // Labels for breadcrumb generation
    this.labels = {
      '': 'Home',
      home: 'Home',
      surveys: 'Surveys',
      events: 'Events',
      sms: '2-Way SMS',
      exw: 'EXW',
      'case-management': 'Case Management',
      'mywebropol': 'MyWebropol',
      'admin-tools': 'Admin Tools',
  'user-management': 'User Management and Rights',
      'training-videos': 'Training Videos',
      shop: 'Shop',
      create: 'Create',
      'design-system': 'Design System',
  promo: 'Promo',
      list: 'List',
      edit: 'Edit',
      index: 'Home'
    };
  }

  init() {
    this.container = document.querySelector('#app-content');
    this.sidebar = document.querySelector('webropol-sidebar');
    this.breadcrumbs = document.querySelector('webropol-breadcrumbs');

    if (!this.container) {
      console.warn('[SPA] #app-content not found. SPA router will not run.');
      return;
    }

    // Intercept clicks on internal links to navigate client-side
  document.addEventListener('click', (e) => {
      // Respect modifier keys and targets
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank') {
        return;
      }

      // Handle hash routes like #/surveys/list directly
      if (href.startsWith('#/')) {
        e.preventDefault();
        this.navigate(href.substring(1));
        return;
      }

      // Handle html page links possibly with query (e.g., surveys/list.html or surveys/list.html?x=1)
      if (/\.html(\?|$)/i.test(href)) {
        e.preventDefault();
        const { route, query } = this.hrefToRoute(href);
        this.navigate(query ? `${route}?${query}` : route);
        return;
      }
    });

    // React to hash changes
    window.addEventListener('hashchange', () => {
      const route = this.currentRouteFromHash();
      const normalizedHash = `#${route.startsWith('/') ? route : `/${route}`}`;
      // If the hash contains the repo base segment, rewrite it once to a clean hash
      if (location.hash !== normalizedHash) {
        location.replace(normalizedHash);
        return; // wait for next hashchange or proceed on next event
      }
      this.load(route);
    });

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
      this.load(initialRoute);
    }
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
    const file = this.pathToFile(path);
    if (!file) return;
  // Compute absolute URL and base directory URL for the fetched document
  const fileUrl = new URL(file, location.href);
  const baseUrl = new URL('./', fileUrl);
  // Make base URL available to helpers (e.g., script/link resolution)
  this._currentBaseUrl = baseUrl.href;
    this.setLoading(true);
    try {
      const res = await fetch(file, { cache: 'no-cache' });
      const html = await res.text();
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

  // Clean up previously injected page styles
  this.cleanupPageStyles();
  this.cleanupPageScripts();
  this.cleanupPageModals();
  this.cleanupContainerAttributes();

  // Swap content
      this.container.innerHTML = nextHTML;

  // Rewrite internal links and asset URLs inside injected content to be SPA- and base-aware
  this.rewriteContentUrls(baseUrl, this.container);

      // Ensure fluid layout by removing max-width caps from common containers (applies in all modes)
      try {
        // Target typical layout wrappers that center content
        const candidates = this.container.querySelectorAll('.mx-auto, main, [class*="max-w-"], .container');
        candidates.forEach((el) => {
          if (!el.classList) return;
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
      // Re-initialize Alpine components within the injected content (if Alpine is present)
      try {
        if (window.Alpine && typeof window.Alpine.initTree === 'function') {
          // Give Alpine a moment to detect the new DOM structure
          setTimeout(() => {
            window.Alpine.initTree(this.container);
            // Also init any appended modals/popups (kept inside container for Alpine scope)
            if (this.pageModalNodes && this.pageModalNodes.length) {
              this.pageModalNodes.forEach((n) => {
                try { window.Alpine.initTree(n); } catch(_) {}
              });
            }
          }, 10);
        }
      } catch(e) {
        console.warn('[SPA] Alpine.js re-initialization failed:', e);
      }

      // Ask Tailwind Play CDN (if present) to rescan the DOM and generate any needed utilities
      try {
        if (window.tailwind && typeof window.tailwind.refresh === 'function') {
          window.tailwind.refresh();
        }
      } catch(_) {}

      // Execute inline and external scripts inside main/body of fetched doc (respecting base path)
      this.runPageScripts(doc, baseUrl);

      // Re-apply global settings after content load so UI reflects current configuration
      try {
        if (window.globalSettingsManager && typeof window.globalSettingsManager.applySettings === 'function') {
          window.globalSettingsManager.applySettings();
        }
      } catch (_) {}

  // Emit custom event AFTER scripts and settings are applied so pages can listen during SPA loads
      window.dispatchEvent(new CustomEvent('spa-route-change', { 
        detail: { path, queryString } 
      }));

      // Update stateful UI parts
      this.updateBreadcrumbs(path);
      this.updateSidebarActive(path);
      this.scrollToTop();
    } catch (err) {
      console.error('[SPA] Failed to load route', path, err);
      this.container.innerHTML = `<div class="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700">Failed to load ${path}</div>`;
    } finally {
      this.setLoading(false);
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
        const skip = /tailwindcss/.test(src) || /alpinejs/.test(src) || /kit\.fontawesome\.com/.test(src);
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
      pushAll(Array.from(body.querySelectorAll('webropol-modal, webropol-settings-modal')));
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
      'admin-tools': 'admin-tools',
      'training-videos': 'training-videos',
      shop: 'shop'
    };
    const active = map[first] || 'home';
    this.sidebar.setAttribute('active', active);
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

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const spa = new WebropolSPA();
  spa.init();
  // Expose for sidebar to call navigate
  window.WebropolSPA = spa;
});

export { WebropolSPA };
