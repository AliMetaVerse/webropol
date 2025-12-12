import { BaseComponent } from '../../utils/base-component.js';

/**
 * SurveyHelperToolbar Component
 * 
 * Unified helper toolbar for survey pages (Edit, Collect, Follow up, Report, AI Text Analysis)
 * Displays survey status badge, edit button, and contextual more menu
 * 
 * @attributes
 * - survey-name: Survey title (default: "Customer Sat...")
 * - survey-id: Survey ID (default: "Fin348267")
 * - active-page: Current page context - "edit", "collect", "follow", "report", "aita" (default: "edit")
 * - access-level: User access level - "admin", "edit", "view" (default: "edit")
 * - survey-status: Survey status - "draft", "active", "closed", "archived" (default: "draft")
 * - hide-edit-btn: Hide the edit button (optional boolean)
 * - menu-items: Custom menu items JSON array (optional)
 */
export class SurveyHelperToolbar extends BaseComponent {
  static get observedAttributes() {
    return ['survey-name', 'survey-id', 'active-page', 'access-level', 'survey-status', 'hide-edit-btn', 'menu-items'];
  }

  init() {
    this.menuState = {
      isOpen: false,
      textEditorEnabled: false,
      iconsOnly: false
    };
    
    // Load current status from localStorage
    this.currentStatus = this.getAttr('survey-status', 'draft');
    this.loadStatusFromStorage();
    
    // Listen for status changes
    window.addEventListener('survey-status-changed', (e) => {
      this.handleStatusChange(e.detail.status);
    });
  }

  loadStatusFromStorage() {
    try {
      const storedStatus = localStorage.getItem('webropol_survey_status');
      if (storedStatus) {
        const statusMap = {
          'Open': 'active',
          'Draft': 'draft',
          'Close': 'closed'
        };
        this.currentStatus = statusMap[storedStatus] || this.currentStatus;
      }
    } catch (e) {
      console.warn('Could not load status from storage:', e);
    }
  }

  handleStatusChange(newStatus) {
    const statusMap = {
      'Open': 'active',
      'Draft': 'draft',
      'Close': 'closed'
    };
    this.currentStatus = statusMap[newStatus] || this.currentStatus;
    this.render();
    this.bindEvents();
  }

  getStatusConfig(status) {
    const configs = {
      draft: {
        text: 'Draft',
        bgClass: 'bg-gradient-to-r from-webropol-gray-50 to-white',
        borderClass: 'border-webropol-gray-200',
        iconClass: 'bg-webropol-gray-100 text-webropol-gray-700',
        textClass: 'text-webropol-gray-600'
      },
      active: {
        text: 'Active',
        bgClass: 'bg-gradient-to-r from-green-50 to-white',
        borderClass: 'border-green-200',
        iconClass: 'bg-green-100 text-green-700',
        textClass: 'text-green-600'
      },
      closed: {
        text: 'Closed',
        bgClass: 'bg-gradient-to-r from-orange-50 to-white',
        borderClass: 'border-orange-200',
        iconClass: 'bg-orange-100 text-orange-700',
        textClass: 'text-orange-600'
      },
      archived: {
        text: 'Archived',
        bgClass: 'bg-gradient-to-r from-purple-50 to-white',
        borderClass: 'border-purple-200',
        iconClass: 'bg-purple-100 text-purple-700',
        textClass: 'text-purple-600'
      }
    };
    return configs[status] || configs.draft;
  }

  getAccessBadge(accessLevel) {
    const badges = {
      admin: {
        text: 'Admin',
        bgClass: 'bg-green-100 text-green-700 border-green-200'
      },
      edit: {
        text: 'Edit Rights',
        icon: 'fa-pencil',
        bgClass: 'bg-green-100 text-green-700 border-green-200'
      },
      view: {
        text: 'View Only',
        icon: 'fa-eye',
        bgClass: 'bg-blue-100 text-blue-700 border-blue-200'
      }
    };
    return badges[accessLevel] || badges.edit;
  }

  getDefaultMenuItems(page) {
    // Common items for all pages
    const commonItems = {
      accessRights: true,
      surveyId: true,
      textEditor: page === 'edit' || page === 'aita',
      logRightsProps: true,
      iconsOnly: true,
      questionMode: page === 'edit',
      undo: page === 'edit' || page === 'report' || page === 'aita',
      redo: page === 'edit' || page === 'report' || page === 'aita'
    };

    return commonItems;
  }

