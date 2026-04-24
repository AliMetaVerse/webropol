/**
 * AI Question Generator (UI-only)
 * -------------------------------------------------------------------
 * Feature flag: window.WEBROPOL_AI_GEN_ENABLED (default: true)
 *
 * Registers three custom elements:
 *   <webropol-ai-generate-button>   Primary CTA entry point
 *   <webropol-ai-generate-modal>    Two-step modal (input → preview)
 *   <webropol-ai-generated-card>    Per-question preview / edit card
 *
 * Public API (window.AIQuestionGenerator):
 *   open()                          Open the modal
 *   close()                         Close the modal
 *   insertGeneratedQuestions(qs)    Stub — logs + toast (no real insert)
 *   generateMockQuestions(prompt, count, types)
 *   regenerateMockQuestion(old)
 *
 * NO backend, NO persistence, NO LLM calls. All data is mocked.
 *
 * Real API integration points are marked with: // [API-INTEGRATION]
 * -------------------------------------------------------------------
 */

(() => {
  if (window.__webropolAIGenLoaded) return;
  window.__webropolAIGenLoaded = true;

  // Lazy-register the design-system dropdown so we can use <webropol-dropdown>
  // for the tone selector. Side-effect import; no-op if already registered.
  if (!customElements.get('webropol-dropdown')) {
    import('../../../design-system/components/forms/Dropdown.js').catch(err => {
      console.warn('[AIQuestionGenerator] Failed to load webropol-dropdown:', err);
    });
  }

  // Lazy-register the design-system tooltip so we can use <webropol-tooltip>
  // for question-type info hints.
  if (!customElements.get('webropol-tooltip')) {
    import('../../../design-system/components/feedback/Tooltip.js').catch(err => {
      console.warn('[AIQuestionGenerator] Failed to load webropol-tooltip:', err);
    });
  }

  // Feature flag — flip to false to hide all entry points.
  if (typeof window.WEBROPOL_AI_GEN_ENABLED === 'undefined') {
    window.WEBROPOL_AI_GEN_ENABLED = true;
  }

  // ─────────────────────────────────────────────────────────────────
  // Scoped styles — royal palette for AI actions/icons.
  // Host pages don't always extend Tailwind with the royal tokens,
  // so we register utility classes once for self-contained styling.
  // Royal palette: royalViolet-500 #823bdd, royalViolet-700 #511a98,
  //                royalBlue-500   #6366F1, royalBlue-700   #4338CA
  // ─────────────────────────────────────────────────────────────────
  function ensureStyles() {
    if (document.getElementById('webropol-ai-gen-styles')) return;
    const style = document.createElement('style');
    style.id = 'webropol-ai-gen-styles';
    style.textContent = `
      .ai-gen-royal-grad {
        background-image: linear-gradient(135deg, #823bdd 0%, #6366F1 100%);
        color: #fff;
      }
      .ai-gen-royal-grad:hover:not(:disabled) {
        background-image: linear-gradient(135deg, #6922c4 0%, #4F46E5 100%);
        box-shadow: 0 10px 25px -10px rgba(105, 34, 196, 0.55);
      }
      .ai-gen-royal-grad:disabled {
        background-image: linear-gradient(135deg, #d5bef4 0%, #C7D2FE 100%);
        cursor: not-allowed;
      }
      .ai-gen-royal-grad-soft {
        background-image: linear-gradient(135deg, #f1e9fb 0%, #EEF2FF 100%);
      }
      .ai-gen-royal-text { color: #6922c4; }
      .ai-gen-royal-text-strong { color: #511a98; }
      .ai-gen-royal-bg-soft { background-color: #f1e9fb; }
      .ai-gen-royal-bg-soft-hover:hover { background-color: #f1e9fb; }
      .ai-gen-royal-border-soft { border-color: #d5bef4; }
      .ai-gen-royal-icon-btn {
        color: #64748b;
        transition: color .15s ease, background-color .15s ease;
      }
      .ai-gen-royal-icon-btn:hover {
        color: #6922c4;
        background-color: #f1e9fb;
      }
      .ai-gen-royal-ring:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(130, 59, 221, .35);
      }
      .ai-gen-spinner-track { border-color: #f1e9fb; }
      .ai-gen-spinner-head { border-top-color: #823bdd; }

      /* ── Royal slider (Figma: Webropol Royal Design System / Meter) ── */
      .ai-gen-slider {
        --ai-slider-fill: 50%;
        position: relative;
        padding: 16px 14px 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid #d1d5d6;
      }
      .ai-gen-slider__row {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ai-gen-slider__edge {
        font: 500 14px/20px 'Inter', system-ui, sans-serif;
        color: #515557;
        min-width: 18px;
        text-align: center;
      }
      .ai-gen-slider__track-wrap {
        position: relative;
        flex: 1;
        height: 24px;
        display: flex;
        align-items: center;
      }
      .ai-gen-slider__cap {
        width: 1px;
        height: 14px;
        background: #cbd5e1;
        flex: none;
      }
      .ai-gen-slider__track {
        position: relative;
        flex: 1;
        height: 8px;
        border-radius: 9999px;
        background: #e2e8f0;
        overflow: hidden;
      }
      .ai-gen-slider__fill {
        position: absolute;
        inset: 0 auto 0 0;
        width: var(--ai-slider-fill);
        background-image: linear-gradient(90deg, #823bdd 0%, #4338CA 100%);
        border-radius: 9999px;
        transition: width .12s ease;
      }
      .ai-gen-slider__input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        opacity: 0;
        cursor: pointer;
        z-index: 3;
      }
      .ai-gen-slider__thumb {
        position: absolute;
        top: 50%;
        left: var(--ai-slider-fill);
        width: 24px;
        height: 24px;
        border-radius: 9999px;
        background: #ffffff;
        border: 4px solid #511a98;
        transform: translate(-50%, -50%);
        box-shadow: 0 2px 6px rgba(81, 26, 152, 0.25);
        transition: transform .12s ease, box-shadow .12s ease;
        pointer-events: none;
        z-index: 2;
      }
      .ai-gen-slider__input:focus-visible + .ai-gen-slider__thumb {
        box-shadow: 0 0 0 4px rgba(130, 59, 221, .25), 0 2px 6px rgba(81, 26, 152, 0.25);
      }
      .ai-gen-slider__input:active + .ai-gen-slider__thumb {
        transform: translate(-50%, -50%) scale(1.08);
      }
      .ai-gen-slider__bubble {
        position: absolute;
        bottom: calc(100% + 8px);
        left: var(--ai-slider-fill);
        transform: translateX(-50%);
        background: #511a98;
        color: #fff;
        padding: 6px 14px;
        border-radius: 12px;
        font: 700 18px/22px 'Inter', system-ui, sans-serif;
        min-width: 44px;
        text-align: center;
        pointer-events: none;
        white-space: nowrap;
      }
      .ai-gen-slider__bubble::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 7px solid transparent;
        border-top-color: #511a98;
        border-bottom: 0;
      }
    `;
    document.head.appendChild(style);
  }
  ensureStyles();

  // ─────────────────────────────────────────────────────────────────
  // Mock data helpers
  // ─────────────────────────────────────────────────────────────────

  const QUESTION_TYPE_LABELS = {
    // Text
    'open-ended': 'Open ended',
    'contact': 'Contact form',
    'text': 'Text field',
    'numeric': 'Numeric field',
    // Selection
    'single-choice': 'Selection',
    'multi-choice': 'Multiselection',
    'dropdown': 'Dropdown',
    'picture-selection': 'Picture selection',
    'picture-multiselection': 'Picture multiselection',
    // Matrix
    'matrix': 'Matrix (Scale selection)',
    'matrix-multi': 'Multiselection matrix',
    'position': 'Position',
    // Experience & Loyalty
    'nps': 'NPS',
    'ces': 'CES',
    'csat': 'CSAT',
    // Other
    'file': 'Attach file to response',
    'fourfold': 'Fourfold',
    'calendar': 'Calendar',
    'question-table': 'Question table',
    'hierarchical': 'Hierarchical',
    'ranking': 'Ranking',
    'slider': 'Numeric slider',
    'autosuggest': 'Autosuggest text field',
    // Backwards-compat alias
    'scale': 'Scale'
  };

  const QUESTION_TYPE_ICONS = {
    'open-ended': 'fal fa-font-case',
    'contact': 'fal fa-address-card',
    'text': 'fal fa-text',
    'numeric': 'fal fa-calculator',
    'single-choice': 'fal fa-list-ul',
    'multi-choice': 'fal fa-list-check',
    'dropdown': 'fal fa-caret-square-down',
    'picture-selection': 'fal fa-image',
    'picture-multiselection': 'fal fa-images',
    'matrix': 'fal fa-table',
    'matrix-multi': 'fal fa-th',
    'position': 'fal fa-arrows-h',
    'nps': 'fal fa-tachometer-alt',
    'ces': 'fal fa-books',
    'csat': 'fal fa-smile-heart',
    'file': 'fal fa-paperclip',
    'fourfold': 'fal fa-border-all',
    'calendar': 'fal fa-calendar-alt',
    'question-table': 'fal fa-table',
    'hierarchical': 'fal fa-sitemap',
    'ranking': 'fal fa-sort-amount-up',
    'slider': 'fal fa-sliders-h',
    'autosuggest': 'fal fa-file-alt',
    'scale': 'fal fa-sliders-h'
  };

  const QUESTION_TYPE_DESCRIPTIONS = {
    'open-ended': 'Free-form text answer for qualitative feedback.',
    'contact': 'Collect respondent contact details (name, email, phone).',
    'text': 'Short single-line text input.',
    'numeric': 'Numeric input with validation.',
    'single-choice': 'Pick exactly one option from a list.',
    'multi-choice': 'Pick one or more options from a list.',
    'dropdown': 'Pick one option from a compact dropdown list.',
    'picture-selection': 'Pick one option presented as images.',
    'picture-multiselection': 'Pick multiple options presented as images.',
    'matrix': 'Rate multiple items on the same scale.',
    'matrix-multi': 'Multi-select choices across multiple rows.',
    'position': 'Place an item on a horizontal axis.',
    'nps': 'Net Promoter Score — likelihood to recommend (0–10).',
    'ces': 'Customer Effort Score — how easy was the experience.',
    'csat': 'Customer Satisfaction — overall satisfaction rating.',
    'file': 'Allow respondents to upload a file with their answer.',
    'fourfold': 'Plot answers on a 2×2 importance/satisfaction grid.',
    'calendar': 'Pick a date or date range from a calendar.',
    'question-table': 'Group several questions in a compact table.',
    'hierarchical': 'Nested categories that drill down on selection.',
    'ranking': 'Order options by preference.',
    'slider': 'Pick a value on a numeric slider.',
    'autosuggest': 'Text field with suggested completions.',
    'scale': 'Pick a value on a labeled scale.'
  };
  const QUESTION_TYPE_GROUPS = [
    { title: 'Text', color: 'orange', types: ['open-ended', 'contact', 'text', 'numeric'] },
    { title: 'Selection', color: 'blue', types: ['single-choice', 'multi-choice', 'dropdown', 'picture-selection', 'picture-multiselection'] },
    { title: 'Matrix', color: 'green', types: ['matrix', 'matrix-multi', 'position'] },
    { title: 'Experience & Loyalty', color: 'purple', types: ['nps', 'ces', 'csat'] },
    { title: 'Other', color: 'yellow', types: ['file', 'fourfold', 'calendar', 'question-table', 'hierarchical', 'ranking', 'slider', 'autosuggest'] }
  ];

  const MOCK_BANK = {
    'open-ended': [
      { title: 'What did you like most about your experience?', description: 'Share your thoughts in your own words.' },
      { title: 'How could we improve our service?', description: 'Be as specific as you like.' },
      { title: 'Describe your overall experience in one sentence.', description: '' },
      { title: 'What almost stopped you from completing this?', description: '' }
    ],
    'single-choice': [
      { title: 'How did you hear about us?', options: ['Search engine', 'Friend or colleague', 'Social media', 'Advertisement', 'Other'] },
      { title: 'Which feature do you use the most?', options: ['Surveys', 'Reports', 'Dashboards', 'Events'] },
      { title: 'How often do you use our product?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] }
    ],
    'multi-choice': [
      { title: 'Which of the following apply to you? (Select all that apply)', options: ['I use it at work', 'I use it at home', 'I recommend it to others', 'I subscribe to updates'] },
      { title: 'Which channels do you prefer for support?', options: ['Email', 'Chat', 'Phone', 'Help center', 'Community'] }
    ],
    'scale': [
      { title: 'How satisfied are you overall?', minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied', min: 1, max: 5 },
      { title: 'How likely are you to use this again?', minLabel: 'Not at all likely', maxLabel: 'Extremely likely', min: 1, max: 10 }
    ],
    'csat': [
      { title: 'How would you rate your overall satisfaction?', minLabel: 'Very unhappy', maxLabel: 'Delighted', min: 1, max: 5 }
    ],
    'nps': [
      { title: 'How likely are you to recommend us to a friend or colleague?', minLabel: 'Not at all likely', maxLabel: 'Extremely likely', min: 0, max: 10 }
    ]
  };

  let _uid = 0;
  const nextId = () => `ai-q-${Date.now().toString(36)}-${(++_uid).toString(36)}`;

  /**
   * Produce a mock list of generated questions.
   * [API-INTEGRATION] Replace with POST /ai/generate { prompt, count, types, tone }.
   */
  function generateMockQuestions(prompt, count = 5, selectedTypes = ['open-ended', 'single-choice', 'scale'], tone = 'neutral') {
    const types = (Array.isArray(selectedTypes) && selectedTypes.length) ? selectedTypes : ['open-ended'];
    const out = [];
    for (let i = 0; i < count; i++) {
      const type = types[i % types.length];
      const bank = MOCK_BANK[type] || MOCK_BANK['open-ended'];
      const base = bank[Math.floor(Math.random() * bank.length)];
      out.push(buildQuestion(type, base, prompt, tone));
    }
    return out;
  }

  /**
   * Replace a question with another mock variation of the same type.
   * [API-INTEGRATION] Replace with POST /ai/regenerate { id, originalPrompt }.
   */
  function regenerateMockQuestion(oldQuestion) {
    const type = oldQuestion.type;
    const bank = MOCK_BANK[type] || MOCK_BANK['open-ended'];
    const base = bank[Math.floor(Math.random() * bank.length)];
    return buildQuestion(type, base, oldQuestion._prompt || '', oldQuestion._tone || 'neutral');
  }

  function buildQuestion(type, base, prompt, tone) {
    const q = {
      id: nextId(),
      type,
      typeLabel: QUESTION_TYPE_LABELS[type] || type,
      title: base.title,
      description: base.description || '',
      options: base.options ? [...base.options] : null,
      minLabel: base.minLabel || null,
      maxLabel: base.maxLabel || null,
      min: typeof base.min === 'number' ? base.min : null,
      max: typeof base.max === 'number' ? base.max : null,
      _prompt: prompt,
      _tone: tone
    };
    // Light "tone" nudge (purely cosmetic, since we don't have a real LLM).
    if (tone === 'friendly' && q.title && !q.title.endsWith('?')) q.title = q.title + ' 🙂';
    if (tone === 'formal' && q.description === '') q.description = 'Please respond at your earliest convenience.';
    return q;
  }

  /**
   * Insert stub. Real editor wiring goes here.
   * [API-INTEGRATION] Map to existing editor insert pipeline (e.g. add-question-modal → question components).
   */
  function insertGeneratedQuestions(questions) {
    console.log('[AIQuestionGenerator] insertGeneratedQuestions (stub):', questions);
    // Dispatch a global event so host app can observe (still UI-only).
    document.dispatchEvent(new CustomEvent('ai-questions-insert-requested', {
      detail: { questions },
      bubbles: true
    }));
    showToast(`${questions.length} question${questions.length === 1 ? '' : 's'} inserted`, 'success');
  }

  // ─────────────────────────────────────────────────────────────────
  // Lightweight toast
  // ─────────────────────────────────────────────────────────────────
  function ensureToastHost() {
    let host = document.getElementById('webropol-ai-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'webropol-ai-toast-host';
      host.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[2147483646] flex flex-col items-center gap-2 pointer-events-none';
      document.body.appendChild(host);
    }
    return host;
  }

  function showToast(message, variant = 'success') {
    const host = ensureToastHost();
    const toast = document.createElement('div');
    const palette = {
      success: 'bg-green-600 text-white',
      error: 'bg-webropol-error-600 text-white',
      info: 'bg-webropol-primary-600 text-white'
    }[variant] || 'bg-webropol-gray-900 text-white';
    const icon = {
      success: 'fal fa-check-circle',
      error: 'fal fa-exclamation-circle',
      info: 'fal fa-info-circle'
    }[variant] || 'fal fa-check-circle';
    toast.className = `${palette} pointer-events-auto px-4 py-2.5 rounded-full shadow-medium text-sm font-medium flex items-center gap-2 transition-all duration-300 opacity-0 translate-y-2`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `<i class="${icon}"></i><span>${escapeHtml(message)}</span>`;
    host.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    });
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ─────────────────────────────────────────────────────────────────
  // <webropol-ai-generate-button> — primary CTA entry point
  // ─────────────────────────────────────────────────────────────────
  class WebropolAIGenerateButton extends HTMLElement {
    connectedCallback() {
      // Only hide when the flag is explicitly set to false; undefined = feature on
      if (window.WEBROPOL_AI_GEN_ENABLED === false) { this.style.display = 'none'; return; }
      if (this._rendered) return;
      this._rendered = true;
      const label = this.getAttribute('label') || 'Generate questions with AI';
      const variant = this.getAttribute('variant') || 'primary'; // primary | subtle
      const size = this.getAttribute('size') || 'md';

      const base = 'inline-flex items-center gap-2.5 font-semibold rounded-full transition-all duration-200 ai-gen-royal-ring focus:outline-none';
      const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
      const variants = {
        primary: 'ai-gen-royal-grad shadow-soft',
        subtle: 'bg-white border ai-gen-royal-border-soft ai-gen-royal-text ai-gen-royal-bg-soft-hover'
      };

      this.innerHTML = `
        <button type="button"
          class="${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary}"
          aria-label="${escapeHtml(label)}">
          <span class="relative inline-flex items-center justify-center w-5 h-5">
            <i class="fal fa-sparkles"></i>
          </span>
          <span>${escapeHtml(label)}</span>
        </button>
      `;
      this.querySelector('button').addEventListener('click', () => window.AIQuestionGenerator.open());
    }
  }
  customElements.define('webropol-ai-generate-button', WebropolAIGenerateButton);

  // ─────────────────────────────────────────────────────────────────
  // <webropol-ai-generated-card> — single preview card
  // ─────────────────────────────────────────────────────────────────
  class WebropolAIGeneratedCard extends HTMLElement {
    set question(q) { this._q = q; this.render(); }
    get question() { return this._q; }
    set selected(v) {
      this._selected = !!v;
      const cb = this.querySelector('[data-role="select"]');
      if (cb) cb.checked = this._selected;
      this._applySelectedStyles();
    }
    get selected() { return !!this._selected; }

    _applySelectedStyles() {
      const card = this.querySelector('[data-role="card"]');
      if (!card) return;
      if (this._selected) {
        card.classList.add('ring-2', 'border-transparent');
        card.style.boxShadow = '0 0 0 2px #823bdd';
      } else {
        card.classList.remove('ring-2', 'border-transparent');
        card.style.boxShadow = '';
      }
    }

    render() {
      if (!this._q) { this.innerHTML = ''; return; }
      const q = this._q;
      const icon = QUESTION_TYPE_ICONS[q.type] || 'fal fa-circle-question';
      const typeColor = {
        'open-ended': 'bg-violet-100 text-violet-700',
        'single-choice': 'bg-sky-100 text-sky-700',
        'multi-choice': 'bg-blue-100 text-blue-700',
        'scale': 'bg-emerald-100 text-emerald-700',
        'csat': 'bg-pink-100 text-pink-700',
        'nps': 'bg-amber-100 text-amber-700'
      }[q.type] || 'bg-webropol-gray-100 text-webropol-gray-700';

      this.innerHTML = `
        <div data-role="card"
          class="bg-white border border-webropol-gray-200 rounded-2xl p-4 transition-all duration-150 hover:shadow-soft focus-within:shadow-soft"
          tabindex="0"
          role="group"
          aria-label="${escapeHtml(q.typeLabel)}: ${escapeHtml(q.title)}">
          <div class="flex items-start gap-3">
            <label class="pt-1 cursor-pointer">
              <input data-role="select" type="checkbox"
                class="h-4 w-4 rounded border-webropol-gray-300 text-webropol-primary-600 focus:ring-webropol-primary-400"
                aria-label="Select this question" />
            </label>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor}">
                  <i class="${icon}"></i>${escapeHtml(q.typeLabel)}
                </span>
              </div>
              <div data-role="view">
                <h4 class="text-base font-semibold text-webropol-gray-900 leading-snug">${escapeHtml(q.title)}</h4>
                ${q.description ? `<p class="mt-1 text-sm text-webropol-gray-600">${escapeHtml(q.description)}</p>` : ''}
                ${this._renderDetails(q)}
              </div>
              <div data-role="edit" class="hidden space-y-2">
                <input data-role="edit-title" type="text"
                  class="w-full rounded-lg border border-webropol-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-webropol-primary-400"
                  value="${escapeHtml(q.title)}" aria-label="Question title" />
                <textarea data-role="edit-desc" rows="2"
                  class="w-full rounded-lg border border-webropol-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-webropol-primary-400"
                  aria-label="Question description"
                  placeholder="Optional description">${escapeHtml(q.description || '')}</textarea>
                ${q.options ? `
                  <div>
                    <label class="text-xs font-semibold uppercase tracking-wide text-webropol-gray-500">Options (one per line)</label>
                    <textarea data-role="edit-options" rows="${Math.max(3, q.options.length)}"
                      class="mt-1 w-full rounded-lg border border-webropol-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-webropol-primary-400"
                      aria-label="Answer options">${escapeHtml(q.options.join('\n'))}</textarea>
                  </div>` : ''}
                <div class="flex items-center gap-2 pt-1">
                  <button data-role="edit-save" type="button"
                    class="px-3 py-1.5 rounded-full ai-gen-royal-grad text-xs font-semibold">Save</button>
                  <button data-role="edit-cancel" type="button"
                    class="px-3 py-1.5 rounded-full bg-webropol-gray-100 text-webropol-gray-700 text-xs font-semibold hover:bg-webropol-gray-200">Cancel</button>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button data-role="edit-btn" type="button"
                class="w-8 h-8 rounded-full ai-gen-royal-icon-btn"
                aria-label="Edit question" title="Edit">
                <i class="fal fa-pen"></i>
              </button>
              <button data-role="regen-btn" type="button"
                class="w-8 h-8 rounded-full ai-gen-royal-icon-btn"
                aria-label="Regenerate this question" title="Regenerate">
                <i class="fal fa-arrows-rotate"></i>
              </button>
              <button data-role="remove-btn" type="button"
                class="w-8 h-8 rounded-full text-webropol-gray-500 hover:text-webropol-error-600 hover:bg-webropol-error-50 transition-colors"
                aria-label="Remove question" title="Remove">
                <i class="fal fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      this._bind();
      this._applySelectedStyles();
    }

    _renderDetails(q) {
      if (q.options && q.options.length) {
        return `
          <ul class="mt-2 space-y-1">
            ${q.options.map(o => `
              <li class="flex items-center gap-2 text-sm text-webropol-gray-700">
                <i class="fal fa-circle text-[10px] text-webropol-gray-400"></i>${escapeHtml(o)}
              </li>
            `).join('')}
          </ul>`;
      }
      if (q.minLabel || q.maxLabel) {
        return `
          <div class="mt-2 flex items-center gap-2 text-xs text-webropol-gray-600">
            <span class="px-2 py-1 rounded-md bg-webropol-gray-50 border border-webropol-gray-200">${escapeHtml(q.minLabel || q.min)}</span>
            <span class="flex-1 h-1 rounded-full bg-gradient-to-r from-webropol-primary-200 to-webropol-primary-500"></span>
            <span class="px-2 py-1 rounded-md bg-webropol-gray-50 border border-webropol-gray-200">${escapeHtml(q.maxLabel || q.max)}</span>
          </div>`;
      }
      return '';
    }

    _bind() {
      const cb = this.querySelector('[data-role="select"]');
      cb.addEventListener('change', () => {
        this._selected = cb.checked;
        this._applySelectedStyles();
        this.dispatchEvent(new CustomEvent('card-selection-changed', { bubbles: true, detail: { id: this._q.id, selected: cb.checked } }));
      });

      this.querySelector('[data-role="edit-btn"]').addEventListener('click', () => this._enterEdit());
      this.querySelector('[data-role="edit-cancel"]')?.addEventListener('click', () => this._exitEdit());
      this.querySelector('[data-role="edit-save"]')?.addEventListener('click', () => this._saveEdit());

      this.querySelector('[data-role="regen-btn"]').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('card-regenerate', { bubbles: true, detail: { id: this._q.id } }));
      });
      this.querySelector('[data-role="remove-btn"]').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('card-remove', { bubbles: true, detail: { id: this._q.id } }));
      });
    }

    _enterEdit() {
      this.querySelector('[data-role="view"]').classList.add('hidden');
      this.querySelector('[data-role="edit"]').classList.remove('hidden');
      this.querySelector('[data-role="edit-title"]').focus();
    }
    _exitEdit() {
      this.querySelector('[data-role="edit"]').classList.add('hidden');
      this.querySelector('[data-role="view"]').classList.remove('hidden');
    }
    _saveEdit() {
      const title = this.querySelector('[data-role="edit-title"]').value.trim();
      const desc = this.querySelector('[data-role="edit-desc"]').value.trim();
      const optsEl = this.querySelector('[data-role="edit-options"]');
      const options = optsEl ? optsEl.value.split('\n').map(s => s.trim()).filter(Boolean) : this._q.options;
      this._q = { ...this._q, title: title || this._q.title, description: desc, options };
      this.dispatchEvent(new CustomEvent('card-updated', { bubbles: true, detail: { question: this._q } }));
      this.render();
    }
  }
  customElements.define('webropol-ai-generated-card', WebropolAIGeneratedCard);

  // ─────────────────────────────────────────────────────────────────
  // <webropol-ai-generate-modal> — two-step modal
  // ─────────────────────────────────────────────────────────────────
  class WebropolAIGenerateModal extends HTMLElement {
    constructor() {
      super();
      this._open = false;
      this._step = 'input'; // input | loading | preview | error
      this._prompt = '';
      this._count = 5;
      this._tone = 'neutral';
      this._types = [];
      this._typesPickerOpen = false;
      this._typesPickerDraft = null;
      this._questions = [];
      this._selectedIds = new Set();
      this._validationError = '';
      this._errorMessage = '';
      this._simFail = false;
      this._lastFocus = null;
      this._keydownHandler = this._keydownHandler.bind(this);
    }

    connectedCallback() {
      if (this._rendered) return;
      this._rendered = true;
      this.render();
    }

    _countPercent() {
      const min = 1, max = 15;
      return Math.max(0, Math.min(100, ((this._count - min) / (max - min)) * 100));
    }

    _syncCountToTypes() {
      // Slider reflects the number of question types the user has added (clamped 1–15).
      const target = Math.max(1, Math.min(15, this._types.length || 1));
      this._count = target;
      const countEl = this.querySelector('#ai-gen-count');
      const countVal = this.querySelector('[data-role="count-value"]');
      const sliderRoot = this.querySelector('[data-role="slider-root"]');
      if (countEl) {
        countEl.value = String(target);
        countEl.setAttribute('aria-valuenow', String(target));
      }
      if (countVal) countVal.textContent = String(target);
      if (sliderRoot) sliderRoot.style.setProperty('--ai-slider-fill', this._countPercent() + '%');
    }

    open() {
      this._open = true;
      this._step = 'input';
      this._prompt = '';
      this._validationError = '';
      this._errorMessage = '';
      this._questions = [];
      this._selectedIds = new Set();
      this._lastFocus = document.activeElement;
      this.render();
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', this._keydownHandler);
      requestAnimationFrame(() => {
        const ta = this.querySelector('#ai-gen-prompt');
        if (ta) ta.focus();
      });
    }

    close() {
      this._open = false;
      this.render();
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', this._keydownHandler);
      if (this._lastFocus && typeof this._lastFocus.focus === 'function') {
        try { this._lastFocus.focus(); } catch (e) { /* noop */ }
      }
    }

    _keydownHandler(e) {
      if (!this._open) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (this._typesPickerOpen) { this._closeTypesPicker(false); return; }
        this.close();
        return;
      }
      if (e.key === 'Tab') this._trapFocus(e);
    }

    _trapFocus(e) {
      const root = this.querySelector('[data-role="dialog"]');
      if (!root) return;
      const focusables = root.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    render() {
      if (!this._open) { this.innerHTML = ''; return; }

      this.innerHTML = `
        <div class="fixed inset-0 z-[2147483640] flex items-center justify-center p-4"
             data-role="overlay"
             role="presentation">
          <div class="absolute inset-0 bg-webropol-gray-900/60 backdrop-blur-sm" data-role="backdrop"></div>
          <div data-role="dialog"
               role="dialog" aria-modal="true" aria-labelledby="ai-gen-title"
               class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-medium flex flex-col overflow-hidden">
            ${this._renderHeader()}
            <div class="flex-1 overflow-y-auto px-6 py-5" data-role="body">
              ${this._step === 'input' ? this._renderInputStep() : ''}
              ${this._step === 'loading' ? this._renderLoadingStep() : ''}
              ${this._step === 'preview' ? this._renderPreviewStep() : ''}
              ${this._step === 'error' ? this._renderErrorStep() : ''}
            </div>
            ${this._renderFooter()}
          </div>
          ${this._typesPickerOpen ? this._renderTypesPicker() : ''}
        </div>
      `;

      this._bindCommon();
      if (this._step === 'input') this._bindInput();
      if (this._step === 'preview') this._bindPreview();
      if (this._step === 'error') this._bindError();
      if (this._typesPickerOpen) this._bindTypesPicker();
    }

    _renderHeader() {
      const titleByStep = {
        input: 'Generate questions with AI',
        loading: 'Generating…',
        preview: 'Review generated questions',
        error: 'Something went wrong'
      };
      return `
        <div class="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-webropol-gray-100">
          <div class="flex items-center gap-3 min-w-0">
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-2xl ai-gen-royal-grad shadow-soft">
              <i class="fal fa-sparkles"></i>
            </span>
            <div class="min-w-0">
              <h2 id="ai-gen-title" class="text-lg font-semibold text-webropol-gray-900 truncate">${titleByStep[this._step]}</h2>
              <p class="text-xs text-webropol-gray-500">AI-powered survey creation</p>
            </div>
          </div>
          <button data-role="close" type="button"
            class="w-9 h-9 rounded-full text-webropol-gray-500 hover:text-webropol-gray-900 hover:bg-webropol-gray-100 transition-colors"
            aria-label="Close dialog">
            <i class="fal fa-xmark"></i>
          </button>
        </div>
      `;
    }

    _renderInputStep() {
      const selectedChips = this._types.length
        ? this._types.map((val, idx) => {
            const label = QUESTION_TYPE_LABELS[val] || val;
            const icon = QUESTION_TYPE_ICONS[val] || 'fal fa-circle';
            return `
              <span class="inline-flex items-center gap-1.5 pl-1 pr-1 py-1 rounded-full bg-webropol-primary-50 border border-webropol-primary-200 text-webropol-primary-700 text-xs font-medium">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full ai-gen-royal-grad text-[11px] font-semibold" aria-label="Order ${idx + 1}">${idx + 1}</span>
                <i class="${icon} text-[11px]"></i>
                <span>${escapeHtml(label)}</span>
                <button type="button"
                  class="w-5 h-5 inline-flex items-center justify-center rounded-full text-webropol-primary-600 hover:bg-webropol-primary-100"
                  data-role="remove-type" data-value="${val}"
                  aria-label="Remove ${escapeHtml(label)}">
                  <i class="fal fa-xmark text-[10px]"></i>
                </button>
              </span>
            `;
          }).join('')
        : `<span class="text-xs text-webropol-gray-500">No types selected yet. Picking a few helps the AI stay accurate and reduces mistakes.</span>`;

      return `
        <div class="space-y-5">
          <div>
            <label for="ai-gen-prompt" class="flex items-center gap-1.5 text-sm font-semibold text-webropol-gray-900 mb-1.5">
              <span>Describe what you want to measure</span>
              <span class="relative inline-flex group" tabindex="0" aria-label="Tip">
                <i class="fal fa-circle-info text-webropol-gray-400 hover:text-webropol-primary-600 focus:text-webropol-primary-600 cursor-help text-sm"></i>
                <span role="tooltip"
                  class="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 z-20 w-72 px-3 py-2 rounded-xl bg-webropol-gray-900 text-white text-xs font-normal leading-relaxed shadow-medium opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                  Be specific about your goal, audience, and the kind of insight you want. The clearer the prompt, the better the suggestions.
                </span>
              </span>
            </label>
            <textarea id="ai-gen-prompt" rows="4"
              class="w-full rounded-xl border border-webropol-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-webropol-primary-400 focus:border-webropol-primary-400 resize-none"
              placeholder="e.g. Measure customer satisfaction with our onboarding experience, focusing on clarity, speed, and support."
              aria-describedby="ai-gen-prompt-help ai-gen-prompt-error">${escapeHtml(this._prompt)}</textarea>
            <p id="ai-gen-prompt-help" class="mt-1 text-xs text-webropol-gray-500">The clearer the goal, the better the suggestions.</p>
            <p id="ai-gen-prompt-error" class="mt-1 text-xs text-webropol-error-600 ${this._validationError ? '' : 'hidden'}" role="alert">
              ${escapeHtml(this._validationError)}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="ai-gen-count" class="block text-sm font-semibold text-webropol-gray-900 mb-2">
                Number of questions
              </label>
              <div class="ai-gen-slider" data-role="slider-root" style="--ai-slider-fill: ${this._countPercent()}%">
                <div class="ai-gen-slider__row">
                  <span class="ai-gen-slider__edge">1</span>
                  <div class="ai-gen-slider__track-wrap">
                    <span class="ai-gen-slider__cap" aria-hidden="true"></span>
                    <div class="ai-gen-slider__track">
                      <div class="ai-gen-slider__fill"></div>
                    </div>
                    <span class="ai-gen-slider__cap" aria-hidden="true"></span>
                    <input id="ai-gen-count" type="range" min="1" max="15" step="1" value="${this._count}"
                      class="ai-gen-slider__input"
                      aria-label="Number of questions"
                      aria-valuemin="1" aria-valuemax="15" aria-valuenow="${this._count}" />
                    <div class="ai-gen-slider__thumb" aria-hidden="true"></div>
                    <div class="ai-gen-slider__bubble" data-role="count-value" aria-hidden="true">${this._count}</div>
                  </div>
                  <span class="ai-gen-slider__edge">15</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-webropol-gray-900 mb-1.5">Audience / tone</label>
              <webropol-dropdown
                data-role="tone"
                size="large"
                value="${this._tone}"
                options='[{"label":"Neutral","value":"neutral","icon":"fa-circle"},{"label":"Friendly","value":"friendly","icon":"fa-face-smile"},{"label":"Formal","value":"formal","icon":"fa-user-tie"}]'>
              </webropol-dropdown>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="block text-sm font-semibold text-webropol-gray-900">Include question types</span>
              <button type="button" data-role="open-types-picker"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-transparent text-[#1e6880] border border-transparent hover:[background-color:#eefbfd] hover:text-[#215669] active:[background-color:#b0e8f1] focus:ring-2 focus:ring-[#1e6880] focus:ring-offset-2 focus:outline-none transition-colors">
                <i class="fal fa-plus"></i> Add types
              </button>
            </div>
            <p class="text-xs text-webropol-gray-500 mb-2">Selecting question types helps the AI stay focused and reduces mistakes.</p>
            <div class="flex flex-wrap gap-2 min-h-[32px]" data-role="type-chips" aria-live="polite">
              ${selectedChips}
            </div>
          </div>
        </div>
      `;
    }

    _refreshTypeChips() {
      const host = this.querySelector('[data-role="type-chips"]');
      if (!host) return;
      host.innerHTML = this._types.length
        ? this._types.map((val, idx) => {
            const label = QUESTION_TYPE_LABELS[val] || val;
            const icon = QUESTION_TYPE_ICONS[val] || 'fal fa-circle';
            return `
              <span class="inline-flex items-center gap-1.5 pl-1 pr-1 py-1 rounded-full bg-webropol-primary-50 border border-webropol-primary-200 text-webropol-primary-700 text-xs font-medium">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full ai-gen-royal-grad text-[11px] font-semibold" aria-label="Order ${idx + 1}">${idx + 1}</span>
                <i class="${icon} text-[11px]"></i>
                <span>${escapeHtml(label)}</span>
                <button type="button"
                  class="w-5 h-5 inline-flex items-center justify-center rounded-full text-webropol-primary-600 hover:bg-webropol-primary-100"
                  data-role="remove-type" data-value="${val}"
                  aria-label="Remove ${escapeHtml(label)}">
                  <i class="fal fa-xmark text-[10px]"></i>
                </button>
              </span>
            `;
          }).join('')
        : `<span class="text-xs text-webropol-gray-500">No types selected yet. Picking a few helps the AI stay accurate and reduces mistakes.</span>`;

      host.querySelectorAll('[data-role="remove-type"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.value;
          this._types = this._types.filter(t => t !== val);
          this._refreshTypeChips();
          this._syncCountToTypes();
        });
      });
    }

    _openTypesPicker() {
      // Ordered draft array — the order in which types were checked drives the order badge.
      this._typesPickerDraft = [...this._types];
      this._typesPickerSearch = '';
      this._typesPickerOpen = true;
      this.render();
    }

    _closeTypesPicker(commit) {
      if (commit && Array.isArray(this._typesPickerDraft)) {
        this._types = [...this._typesPickerDraft];
        // Slider counts the questions the user added.
        this._count = Math.max(1, Math.min(15, this._types.length || 1));
      }
      this._typesPickerOpen = false;
      this._typesPickerDraft = null;
      this._typesPickerSearch = '';
      this.render();
    }

    _renderTypesPicker() {
      const draft = Array.isArray(this._typesPickerDraft) ? this._typesPickerDraft : [...this._types];
      const search = (this._typesPickerSearch || '').toLowerCase();
      const draftIndex = (val) => draft.indexOf(val);

      const renderCard = (val, color) => {
        const label = QUESTION_TYPE_LABELS[val] || val;
        const icon = QUESTION_TYPE_ICONS[val] || 'fal fa-circle';
        const description = QUESTION_TYPE_DESCRIPTIONS[val] || label;
        const order = draftIndex(val);
        const checked = order !== -1;
        const matches = !search || label.toLowerCase().includes(search);
        return `
          <button type="button"
            data-role="picker-card" data-value="${val}" data-color="${color}"
            class="group relative flex items-center justify-between gap-2 p-2 w-full text-left transition-all border rounded-lg cursor-pointer ${checked ? `bg-${color}-50 border-${color}-300 ring-1 ring-${color}-300` : `bg-white border-transparent hover:bg-${color}-50 hover:border-${color}-100`} ${matches ? '' : 'hidden'}"
            aria-pressed="${checked}">
            <span class="flex items-center gap-2 min-w-0">
              <span data-role="picker-badge"
                class="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold ${checked ? 'ai-gen-royal-grad' : 'bg-webropol-gray-100 text-webropol-gray-400'}">
                ${checked ? (order + 1) : '<i class="fal fa-plus text-[10px]"></i>'}
              </span>
              <span class="flex items-center justify-center w-8 h-8 text-sm text-${color}-600 bg-${color}-100 rounded-md">
                <i class="${icon}"></i>
              </span>
              <span class="text-sm font-medium text-webropol-gray-700 group-hover:text-webropol-gray-900 truncate">${escapeHtml(label)}</span>
            </span>
            <webropol-tooltip text="${escapeHtml(description)}" position="top" max-width="14rem" data-role="picker-info" data-value="${val}" class="shrink-0">
              <span aria-label="More info about ${escapeHtml(label)}"
                class="inline-flex items-center justify-center w-4 h-4 rounded-full text-webropol-gray-400 text-[10px] hover:text-webropol-primary-600 transition-colors">
                <i class="fal fa-info-circle"></i>
              </span>
            </webropol-tooltip>
          </button>
        `;
      };

      const renderGroup = (group, extraClass = '') => `
        <div class="${extraClass}">
          <h4 class="mb-3 text-base font-bold text-webropol-gray-900">${escapeHtml(group.title)}</h4>
          <div class="space-y-2">
            ${group.types.map(t => renderCard(t, group.color)).join('')}
          </div>
        </div>
      `;

      const otherGroup = QUESTION_TYPE_GROUPS.find(g => g.title === 'Other');
      const topGroups = QUESTION_TYPE_GROUPS.filter(g => ['Text', 'Selection', 'Matrix'].includes(g.title));
      const expGroup = QUESTION_TYPE_GROUPS.find(g => g.title === 'Experience & Loyalty');

      const otherGrid = otherGroup ? `
        <div class="col-span-2">
          <h4 class="mb-3 text-base font-bold text-webropol-gray-900">${otherGroup.title}</h4>
          <div class="grid grid-cols-2 gap-x-6 gap-y-2">
            ${otherGroup.types.map(t => renderCard(t, otherGroup.color)).join('')}
          </div>
        </div>
      ` : '';

      const selectedCount = draft.length;

      return `
        <div class="absolute inset-0 z-[2147483645] flex items-center justify-center p-4"
             data-role="picker-overlay" role="presentation">
          <div class="absolute inset-0 bg-webropol-gray-900/60 backdrop-blur-sm" data-role="picker-backdrop"></div>
          <div role="dialog" aria-modal="true" aria-labelledby="ai-gen-picker-title"
               class="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-3xl shadow-medium flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between gap-4 px-6 py-4 border-b border-webropol-gray-100">
              <div class="flex items-center gap-3">
                <span class="flex items-center justify-center w-10 h-10 rounded-2xl ai-gen-royal-grad shadow-soft">
                  <i class="fal fa-list-check"></i>
                </span>
                <div>
                  <h3 id="ai-gen-picker-title" class="text-lg font-semibold text-webropol-gray-900">Select question types</h3>
                  <p class="text-xs text-webropol-gray-500">Numbers show the order they will appear in the survey.</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="relative w-56">
                  <i class="absolute text-webropol-gray-400 transform -translate-y-1/2 fal fa-search left-3 top-1/2 text-sm"></i>
                  <input type="text" data-role="picker-search" value="${escapeHtml(this._typesPickerSearch || '')}"
                    class="w-full py-2 pl-10 pr-3 text-sm text-webropol-gray-700 bg-webropol-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-webropol-primary-500 focus:ring-0 outline-none transition-colors"
                    placeholder="Search question types" />
                </div>
                <button type="button" data-role="picker-cancel"
                  class="flex items-center justify-center w-8 h-8 text-webropol-gray-400 transition-colors rounded-full hover:bg-webropol-gray-100 hover:text-webropol-gray-600"
                  aria-label="Close">
                  <i class="fal fa-xmark text-lg"></i>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto flex-1">
              <div class="space-y-6">
                <div class="grid grid-cols-3 gap-6">
                  ${topGroups.map(g => renderGroup(g)).join('')}
                </div>
                <div class="grid grid-cols-3 gap-6">
                  ${expGroup ? renderGroup(expGroup) : ''}
                  ${otherGrid}
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-2 px-6 py-3 border-t border-webropol-gray-100 bg-webropol-gray-50">
              <span class="text-xs text-webropol-gray-600" data-role="picker-count">
                ${selectedCount} selected
              </span>
              <div class="flex items-center gap-2">
                <button type="button" data-role="picker-cancel"
                  class="px-4 py-2 rounded-full bg-white border border-webropol-gray-200 text-webropol-gray-700 text-sm font-semibold hover:bg-webropol-gray-50">
                  Cancel
                </button>
                <button type="button" data-role="picker-save"
                  class="px-5 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 ai-gen-royal-grad ai-gen-royal-ring">
                  <i class="fal fa-check"></i>Add selected
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    _bindTypesPicker() {
      const backdrop = this.querySelector('[data-role="picker-backdrop"]');
      backdrop?.addEventListener('click', () => this._closeTypesPicker(false));
      this.querySelectorAll('[data-role="picker-cancel"]').forEach(btn => {
        btn.addEventListener('click', () => this._closeTypesPicker(false));
      });
      this.querySelector('[data-role="picker-save"]')?.addEventListener('click', () => {
        this._closeTypesPicker(true);
      });

      // Search
      const search = this.querySelector('[data-role="picker-search"]');
      if (search) {
        search.addEventListener('input', (e) => {
          this._typesPickerSearch = e.target.value || '';
          const q = this._typesPickerSearch.toLowerCase();
          this.querySelectorAll('[data-role="picker-card"]').forEach(card => {
            const label = card.querySelector('span span:last-child')?.textContent?.toLowerCase() || '';
            card.classList.toggle('hidden', !!q && !label.includes(q));
          });
        });
      }

      // Info button: don't toggle selection when clicked
      this.querySelectorAll('[data-role="picker-info"]').forEach(info => {
        info.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        info.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
        });
      });

      // Card toggle (multi-select with ordered draft)
      this.querySelectorAll('[data-role="picker-card"]').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('[data-role="picker-info"]')) return;
          if (!Array.isArray(this._typesPickerDraft)) {
            this._typesPickerDraft = [...this._types];
          }
          const val = card.dataset.value;
          const idx = this._typesPickerDraft.indexOf(val);
          if (idx === -1) this._typesPickerDraft.push(val);
          else this._typesPickerDraft.splice(idx, 1);
          this._refreshPickerCards();
        });
      });
    }

    _refreshPickerCards() {
      const draft = Array.isArray(this._typesPickerDraft) ? this._typesPickerDraft : [];
      this.querySelectorAll('[data-role="picker-card"]').forEach(card => {
        const val = card.dataset.value;
        const color = card.dataset.color || 'primary';
        const order = draft.indexOf(val);
        const checked = order !== -1;
        card.setAttribute('aria-pressed', String(checked));
        // Toggle selected/unselected card classes
        card.classList.toggle(`bg-${color}-50`, checked);
        card.classList.toggle(`border-${color}-300`, checked);
        card.classList.toggle(`ring-1`, checked);
        card.classList.toggle(`ring-${color}-300`, checked);
        card.classList.toggle('bg-white', !checked);
        card.classList.toggle('border-transparent', !checked);
        card.classList.toggle(`hover:bg-${color}-50`, !checked);
        card.classList.toggle(`hover:border-${color}-100`, !checked);
        // Badge
        const badge = card.querySelector('[data-role="picker-badge"]');
        if (badge) {
          badge.classList.toggle('ai-gen-royal-grad', checked);
          badge.classList.toggle('bg-webropol-gray-100', !checked);
          badge.classList.toggle('text-webropol-gray-400', !checked);
          badge.innerHTML = checked ? String(order + 1) : '<i class="fal fa-plus text-[10px]"></i>';
        }
      });
      const count = this.querySelector('[data-role="picker-count"]');
      if (count) count.textContent = `${draft.length} selected`;
    }

    _renderLoadingStep() {
      return `
        <div class="py-12 flex flex-col items-center justify-center text-center gap-4" aria-busy="true" aria-live="polite">
          <div class="relative w-14 h-14">
            <div class="absolute inset-0 rounded-full border-4 ai-gen-spinner-track"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent ai-gen-spinner-head animate-spin"></div>
            <i class="fal fa-sparkles absolute inset-0 m-auto ai-gen-royal-text w-5 h-5 flex items-center justify-center"></i>
          </div>
          <div>
            <p class="text-base font-semibold text-webropol-gray-900">Drafting your questions…</p>
            <p class="text-sm text-webropol-gray-500 mt-1">Matching tone, types, and goal.</p>
          </div>
        </div>
      `;
    }

    _renderPreviewStep() {
      if (!this._questions.length) {
        return `<div class="py-12 text-center text-sm text-webropol-gray-500">No questions were generated.</div>`;
      }
      const selectedCount = this._selectedIds.size;
      return `
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-webropol-gray-700">
              <span class="font-semibold text-webropol-gray-900">${this._questions.length}</span>
              question${this._questions.length === 1 ? '' : 's'} generated
              ${selectedCount ? `· <span class="text-webropol-primary-700 font-semibold">${selectedCount}</span> selected` : ''}
            </p>
            <div class="flex items-center gap-2">
              <button data-role="select-all" type="button"
                class="text-xs font-semibold ai-gen-royal-text hover:underline">
                ${selectedCount === this._questions.length ? 'Clear selection' : 'Select all'}
              </button>
              <button data-role="back" type="button"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-webropol-gray-600 hover:text-webropol-gray-900">
                <i class="fal fa-arrow-left"></i>Edit prompt
              </button>
            </div>
          </div>
          <div data-role="cards" class="space-y-3"></div>
        </div>
      `;
    }

    _renderErrorStep() {
      return `
        <div class="py-10 flex flex-col items-center text-center gap-4" role="alert">
          <div class="w-14 h-14 rounded-full bg-webropol-error-50 text-webropol-error-600 flex items-center justify-center">
            <i class="fal fa-triangle-exclamation text-2xl"></i>
          </div>
          <div>
            <p class="text-base font-semibold text-webropol-gray-900">We couldn't generate questions</p>
            <p class="text-sm text-webropol-gray-500 mt-1">${escapeHtml(this._errorMessage || 'The AI service is temporarily unavailable.')}</p>
          </div>
          <button data-role="retry" type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full ai-gen-royal-grad text-sm font-semibold ai-gen-royal-ring">
            <i class="fal fa-rotate"></i>Try again
          </button>
        </div>
      `;
    }

    _renderFooter() {
      if (this._step === 'loading') {
        return `
          <div class="px-6 py-4 border-t border-webropol-gray-100 flex items-center justify-end gap-2">
            <button disabled class="px-4 py-2 rounded-full bg-webropol-gray-100 text-webropol-gray-400 text-sm font-semibold cursor-not-allowed">Cancel</button>
            <button disabled class="px-5 py-2 rounded-full ai-gen-royal-grad text-sm font-semibold cursor-not-allowed inline-flex items-center gap-2">
              <i class="fal fa-spinner fa-spin"></i>Generating…
            </button>
          </div>
        `;
      }
      if (this._step === 'preview') {
        const selectedCount = this._selectedIds.size;
        return `
          <div class="px-6 py-4 border-t border-webropol-gray-100 flex flex-wrap items-center justify-between gap-3">
            <button data-role="cancel" type="button"
              class="px-4 py-2 rounded-full bg-white border border-webropol-gray-200 text-webropol-gray-700 text-sm font-semibold hover:bg-webropol-gray-50">
              Cancel
            </button>
            <div class="flex items-center gap-2">
              <button data-role="insert-selected" type="button"
                class="px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${selectedCount ? 'ai-gen-royal-border-soft ai-gen-royal-text ai-gen-royal-bg-soft-hover' : 'border-webropol-gray-200 text-webropol-gray-400 cursor-not-allowed'}"
                ${selectedCount ? '' : 'disabled'}>
                Insert selected${selectedCount ? ` (${selectedCount})` : ''}
              </button>
              <button data-role="insert-all" type="button"
                class="px-5 py-2 rounded-full ai-gen-royal-grad text-sm font-semibold inline-flex items-center gap-2 ai-gen-royal-ring">
                <i class="fal fa-circle-plus"></i>Insert all
              </button>
            </div>
          </div>
        `;
      }
      if (this._step === 'error') {
        return `
          <div class="px-6 py-4 border-t border-webropol-gray-100 flex items-center justify-end">
            <button data-role="cancel" type="button"
              class="px-4 py-2 rounded-full bg-white border border-webropol-gray-200 text-webropol-gray-700 text-sm font-semibold hover:bg-webropol-gray-50">
              Close
            </button>
          </div>
        `;
      }
      // input step
      const disabled = !this._prompt.trim();
      return `
        <div class="px-6 py-4 border-t border-webropol-gray-100 flex items-center justify-between gap-3">
          <label class="inline-flex items-center gap-2 text-xs text-webropol-gray-500 select-none cursor-pointer">
            <input data-role="sim-fail" type="checkbox"
              class="h-3.5 w-3.5 rounded border-webropol-gray-300"
              ${this._simFail ? 'checked' : ''} />
            <span>Simulate failure</span>
          </label>
          <div class="flex items-center gap-2">
            <button data-role="cancel" type="button"
              class="px-4 py-2 rounded-full bg-white border border-webropol-gray-200 text-webropol-gray-700 text-sm font-semibold hover:bg-webropol-gray-50">
              Cancel
            </button>
            <button data-role="generate" type="button"
              class="px-5 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 ai-gen-royal-grad ai-gen-royal-ring"
              ${disabled ? 'disabled aria-disabled="true"' : ''}>
              <i class="fal fa-sparkles"></i>Generate
            </button>
          </div>
        </div>
      `;
    }

    _bindCommon() {
      this.querySelector('[data-role="close"]')?.addEventListener('click', () => this.close());
      this.querySelector('[data-role="backdrop"]')?.addEventListener('click', () => this.close());
      this.querySelector('[data-role="cancel"]')?.addEventListener('click', () => this.close());
    }

    _bindInput() {
      const ta = this.querySelector('#ai-gen-prompt');
      const genBtn = this.querySelector('[data-role="generate"]');
      const errEl = this.querySelector('#ai-gen-prompt-error');

      const syncGenerate = () => {
        const disabled = !this._prompt.trim();
        genBtn.disabled = disabled;
        // ai-gen-royal-grad already styles disabled state via :disabled.
      };

      ta.addEventListener('input', () => {
        this._prompt = ta.value;
        if (this._prompt.trim() && this._validationError) {
          this._validationError = '';
          errEl.classList.add('hidden');
        }
        syncGenerate();
      });

      const countEl = this.querySelector('#ai-gen-count');
      const countVal = this.querySelector('[data-role="count-value"]');
      const sliderRoot = this.querySelector('[data-role="slider-root"]');
      countEl.addEventListener('input', () => {
        this._count = parseInt(countEl.value, 10) || 5;
        countVal.textContent = this._count;
        countEl.setAttribute('aria-valuenow', String(this._count));
        if (sliderRoot) sliderRoot.style.setProperty('--ai-slider-fill', this._countPercent() + '%');
      });

      this.querySelector('[data-role="sim-fail"]')?.addEventListener('change', (e) => {
        this._simFail = !!e.target.checked;
      });

      this.querySelector('[data-role="tone"]')?.addEventListener('change', (e) => {
        this._tone = e.detail?.value ?? this._tone;
      });

      this.querySelectorAll('[data-role="remove-type"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.value;
          this._types = this._types.filter(t => t !== val);
          this._refreshTypeChips();
          this._syncCountToTypes();
        });
      });

      this.querySelector('[data-role="open-types-picker"]')?.addEventListener('click', () => {
        this._openTypesPicker();
      });

      genBtn.addEventListener('click', () => {
        if (!this._prompt.trim()) {
          this._validationError = 'Please describe what you want to measure.';
          errEl.textContent = this._validationError;
          errEl.classList.remove('hidden');
          ta.focus();
          return;
        }
        const simFail = this.querySelector('[data-role="sim-fail"]')?.checked;
        this._simFail = !!simFail;
        this._runGeneration(simFail);
      });
    }

    _bindPreview() {
      const cardsHost = this.querySelector('[data-role="cards"]');
      cardsHost.innerHTML = '';
      this._questions.forEach(q => {
        const card = document.createElement('webropol-ai-generated-card');
        card.question = q;
        card.selected = this._selectedIds.has(q.id);
        cardsHost.appendChild(card);
      });

      cardsHost.addEventListener('card-selection-changed', (e) => {
        const { id, selected } = e.detail;
        if (selected) this._selectedIds.add(id); else this._selectedIds.delete(id);
        this._refreshPreviewChrome();
      });

      cardsHost.addEventListener('card-updated', (e) => {
        const idx = this._questions.findIndex(q => q.id === e.detail.question.id);
        if (idx >= 0) this._questions[idx] = e.detail.question;
      });

      cardsHost.addEventListener('card-regenerate', (e) => {
        const idx = this._questions.findIndex(q => q.id === e.detail.id);
        if (idx < 0) return;
        // [API-INTEGRATION] real call: POST /ai/regenerate
        const fresh = regenerateMockQuestion(this._questions[idx]);
        this._questions[idx] = fresh;
        this._selectedIds.delete(e.detail.id);
        const oldCard = cardsHost.children[idx];
        const newCard = document.createElement('webropol-ai-generated-card');
        newCard.question = fresh;
        cardsHost.replaceChild(newCard, oldCard);
        this._refreshPreviewChrome();
      });

      cardsHost.addEventListener('card-remove', (e) => {
        const idx = this._questions.findIndex(q => q.id === e.detail.id);
        if (idx < 0) return;
        this._questions.splice(idx, 1);
        this._selectedIds.delete(e.detail.id);
        this.render();
        this._bindPreview();
      });

      this.querySelector('[data-role="select-all"]').addEventListener('click', () => {
        if (this._selectedIds.size === this._questions.length) this._selectedIds.clear();
        else this._questions.forEach(q => this._selectedIds.add(q.id));
        this.render();
        this._bindPreview();
      });

      this.querySelector('[data-role="back"]').addEventListener('click', () => {
        this._step = 'input';
        this.render();
      });

      this.querySelector('[data-role="insert-all"]').addEventListener('click', () => {
        insertGeneratedQuestions(this._questions.slice());
        this.close();
      });

      this.querySelector('[data-role="insert-selected"]').addEventListener('click', (e) => {
        if (e.currentTarget.disabled) return;
        const selected = this._questions.filter(q => this._selectedIds.has(q.id));
        if (!selected.length) return;
        insertGeneratedQuestions(selected);
        this.close();
      });
    }

    _refreshPreviewChrome() {
      // Light-touch refresh of counts + footer button state without re-rendering cards.
      const selectedCount = this._selectedIds.size;
      const insertSel = this.querySelector('[data-role="insert-selected"]');
      if (insertSel) {
        insertSel.disabled = !selectedCount;
        insertSel.textContent = `Insert selected${selectedCount ? ` (${selectedCount})` : ''}`;
        insertSel.classList.toggle('ai-gen-royal-border-soft', !!selectedCount);
        insertSel.classList.toggle('ai-gen-royal-text', !!selectedCount);
        insertSel.classList.toggle('ai-gen-royal-bg-soft-hover', !!selectedCount);
        insertSel.classList.toggle('border-webropol-gray-200', !selectedCount);
        insertSel.classList.toggle('text-webropol-gray-400', !selectedCount);
        insertSel.classList.toggle('cursor-not-allowed', !selectedCount);
      }
      const selAll = this.querySelector('[data-role="select-all"]');
      if (selAll) selAll.textContent = selectedCount === this._questions.length ? 'Clear selection' : 'Select all';
    }

    _bindError() {
      this.querySelector('[data-role="retry"]').addEventListener('click', () => {
        this._step = 'input';
        this._errorMessage = '';
        this.render();
      });
    }

    _runGeneration(simulateFailure) {
      this._step = 'loading';
      this.render();
      // [API-INTEGRATION] Replace setTimeout with a fetch() to your AI backend.
      const delay = 6000;
      setTimeout(() => {
        if (simulateFailure) {
          this._errorMessage = 'Simulated failure. Please try again.';
          this._step = 'error';
          this.render();
          return;
        }
        this._questions = generateMockQuestions(this._prompt, this._count, this._types, this._tone);
        this._selectedIds = new Set();
        this._step = 'preview';
        this.render();
      }, delay);
    }
  }
  customElements.define('webropol-ai-generate-modal', WebropolAIGenerateModal);

  // ─────────────────────────────────────────────────────────────────
  // Public API + auto-mount of singleton modal
  // ─────────────────────────────────────────────────────────────────
  function getOrCreateModal() {
    let m = document.querySelector('webropol-ai-generate-modal[data-singleton]');
    if (!m) {
      m = document.createElement('webropol-ai-generate-modal');
      m.setAttribute('data-singleton', '');
      document.body.appendChild(m);
    }
    return m;
  }

  window.AIQuestionGenerator = {
    open() {
      if (!window.WEBROPOL_AI_GEN_ENABLED) return;
      getOrCreateModal().open();
    },
    close() { getOrCreateModal().close(); },
    insertGeneratedQuestions,
    generateMockQuestions,
    regenerateMockQuestion,
    showToast
  };
})();
