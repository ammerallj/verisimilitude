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
  body.classList.toggle("seeds-on", out > 0.3);
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

// The seeds blown out of the hero video keep floating around the whole site.
// They start thick near the top (where they left the dandelion), thin out down the
// page, and float on their own as well as with scroll. Touch one and it blows away.
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
  seed.style.top = `${Math.pow(Math.random(), 1.7) * 100}%`;
  seed.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
  seed.innerHTML = `<i>${seedSVG(size.toFixed(0), Math.round(Math.random() * 360))}</i>`;
  // Per-seed drift: depth sets how far it floats with scroll; the rest is idle motion.
  seed.drift = {
    depth: (Math.random() < 0.5 ? -1 : 1) * (0.15 + Math.random() * 0.3),
    phase: Math.random() * Math.PI * 2,
    sway: 60 + Math.random() * 90,
    spin: (Math.random() - 0.5) * 0.12,
    bob: 6 + Math.random() * 10,
    speed: 0.0004 + Math.random() * 0.0005,
  };
  // Easter egg: a seed blows away when touched, then drifts back in a few seconds later.
  const blow = () => {
    if (seed.classList.contains("blown")) return;
    seed.classList.add("blown");
    setTimeout(() => seed.classList.remove("blown"), 6000);
  };
  seed.addEventListener("pointerenter", blow);
  seed.addEventListener("pointerdown", blow);
  seedLayer.appendChild(seed);
}
document.body.prepend(seedLayer);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const drift = (now) => {
  requestAnimationFrame(drift);
  if (reduceMotion.matches) return;
  const y = window.scrollY;
  for (const seed of seedLayer.children) {
    const { depth, phase, sway, spin, bob, speed } = seed.drift;
    const dx = Math.sin(y * 0.004 + phase) * sway + Math.sin(now * speed + phase) * bob;
    const dy = y * depth + Math.cos(now * speed * 1.3 + phase) * bob;
    seed.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${(y * spin).toFixed(1)}deg)`;
  }
};
requestAnimationFrame(drift);

// Opening beat: the animation plays on its own first; the definition blurs in once the
// blowing has started. Change INTRO_DELAY to retime it (seconds after playback begins).
const INTRO_DELAY = 4500;
const heroVideo = document.querySelector(".hero video");
let introShown = false;
const showIntro = () => {
  if (introShown) return;
  introShown = true;
  body.classList.remove("intro-wait");
};
if (heroVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.scrollY < 50) {
  body.classList.add("intro-wait");
  heroVideo.addEventListener("playing", () => setTimeout(showIntro, INTRO_DELAY), { once: true });
  setTimeout(showIntro, INTRO_DELAY + 2500); // fallback if the video never starts
}

// Each section blurs and fades out as the next one nears the middle of the view, then the
// next blurs in, the same two-beat handover the landing uses.
const fadeSections = [document.querySelector(".work"), ...document.querySelectorAll(".sec")];
const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const contentTop = (el) => el.getBoundingClientRect().top + parseFloat(getComputedStyle(el).paddingTop);
const sectionProgress = (el) => {
  const vh = window.innerHeight;
  const top = contentTop(el);
  const maxScroll = document.documentElement.scrollHeight - vh;
  const reachable = top - (maxScroll - window.scrollY); // where its top lands at the page end
  const end = Math.max(vh * 0.35, reachable);
  return clamp((vh * 0.85 - top) / Math.max(vh * 0.85 - end, 1));
};
const fadeUpdate = () => {
  if (!motionOK) return;
  const prog = fadeSections.map(sectionProgress);
  fadeSections.forEach((el, i) => {
    const into = clamp((prog[i] - 0.55) / 0.45);
    const out = i + 1 < fadeSections.length ? clamp(prog[i + 1] / 0.45) : 0;
    const v = into * (1 - out);
    el.style.setProperty("--v", v.toFixed(3));
  });
};
fadeSections.forEach((el) => el.classList.add("fade-sec"));
window.addEventListener("scroll", fadeUpdate, { passive: true });
window.addEventListener("resize", fadeUpdate);
fadeUpdate();
