import { BaseComponent } from '../../utils/base-component.js';

export class WebropolAddPageContent extends BaseComponent {
  static get observedAttributes() {
    return ['page-number'];
  }

  init() {
    this.state = {
      pageNumber: this.getAttr('page-number', '4')
    };
  }

  render() {
    const pageNumber = this.getAttr('page-number', '4');

    this.innerHTML = `
      <div class="w-full max-w-5xl mx-auto">
        <!-- Main Content -->
        <div class="space-y-8">
          <!-- Title Section -->
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">View</h1>
            <p class="text-lg font-semibold text-gray-700">Select to add content</p>
          </div>

          <!-- Top Action Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${this.renderTopCard('add-question', 'Add Other Question Type', 'plus', 'orange')}
            ${this.renderTopCard('import-library', 'Import from Library', 'layer-plus', 'gray')}
            ${this.renderTopCard('free-text', 'Free Text & Media', 'align-left', 'gray')}
          </div>

          <!-- Question Types Grid -->
          <div class="space-y-3">
            <!-- Row 1 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              ${this.renderQuestionItem('matrix', 'Matrix (Scale selection)', 'th', 'green')}
              ${this.renderQuestionItem('selection', 'Selection', 'list-ul', 'blue')}
              ${this.renderQuestionItem('multiselection', 'Multiselection', 'list-check', 'blue')}
            </div>

            <!-- Row 2 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              ${this.renderQuestionItem('open-ended', 'Open ended', 'font-case', 'orange')}
              ${this.renderQuestionItem('contact', 'Contact form', 'address-card', 'orange')}
              ${this.renderQuestionItem('csat', 'CSAT', 'smile-heart', 'purple')}
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="pt-6 border-t border-gray-200 space-y-3">
            <div class="flex items-center justify-between">
              <button type="button" class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-webropol-primary-500 transition-colors" data-action="previous">
                Previous
              </button>
              <button type="button" class="px-6 py-2.5 text-sm font-medium text-white bg-webropol-primary-500 border border-transparent shadow-sm rounded-full hover:bg-webropol-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-webropol-primary-500 transition-colors" data-action="submit">
                Submit
              </button>
            </div>
            <p class="text-sm text-gray-500">Add optional text here</p>
          </div>
        </div>
      </div>
    `;
  }

  renderTopCard(type, label, icon, color) {
    const colorClasses = {
      'orange': {
        icon: 'text-orange-500',
        border: 'border-orange-200',
        bg: 'bg-orange-50',
        hover: 'hover:bg-orange-100 hover:border-orange-300 hover:shadow-md'
      },
      'gray': {
        icon: 'text-gray-700',
        border: 'border-gray-300',
        bg: 'bg-gray-50',
        hover: 'hover:bg-gray-100 hover:border-gray-400 hover:shadow-md'
      }
    };

    const colors = colorClasses[color];

    return `
      <div class="flex flex-col items-center justify-center p-8 transition-all border-2 ${colors.border} ${colors.bg} cursor-pointer rounded-2xl ${colors.hover} group" data-action="select-card" data-type="${type}">
        <div class="flex items-center justify-center w-20 h-20 mb-4 border-2 ${colors.border} rounded-2xl ${colors.bg} group-hover:scale-105 transition-transform">
          <i class="fal fa-${icon} text-3xl ${colors.icon}"></i>
        </div>
        <span class="text-sm font-semibold text-center text-gray-900">${label}</span>
      </div>
    `;
  }

  renderQuestionItem(type, label, icon, color) {
    const colorClasses = {
      'orange': {
        icon: 'text-orange-600 bg-orange-100',
        hover: 'hover:bg-orange-50 hover:border-orange-100'
      },
      'blue': {
        icon: 'text-blue-600 bg-blue-100',
        hover: 'hover:bg-blue-50 hover:border-blue-100'
      },
      'green': {
        icon: 'text-green-600 bg-green-100',
        hover: 'hover:bg-green-50 hover:border-green-100'
      },
      'purple': {
        icon: 'text-purple-600 bg-purple-100',
        hover: 'hover:bg-purple-50 hover:border-purple-100'
      },
      'yellow': {
        icon: 'text-yellow-600 bg-yellow-100',
        hover: 'hover:bg-yellow-50 hover:border-yellow-100'
      }
    };

    const colors = colorClasses[color];

    return `
      <div class="flex items-center justify-between p-2.5 transition-all border border-gray-200 cursor-pointer group rounded-lg ${colors.hover} hover:shadow-sm" data-action="add-question" data-type="${type}">
        <div class="flex items-center gap-2.5 pointer-events-none">
          <div class="flex items-center justify-center w-9 h-9 ${colors.icon} rounded-lg group-hover:scale-105 transition-transform">
            <i class="fal fa-${icon} text-sm"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">${label}</span>
        </div>
        <button class="text-gray-300 hover:text-webropol-primary-500 transition-colors" title="More information">
          <i class="fal fa-info-circle text-sm pointer-events-none"></i>
        </button>
      </div>
    `;
  }

  bindEvents() {
    // Top card selections
    this.querySelectorAll('[data-action="select-card"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const type = el.getAttribute('data-type');
        this.emit('card-selected', { type });
      });
    });

    // Question type selections
    this.querySelectorAll('[data-action="add-question"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const type = el.getAttribute('data-type');
        this.emit('question-added', { type });
      });
    });

    // Previous button
    const previousBtn = this.querySelector('[data-action="previous"]');
    if (previousBtn) {
      previousBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.emit('previous-clicked');
      });
    }

    // Submit button
    const submitBtn = this.querySelector('[data-action="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.emit('submit-clicked');
      });
    }

    // Info buttons (prevent event bubbling)
    this.querySelectorAll('[title="More information"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = btn.closest('[data-action="add-question"]');
        if (parent) {
          const type = parent.getAttribute('data-type');
          this.emit('info-clicked', { type });
        }
      });
    });
  }
}

customElements.define('webropol-add-page-content', WebropolAddPageContent);
