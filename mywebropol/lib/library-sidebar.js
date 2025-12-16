// Library Sidebar Hide/Show Controller
// Mirrors shop sidebar collapse/launcher behavior without changing library sidebar content

class LibrarySidebarController {
  constructor() {
    this._collapseBtn = null; // floating collapse button when sidebar is visible
    this._launcher = null; // floating launcher when sidebar is collapsed
  this._menu = null; // floating menu when collapsed
    this._resizeHandler = null;
    this._sidebarWatchers = [];
  this._docClickHandler = null;
  this._escHandler = null;
  this._placeholder = null; // placeholder to restore sidebar content on expand
  this._moved = false; // whether content is portaled into menu
  this._leftContentEl = null; // the actual sidebar inner card to move
  this._settingsHandler = null; // listener for global settings changes

    // Cached refs
    this.grid = null;
    this.leftCol = null;
    this.rightCol = null;
  }

  init() {
  // Always attach listener for live CP changes
  this.ensureSettingsListener();

    // Respect global feature toggle from Control Panel
    try {
      const gsm = window.globalSettingsManager;
      const settings = gsm?.getAllSettings?.() || {};
      if (settings.librarySidebarEnhanced === false) {
        // If previously collapsed, restore.
        this.setCollapsedPref(false);
        return; // Disabled globally
      }
    } catch (_) { /* ignore and proceed with defaults */ }

    // Find the main grid and its columns
    this.grid = document.querySelector('main .grid.grid-cols-1');
    if (!this.grid) return;
    // Tailwind escaped selectors for lg:col-span-3 and lg:col-span-9
    this.leftCol = this.grid.querySelector('div.lg\\:col-span-3');
    this.rightCol = this.grid.querySelector('div.lg\\:col-span-9');
    if (!this.leftCol || !this.rightCol) return;

    // Remember the actual left content element and insert a placeholder before it
    this._leftContentEl = this.leftCol.firstElementChild || null;
    if (this._leftContentEl && !this._placeholder) {
      this._placeholder = document.createElement('div');
      this._placeholder.setAttribute('data-library-sidebar-placeholder', '');
      this.leftCol.insertBefore(this._placeholder, this._leftContentEl);
    }

    // Restore state
    if (this.getCollapsedPref()) this.collapse();
    else this.expand();

  }

  ensureSettingsListener() {
    if (this._settingsHandler) return;
    this._settingsHandler = () => {
      try {
        const gsm = window.globalSettingsManager;
        const settings = gsm?.getAllSettings?.() || {};
        const enabled = settings.librarySidebarEnhanced !== false;
        if (!enabled) {
          // Turn off behavior and clean up UI
          this.setCollapsedPref(false);
          // Always restore default visible state and remove floating UI
          if (this._moved) this.restoreLeftContent();
          this.removeMenu();
          this.removeLauncher();
          this.removeCollapseButton();
          if (this.leftCol) this.leftCol.style.display = '';
          if (this.rightCol) this.rightCol.style.gridColumn = '';
          this.removeFloatingListeners();
        } else {
          // If enabled later, (re-)initialize if not yet set up
          if (!this.grid) {
            // Try to set up now
            this.init();
            return;
          }
          this.expand();
        }
      } catch (_) { /* noop */ }
    };
    window.addEventListener('webropol-settings-applied', this._settingsHandler);
  }

  // --- State helpers ---
  getCollapsedPref() {
    try { return localStorage.getItem('webropol.librarySidebar.collapsed') === 'true'; } catch (_) { return false; }
  }
  setCollapsedPref(val) {
    try { localStorage.setItem('webropol.librarySidebar.collapsed', val ? 'true' : 'false'); } catch (_) {}
  }

  isCollapsed() { return !!(this.leftCol && this.leftCol.style && this.leftCol.style.display === 'none'); }

  // --- Public actions ---
  collapse() {
    if (!this.leftCol || !this.rightCol) return;
    // Hide left column
    this.leftCol.style.display = 'none';
    // Expand right column to full width
    this.rightCol.style.gridColumn = '1 / -1';
    this.setCollapsedPref(true);

  // Remove collapse button and ensure launcher + menu
    this.removeCollapseButton();
  this.createLauncher();
  this.buildMenu();
  this.portalLeftContentToMenu();
    this.ensureFloatingListeners();
    this.repositionFloatingUI();
  }

  expand() {
    if (!this.leftCol || !this.rightCol) return;
    // Show left column
    this.leftCol.style.display = '';
    // Restore right column span (let Tailwind classes apply)
    this.rightCol.style.gridColumn = '';
    this.setCollapsedPref(false);

  // Remove launcher/menu and show collapse button
  this.removeLauncher();
  this.restoreLeftContent();
  this.removeMenu();
    this.createCollapseButton();
    this.ensureFloatingListeners();
    this.repositionFloatingUI();
  }

