const currentCache = "cache-v1";

self.addEventListener("install", event => {
    (event as any).waitUntil(async function() {
        const cache = await caches.open(currentCache);
        await cache.addAll([
            // all files to cache
        ]);
    }());
});

self.addEventListener("activate", event => {
    (event as any).waitUntil(async function() {
        const cacheNames = await caches.keys();
        Promise.all(
            cacheNames
                .filter(cacheName => cacheName !== currentCache)
                .map(cacheName => caches.delete(cacheName))
        );
    }());
});

self.addEventListener("fetch", () => console.log("fetch") );

