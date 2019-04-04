const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/search',
    '/js/client-min.js',
    '/css/style-min.css'
];

sw is registered once the page is loaded
self.addEventListener('install', function (event) {
    perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});