  // --- Floating UI builders ---
  createCollapseButton() {
    if (this._collapseBtn || !this.leftCol) return;
    const btn = document.createElement('button');
    btn.setAttribute('data-library-collapse', '');
    btn.title = 'Hide library sidebar';
    btn.setAttribute('aria-label', 'Hide library sidebar');
    Object.assign(btn.style, {
      position: 'fixed',
      top: '140px',
      left: '16px',
      zIndex: '9003'
    });
    btn.className = 'w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 shadow-md hover:text-primary-600 hover:border-primary-300 hover:shadow-lg transition-all';
    btn.innerHTML = '<i class="fal fa-angle-double-left"></i>';
    btn.addEventListener('click', (e) => { e.preventDefault(); this.collapse(); });
    document.body.appendChild(btn);
    this._collapseBtn = btn;
  }

  removeCollapseButton() {
    if (this._collapseBtn && this._collapseBtn.parentNode) this._collapseBtn.parentNode.removeChild(this._collapseBtn);
    this._collapseBtn = null;
  }

  createLauncher() {
    if (this._launcher) return;
    const btn = document.createElement('button');
    btn.setAttribute('data-library-launcher', '');
  btn.title = 'Open library menu / Show sidebar';
  btn.setAttribute('aria-label', 'Open library menu');
    Object.assign(btn.style, {
      position: 'fixed',
      top: '140px',
      left: '16px',
      zIndex: '9003'
    });
    btn.className = 'w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 shadow-md hover:text-primary-600 hover:border-primary-300 hover:shadow-lg transition-all';
  btn.innerHTML = '<i class="fa-light fa-ellipsis-vertical"></i>';
  btn.addEventListener('click', (e) => { e.preventDefault(); this.toggleMenu(); });
    document.body.appendChild(btn);
    this._launcher = btn;
  }

  removeLauncher() {
    if (this._launcher && this._launcher.parentNode) this._launcher.parentNode.removeChild(this._launcher);
    this._launcher = null;
  }

  // --- Floating menu ---
  buildMenu() {
    if (this._menu) { return; }
    const menu = document.createElement('div');
    menu.setAttribute('data-library-menu', '');
    Object.assign(menu.style, {
      position: 'fixed',
      top: '184px',
      left: '16px',
  width: '360px',
      maxHeight: '70vh',
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid rgba(203,213,225,0.8)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      zIndex: '9003',
      display: 'none'
    });
    menu.innerHTML = `
      <div class="p-3 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-[12px]">
        <div class="flex items-center gap-2">
          <i class="fal fa-books text-primary-600"></i>
          <span class="font-semibold text-slate-800">Library</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="library-menu-restore w-8 h-8 rounded-lg hover:bg-primary-50 text-primary-600" title="Show sidebar" aria-label="Show sidebar"><i class="fal fa-columns"></i></button>
          <button class="library-menu-close w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Close"><i class="fal fa-times"></i></button>
        </div>
      </div>
      <div class="p-2" data-library-menu-content></div>`;

    document.body.appendChild(menu);
    this._menu = menu;

  // Content portaling is handled in portalLeftContentToMenu()

    // Wire basic interactions (restore/close)
    menu.addEventListener('click', (e) => {
      const close = e.target.closest('.library-menu-close');
      const restore = e.target.closest('.library-menu-restore');
      if (close) { this.hideMenu(); }
      if (restore) { this.hideMenu(); this.expand(); }
    });

    this.ensureFloatingListeners();
  }

  portalLeftContentToMenu() {
    if (this._moved) return;
    if (!this._menu) return;
    const mount = this._menu.querySelector('[data-library-menu-content]');
    if (!mount) return;
    if (!this._leftContentEl) return;
    // Move the element
    try {
      // Tweak spacing for menu context
      this._leftContentEl.style.margin = '8px';
      this._leftContentEl.classList.add('shadow-none');
      mount.appendChild(this._leftContentEl);
      this._moved = true;
    } catch (_) { /* noop */ }
  }

  restoreLeftContent() {
    if (!this._moved) return;
    if (!this._placeholder || !this._leftContentEl) return;
    try {
      // Restore styles (let original card styling apply)
      this._leftContentEl.style.margin = '';
      this._leftContentEl.classList.remove('shadow-none');
      this.leftCol.insertBefore(this._leftContentEl, this._placeholder.nextSibling);
      this._moved = false;
    } catch (_) { /* noop */ }
  }

  updateMenuActiveStates() { /* no-op: tabs are cloned with original styling */ }

