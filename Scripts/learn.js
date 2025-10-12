// Select all toggle buttons
const toggles = document.querySelectorAll(".chapter-toggle");

toggles.forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;

    // Toggle visibility
    if (content.style.display === "block") {
      content.style.display = "none";
      btn.textContent = btn.textContent.replace("⬆", "⬇");
    } else {
      content.style.display = "block";
      btn.textContent = btn.textContent.replace("⬇", "⬆");
    }
  });
});
