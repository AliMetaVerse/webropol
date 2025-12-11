import { BaseComponent } from '../../utils/base-component.js';

export class WebropolAddQuestionModal extends BaseComponent {
  init() {
    this.state = {
      isOpen: false,
      searchQuery: ''
    };
  }

  render() {
    // If not open, we can either render nothing or render hidden. 
    // Rendering hidden is better for transitions if we add them later, 
    // but for now let's follow the pattern of toggling visibility classes.
    
    const displayStyle = this.state.isOpen ? 'display: block;' : 'display: none;';
    const hiddenClass = this.state.isOpen ? '' : 'hidden';

    this.innerHTML = `
      <div class="fixed inset-0 z-[9999] ${hiddenClass}" style="${displayStyle}" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm" aria-hidden="true" data-action="close"></div>

          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block w-full text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 sm:max-w-4xl" style="max-width: 800px; border-radius: 16px; overflow: hidden;">
            
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 text-orange-500 bg-orange-100 rounded-lg">
                  <i class="fal fa-plus text-lg"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900" id="modal-title">Add question</h3>
              </div>
              
              <div class="flex items-center gap-3">
                 <!-- Search -->
                 <div class="relative w-64">
                   <i class="absolute text-gray-400 transform -translate-y-1/2 fal fa-search left-3 top-1/2 text-sm"></i>
                   <input type="text" id="question-search-input" class="w-full py-2 pl-10 pr-3 text-sm text-gray-600 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-webropol-primary-500 focus:ring-0 outline-none transition-colors" placeholder="Search question types">
                 </div>
                 
                 <!-- Close button -->
                 <button type="button" class="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600" data-action="close">
                   <span class="sr-only">Close</span>
                   <i class="fal fa-times text-lg pointer-events-none"></i>
                 </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(100vh-200px)] bg-white">
              <div class="space-y-6">
                <!-- Top Row: Text, Selection, Matrix -->
                <div class="grid grid-cols-3 gap-6">
                  <!-- Column 1: Text -->
                  <div>
                    <h4 class="mb-3 text-base font-bold text-gray-900">Text</h4>
                    <div class="space-y-2">
                      ${this.renderQuestionItem('open-ended', 'Open ended', 'font-case', 'orange')}
                      ${this.renderQuestionItem('contact', 'Contact form', 'address-card', 'orange')}
                      ${this.renderQuestionItem('text', 'Text field', 'text', 'orange')}
                      ${this.renderQuestionItem('numeric', 'Numeric field', 'calculator', 'orange')}
                    </div>
                  </div>

                  <!-- Column 2: Selection -->
                  <div>
                    <h4 class="mb-3 text-base font-bold text-gray-900">Selection</h4>
                    <div class="space-y-2">
                      ${this.renderQuestionItem('selection', 'Selection', 'list-ul', 'blue')}
                      ${this.renderQuestionItem('multiselection', 'Multiselection', 'list-check', 'blue')}
                      ${this.renderQuestionItem('dropdown', 'Dropdown', 'caret-square-down', 'blue')}
                      ${this.renderQuestionItem('picture-selection', 'Picture selection', 'image', 'blue')}
                      ${this.renderQuestionItem('picture-multiselection', 'Picture multiselection', 'images', 'blue')}
                    </div>
                  </div>

                  <!-- Column 3: Matrix -->
                  <div>
                    <h4 class="mb-3 text-base font-bold text-gray-900">Matrix</h4>
                    <div class="space-y-2">
                      ${this.renderQuestionItem('matrix', 'Matrix (Scale selection)', 'table', 'green')}
                      ${this.renderQuestionItem('matrix-multi', 'Multiselection matrix', 'th', 'green')}
                      ${this.renderQuestionItem('position', 'Position', 'arrows-h', 'green')}
                    </div>
                  </div>
                </div>

                <!-- Bottom Row: Experience & Loyalty and Other -->
                <div class="grid grid-cols-3 gap-6">
                  <!-- Column 1: Experience & Loyalty -->
                  <div>
                    <h4 class="mb-3 text-base font-bold text-gray-900">Experience & Loyalty</h4>
                    <div class="space-y-2">
                      ${this.renderQuestionItem('nps', 'NPS', 'tachometer-alt', 'purple')}
                      ${this.renderQuestionItem('ces', 'CES', 'books', 'purple')}
                      ${this.renderQuestionItem('csat', 'CSAT', 'smile-heart', 'purple')}
                    </div>
                  </div>

                  <!-- Column 2-3: Other (spans 2 columns with internal 2-col grid) -->
                  <div class="col-span-2">
                    <h4 class="mb-3 text-base font-bold text-gray-900">Other</h4>
                    <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                      ${this.renderQuestionItem('file', 'Attach file to response', 'paperclip', 'yellow')}
                      ${this.renderQuestionItem('fourfold', 'Fourfold', 'border-all', 'yellow')}
                      ${this.renderQuestionItem('calendar', 'Calendar', 'calendar-alt', 'yellow')}
                      ${this.renderQuestionItem('question-table', 'Question table', 'table', 'yellow')}
                      ${this.renderQuestionItem('hierarchical', 'Hierarchical', 'sitemap', 'yellow')}
                      ${this.renderQuestionItem('ranking', 'Ranking', 'sort-amount-up', 'yellow')}
                      ${this.renderQuestionItem('slider', 'Numeric slider', 'sliders-h', 'yellow')}
                      ${this.renderQuestionItem('autosuggest', 'Autosuggest text field', 'file-alt', 'yellow')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex justify-end px-6 py-4 bg-gray-50 rounded-b-2xl bg-white border-t border-gray-100">
              <button type="button" class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-full hover:bg-gray-50 focus:outline-none transition-colors" data-action="close">
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  renderQuestionItem(type, label, icon, color) {
    return `
      <div class="flex items-center justify-between p-2 transition-all border border-transparent cursor-pointer group rounded-lg hover:bg-${color}-50 hover:border-${color}-100" data-action="add-question" data-type="${type}">
        <div class="flex items-center gap-2 pointer-events-none">
          <div class="flex items-center justify-center w-8 h-8 text-sm text-${color}-600 bg-${color}-100 rounded-md">
            <i class="fal fa-${icon}"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">${label}</span>
        </div>
        <button class="text-gray-300 hover:text-webropol-primary-500 transition-colors" title="Info">
          <i class="fal fa-info-circle text-sm pointer-events-none"></i>
        </button>
      </div>
    `;
  }

  bindEvents() {
    // Close buttons and overlay
    this.querySelectorAll('[data-action="close"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    });

    // Add question items
    this.querySelectorAll('[data-action="add-question"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const type = el.getAttribute('data-type');
        this.emit('question-added', { type });
        this.close();
      });
    });

    // Search functionality
    const searchInput = this.querySelector('#question-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        this.filterQuestions(query);
      });
    }
  }

  filterQuestions(query) {
    const items = this.querySelectorAll('[data-action="add-question"]');
    items.forEach(item => {
      const label = item.querySelector('span').textContent.toLowerCase();
      if (label.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  open() {
    this.state.isOpen = true;
    this.render();
    this.bindEvents();
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.state.isOpen = false;
    this.render(); // Re-render to hide
    document.body.style.overflow = '';
  }
}

customElements.define('webropol-add-question-modal', WebropolAddQuestionModal);
