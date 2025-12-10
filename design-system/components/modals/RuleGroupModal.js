/**
 * Webropol Rule Group Modal Component
 * A modal for managing survey rule groups (conditional logic)
 * Integrates with RuleGroupManager for state management
 * 
 * Usage:
 * const modal = document.querySelector('webropol-rule-group-modal');
 * modal.open({
 *   mode: 'list',  // 'list' or 'edit'
 *   surveyId: 'survey-123',
 *   availableQuestions: [...],
 *   onSave: (ruleGroups) => { ... }
 * });
 */

import { BaseComponent } from '../../utils/base-component.js';
import { RuleGroupManager } from '../../utils/rule-group-manager.js';

export class WebropolRuleGroupModal extends BaseComponent {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.mode = 'list'; // 'list' or 'edit'
    this.manager = null;
    this.onSaveCallback = null;
    this.showConfirmModal = false;
    this.showAlertModal = false;
    this.showOperatorModal = false;
    
    this.bindMethods();
  }

  bindMethods() {
    this.close = this.close.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  /**
   * Open modal with configuration
   */
  open(config = {}) {
    this.mode = config.mode || 'list';
    this.onSaveCallback = config.onSave || null;
    
    // Initialize manager if not exists
    if (!this.manager) {
      this.manager = new RuleGroupManager({
        availableQuestions: config.availableQuestions || [],
        onStateChange: (state) => {
          if (this.getBoolAttr('open')) {
            this.renderContent();
          }
        }
      });
      this.manager.init();
    } else if (config.availableQuestions) {
      this.manager.availableQuestions = config.availableQuestions;
    }
    
    this.setAttribute('open', '');
    this.render();
    this.focusModal();
  }

  /**
   * Focus modal after opening
   */
  focusModal() {
    setTimeout(() => {
      const firstButton = this.querySelector('button:not([disabled])');
      if (firstButton) {
        firstButton.focus();
      }
    }, 100);
    
    document.body.style.overflow = 'hidden';
  }

  renderListView() {
    const savedGroups = this.manager.getSavedGroups();
    
    return `
      <div class="max-w-7xl mx-auto w-full flex flex-col h-full">
        <div class="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
          <!-- Header -->
          <div class="bg-white px-8 py-6 rounded-t-lg flex items-center justify-between flex-shrink-0 border-b-2 border-webropol-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-webropol-primary-100 rounded-full flex items-center justify-center">
                <i class="fa-light fa-arrow-progress text-webropol-primary-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-webropol-gray-800">Rule Groups List</h2>
                <p class="text-xs text-webropol-gray-600">${savedGroups.length} group${savedGroups.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button class="rule-close-btn text-webropol-gray-600 hover:bg-webropol-gray-100 rounded-full p-2 transition-colors" title="Close">
              <i class="fa-light fa-times text-xl"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-8 overflow-y-auto flex-1 bg-white">
            ${savedGroups.length === 0 ? this.renderEmptyState() : this.renderGroupsList(savedGroups)}
          </div>

          <!-- Footer -->
          <div class="bg-white px-8 py-6 rounded-b-lg flex items-center justify-between flex-shrink-0 border-t-2 border-webropol-gray-200">
            <button class="rule-delete-all-btn px-6 py-2.5 bg-rose-600 text-white text-sm rounded-lg font-medium hover:bg-rose-700 transition-colors">
              Delete all
            </button>
            <div class="flex gap-3">
              <button class="rule-close-btn px-6 py-2.5 border-2 border-webropol-gray-300 text-webropol-gray-700 text-sm rounded-lg font-medium hover:bg-webropol-gray-100 transition-colors">Cancel</button>
              <button class="rule-save-btn px-6 py-2.5 bg-webropol-primary-600 text-white text-sm rounded-lg font-medium hover:bg-webropol-primary-700 transition-colors">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div class="border-2 border-dashed border-webropol-gray-200 rounded-xl p-12 text-center bg-webropol-gray-50">
        <div class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full bg-webropol-primary-100 flex items-center justify-center">
            <i class="fa-light fa-folder-open text-webropol-primary-600 text-xl"></i>
          </div>
          <div class="max-w-xl">
            <h3 class="text-base font-semibold text-webropol-gray-800">No rule groups yet</h3>
            <p class="text-xs text-webropol-gray-600 mt-1">Create your first rule group to get started. You can add conditions and optional actions.</p>
          </div>
          <button class="rule-create-new-btn px-5 py-2 bg-webropol-primary-600 text-white rounded-full text-sm font-medium hover:bg-webropol-primary-700 transition-colors">
            <i class="fa-light fa-plus mr-2"></i>
            Add new rule group
          </button>
        </div>
      </div>
    `;
  }

  renderGroupsList(savedGroups) {
    return `
      <div class="space-y-6">
        ${savedGroups.map(group => this.renderGroupCard(group)).join('')}
        <div>
          <button class="rule-create-new-btn inline-flex items-center gap-2 px-5 py-3 bg-webropol-primary-600 text-white rounded-full text-sm font-semibold hover:bg-webropol-primary-700 transition-colors shadow">
            <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <i class="fa-light fa-plus text-xs"></i>
            </span>
            Add new rule group
          </button>
        </div>
      </div>
    `;
  }

  renderGroupCard(group) {
    return `
      <div class="rulecard p-6" style="background: linear-gradient(135deg, #f0fdff 0%, #ffffff 100%); border: 2px solid #0891b2; border-radius: 12px; position: relative; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(6, 182, 212, 0.08);">
        <div class="flex items-start justify-between mb-5">
          <div class="text-webropol-gray-900 font-semibold text-base tracking-tight">
            ${group.groupName || 'Group Rule Name'}
          </div>
          <div class="flex items-center gap-2">
            <button class="rule-edit-group-btn px-4 py-2 bg-webropol-primary-600 text-white rounded-lg hover:bg-webropol-primary-700 transition-all text-xs font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                    data-group-name="${group.groupName}">
              <i class="fa-light fa-pencil text-xs"></i>
              Edit
            </button>
            <button class="rule-delete-group-btn px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                    data-group-name="${group.groupName}">
              <i class="fa-light fa-trash-can text-xs"></i>
              Delete
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div class="mb-2.5">
              <span class="ifthen-badge" style="font-size: 0.625rem; font-weight: 800; letter-spacing: 0.05em; padding: 0.25rem 0.625rem; border-radius: 6px; color: #ffffff; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); display: inline-block; text-transform: uppercase; box-shadow: 0 2px 4px rgba(6, 182, 212, 0.2);">IF</span>
            </div>
            <div class="summary-box" style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 10px; min-height: 72px; padding: 0.875rem 1rem; color: #1e293b; font-size: 0.8125rem; line-height: 1.5; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
              ${this.manager.summarizeConditions(group) || 'Summary Description'}
            </div>
          </div>
          <div>
            <div class="mb-2.5">
              <span class="ifthen-badge" style="font-size: 0.625rem; font-weight: 800; letter-spacing: 0.05em; padding: 0.25rem 0.625rem; border-radius: 6px; color: #ffffff; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); display: inline-block; text-transform: uppercase; box-shadow: 0 2px 4px rgba(6, 182, 212, 0.2);">THEN</span>
            </div>
            <div class="summary-box" style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 10px; min-height: 72px; padding: 0.875rem 1rem; color: #1e293b; font-size: 0.8125rem; line-height: 1.5; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
              ${this.manager.summarizeActions(group) || 'Summary Description'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderEditView() {
    const state = this.manager.getState();
    const organizedConditions = this.manager.getOrganizedConditions();
    
    return `
      <div class="max-w-7xl mx-auto w-full flex flex-col h-full">
        <div class="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
          <!-- Header -->
          <div class="bg-white px-8 py-6 rounded-t-lg flex items-center justify-between flex-shrink-0 border-b-2 border-webropol-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-webropol-primary-100 rounded-full flex items-center justify-center">
                <i class="fa-light fa-layer-group text-webropol-primary-600 text-xl"></i>
              </div>
              <h2 class="text-xl font-bold text-webropol-gray-800">Rule Group Details</h2>
            </div>
            <button class="rule-close-editor-btn text-webropol-gray-600 hover:bg-webropol-gray-100 rounded-full p-2 transition-colors">
              <i class="fa-light fa-times text-xl"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-8 overflow-y-auto flex-1 bg-white">
            <!-- Group Name -->
            <div class="mb-8">
              <label class="block text-xs font-semibold text-webropol-gray-700 mb-2">Group Name</label>
              <input type="text" 
                     class="rule-group-name-input w-full px-4 py-2.5 text-sm border-2 border-webropol-gray-200 rounded-lg focus:border-webropol-primary-500 focus:ring-2 focus:ring-webropol-primary-100 transition-all bg-white"
                     placeholder="Enter group name..."
                     value="${state.groupName}" />
            </div>

            <!-- Conditions Section -->
            ${this.renderConditionsSection(state, organizedConditions)}

            <!-- Actions Section -->
            ${this.renderActionsSection(state)}
          </div>

          <!-- Footer -->
          <div class="bg-white px-8 py-6 rounded-b-lg flex justify-end gap-3 flex-shrink-0 border-t-2 border-webropol-gray-200">
            <button class="rule-cancel-btn px-6 py-2.5 border-2 border-webropol-gray-300 text-webropol-gray-700 text-sm rounded-lg font-medium hover:bg-webropol-gray-100 transition-colors">
              Cancel
            </button>
            <button class="rule-save-group-btn px-6 py-2.5 bg-webropol-primary-600 text-white text-sm rounded-lg font-medium hover:bg-webropol-primary-700 transition-colors shadow-lg hover:shadow-xl">
              Save
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderConditionsSection(state, organizedConditions) {
    return `
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-webropol-gray-800 flex items-center gap-2">
            <i class="fa-light fa-filter text-webropol-primary-500 text-base"></i>
            When These Conditions Are Met
          </h3>

          <!-- Selection Actions -->
          <div class="flex items-center gap-2">
            ${state.selectedConditions.length > 0 ? `
              <span class="text-xs text-webropol-gray-600">
                <span class="font-semibold">${state.selectedConditions.length}</span> selected
              </span>
            ` : ''}
            <button class="rule-group-selected-btn px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${state.selectedConditions.length < 2 ? 'bg-webropol-gray-300 text-webropol-gray-500 cursor-not-allowed' : 'bg-webropol-primary-500 text-white hover:bg-webropol-primary-600'}"
                    ${state.selectedConditions.length < 2 ? 'disabled' : ''}
                    title="${state.selectedConditions.length < 2 ? 'Please select at least 2 conditions first' : 'Group selected conditions together'}">
              <i class="fa-light fa-object-group text-xs"></i>
              Group Selected
            </button>
            <button class="rule-ungroup-selected-btn px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${!this.manager.hasGroupedConditionsSelected() ? 'bg-webropol-gray-300 text-webropol-gray-500 cursor-not-allowed' : 'bg-webropol-gray-500 text-white hover:bg-webropol-gray-600'}"
                    ${!this.manager.hasGroupedConditionsSelected() ? 'disabled' : ''}
                    title="${!this.manager.hasGroupedConditionsSelected() ? 'Please select grouped conditions to ungroup first' : 'Remove grouping from selected conditions'}">
              <i class="fa-light fa-object-ungroup text-xs"></i>
              Ungroup
            </button>
            <button class="rule-clear-selection-btn px-3 py-2 rounded-lg text-xs transition-colors ${state.selectedConditions.length === 0 ? 'text-webropol-gray-400 cursor-not-allowed' : 'text-webropol-gray-600 hover:bg-webropol-gray-100'}"
                    ${state.selectedConditions.length === 0 ? 'disabled' : ''}
                    title="${state.selectedConditions.length === 0 ? 'No selection to clear' : 'Clear current selection'}">
              Clear
            </button>
          </div>
        </div>

        ${state.conditions.length === 0 ? this.renderConditionsEmptyState() : this.renderConditionsList(organizedConditions, state)}
        
        <!-- Add Condition Button -->
        <button class="rule-add-condition-btn text-webropol-primary-600 mb-2 hover:bg-webropol-primary-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium">
          <i class="fa-light fa-plus text-xs"></i>
          Add new condition
        </button>
      </div>
    `;
  }

  renderConditionsEmptyState() {
    return `
      <div class="border-2 border-dashed border-webropol-gray-200 rounded-xl p-8 text-center mb-4 bg-webropol-gray-50">
        <div class="flex flex-col items-center gap-3">
          <div class="w-14 h-14 rounded-full bg-webropol-primary-100 flex items-center justify-center">
            <i class="fa-light fa-filter-circle-xmark text-webropol-primary-600 text-xl"></i>
          </div>
          <div class="max-w-xl">
            <h4 class="text-base font-semibold text-webropol-gray-800">No conditions yet</h4>
            <p class="text-xs text-webropol-gray-600 mt-1">Start by adding your first condition. You can group conditions later using AND/OR to build complex rules.</p>
          </div>
          <button class="rule-add-condition-btn px-4 py-2 bg-webropol-primary-600 text-white rounded-lg text-sm font-medium hover:bg-webropol-primary-700 transition-colors">
            <i class="fa-light fa-plus mr-2 text-xs"></i>
            Add first condition
          </button>
        </div>
      </div>
    `;
  }

  renderConditionsList(organizedConditions, state) {
    return `
      <div class="conditions-container space-y-3">
        ${organizedConditions.map((item, itemIndex) => {
          if (item.type === 'group') {
            return this.renderGroupedConditions(item, state, itemIndex, organizedConditions.length);
          } else {
            return this.renderSingleCondition(item, state, itemIndex, organizedConditions.length);
          }
        }).join('')}
      </div>
    `;
  }

  renderGroupedConditions(item, state, itemIndex, totalItems) {
    const group = this.manager.getGroup(item.groupId);
    const isOr = group.logic === 'OR';
    
    return `
      <div class="group-wrapper ${isOr ? 'group-or' : ''}" 
           style="border-radius: 20px; padding: 0; margin-bottom: 2rem; background: ${isOr ? 'linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)' : 'linear-gradient(145deg, #ffffff 0%, #f0fdff 100%)'}; box-shadow: 0 10px 40px rgba(${isOr ? '168, 85, 247' : '6, 182, 212'}, 0.12); position: relative; overflow: hidden; border: 1px solid rgba(${isOr ? '168, 85, 247' : '6, 182, 212'}, 0.15);">
        <!-- Group Header -->
        <div class="group-header ${isOr ? 'group-or' : ''}" 
             style="background: ${isOr ? 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)' : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)'}; padding: 1.5rem 1.75rem;">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-4 text-center">
              <div class="group-icon-badge px-4 py-2" style="background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 80px;">
                <div class="text-lg font-bold uppercase tracking-wider text-white">${group.logic}</div>
              </div>
              <div>
                <div class="font-bold text-lg tracking-wide text-white">Condition Group</div>
                <div class="text-white text-sm font-medium mt-0.5">${item.conditions.length} conditions</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <select class="group-logic-selector" data-group-id="${item.groupId}"
                      style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.4); border-radius: 10px; padding: 0.625rem 1rem; font-size: 0.875rem; font-weight: 600; color: #0e7490; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <option value="AND" ${group.logic === 'AND' ? 'selected' : ''}>All must match (AND)</option>
                <option value="OR" ${group.logic === 'OR' ? 'selected' : ''}>Any can match (OR)</option>
              </select>
              <button class="rule-ungroup-all-btn bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 border border-white/30 hover:border-white/50 text-white"
                      data-group-id="${item.groupId}"
                      title="Break apart this group">
                <i class="fa-light fa-object-ungroup"></i>
                Ungroup all
              </button>
            </div>
          </div>
        </div>

        <!-- Grouped Conditions -->
        <div class="group-content" style="padding: 1.75rem;">
          ${item.conditions.map((condItem, condIndex) => this.renderGroupedCondition(condItem, state, isOr)).join('')}
        </div>
      </div>

      ${itemIndex < totalItems - 1 ? this.renderGroupLogicToggle(item.groupId, group) : ''}
    `;
  }

  renderGroupedCondition(condItem, state, isOr) {
    const isSelected = state.selectedConditions.includes(condItem.index);
    
    return `
      <div class="group-condition-row ${isOr ? 'group-or' : ''} ${isSelected ? 'selected-row' : ''}"
           style="background: #ffffff; border: 2px solid ${isOr ? '#f3e8ff' : '#e0f7fa'}; border-radius: 14px; padding: 1.25rem 1.75rem; margin-bottom: 0.875rem; box-shadow: 0 2px 8px rgba(${isOr ? '168, 85, 247' : '6, 182, 212'}, 0.06); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); position: relative;">
        ${this.renderConditionRow(condItem.condition, condItem.index, state)}
      </div>
    `;
  }

  renderSingleCondition(item, state, itemIndex, totalItems) {
    const isSelected = state.selectedConditions.includes(item.index);
    
    return `
      <div>
        <div class="rule-row rounded-lg p-4 mb-3 border-2 border-webropol-gray-200 transition-all ${isSelected ? 'selected-row' : ''}"
             style="${isSelected ? 'background-color: #f0fdff; border-color: #06b6d4;' : ''}">
          ${this.renderConditionRow(item.condition, item.index, state)}
        </div>

        ${itemIndex < totalItems - 1 && item.index < state.conditions.length - 1 ? this.renderSingleLogicToggle(item.condition, item.index) : ''}
      </div>
    `;
  }

  renderConditionRow(condition, index, state) {
    return `
      <div class="flex items-center gap-3">
        <!-- Selection Checkbox -->
        <input type="checkbox" 
               class="rule-condition-checkbox checkbox-custom w-5 h-5 text-webropol-primary-500 rounded focus:ring-webropol-primary-500"
               data-index="${index}"
               ${state.selectedConditions.includes(index) ? 'checked' : ''} />

        <!-- Condition Type -->
        <div class="w-48">
          <select class="rule-condition-type dropdown-modern w-full px-3 py-2 rounded-lg text-sm bg-white"
                  data-index="${index}"
                  style="border: 2px solid #e2e8f0;">
            <option value="selected" ${condition.type === 'selected' ? 'selected' : ''}>When option is selected</option>
            <option value="not_selected" ${condition.type === 'not_selected' ? 'selected' : ''}>When option is not selected</option>
            <option value="contains" ${condition.type === 'contains' ? 'selected' : ''}>When response contains</option>
            <option value="equals" ${condition.type === 'equals' ? 'selected' : ''}>When response equals</option>
            <option value="greater" ${condition.type === 'greater' ? 'selected' : ''}>When value is greater than</option>
            <option value="less" ${condition.type === 'less' ? 'selected' : ''}>When value is less than</option>
          </select>
        </div>

        <!-- Context Label -->
        <span class="text-sm font-medium text-webropol-gray-600">in question</span>

        <!-- Question Selector -->
        <div class="flex-1">
          <select class="rule-condition-question dropdown-modern w-full px-3 py-2 rounded-lg text-sm bg-white"
                  data-index="${index}"
                  style="border: 2px solid #e2e8f0;">
            ${this.manager.availableQuestions.map(q => 
              `<option value="${q.id}" ${condition.question === q.id ? 'selected' : ''}>${q.label}</option>`
            ).join('')}
          </select>
        </div>

        <!-- Answer Input -->
        <div class="w-40">
          <input type="text" 
                 class="rule-condition-answer dropdown-modern w-full px-3 py-2 rounded-lg text-sm bg-white"
                 data-index="${index}"
                 style="border: 2px solid #e2e8f0;"
                 value="${condition.answer || ''}"
                 placeholder="Answer" />
        </div>

        <!-- Delete Button -->
        <button class="rule-remove-condition-btn text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                data-index="${index}"
                title="Remove condition">
          <i class="fa-light fa-trash-can text-lg"></i>
        </button>
      </div>
    `;
  }

  renderSingleLogicToggle(condition, index) {
    return `
      <div class="flex items-center justify-center gap-4 mb-3">
        <div class="flex gap-2">
          <label class="cursor-pointer">
            <input type="radio" 
                   name="logic-${index}" 
                   value="AND" 
                   class="rule-condition-logic sr-only"
                   data-index="${index}"
                   ${condition.logic === 'AND' ? 'checked' : ''} />
            <div class="px-4 py-2 rounded-lg border-2 transition-all ${condition.logic === 'AND' ? 'bg-webropol-primary-600 text-white border-webropol-primary-600' : 'bg-white text-webropol-gray-700 border-webropol-gray-300 hover:border-webropol-primary-400'}">
              AND
            </div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" 
                   name="logic-${index}" 
                   value="OR" 
                   class="rule-condition-logic sr-only"
                   data-index="${index}"
                   ${condition.logic === 'OR' ? 'checked' : ''} />
            <div class="px-4 py-2 rounded-lg border-2 transition-all ${condition.logic === 'OR' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-webropol-gray-700 border-webropol-gray-300 hover:border-purple-400'}">
              OR
            </div>
          </label>
        </div>
      </div>
    `;
  }

  renderGroupLogicToggle(groupId, group) {
    return `
      <div class="flex items-center justify-center py-6 my-4">
        <div class="flex gap-3">
          <label class="cursor-pointer">
            <input type="radio" 
                   name="group-after-${groupId}" 
                   value="AND" 
                   class="rule-group-next-logic sr-only"
                   data-group-id="${groupId}"
                   ${group.nextLogic === 'AND' ? 'checked' : ''} />
            <div class="px-4 py-2 rounded-lg border-2 transition-all ${group.nextLogic === 'AND' ? 'bg-webropol-primary-600 text-white border-webropol-primary-600' : 'bg-white text-webropol-gray-700 border-webropol-gray-300 hover:border-webropol-primary-400'}">
              AND
            </div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" 
                   name="group-after-${groupId}" 
                   value="OR" 
                   class="rule-group-next-logic sr-only"
                   data-group-id="${groupId}"
                   ${group.nextLogic === 'OR' ? 'checked' : ''} />
            <div class="px-4 py-2 rounded-lg border-2 transition-all ${group.nextLogic === 'OR' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-webropol-gray-700 border-webropol-gray-300 hover:border-purple-400'}">
              OR
            </div>
          </label>
        </div>
      </div>
    `;
  }

  renderActionsSection(state) {
    return `
      <div class="mb-6" ${state.actions.length === 0 ? 'style="display: none;"' : ''}>
        <div class="flex items-center mb-4">
          <h3 class="text-base font-semibold text-webropol-gray-800 flex items-center gap-2">
            <i class="fa-light fa-bolt text-webropol-primary-500 text-base"></i>
            Then Perform These Actions
          </h3>
        </div>

        ${state.actions.map((action, index) => this.renderActionRow(action, index, state)).join('')}
      </div>

      <!-- Add Action Button -->
      <button class="rule-add-action-btn text-webropol-primary-600 mb-6 hover:bg-webropol-primary-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium">
        <i class="fa-light fa-plus text-xs"></i>
        Add new action
      </button>
    `;
  }

  renderActionRow(action, index, state) {
    return `
      <div class="rule-row rounded-lg p-4 mb-3 border-2 border-webropol-gray-200">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-webropol-gray-700 w-16">Then</span>

          <!-- Action Type -->
          <div class="w-64">
            <select class="rule-action-type dropdown-modern w-full px-3 py-2 rounded-lg text-sm bg-white"
                    data-index="${index}"
                    style="border: 2px solid #e2e8f0;">
              <option value="">-- Select action --</option>
              <option value="end" ${action.type === 'end' ? 'selected' : ''}>End survey</option>
              <option value="forward" ${action.type === 'forward' ? 'selected' : ''}>Forward respondent to</option>
              <option value="show" ${action.type === 'show' ? 'selected' : ''}>Show Question(s)</option>
              <option value="hide" ${action.type === 'hide' ? 'selected' : ''}>Hide Question(s)</option>
              <option value="disable" ${action.type === 'disable' ? 'selected' : ''}>Disable Question(s)</option>
            </select>
          </div>

          <!-- Dynamic Action Target -->
          ${this.renderActionTarget(action, index, state)}

          <!-- Delete Button -->
          <button class="rule-remove-action-btn text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  data-index="${index}"
                  title="Remove action">
            <i class="fa-light fa-trash-can text-lg"></i>
          </button>
        </div>
      </div>
    `;
  }

  renderActionTarget(action, index, state) {
    if (['show', 'hide', 'disable'].includes(action.type)) {
      return `
        <div class="flex-1">
          <select class="rule-action-target-question dropdown-modern w-full px-3 py-2 rounded-lg text-sm bg-white"
                  data-index="${index}"
                  style="border: 2px solid #e2e8f0;">
            <option value="">-- Select question --</option>
            ${this.manager.availableQuestions.map(q => 
              `<option value="${q.id}" ${(action.targetQuestions || []).includes(q.id) ? 'selected' : ''}>${q.label}</option>`
            ).join('')}
          </select>
        </div>
      `;
    } else if (action.type === 'forward') {
      return `
        <div class="flex-1">
          <input type="url" 
                 class="rule-action-forward-url dropdown-modern w-full px-3 py-2 rounded-lg text-sm bg-white"
                 data-index="${index}"
                 style="border: 2px solid #e2e8f0;"
                 value="${action.forwardUrl || ''}"
                 placeholder="Enter URL (e.g., https://example.com)">
        </div>
      `;
    } else if (action.type === 'end') {
      return `
        <div class="flex-1">
          <span class="text-sm text-webropol-gray-600">and redirect respondent to thank you page</span>
        </div>
      `;
    } else {
      return '<div class="flex-1"></div>';
    }
  }

  render() {
    const isOpen = this.getBoolAttr('open');
    
    this.innerHTML = `
      <style>
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .checkbox-custom {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        
        .selected-row {
          background-color: #f0fdff;
          border-color: #06b6d4;
        }
        
        [x-cloak] {
          display: none !important;
        }
      </style>

      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 ${isOpen ? 'opacity-100 z-[12000]' : 'opacity-0 pointer-events-none'}"
           style="transition: opacity 300ms ease-out">
        
        <div class="rule-modal-content w-full h-full transform ${isOpen ? 'scale-100' : 'scale-95'}"
             style="max-width: 100%; max-height: 100vh; transition: transform 300ms ease-out">
          ${this.mode === 'list' ? this.renderListView() : this.renderEditView()}
        </div>
      </div>
    `;
    
    if (isOpen) {
      this.bindEvents();
    }
  }

  renderContent() {
    const container = this.querySelector('.rule-modal-content');
    if (container) {
      container.innerHTML = this.mode === 'list' ? this.renderListView() : this.renderEditView();
      this.bindEvents();
    }
  }

  bindEvents() {
    // Close buttons
    const closeButtons = this.querySelectorAll('.rule-close-btn, .rule-close-editor-btn');
    closeButtons.forEach(btn => {
      this.addListener(btn, 'click', () => this.close());
    });

    // Create new group
    const createBtns = this.querySelectorAll('.rule-create-new-btn');
    createBtns.forEach(btn => {
      this.addListener(btn, 'click', () => {
        this.manager.reset();
        this.mode = 'edit';
        this.renderContent();
      });
    });

    // Edit group from list
    const editBtns = this.querySelectorAll('.rule-edit-group-btn');
    editBtns.forEach(btn => {
      this.addListener(btn, 'click', (e) => {
        const groupName = e.currentTarget.getAttribute('data-group-name');
        const savedGroups = this.manager.getSavedGroups();
        const group = savedGroups.find(g => g.groupName === groupName);
        
        if (group) {
          this.manager.setState({
            groupName: group.groupName,
            conditions: group.conditions || [],
            groups: group.groups || [],
            actions: group.actions || [],
            nextGroupId: group.nextGroupId || 1,
            selectedConditions: []
          });
          this.mode = 'edit';
          this.renderContent();
        }
      });
    });

    // Delete group
    const deleteBtns = this.querySelectorAll('.rule-delete-group-btn');
    deleteBtns.forEach(btn => {
      this.addListener(btn, 'click', (e) => {
        const groupName = e.currentTarget.getAttribute('data-group-name');
        if (confirm(`Are you sure you want to delete "${groupName}"?`)) {
          this.manager.deleteSavedGroup(groupName);
          this.renderContent();
        }
      });
    });

    // Delete all groups
    const deleteAllBtn = this.querySelector('.rule-delete-all-btn');
    if (deleteAllBtn) {
      this.addListener(deleteAllBtn, 'click', () => {
        if (confirm('Are you sure you want to delete all rule groups?')) {
          this.manager.deleteAllSavedGroups();
          this.renderContent();
        }
      });
    }

    // Save button (in list view)
    const saveBtn = this.querySelector('.rule-save-btn');
    if (saveBtn) {
      this.addListener(saveBtn, 'click', () => {
        if (this.onSaveCallback) {
          this.onSaveCallback(this.manager.getSavedGroups());
        }
        this.close();
      });
    }

    // Group name input
    const groupNameInput = this.querySelector('.rule-group-name-input');
    if (groupNameInput) {
      this.addListener(groupNameInput, 'input', (e) => {
        this.manager.groupName = e.target.value;
        this.manager.persist();
      });
    }

    // Add condition
    const addConditionBtns = this.querySelectorAll('.rule-add-condition-btn');
    addConditionBtns.forEach(btn => {
      this.addListener(btn, 'click', () => {
        this.manager.addCondition();
        this.renderContent();
      });
    });

    // Remove condition
    const removeConditionBtns = this.querySelectorAll('.rule-remove-condition-btn');
    removeConditionBtns.forEach(btn => {
      this.addListener(btn, 'click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.removeCondition(index);
        this.renderContent();
      });
    });

    // Condition checkbox
    const conditionCheckboxes = this.querySelectorAll('.rule-condition-checkbox');
    conditionCheckboxes.forEach(cb => {
      this.addListener(cb, 'change', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.toggleConditionSelection(index);
        this.renderContent();
      });
    });

    // Condition type change
    const conditionTypeSelects = this.querySelectorAll('.rule-condition-type');
    conditionTypeSelects.forEach(select => {
      this.addListener(select, 'change', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.conditions[index].type = e.target.value;
        this.manager.persist();
      });
    });

    // Condition question change
    const conditionQuestionSelects = this.querySelectorAll('.rule-condition-question');
    conditionQuestionSelects.forEach(select => {
      this.addListener(select, 'change', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.conditions[index].question = e.target.value;
        this.manager.persist();
      });
    });

    // Condition answer change
    const conditionAnswerInputs = this.querySelectorAll('.rule-condition-answer');
    conditionAnswerInputs.forEach(input => {
      this.addListener(input, 'input', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.conditions[index].answer = e.target.value;
        this.manager.persist();
      });
    });

    // Condition logic change
    const conditionLogicInputs = this.querySelectorAll('.rule-condition-logic');
    conditionLogicInputs.forEach(input => {
      this.addListener(input, 'change', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.conditions[index].logic = e.target.value;
        this.manager.persist();
      });
    });

    // Group selected conditions
    const groupSelectedBtn = this.querySelector('.rule-group-selected-btn');
    if (groupSelectedBtn && !groupSelectedBtn.disabled) {
      this.addListener(groupSelectedBtn, 'click', () => {
        if (this.manager.selectedConditions.length >= 2) {
          const operator = prompt('Choose operator: AND or OR', 'AND');
          if (operator === 'AND' || operator === 'OR') {
            this.manager.groupSelectedConditions(operator);
            this.renderContent();
          }
        }
      });
    }

    // Ungroup selected
    const ungroupSelectedBtn = this.querySelector('.rule-ungroup-selected-btn');
    if (ungroupSelectedBtn && !ungroupSelectedBtn.disabled) {
      this.addListener(ungroupSelectedBtn, 'click', () => {
        this.manager.ungroupSelected();
        this.renderContent();
      });
    }

    // Clear selection
    const clearSelectionBtn = this.querySelector('.rule-clear-selection-btn');
    if (clearSelectionBtn && !clearSelectionBtn.disabled) {
      this.addListener(clearSelectionBtn, 'click', () => {
        this.manager.clearSelection();
        this.renderContent();
      });
    }

    // Group logic selector
    const groupLogicSelectors = this.querySelectorAll('.group-logic-selector');
    groupLogicSelectors.forEach(select => {
      this.addListener(select, 'change', (e) => {
        const groupId = parseInt(e.currentTarget.getAttribute('data-group-id'));
        const group = this.manager.getGroup(groupId);
        if (group && this.manager.groups.find(g => g.id === groupId)) {
          this.manager.groups.find(g => g.id === groupId).logic = e.target.value;
          this.manager.persist();
          this.renderContent();
        }
      });
    });

    // Ungroup all
    const ungroupAllBtns = this.querySelectorAll('.rule-ungroup-all-btn');
    ungroupAllBtns.forEach(btn => {
      this.addListener(btn, 'click', (e) => {
        const groupId = parseInt(e.currentTarget.getAttribute('data-group-id'));
        this.manager.ungroupConditions(groupId);
        this.renderContent();
      });
    });

    // Group next logic
    const groupNextLogicInputs = this.querySelectorAll('.rule-group-next-logic');
    groupNextLogicInputs.forEach(input => {
      this.addListener(input, 'change', (e) => {
        const groupId = parseInt(e.currentTarget.getAttribute('data-group-id'));
        const group = this.manager.groups.find(g => g.id === groupId);
        if (group) {
          group.nextLogic = e.target.value;
          this.manager.persist();
        }
      });
    });

    // Add action
    const addActionBtn = this.querySelector('.rule-add-action-btn');
    if (addActionBtn) {
      this.addListener(addActionBtn, 'click', () => {
        this.manager.addAction();
        this.renderContent();
      });
    }

    // Remove action
    const removeActionBtns = this.querySelectorAll('.rule-remove-action-btn');
    removeActionBtns.forEach(btn => {
      this.addListener(btn, 'click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.removeAction(index);
        this.renderContent();
      });
    });

    // Action type change
    const actionTypeSelects = this.querySelectorAll('.rule-action-type');
    actionTypeSelects.forEach(select => {
      this.addListener(select, 'change', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.actions[index].type = e.target.value;
        this.manager.persist();
        this.renderContent();
      });
    });

    // Action target question
    const actionTargetQuestionSelects = this.querySelectorAll('.rule-action-target-question');
    actionTargetQuestionSelects.forEach(select => {
      this.addListener(select, 'change', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        const questionId = e.target.value;
        if (questionId) {
          if (!this.manager.actions[index].targetQuestions) {
            this.manager.actions[index].targetQuestions = [];
          }
          if (!this.manager.actions[index].targetQuestions.includes(questionId)) {
            this.manager.actions[index].targetQuestions.push(questionId);
          }
        }
        this.manager.persist();
      });
    });

    // Action forward URL
    const actionForwardUrlInputs = this.querySelectorAll('.rule-action-forward-url');
    actionForwardUrlInputs.forEach(input => {
      this.addListener(input, 'input', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.manager.actions[index].forwardUrl = e.target.value;
        this.manager.persist();
      });
    });

    // Cancel button
    const cancelBtn = this.querySelector('.rule-cancel-btn');
    if (cancelBtn) {
      this.addListener(cancelBtn, 'click', () => {
        if (confirm('Are you sure you want to discard all changes?')) {
          this.mode = 'list';
          this.renderContent();
        }
      });
    }

    // Save group button
    const saveGroupBtn = this.querySelector('.rule-save-group-btn');
    if (saveGroupBtn) {
      this.addListener(saveGroupBtn, 'click', () => {
        if (!this.manager.groupName) {
          alert('Please enter a group name');
          return;
        }
        
        if (this.manager.actions.length > 0) {
          if (!confirm(`You have defined ${this.manager.actions.length} action(s). Do you want to apply and save these changes?`)) {
            return;
          }
        }
        
        this.manager.saveToGroupsList();
        this.mode = 'list';
        this.renderContent();
      });
    }

    // Backdrop click
    const backdrop = this.querySelector('.fixed');
    if (backdrop) {
      this.addListener(backdrop, 'click', this.handleBackdropClick);
    }

    // Prevent modal content clicks from closing
    const modalContent = this.querySelector('.rule-modal-content');
    if (modalContent) {
      this.addListener(modalContent, 'click', (e) => e.stopPropagation());
    }

    // Keyboard events
    this.addListener(document, 'keydown', this.handleKeydown);
  }

  handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  handleKeydown(e) {
    if (!this.getBoolAttr('open')) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  close() {
    this.removeAttribute('open');
    document.body.style.overflow = '';
    this.emit('modal-closed');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && oldValue !== newValue) {
      this.render();
    }
  }
}

// Register the component
customElements.define('webropol-rule-group-modal', WebropolRuleGroupModal);

