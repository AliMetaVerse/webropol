import { BaseComponent } from '../../../../design-system/utils/base-component.js';

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
            <style>
                .ns-type-card {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 16px;
                    border-radius: 10px;
                    border: 1.5px solid #e2e8f0;
                    cursor: pointer;
                    background: #fff;
                    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
                    user-select: none;
                    min-width: 160px;
                }
                .ns-type-card:hover {
                    border-color: #06b6d4;
                    background: #f0fdff;
                }
                .ns-type-card.selected {
                    border-color: #0e7490;
                    background: #ecfeff;
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.12);
                }
                .ns-type-card input[type="radio"] {
                    accent-color: #0e7490;
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                }
                .ns-type-card .card-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: #e0f2fe;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #0e7490;
                    font-size: 15px;
                    flex-shrink: 0;
                }
                .ns-type-card.selected .card-icon {
                    background: #cffafe;
                    color: #0e7490;
                }
                .ns-type-card .card-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                }

                .ns-orient-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 18px;
                    border-radius: 999px;
                    border: 1.5px solid #e2e8f0;
                    cursor: pointer;
                    background: #fff;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
                    user-select: none;
                }
                .ns-orient-pill:hover {
                    border-color: #06b6d4;
                    background: #f0fdff;
                }
                .ns-orient-pill.selected {
                    border-color: #0e7490;
                    background: #ecfeff;
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.12);
                    color: #0e7490;
                }
                .ns-orient-pill input[type="radio"] {
                    accent-color: #0e7490;
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                }

                .ns-vis-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 18px;
                    border-radius: 999px;
                    border: 1.5px solid #e2e8f0;
                    cursor: pointer;
                    background: #fff;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
                    user-select: none;
                }
                .ns-vis-pill:hover {
                    border-color: #06b6d4;
                    background: #f0fdff;
                }
                .ns-vis-pill.selected {
                    border-color: #0e7490;
                    background: #ecfeff;
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.12);
                    color: #0e7490;
                }
                .ns-vis-pill input[type="radio"] {
                    accent-color: #0e7490;
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                }

                .ns-dontknow-input {
                    border: 1.5px solid #d1d5db;
                    border-radius: 8px;
                    padding: 6px 12px;
                    font-size: 13px;
                    color: #374151;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.15s;
                    width: 160px;
                }
                .ns-dontknow-input:focus {
                    border-color: #06b6d4;
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.10);
                }
                .ns-dontknow-input:disabled {
                    background: #f3f4f6;
                    color: #9ca3af;
                }

                .ns-save-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 22px;
                    border-radius: 999px;
                    border: 1.5px solid #0e7490;
                    background: #fff;
                    color: #0e7490;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.15s, box-shadow 0.15s;
                }
                .ns-save-btn:hover {
                    background: #f0fdff;
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.12);
                }
                .ns-save-link {
                    font-size: 14px;
                    font-weight: 500;
                    color: #0e7490;
                    cursor: pointer;
                    text-decoration: none;
                    margin-top: 6px;
                    display: inline-block;
                }
                .ns-save-link:hover {
                    text-decoration: underline;
                }
                .ns-all-settings-link {
                    font-size: 14px;
                    font-weight: 600;
                    color: #0e7490;
                    cursor: pointer;
                    display: inline-block;
                    margin-bottom: 14px;
                }
                .ns-all-settings-link:hover { text-decoration: underline; }

                .ns-section-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #6b7280;
                    margin-bottom: 10px;
                    margin-top: 4px;
                    display: block;
                }
            </style>

            <!-- Settings Modal -->
            <div x-show="showSettings"
                    class="fixed inset-0 z-[2147483640] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    x-transition:enter="transition ease-out duration-200"
                    x-transition:enter-start="opacity-0"
                    x-transition:enter-end="opacity-100"
                    x-transition:leave="transition ease-in duration-150"
                    x-transition:leave-start="opacity-100"
                    x-transition:leave-end="opacity-0"
                    style="display: none;">

                <!-- Modal Content -->
                <div class="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col relative max-h-[92vh]"
                        :style="questionType !== 'health-slider' ? 'max-width:640px' : 'max-width:520px'"
                        @click.away="showSettings = false"
                        x-show="showSettings"
                        x-transition:enter="transition ease-out duration-200"
                        x-transition:enter-start="opacity-0 scale-95 translate-y-2"
                        x-transition:enter-end="opacity-100 scale-100 translate-y-0"
                        x-transition:leave="transition ease-in duration-150"
                        x-transition:leave-start="opacity-100 scale-100 translate-y-0"
                        x-transition:leave-end="opacity-0 scale-95 translate-y-2">

                    <!-- Header -->
                    <div class="px-6 py-5 flex justify-between items-center flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#fee2e2,#fecaca);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-light fa-gear" style="color:#dc2626;font-size:20px;"></i>
                            </div>
                            <span style="font-size:18px;font-weight:700;color:#111827;">Question settings</span>
                        </div>
                        <button @click="showSettings = false"
                                style="width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#9ca3af;transition:background 0.15s,color 0.15s;"
                                onmouseover="this.style.background='#f3f4f6';this.style.color='#374151'"
                                onmouseout="this.style.background='transparent';this.style.color='#9ca3af'">
                            <i class="fa-light fa-times" style="font-size:18px;"></i>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="overflow-y-auto flex-1 px-6 pb-2">

                        <!-- Slider Type Card Selector -->
                        <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin-bottom:20px;">
                            <span style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:14px;letter-spacing:0.01em;">Slider Type</span>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <label class="ns-type-card" :class="questionType !== 'health-slider' ? 'selected' : ''">
                                    <input type="radio" name="qtype" value="slider" x-model="questionType">
                                    <div class="card-icon"><i class="fa-light fa-sliders"></i></div>
                                    <span class="card-label">Numeric Slider</span>
                                </label>
                                <label class="ns-type-card" :class="questionType === 'health-slider' ? 'selected' : ''">
                                    <input type="radio" name="qtype" value="health-slider" x-model="questionType">
                                    <div class="card-icon"><i class="fa-light fa-heart-pulse"></i></div>
                                    <span class="card-label">Quality Meter</span>
                                </label>
                            </div>
                        </div>

                        <!-- ══════════════════════════════════════════
                             NUMERIC SLIDER ONLY SECTIONS
                             ══════════════════════════════════════════ -->
                        <div x-show="questionType !== 'health-slider'">

                            <!-- Slider Values -->
                            <span class="ns-section-label" style="font-weight:600;color:#374151;font-size:13px;">Slider Values</span>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 32px;margin-bottom:16px;">
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                                    <label style="font-size:13px;color:#6b7280;white-space:nowrap;">Minimum value</label>
                                    <input type="number" x-model="settings.min" style="width:80px;border:1.5px solid #d1d5db;border-radius:8px;padding:5px 10px;font-size:13px;outline:none;" onfocus="this.style.borderColor='#06b6d4'" onblur="this.style.borderColor='#d1d5db'">
                                </div>
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                                    <label style="font-size:13px;color:#6b7280;white-space:nowrap;">Unit increase</label>
                                    <input type="number" x-model="settings.step" style="width:80px;border:1.5px solid #d1d5db;border-radius:8px;padding:5px 10px;font-size:13px;outline:none;" onfocus="this.style.borderColor='#06b6d4'" onblur="this.style.borderColor='#d1d5db'">
                                </div>
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                                    <label style="font-size:13px;color:#6b7280;white-space:nowrap;">Maximum value</label>
                                    <input type="number" x-model="settings.max" style="width:80px;border:1.5px solid #d1d5db;border-radius:8px;padding:5px 10px;font-size:13px;outline:none;" onfocus="this.style.borderColor='#06b6d4'" onblur="this.style.borderColor='#d1d5db'">
                                </div>
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                                    <label style="font-size:13px;color:#6b7280;white-space:nowrap;">Starting point</label>
                                    <input type="number" x-model="settings.start" style="width:80px;border:1.5px solid #d1d5db;border-radius:8px;padding:5px 10px;font-size:13px;outline:none;" onfocus="this.style.borderColor='#06b6d4'" onblur="this.style.borderColor='#d1d5db'">
                                </div>
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;grid-column:span 2;">
                                    <label style="font-size:13px;color:#6b7280;white-space:nowrap;">Value quantity (%, $, N...)</label>
                                    <input type="text" x-model="settings.quantity" style="width:80px;border:1.5px solid #d1d5db;border-radius:8px;padding:5px 10px;font-size:13px;outline:none;" onfocus="this.style.borderColor='#06b6d4'" onblur="this.style.borderColor='#d1d5db'">
                                </div>
                            </div>

                            <!-- Checkboxes -->
                            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px;">
                                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                    <input type="checkbox" x-model="settings.showValue" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                    <span style="font-size:14px;color:#374151;">Show value for the respondent</span>
                                </label>
                                <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;">
                                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                        <input type="checkbox" x-model="settings.showDontKnow" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                        <span style="font-size:14px;color:#374151;">Show "I don't know" option for the respondent</span>
                                    </label>
                                    <input type="text" x-model="settings.dontKnowLabel" :disabled="!settings.showDontKnow" class="ns-dontknow-input" placeholder="I don't know">
                                </div>
                            </div>

                            <div style="height:1px;background:#f1f5f9;margin-bottom:16px;"></div>

                            <!-- Slider Labels -->
                            <span class="ns-section-label" style="font-weight:600;color:#374151;font-size:13px;">Slider Labels</span>
                            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:18px;">
                                <input type="checkbox" x-model="settings.showLabels" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                <span style="font-size:14px;color:#374151;">Show labels</span>
                            </label>

                            <div style="height:1px;background:#f1f5f9;margin-bottom:16px;"></div>

                            <!-- Min/Max position + Orientation side by side -->
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:18px;">
                                <!-- Min/Max position -->
                                <div>
                                    <span class="ns-section-label">Min. and Max. value position</span>
                                    <div style="display:flex;flex-direction:column;gap:8px;">
                                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                            <input type="radio" name="min-max-pos" value="min-max" x-model="settings.direction" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                            <span style="font-size:14px;color:#374151;">Min. &rarr; Max.</span>
                                        </label>
                                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                            <input type="radio" name="min-max-pos" value="max-min" x-model="settings.direction" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                            <span style="font-size:14px;color:#374151;">Max. &rarr; Min.</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Orientation (desktop + mobile) -->
                                <div>
                                    <span class="ns-section-label">Orientation</span>
                                    <span style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:6px;">Desktop</span>
                                    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
                                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                            <input type="radio" name="orientation_desktop" value="horizontal" x-model="settings.orientationDesktop" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                            <span style="font-size:14px;color:#374151;">Horizontal</span>
                                        </label>
                                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                            <input type="radio" name="orientation_desktop" value="vertical" x-model="settings.orientationDesktop" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                            <span style="font-size:14px;color:#374151;">Vertical</span>
                                        </label>
                                    </div>
                                    <span style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:6px;">Mobile (will be removed)</span>
                                    <div style="display:flex;flex-direction:column;gap:6px;">
                                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                            <input type="radio" name="orientation_mobile" value="horizontal" x-model="settings.orientationMobile" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                            <span style="font-size:14px;color:#374151;">Horizontal</span>
                                        </label>
                                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                            <input type="radio" name="orientation_mobile" value="vertical" x-model="settings.orientationMobile" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                            <span style="font-size:14px;color:#374151;">Vertical</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div style="height:1px;background:#f1f5f9;margin-bottom:16px;"></div>

                            <!-- Description -->
                            <div style="margin-bottom:18px;">
                                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:10px;">
                                    <input type="checkbox" x-model="settings.showDescription" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                    <span style="font-size:14px;font-weight:500;color:#374151;">Show question description</span>
                                    <i class="fa-regular fa-circle-question" style="color:#111827;font-size:16px;"></i>
                                </label>
                                <div style="padding-left:24px;display:flex;flex-direction:column;gap:8px;" :style="!settings.showDescription ? 'opacity:0.45;pointer-events:none' : ''">
                                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                        <span style="font-size:13px;color:#9ca3af;width:72px;text-align:right;flex-shrink:0;">Placement:</span>
                                        <input type="radio" name="desc-place" value="below" x-model="settings.descPlacement" style="width:15px;height:15px;accent-color:#0e7490;flex-shrink:0;">
                                        <span style="font-size:14px;color:#374151;">Show below question title</span>
                                    </label>
                                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                        <span style="width:72px;flex-shrink:0;"></span>
                                        <input type="radio" name="desc-place" value="above" x-model="settings.descPlacement" style="width:15px;height:15px;accent-color:#0e7490;flex-shrink:0;">
                                        <span style="font-size:14px;color:#374151;">Show above question title</span>
                                    </label>
                                </div>
                            </div>

                        </div>
                        <!-- ── end numeric-only ── -->

                        <!-- ══════════════════════════════════════════
                             QUALITY METER ONLY SECTIONS
                             ══════════════════════════════════════════ -->
                        <div x-show="questionType === 'health-slider'">

                            <!-- I don't know (Quality Meter) -->
                            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:18px;">
                                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                    <input type="checkbox" x-model="settings.showDontKnow" style="width:16px;height:16px;accent-color:#0e7490;flex-shrink:0;">
                                    <span style="font-size:14px;color:#374151;">Show "I don't know" option for the respondent</span>
                                </label>
                                <input type="text" x-model="settings.dontKnowLabel" :disabled="!settings.showDontKnow" class="ns-dontknow-input" placeholder="I don't know">
                            </div>

                            <!-- Orientation (Quality Meter) -->
                            <span class="ns-section-label">Orientation</span>
                            <span style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:6px;">Desktop</span>
                            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                                <label class="ns-orient-pill" :class="settings.orientationDesktop === 'horizontal' ? 'selected' : ''">
                                    <input type="radio" name="orientation_desktop" value="horizontal" x-model="settings.orientationDesktop">
                                    <i class="fa-light fa-arrows-left-right" style="font-size:14px;"></i>
                                    Horizontal
                                </label>
                                <label class="ns-orient-pill" :class="settings.orientationDesktop === 'vertical' ? 'selected' : ''">
                                    <input type="radio" name="orientation_desktop" value="vertical" x-model="settings.orientationDesktop">
                                    <i class="fa-light fa-arrows-up-down" style="font-size:14px;"></i>
                                    Vertical
                                </label>
                            </div>
                            <span style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:6px;">Mobile (will be removed)</span>
                            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
                                <label class="ns-orient-pill" :class="settings.orientationMobile === 'horizontal' ? 'selected' : ''">
                                    <input type="radio" name="orientation_mobile" value="horizontal" x-model="settings.orientationMobile">
                                    <i class="fa-light fa-arrows-left-right" style="font-size:14px;"></i>
                                    Horizontal
                                </label>
                                <label class="ns-orient-pill" :class="settings.orientationMobile === 'vertical' ? 'selected' : ''">
                                    <input type="radio" name="orientation_mobile" value="vertical" x-model="settings.orientationMobile">
                                    <i class="fa-light fa-arrows-up-down" style="font-size:14px;"></i>
                                    Vertical
                                </label>
                            </div>

                        </div>
                        <!-- ── end quality-meter-only ── -->

                        <div style="height:1px;background:#f1f5f9;margin-bottom:16px;"></div>

                        <!-- Visibility (both) -->
                        <div class="mb-5">
                            <span class="ns-section-label">Visibility</span>
                            <div style="display:flex;flex-wrap:wrap;gap:10px;">
                                <label class="ns-vis-pill" :class="settings.visibility === 'visible' ? 'selected' : ''">
                                    <input type="radio" name="nss_visibility" value="visible" x-model="settings.visibility">
                                    <i class="fa-light fa-eye" style="font-size:14px;"></i>
                                    Visible
                                </label>
                                <label class="ns-vis-pill" :class="settings.visibility === 'hidden' ? 'selected' : ''">
                                    <input type="radio" name="nss_visibility" value="hidden" x-model="settings.visibility">
                                    <i class="fa-light fa-eye-slash" style="font-size:14px;"></i>
                                    Hidden
                                </label>
                                <label class="ns-vis-pill" :class="settings.visibility === 'disabled' ? 'selected' : ''">
                                    <input type="radio" name="nss_visibility" value="disabled" x-model="settings.visibility">
                                    <i class="fa-light fa-ban" style="font-size:14px;"></i>
                                    Disabled
                                </label>
                            </div>
                        </div>

                        <!-- Save to library (both) -->
                        <div style="margin-bottom:6px;">
                            <button class="ns-save-btn">Save question to library</button>
                        </div>
                        <a href="#" class="ns-save-link" @click.prevent>Save question to library (as it is for now)</a>

                        <!-- Keywords (both) -->
                        <div style="display:flex;align-items:center;gap:6px;margin-top:14px;color:#0e7490;font-size:14px;font-weight:500;cursor:pointer;" @click.prevent>
                            <span>Keywords (0)</span>
                            <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
                            <i class="fa-regular fa-circle-question" style="font-size:16px;color:#111827;"></i>
                        </div>

                        <div style="height:14px;"></div>
                    </div>

                    <!-- Footer -->
                    <div style="padding:16px 24px;border-top:1.5px solid #f1f5f9;display:flex;justify-content:flex-end;gap:10px;flex-shrink:0;background:#fff;">
                        <button @click="showSettings = false"
                                style="padding:9px 24px;border-radius:999px;border:1.5px solid #d1d5db;background:#fff;color:#374151;font-size:14px;font-weight:500;cursor:pointer;transition:background 0.15s,border-color 0.15s;"
                                onmouseover="this.style.background='#f9fafb'"
                                onmouseout="this.style.background='#fff'">Cancel</button>
                        <button @click="showSettings = false"
                                style="padding:9px 28px;border-radius:999px;border:none;background:#0e7490;color:#fff;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.15s;"
                                onmouseover="this.style.background='#0c6781'"
                                onmouseout="this.style.background='#0e7490'">Apply</button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('webropol-numeric-slider-settings-modal', NumericSliderSettingsModal);
