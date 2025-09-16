// md2html.js – Markdown → HTML → Baum (inkl. Math-Tokenizing & GFM + HLJS-Highlight)
(function () {
    const normalizeNewlines = s => String(s ?? '').replace(/\r\n?/g, '\n');
    const escapeHtml = (s) => (s || '').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[m]);
    const slugify = (s) => (s || '').toLowerCase().trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
  
    // ---- Math tokenizing to protect from marked
    function tokenizeMath(md) {
      md = normalizeNewlines(md);
      const tokens = [];
      const put = (full) => {
        const token = `\uE001MATH_${tokens.length}\uE001`;
        tokens.push({ token, full });
        return token;
      };
      md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => put(`$$${expr}$$`));      // $$...$$
      md = md.replace(/\\\[((?:.|\n)+?)\\\]/g, (_, expr) => put(`\\[${expr}\\]`));  // \[...\]
      md = md.replace(/\\\((.+?)\\\)/g, (_, expr) => put(`\\(${expr}\\)`));         // \(...\)
      md = md.replace(/(^|[^$])\$([^\s][^$\n]*?)\$/g, (m, lead, expr) => lead + put(`$${expr}$`)); // $...$
      return { md, tokens };
    }
    function detokenizeMath(html, tokens) {
      for (const { token, full } of tokens) html = html.split(token).join(full);
      return html;
    }
  
    // ---- Small HTML enhancer (email quotes + .Endungdomain + anchors → _blank)
    function enhanceHtml(html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
  
      // E-Mail-Quote-Style
      tmp.querySelectorAll('blockquote').forEach(bq => bq.classList.add('email-quote'));
  
      // .Domain inline-code markieren
      tmp.querySelectorAll('code').forEach(el => {
        const t = (el.textContent || '').trim();
        if (/^[\w.-]+\.ai$/i.test(t)) el.classList.add('code-domain-ai');
      });
  
      // --- HRs entfernen (---, ___, ***)
      // 1) echte <hr> entfernen
      tmp.querySelectorAll('hr').forEach(hr => hr.remove());
      // 2) nackte Trenner im <p> wie <p>---</p> entfernen
      tmp.querySelectorAll('p').forEach(p => {
        const s = (p.textContent || '').trim();
        if (/^(?:[-_*]\s*){3,}$/.test(s)) p.remove();
      });
  
      // --- ALLE Anker standardisiert: target="_blank" + rel (ohne interne #)
      const ensureRel = (el, tokens) => {
        const existing = (el.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
        const needed = tokens.split(/\s+/);
        const merged = Array.from(new Set([...existing, ...needed]));
        el.setAttribute('rel', merged.join(' '));
      };
      tmp.querySelectorAll('a[href]').forEach(a => {
        const href = (a.getAttribute('href') || '').trim();
        if (!href || href.startsWith('#')) return; // interne Anker nicht anfassen
  
        // Nur sinnvolle Schemes in neuem Tab öffnen
        if (/^(https?:|mailto:|tel:|\/\/)/i.test(href)) {
          a.setAttribute('target', '_blank');
          ensureRel(a, 'noopener noreferrer');
        }
      });
  
      return tmp.innerHTML;
    }
  
    // ---- Very basic fallback if marked is missing
    function basicMarkdown(md) {
      md = md.replace(/^(.*)\n=+\s*$/gm, '<h1>$1</h1>')
             .replace(/^(.*)\n-+\s*$/gm, '<h2>$1</h2>')
             .replace(/^###### (.*)$/gm, '<h6>$1</h6>')
             .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
             .replace(/^#### (.*)$/gm,  '<h4>$1</h4>')
             .replace(/^### (.*)$/gm,   '<h3>$1</h3>')
             .replace(/^## (.*)$/gm,    '<h2>$1</h2>')
             .replace(/^# (.*)$/gm,     '<h1>$1</h1>');
  
      // GFM tables (simplified)
      md = md.replace(
        /(^\|.*\|\s*$\n^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$\n(?:^\|.*\|\s*$\n?)+)/gm,
        (block) => {
          const lines = block.trim().split('\n');
          const header = lines[0].trim();
          const aligns = lines[1].trim();
          const cells = s => s.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
          const ths = cells(header);
          const als = cells(aligns).map(a => {
            const left = a.startsWith(':'), right = a.endsWith(':');
            return left && right ? 'center' : right ? 'right' : left ? 'left' : null;
          });
          const body = lines.slice(2);
          let html = '<table><thead><tr>';
          ths.forEach((h,i) => {
            const a = als[i] ? ` style="text-align:${als[i]};"` : '';
            html += `<th${a}>${h}</th>`;
          });
          html += '</tr></thead><tbody>';
          body.forEach(row => {
            const tds = cells(row); if (!tds.length) return;
            html += '<tr>';
            tds.forEach((v,i) => {
              const a = als[i] ? ` style="text-align:${als[i]};"` : '';
              html += `<td${a}>${v}</td>`;
            });
            html += '</tr>';
          });
          html += '</tbody></table>';
          return html;
        }
      );
  
      // Blockquotes nesting
      const lines = md.split('\n');
      let out = [], depth = 0;
      const openBQ = () => { out.push('<blockquote>'); depth++; };
      const closeBQ = () => { out.push('</blockquote>'); depth--; };
      for (let i=0;i<lines.length;i++){
        const m = lines[i].match(/^(\s*>+)\s?(.*)$/);
        if (m) {
          const d = m[1].replace(/\s/g,'').length;
          const text = m[2];
          while (depth < d) openBQ();
          while (depth > d) closeBQ();
          out.push(text.length ? text : '<br>');
        } else {
          while (depth > 0) closeBQ();
          out.push(lines[i]);
        }
      }
      while (depth > 0) closeBQ();
      md = out.join('\n');
  
      // Links (mit Titel) → <a target="_blank" rel="noopener noreferrer">, Bilder (![]) bleiben unberührt
      md = md.replace(
        /(!)?\[([^\]]+)\]\((\S+?)(?:\s+"([^"]*)")?\)/g,
        (m, bang, text, href, title) => {
          if (bang) return m; // Bild-Link unangetastet lassen
          const safeHref = String(href).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          const safeText = String(text).replace(/</g,'&lt;').replace(/>/g,'&gt;');
          const titleAttr = title ? ` title="${String(title).replace(/"/g,'&quot;')}"` : '';
          return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer"${titleAttr}>${safeText}</a>`;
        }
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
      // Paragraphs
      const blocks = md.split(/\n{2,}/);
      const html = blocks.map(b => {
        const t = b.trim();
        const isHtml = /^<(h\d|pre|blockquote|ul|ol|p|details|summary|table|div)\b/i.test(t);
        return isHtml ? t : `<p>${t}</p>`;
      }).join('\n');
  
      return html;
    }
  
    // ---- Language-Aliases für HLJS (VSCode-like Kurzformen)
    const langAlias = {
      js: 'javascript',
      ts: 'typescript',
      html: 'xml',
      shell: 'bash',
      sh: 'bash',
      csharp: 'cs',
      jsx: 'javascript',
      tsx: 'typescript',
      yml: 'yaml'
    };
  
    // ---- Parse MD → DOM tree with heading hierarchy
    function parseMarkdownToTree(md) {
      const { md: mdTok, tokens } = tokenizeMath(md);
  
      if (window.marked && typeof window.marked.setOptions === 'function') {
        window.marked.setOptions({
          gfm: true,
          breaks: false,
          langPrefix: 'language-' // <code class="language-xxx">
          // KEIN highlight() hier – das machen wir hinterher mit hljs.highlightElement
        });
      }
  
      const rawHtml = (window.marked && typeof window.marked.parse === 'function')
        ? window.marked.parse(mdTok)
        : basicMarkdown(mdTok);
  
      const withMath = detokenizeMath(rawHtml, tokens);
      const html = enhanceHtml(withMath); // hier werden auch alle <a> auf _blank gesetzt
  
      const root  = { key:'root', level:0, title:'root', slug:'root', htmlParts:[], html:'', children:[] };
      const index = new Map([['root', root]]);
      const stack = [root];
  
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
  
      let i = 0;
      while (i < tmp.childNodes.length) {
        const node = tmp.childNodes[i];
  
        if (node.nodeType === 1 && /^H[1-6]$/i.test(node.tagName)) {
          const level = Number(node.tagName.slice(1));
          const title = node.textContent.trim();
          const slug  = slugify(title);
  
          while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
          const parent = stack[stack.length - 1] || root;
  
          const key = `${parent.key}>${level}:${slug}`;
          const newNode = { key, level, title, slug, htmlParts:[], html:'', children:[] };
  
          parent.children.push(key);
          index.set(key, newNode);
          stack.push(newNode);
          i++;
          continue;
        }
  
        stack[stack.length - 1].htmlParts.push(node.cloneNode(true));
        i++;
      }
  
      for (const n of index.values()) {
        if (!n.htmlParts || !n.htmlParts.length) { n.html = ''; continue; }
        const box = document.createElement('div');
        n.htmlParts.forEach(part => box.appendChild(part));
        n.html = box.innerHTML;
        delete n.htmlParts;
      }
  
      return { root, index };
    }
  
    window.MD2HTML = { parseMarkdownToTree, escapeHtml };
  })();
  