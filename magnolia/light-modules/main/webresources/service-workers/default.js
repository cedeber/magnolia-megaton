/**
 *
 * @param {string} cacheName
 * @param {Map<string, string>} urlMap
 * @returns {Promise<true|Error>}
 */
function preCache(cacheName, urlMap) {
    return new Promise( async (resolve, reject) => {
        try {
            const cache = await caches.open(cacheName);

            for (const url of urlMap.values()) {
                const match = await caches.match(url, {cacheName: cacheName});

                if (match == undefined) {
                    try {
                        const response = await fetch(url);

                        if (response.ok) {
                            await cache.put(url, response);
                        }
                    }
                    catch(_error) { /* unused */ }
                }
            }

            resolve(true);
        }
        catch (error) { reject(error); }
    });
}

/**
 *
 * @param {FetchEvent} fetchEvent
 * @param {IterableIterator|Array} fallbacks
 * @param {string} cacheName
 * @returns {Promise<Response>|undefined}
 */
async function fetchOrFallback(fetchEvent, fallbacks, cacheName) {
    try {
        const response = await fetch(fetchEvent.request);

        if (!response.ok) { throw new Error(); }

        return response;
    }
    catch (_error) {
        for (const fallback of fallbacks) {
            console.log(fallback);
            const match = cacheName ? await caches.match(fallback, { cacheName }) : await caches.match(fallback);

            if (match) { return match; }
        }
    }
}


/*
 * ┌────────────────────────┐
 * │                        │
 * │     Fallback Image     │
 * │                        │
 * └────────────────────────┘
 */
const fallbackCacheName = "fallback-cache-v1";
const fallbackImagesMap = new Map();

fallbackImagesMap.set("error", "/sw-assets/error-connection-failure.svg");


/*
 * ┌─────────────────────┐
 * │                     │
 * │     Application     │
 * │                     │
 * └─────────────────────┘
 */
const appCacheName = "app-cache-v1";
const pageCacheMap = new Map();

pageCacheMap.set("contact", "/contact.html");
pageCacheMap.set("home", "/home.html");


/*
 * ┌────────────────────────┐
 * │                        │
 * │     SERVICE WORKER     │
 * │                        │
 * └────────────────────────┘
 */
// Pre-cache
self.addEventListener("install", event => {
    event.waitUntil(Promise.all([
        preCache(fallbackCacheName, fallbackImagesMap),
        preCache(appCacheName, pageCacheMap),
    ]));
});

// Clear all unused caches
self.addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(
        cacheNames => cacheNames
            .filter(cacheName => cacheName !== fallbackCacheName && cacheName !== appCacheName)
            .map(cacheName => caches.delete(cacheName))
    ));
});

self.addEventListener("fetch", event => {
    const acceptHeader = event.request.headers.get("accept");
    const url = new URL(event.request.url);

    // images
    if (acceptHeader.indexOf("image/*") >= 0) {
        event.respondWith(fetchOrFallback(event, [fallbackImagesMap.get("error")], fallbackCacheName));
    }
    // web pages
    else if (acceptHeader.indexOf("text/html") >= 0) {
        event.respondWith(fetchOrFallback(event, pageCacheMap.values(), appCacheName));
    }
});

