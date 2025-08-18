// file: assets/js/main.js
(function () {
  function init() {
    // Smooth scroll
    try { new SweetScroll({}); } catch (e) {}

    // If the container isn't there (e.g., on some pages), bail
    var el = document.getElementById('particles-js');
    if (!el) return;

    // Destroy any previous particles instance (prevents stacking on SPA nav)
    if (window.pJSDom && window.pJSDom.length) {
      try { window.pJSDom.forEach(p => p.pJS && p.pJS.fn.vendors.destroypJS()); } catch (e) {}
      window.pJSDom = [];
    }

    // Your Particle config (paste the same config you used in the template)
    particlesJS("particles-js", {
      particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 4, random: true, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onclick: { enable: true, mode: "push" }, resize: true },
        modes: { push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // First page load
  document.addEventListener('DOMContentLoaded', init, false);

  // Re-run after Hydejack pushState navigations
  var ps = document.getElementById('_pushState');
  if (ps) ps.addEventListener('hy-push-state-load', init);
})();
