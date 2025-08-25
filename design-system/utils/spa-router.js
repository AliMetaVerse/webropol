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
    this.pageScriptNodes = [];    // Map routes to source HTML files (relative to repo root)
    this.routes = new Map([
      ['/', 'index.html'],
      ['/home', 'index.html'],
      ['/surveys', 'surveys/index.html'],
      ['/surveys/list', 'surveys/list.html'],
      ['/surveys/edit', 'surveys/edit.html'],
      ['/events', 'events/index.html'],
      ['/events/list', 'events/list.html'],
      ['/sms', 'sms/index.html'],
      ['/exw', 'exw/index.html'],
      ['/case-management', 'case-management/index.html'],
      ['/mywebropol', 'mywebropol/index.html'],
      ['/admin-tools', 'admin-tools/index.html'],
      ['/training-videos', 'training-videos/index.html'],
      ['/shop', 'shop/index.html'],
      ['/create', 'create/index.html'],
      ['/design-system', 'design-system/index.html'],
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
      'training-videos': 'Training Videos',
      shop: 'Shop',
      create: 'Create',
      'design-system': 'Design System',
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
      this.load(route);
    });

    // Initial navigation
    const initialRoute = this.currentRouteFromHash() || '/home';
    if (!location.hash) {
      // Preserve the current shell content for home and set hash
      location.replace(`#${initialRoute}`);
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
      const route = url.pathname || '/';
      const query = url.search || '';
      return `${route}${query}`;
    } catch (_) {
      return hash.substring(1) || '/';
    }
  }

  hrefToRoute(href) {
    // Normalize relative links like ../surveys/list.html as well
    const a = document.createElement('a');
    a.href = href;
    // Compute path relative to origin
    let path = a.pathname;
    if (!path) return '/';
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

  async load(path) {
    const file = this.pathToFile(path);
    if (!file) return;
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
        // For pages with main tags, use the full main content including the wrapper
        // This preserves complex layouts like the create page's split screen
        nextHTML = main.outerHTML;
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
          nextHTML = contentArea.innerHTML;
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
  this.cleanupContainerAttributes();

  // Swap content
      this.container.innerHTML = nextHTML;
      
      // Apply body attributes to container for Alpine.js context
      if (bodyAttribs) {
        // Parse and apply x-data and other Alpine attributes
        const bodyEl = doc.querySelector('body');
        if (bodyEl) {
          Array.from(bodyEl.attributes).forEach(attr => {
            // Apply Alpine and CSS classes but skip inline styles to avoid static background conflicts
            if (attr.name.startsWith('x-') || attr.name === 'class') {
              this.container.setAttribute(attr.name, attr.value);
            }
          });
        }
      }

  // Attach page-specific styles from fetched document
  this.attachPageStyles(doc);
      // Re-initialize Alpine components within the injected content (if Alpine is present)
      try {
        if (window.Alpine && typeof window.Alpine.initTree === 'function') {
          // Give Alpine a moment to detect the new DOM structure
          setTimeout(() => {
            window.Alpine.initTree(this.container);
          }, 10);
        }
      } catch(e) {
        console.warn('[SPA] Alpine.js re-initialization failed:', e);
      }

  // Emit custom event for components that need to react to route changes
  window.dispatchEvent(new CustomEvent('spa-route-change', { 
    detail: { path, queryString } 
  }));

  // Execute inline scripts inside main/body of fetched doc
      this.runPageScripts(doc);

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

  attachPageStyles(doc) {
    try {
      const head = doc.querySelector('head');
      if (!head) return;
      const nodes = [];

      // Copy meta tags that might affect styling (viewport, etc.)
      head.querySelectorAll('meta[name="viewport"], meta[charset]').forEach((metaEl) => {
        const name = metaEl.getAttribute('name') || metaEl.getAttribute('charset');
        if (!name) return;
        const already = document.head.querySelector(`meta[name="${name}"], meta[charset="${name}"]`);
        if (already) return;
        const clone = metaEl.cloneNode(true);
        clone.setAttribute('data-spa-page-style', '');
        document.head.appendChild(clone);
        nodes.push(clone);
      });

      // Copy <style> blocks
      head.querySelectorAll('style').forEach((styleEl) => {
        const clone = document.createElement('style');
        clone.textContent = styleEl.textContent || '';
        clone.setAttribute('data-spa-page-style', '');
        document.head.appendChild(clone);
        nodes.push(clone);
      });

      // Copy <link rel="stylesheet"> not already present
      head.querySelectorAll('link[rel="stylesheet"]').forEach((linkEl) => {
        const href = linkEl.getAttribute('href');
        if (!href) return;
        const abs = new URL(href, location.href).href;
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
        clone.href = href;
        clone.setAttribute('data-spa-page-style', '');
        document.head.appendChild(clone);
        nodes.push(clone);
      });

      // Also copy any Google Fonts or other external font links
      head.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').forEach((linkEl) => {
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
        const abs = new URL(src, location.href).href;
        if (this.loadedExternalScripts.has(abs)) continue;
        const script = document.createElement('script');
        script.src = src;
        if (isModule) script.type = 'module';
        script.setAttribute('data-spa-page-script', '');
        document.body.appendChild(script);
        this.loadedExternalScripts.add(abs);
        this.pageScriptNodes.push(script);
      } else if (content) {
        // Always execute inline scripts, especially Tailwind configs and page logic
        const script = document.createElement('script');
        if (isModule) script.type = 'module';
        script.textContent = content;
        script.setAttribute('data-spa-page-script', '');
        document.body.appendChild(script);
        this.pageScriptNodes.push(script);
      }
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
      // Remove Alpine.js and page-specific attributes
      const attrsToRemove = [];
      Array.from(this.container.attributes).forEach(attr => {
        if (attr.name.startsWith('x-') || attr.name.startsWith('data-spa-') || attr.name === 'class' || attr.name === 'style') {
          attrsToRemove.push(attr.name);
        }
      });
      attrsToRemove.forEach(name => {
        this.container.removeAttribute(name);
      });
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
