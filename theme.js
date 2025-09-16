// theme.js – 2 Modi ('dark' | 'light'), ohne Persistenz + hljs-Theme sync
(function () {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const state = { mode: null, userOverride: false };
  
    function systemPrefersDark() { return mq ? mq.matches : false; }
    function nextOf(mode) { return mode === 'dark' ? 'light' : 'dark'; }
    function setClasses(mode) {
      const root = document.documentElement;
      root.classList.remove('theme-dark', 'theme-light');
      root.classList.add(`theme-${mode}`);
    }
    function label(mode) { return mode === 'dark' ? 'Dunkel' : 'Hell'; }
  
    // HLJS: Theme umschalten
    function syncHljsTheme(mode) { /* noop */ }
  
    function updateButton(currentMode) {
      const btn = document.getElementById('theme-toggle');
      if (!btn) return;
      const next = nextOf(currentMode);
      btn.textContent = next === 'dark' ? 'Dark' : 'Hell';
      btn.setAttribute('aria-label', `Theme: ${label(currentMode)}. Klicken für ${label(next)}.`);
    }
  
    function applyTheme(mode, { user = false } = {}) {
      state.mode = mode;
      if (user) state.userOverride = true;
      setClasses(mode);
      syncHljsTheme(mode);   // HLJS
      updateButton(mode);
    }
  
    function initTheme() {
      // Initial: Systempräferenz
      applyTheme(systemPrefersDark() ? 'dark' : 'light');
  
      // Button-Toggle (nur Sitzung)
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        btn.addEventListener('click', () => {
          const next = nextOf(state.mode);
          applyTheme(next, { user: true });
        });
      }
  
      // Systemwechsel live übernehmen, solange kein User-Override
      if (mq && typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', () => {
          if (!state.userOverride) applyTheme(systemPrefersDark() ? 'dark' : 'light');
        });
      }
    }
  
    window.Theme = { initTheme, applyTheme };
    document.addEventListener('DOMContentLoaded', initTheme);
  })();
  