(function () {
  const toggles = document.querySelectorAll(".chapter-toggle");

  toggles.forEach((btn) => {
    const panel = btn.nextElementSibling;
    // ensure panel exists
    if (!panel) return;

    // click handler
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      // toggle aria
      btn.setAttribute("aria-expanded", String(!expanded));
      panel.setAttribute("aria-hidden", String(expanded));

      // toggle active class on wrapper
      const wrapper = btn.parentElement;
      wrapper.classList.toggle("active", !expanded);

      // animate max-height
      if (!expanded) {
        // open: set maxHeight to scrollHeight
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        // close
        panel.style.maxHeight = null;
      }

      // optional: change chevron char (keeps visual for non-rotating fonts)
      const chev = btn.querySelector(".chapter-chevron");
      if (chev) chev.textContent = expanded ? "▸" : "▾";
    });

    // keyboard support (Enter / Space)
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // update maxHeight on resize so opened panels stay sized correctly
  window.addEventListener("resize", () => {
    document.querySelectorAll(".chapter").forEach((ch) => {
      const panel = ch.querySelector(".chapter-content");
      if (ch.classList.contains("active") && panel) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
})();
