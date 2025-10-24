document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modalOverlay");
  const cerrar = document.getElementById("cerrarModal");

  const btnLogin = document.querySelectorAll(".btnLogin");
  const btnVender = document.querySelectorAll(".btnVender");

  // === ABRIR Y CERRAR MODAL ===
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

  // === 🟢 VALIDACIÓN DE LOGIN ===
  const form = document.getElementById("formLogin");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!usuario || !password) {
        alert("Por favor, completá ambos campos.");
        return;
      }

      try {
        const response = await fetch("api/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        if (data.success) {
          alert(`Bienvenido, ${data.nombre || 'usuario'} 👋`);
          cerrarModal();

          // Redirige al panel de administración
          window.location.href = "admin/panel.html";
        } else {
          alert(data.error || "Usuario o contraseña incorrectos.");
        }
      } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        alert("Hubo un problema con la conexión al servidor.");
      }
    });
  }
});
