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

    /* Sources RSS — reseau & securite */
    const FEEDS = [
        {
            url:    'https://feeds.feedburner.com/TheHackersNews',
            source: 'The Hacker News',
            tag:    'securite'
        },
        {
            url:    'https://www.bleepingcomputer.com/feed/',
            source: 'BleepingComputer',
            tag:    'vulnerabilite'
        },
        {
            url:    'https://krebsonsecurity.com/feed/',
            source: 'Krebs on Security',
            tag:    'securite'
        },
        {
            url:    'https://isc.sans.edu/rssfeed.xml',
            source: 'SANS ISC',
            tag:    'reseau'
        }
    ];

    const API    = 'https://api.rss2json.com/v1/api.json?count=5&rss_url=';
    const grid   = document.getElementById('veilleGrid');
    const dot    = document.getElementById('veilleStatusDot');
    const txt    = document.getElementById('veilleStatusText');
    const btn    = document.getElementById('veilleRefresh');

    let allArticles  = [];
    let activeFilter = 'all';

    /* --- Helpers --- */
    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function relativeDate(dateStr) {
        if (!dateStr) return '';
        const now   = Date.now();
        const then  = new Date(dateStr).getTime();
        const diff  = Math.floor((now - then) / 1000);
        if (diff < 60)     return 'A l\'instant';
        if (diff < 3600)   return `Il y a ${Math.floor(diff / 60)} min`;
        if (diff < 86400)  return `Il y a ${Math.floor(diff / 3600)} h`;
        if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }

    function tagClass(tag) {
        return 'tag-' + tag;
    }
    function tagLabel(tag) {
        return { securite: 'Securite', reseau: 'Reseau', vulnerabilite: 'Vulnerabilite' }[tag] || tag;
    }

    /* --- Render --- */
    function render(articles) {
        const filtered = activeFilter === 'all'
            ? articles
            : articles.filter(a => a.tag === activeFilter);

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="veille-error"><strong>Aucun article</strong>Aucun article pour ce filtre pour le moment.</div>`;
            return;
        }

        grid.innerHTML = filtered.map((a, i) => `
            <a href="${a.link}" target="_blank" rel="noopener noreferrer"
               class="news-card fade-in"
               style="transition-delay:${i * 0.05}s">
                <div class="news-card-top">
                    <span class="news-source">${a.source}</span>
                    <span class="news-tag ${tagClass(a.tag)}">${tagLabel(a.tag)}</span>
                </div>
                <div class="news-date">${relativeDate(a.pubDate)}</div>
                <div class="news-title">${a.title}</div>
                <div class="news-excerpt">${a.excerpt}</div>
                <div class="news-read">Lire l'article &rarr;</div>
            </a>
        `).join('');

        /* Trigger fade-in */
        requestAnimationFrame(() => {
            grid.querySelectorAll('.news-card').forEach(el => {
                setTimeout(() => el.classList.add('visible'), 50);
            });
        });
    }

    /* --- Articles statiques (fallback hors-ligne) --- */
    const STATIC_ARTICLES = [
        {
            title:   'Critical RCE Vulnerability Discovered in OpenSSH (regreSSHion)',
            link:    'https://thehackernews.com/2024/07/openssh-regresshion-attack.html',
            pubDate: '2024-07-01',
            excerpt: 'Une faille critique d\'execution de code a distance (CVE-2024-6387) a ete decouverte dans OpenSSH, affectant des millions de serveurs Linux. Un attaquant non authentifie peut obtenir un acces root sur les systemes vulnerables.',
            source:  'The Hacker News',
            tag:     'vulnerabilite'
        },
        {
            title:   'Microsoft Patch Tuesday — 49 Vulnerabilities Fixed Including Zero-Days',
            link:    'https://www.bleepingcomputer.com/news/microsoft/microsoft-patch-tuesday/',
            pubDate: '2024-06-11',
            excerpt: 'Microsoft corrige 49 vulnerabilites dans son Patch Tuesday mensuel, dont plusieurs zero-days exploites activement. Les mises a jour couvrent Windows, Office, Azure et Exchange Server.',
            source:  'BleepingComputer',
            tag:     'vulnerabilite'
        },
        {
            title:   'Ransomware Groups Shift to Targeting VMware ESXi Hypervisors',
            link:    'https://krebsonsecurity.com',
            pubDate: '2024-06-05',
            excerpt: 'Les groupes de ransomware ciblent de plus en plus les hyperviseurs VMware ESXi pour maximiser l\'impact de leurs attaques. Un seul hyperviseur compromis peut chiffrer des dizaines de machines virtuelles en quelques minutes.',
            source:  'Krebs on Security',
            tag:     'securite'
        },
        {
            title:   'BGP Hijacking Attack Disrupts Major Cloud Providers Traffic',
            link:    'https://isc.sans.edu',
            pubDate: '2024-06-03',
            excerpt: 'Une attaque de detournement BGP (Border Gateway Protocol) a provoque une interruption du trafic reseau chez plusieurs fournisseurs cloud. L\'incident souligne les failles persistantes dans la securite du routage internet.',
            source:  'SANS ISC',
            tag:     'reseau'
        },
        {
            title:   'Phishing Campaign Bypasses MFA Using Adversary-in-the-Middle Technique',
            link:    'https://thehackernews.com',
            pubDate: '2024-05-28',
            excerpt: 'Une campagne de phishing sophistiquee utilise la technique AiTM (Adversary-in-the-Middle) pour contourner l\'authentification multifacteur. Les attaquants interceptent les tokens de session apres une connexion legitime.',
            source:  'The Hacker News',
            tag:     'securite'
        },
        {
            title:   'CVE-2024-3400 — PAN-OS Zero-Day Actively Exploited in the Wild',
            link:    'https://www.bleepingcomputer.com',
            pubDate: '2024-04-12',
            excerpt: 'Palo Alto Networks confirme l\'exploitation active d\'une vulnerabilite critique dans PAN-OS (GlobalProtect). La faille permet une execution de commandes OS sans authentification sur les pare-feu affectes.',
            source:  'BleepingComputer',
            tag:     'vulnerabilite'
        },
        {
            title:   'DNS Tunneling Techniques Used to Exfiltrate Data Undetected',
            link:    'https://isc.sans.edu',
            pubDate: '2024-04-08',
            excerpt: 'Des acteurs malveillants utilisent le tunneling DNS pour exfiltrer des donnees sensibles en contournant les controles de securite reseau traditionnels. Cette technique encode les donnees dans des requetes DNS en apparence legitimes.',
            source:  'SANS ISC',
            tag:     'reseau'
        },
        {
            title:   'Supply Chain Attack Targets NPM Packages Used by Thousands of Projects',
            link:    'https://krebsonsecurity.com',
            pubDate: '2024-03-20',
            excerpt: 'Une attaque ciblant la chaine d\'approvisionnement logicielle a compromis plusieurs packages NPM populaires. Des backdoors ont ete injectees dans des versions publiees, affectant potentiellement des milliers de projets dependants.',
            source:  'Krebs on Security',
            tag:     'securite'
        }
    ];

    /* --- Charger tous les feeds --- */
    async function loadAll() {
        grid.innerHTML = `
            <div class="veille-loading" id="veilleLoading">
                <div class="loading-bar"></div><div class="loading-bar delay"></div>
                <div class="loading-bar"></div><div class="loading-bar delay"></div>
                <div class="loading-bar"></div><div class="loading-bar delay"></div>
            </div>`;
        dot.className  = 'veille-dot';
        txt.textContent = 'Chargement...';
        if (btn) btn.classList.add('spinning');

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7000);

            const results = await Promise.allSettled(FEEDS.map(feed =>
                fetch(API + encodeURIComponent(feed.url), { signal: controller.signal })
                    .then(r => r.json())
                    .then(data => {
                        if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
                        return data.items.slice(0, 4).map(item => ({
                            title:   item.title || 'Sans titre',
                            link:    item.link  || '#',
                            pubDate: item.pubDate || '',
                            excerpt: stripHtml(item.description || item.content || '').substring(0, 200),
                            source:  feed.source,
                            tag:     feed.tag
                        }));
                    })
            ));
            clearTimeout(timeout);

            allArticles = [];
            results.forEach(r => {
                if (r.status === 'fulfilled') allArticles.push(...r.value);
            });

            /* Tri par date decroissante */
            allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            if (allArticles.length === 0) throw new Error('Aucun article recupere');

            render(allArticles);
            dot.className  = 'veille-dot live';
            txt.textContent = `Mis a jour ${relativeDate(new Date().toISOString())}`;

        } catch (err) {
            /* Fallback : articles statiques */
            allArticles = STATIC_ARTICLES;
            render(allArticles);
            dot.className  = 'veille-dot';
            txt.textContent = 'Articles de reference (mode hors-ligne)';
        } finally {
            if (btn) btn.classList.remove('spinning');
        }
    }

    /* --- Filtres --- */
    document.querySelectorAll('.vf-btn').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.vf-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            activeFilter = b.dataset.filter;
            render(allArticles);
        });
    });

    /* --- Bouton refresh --- */
    if (btn) btn.addEventListener('click', loadAll);

    /* --- Lancer au scroll (chargement paresseux) --- */
    const veilleSection = document.getElementById('veille');
    let loaded = false;
    const veilleObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !loaded) {
            loaded = true;
            loadAll();
        }
    }, { threshold: 0.05 });
    if (veilleSection) veilleObserver.observe(veilleSection);

    /* --- Auto-refresh toutes les 30 min --- */
    setInterval(() => { if (loaded) loadAll(); }, 30 * 60 * 1000);

})();
