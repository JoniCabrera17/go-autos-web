document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modalOverlay");
  const cerrar = document.getElementById("cerrarModal");

  const btnLogin = document.querySelectorAll(".btnLogin");
  const btnVender = document.querySelectorAll(".btnVender");

  function abrirModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function cerrarModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }

  btnLogin.forEach(btn => btn.addEventListener("click", abrirModal));
  btnVender.forEach(btn => btn.addEventListener("click", abrirModal));

  if (overlay) overlay.addEventListener("click", cerrarModal);
  if (cerrar) cerrar.addEventListener("click", cerrarModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
  });
});
