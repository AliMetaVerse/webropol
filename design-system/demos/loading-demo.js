(function () {
  const PAGE_SELECTOR = '[data-loading-demo-page]';
  const pageStates = new WeakMap();

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getState(root) {
    if (!pageStates.has(root)) {
      pageStates.set(root, {
        menuOpen: false,
        exportTitle: '',
        exportFilename: '',
        exportMimeType: 'text/plain',
        exportContent: '',
        statusTimer: null,
        documentClickHandler: null
      });
    }

    return pageStates.get(root);
  }

  function getElements(root) {
    return {
      menuToggle: root.querySelector('[data-menu-toggle]'),
      menuPanel: root.querySelector('[data-menu-panel]'),
      exportPanel: root.querySelector('[data-export-panel]'),
      exportTitle: root.querySelector('[data-export-title]'),
      exportDescription: root.querySelector('[data-export-description]'),
      exportFilename: root.querySelector('[data-export-filename]'),
      exportContent: root.querySelector('[data-export-content]'),
      loaderCount: root.querySelector('[data-loader-count]'),
      statusToast: document.querySelector('[data-status-toast]'),
      statusMessage: document.querySelector('[data-status-message]')
    };
  }

  function getSpecCards(root) {
    return Array.from(root.querySelectorAll('[data-loader-id]'));
  }

  function getLoaderSpecs(root) {
    return getSpecCards(root).map((card) => ({
      id: card.dataset.loaderId,
      name: card.dataset.name,
      component: card.dataset.component,
      type: card.dataset.type,
      shownSize: card.dataset.shownSize,
      spaceNeeded: card.dataset.spaceNeeded,
      supportedSizes: card.dataset.supportedSizes,
      palette: card.dataset.palette,
      usage: card.dataset.usage,
      handoff: card.dataset.handoff,
      snippet: card.dataset.snippet
    }));
  }

  function enhanceSpecCards(root) {
    getSpecCards(root).forEach((card) => {
      if (card.querySelector('.spec-group')) {
        return;
      }

      const specGroup = document.createElement('div');
      specGroup.className = 'spec-group';
      specGroup.innerHTML = [
        `<button type="button" class="spec-trigger" aria-label="Open loader specs for ${escapeHtml(card.dataset.name || 'loader')}">`,
        '  <i class="fal fa-circle-info"></i>',
        '</button>',
        '<div class="spec-popover">',
        `  <h3>${escapeHtml(card.dataset.name || 'Loader')}</h3>`,
        '  <dl class="spec-list">',
        '    <div class="spec-row"><dt>Component</dt><dd>' + escapeHtml(card.dataset.component || '') + '</dd></div>',
        '    <div class="spec-row"><dt>Shown scale</dt><dd>' + escapeHtml(card.dataset.shownSize || '') + '</dd></div>',
        '    <div class="spec-row"><dt>Space needed</dt><dd>' + escapeHtml(card.dataset.spaceNeeded || '') + '</dd></div>',
        '    <div class="spec-row"><dt>Supports</dt><dd>' + escapeHtml(card.dataset.supportedSizes || '') + '</dd></div>',
        '    <div class="spec-row"><dt>Palette</dt><dd>' + escapeHtml(card.dataset.palette || '') + '</dd></div>',
        '    <div class="spec-row"><dt>Use</dt><dd>' + escapeHtml(card.dataset.usage || '') + '</dd></div>',
        '    <div class="spec-row"><dt>Handoff</dt><dd>' + escapeHtml(card.dataset.handoff || '') + '</dd></div>',
        '  </dl>',
        '</div>'
      ].join('');

      card.appendChild(specGroup);
    });
  }

  function setMenuOpen(root, open) {
    const state = getState(root);
    const { menuToggle, menuPanel } = getElements(root);
    state.menuOpen = open;
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (menuPanel) {
      menuPanel.hidden = !open;
    }
  }

  function flash(root, message) {
    const state = getState(root);
    const { statusToast, statusMessage } = getElements(root);
    if (!statusToast || !statusMessage) {
      return;
    }

    statusMessage.textContent = message;
    statusToast.hidden = false;
    window.clearTimeout(state.statusTimer);
    state.statusTimer = window.setTimeout(() => {
      statusToast.hidden = true;
      statusMessage.textContent = '';
    }, 2200);
  }

  function getExportPayload(root, mode) {
    const specs = getLoaderSpecs(root);

    if (mode === 'snippets') {
      return {
        title: 'Component snippets',
        description: 'Paste-ready HTML snippets for engineering, prototyping, or motion tooling.',
        filename: 'webropol-loader-snippets.txt',
        mimeType: 'text/plain',
        content: specs.map((spec) => `[${spec.name}]\n${spec.snippet}`).join('\n\n')
      };
    }

    if (mode === 'notes') {
      return {
        title: 'Figma handoff notes',
        description: 'Plain-text notes optimized for Figma comments, FigJam boards, or design documentation.',
        filename: 'webropol-loader-handoff-notes.txt',
        mimeType: 'text/plain',
        content: specs.map((spec) => [
          spec.name,
          `Component: ${spec.component}`,
          `Shown scale: ${spec.shownSize}`,
          `Space needed: ${spec.spaceNeeded}`,
          `Supports: ${spec.supportedSizes}`,
          `Palette: ${spec.palette}`,
          `Use: ${spec.usage}`,
          `Handoff: ${spec.handoff}`,
          `Snippet: ${spec.snippet}`
        ].join('\n')).join('\n\n---\n\n')
      };
    }

    if (mode === 'html') {
      const cards = specs.map((spec) => [
        '          <article class="card">',
        `            <h2>${escapeHtml(spec.name)}</h2>`,
        `            <p><strong>Component:</strong> ${escapeHtml(spec.component)}</p>`,
        `            <p><strong>Type:</strong> ${escapeHtml(spec.type)}</p>`,
        `            <p><strong>Shown scale:</strong> ${escapeHtml(spec.shownSize)}</p>`,
        `            <p><strong>Space needed:</strong> ${escapeHtml(spec.spaceNeeded)}</p>`,
        `            <p><strong>Supports:</strong> ${escapeHtml(spec.supportedSizes)}</p>`,
        `            <p><strong>Palette:</strong> ${escapeHtml(spec.palette)}</p>`,
        `            <p><strong>Use:</strong> ${escapeHtml(spec.usage)}</p>`,
        `            <p><strong>Handoff:</strong> ${escapeHtml(spec.handoff)}</p>`,
        `            <pre>${escapeHtml(spec.snippet)}</pre>`,
        '          </article>'
      ].join('\n')).join('\n');

      return {
        title: 'Standalone handoff HTML',
        description: 'A single self-contained HTML document for browser preview or capture into Figma and other design tools.',
        filename: 'webropol-loader-handoff.html',
        mimeType: 'text/html',
        content: [
          '<!DOCTYPE html>',
          '<html lang="en">',
          '<head>',
          '  <meta charset="UTF-8">',
          '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
          '  <title>Webropol Loader Handoff</title>',
          '  <style>',
          '    body { font-family: Inter, system-ui, sans-serif; margin: 0; background: #f5f7f8; color: #272a2b; }',
          '    main { max-width: 1200px; margin: 0 auto; padding: 40px 24px 72px; }',
          '    h1 { margin: 0 0 10px; font-size: 2rem; }',
          '    p.lead { margin: 0 0 28px; color: #61686a; }',
          '    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }',
          '    .card { background: white; border: 1px solid #e6e7e8; border-radius: 18px; padding: 20px; box-shadow: 0 14px 30px rgba(39,42,43,0.07); }',
          '    .card h2 { margin: 0 0 12px; font-size: 1.05rem; }',
          '    .card p { margin: 0 0 8px; font-size: 0.9rem; line-height: 1.45; }',
          '    .card strong { color: #1d809d; }',
          '    pre { margin: 16px 0 0; padding: 14px; overflow: auto; border-radius: 12px; background: #f3f4f4; font-size: 0.78rem; white-space: pre-wrap; word-break: break-word; }',
          '  </style>',
          '</head>',
          '<body>',
          '  <main>',
          '    <h1>Webropol Loader Handoff</h1>',
          '    <p class="lead">Exported from the design system loading demo for design review, documentation, or browser capture into Figma and related tools.</p>',
          '    <section class="grid">',
          cards,
          '    </section>',
          '  </main>',
          '</body>',
          '</html>'
        ].join('\n')
      };
    }

    return {
      title: 'Loader specs JSON',
      description: 'Machine-readable loader metadata with size, palette, usage, and handoff notes.',
      filename: 'webropol-loader-specs.json',
      mimeType: 'application/json',
      content: JSON.stringify(specs, null, 2)
    };
  }

  function openExportPanel(root, mode) {
    const state = getState(root);
    const elements = getElements(root);
    const payload = getExportPayload(root, mode);

    state.exportTitle = payload.title;
    state.exportFilename = payload.filename;
    state.exportMimeType = payload.mimeType;
    state.exportContent = payload.content;

    if (elements.exportPanel) {
      elements.exportPanel.hidden = false;
    }
    if (elements.exportTitle) {
      elements.exportTitle.textContent = payload.title;
    }
    if (elements.exportDescription) {
      elements.exportDescription.textContent = payload.description;
    }
    if (elements.exportFilename) {
      elements.exportFilename.textContent = payload.filename;
    }
    if (elements.exportContent) {
      elements.exportContent.value = payload.content;
      requestAnimationFrame(() => {
        elements.exportContent.focus();
        elements.exportContent.select();
      });
    }

    setMenuOpen(root, false);
  }

  function closeExportPanel(root) {
    const { exportPanel } = getElements(root);
    if (exportPanel) {
      exportPanel.hidden = true;
    }
  }

  async function copyText(root, text, successMessage) {
    const { exportContent } = getElements(root);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        flash(root, successMessage);
        return;
      }
    } catch (_) {
      // Fall through to manual copy path.
    }

    if (exportContent) {
      exportContent.focus();
      exportContent.select();
    }

    try {
      if (document.execCommand('copy')) {
        flash(root, successMessage);
        return;
      }
    } catch (_) {
      // Manual copy fallback below.
    }

    flash(root, 'Clipboard blocked. Content is selected for manual copy.');
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function bindPage(root) {
    if (root.dataset.loadingDemoInitialized === 'true') {
      return;
    }

    root.dataset.loadingDemoInitialized = 'true';
    enhanceSpecCards(root);

    const elements = getElements(root);
    if (elements.loaderCount) {
      elements.loaderCount.textContent = `${getLoaderSpecs(root).length} loaders documented`;
    }

    root.addEventListener('click', async (event) => {
      const menuToggle = event.target.closest('[data-menu-toggle]');
      const exportTrigger = event.target.closest('[data-export-mode]');
      const copyExport = event.target.closest('[data-copy-export]');
      const downloadExport = event.target.closest('[data-download-export]');
      const closeExport = event.target.closest('[data-close-export]');

      if (menuToggle) {
        event.preventDefault();
        const state = getState(root);
        setMenuOpen(root, !state.menuOpen);
        return;
      }

      if (exportTrigger) {
        event.preventDefault();
        openExportPanel(root, exportTrigger.dataset.exportMode || 'json');
        return;
      }

      if (copyExport) {
        event.preventDefault();
        const state = getState(root);
        await copyText(root, state.exportContent, `${state.exportTitle} copied`);
        return;
      }

      if (downloadExport) {
        event.preventDefault();
        const state = getState(root);
        downloadFile(state.exportFilename, state.exportContent, state.exportMimeType);
        flash(root, `${state.exportTitle} exported`);
        return;
      }

      if (closeExport) {
        event.preventDefault();
        closeExportPanel(root);
      }
    });

    const state = getState(root);
    state.documentClickHandler = (event) => {
      if (!root.contains(event.target)) {
        setMenuOpen(root, false);
        return;
      }

      if (!event.target.closest('[data-menu-shell]')) {
        setMenuOpen(root, false);
      }
    };

    document.addEventListener('click', state.documentClickHandler, true);
  }

  function initLoadingDemoPages() {
    document.querySelectorAll(PAGE_SELECTOR).forEach(bindPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingDemoPages, { once: true });
  } else {
    initLoadingDemoPages();
  }

  window.addEventListener('spa-route-change', () => {
    window.setTimeout(initLoadingDemoPages, 30);
  });
})();