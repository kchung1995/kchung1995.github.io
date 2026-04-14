document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("div.highlighter-rouge, figure.highlight").forEach(function (block) {
    var button = document.createElement("button");
    button.className = "copy-code-btn";
    button.setAttribute("aria-label", "Copy code");
    button.innerHTML = '<i class="far fa-copy"></i>';
    block.appendChild(button);

    button.addEventListener("click", function () {
      var code = block.querySelector("code") || block.querySelector("pre");
      navigator.clipboard.writeText(code.innerText).then(function () {
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(function () {
          button.innerHTML = '<i class="far fa-copy"></i>';
        }, 2000);
      });
    });
  });
});