  toggleMenu() {
    if (!this._menu) this.buildMenu();
    if (!this._menu) return;
    const willShow = (this._menu.style.display === 'none' || !this._menu.style.display);
    this._menu.style.display = willShow ? 'block' : 'none';
    if (willShow) this._ensureMenuCloseBehaviors(); else this.hideMenu();
    this.updateMenuActiveStates();
  }
  hideMenu() {
    if (this._menu) this._menu.style.display = 'none';
    // Remove outside click / esc listeners
    if (this._docClickHandler) {
      document.removeEventListener('mousedown', this._docClickHandler, true);
      this._docClickHandler = null;
    }
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler, true);
      this._escHandler = null;
    }
  }
  removeMenu() {
    this.hideMenu();
    if (this._menu && this._menu.parentNode) this._menu.parentNode.removeChild(this._menu);
    this._menu = null;
  }

  // --- Bridge to Alpine to change current view ---
  getCurrentView() {
    try {
      if (window.Alpine && document.body) {
        const data = window.Alpine.$data(document.body);
        return data && typeof data.currentView === 'string' ? data.currentView : null;
      }
    } catch (_) {}
    return null;
  }
  setView(view) {
    try {
      if (window.Alpine && document.body) {
        const data = window.Alpine.$data(document.body);
        if (data && typeof data.setView === 'function') data.setView(view);
        else if (data && 'currentView' in data) data.currentView = view;
      }
    } catch (_) { /* noop */ }
    this.updateMenuActiveStates();
  }

  // --- Positioning helpers ---
  computeLeftOffset() {
    try {
      let maxRight = 0;
      // Modern enhanced sidebar if present
      const enhanced = document.querySelector('webropol-sidebar-enhanced');
      if (enhanced) {
        const rect = enhanced.getBoundingClientRect();
        if (rect && rect.width > 1) maxRight = Math.max(maxRight, rect.right);
      }
      // Legacy/global sidebar container
      const legacyInner = document.querySelector('webropol-sidebar aside.sidebar-container') || document.querySelector('aside.sidebar-container');
      if (legacyInner) {
        const r = legacyInner.getBoundingClientRect();
        if (r && r.width > 1) maxRight = Math.max(maxRight, r.right);
      }
      // If nothing meaningful, keep default 16px from left
      if (!maxRight || maxRight < 1) return 16;
      return Math.round(maxRight + 16);
    } catch (_) { return 16; }
  }

  computeCollapseBtnTop() {
    try {
      if (!this.leftCol) return 140;
      const rect = this.leftCol.getBoundingClientRect();
      if (!rect || rect.height < 1) return 140;
      // Position near top of the left card area
      return Math.max(80, Math.round(rect.top + 12));
    } catch (_) { return 140; }
  }

  repositionFloatingUI() {
    const leftBase = this.computeLeftOffset();
    const topPos = this.computeCollapseBtnTop();
    if (this._collapseBtn) {
      this._collapseBtn.style.left = leftBase + 'px';
      this._collapseBtn.style.top = topPos + 'px';
    }
    if (this._launcher) {
      this._launcher.style.left = leftBase + 'px';
      this._launcher.style.top = topPos + 'px';
    }
    if (this._menu) {
      this._menu.style.left = leftBase + 'px';
      this._menu.style.top = (topPos + 44) + 'px';
    }
  }

  // After showing the menu, attach close behaviors
  _ensureMenuCloseBehaviors() {
    if (!this._menu) return;
    if (!this._docClickHandler) {
      this._docClickHandler = (e) => {
        if (!this._menu) return;
        const insideMenu = this._menu.contains(e.target);
        const launcherClicked = !!(this._launcher && this._launcher.contains(e.target));
        if (!insideMenu && !launcherClicked) this.hideMenu();
      };
      document.addEventListener('mousedown', this._docClickHandler, true);
    }
    if (!this._escHandler) {
      this._escHandler = (e) => { if (e.key === 'Escape') this.hideMenu(); };
      document.addEventListener('keydown', this._escHandler, true);
    }
  }

  ensureFloatingListeners() {
    if (!this._resizeHandler) {
      this._resizeHandler = () => this.repositionFloatingUI();
      window.addEventListener('resize', this._resizeHandler);
    }
    this.addSidebarWatchers();
    setTimeout(() => this.repositionFloatingUI(), 0);
  }

  removeFloatingListeners() {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
    this.removeSidebarWatchers();
  }

  addSidebarWatchers() {
    this.removeSidebarWatchers();
    const cands = [];
    const enhanced = document.querySelector('webropol-sidebar-enhanced');
    if (enhanced) cands.push(enhanced);
    const legacyInner = document.querySelector('webropol-sidebar aside.sidebar-container') || document.querySelector('aside.sidebar-container');
    if (legacyInner) cands.push(legacyInner);
    cands.forEach(el => {
      const handler = () => setTimeout(() => this.repositionFloatingUI(), 50);
      el.addEventListener('transitionend', handler);
      el.addEventListener('mouseenter', handler);
      el.addEventListener('mouseleave', handler);
      this._sidebarWatchers.push({ el, handler });
    });
  }

  removeSidebarWatchers() {
    this._sidebarWatchers.forEach(({ el, handler }) => {
      try {
        el.removeEventListener('transitionend', handler);
        el.removeEventListener('mouseenter', handler);
        el.removeEventListener('mouseleave', handler);
      } catch (_) {}
    });
    this._sidebarWatchers = [];
  }
}

// Bootstrap on DOM ready
(() => {
  const boot = () => {
    try {
      const ctrl = new LibrarySidebarController();
  ctrl.init();
      // Expose minimal API for debugging
      window.WebropolLibrarySidebar = ctrl;
    } catch (e) { /* noop */ }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
