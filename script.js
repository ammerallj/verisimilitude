// Scroll hands the fixed left rail over in two beats: the definition blurs and
// fades out first, then the studio intro blurs and fades in. They never overlap.
const root = document.documentElement;
const body = document.body;
const clamp = (n) => Math.min(1, Math.max(0, n));
const update = () => {
  const vh = window.innerHeight;
  const p = clamp((window.scrollY - vh * 0.05) / (vh * 0.55));
  const out = clamp(p / 0.45);
  const into = clamp((p - 0.55) / 0.45);
  root.style.setProperty("--out", out.toFixed(3));
  root.style.setProperty("--in", into.toFixed(3));
  body.classList.toggle("rail-on", into > 0.5);
};
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
update();
