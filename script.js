// Hand the fixed left rail over from the definition to the studio intro as you scroll.
const root = document.documentElement;
const body = document.body;
const clamp = (n) => Math.min(1, Math.max(0, n));
const update = () => {
  const vh = window.innerHeight;
  const p = clamp((window.scrollY - vh * 0.1) / (vh * 0.5));
  root.style.setProperty("--p", p.toFixed(3));
  body.classList.toggle("rail-on", p > 0.7);
};
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
update();
