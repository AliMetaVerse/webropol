import { BaseComponent } from '../../../design-system/utils/base-component.js';
import './settings/NPSSettingsModal.js';

export class NPSQuestion extends BaseComponent {
    static get observedAttributes() {
        return ['mode', 'question-id'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);

        if (!window.npsQuestionData) {
            window.npsQuestionData = (initialMode, qId) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: false,
                    isMandatory: false,
                    visibility: 'visible',

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
                                console.error('Failed to save NPS mandatory state:', e);
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
                                console.error('Failed to save NPS visibility state:', e);
                            }
                        });
                    },

                    getVisibilityButtonClass() {
                        const visibilityClassMap = {
                            visible: 'bg-webropol-primary-200 text-webropol-gray-900 hover:bg-webropol-primary-200 hover:text-webropol-gray-900',
                            hidden: 'bg-webropol-warning-200 text-webropol-gray-900 hover:bg-webropol-warning-200 hover:text-webropol-gray-900',
                            disabled: 'bg-webropol-error-200 text-webropol-gray-900 hover:bg-webropol-error-200 hover:text-webropol-gray-900'
                        };

                        return visibilityClassMap[this.visibility] || visibilityClassMap.visible;
                    },

                    getVisibilityMenuItems() {
                        return JSON.stringify([
                            { id: 'visible', label: 'Visible', icon: 'fal fa-eye', checked: this.visibility === 'visible', bgClass: 'hover:bg-webropol-gray-50', checkedBgClass: 'bg-webropol-primary-200', checkedTextClass: 'text-webropol-gray-900', checkedIconClass: 'text-webropol-gray-900', checkedIndicatorIcon: 'fal fa-check', checkedIndicatorClass: 'text-webropol-gray-900', checkedContainerClass: 'mx-1 my-1 rounded-md' },
                            { id: 'hidden', label: 'Hidden', icon: 'fal fa-eye-slash', checked: this.visibility === 'hidden', bgClass: 'hover:bg-webropol-gray-50', checkedBgClass: 'bg-webropol-warning-200', checkedTextClass: 'text-webropol-gray-900', checkedIconClass: 'text-webropol-gray-900', checkedIndicatorIcon: 'fal fa-check', checkedIndicatorClass: 'text-webropol-gray-900', checkedContainerClass: 'mx-1 my-1 rounded-md' },
                            { id: 'disabled', label: 'Disabled', icon: 'fal fa-ban', checked: this.visibility === 'disabled', bgClass: 'hover:bg-webropol-gray-50', checkedBgClass: 'bg-webropol-error-200', checkedTextClass: 'text-webropol-gray-900', checkedIconClass: 'text-webropol-gray-900', checkedIndicatorIcon: 'fal fa-check', checkedIndicatorClass: 'text-webropol-gray-900', checkedContainerClass: 'mx-1 my-1 rounded-md' }
                        ]);
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
        const toolbarButtonClass = 'w-8 h-8 inline-flex items-center justify-center rounded-lg text-webropol-gray-500 hover:text-webropol-primary-700 hover:bg-webropol-primary-50 focus:outline-none focus:ring-2 focus:ring-webropol-primary-200 transition-colors';
        const dangerToolbarButtonClass = 'w-8 h-8 inline-flex items-center justify-center rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors';

        this.innerHTML = `
            <div id="npsQuestionCard"
                 x-data="npsQuestionData('${this.mode}', '${this.questionId}')"
                 @click-question.window="if ($event.detail !== questionId) selected = false"
                 class="question-card"
                 :class="selected ? 'selected' : ''">

                <div class="drag-handle" title="Drag to reorder">
                    <i class="fal fa-arrows-alt"></i>
                </div>

                <div x-show="selected"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 -translate-y-2"
                     x-transition:enter-end="opacity-100 translate-y-0"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100 translate-y-0"
                     x-transition:leave-end="opacity-0 -translate-y-2"
                     class="question-card-header">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 bg-white px-1 py-1 rounded-lg border border-gray-100">
                            <div class="flex items-center justify-center w-6 h-6 text-purple-600 bg-purple-100 rounded-md">
                                <i class="fal fa-tachometer-alt text-xs"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700">NPS</span>
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
                                <i class="fal fa-eye"></i>
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
                        <button type="button" class="${toolbarButtonClass}" title="eTest"><i class="fal fa-graduation-cap"></i></button>
                        <button type="button" class="${toolbarButtonClass}" title="Points"><i class="fal fa-bullseye"></i></button>
                        <button type="button" onclick="openNPSSettingsModal()" class="${toolbarButtonClass}" title="Settings"><i class="fal fa-cog"></i></button>
                        <button type="button" class="${dangerToolbarButtonClass}" title="Delete"><i class="fa-light fa-trash-can"></i></button>
                    </div>
                </div>

                <div x-show="!selected" class="p-6 cursor-pointer group question-card-collapsed transition-colors rounded-3xl" @click="selectQuestion()">
                    <div class="flex items-start justify-between mb-4">
                        <label class="block text-lg font-semibold text-webropol-gray-900 group-hover:text-webropol-primary-700 transition-colors">
                            3. How likely are you to recommend our product to a friend or colleague?
                        </label>
                        <div class="flex items-center space-x-2">
                            <span class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">NPS</span>
                            <i class="fal fa-edit text-webropol-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                    </div>
                    <p class="text-sm text-webropol-gray-600 mb-4">Please rate on a scale from 0 (Not at all likely) to 10 (Extremely likely).</p>
                    <div>
                        <div class="flex flex-wrap gap-2 items-center" role="radiogroup" aria-label="NPS Scale 0 to 10">
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">0</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">1</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">2</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">3</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">4</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">5</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">6</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">7</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">8</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">9</div></label>
                            <label class="cursor-pointer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm">10</div></label>
                        </div>
                        <div class="flex justify-between text-xs text-webropol-gray-500 mt-3 px-1">
                            <span>Not at all likely</span>
                            <span>Extremely likely</span>
                        </div>
                    </div>
                </div>

                <div x-show="selected" class="p-6 rounded-b-3xl bg-white">
                    <div class="mb-6">
                        <label class="block text-lg font-semibold text-webropol-gray-900 mb-2">
                            3. How likely are you to recommend our product to a friend or colleague?
                        </label>
                        <p id="npsQuestionDescription" class="text-sm text-webropol-gray-600 mb-4">Please rate on a scale from 0 (Not at all likely) to 10 (Extremely likely).</p>

                        <div id="npsRenderContainer">
                            <fieldset>
                                <legend class="sr-only">Net Promoter Score Scale</legend>
                                <div class="flex flex-wrap gap-2 items-center" role="radiogroup" aria-label="NPS Scale 0 to 10">
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="0" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">0</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="1" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">1</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="2" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">2</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="3" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">3</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="4" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">4</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="5" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">5</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="6" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">6</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="7" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">7</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="8" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">8</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="9" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">9</div></label>
                                    <label class="cursor-pointer"><input type="radio" name="npsScore" value="10" class="sr-only peer"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow">10</div></label>
                                </div>
                                <div class="flex justify-between text-xs text-webropol-gray-500 mt-3 px-1">
                                    <span>Not at all likely</span>
                                    <span>Extremely likely</span>
                                </div>
                            </fieldset>
                        </div>

                        <template id="npsTemplateRadiobuttons">
                            <fieldset>
                                <legend class="sr-only">Net Promoter Score Scale</legend>
                                <div class="flex flex-wrap gap-2 items-center" role="radiogroup" aria-label="NPS Scale 0 to 10">
                                <script>/* placeholder to preserve order */</script>
                                </div>
                                <div class="flex justify-between text-xs text-webropol-gray-500 mt-3 px-1">
                                    <span>Not at all likely</span>
                                    <span>Extremely likely</span>
                                </div>
                            </fieldset>
                        </template>
                        <template id="npsTemplateSlider">
                            <div class="space-y-3" aria-label="NPS Slider" role="group">
                                <input id="npsSlider" type="range" min="0" max="10" value="0" class="w-full h-2 rounded-lg appearance-none slider bg-webropol-gray-200">
                                <div class="flex justify-between text-[11px] text-webropol-gray-500">
                                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                                </div>
                                <div class="text-xs text-webropol-primary-700 font-medium"><span id="npsSliderValue">Selected: 0</span></div>
                            </div>
                        </template>
                        <template id="npsTemplateSmileys">
                            <div class="flex justify-center gap-4" role="radiogroup" aria-label="NPS Smileys">
                                <button type="button" data-nps-smiley="detractor" class="nps-smiley" aria-pressed="false" title="Detractor (0-6)"><i class="fal fa-face-frown"></i></button>
                                <button type="button" data-nps-smiley="passive" class="nps-smiley" aria-pressed="false" title="Passive (7-8)"><i class="fal fa-face-meh"></i></button>
                                <button type="button" data-nps-smiley="promoter" class="nps-smiley" aria-pressed="false" title="Promoter (9-10)"><i class="fal fa-face-smile"></i></button>
                            </div>
                            <div class="text-center mt-3 text-xs text-webropol-gray-500" id="npsSmileyHint">Select a mood</div>
                        </template>
                    </div>
                </div>

                <button x-show="selected" title="Drag to reorder" role="button"
                        class="hidden sm:flex items-center justify-center cursor-move text-white bg-webropol-primary-700 hover:bg-webropol-primary-800 transition-colors rounded-l-xl w-10 h-14 absolute right-0 top-1/2 -translate-y-1/2 shadow"
                        aria-hidden="false">
                    <i class="fal fa-arrows-alt"></i>
                </button>
            </div>
        `;
    }
}

customElements.define('webropol-nps', NPSQuestion);
