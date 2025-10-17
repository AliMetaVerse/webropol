// Unified Analytics Dashboard Web Component (Light DOM)
// Exact UI as analytics-monitor.html, maintained here and used in both pages.

class WebropolAnalyticsDashboard extends HTMLElement {
  constructor() {
    super();
    this.rtTimer = null;
    this.lastRefreshAt = null;
  }

  connectedCallback() {
    this.ensureTailwind();
    this.render();
    this.refresh();
  }

  // Inject Tailwind CDN if not already present
  ensureTailwind() {
    if (!document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(s);
      // Tailwind loads async; do a delayed refresh after load
      s.addEventListener('load', () => this.refresh());
    }
  }

  // Public method: re-render from latest data
  refresh() {
    const data = this.loadData();
    this.fillSummary(data);
    this.renderTopPagesChart(data);
    this.renderSPAChart(data);
    this.renderPageTable(data);
    this.renderSPATable(data);
  }

  loadData() {
    try {
      const raw = localStorage.getItem('webropolGlobalAnalytics');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[AnalyticsDashboard] Failed to load analytics data', e);
      return null;
    }
  }

  render() {
    this.innerHTML = `
      <!-- Header Card -->
      <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <i class="fas fa-chart-line text-indigo-400 text-2xl"></i>
              <h1 class="text-2xl font-extrabold tracking-widest" style="font-family: 'Orbitron', monospace; color:#56CCF2; letter-spacing:4px;">Global Analytics Monitor</h1>
            </div>
            <p class="text-slate-400 text-sm mt-1">Real-time centralized tracking across all Webropol pages</p>
          </div>
          <div class="flex items-center gap-2">
            <span id="liveDot" class="inline-flex items-center gap-2 text-xs text-slate-300">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              LIVE
            </span>
          </div>
        </div>
      </div>

      <!-- Summary Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <i class="fas fa-users text-purple-300 text-xl"></i>
            <span class="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/30">Visitors</span>
          </div>
          <div class="text-slate-300 text-sm">Unique Visitors</div>
          <div id="totalVisitors" class="text-3xl font-extrabold" style="font-family: 'Orbitron', monospace; color:#c084fc;">0</div>
        </div>
        <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <i class="fas fa-file-lines text-sky-300 text-xl"></i>
            <span class="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-900/40 text-sky-300 border border-sky-500/30">Pages</span>
          </div>
          <div class="text-slate-300 text-sm">Pages Tracked</div>
          <div id="pagesTracked" class="text-3xl font-extrabold" style="font-family: 'Orbitron', monospace; color:#7dd3fc;">0</div>
        </div>
        <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <i class="fas fa-globe text-emerald-300 text-xl"></i>
            <span class="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">Country</span>
          </div>
          <div class="text-slate-300 text-sm">Top Country</div>
          <div id="topCountry" class="text-3xl font-extrabold text-emerald-300" style="font-family: 'Orbitron', monospace;">-</div>
        </div>
        <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <i class="fas fa-route text-amber-300 text-xl"></i>
            <span class="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 border border-amber-500/30">Routes</span>
          </div>
          <div class="text-slate-300 text-sm">SPA Routes</div>
          <div id="spaSections" class="text-3xl font-extrabold" style="font-family: 'Orbitron', monospace; color:#fbbf24;">0</div>
        </div>
      </div>

      <!-- Controls Row -->
      <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-4 mb-5 flex items-center justify-between">
        <div class="flex gap-3">
          <button id="btnRefresh" class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow">
            <i class="fas fa-rotate-right mr-2"></i>Refresh
          </button>
          <button id="btnExport" class="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow">
            <i class="fas fa-download mr-2"></i>Export Data
          </button>
          <button id="btnClear" class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow">
            <i class="fas fa-trash-alt mr-2"></i>Clear Data
          </button>
          <button id="btnRealtime" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow">
            <i class="fas fa-bolt mr-2"></i>Real-Time View
          </button>
        </div>
        <div class="text-slate-400 text-xs flex items-center gap-2">
          <i class="fas fa-clock"></i>
          <span id="lastUpdated">Never</span>
        </div>
      </div>

      <!-- Pages Table -->
      <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 mb-5">
        <div class="flex items-center gap-3 mb-3">
          <i class="fas fa-book text-indigo-300"></i>
          <h2 class="text-xl font-extrabold" style="font-family: 'Orbitron', monospace; color:#c4b5fd;">All Pages</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="text-left text-indigo-300/80 text-xs uppercase tracking-widest" style="font-family: 'Orbitron', monospace;">
                <th class="py-3">Page</th>
                <th class="py-3">Directory</th>
                <th class="py-3">Visitors</th>
                <th class="py-3">Country</th>
                <th class="py-3">Last Visit</th>
              </tr>
            </thead>
            <tbody id="pageTableBody">
              <tr><td class="text-center text-slate-400 py-6" colspan="5">No data available</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Routes Table -->
      <div class="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-3">
          <i class="fas fa-route text-amber-300"></i>
          <h2 class="text-xl font-extrabold" style="font-family: 'Orbitron', monospace; color:#facc15;">SPA Routes</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="text-left text-amber-300/80 text-xs uppercase tracking-widest" style="font-family: 'Orbitron', monospace;">
                <th class="py-3">Route</th>
                <th class="py-3">Base Page</th>
                <th class="py-3">Visitors</th>
                <th class="py-3">Country</th>
                <th class="py-3">Last Visit</th>
              </tr>
            </thead>
            <tbody id="spaTableBody">
              <tr><td class="text-center text-slate-400 py-6" colspan="5">No routes tracked yet</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Wire controls
    this.querySelector('#btnRefresh')?.addEventListener('click', () => this.refresh());
    this.querySelector('#btnExport')?.addEventListener('click', () => this.exportData());
    this.querySelector('#btnClear')?.addEventListener('click', () => this.clearData());
    this.querySelector('#btnRealtime')?.addEventListener('click', () => this.toggleRealtime());
  }

  fillSummary(data) {
    const tv = this.querySelector('#totalVisitors');
    const pt = this.querySelector('#pagesTracked');
    const ss = this.querySelector('#spaSections');
    const tc = this.querySelector('#topCountry');
    if (!data) {
      if (tv) tv.textContent = '0'; if (pt) pt.textContent = '0'; if (ss) ss.textContent = '0'; if (tc) tc.textContent = '-';
      return;
    }
    if (tv) tv.textContent = (data.visitors || []).length;
    if (pt) pt.textContent = Object.keys(data.pages || {}).length;
    if (ss) ss.textContent = Object.keys(data.spaSections || {}).length;
    if (tc) tc.textContent = this.getTopCountryGlobal(data) || '-';
  }

  renderTopPagesChart(data) {
    const container = this.querySelector('#topPagesChart');
    if (!container) return;
    container.innerHTML = '';
    const pages = (data && data.pages) ? data.pages : {};
    const sorted = Object.entries(pages)
      .sort((a,b) => (b[1].uniqueVisitors||[]).length - (a[1].uniqueVisitors||[]).length)
      .slice(0,10);
    if (!sorted.length) {
      container.innerHTML = '<div class="text-slate-400 text-sm text-center py-6">No page data available yet</div>';
      return;
    }
    const maxVal = Math.max(...sorted.map(([,v]) => (v.uniqueVisitors||[]).length));
    sorted.forEach(([path, v]) => {
      const uv = (v.uniqueVisitors||[]).length;
      const pct = maxVal > 0 ? (uv / maxVal) * 100 : 0;
      const color = pct > 70 ? '#8b5cf6' : pct > 40 ? '#06b6d4' : '#10b981';
      const row = document.createElement('div');
      row.className = 'mb-2';
      row.innerHTML = `
        <div class="flex items-center justify-between mb-1 text-xs">
          <span class="text-slate-200 font-semibold">${path}</span>
          <span class="text-indigo-400 font-bold" style="font-family:'Orbitron', monospace;">${uv}</span>
        </div>
        <div class="h-6 rounded-md border border-indigo-400/20 bg-slate-900/60 overflow-hidden">
          <div class="h-full flex items-center justify-end pr-2 text-[10px] font-bold text-white" style="width:${pct}%; background: linear-gradient(90deg, ${color}, ${color}aa); font-family:'Orbitron', monospace;">${v.totalViews||0} views</div>
        </div>
      `;
      container.appendChild(row);
    });
  }

  renderSPAChart(data) {
    const container = this.querySelector('#spaChart');
    if (!container) return;
    container.innerHTML = '';
    const routes = (data && data.spaSections) ? data.spaSections : {};
    const sorted = Object.entries(routes)
      .sort((a,b) => (b[1].uniqueVisitors||[]).length - (a[1].uniqueVisitors||[]).length);
    if (!sorted.length) {
      container.innerHTML = '<div class="text-slate-400 text-sm text-center py-6">No SPA section data available yet</div>';
      return;
    }
    const maxVal = Math.max(...sorted.map(([,v]) => (v.uniqueVisitors||[]).length));
    sorted.forEach(([key, v]) => {
      const uv = (v.uniqueVisitors||[]).length;
      const pct = maxVal > 0 ? (uv / maxVal) * 100 : 0;
      const color = pct > 70 ? '#f59e0b' : pct > 40 ? '#06b6d4' : '#10b981';
      const displayLabel = v.isHashRoute ? key : (v.sectionName || key.split('#').pop() || key);
      const row = document.createElement('div');
      row.className = 'mb-2';
      row.innerHTML = `
        <div class="flex items-center justify-between mb-1 text-xs">
          <span class="text-slate-200 font-semibold">${displayLabel}</span>
          <span class="text-amber-400 font-bold" style="font-family:'Orbitron', monospace;">${uv}</span>
        </div>
        <div class="h-6 rounded-md border border-amber-400/20 bg-slate-900/60 overflow-hidden">
          <div class="h-full flex items-center justify-end pr-2 text-[10px] font-bold text-white" style="width:${pct}%; background: linear-gradient(90deg, ${color}, ${color}aa); font-family:'Orbitron', monospace;">${v.totalViews||0} views</div>
        </div>
      `;
      container.appendChild(row);
    });
  }

  renderPageTable(data) {
    const tbody = this.querySelector('#pageTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const pages = (data && data.pages) ? data.pages : {};
    const sorted = Object.entries(pages).sort((a,b) => (b[1].lastVisit||0) - (a[1].lastVisit||0));
    if (!sorted.length) {
      tbody.innerHTML = '<tr><td class="text-center text-slate-400 py-6" colspan="5">No data available</td></tr>';
      return;
    }
    sorted.forEach(([path, v]) => {
      const tr = document.createElement('tr');
      // Build absolute URL using env config if available
      const buildUrl = (window.WebropolAnalyticsConfig && window.WebropolAnalyticsConfig.buildUrl) || ((p)=>p);
      const absUrl = buildUrl(path);
      const displayName = v.fileName || path.split('/').pop() || path;
      const dir = v.directory || path.substring(0, path.lastIndexOf('/')) || '/';
      tr.innerHTML = `
        <td class="py-2"><a href="${absUrl}" class="text-sky-300 hover:underline" target="_blank" rel="noopener">${displayName}</a></td>
        <td class="py-2">${dir}</td>
        <td class="py-2">${(v.uniqueVisitors||[]).length}</td>
        <td class="py-2">${this.getEntryTopCountry(v) || '-'}</td>
        <td class="py-2">${this.formatTime(v.lastVisit)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderSPATable(data) {
    const tbody = this.querySelector('#spaTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const routes = (data && data.spaSections) ? data.spaSections : {};
    const sorted = Object.entries(routes).sort((a,b) => (b[1].lastVisit||0) - (a[1].lastVisit||0));
    if (!sorted.length) {
      tbody.innerHTML = '<tr><td class="text-center text-slate-400 py-6" colspan="5">No routes tracked yet</td></tr>';
      return;
    }
    sorted.forEach(([key, v]) => {
      const isHash = !!v.isHashRoute;
      const display = isHash ? key : (v.sectionName || key.split('#').pop() || key);
      const basePath = v.pagePath || (isHash ? '' : (key.split('#')[0] || ''));
      const buildUrl = (window.WebropolAnalyticsConfig && window.WebropolAnalyticsConfig.buildUrl) || ((p)=>p);
      const linkTarget = basePath ? buildUrl(basePath) + (isHash ? '#' + (display.startsWith('#') ? display.slice(1) : display) : '') : '';
      const base = basePath
        ? `<a href="${linkTarget}" class="text-sky-300 hover:underline" target="_blank" rel="noopener">${basePath || '(hash route)'}</a>`
        : (isHash ? '(hash route)' : (basePath || ''));
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2">${display}</td>
        <td class="py-2">${base}</td>
        <td class="py-2">${(v.uniqueVisitors||[]).length}</td>
        <td class="py-2">${this.getEntryTopCountry(v) || '-'}</td>
        <td class="py-2">${this.formatTime(v.lastVisit)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Utilities
  getTopCountryGlobal(data) {
    const counts = {};
    const bump = (entry) => {
      if (!entry) return;
      const map = entry.countries || {};
      Object.entries(map).forEach(([cc, n]) => {
        counts[cc] = (counts[cc] || 0) + (n || 0);
      });
      if (Object.keys(map).length === 0 && entry.lastCountry) {
        counts[entry.lastCountry] = (counts[entry.lastCountry] || 0) + 1;
      }
    };
    Object.values(data.pages || {}).forEach(bump);
    Object.values(data.spaSections || {}).forEach(bump);
    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    if (!top) return null;
    const codeOrName = top[0];
    // If looks like ISO code, try to display region name
    if (/^[A-Z]{2}$/.test(codeOrName)) {
      try {
        if (Intl && Intl.DisplayNames) {
          const dn = new Intl.DisplayNames(['en'], { type: 'region' });
          return dn.of(codeOrName) || codeOrName;
        }
      } catch(_) {}
    }
    return codeOrName;
  }

  getEntryTopCountry(entry) {
    const map = entry?.countries || {};
    const top = Object.entries(map).sort((a,b)=>b[1]-a[1])[0];
    if (top) {
      const code = top[0];
      if (/^[A-Z]{2}$/.test(code)) {
        try {
          if (Intl && Intl.DisplayNames) {
            const dn = new Intl.DisplayNames(['en'], { type: 'region' });
            return dn.of(code) || code;
          }
        } catch(_) {}
      }
      return code;
    }
    return entry?.lastCountry || null;
  }

  formatTime(ts) {
    if (!ts) return '-';
    try { return new Date(ts).toLocaleString(); } catch { return '-'; }
  }

  toggleRealtime() {
    if (this.rtTimer) {
      clearInterval(this.rtTimer);
      this.rtTimer = null;
      this.querySelector('#btnRealtime')?.classList.remove('ring-2','ring-emerald-300');
      return;
    }
    // Start realtime refresh every 5s
    this.rtTimer = setInterval(() => this.refresh(), 5000);
    this.querySelector('#btnRealtime')?.classList.add('ring-2','ring-emerald-300');
  }

  // Override refresh to keep last updated timestamp
  refresh() {
    const data = this.loadData();
    this.fillSummary(data);
    this.renderPageTable(data);
    this.renderSPATable(data);
    this.lastRefreshAt = Date.now();
    const el = this.querySelector('#lastUpdated');
    if (el) el.textContent = this.formatTime(this.lastRefreshAt) || 'Never';
  }

  exportData() {
    const data = this.loadData();
    if (!data) { alert('No analytics data to export'); return; }
    const simplified = {
      totalVisitors: (data.visitors||[]).length,
      totalSessions: (data.sessions||[]).length,
      pages: {},
      spaSections: {},
      exportDate: new Date().toISOString()
    };
    Object.entries(data.pages||{}).forEach(([k,v]) => {
      simplified.pages[k] = {
        uniqueVisitors: (v.uniqueVisitors||[]).length,
        totalViews: v.totalViews||0,
        lastVisit: new Date(v.lastVisit||Date.now()).toISOString()
      };
    });
    Object.entries(data.spaSections||{}).forEach(([k,v]) => {
      simplified.spaSections[k] = {
        uniqueVisitors: (v.uniqueVisitors||[]).length,
        totalViews: v.totalViews||0,
        lastVisit: new Date(v.lastVisit||Date.now()).toISOString()
      };
    });
    const blob = new Blob([JSON.stringify(simplified, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `webropol-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  clearData() {
    try {
      if (window.webropolAnalytics && typeof window.webropolAnalytics.clearData === 'function') {
        window.webropolAnalytics.clearData();
      } else {
        if (!confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) return;
        localStorage.removeItem('webropolGlobalAnalytics');
        sessionStorage.removeItem('webropolSessionId');
      }
    } catch (_) {}
    this.refresh();
  }
}

customElements.define('webropol-analytics-dashboard', WebropolAnalyticsDashboard);

export { WebropolAnalyticsDashboard };
