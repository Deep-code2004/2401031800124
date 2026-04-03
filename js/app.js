/**
 * VR Travel Experience - Professional JavaScript
 */

(function() {
    'use strict';

    const CONFIG = {
        debounceDelay: 300,
        toastDuration: 4000,
        storagePrefix: 'vrTravel_'
    };

    const destinations = [
        {
            name: "Paris, France",
            subtitle: "Eiffel Tower & Seine Night Tour",
            tagline: "Stroll under lights with a 360° rooftop view in Paris.",
            image: "https://images.unsplash.com/photo-1549039725-9c8d1c8d0c82?auto=format&fit=crop&w=800&q=80",
            description: "Immerse yourself in a virtual night tour of Paris. Experience the Eiffel Tower, Louvre reflection, and charming riverwalks from 360° vantage points.",
            features: ["Historic landmarks", "Guided audio narrative", "360° panorama navigation", "Cloud-synced VR mode"],
            video: "https://www.youtube.com/embed/2uwUVzzlTYI",
            link: "https://www.google.com/maps/place/Paris/"
        },
        {
            name: "Maldives",
            subtitle: "Underwater & Overwater Retreat",
            tagline: "Float above tranquil lagoons and dive into coral gardens.",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            description: "Feel the ocean breeze virtually. A luxury stay on overwater villas and underwater marine life glimpses with interactive navigation.",
            features: ["Ocean soundscape", "Marine life spotlights", "Sunset timelapse", "Depth-triggered light show"],
            video: "https://www.youtube.com/embed/Vr-H_subv5c",
            link: "https://www.google.com/maps/place/Maldives/"
        },
        {
            name: "Tokyo, Japan",
            subtitle: "Neon City & Traditions",
            tagline: "Blend futuristic skyscrapers with calm temple gardens in VR.",
            image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80",
            description: "Experience Shibuya Crossing, Shinjuku neon, and the serene Meiji Shrine in one immersive VR journey.",
            features: ["Dynamic urban scenes", "Traditional rituals", "Street food smells (AR hint)", "Night-to-day transition"],
            video: "https://www.youtube.com/embed/F8Y0U5DDoY8",
            link: "https://www.google.com/maps/place/Tokyo/"
        },
        {
            name: "New York, USA",
            subtitle: "Skyline & Central Park",
            tagline: "From Times Square lights to Central Park serenity.",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
            description: "Virtual tour of NYC's iconic skyline, bustling streets, and peaceful parks with 360° views.",
            features: ["Skyline panorama", "Real-time traffic", "Park walking paths", "Seasonal changes"],
            video: "https://www.youtube.com/embed/dnGO89aWIMs",
            link: "https://www.google.com/maps/place/New+York/"
        },
        {
            name: "Santorini, Greece",
            subtitle: "White Cliffs & Blue Domes",
            tagline: "Iconic Greek island sunsets and caldera views.",
            image: "https://images.unsplash.com/photo-1571896349840-0d6d556489e5?auto=format&fit=crop&w=800&q=80",
            description: "Experience the stunning white architecture against azure seas and dramatic caldera cliffs.",
            features: ["Sunset timelapse", "Boat tours", "Village exploration", "Wine tasting VR"],
            video: "https://www.youtube.com/embed/6rM0E9v5S4k",
            link: "https://www.google.com/maps/place/Santorini/"
        },
        {
            name: "Machu Picchu, Peru",
            subtitle: "Lost City of the Incas",
            tagline: "Ancient ruins high in the Andes mountains.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
            description: "Journey to the mystical Inca citadel perched among Andean peaks with guided historical narrative.",
            features: ["Altitude effects", "Historical reconstruction", "Terrace farming", "Inca trails"],
            video: "https://www.youtube.com/embed/9Y8Yx7K5q0A",
            link: "https://www.google.com/maps/place/Machu+Picchu/"
        }
    ];

    let currentDestinations = [...destinations];
    let currentSearchTerm = '';
    let currentSort = 'default';

    // DOM Elements
    const els = {
        destinationsRow: null,
        searchInput: null,
        clearSearch: null,
        searchResultsCount: null,
        noResultsMessage: null,
        resetSearch: null,
        sortSelect: null,
        newsletterForm: null,
        emailInput: null,
        newsletterMessage: null,
        vrModal: null,
        vrModalLabel: null,
        vrVideo: null,
        vrDescription: null,
        vrFeatures: null,
        exploreLink: null,
        loader: null,
        toastContainer: null
    };

    function initElements() {
        els.destinationsRow = document.getElementById('destinationsRow');
        els.searchInput = document.getElementById('searchInput');
        els.clearSearch = document.getElementById('clearSearch');
        els.searchResultsCount = document.getElementById('searchResultsCount');
        els.noResultsMessage = document.getElementById('noResultsMessage');
        els.resetSearch = document.getElementById('resetSearch');
        els.sortSelect = document.getElementById('sortSelect');
        els.newsletterForm = document.getElementById('newsletterForm');
        els.emailInput = document.getElementById('emailInput');
        els.newsletterMessage = document.getElementById('newsletterMessage');
        els.vrModal = document.getElementById('vrModal');
        els.vrModalLabel = document.getElementById('vrModalLabel');
        els.vrVideo = document.getElementById('vrVideo');
        els.vrDescription = document.getElementById('vrDescription');
        els.vrFeatures = document.getElementById('vrFeatures');
        els.exploreLink = document.getElementById('exploreLink');
        els.loader = document.getElementById('loader');
        els.toastContainer = document.getElementById('toastContainer');
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${escapeHtml(message)}</span>`;
        els.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.toastDuration);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function sortDestinations(arr, sortBy) {
        const sorted = [...arr];
        if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === 'name-desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
        return sorted;
    }

    function filterDestinations(arr, term) {
        if (!term) return arr;
        const lowerTerm = term.toLowerCase().trim();
        return arr.filter(dest => 
            dest.name.toLowerCase().includes(lowerTerm) ||
            dest.subtitle.toLowerCase().includes(lowerTerm) ||
            dest.tagline.toLowerCase().includes(lowerTerm)
        );
    }

    function buildCards(destArray) {
        els.destinationsRow.innerHTML = '';
        
        if (destArray.length === 0) {
            els.destinationsRow.style.display = 'none';
            els.noResultsMessage.style.display = 'block';
            els.searchResultsCount.textContent = '';
            return;
        }
        
        els.destinationsRow.style.display = '';
        els.noResultsMessage.style.display = 'none';
        
        const countText = currentSearchTerm 
            ? `Found ${destArray.length} destination${destArray.length !== 1 ? 's' : ''} for "${escapeHtml(currentSearchTerm)}"`
            : `Showing ${destArray.length} destination${destArray.length !== 1 ? 's' : ''}`;
        els.searchResultsCount.textContent = countText;
        
        destArray.forEach(dest => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-3';
            
            const card = document.createElement('article');
            card.className = 'card h-100';
            
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${dest.image}" class="card-img-top" alt="${escapeHtml(dest.name)}" loading="lazy">
                    <div class="card-badge">VR Experience</div>
                </div>
                <div class="card-body">
                    <div class="card-content">
                        <h3 class="card-title">${escapeHtml(dest.name)}</h3>
                        <p class="card-subtitle">${escapeHtml(dest.subtitle)}</p>
                        <p class="card-text">${escapeHtml(dest.tagline)}</p>
                    </div>
                    <div class="card-actions">
                        <div class="card-meta">
                            <span><i data-lucide="star" class="star-icon"></i> 4.9</span>
                            <span><i data-lucide="clock"></i> 45 min</span>
                        </div>
                        <button class="start-tour" data-name="${escapeHtml(dest.name)}" data-description="${escapeHtml(dest.description)}" data-video="${dest.video}" data-link="${dest.link}" data-features='${JSON.stringify(dest.features).replace(/'/g, "&#39;")}'>
                            <span>Start Tour</span>
                            <i data-lucide="arrow-right"></i>
                        </button>
                    </div>
                </div>`;
            
            col.appendChild(card);
            els.destinationsRow.appendChild(col);
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function openVRModal(data) {
        els.vrModalLabel.textContent = `${data.name} - VR Tour`;
        els.vrDescription.textContent = data.description;
        els.exploreLink.href = data.link;
        
        // Lazy load YouTube iframe
        els.vrVideo.src = '';
        els.vrVideo.src = `${data.video}?autoplay=1&mute=1&rel=0`;
        
        els.vrFeatures.innerHTML = '';
        if (data.features && Array.isArray(data.features)) {
            data.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = escapeHtml(feature);
                els.vrFeatures.appendChild(li);
            });
        }
        
        new bootstrap.Modal(els.vrModal).show();
    }

    function handleSearch() {
        currentSearchTerm = els.searchInput.value.trim();
        els.clearSearch.style.display = currentSearchTerm ? 'flex' : 'none';
        
        const filtered = filterDestinations(destinations, currentSearchTerm);
        currentDestinations = sortDestinations(filtered, currentSort);
        buildCards(currentDestinations);
        
        localStorage.setItem(CONFIG.storagePrefix + 'lastSearch', currentSearchTerm);
    }

    function handleSort() {
        currentSort = els.sortSelect.value;
        const filtered = filterDestinations(destinations, currentSearchTerm);
        currentDestinations = sortDestinations(filtered, currentSort);
        buildCards(currentDestinations);
        
        localStorage.setItem(CONFIG.storagePrefix + 'sortBy', currentSort);
    }

    function handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = els.emailInput.value.trim();
        
        if (!email) {
            els.newsletterMessage.textContent = 'Please enter your email address.';
            els.newsletterMessage.className = 'form-message error';
            return;
        }
        
        if (!isValidEmail(email)) {
            els.newsletterMessage.textContent = 'Please enter a valid email address.';
            els.newsletterMessage.className = 'form-message error';
            return;
        }
        
        els.newsletterMessage.textContent = 'Subscribing...';
        els.newsletterMessage.className = 'form-message';
        
        setTimeout(() => {
            const subscribers = JSON.parse(localStorage.getItem(CONFIG.storagePrefix + 'subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem(CONFIG.storagePrefix + 'subscribers', JSON.stringify(subscribers));
            }
            
            els.newsletterMessage.textContent = 'Thank you for subscribing!';
            els.newsletterMessage.className = 'form-message success';
            els.emailInput.value = '';
            showToast('Successfully subscribed!');
        }, 1000);
    }

    function initCounters() {
        const statValues = document.querySelectorAll('.stat-value[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const target = parseInt(entry.target.dataset.count);
                    animateCounter(entry.target, target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        statValues.forEach(stat => observer.observe(stat));
    }

    function initNavbar() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    function initPWA() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            showToast('Install VR Travel app for offline access!', 'success');
        });
        
        window.addEventListener('appinstalled', () => {
            deferredPrompt = null;
            showToast('VR Travel installed successfully!');
        });
    }
    
    function init() {
        initElements();
        initPWA();
        
        // Restore saved state
        const savedSearch = localStorage.getItem(CONFIG.storagePrefix + 'lastSearch');
        const savedSort = localStorage.getItem(CONFIG.storagePrefix + 'sortBy');
        
        if (savedSearch) {
            els.searchInput.value = savedSearch;
            currentSearchTerm = savedSearch;
            els.clearSearch.style.display = 'flex';
        }
        
        if (savedSort) {
            currentSort = savedSort;
            els.sortSelect.value = savedSort;
        }
        
        // Initial render
        const filtered = filterDestinations(destinations, currentSearchTerm);
        currentDestinations = sortDestinations(filtered, currentSort);
        buildCards(currentDestinations);
        
        // Update dynamic stats
        document.querySelector('.stat-value[data-count="50"]').dataset.count = destinations.length;
        
        // Event Listeners
        els.searchInput.addEventListener('input', debounce(handleSearch, CONFIG.debounceDelay));
        
        els.clearSearch.addEventListener('click', () => {
            els.searchInput.value = '';
            currentSearchTerm = '';
            els.clearSearch.style.display = 'none';
            handleSearch();
            els.searchInput.focus();
        });
        
        els.resetSearch.addEventListener('click', () => {
            els.searchInput.value = '';
            currentSearchTerm = '';
            els.clearSearch.style.display = 'none';
            handleSearch();
        });
        
        els.sortSelect.addEventListener('change', handleSort);
        els.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        
        // VR Tour buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.start-tour');
            if (btn) {
                const data = {
                    name: btn.dataset.name,
                    description: btn.dataset.description,
                    video: btn.dataset.video,
                    link: btn.dataset.link,
                    features: JSON.parse(btn.dataset.features)
                };
                openVRModal(data);
            }
        });
        
        // Modal close
        els.vrModal.addEventListener('hidden.bs.modal', () => {
            els.vrVideo.src = '';
        });
        
        // Init
        initCounters();
        initNavbar();
        
        // Hide loader
        setTimeout(() => {
            if (els.loader) {
                els.loader.classList.add('hidden');
                setTimeout(() => {
                    els.loader.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        // Init icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Error handling
    window.onerror = function() {
        showToast('An error occurred. Please refresh the page.', 'error');
        return false;
    };

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
