// Ensure only a single webropol-header exists on the page
function removeExtraHeaders(root = document) {
  const headers = root.querySelectorAll('webropol-header');
  if (headers.length > 1) {
    headers.forEach((h, i) => { if (i > 0) try { h.remove(); } catch(_) {} });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  removeExtraHeaders();
  const mo = new MutationObserver((mutations) => {
    let dirty = false;
    for (const m of mutations) {
      if (m.type === 'childList' && (m.addedNodes && m.addedNodes.length)) {
        dirty = true; break;
      }
    }
    if (dirty) removeExtraHeaders(document);
  });
  try { mo.observe(document.body, { childList: true, subtree: true }); } catch (_) {}
});
