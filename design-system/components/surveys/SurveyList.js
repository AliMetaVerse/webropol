/**
 * Webropol Survey List Component
 * Specialized list for displaying survey items with status and actions
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolSurveyList extends BaseComponent {
  static get observedAttributes() {
    return ['surveys'];
  }

  render() {
    let surveys = [];
    try {
      surveys = JSON.parse(this.getAttr('surveys') || '[]');
    } catch (e) {
      console.warn('Invalid JSON in surveys attribute', e);
    }

    // Default content if no surveys provided (as per specific request)
    if (surveys.length === 0) {
      surveys = [{
        id: 1,
        name: 'Customer Satisfaction Survey',
        status: 'Active',
        responses: 124,
        created: '2023-10-27'
      }];
    }

    this.innerHTML = `
      <div class="space-y-3">
        ${surveys.map(survey => this.renderSurveyItem(survey)).join('')}
      </div>
    `;
  }

  renderSurveyItem(survey) {
    return `
      <div class="group flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 rounded-lg bg-webropol-primary-50 flex items-center justify-center text-webropol-primary-600 group-hover:bg-webropol-primary-100 transition-colors">
            <i class="fal fa-file-chart-line text-lg"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 group-hover:text-webropol-primary-600 transition-colors cursor-pointer" onclick="this.closest('webropol-survey-list').emit('survey-click', {id: ${survey.id}})">
              ${survey.name}
            </h3>
            <div class="flex items-center space-x-3 text-sm text-gray-500 mt-0.5">
              <span class="flex items-center">
                <span class="w-1.5 h-1.5 rounded-full ${survey.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'} mr-1.5"></span>
                ${survey.status}
              </span>
              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>${survey.responses} responses</span>
              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>${survey.created}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" title="Edit">
            <i class="fal fa-pen"></i>
          </button>
          <button class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" title="Analytics">
            <i class="fal fa-chart-bar"></i>
          </button>
          <button class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" title="More">
            <i class="fal fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('webropol-survey-list', WebropolSurveyList);
