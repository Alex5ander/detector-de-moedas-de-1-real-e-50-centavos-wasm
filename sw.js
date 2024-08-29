var CACHE_NAME = "application_cache";
self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        "./",
        "./index.html",
        "./images/icons/icon-72x72.png",
        "./images/icons/icon-96x96.png",
        "./images/icons/icon-128x128.png",
        "./images/icons/icon-144x144.png",
        "./images/icons/icon-152x152.png",
        "./images/icons/icon-192x192.png",
        "./images/icons/icon-512x512.png",
        "./run-impulse.js",
        "./manifest.json",
        "./edge-impulse-standalone.wasm",
        "./edge-impulse-standalone.js"
      ]);
    })()
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys
        .filter(key => key != CACHE_NAME)
        .map(key => caches.delete(key)));
    })
  );
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(cache => {
      return cache || fetch(e.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request.url, response.clone());
          return response;
        })
      })
    })
  );
});
