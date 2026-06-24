// ============================================================
// FOOTER YEAR
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// CUSTOM CROSSHAIR CURSOR (desktop only)
// ============================================================
(function initCrosshair(){
  const crosshair = document.getElementById('crosshair');
  if (!crosshair || window.matchMedia('(hover: none)').matches) return;

  let active = false;
  window.addEventListener('mousemove', (e) => {
    crosshair.style.left = e.clientX + 'px';
    crosshair.style.top = e.clientY + 'px';
    if (!active){ crosshair.classList.add('active'); active = true; }
  });
  window.addEventListener('mouseleave', () => {
    crosshair.classList.remove('active');
    active = false;
  });
})();

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('scrollProgress');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  progressBar.style.width = pct + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ============================================================
// HEADER SCROLLED STATE
// ============================================================
const siteHeader = document.getElementById('siteHeader');
function updateHeader(){
  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
}
document.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================================
const revealTargets = document.querySelectorAll(
  '.about-grid, .expertise-card, .project-card, .workflow-step, .software-item, .timeline-item, .contact-item, .section-head'
);
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.07 + 's';
  revealObserver.observe(el);
});

// ============================================================
// SOFTWARE BARS FILL ON VIEW
// ============================================================
const softwareFills = document.querySelectorAll('.software-fill');
const fillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      fillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
softwareFills.forEach(el => fillObserver.observe(el));

// ============================================================
// ANIMATED STAT COUNTERS
// ============================================================
const statNums = document.querySelectorAll('.stat-num');
function animateCount(el){
  const target = parseInt(el.getAttribute('data-count'), 10) || 0;
  const duration = 1400;
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

// ============================================================
// TESTIMONIAL CAROUSEL
// ============================================================
(function initTestimonials(){
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (!cards.length) return;

  let current = 0;
  let timer = null;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index){
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
    restartAutoplay();
  }

  function next(){ goTo((current + 1) % cards.length); }

  function restartAutoplay(){
    if (timer) clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  cards[0].classList.add('active');
  restartAutoplay();
})();

// ============================================================
// SMOOTH NAV LINK -> CLOSE ON SAME SCROLL (handled by CSS scroll-behavior)
// ============================================================
