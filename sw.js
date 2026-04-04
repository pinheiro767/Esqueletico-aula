const CACHE_NAME = "sistema-esqueletico-pwa-v3";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./icon.svg",
  "./icon-1.png",
  "./icon-2.png",
  "./icon-3.png",
  "./icon-4.png",
  "./icon-5.png",
  "./icon-6.png",
  "./icon-7.png",
  "./icon-8.png",
  "./icon-9.png",
  "./icon-10.png",
  "./icon-11.png",
  "./icon-12.png",
  "./icon-13.png",
  "./icon-14.png",
  "./icon-15.png",
  "./icon-16.png",
  "./icon-17.png",
  "./icon-18.png",
  "./icon-19.png",
  "./icon-20.png",
  "./icon-21.png",
  "./icon-22.png",
  "./icon-23.png",
  "./icon-24.png",
  "./icon-25.png",
  "./icon-26.png",
  "./icon-27.png",
  "./icon-28.png",
  "./icon-29.png",
  "./icon-30.png",
  "./icon-31.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_FILES.map(url => new Request(url, { cache: "reload" })))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
