import { BaseComponent } from '../../../design-system/utils/base-component.js';
import './settings/NumericSliderSettingsModal.js';

export class NumericSlider extends BaseComponent {
    static get observedAttributes() {
        return ['mode', 'question-id'];
    }

    init() {
        this.mode = this.getAttribute('mode') || 'edit';
        this.questionId = this.getAttribute('question-id') || Math.random().toString(36).substring(2, 15);
        
        // Expose Alpine data function globally so x-data can find it. 
        if (!window.numericSliderData) {
            window.numericSliderData = (initialMode, qId) => {
                return {
                    mode: initialMode || 'edit',
                    questionId: qId,
                    selected: initialMode !== 'edit', // Default selected true in respond mode
                    
                    // Settings
                    showSettings: false,
                    questionType: 'health-slider', // 'slider' | 'health-slider'
                    settingsDisabled: true, // Only for health-slider

                    settings: {
                        // Slider Values
                        min: 0.00,
                        max: 10.00,
                        step: 1,
                        start: 0,
                        quantity: '',
                        showValue: true,
                        showDontKnow: true,
                        dontKnowLabel: "I don't know",
                        
                        // Slider Labels
                        showLabels: true,
                        
                        // Positions
                        direction: 'min-max', // 'min-max' | 'max-min'
                        orientationDesktop: 'vertical', // 'horizontal' | 'vertical'
                        orientationMobile: 'horizontal', // 'horizontal' | 'vertical'
                        
                        // Description
                        showDescription: true,
                        descPlacement: 'below', // 'below' | 'above'
                        
                        // Visibility
                        visibility: 'visible' // 'visible' | 'hidden' | 'disabled'
                    },

                    // Mobile detection & Preview
                    isMobile: false,
                    previewDevice: 'desktop', // 'desktop', 'tablet', 'mobile'

                    get effectiveIsMobile() {
                        // Start simple: Mobile preview counts as mobile
                        if (this.mode === 'respond' && this.previewDevice === 'mobile') {
                            return true;
                        }
                        // If native mobile, it's mobile
                        return this.isMobile;
                    },

                    get containerClass() {
                        if (this.mode !== 'respond') return 'w-full p-0 transition-all duration-300';
                        
                        switch(this.previewDevice) {
                            case 'mobile': return 'max-w-[393px] mx-auto border-x border-gray-200 shadow-xl bg-white min-h-[852px] transition-all duration-300 rounded-[3rem] my-8 border-[8px] border-gray-800 mobile-view';
                            case 'tablet': return 'max-w-[820px] mx-auto border-x border-gray-200 shadow-xl bg-white min-h-[1180px] transition-all duration-300 rounded-[2rem] my-8 border-[12px] border-gray-800 tablet-view';
                            default: return 'max-w-4xl mx-auto question-card p-0 shadow-lg transition-all duration-300';
                        }
                    },

                    get orientation() { 
                        // Use force layout settings based on device
                        if (this.effectiveIsMobile) {
                            return this.settings.orientationMobile || 'horizontal';
                        }
                        return this.settings.orientationDesktop || 'vertical'; 
                    },
                    set orientation(val) { 
                        if (this.effectiveIsMobile) {
                            this.settings.orientationMobile = val;
                        } else {
                            this.settings.orientationDesktop = val;
                        }
                    },

                    init() {
                        // Watch modal state for body scroll lock
                        this.$watch('showSettings', value => {
                            if (value) document.body.classList.add('modal-open');
                            else document.body.classList.remove('modal-open');
                        });

                        // Watch selection state
                        this.$watch('selected', value => {
                            if (value && this.mode === 'edit') {
                                window.dispatchEvent(new CustomEvent('click-question', {
                                    detail: this.questionId
                                }));
                            }
                        });

                        // Watch for attribute changes on the host element should be handled via observedAttributes on the web component,
                        // and pushed to this state if needed. But for self-contained logic, this is fine.
                        
                        // Check for settings-open attribute on host
                        const host = this.$el.closest('webropol-numeric-slider');
                        if (host && host.hasAttribute('settings-open')) {
                            this.showSettings = true;
                        }

                        // Check if mobile on init
                        this.checkMobileOrientation();
                    },

                    checkMobileOrientation() {
                        // Update reactive mobile state
                        this.isMobile = window.innerWidth < 768;
                    },

                    value: null,
                    originalValue: null,
                    dontKnow: false,
                    dragging: false,
                    dragFrame: null,
                    pendingClient: null,
                    pendingAxis: null,
                    activeTrackRect: null,
                    
                    texts: {
                        title: 'On a scale from 0 to 100, how would you rate your overall health today?',
                        instructions: `<ul>
<li>We would like to know how good or bad your health is TODAY.</li>
<li>You will see a scale numbered from 0 to 100.</li>
<li>100 means the best health you can imagine.</li>
<li>0 means the worst health you can imagine.</li>
<li>Please indicate on the scale how your health is TODAY.</li>
</ul>`,
                        boxLabel1: 'YOUR',
                        boxLabel2: 'HEALTH',
                        boxLabel3: 'TODAY',
                        bestLabel1: 'Best health',
                        bestLabel2: 'you can',
                        bestLabel3: 'imagine',
                        worstLabel1: 'Worst health',
                        worstLabel2: 'you can',
                        worstLabel3: 'imagine'
                    },
                    
                    getClientPosition(e, axis) {
                        if (e && e.touches && e.touches[0]) {
                            return axis === 'vertical' ? e.touches[0].clientY : e.touches[0].clientX;
                        }
                        return axis === 'vertical' ? e.clientY : e.clientX;
                    },

                    getTrackElement(axis) {
                        const isHealthSlider = this.questionType === 'health-slider';
                        if (axis === 'vertical') {
                            return isHealthSlider
                                ? (this.$refs.trackVerticalHealth || this.$refs.trackVertical)
                                : (this.$refs.trackVertical || this.$refs.trackVerticalHealth);
                        }
                        return isHealthSlider
                            ? (this.$refs.trackHorizontalHealth || this.$refs.trackHorizontal)
                            : (this.$refs.trackHorizontal || this.$refs.trackHorizontalHealth);
                    },

                    getTrackRect(axis) {
                        if (this.dragging && this.activeTrackRect) return this.activeTrackRect;
                        const track = this.getTrackElement(axis);
                        return track ? track.getBoundingClientRect() : null;
                    },

                    applyValueFromClient(axis, clientPos) {
                        if (this.dontKnow || clientPos === null || clientPos === undefined) return;
                        const rect = this.getTrackRect(axis);
                        if (!rect) return;

                        let nextValue;

                        if (axis === 'vertical') {
                            let relativeY = clientPos - rect.top;
                            if (relativeY < 0) relativeY = 0;
                            if (relativeY > rect.height) relativeY = rect.height;
                            const percent = 100 - (relativeY / rect.height * 100);
                            nextValue = Math.round(percent);
                        } else {
                            let relativeX = clientPos - rect.left;
                            if (relativeX < 0) relativeX = 0;
                            if (relativeX > rect.width) relativeX = rect.width;
                            const percent = (relativeX / rect.width * 100);
                            nextValue = Math.round(percent);
                        }

                        if (nextValue !== this.value) {
                            this.value = nextValue;
                        }
                    },

                    queueValueUpdate(axis, clientPos) {
                        this.pendingAxis = axis;
                        this.pendingClient = clientPos;
                        if (this.dragFrame !== null) return;

                        this.dragFrame = requestAnimationFrame(() => {
                            const pendingAxis = this.pendingAxis;
                            const pendingClient = this.pendingClient;
                            this.dragFrame = null;
                            this.pendingAxis = null;
                            this.pendingClient = null;
                            this.applyValueFromClient(pendingAxis, pendingClient);
                        });
                    },

                    // Vertical Logic
                    updateFromEvent(e) {
                        const clientY = this.getClientPosition(e, 'vertical');
                        this.applyValueFromClient('vertical', clientY);
                    },

                    // Horizontal Logic
                    updateFromEventHorizontal(e) {
                        const clientX = this.getClientPosition(e, 'horizontal');
                        this.applyValueFromClient('horizontal', clientX);
                    },

                    startDrag(e) {
                        if (this.dontKnow) return;
                        this.dragging = true;
                        const track = this.getTrackElement('vertical');
                        this.activeTrackRect = track ? track.getBoundingClientRect() : null;
                        this.queueValueUpdate('vertical', this.getClientPosition(e, 'vertical'));
                    },

                    startDragHorizontal(e) {
                        if (this.dontKnow) return;
                        this.dragging = true;
                        const track = this.getTrackElement('horizontal');
                        this.activeTrackRect = track ? track.getBoundingClientRect() : null;
                        this.queueValueUpdate('horizontal', this.getClientPosition(e, 'horizontal'));
                    },

                    onDrag(e) {
                        if (!this.dragging) return;
                        this.queueValueUpdate('vertical', this.getClientPosition(e, 'vertical'));
                    },

                    onDragHorizontal(e) {
                        if (!this.dragging) return;
                        this.queueValueUpdate('horizontal', this.getClientPosition(e, 'horizontal'));
                    },

                    stopDrag() {
                        const wasDragging = this.dragging;
                        this.dragging = false;
                        this.activeTrackRect = null;
                        this.pendingAxis = null;
                        this.pendingClient = null;
                        if (this.dragFrame !== null) {
                            cancelAnimationFrame(this.dragFrame);
                            this.dragFrame = null;
                        }
                    },

                    updateValue(e) { this.updateFromEvent(e); },
                    updateValueHorizontal(e) { this.updateFromEventHorizontal(e); }
                };
            };
        }
    }

