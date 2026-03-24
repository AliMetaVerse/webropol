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
    Object.assign(root.style, { position:'fixed', inset:'0', zIndex:'100000', display:'none' });

    const backdrop = document.createElement('div');
    Object.assign(backdrop.style, { position:'absolute', inset:'0', background:'rgba(15, 23, 42, 0.55)', backdropFilter:'blur(4px)', opacity:'0', transition:'opacity 250ms ease' });

    const modal = document.createElement('div');
    modal.setAttribute('data-contact-modal', '');
    Object.assign(modal.style, { 
      position:'absolute', top:'50%', left:'50%', 
      transform:'translate(-50%,-50%) translateY(8px)', 
      background:'#ffffff', 
      borderRadius:'8px', 
      boxShadow:'0 2px 15px 5px rgba(39,42,43,0.2)', 
      border:'1px solid #e2e8f0',
      width:'min(1060px,96vw)', 
      maxHeight:'92vh', 
      overflow:'hidden',
      opacity:'0',
      transition:'opacity 250ms ease, transform 250ms ease'
    });

    const content = document.createElement('div');
    content.setAttribute('data-contact-content','');

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label','Close');
    closeBtn.innerHTML = '<i class="fal fa-times"></i>';
    Object.assign(closeBtn.style, { 
      position:'absolute', top:'16px', right:'16px', 
      width:'48px', height:'48px', borderRadius:'99px', 
      border:'none', 
      background:'transparent', 
      color:'#ffffff', 
      display:'flex', alignItems:'center', justifyContent:'center', 
      cursor:'pointer',
      pointerEvents:'auto',
      boxShadow:'none',
      transition:'background 150ms ease',
      fontSize:'20px',
      zIndex:'100'
    });
    
    closeBtn.addEventListener('mouseenter', ()=> {
      closeBtn.style.background = 'rgba(255,255,255,0.15)';
    });
    closeBtn.addEventListener('mouseleave', ()=> {
      closeBtn.style.background = 'transparent';
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
        if (STATE.modal) {
          STATE.modal.style.opacity = '1';
          STATE.modal.style.transform = 'translate(-50%, -50%) translateY(0)';
        }
        document.body.style.overflow = 'hidden';
        STATE.open = true;
      });
    } else {
      STATE.backdrop.style.opacity = '0';
      if (STATE.modal) {
        STATE.modal.style.opacity = '0';
        STATE.modal.style.transform = 'translate(-50%, -50%) translateY(8px)';
      }
      STATE.open = false;
      setTimeout(()=>{ 
        if (!STATE.open && STATE.root) {
          STATE.root.style.display = 'none';
        }
      }, 260);
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
    STATE.modal.style.width = 'min(640px, 96vw)';
    STATE.content.innerHTML = `
      <div>
        <div class="px-8 pt-6 pb-5 border-b border-webropol-gray-100" style="padding-right:64px">
          <p class="text-xs font-bold uppercase tracking-widest text-webropol-primary-600 mb-1.5">Webropol Support</p>
          <h2 class="text-lg font-semibold text-webropol-gray-900 mb-0.5">How can we help you?</h2>
          <p class="text-sm text-webropol-gray-500">Choose how you'd like to reach us today.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-7">
          <!-- AI Assistant Card -->
          <div class="flex flex-col rounded-xl border border-webropol-gray-200 p-5 hover:border-webropol-royalViolet-200 hover:shadow-sm transition-all duration-150">
            <div class="w-11 h-11 rounded-xl bg-webropol-royalViolet-50 flex items-center justify-center mb-4 flex-shrink-0">
              <i class="fa-light fa-message-bot text-webropol-royalViolet-500"></i>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-sm font-semibold text-webropol-gray-900">AI Assistant</h3>
              <span class="text-xs font-bold bg-webropol-royalViolet-50 text-webropol-royalViolet-600 border border-webropol-royalViolet-200 rounded px-1.5 py-0.5">Beta</span>
            </div>
            <p class="text-xs text-webropol-gray-500 leading-relaxed mt-1 mb-5 flex-1">Instant answers powered by AI — available 24/7, no waiting.</p>
            <button class="w-full flex items-center justify-center gap-2 py-2.5 bg-webropol-royalViolet-600 hover:bg-webropol-royalViolet-700 rounded-full text-sm font-semibold text-white transition-colors duration-150" data-ai-start>
              <i class="fa-light fa-message-bot text-sm"></i>
              Start chatting
            </button>
          </div>

          <!-- Contact Support Card -->
          <div class="flex flex-col rounded-xl border border-webropol-gray-200 p-5 hover:border-webropol-primary-500 hover:shadow-sm transition-all duration-150">
            <div class="w-11 h-11 rounded-xl bg-webropol-primary-50 flex items-center justify-center mb-4 flex-shrink-0">
              <i class="fal fa-headset text-webropol-primary-600"></i>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-sm font-semibold text-webropol-gray-900">Support Team</h3>
              <span class="text-xs font-bold bg-webropol-primary-50 text-webropol-primary-700 border border-webropol-primary-200 rounded px-1.5 py-0.5">Live</span>
            </div>
            <p class="text-xs text-webropol-gray-500 leading-relaxed mt-1 mb-5 flex-1">Speak with our specialists for personalized, expert assistance.</p>
            <button class="w-full flex items-center justify-center gap-2 py-2.5 bg-webropol-primary-600 hover:bg-webropol-primary-700 rounded-full text-sm font-semibold text-white transition-colors duration-150" data-contact-next>
              <i class="fal fa-paper-plane text-sm"></i>
              Contact Support
            </button>
          </div>
        </div>
      </div>`;

    const aiBtn = STATE.content.querySelector('[data-ai-start]');
    const nextBtn = STATE.content.querySelector('[data-contact-next]');
    if (nextBtn) nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); openStep2(); });
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
    STATE.modal.style.width = 'min(960px, 96vw)';
    const username = (document.querySelector('webropol-header, webropol-header-enhanced')?.getAttribute('username')) || '';
    // Try to detect survey context for Survey ID field
    const surveyId = (()=>{
      try {
        const m = window.location.hash.match(/survey[^0-9]*([0-9]{6,})/i) ||
                  window.location.pathname.match(/survey[^0-9]*([0-9]{6,})/i) ||
                  document.body.getAttribute('data-survey-id');
        return m ? (typeof m === 'string' ? m : m[1]) : '';
      } catch(_){ return ''; }
    })();
    STATE.content.innerHTML = `
      <div style="display:flex;min-height:560px">

        <!-- Left: Form -->
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;padding:32px;padding-right:32px">

          <!-- Modal heading -->
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;padding-right:56px">
            <div style="width:48px;height:48px;border-radius:99px;background:#ffe5d4;border:2px solid white;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i class="fal fa-heart" style="color:#c61e08;font-size:20px"></i>
            </div>
            <h2 style="font-size:23px;font-weight:700;line-height:32px;color:#272a2b;margin:0">Contact our friendly support team</h2>
          </div>

          <!-- Sub-heading -->
          <h3 style="font-size:20px;font-weight:700;line-height:24px;color:#272a2b;margin:0 0 24px">Leave us a message</h3>

          <!-- Form -->
          <form data-contact-form style="flex:1;display:flex;flex-direction:column;gap:0">
            <!-- Input grid -->
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:0 0;row-gap:32px;margin-bottom:32px">

              <!-- Survey ID -->
              <div style="width:291px;display:flex;flex-direction:column">
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:500;color:#61686a;line-height:20px">Survey ID</span>
                  <span style="font-size:13px;font-weight:500;color:#be1241">*</span>
                </div>
                <div style="display:flex;align-items:center;border-bottom:1px solid #9ba2a4;padding:12px 0">
                  <input type="text" name="survey_id" value="${surveyId.replace(/"/g,'&quot;')}" placeholder="" style="flex:1;background:transparent;border:none;outline:none;font-size:14px;color:#61686a;font-family:inherit" readonly>
                  <i class="fal fa-lock" style="color:#61686a;font-size:14px"></i>
                </div>
              </div>

              <!-- Your name -->
              <div style="width:291px;display:flex;flex-direction:column">
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:500;color:#61686a;line-height:20px">Your name</span>
                  <span style="font-size:13px;font-weight:500;color:#be1241">*</span>
                </div>
                <div style="border-bottom:1px solid #9ba2a4;padding:12px 0">
                  <input type="text" name="name" value="${username.replace(/"/g,'&quot;')}" style="width:100%;background:transparent;border:none;outline:none;font-size:14px;color:#272a2b;font-family:inherit" required>
                </div>
              </div>

              <!-- Email address -->
              <div style="width:291px;display:flex;flex-direction:column">
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:500;color:#61686a;line-height:20px">Email address</span>
                  <span style="font-size:13px;font-weight:500;color:#be1241">*</span>
                </div>
                <div style="border-bottom:1px solid #9ba2a4;padding:12px 0">
                  <input type="email" name="email" style="width:100%;background:transparent;border:none;outline:none;font-size:14px;color:#272a2b;font-family:inherit" required>
                </div>
              </div>

              <!-- Phone number -->
              <div style="width:291px;display:flex;flex-direction:column">
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:500;color:#61686a;line-height:20px">Phone number</span>
                  <span style="font-size:13px;font-weight:500;color:#be1241">*</span>
                </div>
                <div style="border-bottom:1px solid #9ba2a4;padding:12px 0">
                  <input type="tel" name="phone" style="width:100%;background:transparent;border:none;outline:none;font-size:14px;color:#272a2b;font-family:inherit" required>
                </div>
              </div>

              <!-- Subject (full-width) -->
              <div style="width:100%;display:flex;flex-direction:column">
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:500;color:#61686a;line-height:20px">Subject</span>
                  <span style="font-size:13px;font-weight:500;color:#be1241">*</span>
                </div>
                <div style="border-bottom:1px solid #9ba2a4;padding:12px 0">
                  <input type="text" name="subject" placeholder="Give a short subject" style="width:100%;background:transparent;border:none;outline:none;font-size:13px;color:#61686a;font-family:inherit" required>
                </div>
              </div>

              <!-- Message (full-width) -->
              <div style="width:100%;display:flex;flex-direction:column">
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:500;color:#61686a;line-height:20px">Message</span>
                  <span style="font-size:13px;font-weight:500;color:#be1241">*</span>
                </div>
                <div style="border-bottom:1px solid #9ba2a4;padding:12px 0">
                  <textarea name="message" rows="3" placeholder="Describe your issue shortly" style="width:100%;background:transparent;border:none;outline:none;font-size:13px;color:#61686a;font-family:inherit;resize:none" required></textarea>
                </div>
              </div>

            </div>

            <!-- Checkbox -->
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px">
              <div data-perm-toggle style="width:24px;height:24px;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center">
                <i class="fal fa-square" data-perm-icon style="font-size:20px;color:#61686a"></i>
              </div>
              <input type="checkbox" name="permission" id="perm-cb" style="display:none" checked>
              <label for="perm-cb" style="font-size:14px;color:#272a2b;line-height:20px;cursor:pointer">Grant Webropol support permission to access my user account</label>
            </div>

            <!-- Footer buttons -->
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px">
              <button type="button" data-contact-back
                style="padding:12px 16px;border-radius:99px;border:1px solid #1e6880;background:#eefbfd;color:#1e6880;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;transition:background 150ms ease">
                Cancel
              </button>
              <button type="submit" data-contact-send
                style="display:inline-flex;align-items:center;gap:8px;padding:12px 16px;border-radius:99px;border:none;background:#1e6880;color:white;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;transition:background 150ms ease">
                Send <i class="fal fa-paper-plane" style="font-size:14px"></i>
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Contact Info Sidebar -->
        <aside style="width:282px;flex-shrink:0;background:#1e6880;border-radius:0 8px 8px 0;padding:80px 32px 32px;display:flex;flex-direction:column;gap:32px;overflow:hidden">

          <h3 style="font-size:20px;font-weight:700;line-height:24px;color:white;margin:0">Contact information</h3>

          <!-- Customer care -->
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="fal fa-square-phone" style="font-size:24px;color:#79d6e7;flex-shrink:0;line-height:32px"></i>
            <div style="display:flex;flex-direction:column;gap:4px">
              <p style="font-size:14px;font-weight:700;color:white;margin:0;line-height:20px">Customer care</p>
              <div style="font-size:14px;color:white;line-height:20px">
                <p style="margin:0">0600 17005</p>
                <p style="margin:0">Mon-Fri 8-16</p>
                <p style="margin:0">3,00 €/min + mpm</p>
              </div>
              <a href="#" style="font-size:14px;color:white;line-height:20px;border-bottom:1px solid white;display:inline-block;width:fit-content;text-decoration:none">Report an error</a>
            </div>
          </div>

          <!-- Sales & Agreements -->
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="fal fa-square-envelope" style="font-size:24px;color:#79d6e7;flex-shrink:0;line-height:32px"></i>
            <div style="display:flex;flex-direction:column;gap:4px">
              <p style="font-size:14px;font-weight:700;color:white;margin:0;line-height:20px">Sales &amp; Agreements</p>
              <a href="mailto:myynti@webropol.fi" style="font-size:14px;color:white;line-height:20px;border-bottom:1px solid white;display:inline-block;width:fit-content;text-decoration:none">myynti@webropol.fi</a>
            </div>
          </div>

          <!-- Help center -->
          <div style="display:flex;gap:12px;align-items:flex-start">
            <i class="fal fa-square-question" style="font-size:24px;color:#79d6e7;flex-shrink:0;line-height:32px"></i>
            <div style="display:flex;flex-direction:column;gap:4px">
              <p style="font-size:14px;font-weight:700;color:white;margin:0;line-height:20px">Help center</p>
              <a href="#" style="font-size:14px;color:white;line-height:20px;border-bottom:1px solid white;display:inline-block;width:fit-content;text-decoration:none">Read our FAQs</a>
            </div>
          </div>

        </aside>
      </div>`;

    // Checkbox toggle (FA square/check-square)
    const permToggle = STATE.content.querySelector('[data-perm-toggle]');
    const permCb = STATE.content.querySelector('#perm-cb');
    const permIcon = STATE.content.querySelector('[data-perm-icon]');
    if (permToggle) permToggle.addEventListener('click', ()=>{
      permCb.checked = !permCb.checked;
      permIcon.className = permCb.checked ? 'fas fa-check-square' : 'fal fa-square';
      permIcon.style.color = permCb.checked ? '#1e6880' : '#61686a';
    });
    // Sync initial state
    if (permCb && permCb.checked && permIcon) {
      permIcon.className = 'fas fa-check-square';
      permIcon.style.color = '#1e6880';
    }
    // Button hover
    const cancelBtn = STATE.content.querySelector('[data-contact-back]');
    if (cancelBtn) {
      cancelBtn.addEventListener('mouseenter', ()=> { cancelBtn.style.background = '#d6f4fa'; });
      cancelBtn.addEventListener('mouseleave', ()=> { cancelBtn.style.background = '#eefbfd'; });
    }
    const sendBtnEl = STATE.content.querySelector('[data-contact-send]');
    if (sendBtnEl) {
      sendBtnEl.addEventListener('mouseenter', ()=> { sendBtnEl.style.background = '#164e63'; });
      sendBtnEl.addEventListener('mouseleave', ()=> { sendBtnEl.style.background = '#1e6880'; });
    }

    const backBtn = STATE.content.querySelector('[data-contact-back]');
    const sendBtn = STATE.content.querySelector('[data-contact-send]');
    if (backBtn) backBtn.addEventListener('click', (e)=>{ e.preventDefault(); renderStep1(); });
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
