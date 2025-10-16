# Global Analytics Integration Guide

## Overview
The **Webropol Global Analytics System** provides centralized monitoring of ALL activity across your entire application - including standalone pages like `examples/group-rules.html`, survey pages, event pages, and more.

## 🎯 Key Features

### Automatic Tracking
- ✅ **Every Page**: Automatically tracks all HTML pages across the entire site
- ✅ **Hash Routes**: Tracks SPA navigation (`#/home`, `#/surveys/list`)
- ✅ **File Names**: Extracts and logs file names for every page
- ✅ **Directories**: Tracks which folders pages are in
- ✅ **Referrers**: Knows where visitors came from
- ✅ **Sessions**: Tracks user sessions and journey flow
- ✅ **Real-time**: Auto-saves every 5 seconds

### Centralized Dashboard
- 📊 **Single View**: See ALL activity in one place
- 🔄 **Live Updates**: Auto-refreshes every 10 seconds
- 📥 **Export Data**: Download full analytics as JSON
- 🎨 **Beautiful UI**: Cosmic gradient theme matching Webropol design

## 🚀 Quick Setup (3 Steps)

### Step 1: Add Global Tracker to Your Base Template

Add this **ONE LINE** to the `<head>` or before `</body>` in your base HTML template or layout file:

```html
<script src="/scripts/analytics-global-tracker.js"></script>
```

**That's it!** The tracker auto-initializes and starts tracking immediately.

### Step 2: Add to Existing Pages (Optional)

For standalone pages like `examples/group-rules.html`, add the same line:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Group Rules Example</title>
    <!-- Your existing head content -->
    
    <!-- Add Global Analytics -->
    <script src="../scripts/analytics-global-tracker.js"></script>
</head>
<body>
    <!-- Your page content -->
</body>
</html>
```

### Step 3: View Analytics

Open the centralized dashboard:
```
https://alimetaverse.github.io/webropol/analytics-monitor.html
```

Or locally:
```
file:///path/to/webropol/analytics-monitor.html
```

## 📂 File Structure

```
webropol/
├── analytics-monitor.html          ← Centralized dashboard
├── scripts/
│   ├── analytics-global-tracker.js ← Global tracking engine
│   └── analytics-tracker.js        ← Original tracker (still works)
└── [any page].html                 ← Add tracker script here
```

## 🎨 Dashboard Features

### Summary Cards
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   👥 VISITORS   │   📄 PAGES      │   👁 VIEWS      │   🛣️ ROUTES     │
│      150        │      25         │     1,245       │      12         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### All Pages Table
Shows EVERY page visited:
```
Page                    | Directory       | Visitors | Views | Last Visit
────────────────────────┼─────────────────┼──────────┼───────┼─────────────────
group-rules.html        | /examples       |    45    |   92  | 2 min ago
create.html             | /surveys        |    62    |  124  | 5 min ago
events.html             | /events         |    38    |   76  | 8 min ago
```

### SPA Routes Table
Shows hash-based navigation:
```
Route                   | Base Page       | Visitors | Views | Last Visit
────────────────────────┼─────────────────┼──────────┼───────┼─────────────────
🛣️ /home               | /index.html     |    75    |  150  | 1 min ago
🛣️ /surveys/list       | /index.html     |    62    |  124  | 3 min ago
```

### Active Sessions
Shows user sessions and their journey:
```
Session: session_1234567890_abc123
Duration: 15 min | Pages: 8 | Started: Oct 16, 2025 10:30 AM
Pages visited: 5 unique pages
```

## 🔧 Advanced Configuration

### Enable/Disable Tracking
Edit `scripts/analytics-global-tracker.js`:
```javascript
const CONFIG = {
    ENABLED: true,      // Set to false to disable tracking
    DEBUG: true,        // Set to false to hide console logs
    AUTO_SAVE_INTERVAL: 5000  // Auto-save interval in ms
};
```

### Manual Tracking API
Access the tracker programmatically:
```javascript
// Get tracker instance
const analytics = window.webropolAnalytics;

// Get current stats
const stats = analytics.getStats();
console.log(stats);

// Export data
const data = analytics.exportData();
console.log(data);

// Clear all data
analytics.clearData();
```

### Custom Event Tracking
Track custom events:
```javascript
// Track custom page view
window.webropolAnalytics.trackPageView('/custom/path');

// Track custom hash route
window.webropolAnalytics.trackHashRoute('/custom/route');
```

## 📊 Data Structure

### Pages Object
```javascript
{
  "/webropol/examples/group-rules.html": {
    uniqueVisitors: ["session_1", "session_2"],
    totalViews: 92,
    lastVisit: 1697462400000,
    firstVisit: 1697376000000,
    fileName: "group-rules.html",
    directory: "/webropol/examples",
    title: "Group Rules Example",
    referrers: {
      "(direct)": 45,
      "https://alimetaverse.github.io/webropol/": 47
    }
  }
}
```

### Sessions Array
```javascript
{
  sessionId: "session_1234567890_abc123",
  firstSeen: 1697462400000,
  lastSeen: 1697463300000,
  pageCount: 8,
  pages: [
    "/webropol/index.html",
    "/webropol/examples/group-rules.html",
    "/webropol/surveys/create.html"
  ]
}
```

### Navigation Flow
```javascript
{
  sessionId: "session_1234567890_abc123",
  from: "https://alimetaverse.github.io/webropol/",
  to: "https://alimetaverse.github.io/webropol/examples/group-rules.html",
  timestamp: 1697462400000
}
```

## 🎯 Use Cases

### 1. Track All Example Pages
```html
<!-- examples/group-rules.html -->
<script src="../scripts/analytics-global-tracker.js"></script>

