(function(){
  function initUnifiedTabs(root=document){
    const tablists = root.querySelectorAll('[role="tablist"], .webropol-tabs-unified, .webropol-tabs-container, .webropol-main-tabs, .webropol-tabs');
    tablists.forEach((tablist)=>{
      // Collect candidate tab buttons within this list
      const tabs = Array.from(tablist.querySelectorAll('button[role="tab"], .webropol-unified-tab, .webropol-main-tab, .webropol-tab, .webropol-edit-tab, .admin-tab'));
      if(!tabs.length) return;

      function getPanels(){
        const rootEl = tablist.closest('[data-tabs-scope]') || document;
        return Array.from(rootEl.querySelectorAll('[role="tabpanel"], .tab-panel, [data-tab-panel]'));
      }

      function findPanelFor(tab){
        const id = tab.getAttribute('data-tab') || tab.getAttribute('aria-controls') || tab.id;
        if(!id) return null;
        const rootEl = tablist.closest('[data-tabs-scope]') || document;
        return (
          rootEl.querySelector(`[role="tabpanel"][id="${id}"]`) ||
          rootEl.querySelector(`[data-tab-panel="${id}"]`) ||
          rootEl.querySelector(`#${CSS.escape(id)}`)
        );
      }

      function setAriaSelected(tab, isActive){
        if(tab.hasAttribute('role')){
          tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
          tab.setAttribute('tabindex', isActive ? '0' : '-1');
        }
      }

      function activateTab(next){
        const siblings = tabs;
        siblings.forEach(btn => {
          btn.classList.remove('active');
          setAriaSelected(btn, false);
        });
        next.classList.add('active');
        setAriaSelected(next, true);

        // Panels toggle (optional)
        const panels = getPanels();
        if(panels.length){
          const targetPanel = findPanelFor(next);
          panels.forEach(p => {
            const isTarget = p === targetPanel;
            p.hidden = !isTarget;
            if(p.getAttribute('role') !== 'tabpanel') {
              p.setAttribute('role','tabpanel');
            }
            p.setAttribute('tabindex','0');
          });
        }

        // Dispatch change event
        const detail = {
          tablist,
          activeTab: next,
          activeId: next.getAttribute('data-tab') || next.id || null,
          label: next.textContent?.trim()
        };
        const ev = new CustomEvent('webropol-tab-change', { detail, bubbles: true });
        tablist.dispatchEvent(ev);
      }

      // Initial state: prefer existing .active, else first
      let initial = tabs.find(t => t.classList.contains('active')) || tabs[0];
      // Ensure ARIA roles for accessibility
      if(!tablist.hasAttribute('role')) tablist.setAttribute('role','tablist');
      tabs.forEach((t,i)=>{
        if(!t.hasAttribute('role')) t.setAttribute('role','tab');
        setAriaSelected(t, t === initial);
        if(!t.id){
          const base = (t.textContent || 'tab').trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
          t.id = `${base || 'tab'}-${i+1}`;
        }
      });
      activateTab(initial);

      // Click handler
      tablist.addEventListener('click', (e)=>{
        const btn = e.target.closest('button, .webropol-unified-tab, .webropol-main-tab, .webropol-tab, .webropol-edit-tab, .admin-tab');
        if(!btn || !tabs.includes(btn)) return;
        if(btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
        activateTab(btn);
      });

      // Keyboard navigation (Left/Right/Home/End)
      tablist.addEventListener('keydown', (e)=>{
        const current = document.activeElement && tabs.includes(document.activeElement) ? document.activeElement : null;
        if(!current) return;
        let idx = tabs.indexOf(current);
        if(e.key === 'ArrowRight' || e.key === 'Right'){ idx = (idx + 1) % tabs.length; e.preventDefault(); }
        else if(e.key === 'ArrowLeft' || e.key === 'Left'){ idx = (idx - 1 + tabs.length) % tabs.length; e.preventDefault(); }
        else if(e.key === 'Home'){ idx = 0; e.preventDefault(); }
        else if(e.key === 'End'){ idx = tabs.length - 1; e.preventDefault(); }
        else return;
        const next = tabs[idx];
        next.focus();
        activateTab(next);
      });
    });
  }

  // Expose and auto-init
  window.WebropolTabs = window.WebropolTabs || {};
  window.WebropolTabs.init = initUnifiedTabs;
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=> initUnifiedTabs());
  } else {
    initUnifiedTabs();
  }
})();
