// engine.js – Orchestrierung, Dateianbindung, Rendering (globale Varianten)
(function () {
  /* ==========================================================================
     Konfiguration
     ========================================================================== */
  const CONFIG = {
    variants: [
      { key: 'Reference',  name: 'Reference',  path: 'css-reference.md'  },
      { key: 'Compact', name: 'Compact',  path: 'css-compact.md' },
      { key: 'Animation', name: 'Animation',  path: 'css-animation.md' },
      { key: 'Error', name: 'Error',  path: 'css-error.md' },
      { key: 'README', name: 'README',  path: 'README.md' },
      
    ],
    defaultKey: 'Compact',
    defaultCollapsed: true,
    collapsibleLevels: { 1:false, 2:true, 3:true, 4:true, 5:false, 6:false },

    // true = mehrere offene pro Ebene; false = Akkordeon pro Ebene
    allowMultipleOpen: false
  };

  /* ==========================================================================
     State
     ========================================================================== */
  const state = {
    trees: new Map(),     // key -> { root, index }
    activeKey: null
  };

  const $ = (sel, el = document) => el.querySelector(sel);
  const output = $('#output');
  const bar = $('#variant-bar');

  /* ==========================================================================
     Collapsible-Animation + Akkordeon
     ========================================================================== */




 function enhanceCollapsible(detailsEl) {
  if (!detailsEl || detailsEl.dataset.enhanced === '1') return;

  const summary = detailsEl.querySelector('summary');
  const content = detailsEl.querySelector('.md-content');
  if (!summary || !content) return;

  detailsEl.dataset.enhanced = '1';
  const DURATION = 500;

  function prime(el, styles) {
    el.style.transition = 'none';
    Object.assign(el.style, styles);
    // Reflow
    void el.offsetHeight;
  }
  function cleanup(el) {
    el.style.transition = '';
    el.style.height = '';
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    el.style.overflow = '';
    el.classList.remove('is-animating');
  }

  // ⬇️ NEU: Öffnen ohne 28px-Snap
  function openWithPadding(el, hostDetails) {
    const cs = getComputedStyle(el);
    const pt = parseFloat(cs.paddingTop) || 0;
    const pb = parseFloat(cs.paddingBottom) || 0;

    hostDetails.setAttribute('open', '');
    el.classList.add('is-animating');

    // Startzustand: komplett zu
    prime(el, { overflow: 'hidden', height: '0px', paddingTop: '0px', paddingBottom: '0px' });

    // Reine Inhaltshöhe (Padding ist gerade 0)
    const contentH = el.scrollHeight;

    // Zielhöhe = Inhalt + finales Padding → kein nachträglicher Sprung
    const targetH = contentH + pt + pb;

    el.style.transition = `height ${DURATION}ms ease, padding-top ${DURATION}ms ease, padding-bottom ${DURATION}ms ease`;
    requestAnimationFrame(() => {
      el.style.height = targetH + 'px';
      el.style.paddingTop = pt + 'px';
      el.style.paddingBottom = pb + 'px';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      el.removeEventListener('transitionend', onEnd);

      // Freeze auf exakte Pixelhöhe, dann in der nächsten Frame “auto” freigeben
      el.style.transition = 'none';
      el.style.height = el.scrollHeight + 'px';
      requestAnimationFrame(() => cleanup(el));
    };
    el.addEventListener('transitionend', onEnd);
  }

  function closeWithPadding(el, hostDetails) {
    const cs = getComputedStyle(el);
    const pt = parseFloat(cs.paddingTop) || 0;
    const pb = parseFloat(cs.paddingBottom) || 0;

    el.classList.add('is-animating');

    const startH = el.scrollHeight;
    prime(el, { overflow: 'hidden', height: startH + 'px', paddingTop: pt + 'px', paddingBottom: pb + 'px' });

    el.style.transition = `height ${DURATION}ms ease, padding-top ${DURATION}ms ease, padding-bottom ${DURATION}ms ease`;
    requestAnimationFrame(() => {
      el.style.height = '0px';
      el.style.paddingTop = '0px';
      el.style.paddingBottom = '0px';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      el.removeEventListener('transitionend', onEnd);
      cleanup(el);
      hostDetails.removeAttribute('open');
    };
    el.addEventListener('transitionend', onEnd);
  }

  function closeOpenSiblings(currentDetails) {
    if (CONFIG.allowMultipleOpen) return;
    const parent = currentDetails.parentElement;
    if (!parent) return;
    const myLevel = currentDetails.dataset.level || '';
    parent.querySelectorAll(':scope > details.md-details[open]').forEach(other => {
      if (other === currentDetails) return;
      if ((other.dataset.level || '') !== myLevel) return;
      const oc = other.querySelector('.md-content');
      if (!oc) { other.removeAttribute('open'); return; }
      closeWithPadding(oc, other);
    });
  }

  summary.addEventListener('click', (ev) => {
    ev.preventDefault();
    const isOpen = detailsEl.hasAttribute('open');
    if (isOpen) {
      closeWithPadding(content, detailsEl);
    } else {
      closeOpenSiblings(detailsEl);
      openWithPadding(content, detailsEl);
    }
  });
}








  
  /* ==========================================================================
     UI: Globale Variant-Bar
     ========================================================================== */
  function buildVariantBar() {
    bar.innerHTML = '';
    const saved = (() => { try { return localStorage.getItem('md_variant_key'); } catch {} return null; })();
    const initialKey = saved && CONFIG.variants.some(v => v.key === saved) ? saved : CONFIG.defaultKey;

    CONFIG.variants.forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.type = 'button';
      btn.textContent = v.name;
      btn.dataset.key = v.key;
      btn.setAttribute('aria-pressed', String(v.key === initialKey));
      btn.addEventListener('click', () => setActiveVariant(v.key));
      bar.appendChild(btn);
    });

    setActiveVariant(initialKey);
  }

  function updateVariantBarActive(key) {
    const chips = bar.querySelectorAll('.chip');
    chips.forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.key === key)));
  }

  /* ==========================================================================
     Render: Baum einer aktiven Variante
     ========================================================================== */
  function isCollapsible(level) {
    return !!CONFIG.collapsibleLevels[level];
  }

  function buildSectionContainer(node, index) {
    const level = node.level || 2;
    const title = node.title || 'Abschnitt';
    const tag = 'H' + Math.min(Math.max(level, 1), 6);

    if (isCollapsible(level)) {
      const details = document.createElement('details');
      details.className = 'md-details md-container';
      details.dataset.level = String(level);
      if (!CONFIG.defaultCollapsed) details.setAttribute('open', '');

      const summary = document.createElement('summary');
      summary.className = 'md-summary';
      summary.innerHTML = `<span class="chevron" aria-hidden="true"></span><span class="title"></span>`;
      summary.querySelector('.title').appendChild(document.createTextNode(title));

      const content = document.createElement('div');
      content.className = 'md-content';

      // Body
      const body = document.createElement('div');
      body.className = 'md-body';
      body.innerHTML = node.html || '';
      content.appendChild(body);

      // Kinder
      (node.children || []).forEach(key => {
        const child = index.get(key);
        if (child) content.appendChild(buildSectionContainer(child, index));
      });

      details.append(summary, content);
      enhanceCollapsible(details);
      return details;

    } else {
      const section = document.createElement('section');
      section.className = 'md-section md-container';

      const h = document.createElement(tag);
      h.className = 'md-heading';
      h.textContent = title;

      const content = document.createElement('div');
      content.className = 'md-content';

      const body = document.createElement('div');
      body.className = 'md-body';
      body.innerHTML = node.html || '';

      content.appendChild(body);

      (node.children || []).forEach(key => {
        const child = index.get(key);
        if (child) content.appendChild(buildSectionContainer(child, index));
      });

      section.append(h, content);
      return section;
    }
  }













  function enhanceCodeBlocks(root) {
    if (!root) return;
  
    const alias = {
      js:'javascript', ts:'typescript', html:'xml',
      sh:'bash', shell:'bash', yml:'yaml',
      csharp:'cs', jsx:'javascript', tsx:'typescript'
    };
  
    // Syntax-Highlighting + Klassen-Aliase
    root.querySelectorAll('pre code').forEach(code => {
      const m = code.className.match(/language-([\w-]+)/);
      let lang = m ? m[1].toLowerCase() : '';
      if (alias[lang]) {
        code.classList.remove(`language-${lang}`);
        lang = alias[lang];
        code.classList.add(`language-${lang}`);
      }
      if (window.hljs) {
        try { hljs.highlightElement(code); } catch {}
      }
      code.classList.add('hljs');
    });
  
    // Für jeden <pre><code>…</code></pre> Block: nur Copy-Button INS code
    root.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector(':scope > code.hljs');
      if (!code) return;
  
      if (!code.querySelector(':scope > .copy-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'Kopieren';
        btn.addEventListener('click', async () => {
          const text = code.innerText || '';
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(text);
            } else {
              const ta = document.createElement('textarea');
              ta.value = text; document.body.appendChild(ta);
              ta.select(); document.execCommand('copy'); ta.remove();
            }
            btn.textContent = 'Kopiert!'; btn.classList.add('copied');
            setTimeout(() => { btn.textContent = 'Kopieren'; btn.classList.remove('copied'); }, 1200);
          } catch {
            btn.textContent = 'Fehler';
            setTimeout(() => { btn.textContent = 'Kopieren'; }, 1200);
          }
        });
        code.appendChild(btn);
      }
    });
  }
  







  function renderActive() {
    const tree = state.trees.get(state.activeKey);
    if (!tree) {
      output.innerHTML = `<p class="muted">Kein Inhalt für <code>${MD2HTML.escapeHtml(state.activeKey)}</code> gefunden.</p>`;
      return;
    }
    output.innerHTML = '';
    const topKeys = tree.root.children;
    topKeys.forEach(key => {
      const node = tree.index.get(key);
      if (node) output.appendChild(buildSectionContainer(node, tree.index));
    });

    // KaTeX auf dem gesamten Output
    if (window.KaTeXHelpers) window.KaTeXHelpers.typesetMath(output);

    // HLJS + Copy-Button (nachträglich & robust)
    enhanceCodeBlocks(output);
  }

  function setActiveVariant(key) {
    state.activeKey = key;
    try { localStorage.setItem('md_variant_key', key); } catch {}
    updateVariantBarActive(key);
    renderActive();
  }

  /* ==========================================================================
     Laden & Boot
     ========================================================================== */
  async function fetchTextOrNull(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.text();
    } catch (e) {
      console.warn('Fehler beim Laden:', url, e.message);
      return null;
    }
  }

  async function loadAll() {
    output.innerHTML = `<p class="muted">Lade ${
      CONFIG.variants.map(v => `<code>${MD2HTML.escapeHtml(v.path)}</code>`).join(' &amp; ')
    } …</p>`;

    const texts = await Promise.all(CONFIG.variants.map(v => fetchTextOrNull(v.path)));
    CONFIG.variants.forEach((v, i) => {
      const md = texts[i] ?? `# ${v.name}\n_Inhalt nicht gefunden:_ \`${v.path}\``;
      const tree = MD2HTML.parseMarkdownToTree(md);
      state.trees.set(v.key, tree);
    });

    buildVariantBar();

    // Sicherheitshalber beim vollständigen Laden noch einmal highlighten (Race-Schutz)
    window.addEventListener('load', () => enhanceCodeBlocks(output));
  }

  document.addEventListener('DOMContentLoaded', loadAll);
})();
