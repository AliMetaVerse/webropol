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

  handleKey(e) {
    if (this.hasAttribute('open') && e.key === 'Escape') this.close();
  }

  render() {
    const isOpen = this.hasAttribute('open');
    this.innerHTML = `
      <aside class="ai-assistant-panel fixed right-0 w-[380px] max-w-[88vw] bg-white shadow-2xl border-l border-webropol-gray-200 z-[100003] ${isOpen ? 'translate-x-0' : 'translate-x-full'}" style="will-change: transform; transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1); top: 5rem; height: calc(100% - 5rem);">
        <header class="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400">
          <div class="flex items-center space-x-3 text-white">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <i class="fas fa-sparkles text-sm"></i>
            </div>
            <div>
              <div class="text-base font-semibold">AI Assistant</div>
              <div class="text-xs opacity-90">Your intelligent helper</div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button class="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition flex items-center justify-center" title="Settings">
              <i class="fas fa-cog text-sm"></i>
            </button>
            <button class="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition flex items-center justify-center" aria-label="Close assistant">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>
        </header>

        <div class="flex flex-col h-[calc(100%-64px)] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}" style="transition: opacity 300ms ease 120ms, transform 380ms ease 120ms;">
          <!-- Main content area -->
          <div class="flex-1 p-4 space-y-4 overflow-y-auto">
            <div class="text-sm text-gray-600">
              For more precise interaction, please select a segment.
            </div>
            
            <!-- Segment selector -->
            <div class="relative">
              <select class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent appearance-none cursor-pointer">
                <option>All segments</option>
                <option>Surveys</option>
                <option>Events</option>
                <option>Dashboards</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>

            <!-- Welcome card -->
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-sparkles"></i>
                </div>
                <div class="flex-1">
                  <div class="text-base font-semibold text-gray-900 mb-1">Welcome to Webropol AI Assistant!</div>
                  <div class="text-sm text-gray-600 leading-relaxed">Ask anything about the Webropol system, such as features and modules. Get guidance, instructions and tips on how to proceed with your tasks.</div>
                  <div class="mt-3 flex items-center">
                    <div class="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-md flex items-center">
                      <i class="fas fa-magic mr-1.5 text-xs"></i>
                      Random
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Question buttons -->
            <div class="space-y-2">
              ${[
                'Where can I get templates for my staff engagement survey?',
                'How to add more languages to a survey?',
                'How to import surveys from the library with different languages?',
                'Is there a way to create event invitations?'
              ].map(q => `
                <button class="w-full text-left p-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-purple-200 rounded-xl text-sm text-gray-700 transition-all group">
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100">
                      <i class="fas fa-comment-dots text-xs"></i>
                    </div>
                    <span class="leading-relaxed">${q}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Bottom input section -->
          <div class="p-4 border-t border-gray-100 bg-white">
            <!-- Start a new chat button -->
            <button class="w-full mb-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all font-medium text-sm flex items-center justify-center">
              <i class="fas fa-comment mr-2"></i>
              Start a new chat
            </button>
            
            <!-- Input field -->
            <div class="flex items-center space-x-2">
              <input class="flex-1 px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400" placeholder="Type in your question..." />
              <button class="w-10 h-10 rounded-lg bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition-colors">
                <i class="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </aside>
    `;    const closeBtn = this.querySelector('button[aria-label="Close assistant"]');
    const settingsBtn = this.querySelector('button[title="Settings"]');
    const chatBtn = this.querySelector('button:has(i.fa-comment)');
    const sendBtn = this.querySelector('button:has(i.fa-paper-plane)');
    const input = this.querySelector('input[placeholder*="question"]');
    const questionBtns = this.querySelectorAll('button:has(i.fa-comment-dots)');
    
    if (closeBtn) closeBtn.onclick = this.close;
    if (settingsBtn) settingsBtn.onclick = () => console.log('Settings clicked');
    if (chatBtn) chatBtn.onclick = () => console.log('Start new chat clicked');
    if (sendBtn) sendBtn.onclick = () => this.handleSend();
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleSend();
      });
    }
    
    questionBtns.forEach(btn => {
      btn.onclick = () => {
        const question = btn.textContent.trim();
        console.log('Question clicked:', question);
        if (input) input.value = question;
      };
    });

    document.removeEventListener('keydown', this.handleKey);
    if (isOpen) document.addEventListener('keydown', this.handleKey);
  }

  handleSend() {
    const input = this.querySelector('input[placeholder*="question"]');
    if (input && input.value.trim()) {
      console.log('Sending message:', input.value.trim());
      input.value = '';
    }
  }
}

customElements.define('webropol-ai-assistant', WebropolAIAssistant);
