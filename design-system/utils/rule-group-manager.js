/**
 * Rule Group Manager
 * Manages the state and logic for survey rule groups (conditional logic)
 * Handles conditions, groups, actions, and persistence
 */

export class RuleGroupManager {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'webropol.ruleGroupManager.state';
    this.listStorageKey = options.listStorageKey || 'webropol.savedRuleGroups';
    
    // State
    this.groupName = '';
    this.conditions = [];
    this.groups = [];
    this.actions = [];
    this.selectedConditions = [];
    this.nextGroupId = 1;
    
    // Available questions for dropdowns (can be updated by consumer)
    this.availableQuestions = options.availableQuestions || [
      { id: 'q1', label: '1. Where do you work?' },
      { id: 'q2', label: '2. What percentage do you work from home?' },
      { id: 'q3', label: '3. How do you like working from home?' },
      { id: 'q4', label: '4. Rate your work-life balance' },
    ];
    
    // Callbacks
    this.onStateChange = options.onStateChange || null;
  }
  
  /**
   * Initialize from saved state
   */
  init() {
    this.loadFromStorage();
    return this;
  }
  
  /**
   * Get current state
   */
  getState() {
    return {
      groupName: this.groupName,
      conditions: this.conditions,
      groups: this.groups,
      actions: this.actions,
      selectedConditions: this.selectedConditions,
      nextGroupId: this.nextGroupId,
      availableQuestions: this.availableQuestions
    };
  }
  
  /**
   * Set state
   */
  setState(state) {
    this.groupName = state.groupName || '';
    this.conditions = state.conditions || [];
    this.groups = state.groups || [];
    this.actions = state.actions || [];
    this.selectedConditions = state.selectedConditions || [];
    this.nextGroupId = state.nextGroupId || 1;
    
    this.notifyChange();
  }
  
  /**
   * Reset to clean state
   */
  reset() {
    this.groupName = '';
    this.conditions = [];
    this.groups = [];
    this.actions = [];
    this.selectedConditions = [];
    this.nextGroupId = 1;
    
    this.notifyChange();
  }
  
  /**
   * Add a new condition
   */
  addCondition() {
    this.conditions.push({
      type: 'selected',
      question: 'q1',
      answer: '',
      logic: 'AND',
      groupId: null
    });
    this.persist();
    this.notifyChange();
  }
  
  /**
   * Remove a condition by index
   */
  removeCondition(index) {
    if (this.conditions.length > 0 && index >= 0 && index < this.conditions.length) {
      const removed = this.conditions[index];
      this.conditions.splice(index, 1);
      
      // If removed belonged to a group, ensure that group still has >= 2
      if (removed && removed.groupId != null) {
        const gid = removed.groupId;
        const remaining = this.conditions.filter(c => c.groupId === gid);
        if (remaining.length < 2) {
          remaining.forEach(c => c.groupId = null);
          this.groups = this.groups.filter(g => g.id !== gid);
        }
      }
      
      this.cleanupGroups();
      this.persist();
      this.notifyChange();
    }
  }
  
  /**
   * Add a new action
   */
  addAction() {
    this.actions.push({
      type: '',
      targetQuestions: [],
      targetPage: '',
      forwardUrl: '',
      timing: 'immediate'
    });
    this.persist();
    this.notifyChange();
  }
  
  /**
   * Remove an action by index
   */
  removeAction(index) {
    this.actions.splice(index, 1);
    this.persist();
    this.notifyChange();
  }
  
  /**
   * Toggle condition selection
   */
  toggleConditionSelection(index) {
    const idx = this.selectedConditions.indexOf(index);
    if (idx > -1) {
      this.selectedConditions.splice(idx, 1);
    } else {
      this.selectedConditions.push(index);
    }
    this.selectedConditions.sort((a, b) => a - b);
    this.notifyChange();
  }
  
  /**
   * Clear all selections
   */
  clearSelection() {
    this.selectedConditions = [];
    this.notifyChange();
  }
  
  /**
   * Group selected conditions
   */
  groupSelectedConditions(operator = 'AND') {
    if (this.selectedConditions.length < 2) {
      return false;
    }
    
    const groupId = this.nextGroupId;
    this.nextGroupId++;
    
    this.groups.push({
      id: groupId,
      name: `Group ${groupId}`,
      logic: operator || 'AND',
      nextLogic: 'AND'
    });
    
    this.selectedConditions.forEach(index => {
      this.conditions[index].groupId = groupId;
    });
    
    this.selectedConditions = [];
    this.cleanupGroups();
    this.persist();
    this.notifyChange();
    
    return true;
  }
  
  /**
   * Ungroup selected conditions
   */
  ungroupSelected() {
    this.selectedConditions.forEach(index => {
      if (this.conditions[index]) {
        this.conditions[index].groupId = null;
      }
    });
    this.selectedConditions = [];
    this.cleanupGroups();
    this.persist();
    this.notifyChange();
  }
  
  /**
   * Ungroup all conditions in a group
   */
  ungroupConditions(groupId) {
    this.conditions.forEach(condition => {
      if (condition.groupId === groupId) {
        condition.groupId = null;
      }
    });
    this.groups = this.groups.filter(g => g.id !== groupId);
    this.persist();
    this.notifyChange();
  }
  
  /**
   * Check if any selected conditions are grouped
   */
  hasGroupedConditionsSelected() {
    if (this.selectedConditions.length === 0) return false;
    return this.selectedConditions.some(index =>
      this.conditions[index] && this.conditions[index].groupId != null
    );
  }
  
  /**
   * Get group by ID
   */
  getGroup(groupId) {
    return this.groups.find(g => g.id === groupId) || { logic: 'AND', nextLogic: 'AND' };
  }
  
  /**
   * Get organized conditions for display
   */
  getOrganizedConditions() {
    const result = [];
    const processedGroups = new Set();
    
    this.conditions.forEach((condition, index) => {
      if (condition.groupId && !processedGroups.has(condition.groupId)) {
        // Start of a new group - collect all conditions with this groupId
        const groupConditions = this.conditions
          .map((c, i) => ({ condition: c, index: i }))
          .filter(item => item.condition.groupId === condition.groupId);
        
        result.push({
          type: 'group',
          groupId: condition.groupId,
          conditions: groupConditions
        });
        processedGroups.add(condition.groupId);
      } else if (!condition.groupId) {
        // Ungrouped condition
        result.push({
          type: 'single',
          condition: condition,
          index: index
        });
      }
    });
    
    return result;
  }
  
  /**
   * Cleanup groups with < 2 conditions
   */
  cleanupGroups() {
    const counts = new Map();
    this.conditions.forEach(c => {
      if (c.groupId != null) {
        counts.set(c.groupId, (counts.get(c.groupId) || 0) + 1);
      }
    });
    
    const invalidIds = this.groups
      .filter(g => (counts.get(g.id) || 0) < 2)
      .map(g => g.id);
    
    if (invalidIds.length) {
      this.conditions.forEach(c => {
        if (c.groupId != null && invalidIds.includes(c.groupId)) {
          c.groupId = null;
        }
      });
      this.groups = this.groups.filter(g => !invalidIds.includes(g.id));
    }
  }
  
  /**
   * Get question label by ID
   */
  getQuestionLabel(questionId) {
    const question = this.availableQuestions.find(q => q.id === questionId);
    return question ? question.label : questionId;
  }
  
  /**
   * Get condition summary text
   */
  getConditionSummary(condition) {
    const typeLabels = {
      selected: 'is selected',
      not_selected: 'is not selected',
      contains: 'contains',
      equals: 'equals',
      greater: 'is greater than',
      less: 'is less than'
    };
    const questionLabel = this.getQuestionLabel(condition.question);
    const typeLabel = typeLabels[condition.type] || condition.type;
    return `${questionLabel} ${typeLabel} "${condition.answer}"`;
  }
  
  /**
   * Get action summary text
   */
  getActionSummary(action) {
    const actionLabels = {
      show: 'Show',
      hide: 'Hide',
      disable: 'Disable',
      show_option: 'Show Option(s) in',
      hide_option: 'Hide Option(s) in',
      disable_option: 'Disable Option(s) in',
      skip: 'Skip to',
      forward: 'Forward respondent to',
      end: 'End survey'
    };
    const actionLabel = actionLabels[action.type] || action.type;
    
    if (action.type === 'skip') {
      return `${actionLabel} ${action.targetPage || 'page'}`;
    } else if (action.type === 'forward') {
      return `${actionLabel} ${action.forwardUrl || 'URL'}`;
    } else if (action.type === 'end') {
      return actionLabel;
    } else if (action.targetQuestions && action.targetQuestions.length > 0) {
      const questions = action.targetQuestions.map(qId => this.getQuestionLabel(qId)).join(', ');
      return `${actionLabel}: ${questions}`;
    }
    return `${actionLabel} (no target specified)`;
  }
  
  /**
   * Summarize conditions for list view
   */
  summarizeConditions(group) {
    const conds = group.conditions || [];
    if (conds.length === 0) return '';
    
    const toText = (c) => {
      const typeMap = {
        selected: 'is selected',
        not_selected: 'is not selected',
        contains: 'contains',
        equals: 'equals',
        greater: 'is greater than',
        less: 'is less than'
      };
      const q = this.getQuestionLabel(c.question || '');
      const t = typeMap[c.type] || c.type || '';
      const ans = c.answer ? ` "${c.answer}"` : '';
      return `${q} ${t}${ans}`.trim();
    };
    
    // Respect grouping for compact preview
    const groups = (group.groups || []);
    if (groups.length > 0) {
      const byId = new Map(groups.map(g => [g.id, g]));
      const grouped = new Map();
      conds.forEach(c => {
        if (c.groupId != null) {
          grouped.set(c.groupId, (grouped.get(c.groupId) || []).concat(c));
        }
      });
      const chunks = [];
      grouped.forEach((arr, gid) => {
        const g = byId.get(gid) || { logic: 'AND' };
        chunks.push('(' + arr.map(toText).join(` ${g.logic} `) + ')');
      });
      const ungrouped = conds.filter(c => c.groupId == null);
      if (ungrouped.length) chunks.push(ungrouped.map(toText).join(' AND '));
      return chunks.join(' AND ');
    }
    return conds.map(toText).join(' AND ');
  }
  
  /**
   * Summarize actions for list view
   */
  summarizeActions(group) {
    const acts = group.actions || [];
    if (acts.length === 0) return '';
    const parts = acts.slice(0, 3).map(a => this.getActionSummary(a));
    const extra = acts.length > 3 ? ` and ${acts.length - 3} more` : '';
    return parts.join('; ') + extra;
  }
  
  /**
   * Save current state to group list
   */
  saveToGroupsList() {
    const payload = {
      version: 1,
      groupName: this.groupName,
      conditions: this.conditions,
      groups: this.groups,
      actions: this.actions,
      nextGroupId: this.nextGroupId,
      savedAt: new Date().toISOString()
    };
    
    try {
      const existing = localStorage.getItem(this.listStorageKey);
      const savedGroups = existing ? JSON.parse(existing) : [];
      
      // Check if group already exists (update) or add new
      const existingIndex = savedGroups.findIndex(g => g.groupName === payload.groupName);
      if (existingIndex > -1) {
        savedGroups[existingIndex] = payload;
      } else {
        savedGroups.push(payload);
      }
      
      localStorage.setItem(this.listStorageKey, JSON.stringify(savedGroups));
      return true;
    } catch (e) {
      console.error('Failed to save to groups list', e);
      return false;
    }
  }
  
  /**
   * Get saved groups list
   */
  getSavedGroups() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.listStorageKey) || '[]');
      return saved;
    } catch (e) {
      return [];
    }
  }
  
  /**
   * Delete a saved group
   */
  deleteSavedGroup(groupName) {
    try {
      const savedGroups = this.getSavedGroups();
      const filtered = savedGroups.filter(g => g.groupName !== groupName);
      localStorage.setItem(this.listStorageKey, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete group', e);
      return false;
    }
  }
  
  /**
   * Delete all saved groups
   */
  deleteAllSavedGroups() {
    try {
      localStorage.removeItem(this.listStorageKey);
      return true;
    } catch (e) {
      console.error('Failed to delete all groups', e);
      return false;
    }
  }
  
  /**
   * Persist current state to storage
   */
  persist() {
    this.saveToStorage();
  }
  
  /**
   * Save to localStorage
   */
  saveToStorage(payload) {
    try {
      const data = payload || {
        version: 1,
        groupName: this.groupName,
        conditions: this.conditions,
        groups: this.groups,
        actions: this.actions,
        nextGroupId: this.nextGroupId,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }
  
  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        this.groupName = data.groupName ?? this.groupName;
        this.conditions = Array.isArray(data.conditions) ? data.conditions : this.conditions;
        this.groups = Array.isArray(data.groups) ? data.groups : this.groups;
        this.actions = Array.isArray(data.actions) ? data.actions : this.actions;
        this.nextGroupId = Number.isInteger(data.nextGroupId) ? data.nextGroupId : this.nextGroupId;
        
        this.rebuildGroupsFromConditionsIfNeeded();
      }
    } catch (e) {
      console.warn('No valid saved state found or failed to parse', e);
    }
  }
  
  /**
   * Rebuild groups from conditions if needed
   */
  rebuildGroupsFromConditionsIfNeeded() {
    const presentIds = new Set(this.groups.map(g => g.id));
    const idsFromConditions = new Set(
      this.conditions
        .filter(c => c.groupId != null)
        .map(c => c.groupId)
    );
    
    let added = false;
    idsFromConditions.forEach(id => {
      if (!presentIds.has(id)) {
        this.groups.push({ id, name: `Group ${id}`, logic: 'AND', nextLogic: 'AND' });
        added = true;
      }
    });
    
    // Sync nextGroupId
    const maxId = Math.max(0, ...Array.from(idsFromConditions));
    if (this.nextGroupId <= maxId) {
      this.nextGroupId = maxId + 1;
    }
    
    if (added) {
      this.saveToStorage();
    }
    
    this.cleanupGroups();
  }
  
  /**
   * Notify state change
   */
  notifyChange() {
    if (this.onStateChange && typeof this.onStateChange === 'function') {
      this.onStateChange(this.getState());
    }
  }
}
