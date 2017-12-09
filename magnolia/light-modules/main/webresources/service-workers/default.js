/**
 * ┌────────────────────────┐
 * │                        │
 * │     Fallback Image     │
 * │                        │
 * └────────────────────────┘
 */
const fallbackCacheName = "fallback-cache-v1";
const fallbackImagesMap = new Map();

fallbackImagesMap.set("error", "/sw-assets/error-connection-failure.svg");

/**
 * Get a fallback image if offline or request error
 * @param {FetchEvent} fetchEvent
 * @returns {Promise<*>}
 */
async function fetchImageOrFallback(fetchEvent) {
    try {
        const response = await fetch(fetchEvent.request);

        if (!response.ok) { throw new Error(); }

        return response;
    }
    catch (_error) {
        return caches.match(fallbackImagesMap.get("error"), {cacheName: fallbackCacheName});
    }
}

/**
 * Pre-cache fallback images
 * @returns {Promise<any>}
 */
function installFallbackImages() {
    return new Promise( async (resolve, reject) => {
        try {
            const fallbackCache = await caches.open(fallbackCacheName);

            for (const fallbackImage of fallbackImagesMap.values()) {
                const fallbackMatch = await caches.match(fallbackImage, {cacheName: fallbackCacheName});

                if (fallbackMatch == undefined) {
                    await fallbackCache.add(fallbackImage);
                }
            }

            resolve(true);
        }
        catch (error) { reject(error); }
    });
}

/**
 * ┌───────────────────┐
 * │                   │
 * │     App Cache     │
 * │                   │
 * └───────────────────┘
 */
const appCache = "app-cache-v1";

/**
 * ┌────────────────────────┐
 * │                        │
 * │     SERVICE WORKER     │
 * │                        │
 * └────────────────────────┘
 */
// Pre-cache
self.addEventListener("install", event => {
    event.waitUntil(Promise.all([
        installFallbackImages(),
    ]));
});

// Clear all unused caches
self.addEventListener("activate", event => {
    event.waitUntil(async function() {
        const cacheNames = await caches.keys();

        return Promise.all(
            cacheNames
                .filter(cacheName => cacheName !== fallbackCacheName && cacheName !== appCache)
                .map(cacheName => caches.delete(cacheName))
        );
    }());
});

self.addEventListener("fetch", event => {
    const acceptHeader = event.request.headers.get("accept");

    if (acceptHeader.indexOf("image/*") >= 0) {
        event.respondWith(fetchImageOrFallback(event));
    }
});

