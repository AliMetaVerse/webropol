// Global two-step Contact Us modal handler (non-design-system)
// Injects a lightweight modal overlay and intercepts clicks on .contact-footer-btn and #/contact links.
(function(){
  const STATE = {
    root: null,
    backdrop: null,
    content: null,
    modal: null,
    open: false,
    step: 'step1'
  };

  function ensureModal(){
    if (STATE.root) return STATE.root;
    const root = document.createElement('div');
    root.setAttribute('data-contact-modal-root','');
    Object.assign(root.style, { position:'fixed', inset:'0', zIndex:'2147483647', display:'none' });

    const backdrop = document.createElement('div');
    Object.assign(backdrop.style, { position:'absolute', inset:'0', background:'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(139, 92, 246, 0.1) 100%)', backdropFilter:'blur(12px) saturate(180%)', opacity:'0', transition:'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' });

    const modal = document.createElement('div');
    modal.setAttribute('data-contact-modal', '');
    Object.assign(modal.style, { 
      position:'absolute', top:'50%', left:'50%', 
      transform:'translate(-50%,-50%) scale(0.95)', 
      background:'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)', 
      backdropFilter:'blur(20px) saturate(180%)', 
      borderRadius:'24px', 
      boxShadow:'0 32px 80px rgba(6, 182, 212, 0.15), 0 16px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)', 
      border:'1px solid rgba(255, 255, 255, 0.2)',
      width:'min(1100px,95vw)', 
      maxHeight:'92vh', 
      overflow:'hidden',
      transition:'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
    });

    const content = document.createElement('div');
    content.setAttribute('data-contact-content','');

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label','Close');
    closeBtn.innerHTML = '<i class="fal fa-times"></i>';
    Object.assign(closeBtn.style, { 
      position:'absolute', top:'16px', right:'16px', 
      width:'44px', height:'44px', borderRadius:'16px', 
      border:'1px solid rgba(255, 255, 255, 0.3)', 
      background:'rgba(255, 255, 255, 0.9)', 
      backdropFilter:'blur(8px)',
      color:'#6b7280', 
      display:'flex', alignItems:'center', justifyContent:'center', 
      cursor:'pointer',
      pointerEvents:'auto',
      boxShadow:'0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      transition:'all 200ms ease',
      fontSize:'16px',
      zIndex:'100'
    });
    
    closeBtn.addEventListener('mouseenter', ()=> {
      closeBtn.style.background = 'rgba(255, 255, 255, 1)';
      closeBtn.style.transform = 'scale(1.05)';
      closeBtn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
    });
    closeBtn.addEventListener('mouseleave', ()=> {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.9)';
      closeBtn.style.transform = 'scale(1)';
      closeBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
    });

    closeBtn.addEventListener('click', (e) => {
      console.log('Close button clicked!', e);
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        console.log('Backdrop clicked!', e);
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    });

    modal.appendChild(closeBtn);
    modal.appendChild(content);
    modal.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent clicks on modal content from reaching backdrop
    });
    root.appendChild(backdrop);
    root.appendChild(modal);
    document.body.appendChild(root);

    STATE.root = root; STATE.backdrop = backdrop; STATE.content = content; STATE.modal = modal;
    return root;
  }

  function setOpen(isOpen){
    ensureModal();
    if (isOpen){
      STATE.root.style.display = 'block';
      requestAnimationFrame(()=>{
        STATE.backdrop.style.opacity = '1';
        if (STATE.modal) STATE.modal.style.transform = 'translate(-50%, -50%) scale(1)';
        document.body.style.overflow = 'hidden';
        STATE.open = true;
      });
    } else {
      STATE.backdrop.style.opacity = '0';
      if (STATE.modal) STATE.modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
      STATE.open = false;
      setTimeout(()=>{ 
        if (!STATE.open && STATE.root) {
          STATE.root.style.display = 'none';
        }
      }, 280);
      document.body.style.overflow = '';
    }
  }

  function closeModal(){ 
    console.log('closeModal called!'); 
    setOpen(false); 
  }

  function renderStep1(){
    ensureModal();
    STATE.step = 'step1';
    // Enhanced Step 1 with premium styling and animations
    STATE.content.innerHTML = `
      <div class="relative p-8 sm:p-12 bg-gradient-to-br from-white/80 via-white/90 to-webropol-teal-50/30 backdrop-blur-sm">
        <!-- Animated background pattern -->
        <div class="absolute inset-0 opacity-5 pointer-events-none">
          <div class="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-webropol-teal-400 to-webropol-teal-600 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full translate-x-12 translate-y-12 animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative z-10">
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-webropol-teal-500 via-webropol-teal-600 to-webropol-teal-700 rounded-3xl mb-6 shadow-2xl relative group">
              <i class="fal fa-sparkles text-white text-2xl"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-webropol-teal-400 to-webropol-teal-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping"></div>
            </div>
            <h2 class="text-4xl font-bold bg-gradient-to-r from-webropol-gray-900 via-webropol-teal-700 to-webropol-gray-900 bg-clip-text text-transparent mb-3">How may we assist you?</h2>
            <p class="text-webropol-gray-600 text-lg font-medium">Welcome to the new era of fast and efficient responses</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- AI Assistant Card -->
            <div class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-orange-50/60 backdrop-blur-lg border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              <!-- Animated gradient border -->
              <div class="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="absolute inset-px bg-gradient-to-br from-white/90 via-white/80 to-orange-50/60 rounded-3xl"></div>
              
              <div class="relative p-8">
                <div class="flex items-center mb-6">
                  <div class="relative">
                    <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                      <i class="fal fa-robot text-white text-2xl"></i>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-30 animate-pulse"></div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-2xl font-bold text-webropol-gray-900">AI Assistant</h3>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-300">
                      <i class="fal fa-flask mr-1"></i>
                      Beta
                    </span>
                  </div>
                </div>
                
                <p class="text-webropol-gray-700 leading-relaxed mb-8 text-lg">Experience lightning-fast responses powered by advanced AI. Get instant answers to your questions with unprecedented speed and accuracy.</p>
                
                <button class="group/btn relative w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden" data-ai-start>
                  <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative flex items-center justify-center">
                    <i class="fal fa-comments mr-3 text-lg"></i>
                    Start chatting with AI Assistant
                  </span>
                </button>
              </div>
            </div>
            
            <!-- Contact Us Card -->
            <div class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-webropol-teal-50/60 backdrop-blur-lg border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              <!-- Animated gradient border -->
              <div class="absolute inset-0 bg-gradient-to-br from-webropol-teal-400/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="absolute inset-px bg-gradient-to-br from-white/90 via-white/80 to-webropol-teal-50/60 rounded-3xl"></div>
              
              <div class="relative p-8">
                <div class="flex items-center mb-6">
                  <div class="relative">
                    <div class="w-16 h-16 bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                      <i class="fal fa-headset text-white text-2xl"></i>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-br from-webropol-teal-400 to-webropol-teal-600 rounded-2xl opacity-0 group-hover:opacity-30 animate-pulse"></div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-2xl font-bold text-webropol-gray-900">Contact Us</h3>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-webropol-teal-100 to-webropol-teal-200 text-webropol-teal-700 border border-webropol-teal-300">
                      <i class="fal fa-clock mr-1"></i>
                      24/7 Support
                    </span>
                  </div>
                </div>
                
                <p class="text-webropol-gray-700 leading-relaxed mb-8 text-lg">Connect with our friendly support experts who are dedicated to providing personalized assistance and rapid solutions to all your inquiries.</p>
                
                <button class="group/btn relative w-full bg-gradient-to-r from-webropol-teal-500 via-webropol-teal-600 to-blue-600 hover:from-webropol-teal-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden" data-contact-next>
                  <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative flex items-center justify-center">
                    <i class="fal fa-paper-plane mr-3 text-lg"></i>
                    Contact Support Team
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="mt-12 text-center">
            <button class="inline-flex items-center px-6 py-3 text-webropol-gray-500 hover:text-webropol-gray-700 font-semibold rounded-full hover:bg-white/60 transition-all duration-200" data-contact-close>
              <i class="fal fa-times mr-2"></i>
              Cancel
            </button>
          </div>
        </div>
      </div>`;

    const aiBtn = STATE.content.querySelector('[data-ai-start]');
    const nextBtn = STATE.content.querySelector('[data-contact-next]');
    const closeBtn = STATE.content.querySelector('[data-contact-close]');
    if (nextBtn) nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); openStep2(); });
    if (closeBtn) closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeModal(); });
    if (aiBtn) aiBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      try {
        if (window.WebropolSPA) {
          window.WebropolSPA.navigate('/webroai');
        } else {
          window.location.href = 'webroai/index.html';
        }
        closeModal();
      } catch (_) { closeModal(); }
    });
  }

  function renderStep2(){
    ensureModal();
    console.log('Rendering step 2, close button exists:', !!STATE.root.querySelector('[aria-label="Close"]'));
    STATE.step = 'step2';
    const username = (document.querySelector('webropol-header, webropol-header-enhanced')?.getAttribute('username')) || '';
    // Premium contact form with enhanced styling
    STATE.content.innerHTML = `
      <div class="flex flex-col lg:flex-row min-h-[600px]">
        <!-- Left: Enhanced Form -->
        <div class="flex-1 p-8 lg:p-12 bg-gradient-to-br from-white/90 via-white/95 to-webropol-teal-50/30 backdrop-blur-sm relative overflow-hidden">
          <!-- Subtle background pattern -->
          <div class="absolute inset-0 opacity-5 pointer-events-none">
            <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-webropol-teal-400 to-webropol-teal-600 rounded-full translate-x-20 -translate-y-20 animate-pulse"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full -translate-x-16 translate-y-16 animate-pulse" style="animation-delay: 1.5s;"></div>
          </div>
          
          <div class="relative z-10">
            <div class="flex items-center mb-8">
              <div>
                <h2 class="text-3xl font-bold bg-gradient-to-r from-webropol-gray-900 to-webropol-teal-700 bg-clip-text text-transparent">Contact our friendly support team</h2>
                <p class="text-webropol-gray-600 mt-1">We're here to help you succeed</p>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/40">
              <p class="text-webropol-gray-700 font-semibold mb-6 text-lg">Check your contact details and add message:</p>
              
              <form class="space-y-8" data-contact-form>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div class="group">
                    <label class="block text-sm font-semibold text-webropol-gray-700 mb-3">Your name <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <input type="text" name="name" value="${username.replace(/"/g,'&quot;')}" placeholder="Enter your full name" 
                        class="w-full bg-white/80 backdrop-blur-sm border-2 border-webropol-gray-200 focus:border-webropol-teal-500 focus:ring-4 focus:ring-webropol-teal-100 outline-none py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-lg" required>
                      <div class="absolute inset-0 bg-gradient-to-r from-webropol-teal-500/10 to-transparent opacity-0 group-focus-within:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  <div class="group">
                    <label class="block text-sm font-semibold text-webropol-gray-700 mb-3">Email <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <input type="email" name="email" placeholder="you@company.com" 
                        class="w-full bg-white/80 backdrop-blur-sm border-2 border-webropol-gray-200 focus:border-webropol-teal-500 focus:ring-4 focus:ring-webropol-teal-100 outline-none py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-lg" required>
                      <div class="absolute inset-0 bg-gradient-to-r from-webropol-teal-500/10 to-transparent opacity-0 group-focus-within:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  <div class="group">
                    <label class="block text-sm font-semibold text-webropol-gray-700 mb-3">Phone number <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <input type="tel" name="phone" placeholder="Add your phone number" 
                        class="w-full bg-white/80 backdrop-blur-sm border-2 border-webropol-gray-200 focus:border-webropol-teal-500 focus:ring-4 focus:ring-webropol-teal-100 outline-none py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-lg" required>
                      <div class="absolute inset-0 bg-gradient-to-r from-webropol-teal-500/10 to-transparent opacity-0 group-focus-within:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  <div class="group">
                    <label class="block text-sm font-semibold text-webropol-gray-700 mb-3">Subject <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <input type="text" name="subject" placeholder="Give a short subject" 
                        class="w-full bg-white/80 backdrop-blur-sm border-2 border-webropol-gray-200 focus:border-webropol-teal-500 focus:ring-4 focus:ring-webropol-teal-100 outline-none py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-lg" required>
                      <div class="absolute inset-0 bg-gradient-to-r from-webropol-teal-500/10 to-transparent opacity-0 group-focus-within:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
                <div class="group">
                  <label class="block text-sm font-semibold text-webropol-gray-700 mb-3">Your message <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <textarea name="message" rows="6" placeholder="Describe your issue in detail. The more information you provide, the better we can assist you." 
                      class="w-full bg-white/80 backdrop-blur-sm border-2 border-webropol-gray-200 focus:border-webropol-teal-500 focus:ring-4 focus:ring-webropol-teal-100 outline-none py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-lg resize-none" required></textarea>
                    <div class="absolute inset-0 bg-gradient-to-r from-webropol-teal-500/10 to-transparent opacity-0 group-focus-within:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                <div class="flex items-start gap-4 p-4 bg-gradient-to-r from-webropol-teal-50 to-blue-50 rounded-xl border border-webropol-teal-200">
                  <input type="checkbox" id="support-permission" class="mt-1 w-5 h-5 text-webropol-teal-600 rounded focus:ring-webropol-teal-500" checked>
                  <label for="support-permission" class="text-sm text-webropol-gray-700 leading-relaxed">
                    <strong>Please note!</strong> I grant Webropol support permission to access my user account to provide better assistance.
                  </label>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <button class="inline-flex items-center px-8 py-4 text-webropol-gray-600 hover:text-webropol-gray-800 font-semibold rounded-xl hover:bg-white/60 transition-all duration-200" data-contact-back>
                    <i class="fal fa-arrow-left mr-2"></i>
                    Back
                  </button>
                  <button class="group relative inline-flex items-center px-10 py-4 bg-gradient-to-r from-webropol-teal-500 via-webropol-teal-600 to-blue-600 hover:from-webropol-teal-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden" data-contact-send>
                    <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span class="relative flex items-center">
                      <span class="mr-3">Send Message</span>
                      <i class="fal fa-paper-plane text-lg"></i>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Right: Premium Info Panel -->
        <aside class="w-full lg:w-96 bg-gradient-to-br from-webropol-teal-700 via-webropol-teal-800 to-webropol-teal-900 text-white relative overflow-hidden">
          <!-- Animated background -->
          <div class="absolute inset-0 bg-gradient-to-br from-webropol-teal-600/20 via-blue-600/10 to-purple-600/20"></div>
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          
          <div class="relative z-10 p-8 lg:p-10 h-full flex flex-col">
            <div class="mb-8">
              <h3 class="text-2xl font-bold text-white">Contact Information</h3>
            </div>
            
            <div class="space-y-8 flex-1">
              <div class="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-all duration-300 border border-white/20">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="fal fa-phone text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-lg mb-1">Customer Care</div>
                    <div class="text-white/90 text-xl font-semibold mb-1">0600 17005</div>
                    <div class="text-white/80 mb-3">Mon–Fri, 8–16</div>
                    <div class="text-white/80 text-sm">1.85 €/min +mpm</div>
                    <a href="#" class="inline-flex items-center text-white/90 hover:text-white underline hover:no-underline mt-2 text-sm font-semibold">
                      <i class="fal fa-bug mr-1"></i>
                      Report an error
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-all duration-300 border border-white/20">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="fal fa-envelope text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-lg mb-3">Sales & Agreements</div>
                    <a href="mailto:myynti@webropol.fi" class="inline-flex items-center text-white/90 hover:text-white underline hover:no-underline font-semibold">
                      <i class="fal fa-external-link mr-2"></i>
                      myynti@webropol.fi
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-all duration-300 border border-white/20">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="fal fa-question-circle text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-lg mb-3">Help Center</div>
                    <a href="#" class="inline-flex items-center text-white/90 hover:text-white underline hover:no-underline font-semibold">
                      <i class="fal fa-external-link mr-2"></i>
                      Read our FAQ
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div class="flex items-center gap-3 text-white/80 text-sm">
                <i class="fal fa-shield-check text-webropol-teal-300"></i>
                <span>Your data is protected with enterprise-grade security</span>
              </div>
            </div>
          </div>
        </aside>
      </div>`;

    const backBtn = STATE.content.querySelector('[data-contact-back]');
    const closeBtn = STATE.content.querySelector('[data-contact-close]');
    const sendBtn = STATE.content.querySelector('[data-contact-send]');
    if (backBtn) backBtn.addEventListener('click', (e)=>{ e.preventDefault(); renderStep1(); });
    if (closeBtn) closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeModal(); });
    if (sendBtn) sendBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      const form = STATE.content.querySelector('[data-contact-form]');
      if (!form) return;
      const required = Array.from(form.querySelectorAll('[required]'));
      let ok = true;
      required.forEach(el=>{
        if (!el.value.trim()) { ok = false; el.classList.add('border-red-400'); }
        else { el.classList.remove('border-red-400'); }
      });
      if (!ok) return;
      // Placeholder submission
      console.log('Contact support submission', Object.fromEntries(new FormData(form)));
      closeModal();
      try { window.alert('Your message has been sent. Our team will get back to you shortly.'); } catch(_){ }
    });
  }

  function openStep1(){ renderStep1(); setOpen(true); }
  function openStep2(){ renderStep2(); setOpen(true); }

  function intercept(e){
    const link = e.target.closest('.contact-footer-btn, a[href="#/contact"], a[data-route="/contact"]');
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();
    // If mobile drawer is open, close it by clicking its backdrop
    try {
      const backdrop = document.querySelector('[data-mobile-backdrop]');
      if (backdrop) backdrop.click();
    } catch (_) {}
    openStep1();
  }

  // Attach listeners after DOM ready; also support dynamically inserted sidebars by delegation
  function init(){
    document.addEventListener('click', intercept, true);
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && STATE.open) closeModal(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
