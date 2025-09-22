// Define the cache name and the files to be cached.
const CACHE_NAME = 'pptx-viewer-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://unpkg.com/@phosphor-icons/web',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/pptx2html@0.1.6/dist/pptx2html.min.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Installation event: fires when the service worker is first installed.
self.addEventListener('install', event => {
    // Perform install steps: caching the app shell.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Fetch event: fires for every network request.
self.addEventListener('fetch', event => {
    event.respondWith(
        // Try to find a matching response in the cache first.
        caches.match(event.request)
            .then(response => {
                // If a cached response is found, return it.
                if (response) {
                    return response;
                }
                // Otherwise, fetch the request from the network.
                return fetch(event.request);
            })
    );
});

// Activation event: fires when the service worker becomes active.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches that are not in the whitelist.
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
