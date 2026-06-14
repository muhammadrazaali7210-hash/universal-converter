const CACHE_NAME = 'ar-converter-v1';
// Add the exact names of your existing layout files below
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'app.js',
  'icon.png'
];

// 1. Download phase - Fires immediately when user views the app with internet
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch phase - Forces the phone to load files from storage when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
