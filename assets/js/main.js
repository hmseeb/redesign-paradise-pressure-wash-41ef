/* =========================================================
   Paradise Pressure Washing — interactions
   Vanilla JS, no dependencies, no external calls.
   ========================================================= */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  /* ---------------------------------------------------
     1. Mobile navigation
     --------------------------------------------------- */
  var burger = doc.getElementById('burger');
  var nav = doc.getElementById('nav');

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    body.classList.remove('nav-open');
  }

  function openNav() {
    if (!nav || !burger) return;
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    body.classList.add('nav-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) { closeNav(); } else { openNav(); }
    });

    // Close when a link inside the panel is used
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Close on Escape
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        burger.focus();
      }
    });

    // Close when clicking the dimmed backdrop
    doc.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeNav();
    });

    // Reset when resizing back up to desktop
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 860) closeNav();
      }, 150);
    });
  }

  /* ---------------------------------------------------
     2. Sticky header shadow
     --------------------------------------------------- */
  var header = doc.getElementById('header');
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 12);
    highlightNav();
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ---------------------------------------------------
     3. Active section highlighting
     --------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#' || id === '#') return null;
      var el = doc.querySelector(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  function highlightNav() {
    if (!sections.length) return;
    var pos = window.scrollY + 140;
    var current = null;

    sections.forEach(function (s) {
      if (s.el.offsetTop <= pos) current = s;
    });

    navLinks.forEach(function (l) { l.classList.remove('is-active'); });
    if (current) current.link.classList.add('is-active');
  }

  /* ---------------------------------------------------
     4. Scroll reveal
     --------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!revealItems.length) {
    /* nothing to do */
  } else if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        // Stagger siblings within the same group for a nicer cascade
        var parent = el.parentElement;
        var group = parent ? Array.prototype.filter.call(parent.children, function (c) {
          return c.classList && c.classList.contains('reveal');
        }) : [];
        var index = group.indexOf(el);
        var delay = index > 0 ? Math.min(index, 6) * 80 : 0;

        el.style.setProperty('--d', delay + 'ms');
        el.classList.add('is-in');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------
     5. Smooth scroll for in-page anchors
     --------------------------------------------------- */
  doc.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = doc.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 96;

    window.scrollTo({
      top: top < 0 ? 0 : top,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });

    if (history.replaceState) history.replaceState(null, '', hash);
  });

  /* ---------------------------------------------------
     6. Quote form -> pre-filled mailto (no external API)
     --------------------------------------------------- */
  var form = doc.getElementById('quoteForm');
  var note = doc.getElementById('formNote');
  var EMAIL = 'JC@Paradise-Pressure-Washing.com';

  function setNote(msg, kind) {
    if (!note) return;
    note.textContent = msg;
    note.className = 'form__note' + (kind ? ' is-' + kind : '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var email = form.elements.email.value.trim();
      var service = form.elements.service.value;
      var message = form.elements.message.value.trim();

      var missing = [];
      [['name', name], ['phone', phone]].forEach(function (pair) {
        var field = form.elements[pair[0]];
        if (!pair[1]) {
          missing.push(pair[0]);
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (missing.length) {
        setNote('Please add your name and phone number so we can reach you.', 'err');
        form.elements[missing[0]].focus();
        return;
      }

      var lines = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + (email || 'not provided'),
        'Service needed: ' + service,
        '',
        'About the property:',
        message || '(no details added)'
      ];

      var subject = 'Free quote request — ' + service + ' — ' + name;
      var href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = href;
      setNote('Opening your email app with the request ready to send…', 'ok');
    });

    // Clear the invalid state as the visitor types
    form.addEventListener('input', function (e) {
      if (e.target.classList && e.target.classList.contains('is-invalid')) {
        e.target.classList.remove('is-invalid');
      }
    });
  }

  /* ---------------------------------------------------
     7. Footer year
     --------------------------------------------------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------
     8. Graceful image fallback
        If a remote photo fails, hide its frame rather than
        showing a broken-image icon.
     --------------------------------------------------- */
  Array.prototype.forEach.call(doc.images, function (img) {
    img.addEventListener('error', function () {
      var fig = img.closest('figure');
      if (fig) { fig.style.display = 'none'; } else { img.style.display = 'none'; }
    });
  });

  /* Initial paint */
  onScroll();
})();