  buildMenuContent() {
    const surveyId = this.getAttr('survey-id', 'Fin348267');
    const accessLevel = this.getAttr('access-level', 'edit');
    const activePage = this.getAttr('active-page', 'edit');
    const accessBadge = this.getAccessBadge(accessLevel);
    const menuItems = this.getDefaultMenuItems(activePage);

    // Try to parse custom menu items if provided
    const customMenuAttr = this.getAttr('menu-items');
    let customMenu = null;
    if (customMenuAttr) {
      try {
        customMenu = JSON.parse(customMenuAttr);
      } catch (e) {
        console.warn('Invalid menu-items JSON:', e);
      }
    }

    let html = '';

    // Survey Access Rights
    if (menuItems.accessRights) {
      html += `
        <div class="px-4 py-3 border-b border-webropol-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <i class="fal fa-shield-check text-green-600"></i>
              <span class="text-xs font-semibold text-green-700 uppercase tracking-wide">Survey Access Rights</span>
            </div>
            <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${accessBadge.bgClass} border">
              ${accessBadge.icon ? `<i class="fal ${accessBadge.icon} mr-1"></i>` : ''}
              ${accessBadge.text}
            </div>
          </div>
        </div>
      `;
    }

    // Survey ID
    if (menuItems.surveyId) {
      html += `
        <div class="px-4 py-3 border-b border-webropol-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-medium text-webropol-gray-600 mb-1">Survey ID:</div>
              <div class="text-sm font-semibold text-webropol-gray-900">${surveyId}</div>
            </div>
            <button onclick="navigator.clipboard.writeText('${surveyId}')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-webropol-gray-100 text-webropol-gray-500 hover:text-webropol-primary-600 transition" title="Copy Survey ID">
              <i class="fal fa-copy"></i>
            </button>
          </div>
        </div>
      `;
    }

    // Text Editor Toggle
    if (menuItems.textEditor) {
      const sizeClass = activePage === 'edit' ? 'text-base px-5 py-3.5' : 'text-sm px-4 py-2.5';
      html += `
        <div class="flex items-center justify-between ${sizeClass} hover:bg-webropol-gray-50">
          <div class="flex items-center gap-3 flex-1">
            <i class="fal fa-pen-to-square w-5 text-center text-webropol-gray-500"></i>
            <span class="text-webropol-gray-700">Text Editor [disabled]</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer text-editor-toggle">
            <div class="w-9 h-5 bg-webropol-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      `;
    }

    // Log, rights and properties
    if (menuItems.logRightsProps) {
      const sizeClass = activePage === 'edit' ? 'text-base px-5 py-3.5' : 'text-sm px-4 py-2.5';
      html += `
        <button class="w-full ${sizeClass} text-left text-webropol-gray-700 hover:bg-webropol-gray-50 flex items-center gap-3 menu-close-trigger">
          <i class="fal fa-clipboard-list w-5 text-center text-webropol-gray-500"></i>
          <span>Log, rights and properties</span>
        </button>
      `;
    }

    // Display Icons Only Toggle
    if (menuItems.iconsOnly) {
      const sizeClass = activePage === 'edit' ? 'text-base px-5 py-3.5' : 'text-sm px-4 py-2.5';
      html += `
        <div class="flex items-center justify-between ${sizeClass} hover:bg-webropol-gray-50">
          <div class="flex items-center gap-3 flex-1">
            <i class="fal fa-eye-slash w-5 text-center text-webropol-gray-500"></i>
            <span class="text-webropol-gray-700">Display Icons Only</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer icons-only-toggle">
            <div class="w-9 h-5 bg-webropol-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      `;
    }

    // Question Mode (Edit page only)
    if (menuItems.questionMode) {
      html += `
        <button class="w-full px-5 py-3.5 text-left text-base text-webropol-gray-700 hover:bg-webropol-gray-50 flex items-center gap-3 menu-close-trigger" onclick="typeof openQuestionModeModal === 'function' && openQuestionModeModal()">
          <i class="fal fa-plus-circle w-5 text-center text-webropol-gray-500"></i>
          <span>Question Mode</span>
        </button>
      `;
    }

    // Separator before undo/redo
    if (menuItems.undo || menuItems.redo) {
      html += `<div class="border-t border-webropol-gray-100 my-1"></div>`;
    }

    // Undo
    if (menuItems.undo) {
      const sizeClass = activePage === 'edit' ? 'text-base px-5 py-3.5' : 'text-sm px-4 py-2.5';
      html += `
        <button class="w-full ${sizeClass} text-left text-webropol-gray-700 hover:bg-webropol-gray-50 flex items-center gap-3 menu-close-trigger">
          <i class="fal fa-rotate-left w-5 text-center text-webropol-gray-500"></i>
          <span>Undo</span>
        </button>
      `;
    }

    // Redo
    if (menuItems.redo) {
      const sizeClass = activePage === 'edit' ? 'text-base px-5 py-3.5' : 'text-sm px-4 py-2.5';
      html += `
        <button class="w-full ${sizeClass} text-left text-webropol-gray-700 hover:bg-webropol-gray-50 flex items-center gap-3 menu-close-trigger">
          <i class="fal fa-rotate-right w-5 text-center text-webropol-gray-500"></i>
          <span>Redo</span>
        </button>
      `;
    }

    return html;
  }

