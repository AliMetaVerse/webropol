import { BaseComponent } from '../../utils/base-component.js';
import '../../menus/ContextMenu.js';

export class WebropolFolderTree extends BaseComponent {
  static get observedAttributes() {
    return ['items', 'selected-id', 'show-actions'];
  }

  init() {
    this.state = {
      items: [],
      expandedIds: new Set(),
      selectedId: null,
      showActions: false,
      menu: {
        open: false,
        x: 0,
        y: 0,
        folderId: null
      }
    };
    
    this.boundCloseMenu = this.closeMenu.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.boundCloseMenu);
    
    const itemsAttr = this.getAttribute('items');
    if (itemsAttr) {
      try {
        this.state.items = JSON.parse(itemsAttr);
      } catch (e) {
        console.error('Error parsing items attribute:', e);
      }
    }

    this.state.selectedId = this.getAttribute('selected-id');
    this.state.showActions = this.hasAttribute('show-actions');
    
    this.render();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.boundCloseMenu);
  }

  closeMenu(e) {
    if (this.state.menu.open) {
      // Check if click is inside the menu
      const menuContainer = this.querySelector('[data-menu-container]');
      if (menuContainer && menuContainer.contains(e.target)) {
        return;
      }

      this.state.menu.open = false;
      this.render();
    }
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
            <button class="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded text-webropol-gray-500 transition-opacity ml-2 ${this.state.menu.open && String(this.state.menu.folderId) === String(folder.id) ? 'opacity-100' : ''}"
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
    const treeContent = (!this.state.items || this.state.items.length === 0) ? `
        <div class="p-4 text-center text-webropol-gray-500 text-sm">
          No folders found
        </div>
      ` : `
      <div class="flex flex-col space-y-0.5" role="tree">
        ${this.state.items.map(folder => this.renderFolder(folder)).join('')}
      </div>
    `;

    const menuItems = [
      {id: 'rename', label: 'Rename folder', icon: 'fal fa-pen'},
      {id: 'move', label: 'Move to a folder', icon: 'fal fa-folder-tree'},
      {id: 'add-sub', label: 'Add a subfolder', icon: 'fal fa-folder-plus'},
      {id: 'rights', label: 'Folder rights', icon: 'fal fa-key'},
      {id: 'properties', label: 'Folder properties', icon: 'fal fa-sliders-h'},
      {id: 'delete', label: 'Delete', icon: 'fal fa-trash-alt', variant: 'danger'}
    ];

    const menuContent = this.state.menu.open ? `
      <div class="fixed z-50 text-left"
           style="top: ${this.state.menu.y}px; left: ${this.state.menu.x}px"
           data-menu-container>
        <webropol-context-menu
          width="md"
          items='${JSON.stringify(menuItems)}'
        ></webropol-context-menu>
      </div>
    ` : '';

    this.innerHTML = treeContent + menuContent;
    this.bindDynamicEvents();
  }

  bindDynamicEvents() {
    const contextMenu = this.querySelector('webropol-context-menu');
    if (contextMenu) {
        contextMenu.addEventListener('item-click', (e) => {
            const action = e.detail.id;
            this.emit('folder-menu-action', { 
                action: action, 
                folderId: this.state.menu.folderId 
            });
            this.state.menu.open = false;
            this.render();
        });
    }
  }

  bindEvents() {
    this.addEventListener('click', (e) => {
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
        this.openMenu(id, actionBtn);
      } else if (folderItem) {
        const id = folderItem.dataset.id;
        this.selectFolder(id);
      }
    });
  }

  openMenu(folderId, triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      let x = rect.right + 5;
      let y = rect.top;
      
      if (x + 250 > window.innerWidth) {
          x = rect.left - 255;
      }
      
      // Keep within vertical bounds
      if (y + 300 > window.innerHeight) {
          y = window.innerHeight - 310;
      }

      this.state.menu = {
          open: true,
          x,
          y,
          folderId
      };
      this.render();
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
      this.render();
      this.emit('folder-select', { id });
    }
  }
}

customElements.define('webropol-folder-tree', WebropolFolderTree);
