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

  function render(step){
    ensureModal();
    STATE.step = step;
    const step1Src = document.documentElement.getAttribute('data-contact-step1') || '1.png';
    const step2Src = document.documentElement.getAttribute('data-contact-step2') || '2.png';
    const imgSrc = step === 'step1' ? step1Src : step2Src;
    STATE.content.innerHTML = `
      <div class="p-4 sm:p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-webropol-teal-500 to-webropol-teal-600 flex items-center justify-center text-white">
            <i class="fal fa-headset"></i>
          </div>
          <div>
            <div class="font-semibold text-webropol-gray-900">Contact Us</div>
            <div class="text-sm text-webropol-gray-500">Gain Insight & Get Support</div>
          </div>
        </div>
        <div class="rounded-xl border border-webropol-gray-200 overflow-hidden">
          <img src="${imgSrc}" alt="${step === 'step1' ? 'Contact step 1' : 'Contact step 2'}" style="display:block;width:100%;height:auto;" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'p-8 text-center text-webropol-gray-500',innerHTML:'Preview image not found (${imgSrc}).'}));" />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          ${step === 'step2' ? '<button class="px-4 py-2 rounded-lg border border-webropol-gray-200 text-webropol-gray-700 hover:bg-webropol-gray-50" data-contact-back>Back</button>' : ''}
          ${step === 'step1' ? '<button class="px-4 py-2 rounded-lg bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white font-semibold hover:opacity-90" data-contact-next>Contact Us</button>' : '<button class="px-4 py-2 rounded-lg bg-gradient-to-r from-webropol-teal-500 to-webropol-teal-600 text-white font-semibold hover:opacity-90" data-contact-close>Close</button>'}
        </div>
      </div>`;

    const nextBtn = STATE.content.querySelector('[data-contact-next]');
    const backBtn = STATE.content.querySelector('[data-contact-back]');
    const closeBtn = STATE.content.querySelector('[data-contact-close]');
    if (nextBtn) nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); openStep2(); });
    if (backBtn) backBtn.addEventListener('click', (e)=>{ e.preventDefault(); openStep1(); });
    if (closeBtn) closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeModal(); });
  }

  function openStep1(){ render('step1'); setOpen(true); }
  function openStep2(){ render('step2'); setOpen(true); }

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
