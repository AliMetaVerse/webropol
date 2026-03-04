/**
 * ReportTable - Table zone with table-level context toolbar.
 * Wraps the data table content (passed as children / slot).
 *
 * Usage:
 *   <webropol-report-table widget-id="w1" selected="true/false">
 *     <!-- actual table HTML here -->
 *   </webropol-report-table>
 *
 * Emits:
 *   table-select  { widgetId }
 *   table-action  { action, widgetId }   action: show-all | filter | columns
 */

import { BaseComponent } from '../../utils/base-component.js';

export class ReportTable extends BaseComponent {
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
      'table-zone', 'block', 'relative', 'p-6', 'pt-12', 'group/table'
    );

    // Build table toolbar
    this._toolbar = document.createElement('div');
    this._toolbar.className = 'webropol-table-toolbar absolute right-2 top-2 z-20 group/toolbar';
    this._toolbar.innerHTML = `
      <div class="ctx-bar flex flex-row-reverse items-center bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-300 ease-out overflow-hidden h-9 bg-opacity-90 backdrop-blur-sm max-w-[36px] group-hover/toolbar:max-w-[400px] group-hover/toolbar:pl-2">
        <div class="w-9 h-full flex flex-shrink-0 items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600" title="Table options">
          <i class="fal fa-ellipsis-v"></i>
        </div>
        <div class="flex items-center gap-1 flex-nowrap whitespace-nowrap pr-1">
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all" data-action="show-all" title="Show All Rows">
            <i class="fal fa-eye"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all" data-action="filter" title="Filter Rows">
            <i class="fal fa-filter"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all" data-action="columns" title="Manage Columns">
            <i class="fal fa-table"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all" data-action="export" title="Export Data">
            <i class="fal fa-download"></i>
          </button>
          <div class="h-4 w-px bg-gray-200 mx-1"></div>
        </div>
      </div>
    `;

    // Build "TABLE" selection label badge
    this._label = document.createElement('div');
    this._label.className = 'absolute -top-3 left-4 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded shadow-sm opacity-0 transition-opacity pointer-events-none';
    this._label.textContent = 'TABLE';

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

  bindEvents() {
    this.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        e.stopPropagation();
        this.emit('table-action', { action: btn.dataset.action, widgetId: this.getAttr('widget-id') });
        return;
      }
      e.stopPropagation();
      this.emit('table-select', { widgetId: this.getAttr('widget-id') });
    });
  }

  render() {}
}

customElements.define('webropol-report-table', ReportTable);
