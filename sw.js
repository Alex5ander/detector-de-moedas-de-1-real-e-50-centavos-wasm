var DB_NAME = "application_cache_db";
var DB_VERSION = 1;
var STORE_NAME = "resources";

self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const db = await openDatabase();
      const urlsToCache = [
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
      ];

      for (const url of urlsToCache) {
        const response = await fetch(url);
        await storeInDatabase(db, url, response);
      }
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const db = await openDatabase();
      const cachedResponse = await getFromDatabase(db, e.request.url);
      if (cachedResponse) {
        console.log(`[Service Worker] Serving from IndexedDB: ${e.request.url}`);
        return new Response(cachedResponse.body, {
          headers: cachedResponse.headers
        });
      }

      const response = await fetch(e.request);
      await storeInDatabase(db, e.request.url, response.clone());
      return response;
    })()
  );
});

// Abre uma conexão com o IndexedDB
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: 'url' });
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Armazena uma resposta no IndexedDB
async function storeInDatabase(db, url, response) {
  const data = {
    url: url,
    body: await response.blob(),
    headers: [...response.headers]
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Recupera uma resposta do IndexedDB
async function getFromDatabase(db, url) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(url);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
