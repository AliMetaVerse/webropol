import { BaseComponent } from '../../../design-system/utils/base-component.js';

export class SMSOpenEnded extends BaseComponent {
    static get observedAttributes() {
        return ['mode', 'question-id', 'question-number', 'sms-number', 'characters', 'credits', 'question-text'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);

        if (!window.smsOpenEndedData) {
            window.smsOpenEndedData = (initialMode, qId, defaultText) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: false,
                    questionText: defaultText || '',

                    init() {
                        try {
                            const saved = JSON.parse(localStorage.getItem('webropol_sms_questions') || '{}');
                            if (saved[this.questionId]?.text) {
                                this.questionText = saved[this.questionId].text;
                            }
                        } catch (e) { /* ignore */ }

                        this.$watch('questionText', (value) => {
                            try {
                                const saved = JSON.parse(localStorage.getItem('webropol_sms_questions') || '{}');
                                if (!saved[this.questionId]) saved[this.questionId] = {};
                                saved[this.questionId].text = value;
                                localStorage.setItem('webropol_sms_questions', JSON.stringify(saved));
                            } catch (e) {
                                console.error('Failed to save SMS open-ended question text:', e);
                            }
                        });
                    },

                    selectQuestion() {
                        if (this.mode !== 'edit') return;
                        this.selected = true;
                        window.dispatchEvent(new CustomEvent('sms-click-question', { detail: this.questionId }));
                    }
                };
            };
        }
    }

    render() {
        const qNum         = this.getAttribute('question-number') || '3';
        const smsNum       = this.getAttribute('sms-number')      || '3';
        const characters   = this.getAttribute('characters')      || '0';
        const credits      = this.getAttribute('credits')         || '1';
        const questionText = this.getAttribute('question-text')   || 'Please share any comments or suggestions you may have:';
        const safeText     = questionText.replace(/'/g, "\\'");

        this.innerHTML = `
            <div x-data="smsOpenEndedData('${this.mode}', '${this.questionId}', '${safeText}')"
                 @sms-click-question.window="if ($event.detail !== questionId) selected = false">

                <!-- SMS badge (outside the card) -->
                <div class="flex justify-center mb-3">
                    <div class="sms-badge">
                        <i class="fal fa-message"></i>
                        <span>SMS ${smsNum}</span>
                        <span>(${characters} Characters) ${credits} Credits</span>
                    </div>
                </div>

                <div class="question-card"
                     :class="selected ? 'selected' : ''">

                <div class="drag-handle" title="Drag to reorder">
                    <i class="fal fa-arrows-alt"></i>
                </div>

                <!-- Toolbar header (shown when selected in edit mode) -->
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
                        <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Copy question"><i class="fal fa-copy"></i></button>
                        <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Settings"><i class="fal fa-cog"></i></button>
                        <button class="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete"><i class="fa-light fa-trash-can"></i></button>
                    </div>
                </div>

                <!-- Collapsed view -->
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
                        <h3 class="text-base font-semibold text-webropol-gray-900 group-hover:text-webropol-primary-700 transition-colors">
                            ${qNum}. <span x-text="questionText"></span>
                        </h3>
                    </div>
                    <textarea
                        class="w-full px-3 py-2 border border-webropol-gray-300 rounded-lg bg-white text-webropol-gray-300 resize-none"
                        rows="3"
                        disabled
                        placeholder=""></textarea>
                </div>

                <!-- Expanded edit view -->
                <div x-show="selected && mode === 'edit'" class="p-6 rounded-b-3xl bg-white">
                    <div class="mb-4">
                        <label class="block text-xs font-medium text-webropol-gray-500 mb-1 uppercase tracking-wide">Question text</label>
                        <textarea
                            class="w-full px-3 py-2 border border-webropol-gray-300 rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-webropol-primary-500/20 focus:border-webropol-primary-500 transition-all resize-none"
                            rows="2"
                            x-model="questionText"
                            placeholder="Enter question text..."></textarea>
                    </div>
                    <textarea
                        class="w-full px-3 py-2 border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-webropol-primary-500/20 focus:border-webropol-primary-500 transition-all resize-none"
                        rows="5"
                        placeholder="Respondents type their answer here..."></textarea>
                    <p class="text-xs text-webropol-gray-500 mt-2">
                        <i class="fal fa-info-circle"></i>
                        Respondents can provide free-text feedback
                    </p>
                </div>
                </div>
            </div>
        `;
    }
}

customElements.define('webropol-sms-open-ended', SMSOpenEnded);
