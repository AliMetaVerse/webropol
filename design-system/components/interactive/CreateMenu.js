/**
 * Unified Create Menu - shared between Header and Floating Button
 */

/**
 * Returns the inner menu card markup (no absolute positioning wrapper).
 * Consumers should wrap this with their own positioned container.
 */
export function renderCreateMenu() {
  return `
    <div class="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20 min-w-96 overflow-hidden">
      <!-- Gradient background overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-webropol-teal-50/80 to-webropol-teal-100/80 rounded-3xl"></div>

      <!-- Header -->
      <div class="relative mb-4 text-center">
        <div class="flex items-center justify-center space-x-3 mb-2">
          <h3 class="text-lg font-bold bg-gradient-to-r from-webropol-teal-600 to-webropol-teal-700 bg-clip-text text-transparent">Create Something Amazing</h3>
        </div>
        <p class="text-xs text-gray-600">What would you like to build today?</p>
      </div>

      <!-- Menu items -->
      <div class="relative space-y-3">
        <button data-type="surveys"
          class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <i class="fal fa-chart-bar text-white text-lg group-hover:animate-pulse"></i>
          </div>
          <div class="ml-4 flex-1">
            <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">Surveys</span>
            <span class="text-xs text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Create custom surveys</span>
          </div>
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <i class="fal fa-arrow-right text-webropol-teal-600"></i>
          </div>
        </button>

        <button data-type="events"
          class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <i class="fal fa-calendar-alt text-white text-lg group-hover:animate-pulse"></i>
          </div>
          <div class="ml-4 flex-1">
            <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">Events</span>
            <span class="text-xs text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Event management</span>
          </div>
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <i class="fal fa-arrow-right text-webropol-teal-600"></i>
          </div>
        </button>

        <button data-type="2-way-sms"
          class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <i class="fal fa-sms text-white text-lg group-hover:animate-pulse"></i>
          </div>
          <div class="ml-4 flex-1">
            <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">2-Way SMS</span>
            <span class="text-xs text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Send and receive</span>
          </div>
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <i class="fal fa-arrow-right text-webropol-teal-600"></i>
          </div>
        </button>

        <button data-type="exw-surveys"
          class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <i class="fal fa-user-chart text-white text-lg group-hover:animate-pulse"></i>
          </div>
          <div class="ml-4 flex-1">
            <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">EXW Surveys</span>
            <span class="text-xs text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Employee experience</span>
          </div>
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <i class="fal fa-arrow-right text-webropol-teal-600"></i>
          </div>
        </button>

        <button data-type="case-management"
          class="create-item-btn group w-full flex items-center p-4 rounded-2xl border border-webropol-teal-200/50 hover:border-webropol-teal-300 bg-white/50 hover:bg-webropol-teal-50/80 backdrop-blur-sm transition-all duration-300 text-left transform hover:scale-[1.03] hover:shadow-lg">
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <i class="fal fa-briefcase text-white text-lg group-hover:animate-pulse"></i>
          </div>
          <div class="ml-4 flex-1">
            <span class="font-bold text-gray-800 group-hover:text-webropol-teal-700 transition-colors duration-300 block">Case Management</span>
            <span class="text-xs text-gray-600 group-hover:text-webropol-teal-600 transition-colors duration-300">Manage your team</span>
          </div>
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <i class="fal fa-arrow-right text-webropol-teal-600"></i>
          </div>
        </button>
      </div>

      <!-- Footer -->
      <div class="relative mt-5 pt-3 border-t border-white/30">
        <div class="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <i class="fal fa-lightbulb text-yellow-500"></i>
          <span>Build something extraordinary</span>
        </div>
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
