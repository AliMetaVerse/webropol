import { BaseComponent } from '../../utils/base-component.js';

/**
 * PageQuickActions Component
 * 
 * Displays centered quick action buttons for page-level operations
 * Used in survey/form editors to provide quick access to common actions
 * 
 * @element webropol-page-quick-actions
 * 
 * @attr {string} actions - JSON array of action objects
 * @attr {boolean} show-label - Show "Quick Actions" label (default: true)
 * 
 * Action object structure:
 * {
 *   id: string,
 *   label: string,
 *   icon: string (FontAwesome class),
 *   color: string (primary|purple|orange|green|red)
 * }
 * 
 * @fires action-click - Fired when an action button is clicked
 * 
 * @example
 * <webropol-page-quick-actions 
 *   actions='[
 *     {"id":"add-question","label":"Add Question","icon":"fal fa-plus-circle","color":"primary"},
 *     {"id":"add-text","label":"Add Text/Media","icon":"fal fa-text","color":"purple"},
 *     {"id":"add-break","label":"Add Page Break","icon":"fal fa-cut","color":"orange"}
 *   ]'
 * ></webropol-page-quick-actions>
 */
export class PageQuickActions extends BaseComponent {
  static get observedAttributes() {
    return ['actions', 'show-label'];
  }

  init() {
    this.actions = this.getActions();
    this.showLabel = this.getBoolAttr('show-label', true);
  }

  getActions() {
    const actionsAttr = this.getAttr('actions');
    if (!actionsAttr) {
      // Default actions
      return [
        { id: 'add-question', label: 'Add Question', icon: 'fal fa-plus-circle', color: 'primary' },
        { id: 'add-text', label: 'Add Text/Media', icon: 'fal fa-text', color: 'purple' },
        { id: 'add-break', label: 'Add Page Break', icon: 'fal fa-cut', color: 'orange' }
      ];
    }

    try {
      return JSON.parse(actionsAttr);
    } catch (e) {
      console.error('Invalid actions JSON:', e);
      return [];
    }
  }

  getColorClasses(color) {
    const colorMap = {
      primary: {
        icon: 'text-webropol-primary-500 group-hover:text-webropol-primary-600',
        border: 'hover:border-webropol-primary-300',
        text: 'hover:text-webropol-primary-700'
      },
      purple: {
        icon: 'text-purple-500 group-hover:text-purple-600',
        border: 'hover:border-purple-300',
        text: 'hover:text-purple-700'
      },
      orange: {
        icon: 'text-orange-500 group-hover:text-orange-600',
        border: 'hover:border-orange-300',
        text: 'hover:text-orange-700'
      },
      green: {
        icon: 'text-green-500 group-hover:text-green-600',
        border: 'hover:border-green-300',
        text: 'hover:text-green-700'
      },
      red: {
        icon: 'text-red-500 group-hover:text-red-600',
        border: 'hover:border-red-300',
        text: 'hover:text-red-700'
      }
    };

    return colorMap[color] || colorMap.primary;
  }

  render() {
    const actions = this.getActions();
    
    this.innerHTML = `
      <div class="mt-8 mb-8 relative">
        <!-- Dashed separator line -->
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-dashed border-webropol-gray-300"></div>
        </div>
        
        <!-- Centered action buttons -->
        <div class="relative flex justify-center">
          <div class="bg-webropol-gray-50 px-6 py-3 rounded-full">
            <div class="flex items-center gap-3 flex-wrap justify-center">
              ${this.showLabel ? `
                <span class="text-xs font-medium text-webropol-gray-500 uppercase tracking-wider">
                  Quick Actions
                </span>
                <div class="h-4 w-px bg-webropol-gray-300"></div>
              ` : ''}
              
              ${actions.map(action => {
                const colors = this.getColorClasses(action.color);
                return `
                  <button 
                    type="button" 
                    data-action-id="${action.id}"
                    class="group inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-webropol-gray-50 border border-webropol-gray-200 ${colors.border} rounded-lg text-sm text-webropol-gray-600 ${colors.text} transition-all duration-200"
                  >
                    <i class="${action.icon} ${colors.icon}"></i>
                    <span>${action.label}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const buttons = this.querySelectorAll('[data-action-id]');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const actionId = button.getAttribute('data-action-id');
        const action = this.getActions().find(a => a.id === actionId);
        
        this.emit('action-click', { 
          actionId, 
          action,
          originalEvent: e 
        });
      });
    });
  }
}

customElements.define('webropol-page-quick-actions', PageQuickActions);