  render() {
    const surveyName = this.getAttr('survey-name', 'Customer Sat...');
    const hideEditBtn = this.getBoolAttr('hide-edit-btn');
    const activePage = this.getAttr('active-page', 'edit');
    
    const statusConfig = this.getStatusConfig(this.currentStatus);
    const menuWidth = activePage === 'edit' ? 'w-80' : 'w-64';

    this.innerHTML = `
      <style>
        .survey-helper-toolbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #334155;
          padding: 0;
        }

        .survey-action-btn {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          background-color: white;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .survey-action-btn:hover {
          border-color: #99effd;
          color: #0e7490;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .survey-action-btn:focus {
          outline: none;
          ring: 2px solid #06b6d4;
          ring-offset: 1px;
        }

        .survey-helper-toolbar .status-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-left: 0.75rem;
          padding-right: 1rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: 9999px;
          border-width: 1px;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          max-width: 20rem;
        }

        .survey-helper-toolbar .status-icon {
          display: inline-flex;
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          align-items: center;
          justify-content: center;
        }

        .survey-helper-toolbar .status-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
          min-width: 0;
        }

        .survey-helper-toolbar .status-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .survey-helper-toolbar .status-name {
          font-weight: 600;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .survey-helper-toolbar .divider {
          display: none;
          width: 1px;
          height: 1.5rem;
          background-color: #cbd5e1;
        }

        @media (min-width: 768px) {
          .survey-helper-toolbar .divider {
            display: block;
          }
        }

        .helper-menu {
          position: absolute;
          right: 0;
          margin-top: 0.5rem;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
          z-index: ${activePage === 'edit' ? 9999 : 50};
          display: none;
        }

        .helper-menu.active {
          display: block;
        }

        .helper-menu-overlay {
          position: fixed;
          inset: 0;
          z-index: ${activePage === 'edit' ? 9998 : 49};
          display: none;
        }

        .helper-menu-overlay.active {
          display: block;
        }

        /* Animation classes for Alpine.js transitions */
        .transition-enter {
          transition: opacity 100ms ease-out, transform 100ms ease-out;
        }

        .transition-enter-start {
          opacity: 0;
          transform: scale(0.95);
        }

        .transition-enter-end {
          opacity: 1;
          transform: scale(1);
        }

        .transition-leave {
          transition: opacity 75ms ease-in, transform 75ms ease-in;
        }

        .transition-leave-start {
          opacity: 1;
          transform: scale(1);
        }

        .transition-leave-end {
          opacity: 0;
          transform: scale(0.95);
        }
      </style>

      <div class="survey-helper-toolbar">
        <div class="status-badge ${statusConfig.bgClass} ${statusConfig.borderClass} cursor-pointer hover:shadow-md transition-all" 
             title="Click to change status: ${surveyName}" 
             role="button" 
             tabindex="0"
             aria-label="Change survey status">
          <span class="status-icon ${statusConfig.iconClass}">
            <i class="fal fa-file-alt"></i>
          </span>
          <div class="status-text">
            <span class="status-label ${statusConfig.textClass}">${statusConfig.text}</span>
            <span class="status-name" title="${surveyName}">${surveyName}</span>
          </div>
        </div>
        
        <div class="divider"></div>
        
        ${!hideEditBtn ? `
          <button onclick="window.location.href='edit.html'" class="survey-action-btn" title="Edit survey" aria-label="Edit survey">
            <i class="fal fa-edit text-lg"></i>
          </button>
        ` : ''}
        
        <div class="relative" style="position: relative;">
          <button class="survey-action-btn more-menu-btn" title="More options" aria-label="More options">
            <i class="fal fa-ellipsis-v text-lg"></i>
          </button>
          <div class="helper-menu-overlay"></div>
          <div class="helper-menu ${menuWidth}">
            ${this.buildMenuContent()}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const menuBtn = this.querySelector('.more-menu-btn');
    const menu = this.querySelector('.helper-menu');
    const overlay = this.querySelector('.helper-menu-overlay');
    const closeButtons = this.querySelectorAll('.menu-close-trigger');
    const statusBadge = this.querySelector('.status-badge');

    const openMenu = () => {
      menu.classList.add('active');
      overlay.classList.add('active');
      this.menuState.isOpen = true;
    };

    const closeMenu = () => {
      menu.classList.remove('active');
      overlay.classList.remove('active');
      this.menuState.isOpen = false;
    };

    const toggleMenu = () => {
      if (this.menuState.isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    overlay.addEventListener('click', closeMenu);

    closeButtons.forEach(btn => {
      btn.addEventListener('click', closeMenu);
    });

    // Status badge click - open modal if available
    if (statusBadge) {
      const handleStatusClick = () => {
        if (typeof window.openSurveyStatusModal === 'function') {
          window.openSurveyStatusModal();
        } else {
          console.warn('Survey status modal not available');
        }
      };

      statusBadge.addEventListener('click', handleStatusClick);
      statusBadge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStatusClick();
        }
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menuState.isOpen) {
        closeMenu();
      }
    });
  }
}

customElements.define('webropol-survey-helper-toolbar', SurveyHelperToolbar);
