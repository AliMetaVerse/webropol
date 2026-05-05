/**
 * webropol-chart-colours-modal
 * ─────────────────────────────────────────────────────────────────────────────
 * Self-contained modal for "Colours for chart, mean & index" settings.
 * Owns all internal state via Alpine.data('coloursModal', …).
 *
 * USAGE
 *   <webropol-chart-colours-modal></webropol-chart-colours-modal>
 *
 * OPEN (from any Alpine context or plain JS)
 *   Alpine:  $dispatch('webropol:open-chart-colours')
 *   Plain:   window.dispatchEvent(new CustomEvent('webropol:open-chart-colours'))
 *   Simple:  window.dispatchEvent(new CustomEvent('webropol:open-chart-colours-simple'))
 *
 * CLOSE EVENT (emitted when the modal closes)
 *   window 'webropol:chart-colours-closed'
 *   Carries detail: { barColours, activePatterns, averageRows, excludedRows }
 */

// ── Alpine data ───────────────────────────────────────────────────────────────
// Safe registration: works whether Alpine has already initialised (SPA route
// change) or not yet (first page load). We guard against re-registration so
// navigating back to the report page doesn't throw.
function _registerColoursModal() {
  if (!window.Alpine) return; // shouldn't happen, but be safe
  if (Alpine._coloursModalRegistered) return;
  Alpine._coloursModalRegistered = true;
  Alpine.data('coloursModal', () => {

    // Dark theme — vibrant Tailwind-700 hues, white text readable
    const DEFAULT_BAR_COLOURS = [
      '#B91C1C', '#C2410C', '#B45309', '#4D7C0F',
      '#047857', '#0F766E', '#1D4ED8', '#4338CA',
      '#7E22CE', '#BE185D', '#0369A1', '#0E7490'
    ];

    // Light theme — same 12 hues at Tailwind-300 level, black text readable
    const LIGHT_THEME_COLOURS = [
      '#FCA5A5', '#FDBA74', '#FCD34D', '#BEF264',
      '#6EE7B7', '#5EEAD4', '#93C5FD', '#A5B4FC',
      '#D8B4FE', '#F9A8D4', '#7DD3FC', '#67E8F9'
    ];

    const RAG_THEME_COLOURS = [
      '#C03020', '#C03020', '#F08270', '#F08270',
      '#F5A623', '#F5A623', '#F5A623', '#72BF6E',
      '#72BF6E', '#72BF6E', '#2E9648', '#2E9648'
    ];

    return {
      // ── Modal visibility ──────────────────────────────────────────────────
      isOpen: false,
      modalVariant: 'advanced',

      // ── Bar colours state ─────────────────────────────────────────────────
      barTab: 'colours',   // 'colours' | 'accessible-colours'
      barColours: [...DEFAULT_BAR_COLOURS],
      selectedAccessiblePalette: null,
      palettePreviewReversed: false,
      accessiblePaletteReversed: false,
      patternsEnabled: false,
      theme: 'dark',         // 'light' | 'dark' | 'rag' | 'custom'
      showBorder: false,
      copiedIndex: null,    // index of recently copied swatch, null otherwise

      // ── Averages / excluded rows ──────────────────────────────────────────
      indexType: 'mean',   // 'mean' | 'index'
      averageRows: [],
      excludedRows: [],

      // ── Accessible colour palettes ────────────────────────────────────────
      accessiblePalettes: [
        {
          name: 'IBM Colour Blind Safe',
          description: 'IBM Design Language · 12 high-contrast categorical colours',
          reference: 'IBM Design Language — Color (2023)',
          referenceUrl: 'https://www.ibm.com/design/language/color/',
          colours: ['#648FFF','#785EF0','#DC267F','#FE6100','#FFB000','#009D9A','#001141','#005D5D','#8A3FFC','#FA4D56','#08BDBA','#25A249']
        },
        {
          name: 'Webropol RAG',
          description: 'Webropol sentiment scale · always includes red, amber and green with bridging shades · worst to best',
          reference: 'Webropol Design System',
          referenceUrl: '#',
          colours: ['#C03020','#C03020','#F08270','#F08270','#F5A623','#F5A623','#F5A623','#72BF6E','#72BF6E','#72BF6E','#2E9648','#2E9648']
        },
        {
          name: 'Wong (2011)',
          description: 'CVD-safe · 12 colours · gold standard for scientific figures',
          reference: 'Wong, B. — Nature Methods 8, 441 (2011)',
          referenceUrl: 'https://www.nature.com/articles/nmeth.1618',
          colours: ['#000000','#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7','#F4A582','#92C5DE','#4DAC26','#BABABA']
        },
        {
          name: 'Okabe & Ito',
          description: 'Color Universal Design · 12 colours · print & screen safe',
          reference: 'Okabe, M. & Ito, K. — Color Universal Design (2002)',
          referenceUrl: 'https://jfly.uni-koeln.de/color/',
          colours: ['#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7','#999999','#000000','#F4A582','#004949','#009292']
        },
        {
          name: 'Paul Tol Muted',
          description: 'Publication-quality · 12 soft colours · perceptually uniform',
          reference: 'Tol, P. — Colour Schemes, SRON/EPS/TOL/19.09.23 (2023)',
          referenceUrl: 'https://personal.sron.nl/~pault/',
          colours: ['#332288','#117733','#44AA99','#88CCEE','#DDCC77','#CC6677','#AA4499','#882255','#999933','#661100','#BBBBBB','#888888']
        },
        {
          name: 'Tableau Colorblind 10+',
          description: 'Data-viz optimised · 12 colours · WCAG AA contrast compliant',
          reference: 'Tableau Software — Tableau 10 Color Palette (2016)',
          referenceUrl: 'https://www.tableau.com/blog/colors-upgrade-tableau-10-56782',
          colours: ['#4E79A7','#F28E2B','#E15759','#76B7B2','#59A14F','#EDC948','#B07AA1','#FF9DA7','#9C755F','#BAB0AC','#499894','#86BCB6']
        }
      ],

      // ── Accessible patterns (Highcharts default-pattern-0 … -9) ──────────
      accessiblePatterns: [
        { patternId: 'hc-pat-0', label: 'Diagonal /',    colour: '#4361EE', active: false },
        { patternId: 'hc-pat-1', label: 'Diagonal \\',   colour: '#F72585', active: false },
        { patternId: 'hc-pat-2', label: 'Horizontal',    colour: '#4CC9F0', active: false },
        { patternId: 'hc-pat-3', label: 'Zigzag',        colour: '#7209B7', active: false },
        { patternId: 'hc-pat-4', label: 'Vert. bars',    colour: '#3A0CA3', active: false },
        { patternId: 'hc-pat-5', label: 'Horiz. bars',   colour: '#F77F00', active: false },
        { patternId: 'hc-pat-6', label: 'Squares',       colour: '#06D6A0', active: false },
        { patternId: 'hc-pat-7', label: 'Circles',       colour: '#EF476F', active: false },
        { patternId: 'hc-pat-8', label: 'Filled dots',   colour: '#118AB2', active: false },
        { patternId: 'hc-pat-9', label: 'Steps',         colour: '#FFD166', active: false }
      ],

      // ── Lifecycle ─────────────────────────────────────────────────────────
      init() {
        this._openHandler = () => this.openModal('advanced');
        this._openSimpleHandler = () => this.openModal('simple');
        this._selectAccessiblePaletteHandler = (event) => {
          const paletteName = event.detail?.paletteName;
          if (paletteName) {
            this.palettePreviewReversed = !!event.detail?.reversed;
            this.applyAccessiblePaletteByName(
              paletteName,
              false,
              event.detail?.reversed ?? this.accessiblePaletteReversed
            );
          }
        };
        window.addEventListener('webropol:open-chart-colours', this._openHandler);
        window.addEventListener('webropol:open-chart-colours-simple', this._openSimpleHandler);
        window.addEventListener('webropol:select-accessible-palette', this._selectAccessiblePaletteHandler);
      },

      destroy() {
        if (this._openHandler) {
          window.removeEventListener('webropol:open-chart-colours', this._openHandler);
        }
        if (this._openSimpleHandler) {
          window.removeEventListener('webropol:open-chart-colours-simple', this._openSimpleHandler);
        }
        if (this._selectAccessiblePaletteHandler) {
          window.removeEventListener('webropol:select-accessible-palette', this._selectAccessiblePaletteHandler);
        }
      },

      // ── Actions ───────────────────────────────────────────────────────────
      openModal(variant = 'advanced') {
        this.modalVariant = variant;
        this.isOpen = true;
        document.body.classList.add('modal-open');
      },

      close() {
        this.isOpen = false;
        document.body.classList.remove('modal-open');
        window.dispatchEvent(new CustomEvent('webropol:chart-colours-closed', {
          detail: {
            barColours:     [...this.barColours],
            activePatterns: this.getActivePatternIds(),
            accessiblePaletteName: this.selectedAccessiblePalette,
            accessiblePaletteReversed: this.accessiblePaletteReversed,
            averageRows:    [...this.averageRows],
            excludedRows:   [...this.excludedRows],
            showBorder:     this.showBorder
          }
        }));
      },

      save() {
        this.close();
      },

      createAverageRule() {
        return {
          fontColour: '#0F172A',
          bgColour: '#E6F8FB',
          minValue: '',
          maxValue: '',
          title: ''
        };
      },

      createExcludedRule() {
        return {
          fontColour: '#0F172A',
          bgColour: '#FFF4EA',
          minValue: '',
          maxValue: '',
          title: ''
        };
      },

      addAverageRow() {
        this.averageRows = [...this.averageRows, this.createAverageRule()];
      },

      addExcludedRow() {
        this.excludedRows = [...this.excludedRows, this.createExcludedRule()];
      },

      resetBarColours() {
        this.barColours = [...DEFAULT_BAR_COLOURS];
        this.selectedAccessiblePalette = null;
        this.palettePreviewReversed = false;
        this.accessiblePaletteReversed = false;
        this.theme = 'dark';
        this.showBorder = false;
        this.syncPatternColoursWithBarColours();
      },

      getTextColourForSwatch(colour) {
        // Compute relative luminance to choose black or white text
        const hex = colour.replace('#', '');
        if (hex.length !== 6) return '#ffffff';
        const toLinear = c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
        const r = toLinear(parseInt(hex.substring(0, 2), 16));
        const g = toLinear(parseInt(hex.substring(2, 4), 16));
        const b = toLinear(parseInt(hex.substring(4, 6), 16));
        const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return L > 0.179 ? '#000000' : '#ffffff';
      },

      applyTheme(name) {
        this.theme = name;
        if (name === 'dark') {
          this.barColours = [...DEFAULT_BAR_COLOURS];
        } else if (name === 'light') {
          this.barColours = [...LIGHT_THEME_COLOURS];
        } else if (name === 'rag') {
          this.barColours = [...RAG_THEME_COLOURS];
        }
        // 'custom' preserves whatever the user has manually set
        this.selectedAccessiblePalette = null;
        this.syncPatternColoursWithBarColours();
      },

      resetAll() {
        this.barTab = 'colours';
        this.barColours = [...DEFAULT_BAR_COLOURS];
        this.selectedAccessiblePalette = null;
        this.palettePreviewReversed = false;
        this.accessiblePaletteReversed = false;
        this.patternsEnabled = false;
        this.theme = 'dark';
        this.showBorder = false;
        this.indexType = 'mean';
        this.averageRows = [];
        this.excludedRows = [];
        this.accessiblePatterns = this.accessiblePatterns.map((pattern, index) => ({
          ...pattern,
          active: false,
          colour: DEFAULT_BAR_COLOURS[index % DEFAULT_BAR_COLOURS.length]
        }));
      },

      setBarColour(index, val) {
        if (!/^#[0-9a-fA-F]{6}$/.test(val)) return;
        this.barColours[index] = val;
        this.syncPatternColoursWithBarColours();
      },

      copyHex(index) {
        const hex = this.barColours[index];
        if (navigator.clipboard) {
          navigator.clipboard.writeText(hex).catch(() => {});
        } else {
          // Fallback for non-secure contexts
          const el = document.createElement('textarea');
          el.value = hex;
          el.style.position = 'fixed';
          el.style.opacity = '0';
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
        }
        this.copiedIndex = index;
        setTimeout(() => { if (this.copiedIndex === index) this.copiedIndex = null; }, 1500);
      },

      applyAccessiblePalette(palette) {
        this.applyAccessiblePaletteByName(palette.name, false, this.palettePreviewReversed);
      },

      toggleSelectedPaletteReverse(paletteName) {
        const isSelectedPalette = this.selectedAccessiblePalette === paletteName;
        const nextReversed = isSelectedPalette ? !this.accessiblePaletteReversed : true;
        this.applyAccessiblePaletteByName(paletteName, false, nextReversed);
      },

      getOrderedPaletteColours(palette, reversed = this.palettePreviewReversed) {
        const colours = [...palette.colours];
        return reversed ? colours.reverse() : colours;
      },

      getPalettePreviewColours(palette) {
        const isSelectedPalette = this.selectedAccessiblePalette === palette.name;
        const reversed = isSelectedPalette
          ? this.accessiblePaletteReversed
          : this.palettePreviewReversed;

        return this.getOrderedPaletteColours(palette, reversed);
      },

      applyAccessiblePaletteByName(paletteName, switchTab = true, reversed = this.accessiblePaletteReversed) {
        const palette = this.accessiblePalettes.find(item => item.name === paletteName);
        if (!palette) return;

        this.selectedAccessiblePalette = palette.name;
        this.accessiblePaletteReversed = reversed;
        if (switchTab) {
          this.barTab = 'colours';
        }
        this.getOrderedPaletteColours(palette, reversed).forEach((c, i) => {
          if (i < this.barColours.length) this.barColours[i] = c;
        });
        this.syncPatternColoursWithBarColours();
      },

      toggleAccessiblePaletteReverse() {
        this.palettePreviewReversed = !this.palettePreviewReversed;
        if (this.selectedAccessiblePalette) {
          this.applyAccessiblePaletteByName(this.selectedAccessiblePalette, false, this.palettePreviewReversed);
        }
      },

      getActivePatternIds() {
        return this.accessiblePatterns.filter((pattern) => pattern.active).map((pattern) => pattern.patternId);
      },

      setPatternsEnabled(isEnabled) {
        this.patternsEnabled = isEnabled;
        this.accessiblePatterns = this.accessiblePatterns.map((pattern) => ({
          ...pattern,
          active: isEnabled
        }));
      },

      syncPatternColoursWithBarColours() {
        this.accessiblePatterns = this.accessiblePatterns.map((pattern, index) => ({
          ...pattern,
          colour: this.barColours[index % this.barColours.length]
        }));
      }
    };
  });
}

// Boot: if Alpine already exists (SPA re-navigation), register now.
// Otherwise wait for alpine:init (first page load).
if (window.Alpine) {
  _registerColoursModal();
} else {
  document.addEventListener('alpine:init', _registerColoursModal);
}

// ── Web Component ─────────────────────────────────────────────────────────────
class WebropolChartColoursModal extends HTMLElement {
  connectedCallback() {
    const existingGlobalModal = document.body.querySelector('webropol-chart-colours-modal[data-global-chart-colours-modal="true"]');
    if (existingGlobalModal && existingGlobalModal !== this) {
      this.remove();
      return;
    }

    this.setAttribute('data-global-chart-colours-modal', 'true');

    if (this.parentElement !== document.body) {
      document.body.appendChild(this);
      return;
    }

    if (this.dataset.chartColoursModalMounted === 'true') {
      return;
    }

    this.dataset.chartColoursModalMounted = 'true';
    this.innerHTML = WebropolChartColoursModal._template();
    // If Alpine is already initialised (e.g. component added dynamically), init the subtree.
    if (window.Alpine && window.Alpine.initTree) {
      window.Alpine.initTree(this);
    }
  }

  /** @returns {string} Full modal HTML with Alpine directives */
  static _template() {
    return /* html */`
<div x-data="coloursModal()"
     x-cloak
     :class="{ 'active': isOpen }"
     @click.self="close()"
     @keydown.window.escape="if (isOpen) close()"
     class="modal-overlay"
     style="z-index: 2147483640 !important;"
     role="dialog"
     aria-modal="true"
     aria-labelledby="coloursModalTitle">

  <div class="modal-content" :style="modalVariant === 'simple' ? 'max-width:620px;' : 'max-width:780px;'">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <div class="modal-header">
      <div class="modal-title-section">
        <div class="modal-title" id="coloursModalTitle">
          <span class="inline-flex w-9 h-9 rounded-lg bg-cyan-50 items-center justify-center text-cyan-600">
            <i class="fa-light fa-circles-overlap-3 text-lg"></i>
          </span>
          <span x-text="modalVariant === 'simple' ? 'Colours for chart, mean &amp; index [simple]' : 'Colours for chart, mean &amp; index'"></span>
        </div>
        <p x-show="modalVariant === 'simple'"
           class="mt-2 text-sm text-webropol-gray-500 pl-[3.25rem]">
          Compact setup for bar colours and mean or index thresholds.
        </p>
      </div>
      <button class="modal-close" aria-label="Close" @click="close()">
        <i class="fal fa-times"></i>
      </button>
    </div>

    <!-- ── Body ───────────────────────────────────────────────────────── -->
    <div class="modal-body overflow-y-auto" style="max-height:calc(90vh - 130px);">

      <div x-show="modalVariant === 'simple'" x-transition.opacity>

        <!-- ── BAR COLOURS ── -->
        <div class="mb-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-webropol-gray-900">Bar colours</h3>
            <button @click="resetBarColours()"
                    class="inline-flex items-center gap-1.5 rounded-full border border-rose-300 px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 transition-colors">
              <i class="fal fa-undo text-[10px]"></i> Reset bar colour to default
            </button>
          </div>
          <div class="grid grid-cols-6 gap-x-2 gap-y-3">
            <template x-for="(colour, index) in barColours" :key="'sc-' + index">
              <div class="flex flex-col items-center gap-1.5">
                <span class="text-[10px] text-webropol-gray-500" x-text="'Option ' + (index + 1)"></span>

                <!-- Swatch -->
                <div class="relative">
                  <button type="button"
                          class="w-10 h-10 rounded-xl hover:scale-110 transition-all flex items-center justify-center font-semibold text-sm shadow-sm"
                          :style="'background:' + colour + '; color:' + getTextColourForSwatch(colour) + (showBorder ? '; box-shadow: 0 0 0 2px #fff, 0 0 0 4px ' + colour : '')"
                          :class="showBorder ? 'ring-0' : 'ring-1 ring-webropol-gray-200'"
                          @click="$el.nextElementSibling.click()">T</button>
                  <input type="color" :value="colour" @input="setBarColour(index, $event.target.value)" class="sr-only" tabindex="-1">
                </div>

                <!-- Hex input + copy -->
                <div class="w-full flex items-center rounded-md border border-webropol-gray-200 bg-webropol-gray-50 overflow-hidden focus-within:border-webropol-primary-400 focus-within:ring-1 focus-within:ring-webropol-primary-200">
                  <input type="text"
                         :value="colour.toUpperCase()"
                         maxlength="7"
                         spellcheck="false"
                         @change="setBarColour(index, $event.target.value)"
                         @focus="$event.target.select()"
                         class="w-0 flex-1 bg-transparent text-[10px] font-mono uppercase text-webropol-gray-700 px-1.5 py-1 focus:outline-none min-w-0">
                  <button type="button"
                          @click="copyHex(index)"
                          :title="copiedIndex === index ? 'Copied!' : 'Copy hex'"
                          class="flex-shrink-0 flex items-center justify-center w-6 h-6 text-webropol-gray-400 hover:text-webropol-primary-600 transition-colors">
                    <i class="fa-light text-[10px]" :class="copiedIndex === index ? 'fa-check text-green-500' : 'fa-copy'"></i>
                  </button>
                </div>

              </div>
            </template>
          </div>
        </div>

        <div class="border-t border-webropol-gray-100 mb-5"></div>

        <!-- ── THEMES ── -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-webropol-gray-900 mb-3">Themes</h3>
          <div class="flex items-center gap-4 flex-wrap">
            <template x-for="t in [{label:'Light',value:'light'},{label:'Dark',value:'dark'},{label:'RAG',value:'rag'},{label:'Custom',value:'custom'}]" :key="t.value">
              <label class="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="radio" name="simpleTheme" :value="t.value"
                       :checked="theme === t.value"
                       @change="applyTheme(t.value)"
                       class="w-4 h-4 accent-webropol-primary-600">
                <span class="text-sm text-webropol-gray-700" x-text="t.label"></span>
              </label>
            </template>
          </div>
        </div>

        <!-- ── BORDER OPTION ── -->
        <div class="mb-5 flex items-center justify-between rounded-xl border border-webropol-gray-200 bg-webropol-gray-50 px-4 py-2.5">
          <div>
            <span class="text-sm font-medium text-webropol-gray-800">Add border to bar colours</span>
            <p class="text-xs text-webropol-gray-500 mt-0.5">Shows a colour-matched outline ring on each chart bar</p>
          </div>
          <button type="button"
                  @click="showBorder = !showBorder"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="showBorder ? 'bg-webropol-primary-600' : 'bg-webropol-gray-300'"
                  role="switch"
                  :aria-checked="showBorder">
            <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="showBorder ? 'translate-x-5' : 'translate-x-0'"></span>
          </button>
        </div>

        <div class="border-t border-webropol-gray-100 mb-5"></div>

        <!-- ── AVERAGES & INDEX ── -->
        <div class="mb-5">
          <div class="flex items-start justify-between mb-1">
            <h3 class="text-sm font-semibold text-webropol-gray-900">Averages &amp; index</h3>
            <div class="flex items-center gap-1.5 flex-shrink-0 ml-3">
              <button @click="indexType = 'mean'" type="button"
                      class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors"
                      :class="indexType === 'mean' ? 'bg-webropol-primary-600 text-white border-webropol-primary-600 shadow-sm' : 'border-webropol-gray-300 text-webropol-gray-600 hover:border-webropol-primary-400 bg-white'">
                Mean
              </button>
              <button @click="indexType = 'index'" type="button"
                      class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors"
                      :class="indexType === 'index' ? 'bg-webropol-primary-600 text-white border-webropol-primary-600 shadow-sm' : 'border-webropol-gray-300 text-webropol-gray-600 hover:border-webropol-primary-400 bg-white'">
                Index Value
              </button>
            </div>
          </div>
          <p class="text-xs text-webropol-gray-500 mb-3">Set min and max color limits for averages and index percentages in tables and charts.</p>

          <!-- column headers -->
          <div x-show="averageRows.length > 0"
               class="grid gap-2 px-1 mb-1 text-[10px] font-semibold uppercase tracking-wider text-webropol-gray-400"
               style="grid-template-columns:56px 1fr 1fr 1fr 28px">
            <span>Colours</span><span>Min</span><span>Max</span><span>Title</span><span></span>
          </div>

          <div class="space-y-1.5">
            <template x-for="(row, idx) in averageRows" :key="'sa-' + idx">
              <div class="grid items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-webropol-gray-50"
                   style="grid-template-columns:56px 1fr 1fr 1fr 28px">
                <div class="flex items-center gap-1.5">
                  <div class="relative">
                    <button type="button"
                            class="w-6 h-6 rounded-md ring-1 ring-webropol-gray-200 block shadow-sm hover:scale-110 transition-transform"
                            :style="'background:' + row.fontColour"
                            @click="$el.nextElementSibling.click()"></button>
                    <input type="color" :value="row.fontColour" @input="row.fontColour = $event.target.value" class="sr-only" tabindex="-1">
                  </div>
                  <div class="relative">
                    <button type="button"
                            class="w-6 h-6 rounded-md ring-1 ring-webropol-gray-200 block shadow-sm hover:scale-110 transition-transform"
                            :style="'background:' + row.bgColour"
                            @click="$el.nextElementSibling.click()"></button>
                    <input type="color" :value="row.bgColour" @input="row.bgColour = $event.target.value" class="sr-only" tabindex="-1">
                  </div>
                </div>
                <input type="text" x-model="row.minValue" placeholder="Label"
                       class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg bg-white focus:outline-none focus:border-webropol-primary-400">
                <input type="text" x-model="row.maxValue" placeholder="Label"
                       class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg bg-white focus:outline-none focus:border-webropol-primary-400">
                <input type="text" x-model="row.title" placeholder="Label"
                       class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg bg-white focus:outline-none focus:border-webropol-primary-400">
                <button @click="averageRows.splice(idx, 1)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-webropol-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        aria-label="Remove">
                  <i class="fal fa-trash text-xs"></i>
                </button>
              </div>
            </template>
          </div>

          <button @click="addAverageRow()"
                  class="mt-2 text-xs text-webropol-primary-600 hover:text-webropol-primary-800 transition-colors flex items-center gap-1">
            <i class="fal fa-plus text-[10px]"></i> Add Rule
          </button>
        </div>

        <div class="border-t border-webropol-gray-100 mb-5"></div>

        <!-- ── EXCLUDED ── -->
        <div>
          <h3 class="text-sm font-semibold text-webropol-gray-900 mb-1">Excluded option colours</h3>
          <p class="text-xs text-webropol-gray-500 mb-3">Excluded option column colours Specify colour limit min and max values for excluded option column</p>

          <!-- column headers -->
          <div x-show="excludedRows.length > 0"
               class="grid gap-2 px-1 mb-1 text-[10px] font-semibold uppercase tracking-wider text-webropol-gray-400"
               style="grid-template-columns:56px 1fr 1fr 1fr 28px">
            <span>Colours</span><span>Min</span><span>Max</span><span>Title</span><span></span>
          </div>

          <div class="space-y-1.5">
            <template x-for="(row, idx) in excludedRows" :key="'se-' + idx">
              <div class="grid items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-webropol-gray-50"
                   style="grid-template-columns:56px 1fr 1fr 1fr 28px">
                <div class="flex items-center gap-1.5">
                  <div class="relative">
                    <button type="button"
                            class="w-6 h-6 rounded-md ring-1 ring-webropol-gray-200 block shadow-sm hover:scale-110 transition-transform"
                            :style="'background:' + row.fontColour"
                            @click="$el.nextElementSibling.click()"></button>
                    <input type="color" :value="row.fontColour" @input="row.fontColour = $event.target.value" class="sr-only" tabindex="-1">
                  </div>
                  <div class="relative">
                    <button type="button"
                            class="w-6 h-6 rounded-md ring-1 ring-webropol-gray-200 block shadow-sm hover:scale-110 transition-transform"
                            :style="'background:' + row.bgColour"
                            @click="$el.nextElementSibling.click()"></button>
                    <input type="color" :value="row.bgColour" @input="row.bgColour = $event.target.value" class="sr-only" tabindex="-1">
                  </div>
                </div>
                <input type="text" x-model="row.minValue" placeholder="Label"
                       class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg bg-white focus:outline-none focus:border-webropol-primary-400">
                <input type="text" x-model="row.maxValue" placeholder="Label"
                       class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg bg-white focus:outline-none focus:border-webropol-primary-400">
                <input type="text" x-model="row.title" placeholder="Label"
                       class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg bg-white focus:outline-none focus:border-webropol-primary-400">
                <button @click="excludedRows.splice(idx, 1)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-webropol-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        aria-label="Remove">
                  <i class="fal fa-trash text-xs"></i>
                </button>
              </div>
            </template>
          </div>

          <button @click="addExcludedRow()"
                  class="mt-2 text-xs text-webropol-primary-600 hover:text-webropol-primary-800 transition-colors flex items-center gap-1">
            <i class="fal fa-plus text-[10px]"></i> Add Rule
          </button>
        </div>

      </div>

      <div x-show="modalVariant !== 'simple'" x-transition.opacity>

      <!-- ═══ BAR COLOURS ═══ -->
      <div class="mb-7">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-webropol-gray-900">Bar colours</h3>
            <p class="text-xs text-webropol-gray-500 mt-0.5">Colours applied to chart bars and answer options</p>
          </div>
        </div>

        <!-- Sub-tabs -->
        <div class="flex gap-0 border border-webropol-gray-200 rounded-xl overflow-hidden mb-5">
          <button @click="barTab = 'colours'"
                  :class="barTab === 'colours' ? 'bg-webropol-primary-700 text-white' : 'bg-white text-webropol-gray-600 hover:bg-webropol-gray-50'"
                  class="flex-1 px-4 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2 border-r border-webropol-gray-200">
            <i class="fal fa-tint"></i> Colours
          </button>
          <button @click="barTab = 'accessible-colours'"
                  :class="barTab === 'accessible-colours' ? 'bg-webropol-primary-700 text-white' : 'bg-white text-webropol-gray-600 hover:bg-webropol-gray-50'"
                  class="flex-1 px-4 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2">
            <i class="fal fa-universal-access"></i> Accessible colours
          </button>
        </div>

        <svg width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">
          <defs>
            <pattern id="hc-pat-0" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11" stroke="white" stroke-width="2.5" fill="none"/>
            </pattern>
            <pattern id="hc-pat-1" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="white" stroke-width="2.5" fill="none"/>
            </pattern>
            <pattern id="hc-pat-2" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 2.5 L 10 2.5 M 0 7.5 L 10 7.5" stroke="white" stroke-width="2" fill="none"/>
            </pattern>
            <pattern id="hc-pat-3" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 0 L 5 10 L 10 0" stroke="white" stroke-width="1.5" fill="none"/>
            </pattern>
            <pattern id="hc-pat-4" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 2.5 0 L 2.5 10 M 7.5 0 L 7.5 10" stroke="white" stroke-width="2" fill="none"/>
            </pattern>
            <pattern id="hc-pat-5" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 2.5 L 10 2.5 M 0 7.5 L 10 7.5" stroke="white" stroke-width="2" fill="none"/>
            </pattern>
            <pattern id="hc-pat-6" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect x="1" y="1" width="3" height="3" fill="white"/>
              <rect x="5" y="5" width="3" height="3" fill="white"/>
            </pattern>
            <pattern id="hc-pat-7" patternUnits="userSpaceOnUse" width="10" height="10">
              <circle cx="5" cy="5" r="3.5" stroke="white" stroke-width="1.5" fill="none"/>
            </pattern>
            <pattern id="hc-pat-8" patternUnits="userSpaceOnUse" width="6" height="6">
              <circle cx="3" cy="3" r="2" fill="white"/>
            </pattern>
            <pattern id="hc-pat-9" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 3 L 5 3 L 5 0 M 5 10 L 5 7 L 10 7" stroke="white" stroke-width="2" fill="none"/>
            </pattern>
          </defs>
        </svg>

        <div class="mb-5 rounded-2xl border border-webropol-gray-200 bg-white p-4 shadow-soft">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-sm font-semibold text-webropol-gray-900">Pattern overlay</div>
              <div class="mt-1 text-xs text-webropol-gray-500">Apply all available patterns on top of the current colour scale for stronger differentiation in charts and greyscale exports.</div>
            </div>
            <button @click="setPatternsEnabled(!patternsEnabled)"
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                    :class="patternsEnabled ? 'bg-webropol-primary-700 text-white shadow-sm' : 'bg-webropol-gray-100 text-webropol-gray-600 hover:bg-webropol-gray-200'">
              <i class="fal fa-layer-group"></i>
              <span x-text="patternsEnabled ? 'Patterns enabled' : 'Enable patterns'"></span>
            </button>
          </div>

          <div x-show="patternsEnabled" x-transition.opacity class="mt-4">
            <div class="grid gap-3 sm:grid-cols-5">
              <template x-for="(pat, idx) in accessiblePatterns" :key="pat.patternId">
                <div class="rounded-xl border border-webropol-primary-100 bg-webropol-primary-50/50 p-2.5">
                  <div class="overflow-hidden rounded-lg ring-1 ring-webropol-primary-200">
                    <svg width="100%" height="100%" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style="display:block">
                      <rect width="60" height="60" :fill="pat.colour"/>
                      <rect width="60" height="60" :fill="'url(#' + pat.patternId + ')'"/>
                    </svg>
                  </div>
                  <div class="mt-2 text-center">
                    <div class="text-xs font-medium text-webropol-gray-700 leading-tight" x-text="pat.label"></div>
                    <div class="text-[11px] text-webropol-gray-400" x-text="'Pattern ' + (idx + 1)"></div>
                  </div>
                </div>
              </template>
            </div>

            <div class="mt-4 rounded-xl border border-webropol-primary-100 bg-webropol-primary-50 px-3 py-2.5 text-xs text-webropol-primary-800 flex gap-2">
              <i class="fal fa-info-circle mt-0.5 flex-shrink-0"></i>
              <span>All 10 patterns are activated together and inherit the current colour scale, so the overlay stays aligned with manual colours and accessible palettes.</span>
            </div>
          </div>
        </div>

        <!-- ── TAB: Colours ── -->
        <div x-show="barTab === 'colours'" x-transition.opacity>
          <div class="grid grid-cols-4 gap-3">
            <template x-for="(colour, index) in barColours" :key="index">
              <div class="group flex flex-col items-center gap-2 p-3 rounded-xl border border-webropol-gray-100 bg-webropol-gray-50 hover:border-webropol-primary-300 hover:bg-white transition-all">
                <div class="relative">
                  <div class="w-12 h-12 rounded-full shadow-sm border-2 border-white ring-1 ring-webropol-gray-200 cursor-pointer transition-transform group-hover:scale-105"
                       :style="'background:' + colour"
                       @click="$el.nextElementSibling.click()"></div>
                  <input type="color" :value="colour" @input="setBarColour(index, $event.target.value)"
                         class="sr-only" tabindex="-1">
                </div>
                <span class="text-xs font-medium text-webropol-gray-700" x-text="'Option ' + (index + 1)"></span>
                <input type="text" :value="colour" maxlength="7"
                       @change="setBarColour(index, $event.target.value)"
                       class="w-full text-center text-xs font-mono px-1.5 py-1 rounded-md border border-webropol-gray-200 bg-white focus:outline-none focus:border-webropol-primary-400 uppercase tracking-wide">
              </div>
            </template>
          </div>
          <div class="mt-4 flex justify-end">
            <button @click="resetBarColours()"
                    class="text-xs text-webropol-gray-500 hover:text-webropol-primary-600 transition-colors flex items-center gap-1.5">
              <i class="fal fa-undo"></i> Reset to defaults
            </button>
          </div>
        </div>

        <!-- ── TAB: Accessible colours ── -->
        <div x-show="barTab === 'accessible-colours'" x-transition.opacity>
          <div class="mb-4 flex items-center justify-between gap-3 rounded-xl border border-webropol-gray-200 bg-webropol-gray-50 px-4 py-3">
            <div>
              <div class="text-sm font-medium text-webropol-gray-800">Reverse all palette previews</div>
              <div class="text-xs text-webropol-gray-500">This master control flips every palette card. Use the Reverse button on a palette card to reverse only that selected palette.</div>
            </div>
            <button @click="toggleAccessiblePaletteReverse()"
                    type="button"
                    style="min-width:180px"
                    class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                    :class="palettePreviewReversed ? 'bg-webropol-primary-700 text-white shadow-sm' : 'bg-white text-webropol-gray-600 border border-webropol-gray-200 hover:border-webropol-primary-300 hover:text-webropol-primary-700'">
              <i class="fal fa-exchange-alt"></i>
              <span x-text="palettePreviewReversed ? 'All previews reversed' : 'Normal preview order'"></span>
            </button>
          </div>
          <div class="mb-4 flex justify-end">
            <button @click="resetAll()"
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-webropol-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-webropol-gray-600 transition-colors hover:border-webropol-primary-300 hover:text-webropol-primary-700">
              <i class="fal fa-undo"></i>
              <span>Reset everything</span>
            </button>
          </div>
          <div class="space-y-2">
            <template x-for="palette in accessiblePalettes" :key="palette.name">
              <div class="p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                   :class="selectedAccessiblePalette === palette.name
                     ? 'border-webropol-primary-500 bg-webropol-primary-50'
                     : 'border-webropol-gray-100 hover:border-webropol-gray-300 bg-white'"
                   @click="applyAccessiblePalette(palette)">

                <!-- Top row: name + selected indicator -->
                <div class="flex items-start justify-between mb-2.5">
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-semibold text-webropol-gray-800 leading-tight" x-text="palette.name"></div>
                    <div class="text-xs text-webropol-gray-500 mt-0.5" x-text="palette.description"></div>
                  </div>
                  <div class="flex items-start gap-2 flex-shrink-0 ml-3 mt-0.5">
                        <button @click.stop="toggleSelectedPaletteReverse(palette.name)"
                            type="button"
                            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
                          :class="selectedAccessiblePalette === palette.name && accessiblePaletteReversed
                              ? 'bg-webropol-primary-700 text-white shadow-sm'
                              : 'bg-white text-webropol-gray-600 border border-webropol-gray-200 hover:border-webropol-primary-300 hover:text-webropol-primary-700'">
                      <i class="fal fa-exchange-alt"></i>
                      <span>Reverse</span>
                    </button>
                    <div x-show="selectedAccessiblePalette === palette.name"
                         class="w-5 h-5 rounded-full bg-webropol-primary-600 flex items-center justify-center shadow-sm">
                      <i class="fal fa-check text-white" style="font-size:9px"></i>
                    </div>
                    <div x-show="selectedAccessiblePalette !== palette.name"
                         class="w-5 h-5 rounded-full border-2 border-webropol-gray-200"></div>
                  </div>
                </div>

                <!-- Compact single-row palette strip -->
                <div class="flex items-center gap-0.5 rounded-xl bg-webropol-gray-100 p-1">
                  <template x-for="(c, colorIndex) in getPalettePreviewColours(palette)" :key="palette.name + '-' + colorIndex">
                    <div class="h-5 flex-1 min-w-0 shadow-sm"
                         :class="colorIndex === 0 ? 'rounded-l-lg' : (colorIndex === getPalettePreviewColours(palette).length - 1 ? 'rounded-r-lg' : '')"
                         :style="'background:' + c"
                         :title="c"></div>
                  </template>
                </div>

                <!-- Citation -->
                <div class="mt-2.5 flex items-center gap-1.5" @click.stop>
                  <i class="fal fa-book text-webropol-gray-400" style="font-size:10px"></i>
                  <a :href="palette.referenceUrl" target="_blank" rel="noopener"
                     class="text-xs text-webropol-primary-600 hover:text-webropol-primary-800 hover:underline truncate transition-colors"
                     x-text="palette.reference"></a>
                  <i class="fal fa-external-link text-webropol-gray-400 flex-shrink-0" style="font-size:10px"></i>
                </div>

              </div>
            </template>
          </div>
          <div class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 flex gap-2">
            <i class="fal fa-eye mt-0.5 flex-shrink-0"></i>
            <span>Selecting a palette applies all 12 colours to the Colours tab. All palettes are tested against deuteranopia, protanopia and tritanopia. Extended palettes supplement the original with perceptually compatible colours.</span>
          </div>
        </div>

      </div><!-- /BAR COLOURS -->

      <div class="border-t border-webropol-gray-100 mb-6"></div>

      <!-- ═══ AVERAGES & INDEX COLOURS ═══ -->
      <div class="mb-7">

        <!-- Section header -->
        <div class="flex items-start justify-between mb-5">
          <div class="flex items-start gap-3">
            <span class="inline-flex w-8 h-8 rounded-lg bg-amber-50 items-center justify-center text-amber-500 flex-shrink-0 mt-0.5">
              <i class="fal fa-chart-line text-sm"></i>
            </span>
            <div>
              <h3 class="text-sm font-semibold text-webropol-gray-900">Averages &amp; index colours</h3>
              <p class="text-xs text-webropol-gray-500 mt-0.5">Colour rules applied to mean/index values in table cells and charts</p>
            </div>
          </div>
          <button x-show="averageRows.length > 0" @click="averageRows = []"
                  class="text-xs text-webropol-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 mt-0.5 flex-shrink-0">
            <i class="fal fa-undo text-xs"></i> Reset
          </button>
        </div>

        <!-- Mean / Index pill toggle -->
        <div class="flex items-center gap-3 mb-5 p-3 bg-webropol-gray-50 rounded-xl border border-webropol-gray-100">
          <span class="text-xs text-webropol-gray-500 font-medium">Colour limits for:</span>
          <div class="flex gap-1 bg-white rounded-lg p-0.5 border border-webropol-gray-200 shadow-sm">
            <label class="flex items-center gap-1.5 cursor-pointer px-3.5 py-1.5 rounded-md text-xs font-medium transition-all"
                   :class="indexType === 'mean' ? 'bg-webropol-primary-600 text-white shadow-sm' : 'text-webropol-gray-600 hover:text-webropol-gray-800'">
              <input type="radio" name="coloursModalIndexType" value="mean" x-model="indexType" class="sr-only">
              <i class="fal fa-wave-sine text-xs"></i> Mean
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer px-3.5 py-1.5 rounded-md text-xs font-medium transition-all"
                   :class="indexType === 'index' ? 'bg-webropol-primary-600 text-white shadow-sm' : 'text-webropol-gray-600 hover:text-webropol-gray-800'">
              <input type="radio" name="coloursModalIndexType" value="index" x-model="indexType" class="sr-only">
              <i class="fal fa-percent text-xs"></i> Index value
            </label>
          </div>
        </div>

        <!-- Column headers (visible only when rows exist) -->
        <div x-show="averageRows.length > 0"
             class="grid items-center gap-2 px-3 mb-1.5 text-xs font-semibold text-webropol-gray-400 uppercase tracking-wider"
             style="grid-template-columns:56px 56px 1fr 1fr 1fr 80px 28px">
          <span>Font</span><span>Background</span><span>Min value</span><span>Max value</span><span>Title</span><span class="text-center">Preview</span><span></span>
        </div>

        <!-- Rule rows -->
        <div class="space-y-1.5">
          <template x-for="(row, idx) in averageRows" :key="idx">
            <div class="grid items-center gap-2 px-3 py-2.5 rounded-xl border border-webropol-gray-100 bg-white hover:border-webropol-gray-200 hover:shadow-sm transition-all group"
                 style="grid-template-columns:56px 56px 1fr 1fr 1fr 80px 28px">

              <!-- Font colour swatch -->
              <div class="flex flex-col items-center gap-1">
                <div class="relative">
                  <div class="w-9 h-9 rounded-full border-2 border-white ring-1 ring-webropol-gray-200 cursor-pointer shadow-sm hover:scale-110 transition-transform"
                       :style="'background:' + row.fontColour"
                       @click="$el.nextElementSibling.click()"></div>
                  <input type="color" :value="row.fontColour" @input="row.fontColour = $event.target.value" class="sr-only">
                </div>
                <span class="text-xs font-mono text-webropol-gray-400 leading-none" x-text="row.fontColour.toUpperCase()"></span>
              </div>

              <!-- Background colour swatch -->
              <div class="flex flex-col items-center gap-1">
                <div class="relative">
                  <div class="w-9 h-9 rounded-full border-2 border-white ring-1 ring-webropol-gray-200 cursor-pointer shadow-sm hover:scale-110 transition-transform"
                       :style="'background:' + row.bgColour"
                       @click="$el.nextElementSibling.click()"></div>
                  <input type="color" :value="row.bgColour" @input="row.bgColour = $event.target.value" class="sr-only">
                </div>
                <span class="text-xs font-mono text-webropol-gray-400 leading-none" x-text="row.bgColour.toUpperCase()"></span>
              </div>

              <!-- Min value -->
              <input type="number" x-model="row.minValue" placeholder="e.g. 0"
                     class="w-full px-2.5 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400 bg-webropol-gray-50 focus:bg-white transition-colors">

              <!-- Max value -->
              <input type="number" x-model="row.maxValue" placeholder="e.g. 100"
                     class="w-full px-2.5 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400 bg-webropol-gray-50 focus:bg-white transition-colors">

              <!-- Title -->
              <input type="text" x-model="row.title" placeholder="Label"
                     class="w-full px-2.5 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400 bg-webropol-gray-50 focus:bg-white transition-colors">

              <!-- Live preview cell -->
              <div class="flex items-center justify-center">
                <div class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-webropol-gray-100 shadow-sm text-center min-w-0 w-full truncate"
                     :style="'background:' + row.bgColour + '; color:' + row.fontColour"
                     x-text="row.title || 'Aa 4.2'"></div>
              </div>

              <!-- Delete (appears on row hover) -->
              <button @click="averageRows.splice(idx,1)"
                      class="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-webropol-gray-300 hover:text-red-500 transition-all"
                      aria-label="Remove rule">
                <i class="fal fa-times text-sm"></i>
              </button>
            </div>
          </template>
        </div>

        <!-- Empty state -->
        <div x-show="averageRows.length === 0"
             class="py-7 flex flex-col items-center rounded-xl border-2 border-dashed border-webropol-gray-200 bg-webropol-gray-50">
          <i class="fal fa-paint-brush-alt text-webropol-gray-300 text-2xl mb-2"></i>
          <p class="text-xs font-medium text-webropol-gray-500">No colour rules yet</p>
          <p class="text-xs text-webropol-gray-400 mt-0.5">Specify min/max thresholds with custom colours</p>
        </div>

        <!-- Add rule button -->
        <button @click="averageRows.push({fontColour:'#000000',bgColour:'#f0f9ff',minValue:'',maxValue:'',title:''})"
                class="mt-3 w-full py-2.5 rounded-xl border-2 border-dashed border-webropol-gray-200 text-xs text-webropol-gray-500 hover:border-webropol-primary-300 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-all flex items-center justify-center gap-1.5 font-medium">
          <i class="fal fa-plus"></i> Add colour rule
        </button>

      </div><!-- /AVERAGES -->

      <div class="border-t border-webropol-gray-100 mb-6"></div>

      <!-- ═══ EXCLUDED OPTION COLUMN COLOURS ═══ -->
      <div class="mb-4">

        <!-- Section header -->
        <div class="flex items-start justify-between mb-5">
          <div class="flex items-start gap-3">
            <span class="inline-flex w-8 h-8 rounded-lg bg-rose-50 items-center justify-center text-rose-400 flex-shrink-0 mt-0.5">
              <i class="fal fa-ban text-sm"></i>
            </span>
            <div>
              <h3 class="text-sm font-semibold text-webropol-gray-900">Excluded option column colours</h3>
              <p class="text-xs text-webropol-gray-500 mt-0.5">Colour rules applied to excluded answer option columns in result tables</p>
            </div>
          </div>
          <button x-show="excludedRows.length > 0" @click="excludedRows = []"
                  class="text-xs text-webropol-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 mt-0.5 flex-shrink-0">
            <i class="fal fa-undo text-xs"></i> Reset
          </button>
        </div>

        <!-- Column headers (visible only when rows exist) -->
        <div x-show="excludedRows.length > 0"
             class="grid items-center gap-2 px-3 mb-1.5 text-xs font-semibold text-webropol-gray-400 uppercase tracking-wider"
             style="grid-template-columns:56px 56px 1fr 1fr 1fr 80px 28px">
          <span>Font</span><span>Background</span><span>Min value</span><span>Max value</span><span>Title</span><span class="text-center">Preview</span><span></span>
        </div>

        <!-- Rule rows -->
        <div class="space-y-1.5">
          <template x-for="(row, idx) in excludedRows" :key="idx">
            <div class="grid items-center gap-2 px-3 py-2.5 rounded-xl border border-webropol-gray-100 bg-white hover:border-webropol-gray-200 hover:shadow-sm transition-all group"
                 style="grid-template-columns:56px 56px 1fr 1fr 1fr 80px 28px">

              <!-- Font colour swatch -->
              <div class="flex flex-col items-center gap-1">
                <div class="relative">
                  <div class="w-9 h-9 rounded-full border-2 border-white ring-1 ring-webropol-gray-200 cursor-pointer shadow-sm hover:scale-110 transition-transform"
                       :style="'background:' + row.fontColour"
                       @click="$el.nextElementSibling.click()"></div>
                  <input type="color" :value="row.fontColour" @input="row.fontColour = $event.target.value" class="sr-only">
                </div>
                <span class="text-xs font-mono text-webropol-gray-400 leading-none" x-text="row.fontColour.toUpperCase()"></span>
              </div>

              <!-- Background colour swatch -->
              <div class="flex flex-col items-center gap-1">
                <div class="relative">
                  <div class="w-9 h-9 rounded-full border-2 border-white ring-1 ring-webropol-gray-200 cursor-pointer shadow-sm hover:scale-110 transition-transform"
                       :style="'background:' + row.bgColour"
                       @click="$el.nextElementSibling.click()"></div>
                  <input type="color" :value="row.bgColour" @input="row.bgColour = $event.target.value" class="sr-only">
                </div>
                <span class="text-xs font-mono text-webropol-gray-400 leading-none" x-text="row.bgColour.toUpperCase()"></span>
              </div>

              <!-- Min value -->
              <input type="number" x-model="row.minValue" placeholder="e.g. 0"
                     class="w-full px-2.5 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400 bg-webropol-gray-50 focus:bg-white transition-colors">

              <!-- Max value -->
              <input type="number" x-model="row.maxValue" placeholder="e.g. 100"
                     class="w-full px-2.5 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400 bg-webropol-gray-50 focus:bg-white transition-colors">

              <!-- Title -->
              <input type="text" x-model="row.title" placeholder="Label"
                     class="w-full px-2.5 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400 bg-webropol-gray-50 focus:bg-white transition-colors">

              <!-- Live preview cell -->
              <div class="flex items-center justify-center">
                <div class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-webropol-gray-100 shadow-sm text-center min-w-0 w-full truncate"
                     :style="'background:' + row.bgColour + '; color:' + row.fontColour"
                     x-text="row.title || 'Aa 4.2'"></div>
              </div>

              <!-- Delete (appears on row hover) -->
              <button @click="excludedRows.splice(idx,1)"
                      class="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-webropol-gray-300 hover:text-red-500 transition-all"
                      aria-label="Remove rule">
                <i class="fal fa-times text-sm"></i>
              </button>
            </div>
          </template>
        </div>

        <!-- Empty state -->
        <div x-show="excludedRows.length === 0"
             class="py-7 flex flex-col items-center rounded-xl border-2 border-dashed border-webropol-gray-200 bg-webropol-gray-50">
          <i class="fal fa-eye-slash text-webropol-gray-300 text-2xl mb-2"></i>
          <p class="text-xs font-medium text-webropol-gray-500">No colour rules yet</p>
          <p class="text-xs text-webropol-gray-400 mt-0.5">Define how excluded columns are visually distinguished</p>
        </div>

        <!-- Add rule button -->
        <button @click="excludedRows.push({fontColour:'#000000',bgColour:'#fff7ed',minValue:'',maxValue:'',title:''})"
                class="mt-3 w-full py-2.5 rounded-xl border-2 border-dashed border-webropol-gray-200 text-xs text-webropol-gray-500 hover:border-webropol-primary-300 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-all flex items-center justify-center gap-1.5 font-medium">
          <i class="fal fa-plus"></i> Add colour rule
        </button>

      </div><!-- /EXCLUDED -->

      </div>

    </div><!-- /modal-body -->

    <!-- ── Footer ──────────────────────────────────────────────────────── -->
    <div class="border-t border-webropol-gray-100 px-6 py-4 flex items-center justify-between gap-3 bg-webropol-gray-50 rounded-b-2xl">
      <button class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              :class="modalVariant === 'simple' ? 'border-rose-300 text-rose-600 hover:bg-rose-50' : 'border-webropol-gray-300 text-webropol-gray-600 hover:bg-webropol-gray-100'"
              @click="resetAll()">
        <i class="fal fa-undo text-xs"></i>
        <span>Reset all</span>
      </button>
      <div class="flex justify-end gap-3">
        <button class="btn btn-secondary" @click="close()">
          <span x-text="modalVariant === 'simple' ? 'Close' : 'Cancel'"></span>
        </button>
        <button class="btn btn-primary" @click="save()">
          <span x-text="modalVariant === 'simple' ? 'Apply' : 'Save'"></span>
        </button>
      </div>
    </div>

  </div><!-- /modal-content -->
</div><!-- /modal-overlay -->
    `;
  }
}

customElements.define('webropol-chart-colours-modal', WebropolChartColoursModal);
