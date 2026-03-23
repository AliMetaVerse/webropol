/**
 * Unified Create Menu - shared between Header and Floating Button
 */

/**
 * Returns the inner menu card markup (no absolute positioning wrapper).
 * Consumers should wrap this with their own positioned container.
 */
export function renderCreateMenu() {
  return `
    <div class="bg-white rounded-2xl shadow-lg border border-webropol-gray-200 p-4 min-w-[22rem] overflow-hidden">

      <!-- Header -->
      <div class="mb-3 px-1">
        <p class="text-xs font-semibold text-webropol-gray-400 uppercase tracking-wider">Create New</p>
      </div>

      <!-- Menu items -->
      <div class="space-y-1">

        <!-- Surveys — primary teal -->
        <button data-type="surveys"
          class="create-item-btn group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#eefbfd] transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-[#1e6880] focus:ring-offset-1">
          <div class="flex-shrink-0 w-9 h-9 bg-[#eefbfd] group-hover:bg-[#b0e8f1] border border-[#1e6880]/20 rounded-lg flex items-center justify-center transition-colors duration-150">
            <i class="fal fa-user-magnifying-glass text-[#1e6880] text-base"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-webropol-gray-800 group-hover:text-[#1e6880] transition-colors duration-150">Surveys</span>
            <span class="block text-xs text-webropol-gray-400">Create custom surveys</span>
          </div>
          <i class="fal fa-chevron-right text-xs text-webropol-gray-300 group-hover:text-[#1e6880] transition-colors duration-150 flex-shrink-0"></i>
        </button>

        <!-- Events — royal blue -->
        <button data-type="events"
          class="create-item-btn group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1">
          <div class="flex-shrink-0 w-9 h-9 bg-indigo-50 group-hover:bg-indigo-100 border border-indigo-300/30 rounded-lg flex items-center justify-center transition-colors duration-150">
            <i class="fal fa-calendar-alt text-indigo-600 text-base"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-webropol-gray-800 group-hover:text-indigo-700 transition-colors duration-150">Events</span>
            <span class="block text-xs text-webropol-gray-400">Event management</span>
          </div>
          <i class="fal fa-chevron-right text-xs text-webropol-gray-300 group-hover:text-indigo-500 transition-colors duration-150 flex-shrink-0"></i>
        </button>

        <!-- 2-Way SMS — emerald green -->
        <button data-type="2-way-sms"
          class="create-item-btn group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1">
          <div class="flex-shrink-0 w-9 h-9 bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-300/30 rounded-lg flex items-center justify-center transition-colors duration-150">
            <i class="fal fa-sms text-emerald-600 text-base"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-webropol-gray-800 group-hover:text-emerald-700 transition-colors duration-150">2-Way SMS</span>
            <span class="block text-xs text-webropol-gray-400">Send and receive</span>
          </div>
          <i class="fal fa-chevron-right text-xs text-webropol-gray-300 group-hover:text-emerald-500 transition-colors duration-150 flex-shrink-0"></i>
        </button>

        <!-- EXW Surveys — violet -->
        <button data-type="exw-surveys"
          class="create-item-btn group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1">
          <div class="flex-shrink-0 w-9 h-9 bg-violet-50 group-hover:bg-violet-100 border border-violet-300/30 rounded-lg flex items-center justify-center transition-colors duration-150">
            <i class="fal fa-user-chart text-violet-600 text-base"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-webropol-gray-800 group-hover:text-violet-700 transition-colors duration-150">EXW Surveys</span>
            <span class="block text-xs text-webropol-gray-400">Employee experience</span>
          </div>
          <i class="fal fa-chevron-right text-xs text-webropol-gray-300 group-hover:text-violet-500 transition-colors duration-150 flex-shrink-0"></i>
        </button>

        <!-- Case Management — amber -->
        <button data-type="case-management"
          class="create-item-btn group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1">
          <div class="flex-shrink-0 w-9 h-9 bg-amber-50 group-hover:bg-amber-100 border border-amber-300/30 rounded-lg flex items-center justify-center transition-colors duration-150">
            <i class="fal fa-briefcase text-amber-600 text-base"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-webropol-gray-800 group-hover:text-amber-700 transition-colors duration-150">Case Management</span>
            <span class="block text-xs text-webropol-gray-400">Manage your team</span>
          </div>
          <i class="fal fa-chevron-right text-xs text-webropol-gray-300 group-hover:text-amber-500 transition-colors duration-150 flex-shrink-0"></i>
        </button>

      </div>
    </div>
  `;
}

/**
 * Binds click (and basic keyboard) handlers for create menu items within a container.
 * @param {HTMLElement} container - The element containing the menu markup
 * @param {(type: string, event: Event) => void} onSelect - Callback when an item is selected
 */
export function bindCreateMenu(container, onSelect) {
  if (!container) return;

  const handler = (e) => {
    const btn = e.target.closest('.create-item-btn');
    if (!btn || !container.contains(btn)) return;
    const type = btn.getAttribute('data-type');
    if (type) onSelect(type, e);
  };
  container.addEventListener('click', handler);

  // Keyboard accessibility (Enter/Space)
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const btn = e.target.closest('.create-item-btn');
    if (!btn || !container.contains(btn)) return;
    e.preventDefault();
    const type = btn.getAttribute('data-type');
    if (type) onSelect(type, e);
  });
}
