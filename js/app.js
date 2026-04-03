(function () {
'use strict';

/* ── DATA ── */
const DESTINATIONS = [
  {
    name: "Paris, France",
    subtitle: "Eiffel Tower & Seine Night Tour",
    tagline: "Stroll beneath the City of Light with a 360° rooftop view.",
    image: "https://images.unsplash.com/photo-1549039725-9c8d1c8d0c82?auto=format&fit=crop&w=800&q=80",
    description: "Immerse yourself in a virtual night tour of Paris. Experience the glowing Eiffel Tower, the Louvre's glass pyramid reflected at dusk, and the charming cobblestone riverwalks — all from breathtaking 360° vantage points.",
    features: ["Historic landmark highlights", "Guided audio narrative", "360° panorama navigation", "Sunset & night modes"],
    video: "https://www.youtube.com/embed/2uwUVzzlTYI",
    link: "https://www.google.com/maps/place/Paris/"
  },
  {
    name: "Maldives",
    subtitle: "Underwater & Overwater Retreat",
    tagline: "Float above turquoise lagoons and dive into coral gardens.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Feel the ocean breeze virtually. A luxury stay experience on overwater villas combined with underwater marine life glimpses — interactive navigation lets you explore at your own pace.",
    features: ["Ocean ambient soundscape", "Marine life spotlights", "Sunset timelapse", "Coral reef exploration"],
    video: "https://www.youtube.com/embed/Vr-H_subv5c",
    link: "https://www.google.com/maps/place/Maldives/"
  },
  {
    name: "Tokyo, Japan",
    subtitle: "Neon City & Ancient Traditions",
    tagline: "Futuristic skyscrapers meet serene temple gardens.",
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80",
    description: "Experience Shibuya Crossing at rush hour, the neon glow of Shinjuku, and the serene Meiji Shrine — all in one seamless immersive VR journey through Tokyo's contrasting worlds.",
    features: ["Dynamic urban street scenes", "Traditional shrine rituals", "Cherry blossom parks", "Night-to-day transition"],
    video: "https://www.youtube.com/embed/F8Y0U5DDoY8",
    link: "https://www.google.com/maps/place/Tokyo/"
  },
  {
    name: "New York, USA",
    subtitle: "Skyline & Central Park",
    tagline: "From Times Square's electric pulse to Central Park's serenity.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    description: "Virtual tour of NYC's iconic skyline, the bustle of Times Square, Brooklyn Bridge views, and peaceful paths through Central Park — all seasons available.",
    features: ["Rooftop skyline panorama", "Times Square at night", "Central Park walk", "Seasonal day/night modes"],
    video: "https://www.youtube.com/embed/dnGO89aWIMs",
    link: "https://www.google.com/maps/place/New+York/"
  },
  {
    name: "Santorini, Greece",
    subtitle: "White Cliffs & Cobalt Domes",
    tagline: "Iconic caldera sunsets over the Aegean Sea.",
    image: "https://images.unsplash.com/photo-1571896349840-0d6d556489e5?auto=format&fit=crop&w=800&q=80",
    description: "Experience the stunning white-washed architecture against azure seas, dramatic volcanic caldera cliffs, and the legendary Oia sunset in an immersive 360° journey.",
    features: ["Oia sunset timelapse", "Caldera boat tours", "Village alley exploration", "Clifftop panorama"],
    video: "https://www.youtube.com/embed/6rM0E9v5S4k",
    link: "https://www.google.com/maps/place/Santorini/"
  },
  {
    name: "Machu Picchu, Peru",
    subtitle: "Lost City of the Incas",
    tagline: "Ancient ruins shrouded in Andean cloud mist.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    description: "Journey to the mystical Inca citadel perched among Andean peaks. A guided historical narrative reconstructs the ancient city as you explore its terraces, temples, and breathtaking mountain vistas.",
    features: ["Historical reconstruction", "Altitude cloud effects", "Terrace farming views", "Inca trail walkthrough"],
    video: "https://www.youtube.com/embed/9Y8Yx7K5q0A",
    link: "https://www.google.com/maps/place/Machu+Picchu/"
  }
];

const CFG = { debounce: 280, toastDur: 4000, storeKey: 'vrt_' };

/* ── STATE ── */
let searchTerm = '';
let sortOrder = 'default';

/* ── UTILS ── */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function toast(msg, type = 'info') {
  const zone = document.getElementById('toastZone');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', info: '✦' };
  el.innerHTML = `<span class="toast-icon">${icons[type] || '✦'}</span><span class="toast-msg">${esc(msg)}</span>`;
  zone.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.35s forwards';
    setTimeout(() => el.remove(), 350);
  }, CFG.toastDur);
}

function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function store(k, v) { try { localStorage.setItem(CFG.storeKey + k, v); } catch (_) {} }
function recall(k) { try { return localStorage.getItem(CFG.storeKey + k); } catch (_) { return null; } }

/* ── COUNTER ANIMATION ── */
function animateCount(el, target, dur = 1400) {
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(frame);
}

