const CACHE = 'a4j-v2';

const PRECACHE = [
  '/home.html',
  '/episodes.html',
  '/live.html',
  '/about.html',
  '/contact.html',
  '/ar/homear.html',
  '/ar/episodesar.html',
  '/ar/livear.html',
  '/ar/aboutar.html',
  '/ar/contactar.html',
  '/404.html',
  '/assets/css/style.css',
  '/assets/css/mobile.css',
  '/assets/script/script.js',
  '/assets/img/logo.png',
  '/assets/img/homebanner.jpg',
  '/assets/img/aboutbanner.jpg',
  '/assets/img/episodebanner.jpg',
  '/assets/img/livebanner.jpg',
  '/assets/img/contactbanner.jpg'
];

// Install — cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/404.html'));
    })
  );
});
