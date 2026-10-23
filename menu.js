// Phone menu: a full-page overlay that blurs and fades in and out (styles.css). Shared by the home and internship pages.
const menuRoot = document.documentElement;
const menuEl = document.getElementById("menu");
const openBtn = document.querySelector(".menu-open");
if (menuEl && openBtn) {
  // Choosing a section jumps there with no scrolling animation, so nothing scroll-driven plays on the way (the landing handover, card fades).
  // The page still reflows after a jump (the landing shrinks away), so for a few frames it re-measures the section and corrects, which makes it
  // always settle at the same place under the top bar:
  // the Studio statement 84px down, About 30% of the dandelion frame higher than flush, so the bulb sits just under the bar; Services leaves 80px of clear space above its green wash.
  const BAR = 56;
  // About: the dandelion frame is mostly empty space above the bulb, so it lands that much higher, bulb just under the bar and the text rising into view.
  const spot = (target) => {
    if (target.id === "from-the-studio") return { el: document.querySelector(".rail-b") || target, gap: 84 };
    if (target.id === "services") return { el: target.querySelector(".big-email") || target, gap: 224 };  // 80px of clear space between the top bar and the top of the green wash (the wash starts about 75px above the email)
    const loop = target.id === "about" && target.querySelector(".about-loop");
    return { el: target, gap: loop ? BAR - loop.getBoundingClientRect().height * 0.3 : BAR };
  };
  let glide = 0;
  const jumpTo = (target) => {
    cancelAnimationFrame(glide);
    const { el, gap } = spot(target);
    const stop = () => { cancelAnimationFrame(glide); ["wheel", "touchstart", "keydown"].forEach((t) => window.removeEventListener(t, stop)); };
    ["wheel", "touchstart", "keydown"].forEach((t) => window.addEventListener(t, stop, { passive: true }));
    let settled = 0, lastY = null, lastDy = 0;
    const step = () => {
      const end = document.documentElement.scrollHeight - window.innerHeight;
      const dy = el.getBoundingClientRect().top - gap;
      const atEnd = dy > 0 && window.scrollY >= end - 1;  // a section near the page end can only land as far as the page scrolls
      if (atEnd || Math.abs(dy) < 3) { if (++settled > 8) return stop(); glide = requestAnimationFrame(step); return; } settled = 0;  // within 3px is visually there; stay a few frames in case late layout moves it
      // The landing reflows with scroll position, so the section moves by more or less than the scroll itself. A secant step
      // learns that ratio from the last two measurements; the first step (and any odd ratio) assumes the section moves one for one with the scroll.
      let slope = -1;
      if (lastY !== null && window.scrollY !== lastY) { const s = (dy - lastDy) / (window.scrollY - lastY); if (s < -0.2 && s > -6) slope = s; }
      lastY = window.scrollY; lastDy = dy;
      const delta = (-dy / slope) * 0.9;  // a little short of the full step so it never overshoots
      window.scrollBy({ top: delta, behavior: "instant" });  // instant: the page's smooth-scroll style would animate it
      glide = requestAnimationFrame(step);
    };
    step();  // first correction right away, in the same frame as the tap
  };
  window.jumpToSection = jumpTo;  // script.js uses the same landing when you arrive from another page
  let savedY = 0;
  const setOpen = (on, refocus = true) => {
    if (on) savedY = window.scrollY;
    menuRoot.classList.toggle("menu-open", on);
    openBtn.setAttribute("aria-expanded", String(on));
    menuEl.inert = !on;  // closed: out of the tab order and hidden from screen readers
    openBtn.textContent = on ? "Close" : "Menu";  // the top bar stays put; its button toggles
    if (!on && refocus && menuEl.contains(document.activeElement)) openBtn.focus({ preventScroll: true });
  };
  setOpen(false);
  openBtn.addEventListener("click", () => setOpen(!menuRoot.classList.contains("menu-open")));
  menuEl.querySelectorAll("a").forEach((a) => a.addEventListener("click", (e) => {
    const url = new URL(a.href, location.href);
    const target = url.hash && url.pathname === location.pathname ? document.querySelector(url.hash) : null;
    if (!target) { setOpen(false); return; }  // another page: just follow the link
    // Same page: close first, put the page back where it was (unlocking scroll can reset it on phones), then jump while the menu is still fading out.
    e.preventDefault();
    setOpen(false, false);  // no focus ring jumping back to the Menu button after a tap
    window.scrollTo(0, savedY);
    jumpTo(target);
  }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menuRoot.classList.contains("menu-open")) setOpen(false); });
  window.matchMedia("(max-width: 900px)").addEventListener("change", (e) => { if (!e.matches) setOpen(false); });
}
