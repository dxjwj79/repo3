// ⬆️ Bump this version number every time you push an update
const VERSION = 'v1';
const CACHE = 'inbox-' + VERSION;

self.addEventListener('install', e => {
  // Take over immediately without waiting
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.add('./index.html'))
  );
});

self.addEventListener('activate', e => {
  // Delete old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    // Network first — get fresh content, fall back to cache if offline
    fetch(e.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, copy));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
