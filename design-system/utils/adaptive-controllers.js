/**
 * Webropol Adaptive Controllers
 *
 * Side-effect bootstrap that powers two design-system primitives defined in
 * design-system/styles/adaptive.css:
 *
 *   1. .adaptive-list-table  — auto-injects `data-label` on every <td> from
 *      the matching <th> (or `data-col-label` override) so the mobile cards
 *      transformation has labels to render via `td::before { content }`.
 *
 *   2. .adaptive-overflow-tabs — measures the tabs row with ResizeObserver
 *      and moves overflowing items into a "More…" dropdown so tabs stay on
 *      a single row without horizontal scrolling.
 *
 * Idempotent: safe to load multiple times; observes DOM mutations so it
 * also picks up content rendered by Alpine, web components, or SPA route
 * swaps.
 */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__webropolAdaptiveControllersLoaded) return;
  window.__webropolAdaptiveControllersLoaded = true;

  /* ---------------------------------------------------------------- */
  /*  1. data-label injection for .adaptive-list-table                 */
  /* ---------------------------------------------------------------- */

  function labelTable(table) {
    if (!table || table.__adaptiveLabeled) return;
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => {
      return (th.getAttribute('data-col-label') || th.textContent || '').trim();
    });
    if (!headers.length) return;
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      Array.from(row.children).forEach((cell, idx) => {
        if (cell.tagName !== 'TD') return;
        if (cell.hasAttribute('data-label')) return;
        const label = headers[idx] || '';
        if (label) cell.setAttribute('data-label', label);
      });
    });
    table.__adaptiveLabeled = true;
  }

  function labelAllTables(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('table.adaptive-list-table').forEach(labelTable);
  }

  /* ---------------------------------------------------------------- */
  /*  2. .adaptive-overflow-tabs controller                            */
  /* ---------------------------------------------------------------- */

  function ensureMoreTrigger(container) {
    let more = container.querySelector(':scope > .adaptive-overflow-tabs__more');
    if (more) return more;
    more = document.createElement('div');
    more.className = 'adaptive-overflow-tabs__more';
    more.hidden = true;
    more.innerHTML = `
      <button type="button" class="adaptive-overflow-tabs__more-btn" aria-haspopup="menu" aria-expanded="false">
        <span>More</span>
        <i class="fal fa-chevron-down" aria-hidden="true"></i>
      </button>
      <div class="adaptive-overflow-tabs__menu" role="menu" hidden></div>
    `;
    container.appendChild(more);

    const btn = more.querySelector('.adaptive-overflow-tabs__more-btn');
    const menu = more.querySelector('.adaptive-overflow-tabs__menu');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !menu.hidden;
      menu.hidden = open;
      btn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', (e) => {
      if (!more.contains(e.target)) {
        menu.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    return more;
  }

  function getMoreReserveWidth(more) {
    const button = more?.querySelector('.adaptive-overflow-tabs__more-btn');
    if (!button) return 80;

    const wasHidden = more.hidden;
    const previousPosition = more.style.position;
    const previousVisibility = more.style.visibility;
    const previousPointerEvents = more.style.pointerEvents;
    const previousInset = more.style.inset;

    if (wasHidden) {
      more.hidden = false;
      more.style.position = 'absolute';
      more.style.visibility = 'hidden';
      more.style.pointerEvents = 'none';
      more.style.inset = '0 auto auto 0';
    }

    const width = Math.ceil(button.getBoundingClientRect().width);

    if (wasHidden) {
      more.hidden = true;
      more.style.position = previousPosition;
      more.style.visibility = previousVisibility;
      more.style.pointerEvents = previousPointerEvents;
      more.style.inset = previousInset;
    }

    return width || 80;
  }

  function syncOverflow(container) {
    const track = container.querySelector(':scope > .adaptive-overflow-tabs__track');
    if (!track) return;

    // On mobile, prefer the existing snap-scroll/wrap behavior; the More
    // dropdown is a desktop affordance.
    const isMobile = document.body && document.body.classList.contains('is-mobile');
    const allowMobileOverflow = container.dataset.overflowOnMobile === 'true';
    const items = Array.from(track.children).filter(el =>
      el.classList && el.classList.contains('adaptive-overflow-tabs__item')
    );
    if (!items.length) return;

    // Reset all items to visible to remeasure.
    items.forEach(it => it.removeAttribute('data-overflowing'));

    const more = ensureMoreTrigger(container);
    const menu = more.querySelector('.adaptive-overflow-tabs__menu');
    menu.innerHTML = '';
    more.hidden = true;

    if (isMobile && !allowMobileOverflow) return;

    // Force layout, measure. If every tab already fits in the available
    // header space, do not reserve room for More; that reserve would create
    // a false overflow on wide editor headers.
    if (track.scrollWidth <= track.clientWidth + 1) {
      more.hidden = true;
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const trackRight = trackRect.right;
    // Reserve only the width the More trigger actually needs.
    const moreReserve = getMoreReserveWidth(more);
    const overflowing = [];
    const minVisibleMobile = isMobile && allowMobileOverflow
      ? Math.max(0, parseInt(container.dataset.minVisibleMobile || '0', 10) || 0)
      : 0;

    for (let i = 0; i < items.length; i++) {
      if (i < minVisibleMobile) continue;
      const rect = items[i].getBoundingClientRect();
      const limit = (i === items.length - 1) ? trackRight : trackRight - moreReserve;
      if (rect.right > limit + 0.5) {
        overflowing.push(items[i]);
      }
    }

    if (!overflowing.length) {
      more.hidden = true;
      return;
    }

    overflowing.forEach(item => {
      item.setAttribute('data-overflowing', 'true');
      const clone = document.createElement('button');
      clone.type = 'button';
      clone.setAttribute('role', 'menuitem');
      clone.innerHTML = item.innerHTML;
      const isActive = item.classList.contains('is-active') ||
                       item.getAttribute('aria-selected') === 'true' ||
                       item.getAttribute('aria-current') === 'page';
      if (isActive) clone.setAttribute('aria-current', 'true');
      clone.addEventListener('click', () => {
        // Forward the click to the original item.
        item.click();
        menu.hidden = true;
        const btn = more.querySelector('.adaptive-overflow-tabs__more-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      menu.appendChild(clone);
    });

    more.hidden = false;
  }

  const observed = new WeakSet();
  function observeContainer(container) {
    if (observed.has(container)) return;
    observed.add(container);
    syncOverflow(container);
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(() => syncOverflow(container));
      ro.observe(container);
    }
  }

  function scanOverflowTabs(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('.adaptive-overflow-tabs').forEach(observeContainer);
  }

  /* ---------------------------------------------------------------- */
  /*  Boot + DOM mutation observer                                     */
  /* ---------------------------------------------------------------- */

  function boot() {
    labelAllTables(document);
    scanOverflowTabs(document);

    const mo = new MutationObserver((muts) => {
      let needsTables = false;
      let needsTabs = false;
      for (const m of muts) {
        m.addedNodes.forEach(n => {
          if (n.nodeType !== 1) return;
          if (n.matches && (n.matches('table.adaptive-list-table') ||
                            n.querySelector('table.adaptive-list-table'))) needsTables = true;
          if (n.matches && (n.matches('.adaptive-overflow-tabs') ||
                            n.querySelector('.adaptive-overflow-tabs'))) needsTabs = true;
        });
      }
      if (needsTables) labelAllTables(document);
      if (needsTabs) scanOverflowTabs(document);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('viewport:change', () => {
      // Re-measure on viewport change since reserved widths shift.
      document.querySelectorAll('.adaptive-overflow-tabs').forEach(syncOverflow);
    });
  }

  // Expose for manual re-scan after dynamic renders.
  window.WebropolAdaptive = {
    rescanTables: () => labelAllTables(document),
    rescanOverflowTabs: () => document.querySelectorAll('.adaptive-overflow-tabs').forEach(syncOverflow)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
