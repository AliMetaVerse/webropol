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
                    version: '2.0.0'
                }
            };
            
            this.loadData();
            this.init();
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
            
            // Track initial page load
            this.trackPageLoad();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Auto-save interval
            this.startAutoSave();
            
            // Expose to window for manual access
            window.webropolAnalytics = this;
            
            this.log('Ready to track!');
        }
        
        trackPageLoad() {
            const pageData = this.getPageData();
            
            // Track page view
            this.trackPageView(pageData);
            
            // Track hash route if present
            if (pageData.hashRoute) {
                this.trackHashRoute(pageData.hashRoute, pageData);
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
                    referrers: {}
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
            
            const routeKey = hashRoute;
            
            // Initialize route if not exists
            if (!this.data.spaSections[routeKey]) {
                this.data.spaSections[routeKey] = {
                    uniqueVisitors: [],
                    totalViews: 0,
                    lastVisit: Date.now(),
                    firstVisit: Date.now(),
                    pagePath: pageData.pathname,
                    sectionName: hashRoute,
                    fileName: hashRoute.split('/').pop() || 'route',
                    isHashRoute: true
                };
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
