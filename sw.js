var CACHE_NAME = "application_cache";
self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        "/",
        "/images/icons/icon-72x72.png",
        "/images/icons/icon-96x96.png",
        "/images/icons/icon-128x128.png",
        "/images/icons/icon-144x144.png",
        "/images/icons/icon-152x152.png",
        "/images/icons/icon-192x192.png",
        "/images/icons/icon-384x384.png",
        "/images/icons/icon-512x512.png",
        "/index.html",
        "/run-impulse.js",
        "/manifest.json",
        "/edge-impulse-standalone.wasm",
        "/edge-impulse-standalone.js"
      ]);
    })()
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(CACHE_NAME);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })(),
  );
});