/* ── RENDER CARDS ── */
function renderCards() {
  const grid = document.getElementById('cardsGrid');
  const noRes = document.getElementById('noResults');
  const countEl = document.getElementById('searchCount');

  let arr = [...DESTINATIONS];
  if (searchTerm) {
    const t = searchTerm.toLowerCase();
    arr = arr.filter(d =>
      d.name.toLowerCase().includes(t) ||
      d.subtitle.toLowerCase().includes(t) ||
      d.tagline.toLowerCase().includes(t)
    );
  }
  if (sortOrder === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
  if (sortOrder === 'name-desc') arr.sort((a, b) => b.name.localeCompare(a.name));

  grid.innerHTML = '';

  if (!arr.length) {
    noRes.style.display = 'block';
    countEl.textContent = '';
    return;
  }

  noRes.style.display = 'none';
  countEl.textContent = searchTerm
    ? `${arr.length} result${arr.length !== 1 ? 's' : ''} for "${esc(searchTerm)}"`
    : `${arr.length} destination${arr.length !== 1 ? 's' : ''}`;

  arr.forEach((d, i) => {
    const card = document.createElement('article');
    card.className = 'dest-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${d.name}: ${d.subtitle}`);
    card.innerHTML = `
      <img class="card-img" src="${d.image}" alt="${esc(d.name)}" loading="lazy">
      <div class="card-grad" aria-hidden="true"></div>
      <div class="card-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
      <div class="card-badge" aria-hidden="true">VR 360°</div>
      <div class="card-body">
        <div class="card-sub">${esc(d.subtitle)}</div>
        <h3 class="card-title">${esc(d.name.toUpperCase())}</h3>
        <p class="card-tagline">${esc(d.tagline)}</p>
        <div class="card-meta">
          <div class="card-rating">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            4.9
          </div>
          <span class="card-duration">45 min tour</span>
        </div>
        <button class="card-cta" data-idx="${i}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
          Start Tour
        </button>
      </div>`;

    // store dest reference for modal
    card.querySelector('.card-cta').addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(arr[i]);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(arr[i]); }
    });

    grid.appendChild(card);
  });
}

/* ── MODAL ── */
function openModal(dest) {
  const overlay = document.getElementById('vrModal');
  document.getElementById('modalTitle').textContent = dest.name.toUpperCase();
  document.getElementById('modalDesc').textContent = dest.description;
  document.getElementById('modalMapsLink').href = dest.link;
  document.getElementById('modalIframe').src = `${dest.video}?autoplay=1&mute=1&rel=0`;

  const feats = document.getElementById('modalFeats');
  feats.innerHTML = dest.features.map(f => `<li>${esc(f)}</li>`).join('');

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}

function closeModal() {
  const overlay = document.getElementById('vrModal');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  // stop video
  setTimeout(() => { document.getElementById('modalIframe').src = ''; }, 400);
}

/* ── SEARCH ── */
const doSearch = debounce(() => {
  searchTerm = document.getElementById('searchInput').value.trim();
  document.getElementById('searchClear').style.display = searchTerm ? 'flex' : 'none';
  renderCards();
  store('lastSearch', searchTerm);
}, CFG.debounce);

/* ── SCROLL REVEAL ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── COUNTERS ── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const t = parseInt(e.target.dataset.target || 0, 10);
      if (t) animateCount(e.target, t);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

/* ── NAVBAR SCROLL ── */
function initNav() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

  // Hamburger
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  // Close on nav link click
  links.addEventListener('click', e => { if (e.target.tagName === 'A') { links.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
}

/* ── NEWSLETTER ── */
function initNewsletter() {
  document.getElementById('nlForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('nlEmail').value.trim();
    const msg = document.getElementById('nlMsg');
    if (!email) { msg.textContent = 'Please enter your email.'; msg.className = 'nl-msg error'; return; }
    if (!validEmail(email)) { msg.textContent = 'Please enter a valid email address.'; msg.className = 'nl-msg error'; return; }
    msg.textContent = 'Subscribing…'; msg.className = 'nl-msg';
    setTimeout(() => {
      try {
        const subs = JSON.parse(localStorage.getItem(CFG.storeKey + 'subs') || '[]');
        if (!subs.includes(email)) { subs.push(email); localStorage.setItem(CFG.storeKey + 'subs', JSON.stringify(subs)); }
      } catch (_) {}
      msg.textContent = '🎉 Welcome aboard! Check your inbox soon.'; msg.className = 'nl-msg success';
      document.getElementById('nlEmail').value = '';
      toast('Successfully subscribed!', 'success');
    }, 900);
  });
}

/* ── PWA ── */
function initPWA() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    toast('Install VR Travel for offline access!', 'info');
  });
}

/* ── LOADER ── */
function hideLoader() {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('out'), 800);
}

/* ── INIT ── */
function init() {
  // Restore state
  const savedSearch = recall('lastSearch');
  const savedSort = recall('sortBy');
  if (savedSearch) { document.getElementById('searchInput').value = savedSearch; searchTerm = savedSearch; document.getElementById('searchClear').style.display = 'flex'; }
  if (savedSort) { sortOrder = savedSort; document.getElementById('sortSelect').value = savedSort; }

  // Set dest stat
  document.getElementById('statDest').textContent = DESTINATIONS.length + '+';

  renderCards();
  initNav();
  initReveal();
  initCounters();
  initNewsletter();
  initPWA();
  hideLoader();

  /* Search */
  document.getElementById('searchInput').addEventListener('input', doSearch);
  document.getElementById('searchClear').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    searchTerm = '';
    document.getElementById('searchClear').style.display = 'none';
    renderCards(); store('lastSearch', '');
  });
  document.getElementById('btnSearch').addEventListener('click', doSearch);
  document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    searchTerm = '';
    document.getElementById('searchClear').style.display = 'none';
    renderCards();
  });

  /* Sort */
  document.getElementById('sortSelect').addEventListener('change', e => {
    sortOrder = e.target.value; renderCards(); store('sortBy', sortOrder);
  });

  /* Modal close */
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('vrModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* Smooth nav */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* Active nav */
  const sections = document.querySelectorAll('section[id], footer');
  const navAs = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAs.forEach(a => { a.classList.toggle('active-nav', a.getAttribute('href') === '#' + entry.target.id); });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.onerror = () => { toast('An unexpected error occurred.', 'error'); return false; };
})();
