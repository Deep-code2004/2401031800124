// Service Worker for VR Travel - Cache-first strategy
const CACHE_NAME = 'vr-travel-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Cache-first for offline support
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          networkResponse => {
            // Cache successful network requests
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return networkResponse;
          }
        ).catch(() => {
          // Offline fallback for HTML
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// Push notifications (future)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New VR destination available!',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [100, 50, 100]
  };
  event.waitUntil(
    self.registration.showNotification('VR Travel', options)
  );
});

