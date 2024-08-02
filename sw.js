var CACHE_NAME = "calculadoraclassica";
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).
      then(function (cache) {
        console.log("install 2")
        return cache.addAll([
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