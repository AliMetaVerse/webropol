/**
 * Webropol Survey Settings Modal Component
 * A dynamic, reusable modal for survey-specific settings with tabbed interface
 * Can be configured with custom settings items for any survey/page context
 * 
 * Usage:
 * const modal = document.querySelector('webropol-survey-settings-modal');
 * modal.open({
 *   surveyId: 'survey-123',
 *   surveyName: 'Customer Satisfaction Survey',
 *   settings: { ... current settings ... },
 *   onSave: (settings) => { ... }
 * });
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolSurveySettingsModal extends BaseComponent {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.surveyData = null;
    this.currentSettings = {};
    this.onSaveCallback = null;
    this.bindMethods();
  }

  bindMethods() {
    this.close = this.close.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleSettingChange = this.handleSettingChange.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  /**
   * Open modal with configuration
   * @param {Object} config - Configuration object
   * @param {string} config.surveyId - Unique survey identifier
   * @param {string} config.surveyName - Display name of survey
   * @param {Object} config.settings - Current survey settings
   * @param {Function} config.onSave - Callback when settings are saved
   * @param {Object} config.settingsConfig - Optional: Custom configuration for which settings to show
   */
  open(config = {}) {
    this.surveyData = {
      surveyId: config.surveyId || null,
      surveyName: config.surveyName || 'Survey',
    };
    
    this.currentSettings = this.mergeWithDefaults(config.settings || {});
    this.onSaveCallback = config.onSave || null;
    this.settingsConfig = config.settingsConfig || this.getDefaultSettingsConfig();
    
    this.setAttribute('open', '');
    this.render();
    this.focusModal();
  }

  /**
   * Get default settings configuration
   * This defines which settings are available and their default values
   */
  getDefaultSettingsConfig() {
    return {
      // Survey & Notifications Tab
      surveyNotifications: {
        notificationEmails: { enabled: true, value: false, label: 'Notification Emails', help: 'Send email notifications for responses' },
        limitRespondents: { enabled: true, value: false, label: 'Limit number of respondents', help: 'Set a maximum number of responses' },
        answerMode: { enabled: true, value: 'once', label: 'Answer Mode', help: 'Control how respondents can answer', options: ['Answer Only Once', 'Multiple Answers'] },
        saveContinueLater: { enabled: true, value: false, label: 'Save and continue later', help: 'Allow respondents to save progress' },
        summaryPage: { enabled: true, value: false, label: 'Summary Page for Respondent', help: 'Show summary after completion' },
        mandatorySurvey: { enabled: true, value: false, label: 'Mandatory survey/question settings', help: 'Make survey or questions required' },
        moveForwardOnly: { enabled: true, value: false, label: 'Allow only moving forward on survey', help: 'Prevent going back in survey' },
        voiceAnswering: { enabled: true, value: false, label: 'Use voice answering', help: 'Enable voice input for responses' },
      },
      
      // Groups & Actions Tab
      groupsActions: {
        questionGroups: { enabled: true, value: null, label: 'Question groups', help: 'Organize questions into groups', status: '(No question groups)' },
        forwarding: { enabled: true, value: false, label: 'Forwarding', help: 'Forward responses to external systems' },
        randomization: { enabled: true, value: false, label: 'Randomization of questions & answers options', help: 'Randomize question and answer order' },
        hierarchy: { enabled: true, value: false, label: 'Create hierarchy for survey distribution', help: 'Set up organizational hierarchy' },
        questionCategories: { enabled: true, value: false, label: 'Question categories for summary page', help: 'Categorize questions for reporting' },
        checkAnswers: { enabled: true, value: false, label: 'Check answers before submitting', help: 'Validate responses before submission' },
        ruleGroups: { enabled: true, value: false, label: 'Rule groups', help: 'Create conditional logic rules' },
        exportTags: { enabled: true, value: false, label: 'Question Export Tags', help: 'Tag questions for export' },
      },
      
      // Security & Rules Tab
      securityRules: {
        retentionTime: { enabled: true, value: null, label: 'Survey retention time', help: 'Set data retention period', status: '(No deletion date set)' },
        anonymity: { enabled: true, value: false, label: 'Anonymity', help: 'Make survey anonymous', status: '(Survey is not anonymous)' },
        suomiMessages: { enabled: true, value: false, label: 'Connect to Suomi.fi Messages', help: 'Integrate with Suomi.fi' },
        pinCode: { enabled: true, value: false, label: 'Sign with PIN code', help: 'Require PIN for access' },
        strongAuth: { enabled: true, value: false, label: 'Strong Authentication', help: 'Enable strong authentication' },
        ipRestrictions: { enabled: true, value: false, label: 'IP Restrictions', help: 'Limit access by IP address' },
        caseManagement: { enabled: true, value: false, label: 'Transfer to Case Management', help: 'Send to case management system' },
      }
    };
  }

  /**
   * Merge provided settings with defaults
   */
  mergeWithDefaults(settings) {
    const config = this.getDefaultSettingsConfig();
    const merged = {};
    
    Object.keys(config).forEach(section => {
      merged[section] = {};
      Object.keys(config[section]).forEach(key => {
        merged[section][key] = settings[section]?.[key] ?? config[section][key].value;
      });
    });
    
    return merged;
  }

  /**
   * Handle setting change
   */
  handleSettingChange(section, key, value) {
    if (!this.currentSettings[section]) {
      this.currentSettings[section] = {};
    }
    this.currentSettings[section][key] = value;
    
    // Emit change event for real-time updates
    this.emit('setting-changed', { 
      section, 
      key, 
      value,
      allSettings: this.currentSettings 
    });
  }

  /**
   * Save settings and close
   */
  saveSettings() {
    if (this.onSaveCallback && typeof this.onSaveCallback === 'function') {
      this.onSaveCallback(this.currentSettings);
    }
    
    this.emit('settings-saved', { 
      surveyId: this.surveyData?.surveyId,
      settings: this.currentSettings 
    });
    
    this.close();
  }

  /**
   * Focus modal after opening
   */
  focusModal() {
    setTimeout(() => {
      const firstTab = this.querySelector('.tab-button');
      if (firstTab) {
        firstTab.focus();
      }
    }, 100);
    
    document.body.style.overflow = 'hidden';
  }

  /**
   * Render a setting item
   */
  renderSettingItem(section, key, config) {
    const value = this.currentSettings[section]?.[key] ?? config.value;
    const isEnabled = config.enabled !== false;
    
    if (!isEnabled) return '';
    
    const iconMap = {
      // Survey & Notifications icons
      notificationEmails: 'fa-envelope',
      limitRespondents: 'fa-users',
      answerMode: 'fa-comment-dots',
      saveContinueLater: 'fa-save',
      summaryPage: 'fa-file-alt',
      mandatorySurvey: 'fa-asterisk',
      moveForwardOnly: 'fa-arrow-right',
      voiceAnswering: 'fa-microphone',
      
      // Groups & Actions icons
      questionGroups: 'fa-object-group',
      forwarding: 'fa-share',
      randomization: 'fa-random',
      hierarchy: 'fa-sitemap',
      questionCategories: 'fa-tags',
      checkAnswers: 'fa-check-square',
      ruleGroups: 'fa-code-branch',
      exportTags: 'fa-tag',
      
      // Security & Rules icons
      retentionTime: 'fa-calendar-times',
      anonymity: 'fa-user-secret',
      suomiMessages: 'fa-envelope-open-text',
      pinCode: 'fa-shield-alt',
      strongAuth: 'fa-lock',
      ipRestrictions: 'fa-cloud',
      caseManagement: 'fa-list-alt',
    };
    
    const bgColorMap = {
      // Survey & Notifications - Cyan/Teal backgrounds
      notificationEmails: 'bg-cyan-100',
      limitRespondents: 'bg-cyan-100',
      answerMode: 'bg-cyan-100',
      saveContinueLater: 'bg-cyan-100',
      summaryPage: 'bg-cyan-100',
      mandatorySurvey: 'bg-cyan-100',
      moveForwardOnly: 'bg-cyan-100',
      voiceAnswering: 'bg-cyan-100',
      
      // Groups & Actions - Green backgrounds
      questionGroups: 'bg-green-100',
      forwarding: 'bg-green-100',
      randomization: 'bg-green-100',
      hierarchy: 'bg-green-100',
      questionCategories: 'bg-green-100',
      checkAnswers: 'bg-green-100',
      ruleGroups: 'bg-green-100',
      exportTags: 'bg-green-100',
      
      // Security & Rules - Pink/Rose backgrounds
      retentionTime: 'bg-pink-100',
      anonymity: 'bg-pink-100',
      suomiMessages: 'bg-blue-100',
      pinCode: 'bg-pink-100',
      strongAuth: 'bg-pink-100',
      ipRestrictions: 'bg-pink-100',
      caseManagement: 'bg-pink-100',
    };
    
    const icon = iconMap[key] || 'fa-cog';
    const bgColor = bgColorMap[key] || 'bg-webropol-gray-100';
    
    // Determine status text
    const statusText = config.status || (value ? '(In Use)' : '(Not In Use)');
    
    // Determine if this item should have a help icon
    const hasHelp = ['suomiMessages', 'questionCategories', 'checkAnswers', 'exportTags', 'ipRestrictions'].includes(key);
    
    return `
      <div class="setting-item flex items-center gap-3 py-3 hover:bg-webropol-gray-50 transition-colors cursor-pointer"
           data-section="${section}" data-key="${key}">
        <!-- Icon -->
        <div class="w-10 h-10 flex-shrink-0 ${bgColor} rounded-lg flex items-center justify-center">
          <i class="fal ${icon} text-base text-webropol-gray-700"></i>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-normal text-webropol-gray-900 mb-0.5">${config.label}</h4>
          <p class="text-xs text-red-600">${statusText}</p>
        </div>
        
        <!-- Help Icon -->
        ${hasHelp ? `
          <button class="help-icon w-6 h-6 flex items-center justify-center text-webropol-gray-400 hover:text-webropol-primary-600 transition-colors flex-shrink-0"
                  title="${config.help || 'More information'}">
            <i class="fal fa-question-circle text-base"></i>
          </button>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render a section with its settings
   */
  renderSection(title, sectionKey, settings) {
    return `
      <div class="settings-section flex-1 px-4">
        <!-- Section Header -->
        <h3 class="text-base font-bold text-webropol-gray-900 mb-4 pb-2 border-b border-webropol-gray-200">${title}</h3>
        
        <!-- Settings List -->
        <div class="settings-list space-y-1">
          ${Object.keys(settings).map(key => 
            this.renderSettingItem(sectionKey, key, settings[key])
          ).join('')}
        </div>
      </div>
    `;
  }

  render() {
    const isOpen = this.getBoolAttr('open');
    const surveyName = this.surveyData?.surveyName || 'Survey';
    const config = this.settingsConfig || this.getDefaultSettingsConfig();
    
    this.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
           style="z-index: 12000; transition: opacity 300ms ease-out">
        
        <div class="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}"
             style="transition: all 300ms ease-out"
             role="document"
             aria-labelledby="survey-settings-title">
          
          <!-- Modal Header -->
          <div class="modal-header flex items-center justify-between p-6 border-b border-webropol-gray-200 bg-white">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <i class="fal fa-cog text-amber-600 text-xl"></i>
              </div>
              <h2 id="survey-settings-title" class="text-xl font-bold text-webropol-gray-900">Survey Settings</h2>
            </div>
            
            <button class="modal-close w-8 h-8 flex items-center justify-center text-webropol-gray-400 hover:text-webropol-gray-600 transition-colors"
                    aria-label="Close settings modal">
              <i class="fal fa-times text-xl"></i>
            </button>
          </div>
          
          <!-- Modal Body - All Sections in 3 Columns -->
          <div class="modal-body flex-1 overflow-y-auto p-8 bg-white">
            <div class="flex gap-8">
              <!-- Survey & Notifications Section -->
              ${this.renderSection(
                'Survey & Notifications',
                'surveyNotifications',
                config.surveyNotifications
              )}
              
              <!-- Groups & Actions Section -->
              ${this.renderSection(
                'Groups & Actions',
                'groupsActions',
                config.groupsActions
              )}
              
              <!-- Security & Rules Section -->
              ${this.renderSection(
                'Security & Rules',
                'securityRules',
                config.securityRules
              )}
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="modal-footer flex items-center justify-end p-6 border-t border-webropol-gray-200 bg-white">
            <button class="save-button px-8 py-2.5 bg-white border-2 border-webropol-gray-300 hover:border-webropol-gray-400 text-webropol-gray-700 text-sm font-medium rounded-lg transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    
    this.bindEvents();
  }

  bindEvents() {
    // Setting action buttons
    const actionButtons = this.querySelectorAll('.setting-action-btn');
    actionButtons.forEach(button => {
      this.addListener(button, 'click', (e) => {
        const section = e.currentTarget.getAttribute('data-section');
        const key = e.currentTarget.getAttribute('data-key');
        
        this.emit('setting-action', { section, key });
        // Here you can implement custom modal dialogs for each setting
      });
    });
    
    // Close buttons
    const closeButton = this.querySelector('.modal-close');
    const saveButton = this.querySelector('.save-button');
    
    if (closeButton) {
      this.addListener(closeButton, 'click', this.close);
    }
    
    if (saveButton) {
      this.addListener(saveButton, 'click', this.close);
    }
    
    // Backdrop click
    const backdrop = this.querySelector('.modal-backdrop');
    if (backdrop) {
      this.addListener(backdrop, 'click', this.handleBackdropClick);
    }
    
    // Prevent modal content clicks from closing
    const modalContent = this.querySelector('.modal-content');
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
customElements.define('webropol-survey-settings-modal', WebropolSurveySettingsModal);
