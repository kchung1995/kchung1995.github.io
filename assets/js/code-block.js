(function () {
  if (!document.querySelector('.post-body')) return;

  var blocks = Array.prototype.filter.call(
    document.querySelectorAll('.post-body div.highlighter-rouge, .post-body figure.highlight, .post-body div.highlight'),
    function (block) {
      if (block.tagName.toLowerCase() !== 'div' && block.tagName.toLowerCase() !== 'figure') return false;

      // Rouge often nests div.highlight inside div.highlighter-rouge.
      // Only decorate the outermost wrapper so a block gets one header.
      var outerWrapper = block.parentElement && block.parentElement.closest('div.highlighter-rouge, figure.highlight');
      if (outerWrapper) return false;

      return true;
    }
  );

  blocks.forEach(function (block) {
    if (block.querySelector(':scope > .code-block-header')) return;

    // Figure out the language from class name: language-xxx or highlight-xxx
    var lang = '';
    var m = block.className.match(/(?:language|highlight)-([^\s]+)/);
    if (m) lang = m[1];

    if (!lang) {
      var inner = block.querySelector('[class*="language-"]');
      if (inner) {
        var im = inner.className.match(/language-([^\s]+)/);
        if (im) lang = im[1];
      }
    }
    if (!lang) {
      var codeEl = block.querySelector('code');
      if (codeEl) {
        var cm = codeEl.className.match(/(?:language|highlight)-([^\s]+)/);
        if (cm) lang = cm[1];
      }
    }
    if (lang) lang = lang.toUpperCase();

    var header = document.createElement('div');
    header.className = 'code-block-header';

    var langSpan = document.createElement('span');
    langSpan.className = 'code-lang';
    langSpan.textContent = lang;
    header.appendChild(langSpan);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = '복사';
    btn.addEventListener('click', function () {
      var codeEl = block.querySelector('code') || block.querySelector('pre');
      if (!codeEl) return;
      var text = codeEl.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(setCopied);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); setCopied(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
    function setCopied() {
      btn.textContent = '복사됨 ✓';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = '복사';
        btn.classList.remove('copied');
      }, 2000);
    }
    header.appendChild(btn);
    block.insertBefore(header, block.firstChild);
  });
})();
