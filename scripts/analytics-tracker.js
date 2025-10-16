/**
 * Webropol Analytics Tracker
 * 
 * Lightweight script to track page views and SPA navigation
 * across the Webropol platform.
 * 
 * Usage:
 * 1. Include this script in any page: <script src="../scripts/analytics-tracker.js"></script>
 * 2. The tracker will automatically start tracking page views and SPA navigation
 * 3. Data is stored in localStorage and can be viewed in the Control Panel (cp.html)
 * 
 * Features:
 * - Unique visitor tracking via session IDs
 * - Page view tracking
 * - SPA route/section tracking
 * - Automatic hash change detection
 * - Performance optimized with debouncing
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'webropolAnalytics',
        SESSION_KEY: 'analyticsSessionId',
        SAVE_INTERVAL: 5000, // Save every 5 seconds
        DEBOUNCE_DELAY: 300 // Debounce navigation events
    };
    
    // Analytics storage
    class AnalyticsTracker {
        constructor() {
            this.sessionId = null;
            this.data = {
                visitors: [],
                pages: {},
                spaSections: {}
            };
            this.saveTimer = null;
            this.lastHash = '';
            
            this.init();
        }
        
        init() {
            // Get or create session ID
            this.sessionId = sessionStorage.getItem(CONFIG.SESSION_KEY);
            if (!this.sessionId) {
                this.sessionId = this.generateSessionId();
                sessionStorage.setItem(CONFIG.SESSION_KEY, this.sessionId);
            }
            
            // Load existing data
            this.loadData();
            
            // Track current page with full path and filename
            const currentPath = this.getCurrentPagePath();
            this.trackPageView(currentPath);
            
            // Track hash-based route as a page view (SPA routing)
            if (window.location.hash && window.location.hash !== '#') {
                const hashRoute = this.getHashRoute();
                if (hashRoute) {
                    this.trackHashRoute(hashRoute);
                }
            }
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set up auto-save
            this.startAutoSave();
            
            console.log('[Analytics Tracker] Initialized - Session:', this.sessionId);
            console.log('[Analytics Tracker] Base Page:', currentPath);
            if (window.location.hash) {
                console.log('[Analytics Tracker] Hash Route:', this.getHashRoute());
            }
        }
        
        getCurrentPagePath() {
            // Get the full page path including filename
            const fullPath = window.location.pathname;
            const fileName = fullPath.split('/').pop() || 'index.html';
            
            // If pathname ends with /, add index.html
            if (fullPath.endsWith('/')) {
                return fullPath + 'index.html';
            }
            
            // Return full path with filename
            return fullPath;
        }
        
        getHashRoute() {
            // Extract the hash route (e.g., #/home or #/surveys/list)
            const hash = window.location.hash;
            if (!hash || hash === '#') return null;
            
            // Remove the # and return the route
            return hash.substring(1); // Remove leading #
        }
        
        generateSessionId() {
            return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        loadData() {
            try {
                const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (stored) {
                    this.data = JSON.parse(stored);
                }
            } catch (e) {
                console.error('[Analytics Tracker] Failed to load data:', e);
            }
        }
        
        saveData() {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
            } catch (e) {
                console.error('[Analytics Tracker] Failed to save data:', e);
            }
        }
        
        trackPageView(pageUrl) {
            // Ensure we have the filename in the URL
            if (!pageUrl || pageUrl === '/') {
                pageUrl = '/index.html';
            } else if (pageUrl.endsWith('/')) {
                pageUrl = pageUrl + 'index.html';
            }
            
            // Add visitor to global set if not exists
            if (!this.data.visitors.includes(this.sessionId)) {
                this.data.visitors.push(this.sessionId);
            }
            
            // Initialize page if not exists
            if (!this.data.pages[pageUrl]) {
                this.data.pages[pageUrl] = {
                    uniqueVisitors: [],
                    totalViews: 0,
                    lastVisit: Date.now(),
                    fileName: pageUrl.split('/').pop() // Store filename
                };
            }
            
            // Track visitor if not already tracked for this page
            if (!this.data.pages[pageUrl].uniqueVisitors.includes(this.sessionId)) {
                this.data.pages[pageUrl].uniqueVisitors.push(this.sessionId);
            }
            
            // Increment view count (every visit counts)
            this.data.pages[pageUrl].totalViews++;
            this.data.pages[pageUrl].lastVisit = Date.now();
            
            this.scheduleSave();
            
            console.log('[Analytics Tracker] Page view tracked:', pageUrl, '(File:', this.data.pages[pageUrl].fileName + ')');
        }
        
        trackHashRoute(hashRoute) {
            if (!hashRoute) return;
            
            // Ensure proper format
            if (!hashRoute.startsWith('/')) {
                hashRoute = '/' + hashRoute;
            }
            
            // Check if this exact route was just tracked
            if (hashRoute === this.lastHash) {
                return; // Avoid duplicate tracking
            }
            
            this.lastHash = hashRoute;
            
            // Add visitor to global set if not exists
            if (!this.data.visitors.includes(this.sessionId)) {
                this.data.visitors.push(this.sessionId);
            }
            
            // Initialize route if not exists
            if (!this.data.spaSections[hashRoute]) {
                this.data.spaSections[hashRoute] = {
                    uniqueVisitors: [],
                    totalViews: 0,
                    lastVisit: Date.now(),
                    pagePath: this.getCurrentPagePath(),
                    sectionName: hashRoute,
                    fileName: hashRoute.split('/').pop() || 'route',
                    isHashRoute: true // Flag to identify hash-based routes
                };
            }
            
            // Track visitor if not already tracked for this route
            if (!this.data.spaSections[hashRoute].uniqueVisitors.includes(this.sessionId)) {
                this.data.spaSections[hashRoute].uniqueVisitors.push(this.sessionId);
            }
            
            // Increment view count (every visit counts)
            this.data.spaSections[hashRoute].totalViews++;
            this.data.spaSections[hashRoute].lastVisit = Date.now();
            
            this.scheduleSave();
            
            console.log('[Analytics Tracker] Hash route tracked:', hashRoute, '(Base:', this.getCurrentPagePath() + ')');
        }
        
        trackSPASection(sectionName) {
            if (!sectionName) {
                return; // Don't track empty sections
            }
            
            // Create a unique key combining current page + section for accurate tracking
            const currentPage = this.getCurrentPagePath();
            const sectionKey = `${currentPage}#${sectionName}`;
            
            // Check if this exact page+section combo was just tracked
            if (sectionKey === this.lastHash) {
                return; // Avoid duplicate tracking
            }
            
            this.lastHash = sectionKey;
            
            // Add visitor to global set if not exists
            if (!this.data.visitors.includes(this.sessionId)) {
                this.data.visitors.push(this.sessionId);
            }
            
            // Initialize section if not exists (now includes page context)
            if (!this.data.spaSections[sectionKey]) {
                this.data.spaSections[sectionKey] = {
                    uniqueVisitors: [],
                    totalViews: 0,
                    lastVisit: Date.now(),
                    pagePath: currentPage,
                    sectionName: sectionName,
                    fileName: currentPage.split('/').pop()
                };
            }
            
            // Track visitor if not already tracked for this section
            if (!this.data.spaSections[sectionKey].uniqueVisitors.includes(this.sessionId)) {
                this.data.spaSections[sectionKey].uniqueVisitors.push(this.sessionId);
            }
            
            // Increment view count (every visit counts)
            this.data.spaSections[sectionKey].totalViews++;
            this.data.spaSections[sectionKey].lastVisit = Date.now();
            
            this.scheduleSave();
            
            console.log('[Analytics Tracker] SPA section tracked:', sectionName, 'on page:', currentPage);
        }
        
        getHashSection() {
            return window.location.hash.replace('#', '') || 'home';
        }
        
        setupEventListeners() {
            // Track hash changes (hash-based routing like #/home, #/surveys/list)
            let hashChangeTimer;
            window.addEventListener('hashchange', () => {
                clearTimeout(hashChangeTimer);
                hashChangeTimer = setTimeout(() => {
                    const hashRoute = this.getHashRoute();
                    
                    if (hashRoute) {
                        // Track as hash route (e.g., #/home, #/surveys/list)
                        this.trackHashRoute(hashRoute);
                    } else {
                        // Fallback: track simple section
                        const section = this.getHashSection();
                        this.trackSPASection(section);
                    }
                }, CONFIG.DEBOUNCE_DELAY);
            });
            
            // Track page visibility changes (tab switching)
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    // User returned to tab, update last visit
                    const currentPage = window.location.pathname;
                    if (this.data.pages[currentPage]) {
                        this.data.pages[currentPage].lastVisit = Date.now();
                        this.scheduleSave();
                    }
                }
            });
            
            // Save data before page unload
            window.addEventListener('beforeunload', () => {
                this.saveData();
            });
        }
        
        startAutoSave() {
            setInterval(() => {
                this.saveData();
            }, CONFIG.SAVE_INTERVAL);
        }
        
        scheduleSave() {
            // Debounced save - only save after user stops navigating
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => {
                this.saveData();
            }, 1000);
        }
        
        // Public API for manual tracking
        trackEvent(eventName, eventData = {}) {
            console.log('[Analytics Tracker] Custom event:', eventName, eventData);
            // Can be extended to track custom events
        }
    }
    
    // Initialize tracker when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.webropolAnalytics = new AnalyticsTracker();
        });
    } else {
        window.webropolAnalytics = new AnalyticsTracker();
    }
    
    // Expose public API
    window.trackAnalyticsEvent = function(eventName, eventData) {
        if (window.webropolAnalytics) {
            window.webropolAnalytics.trackEvent(eventName, eventData);
        }
    };
    
})();
