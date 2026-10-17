// Scroll hands the fixed left rail over in two beats: the definition blurs and
// fades out first, then the studio intro blurs and fades in. They never overlap.
const root = document.documentElement;
const body = document.body;
const work = document.querySelector(".work");
const clamp = (n) => Math.min(1, Math.max(0, n));
const railBEl = document.querySelector(".rail-b");
const lockupEl = document.querySelector(".rail-a");
const heroVideoEl = document.querySelector(".hero video");
let workP = 0;
const update = () => {
  const vh = window.innerHeight;
  // Progress follows the work section: it starts as the first image enters the
  // lower part of the view and finishes as that image nears the vertical centre.
  let p;
  if (window.matchMedia("(max-width: 900px)").matches) {
    p = clamp((vh * 0.9 - work.getBoundingClientRect().top) / (vh * 0.5));
  } else {
    // Desktop: both beats are paced to the first frame, finishing exactly as it reaches the vertical centre.
    const c = work.querySelector(".w").getBoundingClientRect();
    const centerTop = vh / 2 - c.height / 2;
    p = clamp((vh * 0.95 - c.top) / Math.max(vh * 0.95 - centerTop, 1));
  }
  workP = p;
  const out = clamp(p / 0.45);
  const into = clamp((p - 0.55) / 0.45);
  root.style.setProperty("--out", out.toFixed(3));
  root.style.setProperty("--in", into.toFixed(3));
  body.classList.toggle("rail-on", into > 0.5);
  body.classList.toggle("seeds-on", out > 0.3);
  // Phone hero: how far the hero's empty lower part has shrunk (0 at the top, 1 after a full screen of scrolling, eased).
  const heroT = clamp(window.scrollY / vh);               // closes over a full screen of scrolling
  root.style.setProperty("--hero-p", (heroT * heroT * (3 - 2 * heroT)).toFixed(3));  // eased: gentle start, gentle finish
  root.style.setProperty("--cue-o", (1 - clamp(window.scrollY / (vh * 0.22))).toFixed(3)); // "Scroll down" is gone after ~180px
  // Phone hero: each lockup line, and the hero art, blurs and fades as it reaches a set height on the
  // screen: it starts when the element's bottom edge rises to 30% down the screen and is fully gone by 10%.
  const lockupKids = lockupEl ? [...lockupEl.children] : [];
  const topFade = (bottom) => clamp((vh * 0.30 - bottom) / (vh * 0.20));
  if (window.matchMedia("(max-width: 900px)").matches) {
    lockupKids.forEach((el) => {
      const g = topFade(el.getBoundingClientRect().bottom);
      el.style.setProperty("--lb", `${(g * 12).toFixed(1)}px`);
      el.style.setProperty("--lo", (1 - g).toFixed(3));
    });
    const art = heroVideoEl.getBoundingClientRect();
    const artBottom = lockupKids.length ? lockupKids[0].getBoundingClientRect().top - 20 : art.bottom;  // the art ends where the lockup begins
    const ga = topFade(artBottom);
    heroVideoEl.style.setProperty("--vb", `${(ga * 14).toFixed(1)}px`);
    heroVideoEl.style.setProperty("--vo", (1 - ga).toFixed(3));
  } else {
    lockupKids.forEach((el) => { el.style.removeProperty("--lb"); el.style.removeProperty("--lo"); });
    heroVideoEl.style.removeProperty("--vb");
    heroVideoEl.style.removeProperty("--vo");
  }
  // Phone watercolour wash: it sits behind the scroll cue, stretches up a little as you start to scroll and
  // fades out before the text block arrives, so the "Design studio" lockup is on plain white.
  const washP = clamp(window.scrollY / (vh * 0.4));
  root.style.setProperty("--wash-s", (1 + 0.55 * washP).toFixed(3));
  root.style.setProperty("--wash", "0");
  root.style.setProperty("--wash-o", (1 - washP).toFixed(3));
  body.classList.toggle("topbar-on", railBEl.getBoundingClientRect().top < vh * 0.5); // phone top bar: arrives with the "Design studio" text
};
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
update();

