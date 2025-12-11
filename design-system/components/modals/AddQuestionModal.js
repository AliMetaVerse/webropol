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
          <div class="inline-block w-full text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 sm:max-w-6xl" style="max-width: 1100px; border-radius: 20px; overflow: hidden;">
            
            <!-- Header -->
            <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
              <div class="flex items-center gap-4">
                <div class="flex items-center justify-center w-12 h-12 text-orange-500 bg-orange-100 rounded-xl">
                  <i class="fal fa-plus text-xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900" id="modal-title">Add question</h3>
              </div>
              
              <div class="flex items-center gap-4">
                 <!-- Search -->
                 <div class="relative w-80">
                   <i class="absolute text-gray-400 transform -translate-y-1/2 fal fa-search left-4 top-1/2"></i>
                   <input type="text" id="question-search-input" class="w-full py-3 pl-12 pr-4 text-gray-600 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-webropol-primary-500 focus:ring-0 outline-none transition-colors" placeholder="Search question types">
                 </div>
                 
                 <!-- Close button -->
                 <button type="button" class="flex items-center justify-center w-10 h-10 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600" data-action="close">
                   <span class="sr-only">Close</span>
                   <i class="fal fa-times text-xl pointer-events-none"></i>
                 </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-8 overflow-y-auto max-h-[calc(100vh-200px)] bg-white">
              <div class="grid grid-cols-3 gap-12">
                 <!-- Column 1 -->
                 <div class="space-y-10">
                   <!-- Text -->
                   <div>
                     <h4 class="mb-6 text-lg font-bold text-gray-900">Text</h4>
                     <div class="space-y-3">
                       ${this.renderQuestionItem('open-ended', 'Open ended', 'font-case', 'orange')}
                       ${this.renderQuestionItem('contact', 'Contact form', 'address-card', 'orange')}
                       ${this.renderQuestionItem('text', 'Text field', 'text', 'orange')}
                       ${this.renderQuestionItem('numeric', 'Numeric field', 'calculator', 'orange')}
                     </div>
                   </div>
                   
                   <!-- Experience & Loyalty -->
                   <div>
                     <h4 class="mb-6 text-lg font-bold text-gray-900">Experience & Loyalty</h4>
                     <div class="space-y-3">
                       ${this.renderQuestionItem('nps', 'NPS', 'tachometer-alt', 'purple')}
                       ${this.renderQuestionItem('ces', 'CES', 'books', 'purple')}
                       ${this.renderQuestionItem('csat', 'CSAT', 'smile-heart', 'purple')}
                     </div>
                   </div>
                 </div>

                 <!-- Column 2 -->
                 <div class="space-y-10">
                   <!-- Selection -->
                   <div>
                     <h4 class="mb-6 text-lg font-bold text-gray-900">Selection</h4>
                     <div class="space-y-3">
                       ${this.renderQuestionItem('selection', 'Selection', 'list-ul', 'blue')}
                       ${this.renderQuestionItem('multiselection', 'Multiselection', 'list-check', 'blue')}
                       ${this.renderQuestionItem('dropdown', 'Dropdown', 'caret-square-down', 'blue')}
                       ${this.renderQuestionItem('picture-selection', 'Picture selection', 'image', 'blue')}
                       ${this.renderQuestionItem('picture-multiselection', 'Picture multiselection', 'images', 'blue')}
                     </div>
                   </div>
                 </div>
                 
                 <!-- Column 3 -->
                 <div class="space-y-10">
                   <!-- Matrix -->
                   <div>
                     <h4 class="mb-6 text-lg font-bold text-gray-900">Matrix</h4>
                     <div class="space-y-3">
                       ${this.renderQuestionItem('matrix', 'Matrix (Scale selection)', 'table', 'green')}
                       ${this.renderQuestionItem('matrix-multi', 'Multiselection matrix', 'th', 'green')}
                       ${this.renderQuestionItem('position', 'Position', 'arrows-h', 'green')}
                     </div>
                   </div>
                   
                   <!-- Other -->
                   <div>
                     <h4 class="mb-6 text-lg font-bold text-gray-900">Other</h4>
                     <div class="space-y-3">
                       ${this.renderQuestionItem('file', 'Attach file to response', 'paperclip', 'yellow')}
                       ${this.renderQuestionItem('calendar', 'Calendar', 'calendar-alt', 'yellow')}
                       ${this.renderQuestionItem('hierarchical', 'Hierarchical', 'sitemap', 'yellow')}
                       ${this.renderQuestionItem('slider', 'Numeric slider', 'sliders-h', 'yellow')}
                       ${this.renderQuestionItem('fourfold', 'Fourfold', 'border-all', 'yellow')}
                       ${this.renderQuestionItem('question-table', 'Question table', 'table', 'yellow')}
                       ${this.renderQuestionItem('ranking', 'Ranking', 'sort-amount-up', 'yellow')}
                       ${this.renderQuestionItem('autosuggest', 'Autosuggest text field', 'file-alt', 'yellow')}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex justify-end px-8 py-6 bg-gray-50 rounded-b-2xl bg-white border-t border-gray-100">
              <button type="button" class="px-8 py-3 font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-full hover:bg-gray-50 focus:outline-none transition-colors" data-action="close">
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
      <div class="flex items-center justify-between p-3 transition-all border border-transparent cursor-pointer group rounded-xl hover:bg-${color}-50 hover:border-${color}-100" data-action="add-question" data-type="${type}">
        <div class="flex items-center gap-4 pointer-events-none">
          <div class="flex items-center justify-center w-12 h-12 text-xl text-${color}-600 bg-${color}-100 rounded-lg">
            <i class="fal fa-${icon}"></i>
          </div>
          <span class="font-medium text-gray-700 group-hover:text-gray-900">${label}</span>
        </div>
        <button class="text-gray-300 hover:text-webropol-primary-500 transition-colors" title="Info">
          <i class="fal fa-info-circle text-xl pointer-events-none"></i>
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