<!-- examples/nested-list.html -->
<script src="../scripts/analytics-global-tracker.js"></script>

<!-- examples/create-calcs.html -->
<script src="../scripts/analytics-global-tracker.js"></script>
```

### 2. Track Survey Pages
```html
<!-- surveys/create.html -->
<script src="../scripts/analytics-global-tracker.js"></script>

<!-- surveys/edit.html -->
<script src="../scripts/analytics-global-tracker.js"></script>

<!-- surveys/list.html -->
<script src="../scripts/analytics-global-tracker.js"></script>
```

### 3. Track Event Pages
```html
<!-- events/events.html -->
<script src="../scripts/analytics-global-tracker.js"></script>

<!-- events/list.html -->
<script src="../scripts/analytics-global-tracker.js"></script>
```

## 🔍 Console Output

### Page Load
```javascript
[Global Analytics] Initialized {sessionId: "session_1234567890_abc123", page: "/webropol/examples/group-rules.html", hash: ""}
[Global Analytics] Ready to track!
[Global Analytics] Page tracked {page: "/webropol/examples/group-rules.html", file: "group-rules.html", visitors: 1, views: 1}
[Global Analytics] Data saved
```

### Hash Navigation
```javascript
[Global Analytics] Hash route tracked {route: "/home", file: "home", visitors: 1, views: 1}
[Global Analytics] Data saved
```

### Click Tracking (Debug Mode)
```javascript
[Global Analytics] Click tracked {element: "A", text: "View Examples", href: "/examples/"}
```

## 📈 Benefits

### For Developers
- ✅ **Zero Config**: Add one script tag, done
- ✅ **Auto-Discovery**: Finds and tracks all pages automatically
- ✅ **No Manual Setup**: Works out of the box
- ✅ **Lightweight**: ~20KB uncompressed
- ✅ **No Dependencies**: Pure vanilla JavaScript

### For Analytics
- ✅ **Complete Visibility**: See EVERY page in one place
- ✅ **User Journeys**: Track how users navigate
- ✅ **Session Tracking**: Understand user behavior
- ✅ **Referrer Tracking**: Know where traffic comes from
- ✅ **Time Tracking**: See when pages are visited

### For Management
- ✅ **Centralized**: Single dashboard for all data
- ✅ **Real-time**: Auto-updates every 10 seconds
- ✅ **Exportable**: Download data for analysis
- ✅ **Privacy-Friendly**: No external services, no personal data

## 🆚 Comparison: Global vs Original Tracker

| Feature | Original Tracker | Global Tracker |
|---------|-----------------|----------------|
| **Storage Key** | `webropolAnalytics` | `webropolGlobalAnalytics` |
| **Initialization** | Manual (`new AnalyticsTracker()`) | Automatic |
| **Page Tracking** | ✅ Yes | ✅ Yes + Referrers + Sessions |
| **Hash Routes** | ✅ Yes | ✅ Yes |
| **File Names** | ✅ Yes | ✅ Yes |
| **Sessions** | ❌ No | ✅ Yes |
| **Navigation Flow** | ❌ No | ✅ Yes |
| **Click Tracking** | ❌ No | ✅ Yes (debug mode) |
| **Dashboard** | cp.html | analytics-monitor.html |

**Both trackers can run simultaneously!** They use different storage keys.

## 🚨 Important Notes

### Performance
- Minimal overhead (~20KB)
- Debounced events (300ms)
- Auto-save every 5 seconds
- Last 1000 navigation entries kept

### Privacy
- No external API calls
- No personal data collected
- Session IDs are random strings
- All data stored in localStorage

### Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ IE11 not tested

### Storage Limits
- localStorage limit: ~5-10MB
- Automatic cleanup of old navigation entries
- Export data regularly for long-term storage

## 🎉 Quick Start Checklist

- [ ] Copy `analytics-global-tracker.js` to your `scripts/` folder
- [ ] Copy `analytics-monitor.html` to your root folder
- [ ] Add `<script src="/scripts/analytics-global-tracker.js"></script>` to pages
- [ ] Visit your pages to generate data
- [ ] Open `analytics-monitor.html` to view data
- [ ] Click "Refresh" to see latest updates
- [ ] Click "Export Data" to download analytics

## 📞 Support

### Debugging
1. Open browser console (F12)
2. Check for `[Global Analytics]` logs
3. Type `window.webropolAnalytics.getStats()` to see current stats
4. Type `window.webropolAnalytics.exportData()` to see all data

### Common Issues

**Tracker not initializing?**
- Check script path is correct
- Check browser console for errors
- Verify localStorage is enabled

**Data not showing in dashboard?**
- Click "Refresh" button
- Check localStorage: `localStorage.getItem('webropolGlobalAnalytics')`
- Ensure you've visited some pages first

**Duplicate tracking?**
- Only include tracker script once per page
- Don't mix with old tracker in same page (use one or the other)

---

## 🎯 Summary

You now have a **centralized analytics monitoring system** that:
1. **Automatically tracks** every page visit across your entire Webropol application
2. **Monitors hash-based SPA navigation** for modern routing
3. **Provides a beautiful dashboard** to view all activity in one place
4. **Requires minimal setup** - just one script tag per page
5. **Works with ANY page** - examples, surveys, events, everything!

**Next Steps:**
1. Add the tracker to your base template or individual pages
2. Visit `analytics-monitor.html` to see the magic happen
3. Watch your analytics data grow in real-time! 🚀

---
**Ready to monitor everything!** 🎉
