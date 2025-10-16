# 🎯 Global Analytics - Quick Reference Card

## ONE-LINE INTEGRATION

```html
<!-- Add this to ANY page to start tracking: -->
<script src="../scripts/analytics-global-tracker.js"></script>
```

---

## DASHBOARD ACCESS

```
Local:        analytics-monitor.html
GitHub Pages: https://alimetaverse.github.io/webropol/analytics-monitor.html
```

---

## WHAT GETS TRACKED

✅ Every page visit  
✅ Unique visitors  
✅ Hash routes (`#/home`, `#/surveys/list`)  
✅ File names & directories  
✅ User sessions & journeys  
✅ Referrers (where visitors come from)  
✅ Navigation flow (from → to)  

---

## PATH VARIATIONS

```html
<!-- Root pages (index.html) -->
<script src="scripts/analytics-global-tracker.js"></script>

<!-- Subdirectory (surveys/, events/, examples/) -->
<script src="../scripts/analytics-global-tracker.js"></script>

<!-- Nested subdirectory -->
<script src="../../scripts/analytics-global-tracker.js"></script>
```

---

## CONSOLE COMMANDS

```javascript
// Get tracker instance
window.webropolAnalytics

// Get statistics
window.webropolAnalytics.getStats()

// Export data
window.webropolAnalytics.exportData()

// Clear all data
window.webropolAnalytics.clearData()
```

---

## VERIFICATION CHECKLIST

1. ✅ Add script tag to page
2. ✅ Open page in browser
3. ✅ Press F12 → Check console for: `[Global Analytics] Initialized`
4. ✅ Open `analytics-monitor.html`
5. ✅ Click "Refresh" button
6. ✅ See your page in "All Pages" table!

---

## DASHBOARD FEATURES

| Button | Action |
|--------|--------|
| 🔄 Refresh | Update dashboard manually |
| 📥 Export Data | Download JSON file |
| 🗑️ Clear Data | Reset all analytics |
| ⚡ Real-Time | Coming soon |

**Auto-refresh**: Every 10 seconds  
**Live indicator**: Green pulsing dot

---

## DATA LOCATIONS

| Type | Storage Key |
|------|-------------|
| Analytics Data | `webropolGlobalAnalytics` |
| Session ID | `webropolSessionId` |

---

## EXAMPLE PAGES TO TRACK

```
✅ examples/group-rules.html
✅ examples/nested-list.html
✅ surveys/create.html
✅ surveys/edit.html
✅ events/events.html
✅ dashboards/index.html
✅ ... ANY page!
```

---

## CONSOLE OUTPUT

### Success
```
[Global Analytics] Initialized
[Global Analytics] Ready to track!
[Global Analytics] Page tracked {page: "...", visitors: 1}
[Global Analytics] Data saved
```

### Tracking Activity
```
[Global Analytics] Page tracked {page: "...", file: "...", visitors: 1}
[Global Analytics] Hash route tracked {route: "/home", visitors: 1}
[Global Analytics] Data saved
```

---

## STORAGE FORMAT

```javascript
{
  visitors: ["session_id_1", "session_id_2"],
  sessions: [{sessionId, firstSeen, lastSeen, pageCount, pages}],
  pages: {
    "/path/to/page.html": {
      uniqueVisitors: [],
      totalViews: 0,
      fileName: "page.html",
      directory: "/path/to"
    }
  },
  spaSections: {
    "/home": {
      uniqueVisitors: [],
      totalViews: 0,
      isHashRoute: true
    }
  }
}
```

---

## BROWSER SUPPORT

| Browser | Status |
|---------|--------|
| Chrome/Edge | ✅ Supported |
| Firefox | ✅ Supported |
| Safari | ✅ Supported |
| IE11 | ⚠️ Not tested |

---

## PERFORMANCE SPECS

| Metric | Value |
|--------|-------|
| Script Size | ~20KB |
| Storage Used | 5-10MB max |
| Auto-save | Every 5s |
| Debounce | 300ms |
| Navigation History | Last 1000 entries |

---

## TROUBLESHOOTING

### Script Not Loading?
→ Check path: `../scripts/` goes up one level  
→ Verify file exists at correct location

### No Console Logs?
→ Set `DEBUG: true` in `analytics-global-tracker.js`  
→ Check CONFIG object at top of file

### Not Showing in Dashboard?
→ Visit pages first to generate data  
→ Click "Refresh" in dashboard  
→ Check: `localStorage.getItem('webropolGlobalAnalytics')`

### Duplicate Tracking?
→ Include script only once per page  
→ Don't mix with old tracker on same page

---

## PRIVACY & SECURITY

🔒 **No external API calls**  
🔒 **No personal data collected**  
🔒 **Session IDs are random strings**  
🔒 **All data stored locally in browser**  
🔒 **No tracking cookies**  

---

## DOCUMENTATION FILES

| File | Purpose |
|------|---------|
| `docs/GLOBAL-ANALYTICS-GUIDE.md` | Complete guide |
| `docs/GLOBAL-ANALYTICS-COMPLETE.md` | Full summary |
| `analytics-integration-snippet.html` | Copy-paste examples |
| `scripts/analytics-global-tracker.js` | Tracker code |
| `analytics-monitor.html` | Dashboard |

---

## QUICK EXPORT

```javascript
// In browser console or dashboard
const data = window.webropolAnalytics.exportData();
console.log(JSON.stringify(data, null, 2));
```

---

## KEY DIFFERENCES: OLD vs NEW

| Feature | Old Tracker | Global Tracker |
|---------|-------------|----------------|
| Init | Manual | **Automatic** |
| Sessions | ❌ | ✅ |
| Referrers | ❌ | ✅ |
| Dashboard | cp.html | **analytics-monitor.html** |
| Storage | `webropolAnalytics` | `webropolGlobalAnalytics` |

**Both can run together!**

---

## USAGE EXAMPLE

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Webropol Page</title>
    
    <!-- ADD THIS ONE LINE -->
    <script src="../scripts/analytics-global-tracker.js"></script>
</head>
<body>
    <h1>Content</h1>
    <!-- Your page content -->
</body>
</html>
```

**That's it!** Page is now tracked automatically. ✅

---

## NEXT STEPS

1. ✅ Add tracker to your pages
2. ✅ Visit pages to generate data
3. ✅ Open `analytics-monitor.html`
4. ✅ Click "Refresh" to see analytics
5. ✅ Export data periodically for backup

---

## SUPPORT

**Console Debug:**
```javascript
window.webropolAnalytics.getStats()
```

**Check Storage:**
```javascript
localStorage.getItem('webropolGlobalAnalytics')
```

**Clear & Reset:**
```javascript
window.webropolAnalytics.clearData()
```

---

## 🎉 READY TO GO!

**Just add one script tag to your pages and watch the analytics flow!**

---

*Version 2.0.0 - Global Analytics System*  
*Last Updated: October 16, 2025*
