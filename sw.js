const CACHE_NAME = 'compilatore-verbali-v26';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './emblem.png',
  './img/carabinieri-logo.png',
  './img/login-bg.jpg',
  './manifest.webmanifest',
  './js/main.js',
  './js/core/utils.js',
  './js/core/auth.js',
  './js/core/storage.js',
  './js/core/app-shell.js',
  './js/core/formattazione.js',
  './js/core/segnalibri.js',
  './js/verbali/art75/art75.config.js',
  './js/verbali/art75/art75.ui.js',
  './js/verbali/art75/art75.generator.js',
  './js/verbali/art161/art161.generator.js',
  './js/verbali/art161/art161.ui.js',
  './js/verbali/art161/reati.catalogo.js',
  './js/verbali/art161/reati.ui.js',
  './js/verbali/sit/sit.generator.js',
  './js/verbali/sit/sit.ui.js',
  './js/verbali/ispezione/ispezione.generator.js',
  './js/verbali/ispezione/ispezione.ui.js',
  './js/verbali/perq352/perq352.generator.js',
  './js/verbali/perq352/perq352.ui.js',
  './js/verbali/perql152/perql152.generator.js',
  './js/verbali/perql152/perql152.ui.js',
  './js/verbali/perql152/perql152.fattispecie.js',
  './js/verbali/sequestro354/sequestro354.generator.js',
  './js/verbali/sequestro354/sequestro354.ui.js',
  './js/verbali/sopralluogo/sopralluogo.generator.js',
  './js/verbali/sopralluogo/sopralluogo.ui.js',
  './js/verbali/veicolo/veicolo.generator.js',
  './js/verbali/veicolo/veicolo.ui.js',
  './js/verbali/affidamento/affidamento.generator.js',
  './js/verbali/affidamento/affidamento.ui.js',
  './js/verbali/notifica/notifica.generator.js',
  './js/verbali/notifica/notifica.ui.js',
  './js/verbali/fermoseq/fermoseq.generator.js',
  './js/verbali/fermoseq/fermoseq.ui.js',
  './js/verbali/seqveicolo/seqveicolo.generator.js',
  './js/verbali/seqveicolo/seqveicolo.ui.js',
  './js/verbali/rimozione/rimozione.generator.js',
  './js/verbali/rimozione/rimozione.ui.js',
  './js/verbali/patente223/patente223.generator.js',
  './js/verbali/patente223/patente223.ui.js',
  './js/verbali/patente223/patente223.trasmissione.js',
  './js/verbali/patenteill/patenteill.generator.js',
  './js/verbali/patenteill/patenteill.ui.js',
  './js/verbali/prelievo/prelievo.generator.js',
  './js/verbali/prelievo/prelievo.ui.js',
  './js/verbali/tulps15/tulps15.generator.js',
  './js/verbali/tulps15/tulps15.ui.js',
  './js/verbali/invito650/invito650.generator.js',
  './js/verbali/invito650/invito650.ui.js',
  './js/verbali/cadavere/cadavere.generator.js',
  './js/verbali/cadavere/cadavere.ui.js',
  './js/verbali/etichetta/etichetta.generator.js',
  './js/verbali/etichetta/etichetta.ui.js'
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