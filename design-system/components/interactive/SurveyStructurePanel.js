/**
 * SurveyStructurePanel Component  (`webropol-survey-structure`)
 *
 * A fully self-contained, reusable panel that wraps the survey/SMS structure
 * sidebar — including the card shell, optional Pages/Styles tab switcher,
 * Move / Copy / Delete action buttons, and a scrollable content area.
 *
 * Children without a `slot` attribute are rendered in the **Pages** tab area.
 * Children with `slot="styles"` are rendered in the **Styles** tab area.
 *
 * The component auto-imports SurveyPageItem and SurveyQuestionItem so callers
 * only need to import this one file.
 *
 * ─── Attributes ──────────────────────────────────────────────────────────────
 *   title          String   Panel heading text.           default: "Survey structure"
 *   show-styles    Boolean  Show the Pages / Styles tab switcher.
 *   active-tab     String   "pages" | "styles".           default: "pages"
 *   storage-key    String   localStorage key to persist the active tab.
 *
 * ─── Events emitted ──────────────────────────────────────────────────────────
 *   structure-menu    dots-menu button clicked
 *   structure-move    Move button clicked   — detail: { selectedCount }
 *   structure-copy    Copy button clicked   — detail: { selectedCount }
 *   structure-delete  Delete button clicked — detail: { selectedCount }
 *                     (only fires when selectedCount > 0)
 *   tab-change        Active tab changed    — detail: { tab }
 *
 * ─── Selection tracking ──────────────────────────────────────────────────────
 *   Listens for bubbling `page-select` and `question-select` events emitted by
 *   webropol-survey-page / webropol-survey-question children and updates the
 *   Delete button's disabled state automatically.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   Survey editor (with styles tab):
 *     <webropol-survey-structure title="Survey structure" show-styles
 *                                storage-key="edit-left-activeTab">
 *       <webropol-survey-page ...>...</webropol-survey-page>
 *       <div slot="styles" x-data="surveyStylesApp()">...</div>
 *     </webropol-survey-structure>
 *
 *   SMS editor (no styles tab):
 *     <webropol-survey-structure title="Survey structure">
 *       <div class="space-y-2">...</div>
 *     </webropol-survey-structure>
 */

import { BaseComponent } from '../../utils/base-component.js';
import './SurveyPageItem.js';
import './SurveyQuestionItem.js';