// Mark the nav link for the section currently on screen.
const links = [...document.querySelectorAll(".nav a[data-sec], .topbar a[data-sec]")];
const sections = [work, ...document.querySelectorAll(".sec")];
const markCurrent = () => {
  const mid = window.innerHeight * 0.5;
  const current = sections.filter((s) => s.getBoundingClientRect().top <= mid).pop();
  links.forEach((a) => {
    const on = current && a.dataset.sec === current.dataset.sec;
    a.classList.toggle("current", !!on);
    on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
  });
};
// Nav links land their section centred in the viewport (the first work card, for "From the Studio").
if (!window.matchMedia("(max-width: 900px)").matches) {
  links.forEach((a) => a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    let top, bottom, lift = 0;
    if (target === work) {
      const r = work.querySelector(".w").getBoundingClientRect();
      top = r.top; bottom = r.bottom;
    } else {
      const r = target.getBoundingClientRect();
      top = r.top + parseFloat(getComputedStyle(target).paddingTop); bottom = r.bottom;
      const art = target.querySelector(".about-loop");  // the scaled dandelion reaches above its box
      if (art) { top = Math.min(top, art.getBoundingClientRect().top); lift = 60; }  // lands a bit above centre
    }
    const y = window.scrollY + (top + bottom) / 2 - window.innerHeight / 2 + lift;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }));
}
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
const SEED_COUNT = 16;
for (let i = 0; i < SEED_COUNT; i++) {
  const seed = document.createElement("span");
  const size = 10 + Math.random() * 18;
  seed.style.left = `${Math.random() * 100}%`;
  // A handful cluster near the top (just blown from the hero); the rest are spread evenly
  // down the page so the bottom of the site has seeds too.
  const frac = i < 5 ? Math.random() * 0.22 : 0.22 + ((i - 5 + Math.random()) / (SEED_COUNT - 5)) * 0.78;
  seed.frac = frac;
  seed.style.top = `${(frac * 100).toFixed(2)}%`;
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
  const layerH = seedLayer.offsetHeight;
  for (const seed of seedLayer.children) {
    const { depth, phase, sway, spin, bob, speed } = seed.drift;
    // Drift is measured from the scroll position where the seed sits mid-screen, so every
    // seed floats around its own spot on the page and stays near it.
    const home = seed.frac * layerH - window.innerHeight / 2;
    const dx = Math.sin((y - home) * 0.004 + phase) * sway + Math.sin(now * speed + phase) * bob;
    const dy = (y - home) * depth + Math.cos(now * speed * 1.3 + phase) * bob;
    seed.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${((y - home) * spin).toFixed(1)}deg)`;
  }
};
requestAnimationFrame(drift);

// Opening beat: the animation plays on its own first; the definition blurs in once the
// blowing is under way. INTRO_AT is a position in the video, so buffering can't make it early.
const INTRO_AT = 1.5; // seconds into the video; the seeds start to leave the dandelion shortly after (~2.5s)
const INTRO_LOCK_AFTER = 1200; // scrolling stays locked until the text is mostly in
const heroVideo = document.querySelector(".hero video");
let introShown = false;
const unlockScroll = () => root.classList.remove("scroll-lock");
const showIntro = () => {
  if (introShown) return;
  introShown = true;
  body.classList.remove("intro-wait");
  body.classList.add("intro-play");
  setTimeout(unlockScroll, INTRO_LOCK_AFTER);
  setTimeout(() => body.classList.remove("intro-play"), 2600);
};
// The page ships with the text hidden and scroll locked (no flash). Skip the beat when the
// page opens scrolled down or the person prefers reduced motion.
if (!heroVideo || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.scrollY >= 50) {
  body.classList.remove("intro-wait");
  unlockScroll();
} else {
  const watchBlow = () => {
    if (introShown) return;
    if (heroVideo.currentTime >= INTRO_AT) showIntro();
    else requestAnimationFrame(watchBlow);
  };
  heroVideo.addEventListener("playing", watchBlow, { once: true });
  setTimeout(showIntro, 6000); // fallback if the video never plays
}

// Only the work section blurs and fades in (the landing handover); it and the sections after it stay put.
const fadeSections = [document.querySelector(".work")];
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
  if (window.matchMedia("(max-width: 900px)").matches) {
    // Phones: the cards fade and blur on their own near the top of the screen, so the work section is
    // never faded as a whole, and About and Services come in piece by piece (see the stagger code below).
    const vh = window.innerHeight;
    fadeSections.forEach((el) => {
      const v = 1;
      el.style.setProperty("--v", v.toFixed(3));
    });
    return;
  }
  const prog = fadeSections.map(sectionProgress);
  fadeSections.forEach((el, i) => {
    // the work section blurs in on the same beat as the studio intro
    const into = clamp(((i === 0 ? workP : prog[i]) - 0.55) / 0.45);
    const out = i + 1 < fadeSections.length ? clamp(prog[i + 1] / 0.45) : 0;
    const v = into * (1 - out);
    el.style.setProperty("--v", v.toFixed(3));
  });
};
fadeSections.forEach((el) => el.classList.add("fade-sec"));
window.addEventListener("scroll", fadeUpdate, { passive: true });
window.addEventListener("resize", fadeUpdate);
fadeUpdate();

// Phone hero: tell the CSS how tall the text lockup is so the animation + lockup group can be centred.
const setLockupHeight = () => root.style.setProperty("--lh", `${lockupEl.offsetHeight}px`);
setLockupHeight();
window.addEventListener("resize", setLockupHeight);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(setLockupHeight);

// Phone work carousel: a round button on each card opens its description over a blurred image,
// and the cards ease in and out of scale and opacity as they pass the middle of the screen.
const mobileMQ = window.matchMedia("(max-width: 900px)");
const workCards = [...document.querySelectorAll(".work .w")];
const ARROW = '<svg class="ic-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 13L13 5M6 5h7v7"/></svg>';
const CLOSE = '<svg class="ic-close" viewBox="0 0 18 18" aria-hidden="true"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9"/></svg>';
const closeCards = () => workCards.forEach((card) => {
  card.classList.remove("open");
  const b = card.querySelector(".work-toggle");
  if (b) { b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", `About ${card.querySelector("strong").textContent}`); }
});
workCards.forEach((card) => {
  const title = card.querySelector("strong").textContent;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "work-toggle";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-label", `About ${title}`);
  btn.innerHTML = ARROW + CLOSE;
  btn.addEventListener("click", () => {
    const willOpen = !card.classList.contains("open");
    closeCards();
    if (willOpen) {
      card.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", `Close ${title} details`);
    }
  });
  card.appendChild(btn);
});
// (Phone cards no longer scale, blur or fade on scroll, and About and Services no longer blur in:
// the only scroll fade on phones is the hero handing over to the studio work.)
window.addEventListener("resize", () => { if (!mobileMQ.matches) closeCards(); });


// Phone contact line: size the email so it fills the column on a single line, however wide the screen.
const bigEmail = document.querySelector(".big-email");
const fitEmail = () => {
  if (!bigEmail) return;
  if (!mobileMQ.matches) { bigEmail.style.removeProperty("font-size"); return; }
  bigEmail.style.fontSize = "100px";                 // measure at a known size, then scale to the column
  const natural = bigEmail.scrollWidth;
  const room = bigEmail.parentElement.clientWidth;
  bigEmail.style.fontSize = `${Math.floor((100 * room / natural) * 0.995 * 10) / 10}px`;
};
fitEmail();
window.addEventListener("resize", fitEmail);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitEmail);

// Phone Services screen: the section is sized to the viewport minus the footer, so tell the CSS how tall
// the footer (with its bottom margin) is.
const footEl = document.querySelector(".foot");
const setFootHeight = () => {
  if (!footEl) return;
  const cs = getComputedStyle(footEl);
  root.style.setProperty("--foot-h", `${Math.round(footEl.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom))}px`);
};
setFootHeight();
window.addEventListener("resize", setFootHeight);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(setFootHeight);

// Cards with a video (AfterMath, Genius Academy): the still loads with the page; the video is fetched once the
// page has loaded and plays while the card is hovered (desktop) or fully in view (phones), rewinding when it stops.
document.querySelectorAll(".work .w").forEach((card) => {
  const vid = card.querySelector("video.play");
  if (!vid) return;
  let ready = false, want = false;
  const sync = () => {
    const on = ready && want;
    card.classList.toggle("playing", on);
    if (on) vid.play().catch(() => {});
    else { vid.pause(); vid.currentTime = 0; }
  };
  const load = () => { vid.addEventListener("canplaythrough", () => { ready = true; sync(); }, { once: true }); vid.preload = "auto"; vid.load(); };
  if (document.readyState === "complete") load(); else window.addEventListener("load", load, { once: true });
  const set = (v) => { want = v && motionOK; sync(); };
  card.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && !mobileMQ.matches) set(true); });
  card.addEventListener("pointerleave", () => { if (!mobileMQ.matches) set(false); });
  card.addEventListener("focus", () => { if (!mobileMQ.matches) set(true); });
  card.addEventListener("blur", () => { if (!mobileMQ.matches) set(false); });
  new IntersectionObserver(([en]) => { if (mobileMQ.matches) set(en.isIntersecting); }, { threshold: 0.98 }).observe(card);
  mobileMQ.addEventListener("change", () => set(false));
});
