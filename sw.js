const CACHE_NAME = 'compilatore-verbali-v11';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './emblem.png',
  './manifest.webmanifest',
  './js/main.js',
  './js/core/utils.js',
  './js/core/auth.js',
  './js/core/storage.js',
  './js/core/app-shell.js',
  './js/verbali/art75/art75.config.js',
  './js/verbali/art75/art75.ui.js',
  './js/verbali/art75/art75.generator.js',
  './js/verbali/art161/art161.generator.js',
  './js/verbali/art161/art161.ui.js',
  './js/verbali/sit/sit.generator.js',
  './js/verbali/sit/sit.ui.js',
  './js/verbali/ispezione/ispezione.generator.js',
  './js/verbali/ispezione/ispezione.ui.js',
  './js/verbali/perq352/perq352.generator.js',
  './js/verbali/perq352/perq352.ui.js',
  './js/verbali/perql152/perql152.generator.js',
  './js/verbali/perql152/perql152.ui.js',
  './js/verbali/sequestro354/sequestro354.generator.js',
  './js/verbali/sequestro354/sequestro354.ui.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});