/**
 * Webropol Adaptive Viewport Store
 *
 * Single source of truth for viewport mode used across the SPA, standalone
 * pages, and vanilla web components. Drives adaptive (not just responsive)
 * UI: mobile renders distinct markup via Alpine `x-if`/`x-show` and via
 * `body.is-mobile` CSS hooks; vanilla components subscribe to the
 * `viewport:change` window event.
 *
 * Breakpoints (must stay in sync with mobile-responsive.css):
 *   mobile  : <= 767px
 *   tablet  : 768 - 1023px
 *   desktop : 1024 - 1279px
 *   wide    : >= 1280px
 */
(function () {
  const BREAKPOINTS = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px) and (max-width: 1279px)',
    wide: '(min-width: 1280px)'
  };
  const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
  let bodySyncQueued = false;

  function detectMode() {
    if (typeof window === 'undefined' || !window.matchMedia) return 'desktop';
    if (window.matchMedia(BREAKPOINTS.mobile).matches) return 'mobile';
    if (window.matchMedia(BREAKPOINTS.tablet).matches) return 'tablet';
    if (window.matchMedia(BREAKPOINTS.desktop).matches) return 'desktop';
    return 'wide';
  }

  function isTouch() {
    return typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(TOUCH_QUERY).matches
      : false;
  }

  function syncBodyClasses(mode, touch) {
    if (typeof document === 'undefined' || !document.body) {
      queueBodySync();
      return false;
    }
    const body = document.body;
    ['is-mobile', 'is-tablet', 'is-desktop', 'is-wide'].forEach(c => body.classList.remove(c));
    body.classList.add('is-' + mode);
    body.classList.toggle('is-touch', !!touch);
    return true;
  }

  function queueBodySync() {
    if (typeof document === 'undefined' || bodySyncQueued) return;
    bodySyncQueued = true;
    const rerun = () => {
      bodySyncQueued = false;
      refresh(true);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', rerun, { once: true });
      return;
    }

    setTimeout(rerun, 0);
  }

  const state = {
    mode: detectMode(),
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isWide: false,
    isTouch: isTouch()
  };

  function refresh(initial) {
    const next = detectMode();
    const touch = isTouch();
    const changed = initial || next !== state.mode || touch !== state.isTouch;
    state.mode = next;
    state.isMobile = next === 'mobile';
    state.isTablet = next === 'tablet';
    state.isDesktop = next === 'desktop';
    state.isWide = next === 'wide';
    state.isTouch = touch;
    syncBodyClasses(next, touch);
    if (changed) {
      try {
        window.dispatchEvent(new CustomEvent('viewport:change', {
          detail: { mode: next, isMobile: state.isMobile, isTablet: state.isTablet, isTouch: touch }
        }));
      } catch (e) { /* no-op */ }
    }
  }

  function attachListeners() {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    Object.values(BREAKPOINTS).forEach(q => {
      const mql = window.matchMedia(q);
      const handler = () => refresh(false);
      if (mql.addEventListener) mql.addEventListener('change', handler);
      else if (mql.addListener) mql.addListener(handler);
    });
    const touchMql = window.matchMedia(TOUCH_QUERY);
    if (touchMql.addEventListener) touchMql.addEventListener('change', () => refresh(false));
    else if (touchMql.addListener) touchMql.addListener(() => refresh(false));
    window.addEventListener('orientationchange', () => refresh(false));
  }

  function registerAlpineStore() {
    if (!window.Alpine || !window.Alpine.store) return false;
    if (window.Alpine.store('viewport')) return true;
    window.Alpine.store('viewport', {
      get mode() { return state.mode; },
      get isMobile() { return state.isMobile; },
      get isTablet() { return state.isTablet; },
      get isDesktop() { return state.isDesktop; },
      get isWide() { return state.isWide; },
      get isTouch() { return state.isTouch; }
    });
    return true;
  }

  // Boot synchronously so first paint already has body classes.
  refresh(true);
  attachListeners();

  // Register store as soon as Alpine is available.
  if (window.Alpine) {
    registerAlpineStore();
  }
  document.addEventListener('alpine:init', registerAlpineStore);
  document.addEventListener('alpine:initialized', registerAlpineStore);

  // Expose for non-Alpine consumers.
  window.WebropolViewport = {
    get state() { return Object.assign({}, state); },
    get mode() { return state.mode; },
    refresh: () => refresh(false),
    onChange(handler) {
      window.addEventListener('viewport:change', handler);
      return () => window.removeEventListener('viewport:change', handler);
    }
  };
})();
