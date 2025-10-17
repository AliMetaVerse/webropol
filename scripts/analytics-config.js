/**
 * Webropol Analytics Environment Config
 *
 * Purpose: Provide a single place to resolve absolute URLs for
 * - GitHub Pages production: https://alimetaverse.github.io/webropol/
 * - Local development:      http://127.0.0.1:5500/
 *
 * Usage (global): window.WebropolAnalyticsConfig.buildUrl('/surveys/index.html')
 */
(function () {
  const PROD_ORIGIN = 'https://alimetaverse.github.io';
  const PROD_BASE_PATH = '/webropol/';

  const LOCAL_ORIGIN = 'http://127.0.0.1:5500';
  const LOCAL_BASE_PATH = '/';

  function detectEnv() {
    const origin = (window.location && window.location.origin) || '';
    if (origin === PROD_ORIGIN) return 'production';
    if (origin === LOCAL_ORIGIN) return 'local';
    // Accept localhost:5500 as local, and any *.github.io as production fallback
    if (/^http:\/\/(127\.0\.0\.1|localhost):5500$/.test(origin)) return 'local';
    if (/github\.io$/.test(new URL(origin).hostname || '')) return 'production';
    // Default to local for safety
    return 'local';
  }

  const ENV = detectEnv();
  const CFG = {
    production: { origin: PROD_ORIGIN, basePath: PROD_BASE_PATH },
    local: { origin: LOCAL_ORIGIN, basePath: LOCAL_BASE_PATH },
  };

  function ensureLeadingSlash(p) {
    if (!p) return '/';
    return p.startsWith('/') ? p : '/' + p;
  }

  function buildUrl(pathname) {
    let p = ensureLeadingSlash(String(pathname || '/'));
    if (ENV === 'production') {
      // Guarantee single basePath prefix
      if (!p.startsWith(PROD_BASE_PATH)) {
        p = PROD_BASE_PATH.replace(/\/$/, '') + p;
      }
      return PROD_ORIGIN + p;
    } else {
      // Strip "/webropol" when opening locally
      p = p.replace(/^\/webropol\/?/, '/');
      return LOCAL_ORIGIN + p;
    }
  }

  function baseUrl() {
    return ENV === 'production' ? (PROD_ORIGIN + PROD_BASE_PATH) : (LOCAL_ORIGIN + '/');
  }

  // Expose globally in a non-destructive way
  window.WebropolAnalyticsConfig = Object.assign(
    {
      env: ENV,
      origins: { production: PROD_ORIGIN, local: LOCAL_ORIGIN },
      basePaths: { production: PROD_BASE_PATH, local: LOCAL_BASE_PATH },
      buildUrl,
      baseUrl,
    },
    window.WebropolAnalyticsConfig || {}
  );
})();
