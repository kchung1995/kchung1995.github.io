(function () {
  if (!document.querySelector('.post-body')) return;

  var blocks = document.querySelectorAll(
    '.post-body div.highlighter-rouge, .post-body figure.highlight, .post-body div.highlight'
  );

  blocks.forEach(function (block) {
    if (block.querySelector(':scope > .code-block-header')) return;
    if (block.tagName.toLowerCase() !== 'div' && block.tagName.toLowerCase() !== 'figure') return;

    // Figure out the language from class name: language-xxx or highlight-xxx
    var lang = '';
    var m = block.className.match(/language-([^\s]+)/);
    if (m) lang = m[1];
    if (!lang) {
      var inner = block.querySelector('[class*="language-"]');
      if (inner) {
        var im = inner.className.match(/language-([^\s]+)/);
        if (im) lang = im[1];
      }
    }
    if (!lang) lang = 'CODE';

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
