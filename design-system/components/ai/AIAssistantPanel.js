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
      <!-- Overlay backdrop -->
      <div class="ai-assistant-overlay fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-[100002] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"></div>
      
      <!-- Side Panel -->
      <aside class="ai-assistant-panel fixed right-0 w-[474px] max-w-[90vw] bg-white shadow-2xl z-[100003] ${isOpen ? 'translate-x-0' : 'translate-x-full'}" style="will-change: transform; transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1); top: 0; height: 100vh;">
        <!-- Header with gradient -->
        <header class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 relative overflow-hidden">
          <!-- Animated gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-purple-700/20 via-blue-600/20 to-cyan-500/20 animate-pulse"></div>
          
          <div class="flex items-center space-x-3 text-white relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i class="fal fa-sparkles text-2xl"></i>
            </div>
            <div>
              <div class="text-lg font-bold">AI Assistant</div>
              <div class="text-xs opacity-90 font-medium">Your intelligent helper</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 relative z-10">
            <button class="w-10 h-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm transition flex items-center justify-center group" aria-label="Close assistant">
              <i class="fal fa-times text-xl group-hover:rotate-90 transition-transform"></i>
            </button>
          </div>
        </header>

        <div class="flex flex-col h-[calc(100%-80px)] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}" style="transition: opacity 300ms ease 120ms, transform 380ms ease 120ms;">
          
          <!-- Segment Selector -->
          <div class="px-6 pt-6 pb-4 bg-gradient-to-b from-purple-50/50 to-transparent">
            <label class="block text-sm text-webropol-gray-600 mb-2 font-medium">For more precise interaction, please select a segment.</label>
            <div class="relative">
              <select class="ai-segment-selector w-full px-4 py-3 pr-10 bg-white border border-webropol-gray-200 rounded-xl text-webropol-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all appearance-none cursor-pointer">
                <option value="all">All segments</option>
                <option value="surveys">Surveys</option>
                <option value="events">Events</option>
                <option value="dashboards">Dashboards</option>
                <option value="sms">SMS</option>
                <option value="admin">Admin Tools</option>
              </select>
              <i class="fal fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-webropol-gray-400 pointer-events-none"></i>
            </div>
          </div>

          <!-- Conversation Area -->
          <div class="ai-conversation flex-1 overflow-y-auto px-6 py-4 space-y-4">
            
            <!-- Welcome Message -->
            <div class="ai-message-group">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <i class="fal fa-sparkles text-white"></i>
                </div>
                <div class="flex-1">
                  <div class="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl rounded-tl-none px-4 py-3 border border-purple-100">
                    <h3 class="font-semibold text-webropol-gray-900 mb-1">Welcome to Webropol AI Assistant!</h3>
                    <p class="text-sm text-webropol-gray-600 leading-relaxed">Ask anything about the Webropol system, such as features and modules. Get guidance, instructions and tips on how to proceed with your tasks.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Random Button -->
            <div class="flex justify-end">
              <button class="ai-random-btn inline-flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 hover:border-purple-300 rounded-xl text-purple-600 hover:text-purple-700 font-medium text-sm transition-all hover:shadow-md group">
                <i class="fal fa-shuffle group-hover:rotate-180 transition-transform"></i>
                Random
              </button>
            </div>

            <!-- Suggestion Cards -->
            <div class="space-y-3">
              ${[
                { icon: 'fa-file-lines', text: 'Where can I get templates for my staff engagement survey?' },
                { icon: 'fa-language', text: 'How to add more languages to a survey?' },
                { icon: 'fa-download', text: 'How to import surveys from the library with different languages?' },
                { icon: 'fa-calendar', text: 'Is there a way to create event invitations?' }
              ].map((q, index) => `
                <button class="ai-suggestion-card w-full text-left px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-fuchsia-50 border border-webropol-gray-200 hover:border-purple-300 rounded-xl transition-all group" data-question="${q.text}">
                  <div class="flex items-center gap-3">
                    <i class="fal ${q.icon} text-purple-600 text-lg"></i>
                    <p class="text-sm font-medium text-webropol-gray-700 group-hover:text-purple-700 flex-1">${q.text}</p>
                  </div>
                </button>
              `).join('')}
            </div>

            <!-- Messages container for conversation -->
            <div class="ai-messages-container"></div>

          </div>

          <!-- Input Area -->
          <div class="ai-input-area border-t border-webropol-gray-200 bg-white px-6 py-4">
            <!-- Start New Chat Button -->
            <button class="ai-new-chat-btn w-full mb-3 px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 hover:from-purple-700 hover:via-blue-600 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <i class="fal fa-comment-plus"></i>
              <span>Start a new chat</span>
            </button>

            <!-- Input Field -->
            <div class="relative">
              <input type="text" 
                class="ai-input-field w-full px-4 py-3 pr-12 bg-webropol-gray-50 border border-webropol-gray-200 rounded-xl text-webropol-gray-700 placeholder:text-webropol-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" 
                placeholder="Type in your question..." 
                aria-label="AI Assistant question input"
              />
              <button class="ai-send-btn absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">
                <i class="fal fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </aside>
    `;
    
    // Event listeners
    const closeBtn = this.querySelector('button[aria-label="Close assistant"]');
    const overlay = this.querySelector('.ai-assistant-overlay');
    const chatBtn = this.querySelector('.ai-new-chat-btn');
    const sendBtn = this.querySelector('.ai-send-btn');
    const input = this.querySelector('.ai-input-field');
    const randomBtn = this.querySelector('.ai-random-btn');
    const questionBtns = this.querySelectorAll('.ai-suggestion-card');
    
    if (closeBtn) closeBtn.onclick = this.close;
    if (overlay) overlay.onclick = this.close;
    if (chatBtn) chatBtn.onclick = () => this.handleNewChat();
    if (sendBtn) sendBtn.onclick = () => this.handleSend();
    if (randomBtn) randomBtn.onclick = () => this.handleRandom();
    
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleSend();
      });
    }
    
    questionBtns.forEach(btn => {
      btn.onclick = () => {
        const question = btn.dataset.question;
        if (input) input.value = question;
        this.handleSend();
      };
    });

    document.removeEventListener('keydown', this.handleKey);
    if (isOpen) {
      document.addEventListener('keydown', this.handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  handleNewChat() {
    const messagesContainer = this.querySelector('.ai-messages-container');
    if (messagesContainer) messagesContainer.innerHTML = '';
    
    const input = this.querySelector('.ai-input-field');
    if (input) input.value = '';
    
    // Show suggestions again
    const suggestionsContainer = this.querySelector('.space-y-3');
    if (suggestionsContainer) suggestionsContainer.style.display = 'block';
    
    const randomBtnContainer = this.querySelector('.ai-random-btn')?.parentElement;
    if (randomBtnContainer) randomBtnContainer.style.display = 'flex';
  }

  handleRandom() {
    const suggestions = [
      'Where can I get templates for my staff engagement survey?',
      'How to add more languages to a survey?',
      'How to import surveys from the library with different languages?',
      'Is there a way to create event invitations?'
    ];
    const randomQuestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    const input = this.querySelector('.ai-input-field');
    if (input) {
      input.value = randomQuestion;
      this.handleSend();
    }
  }

  handleSend() {
    const input = this.querySelector('.ai-input-field');
    if (!input || !input.value.trim()) return;
    
    const question = input.value.trim();
    const messagesContainer = this.querySelector('.ai-messages-container');
    
    // Hide suggestions after first message
    const suggestionsContainer = this.querySelector('.space-y-3');
    if (suggestionsContainer) suggestionsContainer.style.display = 'none';
    
    const randomBtnContainer = this.querySelector('.ai-random-btn')?.parentElement;
    if (randomBtnContainer) randomBtnContainer.style.display = 'none';
    
    // Add user message
    if (messagesContainer) {
      const userMessage = document.createElement('div');
      userMessage.className = 'ai-message-group flex justify-end';
      userMessage.innerHTML = `
        <div class="max-w-[80%] bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-3">
          <p class="text-sm">${this.escapeHtml(question)}</p>
        </div>
      `;
      messagesContainer.appendChild(userMessage);
      
      // Simulate AI response
      setTimeout(() => {
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message-group';
        aiMessage.innerHTML = `
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
              <i class="fal fa-sparkles text-white"></i>
            </div>
            <div class="flex-1">
              <div class="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl rounded-tl-none px-4 py-3 border border-purple-100">
                <p class="text-sm text-webropol-gray-600 leading-relaxed">${this.getAIResponse(question)}</p>
              </div>
            </div>
          </div>
        `;
        messagesContainer.appendChild(aiMessage);
        
        // Scroll to bottom
        const conversationArea = this.querySelector('.ai-conversation');
        if (conversationArea) {
          conversationArea.scrollTop = conversationArea.scrollHeight;
        }
      }, 800);
      
      // Scroll to bottom
      const conversationArea = this.querySelector('.ai-conversation');
      if (conversationArea) {
        setTimeout(() => {
          conversationArea.scrollTop = conversationArea.scrollHeight;
        }, 100);
      }
    }
    
    input.value = '';
  }

  getAIResponse(question) {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('template') || lowerQ.includes('staff engagement')) {
      return 'You can find staff engagement survey templates in the Survey Library. Navigate to Surveys > Create New > Choose from Library, then filter by "Staff Engagement" category.';
    }
    if (lowerQ.includes('language')) {
      return 'To add languages to your survey, go to Survey Settings > Languages tab. Click "Add Language" and select from the available options. You can then translate each question individually.';
    }
    if (lowerQ.includes('import') || lowerQ.includes('library')) {
      return 'To import surveys with multiple languages, go to Survey Library > Import. Select your survey and ensure "Import all languages" is checked. The system will preserve all language versions.';
    }
    if (lowerQ.includes('event') || lowerQ.includes('invitation')) {
      return 'Yes! You can create event invitations using the Events module. Go to Events > Create New > Event Invitation. You can customize the design and send via email or SMS.';
    }
    return `I can help you with that! Based on your question about "${question}", I'd recommend checking the relevant documentation or reaching out to support for detailed guidance.`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKey);
    document.body.style.overflow = '';
  }
}

customElements.define('webropol-ai-assistant', WebropolAIAssistant);
