const CACHE_NAME = 'sistema-esqueletico-v1';
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icon-1.png',
  './icon-2.png',
  './icon-3.png',
  './icon-4.png',
  './icon-5.png',
  './icon-6.png',
  './icon-7.png',
  './icon-8.png',
  './icon-9.png',
  './icon-10.png',
  './icon-11.png',
  './icon-12.png',
  './icon-13.png',
  './icon-14.png',
  './icon-15.png',
  './icon-16.png',
  './icon-17.png',
  './icon-18.png',
  './icon-19.png',
  './icon-20.png',
  './icon-21.png',
  './icon-22.png',
  './icon-23.png',
  './icon-24.png',
  './icon-25.png',
  './icon-26.png',
  './icon-27.png',
  './icon-28.png',
  './icon-29.png',
  './icon-30.png',
  './icon-31.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignora extensões internas / sdk / chrome-extension / cdn externos
  if (
    url.pathname.startsWith('/_sdk/') ||
    url.protocol.startsWith('chrome-extension') ||
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    return;
  }

  // Estratégia: cache first para arquivos locais
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(networkResponse => {
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === 'basic'
            ) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            if (request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
    );
  }
});
