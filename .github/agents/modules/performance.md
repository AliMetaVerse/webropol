# Module: PERFORMANCE

**SmartRouter signal keyword**: `module:perf`
**Responsibility**: Identify and resolve performance bottlenecks in this frontend codebase.

---

## Routing Signals

```
Primary   (+3): performance, optimize, slow, "memory leak", bottleneck, profile,
                benchmark, "load time", laggy, unresponsive
Secondary (+1): speed, efficient, fast, cpu, heavy, throttle, debounce, lazy,
                cache, "too many renders", "event listener"
Negative  (-2): bug, document, create, test, security
```

---

## Behavior Protocol

1. **Measure First** — Identify the specific bottleneck before optimizing. Never optimize speculatively without evidence.
2. **Impact Ranking** — Rank each optimization by expected impact: `High` / `Medium` / `Low`.
3. **Preserve Correctness** — No optimization may change observable behavior or break existing functionality.
4. **Avoid Premature Optimization** — Only target code that demonstrably causes a measurable problem. Readable code beats marginally-faster unreadable code.
5. **Frontend Focus** — For this MPA + Alpine.js project, focus on the high-impact areas listed below.
6. **Before/After Estimate** — Provide qualitative estimates (e.g., "removes N redundant DOM reads") or DevTools measurement guidance.

---

## Checklist

- [ ] Specific bottleneck identified with evidence (not guessed)
- [ ] Optimizations ranked by impact
- [ ] Correctness verified after optimization
- [ ] No premature optimization applied
- [ ] Browser-specific frontend patterns addressed

---

## High-Impact Areas for This Codebase

### Alpine.js Performance
```javascript
// SLOW — watcher re-runs entire function on every keystroke
this.$watch('formData', () => this.validateEntireForm());

// FAST — debounce validation
this.$watch('formData', _.debounce(() => this.validateEntireForm(), 300));

// SLOW — Alpine.js x-for with object identity issues
// Re-renders entire list when any item changes if :key is missing
<template x-for="item in items">

// FAST — use :key with stable ID
<template x-for="item in items" :key="item.id">
```

### DOM Manipulation
```javascript
// SLOW — reads layout property inside a loop (forced reflow each iteration)
items.forEach(item => {
  item.style.width = container.offsetWidth + 'px'; // reads offsetWidth N times
});

// FAST — read once, write many
const width = container.offsetWidth;
items.forEach(item => {
  item.style.width = width + 'px';
});
```

### Event Listener Leaks
```javascript
// LEAK — listener added in init() but never removed
init() {
  document.addEventListener('keydown', this.handleKeydown);
},

// FIXED — destroy in Alpine.js destroy lifecycle
destroy() {
  document.removeEventListener('keydown', this.handleKeydown);
}
```

### localStorage Read Frequency
```javascript
// SLOW — reads localStorage on every property access
get currentSurvey() {
  return JSON.parse(localStorage.getItem('webropol_survey_active'));
}

// FAST — cache in reactive data, sync on save
init() {
  this.currentSurvey = JSON.parse(localStorage.getItem('webropol_survey_active') || 'null');
},
save() {
  localStorage.setItem('webropol_survey_active', JSON.stringify(this.currentSurvey));
}
```

### Asset Loading
- Large background images: use `loading="lazy"` on `<img>` tags.
- Unused Tailwind classes: purge config (not applicable here, CDN build includes all classes — acceptable for this MPA).
- CDN resources: verify Alpine.js and FontAwesome are loaded with `defer` to avoid render-blocking.

---

## What This Module Does NOT Optimize

- Server-side rendering or API latency (there is no server — this is pure frontend)
- Build tool bundle sizes (no build tools)
- Database query optimization

---

## Example Prompts That Route Here

- "The survey list is slow to render when there are 200+ items"
- "I think there's a memory leak in the events Alpine.js app"
- "The page feels sluggish when switching tabs rapidly"
- "Optimize the localStorage reads in the dashboard"
- "The x-for loop on the report page is causing layout thrashing"
- "Debounce the search input in the user management page"

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
