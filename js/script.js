/* ================================================================
   NACIM FADEL — Portfolio JS
   ================================================================ */

/* ----------------------------------------------------------------
   NAVBAR
   ---------------------------------------------------------------- */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
}, { passive: true });

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
    });
});

/* ----------------------------------------------------------------
   ACTIVE NAV
   ---------------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const id   = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (!link) return;
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

/* ----------------------------------------------------------------
   SMOOTH SCROLL
   ---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ----------------------------------------------------------------
   INTERSECTION OBSERVER — reveal elements
   ---------------------------------------------------------------- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in, .reveal-up').forEach(el => observer.observe(el));

/* Hero — trigger instantly */
setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
}, 100);

/* ----------------------------------------------------------------
   HERO CANVAS — Matrix Rain
   ---------------------------------------------------------------- */
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const chars  = 'アイウエオカキクケコ01101001NACIMFADELSIOSISR{}[]<>/=+-_ABCDEF0987654321';
    const arr    = chars.split('');
    const fs     = 13;
    let drops    = [];

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drops = Array.from({ length: Math.floor(canvas.width / fs) }, () => Math.random() * -60);
    }

    function draw() {
        ctx.fillStyle = 'rgba(20, 18, 16, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fs}px 'JetBrains Mono', monospace`;
        for (let i = 0; i < drops.length; i++) {
            const char  = arr[Math.floor(Math.random() * arr.length)];
            const alpha = Math.random() * 0.5 + 0.05;
            ctx.fillStyle = `rgba(232, 146, 10, ${alpha})`;
            ctx.fillText(char, i * fs, drops[i] * fs);
            if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    resize();
    window.addEventListener('resize', resize);
    setInterval(draw, 50);
})();

/* ----------------------------------------------------------------
   HERO PARALLAX
   ---------------------------------------------------------------- */
const heroInner = document.querySelector('.hero-inner');
window.addEventListener('scroll', () => {
    if (!heroInner) return;
    const s = window.scrollY;
    if (s < window.innerHeight) {
        heroInner.style.transform = `translateY(${s * 0.22}px)`;
        heroInner.style.opacity   = Math.max(0, 1 - (s / window.innerHeight) * 1.5);
    }
}, { passive: true });

/* ----------------------------------------------------------------
   ROLE TYPING EFFECT
   ---------------------------------------------------------------- */
const roles = [
    'Charge de Proximite IT',
    'Admin Systeme & Reseau',
    'BTS SIO SISR — Alternance',
    'Securite Reseau'
];
let roleIdx = 0;
let charIdx = 0;
let deleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
    if (!roleEl) return;
    const current = roles[roleIdx];
    if (!deleting) {
        charIdx++;
        roleEl.textContent = current.substring(0, charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeRole, 2200);
            return;
        }
    } else {
        charIdx--;
        roleEl.textContent = current.substring(0, charIdx);
        if (charIdx === 0) {
            deleting = false;
            roleIdx  = (roleIdx + 1) % roles.length;
        }
    }
    setTimeout(typeRole, deleting ? 42 : 68);
}

// Start typing after hero reveal
setTimeout(typeRole, 1200);

/* ----------------------------------------------------------------
   LANGUAGE BARS — animate on visible
   ---------------------------------------------------------------- */
const langObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.lang-bar span').forEach(bar => {
                const target = bar.style.width;
                bar.style.width = '0';
                requestAnimationFrame(() => {
                    setTimeout(() => { bar.style.width = target; }, 100);
                });
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.about-right').forEach(el => langObserver.observe(el));

/* ----------------------------------------------------------------
   VEILLE TECHNOLOGIQUE — RSS via rss2json.com
   ---------------------------------------------------------------- */
