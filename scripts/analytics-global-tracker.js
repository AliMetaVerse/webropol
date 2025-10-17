/**
 * Webropol Global Analytics Tracker
 * 
 * Centralized analytics system that automatically tracks:
 * - All page visits across the entire application
 * - Hash-based SPA navigation
 * - User sessions and unique visitors
 * - File names and page context
 * - Referrers and navigation patterns
 * 
 * Usage: Include this script in your base HTML template or layout
 * <script src="/scripts/analytics-global-tracker.js"></script>
 * 
 * The tracker auto-initializes and requires no manual setup!
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'webropolGlobalAnalytics',
        SESSION_KEY: 'webropolSessionId',
        AUTO_SAVE_INTERVAL: 5000, // 5 seconds
        DEBOUNCE_DELAY: 300, // 300ms
        ENABLED: true,
        DEBUG: true // Set to false in production
    };
    
    // Global Analytics Manager
    class GlobalAnalyticsTracker {
        constructor() {
            this.sessionId = this.getOrCreateSessionId();
            this.lastTracked = null;
            this.saveTimer = null;
            this.geo = null; // { code: 'US', name: 'United States' }
            this.geoPromise = null;
            
            // Initialize data structure
            this.data = {
                visitors: [],
                sessions: [],
                pages: {},
                spaSections: {},
                navigation: [],
                metadata: {
                    firstTracked: Date.now(),
                    lastUpdated: Date.now(),
                    version: '2.0.0',
                    env: (window.WebropolAnalyticsConfig && window.WebropolAnalyticsConfig.env) || undefined,
                    baseUrl: (window.WebropolAnalyticsConfig && typeof window.WebropolAnalyticsConfig.baseUrl === 'function') ? window.WebropolAnalyticsConfig.baseUrl() : undefined
                }
            };
            
            this.loadData();
            this.init();
        }

        // Resolve a SPA route (e.g., "/surveys/edit?id=1") to a source HTML file path (e.g., "surveys/edit.html")
        resolveRouteToFile(route) {
            try {
                if (!route) return '';
                // Strip query/hash from route and ensure it starts with '/'
                const raw = route.split('#')[0];
                const pure = (raw.split('?')[0] || '').trim();
                const path = pure.startsWith('/') ? pure : `/${pure}`;

                // Prefer SPA router's own resolver if available
                try {
                    if (window.WebropolSPA && typeof window.WebropolSPA.pathToFile === 'function') {
                        const file = window.WebropolSPA.pathToFile(path);
                        if (file && typeof file === 'string') return file.replace(/^\/+/, '');
                    }
                } catch (_) { /* ignore */ }

                // Fallback heuristic similar to router: top-level maps to index.html, deeper maps to .html
                if (path === '/' || path.toLowerCase() === '/home') return 'index.html';
                const parts = path.split('/').filter(Boolean);
                if (!parts.length) return 'index.html';
                if (parts.length === 1) return `${parts[0]}/index.html`;
                return `${parts.join('/')}.html`;
            } catch (_) {
                return '';
            }
        }
        
        getOrCreateSessionId() {
            let sessionId = sessionStorage.getItem(CONFIG.SESSION_KEY);
            
            if (!sessionId) {
                sessionId = this.generateSessionId();
                sessionStorage.setItem(CONFIG.SESSION_KEY, sessionId);
            }
            
            return sessionId;
        }
        
        generateSessionId() {
            return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        init() {
            if (!CONFIG.ENABLED) {
                console.log('[Global Analytics] Tracking disabled');
                return;
            }
            
            this.log('Initialized', {
                sessionId: this.sessionId,
                page: window.location.pathname,
                hash: window.location.hash
            });
            
            // Kick off geo lookup ASAP (non-blocking)
            this.fetchGeo().finally(() => {
                // After geo resolves, tag the most recent item if any
                this.tagCountryOnLast();
            });

            // Track initial page load immediately (do not block on geo)
            this.trackPageLoad();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Auto-save interval
            this.startAutoSave();
            
            // Expose to window for manual access
            window.webropolAnalytics = this;
            
            this.log('Ready to track!');
        }

        // Attempt to detect visitor country using public geolocation endpoints with graceful fallback
        async fetchGeo() {
            if (this.geoPromise) return this.geoPromise;
            const setGeo = (code, name) => {
                if (!code && !name) return;
                try {
                    // Normalize code to 2-letter upper if present
                    const cc = (code || '').toString().trim().toUpperCase();
                    const display = name || (cc && this.regionNameFromCode(cc)) || 'Unknown';
                    this.geo = { code: cc || undefined, name: display };
                    this.scheduleSave();
                } catch(_) {}
            };
            const tryProviders = async () => {
                // Provider 1: ipapi.co
                try {
                    const res = await fetch('https://ipapi.co/json/');
                    if (res.ok) {
                        const j = await res.json();
                        if (j && (j.country || j.country_code)) {
                            setGeo(j.country_code || j.country, j.country_name || j.country);
                            return;
                        }
                    }
                } catch(_) {}
                // Provider 2: ipinfo.io (may require token in some environments)
                try {
                    const res = await fetch('https://ipinfo.io/json?token=');
                    if (res.ok) {
                        const j = await res.json();
                        if (j && (j.country || j.countryCode)) {
                            setGeo(j.country || j.countryCode, undefined);
                            return;
                        }
                    }
                } catch(_) {}
                // Fallback: Infer from browser locale region if available
                try {
                    const lang = (navigator.language || navigator.userLanguage || '').toString();
                    const maybeRegion = lang.split('-')[1];
                    if (maybeRegion) {
                        setGeo(maybeRegion.toUpperCase(), undefined);
                        return;
                    }
                } catch(_) {}
                // Fallback: Unknown
                setGeo(undefined, 'Unknown');
            };
            this.geoPromise = tryProviders();
            return this.geoPromise;
        }

        regionNameFromCode(code) {
            try {
                if (!code) return undefined;
                if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
                    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
                    return dn.of(code);
                }
            } catch(_) {}
            return undefined;
        }

        tagCountryOnLast() {
            try {
                if (!this.geo || !this.lastTracked) return;
                // Determine whether lastTracked refers to a page or a route
                if (this.data.pages[this.lastTracked]) {
                    const entry = this.data.pages[this.lastTracked];
                    entry.countries = entry.countries || {};
                    const cc = this.geo.code || 'XX';
                    entry.countries[cc] = (entry.countries[cc] || 0) + 1;
                    entry.lastCountry = this.geo.name;
                } else if (this.data.spaSections[this.lastTracked]) {
                    const entry = this.data.spaSections[this.lastTracked];
                    entry.countries = entry.countries || {};
                    const cc = this.geo.code || 'XX';
                    entry.countries[cc] = (entry.countries[cc] || 0) + 1;
                    entry.lastCountry = this.geo.name;
                }
                this.scheduleSave();
            } catch(_) {}
        }
        
        trackPageLoad() {
            const pageData = this.getPageData();
            
            // Track page view
            this.trackPageView(pageData);
            
            // Track hash route if present
            if (pageData.hashRoute) {
                this.trackHashRoute(pageData.hashRoute, pageData);
            } else if (pageData.hash) {
                // Track simple hash sections (e.g., #overview, #analytics) used by CP and other pages
                const simple = pageData.hash.replace('#', '').trim();
                if (simple) {
                    this.trackSimpleSection(simple, pageData);
                }
            }
            
            // Track navigation flow
            this.trackNavigation(pageData);
        }
        
        getPageData() {
            const url = new URL(window.location.href);
            const pathname = url.pathname;
            const hash = url.hash;
            const search = url.search;
            
            // Extract file name
            const pathParts = pathname.split('/').filter(p => p);
            const fileName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'index.html';
            
            // Extract hash route (e.g., #/home, #/surveys/list)
            let hashRoute = null;
            if (hash && hash.includes('/')) {
                hashRoute = hash.replace('#', '');
            }
            
            // Get referrer
            const referrer = document.referrer || '(direct)';
            
            return {
                url: window.location.href,
                pathname,
                hash,
                hashRoute,
                search,
                fileName,
                directory: pathname.substring(0, pathname.lastIndexOf('/')),
                referrer,
                title: document.title,
                timestamp: Date.now()
            };
        }
        
        trackPageView(pageData) {
            const pageKey = pageData.pathname;
            
            // Add visitor to global set
            if (!this.data.visitors.includes(this.sessionId)) {
                this.data.visitors.push(this.sessionId);
            }
            
            // Add session to sessions list
            if (!this.data.sessions.some(s => s.sessionId === this.sessionId)) {
                this.data.sessions.push({
                    sessionId: this.sessionId,
                    firstSeen: Date.now(),
                    lastSeen: Date.now(),
                    pageCount: 0,
                    pages: []
                });
            }
            
            // Update session
            const session = this.data.sessions.find(s => s.sessionId === this.sessionId);
            if (session) {
                session.lastSeen = Date.now();
                session.pageCount++;
                if (!session.pages.includes(pageKey)) {
                    session.pages.push(pageKey);
                }
            }
            
            // Initialize page if not exists
            if (!this.data.pages[pageKey]) {
                this.data.pages[pageKey] = {
                    uniqueVisitors: [],
                    totalViews: 0,
                    lastVisit: Date.now(),
                    firstVisit: Date.now(),
                    fileName: pageData.fileName,
                    directory: pageData.directory,
                    title: pageData.title,
                    referrers: {},
                    countries: {}
                };
            }
            
            // Track visitor
            if (!this.data.pages[pageKey].uniqueVisitors.includes(this.sessionId)) {
                this.data.pages[pageKey].uniqueVisitors.push(this.sessionId);
            }
            
            // Increment view count
            this.data.pages[pageKey].totalViews++;
            this.data.pages[pageKey].lastVisit = Date.now();
            this.data.pages[pageKey].title = pageData.title; // Update title if changed
            // Add country if available
            if (this.geo) {
                const cc = this.geo.code || 'XX';
                this.data.pages[pageKey].countries[cc] = (this.data.pages[pageKey].countries[cc] || 0) + 1;
                this.data.pages[pageKey].lastCountry = this.geo.name;
            }
            
            // Track referrer
            if (pageData.referrer !== window.location.href) {
                if (!this.data.pages[pageKey].referrers[pageData.referrer]) {
                    this.data.pages[pageKey].referrers[pageData.referrer] = 0;
                }
                this.data.pages[pageKey].referrers[pageData.referrer]++;
            }
            
            this.lastTracked = pageKey;
            this.scheduleSave();
            
            this.log('Page tracked', {
                page: pageKey,
                file: pageData.fileName,
                visitors: this.data.pages[pageKey].uniqueVisitors.length,
                views: this.data.pages[pageKey].totalViews
            });
        }
        
        trackHashRoute(hashRoute, pageData) {
            if (!hashRoute || hashRoute === this.lastTracked) {
                return; // Avoid duplicate tracking
            }
            // Normalize key and derive display file
            const routeKey = hashRoute;
            const cleanRoute = (hashRoute || '').split('#')[0];
            const resolvedFile = this.resolveRouteToFile(cleanRoute);
            // If resolution fails, fallback to a reasonable guess
            let displayFile = resolvedFile;
            if (!displayFile) {
                const noQuery = cleanRoute.split('?')[0] || '';
                const ensured = noQuery.startsWith('/') ? noQuery : `/${noQuery}`;
                const parts = ensured.split('/').filter(Boolean);
                if (!parts.length) {
                    displayFile = 'index.html';
                } else if (parts.length === 1) {
                    displayFile = `${parts[0]}/index.html`;
                } else {
                    displayFile = `${parts.join('/')}.html`;
                }
            }
            
            // Initialize route if not exists
            if (!this.data.spaSections[routeKey]) {
                this.data.spaSections[routeKey] = {
                    uniqueVisitors: [],
                    totalViews: 0,
                    lastVisit: Date.now(),
                    firstVisit: Date.now(),
                    pagePath: pageData.pathname,
                    sectionName: hashRoute,
                    fileName: displayFile,
                    targetFile: displayFile,
                    isHashRoute: true,
                    countries: {}
                };
            }
            // Keep file name updated if it was previously a route fragment
            else {
                this.data.spaSections[routeKey].fileName = displayFile;
                this.data.spaSections[routeKey].targetFile = displayFile;
            }
            // Add country if available
            if (this.geo) {
                const cc = this.geo.code || 'XX';
                this.data.spaSections[routeKey].countries[cc] = (this.data.spaSections[routeKey].countries[cc] || 0) + 1;
                this.data.spaSections[routeKey].lastCountry = this.geo.name;
            }
            
            // Track visitor
            if (!this.data.spaSections[routeKey].uniqueVisitors.includes(this.sessionId)) {
                this.data.spaSections[routeKey].uniqueVisitors.push(this.sessionId);
            }
            
            // Increment view count
            this.data.spaSections[routeKey].totalViews++;
            this.data.spaSections[routeKey].lastVisit = Date.now();
            
            this.lastTracked = routeKey;
            this.scheduleSave();
            
            this.log('Hash route tracked', {
                route: hashRoute,
                file: this.data.spaSections[routeKey].fileName,
                visitors: this.data.spaSections[routeKey].uniqueVisitors.length,
                views: this.data.spaSections[routeKey].totalViews
            });
        }

        // Track simple in-page hash sections (without "/"), e.g., #overview on cp page
        trackSimpleSection(sectionName, pageData) {
            if (!sectionName) return;

            const sectionKey = `${pageData.pathname}#${sectionName}`;
            if (sectionKey === this.lastTracked) return; // Avoid duplicate

            // Ensure visitor accounting
            if (!this.data.visitors.includes(this.sessionId)) {
                this.data.visitors.push(this.sessionId);
            }

            // If section looks like a query-style route (e.g., "create?type=survey"), try to resolve to a file
            let resolvedDisplayFile = pageData.fileName;
            try {
                if (/[?]/.test(sectionName)) {
                    const pseudoRoute = '/' + sectionName; // normalize to route style
                    const mapped = this.resolveRouteToFile(pseudoRoute);
                    if (mapped) resolvedDisplayFile = mapped;
                }
            } catch (_) { /* ignore */ }

            // Initialize section if not exists
            if (!this.data.spaSections[sectionKey]) {
                this.data.spaSections[sectionKey] = {
                    uniqueVisitors: [],
                    totalViews: 0,
                    lastVisit: Date.now(),
                    firstVisit: Date.now(),
                    pagePath: pageData.pathname,
                    sectionName,
                    fileName: resolvedDisplayFile,
                    targetFile: resolvedDisplayFile,
                    isHashRoute: false,
                    countries: {}
                };
            }

            // Track visitor and increment
            const entry = this.data.spaSections[sectionKey];
            // Keep file mapping updated if we learned a better resolution
            if (entry && resolvedDisplayFile && entry.fileName !== resolvedDisplayFile) {
                entry.fileName = resolvedDisplayFile;
                entry.targetFile = resolvedDisplayFile;
            }
            if (!entry.uniqueVisitors.includes(this.sessionId)) {
                entry.uniqueVisitors.push(this.sessionId);
            }
            entry.totalViews++;
            entry.lastVisit = Date.now();
            if (this.geo) {
                const cc = this.geo.code || 'XX';
                entry.countries[cc] = (entry.countries[cc] || 0) + 1;
                entry.lastCountry = this.geo.name;
            }

            this.lastTracked = sectionKey;
            this.scheduleSave();

            this.log('Simple section tracked', {
                section: sectionName,
                page: pageData.pathname,
                visitors: entry.uniqueVisitors.length,
                views: entry.totalViews
            });
        }
        
        trackNavigation(pageData) {
            // Track navigation flow (from → to)
            const navigationEntry = {
                sessionId: this.sessionId,
                from: document.referrer || '(direct)',
                to: pageData.url,
                timestamp: Date.now()
            };
            
            this.data.navigation.push(navigationEntry);
            
            // Keep only last 1000 navigation entries
            if (this.data.navigation.length > 1000) {
                this.data.navigation = this.data.navigation.slice(-1000);
            }
        }
        
        setupEventListeners() {
            // Track hash changes (SPA navigation)
            let hashChangeTimer;
            window.addEventListener('hashchange', () => {
                clearTimeout(hashChangeTimer);
                hashChangeTimer = setTimeout(() => {
                    const pageData = this.getPageData();
                    
                    if (pageData.hashRoute) {
                        this.trackHashRoute(pageData.hashRoute, pageData);
                    } else if (pageData.hash) {
                        const simple = pageData.hash.replace('#', '').trim();
                        if (simple) this.trackSimpleSection(simple, pageData);
                    }
                    
                    this.trackNavigation(pageData);
                }, CONFIG.DEBOUNCE_DELAY);
            });
            
            // Track page visibility changes
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    const currentPage = window.location.pathname;
                    if (this.data.pages[currentPage]) {
                        this.data.pages[currentPage].lastVisit = Date.now();
                        this.scheduleSave();
                    }
                }
            });
            
            // Track page unload (save data before leaving)
            window.addEventListener('beforeunload', () => {
                this.saveData();
            });
            
            // Track clicks (optional - for detailed interaction tracking)
            if (CONFIG.DEBUG) {
                document.addEventListener('click', (e) => {
                    const target = e.target.closest('a, button');
                    if (target) {
                        this.log('Click tracked', {
                            element: target.tagName,
                            text: target.textContent?.substring(0, 50),
                            href: target.href || 'n/a'
                        });
                    }
                }, true);
            }
        }
        
        scheduleSave() {
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => {
                this.saveData();
            }, 1000);
        }
        
        startAutoSave() {
            setInterval(() => {
                if (this.data) {
                    this.saveData();
                }
            }, CONFIG.AUTO_SAVE_INTERVAL);
        }
        
        loadData() {
            try {
                const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    this.data = {
                        ...this.data,
                        ...parsed
                    };
                    this.log('Data loaded', {
                        visitors: this.data.visitors.length,
                        pages: Object.keys(this.data.pages).length,
                        sections: Object.keys(this.data.spaSections).length
                    });
                }
            } catch (e) {
                console.error('[Global Analytics] Failed to load data:', e);
            }
        }
        
        saveData() {
            try {
                this.data.metadata.lastUpdated = Date.now();
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
                this.log('Data saved');
            } catch (e) {
                console.error('[Global Analytics] Failed to save data:', e);
            }
        }
        
        // Public API Methods
        
        exportData() {
            return JSON.parse(JSON.stringify(this.data));
        }
        
        clearData() {
            if (confirm('Are you sure you want to clear all analytics data?')) {
                localStorage.removeItem(CONFIG.STORAGE_KEY);
                sessionStorage.removeItem(CONFIG.SESSION_KEY);
                this.data = {
                    visitors: [],
                    sessions: [],
                    pages: {},
                    spaSections: {},
                    navigation: [],
                    metadata: {
                        firstTracked: Date.now(),
                        lastUpdated: Date.now(),
                        version: '2.0.0'
                    }
                };
                this.log('Data cleared');
                return true;
            }
            return false;
        }
        
        getStats() {
            return {
                totalVisitors: this.data.visitors.length,
                totalSessions: this.data.sessions.length,
                totalPages: Object.keys(this.data.pages).length,
                totalSPASections: Object.keys(this.data.spaSections).length,
                totalPageViews: Object.values(this.data.pages).reduce((sum, page) => sum + page.totalViews, 0),
                totalSPAViews: Object.values(this.data.spaSections).reduce((sum, section) => sum + section.totalViews, 0),
                currentSession: this.sessionId,
                lastUpdated: new Date(this.data.metadata.lastUpdated).toLocaleString()
            };
        }
        
        log(message, data = null) {
            if (CONFIG.DEBUG) {
                if (data) {
                    console.log(`[Global Analytics] ${message}`, data);
                } else {
                    console.log(`[Global Analytics] ${message}`);
                }
            }
        }
    }
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new GlobalAnalyticsTracker();
        });
    } else {
        new GlobalAnalyticsTracker();
    }
    
})();
