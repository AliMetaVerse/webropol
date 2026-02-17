import { BaseComponent } from '../../../design-system/utils/base-component.js';

export class NumericSliderSettingsModal extends BaseComponent {
    static get observedAttributes() {
        return ['open'];
    }

    init() {
        this.open = this.hasAttribute('open');
    }

    render() {
        // We will render the modal structure here.
        // Note: Alpine.js directives will need to be bound to a data scope.
        // Since this component is inside the `numericSliderData` scope in the parent,
        // we can assume it has access to the parent's data IF we don't isolate it.
        // However, Web Components usually isolate shadow DOM. 
        // BaseComponent uses light DOM by default (innerHTML), so Alpine scope *should* inherit 
        // if this element is placed inside the parent's x-data region.
        
        this.innerHTML = `
            <!-- Settings Modal -->
            <div x-show="showSettings" 
                    class="fixed inset-0 z-[2147483640] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
                    x-transition:enter="transition ease-out duration-300" 
                    x-transition:enter-start="opacity-0" 
                    x-transition:enter-end="opacity-100"
                    x-transition:leave="transition ease-in duration-200" 
                    x-transition:leave-start="opacity-100" 
                    x-transition:leave-end="opacity-0"
                    style="display: none;">
                
                <!-- Modal Content -->
                <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col relative z-10 max-h-[90vh]"
                        @click.away="showSettings = false"
                        x-show="showSettings"
                        x-transition:enter="transition ease-out duration-300"
                        x-transition:enter-start="opacity-0 scale-95"
                        x-transition:enter-end="opacity-100 scale-100"
                        x-transition:leave="transition ease-in duration-200" 
                        x-transition:leave-start="opacity-100 scale-100" 
                        x-transition:leave-end="opacity-0 scale-95">
                
                    <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                        <h3 class="font-bold text-lg text-webropol-gray-900">Question settings</h3>
                        <button @click="showSettings = false" class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200/50 rounded-full"><i class="fa-light fa-times text-xl"></i></button>
                    </div>
                    
                    <div class="p-6 overflow-y-auto flex-1">
                        <!-- Slider Type Selector -->
                    <div class="bg-gray-50/80 p-5 rounded-xl border border-gray-100 mb-6 shadow-sm">
                            <h4 class="font-bold text-base text-webropol-gray-800 mb-4 flex items-center gap-2">
                            Slider Type
                            </h4>
                            
                            <div class="flex flex-col gap-3 pt-2 pl-1">
                            <label class="flex items-center gap-2 cursor-pointer relative z-10">
                                <input type="radio" name="qtype" value="slider" x-model="questionType" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                <span class="font-medium text-sm text-gray-700 flex items-center gap-2">
                                    <i class="fa-light fa-sliders text-gray-400"></i>
                                    Slider
                                </span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer relative z-10">
                                <input type="radio" name="qtype" value="health-slider" x-model="questionType" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                <span class="font-medium text-sm text-gray-700 flex items-center gap-2">
                                    <i class="fa-light fa-heart-pulse text-gray-400"></i>
                                    Quality Meter
                                </span>
                            </label>
                            </div>
                            
                            <!-- Disable switch for Quality Meter -->
                            <div x-show="false" class="mt-4 pt-4 border-t border-gray-200/60" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0">
                            <label class="inline-flex items-center gap-3 cursor-pointer select-none group">
                                    <div class="relative">
                                        <input type="checkbox" x-model="settingsDisabled" class="peer sr-only">
                                        <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-webropol-primary-50 rounded-full peer transition-all duration-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-webropol-primary-500 peer-checked:shadow-inner"></div>
                                    </div>
                                    <span class="text-sm font-medium text-gray-700 group-hover:text-webropol-primary-700 transition-colors">Use default settings (disable customization)</span>
                            </label>
                            </div>
                    </div>
                    
                    <!-- Detailed Settings Form -->
                    <div class="space-y-6 px-2">
                        
                        <!-- Slider Values Section -->
                        <div x-show="questionType !== 'health-slider'">
                            <h4 class="font-bold text-gray-700 mb-4 text-sm">Slider Values</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-4">
                                <!-- Min Value -->
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-600">Minimum value</label>
                                    <input type="number" x-model="settings.min" class="w-24 border-gray-300 rounded px-2 py-1 text-sm focus:ring-webropol-primary-500 focus:border-webropol-primary-500">
                                </div>
                                <!-- Unit increase -->
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-600">Unit increase</label>
                                    <input type="number" x-model="settings.step" class="w-24 border-gray-300 rounded px-2 py-1 text-sm focus:ring-webropol-primary-500 focus:border-webropol-primary-500">
                                </div>
                                <!-- Max Value -->
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-600">Maximum value</label>
                                    <input type="number" x-model="settings.max" class="w-24 border-gray-300 rounded px-2 py-1 text-sm focus:ring-webropol-primary-500 focus:border-webropol-primary-500">
                                </div>
                                <!-- Starting point -->
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-600">Starting point</label>
                                    <input type="number" x-model="settings.start" class="w-24 border-gray-300 rounded px-2 py-1 text-sm focus:ring-webropol-primary-500 focus:border-webropol-primary-500">
                                </div>
                                <!-- Value quantity -->
                                <div class="flex items-center justify-between col-span-1 md:col-span-2 md:w-full">
                                        <label class="text-sm text-gray-600 mr-4">Value quantity (%, $, N...)</label>
                                        <input type="text" x-model="settings.quantity" class="w-24 border-gray-300 rounded px-2 py-1 text-sm focus:ring-webropol-primary-500 focus:border-webropol-primary-500">
                                </div>
                            </div>
                            
                            <!-- Checkboxes -->
                            <div class="space-y-3">
                                <label class="flex items-center gap-2 cursor-pointer w-fit">
                                    <input type="checkbox" x-model="settings.showValue" class="rounded text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                    <span class="text-sm text-gray-700">Show value for the respondent</span>
                                </label>
                                
                                <div class="flex flex-wrap items-center gap-4">
                                        <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" x-model="settings.showDontKnow" class="rounded text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                        <span class="text-sm text-gray-700">Show "I don't know" option for respondent</span>
                                    </label>
                                    <input type="text" x-model="settings.dontKnowLabel" :disabled="!settings.showDontKnow" class="flex-1 max-w-[200px] bg-gray-50 border-gray-300 text-gray-700 rounded px-3 py-1 text-sm disabled:opacity-50 disabled:bg-gray-100 focus:ring-webropol-primary-500 focus:border-webropol-primary-500">
                                </div>
                            </div>
                        </div>

                        <!-- Slider Labels Section -->
                        <div x-show="questionType !== 'health-slider'">
                            <h4 class="font-bold text-gray-700 mb-2 text-sm">Slider Labels</h4>
                            <label class="flex items-center gap-2 cursor-pointer w-fit">
                                <input type="checkbox" x-model="settings.showLabels" class="rounded text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                <span class="text-sm text-gray-700">Show labels</span>
                            </label>
                        </div>

                        <!-- Positioning Section -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Min/Max Position -->
                            <div x-show="questionType !== 'health-slider'">
                                <h4 class="text-sm text-gray-500 mb-3">Min. and Max. value position</h4>
                                <div class="space-y-3">
                                    <label class="flex items-center gap-2 cursor-pointer w-fit">
                                        <input type="radio" name="min-max-pos" value="min-max" x-model="settings.direction" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                        <span class="text-sm text-gray-700">Min. <i class="fa-regular fa-arrow-right text-xs mx-1"></i> Max.</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer w-fit">
                                        <input type="radio" name="min-max-pos" value="max-min" x-model="settings.direction" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                        <span class="text-sm text-gray-700">Max. <i class="fa-regular fa-arrow-right text-xs mx-1"></i> Min.</span>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Slider Placement (Orientation) -->
                            <div>
                                    <h4 class="text-sm text-gray-500 mb-3">Orientation</h4>
                                    
                                    <!-- Desktop Orientation -->
                                    <div class="mb-4">
                                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Desktop</span>
                                    <div class="space-y-2">
                                        <label class="flex items-center gap-2 cursor-pointer w-fit">
                                            <input type="radio" name="orientation_desktop" value="horizontal" x-model="settings.orientationDesktop" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                            <span class="text-sm text-gray-700">Horizontal</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer w-fit">
                                            <input type="radio" name="orientation_desktop" value="vertical" x-model="settings.orientationDesktop" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                            <span class="text-sm text-gray-700">Vertical</span>
                                        </label>
                                    </div>
                                    </div>

                                    <!-- Mobile Orientation -->
                                    <div>
                                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Mobile (will be removed)</span>
                                    <div class="space-y-2">
                                        <label class="flex items-center gap-2 cursor-pointer w-fit">
                                            <input type="radio" name="orientation_mobile" value="horizontal" x-model="settings.orientationMobile" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                            <span class="text-sm text-gray-700">Horizontal</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer w-fit">
                                            <input type="radio" name="orientation_mobile" value="vertical" x-model="settings.orientationMobile" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                            <span class="text-sm text-gray-700">Vertical</span>
                                        </label>
                                    </div>
                                    </div>
                            </div>
                        </div>

                        <div class="border-t border-gray-100" x-show="questionType !== 'health-slider'"></div>

                        <!-- Description Section -->
                        <div x-show="questionType !== 'health-slider'">
                            <div class="flex items-center gap-2 mb-3">
                                <input type="checkbox" x-model="settings.showDescription" class="rounded text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-700 font-medium">Show question description</span>
                                    <i class="fa-regular fa-circle-question text-black text-lg"></i>
                                </div>
                            </div>
                            
                            <div class="pl-7 grid grid-rows-2 gap-2" :class="!settings.showDescription ? 'opacity-50 pointer-events-none' : ''">
                                    <div class="flex items-center gap-4">
                                    <span class="text-sm text-gray-400 w-20 text-right">Placement:</span>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="desc-place" value="below" x-model="settings.descPlacement" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                        <span class="text-sm text-gray-600">Show below question title</span>
                                    </label>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <span class="w-20"></span>
                                        <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="desc-place" value="above" x-model="settings.descPlacement" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                        <span class="text-sm text-gray-600">Show above question title</span>
                                    </label>
                                    </div>
                            </div>
                        </div>

                        <div class="border-t border-gray-100"></div>

                        <!-- Visibility Section -->
                        <div class="flex items-center gap-8">
                            <div class="flex items-center gap-2 text-gray-500">
                                <i class="fa-light fa-eye-slash text-2xl"></i>
                                <span class="font-medium text-gray-600">Visibility</span>
                            </div>
                            
                            <div class="flex items-center gap-8">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="visibility" value="visible" x-model="settings.visibility" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                    <span class="text-sm font-bold text-gray-700">Visible</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="visibility" value="hidden" x-model="settings.visibility" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                    <span class="text-sm font-medium text-gray-600">Hidden</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="visibility" value="disabled" x-model="settings.visibility" class="text-webropol-primary-600 focus:ring-webropol-primary-500 border-gray-300">
                                    <span class="text-sm font-medium text-gray-600">Disabled</span>
                                </label>
                            </div>
                        </div>

                        <div class="border-t border-gray-100 mb-2"></div>

                        <!-- Footer Buttons -->
                        <div class="flex items-center justify-between pb-2">
                            <button class="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                Save question to library
                            </button>
                        </div>

                        <div class="flex items-center gap-2 text-webropol-primary-700 font-medium text-sm cursor-pointer hover:underline">
                            Keywords (0) <i class="fa-solid fa-chevron-right text-xs"></i> <i class="fa-regular fa-circle-question ml-1 text-lg"></i>
                        </div>

                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right flex justify-end gap-2 flex-shrink-0">
                        <button @click="showSettings = false" class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full font-medium transition-colors">Cancel</button>
                    <button @click="showSettings = false" class="px-4 py-2 bg-webropol-primary-700 hover:bg-webropol-primary-800 text-white rounded-full font-medium transition-colors">Apply</button>
                </div>
            </div>
        `;
    }
}

customElements.define('webropol-numeric-slider-settings-modal', NumericSliderSettingsModal);
