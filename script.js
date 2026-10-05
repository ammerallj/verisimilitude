(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero: split the word into letters so each can blur in on its own.
  const heroWord = document.querySelector('.hero h1');
  const letters = heroWord.textContent.trim();
  heroWord.setAttribute('aria-label', letters);
  heroWord.textContent = '';
  [...letters].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.setAttribute('aria-hidden', 'true');
    s.style.setProperty('--i', i);
    s.textContent = c;
    heroWord.appendChild(s);
  });
  heroWord.classList.add('split');

  // Statements: wrap each word so the text can fade in word by word.
  // Walks child nodes so italic words keep their <i> wrapper.
  const splitWords = (el) => {
    let n = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.style.setProperty('--i', Math.min(n++, 24));
            w.textContent = tok;
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    };
    walk(el);
  };
  document.querySelectorAll('[data-words]').forEach(splitWords);

  // Stacked scroll: a section taller than the viewport pins by its bottom
  // edge, so top goes negative by the amount it overflows.
  const fields = [...document.querySelectorAll('.field')];
  const setStick = () => {
    fields.forEach((f) => {
      const over = Math.min(0, window.innerHeight - f.offsetHeight);
      f.style.setProperty('--stick', over + 'px');
    });
  };
  if (!reduced) {
    setStick();
    window.addEventListener('resize', setStick);
    window.addEventListener('load', setStick);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setStick);
  }

  // The fixed header adapts to whatever section is visually under it. Sections
  // stack (later ones paint over earlier pinned ones), so the one on top at the
  // header's height is the LAST section whose box contains that point. Dark
  // sections are marked data-header="light" and get Paper-colored nav text.
  const header = document.querySelector('.site-header');
  const allFields = [...document.querySelectorAll('.field')];
  let headerTicking = false;
  const updateHeader = () => {
    headerTicking = false;
    const y = Math.min(28, header.offsetHeight / 2);
    let top = null;
    allFields.forEach((f) => {
      const r = f.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) top = f;
    });
    header.classList.toggle('light', !!top && top.dataset.header === 'light');
  };
  const requestHeader = () => {
    if (!headerTicking) { headerTicking = true; requestAnimationFrame(updateHeader); }
  };
  window.addEventListener('scroll', requestHeader, { passive: true });
  window.addEventListener('resize', requestHeader);
  updateHeader();

  const hero = document.querySelector('.hero');
  const showHero = () => {
    hero.classList.add('is-in');
    // Navigation and the scroll cue arrive once the word has settled.
    setTimeout(() => root.classList.add('ready'), reduced ? 0 : 2800);
  };

  if (reduced) {
    showHero();
    return;
  }

  // Wait for fonts so the blur-in doesn't start on a fallback face.
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
    .then(() => requestAnimationFrame(showHero));

  // Work carousel: duplicate the row so it can loop end to start without a
  // jump, scale the duration to the row's width, and offer a pause control.
  const track = document.querySelector('.track');
  const carousel = document.querySelector('.carousel');
  const toggle = document.querySelector('.carousel-toggle');
  const originals = [...track.children];
  originals.forEach((item) => {
    const copy = item.cloneNode(true);
    copy.classList.add('clone');
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
  });
  const setDuration = () => {
    const width = originals.reduce((sum, item) =>
      sum + item.getBoundingClientRect().width + parseFloat(getComputedStyle(item).marginRight), 0);
    track.style.setProperty('--dur', Math.max(20, width / 55) + 's');
  };
  setDuration();
  window.addEventListener('resize', setDuration);
  toggle.addEventListener('click', () => {
    const paused = carousel.classList.toggle('paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Play' : 'Pause';
  });

  // When a section snaps into place (its top edge is within the upper 60% of
  // the screen), its content fades and blurs in on a timer. The reveal does
  // not depend on finishing the scroll, and it plays once.
  document.querySelectorAll('.field:not(.hero)').forEach((f) => {
    // Stagger in reading order: label, statement words, then blocks.
    [...f.querySelectorAll('.reveal, .w')].forEach((u, i) => {
      u.style.setProperty('--d', Math.min(i * 45, 1600) + 'ms');
    });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -40% 0px', threshold: 0 });
  document.querySelectorAll('.field:not(.hero)').forEach((f) => io.observe(f));
})();
