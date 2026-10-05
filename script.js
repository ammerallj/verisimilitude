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

  // Scroll reveals.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, [data-words]').forEach((el) => io.observe(el));

  // The thread between sections draws downward as you scroll. Height comes
  // from offsetHeight because scaleY changes the measured rect, not the layout.
  const links = [...document.querySelectorAll('.link')];
  let ticking = false;
  const drawLinks = () => {
    ticking = false;
    const vh = window.innerHeight;
    links.forEach((l) => {
      const top = l.getBoundingClientRect().top;
      const p = (vh * 0.9 - top) / (l.offsetHeight + vh * 0.2);
      l.style.transform = `scaleY(${Math.min(1, Math.max(0, p))})`;
    });
  };
  const requestDraw = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(drawLinks); }
  };
  window.addEventListener('scroll', requestDraw, { passive: true });
  window.addEventListener('resize', requestDraw);
  drawLinks();
})();
