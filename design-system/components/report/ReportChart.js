/**
 * ReportChart - Chart zone with chart-level context toolbar.
 * Wraps the visual chart content (passed as children / slot).
 *
 * Usage:
 *   <webropol-report-chart widget-id="w1" selected="true/false">
 *     <!-- actual chart visual HTML here -->
 *   </webropol-report-chart>
 *
 * Emits:
 *   chart-select  { widgetId }
 *   chart-action  { action, widgetId }   action: sort | swap | colors | chart-bar | chart-pie
 */

import { BaseComponent } from '../../utils/base-component.js';

export class ReportChart extends BaseComponent {
  static get observedAttributes() {
    return ['widget-id', 'selected'];
  }

  connectedCallback() {
    this._buildChrome();
    this.bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'selected') {
      const isSelected = newVal !== null && newVal !== 'false';
      this._updateSelectedState(isSelected);
    }
  }

  _buildChrome() {
    // Apply zone classes to host
    this.classList.add(
      'chart-zone', 'block', 'relative', 'p-6', 'pt-12', 'group/chart', 'w-full', 'max-w-full', 'min-w-0'
    );

    // Build chart toolbar
    this._toolbar = document.createElement('div');
    this._toolbar.className = 'webropol-chart-toolbar absolute right-2 top-2 z-20 group/toolbar';
    this._toolbar.innerHTML = `
      <div class="ctx-bar flex flex-row-reverse items-center bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-300 ease-out overflow-hidden h-9 bg-opacity-90 backdrop-blur-sm max-w-[36px] group-hover/toolbar:max-w-[400px] group-hover/toolbar:pl-2">
        <div class="w-9 h-full flex flex-shrink-0 items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600" title="Chart options">
          <i class="fal fa-ellipsis-v"></i>
        </div>
        <div class="flex items-center gap-1 flex-nowrap whitespace-nowrap pr-1">
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all" data-action="sort" title="Sort">
            <i class="fal fa-sort-amount-down"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all" data-action="swap" title="Swap Axes">
            <i class="fal fa-exchange-alt"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all" data-action="colors" title="Colors">
            <i class="fal fa-palette"></i>
          </button>
          <div class="flex bg-gray-100 p-0.5 rounded-lg ml-1">
            <button class="chart-type-btn w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-blue-600" data-action="chart-bar" title="Bar Chart">
              <i class="fal fa-chart-bar"></i>
            </button>
            <button class="chart-type-btn w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-blue-600 transition-colors" data-action="chart-pie" title="Pie Chart">
              <i class="fal fa-chart-pie"></i>
            </button>
          </div>
          <div class="h-4 w-px bg-gray-200 mx-1"></div>
        </div>
      </div>
    `;

    // Build "CHART" selection label badge
    this._label = document.createElement('div');
    this._label.className = 'absolute -top-3 left-4 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded shadow-sm opacity-0 transition-opacity pointer-events-none';
    this._label.textContent = 'CHART';

    this.prepend(this._label);
    this.prepend(this._toolbar);

    // Reflect initial state
    this._updateSelectedState(this.getBoolAttr('selected'));
  }

  _updateSelectedState(isSelected) {
    if (!this._toolbar) return;
    const bar = this._toolbar.querySelector('.ctx-bar');
    if (bar) {
      if (isSelected) {
        bar.classList.remove('max-w-[36px]', 'group-hover/toolbar:max-w-[400px]', 'group-hover/toolbar:pl-2');
        bar.classList.add('max-w-[400px]', 'pl-2');
      } else {
        bar.classList.remove('max-w-[400px]', 'pl-2');
        bar.classList.add('max-w-[36px]', 'group-hover/toolbar:max-w-[400px]', 'group-hover/toolbar:pl-2');
      }
    }
    if (this._label) {
      this._label.style.opacity = isSelected ? '1' : '0';
    }
    if (isSelected) {
      this.classList.add('selected');
    } else {
      this.classList.remove('selected');
    }
  }

  /** Switch the active chart-type button highlight */
  setActiveChartType(type) {
    if (!this._toolbar) return;
    this._toolbar.querySelectorAll('.chart-type-btn').forEach(btn => {
      const isActive = btn.dataset.action === `chart-${type}`;
      btn.classList.toggle('bg-white', isActive);
      btn.classList.toggle('shadow-sm', isActive);
      btn.classList.toggle('text-blue-600', isActive);
      btn.classList.toggle('text-gray-500', !isActive);
    });
  }

  bindEvents() {
    this.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        e.stopPropagation();
        const action = btn.dataset.action;
        this.emit('chart-action', { action, widgetId: this.getAttr('widget-id') });
        return;
      }
      e.stopPropagation();
      this.emit('chart-select', { widgetId: this.getAttr('widget-id') });
    });
  }

  render() {}
}

customElements.define('webropol-report-chart', ReportChart);
