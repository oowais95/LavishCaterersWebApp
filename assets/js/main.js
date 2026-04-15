// // main.js - interactions: nav toggle, smooth scroll, parallax, lightbox, modal

// document.addEventListener('DOMContentLoaded', function () {
//     // year in footer
//     const y = new Date().getFullYear();
//     const yearEl = document.getElementById('year');
//     if (yearEl) yearEl.textContent = y;
  
//     // NAV TOGGLE (mobile)
//     const navToggle = document.getElementById('navToggle');
//     const mainNav = document.getElementById('mainNav');
//     navToggle && navToggle.addEventListener('click', () => {
//       mainNav.classList.toggle('open');
//     });
  
//     // smooth scroll for nav links
//     document.querySelectorAll('a.nav-link, .brand, .hero-cta .btn, .contact-link').forEach(el => {
//       el.addEventListener('click', function (e) {
//         const href = this.getAttribute('href');
//         if (!href || !href.startsWith('#')) return;
//         e.preventDefault();
//         const target = document.querySelector(href);
//         if (target) {
//           window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
//           mainNav.classList.remove('open');
//         }
//       });
//     });
  
//     // floating book/open contact modal
//     const bookFloat = document.getElementById('bookFloat');
//     const contactModal = document.getElementById('contactModal');
//     const modalClose = document.getElementById('modalClose');
//     const openContact = document.getElementById('openContact');
//     const ctaBook = document.getElementById('ctaBook');
//     [bookFloat, openContact, ctaBook].forEach(btn => {
//       if (!btn) return;
//       btn.addEventListener('click', (e) => {
//         e.preventDefault();
//         contactModal.style.display = 'flex';
//         contactModal.setAttribute('aria-hidden', 'false');
//       });
//     });
//     modalClose && modalClose.addEventListener('click', () => {
//       contactModal.style.display = 'none';
//       contactModal.setAttribute('aria-hidden', 'true');
//     });
//     contactModal && contactModal.addEventListener('click', (ev) => {
//       if (ev.target === contactModal) {
//         contactModal.style.display = 'none';
//         contactModal.setAttribute('aria-hidden', 'true');
//       }
//     });
  
//     // lightbox gallery
//     const lightbox = document.getElementById('lightbox');
//     const lightboxImg = document.getElementById('lightboxImg');
//     const lightboxClose = document.getElementById('lightboxClose');
  
//     document.querySelectorAll('.gallery-grid img').forEach(img => {
//       img.addEventListener('click', () => {
//         lightboxImg.src = img.src;
//         lightbox.style.display = 'flex';
//         lightbox.setAttribute('aria-hidden', 'false');
//       });
//     });
//     lightboxClose && lightboxClose.addEventListener('click', () => {
//       lightbox.style.display = 'none';
//       lightbox.setAttribute('aria-hidden', 'true');
//     });
//     lightbox.addEventListener('click', (ev) => {
//       if (ev.target === lightbox) {
//         lightbox.style.display = 'none';
//         lightbox.setAttribute('aria-hidden', 'true');
//       }
//     });
  
//     // parallax effect for elements with data-parallax or data-parallax-bg
//     const parallaxEls = document.querySelectorAll('[data-parallax]');
//     const parallaxBgEls = document.querySelectorAll('[data-parallax-bg]');
  
//     function onScrollParallax() {
//       const scrolled = window.pageYOffset;
//       parallaxEls.forEach(el => {
//         // background moves slower
//         el.style.backgroundPosition = `center ${-scrolled * 0.2}px`;
//       });
//       parallaxBgEls.forEach((el, idx) => {
//         const rect = el.getBoundingClientRect();
//         const offset = window.pageYOffset + rect.top;
//         const speed = 0.12 + (idx * 0.02);
//         el.style.backgroundPosition = `center ${-(window.pageYOffset - offset) * speed}px`;
//       });
//     }
//     window.addEventListener('scroll', onScrollParallax, { passive: true });
//     onScrollParallax();
  
//     // basic form submit feedback
//     const contactForm = document.getElementById('contactForm');
//     if (contactForm) {
//       contactForm.addEventListener('submit', (e) => {
//         // allow Formspree to send — show immediate feedback
//         setTimeout(() => {
//           alert('Thanks — your inquiry was submitted. We will contact you soon.');
//           contactModal.style.display = 'none';
//         }, 400);
//       });
//     }
//   });
  