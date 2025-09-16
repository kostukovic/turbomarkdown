// style.js – setzt CSS-Variable --a auf die aktuelle Spaltenbreite
(function () {
    function setA(px) {
      document.documentElement.style.setProperty('--a', Math.max(0, Math.round(px)) + 'px');
    }
  
    function init() {
      const target = document.querySelector('.panel') || document.querySelector('.app-main') || document.body;
      if (!target) return;
  
      // Initial
      setA(target.clientWidth);
  
      // Live-Updates bei Resize/Zoom/Layout
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(entries => {
          for (const e of entries) {
            const w = e.contentBoxSize
              ? (Array.isArray(e.contentBoxSize) ? e.contentBoxSize[0].inlineSize : e.contentBoxSize.inlineSize)
              : e.contentRect.width;
            setA(w);
          }
        });
        ro.observe(target);
      } else {
        window.addEventListener('resize', () => setA(target.clientWidth));
      }
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  