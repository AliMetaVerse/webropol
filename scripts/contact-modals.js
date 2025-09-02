// Global two-step Contact Us modal handler (non-design-system)
// Injects a lightweight modal overlay and intercepts clicks on .contact-footer-btn and #/contact links.
(function(){
  const STATE = {
    root: null,
    backdrop: null,
    content: null,
    open: false,
    step: 'step1'
  };

  function ensureModal(){
    if (STATE.root) return STATE.root;
    const root = document.createElement('div');
    root.setAttribute('data-contact-modal-root','');
    Object.assign(root.style, { position:'fixed', inset:'0', zIndex:'2147483647', display:'none' });

    const backdrop = document.createElement('div');
    Object.assign(backdrop.style, { position:'absolute', inset:'0', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(2px)', opacity:'0', transition:'opacity 180ms ease' });

    const modal = document.createElement('div');
    Object.assign(modal.style, { position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'#fff', borderRadius:'16px', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', width:'min(960px,92vw)', maxHeight:'90vh', overflow:'hidden' });

    const content = document.createElement('div');
    content.setAttribute('data-contact-content','');

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label','Close');
    closeBtn.innerHTML = '<i class="fal fa-times"></i>';
    Object.assign(closeBtn.style, { position:'absolute', top:'12px', right:'12px', width:'40px', height:'40px', borderRadius:'12px', border:'1px solid rgba(0,0,0,0.08)', background:'#fff', color:'#6b7280', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    modal.appendChild(closeBtn);
    modal.appendChild(content);
    root.appendChild(backdrop);
    root.appendChild(modal);
    document.body.appendChild(root);

    STATE.root = root; STATE.backdrop = backdrop; STATE.content = content;
    return root;
  }

  function setOpen(isOpen){
    ensureModal();
    if (isOpen){
      STATE.root.style.display = 'block';
      requestAnimationFrame(()=>{
        STATE.backdrop.style.opacity = '1';
        document.body.style.overflow = 'hidden';
        STATE.open = true;
      });
    } else {
      STATE.backdrop.style.opacity = '0';
      setTimeout(()=>{ if (!STATE.open) STATE.root.style.display = 'none'; }, 160);
      document.body.style.overflow = '';
      STATE.open = false;
    }
  }

  function closeModal(){ setOpen(false); }

  function renderStep1(){
    ensureModal();
    STATE.step = 'step1';
    // Header and two cards
    STATE.content.innerHTML = `
      <div class="p-6 sm:p-8">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-webropol-gray-900">How may we assist you?</h2>
            <p class="text-webropol-gray-500 mt-1">Welcome to new era of fast and efficient responses</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- AI Assistant Card -->
          <div class="rounded-xl border border-webropol-gray-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <i class="fal fa-robot text-orange-500"></i>
              </div>
              <h3 class="font-semibold text-webropol-gray-900">AI Assistant <span class="text-webropol-gray-500 font-normal">(beta)</span></h3>
            </div>
            <p class="text-sm text-webropol-gray-600 leading-relaxed mb-5">With the implementation of AI Assistant, questions can now be addressed with greater speed and efficiency</p>
            <button class="inline-flex items-center px-4 py-2 rounded-full border-2 border-webropol-teal-300 text-webropol-teal-700 hover:bg-webropol-teal-50 font-semibold" data-ai-start>
              Start chatting with AI Assistant
            </button>
          </div>
          <!-- Contact Us Card -->
          <div class="rounded-xl border border-webropol-gray-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <i class="fal fa-headset text-orange-500"></i>
              </div>
              <h3 class="font-semibold text-webropol-gray-900">Contact Us</h3>
            </div>
            <p class="text-sm text-webropol-gray-600 leading-relaxed mb-5">You are always welcome to contact our friendly support. We are happy to help you with your requests and respond as soon as possible</p>
            <button class="inline-flex items-center px-4 py-2 rounded-full border-2 border-webropol-teal-300 text-webropol-teal-700 hover:bg-webropol-teal-50 font-semibold" data-contact-next>
              Contact support
            </button>
          </div>
        </div>
        <div class="mt-6 text-right">
          <button class="text-webropol-gray-500 hover:text-webropol-gray-700" data-contact-close>Cancel</button>
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
    STATE.step = 'step2';
    const username = (document.querySelector('webropol-header, webropol-header-enhanced')?.getAttribute('username')) || '';
    // Left form + right info panel
    STATE.content.innerHTML = `
      <div class="flex flex-col md:flex-row">
        <!-- Left: Form -->
        <div class="flex-1 p-6 sm:p-8">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <i class="fal fa-headset text-orange-500"></i>
            </div>
            <h2 class="text-xl font-semibold text-webropol-gray-900">Contact our friendly support team</h2>
          </div>
          <p class="text-webropol-gray-700 font-medium mb-4">Check your contact details and add message:</p>
          <form class="space-y-6" data-contact-form>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm text-webropol-gray-700 mb-1">Your name <span class="text-red-500">*</span></label>
                <input type="text" name="name" value="${username.replace(/"/g,'&quot;')}" placeholder="Your full name" class="w-full border-b border-webropol-gray-300 focus:border-webropol-teal-500 outline-none py-2" required>
              </div>
              <div>
                <label class="block text-sm text-webropol-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
                <input type="email" name="email" placeholder="you@company.com" class="w-full border-b border-webropol-gray-300 focus:border-webropol-teal-500 outline-none py-2" required>
              </div>
              <div>
                <label class="block text-sm text-webropol-gray-700 mb-1">Your phone number <span class="text-red-500">*</span></label>
                <input type="tel" name="phone" placeholder="Add your phone number" class="w-full border-b border-webropol-gray-300 focus:border-webropol-teal-500 outline-none py-2" required>
              </div>
              <div>
                <label class="block text-sm text-webropol-gray-700 mb-1">Subject <span class="text-red-500">*</span></label>
                <input type="text" name="subject" placeholder="Give a short subject" class="w-full border-b border-webropol-gray-300 focus:border-webropol-teal-500 outline-none py-2" required>
              </div>
            </div>
            <div>
              <label class="block text-sm text-webropol-gray-700 mb-1">Your message <span class="text-red-500">*</span></label>
              <textarea name="message" rows="5" placeholder="Describe your issue shortly" class="w-full border-b border-webropol-gray-300 focus:border-webropol-teal-500 outline-none py-2" required></textarea>
            </div>
            <div class="flex items-start gap-2">
              <input type="checkbox" id="support-permission" class="mt-1" checked>
              <label for="support-permission" class="text-sm text-webropol-gray-700">Please note! I grant Webropol support permission to access my user account</label>
            </div>
            <div class="flex items-center justify-end gap-3">
              <button class="px-4 py-2 rounded-full border border-webropol-gray-300 text-webropol-gray-700 hover:bg-webropol-gray-50" data-contact-back>Cancel</button>
              <button class="px-6 py-2 rounded-full bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white font-semibold hover:opacity-95 inline-flex items-center gap-2" data-contact-send>
                <span>Send</span>
                <i class="fal fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
        <!-- Right: Info Panel -->
        <aside class="w-full md:w-80 bg-webropol-teal-700 text-white p-6 relative">
          <button class="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center" data-contact-close>
            <i class="fal fa-times"></i>
          </button>
          <h3 class="text-lg font-semibold mb-4">Contact information</h3>
          <div class="space-y-5 text-white/90">
            <div class="flex items-start gap-3">
              <i class="fal fa-phone pt-0.5"></i>
              <div>
                <div class="font-medium">Customer Care</div>
                <div>0600 17005</div>
                <div>Mon–Fri, 8–16</div>
                <a href="#" class="underline hover:no-underline">Report an error</a>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i class="fal fa-envelope pt-0.5"></i>
              <div>
                <div class="font-medium">Sales & agreements</div>
                <a href="mailto:myynti@webropol.fi" class="underline hover:no-underline">myynti@webropol.fi</a>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i class="fal fa-question-circle pt-0.5"></i>
              <div>
                <div class="font-medium">Help center</div>
                <a href="#" class="underline hover:no-underline">Read our FAQ</a>
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
