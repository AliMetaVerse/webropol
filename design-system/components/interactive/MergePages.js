import { BaseComponent } from '../../utils/base-component.js';

/**
 * MergePages Component
 * 
 * A component that displays a page separator with an optional merge button.
 * Used in survey editing to allow merging pages together.
 * 
 * @example
 * <!-- Page 1 - no merge button -->
 * <webropol-merge-pages page-number="1" show-merge="false">
 * </webropol-merge-pages>
 * 
 * <!-- Page 2 and beyond - with merge button -->
 * <webropol-merge-pages page-number="2" show-merge="true">
 * </webropol-merge-pages>
 * 
 * @attribute {string} page-number - The page number to display (required)
 * @attribute {boolean} show-merge - Whether to show the merge button (default: true)
 * @attribute {string} icon - Icon class for the page indicator (default: "fal fa-file-alt")
 * 
 * @fires merge-page - Emitted when merge button is clicked with detail: { pageNumber }
 */
export class WebropolMergePages extends BaseComponent {
  static get observedAttributes() {
    return ['page-number', 'show-merge', 'icon'];
  }
  
  render() {
    const pageNumber = this.getAttr('page-number', '1');
    const showMerge = this.getBoolAttr('show-merge');
    const icon = this.getAttr('icon', 'fal fa-file-alt');
    
    this.innerHTML = `
      <div class="my-8 relative">
        <!-- Border line -->
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t-2 border-webropol-gray-200"></div>
        </div>
        
        <!-- Content container -->
        <div class="relative flex justify-center items-center">
          <!-- Page indicator - centered -->
          <span class="px-6 py-2 bg-white text-webropol-gray-600 text-sm font-semibold rounded-full border-2 border-webropol-gray-300 shadow-sm">
            <i class="${icon} mr-2"></i>
            Page ${pageNumber}
          </span>
          
          ${showMerge ? `
          <!-- Merge button - positioned on the right -->
          <button 
            class="merge-pages-btn absolute right-0 px-4 py-2 bg-white text-webropol-primary-600 text-sm font-medium rounded-full border-2 border-webropol-primary-300 shadow-sm hover:bg-webropol-primary-50 hover:border-webropol-primary-500 transition-all duration-200 flex items-center gap-2 group"
            title="Merge this page with the previous page"
            aria-label="Merge page ${pageNumber} with previous page">
            <i class="fal fa-compress-arrows-alt group-hover:scale-110 transition-transform"></i>
            <span>Merge Pages</span>
          </button>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  bindEvents() {
    const mergeBtn = this.querySelector('.merge-pages-btn');
    if (mergeBtn) {
      mergeBtn.addEventListener('click', () => {
        const pageNumber = this.getAttr('page-number', '1');
        this.emit('merge-page', { 
          pageNumber: parseInt(pageNumber),
          targetPage: parseInt(pageNumber) - 1 
        });
      });
    }
  }
}

customElements.define('webropol-merge-pages', WebropolMergePages);
