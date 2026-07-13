// =========================================================
// SCRIPT PROPIO - Catálogo Fotográfico ODS UCV
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Catálogo ODS UCV cargado correctamente ✅");

  // Ejemplo: animación simple de aparición al hacer scroll
  const secciones = document.querySelectorAll("section, main > div");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("opacity-0");
        }
      });
    },
    { threshold: 0.1 }
  );

  secciones.forEach((seccion) => observer.observe(seccion));
});
