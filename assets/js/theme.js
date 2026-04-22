(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('dark-toggle');
  var mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function readState() {
    try { return JSON.parse(localStorage.getItem('blog-ui') || '{}'); }
    catch (e) { return {}; }
  }
  function writeState(s) {
    try { localStorage.setItem('blog-ui', JSON.stringify(s)); } catch (e) {}
  }
  function isDark() {
    var state = readState();
    if (state.theme === 'dark') return true;
    if (state.theme === 'light') return false;
    return mediaQuery ? mediaQuery.matches : false;
  }
  function applyTheme(dark) {
    html.classList.toggle('dark', dark);
  }
  function render() {
    var dark = isDark();
    applyTheme(dark);
    if (toggle) toggle.textContent = dark ? '☀️' : '🌙';
  }
  function emitThemeChange(dark) {
    document.dispatchEvent(new CustomEvent('blog-theme-change', {
      detail: { dark: dark }
    }));
  }

  render();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var state = readState();
      var dark = !isDark();
      state.theme = dark ? 'dark' : 'light';
      writeState(state);
      render();
      emitThemeChange(dark);
    });
  }

  if (mediaQuery) {
    var syncWithSystem = function (event) {
      var state = readState();
      if (state.theme === 'dark' || state.theme === 'light') return;
      var dark = event.matches;
      render();
      emitThemeChange(dark);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncWithSystem);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(syncWithSystem);
    }
  }
})();