export class SurveyStructurePanel extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'show-styles', 'active-tab', 'storage-key'];
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  init() {
    this.panelTitle  = this.getAttr('title', 'Survey structure');
    this.showStyles  = this.getBoolAttr('show-styles');
    this.activeTab   = this.getAttr('active-tab', 'pages');
    this.storageKey  = this.getAttr('storage-key', '');
    this.selectedCount = 0;
    this._rendered   = false;

    // Restore persisted tab
    if (this.storageKey) {
      try { this.activeTab = localStorage.getItem(this.storageKey) || this.activeTab; } catch(e) {}
    }

    // Capture slotted children BEFORE innerHTML is replaced by render()
    this._pagesNodes  = [];
    this._stylesNodes = [];
    Array.from(this.children).forEach(child => {
      if (child.getAttribute('slot') === 'styles') {
        this._stylesNodes.push(child);
      } else {
        this._pagesNodes.push(child);
      }
    });
  }

  // ── Rendering ───────────────────────────────────────────────────────────────

  render() {
    if (this._rendered) {
      this._updateDynamic();
      return;
    }

    const isPages    = this.activeTab === 'pages';
    const hasTabs    = this.showStyles;
    const delDisabled = this.selectedCount === 0 ? ' disabled' : '';

    this.innerHTML = `
      <div class="rounded-3xl p-6 shadow-lg border border-white bg-white/20 backdrop-blur h-full flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-webropol-gray-900 _panel-title">${this._esc(this.panelTitle)}</h3>
          <button type="button"
                  class="text-webropol-gray-400 hover:text-webropol-gray-600 transition-colors _menu-btn"
                  title="More options"
                  aria-label="More options">
            <i class="fal fa-ellipsis-h"></i>
          </button>
        </div>

        ${hasTabs ? `
        <!-- Pages / Styles Tab Switcher -->
        <div class="webropol-tabs-unified webropol-tabs-rounded-container mb-4 self-start"
             role="tablist" aria-label="Structure tabs">
          <button type="button"
                  class="webropol-unified-tab webropol-tab-rounded size-md${isPages ? ' active' : ''} _tab-btn"
                  data-tab="pages" role="tab" aria-selected="${isPages}">
            <i class="fal fa-file-alt mr-2"></i><span>Pages</span>
          </button>
          <button type="button"
                  class="webropol-unified-tab webropol-tab-rounded size-md${!isPages ? ' active' : ''} _tab-btn"
                  data-tab="styles" role="tab" aria-selected="${!isPages}">
            <i class="fal fa-paint-brush mr-2"></i><span>Styles</span>
          </button>
        </div>
        ` : ''}

        <!-- Action Buttons (visible only on the Pages tab) -->
        <div class="_action-bar flex flex-wrap gap-2 mb-4${!isPages ? ' hidden' : ''}">
          <webropol-button variant="secondary" size="sm" icon="arrows-alt" type="button" class="_move-btn"${delDisabled}>Move</webropol-button>
          <webropol-button variant="secondary" size="sm" icon="copy"       type="button" class="_copy-btn"${delDisabled}>Copy</webropol-button>
          <webropol-button variant="danger"    size="sm" icon="trash-can"  type="button" class="_delete-btn"${delDisabled}>Delete</webropol-button>
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-1 min-h-0 overflow-y-auto survey-scroll-area pr-2">
          <div class="_pages-slot${!isPages ? ' hidden' : ''}"></div>
          ${hasTabs ? `<div class="_styles-slot${isPages ? ' hidden' : ''}"></div>` : ''}
        </div>

      </div>
    `;

    // Move captured children into their containers
    const pagesSlot  = this.querySelector('._pages-slot');
    const stylesSlot = this.querySelector('._styles-slot');
    this._pagesNodes .forEach(n => pagesSlot.appendChild(n));
    this._stylesNodes.forEach(n => stylesSlot?.appendChild(n));

    this._rendered = true;
  }

  bindEvents() {
    if (!this._rendered) return;

    // Tab switching
    this.querySelectorAll('._tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        if (this.storageKey) {
          try { localStorage.setItem(this.storageKey, this.activeTab); } catch(e) {}
        }
        this._syncTabs();
        this.emit('tab-change', { tab: this.activeTab });
      });
    });

    // Dots menu
    this.querySelector('._menu-btn')?.addEventListener('click', () => {
      this.emit('structure-menu', {});
    });

    // Move / Copy / Delete
    this.querySelector('._move-btn')?.addEventListener('click', () => {
      if (this.selectedCount > 0) this.emit('structure-move', { selectedCount: this.selectedCount });
    });
    this.querySelector('._copy-btn')?.addEventListener('click', () => {
      if (this.selectedCount > 0) this.emit('structure-copy', { selectedCount: this.selectedCount });
    });
    this.querySelector('._delete-btn')?.addEventListener('click', () => {
      if (this.selectedCount > 0) {
        this.emit('structure-delete', { selectedCount: this.selectedCount });
      }
    });

    // Auto-track selection from child webropol-survey-page / webropol-survey-question
    this.addEventListener('page-select', (e) => {
      this.selectedCount += e.detail.selected ? 1 : -1;
      if (this.selectedCount < 0) this.selectedCount = 0;
      this._syncActionBtns();
    });
    this.addEventListener('question-select', (e) => {
      this.selectedCount += e.detail.selected ? 1 : -1;
      if (this.selectedCount < 0) this.selectedCount = 0;
      this._syncActionBtns();
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    switch (name) {
      case 'title':        this.panelTitle = newVal || 'Survey structure'; break;
      case 'show-styles':  this.showStyles = this.getBoolAttr('show-styles'); break;
      case 'active-tab':   this.activeTab  = newVal || 'pages'; break;
      case 'storage-key':  this.storageKey = newVal || ''; break;
    }
    if (this._rendered) this._updateDynamic();
  }

  // ── Internal helpers ────────────────────────────────────────────────────────

  _updateDynamic() {
    const titleEl = this.querySelector('._panel-title');
    if (titleEl) titleEl.textContent = this.panelTitle;
    this._syncTabs();
    this._syncActionBtns();
  }

  _syncTabs() {
    const isPages = this.activeTab === 'pages';

    this.querySelectorAll('._tab-btn').forEach(btn => {
      const active = btn.dataset.tab === this.activeTab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    this.querySelector('._pages-slot') ?.classList.toggle('hidden', !isPages);
    this.querySelector('._styles-slot')?.classList.toggle('hidden',  isPages);
    this.querySelector('._action-bar') ?.classList.toggle('hidden', !isPages);
  }

  _syncActionBtns() {
    const disabled = this.selectedCount === 0;
    ['._move-btn', '._copy-btn', '._delete-btn'].forEach(sel => {
      const btn = this.querySelector(sel);
      if (!btn) return;
      if (disabled) btn.setAttribute('disabled', '');
      else          btn.removeAttribute('disabled');
    });
  }

  _esc(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

customElements.define('webropol-survey-structure', SurveyStructurePanel);
