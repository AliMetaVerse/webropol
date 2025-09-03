/**
 * Webropol AI Assistant Side Panel
 * Appears as a right-side drawer. Intended to be opened from the Header only.
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolAIAssistant extends BaseComponent {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.close = this.close.bind(this);
    this.handleBackdrop = this.handleBackdrop.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && oldValue !== newValue) this.render();
  }

  open() {
    this.setAttribute('open', '');
    this.render();
  }

  close() {
    this.removeAttribute('open');
    this.render();
  }

  handleBackdrop(e) {
    if (e.target === e.currentTarget) this.close();
  }

  handleKey(e) {
    if (this.hasAttribute('open') && e.key === 'Escape') this.close();
  }

  render() {
    const isOpen = this.hasAttribute('open');
    this.innerHTML = `
      <div class="ai-assistant-backdrop fixed left-0 right-0 bottom-0 bg-black/40 z-[100002] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}" style="transition: opacity 200ms ease; top: 5rem;"></div>
      <aside class="ai-assistant-panel fixed right-0 w-[380px] max-w-[88vw] bg-white shadow-2xl border-l border-webropol-gray-200 z-[100003] ${isOpen ? 'translate-x-0' : 'translate-x-full'}" style="transition: transform 250ms ease; top: 5rem; height: calc(100% - 5rem);">
        <header class="flex items-center justify-between px-4 py-3 border-b border-webropol-gray-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div class="flex items-center space-x-3 text-white">
            <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <i class="fas fa-robot"></i>
            </div>
            <div>
              <div class="text-sm font-semibold">AI Assistant</div>
              <div class="text-[11px] opacity-90">Your intelligent helper</div>
            </div>
          </div>
          <button class="w-9 h-9 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition" aria-label="Close assistant">
            <i class="fal fa-times"></i>
          </button>
        </header>

        <div class="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
          <div class="text-xs text-webropol-gray-600">
            For more precise interaction, please select a segment.
          </div>
          <select class="w-full px-3 py-2 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>All segments</option>
            <option>Surveys</option>
            <option>Events</option>
            <option>Dashboards</option>
          </select>

          <div class="bg-gradient-to-br from-gray-50 to-indigo-50/40 border border-webropol-gray-100 rounded-xl p-3">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                <i class="fas fa-sparkles"></i>
              </div>
              <div>
                <div class="text-sm font-semibold text-webropol-gray-800">Welcome to Webropol AI Assistant!</div>
                <div class="text-xs text-webropol-gray-600">Ask anything about the Webropol system, such as features and modules. Get guidance, instructions and tips.</div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            ${[
              'Where can I get templates for my staff engagement survey?',
              'How to add more languages to a survey?',
              'How to import surveys from the library with different languages?',
              'Is there a way to create event invitations?'
            ].map(q => `
              <button class="w-full text-left px-3 py-2 bg-white border border-webropol-gray-200 hover:bg-webropol-gray-50 rounded-xl text-sm text-webropol-gray-800">
                <i class="fal fa-comment-dots mr-2 text-indigo-500"></i>${q}
              </button>
            `).join('')}
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-4 py-3">
              <div class="font-semibold text-sm"><i class="fal fa-magic mr-2"></i>Start a new chat</div>
              <button class="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 transition">
                <i class="fal fa-paper-plane"></i>
              </button>
            </div>
            <div class="mt-2 flex items-center space-x-2">
              <input class="flex-1 px-3 py-2 text-sm border border-webropol-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Type in your question..." />
              <button class="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                <i class="fal fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </aside>
    `;

    const backdrop = this.querySelector('.ai-assistant-backdrop');
    const closeBtn = this.querySelector('button[aria-label="Close assistant"]');
    if (backdrop) backdrop.onclick = this.handleBackdrop;
    if (closeBtn) closeBtn.onclick = this.close;

    document.removeEventListener('keydown', this.handleKey);
    if (isOpen) document.addEventListener('keydown', this.handleKey);
  }
}

customElements.define('webropol-ai-assistant', WebropolAIAssistant);
