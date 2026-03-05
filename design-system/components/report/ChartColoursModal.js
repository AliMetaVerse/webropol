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

    const DEFAULT_BAR_COLOURS = [
      '#1a5276', '#e55e1e', '#27ae60', '#d4ac0d',
      '#1abc9c', '#7f8c9a', '#c0392b', '#2e4ba0',
      '#e91e8c', '#1a7d60', '#7d5a3c', '#95a5a6'
    ];

    return {
      // ── Modal visibility ──────────────────────────────────────────────────
      isOpen: false,

      // ── Bar colours state ─────────────────────────────────────────────────
      barTab: 'colours',   // 'colours' | 'accessible-colours' | 'accessible-patterns'
      barColours: [...DEFAULT_BAR_COLOURS],
      selectedAccessiblePalette: null,

      // ── Averages / excluded rows ──────────────────────────────────────────
      indexType: 'mean',   // 'mean' | 'index'
      averageRows: [],
      excludedRows: [],

      // ── Accessible colour palettes ────────────────────────────────────────
      accessiblePalettes: [
        {
          name: 'Wong (2011)',
          description: 'Colorblind-safe · 8 colours · gold standard',
          colours: ['#000000','#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7']
        },
        {
          name: 'Okabe & Ito',
          description: 'CVD-friendly · 8 colours · journal-recommended',
          colours: ['#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7','#999999']
        },
        {
          name: 'IBM Colour Blind Safe',
          description: 'Corporate-grade · 5 high-contrast colours',
          colours: ['#648FFF','#785EF0','#DC267F','#FE6100','#FFB000']
        },
        {
          name: 'Paul Tol Muted',
          description: 'Publication-quality · 9 soft colours',
          colours: ['#332288','#117733','#44AA99','#88CCEE','#DDCC77','#CC6677','#AA4499','#882255','#999933']
        },
        {
          name: 'Tableau Colorblind 10',
          description: 'Data-viz optimised · 10 colours',
          colours: ['#4E79A7','#F28E2B','#E15759','#76B7B2','#59A14F','#EDC948','#B07AA1','#FF9DA7','#9C755F','#BAB0AC']
        }
      ],

      // ── Accessible patterns (Highcharts default-pattern-0 … -9) ──────────
      accessiblePatterns: [
        { patternId: 'hc-pat-0', label: 'Diagonal /',    colour: '#1a5276', active: false },
        { patternId: 'hc-pat-1', label: 'Diagonal \\',   colour: '#e55e1e', active: false },
        { patternId: 'hc-pat-2', label: 'Horizontal',    colour: '#27ae60', active: false },
        { patternId: 'hc-pat-3', label: 'Zigzag',        colour: '#d4ac0d', active: false },
        { patternId: 'hc-pat-4', label: 'Vert. bars',    colour: '#1abc9c', active: false },
        { patternId: 'hc-pat-5', label: 'Horiz. bars',   colour: '#c0392b', active: false },
        { patternId: 'hc-pat-6', label: 'Squares',       colour: '#7f8c9a', active: false },
        { patternId: 'hc-pat-7', label: 'Circles',       colour: '#2e4ba0', active: false },
        { patternId: 'hc-pat-8', label: 'Filled dots',   colour: '#1a7d60', active: false },
        { patternId: 'hc-pat-9', label: 'Steps',         colour: '#e91e8c', active: false }
      ],

      // ── Lifecycle ─────────────────────────────────────────────────────────
      init() {
        this._openHandler = () => {
          this.isOpen = true;
          document.body.classList.add('modal-open');
        };
        window.addEventListener('webropol:open-chart-colours', this._openHandler);
      },

      destroy() {
        if (this._openHandler) {
          window.removeEventListener('webropol:open-chart-colours', this._openHandler);
        }
      },

      // ── Actions ───────────────────────────────────────────────────────────
      close() {
        this.isOpen = false;
        document.body.classList.remove('modal-open');
        window.dispatchEvent(new CustomEvent('webropol:chart-colours-closed', {
          detail: {
            barColours:     [...this.barColours],
            activePatterns: this.accessiblePatterns.filter(p => p.active).map(p => p.patternId),
            averageRows:    [...this.averageRows],
            excludedRows:   [...this.excludedRows]
          }
        }));
      },

      save() {
        this.close();
      },

      resetBarColours() {
        this.barColours = [...DEFAULT_BAR_COLOURS];
        this.selectedAccessiblePalette = null;
      },

      setBarColour(index, val) {
        if (/^#[0-9a-fA-F]{6}$/.test(val)) this.barColours[index] = val;
      },

      applyAccessiblePalette(palette) {
        this.selectedAccessiblePalette = palette.name;
        this.barTab = 'colours';
        palette.colours.forEach((c, i) => {
          if (i < this.barColours.length) this.barColours[i] = c;
        });
      },

      togglePattern(idx) {
        this.accessiblePatterns[idx].active = !this.accessiblePatterns[idx].active;
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
     role="dialog"
     aria-modal="true"
     aria-labelledby="coloursModalTitle">

  <div class="modal-content" style="max-width:680px;">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <div class="modal-header">
      <div class="modal-title-section">
        <div class="modal-title" id="coloursModalTitle">
          <span class="inline-flex w-9 h-9 rounded-lg bg-cyan-50 items-center justify-center text-cyan-600">
            <i class="fal fa-palette text-lg"></i>
          </span>
          <span>Colours for chart, mean &amp; index</span>
        </div>
      </div>
      <button class="modal-close" aria-label="Close" @click="close()">
        <i class="fal fa-times"></i>
      </button>
    </div>

    <!-- ── Body ───────────────────────────────────────────────────────── -->
    <div class="modal-body overflow-y-auto" style="max-height:calc(90vh - 130px);">

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
                  class="flex-1 px-4 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2 border-r border-webropol-gray-200">
            <i class="fal fa-universal-access"></i> Accessible colours
          </button>
          <button @click="barTab = 'accessible-patterns'"
                  :class="barTab === 'accessible-patterns' ? 'bg-webropol-primary-700 text-white' : 'bg-white text-webropol-gray-600 hover:bg-webropol-gray-50'"
                  class="flex-1 px-4 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2">
            <i class="fal fa-th"></i> Accessible patterns
          </button>
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
                  <input type="color" :value="colour" @input="barColours[index] = $event.target.value"
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
          <div class="space-y-2.5">
            <template x-for="palette in accessiblePalettes" :key="palette.name">
              <div class="flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all"
                   :class="selectedAccessiblePalette === palette.name
                     ? 'border-webropol-primary-500 bg-webropol-primary-50'
                     : 'border-webropol-gray-100 hover:border-webropol-gray-300 bg-white'"
                   @click="applyAccessiblePalette(palette)">
                <div class="flex gap-1 flex-shrink-0">
                  <template x-for="c in palette.colours.slice(0,8)" :key="c">
                    <div class="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                         :style="'background:' + c"></div>
                  </template>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-webropol-gray-800" x-text="palette.name"></div>
                  <div class="text-xs text-webropol-gray-500 mt-0.5" x-text="palette.description"></div>
                </div>
                <div class="flex-shrink-0">
                  <div x-show="selectedAccessiblePalette === palette.name"
                       class="w-6 h-6 rounded-full bg-webropol-primary-600 flex items-center justify-center">
                    <i class="fal fa-check text-white" style="font-size:10px"></i>
                  </div>
                  <div x-show="selectedAccessiblePalette !== palette.name"
                       class="w-6 h-6 rounded-full border-2 border-webropol-gray-200"></div>
                </div>
              </div>
            </template>
          </div>
          <div class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 flex gap-2">
            <i class="fal fa-eye mt-0.5 flex-shrink-0"></i>
            <span>Clicking a palette applies its colours to the Colours tab. Tested against deuteranopia, protanopia and tritanopia.</span>
          </div>
        </div>

        <!-- ── TAB: Accessible patterns ── -->
        <div x-show="barTab === 'accessible-patterns'" x-transition.opacity>

          <!-- SVG pattern defs — Highcharts default-pattern-0 … -9 -->
          <svg width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">
            <defs>
              <!-- 0: Diagonal / -->
              <pattern id="hc-pat-0" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11" stroke="white" stroke-width="2.5" fill="none"/>
              </pattern>
              <!-- 1: Diagonal \ -->
              <pattern id="hc-pat-1" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="white" stroke-width="2.5" fill="none"/>
              </pattern>
              <!-- 2: Horizontal lines -->
              <pattern id="hc-pat-2" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 0 2.5 L 10 2.5 M 0 7.5 L 10 7.5" stroke="white" stroke-width="2" fill="none"/>
              </pattern>
              <!-- 3: Zigzag / chevron -->
              <pattern id="hc-pat-3" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 0 0 L 5 10 L 10 0" stroke="white" stroke-width="1.5" fill="none"/>
              </pattern>
              <!-- 4: Double vertical bars -->
              <pattern id="hc-pat-4" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 2.5 0 L 2.5 10 M 7.5 0 L 7.5 10" stroke="white" stroke-width="2" fill="none"/>
              </pattern>
              <!-- 5: Double horizontal bars -->
              <pattern id="hc-pat-5" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 0 2.5 L 10 2.5 M 0 7.5 L 10 7.5" stroke="white" stroke-width="2" fill="none"/>
              </pattern>
              <!-- 6: Squares grid (checkerboard) -->
              <pattern id="hc-pat-6" patternUnits="userSpaceOnUse" width="8" height="8">
                <rect x="1" y="1" width="3" height="3" fill="white"/>
                <rect x="5" y="5" width="3" height="3" fill="white"/>
              </pattern>
              <!-- 7: Circle outlines -->
              <pattern id="hc-pat-7" patternUnits="userSpaceOnUse" width="10" height="10">
                <circle cx="5" cy="5" r="3.5" stroke="white" stroke-width="1.5" fill="none"/>
              </pattern>
              <!-- 8: Filled dots -->
              <pattern id="hc-pat-8" patternUnits="userSpaceOnUse" width="6" height="6">
                <circle cx="3" cy="3" r="2" fill="white"/>
              </pattern>
              <!-- 9: Step / L-path -->
              <pattern id="hc-pat-9" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 0 3 L 5 3 L 5 0 M 5 10 L 5 7 L 10 7" stroke="white" stroke-width="2" fill="none"/>
              </pattern>
            </defs>
          </svg>

          <!-- Pattern grid 5 × 2 -->
          <div class="grid gap-3" style="grid-template-columns:repeat(5,1fr)">
            <template x-for="(pat, idx) in accessiblePatterns" :key="pat.patternId">
              <div class="flex flex-col items-center gap-2 cursor-pointer group" @click="togglePattern(idx)">
                <div class="relative rounded-xl overflow-hidden transition-all w-full aspect-square"
                     :class="pat.active
                       ? 'ring-2 ring-webropol-primary-500 ring-offset-2'
                       : 'ring-1 ring-webropol-gray-200 group-hover:ring-webropol-gray-400'">
                  <svg width="100%" height="100%" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style="display:block">
                    <rect width="60" height="60" :fill="pat.colour"/>
                    <rect width="60" height="60" :fill="'url(#' + pat.patternId + ')'"/>
                  </svg>
                  <div x-show="pat.active"
                       class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-webropol-primary-600 flex items-center justify-center shadow">
                    <i class="fal fa-check text-white" style="font-size:9px"></i>
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-xs font-medium text-webropol-gray-700 leading-tight" x-text="pat.label"></div>
                  <div class="text-xs text-webropol-gray-400" x-text="'pattern-' + idx"></div>
                </div>
              </div>
            </template>
          </div>

          <div class="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex gap-2.5">
            <i class="fal fa-info-circle text-slate-400 mt-0.5 flex-shrink-0 text-sm"></i>
            <span>Patterns supplement colour — charts remain distinguishable in greyscale prints and for users with colour vision deficiency. Based on <strong>Highcharts pattern fill</strong> naming convention.</span>
          </div>
        </div>
      </div><!-- /BAR COLOURS -->

      <div class="border-t border-webropol-gray-100 mb-6"></div>

      <!-- ═══ AVERAGES & INDEX COLOURS ═══ -->
      <div class="mb-7">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-webropol-gray-900">Averages &amp; index colours</h3>
          <p class="text-xs text-webropol-gray-500 mt-0.5">Colour rules applied to mean/index values shown in table cells and charts</p>
        </div>

        <!-- Mean / Index radio -->
        <div class="flex gap-1 mb-4 bg-webropol-gray-100 rounded-xl p-1 w-fit">
          <label class="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                 :class="indexType === 'mean' ? 'bg-white shadow-card text-webropol-primary-700' : 'text-webropol-gray-600 hover:text-webropol-gray-800'">
            <input type="radio" name="coloursModalIndexType" value="mean" x-model="indexType" class="sr-only"> Mean
          </label>
          <label class="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                 :class="indexType === 'index' ? 'bg-white shadow-card text-webropol-primary-700' : 'text-webropol-gray-600 hover:text-webropol-gray-800'">
            <input type="radio" name="coloursModalIndexType" value="index" x-model="indexType" class="sr-only"> Index value
          </label>
        </div>

        <div class="rounded-xl border border-webropol-gray-200 overflow-hidden">
          <div class="grid text-xs font-semibold text-webropol-gray-500 bg-webropol-gray-50 px-4 py-2.5 border-b border-webropol-gray-200"
               style="grid-template-columns:44px 44px 1fr 1fr 1fr 32px">
            <span>Font</span><span>Background</span><span>Min</span><span>Max</span><span>Title</span><span></span>
          </div>
          <div x-show="averageRows.length === 0" class="px-4 py-6 text-center text-xs text-webropol-gray-400">
            No colour rules yet — click "+ Add rule" below
          </div>
          <template x-for="(row, idx) in averageRows" :key="idx">
            <div class="grid items-center gap-2 px-4 py-2.5 border-b border-webropol-gray-100 last:border-0"
                 style="grid-template-columns:44px 44px 1fr 1fr 1fr 32px">
              <input type="color" :value="row.fontColour" @input="row.fontColour = $event.target.value"
                     class="w-8 h-8 rounded-lg border border-webropol-gray-200 cursor-pointer p-0.5">
              <input type="color" :value="row.bgColour" @input="row.bgColour = $event.target.value"
                     class="w-8 h-8 rounded-lg border border-webropol-gray-200 cursor-pointer p-0.5">
              <input type="number" x-model="row.minValue" placeholder="Min"
                     class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400">
              <input type="number" x-model="row.maxValue" placeholder="Max"
                     class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400">
              <input type="text" x-model="row.title" placeholder="Label"
                     class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400">
              <button @click="averageRows.splice(idx,1)"
                      class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-webropol-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove row">
                <i class="fal fa-trash-alt text-xs"></i>
              </button>
            </div>
          </template>
        </div>
        <div class="flex items-center justify-between mt-2.5">
          <button @click="averageRows.push({fontColour:'#000000',bgColour:'#f0f9ff',minValue:'',maxValue:'',title:''})"
                  class="text-xs text-webropol-primary-600 hover:text-webropol-primary-700 font-medium flex items-center gap-1">
            <i class="fal fa-plus"></i> Add rule
          </button>
          <button x-show="averageRows.length > 0" @click="averageRows = []"
                  class="text-xs text-webropol-gray-400 hover:text-webropol-gray-600">
            Reset all
          </button>
        </div>
      </div><!-- /AVERAGES -->

      <div class="border-t border-webropol-gray-100 mb-6"></div>

      <!-- ═══ EXCLUDED OPTION COLUMN COLOURS ═══ -->
      <div class="mb-4">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-webropol-gray-900">Excluded option column colours</h3>
          <p class="text-xs text-webropol-gray-500 mt-0.5">Colour rules for excluded answer option columns</p>
        </div>
        <div class="rounded-xl border border-webropol-gray-200 overflow-hidden">
          <div class="grid text-xs font-semibold text-webropol-gray-500 bg-webropol-gray-50 px-4 py-2.5 border-b border-webropol-gray-200"
               style="grid-template-columns:44px 44px 1fr 1fr 1fr 32px">
            <span>Font</span><span>Background</span><span>Min</span><span>Max</span><span>Title</span><span></span>
          </div>
          <div x-show="excludedRows.length === 0" class="px-4 py-6 text-center text-xs text-webropol-gray-400">
            No colour rules yet — click "+ Add rule" below
          </div>
          <template x-for="(row, idx) in excludedRows" :key="idx">
            <div class="grid items-center gap-2 px-4 py-2.5 border-b border-webropol-gray-100 last:border-0"
                 style="grid-template-columns:44px 44px 1fr 1fr 1fr 32px">
              <input type="color" :value="row.fontColour" @input="row.fontColour = $event.target.value"
                     class="w-8 h-8 rounded-lg border border-webropol-gray-200 cursor-pointer p-0.5">
              <input type="color" :value="row.bgColour" @input="row.bgColour = $event.target.value"
                     class="w-8 h-8 rounded-lg border border-webropol-gray-200 cursor-pointer p-0.5">
              <input type="number" x-model="row.minValue" placeholder="Min"
                     class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400">
              <input type="number" x-model="row.maxValue" placeholder="Max"
                     class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400">
              <input type="text" x-model="row.title" placeholder="Label"
                     class="w-full px-2 py-1.5 text-xs border border-webropol-gray-200 rounded-lg focus:outline-none focus:border-webropol-primary-400">
              <button @click="excludedRows.splice(idx,1)"
                      class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-webropol-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove row">
                <i class="fal fa-trash-alt text-xs"></i>
              </button>
            </div>
          </template>
        </div>
        <div class="flex items-center justify-between mt-2.5">
          <button @click="excludedRows.push({fontColour:'#000000',bgColour:'#fff7ed',minValue:'',maxValue:'',title:''})"
                  class="text-xs text-webropol-primary-600 hover:text-webropol-primary-700 font-medium flex items-center gap-1">
            <i class="fal fa-plus"></i> Add rule
          </button>
          <button x-show="excludedRows.length > 0" @click="excludedRows = []"
                  class="text-xs text-webropol-gray-400 hover:text-webropol-gray-600">
            Reset all
          </button>
        </div>
      </div><!-- /EXCLUDED -->

    </div><!-- /modal-body -->

    <!-- ── Footer ──────────────────────────────────────────────────────── -->
    <div class="border-t border-webropol-gray-100 px-6 py-4 flex justify-end gap-3 bg-webropol-gray-50 rounded-b-2xl">
      <button class="btn btn-secondary" @click="close()">Cancel</button>
      <button class="btn btn-primary" @click="save()">Save</button>
    </div>

  </div><!-- /modal-content -->
</div><!-- /modal-overlay -->
    `;
  }
}

customElements.define('webropol-chart-colours-modal', WebropolChartColoursModal);
