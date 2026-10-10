// Scroll hands the fixed left rail over in two beats: the definition blurs and
// fades out first, then the studio intro blurs and fades in. They never overlap.
const root = document.documentElement;
const body = document.body;
const work = document.querySelector(".work");
const clamp = (n) => Math.min(1, Math.max(0, n));
const update = () => {
  const vh = window.innerHeight;
  // Progress follows the work section: it starts as the first image enters the
  // lower part of the view and finishes as that image nears the vertical centre.
  const top = work.getBoundingClientRect().top;
  const p = clamp((vh * 0.9 - top) / (vh * 0.5));
  const out = clamp(p / 0.45);
  const into = clamp((p - 0.55) / 0.45);
  root.style.setProperty("--out", out.toFixed(3));
  root.style.setProperty("--in", into.toFixed(3));
  body.classList.toggle("rail-on", into > 0.5);
};
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
update();

// Mark the nav link for the section currently on screen.
const links = [...document.querySelectorAll(".nav a[data-sec]")];
const sections = [...document.querySelectorAll(".sec")];
const markCurrent = () => {
  const mid = window.innerHeight * 0.5;
  const current = sections.filter((s) => s.getBoundingClientRect().top <= mid).pop();
  links.forEach((a) => {
    const on = current && a.dataset.sec === current.dataset.sec;
    a.classList.toggle("current", !!on);
    on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
  });
};
window.addEventListener("scroll", markCurrent, { passive: true });
window.addEventListener("resize", markCurrent);
markCurrent();

// Scatter dandelion seeds at random across the whole page, behind the content.
const SEED_COLOR = "#B5CBDB";
const seedSVG = (size, rotate) => `
  <svg width="${size}" viewBox="0 0 33.3098 38.0437" fill="none"
       style="overflow:visible;transform:rotate(${rotate}deg)" aria-hidden="true">
    <g stroke="${SEED_COLOR}" stroke-width="2">
      <path d="M32.4438 8.63243L16.2719 36.643"/>
      <path d="M0.866026 8.63243L17.0379 36.643"/>
      <path d="M13.0637 0.114624L17.2653 36.5284"/>
    </g>
    <circle cx="16.9721" cy="35.9428" r="2.10079" fill="${SEED_COLOR}"/>
  </svg>`;
const seedLayer = document.createElement("div");
seedLayer.className = "seeds";
seedLayer.setAttribute("aria-hidden", "true");
const SEED_COUNT = 14;
for (let i = 0; i < SEED_COUNT; i++) {
  const seed = document.createElement("span");
  const size = 10 + Math.random() * 18;
  seed.style.left = `${Math.random() * 100}%`;
  seed.style.top = `${Math.random() * 100}%`;
  seed.style.opacity = (0.35 + Math.random() * 0.65).toFixed(2);
  seed.innerHTML = seedSVG(size.toFixed(0), Math.round(Math.random() * 360));
  // Per-seed drift: a depth that sets how far it floats, plus a sway phase and reach.
  seed.drift = {
    depth: 0.03 + Math.random() * 0.12,
    phase: Math.random() * Math.PI * 2,
    sway: 20 + Math.random() * 50,
  };
  seedLayer.appendChild(seed);
}
document.body.prepend(seedLayer);

// Seeds float slowly down and side to side as you scroll.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let driftQueued = false;
const drift = () => {
  driftQueued = false;
  if (reduceMotion.matches) return;
  const y = window.scrollY;
  for (const seed of seedLayer.children) {
    const { depth, phase, sway } = seed.drift;
    const dx = Math.sin(y * 0.0025 + phase) * sway;
    seed.style.transform = `translate3d(${dx.toFixed(1)}px, ${(y * depth).toFixed(1)}px, 0)`;
  }
};
window.addEventListener("scroll", () => {
  if (!driftQueued) { driftQueued = true; requestAnimationFrame(drift); }
}, { passive: true });
drift();
