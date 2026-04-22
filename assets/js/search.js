(function () {
  var dataEl = document.getElementById('posts-json');
  if (!dataEl) return;
  var POSTS = [];
  try { POSTS = JSON.parse(dataEl.textContent || '[]'); } catch (e) { POSTS = []; }

  var wpm = 200;
  POSTS.forEach(function (p) {
    var words = p.words || 0;
    var rt = Math.max(1, Math.floor(words / wpm));
    p.readingTime = rt;
  });

  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var empty = document.getElementById('search-empty');
  var count = document.getElementById('search-count');
  var countNum = document.getElementById('search-count-num');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardHtml(p) {
    var tagsHtml = (p.tags || []).map(function (t) {
      return '<span class="tag-chip">' + esc(t) + '</span>';
    }).join('');
    var thumb = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '">'
      : '<span class="placeholder">thumbnail</span>';
    return (
      '<a class="post-card" href="' + esc(p.url) + '">' +
        '<div class="post-card-img">' + thumb + '</div>' +
        '<div class="post-card-body">' +
          (tagsHtml ? '<div class="post-card-tags">' + tagsHtml + '</div>' : '') +
          '<h2 class="post-card-title">' + esc(p.title) + '</h2>' +
          '<p class="post-card-excerpt">' + esc(p.excerpt || '') + '</p>' +
          '<div class="post-card-meta">' +
            '<span>' + esc(p.date) + '</span>' +
            '<span class="dot">·</span>' +
            '<span>' + p.readingTime + '분 읽기</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function render(q) {
    q = (q || '').trim().toLowerCase();
    if (!q) {
      results.innerHTML = '';
      count.style.display = 'none';
      empty.style.display = 'block';
      empty.innerHTML = '<span class="emoji">✍️</span><p style="font-size:15px;margin:0;">검색어를 입력하세요</p>';
      return;
    }
    var matched = POSTS.filter(function (p) {
      if (p.title && p.title.toLowerCase().indexOf(q) !== -1) return true;
      if (p.excerpt && p.excerpt.toLowerCase().indexOf(q) !== -1) return true;
      if (p.tags && p.tags.some(function (t) { return t.toLowerCase().indexOf(q) !== -1; })) return true;
      return false;
    });

    count.style.display = 'block';
    countNum.textContent = matched.length;

    if (matched.length === 0) {
      results.innerHTML = '';
      empty.style.display = 'block';
      empty.innerHTML = '<p style="font-size:15px;margin:0;">일치하는 포스트가 없습니다.</p>';
    } else {
      empty.style.display = 'none';
      results.innerHTML = matched.map(cardHtml).join('');
    }
  }

  if (input) {
    input.addEventListener('input', function () { render(input.value); });
  }
})();
