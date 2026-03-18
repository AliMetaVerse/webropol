import { BaseComponent } from '../../../design-system/utils/base-component.js';

export class SMSNpsQuestion extends BaseComponent {
    static get observedAttributes() {
        return ['mode', 'question-id', 'question-number', 'sms-number', 'characters', 'credits', 'question-text'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);

        if (!window.smsNpsData) {
            window.smsNpsData = (initialMode, qId, defaultText) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: false,
                    questionText: defaultText || '',
                    scale: Array.from({ length: 11 }, (_, i) => i),

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
                                console.error('Failed to save SMS NPS question text:', e);
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
        const qNum         = this.getAttribute('question-number') || '2';
        const smsNum       = this.getAttribute('sms-number')      || '2';
        const characters   = this.getAttribute('characters')      || '0';
        const credits      = this.getAttribute('credits')         || '1';
        const questionText = this.getAttribute('question-text')   || "How easy or difficult has it been to use Webropol's services over the past six months? Please rate on a scale from 0 to 10, where: 0 = Very difficult and 10 = Very easy.";
        const safeText     = questionText.replace(/'/g, "\\'");

        this.innerHTML = `
            <div x-data="smsNpsData('${this.mode}', '${this.questionId}', '${safeText}')"
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
                            <div class="flex items-center justify-center w-6 h-6 text-purple-600 bg-purple-100 rounded-md">
                                <i class="fal fa-tachometer-alt text-xs"></i>
                            </div>
                            <span class="text-xs font-medium text-gray-700">NPS Scale</span>
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
                    <div class="flex items-start justify-between mb-4">
                        <h3 class="text-base font-semibold text-webropol-gray-900 group-hover:text-webropol-primary-700 transition-colors">
                            ${qNum}. <span x-text="questionText"></span>
                        </h3>
                        <span class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3">NPS</span>
                    </div>
                    <div class="max-w-[520px] mx-auto">
                        <div class="flex flex-wrap gap-2 items-center" role="radiogroup" aria-label="NPS Scale 0 to 10">
                            <template x-for="n in scale" :key="n">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white hover:border-webropol-primary-400 transition-all shadow-sm" x-text="n"></div>
                            </template>
                        </div>
                        <div class="flex justify-between text-xs text-webropol-gray-500 mt-3 px-1">
                            <span>Not at all likely</span>
                            <span>Extremely likely</span>
                        </div>
                    </div>
                </div>

                <!-- Expanded edit view -->
                <div x-show="selected && mode === 'edit'" class="p-6 rounded-b-3xl bg-white">
                    <div class="mb-5">
                        <label class="block text-xs font-medium text-webropol-gray-500 mb-1 uppercase tracking-wide">Question text</label>
                        <textarea
                            class="w-full px-3 py-2 border border-webropol-gray-300 rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-webropol-primary-500/20 focus:border-webropol-primary-500 transition-all resize-none"
                            rows="3"
                            x-model="questionText"
                            placeholder="Enter question text..."></textarea>
                    </div>
                    <div class="max-w-[520px] mx-auto">
                        <fieldset>
                            <legend class="sr-only">NPS Scale 0 to 10</legend>
                            <div class="flex flex-wrap gap-2 items-center" role="radiogroup" aria-label="NPS Scale 0 to 10">
                                <template x-for="n in scale" :key="'radio-' + n">
                                    <label class="cursor-pointer">
                                        <input type="radio" :name="'nps_sms_' + questionId" :value="n" class="sr-only peer">
                                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold border border-webropol-gray-300 text-webropol-gray-700 bg-white peer-checked:bg-gradient-to-br peer-checked:from-webropol-primary-500 peer-checked:to-webropol-primary-600 peer-checked:text-white peer-checked:border-webropol-primary-600 hover:border-webropol-primary-400 transition-all shadow-sm hover:shadow" x-text="n"></div>
                                    </label>
                                </template>
                            </div>
                            <div class="flex justify-between text-xs text-webropol-gray-500 mt-3 px-1">
                                <span>Not at all likely</span>
                                <span>Extremely likely</span>
                            </div>
                        </fieldset>
                    </div>
                </div>
                </div>
            </div>
        `;
    }
}

customElements.define('webropol-sms-nps', SMSNpsQuestion);
