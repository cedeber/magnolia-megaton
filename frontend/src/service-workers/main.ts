const currentCache = "cache-v1";

const fallbackImageUrl = "/.resources/main/webresources/errors/error-connection-failure.svg";

async function fetchImageOrFallback(fetchEvent) {
    try {
        const response = await fetch(fetchEvent.request);

        if (!response.ok) { throw new Error(); }

        return response;
    }
    catch {
        return caches.match(fallbackImageUrl, {cacheName: currentCache});
    }
}

self.addEventListener("install", event => {
    event.waitUntil(async function() {
        const cache = await caches.open(currentCache);
        await cache.addAll([
            // all files to cache
            fallbackImageUrl,
        ]);
    }());
});

self.addEventListener("activate", event => {
    event.waitUntil(async function() {
        const cacheNames = await caches.keys();

        Promise.all(
            cacheNames
                .filter(cacheName => cacheName !== currentCache)
                .map(cacheName => caches.delete(cacheName))
        );
    }());
});

self.addEventListener("fetch", event => {
    const acceptHeader = event.request.headers.get("accept");

    console.log(event.request.url, acceptHeader);

    if (acceptHeader.indexOf("image/*") >= 0) {
        event.respondWith(fetchImageOrFallback(event));
    }
});

