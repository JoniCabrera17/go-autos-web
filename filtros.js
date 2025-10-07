document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".filter-toggle");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const parent = toggle.parentElement;
      parent.classList.toggle("open");
    });
  });
});