(function initVeille() {

    const FEEDS = [
        { url: 'https://feeds.feedburner.com/TheHackersNews',   source: 'The Hacker News', tag: 'securite'      },
        { url: 'https://www.bleepingcomputer.com/feed/',         source: 'BleepingComputer', tag: 'vulnerabilite' },
        { url: 'https://krebsonsecurity.com/feed/',              source: 'Krebs on Security', tag: 'securite'     },
        { url: 'https://isc.sans.edu/rssfeed.xml',               source: 'SANS ISC',          tag: 'reseau'       },
        { url: 'https://www.darkreading.com/rss.xml',            source: 'Dark Reading',      tag: 'securite'     },
        { url: 'https://feeds.feedburner.com/NakedSecurity',     source: 'Sophos News',       tag: 'vulnerabilite'}
    ];

    const API  = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const grid = document.getElementById('veilleGrid');
    const dot  = document.getElementById('veilleStatusDot');
    const txt  = document.getElementById('veilleStatusText');
    const btn  = document.getElementById('veilleRefresh');

    let allArticles  = [];
    let activeFilter = 'all';

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function relativeDate(dateStr) {
        if (!dateStr) return '';
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60)     return 'A l\'instant';
        if (diff < 3600)   return `Il y a ${Math.floor(diff / 60)} min`;
        if (diff < 86400)  return `Il y a ${Math.floor(diff / 3600)} h`;
        if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }

    function tagLabel(tag) {
        return { securite: 'Securite', reseau: 'Reseau', vulnerabilite: 'Vulnerabilite' }[tag] || tag;
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function render(articles) {
        const filtered = activeFilter === 'all'
            ? articles
            : articles.filter(a => a.tag === activeFilter);

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="veille-error"><strong>Aucun article</strong> pour ce filtre.</div>`;
            return;
        }

        grid.innerHTML = filtered.map((a, i) => `
            <a href="${a.link}" target="_blank" rel="noopener noreferrer"
               class="news-card fade-in" style="transition-delay:${i * 0.05}s">
                <div class="news-card-top">
                    <span class="news-source">${a.source}</span>
                    <span class="news-tag tag-${a.tag}">${tagLabel(a.tag)}</span>
                </div>
                <div class="news-date">${relativeDate(a.pubDate)}</div>
                <div class="news-title">${a.title}</div>
                <div class="news-excerpt">${a.excerpt}</div>
                <div class="news-read">Lire l'article &rarr;</div>
            </a>
        `).join('');

        requestAnimationFrame(() => {
            grid.querySelectorAll('.news-card').forEach(el => {
                setTimeout(() => el.classList.add('visible'), 50);
            });
        });
    }

    async function fetchFeed(feed) {
        const resp = await fetch(API + encodeURIComponent(feed.url));
        const data = await resp.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
        return data.items
            .filter(item => item.title && item.link && item.link.startsWith('http'))
            .slice(0, 5)
            .map(item => ({
                title:   item.title,
                link:    item.link,
                pubDate: item.pubDate || '',
                excerpt: stripHtml(item.description || item.content || '').substring(0, 200),
                source:  feed.source,
                tag:     feed.tag
            }));
    }

    async function loadAll() {
        grid.innerHTML = `
            <div class="veille-loading" id="veilleLoading">
                <div class="loading-bar"></div><div class="loading-bar delay"></div>
                <div class="loading-bar"></div><div class="loading-bar delay"></div>
                <div class="loading-bar"></div><div class="loading-bar delay"></div>
            </div>`;
        dot.className   = 'veille-dot';
        txt.textContent = 'Chargement...';
        if (btn) btn.classList.add('spinning');

        const collected = [];

        for (const feed of FEEDS) {
            try {
                const articles = await fetchFeed(feed);
                collected.push(...articles);
            } catch (_) { /* feed ignoré */ }
        }

        if (btn) btn.classList.remove('spinning');

        if (collected.length === 0) {
            dot.className   = 'veille-dot';
            txt.textContent = 'Impossible de charger les flux';
            grid.innerHTML  = `<div class="veille-error"><strong>Erreur</strong> Impossible de charger les articles.</div>`;
            return;
        }

        allArticles = collected.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        render(allArticles);
        dot.className   = 'veille-dot live';
        txt.textContent = `Mis a jour ${relativeDate(new Date().toISOString())}`;
    }

    document.querySelectorAll('.vf-btn').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.vf-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            activeFilter = b.dataset.filter;
            render(allArticles);
        });
    });

    if (btn) btn.addEventListener('click', loadAll);

    const veilleSection = document.getElementById('veille');
    let loaded = false;
    const veilleObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !loaded) {
            loaded = true;
            loadAll();
        }
    }, { threshold: 0.05 });
    if (veilleSection) veilleObserver.observe(veilleSection);

    setInterval(() => { if (loaded) loadAll(); }, 30 * 60 * 1000);

})();
