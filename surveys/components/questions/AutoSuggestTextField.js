import { BaseComponent } from '../../../design-system/utils/base-component.js';
import './settings/AutoSuggestSettingsModal.js';

export class AutoSuggestTextField extends BaseComponent {
    static get observedAttributes() {
        return ['mode', 'question-id'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);

        if (!window.autoSuggestTextFieldData) {
            window.autoSuggestTextFieldData = (initialMode, qId) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: false,
                    isMandatory: false,
                    title: 'Auto Suggest',

                    init() {
                        try {
                            const saved = JSON.parse(localStorage.getItem('webropol_survey_mandatory_questions') || '{}');
                            this.isMandatory = Boolean(saved[this.questionId]);
                        } catch (e) {
                            this.isMandatory = false;
                        }

                        this.$watch('isMandatory', (value) => {
                            try {
                                const saved = JSON.parse(localStorage.getItem('webropol_survey_mandatory_questions') || '{}');
                                saved[this.questionId] = value;
                                localStorage.setItem('webropol_survey_mandatory_questions', JSON.stringify(saved));
                            } catch (e) {
                                console.error('Failed to save autosuggest mandatory state:', e);
                            }

                            if (this.$root && typeof this.$root.updateMandatoryInfo === 'function') {
                                this.$root.updateMandatoryInfo();
                            }
                        });
                    },

                    selectQuestion() {
                        if (this.mode !== 'edit') return;
                        this.selected = true;
                        window.dispatchEvent(new CustomEvent('click-question', { detail: this.questionId }));
                    }
                };
            };
        }
    }

    render() {
        this.innerHTML = `
            <div x-data="autoSuggestTextFieldData('${this.mode}', '${this.questionId}')"
                 @click-question.window="if ($event.detail !== questionId) selected = false"
                 class="question-card"
                 :class="selected ? 'selected' : ''">

                <div class="drag-handle" title="Drag to reorder">
                    <i class="fal fa-arrows-alt"></i>
                </div>

                <div x-show="selected && mode === 'edit'"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 -translate-y-2"
                     x-transition:enter-end="opacity-100 translate-y-0"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100 translate-y-0"
                     x-transition:leave-end="opacity-0 -translate-y-2"
                     class="question-card-header">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 bg-white px-1 py-1 rounded-lg border border-gray-100">
                            <div class="flex items-center justify-center w-6 h-6 text-yellow-600 bg-yellow-100 rounded-md">
                                <i class="fal fa-file-alt text-xs"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700">Autosuggest text field</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 question-card-toolbar">
                        <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Rules and Jumps"><i class="fal fa-shuffle"></i></button>
                        <div class="relative" x-data="{ mandatoryOpen: false }">
                            <button @click="mandatoryOpen = !mandatoryOpen" @click.outside="mandatoryOpen = false"
                                :class="isMandatory ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50'"
                                class="transition-colors px-2 py-1 rounded" title="Required field">
                                <i class="fal fa-asterisk"></i>
                            </button>
                            <div x-show="mandatoryOpen" x-transition class="absolute top-full right-0 mt-1 z-50 w-64">
                                <webropol-context-menu
                                    items='[{"id": "not-mandatory", "label": "Question is not mandatory", "showRadio": true, "radioGroup": "mandatory", "checked": true}, {"id": "mandatory", "label": "Question is mandatory", "icon": "fas fa-asterisk", "iconClass": "text-red-600", "iconPosition": "right", "showRadio": true, "radioGroup": "mandatory", "bgClass": "hover:bg-red-50"}]'
                                    width="auto"
                                    @item-click="isMandatory = ($event.detail.id === 'mandatory'); mandatoryOpen = false"
                                ></webropol-context-menu>
                            </div>
                        </div>
                        <div class="relative" x-data="{ open: false }">
                            <button @click="open = !open" @click.outside="open = false" class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Visibility">
                                <i class="fal fa-eye"></i>
                            </button>
                            <div x-show="open" x-transition class="absolute top-full left-0 mt-1 z-50 w-40">
                                <webropol-context-menu
                                    items='[{"id": "visible", "label": "Visible", "icon": "fal fa-eye"}, {"id": "hidden", "label": "Hidden", "icon": "fal fa-eye-slash"}, {"id": "disabled", "label": "Disabled", "icon": "fal fa-ban"}]'
                                    width="auto"
                                    @item-click="open = false"
                                ></webropol-context-menu>
                            </div>
                        </div>
                        <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Add Image"><i class="fal fa-image-circle-plus"></i></button>
                        <div class="js-copy-btn-container inline-flex items-center" :data-question-id="questionId">
                            <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Copy" @click="copyQuestionNow(questionId)"><i class="fal fa-copy"></i></button>
                        </div>
                        <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="eTest"><i class="fal fa-graduation-cap"></i></button>
                        <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Points"><i class="fal fa-bullseye"></i></button>
                        <button onclick="openAutoSuggestSettingsModal()" class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Settings"><i class="fal fa-cog"></i></button>
                        <button class="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete"><i class="fa-light fa-trash-can"></i></button>
                    </div>
                </div>

                <div x-show="!selected || mode !== 'edit'"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0"
                     class="p-6 cursor-pointer group question-card-collapsed transition-colors rounded-3xl"
                     @click="selectQuestion()">
                    <div class="mb-4">
                        <h3 class="text-base font-semibold text-webropol-gray-900 group-hover:text-webropol-primary-700 transition-colors"
                            x-text="'2. ' + title"></h3>
                    </div>

                    <div class="space-y-3">
                        <div class="flex items-start gap-4">
                            <label class="text-sm text-webropol-gray-600 pt-2 min-w-[60px]">Option</label>
                            <div class="flex-1">
                                <input type="text" class="w-full px-4 py-2 border border-webropol-gray-300 rounded-lg bg-white text-webropol-gray-400" disabled placeholder="Type to see suggestions...">
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-webropol-gray-500 ml-[76px]">
                            <i class="fal fa-database"></i>
                            <span>Auto-suggest enabled</span>
                        </div>
                    </div>
                </div>

                <div x-show="selected && mode === 'edit'" class="p-6 rounded-b-3xl bg-white">
                    <div class="mb-6">
                        <label class="block text-lg font-semibold text-webropol-gray-900 mb-2" x-text="'2. ' + title"></label>

                        <div id="autosuggestInfo" role="note" aria-label="Auto Suggest information" class="mb-5 p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 flex gap-3">
                            <div class="shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                                <i class="fal fa-info-circle"></i>
                            </div>
                            <div class="flex-1">
                                <div class="text-sm leading-relaxed">
                                    <p class="font-medium mb-1">Use Autosuggest when you have hundreds or even thousands of possible answers</p>
                                    <p class="mb-2">As respondents type, they'll see matching options from the list you set up.</p>
                                    <ul class="list-disc ml-5 space-y-1">
                                        <li><b></b>Answers are treated as text responses in the Reporting tab.</b> Charts and tables are <b>not</b> generated.</li>
                                        <li>Adding Options:
                                            <ul class="list-disc ml-5 space-y-1">
                                                <li>Upload a <b>CSV file:</b> comma-delimited, one option per row. Use the provided template to avoid formatting errors.</li>
                                                <li>You can add columns with <b>additional variables</b> (e.g., codes, categories, metadata) for each option in the CSV. These extra variables do <b>not</b> appear in Reporting, but they are included when you <b>export results to Excel/CSV.</b></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div class="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                    <label class="inline-flex items-center gap-2 text-sm select-none">
                                        <input id="autosuggestInfoHide" type="checkbox" class="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500">
                                        <span>Don't show this again</span>
                                    </label>
                                    <div class="flex-1"></div>
                                    <button id="autosuggestInfoOk" class="btn btn-secondary w-fit self-start sm:self-auto">
                                        <i class="fal fa-check text-sm"></i>
                                        <span>Understood</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-webropol-gray-700 mb-2">Option</label>
                            <div class="relative">
                                <input type="text" class="w-full px-4 py-3 border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-primary-500/20 focus:border-webropol-primary-500 transition-all" placeholder="Enter option text">
                                <button class="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-webropol-primary-500 to-webropol-primary-600 text-white rounded-lg flex items-center justify-center hover:shadow-medium transition-all">
                                    <i class="fal fa-plus text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 mb-6">
                            <div class="flex items-center gap-3">
                                <button class="btn btn-primary w-fit" onclick="openUploadModal()">
                                    <i class="fal fa-upload text-sm"></i>
                                    <span>Import Auto Suggestions File</span>
                                </button>
                                <span class="tooltip-container">
                                    <button type="button" class="tooltip-trigger tooltip-help" aria-label="More info about importing Auto Suggest file" aria-describedby="import-autosuggest-tip">
                                        <i class="fal fa-question-circle"></i>
                                    </button>
                                    <div id="import-autosuggest-tip" role="tooltip" class="tooltip-panel" data-placement="top">
                                        When uploading an AutoSuggest file with more than 1,000 options, it will be placed into a processing queue. While processing you won't be able to send out your survey. Once complete, you'll receive an email notification.
                                    </div>
                                </span>
                                <span id="questionUploadStatus" class="hidden whitespace-nowrap inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm">
                                    <i class="fal fa-spinner fa-spin"></i>
                                    <span>Uploading...</span>
                                </span>
                            </div>
                            <button class="btn btn-secondary w-fit">
                                <i class="fal fa-plus text-sm"></i>
                                <span>Add one row</span>
                            </button>
                            <button class="btn btn-secondary w-fit">
                                <i class="fal fa-plus text-sm"></i>
                                <span>Add or edit multiple rows</span>
                            </button>
                        </div>
                    </div>
                </div>

                <button x-show="selected && mode === 'edit'" title="Drag to reorder" role="button"
                        class="hidden sm:flex items-center justify-center cursor-move text-white bg-webropol-primary-700 hover:bg-webropol-primary-800 transition-colors rounded-l-xl w-10 h-14 absolute right-0 top-1/2 -translate-y-1/2 shadow">
                    <i class="fal fa-arrows-alt"></i>
                </button>
            </div>
        `;
    }
}

customElements.define('webropol-autosuggest-text-field', AutoSuggestTextField);
