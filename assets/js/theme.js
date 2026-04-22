(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('dark-toggle');

  function readState() {
    try { return JSON.parse(localStorage.getItem('blog-ui') || '{}'); }
    catch (e) { return {}; }
  }
  function writeState(s) {
    try { localStorage.setItem('blog-ui', JSON.stringify(s)); } catch (e) {}
  }
  function render() {
    var dark = html.classList.contains('dark');
    if (toggle) toggle.textContent = dark ? '☀️' : '🌙';
  }

  render();

  if (toggle) {
    toggle.addEventListener('click', function () {
      html.classList.toggle('dark');
      var dark = html.classList.contains('dark');
      var state = readState();
      state.dark = dark;
      writeState(state);
      render();
    });
  }
})();
