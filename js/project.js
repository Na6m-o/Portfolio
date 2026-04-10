/* ================================================================
   PROJECT PAGES — JS
   ================================================================ */

/* ---- NAVBAR toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
    });
}

/* ---- INTERSECTION OBSERVER — reveal ---- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in, .reveal-up').forEach(el => observer.observe(el));

/* ---- Animate cards on scroll ---- */
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity    = '0';
            entry.target.style.transform  = 'translateY(20px)';
            entry.target.style.transition = `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 50);
            });
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(
    '.infra-card, .learning-card, .script-card, .step, .next-item, .proj-info-row'
).forEach(el => {
    el.style.opacity = '0';
    cardObserver.observe(el);
});

/* ---- Smooth scroll (pour les liens anchor internes) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
