import { BaseComponent } from '../../../design-system/utils/base-component.js';
import './settings/OpenEndedSettingsModal.js';

export class OpenEnded extends BaseComponent {
    static get observedAttributes() {
        return ['mode', 'question-id'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);

        if (!window.openEndedData) {
            window.openEndedData = (initialMode, qId) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: false,
                    isMandatory: false,
                    visibility: 'visible',
                    title: 'What are your thoughts?',
                    placeholder: 'Please share your thoughts here...',

                    init() {
                        try {
                            const saved = JSON.parse(localStorage.getItem('webropol_survey_mandatory_questions') || '{}');
                            this.isMandatory = Boolean(saved[this.questionId]);
                        } catch (e) {
                            this.isMandatory = false;
                        }

                        try {
                            const savedVisibility = JSON.parse(localStorage.getItem('webropol_survey_question_visibility') || '{}');
                            this.visibility = savedVisibility[this.questionId] || 'visible';
                        } catch (e) {
                            this.visibility = 'visible';
                        }

                        this.$watch('isMandatory', (value) => {
                            try {
                                const saved = JSON.parse(localStorage.getItem('webropol_survey_mandatory_questions') || '{}');
                                saved[this.questionId] = value;
                                localStorage.setItem('webropol_survey_mandatory_questions', JSON.stringify(saved));
                            } catch (e) {
                                console.error('Failed to save open ended mandatory state:', e);
                            }

                            if (this.$root && typeof this.$root.updateMandatoryInfo === 'function') {
                                this.$root.updateMandatoryInfo();
                            }
                        });

                        this.$watch('visibility', (value) => {
                            try {
                                const savedVisibility = JSON.parse(localStorage.getItem('webropol_survey_question_visibility') || '{}');
                                savedVisibility[this.questionId] = value;
                                localStorage.setItem('webropol_survey_question_visibility', JSON.stringify(savedVisibility));
                            } catch (e) {
                                console.error('Failed to save open ended visibility state:', e);
                            }
                        });
                    },

                    getVisibilityButtonClass() {
                        const visibilityClassMap = {
                            visible: '',
                            hidden: 'bg-webropol-warning-200 text-webropol-gray-900 hover:bg-webropol-warning-200 hover:text-webropol-gray-900',
                            disabled: 'bg-webropol-error-200 text-webropol-gray-900 hover:bg-webropol-error-200 hover:text-webropol-gray-900'
                        };

                        return visibilityClassMap[this.visibility] ?? '';
                    },

                    getVisibilityMenuItems() {
                        return JSON.stringify([
                            { id: 'visible', label: 'Visible', icon: 'fal fa-eye', checked: this.visibility === 'visible', bgClass: 'hover:bg-webropol-gray-50', checkedIndicatorIcon: 'fal fa-check', checkedIndicatorClass: 'text-webropol-gray-900' },
                            { id: 'hidden', label: 'Hidden', icon: 'fal fa-eye-slash', checked: this.visibility === 'hidden', bgClass: 'hover:bg-webropol-gray-50', checkedBgClass: 'bg-webropol-warning-200', checkedTextClass: 'text-webropol-gray-900', checkedIconClass: 'text-webropol-gray-900', checkedIndicatorIcon: 'fal fa-check', checkedIndicatorClass: 'text-webropol-gray-900', checkedContainerClass: 'mx-1 my-1 rounded-md' },
                            { id: 'disabled', label: 'Disabled', icon: 'fal fa-eye-slash', checked: this.visibility === 'disabled', bgClass: 'hover:bg-webropol-gray-50', checkedBgClass: 'bg-webropol-error-200', checkedTextClass: 'text-webropol-gray-900', checkedIconClass: 'text-webropol-gray-900', checkedIndicatorIcon: 'fal fa-check', checkedIndicatorClass: 'text-webropol-gray-900', checkedContainerClass: 'mx-1 my-1 rounded-md' }
                        ]);
                    },

                    getVisibilityIconClass() {
                        return this.visibility === 'visible' ? 'fal fa-eye' : 'fal fa-eye-slash';
                    },

                    selectVisibility(value) {
                        this.visibility = value;
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
        const toolbarButtonClass = 'w-8 h-8 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent text-[#1e6880] hover:[background-color:#eefbfd] hover:text-[#215669] active:[background-color:#b0e8f1] active:text-[#204859] focus:outline-none focus:ring-2 focus:ring-[#1e6880] focus:ring-offset-2 transition-colors duration-150 ease-in-out';
        const dangerToolbarButtonClass = 'w-8 h-8 inline-flex items-center justify-center rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors';

        this.innerHTML = `
            <div x-data="openEndedData('${this.mode}', '${this.questionId}')"
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
                            <div class="flex items-center justify-center w-6 h-6 text-orange-600 bg-orange-100 rounded-md">
                                <i class="fal fa-font-case text-xs"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700">Open ended</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 question-card-toolbar">
                        <button type="button" class="${toolbarButtonClass}" title="Rules and Jumps"><i class="fal fa-shuffle"></i></button>
                        <div class="relative" x-data="{ mandatoryOpen: false }">
                            <button type="button" @click="mandatoryOpen = !mandatoryOpen" @click.outside="mandatoryOpen = false"
                                :class="isMandatory ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600' : ''"
                                class="${toolbarButtonClass}" title="Required field">
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
                            <button type="button" @click="open = !open" @click.outside="open = false" :class="getVisibilityButtonClass()" class="${toolbarButtonClass}" title="Visibility">
                                <i :class="getVisibilityIconClass()"></i>
                            </button>
                            <div x-show="open" x-transition class="absolute top-full left-0 mt-1 z-50 w-40">
                                <webropol-context-menu
                                    :items="getVisibilityMenuItems()"
                                    width="auto"
                                    @item-click="selectVisibility($event.detail.id); open = false"
                                ></webropol-context-menu>
                            </div>
                        </div>
                        <button type="button" class="${toolbarButtonClass}" title="Add Image"><i class="fal fa-image-circle-plus"></i></button>
                        <div class="js-copy-btn-container inline-flex items-center" :data-question-id="questionId">
                            <button type="button" class="${toolbarButtonClass}" title="Copy" @click="copyQuestionNow(questionId)"><i class="fal fa-copy"></i></button>
                        </div>
                        <button type="button" onclick="openOpenEndedSettingsModal()" class="${toolbarButtonClass}" title="Settings"><i class="fal fa-cog"></i></button>
                        <button type="button" class="${dangerToolbarButtonClass}" title="Delete"><i class="fa-light fa-trash-can"></i></button>
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
                            x-text="'3. ' + title"></h3>
                    </div>
                    <div class="space-y-3">
                        <textarea class="w-full px-4 py-3 border border-webropol-gray-300 rounded-lg bg-white text-webropol-gray-400 resize-none" rows="4" disabled :placeholder="placeholder"></textarea>
                    </div>
                </div>

                <div x-show="selected && mode === 'edit'" class="p-6 rounded-b-3xl bg-white">
                    <div class="mb-6">
                        <label class="block text-lg font-semibold text-webropol-gray-900 mb-4" x-text="'3. ' + title"></label>
                        <div class="mb-4">
                            <textarea class="w-full px-4 py-3 border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-primary-500/20 focus:border-webropol-primary-500 transition-all resize-none" rows="6" :placeholder="placeholder"></textarea>
                            <p class="text-xs text-webropol-gray-500 mt-2">
                                <i class="fal fa-info-circle"></i>
                                Respondents can provide detailed feedback
                            </p>
                        </div>
                    </div>
                </div>

                <button x-show="selected && mode === 'edit'" title="Drag to reorder"
                        class="hidden sm:flex items-center justify-center cursor-move text-white bg-webropol-primary-700 hover:bg-webropol-primary-800 transition-colors rounded-l-xl w-10 h-14 absolute right-0 top-1/2 -translate-y-1/2 shadow">
                    <i class="fal fa-arrows-alt"></i>
                </button>
            </div>
        `;
    }
}

customElements.define('webropol-open-ended', OpenEnded);
