var CACHE_NAME = "application_cache";
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).
      then(function (cache) {
        console.log("install")
        return cache.addAll([
          "/",
          "images/icons/icon-72x72.png",
          "images/icons/icon-96x96.png",
          "images/icons/icon-128x128.png",
          "images/icons/icon-144x144.png",
          "images/icons/icon-152x152.png",
          "images/icons/icon-192x192.png",
          "images/icons/icon-384x384.png",
          "images/icons/icon-512x512.png",
          "index.html",
          "run-impulse.js",
          "manifest.json",
          "edge-impulse-standalone.wasm",
          "edge-impulse-standalone.js"
        ]);
      }));
});
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).
      then(function (response) {
        console.log("fetch");
        console.log(response);
        if (response) {
          return response;
        }
        return fetch(event.request);
      }));
});