    render() {
        // We use a light DOM approach so outer Alpine scopes work if needed, 
        // but we also have our own internal scope. To bridge them, we can use 
        // an internal variable that syncs or just use the internal one for UI state.
        
        this.innerHTML = `
            <style>
                /* Unified question card styling */
                .question-card{border:1px solid #e2e8f0;border-radius:1.25rem;background:#fff;position:relative;transition:box-shadow .18s ease,border-color .18s ease,background-color .18s ease}
                .question-card:hover{border-color:#d5dde6}
                .question-card.selected{border-color:#06b6d4;background:#fff;box-shadow:0 6px 18px -4px rgba(6,182,212,.25)}
                
                .question-card-header{display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;border-bottom:1px solid #e2e8f0;background:#f8fafc;border-radius:1.25rem 1.25rem 0 0}
                .question-card.selected .question-card-header{background:#e0f7fb;border-color:#bae8f1}
                
                .drag-handle {
                    position: absolute; right: -12px; top: 50%; transform: translateY(-50%);
                    opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease;
                    z-index: 10; cursor: move; background: white; border: 1px solid #cbd5e1;
                    border-radius: 8px; padding: 8px 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .question-card:hover .drag-handle, .question-card.selected .drag-handle { opacity: 1; right: -16px; }
                .drag-handle i { color: #64748b; font-size: 16px; }
                .drag-handle:hover i { color: #06b6d4; }

                /* Collapsed Preview */
                .question-card-collapsed:hover { background: #f8fafc; }

                /* Force Mobile Styles in Mobile Preview */
                .mobile-view .md\\:p-12 { padding: 1.5rem !important; }
                .mobile-view .md\\:px-6 { padding-left: 1rem !important; padding-right: 1rem !important; }
                .mobile-view .md\\:py-12 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
                .mobile-view .md\\:flex-row { flex-direction: column !important; }
                .mobile-view .md\\:gap-12 { gap: 2rem !important; }
                .mobile-view .md\\:gap-16 { gap: 2rem !important; }
                .mobile-view .md\\:mt-12 { margin-top: 2rem !important; }
                .mobile-view .md\\:mx-0 { margin-left: auto !important; margin-right: auto !important; }
                .mobile-view .md\\:w-56 { width: 100% !important; max-width: 14rem !important; }
                .mobile-view .md\\:text-2xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
                .mobile-view .md\\:text-7xl { font-size: 3rem !important; line-height: 1 !important; }
                .mobile-view .md\\:w-64 { width: 100% !important; max-width: 16rem !important; }
                .mobile-view .md\\:prose-lg { font-size: 1rem !important; line-height: 1.5 !important; }
                
                /* Hide number input spinners */
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }

                /* Z-index fix for header overlapping modals */
                body:has(.modal-overlay.active) webropol-header,
                body.modal-open webropol-header {
                    z-index: 1 !important;
                }
            </style>

              <div x-data="numericSliderData('${this.mode}', '${this.questionId}')" class="w-full"
                  @click-question.window="if(mode === 'edit' && $event.detail !== questionId) { selected = false; showSettings = false; }"
                 x-effect="if($el.closest('webropol-numeric-slider').hasAttribute('settings-open')) { showSettings = true; selected = true; }"
                 @click.outside="if(mode === 'edit') { selected = false; showSettings = false; }">
               
                 <!-- Top Bar: Mode Switcher (only for respond mode testing inside component if needed) -->
                 <template x-if="mode === 'respond'">
                    <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <div class="bg-webropol-gray-100 p-1 rounded-lg inline-flex items-center">
                             <div class="flex items-center ml-2 pl-2 space-x-1">
                                <button @click="previewDevice = 'desktop'" 
                                        :class="previewDevice === 'desktop' ? 'bg-white shadow-sm text-webropol-primary-700' : 'text-gray-400 hover:text-gray-600'"
                                        class="p-2 rounded-md transition-all duration-200" title="Desktop view">
                                    <i class="fa-light fa-desktop"></i>
                                </button>
                                <button @click="previewDevice = 'tablet'" 
                                        :class="previewDevice === 'tablet' ? 'bg-white shadow-sm text-webropol-primary-700' : 'text-gray-400 hover:text-gray-600'"
                                        class="p-2 rounded-md transition-all duration-200" title="Tablet view">
                                    <i class="fa-light fa-tablet-screen-button"></i>
                                </button>
                                <button @click="previewDevice = 'mobile'" 
                                        :class="previewDevice === 'mobile' ? 'bg-white shadow-sm text-webropol-primary-700' : 'text-gray-400 hover:text-gray-600'"
                                        class="p-2 rounded-md transition-all duration-200" title="Mobile view">
                                    <i class="fa-light fa-mobile-screen-button"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </template>

               <!-- Main Card Wrapper -->
                <div class="transition-all duration-300 relative question-card" 
                     :class="[containerClass, (mode === 'edit' && selected) ? 'selected' : '']"
                     @click="if(mode === 'edit') selected = true"
                     >
                    
                    <!-- Drag Handle (Edit Mode) -->
                    <template x-if="mode === 'edit'">
                        <div x-show="selected" class="drag-handle" title="Drag to reorder" 
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0"
                             x-transition:enter-end="opacity-100">
                            <i class="fal fa-arrows-alt"></i>
                        </div>
                    </template>


                    <!-- Header Section (Toolbar) - Expanded View -->
                    <div class="question-card-header" 
                         x-show="mode === 'edit' && selected && !effectiveIsMobile"
                         x-transition:enter="transition ease-out duration-200" 
                         x-transition:enter-start="opacity-0 -translate-y-2" 
                         x-transition:enter-end="opacity-100 translate-y-0">
                         
                        <!-- Left: Type Badge -->
                        <div class="flex items-center gap-2">
                            <div class="bg-white px-1 py-1 rounded-lg border border-gray-100 flex items-center gap-2">
                                <span class="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-600">
                                    <i class="fa-light fa-sliders text-xs"></i>
                                </span>
                                <span class="text-xs font-medium text-gray-700">Numeric slider</span>
                            </div>
                        </div>

                        <!-- Right: Actions -->
                        <div class="flex items-center gap-1 question-card-toolbar">
                             <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors p-2 rounded" title="Rules">
                                <i class="fal fa-shuffle"></i>
                            </button>
                            <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors p-2 rounded" title="Mandatory">
                                <i class="fal fa-asterisk"></i>
                            </button>
                            <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors p-2 rounded" title="Visibility">
                                <i class="fal fa-eye"></i>
                            </button>
                            <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors p-2 rounded" title="Add Image">
                                <i class="fal fa-image-circle-plus"></i>
                            </button>
                            
                            <div class="w-px h-4 bg-gray-300 mx-1"></div>
                            
                            <button class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors p-2 rounded" title="Copy">
                                <i class="fal fa-copy"></i>
                            </button>
                            <button @click.stop="showSettings = !showSettings" class="text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-webropol-primary-50 transition-colors p-2 rounded relative" title="Settings">
                                <i class="fal fa-cog"></i>
                                <span x-show="questionType === 'health-slider'" 
                                      x-transition:enter="transition ease-out duration-200"
                                      x-transition:enter-start="opacity-0 scale-0"
                                      x-transition:enter-end="opacity-100 scale-100"
                                      class="absolute -top-1 -right-1 w-4 h-4 bg-webropol-primary-500 rounded-full flex items-center justify-center">
                                    <i class="fa-solid fa-heart-pulse text-white text-[8px]"></i>
                                </span>
                            </button>
                            <button class="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded" title="Delete">
                                <i class="fa-light fa-trash-can"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Expanded Body (Editor) & Respond Mode -->
                    <div class="transition-all duration-300" 
                         :class="[effectiveIsMobile ? '' : (mode === 'edit' ? 'bg-white rounded-3xl' : 'md:p-12'), 'block']">
                         
                         <div :class="mode === 'edit' ? 'p-6' : ''">
                        <!-- Title Section -->
                        <div class="mb-10 pl-2">
                            <!-- Edit Mode: Inputs (When Selected) -->
                            <template x-if="mode === 'edit' && selected">
                                <div class="space-y-4">
                                    <textarea x-model="texts.title" rows="1" @input="$el.style.height = 'auto'; $el.style.height = $el.scrollHeight + 'px'" class="w-full text-xl md:text-2xl font-extrabold text-webropol-gray-900 tracking-tight border-b-2 border-transparent hover:border-webropol-primary-100 focus:border-webropol-primary-500 focus:outline-none transition-all duration-200 bg-transparent placeholder-webropol-gray-300 pb-2 resize-none overflow-hidden"></textarea>
                                </div>
                            </template>
                            <!-- View Mode: Text (When Not Selected OR Respond Mode) -->
                            <template x-if="mode === 'respond' || (mode === 'edit' && !selected)">
                                <div class="space-y-2">
                                    <h2 class="text-xl md:text-2xl font-extrabold text-webropol-gray-900 tracking-tight leading-tight" x-text="texts.title || 'Question Title'"></h2>
                                </div>
                            </template>
                        </div>

                        <!-- Content Area (Flex determines layout) -->
                        <div class="flex gap-8 transition-all duration-500"
                                :class="[
                                effectiveIsMobile || (orientation === 'horizontal' && questionType === 'health-slider') ? 'flex-col' : 'flex-col md:flex-row md:gap-16',
                                (orientation === 'vertical' && questionType === 'health-slider' && !effectiveIsMobile) ? 'flex-col md:flex-row' : ''
                                ]">
                        
                            <!-- Instructions & Display Box -->
                            <div class="flex-1 pt-4 flex transition-all duration-500"
                                    :class="[
                                    (orientation === 'vertical' && questionType === 'health-slider') || questionType === 'slider' 
                                        ? 'flex-col' 
                                        : (effectiveIsMobile ? 'flex-col' : 'flex-col md:flex-row justify-between items-start gap-8 md:gap-12')
                                    ]">
                            
                            <!-- Instructions List -->
                            <div class="prose prose-base text-webropol-gray-600 max-w-none transition-opacity duration-300"
                                    :class="[
                                    effectiveIsMobile ? '' : 'md:prose-lg',
                                    orientation === 'horizontal' ? 'flex-1' : ''
                                    ]">
                                
                                <!-- Edit Mode: Simple WYSIWYG Editor (When Selected) -->
                                <div x-show="mode === 'edit' && selected" class="w-full relative group">
                                    <div class="border-2 border-transparent hover:border-webropol-primary-200 focus-within:border-webropol-primary-500 rounded-xl bg-gray-50/50 transition-all duration-200 shadow-inner overflow-hidden flex flex-col min-h-[300px]">
                                        <!-- Simple Toolbar -->
                                        <div class="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-100/50 sticky top-0 z-10">
                                            <button @click="document.execCommand('bold');" 
                                                    class="p-2 text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-white rounded transition-colors" title="Bold">
                                                <i class="fa-regular fa-bold"></i>
                                            </button>
                                            <button @click="document.execCommand('italic');" 
                                                    class="p-2 text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-white rounded transition-colors" title="Italic">
                                                <i class="fa-regular fa-italic"></i>
                                            </button>
                                            <div class="w-px h-4 bg-gray-300 mx-1"></div>
                                            <button @click="document.execCommand('insertUnorderedList');" 
                                                    class="p-2 text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-white rounded transition-colors" title="Bullet List">
                                                <i class="fa-regular fa-list-ul"></i>
                                            </button>
                                            <button @click="document.execCommand('insertOrderedList');" 
                                                    class="p-2 text-webropol-gray-500 hover:text-webropol-primary-600 hover:bg-white rounded transition-colors" title="Numbered List">
                                                <i class="fa-regular fa-list-ol"></i>
                                            </button>
                                        </div>
                                        <!-- Editable Area -->
                                        <div contenteditable="true" 
                                                class="flex-1 p-6 focus:outline-none leading-loose text-webropol-gray-700 editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                                                @input="texts.instructions = $el.innerHTML"
                                                x-init="$el.innerHTML = texts.instructions"
                                                >
                                        </div>
                                    </div>
                                    <div class="absolute top-14 right-4 text-xs font-semibold text-webropol-primary-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-wide">Editable Text</div>
                                </div>

                                <!-- Read-Only / Respond Mode: HTML Content -->
                                <div x-show="mode === 'respond' || (mode === 'edit' && !selected)" 
                                        class="text-webropol-gray-700 leading-relaxed font-medium 
                                            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                                            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
                                            [&_li]:mb-1
                                            [&_b]:font-bold [&_i]:italic"
                                        x-html="texts.instructions">
                                </div>
                            </div>

                            <!-- Score Display Wrapper -->
                            <div class="flex-shrink-0 flex flex-col items-center gap-4 transition-all duration-500"
                                    :class="[
                                    questionType === 'slider'
                                        ? (effectiveIsMobile
                                            ? 'mt-8 w-full mx-auto max-w-lg'
                                            : (orientation === 'horizontal' ? 'mt-8 md:mt-12 w-full' : 'mt-8 md:mt-12 w-full mx-auto max-w-lg'))
                                        : (orientation === 'vertical'
                                            ? (effectiveIsMobile ? 'mt-8 w-full max-w-[14rem] mx-auto' : 'mt-8 md:mt-12 w-full max-w-[14rem] md:w-56 mx-auto md:mx-0 mr-8 lg:mr-12')
                                            : (effectiveIsMobile ? 'mt-8 w-full max-w-[16rem] mx-auto' : 'mt-8 md:mt-0 w-full max-w-[16rem] md:w-64 mx-auto md:mx-0 mr-8 lg:mr-12'))
                                    ]">
                                    
                                <!-- "Your Health" Black Box -->
                                <div x-show="questionType === 'health-slider'"
                                        class="bg-[#1a0b2e] border-2 border-[#4c1d95] text-white flex flex-col items-center justify-center shadow-2xl transition-all duration-500 relative overflow-hidden group rounded-xl w-full"
                                        :class="orientation === 'vertical' ? 'h-72' : 'h-56 py-8'">
                                
                                <!-- Subtle gradient overlay for depth without losing pure black feel -->
                                <div class="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/20 to-transparent pointer-events-none"></div>

                                <template x-if="mode === 'edit' && selected">
                                    <div class="flex flex-col items-center text-center relative z-10">
                                        <input x-model="texts.boxLabel1" class="bg-transparent text-center text-white/90 text-sm font-bold tracking-[0.25em] mb-2 w-36 border-b border-transparent hover:border-white/40 focus:border-white focus:outline-none transition-all uppercase placeholder-white/30">
                                        <input x-model="texts.boxLabel2" class="bg-transparent text-center text-white/90 text-sm font-bold tracking-[0.25em] mb-2 w-36 border-b border-transparent hover:border-white/40 focus:border-white focus:outline-none transition-all uppercase placeholder-white/30">
                                        <input x-model="texts.boxLabel3" class="bg-transparent text-center text-white/90 text-sm font-bold tracking-[0.25em] mb-6 w-36 border-b border-transparent hover:border-white/40 focus:border-white focus:outline-none transition-all uppercase placeholder-white/30">
                                    </div>
                                </template>
                                <template x-if="mode === 'respond' || (mode === 'edit' && !selected)">
                                    <div class="flex flex-col items-center text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                                        <span class="text-xs font-bold tracking-[0.3em] mb-2 text-white/90 uppercase" x-text="texts.boxLabel1"></span>
                                        <span class="text-xs font-bold tracking-[0.3em] mb-2 text-white/90 uppercase" x-text="texts.boxLabel2"></span>
                                        <span class="text-xs font-bold tracking-[0.3em] text-white/90 uppercase" :class="orientation === 'vertical' ? 'mb-12' : 'mb-6'" x-text="texts.boxLabel3"></span>
                                    </div>
                                </template>

                                <!-- Number Input / Display -->
                                <div class="relative z-10 w-full px-4">
                                    <input type="number" 
                                            x-model="value"
                                            readonly
                                            placeholder="&mdash;"
                                            @input="if($el.value > 100) value = 100; if($el.value < 0) value = 0;"
                                            class="bg-transparent text-white font-bold tabular-nums leading-none tracking-tighter text-center w-full focus:outline-none border-b-2 border-transparent transition-all duration-200 p-0 shadow-none ring-0 appearance-none font-inter placeholder-white/20 text-5xl"
                                            :class="[
                                                effectiveIsMobile ? 'text-5xl' : 'text-5xl md:text-7xl',
                                                mode === 'respond' ? 'hover:text-white focus:border-webropol-primary-400 cursor-text' : 'pointer-events-none',
                                                mode === 'edit' ? 'text-transparent placeholder-transparent' : ''
                                            ]">
                                </div>
                            </div>

                            <!-- Generic Slider Layout -->
                            <template x-if="questionType === 'slider'">
                                <div class="w-full">
                                    <!-- Vertical Slider -->
                                    <div x-show="orientation === 'vertical'" class="w-full">
                                        <div x-show="settings.showLabels" class="flex items-center justify-center mb-6 group">
                                            <div class="flex flex-col items-center text-center text-webropol-primary-700 font-bold text-xs tracking-widest uppercase leading-tight">
                                                <span x-text="texts.bestLabel1"></span>
                                                <span x-text="texts.bestLabel2"></span>
                                                <span x-text="texts.bestLabel3"></span>
                                            </div>
                                        </div>

                                        <div class="relative w-16 h-72 mx-auto flex justify-center py-4 select-none mb-4"
                                                :class="{'pointer-events-none opacity-60': mode === 'edit' && selected}"
                                                @mousedown="startDrag"
                                                @touchstart.prevent="startDrag"
                                                x-ref="trackVertical">
                                            
                                            <!-- Track Line -->
                                            <div class="absolute inset-y-0 w-2 bg-gray-200 rounded-full left-1/2 -translate-x-1/2"></div>
                                            
                                            <!-- Filled Track (Bottom up) -->
                                            <div class="absolute bottom-0 w-2 bg-[#4a7288] rounded-b-full left-1/2 -translate-x-1/2 transition-all duration-75"
                                                :style="\`height: calc(\${value ?? 0}%);\`"
                                                x-show="value !== null"></div>

                                            <!-- Top/Bottom Ticks -->
                                            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gray-400"></div>
                                            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gray-400"></div>

                                            <!-- Labels -->
                                            <div class="absolute top-0 left-full ml-3 text-xs font-bold text-gray-400 -mt-1.5">100</div>
                                            <div class="absolute bottom-0 left-full ml-3 text-xs font-bold text-gray-400 -mb-1.5">0</div>

                                            <!-- Handle & Tooltip -->
                                            <div x-show="value !== null" 
                                                class="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75 ease-out z-20"
                                                :style="\`top: \${100 - (value ?? 50)}%;\`">
                                                
                                                <!-- Tooltip (Left) -->
                                                <div class="absolute right-full mr-5 top-0 -translate-y-1/2">
                                                    <div class="bg-[#4a7288] text-white font-bold py-1 px-3 rounded shadow-md text-sm relative whitespace-nowrap">
                                                        <span x-text="Math.round(value)"></span>
                                                        <!-- Arrow -->
                                                        <div class="absolute top-1/2 left-full -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#4a7288]"></div>
                                                    </div>
                                                </div>

                                                <!-- Square Handle -->
                                                <div class="w-6 h-6 bg-[#4a7288] rounded shadow-sm ring-2 ring-white flex items-center justify-center -translate-y-1/2 cursor-grab">
                                                    <div class="w-3 h-0.5 bg-white/50 rounded-full"></div>
                                                </div>
                                            </div>

                                            <!-- Click Area using -inset to expand tap target -->
                                            <div class="absolute -inset-x-6 inset-y-0 cursor-pointer z-10"
                                                @mousemove="onDrag" @touchmove.prevent="onDrag" @mouseup.window="stopDrag" @touchend.window="stopDrag" @click="updateValue"></div>
                                        </div>

                                        <div x-show="settings.showLabels" class="flex items-center justify-center mt-6 group">
                                            <div class="flex flex-col items-center text-center text-webropol-gray-500 font-bold text-xs tracking-widest uppercase leading-tight">
                                                <span x-text="texts.worstLabel1"></span>
                                                <span x-text="texts.worstLabel2"></span>
                                                <span x-text="texts.worstLabel3"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Horizontal Slider -->
                                    <div x-show="orientation === 'horizontal'" class="w-full relative transition-all duration-300"
                                            :class="effectiveIsMobile ? 'px-2 pt-6 pb-2' : 'px-4 md:px-16 pt-6'">
                                        <div x-show="settings.showLabels" class="flex justify-between items-end relative z-0 mb-4">
                                            <div class="flex flex-col items-center text-webropol-gray-500 font-bold text-xs tracking-widest uppercase leading-tight text-center">
                                                <span x-text="texts.worstLabel1"></span>
                                                <span x-text="texts.worstLabel2"></span>
                                                <span x-text="texts.worstLabel3"></span>
                                            </div>
                                            <div class="flex flex-col items-center text-webropol-primary-700 font-bold text-xs tracking-widest uppercase leading-tight text-center">
                                                <span x-text="texts.bestLabel1"></span>
                                                <span x-text="texts.bestLabel2"></span>
                                                <span x-text="texts.bestLabel3"></span>
                                            </div>
                                        </div>

                                        <div class="relative w-full h-16 flex items-center select-none mb-4"
                                                :class="{'pointer-events-none opacity-60': mode === 'edit' && selected}"
                                                @mousedown="startDragHorizontal"
                                                @touchstart.prevent="startDragHorizontal"
                                                x-ref="trackHorizontal">
                                            
                                            <!-- Track Line -->
                                            <div class="absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
                                            
                                            <!-- Filled Track (Left to Right) -->
                                            <div class="absolute left-0 h-2 bg-[#4a7288] rounded-l-full top-1/2 -translate-y-1/2 transition-all duration-75"
                                                :style="\`width: \${value ?? 0}%;\`"
                                                x-show="value !== null"></div>

                                            <!-- Left/Right Ticks -->
                                            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-gray-400"></div>
                                            <div class="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-gray-400"></div>

                                            <!-- Labels -->
                                            <div class="absolute top-full mt-2 left-0 text-xs font-bold text-gray-400 -ml-1">0</div>
                                            <div class="absolute top-full mt-2 right-0 text-xs font-bold text-gray-400 -mr-2">100</div>

                                            <!-- Handle & Tooltip -->
                                            <div x-show="value !== null" 
                                                class="absolute top-1/2 -translate-y-1/2 w-0 pointer-events-none transition-all duration-75 ease-out z-20"
                                                :style="\`left: \${value ?? 50}%;\`">
                                                
                                                <!-- Tooltip (Top) -->
                                                <div class="absolute bottom-full mb-4 left-0 -translate-x-1/2">
                                                    <div class="bg-[#4a7288] text-white font-bold py-1 px-3 rounded shadow-md text-sm relative whitespace-nowrap">
                                                        <span x-text="Math.round(value)"></span>
                                                        <!-- Arrow -->
                                                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-[#4a7288]"></div>
                                                    </div>
                                                </div>

                                                <!-- Square Handle -->
                                                <div class="w-6 h-6 bg-[#4a7288] rounded shadow-sm ring-2 ring-white flex items-center justify-center -translate-x-1/2 cursor-grab">
                                                    <div class="h-3 w-0.5 bg-white/50 rounded-full"></div>
                                                </div>
                                            </div>

                                            <!-- Click Area -->
                                            <div class="absolute -inset-y-4 inset-x-0 cursor-pointer z-10"
                                                @mousemove="onDragHorizontal" @touchmove.prevent="onDragHorizontal" @mouseup.window="stopDrag" @touchend.window="stopDrag" @click="updateValueHorizontal"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                                <!-- "I don't know" Checkbox -->
                                <div x-show="settings.showDontKnow" 
                                    class="w-auto px-4 transition-all duration-300" 
                                    :class="effectiveIsMobile ? 'mt-8 mb-12' : 'mt-4'"
                                    x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0">
                                <label class="relative flex items-center justify-center gap-3 cursor-pointer group p-4 rounded-xl transition-all duration-200 border-2 select-none overflow-hidden min-w-[200px]" 
                                        :class="[
                                            dontKnow 
                                            ? 'bg-webropol-primary-50 border-webropol-primary-500 shadow-md ring-1 ring-webropol-primary-500' 
                                            : 'bg-white border-gray-200 hover:border-webropol-primary-300 hover:shadow-sm',
                                            mode === 'edit' ? 'pointer-events-none opacity-60' : ''
                                        ]">
                                    
                                    <!-- Active background pattern -->
                                    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                            :class="dontKnow ? 'bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]' : ''"></div>

                                    <div class="relative flex items-center">
                                        <input type="checkbox" x-model="dontKnow" :disabled="mode === 'edit'" class="peer sr-only">
                                        
                                        <!-- Custom Checkbox -->
                                        <div class="w-6 h-6 rounded-md border-2 transition-all duration-200 flex items-center justify-center shadow-sm"
                                                :class="dontKnow ? 'bg-webropol-primary-500 border-webropol-primary-500' : 'bg-white border-gray-300 group-hover:border-webropol-primary-500'">
                                            <i class="fa-solid fa-check text-white text-xs transition-all duration-200 transform" 
                                                :class="dontKnow ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"></i>
                                        </div>
                                    </div>
                                    
                                    <div class="relative z-10">
                                        <template x-if="mode === 'edit' && selected">
                                            <input x-model="settings.dontKnowLabel" class="text-sm font-bold uppercase tracking-widest text-center bg-transparent border-b border-transparent focus:border-webropol-primary-500 focus:outline-none w-full max-w-[140px] transition-colors"
                                                    :class="dontKnow ? 'text-webropol-primary-900' : 'text-webropol-gray-600'">
                                        </template>
                                        <template x-if="mode === 'respond' || (mode === 'edit' && !selected)">
                                            <span class="text-sm font-bold uppercase tracking-widest" 
                                                    :class="dontKnow ? 'text-webropol-primary-900' : 'text-webropol-gray-600'"
                                                    x-text="settings.dontKnowLabel"></span>
                                        </template>
                                    </div>
                                </label>
                            </div>
                        </div>
                        </div>

                        <!-- Scale Section -->
                            <div x-show="questionType === 'health-slider'" class="flex-shrink-0 select-none transition-all duration-500 ease-in-out"
                                :class="orientation === 'vertical' ? 'w-full md:w-80 pt-2' : 'w-full mt-8 md:mt-12'">
                            
                            <!-- Vertical Layout -->
                            <template x-if="orientation === 'vertical' && questionType === 'health-slider'">
                                <div>
                                    <!-- Top Label (Best) -->
                                    <div class="flex items-center justify-start gap-4 mb-8 pl-2 group">
                                        <div class="flex flex-col items-start text-webropol-primary-700 font-bold text-xs tracking-widest uppercase leading-tight">
                                            <template x-if="mode === 'edit' && selected">
                                                <div class="flex flex-col items-start gap-1">
                                                    <input x-model="texts.bestLabel1" class="text-left bg-transparent border-b border-transparent hover:border-webropol-primary-200 focus:outline-none w-24">
                                                    <input x-model="texts.bestLabel2" class="text-left bg-transparent border-b border-transparent hover:border-webropol-primary-200 focus:outline-none w-24">
                                                    <input x-model="texts.bestLabel3" class="text-left bg-transparent border-b border-transparent hover:border-webropol-primary-200 focus:outline-none w-24">
                                                </div>
                                            </template>
                                            <template x-if="mode === 'respond' || (mode === 'edit' && !selected)">
                                                <div class="flex flex-col items-start">
                                                    <span x-text="texts.bestLabel1"></span>
                                                    <span x-text="texts.bestLabel2"></span>
                                                    <span x-text="texts.bestLabel3"></span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    
                                    <!-- Vertical Track -->
                                    <div class="relative h-[400px] sm:h-[600px] w-full" 
                                            :class="{'pointer-events-none': mode === 'edit'}"
                                            @mousedown="startDrag"
                                            @touchstart.prevent="startDrag"
                                        x-ref="trackVerticalHealth">
                                        
                                        <!-- Interaction Hint -->
                                        <div x-show="mode !== 'edit' && value === null && !dontKnow" 
                                                class="absolute left-28 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-500 hidden sm:block"
                                                x-transition:leave="duration-500">
                                            <div class="text-webropol-gray-400 font-bold tracking-[0.25em] text-xs uppercase opacity-70 animate-pulse" 
                                                    style="writing-mode: vertical-rl; transform: rotate(180deg);">
                                                Tap scale to select value
                                            </div>
                                        </div>

                                        <!-- Ticks -->
                                        <template x-for="i in 101">
                                            <div class="absolute left-0 right-0 flex items-center pointer-events-none pl-0"
                                                    :style="\`top: \${100 - (i-1)}%; transform: translateY(-50%);\`">
                                                <div class="h-px bg-gray-400 ml-0" :class="(i-1) % 10 === 0 ? 'w-8 bg-gray-500' : 'w-4'"></div>
                                                <span x-show="(i-1) % 10 === 0" class="ml-2 text-webropol-gray-500 font-medium text-lg tabular-nums select-none" x-text="i-1"></span>
                                            </div>
                                        </template>

                                        <!-- Click Area -->
                                        <div class="absolute inset-y-0 left-0 right-0 cursor-pointer z-10"
                                                @mousemove="onDrag" @touchmove.prevent="onDrag" @mouseup.window="stopDrag" @touchend.window="stopDrag" @click="updateValue"></div>

                                        <!-- Vertical Indicators -->
                                        <div x-show="mode !== 'edit' && value !== null" class="absolute w-full pointer-events-none transition-all duration-75 ease-out z-20"
                                                :style="\`top: \${100 - (value ?? 50)}%; transform: translateY(-50%);\`">
                                            <!-- Value and Arrow on Left -->
                                            <div class="absolute left-[-80px] top-1/2 -translate-y-1/2 text-3xl text-[#5c7ae0] font-bold flex items-center gap-2">
                                                <span x-text="Math.round(value)"></span>
                                                <div class="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-[#5c7ae0]"></div>
                                            </div>
                                            <!-- Red Dot on Scale -->
                                            <div class="absolute left-[1px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#ee4036] rounded-full z-30 ring-2 ring-white"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Bottom Label (Worst) -->
                                    <div class="flex items-center justify-start gap-4 mt-8 pl-2 group">
                                        <div class="flex flex-col items-start text-webropol-gray-500 font-bold text-xs tracking-widest uppercase leading-tight">
                                            <template x-if="mode === 'edit' && selected">
                                                <div class="flex flex-col items-start gap-1">
                                                    <input x-model="texts.worstLabel1" class="text-left bg-transparent border-b border-transparent hover:border-webropol-gray-300 focus:outline-none w-24">
                                                    <input x-model="texts.worstLabel2" class="text-left bg-transparent border-b border-transparent hover:border-webropol-gray-300 focus:outline-none w-24">
                                                    <input x-model="texts.worstLabel3" class="text-left bg-transparent border-b border-transparent hover:border-webropol-gray-300 focus:outline-none w-24">
                                                </div>
                                            </template>
                                            <template x-if="mode === 'respond' || (mode === 'edit' && !selected)">
                                                <div class="flex flex-col items-start">
                                                    <span x-text="texts.worstLabel1"></span>
                                                    <span x-text="texts.worstLabel2"></span>
                                                    <span x-text="texts.worstLabel3"></span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <!-- Horizontal Layout -->
                            <template x-if="orientation === 'horizontal' && questionType === 'health-slider'">
                                <div class="w-full relative transition-all duration-300"
                                        :class="effectiveIsMobile ? 'px-2 pt-16 pb-8' : 'px-4 md:px-16 pt-10'">
                                    <!-- Horizontal Label Row -->
                                    <div class="flex justify-between items-end relative z-0"
                                            :class="effectiveIsMobile ? 'mb-12' : 'mb-4'">
                                        <!-- Worst Label (Left) -->
                                        <div class="flex flex-col items-center text-webropol-gray-500 font-bold text-xs tracking-widest uppercase leading-tight text-center">
                                            <span x-text="texts.worstLabel1"></span>
                                            <span x-text="texts.worstLabel2"></span>
                                            <span x-text="texts.worstLabel3"></span>
                                        </div>
                                        
                                        <!-- Best Label (Right) -->
                                        <div class="flex flex-col items-center text-webropol-primary-700 font-bold text-xs tracking-widest uppercase leading-tight text-center">
                                            <span x-text="texts.bestLabel1"></span>
                                            <span x-text="texts.bestLabel2"></span>
                                            <span x-text="texts.bestLabel3"></span>
                                        </div>
                                    </div>

                                    <!-- Horizontal Track -->
                                    <div class="relative w-full h-32" 
                                            :class="{'pointer-events-none': mode === 'edit'}"
                                            @mousedown="startDragHorizontal"
                                            @touchstart.prevent="startDragHorizontal"
                                        x-ref="trackHorizontalHealth">
                                        
                                        <!-- Interaction Hint -->
                                        <div x-show="mode !== 'edit' && value === null && !dontKnow" 
                                                class="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500"
                                                x-transition:leave="duration-500">
                                            <div class="text-webropol-gray-400 font-bold tracking-[0.25em] text-xs uppercase opacity-70 animate-pulse whitespace-nowrap">
                                                Tap scale to select value
                                            </div>
                                        </div>

                                        <!-- Ticks -->
                                        <template x-for="i in 101">
                                            <div class="absolute top-0 h-full flex flex-col items-center pointer-events-none"
                                                    :style="\`left: \${(i-1)}%; transform: translateX(-50%);\`"> <!-- 0 is left -->
                                                <!-- Tick Mark -->
                                                <div class="w-px bg-gray-400" :class="(i-1) % 10 === 0 ? 'h-8 bg-gray-500' : 'h-4'"></div>
                                                <!-- Number -->
                                                <span x-show="(i-1) % 10 === 0" 
                                                        class="mt-1 font-medium text-center tabular-nums select-none text-webropol-gray-500"
                                                        :class="effectiveIsMobile ? 'text-[10px]' : 'text-lg'"
                                                        x-text="i-1"></span>
                                            </div>
                                        </template>

                                        <!-- Click Area -->
                                        <div class="absolute -inset-x-4 inset-y-0 cursor-pointer z-10"
                                                @mousemove="onDragHorizontal" @touchmove.prevent="onDragHorizontal" @mouseup.window="stopDrag" @touchend.window="stopDrag" @click="updateValueHorizontal"></div>

                                        <!-- Horizontal Indicators -->
                                        <div x-show="mode !== 'edit' && value !== null" class="absolute h-full pointer-events-none transition-all duration-75 ease-out z-20"
                                                :style="\`left: \${value ?? 50}%; transform: translateX(-50%);\`"> <!-- 0 is left -->
                                            
                                            <!-- Dotted line up -->
                                            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 border-l-2 border-webropol-gray-400 border-dotted"
                                                    :class="effectiveIsMobile ? 'h-16' : 'h-24'"></div>
                                            
                                            <!-- Value Box -->
                                            <div class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                                                    :class="effectiveIsMobile ? 'bottom-[180px]' : 'bottom-[232px]'">
                                                <div class="text-[#5c7ae0] font-medium flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-gray-50"
                                                        :class="effectiveIsMobile ? 'text-4xl' : 'text-5xl'">
                                                    <span x-text="Math.round(value)"></span>
                                                </div>
                                                <!-- Triangle Pointing Down -->
                                                <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-[#5c7ae0]"></div>
                                            </div>

                                            <!-- Handle Red Dot -->
                                            <div class="absolute top-0 left-1/2 -translate-x-1/2 -mt-[4px] w-6 h-6 bg-[#ee4036] rounded-full shadow-md z-30 ring-2 ring-white scale-125"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Settings Modal (Using new external component) -->
            <webropol-numeric-slider-settings-modal></webropol-numeric-slider-settings-modal>
            
            </div>
        `;
    }
}

customElements.define('webropol-numeric-slider', NumericSlider);
