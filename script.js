(() => {
  'use strict';

  /* ------------------------------------------------------------------
     1. Build the pixel-square ring that frames the hero lens emblem.
        Squares are generated on a 5x5 grid border (16 cells) — an
        homage to the checkerboard frame in the brand mark — then
        animated inward from scattered positions on load.
  ------------------------------------------------------------------ */
  function buildSquareRing() {
    const group = document.getElementById('squareRing');
    if (!group) return;

    const cell = 64;
    const start = 40;
    const size = 40;
    const palette = ['#f6f4f9', '#8b2fb0', '#c026e0'];
    const positions = [];

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const isBorder = i === 0 || i === 4 || j === 0 || j === 4;
        if (!isBorder) continue;
        positions.push({ i, j });
      }
    }

    positions.forEach((pos, index) => {
      const cx = start + pos.i * cell + cell / 2;
      const cy = start + pos.j * cell + cell / 2;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', size);
      rect.setAttribute('height', size);
      rect.setAttribute('rx', 7);
      rect.setAttribute('x', cx - size / 2);
      rect.setAttribute('y', cy - size / 2);

      // color: mostly light squares, purple/magenta accents at the four corners
      const isCorner = (pos.i === 0 || pos.i === 4) && (pos.j === 0 || pos.j === 4);
      const fill = isCorner ? palette[2] : (index % 3 === 0 ? palette[1] : palette[0]);
      rect.setAttribute('fill', fill);

      // scattered starting point for the "assembly" animation
      const angle = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 90;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const rot = (Math.random() - 0.5) * 220;

      rect.style.transformOrigin = `${cx}px ${cy}px`;
      rect.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.3)`;
      rect.style.opacity = '0';
      rect.style.transition = `transform 0.9s cubic-bezier(.16,.84,.44,1) ${index * 45}ms, opacity 0.6s ease ${index * 45}ms`;

      group.appendChild(rect);

      // trigger the settle animation next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rect.style.transform = 'translate(0,0) rotate(0deg) scale(1)';
          rect.style.opacity = '1';
        });
      });
    });

    // fade the central lens emblem in after the squares mostly settle
    const emblem = document.querySelector('.lens-emblem');
    if (emblem) {
      emblem.style.opacity = '0';
      emblem.style.transform = 'scale(0.7)';
      emblem.style.transformOrigin = '200px 200px';
      emblem.style.transition = 'opacity 0.7s ease 0.8s, transform 0.7s cubic-bezier(.16,.84,.44,1) 0.8s';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          emblem.style.opacity = '1';
          emblem.style.transform = 'scale(1)';
        });
      });
    }
  }

  /* ------------------------------------------------------------------
     2. Header state on scroll
  ------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     3. Scroll-triggered reveal for sections
  ------------------------------------------------------------------ */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     4. Mobile menu toggle (simple nav reveal for small screens)
  ------------------------------------------------------------------ */
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav-links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.style.display === 'flex';
      nav.style.display = isOpen ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'rgba(10,9,18,0.97)';
      nav.style.padding = '20px 28px';
      nav.style.borderBottom = '1px solid rgba(198,178,224,0.14)';
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 980) nav.style.display = 'none';
      });
    });
  }

  /* ------------------------------------------------------------------
     5. Footer year
  ------------------------------------------------------------------ */
  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildSquareRing();
    initHeaderScroll();
    initReveal();
    initMobileMenu();
    setYear();
  });
})();
