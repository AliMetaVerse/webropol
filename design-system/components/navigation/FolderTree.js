import { BaseComponent } from '../../utils/base-component.js';

export class WebropolFolderTree extends BaseComponent {
  static get observedAttributes() {
    return ['items', 'selected-id', 'show-actions'];
  }

  init() {
    this.state = {
      items: [],
      expandedIds: new Set(),
      selectedId: null,
      showActions: false
    };
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Parse initial items if present
    const itemsAttr = this.getAttribute('items');
    if (itemsAttr) {
      try {
        this.state.items = JSON.parse(itemsAttr);
        // Expand root folders by default if needed, or leave collapsed
      } catch (e) {
        console.error('Error parsing items attribute:', e);
      }
    }

    this.state.selectedId = this.getAttribute('selected-id');
    this.state.showActions = this.hasAttribute('show-actions');
    
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'items') {
      try {
        this.state.items = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Error parsing items attribute:', e);
      }
    } else if (name === 'selected-id') {
      this.state.selectedId = newValue;
      // Re-render to update selection styles
      this.render(); 
    } else if (name === 'show-actions') {
      this.state.showActions = newValue !== null;
      this.render();
    }
  }

  // Recursive render function
  renderFolder(folder, level = 0) {
    const isExpanded = this.state.expandedIds.has(String(folder.id));
    const isSelected = String(this.state.selectedId) === String(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    
    // Indentation class based on level (mimicking the ml-4, ml-6 pattern)
    // Level 0: no margin
    // Level 1: ml-4
    // Level 2: ml-6
    // We'll apply this to the children container
    
    // Icon logic
    let iconClass = 'fal fa-folder text-webropol-primary-600';
    if (folder.name === 'Organisation Library') iconClass = 'fal fa-building text-webropol-primary-600';
    else if (folder.name === 'My Templates') iconClass = 'fal fa-file-alt text-webropol-primary-600';

    // Selection styles
    const activeClasses = 'bg-gradient-to-r from-webropol-primary-100 to-webropol-primary-100 text-webropol-primary-800 ring-2 ring-webropol-primary-300';
    const defaultClasses = 'hover:bg-webropol-gray-50 text-webropol-gray-700';
    const containerClasses = isSelected ? activeClasses : defaultClasses;

    return `
      <div class="folder-item select-none relative group">
        <div class="flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${containerClasses}"
             data-id="${folder.id}"
             role="treeitem"
             aria-expanded="${isExpanded}"
             aria-selected="${isSelected}">
             
          <!-- Expand/Collapse Icon -->
          <div class="folder-toggle w-5 flex justify-center mr-1 ${hasChildren ? 'visible' : 'invisible'}" data-action="toggle" data-id="${folder.id}">
             <i class="fal fa-chevron-right text-xs text-webropol-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}"></i>
          </div>

          <!-- Folder Icon -->
          <i class="${iconClass} mr-2"></i>

          <!-- Folder Name -->
          <span class="flex-1 font-medium truncate text-sm">${folder.name}</span>

          <!-- Count Badge (optional in data) -->
          ${folder.count !== undefined ? `<span class="bg-webropol-gray-200 text-webropol-gray-600 text-xs px-2 py-0.5 rounded-full font-medium ml-2">${folder.count}</span>` : ''}

          <!-- Context Menu / Actions -->
          ${this.state.showActions ? `
            <button class="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded text-webropol-gray-500 transition-opacity ml-2"
                    data-action="context-menu" 
                    data-id="${folder.id}"
                    aria-label="Folder actions">
              <i class="fal fa-ellipsis-v"></i>
            </button>
          ` : ''}
        </div>

        <!-- CHILDREN -->
        ${hasChildren && isExpanded ? `
          <div class="folder-children ml-4 border-l border-webropol-gray-100 pl-1 mt-1 space-y-0.5" role="group">
            ${folder.children.map(child => this.renderFolder(child, level + 1)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    if (!this.state.items || this.state.items.length === 0) {
      this.innerHTML = `
        <div class="p-4 text-center text-webropol-gray-500 text-sm">
          No folders found
        </div>
      `;
      return;
    }

    this.innerHTML = `
      <div class="flex flex-col space-y-0.5" role="tree">
        ${this.state.items.map(folder => this.renderFolder(folder)).join('')}
      </div>
    `;
    
    // Re-bind events after render since DOM changed
    this.bindDynamicEvents();
  }

  bindEvents() {
    // Initial static binding if needed
    // But mostly we listen to clicks on the container and delegate
    this.addEventListener('click', (e) => {
      // Find closest element with data attributes
      const toggleBtn = e.target.closest('[data-action="toggle"]');
      const actionBtn = e.target.closest('[data-action="context-menu"]');
      const folderItem = e.target.closest('[data-id]');

      if (toggleBtn) {
        e.stopPropagation();
        const id = toggleBtn.dataset.id;
        this.toggleFolder(id);
      } else if (actionBtn) {
        e.stopPropagation();
        const id = actionBtn.dataset.id;
        this.emit('folder-action', { id, originalEvent: e });
      } else if (folderItem) {
        const id = folderItem.dataset.id;
        
        // If clicking the row but not the specific toggle button, 
        // we might still want to select it.
        // If it has children, should we expand? 
        // Standard tree behavior: click selects, chevron expands.
        // Webropol behavior: verify library.html.
        // library.html: <div @click="toggleFolder(folder.id)"> which toggles selection AND expansion in some logic, 
        // but let's separate for better UX unless specified.
        // "if (this.selectedFolderId === folderId) { ... } else { this.selectedFolderId = folderId; }"
        // It seems clicking selects it. 
        
        this.selectFolder(id);
      }
    });
  }

  bindDynamicEvents() {
    // Nothing specific needed here as we use delegation in bindEvents
  }

  toggleFolder(id) {
    if (this.state.expandedIds.has(String(id))) {
      this.state.expandedIds.delete(String(id));
    } else {
      this.state.expandedIds.add(String(id));
    }
    this.render();
    this.emit('folder-toggle', { id, expanded: this.state.expandedIds.has(String(id)) });
  }

  selectFolder(id) {
    if (this.state.selectedId !== id) {
      this.state.selectedId = id;
      this.setAttribute('selected-id', id);
      this.render(); // Update visual state
      this.emit('folder-select', { id });
    } else {
        // Double click or re-click behavior?
        // library.html toggles expansion on re-click of same folder sometimes, or deselects.
        // We'll just keep it selected.
    }
  }
}

customElements.define('webropol-folder-tree', WebropolFolderTree);
