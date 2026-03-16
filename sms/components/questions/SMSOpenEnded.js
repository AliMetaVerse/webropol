import { BaseComponent } from '../../../design-system/utils/base-component.js';

export class SMSOpenEnded extends BaseComponent {
    static get observedAttributes() {
        return ['survey-name', 'question-number', 'sms-number', 'characters', 'credits', 'mode', 'question-id', 'question-text'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);

        if (!window.smsOpenEndedData) {
            window.smsOpenEndedData = (initialMode, qId) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: false,
                    questionText: '',

                    init() {
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

                        try {
                            const saved = JSON.parse(localStorage.getItem('webropol_sms_questions') || '{}');
                            if (saved[this.questionId]?.text) {
                                this.questionText = saved[this.questionId].text;
                            }
                        } catch (e) { /* ignore */ }
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
        const surveyName   = this.getAttribute('survey-name')    || 'SMS Survey';
        const qNum         = this.getAttribute('question-number') || '3';
        const smsNum       = this.getAttribute('sms-number')      || '3';
        const characters   = this.getAttribute('characters')      || '0';
        const credits      = this.getAttribute('credits')         || '1';
        const questionText = this.getAttribute('question-text')   || 'Please share any comments or suggestions you may have:';

        this.innerHTML = `
            <div x-data="smsOpenEndedData('${this.mode}', '${this.questionId}')"
                 @sms-click-question.window="if ($event.detail !== questionId) selected = false">

                <!-- SMS badge connector -->
                <div class="flex justify-center mb-4">
                    <div class="sms-badge">
                        <i class="fal fa-message"></i>
                        <span>SMS ${smsNum}</span>
                        <span>(${characters} Characters) ${credits} Credits</span>
                    </div>
                </div>

                <!-- Card -->
                <div class="survey-card p-5 mb-5 relative"
                     :class="selected ? 'ring-2 ring-webropol-primary-400' : ''"
                     @click="selectQuestion()">

                    <!-- Edit toolbar (shown when selected) -->
                    <div x-show="selected && mode === 'edit'"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 -translate-y-2"
                         x-transition:enter-end="opacity-100 translate-y-0"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100 translate-y-0"
                         x-transition:leave-end="opacity-0 -translate-y-2"
                         class="flex items-center justify-between mb-4 pb-3 border-b border-webropol-gray-100"
                         @click.stop>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-webropol-gray-100">
                                <div class="flex items-center justify-center w-6 h-6 text-orange-600 bg-orange-100 rounded-md">
                                    <i class="fal fa-font-case text-xs"></i>
                                </div>
                                <span class="text-xs font-medium text-webropol-gray-700">Open ended</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button class="p-1.5 rounded text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Copy question">
                                <i class="fal fa-copy text-sm"></i>
                            </button>
                            <button class="p-1.5 rounded text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors" title="Settings">
                                <i class="fal fa-cog text-sm"></i>
                            </button>
                            <button class="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete question">
                                <i class="fal fa-trash-can text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Survey title -->
                    <h3 class="text-[2rem] font-semibold text-center mb-4">${surveyName}</h3>

                    <!-- Question frame -->
                    <div class="question-frame">
                        <!-- Collapsed view -->
                        <div x-show="!selected || mode !== 'edit'">
                            <p class="text-base font-semibold mb-4 leading-snug">${qNum}. ${questionText}</p>
                            <textarea
                                class="w-full px-3 py-2 border border-webropol-gray-300 rounded bg-white text-webropol-gray-300 resize-none"
                                rows="4"
                                disabled
                                placeholder=""></textarea>
                        </div>

                        <!-- Edit view -->
                        <div x-show="selected && mode === 'edit'" @click.stop>
                            <div class="mb-4">
                                <label class="block text-xs font-medium text-webropol-gray-500 mb-1 uppercase tracking-wide">Question text</label>
                                <textarea
                                    class="w-full px-3 py-2 border border-webropol-gray-300 rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-webropol-primary-500/20 focus:border-webropol-primary-500 transition-all resize-none"
                                    rows="2"
                                    x-model="questionText"
                                    placeholder="${qNum}. ${questionText}"></textarea>
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

                    <!-- Add question button -->
                    <div class="pt-5 text-center text-webropol-primary-700 font-medium" @click.stop>
                        <button type="button" class="inline-flex items-center gap-2 hover:text-webropol-primary-900 transition-colors">
                            <i class="fal fa-circle-plus"></i>
                            <span>Add New SMS Question</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('webropol-sms-open-ended', SMSOpenEnded);
