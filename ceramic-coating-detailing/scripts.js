/* ======================================================================
   RODEO WERKZ — Ceramic Coating & Detailing — interactions
   ====================================================================== */
(function () {
  'use strict';

  /* ---------- Sticky header condense ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count up stats ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io2.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); });
  }

  /* ---------- Video autoplay kick (hero + CTA) ---------- */
  var vids = document.querySelectorAll('.hero video, .finalcta video');
  vids.forEach(function (heroVideo) {
    var kick = function () {
      heroVideo.muted = true;
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    };
    heroVideo.load();
    kick();
    heroVideo.addEventListener('canplay', kick, { once: true });
    window.addEventListener('load', kick, { once: true });
    var once = function () { kick(); window.removeEventListener('pointerdown', once); window.removeEventListener('scroll', once); };
    window.addEventListener('pointerdown', once, { passive: true });
    window.addEventListener('scroll', once, { passive: true });
  });

  /* ---------- Hero parallax ---------- */
  var heroImg = document.querySelector('.hero__media img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = 'scale(1.08) translateY(' + (y * 0.18) + 'px)';
      }
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
  // open first FAQ by default
  if (faqItems.length) {
    faqItems[0].classList.add('open');
    var firstA = faqItems[0].querySelector('.faq-a');
    window.addEventListener('load', function () { firstA.style.maxHeight = firstA.scrollHeight + 'px'; });
  }

  /* ---------- Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
