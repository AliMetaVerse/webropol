import { BaseComponent } from '../../../design-system/utils/base-component.js';

export class ContactForm extends BaseComponent {
    static get observedAttributes() {
        return ['mode', 'question-id'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);

        if (!window.contactFormData) {
            window.contactFormData = (initialMode, qId) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: false,
                    isMandatory: false,
                    title: 'Please fill in your details.',
                    fields: [
                        { key: 'firstName', label: 'First name', type: 'text', placeholder: 'Enter first name' },
                        { key: 'lastName', label: 'Last name', type: 'text', placeholder: 'Enter last name' },
                        { key: 'mobile', label: 'Mobile', type: 'tel', placeholder: 'Enter mobile number' },
                        { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' }
                    ],

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
                                console.error('Failed to save contact form mandatory state:', e);
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
            <div x-data="contactFormData('${this.mode}', '${this.questionId}')"
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
                                <i class="fal fa-address-card text-xs"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700">Contact form</span>
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
                        <div class="js-copy-btn-container inline-flex items-center" :data-question-id="questionId">
                            <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Copy" @click="copyQuestionNow(questionId)"><i class="fal fa-copy"></i></button>
                        </div>
                        <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Settings" onclick="openQuestionSettingsModal('contact-form')"><i class="fal fa-cog"></i></button>
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
                            x-text="'1. ' + title"></h3>
                    </div>

                    <div class="space-y-3">
                        <template x-for="field in fields" :key="field.key">
                            <div class="flex items-center gap-4">
                                <label class="text-sm text-webropol-gray-700 w-24" x-text="field.label"></label>
                                <input :type="field.type" class="flex-1 px-4 py-2 border border-webropol-gray-300 rounded-lg bg-white" disabled>
                            </div>
                        </template>
                    </div>
                </div>

                <div x-show="selected && mode === 'edit'" class="p-6 rounded-b-3xl bg-white">
                    <div class="mb-6">
                        <label class="block text-lg font-semibold text-webropol-gray-900 mb-4" x-text="'1. ' + title"></label>

                        <div class="space-y-4">
                            <template x-for="field in fields" :key="field.key + '-expanded'">
                                <div class="flex items-center gap-4">
                                    <label class="text-sm font-medium text-webropol-gray-700 w-24" x-text="field.label"></label>
                                    <input :type="field.type" class="flex-1 px-4 py-3 border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-primary-500/20 focus:border-webropol-primary-500 transition-all" :placeholder="field.placeholder">
                                </div>
                            </template>
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

customElements.define('webropol-contact-form', ContactForm);
