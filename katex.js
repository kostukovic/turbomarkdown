// katex.js – KaTeX-Autorender für ein Root-Element
(function () {
    function typesetMath(rootEl) {
      if (!window.renderMathInElement) return;
      window.renderMathInElement(rootEl, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "\\[", right: "\\]", display: true},
          {left: "$",  right: "$",  display: false},
          {left: "\\(", right: "\\)", display: false},
        ],
        throwOnError: false,
        strict: "warn"
      });
    }
    window.KaTeXHelpers = { typesetMath };
  })();
  