/* Dynamic Survey Name handling & UI decoration
 * Tries (in order): URL ?surveyName= / ?survey=, localStorage 'currentSurveyName', body[data-survey-name]
 * Falls back to 'Untitled Survey'. Provides rename option via small pen icon.
 */
(() => {
  const STORAGE_KEY = 'currentSurveyName';
  const ID_KEY = 'currentSurveyId';
  const MAP_KEY = 'surveyNameMap';

  function readFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('surveyName') || params.get('survey');
    } catch (e) { return null; }
  }

  function readFromStorage() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function readId() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('id') || localStorage.getItem(ID_KEY);
    } catch (e) { return null; }
  }

  function readMap() {
    try { return JSON.parse(localStorage.getItem(MAP_KEY) || '{}'); } catch (e) { return {}; }
  }

  function writeMap(map) {
    try { localStorage.setItem(MAP_KEY, JSON.stringify(map)); } catch (e) {}
  }

  function writeToStorage(name) {
    try { localStorage.setItem(STORAGE_KEY, name); } catch (e) {}
  }

  function getInitialName() {
    // URL explicit surveyName overrides everything
    const fromUrl = readFromUrl();
    if (fromUrl) { writeToStorage(fromUrl); return fromUrl; }
    // Try map by id
    const id = readId();
    if (id) {
      const map = readMap();
      if (map[id]) {
        writeToStorage(map[id]);
        return map[id];
      }
    }
    // Stored current name
    const stored = readFromStorage();
    if (stored) return stored;
    const dataAttr = document.body?.getAttribute('data-survey-name');
    return dataAttr || 'Untitled Survey';
  }

  function setDisplay(name) {
    const textEl = document.querySelector('#surveyNameDisplay .survey-name-text');
    if (textEl) textEl.textContent = name;
    // Update document title (append / replace suffix after first dash)
    try {
      const base = document.title.split(' - ')[0];
      document.title = `${base} - ${name}`;
    } catch (e) {}
  }

  function initRename(name) {
    const btn = document.getElementById('renameSurveyBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = readFromStorage() || name;
      const next = prompt('Rename survey:', current || '');
      if (next && next.trim()) {
        const cleaned = next.trim();
        writeToStorage(cleaned);
        setDisplay(cleaned);
        window.dispatchEvent(new CustomEvent('survey-name-changed', { detail: { name: cleaned }}));
      }
    });
  }

  function watchStorage() {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        setDisplay(e.newValue || 'Untitled Survey');
      }
    });
  }

  function enhanceOverflow() {
    const container = document.querySelector('#surveyNameDisplay .survey-name-text');
    if (!container) return;
    container.addEventListener('mouseenter', () => {
      if (container.scrollWidth > container.clientWidth) {
        container.setAttribute('title', container.textContent || '');
      }
    });
  }

  function init() {
    const initial = getInitialName();
    setDisplay(initial);
    initRename(initial);
    watchStorage();
    enhanceOverflow();

    // Listen for external selection events (e.g., dashboard click without full reload in SPA context)
    window.addEventListener('survey-selected', (e) => {
      const detail = e.detail || {};
      if (detail.name) {
        writeToStorage(detail.name);
        if (detail.id) {
          try {
            localStorage.setItem(ID_KEY, detail.id);
            const map = readMap();
            map[detail.id] = detail.name;
            writeMap(map);
          } catch (er) {}
        }
        setDisplay(detail.name);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
