import { BaseComponent } from '../../utils/base-component.js';

export class WebropolDashboardConfig extends BaseComponent {
  static get observedAttributes() {
    return ['actions', 'size', 'variant'];
  }

  init() {
    this.state = {
      activeAction: null,
      menuOpen: false,
      currentMenu: 'main' // 'main' or action.id for submenu
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.bindEvents();
  }

  render() {
    const rawActions = this.getAttr('actions', '[]');
    const size = this.getAttr('size', 'medium'); // small, medium, large
    const variant = this.getAttr('variant', 'default'); // default, compact
    
    let actions = [];
    try {
      actions = JSON.parse(rawActions);
    } catch (e) {
      console.error('Invalid actions JSON:', e);
    }

    // Default action set
    const defaultActions = [
      { 
        id: 'chart', 
        icon: 'fal fa-chart-column', 
        label: 'Chart type', 
        children: [
          { 
            label: 'Bars', 
            variants: [
                { id: 'bars', icon: 'fal fa-chart-bar', title: 'Bars' },
                { id: 'bars_3d', icon: 'fal fa-chart-bar text-orange-500', title: '3D Bars' }
            ]
          },
          { 
            label: 'Stacked bars', 
            variants: [
                { id: 'stacked_bars', icon: 'fal fa-bars-progress', title: 'Stacked bars' },
                { id: 'stacked_bars_3d', icon: 'fal fa-bars-progress text-orange-500', title: '3D Stacked bars' }
            ]
          },
          { 
            label: 'Columns', 
            variants: [
                { id: 'columns', icon: 'fal fa-chart-column', title: 'Columns' },
                { id: 'columns_3d', icon: 'fal fa-chart-column text-orange-500', title: '3D Columns' }
            ]
          },
          { 
            label: 'Stacked columns', 
            variants: [
                { id: 'stacked_columns', icon: 'fal fa-chart-bar rotate-90', title: 'Stacked columns' },
                { id: 'stacked_columns_3d', icon: 'fal fa-chart-bar rotate-90 text-orange-500', title: '3D Stacked columns' }
            ]
          },
          { 
            label: 'Pies', 
            variants: [
                { id: 'pie', icon: 'fal fa-chart-pie', title: 'Pie' },
                { id: 'pie_3d', icon: 'fal fa-chart-pie text-orange-500', title: '3D Pie' }
            ]
          },
          { 
            label: 'Lines / Lines with points', 
            variants: [
                { id: 'lines', icon: 'fal fa-chart-line', title: 'Lines' },
                { id: 'lines_points', icon: 'fal fa-chart-area', title: 'Lines with points' } // Using area temporarily as points variant
            ]
          },
          { 
            label: 'Vertical lines / Lines with points', 
            variants: [
                { id: 'vertical_lines', icon: 'fal fa-wave-square', title: 'Vertical lines' },
                { id: 'vertical_lines_points', icon: 'fal fa-wave-square', title: 'Vertical lines with points' }
            ]
          },
          { id: 'thermometer', icon: 'fal fa-thermometer-half', label: 'Thermometer' },
          { id: 'timeline', icon: 'fal fa-timeline', label: 'Timeline' },
          { 
            label: 'NPS / NPS Weekly', 
            variants: [
                { id: 'nps', icon: 'fal fa-battery-half', title: 'NPS' },
                { id: 'nps_weekly', icon: 'fal fa-chart-column', title: 'NPS Weekly' }
            ]
          },
          { 
              label: 'Meters', 
              variants: [
                  { id: 'meters', icon: 'fal fa-gauge-high', title: 'Meters' },
                  { id: 'meters_arc', icon: 'fal fa-gauge', title: 'Arc Meter' }
              ]
          },
          { id: 'spider', icon: 'fal fa-chart-radar', label: 'Spider chart' },
          { 
            label: 'Box Plot',
            variants: [
                { id: 'boxplot', icon: 'fal fa-box', title: 'Box Plot' },
                { id: 'boxplot_dots', icon: 'fal fa-box-open', title: 'Box Plot Dots' } // Placeholder
            ] 
          },
          { id: 'top_bottom', icon: 'fal fa-arrow-down-wide-short', label: 'Top and Bottom' }
        ]
      },
      { 
        id: 'settings', 
        icon: 'fal fa-cog', 
        label: 'Settings',
        children: [
            { id: 'add_options', icon: 'fa-light fa-grid-2-plus', label: 'Add and edit new options' },
            { id: 'configure_index', icon: 'fal fa-table-cells', label: 'Define Index Colours and Legend Table' },
            { id: 'toggle_viz', icon: 'fal fa-eye-slash', label: 'Show/hide chart, table, options or scale values' },
            { id: 'fonts', icon: 'fal fa-font', label: 'Fonts' },
            { id: 'combine_rename', icon: 'fal fa-chart-bar', label: 'Combine and rename columns' },
            { id: 'reset', icon: 'fal fa-history', label: 'Reset to default settings' }
        ]
      },
      { id: 'copy', icon: 'fal fa-copy', label: 'Copy' },
      { id: 'filter', icon: 'fal fa-filter', label: 'Filter' },
      { id: 'group', icon: 'fa-light fa-object-group', label: 'Compare groups' },
      { id: 'delete', icon: 'fa-light fa-trash-can', label: 'Delete' }
    ];

    const allActions = actions.length > 0 ? actions : defaultActions;

    // Determine current actions to display
    let visibleActions = allActions;
    let menuTitle = null;
    let isSubmenu = false;

    if (this.state.currentMenu !== 'main') {
        const parentAction = allActions.find(a => a.id === this.state.currentMenu);
        if (parentAction && parentAction.children) {
            visibleActions = parentAction.children;
            menuTitle = parentAction.label;
            isSubmenu = true;
        }
    }

    const menuClasses = this.state.menuOpen 
        ? 'absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-webropol-gray-200 py-2 z-50' 
        : 'hidden absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-webropol-gray-200 py-2 z-50';

    this.innerHTML = `
      <div class="relative">
        <button type="button" 
                class="config-toggle-btn inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-webropol-gray-700 bg-white border border-webropol-gray-300 rounded-lg hover:bg-webropol-gray-50 focus:outline-none focus:ring-2 focus:ring-webropol-primary-500 focus:ring-offset-1 transition-all"
                aria-haspopup="true"
                aria-expanded="${this.state.menuOpen}">
          <i class="fa-light fa-square-sliders"></i>
          <span>Config</span>
          <i class="fal fa-chevron-down text-xs transition-transform duration-200 ${this.state.menuOpen ? 'rotate-180' : ''}"></i>
        </button>
        
        <div class="config-menu ${menuClasses}"
             role="menu"
             aria-orientation="vertical">
          
          ${isSubmenu ? `
            <div class="flex items-center gap-2 px-4 py-2 border-b border-webropol-gray-200 mb-2">
                <button type="button" class="back-btn text-webropol-gray-500 hover:text-webropol-gray-700 transition-colors">
                    <i class="fal fa-arrow-left"></i>
                </button>
                <span class="font-semibold text-sm text-webropol-gray-900">${menuTitle}</span>
            </div>
          ` : ''}

          ${visibleActions.map((action, index) => {
            const isDanger = action.id === 'delete';
            const hasChildren = !!action.children;
            const hasVariants = !!action.variants;
            const needsSeparator = isDanger && index > 0;
            const isChartContext = this.state.currentMenu === 'chart';
            
            // Render row with variants
            if (hasVariants) {
                return `
                  ${needsSeparator ? '<div class="border-t border-webropol-gray-200 my-1"></div>' : ''}
                  <div class="w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 transition-colors text-left" role="menuitem">
                     <div class="flex items-center w-full">
                        <!-- Fixed width container for icons to align text -->
                        <div class="flex items-center gap-1 mr-3 flex-shrink-0 w-16">
                            ${action.variants.map(v => `
                                <button type="button" 
                                        class="variant-btn w-7 h-7 flex items-center justify-center rounded hover:bg-webropol-primary-100 text-webropol-gray-600 hover:text-webropol-primary-700 transition-colors border border-transparent hover:border-webropol-primary-300" 
                                        data-action="${v.id}"
                                        title="${v.title || ''}">
                                    <i class="${v.icon} text-lg"></i>
                                </button>
                            `).join('')}
                        </div>
                        <span class="truncate font-medium">${action.label}</span>
                     </div>
                  </div>
                `;
            }

            // Render standard item with icon button alignment
            const itemClass = isDanger 
              ? 'config-menu-item w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left group'
              : 'config-menu-item w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-webropol-gray-700 hover:bg-webropol-gray-50 transition-colors text-left group';
            
            return `
              ${needsSeparator ? '<div class="border-t border-webropol-gray-200 my-1"></div>' : ''}
              <div class="${itemClass} cursor-pointer"
                      data-action="${action.id}"
                      data-has-children="${hasChildren}"
                      role="menuitem"
                      tabindex="0">
                <div class="flex items-center w-full">
                    <div class="flex items-center gap-1 mr-3 flex-shrink-0 ${isChartContext ? 'w-16' : 'w-7'}">
                        ${action.icon ? (isChartContext ? `
                            <button type="button" 
                                    class="variant-btn w-7 h-7 flex items-center justify-center rounded hover:bg-webropol-primary-100 text-webropol-gray-600 hover:text-webropol-primary-700 transition-colors border border-transparent hover:border-webropol-primary-300"
                                    data-action="${action.id}"
                                    title="${action.label || ''}">
                                <i class="${action.icon} text-lg"></i>
                            </button>
                        ` : `
                            <div class="w-7 h-7 flex items-center justify-center ${isDanger ? 'text-inherit' : 'text-webropol-gray-600'}">
                                <i class="${action.icon} text-lg"></i>
                            </div>
                        `) : '<div class="w-7 h-7"></div>'}
                    </div>
                    <span class="font-medium truncate">${action.label || action.tooltip || action.id}</span>
                </div>
                ${hasChildren ? '<i class="fal fa-chevron-right text-xs text-webropol-gray-400"></i>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const toggleBtn = this.querySelector('.config-toggle-btn');
    const menuItems = this.querySelectorAll('.config-menu-item[role="menuitem"]');
    const variantBtns = this.querySelectorAll('.variant-btn:not(.pointer-events-none)');
    const backBtn = this.querySelector('.back-btn');

    // Toggle menu
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setState({ 
          menuOpen: !this.state.menuOpen,
          currentMenu: 'main' // Reset to main when toggling
      });
    });

    // Menu item clicks (Standard rows)
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const actionId = item.dataset.action;
        const hasChildren = item.dataset.hasChildren === 'true';

        if (hasChildren) {
            this.setState({ currentMenu: actionId });
        } else {
            this.emit('action-click', { action: actionId });
            this.setState({ menuOpen: false, currentMenu: 'main' });
        }
      });
    });

    // Variant button clicks
    variantBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const actionId = btn.dataset.action;
            this.emit('action-click', { action: actionId });
            this.setState({ menuOpen: false, currentMenu: 'main' });
        });
    });

    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setState({ currentMenu: 'main' });
        });
    }

    if (!this.documentListenersAttached) {
      this.documentListenersAttached = true;
      
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target) && this.state.menuOpen) {
           this.setState({ menuOpen: false, currentMenu: 'main' });
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.menuOpen) {
          this.setState({ menuOpen: false, currentMenu: 'main' });
          const btn = this.querySelector('.config-toggle-btn');
          if(btn) btn.focus();
        }
      });
    }
  }
}

customElements.define('webropol-dashboard-config', WebropolDashboardConfig);
