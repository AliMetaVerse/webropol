/**
 * ReportWidget - Outer widget frame with widget-level settings toolbar.
 * 
 * Usage:
 *   <webropol-report-widget widget-id="w1" selected="true/false">
 *     <!-- header, chart, table children go here -->
 *   </webropol-report-widget>
 * 
 * Emits:
 *   widget-select  { widgetId }
 *   widget-delete  { widgetId }
 *   widget-action  { action, widgetId }
 */

import { BaseComponent } from '../../utils/base-component.js';

export class ReportWidget extends BaseComponent {
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
    // Apply wrapper classes directly to host element
    this.classList.add(
      'relative', 'block', 'bg-white', 'rounded-2xl',
      'shadow-card', 'widget-frame', 'group', 'w-full', 'max-w-full', 'min-w-0'
    );

    // Build the settings toolbar (widget-level)
    this._toolbar = document.createElement('div');
    this._toolbar.className = 'webropol-widget-toolbar absolute right-2 top-2 z-20 group/widget-toolbar';
    this._toolbar.innerHTML = `
      <div class="ctx-bar flex flex-row-reverse items-center bg-gray-50 border border-gray-200 rounded-full shadow-sm transition-all duration-300 ease-out overflow-hidden h-9 bg-opacity-90 backdrop-blur-sm max-w-[36px] group-hover/widget-toolbar:max-w-[400px] group-hover/widget-toolbar:pl-2">
        <div class="w-9 h-full flex flex-shrink-0 items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600" title="Widget options">
          <i class="fal fa-ellipsis-v"></i>
        </div>
        <div class="flex items-center gap-1 flex-nowrap whitespace-nowrap pr-1">
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-500 hover:text-blue-600 transition-all" data-action="chart-type" title="Chart Type">
            <i class="fal fa-chart-bar"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-500 hover:text-blue-600 transition-all" data-action="settings" title="Settings">
            <i class="fal fa-cog"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-500 hover:text-blue-600 transition-all" data-action="weighting" title="Weighting">
            <i class="fal fa-balance-scale"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-500 hover:text-blue-600 transition-all" data-action="hierarchy" title="Hierarchy">
            <i class="fal fa-sitemap"></i>
          </button>
          <div class="h-4 w-px bg-gray-200 mx-1"></div>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-600 transition-all" data-action="delete" title="Delete">
            <i class="fal fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;

    this.prepend(this._toolbar);

    // Reflect initial selected state
    this._updateSelectedState(this.getBoolAttr('selected'));
  }

  _updateSelectedState(isSelected) {
    if (!this._toolbar) return;
    const bar = this._toolbar.querySelector('.ctx-bar');
    if (bar) {
      if (isSelected) {
        bar.classList.remove('max-w-[36px]', 'group-hover/widget-toolbar:max-w-[400px]', 'group-hover/widget-toolbar:pl-2');
        bar.classList.add('max-w-[400px]', 'pl-2');
      } else {
        bar.classList.remove('max-w-[400px]', 'pl-2');
        bar.classList.add('max-w-[36px]', 'group-hover/widget-toolbar:max-w-[400px]', 'group-hover/widget-toolbar:pl-2');
      }
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
        const action = btn.dataset.action;
        if (action === 'delete') {
          this.emit('widget-delete', { widgetId: this.getAttr('widget-id') });
        } else {
          this.emit('widget-action', { action, widgetId: this.getAttr('widget-id') });
        }
        return;
      }
      this.emit('widget-select', { widgetId: this.getAttr('widget-id') });
    });
  }

  // render() is intentionally a no-op — chrome is built without touching children
  render() {}
}

customElements.define('webropol-report-widget', ReportWidget);
